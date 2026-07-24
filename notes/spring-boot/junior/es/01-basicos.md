# Spring Boot — Fundamentos

> 📖 [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start)
> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

---

[00-introduccion-spring-boot.md](./00-introduccion-spring-boot.md) te dio el mapa: Spring Boot es Spring con las tres tareas de montaje eliminadas — cablear beans a mano, instalar un contenedor de servlets y desplegar un `.war` dentro de él. También prometió que el *mecanismo* detrás de esa eliminación — el classpath, `@ConditionalOnClass`, los starters, el fat jar — se trazaría aquí. Ese es el trabajo de este archivo. Lo terminas con un proyecto que arranca, una base de datos con la que puede hablar, y la capacidad de responder *cómo* se configura Spring Boot en lugar de solo afirmar que lo hace.

---

## Por qué existe Spring Boot

Docs: https://www.baeldung.com/spring-vs-spring-boot → leer: la sección "Spring Boot" (la tabla comparativa del final es la respuesta de entrevista en una sola pantalla)

Antes de entrar en Spring Boot, tres términos que verás constantemente:

- **Tomcat** — un servidor web. Es un programa que escucha en un puerto de red (como el 8080) y recibe peticiones HTTP de navegadores o clientes. Sin un servidor web, tu código Java no tiene forma de aceptar conexiones HTTP. Antes de Spring Boot, tenías que descargar Tomcat por separado, instalarlo, configurarlo y desplegar tu app en él.
- **`.jar`** — una aplicación Java empaquetada. Es básicamente un archivo zip que contiene todo tu código compilado y puede ejecutarse directamente con `java -jar app.jar`. Cuando construyes un proyecto Spring Boot, Maven produce un único `.jar` que contiene tu código y todo lo que necesita (incluido Tomcat).
- **Bean** — un objeto que Spring crea, posee y entrega a quien lo necesite, en lugar de que tú escribas `new UserService()`. Esa es la idea de IoC de [00-introduccion-spring-boot.md](./00-introduccion-spring-boot.md#el-contenedor-ioc--la-única-idea-de-la-que-depende-todo-lo-demás), y el mecanismo completo (scopes, inyección, `@Bean`) vive en [03-inyeccion-dependencias.md](./03-inyeccion-dependencias.md) — para este archivo, "bean" simplemente significa *un objeto que el framework construyó por ti*.
- **Jackson** — la librería que Spring Boot usa para convertir entre objetos Java y JSON. Cuando un controlador devuelve un objeto Java, Jackson lo convierte en el JSON que recibe el cliente; cuando llega un request con un body JSON, Jackson lo convierte de vuelta en un objeto Java. Funciona automáticamente — lee tus getters públicos (o los que genera Lombok) para decidir qué campos incluir. Nunca lo llamas directamente; Spring Boot lo conecta solo. Lo ves funcionando de principio a fin en [02-controladores-rest.md](./02-controladores-rest.md).

---

El Spring básico requiere mucha configuración manual y un servidor instalado por separado. Spring Boot se creó para eliminar esa fricción. Lo hace con dos ideas fundamentales:

1. **Auto-configuración** — Spring Boot lee tus dependencias y configura beans automáticamente. Añade `spring-boot-starter-data-jpa` al pom.xml y Spring Boot configura la conexión a la base de datos, el EntityManager y el soporte de transacciones sin ningún código extra.
2. **Servidor embebido** — Spring Boot incluye Tomcat dentro del `.jar`. Ejecutas `java -jar app.jar` y el servidor arranca. Sin instalación de servidor por separado.

El patrón que se repite: **las anotaciones reemplazan la configuración**. Antes de Spring Boot, escribías XML para conectar beans. Ahora, anotas una clase con `@Service` y Spring Boot se encarga de crear y conectar los objetos por ti.

---

## Cómo funciona Spring Boot por dentro — por qué un starter "simplemente funciona"

Las dos ideas de arriba (la auto-configuración y el servidor embebido) son el titular. Pero en una entrevista "se configura solo" no es una respuesta — la repregunta es siempre *¿cómo?*. Esta sección traza los tres mecanismos que hay debajo, porque son exactamente las preguntas con las que un entrevistador distingue a quien *añadió* dependencias de quien *entiende* el build: "¿cómo sabe Spring Boot cómo configurar tu `DataSource`?", "¿qué trae realmente `spring-boot-starter-web`?" y "¿cómo sirve HTTP tu app sin un Tomcat instalado?".

Docs: https://www.baeldung.com/spring-boot-autoconfiguration → leer: "Understanding Auto-Configuration" y el ejemplo de `@Conditional`

### El classpath — la palabra de la que dependen los tres mecanismos

Todo lo que viene después se apoya en una sola idea, así que fíjala primero. El **classpath** es la lista completa de clases compiladas que tu app puede ver en tiempo de ejecución: tu propio código más cada `.jar` que Maven descargó a partir de las dependencias del `pom.xml`. Cuando añades `spring-boot-starter-data-jpa` y recargas Maven, los jars de Hibernate y JDBC caen en el classpath — es decir, clases como `org.hibernate.SessionFactory` ahora están *presentes y son cargables*. Cuando quitas la dependencia, desaparecen. Toda la "magia" de Spring Boot no es más que **mirar qué hay en el classpath y reaccionar a ello**.

> Piensa en el classpath como el conjunto de herramientas dispuestas sobre el banco de trabajo. Spring Boot pasa junto al banco al arrancar y, por cada herramienta que ve, monta el puesto de trabajo que la usa. Si la herramienta no está en el banco → ese puesto no se monta nunca. Nada se adivina; todo es una reacción a lo que está físicamente ahí.

### 1. Auto-configuración — el mecanismo, no la magia

`@SpringBootApplication` incluye `@EnableAutoConfiguration` (ver la tabla de anotaciones más abajo). Al arrancar, esa anotación hace que Spring Boot cargue una larga lista de clases de configuración ya escritas que vienen dentro de los jars de Spring Boot — una por tecnología (`DataSourceAutoConfiguration`, `JpaRepositoriesAutoConfiguration`, `WebMvcAutoConfiguration`, y decenas más). Cada una es una clase `@Configuration` llena de métodos `@Bean` que saben cómo montar esa tecnología.

El truco está en que **ninguna se ejecuta de forma incondicional**. Cada clase de auto-configuración está protegida por anotaciones `@Conditional` que Spring evalúa contra tu classpath y tus beans existentes antes de decidir si la activa. Las dos que debes saber nombrar:

- **`@ConditionalOnClass(DataSource.class)`** — "ejecuta esta configuración solo si esta clase está en el classpath". `DataSourceAutoConfiguration` lleva esta anotación, así que se activa *solo* cuando hay presente una clase de JDBC/datasource — lo cual ocurre en el momento en que `spring-boot-starter-data-jpa` la pone ahí. Sin el starter de JPA → la clase no está → toda la configuración del datasource se salta. Por eso añadir un starter "simplemente funciona": el starter deja las clases en el classpath, y la auto-configuración correspondiente se despierta sola.
- **`@ConditionalOnMissingBean`** — "crea este bean solo si el desarrollador no ha definido ya uno del mismo tipo". Los beans de Spring Boot son todos **valores por defecto que se apartan**. Si nunca defines un `DataSource`, se usa el que auto-configura Spring Boot; en el momento en que declaras tu propio `@Bean DataSource`, `@ConditionalOnMissingBean` lo detecta y Spring Boot se retira en silencio. Sobrescribes *definiendo*, nunca editando la configuración del framework.

Si sigues paso a paso la pregunta real que hace un entrevistador — *"¿cómo sabe Spring Boot cómo configurar tu `DataSource`?"*:

```
1. spring-boot-starter-data-jpa en el pom.xml
        → pone los jars de Hibernate + JDBC en el CLASSPATH
2. @EnableAutoConfiguration carga DataSourceAutoConfiguration
        → está protegida por @ConditionalOnClass(DataSource.class)
3. DataSource.class SÍ está en el classpath  → la condición pasa → la config se activa
4. @ConditionalOnMissingBean → tú no definiste ningún DataSource
        → Spring Boot crea el de por defecto, leyendo spring.datasource.* de application.properties
5. Existe un bean DataSource listo — tú escribiste cero configuración
```

Esa es la respuesta completa, y es mucho más sólida que "es automático". Las líneas `spring.datasource.url`/`username`/`password` que pones en [application.properties](#applicationproperties--configuración-central) son los valores que lee este bean auto-configurado — las properties y la auto-configuración son las dos mitades del mismo mecanismo.

> **Por qué esto es mejor que el XML.** En el Spring clásico escribías a mano un bloque `<bean id="dataSource" ...>` por cada pieza de infraestructura. La auto-configuración le da la vuelta: el framework asume el montaje *convencional* y solo te pide los valores que son genuinamente propios del proyecto (la URL, las credenciales). "Convención sobre configuración" es el nombre de esta idea — configuras las excepciones, no los valores por defecto.

### 2. Starters — paquetes curados y alineados en versiones

Un **starter** no es código. Es un jar (casi) vacío cuyo único trabajo es declarar una lista curada de *otras* dependencias con versiones ya probadas para funcionar juntas. `spring-boot-starter-webmvc` prácticamente no contiene clases propias — ábrelo y es en esencia un `pom.xml` que trae Spring MVC, la librería de JSON Jackson y el Tomcat embebido, todo en versiones compatibles. Una línea en tu `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
</dependency>
```

arrastra toda una capa de librerías. Eso es lo que significa "starter" — un *punto de partida* para una capacidad, empaquetado para que no lo montes dependencia a dependencia.

> **Cuidado con el nombre: es `spring-boot-starter-webmvc`, no `spring-boot-starter-web`.** Todos los tutoriales, respuestas de StackOverflow y artículos de Baeldung escritos antes de Spring Boot 4 dicen `spring-boot-starter-web` — ese fue el nombre del artifact durante una década. Spring Boot 4 (la versión que usa TimeTrack, 4.0.6) lo renombró a `spring-boot-starter-webmvc`, porque Spring MVC ahora es solo *uno* de los stacks web que ofrece Boot (WebFlux es el otro), y el nombre genérico antiguo ya no decía cuál estabas pidiendo. Si copias un bloque `<dependency>` de un artículo antiguo, obtendrás un artifact que Maven no puede resolver. Lee `spring-boot-starter-web` en cualquier texto anterior a 2026 como "lo que ahora es `-webmvc`".

Los starters que usas en TimeTrack — esta tabla se lee directamente del `backend/timetrack/pom.xml`:

| Starter (artifactId exacto en el pom) | Trae (la capa que arranca) |
| --- | --- |
| `spring-boot-starter-webmvc` | Spring MVC, `@RestController`/`@GetMapping`, Jackson (JSON), **Tomcat embebido** |
| `spring-boot-starter-data-jpa` | Spring Data JPA, Hibernate, la fontanería de JDBC/transacciones |
| `spring-boot-starter-security` | Spring Security — la cadena de filtros, `BCryptPasswordEncoder`, `@PreAuthorize` a nivel de método |
| `spring-boot-starter-validation` | Bean Validation (`@NotBlank`, `@Email`) más su implementación Hibernate Validator |
| `spring-boot-starter-webmvc-test` | Soporte de tests para la capa web — JUnit 5, Mockito, AssertJ, `MockMvc` (`<scope>test</scope>`) |
| `spring-boot-starter-data-jpa-test` | Soporte de tests para la capa de persistencia — `@DataJpaTest` y su slice (`<scope>test</scope>`) |

Lee la tabla así: *una línea de la columna izquierda* es todo lo que escribes; *toda la columna derecha* es lo que llega al classpath — lo que a su vez dispara la auto-configuración de la sección 1. Starters y auto-configuración van en pareja: **el starter pone las clases en el classpath; la auto-configuración reacciona a ellas.** Las dos filas de `test` son la excepción a "un starter = una capacidad en tiempo de ejecución": no añaden nada a la app en ejecución (`<scope>test</scope>` las mantiene fuera del jar final) y existen solo para que tus tests compilen y se ejecuten.

> **El único `spring-boot-starter-test` también es un nombre de Boot 3.** Los proyectos antiguos tienen exactamente un starter de test que lo empaquetaba todo. Boot 4 lo dividió por slice — tomas `-webmvc-test` para tests de controladores y `-data-jpa-test` para tests de repositorios, por eso el pom de TimeTrack tiene dos starters con scope `test` en lugar de uno. Las mismas herramientas por debajo (JUnit 5, Mockito, AssertJ); simplemente ahora llegan en dos paquetes. Los usas de verdad en [09-testing.md](./09-testing.md).

> **JJWT es el elemento diferente en el pom.** Las tres dependencias `io.jsonwebtoken` (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) *no* son starters de Spring — son una librería de terceros, así que nadie ha acordado de antemano su versión por ti. Por eso son los únicos bloques en `pom.xml` que llevan una etiqueta `<version>0.12.6</version>` explícita: no están en el BOM de `spring-boot-starter-parent`, así que el parent no tiene opinión sobre ellos y debes indicar tú mismo la versión. Ver [06-seguridad-jwt.md](./06-seguridad-jwt.md).

> **¿Por qué no añadir Spring MVC, Jackson, Tomcat y validación uno a uno tú mismo?** Podrías — pero entonces *tú* cargas con el trabajo de elegir versiones que no choquen, y una versión de Jackson que discrepa sin avisar con tu versión de Spring MVC es una tarde miserable. El starter es un contrato de versiones: alguien ya probó este conjunto exacto junto. Combinado con `spring-boot-starter-parent` (el `<parent>` del `pom.xml`, que contiene un BOM — un Bill of Materials con la lista de versiones probadas), es la razón por la que tus bloques `<dependency>` de librerías de Spring no llevan **ninguna etiqueta `<version>`**. El parent decide la versión; el starter decide el conjunto.

### 3. El servidor embebido — cómo `java -jar` sirve HTTP sin nada instalado

El despliegue web clásico de Java era: instalar Tomcat como un programa aparte en el servidor, construir tu app en un fichero `.war` y soltar el war en la carpeta `webapps/` de Tomcat. El servidor era el contenedor; tu app era el invitado que vivía dentro de él.

Spring Boot invierte esa relación. `spring-boot-starter-webmvc` pone las clases de Tomcat **en el classpath como una librería más**, y la auto-configuración (sección 1) las ve y arranca una instancia de Tomcat embebida desde *dentro* de tu aplicación durante `SpringApplication.run(...)`. Ahora el servidor es el invitado y tu app es el anfitrión. Como Tomcat no es más que unas clases más en el mismo jar, el build produce un único **fat jar** autocontenido (también llamado "uber jar") — tu código compilado, cada dependencia y Tomcat, todo comprimido en un solo fichero. Así que:

```
java -jar timetrack.jar
        → se ejecuta main() → SpringApplication.run(...)
        → la auto-config ve Tomcat en el classpath
        → arranca un Tomcat embebido, escuchando en el puerto 8080
        → tus endpoints @RestController ya están sirviendo HTTP
```

Sin Tomcat instalado en la máquina, sin war, sin carpeta `webapps/` — el único requisito en el servidor es un runtime de Java. Esta es la diferencia más nítida entre **Spring Boot y el Spring clásico** que un entrevistador sondea con "¿cómo sirve HTTP tu app sin un Tomcat instalado?". La respuesta: el servidor va embebido dentro del fat jar, arrancado programáticamente al inicio.

> **Por eso el Dockerfile es tan corto.** Como el jar ya contiene el servidor, contenerizar la app es solo "pon un runtime de Java en la imagen, copia el jar dentro, ejecuta `java -jar`" — sin una imagen base con un servidor de aplicaciones preinstalado. Verás exactamente ese patrón `FROM eclipse-temurin` + `java -jar` cuando el proyecto llegue al paso de Docker.

> **Puedes cambiar el servidor, y eso demuestra la idea.** Excluye Tomcat de `spring-boot-starter-webmvc` y añade `spring-boot-starter-jetty`, y la app corre sobre Jetty en su lugar — no cambiaste nada salvo el classpath, y la auto-configuración arrancó un servidor distinto. El contenedor es una dependencia, no una parte fija de la plataforma.

---

## Spring Initializr — iniciar un proyecto

Docs: https://www.baeldung.com/spring-boot-start → leer: la sección sobre generar el proyecto con Spring Initializr y qué termina en el `pom.xml` generado

[start.spring.io](https://start.spring.io) genera un proyecto Spring Boot listo para ejecutar con el `pom.xml` correcto y la estructura de carpetas. Seleccionas las dependencias que necesitas y descargas un zip.

Todo proyecto Spring Boot empieza de la misma manera. Las únicas cosas que cambian son el nombre del artifact y las dependencias.

### Qué significa cada campo

| Campo | Qué es | ¿Siempre igual? |
| --- | --- | --- |
| **Project: Maven** | Build tool — descarga librerías, compila y empaqueta tu código. Gradle hace el mismo trabajo pero Maven es más común en empresas españolas. | Sí, siempre Maven |
| **Language: Java** | El lenguaje de programación. Kotlin y Groovy también corren en la JVM pero la empresa española usa Java. | Sí, siempre Java |
| **Spring Boot version** | Elige la última versión estable — la que está en verde sin etiqueta SNAPSHOT ni RC. SNAPSHOT = sin terminar. RC = casi lista pero aún en pruebas. | Siempre la última estable |
| **Group** | Un namespace que identifica quién es el propietario del proyecto. Sigue la convención de dominio invertido: `capgemini.com` → `com.capgemini`. Para proyectos personales: `com.victor`. | Tu dominio invertido |
| **Artifact** | El nombre del proyecto. Se convierte en el nombre del archivo `.jar` final. Corto, en minúscula, sin espacios. | Cambia por proyecto |
| **Package name** | Generado automáticamente de Group + Artifact. El paquete Java raíz — toda clase vive dentro de él. Nunca lo cambies manualmente. | Auto-generado |
| **Packaging: Jar** | El formato del archivo de salida. Jar = autocontenido, incluye el servidor web dentro. War = formato antiguo, requiere un servidor externo. Siempre Jar. | Sí, siempre Jar |
| **Configuration: Properties** | Formato del archivo de config. Properties = `clave=valor` (más simple). YAML = formato indentado (más legible pero se rompe con mala indentación). | Properties es más seguro |
| **Java** | La versión de Java instalada en tu máquina. Debe coincidir con lo que tienes. Ejecuta `java -version` en el terminal para comprobarlo. | Coincidir con tu instalación |

Lee primero la tercera columna — es la que te ahorra tiempo. "Sí, siempre" significa que el campo es un **ritual**: lo estableces una vez de la misma forma en cada proyecto que vayas a empezar, así que deja de pensarlo. Solo las filas que no dicen "sí" son decisiones reales, y solo hay tres: el **Artifact** (el nombre del proyecto), el **Group** (quién es el dueño) y la versión de **Java** (la que realmente tengas instalada en tu máquina — un desajuste aquí es el clásico "el proyecto no compila nada más abrirlo").

### Configuración usada para el proyecto 07 (TimeTrack)

| Campo | Valor |
| --- | --- |
| Project | Maven |
| Language | Java |
| Spring Boot | 4.0.6 (última estable, mayo 2026) |
| Group | com.victor |
| Artifact | timetrack |
| Packaging | Jar |
| Java | 25 |

### Dependencias para un proyecto Spring Boot completo

Estas son todas las dependencias que necesita un proyecto Spring Boot completo. Algunas pueden seleccionarse en Spring Initializr al configurarlo; otras (marcadas con \*) deben añadirse manualmente al `pom.xml` más adelante porque no están en Spring Initializr.

| Dependencia | Qué te da |
| --- | --- |
| **Spring Web** (la etiqueta de Initializr; el artifact que añade es `spring-boot-starter-webmvc` en Boot 4) | El servidor HTTP embebido (Tomcat) y las anotaciones para construir endpoints REST (`@RestController`, `@GetMapping`, etc.) |
| **Spring Data JPA** | Herramientas para hablar con la base de datos sin escribir SQL a mano. Defines clases Java y Spring genera las queries. |
| **PostgreSQL Driver** | El conector entre Java y PostgreSQL. Sin esto, Spring no puede abrir una conexión a la base de datos. |
| **Spring Security** | Autenticación y autorización. Bloquea todos los endpoints por defecto hasta que configuras qué rutas son públicas. |
| **Validation** (este es el nombre exacto que hay que buscar en Initializr — artifact `spring-boot-starter-validation`) | Anotaciones de Bean Validation (`@NotBlank`, `@NotNull`, `@Email`, `@Min`) para validar los request bodies. |
| **Lombok** | Generación de código en tiempo de compilación — elimina el boilerplate de getters, setters y constructores de las clases entity. |
| **Test starters** (no es un checkbox — Initializr siempre los añade automáticamente) | JUnit 5 + Mockito + AssertJ. En Boot 4 llegan como dos starters con scope `test` (`spring-boot-starter-webmvc-test`, `spring-boot-starter-data-jpa-test`), emparejados con las dependencias que marcaste. Ya están en el `pom.xml` generado; nunca los añades a mano. |
| **JJWT\*** (manual) | Librería JWT para crear y validar tokens. Debe añadirse manualmente desde mvnrepository.com (tres artifacts). |

Lee esta tabla como *una fila = una capacidad que la app gana*, no como "una librería que hay que estudiar". Marcar **Spring Web** no significa que ahora tengas que estudiar Tomcat; significa que los endpoints HTTP se vuelven posibles. Las notas entre paréntesis importan más de lo que parece: el `\*` de **JJWT** es la única fila que Initializr no puede darte (la pegas en `pom.xml` a mano — ver la siguiente sección), **Validation** es el string exacto que hay que escribir en el buscador porque "Bean Validation" no encuentra nada, y la fila de **Test starters** está en la lista solo para que no vayas buscando un checkbox que no existe. Compárala con la tabla de starters de arriba: cada fila de aquí es la *etiqueta* de Initializr, y lo que realmente deja en el classpath es el jar del starter.

---

## Añadir dependencias después de crear el proyecto

Docs: https://www.baeldung.com/maven → leer: "Dependency Management" (de qué está hecho un bloque `<dependency>`: groupId, artifactId, version)

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

Comprueba que el jar existe en la caché local de Maven. Maven almacena cada librería descargada en `C:\Users\Victor\.m2\repository\`, organizadas por group y artifact — sí, esta es exactamente la carpeta donde mirar:

Ejemplo para Spring Security:

```
C:\Users\Victor\.m2\repository\org\springframework\boot\spring-boot-starter-security\4.0.6\
```

Si la carpeta no existe, Maven nunca lo descargó. Recarga Maven y vuelve a intentarlo.

---

### Lombok — eliminar código boilerplate

Propósito: un generador de código en tiempo de compilación que pones en entidades, DTOs y clases service para nunca escribir a mano getters, setters, constructores, `equals()`, `hashCode()` o `toString()` — la anotación se expande en métodos Java reales antes de que corra el compilador.

Archivo: `backend/timetrack/pom.xml` (la dependencia + los dos plugins de abajo); las anotaciones en sí viven en las entidades, p.ej. `src/main/java/com/victor/timetrack/model/User.java`

Docs: https://www.baeldung.com/intro-to-project-lombok → leer: "@Data", "@NoArgsConstructor / @AllArgsConstructor" y la configuración del annotation processor

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

Las tres anotaciones de Lombok que más usarás: **`@Data`** (getters, setters, `equals()`, `hashCode()`, `toString()`), **`@NoArgsConstructor`** (el constructor vacío que JPA necesita para construir una entidad desde una fila de base de datos), y **`@AllArgsConstructor`** (un constructor con todos los campos). Las pones en entidades y DTOs — ve un ejemplo en una entidad real en [04-spring-data-jpa.md](./04-spring-data-jpa.md) y [layer-reference.md](../.../../../layer-reference.md). Las entidades, repositorios y DTOs están documentados ahí; este archivo se queda centrado en el montaje del proyecto y la configuración.

> **El getter de un campo `boolean` no se llama `getXxx()` — se llama `isXxx()`.** Lombok sigue aquí la convención estándar de JavaBeans (la misma que usan Jackson y casi todas las librerías Java): para un campo `boolean` **primitivo** (minúscula), el getter generado es `isActive()`, no `getActive()`. Esto **solo** aplica al primitivo `boolean` — si el campo fuera `Boolean` con mayúscula (la clase wrapper, un objeto igual que `String` o `Long`), Lombok sí genera `getActive()`, como con cualquier otro campo. Es fácil confundirse porque en este proyecto conviven ambos casos, uno al lado del otro: `User.active` es `boolean` primitivo → `user.isActive()`; si en otra entidad ves un campo `Boolean` (mayúscula), ahí sí sería `getActive()`. Compílalo y comprueba cuál tienes en cada entidad si tienes dudas — el propio autocompletado de IntelliJ te lo confirma al escribir `user.` y ver qué getter aparece en la lista.

**Una cuarta que verás constantemente en proyectos reales: `@RequiredArgsConstructor`.** Genera un constructor solo para los campos `private final` (y `@NonNull`) — exactamente los campos que necesita la inyección por constructor, nada más. Cada service y controller de este proyecto escribe ese constructor a mano en su lugar — por ejemplo, el de `AuthService`: `public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil) { this.authenticationManager = authenticationManager; this.jwtUtil = jwtUtil; }` (ver [03-inyeccion-dependencias.md](./03-inyeccion-dependencias.md)). Ese constructor escrito a mano es *exactamente* lo que `@RequiredArgsConstructor` generaría por ti — TimeTrack lo escribe explícitamente a propósito, para que el mecanismo de inyección se vea mientras lo estás aprendiendo. Una vez que lo entiendes, los proyectos reales recurren a la anotación en su lugar, así una clase con cinco dependencias `private final` no necesita cinco líneas de boilerplate repetido.

> **`@AllArgsConstructor` vs `@RequiredArgsConstructor`:** `@AllArgsConstructor` genera un constructor con *todos* los campos, en el orden en que se declaran — útil en DTOs y entidades, donde cada campo es un dato que quieres establecer directamente. `@RequiredArgsConstructor` solo recoge los campos `private final` (y `@NonNull`) — exactamente lo que necesita un `@Service` o `@Controller`, ya que sus únicos campos son las dependencias inyectadas por constructor. Regla práctica: `@AllArgsConstructor` en DTOs, `@RequiredArgsConstructor` en clases de service/controller.

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

Docs: https://www.baeldung.com/spring-boot-annotations → leer: la entrada de `@SpringBootApplication` y las tres anotaciones que agrupa (secundario, oficial: https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html)

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

| Anotación | Qué hace | Dónde la vuelves a encontrar |
| --- | --- | --- |
| `@Configuration` | Marca esta clase como fuente de beans de Spring — un lugar donde pueden vivir métodos `@Bean` | [03-inyeccion-dependencias.md](./03-inyeccion-dependencias.md) — ahí escribes tu propia clase `@Configuration` |
| `@EnableAutoConfiguration` | Activa la auto-configuración basada en el classpath (el mecanismo `@ConditionalOnClass` trazado arriba) | Ya trazado en este archivo, §"Cómo funciona Spring Boot por dentro" |
| `@ComponentScan` | Escanea el paquete actual y todos los subpaquetes buscando `@Component`, `@Service`, `@Repository`, `@Controller` | El escaneo paso a paso está en [00-introduccion-spring-boot.md](./00-introduccion-spring-boot.md); los beans que encuentra son el `@RestController` de [02-controladores-rest.md](./02-controladores-rest.md) y el `@Repository` de [04-spring-data-jpa.md](./04-spring-data-jpa.md) |

Lee la tercera columna como una referencia hacia adelante, no como lectura extra: **no necesitas nada de eso para que la app arranque** — las tres anotaciones ya están haciendo su trabajo con cero código tuyo. La columna existe para que, cuando un `@RestController` del archivo 02 o un `JpaRepository` del archivo 04 se registre "automáticamente", recuerdes que *esta* línea en *esta* clase es la razón.

La clase debe estar en el paquete raíz para que `@ComponentScan` encuentre todos tus componentes automáticamente.

---

## application.properties — configuración central

Docs: https://www.baeldung.com/properties-with-spring → leer: "Registering Properties" y la sintaxis del placeholder `${...}` (secundario, la lista completa de claves: https://docs.spring.io/spring-boot/appendix/application-properties/index.html)

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
spring.datasource.password=your_password

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Docs: las claves de datasource (`spring.datasource.*`) y de JPA (`spring.jpa.*`) están listadas en el apéndice oficial → https://docs.spring.io/spring-boot/appendix/application-properties/index.html — leer: "Data Properties". Los valores de `ddl-auto` (`update`, `create`, `validate`, `none`) se explican en https://docs.spring.io/spring-boot/how-to/data-initialization.html → leer: "Initialize a Database Using Hibernate".

| Propiedad | Qué hace |
| --- | --- |
| `spring.datasource.url` | JDBC URL — protocolo + driver + host + puerto + nombre de base de datos |
| `spring.datasource.username` | Usuario de PostgreSQL |
| `spring.datasource.password` | Contraseña de PostgreSQL — nunca commitees el valor real a GitHub |
| `spring.jpa.hibernate.ddl-auto=update` | Crea tablas si no existen; las actualiza si cambia la entidad. Nunca uses `create` en producción (borra y recrea las tablas). |
| `spring.jpa.show-sql=true` | Imprime el SQL que genera Hibernate en la consola — útil mientras aprendes |

Lee la columna izquierda como el *namespace*, no como un string mágico: las tres claves `spring.datasource.*` las lee el bean `DataSource` auto-configurado de §"Auto-configuración" de arriba, y las dos claves `spring.jpa.*` las lee la auto-configuración de Hibernate. Esa es la única razón por la que estas líneas tienen algún efecto — tu código Java nunca las lee; algún bean con `@ConditionalOnClass` en un jar de Spring Boot lo hace. Fíjate en que las dos últimas filas llevan el **valor** dentro de la clave (`ddl-auto=update`, `show-sql=true`): eso es porque el valor *es* la lección — `ddl-auto` es la fila que puede borrar tus tablas de producción si escribes `create` en lugar de `update`.

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

**El `application.properties` real de TimeTrack** (el archivo completo, copiado de `backend/timetrack/src/main/resources/application.properties`):

```properties
spring.application.name=timetrack
spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
spring.jpa.defer-datasource-initialization=true

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000

spring.sql.init.mode=always
```

Dos de esas claves no son `spring.*` en absoluto — `app.jwt.secret` y `app.jwt.expiration`. Ese es el punto: **cualquier clave que inventes es una property válida.** Las claves `spring.*` las lee la propia auto-configuración de Spring Boot; una clave bajo un namespace que *tú* inventaste (`app.*` aquí) la lee *tu* código, con `@Value("${app.jwt.secret}")` en `JwtUtil` — lo ves exactamente así en [06-seguridad-jwt.md](./06-seguridad-jwt.md). El secret es una variable de entorno por la razón de arriba; `86400000` son milisegundos — 24 horas — y no es un secreto, así que va en el archivo a la vista de todos.

Las otras dos — `spring.jpa.defer-datasource-initialization` y `spring.sql.init.mode` — existen por culpa de `data.sql`; te las ganas por las malas en la sección "data.sql" de más abajo, así que ignóralas por ahora.

**Si accidentalmente commiteas un secreto:** cambiar el valor en un nuevo commit no es suficiente — el commit antiguo sigue siendo visible en el historial de git. La acción correcta es **invalidar la credencial inmediatamente** (cambiar la contraseña, revocar la API key) para que el valor filtrado quede inservible.

---

## Spring profiles — configuración por entorno

Propósito: los perfiles de Spring te permiten tener un archivo de config por entorno (local, staging, producción) sin cambiar el código. El archivo correcto se carga automáticamente según qué perfil está activo.

Docs: https://www.baeldung.com/spring-profiles → leer: "Using @Profile" y "Setting the Active Profile" (secundario, oficial: https://docs.spring.io/spring-boot/reference/features/profiles.html)

Archivo: `src/main/resources/`

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

Propósito: anotación de Lombok que genera un campo `log` en la clase. Usas `log.info()`, `log.warn()`, `log.error()` para escribir al log de la aplicación en lugar de `System.out.println()`.

Docs: https://www.baeldung.com/slf4j-with-log4j2-logback → leer: "SLF4J — a logging facade" y el ejemplo de `@Slf4j`

Archivo: cualquier clase service o componente, p.ej. `src/main/java/com/victor/timetrack/service/ProjectService.java`

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

Propósito: Spring Boot ejecuta `data.sql` automáticamente después de crear el esquema. Se usa para insertar la primera cuenta de manager cuando no hay endpoint de registro para managers.

Docs: https://docs.spring.io/spring-boot/how-to/data-initialization.html → leer: "Initialize a Database"

Archivo: `src/main/resources/data.sql`

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

### Orden de ejecución — por qué `data.sql` puede fallar en una base de datos nueva

Por defecto, Spring Boot ejecuta `data.sql` **antes** de que Hibernate cree o actualice el esquema, no después. En un proyecto que llevas un tiempo ejecutando esto pasa desapercibido — las tablas ya existen de ejecuciones anteriores. Solo sale a la luz el día que alguien parte de una base de datos realmente vacía: un clon nuevo, un Postgres local borrado, o el contenedor de Docker del Step 11 arrancando Postgres desde cero. `data.sql` intenta hacer `INSERT INTO users` contra una tabla que todavía no existe, y la app falla al arrancar.

Se arregla con una propiedad en `application.properties`:

```properties
spring.jpa.defer-datasource-initialization=true
```

Docs: https://www.baeldung.com/spring-boot-data-sql-and-schema-sql → leer: "Deferring Datasource Initialization"

Esto le dice a Spring Boot: ejecuta primero la creación/actualización del esquema de Hibernate, y solo ejecuta `data.sql` una vez que las tablas de las que depende ya existen. Sin esto, los dos mecanismos de arranque independientes — Hibernate construyendo el esquema, Spring Boot cargando los datos de siembra — compiten en el orden equivocado.

> Pon esto desde el principio del proyecto, incluso antes de que te encuentres el fallo — no cuesta nada cuando el esquema ya existe, y te ahorra un confuso error de "relation does not exist" la primera vez que ejecutes contra una base de datos limpia.

### `data.sql` no hace nada, en silencio — `spring.sql.init.mode`

Incluso con el orden arreglado, `data.sql` puede simplemente ser **ignorado** — sin error, sin ninguna línea en el log, la app arranca bien y la tabla se queda vacía. Esto pasa porque Spring Boot solo ejecuta `data.sql` automáticamente para bases de datos **embebidas** (H2, HSQL — el tipo que se usa en tests desechables). PostgreSQL es una base de datos externa y real, así que por defecto Spring Boot se salta la siembra por completo.

```properties
spring.sql.init.mode=always
```

Docs: https://www.baeldung.com/spring-boot-data-sql-and-schema-sql → leer la sección sobre `spring.sql.init.mode`

Esto obliga a Spring Boot a ejecutar `data.sql` sin importar el tipo de base de datos. Sin esto, el silencio es la trampa — no hay nada en la consola que te señale hacia esta propiedad, porque nada falló; el bean inicializador simplemente decidió que no había trabajo que hacer.

---

### Caso real — todos los errores al sembrar una base de datos Postgres real, en orden

Esta es la secuencia real de fallos al construir `data.sql` por primera vez contra una instancia de PostgreSQL viva — vale la pena guardarla como referencia, porque cada uno enseña un mecanismo distinto y se acumulan uno encima de otro.

**1. `ALTER TABLE ... add column active boolean not null` falla**

```
ERROR: column "active" of relation "users" contains null values
```

Añadir `active` como `NOT NULL` a una tabla que ya tenía filas — PostgreSQL no tiene nada que poner en las filas viejas y se niega a dejarlas en `NULL`. Se arregló con `@ColumnDefault("true")` (ver `04-spring-data-jpa.md`), que añade `DEFAULT true` al mismo `ALTER TABLE`, para que las filas existentes se rellenen automáticamente.

**2. No pasa nada en absoluto — ni error, ni insert**

Diagnosticado como `spring.sql.init.mode` por defecto en `embedded` (ver arriba) — PostgreSQL no es embebido, así que `data.sql` se saltó en silencio. Arreglado con `spring.sql.init.mode=always`.

**3. `there is no unique or exclusion constraint matching the ON CONFLICT specification`**

`ON CONFLICT (email)` necesita una restricción `UNIQUE` sobre `email` para saber qué cuenta como conflicto — no había ninguna. Añadir `@Column(unique = true)` a la entidad **no** lo arregló: el `ddl-auto=update` de Hibernate añade columnas y tablas nuevas de forma fiable, pero no es fiable al añadir a posteriori una restricción sobre una columna que ya existía antes de poner la anotación. Confirmado revisando la pestaña **Constraints → Unique** de la tabla en pgAdmin — vacía, incluso después de reiniciar con la anotación puesta. Se arregló ejecutando el `ALTER TABLE` a mano, una sola vez, en el Query Tool de pgAdmin:

```sql
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
```

> Esta limitación exacta — que `ddl-auto` no es fiable para modificar columnas existentes — es la razón por la que los proyectos reales usan una herramienta de migración (Flyway, Liquibase) en vez de dejar la evolución del esquema en manos de las suposiciones de Hibernate.

**4. `null value in column "id" of relation "users" violates not-null constraint`**

El `INSERT` no incluía ningún valor para `id`. Con `@GeneratedValue` sin estrategia explícita (`AUTO`), Hibernate no le da a la columna `id` un `DEFAULT` a nivel de base de datos — en vez de eso, es el propio Hibernate quien consulta una secuencia y suministra el valor del id dentro del `INSERT` que él genera, completamente en Java. `data.sql` evita a Hibernate por completo, así que eso nunca ocurre — la columna no tiene ningún default propio, y PostgreSQL cae en `NULL`. Se arregló sacando el siguiente valor de la misma secuencia que usa Hibernate, directamente en el SQL:

```sql
INSERT INTO users (id, email, password, name, role, active)
VALUES (nextval('users_seq'), 'manager@timetrack.com', ...)
ON CONFLICT (email) DO NOTHING;
```

**Encontrar el nombre correcto de la secuencia:** existían dos secuencias para esta tabla — `user_seq` y `users_seq` — porque el nombre de la tabla de la entidad cambió del valor por defecto (`user`, derivado del nombre de la clase) al explícito `@Table(name = "users")` en algún momento. Hibernate creó una secuencia nueva para coincidir con el nombre de tabla nuevo, pero nunca borró la vieja. Comprobar `last_value` en las dos no ayudó (ninguna se había consumido nunca — la única fila de prueba existente se había escrito directamente en el editor de filas de pgAdmin, no insertada a través de la app). La comprobación fiable fue comparar con una entidad hermana: `Project` tiene `@Table(name = "projects")` y su secuencia es `projects_seq` — misma convención, nombre de tabla más `_seq`. Eso confirmó que `users_seq` era la que estaba realmente en uso para `User`.

> La lección general detrás de los cuatro fallos: `data.sql` se ejecuta como **SQL puro contra la base de datos real**, completamente fuera de Hibernate. Cada comodidad que Hibernate normalmente te da gratis — defaults, ids generados, restricciones validadas — tiene que existir ya *en la propia base de datos* antes de que `data.sql` pueda apoyarse en ella. Ninguno de estos fue un bug de Java; cada uno fue un hueco entre lo que Hibernate hace a nivel de aplicación y lo que de verdad había escrito en el esquema.

---

## Dónde te deja esto — y qué viene después

La app ahora **arranca**: Maven tiene las dependencias correctas, la auto-configuración las convierte en beans, un Tomcat embebido escucha en el puerto 8080, `application.properties` lo apunta a una base de datos PostgreSQL real, y `data.sql` ha puesto ya la primera fila de manager en ella. Todo lo que configuraste en este archivo es *infraestructura* — se ejecuta antes de que llegue una sola petición, y nada de ello es código al que un usuario pueda llegar.

Que es exactamente el agujero: Tomcat está escuchando, y **no hay nada que responda**. Cada URL que escribes devuelve un 404 (o, una vez que Spring Security está en el pom, una página de login), porque no has escrito ni un solo endpoint. El `@ComponentScan` que acabas de conocer está ahí, escaneando tus paquetes y sin encontrar ningún controlador que registrar.

Ahí es donde retoma [02-controladores-rest.md](./02-controladores-rest.md): `@RestController`, `@GetMapping`/`@PostMapping`, y cómo un body JSON que llega al puerto 8080 se convierte en un objeto Java y se le entrega a uno de tus métodos. El montaje está hecho — de aquí en adelante, todo lo que escribes es la propia aplicación.
