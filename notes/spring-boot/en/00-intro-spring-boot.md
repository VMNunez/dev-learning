# Introduction to Spring Boot

Docs: [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → read the "Spring Boot" and "Auto Configuration" sections

---

## Spring vs Spring Boot — the framework and the shortcut

**Spring** (the framework) has always been able to do everything Spring Boot does — dependency injection, a web layer, database access, security. The problem was never *capability*, it was *setup*: to run a plain Spring web app, you configured an XML file (or a Java `@Configuration` class) listing every bean by hand, downloaded and installed a servlet container like Tomcat yourself, and deployed your app into it as a `.war` file.

**Spring Boot** is not a different framework — it is Spring plus a layer that removes that setup. It does this with two ideas, both covered in depth in [01-basics.md](01-basics.md):

- **Auto-configuration** — Spring Boot looks at what is on your classpath (which dependencies you added to `pom.xml`) and configures the matching beans for you. Add `spring-boot-starter-data-jpa` and it wires the database connection, the `EntityManager`, and transaction support without you writing a line of config.
- **Embedded server** — Tomcat ships *inside* your `.jar`. `java -jar app.jar` starts the server itself; there is nothing to install separately.

> If you remember one sentence from this file: **Spring Boot did not remove any of Spring's ideas — it removed the manual wiring around them.** Everything below (beans, the IoC container, annotations) is still Spring underneath.

---

## The IoC container — the one idea everything else depends on

Spring's central concept is **Inversion of Control (IoC)**: instead of your code creating the objects it depends on (`new TransactionRepository()`), you declare what you need and a container creates and hands it to you. That container is called the **ApplicationContext**, and the objects it manages are called **beans** — full explanation with the "why" in [03-dependency-injection.md](03-dependency-injection.md).

```
Without IoC (you control creation):
  TransactionService {
      private TransactionRepository repository = new TransactionRepository();
  }

With IoC (the container controls creation):
  TransactionService {
      private final TransactionRepository repository;   // handed to you
      TransactionService(TransactionRepository repository) { this.repository = repository; }
  }
```

> **Why this matters before anything else.** Once you understand that Spring's job is "find every class annotated as a bean, create one instance of each, and wire them together by matching constructor parameters to bean types," almost every annotation in this topic (`@Service`, `@Repository`, `@Bean`, `@Autowired`) stops looking like separate magic and becomes one mechanism applied in different places.

---

## Annotations replace configuration — the repeating pattern

Before Spring Boot (and even in early Spring), you wired beans together in XML: `<bean id="transactionService" class="..."><constructor-arg ref="transactionRepository"/></bean>`. Every class needed a matching XML block.

Spring Boot's convention is the opposite: put an annotation on the class, and the container discovers it automatically by scanning the package.

| Annotation | What it marks |
|---|---|
| `@Component` | Any Spring-managed class (generic) |
| `@Service` | Business logic layer |
| `@Repository` | Data access layer |
| `@RestController` | Web layer — handles HTTP |
| `@Configuration` + `@Bean` | A bean you can't annotate directly (a library class) |

This is why reading a Spring Boot class is mostly reading its annotations first — they tell you *what role* the class plays before you read a single method.

---

## The request lifecycle — how the layers connect

Every HTTP request that reaches a TimeTrack endpoint travels through the same fixed path. This is the mental map to hold before diving into any single layer's file:

```
HTTP request
     ↓
[Security filter chain]   ← validates the JWT, rejects if not authenticated (06-security-jwt.md)
     ↓
[Controller]              ← reads the request, returns a response (02-rest-controllers.md)
     ↓
[Service]                 ← business logic, @Transactional boundary (08-transactions.md)
     ↓
[Repository]              ← talks to the database via Spring Data JPA (04-spring-data-jpa.md)
     ↓
Database
```

Every numbered file in this folder zooms into one link of that chain. When something in a specific file feels disconnected, come back to this diagram — it almost always fits into one box here.

---

## Where TimeTrack fits — this folder maps to one real project

Everything in `01`–`10` is taught against **project 07 (TimeTrack)** — a real Spring Boot + Angular + PostgreSQL app, not toy examples. `layer-reference.md` in this folder has the quick-reference version of the layered structure (using a `Transaction` example); `coverage.md` lists every concept a Spanish consultancy screening expects a junior to explain with a real example from that project.

**Reading order for this folder:** `01` (setup) → `02` (controllers) → `03` (DI/beans — the mechanism behind `01` and `02`) → `04` (persistence) → `05` (exceptions) → `06` (security) → `07` (validation) → `08` (transactions) → `09` (testing) → `10` (tooling). Section 0 / Section 15 of the project's `PLANNING.md` says which step is currently active — that is what decides which file to read next in a live session.
