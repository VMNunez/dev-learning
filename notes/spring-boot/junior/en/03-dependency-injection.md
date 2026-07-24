# Dependency Injection and Spring Beans

> 📖 [Baeldung — Intro to Inversion of Control and DI with Spring](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring)
> 📖 [Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)

---

[02-rest-controllers.md](./02-rest-controllers.md) left you with a question it deliberately refused to answer. Every controller in that file opens with a line like `private final ProjectService projectService`, filled by a constructor you wrote but **never called**. You typed `new` exactly once in the whole backend — on a `Project` entity inside a service — and yet `ProjectController`, `ProjectService` and `ProjectRepository` all exist at runtime, each one holding the correct instance of the layer below it. So who called the constructor?

The answer is the **IoC container**, and this file is where it stops being magic: what a bean actually is, where Spring keeps it, how `@Service`/`@Repository`/`@RestController` register one, how Spring picks a constructor and matches each parameter to a bean, and why the three-layer split from file 02 only *stays* decoupled because something outside the three layers does the assembling.

---

## Why dependency injection exists

Purpose: the problem DI solves — a class that builds its own collaborators can never be tested or swapped, which is what the whole `@Service` + constructor pattern exists to prevent.

File: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — the `private final` repository fields are the finished form of the ✅ example below (the `TransactionService` here is a deliberately generic stand-in, not a TimeTrack class)

Docs: https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring → read: the opening sections contrasting a class that creates its own dependency with one that receives it

Start with the pain. Without DI, a class creates the things it needs, with `new`, inside itself:

```java
// ❌ MAL — TransactionService creates its own repository
public class TransactionService {
    private TransactionRepository repository = new TransactionRepository();
}
```

Nothing here fails to compile, and the code runs. The damage shows up the moment you want to do anything *other* than run it in production:

- **You cannot test it.** A unit test wants to hand the service a fake repository that returns three canned rows without touching PostgreSQL. There is no way in: the `new` is hardcoded inside the class body, so the test gets the real repository, which needs a real database connection. The test is now an integration test whether you wanted one or not.
- **You cannot swap it.** `TransactionService` is now welded to that one concrete class. Switching to a different implementation (a caching repository, an in-memory one) means editing the service — a class that has nothing to do with persistence.

With DI, the service **declares what it needs and receives it from outside**:

```java
// ✅ BIEN — Spring injects the repository; a test can inject a mock instead
@Service
public class TransactionService {
    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

The class went from *"I build my dependency"* to *"give me my dependency"*. That flip is **Inversion of Control (IoC)**: control over *who creates what* has been inverted — taken out of your class and given to the framework. Dependency Injection is the concrete technique that implements IoC (Spring hands the object in through the constructor); IoC is the principle it serves. Interviewers use the two words almost interchangeably, but that is the distinction if you are asked to separate them.

> **The restaurant, again.** File 02 called the service "the kitchen". A kitchen that builds its own oven every morning, from scratch, welded to the floor, is the `new` version. A kitchen that arrives with a socket in the wall and takes *whatever oven is plugged into it* is the DI version — and on a test day you plug in a fake oven that just says "the dish is ready" without cooking anything. Spring is the electrician who wires the sockets before service starts.

> **Why is the field `final`?** Because after the constructor runs, that reference must never change. `final` is the Java `const` — the compiler refuses any later reassignment. It is not decoration: it is what makes the object *immutable in its wiring*, and it is only possible because the value arrives in the constructor (a field you `@Autowired` cannot be `final` — see the contrast below).

This is the repeating pattern under all of Spring Boot: **you declare, Spring provides.** Once you have seen it in the service, you will recognise it everywhere — `JwtFilter` receiving a `JwtUtil`, `SecurityConfig` receiving a `JwtFilter`, a `@RestController` receiving a service. Same move, different layer.

---

## Spring beans — what Spring manages

Purpose: the vocabulary for everything below — a bean is the unit Spring creates, stores and injects, and its default lifetime (one instance for the whole app) is what makes the statelessness rule non-negotiable.

File: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — every variable inside `create()` is a local, and that is not a style choice (below)

Docs: https://www.baeldung.com/spring-bean → read: "What Is a Bean?" and the section on how a bean is registered

A **bean** is any object that Spring creates and manages for you. Nothing more exotic than that: `ProjectService` becomes a bean the moment you write `@Service` on it. Spring keeps every bean in a container called the **ApplicationContext** — think of it as a `Map<String, Object>` that lives for as long as the application does: the key is the bean's name, the value is the single instance. When another class asks for a `ProjectService`, Spring looks in that map and hands over what it finds.

```
ApplicationContext  (created once, at startup, and never emptied)
┌──────────────────────────────────────────────────────┐
│ "userRepository"     → UserRepository$Proxy@1a2b     │
│ "userService"        → UserService@3c4d              │
│ "projectService"     → ProjectService@5e6f           │
│ "timeEntryService"   → TimeEntryService@7a8b         │
│ "passwordEncoder"    → BCryptPasswordEncoder@9c0d    │
└──────────────────────────────────────────────────────┘
```

**By default every bean is a singleton** — Spring creates *one* instance and gives that same object to every class that asks for it. `ProjectController`, and anything else that ever needs a `ProjectService`, all hold a reference to the exact same `ProjectService@5e6f` above.

That single sentence is the reason for a rule you will hear repeated everywhere: **a service must be stateless — no mutable instance fields.** The rule is usually stated and left there, which is why nobody remembers it. Trace the mechanism and it becomes obvious:

Tomcat does not handle requests one after another. It keeps a **pool of threads**, and each incoming HTTP request is picked up by whichever thread is free. Two users hitting `POST /api/entries` at the same moment are two *different threads* running *concurrently* — and both of them run `timeEntryService.create(...)` on **the same singleton instance**, because there is only one in the map.

```
Thread http-nio-8080-exec-1   ─┐
  (Ana's request)              ├──▶  the ONE TimeEntryService@7a8b  ──▶ PostgreSQL
Thread http-nio-8080-exec-2   ─┘
  (Luis's request, 3ms later)
```

Now put a mutable field on that service and watch it break:

```java
// ❌ MAL — a mutable field on a singleton is shared by every concurrent request
@Service
public class TimeEntryService {
    private User currentUser;          // ← ONE field, shared by ALL threads

    public TimeEntryResponse create(CreateTimeEntryRequest request) {
        this.currentUser = loadUserFromToken();   // Ana writes here...
        // ...Luis's thread runs the same line 1ms later and OVERWRITES it...
        TimeEntry entry = new TimeEntry();
        entry.setUser(this.currentUser);          // Ana's entry is now saved under LUIS
        ...
    }
}
```

Ana's thread wrote her user into the field, got interrupted by the scheduler, and by the time it resumed, Luis's thread had already overwritten the *same memory slot*. Ana's time entry is persisted against Luis's account. The bug is invisible under a single-user test and only appears under real load — the worst kind.

```java
// ✅ BIEN — the user lives in a LOCAL variable: one copy per method call, per thread
@Service
public class TimeEntryService {
    private final TimeEntryRepository timeEntryRepository;   // final, set once at startup — safe
    // ... constructor ...

    public TimeEntryResponse create(CreateTimeEntryRequest request) {
        String email = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)         // local — nobody else can see it
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        ...
    }
}
```

This is the real `TimeEntryService.create()` from TimeTrack, and it is why every variable inside it is a **local** one. The mechanism is memory layout, and you already have it: **every thread gets its own call stack** (the same LIFO stack of method frames from [java/08-exceptions.md](../../../java/junior/en/08-exceptions.md), mapped out in [java/15-memory-model.md](../../../java/junior/en/15-memory-model.md) — locals live in the frame, objects live on the shared heap). `email`, `user`, `project` and `timeEntry` are locals: they exist in the frame of *this* invocation, on *this* thread's stack, and disappear when the method returns. Ana's thread and Luis's thread are running the same method on the same object, but each has its own frame with its own `user` slot — neither can reach into the other's. An instance field is the opposite: there is one slot, on the heap, inside the single shared object, and every thread can read and write it.

> **So the object is shared but the method call is not.** That sounds contradictory until you separate the two. The singleton is *one object on the heap* — one address, one set of fields. Calling a method on it does not copy the object; it pushes a new frame on the **caller's** stack, and that frame is where the parameters and locals live. Ten threads calling `create()` on the same singleton means one object and ten independent frames. That is precisely why locals are thread-safe and fields are not — and why "stateless singleton" is not a contradiction in terms.

> **So why are the `private final` repository fields allowed?** Because they are written **once**, by Spring, at startup — before any request thread exists — and then never modified. "Stateless" does not mean "no fields": it means **no fields that change while the app is serving requests**. A `final` dependency is fixed configuration; a `currentUser` is per-request data that has no business living in a shared object.

> **Can you change the scope?** Yes — `@Scope("prototype")` makes Spring create a fresh instance on every injection, and `@Scope("request")` one per HTTP request. In practice you almost never do, and you should not reach for it to paper over a state bug: the fix is to move the state into a local variable, not to multiply the beans. Docs: https://www.baeldung.com/spring-bean-scopes.

---

## Bean annotations — which to use

Purpose: the four annotations that register a class as a bean during component scanning, and the one that actually behaves differently.

File: `src/main/java/com/victor/timetrack/service/ProjectService.java` (`@Service`), `.../repository/ProjectRepository.java` (implicit), `.../controller/ProjectController.java` (`@RestController`), `.../security/JwtUtil.java` (`@Component`)

Docs: https://www.baeldung.com/spring-component-repository-service → read: the sections on `@Component`, `@Service` and `@Repository`

All four register the class as a Spring bean. `@ComponentScan` (from [01-basics.md](./01-basics.md)) walks the packages under `com.victor.timetrack`, finds any class carrying one of them, and puts an instance in the ApplicationContext:

```java
@Component        // generic bean — use when no more specific annotation fits (JwtUtil, JwtFilter)
@Service          // business logic layer (same as @Component, better intent)
@Repository       // data access layer (same as @Component + exception translation)
@RestController   // web layer — handles HTTP requests and returns JSON
```

Read that list as *one annotation per layer of file 02*, not as four different mechanisms. `@Service`, `@Repository` and `@RestController` are all **meta-annotated with `@Component`** — internally they *are* `@Component`, with a label stuck on top. So the difference is mostly semantic: it tells the next developer (and you, in six months) which layer a class belongs to, at a glance, without reading its body.

`@Repository` is the one exception with real behaviour: it also **translates persistence exceptions**. Hibernate throws its own exception types (`ConstraintViolationException`, `LazyInitializationException`); `@Repository` catches them and rethrows them as Spring's `DataAccessException` hierarchy. The payoff is that your *service* layer never has to import a Hibernate class to catch an error — it only ever sees Spring's consistent types, so swapping Hibernate for another JPA provider would not ripple upward.

> **Where is `@Repository` in TimeTrack, then?** Nowhere — and that is correct. `UserRepository`, `ProjectRepository` and `TimeEntryRepository` are *interfaces* extending `JpaRepository`, and Spring Data detects and registers those itself, applying the exception translation without the annotation. You write `@Repository` by hand only on a repository class you implemented yourself. Full mechanism in [04-spring-data-jpa.md](./04-spring-data-jpa.md).

---

## Constructor injection — the correct way

Purpose: the only form of injection you should write in new code, and the concrete failures of the other two.

File: `src/main/java/com/victor/timetrack/service/TimeEntryService.java` — the 3-argument constructor is the pattern at its most typical

Docs: https://www.baeldung.com/constructor-injection-in-spring → read: the comparison of constructor, setter and field injection

There are three ways to get a dependency into a bean. Only one belongs in code you write today:

```java
// ❌ MAL — 1. Field injection. Compiles, runs, and hides everything that matters.
@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;   // Spring sets this by reflection, after construction
}

// ❌ MAL — 2. Setter injection. Rare, mostly legacy XML-era code.
@Service
public class TransactionService {
    private TransactionRepository repository;

    @Autowired
    public void setRepository(TransactionRepository repository) {
        this.repository = repository;
    }
}

// ✅ BIEN — 3. Constructor injection. The dependency is a parameter; the field can be final.
@Service
public class TransactionService {
    private final TransactionRepository repository;

    // @Autowired is optional since Spring 4.3 — with a single constructor, Spring uses it
    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

**Why constructor injection wins — the four arguments, in the order an interviewer wants them:**

1. **`final` works.** A field Spring sets by reflection *cannot* be `final`, because the object is already constructed by the time Spring writes into it — so field injection forfeits immutability. Constructor injection gets it for free.
2. **The dependencies are visible.** The constructor signature is the class's honest shopping list. `TimeEntryService`'s constructor takes **three** repositories, and you can see all three without scrolling:

   ```java
   public TimeEntryService(
           TimeEntryRepository timeEntryRepository,
           ProjectRepository projectRepository,
           UserRepository userRepository) {
       this.timeEntryRepository = timeEntryRepository;
       this.projectRepository = projectRepository;
       this.userRepository = userRepository;
   }
   ```

   With field injection those three `@Autowired` fields are scattered anywhere in the class, and nothing stops them becoming eight. A constructor with eight parameters *looks* wrong — and that ugliness is a feature: it is the class telling you it does too much.
3. **It tests without Spring at all.** `new TimeEntryService(mockEntries, mockProjects, mockUsers)` — plain Java, no context to boot, milliseconds. With field injection there is no way to set a `private` field from a test except reflection or a Spring test context, which is exactly why field injection makes tests slow and awkward ([09-testing.md](./09-testing.md)).
4. **Circular dependencies are impossible to miss.** If `AService` needs `BService` and `BService` needs `AService`, neither constructor can run first — Spring cannot build either one, because building either requires the other to already exist. It says so before the app is up:

   ```
   ***************************
   APPLICATION FAILED TO START
   ***************************

   Description:

   The dependencies of some of the beans in the application context form a cycle:

   ┌─────┐
   |  aService defined in file [...AService.class]
   ↑     ↓
   |  bService defined in file [...BService.class]
   └─────┘

   Action:

   Relying upon circular references is discouraged and they are prohibited by default.
   Update your application to remove the dependency cycle between beans.
   ```

   The cycle is not a Spring bug you work around — it is a design smell in *your* classes: two services that each need the other are really one responsibility split down the middle, or a third class waiting to be extracted.

   > **Careful with the old version of this argument.** You will read everywhere that "field injection lets a cycle through, constructor injection catches it". That *was* true: with `@Autowired` fields Spring can construct both objects empty and fill them in afterwards, so the cycle survived to runtime. **Since Spring Boot 2.6 circular references are prohibited by default** — the banner above is what you get with field injection too, unless someone sets `spring.main.allow-circular-references=true`. What still holds is the *mechanism*: a constructor cycle is unbreakable by construction, while a field cycle only fails because the framework decided to refuse it. Say the sharper version in an interview and you are ahead of the copy-pasted answer. Docs: https://www.baeldung.com/circular-dependencies-in-spring.

> **When did `@Autowired` become optional?** Spring 4.3. If a class has exactly **one** constructor, Spring uses it — no annotation needed. That is why none of TimeTrack's constructors carry `@Autowired`. It becomes mandatory again the moment a class has *two* constructors, because then Spring has no way to guess which one to call, and you must annotate the one it should use.

---

## @Bean — beans from library classes

Purpose: register an object as a bean when you cannot annotate its class — because you did not write it.

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: https://www.baeldung.com/spring-bean → read: the section on Java-based configuration with `@Bean` methods

`@Component`, `@Service` and `@Repository` all require one thing: that you can open the class and type an annotation on it. That works for *your* classes. It does not work for `BCryptPasswordEncoder` — that class lives inside the Spring Security jar, read-only, and no amount of wishing will put `@Component` on it.

The escape hatch is `@Bean`: you write a **method** that returns the object, inside a `@Configuration` class, and Spring calls that method at startup and stores whatever it returns in the ApplicationContext. You are not annotating the class — you are handing Spring a recipe for building the instance. TimeTrack's `SecurityConfig` (in the `security` package, not `config`) declares **four** `@Bean` methods — `securityFilterChain()`, `passwordEncoder()`, `authenticationManager()` and `corsConfigurationSource()`. Two of them are enough to show both shapes; the other two belong to [06-security-jwt.md](./06-security-jwt.md):

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();   // library class — you cannot add @Component to it
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

- **The method name becomes the bean name** — `passwordEncoder()` registers a bean called `"passwordEncoder"`. This matters in the `@Qualifier` section below.
- **The return type becomes the bean's type** — declaring `PasswordEncoder` (the interface) rather than `BCryptPasswordEncoder` (the class) is deliberate: everything that injects it depends on the interface, so switching the hashing algorithm later means editing this one method and nothing else.
- **A `@Bean` method can itself take parameters, and they are injected too.** `authenticationManager(AuthenticationConfiguration config)` does not build the object at all — it asks Spring for a bean Spring Boot already auto-configured, and pulls the manager out of it. Spring sees the parameter, finds an `AuthenticationConfiguration` bean, and passes it in. Same rule as a constructor, one level down.

After this runs, any class with `PasswordEncoder` as a constructor parameter receives that `BCryptPasswordEncoder` instance without knowing where it came from.

> **Who actually injects it in TimeTrack? Nothing you wrote.** Search the project and `PasswordEncoder` appears in exactly one file — `SecurityConfig`, where it is declared. The consumer is Spring Security itself: its auto-configured authentication provider looks in the context for a `PasswordEncoder` bean and uses it to compare the raw password from `/api/auth/login` against the BCrypt hash stored in `users.password`. That is `@Bean` at its purest — you are not building an object for *your* code, you are dropping one into the container so that **framework code you never call** can pick it up by type. Remove the method and the framework falls back to its own default, which is not what you want. The full flow is in [06-security-jwt.md](./06-security-jwt.md).

> **`@Component` vs `@Bean` — the one-line rule.** `@Component` goes on **a class you own**, and Spring instantiates it for you. `@Bean` goes on **a method you write**, and *you* instantiate the object (or fetch it) — because it is a class you do not own, or because building it takes logic (arguments, conditions) that an annotation cannot express. Every `@Bean` in TimeTrack's `SecurityConfig` is one of those two cases.

---

## How Spring wires everything at startup

Purpose: the actual startup sequence — what happens between `main()` running and the first HTTP request being served.

File: `src/main/java/com/victor/timetrack/TimetrackApplication.java` → `SpringApplication.run(...)` is the line that triggers all of this

Docs: https://www.baeldung.com/spring-application-context → read: the sections on what the container does when it starts and how bean definitions are turned into instances

`SpringApplication.run()` does two distinct things, in order: first it **finds** every bean *definition* (scanning for `@Component` & friends, reading every `@Bean` method) — at this point nothing is instantiated, Spring is just building a list of "things I know how to create, and what each one needs". Only then does it **create** them.

Here is TimeTrack's own startup, with the real classes:

```
1. SCAN — build the definitions (nothing exists yet)
   com.victor.timetrack.*  →  JwtUtil, JwtFilter, JwtAuthenticationEntryPoint,
                              UserService, ProjectService, TimeEntryService, ReportService,
                              AuthService, UserDetailsServiceImpl,
                              UserController, ProjectController, TimeEntryController,
                              AuthController, ReportController,
                              SecurityConfig (+ its 4 @Bean methods)
        ↓
2. RESOLVE — for each definition, read the constructor and list what it needs
   TimeEntryService  needs → TimeEntryRepository, ProjectRepository, UserRepository
   SecurityConfig    needs → JwtFilter, JwtAuthenticationEntryPoint
   JwtFilter         needs → JwtUtil, UserDetailsServiceImpl
   AuthService       needs → AuthenticationManager (a @Bean, not a @Component), JwtUtil
   JwtUtil           needs → nothing (@Value fields, no constructor args)
        ↓
3. INSTANTIATE in dependency order — leaves first, then whatever depends on them
   JwtUtil                → no dependencies, build it now
   TimeEntryRepository    → Spring Data generates the implementation
   JwtFilter              → its dependencies now exist, build it
   TimeEntryService       → its 3 repositories now exist, build it
   SecurityConfig         → its filter now exists, build it, then call its @Bean methods
   TimeEntryController    → its service now exists, build it
        ↓
4. Application ready — every bean created, every reference wired
```

**The critical thing this diagram is showing you: Spring does not read your project top-to-bottom, or alphabetically, or in the order you created the files.** It builds a **dependency graph** — a map of "X needs Y" edges across every bean definition — and then instantiates in the only order that graph allows: a bean is created only once *all* of its dependencies already exist. Nothing in your source code says "create `JwtUtil` before `JwtFilter`"; Spring derives that from the fact that `JwtFilter`'s constructor asks for a `JwtUtil`. It is a topological sort, not a script.

> **This is why file order and package order are irrelevant.** You can create `TimeEntryController` before `TimeEntryService` exists, put them in any package, name them anything — as long as the graph has no cycle, Spring finds a valid order. And when the graph *does* have a cycle, it cannot: there is no "leaves first" to start from, which is exactly the circular-dependency crash from the previous section.

**When the graph has a hole — the error you will actually see.** Forget `@Service` on `TimeEntryService`, and no definition for it ever enters step 1. Spring reaches step 2 for `TimeEntryController`, sees it needs a `TimeEntryService`, looks in the context, and finds nothing:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.victor.timetrack.controller.TimeEntryController required
a bean of type 'com.victor.timetrack.service.TimeEntryService' that could not be found.

Action:

Consider defining a bean of type 'com.victor.timetrack.service.TimeEntryService' in your configuration.
```

Underneath that friendly report is a `NoSuchBeanDefinitionException`. Read the message literally and it tells you exactly where to look: **"Parameter 0 of constructor in X"** is the class doing the *asking* (the controller — which is fine), and **"a bean of type Y"** is the class that is *missing* (the service — that is where your bug is). The instinct is to go stare at the class named first; the fix is almost always in the class named second. Nine times out of ten the cause is a missing stereotype annotation, and the tenth is a class sitting outside the `@ComponentScan` root package. Docs: https://www.baeldung.com/spring-nosuchbeandefinitionexception.

> **Why is this a *startup* crash and not a `NullPointerException` on the first request?** Because the graph is resolved *before* Tomcat starts accepting connections. Spring refuses to come up half-wired. This is the same trade you saw with `@Value` and with circular dependencies, and it is the whole philosophy of the container: **fail at startup, not in front of a user.** A backend that will not boot is a five-minute fix; a backend that boots and NPEs at 3am is not.

---

## @Qualifier and @Primary — multiple implementations

Purpose: break the tie when two beans satisfy the same constructor parameter — Spring matches by *type*, so two implementations of one interface are ambiguous.

Docs: https://www.baeldung.com/spring-qualifier-annotation → read: the sections on `@Qualifier` and its interaction with `@Primary`

> **The example below is generic, not TimeTrack.** There is no `NotificationService` or `AlertService` in the repo — the project has no interface with two implementations, so it needs neither annotation (the closing paragraph says why that is normal at this size). The classes here are the smallest thing that reproduces the ambiguity; the package in the error message is `com.example.demo` for exactly that reason. Do not go looking for them in the backend.

Everything above worked because a constructor parameter's **type** identified exactly one bean. Break that assumption and Spring stops:

```java
public interface NotificationService { void send(String message); }

@Service
public class EmailNotificationService implements NotificationService { ... }

@Service
public class SmsNotificationService implements NotificationService { ... }

// ❌ MAL — which one? Spring cannot choose, and refuses to guess.
@Service
public class AlertService {
    public AlertService(NotificationService ns) { ... }
}
```

The app does not start. `NoUniqueBeanDefinitionException`:

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in com.example.demo.service.AlertService required a single bean,
but 2 were found:
	- emailNotificationService: defined in file [.../EmailNotificationService.class]
	- smsNotificationService: defined in file [.../SmsNotificationService.class]

Action:

Consider marking one of the beans as @Primary, updating the consumer to accept multiple beans,
or using @Qualifier to identify the bean that should be consumed
```

Spring is doing you a favour by refusing: the alternative would be to pick one at random, and a backend that silently sends SMS instead of email is far worse than one that will not start. Note that the `Action:` line hands you the two fixes verbatim — and both of them are below.

Two annotations resolve it, and they answer different questions:

```java
@Service
@Primary   // ✅ "when someone just asks for a NotificationService, give them THIS one"
public class EmailNotificationService implements NotificationService { ... }

@Service
public class SmsNotificationService implements NotificationService { ... }

@Service
public class AlertService {
    // ✅ "...unless they name a bean explicitly, like here"
    public AlertService(@Qualifier("smsNotificationService") NotificationService ns) { ... }
}
```

- **`@Primary` sets the default** — it lives on the *bean*, and applies to every injection point that does not say otherwise. One winner for the whole app.
- **`@Qualifier` overrides it per injection point** — it lives on the *parameter*, and names the specific bean it wants.

**Where does the string `"smsNotificationService"` come from?** It is not invented, and it is not the class name — look closely at the capital `S`. When Spring registers a bean from a stereotype annotation and you give it no explicit name, it derives one from **the class's simple name with the first letter lowercased**: `SmsNotificationService` → `"smsNotificationService"`, `ProjectService` → `"projectService"`, `JwtUtil` → `"jwtUtil"`. That is the same convention that produced every key in the ApplicationContext map drawn earlier in this file, and the same names Spring prints in the `NoUniqueBeanDefinitionException` above — which makes that error message a free lookup table: it lists the exact strings you can paste into a `@Qualifier`.

> **Two ways to set a bean's name explicitly, if you do not want the derived one:** pass it to the stereotype — `@Service("sms")` — and then qualify with `@Qualifier("sms")`. For a `@Bean` method, the **method name** is the bean name (that is why `passwordEncoder()` in `SecurityConfig` produces a bean called `"passwordEncoder"`), and you override it with `@Bean(name = "...")`. Docs: https://www.baeldung.com/spring-bean-names.

> **Careful with the first-letter rule — there is one edge case.** Spring uses `java.beans.Introspector.decapitalize()`, which leaves the name **unchanged** when the first *two* letters are both uppercase: a class called `JWTService` registers as `"JWTService"`, not `"jWTService"`. You will almost never hit it, but it is exactly the kind of thing that produces a baffling `@Qualifier` failure. (It is also a good reason to name the class `JwtService`, as TimeTrack does with `JwtUtil`.)

In practice you rarely need either annotation in a project this size — TimeTrack has no interface with two implementations, so it uses neither. They matter in larger codebases (a `PaymentGateway` with a Stripe and a PayPal implementation, a real vs. a stub mailer per environment) and they are a standard interview question precisely because they are where "Spring injects by type" visibly runs out of road.

---

## @Value — reading configuration into beans

Purpose: pull a single value out of `application.properties` and into a bean field, so secrets and environment-specific settings never live in the source code.

File: `src/main/java/com/victor/timetrack/security/JwtUtil.java`

Docs: https://www.baeldung.com/spring-value-annotation → read: the sections on injecting properties and on default values

Beans do not only depend on other beans — they depend on **configuration**. TimeTrack's `JwtUtil` needs the signing secret and the token lifetime, and neither of those can be hardcoded: the secret must not be in git, and the lifetime differs between your laptop and production. `@Value` injects them from `application.properties`:

```java
@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    ...
}
```

- **`${...}` is a property placeholder, not a Java expression.** At startup Spring resolves the text between the braces against every property source it knows (`application.properties`, environment variables, command-line args) and writes the result into the field.
- **The type conversion is free.** The property file only ever holds text — `app.jwt.expiration=86400000` is the string `"86400000"`. The field is declared `long`, so Spring converts it before assigning. Declare the field wrong and you get a startup failure, not a silent zero.
- **A missing key is a startup crash, not a `null`.** No `app.jwt.secret` in any property source and the context fails to build: `Could not resolve placeholder 'app.jwt.secret' in value "${app.jwt.secret}"`. Same philosophy as the missing bean above — the app refuses to run half-configured rather than throw a `NullPointerException` at the first login attempt.

> **How does this reach a real secret in production?** `application.properties` holds `app.jwt.secret=${JWT_SECRET}` — a placeholder pointing at an **environment variable**, not the value itself. Spring resolves environment variables as a property source, so the file you commit contains only the *name* of the secret, and the actual bytes live in the deployment environment (Docker, the CI runner, the server). The file is safe to push; the secret was never in it.

> **Why is `@Value` on a field here, when field injection was just condemned?** Because `@Value` is not injecting a *bean* — it is injecting a *literal*. None of the four arguments for constructor injection apply: a `String` secret is not something you mock, it creates no dependency graph, and there is no cycle to detect. It is still true that a constructor-injected `@Value` parameter (or, better, the `@ConfigurationProperties` class below) is more testable, which is exactly why the next section exists.

---

## @ConfigurationProperties — binding grouped config to a class

Purpose: bind a whole *group* of related properties to one typed class in a single step, instead of scattering a `@Value` per field across the beans that need them.

Docs: https://www.baeldung.com/configuration-properties-in-spring-boot → read: "Simple Properties" and "Nested Properties"

> **This section is a proposed refactor, not code that exists in TimeTrack.** The project currently uses two `@Value` fields in `JwtUtil` (the section above) — which is exactly the point at which this pattern starts to pay off, and the reason it is worth knowing before the third property arrives. Everything below is the shape the refactor would take; do not go looking for `JwtProperties.java` in the repo.

`@Value` scales badly. Add an issuer, a refresh-token lifetime, a clock-skew tolerance, and the same `app.jwt.` prefix is now repeated across five annotations in three different classes — and nothing ties them together or tells you the set exists. `@ConfigurationProperties` binds the whole prefix to one class, once:

```properties
# application.properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
app.jwt.issuer=timetrack-api
```

```java
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    private String issuer;
    // Lombok @Data generates the getters/setters — Spring needs the SETTERS to bind
}
```

```java
// Enable it once — on the @Configuration class or on the main application class:
@EnableConfigurationProperties(JwtProperties.class)

// From then on it is an ordinary bean, injected through the constructor like any other:
@Component
public class JwtUtil {
    private final JwtProperties jwtProperties;

    public JwtUtil(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }
}
```

**The binding mechanism, step by step** — this is *relaxed binding*, and it is more forgiving than it looks: Spring takes the prefix `app.jwt`, appends each field name of the class, and looks the result up in the property sources. Field `expiration` → key `app.jwt.expiration`. It then calls the **setter** (`setExpiration(86400000L)`), which is why the class needs setters and a no-args constructor, and why `@Data` is doing real work here rather than just saving keystrokes. "Relaxed" means the key does not have to match the field character for character: `app.jwt.refresh-expiration`, `app.jwt.refreshExpiration` and the environment variable `APP_JWT_REFRESHEXPIRATION` all bind to a field called `refreshExpiration`. That is what lets the same class read from a kebab-case properties file *and* from screaming-snake-case environment variables in Docker without you writing anything twice.

**`@Value` vs `@ConfigurationProperties`:**

| | `@Value` | `@ConfigurationProperties` |
|---|---|---|
| When to use | One or two isolated values | A group of related values |
| Type safety | Per-field, no grouping | Yes — the whole prefix is one typed object |
| Testability | Needs a Spring context to populate | Just `new JwtProperties()` and set the fields |

Read the table by its **last row** — that is the one that decides the argument. The first two rows are about tidiness; testability is about whether the class you are injecting into can be unit-tested at all. A `JwtUtil` with `@Value` fields cannot be constructed in a plain JUnit test with a usable secret (the fields are `private`, and nothing sets them without a context). A `JwtUtil` that takes a `JwtProperties` in its constructor can: you build the properties object by hand, pass it in, and you are testing pure Java again — the exact same argument that made constructor injection win, applied to configuration instead of beans.

> **Why interviewers ask this:** once you have more than two or three `@Value` injections sharing a prefix, the code has a smell — the group is real but nothing in the code says so. `@ConfigurationProperties` is the production pattern, and "how do you manage grouped configuration?" is a question with an expected answer. Naming the pattern *and* the reason (type safety + testability, not just neatness) is what separates a rehearsed answer from an understood one.

---

## Where this leaves you — and what comes next

The question file 02 ended on is answered. Nobody calls `new ProjectService(...)` because **Spring does**: `@Service` puts a definition in the ApplicationContext, the constructor's parameters declare what that bean needs, Spring resolves the whole set into a dependency graph, instantiates in an order the graph dictates, and injects one shared singleton instance into every class that asked for the type. Constructor injection is the form that makes the dependencies visible, the fields `final`, the class testable without a container, and a cycle a startup crash instead of a production ghost. And when the graph has a hole, you now know the exact message — `Parameter 0 of constructor in ... required a bean of type '...' that could not be found` — and which of the two class names in it is the one with your bug.

One bean in every wiring diagram of this file has been quietly cheating, though. `TimeEntryService`'s constructor asks for three repositories, and Spring finds all three — but you never wrote a single line of `TimeEntryRepository`'s body. It is an *interface*. There is no class implementing it anywhere in the project, no `@Repository` on it, no `new` — and yet at startup a real object appears in the context and `findAll()` returns rows from PostgreSQL. A container that only instantiates classes you wrote cannot explain that.

[04-spring-data-jpa.md](./04-spring-data-jpa.md) is where that gets resolved: how Spring Data *generates* the implementation of a repository interface at runtime, how `@Entity` maps a class onto a table, and how a method called `findByActiveTrue()` — with no body at all — becomes a `SELECT`.
