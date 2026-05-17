# Spring Boot — Basics

> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

---

## Why Spring Boot exists

Plain Spring requires a lot of manual setup — XML configuration files, explicit bean declarations, and a separately installed Tomcat server. Spring Boot was created to remove that friction.

Spring Boot's two core ideas:

1. **Auto-configuration** — Spring Boot reads your dependencies and configures beans for you automatically. Add `spring-boot-starter-data-jpa` to the pom.xml and Spring Boot configures the database connection, EntityManager, and transaction support without any extra code.
2. **Embedded server** — Spring Boot includes Tomcat inside the `.jar`. You run `java -jar app.jar` and the server starts. No separate server installation needed.

The repeating pattern: **annotations replace configuration**. Before Spring Boot, you wrote XML to wire beans together. Now, you annotate a class with `@Service` and Spring Boot handles creating and connecting the objects for you.

---

## Spring Initializr — starting a project

[start.spring.io](https://start.spring.io) generates a ready-to-run Spring Boot project with the correct `pom.xml` and folder structure. You pick the dependencies you need and download a zip.

Every Spring Boot project at a consultancy starts the same way. The only things that change are the artifact name and the dependencies.

### What each field means

| Field | What it is | Always the same? |
|---|---|---|
| **Project: Maven** | Build tool — downloads libraries, compiles and packages your code. Gradle does the same job but Maven is more common in Spanish companies. | Yes, always Maven |
| **Language: Java** | The programming language. Kotlin and Groovy also run on the JVM but enterprise Spain uses Java. | Yes, always Java |
| **Spring Boot version** | Pick the latest stable version — the one in green with no SNAPSHOT or RC label. SNAPSHOT = unfinished. RC = nearly ready but still being tested. | Always latest stable |
| **Group** | A namespace that identifies who owns the project. Follows the reversed domain convention: `capgemini.com` → `com.capgemini`. For personal projects: `com.victor`. | Your domain reversed |
| **Artifact** | The name of the project. Becomes the name of the final `.jar` file. Short, lowercase, no spaces. | Changes per project |
| **Package name** | Generated automatically from Group + Artifact. The root Java package — every class lives inside it. Never change it manually. | Auto-generated |
| **Packaging: Jar** | The format of the output file. Jar = self-contained, includes the web server inside. War = older format, requires an external server. Always Jar. | Yes, always Jar |
| **Configuration: Properties** | Format of the config file. Properties = `key=value` (simpler). YAML = indented format (more readable but breaks with wrong indentation). | Properties is safer |
| **Java** | The Java version installed on your machine. Must match what you have. Run `java -version` in the terminal to check. | Match your installation |

### Settings used for project 07 (TimeTrack)

| Field | Value |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | 4.0.6 (latest stable, May 2026) |
| Group | com.victor |
| Artifact | timetrack |
| Packaging | Jar |
| Java | 25 |

### Dependencies added

| Dependency | What it gives you |
|---|---|
| **Spring Web** | The embedded HTTP server (Tomcat) and the annotations to build REST endpoints (`@RestController`, `@GetMapping`, etc.) |
| **Spring Data JPA** | Tools to talk to the database without writing SQL by hand. You define Java classes and Spring generates the queries. |
| **PostgreSQL Driver** | The connector between Java and PostgreSQL. Without this, Spring cannot open a database connection. |

---

## Project structure

This is what IntelliJ shows after opening the project. The `.idea/` folder is created automatically by IntelliJ when you open the folder — it stores your project settings.

```
backend/
├── .idea/                               ← IntelliJ project settings — auto-generated, never touch it
└── timetrack/                           ← the actual Maven project (where pom.xml lives)
    ├── pom.xml                          ← Maven config — lists dependencies (like package.json)
    ├── mvnw                             ← Maven wrapper for Mac/Linux
    ├── mvnw.cmd                         ← Maven wrapper for Windows — IntelliJ uses this internally
    ├── HELP.md                          ← generated docs, ignore it
    ├── .gitignore                       ← already includes .idea, target/, etc.
    └── src/
        ├── main/
        │   ├── java/com/victor/timetrack/
        │   │   └── TimetrackApplication.java   ← entry point — the only Java file generated
        │   └── resources/
        │       └── application.properties      ← config file — like an .env file
        └── test/
            └── java/com/victor/timetrack/
                └── TimetrackApplicationTests.java   ← one empty test class generated
```

### File by file

**`.idea/`** — IntelliJ's own folder. It stores which files are open, run configurations, code style settings. You never touch it. Add it to `.gitignore` so it does not go to GitHub — each developer has their own settings.

**`pom.xml`** — Maven's equivalent of `package.json`. Lists all dependencies and the Java version. When you add a new dependency (e.g. Spring Security), you add a `<dependency>` block here and IntelliJ downloads it automatically.

**`mvnw` / `mvnw.cmd`** — Maven wrapper scripts. They let IntelliJ run Maven commands without needing Maven installed globally on your machine. You do not run these manually.

**`HELP.md`** — auto-generated by Spring Initializr with links to docs. You can ignore it or delete it.

**`.gitignore`** — already configured with the right entries: `.idea/`, `target/` (compiled output), etc.

**`TimetrackApplication.java`** — the entry point. Has the `main()` method. You never touch this file.

**`application.properties`** — where all configuration goes: database URL, port, JWT secret, etc. Like an `.env` file in Node. Right now it only has one line.

**`TimetrackApplicationTests.java`** — one empty test class. The starting point for your tests.

---

## @SpringBootApplication — the entry point

Every Spring Boot application has exactly one class with `@SpringBootApplication`. This is what Spring Initializr generated for TimeTrack:

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

- `package com.victor.timetrack` — declares which package this class belongs to. Every Java class starts with this.
- `import` — brings in classes from other packages, just like `import` in TypeScript.
- `@SpringBootApplication` — one annotation that does three things at once (see table below).
- `main()` — the entry point of the program. When you click Run in IntelliJ, Java starts here.
- `SpringApplication.run(...)` — boots the whole Spring context: starts Tomcat, connects to the database, registers all components.

**You never touch this file.** It is the ignition key — you just need it to exist.

`@SpringBootApplication` combines three annotations:

| Annotation | What it does |
|-----------|-------------|
| `@Configuration` | Marks this class as a source of Spring beans |
| `@EnableAutoConfiguration` | Activates auto-configuration based on the classpath |
| `@ComponentScan` | Scans the current package and all sub-packages for `@Component`, `@Service`, `@Repository`, `@Controller` |

The class must be in the root package so `@ComponentScan` finds all your components automatically.

---

## application.properties — central configuration

`src/main/resources/application.properties` is where all environment-specific configuration goes. No hardcoded values in the Java code. Think of it like an `.env` file.

**What Spring Initializr generates (just one line):**

```properties
spring.application.name=timetrack
```
