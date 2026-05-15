# Maven

> 📖 [Maven Getting Started Guide](https://maven.apache.org/guides/getting-started/index.html)

Maven is the standard build tool and dependency manager for Java projects. It handles three things: downloading libraries, compiling code, and packaging the application into a runnable `.jar`.

**The JavaScript equivalent:** Maven is `npm`. `pom.xml` is `package.json`. Maven Central is the npm registry.

---

## What Maven does for you

When you build a Spring Boot project:

1. Maven reads `pom.xml`
2. Downloads all listed dependencies from Maven Central
3. Compiles your Java source code
4. Runs your tests
5. Packages everything into a single `.jar` file you can deploy

---

## pom.xml structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>

  <!-- Maven coordinates — uniquely identify this project -->
  <groupId>com.example</groupId>       <!-- your organisation — reversed domain -->
  <artifactId>hr-portal</artifactId>   <!-- the project name -->
  <version>0.0.1-SNAPSHOT</version>    <!-- current version -->
  <packaging>jar</packaging>

  <!-- Parent — inherits Spring Boot defaults and manages dependency versions -->
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.0</version>
  </parent>

  <!-- Java version -->
  <properties>
    <java.version>21</java.version>
  </properties>

  <!-- Dependencies — the libraries your project uses -->
  <dependencies>

    <!-- Spring Boot Web — REST support, embedded Tomcat -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <!-- no <version> needed — parent manages it -->
    </dependency>

    <!-- Spring Data JPA — database access with Hibernate -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- PostgreSQL driver — runtime scope: not needed to compile, only to run -->
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>

    <!-- Spring Security — authentication and authorisation -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Bean validation — @NotNull, @Email, @Min, @Max -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Test scope — only packaged for running tests, not in production -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>

  </dependencies>

  <!-- Plugin to run the app as a Spring Boot application -->
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

## The parent block and version management

The `spring-boot-starter-parent` in `<parent>` is the key to Spring Boot's "just works" experience. It:

- Manages all Spring library versions so they are compatible with each other
- Provides sensible defaults for the Maven build
- Sets the Java version

This is why most Spring Boot dependencies do not need a `<version>` tag. The parent already knows which version to use.

**When you do need `<version>`:** for non-Spring libraries (JWT, MapStruct, Lombok). Search `mvnrepository.com` for the correct version.

---

## How to add a dependency

1. Go to [mvnrepository.com](https://mvnrepository.com)
2. Search for the library (e.g. "jjwt" for JWT)
3. Click the version you want — copy the `<dependency>` block
4. Paste it inside `<dependencies>` in `pom.xml`
5. IntelliJ detects the change and downloads it automatically (or run `mvn install`)

Example — adding JWT support for project 07:

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

## Dependency scopes

| Scope | Available when | Common use |
|-------|---------------|-----------|
| `compile` (default) | Always | Most libraries |
| `runtime` | Run time only, not compile time | Database drivers |
| `test` | Tests only — not in production build | JUnit, Mockito |
| `provided` | Compile time only — provided by the server | Servlet API |

The most important distinction: `test` scope keeps test libraries out of the production `.jar`. Database drivers use `runtime` because you only reference the driver indirectly through JPA.

---

## Maven lifecycle — common commands

```bash
mvn clean              # delete the target/ folder (compiled output)
mvn compile            # compile the source code
mvn test               # run all tests
mvn package            # create the .jar file in target/
mvn install            # package + install the .jar to the local Maven cache
mvn clean install      # clean + compile + test + package (the standard full build)

mvn spring-boot:run    # run the Spring Boot app directly without packaging
```

The lifecycle phases run **in order** — running `package` automatically runs `compile` and `test` first. Running `install` runs all of the above.

---

## Maven vs Gradle

| | Maven | Gradle |
|---|-------|--------|
| Config format | XML (`pom.xml`) | Groovy or Kotlin (`build.gradle`) |
| Verbosity | More verbose | Shorter |
| Enterprise adoption | Very common in Spain | Growing, common in Android |
| Learning curve | Lower | Higher |
| Spring Initializr | Both supported | Both supported |

For your projects, **Maven is the safer choice** — it is what most Spanish consultancies use on their existing Java projects, and the `pom.xml` format is easier to read when you are starting out.

---

## Maven folder structure (generated by Spring Initializr)

```
project/
├── pom.xml                    ← build configuration and dependencies
├── src/
│   ├── main/
│   │   ├── java/              ← your Java source code
│   │   └── resources/
│   │       └── application.properties  ← Spring Boot config
│   └── test/
│       └── java/              ← your test files
└── target/                    ← compiled output (generated, not in git)
```

The `target/` folder is always in `.gitignore` — it is regenerated on every build.
