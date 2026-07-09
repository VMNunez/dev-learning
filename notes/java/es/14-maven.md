# Maven

> 📖 [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html)

Maven es la herramienta de build estándar y gestor de dependencias para proyectos Java. Se encarga de tres cosas: descargar librerías, compilar el código y empaquetar la aplicación en un `.jar` ejecutable.

**El equivalente en JavaScript:** Maven es `npm`. `pom.xml` es `package.json`. Maven Central es el registro de npm.

---

## Qué hace Maven por ti

Cuando construyes un proyecto Spring Boot:

1. Maven lee `pom.xml`
2. Descarga todas las dependencias listadas de Maven Central
3. Compila tu código fuente Java
4. Ejecuta tus tests
5. Empaqueta todo en un único fichero `.jar` que puedes desplegar

---

## Estructura de pom.xml

Todo proyecto Maven tiene un único `pom.xml` en la raíz. Tiene cuatro secciones principales: las **coordenadas** que identifican de forma única tu proyecto (groupId, artifactId, version), el **parent** que hereda la gestión de versiones de Spring Boot, el bloque de **dependencias** donde listas las librerías que necesitas, y el bloque de **build** con el plugin que hace la app ejecutable. La mayor parte del tiempo la pasarás en el bloque `<dependencies>` — el resto lo genera Spring Initializr y rara vez lo tocas.

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
- Proporciona valores por defecto sensatos para el build de Maven
- Establece la versión de Java

Por eso la mayoría de las dependencias de Spring Boot no necesitan etiqueta `<version>`. El parent ya sabe qué versión usar.

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

La carpeta `target/` siempre está en `.gitignore` — se regenera en cada build.
