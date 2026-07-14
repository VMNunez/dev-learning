# Introduction to Spring Boot

Docs: [Baeldung — Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → read the "Spring Boot" and "Auto Configuration" sections

---

## Spring vs Spring Boot — the framework and the shortcut

Docs: https://www.baeldung.com/spring-vs-spring-boot → read: the "Spring" and "Spring Boot" sections (skip the Spring MVC part for now — you meet it in `02`)

**Spring** (the framework) has always been able to do everything Spring Boot does — dependency injection, a web layer, database access, security. The problem was never *capability*, it was *setup*. To put a plain Spring web app online, three chores were yours:

1. **List every bean by hand** in an XML file (or, later, a Java `@Configuration` class). One block per class, with its dependencies wired explicitly.
2. **Install a servlet container** — a separate program you download onto the machine (Tomcat, JBoss, WebSphere) whose whole job is to sit on a network port, accept incoming HTTP requests, and hand each one to a Java class that knows how to answer it. Your Java code cannot listen on a port by itself; the container is the piece that can. "Servlet" is just the old Java name for *a class that handles one HTTP request* — the container is the thing that contains and runs them.
3. **Deploy your app into it** as a `.war` file — a **W**eb **A**pplication A**R**chive: a zip of your compiled classes with a fixed internal layout that the container knows how to unpack. You copied the `.war` into Tomcat's `webapps/` folder and Tomcat ran it. Your app was a *guest* inside a server somebody else installed.

**Spring Boot** is not a different framework — it is Spring plus a layer that deletes all three chores. Auto-configuration deletes chore 1; the embedded server deletes chores 2 and 3, because Tomcat now ships *inside* your `.jar` and `java -jar app.jar` starts it from within your own `main()`. The server became the guest and your app became the host.

> **This is the map, not the mechanism.** You have just seen *what* Spring Boot removed and *why the pain existed*. **How** it removes it — the classpath, `@ConditionalOnClass`, starters, the fat jar — is traced step by step in [01-basics.md](01-basics.md), and that is the version an interviewer actually probes. This file's job is to hand you the vocabulary (`bean`, `container`, `classpath`, `starter`) so that file reads as an explanation instead of a glossary.

> If you remember one sentence from this file: **Spring Boot did not remove any of Spring's ideas — it removed the manual wiring around them.** Everything below (beans, the IoC container, annotations) is still Spring underneath. That is also why an interviewer asking "what is Spring Boot?" is not happy with "a framework" — the honest answer is "Spring, with the setup automated".

---

## The IoC container — the one idea everything else depends on

Docs: https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring → read: "What Is Inversion of Control?" and "What Is Dependency Injection?" (stop before the XML examples — Spring Boot uses annotations instead)

Spring's central concept is **Inversion of Control (IoC)**: instead of your code creating the objects it depends on (`new TransactionRepository()`), you declare what you need and a container creates and hands it to you. That container is called the **ApplicationContext**, and the objects it manages are called **beans** — full explanation with the "why" in [03-dependency-injection.md](03-dependency-injection.md).

The word "inversion" is doing real work there, so make it concrete. **Think of a restaurant kitchen.** Without IoC, every cook goes out and buys their own tomatoes: they decide the supplier, they carry the crate in, and if the supplier changes, every cook has to be retrained. With IoC there is a *storeroom manager* — you post a note saying "I need tomatoes" and a crate is on your bench when you arrive. The cook no longer *controls* where the tomatoes come from; that control was **inverted** and handed to the manager. Swapping the supplier is now one change in one place, and nobody in the kitchen notices. Spring's ApplicationContext is that storeroom manager, your `@Service` classes are the cooks, and the constructor parameter is the note.

```java
// ❌ MAL — no IoC: the class controls creation
class TransactionService {
    private TransactionRepository repository = new TransactionRepository();
    // hardcoded to this exact class forever; a test cannot slip a fake in
}

// ✅ BIEN — IoC: the container controls creation
class TransactionService {
    private final TransactionRepository repository;   // handed to you
    TransactionService(TransactionRepository repository) {   // "I need one of these"
        this.repository = repository;
    }
}
```

> **Why the `new` version is actually wrong, not just old-fashioned.** Two consequences, and both bite. First, `TransactionService` is now welded to that one concrete class — if you ever need a different implementation (a cached one, a mock, a Postgres-vs-H2 variant) you must edit the service itself. Second, and this is the one that shows up in [09-testing.md](09-testing.md): a unit test cannot substitute a fake repository, because the object is created *inside* the class where no test can reach it. Constructor injection makes the dependency an **input**, and anything that is an input can be swapped — by Spring in production, by Mockito in a test.

> **Why this matters before anything else.** Once you understand that Spring's job is "find every class annotated as a bean, create one instance of each, and wire them together by matching constructor parameters to bean types," almost every annotation in this topic (`@Service`, `@Repository`, `@Bean`, `@Autowired`) stops looking like separate magic and becomes one mechanism applied in different places.

---

## Annotations replace configuration — the repeating pattern

Docs: https://www.baeldung.com/spring-component-scanning → read: "@ComponentScan Without Arguments", then the Spring Boot part where `@SpringBootApplication` supplies the scan (this is the mechanism traced below)

Before Spring Boot (and even in early Spring), you wired beans together in XML: `<bean id="transactionService" class="..."><constructor-arg ref="transactionRepository"/></bean>`. Every class needed a matching XML block, and forgetting one produced a runtime failure at startup — the container simply did not know the class existed.

Spring Boot's convention is the opposite: put an annotation on the class, and the container discovers it automatically. "Automatically" is the word that hides the mechanism, so trace it.

### How `@ComponentScan` actually finds your classes

`@SpringBootApplication` (on `TimetrackApplication`) bundles `@ComponentScan` inside it. That annotation takes no arguments here, and *that* is the whole trick: with no explicit package to scan, it defaults to **the package of the class it is written on** — `com.victor.timetrack` — and every sub-package below it. Then, at startup:

```
1. SpringApplication.run(TimetrackApplication.class, args)
        → reads @ComponentScan on TimetrackApplication
        → base package = com.victor.timetrack  (the class's own package)
2. Spring walks the CLASSPATH for every .class file under that package tree:
        com/victor/timetrack/controller/TimeEntryController.class
        com/victor/timetrack/service/TimeEntryService.class
        com/victor/timetrack/repository/TimeEntryRepository.class
3. For each one, it reads the class's ANNOTATIONS without instantiating it
        (bytecode inspection — no constructor runs yet)
4. Annotated with @Component, or with anything meta-annotated as @Component
        (@Service, @Repository, @RestController all are)  → register a bean definition
        Not annotated (a DTO, an enum, a plain helper)    → ignored completely
5. Only now does it instantiate them, resolving each constructor parameter
        by matching its TYPE against the registered bean definitions
```

> **How step 3 reads an annotation without running the class.** A `.class` file is not a black box — it is a documented binary format, and an annotation you wrote in the source is *stored inside it* as a plain data record (a `RuntimeVisibleAnnotations` entry naming `@Service`). So Spring never has to load the class to see the annotation: it opens the file's bytes and reads that record, the way you can read the ingredients on a tin without opening the tin. That is what "bytecode inspection" means here. It matters for a practical reason — loading a class runs its static initializers, and Spring is not willing to execute *your* code just to find out whether it is a candidate. It looks, then decides, then builds.

Two consequences fall straight out of that, and both are exam questions. **Why must `TimetrackApplication` sit in the root package?** Because the scan starts *at its package* — park it in `com.victor.timetrack.config` and the scan base becomes `...config`, so your `controller` and `service` packages sit *outside* the tree and are never seen. The app starts, and every endpoint 404s. **And why does step 3 read annotations without creating objects?** Because creating a bean means resolving its dependencies, and Spring cannot resolve them until it knows the full list of candidates — so discovery has to finish before construction begins.

> **"Bean definition" is not the bean.** Step 4 does not create anything — it files a *recipe*: this class, this constructor, these parameter types. The object itself is only built in step 5. That two-phase split (**define everything, then build everything**) is what lets two beans depend on each other in any order — by the time construction starts, every recipe is already on the table, so it never matters which class the scanner happened to reach first. It is also why a missing bean fails at **startup**, not on the first request: Spring already knows, before serving anything, that some constructor asks for a type no recipe produces (`Parameter 0 of constructor in ...TimeEntryService required a bean of type '...TimeEntryRepository' that could not be found`).

> **Step 5 builds the *singletons*, and that is nearly all of them.** By default a bean is a **singleton** — one instance for the whole app, created eagerly at startup. That is the default because your `@Service` and `@Repository` classes are stateless: they hold no per-user data, so one shared instance can serve every request and building it once is free. The exceptions are beans marked `@Lazy` (built on first use) or given a non-singleton scope, and those simply are not constructed in step 5 — their recipe waits. Scopes are covered in full in [03-dependency-injection.md](03-dependency-injection.md); for now, read "Spring instantiates them" as "Spring instantiates the singletons", which in TimeTrack is every bean you write.

> **`@Service`, `@Repository` and `@RestController` are all `@Component` underneath.** Open their source and each one carries `@Component` as a *meta-annotation* — an annotation on the annotation. So the scanner in step 4 only ever looks for one thing. The extra names exist for **you** (they document the layer at a glance) and for a little extra framework behaviour on top. `@Repository` is the clearest case: it also switches on **exception translation**, so the vendor-specific error your database driver throws (a Postgres `SQLException` with an error code like `23505`) is caught and re-thrown as one of Spring's own (`DataIntegrityViolationException`). The payoff is that your service catches the *same* exception whether it is running against Postgres in production or H2 in a test — the driver stops leaking into your code. They are not four different mechanisms; they are one mechanism with four labels and a little extra wiring each.

| Annotation | What it marks | Covered in full |
|---|---|---|
| `@Component` | Any Spring-managed class (generic) | [03-dependency-injection.md](03-dependency-injection.md) |
| `@Service` | Business logic layer | [03-dependency-injection.md](03-dependency-injection.md) · rules inside it: [11-business-logic-domain-modeling.md](11-business-logic-domain-modeling.md) |
| `@Repository` | Data access layer | [04-spring-data-jpa.md](04-spring-data-jpa.md) |
| `@RestController` | Web layer — handles HTTP | [02-rest-controllers.md](02-rest-controllers.md) |
| `@Configuration` + `@Bean` | A bean you can't annotate directly (a library class) | [03-dependency-injection.md](03-dependency-injection.md) · used heavily in [06-security-jwt.md](06-security-jwt.md) |

Read the third column as a promise, not a footnote: nothing in this file is explained to the level you will need — each row is the file that owes you the full mechanism, the real TimeTrack code, and the interview answer. This file only gives you the *shape* so those files have something to attach to.

This is why reading a Spring Boot class is mostly reading its annotations first — they tell you *what role* the class plays before you read a single method.

---

## The request lifecycle — how the layers connect

Docs: https://www.baeldung.com/spring-dispatcherservlet → read: "Front Controller" and "Request Processing" (the `DispatcherServlet` is the box that decides *which* controller method a URL belongs to)

Every HTTP request that reaches a TimeTrack endpoint travels through the same fixed path. This is the mental map to hold before diving into any single layer's file:

```
HTTP request  →  [embedded Tomcat, port 8080]
     ↓
[Security filter chain]   ← validates the JWT, rejects if not authenticated  (06-security-jwt.md)
     ↓
[DispatcherServlet]       ← matches the URL+verb to one controller method    (02-rest-controllers.md)
     ↓
[Controller]              ← validates the body, returns a response           (02, 07-validation.md)
     ↓
[Service]                 ← business rules + @Transactional boundary         (08-transactions.md, 11-business-logic-domain-modeling.md)
     ↓
[Repository]              ← talks to the database via Spring Data JPA        (04-spring-data-jpa.md)
     ↓
Database

   ⟳ any layer can throw  →  [@RestControllerAdvice] → clean JSON error       (05-exception-handling.md)
   ⟳ every layer can write →  [the log]                                        (13-logging-observability.md)
```

Read the two `⟳` lines as *cross-cutting*: they are not a step in the chain, they hang off **every** box in it. An exception thrown anywhere — security, controller, service, repository — unwinds out of the chain and is caught in one central place, which is why file 05 has no home in the vertical stack. Logging is the same shape: any layer may write a line, and file 13 is the one that says *which* lines are worth writing. And that log is the only reason file 12 (production debugging) has anything to work with at all — when the app is on a server you cannot attach a debugger to, this diagram plus the log is the entire picture you get.

Every numbered file in this folder zooms into one link of that chain. When something in a specific file feels disconnected, come back to this diagram — it almost always fits into one box here.

---

## Where TimeTrack fits — this folder maps to one real project

Everything in `01`–`13` is taught against **project 07 (TimeTrack)** — a real Spring Boot + Angular + PostgreSQL app, not toy examples. `layer-reference.md` in this folder has the quick-reference version of the layered structure (using a `Transaction` example); `coverage.md` lists every concept a Spanish consultancy screening expects a junior to explain with a real example from that project.

**The route, and why it runs in this order.** The files are not a menu — they are a build, and each one exists because the previous one left a hole. You start by getting an app to run at all (`01` setup) and by exposing it over HTTP (`02` controllers); those two work only because a container is wiring your objects together, so `03` (DI/beans) stops and explains the mechanism that has been silently holding up `01` and `02`. An app that answers requests but forgets everything is useless, so `04` gives it a database — and the moment a database can say "no", you need somewhere for failures to land, which is `05` (exceptions). Now the app works and fails cleanly, so it becomes worth protecting: `06` (security/JWT) locks it down, and `07` (validation) rejects junk before it ever reaches your logic. With multiple writes now happening per request, `08` (transactions) makes them all-or-nothing. At that point the app is *correct*, so `09` proves it with tests and `10` ships it (Docker, Flyway). The last three are the step from "it works on my laptop" to "it works in production, and I can defend it in an interview": `11` puts the business rules where they belong (the `DRAFT → SUBMITTED → APPROVED` workflow), `12` teaches you to read the evidence when that workflow breaks on a server you cannot debug, and `13` closes the loop by showing that the evidence in `12` only ever exists because someone wrote the log line first.

**Reading order:** `01` (setup) → `02` (controllers) → `03` (DI/beans) → `04` (persistence) → `05` (exceptions) → `06` (security) → `07` (validation) → `08` (transactions) → `09` (testing) → `10` (tooling) → `11` (business logic & domain modelling) → `12` (production debugging) → `13` (logging & observability). Section 0 / Section 15 of the project's `PLANNING.md` says which step is currently active — that is what decides which file to read next in a live session.

> **Files `11`–`13` are the ones that separate a junior who "did a tutorial" from one who built something.** Anyone can wire a controller to a repository. Far fewer can answer *"where do the business rules live, and why not in the controller?"*, *"the app won't start in production — what do you look at first?"*, or *"a row is in a state that should be unreachable — how do you find out who put it there?"*. Those three questions are files 11, 12 and 13, and they are asked in real Spanish screenings.
