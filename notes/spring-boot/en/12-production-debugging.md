# Production Debugging — Reading the Evidence

Docs: [Baeldung — Spring Boot Startup Failures](https://www.baeldung.com/spring-boot-failure-analyzer) → read: "FailureAnalyzer" (the mechanism that prints the `Description:` / `Action:` block you are about to learn to read)

[11-business-logic-domain-modeling.md](11-business-logic-domain-modeling.md) closed on a Monday morning: a manager tells you an entry is `APPROVED` that nobody ever submitted. Think about what you actually have in your hands at that moment. No exception. No failing test. No red line in the console. **Only a wrong row.**

That is the shape of almost every real production problem, and it is why debugging in production is a different skill from debugging in the IDE. On your laptop the evidence comes to you — the exception pops up in the run window, you put a breakpoint two lines above it, and you watch the value change. In production there is no run window, often no debugger you are allowed to attach, and the failure happened forty minutes ago on a machine you are not sitting at. What you get instead is **evidence left behind**: a startup log, a stack trace, a status code, a slow response, a row in a state that should be unreachable.

So the skill is not "fix bugs". It is **read the evidence in front of you, and know what each piece of evidence rules in and rules out.** That skill has two moments, and this file is split down that line:

```
                    Does the app start?
                            │
              ┌─────────────┴──────────────┐
             NO                            YES
              │                             │
   "APPLICATION FAILED TO START"   The process is alive, but…
   the context never came up:      …an endpoint 500s
   a bean, a port, a datasource,   …an endpoint takes 8 seconds
   a schema mismatch               …a row is in the wrong state
              │                             │
      PART 1 of this file           PART 2 of this file
   (evidence = the startup log)   (evidence = logs + metrics + SQL)
```

The split matters because the two halves have completely different first moves. A startup failure hands you a paragraph that literally tells you the fix, and the whole job is to read it instead of scrolling past it. A runtime failure hands you nothing, and the whole job is to *go and get* the evidence — turn on SQL logging, hit Actuator, read the log around the failing request.

> **Why does "the app didn't start" deserve half a file?** Because it is where you will spend most of your first week on any real project, and because it is the single most common opening question in a Spanish technical screening: *"la aplicación no arranca — ¿qué haces primero?"*. The interviewer is not testing whether you memorised an error message. They are testing whether you **read** or whether you **guess** — a junior who reads the failure block solves it in twenty seconds; a junior who guesses starts randomly re-running Maven, deleting `target/`, and restarting the IDE.

---

# PART 1 — The app won't start

## Reading the `APPLICATION FAILED TO START` block

Purpose: extract the fix from the one paragraph Spring Boot writes specifically for you, before reading a single line of the stack trace above it.
File: the console in IntelliJ, or `docker compose logs -f app` when the app runs in a container
Docs: [Baeldung — Spring Boot FailureAnalyzer](https://www.baeldung.com/spring-boot-failure-analyzer) → read: "Custom FailureAnalyzer" — it shows the class Spring uses to turn an exception into that block

When a Spring Boot app dies during startup you get a wall of text: fifty or a hundred lines of stack trace, most of it inside `org.springframework.*` classes you have never opened. The instinct is to read it top to bottom, get lost around frame twelve, and start changing things at random.

Do not read the stack trace first. **Scroll to the bottom.** Spring Boot prints this at the very end:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this
application to listen on another port.
```

That block is not part of the stack trace. It is written by a **`FailureAnalyzer`** — a Spring Boot class whose only job is to recognise a known startup exception and translate it into two sentences a human can act on. Under the hood, when the context fails to refresh, Boot catches the exception, walks a list of registered analyzers, asks each one "do you recognise this exception type?", and the first one that says yes produces the `Description:` (what happened) and the `Action:` (what to do about it). That is the mechanism: it is not the JVM being helpful, it is a Spring component written by someone who got tired of juniors pasting stack traces into Slack.

> **So why is the stack trace even there?** Because not every failure has an analyzer. Spring ships analyzers for the common ones — port in use, missing datasource url, bean cycles, unsatisfied dependencies — and for everything else you fall back to the trace. The reading rule for that fallback comes from [Java exceptions](../../java/en/08-exceptions.md): read **bottom-up through the `Caused by:` chain** to the last one (that is the root cause), then find the first frame in the chain that belongs to *your* package (`com.victor.timetrack.…`). Framework frames tell you *where* it blew up; your frame tells you *why you* caused it.

Two habits, and they are the entire section:

1. **`Ctrl+End` in the IntelliJ console** jumps to the bottom of the output, which is where the failure block lives. (`Ctrl+F` then searching for `FAILED TO START` works too, and works in `docker compose logs` output where you scroll a file, not a window.)
2. **Read the `Action:` line out loud before you touch anything.** It is right often enough that ignoring it is indefensible in an interview.

> **The interviewer's actual question, verbatim:** *"The app will not start. What is your first move?"* The expected answer is "read the `Action:` line in the failure block" — not "check the pom", not "restart IntelliJ", not "clean and rebuild". Juniors scroll straight past the one paragraph written for them, and the interviewer has watched thirty candidates do exactly that.

---

## `Port 8080 was already in use`

Purpose: recognise the most common first-run failure in three seconds and know the two ways out.
File: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties`
Docs: [Baeldung — Change the Spring Boot Port](https://www.baeldung.com/spring-boot-change-port) → read: "Using Property Files"

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.
```

The embedded Tomcat inside your fat jar ([01-basics.md](01-basics.md)) asks the operating system for TCP port 8080, and the OS refuses because **another process already holds it**. A port is exclusive: exactly one process may listen on it at a time. That is not a Spring rule, it is a kernel rule, which is why no amount of Spring configuration will make two apps share 8080.

Ninety per cent of the time the process holding it is **the same app you started five minutes ago and thought you had stopped** — a run window you closed without stopping, or a `docker compose` stack still up in the background. So the first check is not the command line, it is the IntelliJ Run tab and `docker ps`.

The two real fixes:

```properties
# option A — move your app off 8080 (application.properties)
server.port=8081
```

```bash
# option B — find and kill whoever holds the port
netstat -ano | findstr :8080     # Windows → last column is the PID
taskkill /PID 12345 /F           # Windows

lsof -i :8080                    # macOS / Linux
kill -9 12345
```

> **Which one do you actually want?** If the squatter is your own zombie process, kill it — moving to 8081 just leaves a stale app running and confuses you again tomorrow. If the squatter is something you legitimately need (another service on the team's stack), move your app and tell Angular's `environment.ts` about the new port. Choosing `server.port=0` is the third option worth knowing: it means "any free port", which is what integration tests do (`@SpringBootTest(webEnvironment = RANDOM_PORT)`) precisely so a test suite never collides with your running dev app.

---

## `UnsatisfiedDependencyException` — "no qualifying bean of type…"

Purpose: read a bean-wiring failure and name which of the three causes it is, without opening the class.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java`
Docs: [Baeldung — NoSuchBeanDefinitionException](https://www.baeldung.com/spring-nosuchbeandefinitionexception) → read: "The Cause: No Qualifying Bean of Type"

This is the one you will hit most often once the app is bigger than a tutorial, and the message reads like an accusation:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.victor.timetrack.service.TimeEntryService required
a bean of type 'com.victor.timetrack.repository.TimeEntryRepository' that could not be found.

Action:

Consider defining a bean of type 'com.victor.timetrack.repository.TimeEntryRepository'
in your configuration.
```

And above it, in the trace:

```
org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name
'timeEntryService': Unsatisfied dependency expressed through constructor parameter 0
	...
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of
type 'com.victor.timetrack.repository.TimeEntryRepository' available
```

Read the two exception names as a sentence, because they are two halves of one story. **`UnsatisfiedDependencyException`** is the *outer* failure: Spring tried to build `TimeEntryService`, and to build it, it must call your constructor:

```java
public TimeEntryService(
        TimeEntryRepository timeEntryRepository,   // ← "parameter 0"
        ProjectRepository projectRepository,
        UserRepository userRepository) { … }
```

To call that constructor it needs an object for each parameter, and it asks its own registry — the **`ApplicationContext`** — for one. **`NoSuchBeanDefinitionException`** is the *inner* failure: the registry had nothing under that type. So the message is literal. It is not saying your code is wrong; it is saying **"I looked in the box of objects I created, and there was no `TimeEntryRepository` in it."**

That reframing gives you the three — and only three — causes:

| Cause | Why the box is empty | Fix |
|---|---|---|
| The class has no stereotype annotation | Component scanning only registers classes marked `@Service` / `@Repository` / `@Component` / `@Controller`. An unannotated class is an ordinary Java class Spring never instantiates. | Add the annotation |
| The class sits **outside** the root package | `@SpringBootApplication` scans its own package *downwards*. A class in `com.other.stuff` is never even looked at — no error, it simply does not exist as far as Spring is concerned. | Move it under `com.victor.timetrack` |
| You injected an **interface** with no implementation | Spring needs a concrete object. An interface with no `@Service` implementing it registers nothing. | Provide an implementation (or, for a repository, extend `JpaRepository` so Spring Data generates one) |

How to read that table: the middle row is the one that catches people, because it produces **exactly the same message** as a missing annotation while the annotation is sitting right there in the file. The class looks perfect; it is just in the wrong postcode. Check the package declaration before you check the annotation.

> **Why does `TimeEntryRepository` work at all — it is an interface with no `@Repository` and no implementation?** Because Spring Data JPA writes the implementation for you at startup. It scans for interfaces extending `JpaRepository`, generates a proxy class implementing every derived method (`findByUser`, `save`, `findById`) from the method names, and registers *that* proxy as the bean. This is the same proxy mechanism behind `@Transactional` ([08-transactions.md](08-transactions.md)) — Spring rarely hands you the object you wrote; it hands you a generated wrapper around it. Which is exactly why the third row of the table exists: the day you inject your *own* interface, nobody is generating anything, and Spring wants an implementation from you.

> **Related failure, one word apart — `BeanDefinitionOverrideException`.** The opposite problem: not zero beans, but two under the same name. `Invalid bean definition ... bean definition ... already defined` at startup usually means a `@Bean` method collides with a scanned `@Component` of the same name. The fix is to rename or delete one of them. It is **never** `spring.main.allow-bean-definition-overriding=true` — that flag does not resolve the ambiguity, it just picks a winner silently, and an interviewer who sees it in your config knows you turned an error into a coin flip.

---

## The datasource: configured vs reachable

Purpose: tell apart "Spring has no database config" from "Spring has the config and the database refused it" — two failures whose fixes live in completely different places.
File: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties`
Docs: [Baeldung — Configuring a DataSource in Spring Boot](https://www.baeldung.com/spring-boot-configure-data-source-programmatic) → read: "DataSource Configuration"

Both of these failures kill startup and both mention the database. They are not the same problem, and an interviewer will hand you one and ask which it is.

**Failure A — Spring has no configuration at all:**

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource
could be configured.

Reason: Failed to determine a suitable driver class

Action:

Consider the following:
	If you want an embedded database (H2, HSQL or Derby), please put it on the classpath.
	If you have database settings to be loaded from a particular profile you may need to
	activate it (no profiles are currently active).
```

Read it as the proof that auto-configuration is **conditional, not magical**. `spring-boot-starter-data-jpa` is on your classpath, so Boot's auto-configuration says "there is JPA here, therefore this app wants a `DataSource`", and then goes looking for `spring.datasource.url` to build one. It finds nothing and stops. The causes, in order of how often they happen:

- `application.properties` is not on the classpath. It must be in `src/main/resources` — that folder is what Maven packages onto the classpath. A properties file next to your main class, or in the project root, is simply never read, and the app boots (or in this case dies) as if it did not exist.
- The property is misspelled. `spring.datasource.urls`, `spring.datasoure.url` — Spring does not warn you about unknown keys, it just never sees the one you meant.
- The profile that holds the config is not active. Note the `Action:` block spells this out: *"no profiles are currently active"*. Your `application-dev.properties` has a perfect url and nobody asked for `dev`.

**Failure B — the configuration is fine and the database said no:**

```
com.zaxxer.hikari.pool.HikariPool : HikariPool-1 - Exception during pool initialization.
org.postgresql.util.PSQLException: Connection to localhost:5432 refused. Check that the hostname
and port are correct and that the postmaster is accepting TCP/IP connections.
```

**Hikari** is the connection pool Spring Boot ships by default. A pool opens a handful of database connections *at startup* and hands them out to requests, because opening a TCP connection and authenticating per request would be far too slow. `Exception during pool initialization` therefore means: Spring read your url, tried to open that first connection, and the network or Postgres pushed back. Three distinct messages, three distinct fixes:

| The line you see | What it means | Where the fix is |
|---|---|---|
| `Connection to localhost:5432 refused` | Nothing is listening on that host:port — Postgres is not running, or is on another port, or (in Docker) `localhost` is the wrong host entirely | Start Postgres / fix the host |
| `FATAL: password authentication failed for user "postgres"` | Postgres is running and answered — it just rejected the credentials | `spring.datasource.password`, or the `DB_PASSWORD` env var that fills it |
| `FATAL: database "timetrack" does not exist` | Postgres is running, credentials are fine, that database was never created | Create it in pgAdmin |

How to read that table: the three rows are a ladder, and each rung proves the rung below it worked. "Refused" means you never reached Postgres. "Authentication failed" proves you reached it. "Database does not exist" proves you reached it *and* logged in. Knowing which rung you are on tells you exactly what not to waste time checking.

> **Hibernate creates *tables*, never the *database*.** `ddl-auto=update` reads your `@Entity` classes and issues `CREATE TABLE` — but it must already be connected to something in order to do that, and you cannot connect to a database that does not exist. That is the whole reason `FATAL: database "timetrack" does not exist` is a startup crash and not something Spring quietly fixes. In TimeTrack you create the `timetrack` database once, by hand, in pgAdmin; everything inside it, Hibernate builds.

> **The third member of the family — `Cannot load driver class: org.postgresql.Driver`.** Spring knows the url, knows it is a `jdbc:postgresql:` url, and cannot find the class that speaks the PostgreSQL wire protocol. The driver is missing from `pom.xml` (or is scoped so it is absent at runtime). The lesson underneath it: **JPA is not a database connection.** `spring-boot-starter-data-jpa` gives you Hibernate and the `EntityManager`; the *driver* is a separate dependency, per database, and swapping Postgres for MySQL means swapping that jar.

---

## `localhost` inside a container is the container itself

Purpose: understand the single most common "it works on my machine, it dies in Docker" failure, and why the fix is one word in a url.
File: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties` (the property) — the Compose file that overrides it is proposed in [10-tooling.md](10-tooling.md), not yet in the repo
Docs: [Docker — Networking in Compose](https://docs.docker.com/compose/how-tos/networking/) → read: the opening paragraphs on service names as hostnames

Your TimeTrack config today says:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
```

On your laptop that is correct and it works. Put the exact same jar in a container, run `docker compose up`, and it dies with the `Connection to localhost:5432 refused` from the previous section — while Postgres is demonstrably running, in the container right next to it.

The mechanism is the whole lesson. **`localhost` is not a place, it is a word meaning "me".** It resolves to the loopback address `127.0.0.1`, which every machine interprets as *itself*. A container is (for networking purposes) its own machine with its own loopback. So inside the `app` container, `localhost:5432` means "port 5432 **of the app container**" — where nothing is listening, because Postgres is a *different* container.

```
   YOUR LAPTOP                          DOCKER COMPOSE
   ───────────                          ──────────────
                                   ┌──────────────────────┐
   ┌─────────┐                     │ app container        │
   │  app    │ ──localhost:5432──► │  localhost = itself  │──►  ✗ nothing here
   │         │        │            │                      │
   └─────────┘        ▼            └──────────┬───────────┘
                 ┌─────────┐                  │ db:5432
                 │ Postgres│                  ▼
                 │  :5432  │            ┌──────────────┐
                 └─────────┘            │ db container │
                                        │  Postgres    │
   localhost is correct here            └──────────────┘
                                  the SERVICE NAME is the hostname here
```

Compose creates a private network for the stack and registers **each service under its own name** as a DNS hostname. Your `docker-compose.yml` names the database service `db`, so `db` is the hostname, and the url becomes:

```
jdbc:postgresql://db:5432/timetrack
```

> **You do not edit `application.properties` to fix this — that is the point.** The same jar must run on your laptop *and* in Compose ([01-basics.md](01-basics.md), "build once, configure per environment"). You override the property from the environment, which works because of Spring's **relaxed binding**: the env var `SPRING_DATASOURCE_URL` maps onto the property `spring.datasource.url` (uppercase, dots → underscores), and an environment variable beats a properties file in the precedence order. That is exactly the `environment:` block in the Compose file in [10-tooling.md](10-tooling.md) — the file keeps `localhost` for your laptop, Compose injects `db` for the container, nobody rebuilds anything.

> **Its evil twin: the app starts before Postgres is ready.** `depends_on: [db]` sounds like "wait for the database", but it only waits for the **container to start**, not for Postgres inside it to finish initialising and accept connections. Postgres takes a couple of seconds to become ready; your app connects in under one; Hikari gets `Connection refused` on the very first boot and — depending on your Compose config — the app container exits. Run it again and it works, which is exactly the kind of "flaky, ignore it" bug that reaches production. The honest fix is a Compose `healthcheck` on `db` plus `condition: service_healthy` on the app's `depends_on`, so Compose actually waits until Postgres answers. Interviewers ask this to check you can tell **"container up"** apart from **"service ready"** — a distinction that stops mattering only when you have never operated anything.

---

## Schema drift under `ddl-auto=validate`

Purpose: read the error that means "your entity and your real table disagree" and know why the fix is never `update`.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`
Docs: [Baeldung — Loading Initial Data with Spring Boot](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql) → read: "Controlling Database Creation Using Hibernate" (the section that explains every `ddl-auto` value)

TimeTrack currently runs `spring.jpa.hibernate.ddl-auto=update` (open `application.properties` — it is line 5), which is the learning setting: Hibernate compares your entities to the real tables at startup and **alters the schema** to fit. Convenient — and the reason it is banned in production is that it will happily add a column to a live table without anyone reviewing it, and it never removes or renames anything, so the schema slowly accumulates the ghosts of every field you deleted.

Production runs the opposite pairing: **Flyway owns the schema** (the migration setup described in [10-tooling.md](10-tooling.md) — TimeTrack does not have Flyway yet, so everything below is the target state, not your current config) and Hibernate is downgraded to a checker:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

`validate` means: read the entities, read the real tables, and if they disagree **refuse to start**. When they do disagree, this is the message — and note the shape of it, because it is *not* the friendly `APPLICATION FAILED TO START` block:

```
org.springframework.beans.factory.BeanCreationException: Error creating bean with name
'entityManagerFactory' defined in class path resource
[org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaConfiguration.class]:
[PersistenceUnit: default] Unable to build Hibernate SessionFactory
	...
Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: Schema-validation:
missing column [rejection_note] in table [public.time_entries]
```

> **This is the fallback case from the first section, live.** Spring ships no `FailureAnalyzer` for `SchemaManagementException`, so there is no `Description:` / `Action:` paragraph to read — you get the raw trace and you apply the rule: go **bottom-up through `Caused by:`** to the last one. The last `Caused by:` is the whole answer; the `BeanCreationException` above it only tells you *which bean* died while it happened (`entityManagerFactory` — the JPA bootstrap, which is where validation runs).

Trace what that last line actually proves, because it is more precise than it looks. Hibernate is not guessing. It queried the database's own catalogue for the real columns of `time_entries`, mapped your `TimeEntry` entity into the columns it *expects*, and found one it needs that is not there. `rejectionNote` is a field on your entity ([`TimeEntry.java`](../../../projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java) declares it); Hibernate's **implicit naming strategy** turns camelCase into snake_case, so it expects a column literally called `rejection_note`; the table does not have it. Somebody added the field to the entity and never wrote the migration. (The table name is printed schema-qualified — `public.time_entries` — because `public` is Postgres's default schema.)

The fix is a new migration script — `V4__add_rejection_note_to_time_entries.sql` — and never, ever flipping back to `update`. Flipping to `update` "fixes" it by letting Hibernate silently `ALTER TABLE` your production database, which is the exact thing `validate` exists to prevent. You would be turning off the smoke alarm because it is making a noise.

> **`missing column` is only half the family.** The other half is `wrong column type`, e.g. `found [varchar (Types#VARCHAR)], but expecting [numeric(38,2) (Types#NUMERIC)]` — the column exists but the migration created it as text while your entity declares a `BigDecimal`. Same root cause (entity and migration written by different hands at different times), same fix (a migration), same non-fix (`update` would not even repair it — Hibernate does not change existing column types).

> **This is the failure `validate` is *for*.** It is easy to read a startup crash as "the tool is in my way". Invert it: without `validate`, that mismatch would not have crashed at startup — it would have crashed at 3pm, inside a transaction, on the first request that touched `rejectionNote`, as a 500 for a real user. `validate` converts a runtime data bug into a deploy-time build failure, which is the cheapest possible place for a bug to live. Interviewers ask "what stops your entity and your table from disagreeing?" and this is the whole answer: Flyway writes the schema, `validate` proves the entities still match it.

---

## "It worked yesterday and I changed nothing"

Purpose: run the environmental checklist instead of re-reading code that has not changed.
Docs: [Baeldung — Spring Boot Property Precedence](https://www.baeldung.com/properties-with-spring) → read: "Properties Precedence"

When the code is byte-for-byte identical to yesterday's and the app no longer starts, the cause is not in the code. It is in the **environment** — everything the jar reads from *outside* itself. Go down the list in this order, because it is ordered by how often each one is the culprit:

1. **A missing environment variable.** TimeTrack's `application.properties` contains `${DB_PASSWORD}` and `${JWT_SECRET}` — placeholders with no default. If the IntelliJ run configuration you are using today is not the one you set those in (a new one, a colleague's, a Compose run), the context fails immediately with `Could not resolve placeholder 'DB_PASSWORD' in value "${DB_PASSWORD}"`. This is a *feature*: the app fails at startup, loudly, rather than connecting with an empty password and failing mysteriously later.
2. **The wrong active profile.** `spring.profiles.active` is empty, or set to `test`, so a whole file of properties you rely on was never loaded. Check the startup log — Boot prints `The following 1 profile is active: "dev"`, or `No active profile set, falling back to 1 default profile: "default"`.
3. **An unreachable database.** Postgres is not running (a laptop reboot stops the service), or the container was pruned, or the port moved. This is the Hikari ladder from two sections ago.
4. **An expired or rotated secret.** The JWT secret changed, so every previously issued token now fails signature verification — the app starts fine and every user is suddenly logged out. (Not a startup failure, but it belongs on the same checklist, because it is the same class of cause.)

> **The point of the list is the reflex, not the items.** The instinct when something breaks is to reread your own code, because that is what you control. But the *evidence* — "no code changed" — has already ruled the code out. Reasoning from what changed rather than from what you are familiar with is what interviewers are probing when they ask this. It is also, in practice, why the first question in any real incident channel is "what deployed?" and the second is "what config changed?".

---

# PART 2 — The app runs, but it is wrong or slow

The process is alive. Nothing crashed at startup. And yet an endpoint returns a 500, or takes eight seconds, or writes a row that should have been impossible.

The evidence you were handed in Part 1 — the failure block — does not exist here. **Nothing volunteers information.** So every section below is really about the same move: knowing *which switch to turn on* to make the system tell you what it is doing.

---

## The Whitelabel Error Page and the bare 500

Purpose: know exactly what a 500 tells you (and what it does not), and where the real message went.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`
Docs: [Baeldung — Spring Boot Whitelabel Error Page](https://www.baeldung.com/spring-boot-custom-error-page) → read: "The Whitelabel Error Page"

An exception escapes your controller and nothing handles it. From a browser you get Spring Boot's default page:

```
Whitelabel Error Page

This application has no explicit mapping for /error, so you are seeing this as a fallback.

Wed Jul 13 10:41:07 CEST 2026
There was an unexpected error (type=Internal Server Error, status=500).
```

From Postman, the same fallback comes back as JSON with the same nothing inside it:

```json
{
  "timestamp": "2026-07-13T10:41:07.512+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/entries"
}
```

> **In TimeTrack you will rarely see the whitelabel page — and that is the point of the advice you wrote.** Your `GlobalExceptionHandler` ends with a catch-all `@ExceptionHandler(RuntimeException.class)` ([05-exception-handling.md](05-exception-handling.md)), so any runtime exception that escapes a service is caught there and returned as your own `ErrorResponse` JSON with `"message": "Internal server error"` — a deliberate, non-leaking body. The whitelabel fallback is what happens when **nothing** in the advice matches (an exception outside the `RuntimeException` branch, or a failure thrown before the advice can run, like the filter-chain rejections two sections below). Either way the diagnosis is identical: the body is a placeholder, the truth is in the log.

Read what a 500 actually means, because juniors read it as "an error" and it is far more specific than that: **the request reached your code and your code threw something nobody handled.** That single sentence rules out an enormous amount. It is not a routing problem (404 would say so). It is not a wrong verb (405). It is not a missing `Content-Type` (415). It is not authentication (401) or authorisation (403). The request arrived, `DispatcherServlet` found your controller method, invoked it — and an exception escaped, no `@ExceptionHandler` in your `GlobalExceptionHandler` matched its type, and Spring fell back to the default `/error` handling.

Which is why the answer to "what does the response body tell me?" is: **nothing, and it never will.** Stop reading it. The exception — the class name, the message, the line in `TimeEntryService` — was written to the **server log**, and that is where you go. In IntelliJ it is the run window. In Docker it is `docker compose logs -f app`.

> **"But the message I threw isn't even there."** The default error body drops the `message` key entirely unless you ask for it — that is why there is no `"message"` field at all in the JSON above, not even an empty one. It is a security decision — `e.getMessage()` from a database exception can contain table names, SQL fragments, or user data, and shipping that to a browser is a free reconnaissance report for an attacker. Locally you can turn it back on:
> ```properties
> server.error.include-message=always
> server.error.include-stacktrace=on_param   # then call /api/entries?trace=true
> ```
> Both stay **off** in production, and the reason you can afford that is precisely the previous paragraph: the client does not need the detail, because the detail is in the log where only you can read it.

> **A 500 is always your bug.** The 4xx family means "the client sent something wrong"; the 5xx family means "the server broke". A validation failure is not a 500 — that is a 400 the advice produces on purpose ([07-validation.md](07-validation.md)). A missing entry is not a 500 — that is a 404 your `ResourceNotFoundException` handler produces. If you are seeing a 500, some path through your code throws an exception you did not anticipate, and the honest reading is: *my error handling has a hole*. The catch-all `@ExceptionHandler(Exception.class)` closes the hole in the *response* (a clean JSON 500 instead of a whitelabel page), but it does not close it in the *code* — you still go and read the log.

---

## Diagnosing a slow endpoint — the ranked checklist

Purpose: turn "this endpoint takes 8 seconds" into a measured cause, in the order that finds it fastest.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` (`getAll()`)
Docs: [Baeldung — Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators) → read: "Metrics" — the `http.server.requests` meter is the one that matters here

*"An endpoint takes eight seconds. What do you check first?"* This is asked constantly, and the trap is baked in: most candidates start proposing fixes — "I'd add an index", "I'd add caching", "maybe `JOIN FETCH`". **Every one of those is a wrong answer, because none of them is a measurement.** Proposing an optimisation before measuring is the thing the question is designed to catch.

The checklist, in order:

**Step 0 — measure, so you know where the eight seconds actually go.** TimeTrack's `pom.xml` does not have Actuator yet — adding `spring-boot-starter-actuator` is one dependency and no code, and it is what gives you the endpoint's own timing:

```
GET /actuator/metrics/http.server.requests?tag=uri:/api/entries
```
```json
{
  "name": "http.server.requests",
  "measurements": [
    { "statistic": "COUNT",   "value": 42 },
    { "statistic": "TOTAL_TIME", "value": 336.7 },
    { "statistic": "MAX",     "value": 8.9 }
  ]
}
```

Actuator records every request through the same pipeline that serves it, so `COUNT` (how many), `TOTAL_TIME` (seconds spent in all of them) and `MAX` (the slowest single one) are facts, not guesses. `336.7 / 42 ≈ 8s` average — the slowness is the endpoint's normal behaviour, not one unlucky request. That distinction alone redirects the whole investigation: a bad *average* is a design problem in the code path; a bad *max* with a fine average is contention, a cold cache, or one pathological row.

**Step 1 — count the SQL queries.** This is the highest-yield check by a wide margin, and TimeTrack already has the switch on:

```properties
spring.jpa.show-sql=true                       # already in your application.properties
logging.level.org.hibernate.SQL=DEBUG          # the same thing, through the logging system
```

Call the endpoint once and count the `select` lines. If a list endpoint returning 200 rows printed 401 queries, you have found it and it has a name — **N+1** ([04-spring-data-jpa.md](04-spring-data-jpa.md), "The N+1 problem"): one query to load the list, then one extra query *per row* to load each row's relations.

And this is not hypothetical in TimeTrack. Look at what `getAll()` does today:

```java
// TimeEntryService.getAll() — the manager branch loads every entry in the system
return isManager
        ? timeEntryRepository.findAll().stream().map(this::toResponse).toList()
        : timeEntryRepository.findByUser(user).stream().map(this::toResponse).toList();
```
```java
// toResponse() — reaches into TWO relations per entry
response.setUserName(timeEntry.getUser().getName());
response.setProjectName(timeEntry.getProject().getName());
```

`findAll()` is one query. Then, for every single entry, `toResponse()` touches `user` and `project`. Your `TimeEntry` declares them as plain `@ManyToOne` with no fetch type, and — the gotcha every interviewer asks about — **`@ManyToOne` defaults to `EAGER`**, so Hibernate resolves each association as it materialises each row. Two hundred entries becomes hundreds of round-trips to Postgres, each one a network hop of a few milliseconds, and a few milliseconds × several hundred *is* your eight seconds. The fix is to load them in one query:

```java
// TimeEntryRepository — proposed, not written yet
@Query("SELECT e FROM TimeEntry e JOIN FETCH e.user JOIN FETCH e.project")
List<TimeEntry> findAllWithUserAndProject();
```

**Step 2 — check the index.** If the query count is sane and one query is slow, the database is scanning rows it should be jumping straight to. A filter on `user_id` and `date` walks the whole `time_entries` table until an index exists on those columns. Add it in a migration (`CREATE INDEX idx_entries_user_date ON time_entries (user_id, date);`) and remember the trade-off, because that is the half interviewers listen for: every index makes reads faster and **writes slower** (each `INSERT` must also update the index) and costs storage. An index is a decision, not a freebie.

**Step 3 — check whether the endpoint is unbounded.** Does it return `findAll()` on a table that will one day have 100,000 rows? Then no index saves you — you are shipping 100,000 rows over the wire and building 100,000 DTOs in memory. The fix is `Pageable` ([04-spring-data-jpa.md](04-spring-data-jpa.md)), and it is also the fix for the next section's `OutOfMemoryError`.

**Step 4 — measure again.** Re-read the same Actuator metric. If the number did not move, your theory was wrong and you go back to step 1 — with the loop closed by data, not by "it feels faster now".

> **Why is "measure first" a hard rule and not just good manners?** Because the intuition of where time goes is reliably wrong, and an unmeasured optimisation is unfalsifiable — you cannot tell a fix from a placebo. There is also a career-shaped reason: an index that does nothing still permanently taxes every write in the table. You will have made the system slower and told everyone you made it faster.

> **The query looks right but returns nothing.** `show-sql` prints the SQL with `?` where the values go, which is useless exactly when you need it most. Turn on the parameter binding log and you see the values that were actually sent:
> ```properties
> logging.level.org.hibernate.orm.jdbc.bind=TRACE
> ```
> ```
> binding parameter (1:BIGINT) <- [7]
> binding parameter (2:VARCHAR) <- [SUBMITTED]
> ```
> Nine times out of ten the answer is right there: the id you thought was 7 is null, or the enum you thought was `SUBMITTED` arrived as `DRAFT`.

---

## The 403 with an empty log, and CORS that only fails from the browser

Purpose: know where in the pipeline a request can die *before* it reaches your controller — because that is where your usual debugging tools are blind.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/SecurityConfig.java`
Docs: [Baeldung — Spring Security CORS](https://www.baeldung.com/spring-security-cors-preflight) → read: "CORS With Spring Security" (why the preflight is rejected before any controller runs)

Two symptoms, one root cause, and the root cause is a *place*:

```
Angular ──► [ CORS filter ] ──► [ JwtFilter ] ──► [ auth rules ] ──► DispatcherServlet ──► YOUR CONTROLLER
                     └──────── the security filter chain ────────┘         │                      │
                                                                            │              @RestControllerAdvice
                            a request rejected HERE never reaches ──────────┘              only sees things that
                            your code, your log lines, or your advice                      got this far
```

**Symptom 1 — a 403 and nothing in the log.** Your endpoint denies the request, you add a `log.info` at the top of the controller method to see what is happening, and it never prints. That is not a mystery: **the request never reached the method.** It was rejected inside the filter chain, which runs *before* `DispatcherServlet` picks a controller. This is the same structural fact behind a rule you already know from [05-exception-handling.md](05-exception-handling.md) — exceptions thrown inside a filter bypass `@RestControllerAdvice` entirely, because the advice lives on the far side of the servlet.

Since your own code is not running, you make **Spring Security's** code talk:

```properties
logging.level.org.springframework.security=DEBUG
```

Now the chain narrates itself, and you can see precisely which filter said no:

```
o.s.s.w.FilterChainProxy                 : Securing GET /api/entries/42
o.s.s.w.a.AuthorizationFilter            : Authorizing GET /api/entries/42
o.s.s.w.a.AuthorizationFilter            : Failed to authorize GET /api/entries/42 with
  authorization manager org.springframework.security.config.annotation.web.configurers.
  AuthorizeHttpRequestsConfigurer$... and decision AuthorizationDecision [granted=false]
o.s.s.w.access.AccessDeniedHandlerImpl   : Responding with 403 status code
```

> **The class name in that log is a version tell.** `AuthorizationFilter` is the modern one (Spring Security 6+, which is what Spring Boot 3 and your Boot 4 project use). Older tutorials and Stack Overflow answers show `FilterSecurityInterceptor` instead — the same job, removed in Security 6. If you paste a log line into Google and every result is from 2019, that mismatch is why.

> **"I would add a print statement in the controller" is a disqualifying answer here** — and interviewers ask this exact question ("your endpoint returns 403 and the log is empty — what now?") to hear it. It proves the candidate has no mental model of *where* the request is, only of what the code says. The correct first move — turn on the security log and read which filter denied it — takes one property and thirty seconds.

**Symptom 2 — it works in Postman and fails from Angular with a CORS error.** The browser console says:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/entries' from origin 'http://localhost:4200'
has been blocked by CORS policy: Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

The reason Postman is happy and Chrome is not: **CORS is a browser rule, not a server rule.** Postman sends no `Origin` header and therefore triggers no preflight — it just fires the request. A browser, before it lets JavaScript send a cross-origin request carrying custom headers (like `Authorization: Bearer …`), first sends an `OPTIONS` request asking permission:

```
OPTIONS /api/entries HTTP/1.1
Origin: http://localhost:4200
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

That `OPTIONS` request carries **no JWT** — the browser does not attach your token to a preflight. So if the security chain is configured to authenticate every request, it rejects the preflight with a 401/403, the browser sees no `Access-Control-Allow-*` headers in the answer, and it blocks the *real* request before it is ever sent. From Angular you never see your endpoint fail; you see the browser refuse to call it.

That is why CORS is configured **inside the security chain**, not with `@CrossOrigin` on a controller — by the time a controller annotation could take effect, the request has already been rejected upstream. Your `SecurityConfig` does exactly that, and the `.cors(...)` line is doing real work:

```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))   // inserts Spring's CorsFilter
```
```java
config.setAllowedOrigins(List.of("http://localhost:4200"));          // Angular's dev server
config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));  // OPTIONS included
config.setAllowCredentials(true);
```

Spring's `CorsFilter` runs early in the chain and answers the preflight itself with the allow-headers, so it never reaches the authentication filters.

> **`allowedOrigins("*")` with `allowCredentials(true)` is rejected by the browser** — the spec forbids the combination, because "any site may call me" plus "and send credentials" is an open door. Chrome will tell you so in the console rather than silently obeying. When you deploy, the fix is to list the real frontend origin, not to widen the wildcard.

---

## `OutOfMemoryError: Java heap space`

Purpose: recognise the one Java error that is almost never about memory settings, and know why raising `-Xmx` is the wrong instinct.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` (`getAll()`)
Docs: [Baeldung — Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap) → read: "Heap Space in Java" (what the heap holds and why it has a fixed maximum)

```
java.lang.OutOfMemoryError: Java heap space
	at java.base/java.util.Arrays.copyOf(Arrays.java:3512)
	at java.base/java.lang.AbstractStringBuilder.ensureCapacity(AbstractStringBuilder.java:237)
	...
	at com.victor.timetrack.service.TimeEntryService.getAll(TimeEntryService.java:140)
```

The **heap** is the region of memory where every object you create lives. It has a fixed maximum size, set when the JVM starts (`-Xmx`). `OutOfMemoryError` means: the garbage collector ran, found nothing it was allowed to delete, and there was still not enough room for the next object. Note the type — it is an `Error`, not an `Exception`. It is not something you catch and recover from; by the time it is thrown the JVM is already in an unusable state.

The instinct is to give it more memory. **Do not.** In a Spring application there is essentially one cause and it is always the same shape: **you loaded an unbounded number of rows into memory at once.** `findAll()` on a table with a million entries hydrates a million `TimeEntry` objects, each with a `User` and a `Project` hanging off it, and then `.map(this::toResponse)` builds a million DTOs *on top of that* — two full copies of the table in the heap before a single byte reaches the client.

Doubling `-Xmx` does not fix that, it postpones it: the app now survives one million rows and dies at two million, having also spent twice as long garbage-collecting on every request in between. You have converted an error into a slow, expensive, still-doomed app.

The fix is to stop loading everything:

```java
// ❌ MAL — unbounded: the table's size decides your memory usage
public List<TimeEntryResponse> getAll() {
    return timeEntryRepository.findAll().stream().map(this::toResponse).toList();
}

// ✅ BIEN — bounded: the client asks for a page, you load a page
public Page<TimeEntryResponse> getAll(Pageable pageable) {
    return timeEntryRepository.findAll(pageable).map(this::toResponse);
}
```

> **This is the same bug as the slow endpoint one section above — it just grew.** `getAll()` returning every row is slow at 200 entries, painful at 20,000, and fatal at 2,000,000. The unbounded list is one design flaw with three different symptoms depending on how much data has accumulated, which is exactly why interviewers ask *"what happens if you call `findAll()` on a table with 100,000 rows?"* as a design question rather than a performance one. And it is why `getAll()` in your TimeTrack service — which today returns every entry in the system to a manager — is a real item on the project's backlog, not a theoretical concern.

> **`.map(this::toResponse)` on a `Page` is not the same call as on a `List`.** `Page<T>` has its own `map()` that transforms the *contents* and preserves the paging metadata (total elements, total pages), which is what the Angular client needs to draw the pagination controls. If you `.stream()` a `Page` you throw that metadata away.

---

## `NullPointerException` in a service — the two boring causes

Purpose: name the likely cause from the stack trace alone, before opening the file.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java`
Docs: [Baeldung — Optional](https://www.baeldung.com/java-optional) → read: "Optional.orElseThrow()"

A `NullPointerException` inside a Spring service is almost never mysterious. Modern JVMs even tell you *which* reference was null (helpful NPE messages, on by default since Java 15):

```
java.lang.NullPointerException: Cannot invoke "com.victor.timetrack.model.Project.getName()"
because the return value of "com.victor.timetrack.model.TimeEntry.getProject()" is null
	at com.victor.timetrack.service.TimeEntryService.toResponse(TimeEntryService.java:209)
```

Read that message closely — it names *two* things, and the second is the one that matters. `Cannot invoke "…Project.getName()"` is where it blew up; `because the return value of "…TimeEntry.getProject()" is null` is **why**. So you are not looking for a bug in `Project`; you are looking for a `TimeEntry` row whose `project` is null. That is the whole diagnosis, from the message alone, without opening the file.

Two causes cover nearly all of them:

1. **A relation or `Optional` you assumed was populated.** Spring Data returns `Optional<T>` from `findById()` / `findByEmail()` precisely so you cannot forget the not-found case: calling `.get()` on an empty one throws where you wanted a clean 404. Your code already does the right thing everywhere — `.orElseThrow(() -> new ResourceNotFoundException(...))` — and that is not decoration: it converts a 500 into the 404 the API contract promises. The trace above is the sibling version of the same mistake, one layer in: `toResponse()` walks `timeEntry.getUser()` and `timeEntry.getProject()` with no null check, so any row that ever reached the table without a project (a bad manual `INSERT`, a migration, a test fixture) becomes an NPE the first time a manager lists entries.
2. **A dependency that is null because the object was created with `new`.** Spring injects dependencies only into beans *it* constructs. Write `new TimeEntryService(...)` yourself — or, more subtly, `new` a helper class that has an `@Autowired` field — and Spring never touches that object, so the field stays null and you get an NPE on first use. The same mechanism explains why that object also silently loses `@Transactional` and `@PreAuthorize`: those live on the *proxy* Spring wraps around a bean, and an object you built with `new` has no proxy ([03-dependency-injection.md](03-dependency-injection.md)).

> **This is why the interviewer can name the cause without seeing your code.** Handed an NPE trace from a Spring service, they will guess one of those two, and be right most of the time. That is not a party trick — it is what "knowing the framework" actually looks like: the framework constrains the ways things can be null, so the space of causes is small.

---

## `/actuator/health` — the check before all the others

Purpose: separate "the app is down" from "the app is up but cannot reach the database" in one request, before reading any log.
File: `projects/07-timetrack/backend/timetrack/pom.xml` (needs `spring-boot-starter-actuator` — not added yet)
Docs: [Baeldung — Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators) → read: "Health Indicators"

Before you read a log, answer two questions with one HTTP call:

```
GET /actuator/health
```
```json
{
  "status": "UP",
  "components": {
    "db":        { "status": "UP", "details": { "database": "PostgreSQL" } },
    "diskSpace": { "status": "UP" },
    "ping":      { "status": "UP" }
  }
}
```

The top-level `status` answers *is the process alive and serving HTTP?* The `db` component answers *can it actually reach Postgres?* — Actuator's `DataSourceHealthIndicator` runs a trivial validation query through the Hikari pool to find out, so `"db": "DOWN"` is a live fact, not a cached one from startup. A connection refused between them looks like this:

```json
{
  "status": "DOWN",
  "components": {
    "db": { "status": "DOWN", "details": {
      "error": "org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain
                JDBC Connection" } }
  }
}
```

Those two facts triage the whole incident. No response at all → the process is dead or the container is restarting; go read `docker compose logs`. `UP` with `db: DOWN` → your code is fine and the database or the network is not; nothing in your service layer will explain it. `UP` everywhere and users still complain → it is a code or data problem, and Part 2 of this file starts properly.

> **This is also how the *machine* checks.** A container orchestrator does not read logs; it polls `/actuator/health` on a schedule and restarts or de-registers a container that stops answering `UP`. That is the real reason the endpoint exists, and the reason `management.endpoints.web.exposure.include=*` is dangerous: it publishes `/actuator/env`, `/actuator/beans` and `/actuator/heapdump` alongside it — and `/env` prints your resolved properties, `JWT_SECRET` included, to anyone who asks. Expose `health` and `info`, secure the rest. Which endpoints you expose, and how you log without leaking, is where [13-logging-observability.md](13-logging-observability.md) picks up.

---

## What this looks like in an interview

Purpose: turn the two diagnosis flows into the answers a Spanish consultancy screens for.
Docs: re-read the `Action:` block in the first section of this file — it is the answer to the first question below

- **"The app will not start. What is your first move?"** → Read the `APPLICATION FAILED TO START` block at the *bottom* of the output: `Description:` says what broke, `Action:` says what to do. Only if there is no analyzer for it do you fall back to reading the stack trace bottom-up through `Caused by:` to the first frame in your own package.
- **"No qualifying bean of type X — what does that actually mean?"** → Spring's registry has no object of that type: the class has no stereotype annotation, or it sits outside the root package so scanning never reached it, or you injected an interface with no implementation. Say "component scanning starts at `@SpringBootApplication`'s package and goes downwards" — that sentence is what they are listening for.
- **"It works on your machine and dies in Docker Compose. Why?"** → `localhost` inside a container means the container itself. The datasource host must be the Compose **service name** (`db`), injected as `SPRING_DATASOURCE_URL` so the same jar runs in both places. Follow up with `depends_on` waiting for the container, not for Postgres being ready.
- **"This endpoint takes 8 seconds. What do you check first?"** → Measure first (`/actuator/metrics/http.server.requests`), then count the queries with SQL logging (N+1 is the usual verdict), then check the index on the filtered columns, then check whether the list is unbounded — and measure again. Offering an index before measuring fails the question.
- **"Your endpoint returns 403 and the log is empty. What now?"** → The request never reached the controller; it died in the security filter chain, which runs before `DispatcherServlet`. Turn on `logging.level.org.springframework.security=DEBUG` and read which filter denied it.
- **"It works in Postman but the browser says CORS."** → Postman sends no `Origin` and no preflight. The browser's `OPTIONS` preflight carries no JWT and is rejected by the security chain before any controller runs — which is why CORS is configured in `SecurityFilterChain`, not with `@CrossOrigin`.
- **"You get `OutOfMemoryError`. Do you raise `-Xmx`?"** → No. It is an unbounded `findAll()`; the fix is pagination. Raising the heap postpones the crash and slows the app down on the way there.

---

## Where this goes next

Every technique in this file has the same precondition, and it is worth saying out loud: **you can only read evidence that was recorded.** The startup block exists because Spring writes it. The N+1 was visible because `show-sql` was on. The 403 gave up its secret because you raised the security logger to `DEBUG`. Actuator answered because the starter was on the classpath.

Turn that around and you get the uncomfortable version: **a failure you did not instrument is a failure you cannot diagnose.** The corrupt `APPROVED` row from [11-business-logic-domain-modeling.md](11-business-logic-domain-modeling.md) — the one this file opened with — is exactly that case. No exception, no stack trace, no slow query; just a row. The only thing that could ever tell you *who* called `setStatus`, on which entry, at what time, from which request, is a log line somebody had the discipline to write *before* the bug existed.

That is the subject of [13-logging-observability.md](13-logging-observability.md): what to log and at which level, why `log.error("failed", e)` and `log.error(e.getMessage())` are worlds apart, what you must never put in a log line (passwords, raw JWTs, whole request bodies), and how Actuator turns a running app into something a machine can watch. Debugging is reading the evidence. Logging is making sure there is some.

> **Forward reference:** `13-logging-observability.md` is not written yet. When it is, this is the thread it picks up: this file taught you to read the evidence; that one teaches you to leave it behind.
