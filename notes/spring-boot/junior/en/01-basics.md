# Spring Boot — Basics

> 📖 [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start)
> 📖 [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/reference/)

---

[00-intro-spring-boot.md](./00-intro-spring-boot.md) gave you the map: Spring Boot is Spring with the three setup chores deleted — hand-wiring beans, installing a servlet container, and deploying a `.war` into it. It also promised that the *mechanism* behind that deletion — the classpath, `@ConditionalOnClass`, starters, the fat jar — would be traced here. That is this file's job. You leave it with a project that runs, a database it can talk to, and the ability to answer *how* Spring Boot configures itself instead of just asserting that it does.

---

## Why Spring Boot exists

Docs: https://www.baeldung.com/spring-vs-spring-boot → read: the "Spring Boot" section (the comparison table at the end is the interview answer in one screen)

Before we get into Spring Boot, three terms you will see constantly:

- **Tomcat** — a web server. It is a program that listens on a network port (like 8080) and receives HTTP requests from browsers or clients. Without a web server, your Java code has no way to accept HTTP connections. Before Spring Boot, you had to download Tomcat separately, install it, configure it, and deploy your app into it.
- **`.jar`** — a packaged Java application. It is essentially a zip file that contains all your compiled code and can be run directly with `java -jar app.jar`. When you build a Spring Boot project, Maven produces a single `.jar` that contains your code and everything it needs (including Tomcat).
- **Bean** — an object Spring creates, owns, and hands to whoever needs it, instead of you writing `new UserService()`. That is the IoC idea from [00-intro-spring-boot.md](./00-intro-spring-boot.md#the-ioc-container--the-one-idea-everything-else-depends-on), and the full mechanism (scopes, injection, `@Bean`) lives in [18-dependency-injection.md](./18-dependency-injection.md) — for this file, "bean" just means *an object the framework built for you*.
- **Jackson** — the library Spring Boot uses to convert between Java objects and JSON. When a controller returns a Java object, Jackson turns it into the JSON the client receives; when a request arrives with a JSON body, Jackson turns it back into a Java object. It runs automatically — it reads your public getters (or the ones Lombok generates) to decide which fields to include. You never call it yourself; Spring Boot wires it in. You see it working end to end in [02-rest-controllers.md](./02-rest-controllers.md).

---

Plain Spring requires a lot of manual setup and a separately installed server. Spring Boot was created to remove that friction. It does it with two core ideas:

1. **Auto-configuration** — Spring Boot reads your dependencies and configures beans for you automatically. Add `spring-boot-starter-data-jpa` to the pom.xml and Spring Boot configures the database connection, EntityManager, and transaction support without any extra code.
2. **Embedded server** — Spring Boot includes Tomcat inside the `.jar`. You run `java -jar app.jar` and the server starts. No separate server installation needed.

The repeating pattern: **annotations replace configuration**. Before Spring Boot, you wrote XML to wire beans together. Now, you annotate a class with `@Service` and Spring Boot handles creating and connecting the objects for you.

---

## Spring Boot internals — why a starter "just works"

The two ideas above (auto-configuration and the embedded server) are the headline. But in an interview "it configures itself" is not an answer — the follow-up is always *how?*. This section traces the three mechanisms underneath, because they are exactly the questions a screener uses to separate someone who *added* dependencies from someone who *understands* the build: "how does Spring Boot know how to configure your `DataSource`?", "what does `spring-boot-starter-web` actually bring in?", and "how does your app serve HTTP with no Tomcat installed?".

Docs: https://www.baeldung.com/spring-boot-autoconfiguration → read: "Understanding Auto-Configuration" and the `@Conditional` example

### The classpath — the one word all three mechanisms depend on

Everything below hangs on one idea, so pin it down first. The **classpath** is the full list of compiled classes your app can see at runtime: your own code plus every `.jar` Maven downloaded from the dependencies in `pom.xml`. When you add `spring-boot-starter-data-jpa` and reload Maven, the Hibernate and JDBC jars land in the classpath — meaning classes like `org.hibernate.SessionFactory` are now *present and loadable*. When you remove the dependency, they are gone. Spring Boot's whole "magic" is nothing more than **looking at what is on the classpath and reacting to it**.

> Think of the classpath as the set of tools laid out on the workbench. Spring Boot walks past the bench at startup and, for each tool it sees, sets up the workstation that uses it. No tool on the bench → that workstation is never built. Nothing is guessed; it is all a reaction to what is physically there.

### 1. Auto-configuration — the mechanism, not the magic

`@SpringBootApplication` includes `@EnableAutoConfiguration` (see the annotation table further down). At startup, that annotation triggers Spring Boot to load a long list of pre-written configuration classes shipped inside the Spring Boot jars — one per technology (`DataSourceAutoConfiguration`, `JpaRepositoriesAutoConfiguration`, `WebMvcAutoConfiguration`, and dozens more). Each one is a `@Configuration` class full of `@Bean` methods that know how to wire up that technology.

The trick is that **none of them run unconditionally**. Every auto-configuration class is guarded by `@Conditional` annotations that Spring evaluates against your classpath and your existing beans before deciding whether to activate it. The two you must be able to name:

- **`@ConditionalOnClass(DataSource.class)`** — "only run this configuration if this class is on the classpath". `DataSourceAutoConfiguration` is annotated with it, so it activates *only* when a JDBC/datasource class is present — which happens the moment `spring-boot-starter-data-jpa` puts it there. No JPA starter → the class is absent → the whole datasource configuration is skipped. This is why adding a starter "just works": the starter drops the classes on the classpath, and the matching auto-configuration wakes up on its own.
- **`@ConditionalOnMissingBean`** — "only create this bean if the developer hasn't already defined one of the same type". Spring Boot's beans are all **defaults that step aside**. If you never define a `DataSource`, Spring Boot's auto-configured one is used; the moment you declare your own `@Bean DataSource`, `@ConditionalOnMissingBean` sees it and Spring Boot backs off silently. You override by *defining*, never by editing framework config.

Walking the real question an interviewer asks — *"how does Spring Boot know how to configure your `DataSource`?"*:

```
1. spring-boot-starter-data-jpa in pom.xml
        → puts Hibernate + JDBC jars on the CLASSPATH
2. @EnableAutoConfiguration loads DataSourceAutoConfiguration
        → it is guarded by @ConditionalOnClass(DataSource.class)
3. DataSource.class IS on the classpath  → condition passes → config activates
4. @ConditionalOnMissingBean → you defined no DataSource yourself
        → Spring Boot creates the default one, reading spring.datasource.* from application.properties
5. A ready DataSource bean exists — you wrote zero configuration
```

That is the entire answer, and it is a much stronger one than "it's automatic". The `spring.datasource.url`/`username`/`password` lines you set in [application.properties](#applicationproperties--central-configuration) are the values this auto-configured bean reads — the properties and the auto-configuration are two halves of the same mechanism.

> **Why this beats XML.** In classic Spring you wrote a `<bean id="dataSource" ...>` block by hand for every piece of infrastructure. Auto-configuration inverts it: the framework assumes the *conventional* setup and only asks you for the values that are genuinely project-specific (the URL, the credentials). "Convention over configuration" is the name of this idea — you configure the exceptions, not the defaults.

### 2. Starters — curated, version-aligned bundles

A **starter** is not code. It is an (almost) empty jar whose only job is to declare a curated list of *other* dependencies with versions that are already tested to work together. `spring-boot-starter-webmvc` contains virtually no classes of its own — open it and it is essentially a `pom.xml` that pulls in Spring MVC, the Jackson JSON library, and the embedded Tomcat, all at compatible versions. One line in your `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
</dependency>
```

drags in a whole layer's worth of libraries. That is what "starter" means — a *starting point* for a capability, bundled so you don't assemble it dependency by dependency.

> **Careful with the name: it is `spring-boot-starter-webmvc`, not `spring-boot-starter-web`.** Every tutorial, StackOverflow answer and Baeldung article written before Spring Boot 4 says `spring-boot-starter-web` — that was the artifact name for a decade. Spring Boot 4 (the version TimeTrack uses, 4.0.6) renamed it to `spring-boot-starter-webmvc`, because Spring MVC is now only *one* of the web stacks Boot ships (WebFlux is the other), and the old catch-all name had stopped saying which one you were asking for. If you copy a `<dependency>` block from an older article you will get an artifact Maven cannot resolve. Read `spring-boot-starter-web` in any pre-2026 text as "what is now `-webmvc`".

The starters you use in TimeTrack — this table is read straight off `backend/timetrack/pom.xml`:

| Starter (exact artifactId in the pom) | Brings in (the layer it bootstraps) |
| --- | --- |
| `spring-boot-starter-webmvc` | Spring MVC, `@RestController`/`@GetMapping`, Jackson (JSON), **embedded Tomcat** |
| `spring-boot-starter-data-jpa` | Spring Data JPA, Hibernate, the JDBC/transaction plumbing |
| `spring-boot-starter-security` | Spring Security — the filter chain, `BCryptPasswordEncoder`, method-level `@PreAuthorize` |
| `spring-boot-starter-validation` | Bean Validation (`@NotBlank`, `@Email`) plus its Hibernate Validator implementation |
| `spring-boot-starter-webmvc-test` | Test support for the web layer — JUnit 5, Mockito, AssertJ, `MockMvc` (`<scope>test</scope>`) |
| `spring-boot-starter-data-jpa-test` | Test support for the persistence layer — `@DataJpaTest` and its slice (`<scope>test</scope>`) |

Read the table as: *one line in the left column* is all you write; *the entire right column* is what arrives on the classpath — which then triggers the auto-configuration from section 1. Starters and auto-configuration are a pair: **the starter puts the classes on the classpath; auto-configuration reacts to them.** The two `test` rows are the exception to "one starter = one runtime capability": they add nothing to the running app (`<scope>test</scope>` keeps them out of the final jar) and exist only so your tests compile and run.

> **The single `spring-boot-starter-test` is also a Boot 3 name.** Older projects have exactly one test starter that bundled everything. Boot 4 split it per slice — you take `-webmvc-test` for controller tests and `-data-jpa-test` for repository tests, which is why TimeTrack's pom has two `test`-scoped starters rather than one. Same tools underneath (JUnit 5, Mockito, AssertJ); they just arrive in two packages now. You use them for real in [09-testing.md](./09-testing.md).

> **JJWT is the odd one out in the pom.** The three `io.jsonwebtoken` dependencies (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) are *not* Spring starters — they are a third-party library, so nobody has pre-agreed their version for you. That is exactly why they are the only blocks in `pom.xml` that carry an explicit `<version>0.12.6</version>` tag: they are not in the `spring-boot-starter-parent` BOM, so the parent has no opinion about them and you must state the version yourself. See [06-security-jwt.md](./06-security-jwt.md).

> **Why not add Spring MVC, Jackson, Tomcat, and validation one by one yourself?** You could — but then *you* own the job of picking versions that don't clash, and a Jackson version that quietly disagrees with your Spring MVC version is a miserable afternoon. The starter is a version contract: someone already tested this exact set together. Combined with `spring-boot-starter-parent` (the `<parent>` in `pom.xml`, which holds a BOM — a Bill of Materials listing tested versions), it is why your `<dependency>` blocks for Spring libraries carry **no `<version>` tag** at all. The parent decides the version; the starter decides the set.

### 3. The embedded server — how `java -jar` serves HTTP with nothing installed

The classic Java web deployment was: install Tomcat as a separate program on the server, build your app into a `.war` file, and drop the war into Tomcat's `webapps/` folder. The server was the container; your app was the guest living inside it.

Spring Boot flips that relationship. `spring-boot-starter-webmvc` puts Tomcat's classes **on the classpath as an ordinary library**, and auto-configuration (section 1) sees them and starts an embedded Tomcat instance from *inside* your application during `SpringApplication.run(...)`. The server is now the guest and your app is the host. Because Tomcat is just more classes in the same jar, the build produces a single self-contained **fat jar** (also called an "uber jar") — your compiled code, every dependency, and Tomcat, all zipped into one file. So:

```
java -jar timetrack.jar
        → main() runs → SpringApplication.run(...)
        → auto-config sees Tomcat on the classpath
        → starts an embedded Tomcat, bound to port 8080
        → your @RestController endpoints are now serving HTTP
```

No Tomcat installed on the machine, no war, no `webapps/` folder — the only requirement on the server is a Java runtime. This is the single sharpest **Spring-Boot-vs-classic-Spring** difference an interviewer probes with "how does your app serve HTTP without a Tomcat installed?". The answer: the server is embedded inside the fat jar, started programmatically at boot.

> **This is why the Dockerfile is so short.** Because the jar already contains the server, containerising the app is just "put a Java runtime in the image, copy the jar in, run `java -jar`" — no base image with a pre-installed application server. You'll see exactly that `FROM eclipse-temurin` + `java -jar` pattern when the project reaches the Docker step.

> **You can swap the server, and that proves the point.** Exclude Tomcat from `spring-boot-starter-webmvc` and add `spring-boot-starter-jetty`, and the app runs on Jetty instead — you changed nothing but the classpath, and auto-configuration started a different server. The container is a dependency, not a fixed part of the platform.

---

## Spring Initializr — starting a project

Docs: https://www.baeldung.com/spring-boot-start → read: the section on generating the project with Spring Initializr and what lands in the generated `pom.xml`

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

Read the third column first — it is the one that saves you time. "Yes, always" means the field is a **ritual**: you set it once the same way on every project you will ever start, so stop thinking about it. Only the rows that do *not* say "yes" are real decisions, and there are only three of them: the **Artifact** (the project's name), the **Group** (who owns it), and the **Java** version (whatever is actually installed on your machine — a mismatch here is the classic "project won't compile the moment you open it").

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
| **Spring Web** (the Initializr label; the artifact it adds is `spring-boot-starter-webmvc` on Boot 4) | The embedded HTTP server (Tomcat) and the annotations to build REST endpoints (`@RestController`, `@GetMapping`, etc.) |
| **Spring Data JPA**                                                                     | Tools to talk to the database without writing SQL by hand. You define Java classes and Spring generates the queries.   |
| **PostgreSQL Driver**                                                                   | The connector between Java and PostgreSQL. Without this, Spring cannot open a database connection.                     |
| **Spring Security**                                                                     | Authentication and authorisation. Blocks all endpoints by default until you configure which routes are public.         |
| **Validation** (this is the exact name to search on Initializr — artifact `spring-boot-starter-validation`) | Bean Validation annotations (`@NotBlank`, `@NotNull`, `@Email`, `@Min`) for validating request bodies.                 |
| **Lombok**                                                                              | Code generation at compile time — eliminates boilerplate getters, setters, and constructors from entity classes.       |
| **Test starters** (not a checkbox — Initializr always adds them automatically)           | JUnit 5 + Mockito + AssertJ. On Boot 4 they arrive as two `test`-scoped starters (`spring-boot-starter-webmvc-test`, `spring-boot-starter-data-jpa-test`), matched to the dependencies you ticked. Already in the generated `pom.xml`; you never add them by hand. |
| **JJWT\*** (manual)                                                                     | JWT library for creating and validating tokens. Must be added manually from mvnrepository.com (three artifacts).       |

Read this table as *one row = one capability the app gains*, not "a library you must learn". Ticking **Spring Web** does not mean you now have to study Tomcat; it means HTTP endpoints become possible. The parenthesised notes matter more than they look: the `\*` on **JJWT** is the only row Initializr cannot give you (you paste it into `pom.xml` by hand — see the next section), **Validation** is the exact string to type into the search box because "Bean Validation" finds nothing, and the **Test starters** row is on the list purely so you do not go hunting for a checkbox that isn't there. Cross-check it against the starters table above: each row here is the Initializr *label*, and what it actually drops on the classpath is the starter jar.

---

## Adding dependencies after project creation

Docs: https://www.baeldung.com/maven → read: "Dependency Management" (what a `<dependency>` block is made of: groupId, artifactId, version)

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

Purpose: a compile-time code generator you put on entities, DTOs and service classes so you never hand-write getters, setters, constructors, `equals()`, `hashCode()` or `toString()` — the annotation is expanded into real Java methods before the compiler runs.

File: `backend/timetrack/pom.xml` (the dependency + the two plugins below); the annotations themselves live on entities, e.g. `src/main/java/com/victor/timetrack/model/User.java`

Docs: https://www.baeldung.com/intro-to-project-lombok → read: "@Data", "@NoArgsConstructor / @AllArgsConstructor" and the annotation-processor setup

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

The three Lombok annotations you will use most: **`@Data`** (getters, setters, `equals()`, `hashCode()`, `toString()`), **`@NoArgsConstructor`** (the empty constructor JPA needs to build an entity from a database row), and **`@AllArgsConstructor`** (a constructor with every field). You put them on entities and DTOs — see them on a real entity in [03-spring-data-jpa.md](./03-spring-data-jpa.md) and [layer-reference.md](../.../../../layer-reference.md). Entities, repositories, and DTOs are documented there; this file stays focused on project setup and configuration.

> **The getter for a `boolean` field isn't called `getXxx()` — it's called `isXxx()`.** Lombok follows the standard JavaBeans convention here (the same one Jackson and nearly every Java library use): for a **primitive** `boolean` field (lowercase), the generated getter is `isActive()`, not `getActive()`. This **only** applies to the primitive `boolean` — if the field were `Boolean` with a capital B (the wrapper class, an object just like `String` or `Long`), Lombok generates `getActive()`, same as any other field. It's easy to mix up because both cases show up side by side in this project: `User.active` is primitive `boolean` → `user.isActive()`; if you spot a `Boolean` (capital) field on another entity, that one would be `getActive()`. Compile it and check which one you have on each entity if you're unsure — IntelliJ's own autocomplete confirms it as soon as you type `user.` and see which getter shows up in the list.

**A fourth one you'll see constantly in real codebases: `@RequiredArgsConstructor`.** It generates a constructor for only the `private final` (and `@NonNull`) fields — exactly the fields constructor injection needs, nothing else. Every service and controller in this project writes that constructor by hand instead — for example `AuthService`'s `public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil) { this.authenticationManager = authenticationManager; this.jwtUtil = jwtUtil; }` (see [18-dependency-injection.md](./18-dependency-injection.md)). That hand-written constructor is *exactly* what `@RequiredArgsConstructor` generates for you — TimeTrack writes it explicitly on purpose, so the injection mechanism stays visible while you're learning it. Once it clicks, real projects reach for the annotation instead, so a class with five `private final` dependencies doesn't need five lines of repeated boilerplate.

> **`@AllArgsConstructor` vs `@RequiredArgsConstructor`:** `@AllArgsConstructor` generates a constructor with *every* field, in declaration order — useful on DTOs and entities, where every field is data you want to set directly. `@RequiredArgsConstructor` only picks up `private final` (and `@NonNull`) fields — exactly what a `@Service` or `@Controller` needs, since its only fields are the dependencies injected through the constructor. Rule of thumb: `@AllArgsConstructor` on DTOs, `@RequiredArgsConstructor` on service/controller classes.

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

Docs: https://www.baeldung.com/spring-boot-annotations → read: the `@SpringBootApplication` entry and the three annotations it bundles (secondary, official: https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html)

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

| Annotation                 | What it does                                                                                              | Where you meet it again |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| `@Configuration`           | Marks this class as a source of Spring beans — a place where `@Bean` methods may live                     | [18-dependency-injection.md](./18-dependency-injection.md) — you write your own `@Configuration` class there |
| `@EnableAutoConfiguration` | Activates auto-configuration based on the classpath (the `@ConditionalOnClass` mechanism traced above)    | Already traced in this file, §"Spring Boot internals" |
| `@ComponentScan`           | Scans the current package and all sub-packages for `@Component`, `@Service`, `@Repository`, `@Controller` | The scan step by step is in [00-intro-spring-boot.md](./00-intro-spring-boot.md); the beans it finds are the `@RestController` of [02-rest-controllers.md](./02-rest-controllers.md) and the `@Repository` of [03-spring-data-jpa.md](./03-spring-data-jpa.md) |

Read the third column as a forward reference, not extra reading: **you don't need any of it to make the app boot** — the three annotations are already doing their work with zero code from you. The column exists so that when a `@RestController` in file 02 or a `JpaRepository` in file 04 is picked up "automatically", you remember that *this* line on *this* class is the reason.

The class must be in the root package so `@ComponentScan` finds all your components automatically.

---

## application.properties — central configuration

Docs: https://www.baeldung.com/properties-with-spring → read: "Registering Properties" and the `${...}` placeholder syntax (secondary, the full key list: https://docs.spring.io/spring-boot/appendix/application-properties/index.html)

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
| `spring.datasource.url`                | JDBC URL — protocol + driver + host + port + database name                                                                              |
| `spring.datasource.username`           | PostgreSQL user                                                                                                                         |
| `spring.datasource.password`           | PostgreSQL password — never commit the real value to GitHub                                                                             |
| `spring.jpa.hibernate.ddl-auto=update` | Creates tables if they do not exist; updates them if the entity changes. Never use `create` in production (drops and recreates tables). |
| `spring.jpa.show-sql=true`             | Prints the SQL Hibernate generates to the console — useful while learning                                                               |

Read the left column as the *namespace*, not as a magic string: the three `spring.datasource.*` keys are read by the auto-configured `DataSource` bean from §"Auto-configuration" above, and the two `spring.jpa.*` keys are read by Hibernate's auto-configuration. That is the whole reason these lines have any effect — nothing in your Java code ever reads them; a `@ConditionalOnClass` bean somewhere in a Spring Boot jar does. Notice the last two rows carry the **value** in the key (`ddl-auto=update`, `show-sql=true`): that is because the value *is* the lesson — `ddl-auto` is the row that can drop your production tables if you type `create` instead of `update`.

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

**The real `application.properties` for TimeTrack** (the whole file, copied from `backend/timetrack/src/main/resources/application.properties`):

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

Two of those keys are not `spring.*` at all — `app.jwt.secret` and `app.jwt.expiration`. That is the point: **any key you invent is a valid property.** `spring.*` keys are read by Spring Boot's own auto-configuration; a key under a namespace *you* made up (`app.*` here) is read by *your* code, with `@Value("${app.jwt.secret}")` in `JwtUtil` — you see exactly that in [06-security-jwt.md](./06-security-jwt.md). The secret is an env var for the reason above; `86400000` is milliseconds — 24 hours — and is not a secret, so it sits in the file in plain sight.

The other two — `spring.jpa.defer-datasource-initialization` and `spring.sql.init.mode` — exist because of `data.sql`; they are earned the hard way in the "data.sql" section below, so ignore them for now.

**If you accidentally commit a secret:** changing it in a new commit is not enough — the old commit is still visible in git history. The correct action is to **invalidate the credential immediately** (change the password, revoke the API key) so the leaked value becomes useless.

---

## Spring profiles — per-environment configuration

Purpose: Spring profiles let you have one config file per environment (local, staging, production) without changing the code. The right file is loaded automatically based on which profile is active.

Docs: https://www.baeldung.com/spring-profiles → read: "Using @Profile" and "Setting the Active Profile" (secondary, official: https://docs.spring.io/spring-boot/reference/features/profiles.html)

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

Adding `active` as `NOT NULL` to a table that already had rows — PostgreSQL has nothing to put in the old rows and refuses to leave them `NULL`. Fixed with `@ColumnDefault("true")` (see `03-spring-data-jpa.md`), which adds `DEFAULT true` to the same `ALTER TABLE`, so existing rows get backfilled automatically.

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

---

## Where this leaves you — and what comes next

The app now **boots**: Maven has the right dependencies, auto-configuration turns them into beans, an embedded Tomcat is listening on port 8080, `application.properties` points it at a real PostgreSQL database, and `data.sql` has put the first manager row in it. Everything you configured in this file is *infrastructure* — it runs before a single request arrives, and none of it is code a user can reach.

Which is exactly the hole: Tomcat is listening, and **there is nothing to answer**. Every URL you type returns a 404 (or, once Spring Security is in the pom, a login page), because you have not written a single endpoint. The `@ComponentScan` you just met is standing there scanning your packages and finding no controllers to register.

That is where [02-rest-controllers.md](./02-rest-controllers.md) picks up: `@RestController`, `@GetMapping`/`@PostMapping`, and how a JSON body arriving on port 8080 gets turned into a Java object and handed to one of your methods. The setup is done — from here on, everything you write is the application itself.
