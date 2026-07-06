# Spring Boot — Basics

> 📖 [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start)
> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

---

## Why Spring Boot exists

Before we get into Spring Boot, three terms you will see constantly:

- **Tomcat** — a web server. It is a program that listens on a network port (like 8080) and receives HTTP requests from browsers or clients. Without a web server, your Java code has no way to accept HTTP connections. Before Spring Boot, you had to download Tomcat separately, install it, configure it, and deploy your app into it.
- **`.jar`** — a packaged Java application. It is essentially a zip file that contains all your compiled code and can be run directly with `java -jar app.jar`. When you build a Spring Boot project, Maven produces a single `.jar` that contains your code and everything it needs (including Tomcat).
- **Bean** — an object that Spring creates and manages for you. Instead of you writing `new UserService()` everywhere, Spring creates one instance of `UserService`, stores it, and automatically gives it to any class that needs it. You just annotate a class with `@Service` and Spring handles the rest.
- **Jackson** — the library Spring Boot uses to convert between Java objects and JSON. When a controller returns a Java object, Jackson turns it into the JSON the client receives; when a request arrives with a JSON body, Jackson turns it back into a Java object. It runs automatically — it reads your public getters (or the ones Lombok generates) to decide which fields to include. You never call it yourself; Spring Boot wires it in.

---

Plain Spring requires a lot of manual setup and a separately installed server. Spring Boot was created to remove that friction. It does it with two core ideas:

1. **Auto-configuration** — Spring Boot reads your dependencies and configures beans for you automatically. Add `spring-boot-starter-data-jpa` to the pom.xml and Spring Boot configures the database connection, EntityManager, and transaction support without any extra code.
2. **Embedded server** — Spring Boot includes Tomcat inside the `.jar`. You run `java -jar app.jar` and the server starts. No separate server installation needed.

The repeating pattern: **annotations replace configuration**. Before Spring Boot, you wrote XML to wire beans together. Now, you annotate a class with `@Service` and Spring Boot handles creating and connecting the objects for you.

---

## Spring Initializr — starting a project

[start.spring.io](https://start.spring.io) generates a ready-to-run Spring Boot project with the correct `pom.xml` and folder structure. You pick the dependencies you need and download a zip.

Every Spring Boot project starts the same way. The only things that change are the artifact name and the dependencies.

### What each field means

| Field                         | What it is                                                                                                                                                        | Always the same?        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **Project: Maven**            | Build tool — downloads libraries, compiles and packages your code. Gradle does the same job but Maven is more common in Spanish companies.                        | Yes, always Maven       |
| **Language: Java**            | The programming language. Kotlin and Groovy also run on the JVM but enterprise Spain uses Java.                                                                   | Yes, always Java        |
| **Spring Boot version**       | Pick the latest stable version — the one in green with no SNAPSHOT or RC label. SNAPSHOT = unfinished. RC = nearly ready but still being tested.                  | Always latest stable    |
| **Group**                     | A namespace that identifies who owns the project. Follows the reversed domain convention: `capgemini.com` → `com.capgemini`. For personal projects: `com.victor`. | Your domain reversed    |
| **Artifact**                  | The name of the project. Becomes the name of the final `.jar` file. Short, lowercase, no spaces.                                                                  | Changes per project     |
| **Package name**              | Generated automatically from Group + Artifact. The root Java package — every class lives inside it. Never change it manually.                                     | Auto-generated          |
| **Packaging: Jar**            | The format of the output file. Jar = self-contained, includes the web server inside. War = older format, requires an external server. Always Jar.                 | Yes, always Jar         |
| **Configuration: Properties** | Format of the config file. Properties = `key=value` (simpler). YAML = indented format (more readable but breaks with wrong indentation).                          | Properties is safer     |
| **Java**                      | The Java version installed on your machine. Must match what you have. Run `java -version` in the terminal to check.                                               | Match your installation |

### Settings used for project 07 (TimeTrack)

| Field       | Value                           |
| ----------- | ------------------------------- |
| Project     | Maven                           |
| Language    | Java                            |
| Spring Boot | 4.0.6 (latest stable, May 2026) |
| Group       | com.victor                      |
| Artifact    | timetrack                       |
| Packaging   | Jar                             |
| Java        | 25                              |

### Dependencies for a full Spring Boot project

These are all the dependencies a complete Spring Boot project needs. Some can be selected in Spring Initializr at setup; others (marked with \*) must be added manually to `pom.xml` later because they are not on Spring Initializr.

| Dependency                                                                              | What it gives you                                                                                                      |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Spring Web**                                                                          | The embedded HTTP server (Tomcat) and the annotations to build REST endpoints (`@RestController`, `@GetMapping`, etc.) |
| **Spring Data JPA**                                                                     | Tools to talk to the database without writing SQL by hand. You define Java classes and Spring generates the queries.   |
| **PostgreSQL Driver**                                                                   | The connector between Java and PostgreSQL. Without this, Spring cannot open a database connection.                     |
| **Spring Security**                                                                     | Authentication and authorisation. Blocks all endpoints by default until you configure which routes are public.         |
| **Validation** (this is the exact name to search on Initializr — artifact `spring-boot-starter-validation`) | Bean Validation annotations (`@NotBlank`, `@NotNull`, `@Email`, `@Min`) for validating request bodies.                 |
| **Lombok**                                                                              | Code generation at compile time — eliminates boilerplate getters, setters, and constructors from entity classes.       |
| **Spring Boot Starter Test** (not a checkbox — Initializr always adds it automatically) | JUnit 5 + Mockito + test utilities. Already in every generated `pom.xml`; you never add it by hand.              |
| **JJWT\*** (manual)                                                                     | JWT library for creating and validating tokens. Must be added manually from mvnrepository.com (three artifacts).       |

---

## Adding dependencies after project creation

When you need a library that was not selected in Spring Initializr, you add it manually to `pom.xml`.

**How to find the correct dependency block:**

1. Go to [start.spring.io](https://start.spring.io)
2. Set the same Spring Boot version and Java version as your project
3. Click **Add dependencies** and search for the library
4. Click **Explore** (bottom right) — this shows the generated `pom.xml`
5. Copy the `<dependency>` block for that library into your project's `pom.xml`

If the library is not on Spring Initializr, search on [mvnrepository.com](https://mvnrepository.com) — but in that case you must add the version number manually.

**Why no version for Spring Boot dependencies?** The `<parent>` block in `pom.xml` points to `spring-boot-starter-parent`, which contains a BOM (Bill of Materials) — a tested list of compatible versions. Any dependency on that list works without a version tag.

**Critical step after adding any dependency: reload Maven.**

Adding a `<dependency>` block to `pom.xml` does not download the jar automatically. IntelliJ needs to reload the project to trigger the download. If you skip this, the dependency is declared but not in the classpath — the app still starts but silently ignores it, with no error.

Two ways to reload:

- Press `Ctrl + Shift + O` (the shortcut appears as a notification when you save `pom.xml`)
- Or open the Maven panel (right side, "m" icon) → right-click the project → **Reload project**

**How to verify a dependency was actually downloaded:**

Check that the jar exists in the local Maven cache. Maven stores every downloaded library under `C:\Users\Victor\.m2\repository\`, organised by group and artifact — yes, this is the folder to look in:

Example for Spring Security:

```
C:\Users\Victor\.m2\repository\org\springframework\boot\spring-boot-starter-security\4.0.6\
```

If the folder does not exist, Maven never downloaded it. Reload Maven and try again.

---

### Lombok — eliminating boilerplate code

Lombok is a Java library used in almost every Spring Boot project. It generates getters, setters, constructors, `equals()`, `hashCode()`, and `toString()` automatically — you never write them manually.

**Why it is needed:**

- JPA requires a no-args constructor to create entity objects when reading from the database
- Jackson (the JSON serializer) requires getters to convert entities to JSON
- Without Lombok, a class with 5 fields needs 15+ extra lines of boilerplate

**Source:** [start.spring.io](https://start.spring.io) → Add dependencies → search "Lombok" → Explore

**Step 1 — Add the dependency inside `<dependencies>` in `pom.xml`:**

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

`<optional>true</optional>` means Lombok is not included in the final `.jar` — it is only needed at compile time to generate the code.

**Step 2 — Update `spring-boot-maven-plugin` to exclude Lombok from the packaged jar:**

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

**Step 3 — Add `maven-compiler-plugin` so Java 25 uses Lombok as an annotation processor:**

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

This step is required from Java 21+ — the compiler needs to know explicitly that Lombok processes annotations before compiling.

**After saving `pom.xml`:** press `Ctrl + Shift + O` to reload Maven (or click the notification that appears).

The three Lombok annotations you will use most: **`@Data`** (getters, setters, `equals()`, `hashCode()`, `toString()`), **`@NoArgsConstructor`** (the empty constructor JPA needs to build an entity from a database row), and **`@AllArgsConstructor`** (a constructor with every field). You put them on entities and DTOs — see them on a real entity in [04-spring-data-jpa.md](./04-spring-data-jpa.md) and [layer-reference.md](./layer-reference.md). Entities, repositories, and DTOs are documented there; this file stays focused on project setup and configuration.

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

### Opening the project in IntelliJ for the first time

When you open the `backend` folder in IntelliJ, it does not automatically recognise the Maven project inside `timetrack/`. You need to tell it manually:

1. In the left panel, find `timetrack/pom.xml`
2. Right-click on it → **Add as Maven Project**
3. Wait for IntelliJ to download dependencies and finish indexing

After this step, IntelliJ recognises `TimetrackApplication.java` as runnable and shows a green arrow in the left margin next to `main()`.

**To run the app:** right-click `TimetrackApplication.java` → **Run 'TimetrackApplication.main()'**, or use `Shift + F10` once a run configuration exists.

---

### File by file

**`.idea/`** — IntelliJ's own folder. It stores which files are open, run configurations, code style settings. You never touch it. Add it to `.gitignore` so it does not go to GitHub — each developer has their own settings.

**`pom.xml`** — Maven's equivalent of `package.json`. Lists all dependencies and the Java version. When you add a new dependency (e.g. Spring Security), you add a `<dependency>` block here and IntelliJ downloads it automatically.

**`mvnw` / `mvnw.cmd`** — Maven wrapper scripts. They let IntelliJ run Maven commands without needing Maven installed globally on your machine. You do not run these manually.

**`HELP.md`** — auto-generated by Spring Initializr with links to docs. You can ignore it or delete it.

**`.gitignore`** — already configured with the right entries: `.idea/`, `target/` (compiled output), etc.

**`TimetrackApplication.java`** — the entry point. Has the `main()` method. You never touch this file.

**`application.properties`** — where all configuration goes: database URL, port, JWT secret, etc. Like an `.env` file in Node. Right now it only has one line — the "application.properties — central configuration" section further down develops it fully (database connection, JPA settings, and environment variables).

**`TimetrackApplicationTests.java`** — one empty test class. The starting point for your tests.

---

## @SpringBootApplication — the entry point (in `TimetrackApplication.java`)

Docs: https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html → read: "Using the @SpringBootApplication Annotation"

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

| Annotation                 | What it does                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| `@Configuration`           | Marks this class as a source of Spring beans                                                              |
| `@EnableAutoConfiguration` | Activates auto-configuration based on the classpath                                                       |
| `@ComponentScan`           | Scans the current package and all sub-packages for `@Component`, `@Service`, `@Repository`, `@Controller` |

The class must be in the root package so `@ComponentScan` finds all your components automatically.

---

## application.properties — central configuration

`src/main/resources/application.properties` is where all environment-specific configuration goes. No hardcoded values in the Java code. Think of it like an `.env` file.

All properties follow a namespace pattern: `spring.[feature].[setting]`. Once you know the namespace, you can find any property in the [official appendix](https://docs.spring.io/spring-boot/appendix/application-properties/index.html) or the [data access guide](https://docs.spring.io/spring-boot/reference/data/sql.html).

### Database connection — project 07 (TimeTrack)

**Step 1 — Create the database in pgAdmin.** Right-click your server → Create → Database. Name it `timetrack`. Owner: `postgres`.

**Step 2 — Configure `application.properties`:**

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

Docs: datasource keys (`spring.datasource.*`) and JPA keys (`spring.jpa.*`) are listed in the official appendix → https://docs.spring.io/spring-boot/appendix/application-properties/index.html — read: "Data Properties". The `ddl-auto` values (`update`, `create`, `validate`, `none`) are explained at https://docs.spring.io/spring-boot/how-to/data-initialization.html → read: "Initialize a Database Using Hibernate".

| Property                               | What it does                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `spring.datasource.url`                | JDBC URL — protocol + driver + host + port + database name apropiado                                                                    |
| `spring.datasource.username`           | PostgreSQL user                                                                                                                         |
| `spring.datasource.password`           | PostgreSQL password — never commit the real value to GitHub                                                                             |
| `spring.jpa.hibernate.ddl-auto=update` | Creates tables if they do not exist; updates them if the entity changes. Never use `create` in production (drops and recreates tables). |
| `spring.jpa.show-sql=true`             | Prints the SQL Hibernate generates to the console — useful while learning                                                               |

**How to verify the connection works:** run `TimetrackApplication.java` in IntelliJ and look for this line in the console:

```
HikariPool-1 - Start completed.
```

HikariPool is the connection pool Spring Boot uses by default. It opens a set of database connections on startup and reuses them for every request — faster than opening a new connection each time.

> **JDBC URL format:** `jdbc:postgresql://localhost:5432/timetrack`
>
> - `jdbc` — Java's standard protocol for database connections
> - `postgresql` — the specific driver (matches the dependency in `pom.xml`)
> - `localhost:5432` — host and port (5432 is PostgreSQL's default)
> - `timetrack` — the database name

---

### Environment variables in application.properties

Never commit real secrets (passwords, API keys, JWT secrets) to git. Use environment variables instead.

**Syntax:**

```properties
spring.datasource.password=${DB_PASSWORD}
```

Spring Boot reads the value of `DB_PASSWORD` from the environment at startup. If the variable is not set, the app fails to start — which forces you to always set it explicitly.

**With a default value:**

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:timetrack}
```

The syntax `${VARIABLE:default}` uses the default if the variable is not set. Useful for values that change between environments but are not secrets — locally the defaults work, in Docker you override them.

**Rule:** only secrets need env vars for security. Other values (host, port, database name) use defaults for local dev and get overridden in production.

**How to set env vars in IntelliJ:**

1. Top toolbar → click the dropdown next to the Run button → **Edit Configurations**
2. Click **Modify options** → **Environment variables**
3. Click **+** and add `Name` / `Value`

The values stay on your machine — they are never committed.

**Final `application.properties` for TimeTrack:**

```properties
spring.application.name=timetrack

spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

**If you accidentally commit a secret:** changing it in a new commit is not enough — the old commit is still visible in git history. The correct action is to **invalidate the credential immediately** (change the password, revoke the API key) so the leaked value becomes useless.

---

## Spring profiles — per-environment configuration

Purpose: Spring profiles let you have one config file per environment (local, staging, production) without changing the code. The right file is loaded automatically based on which profile is active.

Docs: https://docs.spring.io/spring-boot/reference/features/profiles.html → read: "Adding Active Profiles" and the properties file naming convention

File: `src/main/resources/`

You create additional properties files named `application-{profile}.properties`. The profile name in the filename is the key:

```
src/main/resources/
├── application.properties          ← shared settings (always loaded)
├── application-dev.properties      ← dev-only overrides (local database, show-sql)
└── application-prod.properties     ← production overrides (real credentials, no show-sql)
```

To activate the dev profile in IntelliJ: Run → Edit Configurations → Environment variables → add `SPRING_PROFILES_ACTIVE=dev`. Spring loads `application.properties` first, then overlays `application-dev.properties` on top. Values in the profile file win over the base file.

> **Why interviewers ask this:** "How do you avoid shipping development settings to production?" — profiles are the standard answer. Without them you either commit production credentials into the repo or manually edit the config before every deploy.

---

## @Slf4j — structured logging

Purpose: Lombok annotation that generates a `log` field on the class. You use `log.info()`, `log.warn()`, `log.error()` to write to the application log instead of `System.out.println()`.

Docs: https://www.baeldung.com/slf4j-with-log4j2-logback → read: "SLF4J — a logging facade" and the `@Slf4j` example

File: any service or component class, e.g. `src/main/java/com/victor/timetrack/service/ProjectService.java`

```java
@Slf4j
@Service
public class ProjectService {

    public ProjectResponse create(CreateProjectRequest request) {
        log.info("Creating project: {}", request.getName());  // {} is a placeholder for the value
        // ...
        log.warn("Project name is very long: {}", request.getName());
        log.error("Failed to create project", e);  // second arg is the exception — prints stack trace
    }
}
```

`@Slf4j` replaces this boilerplate: `private static final Logger log = LoggerFactory.getLogger(ProjectService.class)`. You see `@Slf4j` on every service class in real codebases — interviewers will ask about it during code review questions.

**`.info()` vs `.warn()` vs `.error()`:**

| Method | Use for |
|---|---|
| `log.info()` | Normal operations: "created resource X", "user logged in" |
| `log.warn()` | Unexpected but recoverable: "retry attempt 2/3", "deprecated path called" |
| `log.error()` | Something broke: pass the exception as the second argument to include the stack trace |

> The `{}` placeholder is SLF4J's lazy formatting — it does not build the string unless the log level is active, so it has no performance cost at high log levels.

---

## data.sql — seeding the database on startup

Purpose: Spring Boot runs `data.sql` automatically after creating the schema. Used to insert the first manager account when there is no registration endpoint for managers.

Docs: https://docs.spring.io/spring-boot/how-to/data-initialization.html → read: "Initialize a Database"

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

`ON CONFLICT (email) DO NOTHING` prevents a duplicate key error if the app restarts — Spring Boot runs `data.sql` every time the app starts, not just the first time.

> **The interview question:** "How did you create the first manager if there is no registration endpoint for managers?" — `data.sql` with a pre-hashed BCrypt password is the standard answer. You generate the hash once (with a small `main` method or an online tool) and commit it. The raw password is never in the source code.

### Execution order — why `data.sql` can fail on a fresh database

By default, Spring Boot runs `data.sql` **before** Hibernate creates or updates the schema, not after. On a project you have been running for a while this goes unnoticed — the tables already exist from previous runs. It only surfaces the day someone starts from a truly empty database: a fresh clone, a wiped local Postgres, or the Docker container in Step 11 booting Postgres from scratch. `data.sql` tries `INSERT INTO users` against a table that is not there yet, and the app fails to start.

Fix it with a property in `application.properties`:

```properties
spring.jpa.defer-datasource-initialization=true
```

Docs: https://www.baeldung.com/spring-boot-data-sql-and-schema-sql → read: "Deferring Datasource Initialization"

This tells Spring Boot: run Hibernate's schema creation/update first, and only run `data.sql` once the tables it depends on already exist. Without it, the two independent startup mechanisms — Hibernate building the schema, Spring Boot loading seed data — race in the wrong order.

> Set this from the start of the project, even before you hit the failure — it costs nothing when the schema already exists, and saves you a confusing "relation does not exist" error the first time you run against a clean database.

### `data.sql` silently does nothing — `spring.sql.init.mode`

Even with the ordering fixed, `data.sql` can simply be **ignored** — no error, no log line, the app starts fine and the table stays empty. This is because Spring Boot only runs `data.sql` automatically for **embedded** databases (H2, HSQL — the kind used in throwaway tests). PostgreSQL is an external, real database, so by default Spring Boot skips seeding it entirely.

```properties
spring.sql.init.mode=always
```

Docs: https://www.baeldung.com/spring-boot-data-sql-and-schema-sql → read the section on `spring.sql.init.mode`

This forces Spring Boot to run `data.sql` regardless of database type. Without it, the silence is the trap — there is nothing in the console pointing you toward this property, because nothing failed; the initializer bean simply decided there was no work to do.

---

### Case study — every error hit seeding a real Postgres database, in order

This is the actual sequence of failures from building `data.sql` for the first time against a live PostgreSQL instance — worth keeping as a reference, because each one teaches a different mechanism and they compound on top of each other.

**1. `ALTER TABLE ... add column active boolean not null` fails**

```
ERROR: column "active" of relation "users" contains null values
```

Adding `active` as `NOT NULL` to a table that already had rows — PostgreSQL has nothing to put in the old rows and refuses to leave them `NULL`. Fixed with `@ColumnDefault("true")` (see `04-spring-data-jpa.md`), which adds `DEFAULT true` to the same `ALTER TABLE`, so existing rows get backfilled automatically.

**2. Nothing happens at all — no error, no insert**

Diagnosed as `spring.sql.init.mode` defaulting to `embedded` (see above) — PostgreSQL is not embedded, so `data.sql` was silently skipped. Fixed with `spring.sql.init.mode=always`.

**3. `there is no unique or exclusion constraint matching the ON CONFLICT specification`**

`ON CONFLICT (email)` needs a `UNIQUE` constraint on `email` to know what counts as a conflict — there wasn't one. Adding `@Column(unique = true)` to the entity did **not** fix it: Hibernate's `ddl-auto=update` reliably adds new columns and tables, but is unreliable at retrofitting a constraint onto a column that already existed before the annotation was added. Confirmed by checking pgAdmin's **Constraints → Unique** tab on the table — empty, even after restarting with the annotation in place. Fixed by running the `ALTER TABLE` by hand, once, in pgAdmin's Query Tool:

```sql
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
```

> This exact limitation — `ddl-auto` being unreliable for altering existing columns — is why real projects use a migration tool (Flyway, Liquibase) instead of leaving schema evolution to Hibernate's guesswork.

**4. `null value in column "id" of relation "users" violates not-null constraint`**

The `INSERT` did not list a value for `id`. With `@GeneratedValue` and no explicit strategy (`AUTO`), Hibernate does not give the `id` column a database-level `DEFAULT` — instead, Hibernate itself queries a sequence and supplies the id value in the `INSERT` it generates, entirely in Java. `data.sql` bypasses Hibernate completely, so that never happens — the column has no default of its own, and PostgreSQL falls back to `NULL`. Fixed by pulling the next value from the same sequence Hibernate uses, directly in the SQL:

```sql
INSERT INTO users (id, email, password, name, role, active)
VALUES (nextval('users_seq'), 'manager@timetrack.com', ...)
ON CONFLICT (email) DO NOTHING;
```

**Finding the right sequence name:** two sequences existed for this table — `user_seq` and `users_seq` — because the entity's table name changed from the default (`user`, derived from the class name) to the explicit `@Table(name = "users")` at some point. Hibernate created a new sequence to match the new table name but never dropped the old one. Checking `last_value` on both did not help (neither had ever been consumed — the one existing test row had been typed directly into pgAdmin's row editor, not inserted through the app). The reliable check was comparing against a sibling entity: `Project` has `@Table(name = "projects")` and its sequence is `projects_seq` — same convention, table name plus `_seq`. That confirmed `users_seq` was the live one for `User`.

> The general lesson underneath all four: `data.sql` runs as **raw SQL against the real database**, completely outside Hibernate. Every convenience Hibernate normally gives you for free — defaults, generated ids, validated constraints — has to already exist *in the database itself* before `data.sql` can rely on it. None of these were Java bugs; each one was a gap between what Hibernate does at the application level and what it had actually written into the schema.
