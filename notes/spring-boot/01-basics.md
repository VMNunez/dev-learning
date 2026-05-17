# Spring Boot — Basics

> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

## Why Spring Boot exists

Plain Spring requires a lot of manual setup — XML configuration files, explicit bean declarations, and a separately installed Tomcat server. Spring Boot was created to remove that friction.

Spring Boot's two core ideas:

1. **Auto-configuration** — Spring Boot reads your dependencies and configures beans for you automatically. Add `spring-boot-starter-data-jpa` to the pom.xml and Spring Boot configures the database connection, EntityManager, and transaction support without any extra code.
2. **Embedded server** — Spring Boot includes Tomcat inside the `.jar`. You run `java -jar app.jar` and the server starts. No separate server installation needed.

The repeating pattern: **annotations replace configuration**. Before Spring Boot, you wrote XML to wire beans together. Now, you annotate a class with `@Service` and Spring Boot handles creating and connecting the objects for you.

---

## @SpringBootApplication — the entry point

Every Spring Boot application has exactly one class with `@SpringBootApplication`:

```java
@SpringBootApplication
public class FinanceTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinanceTrackerApplication.class, args);
    }
}
```

`@SpringBootApplication` combines three annotations:

| Annotation | What it does |
|-----------|-------------|
| `@Configuration` | Marks this class as a source of Spring beans |
| `@EnableAutoConfiguration` | Activates auto-configuration based on the classpath |
| `@ComponentScan` | Scans the current package and all sub-packages for `@Component`, `@Service`, `@Repository`, `@Controller` |

The class must be in the root package so `@ComponentScan` finds all your components automatically.

---

## application.properties — central configuration

`src/main/resources/application.properties` is where all environment-specific configuration goes. No hardcoded values in the Java code.

```properties
# Server
server.port=8080

# Database (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/finance_tracker
spring.datasource.username=postgres
spring.datasource.password=secret

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=your-256-bit-secret-here
app.jwt.expiration-ms=86400000
```

**`spring.jpa.hibernate.ddl-auto` — what each value does:**

| Value | What it does | When to use |
|-------|-------------|------------|
| `create` | Drops and recreates the schema on startup | Never — you lose all data |
| `create-drop` | Drops the schema when the app stops | Tests only |
| `update` | Adds new columns/tables, never drops | Development |
| `validate` | Checks the schema matches entities, errors if not | Production |
| `none` | Does nothing | Production (manage schema with migrations) |

In production, use `validate` or `none` — **never** `create` or `update` on a live database.

**`spring.jpa.show-sql=true`** — prints all generated SQL to the console. Use during development to see what queries Hibernate is sending.

---

## Spring Initializr — starting a project

[start.spring.io](https://start.spring.io) generates a ready-to-run Spring Boot project with the correct `pom.xml` and folder structure. You pick the dependencies you need and download a zip.

Typical selections for project 07 (Finance Tracker):

- Project: **Maven**
- Language: **Java 21**
- Spring Boot: **3.3.x** (latest stable)
- Dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver, Spring Security, Validation, Spring Boot DevTools

---

## Project structure

```
src/main/java/com/example/financetracker/
├── FinanceTrackerApplication.java   ← @SpringBootApplication — entry point
├── controller/                      ← REST controllers (@RestController)
├── service/                         ← business logic (@Service)
├── repository/                      ← JPA repositories (@Repository)
├── model/                           ← JPA entities (@Entity)
├── dto/                             ← Data Transfer Objects (records)
├── security/                        ← JWT filter, SecurityFilterChain config
└── exception/                       ← custom exceptions, @ControllerAdvice

src/main/resources/
└── application.properties

src/test/java/
└── ...                              ← test files mirror the main structure
```

The rule: a controller never imports from a repository. Each layer only talks to the layer directly below it.
