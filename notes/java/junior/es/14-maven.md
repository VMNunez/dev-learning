# Maven

> 📖 [Baeldung — Apache Maven Tutorial](https://www.baeldung.com/maven)
> 📖 [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html) (oficial, secundaria)

> **Archivo:** `projects/07-timetrack/backend/timetrack/pom.xml` — el `pom.xml` real sobre el que se construye este archivo.

Ya has visto las anotaciones que gobiernan cada clase de Spring (archivo 13) — `@Entity`, `@Service`, `@RestController`, `@Transactional`. Pero las anotaciones no son más que etiquetas sobre tu código, y el código por sí solo no hace nada: nada de eso compila, nada descarga las librerías de Spring de donde salen esas anotaciones, y nada se empaqueta en una app que puedas ejecutar de verdad. Algo tiene que convertir una carpeta de archivos `.java` en una aplicación en marcha. Ese algo es Maven.

Maven es la herramienta de build estándar y gestor de dependencias para proyectos Java. Se encarga de tres cosas: descargar librerías, compilar el código y empaquetar la aplicación en un `.jar` ejecutable. Es el broche final de tooling de las notas de Java — el lenguaje en sí (archivos 00–13, más el modelo de memoria del 15) ya lo tienes detrás; este archivo es cómo ese lenguaje se convierte en un proyecto que puedes construir y desplegar.

**El equivalente en JavaScript:** Maven es `npm`. `pom.xml` es `package.json`. Maven Central es el registro de npm.

---

## Qué hace Maven por ti

Cuando construyes un proyecto Spring Boot:

1. Maven lee `pom.xml`
2. Descarga todas las dependencias listadas de Maven Central
3. Compila tu código fuente Java
4. Ejecuta tus tests
5. Empaqueta todo en un único fichero `.jar` que puedes desplegar

Dos de esos pasos esconden la misma idea en la que un desarrollador de Node nunca tiene que pensar. "Compilar" significa convertir tus archivos `.java`, legibles por humanos, en archivos `.class` — bytecode, el formato de instrucciones compacto que la Java Virtual Machine ejecuta realmente (JavaScript se interpreta directamente desde el código fuente, así que ahí no hay paso equivalente). "Empaquetar en un `.jar`" significa entonces comprimir todos esos archivos `.class` compilados, más un manifiesto que describe el punto de entrada, en un único archivo — un JAR es literalmente un ZIP con un montón de `.class` dentro. Ese único fichero es lo que copias a un servidor y ejecutas con `java -jar`.

> **¿Por qué un paso de build, cuando `npm` no tiene ninguno?** JavaScript envía el mismo código fuente que ejecutan el navegador o Node. Java no: la JVM ejecuta bytecode, no código fuente, así que siempre hay un paso de compilación entre "el código que escribí" y "el código que se ejecuta". Maven es lo que automatiza ese paso (y todo lo que lo rodea) en lugar de que tú llames a `javac` a mano sobre cada archivo.

---

## Estructura de pom.xml

Todo proyecto Maven tiene un único `pom.xml` en la raíz. Tiene cuatro secciones principales: las **coordenadas** que identifican de forma única tu proyecto (groupId, artifactId, version), el **parent** que hereda la gestión de versiones de Spring Boot, el bloque de **dependencias** donde listas las librerías que necesitas, y el bloque de **build** con el plugin que hace la app ejecutable. La mayor parte del tiempo la pasarás en el bloque `<dependencies>` — el resto lo genera Spring Initializr y rara vez lo tocas.

> **¿Qué significa `-SNAPSHOT` en la versión?** Tu `<version>` es `0.0.1-SNAPSHOT`. El sufijo `-SNAPSHOT` es la forma que tiene Maven de decir "en desarrollo, todavía no publicada". Un `0.0.1` a secas sería una release fija y publicada que nunca cambia; `0.0.1-SNAPSHOT` le dice a Maven que este es un build en curso que sigues cambiando cada día. En la práctica casi nadie lo quita hasta que de verdad corta una release — cada proyecto que generas desde Spring Initializr empieza su vida como `-SNAPSHOT`, y el tuyo también.

> **¿Qué es un `starter`, y por qué todo se llama `spring-boot-starter-*`?** Un starter es un paquete curado de dependencias que se trae con una sola línea. `spring-boot-starter-web` no es una única librería — es una dependencia "meta" vacía cuyo único trabajo es depender de las ~10 librerías que necesitas para una API REST (Spring MVC, un servidor Tomcat embebido, la librería JSON Jackson, validación, y más), todas en versiones que el equipo de Spring ya ha probado juntas. Sin starters tendrías que listar esas diez dependencias tú mismo y confiar en que las versiones son compatibles. Con un starter, una línea trae todo el conjunto conocido y correcto. Por eso casi cada dependencia de Spring que añades se llama `spring-boot-starter-<algo>`: cada una es un paquete temático — `-web` para REST, `-data-jpa` para acceso a base de datos, `-security` para autenticación, `-test` para testing.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>

  <!-- Coordenadas Maven — identifican de forma única este proyecto -->
  <groupId>com.example</groupId>       <!-- tu organización — dominio invertido -->
  <artifactId>hr-portal</artifactId>   <!-- el nombre del proyecto -->
  <version>0.0.1-SNAPSHOT</version>    <!-- versión actual -->
  <packaging>jar</packaging>

  <!-- Parent — hereda los valores por defecto de Spring Boot y gestiona las versiones de dependencias -->
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
  </parent>

  <!-- Versión de Java -->
  <properties>
    <java.version>21</java.version>
  </properties>

  <!-- Dependencies — las librerías que usa tu proyecto -->
  <dependencies>

    <!-- Spring Boot Web — soporte REST, Tomcat embebido -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <!-- sin <version> — el parent la gestiona -->
    </dependency>

    <!-- Spring Data JPA — acceso a base de datos con Hibernate -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Driver de PostgreSQL — scope runtime: no se necesita para compilar, solo para ejecutar -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>

    <!-- Spring Security — autenticación y autorización -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Validación de beans — @NotNull, @Email, @Min, @Max -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Scope test — solo se empaqueta para ejecutar tests, no en producción -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>

  </dependencies>

  <!-- Plugin para ejecutar la app como aplicación Spring Boot -->
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>

</project>
```

---

## El bloque parent y la gestión de versiones

El `spring-boot-starter-parent` en `<parent>` es la clave de la experiencia "simplemente funciona" de Spring Boot. Este bloque:

- Gestiona todas las versiones de librerías Spring para que sean compatibles entre sí
- Proporciona valores por defecto razonables para el build de Maven
- Establece la versión de Java

Por eso la mayoría de las dependencias de Spring Boot no necesitan etiqueta `<version>`. El parent ya sabe qué versión usar.

> **¿Por qué puedes omitir `<version>` en una dependencia de Spring?** El parent lleva una gran sección `<dependencyManagement>` — una tabla de consulta de "si usas la librería X, usa la versión Y". Cuando Maven lee una `<dependency>` sin `<version>`, sube hasta el parent, encuentra esa librería en la tabla y te rellena la versión. Así que la versión no falta — se hereda. Este es el mecanismo detrás del "solo añade el starter y funciona" de Spring Boot: el parent ya ha elegido una versión mutuamente compatible para cada librería que conoce, así que nunca eliges versiones que choquen.

**Cuándo sí necesitas `<version>`:** para librerías que no son de Spring (JWT, MapStruct, Lombok). Busca la versión correcta en `mvnrepository.com`.

---

## Cómo añadir una dependencia

1. Ve a [mvnrepository.com](https://mvnrepository.com)
2. Busca la librería (por ejemplo "jjwt" para JWT)
3. Haz clic en la versión que quieres — copia el bloque `<dependency>`
4. Pégalo dentro de `<dependencies>` en `pom.xml`
5. IntelliJ detecta el cambio y lo descarga automáticamente (o ejecuta `mvn install`)

Ejemplo — añadir soporte JWT para el proyecto 07:

```xml
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-api</artifactId>
  <version>0.12.5</version>
</dependency>
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt-impl</artifactId>
  <version>0.12.5</version>
  <scope>runtime</scope>
</dependency>
```

---

## Scopes de dependencias

No todas las librerías necesitan estar disponibles en cada fase del build. Un driver de base de datos solo hace falta cuando la aplicación realmente se ejecuta — no cuando el compilador comprueba tipos. Una librería de tests nunca debería acabar en el JAR de producción. El sistema de scopes de Maven controla esto: cada dependencia declara cuándo se necesita, y Maven la incluye solo en esas fases.

| Scope | Disponible cuándo | Uso común |
|-------|-------------------|-----------|
| `compile` (por defecto) | Siempre | La mayoría de librerías |
| `runtime` | Solo en ejecución, no en compilación | Drivers de base de datos |
| `test` | Solo en tests — no en el build de producción | JUnit, Mockito |
| `provided` | Solo en compilación — lo proporciona el servidor | Servlet API |

Lee la tabla así: la columna **Scope** es el valor que escribes dentro de `<scope>...</scope>`, y la columna **Disponible cuándo** te dice en qué fases del build se pone esa dependencia en el classpath — todo lo que se omite de esa columna es donde Maven la deja fuera deliberadamente.

> **¿Por qué un driver de base de datos es `runtime` y no `compile`?** Tu propio código nunca menciona la clase del driver de PostgreSQL por su nombre — escribes `repository.save(user)` y JPA/Hibernate deciden, en tiempo de ejecución, qué driver cargar basándose en tu URL de conexión. Así que el compilador no tiene nada que comprobar contra el driver: no se necesita para *compilar*, solo para *ejecutar*. Marcarlo como `runtime` lo mantiene fuera del classpath de compilación (para que no puedas escribir por accidente código que dependa de una base de datos concreta) mientras lo empaqueta igualmente en el JAR para que la app pueda conectarse cuando arranca de verdad.

La distinción más importante: el scope `test` mantiene las librerías de test fuera del `.jar` de producción. Los drivers de base de datos usan `runtime` porque solo los referencias indirectamente a través de JPA.

---

## Ciclo de vida de Maven — comandos comunes

```bash
mvn clean              # elimina la carpeta target/ (salida compilada)
mvn compile            # compila el código fuente
mvn test               # ejecuta todos los tests
mvn package            # crea el fichero .jar en target/
mvn install            # package + instala el .jar en la caché local de Maven
mvn clean install      # clean + compile + test + package (el build completo estándar)

mvn spring-boot:run    # ejecuta la app Spring Boot directamente sin empaquetar
```

Las fases del ciclo de vida se ejecutan **en orden** — ejecutar `package` ejecuta automáticamente `compile` y `test` antes. Ejecutar `install` ejecuta todo lo anterior.

> **¿Por qué ejecutar una fase dispara las anteriores?** El ciclo de vida de Maven es una secuencia fija: `validate → compile → test → package → verify → install → deploy`. Cuando pides una fase, Maven ejecuta todas las fases hasta esa incluida, nunca solo esa de forma aislada. Esto no es una comodidad — es una garantía: no puedes `package` un JAR a partir de código obsoleto o sin testear, porque `compile` y `test` están obligados a ejecutarse y pasar primero. Pedir una fase es en realidad pedir "todo lo necesario para llegar a esta fase, en orden".

> **¿Dónde pone `mvn install` realmente el JAR?** No en un servidor — en tu **caché local de Maven**, una carpeta oculta en `~/.m2/repository` en tu máquina. Esa caché es el mismo sitio donde Maven descarga las dependencias de Central. Instalar tu proyecto ahí significa que *otro* proyecto de la misma máquina puede listar el tuyo como dependencia y Maven lo encontrará localmente. Para una sola app Spring Boot rara vez lo necesitas — `mvn install` cobra sentido cuando divides un sistema en varios módulos que dependen unos de otros.

---

## Maven vs Gradle

Gradle es la otra herramienta de build popular para Java. Ambas hacen lo mismo — gestionar dependencias, compilar, testear, empaquetar — pero usan formatos de configuración distintos y tienen diferentes niveles de adopción. Para tus proyectos en España, Maven es la opción por defecto más segura.

| | Maven | Gradle |
|---|-------|--------|
| Formato de configuración | XML (`pom.xml`) | Groovy o Kotlin (`build.gradle`) |
| Verbosidad | Más verboso | Más conciso |
| Adopción enterprise | Muy común en España | Creciendo, común en Android |
| Curva de aprendizaje | Menor | Mayor |
| Spring Initializr | Ambos compatibles | Ambos compatibles |

Lee la tabla fila por fila: cada fila es una dimensión sobre la que podrías comparar las dos herramientas, y las dos columnas son cómo puntúan Maven y Gradle en ella — recorre la columna **Maven** de arriba abajo para hacerte una idea completa de la herramienta que realmente estás usando.

Para tus proyectos, **Maven es la opción más segura** — es lo que usan la mayoría de consultoras españolas en sus proyectos Java existentes, y el formato `pom.xml` es más fácil de leer cuando estás empezando.

---

## Estructura de carpetas de Maven (generada por Spring Initializr)

Spring Initializr crea esta estructura por ti. Nunca la crearás a mano. La convención importante: el código fuente va en `src/main/java`, los tests en `src/test/java`, y la carpeta `target/` (donde Maven pone el output compilado y el JAR) siempre está en `.gitignore` porque se regenera en cada build.

```
project/
├── pom.xml                    ← configuración de build y dependencias
├── src/
│   ├── main/
│   │   ├── java/              ← tu código fuente Java
│   │   └── resources/
│   │       └── application.properties  ← configuración de Spring Boot
│   └── test/
│       └── java/              ← tus ficheros de test
└── target/                    ← salida compilada (generada, no en git)
```

> **¿Por qué mantener `target/` fuera de git?** Porque es 100% derivada — cada archivo `.class` y el JAR que hay dentro se producen a partir de tu código fuente con `mvn compile`/`mvn package`. Commitearla hincharía el repo con binarios y provocaría interminables conflictos de merge en archivos que nadie edita a mano. Cualquiera que clone el repo regenera `target/` con un solo build, así que no se pierde nada por ignorarla. Es la misma razón por la que `node_modules/` está git-ignored en un proyecto Node: nunca commitees lo que un paso de build puede recrear.

---

## Adónde te deja esto

Con esto se cierra el arco de lenguaje-y-tooling de las notas de Java. Los archivos 00–13 te enseñaron el lenguaje — tipos, control de flujo, clases, interfaces, generics, excepciones, colecciones, y las anotaciones que Spring lee (el 15 añade el modelo de memoria que hay debajo de todo). Este archivo añadió la pieza que faltaba alrededor del lenguaje: la herramienta que descarga esas librerías, compila tu código a bytecode, ejecuta los tests y lo empaqueta en algo que puedes ejecutar. Ahora tienes las dos mitades — un lenguaje que sabes escribir y una herramienta de build que lo convierte en una app.

A partir de aquí la historia sale del Java puro y entra en Spring Boot. Todo lo que acabas de ver en `pom.xml` — los starters, el parent, los scopes — es el punto de entrada: en el momento en que `spring-boot-starter-web` aterriza en tus dependencias, la auto-configuración de Spring Boot se despierta y cablea la aplicación entera. El `pom.xml` referenciado al principio de este archivo (`projects/07-timetrack/backend/timetrack/pom.xml`) es exactamente el que hay detrás del proyecto 07, donde cada anotación del archivo 13 y cada starter de este archivo se ponen a trabajar. Las notas de Spring Boot recogen el hilo ahí.
