# Testing in Spring Boot

> 📖 [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing)
> 📖 [Spring Boot Testing Reference](https://docs.spring.io/spring-boot/reference/testing/)

## Picking up the thread — the failures you cannot see

[08-transactions.md](./08-transactions.md) closed on an uncomfortable fact: **every failure on that page is silent.** A swallowed exception commits. A self-call runs with no transaction. `readOnly = true` eats your update. In all three cases there is no exception, no log line, no red text — and the source code of the broken version is indistinguishable from the working one, because the annotation is sitting right there either way.

That is the exact shape of the problem this file solves, and it is not limited to transactions. Look at what you have already built and ask how you would *know*:

```
@Transactional on approve()   → did the entry really stay SUBMITTED when the audit write blew up?
@PreAuthorize("hasRole(...)") → does an EMPLOYEE token really get 403, or did the ROLE_ prefix drift?
@Valid on the request body    → does hours: null really produce a 400, or does it reach PostgreSQL?
@Enumerated(EnumType.STRING)  → is DRAFT stored as the word, or as the ordinal 0?
```

Reading the code proves none of these. Every one of them is a claim about what happens **at runtime**, inside a proxy or a filter or Hibernate — machinery you did not write and cannot see. There is exactly one way to turn a claim into a fact: make the thing fail on purpose, and assert on what came out. That is what a test is, and it is why this file arrives now, immediately after the three files (06 security, 07 validation, 08 transactions) that filled TimeTrack with invisible promises.

> **The twist 08 warned you about — `@Transactional` on a *test* method is a different animal.** On a service method it means "wrap this in a transaction and roll back if something unchecked escapes". On a test method Spring's test framework reads it as **"wrap this test in a transaction and roll it back at the end, always — even when the test passes"**, so the writes never reach the database and the next test starts from a clean slate. Same annotation, opposite intent: one rolls back on failure, the other rolls back on purpose. `@DataJpaTest` turns it on for you, which is why a repository test that "saves" a row leaves nothing behind — and why it can pass for the wrong reason. The section on `@DataJpaTest` below is where that bites.

**Where the project actually stands.** TimeTrack has **one** test today — `src/test/java/com/victor/timetrack/TimetrackApplicationTests.java`, the empty `contextLoads()` that Spring Initializr generates:

```java
// src/test/java/com/victor/timetrack/TimetrackApplicationTests.java — the real file, all of it
@SpringBootTest
class TimetrackApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

That test is not worthless — an empty body still boots the whole application context, so it fails if a bean cannot be wired or a property is missing. But it asserts nothing about your logic. **Every other code block in this file is a test you have not written yet**, proposed against the real TimeTrack classes. Treat them as the plan, not as a quote from the repo.

---

## The problem without tests

Without tests, you find bugs in production — or worse, the interviewer finds them when you demo your project. More importantly: Spanish consultancies in 2026 explicitly ask whether candidates can write tests. A project with zero tests is a yellow flag.

Spring Boot testing is not one tool — it is four tools (`@WebMvcTest`, JUnit 5 + Mockito, `@DataJpaTest`, `@SpringBootTest`) with a clear rule for when to use each.

---

## The layered testing strategy — one tool per layer

Purpose: pick the right test type before writing a line, so a failure points at one layer instead of the whole app.
File: no project file — this is the strategy the tests proposed below follow; TimeTrack's `src/test/` currently holds only `TimetrackApplicationTests.java`.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: the opening "Test Slices" overview before the annotation sections

```
Layer           Tool                      What Spring loads
─────────────────────────────────────────────────────────────
Controller      @WebMvcTest               Web layer only — no DB
Service         JUnit 5 + Mockito         Nothing — pure Java, fastest
Repository      @DataJpaTest              JPA + H2 in-memory DB
Full flow       @SpringBootTest           Everything — slowest
```

**The rule:** test each layer in isolation. A service test should not start a web server. A controller test should not connect to a database. Using the wrong tool wastes time and makes failures hard to locate.

---

## JUnit 5 — the test runner

Purpose: the framework that finds your test methods, runs each one, and reports pass or fail; every other tool on this page plugs into it.
File: `projects/07-timetrack/backend/timetrack/pom.xml` — JUnit 5 arrives through the two `test`-scoped starters; no test class uses these annotations yet beyond `contextLoads()`.
Docs: [Baeldung — A Guide to JUnit 5](https://www.baeldung.com/junit-5) → read: "Annotations" and "Test Lifecycle" — it shows a full class per annotation, which the JUnit reference table does not

JUnit 5 is the standard Java test framework. You never add it by hand: Spring Initializr puts it in the `pom.xml` for you, inside the test starters.

**Which starter, on Boot 4.** Older tutorials — and most of the internet — tell you JUnit arrives via a single `spring-boot-starter-test`. On **Boot 4 that dependency does not exist**: it was split per test slice. TimeTrack's real `pom.xml` has two:

```xml
<!-- projects/07-timetrack/backend/timetrack/pom.xml — the real file -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc-test</artifactId>
    <scope>test</scope>
</dependency>
```

Same tools underneath — JUnit 5, Mockito, AssertJ, `MockMvc` — they just arrive in two packages matched to the layers you use ([01-basics.md](./01-basics.md) covers the split and the `<scope>test</scope>` rule that keeps them out of the production jar). If you copy a `spring-boot-starter-test` line from a 2023 tutorial into this project, Maven fails to resolve it: `Could not find artifact org.springframework.boot:spring-boot-starter-test:jar` — the name is simply gone.

The skeleton of every test class you will write looks like this — a plain Java class, no Spring anywhere:

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class TimeEntryServiceTest {

    @BeforeEach
    void setUp() {
        // runs before every @Test — reset state here
    }

    @Test
    void shouldApproveEntry_whenSubmitted() {
        // test code here
    }

    @Test
    void shouldThrow_whenEntryNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            service.approve(999L);
        });
    }
}
```

**Key lifecycle annotations:**

| Annotation | When it runs |
|---|---|
| `@Test` | Marks a method as a test |
| `@BeforeEach` | Before each test — reset mocks, prepare data |
| `@AfterEach` | After each test — clean up |
| `@BeforeAll` | Once before all tests in the class (must be `static`) |

How to read it: the **"When it runs"** column is really telling you *how often*, and that is the only thing you have to decide. `@BeforeEach` runs N times for N tests, so it is where anything that must be **fresh** goes (new mocks, a reset counter). `@BeforeAll` runs exactly once for the whole class, so it is for things that are expensive and **shared** (starting a container, loading a fixture file). Put fresh setup in `@BeforeAll` and test 2 inherits whatever test 1 did to it; put expensive setup in `@BeforeEach` and your suite crawls.

> **Why `@BeforeAll` must be `static` — the mechanism, and it explains `@BeforeEach` at the same time.** By default **JUnit constructs a brand-new instance of your test class before every single `@Test` method.** Ten test methods means ten `new TimeEntryServiceTest()` calls. That is deliberate: fields cannot leak from one test to the next, because there is no shared object for them to leak through — each test gets virgin fields, which is what makes tests runnable in any order.
>
> Now follow the timeline. `@BeforeAll` is defined as "once, **before all tests**" — before the *first* test, which means before the first instance is constructed:
>
> ```
> [ JUnit finds the class ]
>        ↓
> @BeforeAll runs          ← no instance exists yet. Nothing to call a normal method on.
>        ↓
> new TimeEntryServiceTest()  →  @BeforeEach  →  @Test #1  →  @AfterEach
>        ↓
> new TimeEntryServiceTest()  →  @BeforeEach  →  @Test #2  →  @AfterEach   ← a different object
>        ↓
> @AfterAll runs
> ```
>
> An instance method can only be invoked *on an object*, and at the moment `@BeforeAll` must run there is no object. A `static` method belongs to the **class** rather than to any instance, so it exists from the moment the class is loaded — it is the only kind of method that can be called at that point in the timeline. This is not a JUnit rule invented for style; it falls straight out of the per-test-instance design. Forget it and JUnit refuses to run the class at all:
>
> `org.junit.platform.commons.JUnitException: @BeforeAll method 'void TimeEntryServiceTest.setUp()' must be static unless the test class is annotated with @TestInstance(Lifecycle.PER_CLASS).`
>
> The error names its own escape hatch: `@TestInstance(Lifecycle.PER_CLASS)` on the class tells JUnit to create **one** instance and reuse it for every test. An instance now exists before the first test, so a non-static `@BeforeAll` becomes legal — at the price of losing the isolation guarantee, since every test then shares those fields. Take the `static`.

**Common assertions:**

```java
assertEquals(expected, actual);        // values are equal
assertNotNull(result);                 // result is not null
assertTrue(result.isPresent());        // condition is true
assertFalse(result.isEmpty());         // condition is false
assertThrows(SomeException.class, () -> { /* call that throws */ });
```

---

## Testing a service — JUnit 5 + Mockito (no Spring)

Purpose: prove one service class's business logic in isolation, with no database and no Spring context — the test you write most often and the one that runs in milliseconds.
File: no project file yet — the proposed home is `src/test/java/com/victor/timetrack/service/TimeEntryServiceTest.java`, mocking `TimeEntryRepository` to test `submit()` and `approve()`.
Docs: [Baeldung — Mockito Annotations](https://www.baeldung.com/mockito-annotations) → read: the `@Mock` and `@InjectMocks` sections

This is the fastest test you write. You do not load Spring at all — you create the service with mock repositories passed through the constructor, just like constructor injection works in production. `TimeEntryService.approve()` is the cleanest method to start with, because it reads no `SecurityContextHolder` — it only touches the entry repository, so the whole test is `findById` → change status → `save`.

```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)    // activates Mockito annotations
class TimeEntryServiceTest {

    @Mock
    TimeEntryRepository timeEntryRepository;  // Mockito creates a fake — returns null by default
    @Mock
    ProjectRepository projectRepository;      // the service needs all three constructor args…
    @Mock
    UserRepository userRepository;            // …even though approve() only uses the first

    @InjectMocks
    TimeEntryService service;        // real service, with the three mocks injected

    @Test
    void approve_setsStatusToApproved_whenSubmitted() {
        // Arrange — build a SUBMITTED entry and tell the mock to return it.
        // toResponse() reads user.getName() and project.getName(), so both must be set.
        User user = new User();
        user.setName("Alice");
        Project project = new Project();
        project.setName("Internal");

        TimeEntry entry = new TimeEntry();
        entry.setId(1L);
        entry.setUser(user);
        entry.setProject(project);
        entry.setStatus(EntryStatus.SUBMITTED);

        when(timeEntryRepository.findById(1L)).thenReturn(Optional.of(entry));
        when(timeEntryRepository.save(entry)).thenReturn(entry);

        // Act
        TimeEntryResponse result = service.approve(1L);

        // Assert
        assertEquals(EntryStatus.APPROVED, result.getStatus());
        verify(timeEntryRepository).save(entry);
    }

    @Test
    void approve_throwsNotFound_whenEntryMissing() {
        when(timeEntryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.approve(999L));
    }

    @Test
    void approve_throwsBusinessRule_whenNotSubmitted() {
        TimeEntry draft = new TimeEntry();
        draft.setStatus(EntryStatus.DRAFT);   // approve() only accepts SUBMITTED
        when(timeEntryRepository.findById(1L)).thenReturn(Optional.of(draft));

        assertThrows(BusinessRuleViolationException.class, () -> service.approve(1L));
    }
}
```

> **What `@ExtendWith(MockitoExtension.class)` actually does.** JUnit 5 does not know what `@Mock` or `@InjectMocks` mean on its own — those are Mockito annotations, not JUnit ones. `@ExtendWith` plugs a JUnit 5 *extension* into the test lifecycle; `MockitoExtension` is that plug for Mockito. Before each test runs, it scans the class for `@Mock` fields and creates a fake for each one, then scans for `@InjectMocks` and constructs that object, passing in the fakes it just created — same constructor injection Spring uses in production, just wired by Mockito instead of Spring. `TimeEntryService`'s constructor takes three repositories, so all three `@Mock` fields exist even though `approve()` never calls two of them. Without `@ExtendWith(MockitoExtension.class)`, every `@Mock` field stays `null` and the test fails with a `NullPointerException` on the first call.

**Arrange / Act / Assert** — always structure tests this way:
- **Arrange** — set up test data and mock behaviour
- **Act** — call the method you are testing
- **Assert** — check the result

**Why not call `timeEntryRepository.findById()` in a service test without mocking?** Because the repository is a Spring-generated bean — it only exists when Spring is running. Without a mock, the test would fail with a `NullPointerException` before it even gets to your code.

---

## Mockito — the most useful methods

Purpose: the five calls that cover almost every mock you will write — make it return, make it throw, and prove it was called.
File: no project file yet — these are the calls the proposed `TimeEntryServiceTest` uses against a mocked `TimeEntryRepository`.
Docs: [Baeldung — Mockito's Mock Methods](https://www.baeldung.com/mockito-behavior) → read: the `when()`/`thenReturn()` and `verify()` sections

```java
// Make the mock return something
when(timeEntryRepository.findById(1L)).thenReturn(Optional.of(entry));
when(timeEntryRepository.findAll()).thenReturn(List.of(e1, e2));

// Make the mock throw (ResourceNotFoundException takes a single message String)
when(timeEntryRepository.findById(999L)).thenThrow(new ResourceNotFoundException("Entry not found with id 999"));

// Make a void method throw — when().thenThrow() doesn't work here, there's no return value to chain onto
doThrow(new ResourceNotFoundException("Entry not found with id 999")).when(timeEntryRepository).deleteById(999L);

// Verify a method was called
verify(timeEntryRepository).save(any(TimeEntry.class));
verify(timeEntryRepository, times(1)).deleteById(1L);
verify(timeEntryRepository, never()).delete(any());

// Matchers — when you don't care about the exact value
when(timeEntryRepository.findById(anyLong())).thenReturn(Optional.empty());
```

> **`any()` and `anyLong()` are Mockito matchers.** They match any argument of the given type. Use them when the exact value does not matter for what you are testing.

---

## @WebMvcTest — controller layer only

Purpose: prove the HTTP contract — routing, status codes, JSON shape, and `@Valid` — without a database anywhere near the test.
File: no project file yet — the proposed home is `src/test/java/com/victor/timetrack/controller/TimeEntryControllerTest.java`, covering `GET /api/entries` and an invalid `POST /api/entries`.
Docs: [Baeldung — Using MockMvc With @SpringBootTest vs. @WebMvcTest](https://www.baeldung.com/spring-mockmvc-vs-webmvctest) → read: the `@WebMvcTest` section — it contrasts the two setups side by side, which is the distinction the next section turns on

Loads only the web layer: controllers, filters, and `@ControllerAdvice`. Services and repositories are not loaded — you replace them with `@MockitoBean`.

```java
@WebMvcTest(TimeEntryController.class)
class TimeEntryControllerTest {

    @Autowired
    MockMvc mockMvc;               // simulates HTTP requests without a real server

    @MockitoBean
    TimeEntryService service;      // replaces the real service in the sliced context

    @Test
    @WithMockUser                  // TimeTrack secures every endpoint — see the callout below
    void findByFilter_returns200_withList() throws Exception {
        TimeEntryResponse dto = new TimeEntryResponse();
        dto.setId(1L);
        dto.setProjectName("Internal");
        dto.setHours(new BigDecimal("7.5"));
        dto.setStatus(EntryStatus.SUBMITTED);
        when(service.findByFilter(null, null, null, null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/entries"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].projectName").value("Internal"))
            .andExpect(jsonPath("$[0].hours").value(7.5));
    }

    @Test
    @WithMockUser
    void create_returns400_whenDescriptionBlank() throws Exception {
        // description is @NotBlank in CreateTimeEntryRequest — send it empty
        mockMvc.perform(post("/api/entries")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"projectId": 1, "date": "2026-07-17", "hours": 7.5, "description": ""}
            """))
            .andExpect(status().isBadRequest());
    }
}
```

> **`@MockitoBean`, not `@MockBean` — the name changed in Boot 3.4 / 4.** Every tutorial written before 2025 uses `@MockBean` (from `org.springframework.boot.test.mock.mockito`). On Boot 3.4+ that annotation is **deprecated** and replaced by `@MockitoBean` (from `org.springframework.test.context.bean.override.mockito`) — same job, new package, promoted out of Boot into core Spring test. If you copy `@MockBean` from an old article it still compiles with a deprecation warning; write `@MockitoBean` in new code and recognise the old name when you read it.

> **Why `@WithMockUser` is on every test here.** TimeTrack's `SecurityConfig` ends in `.anyRequest().authenticated()`, and `@WebMvcTest` loads the security filter chain as part of the web slice — so without an authenticated user every request short-circuits to **401** before your controller runs, and `status().isOk()` fails. `@WithMockUser` (from `spring-security-test`) puts a fake authenticated principal in the `SecurityContext` for the duration of the test, standing in for the real JWT you would send in Postman ([06-security-jwt.md](./06-security-jwt.md) is where that chain was built). You will also need to keep the JWT beans (`JwtFilter`, `JwtUtil`) out of the slice or supply them — a `@MockitoBean JwtFilter` is the usual move.

**What to test with @WebMvcTest:**
- Correct HTTP status codes (200, 201, 400, 404)
- Response JSON shape (`jsonPath("$.field").value(...)`)
- Validation rejects bad input (returns 400)
- `@ControllerAdvice` maps exceptions to the right status code

> **Why not call the controller method directly?** Because the controller's behaviour depends on Spring's request mapping, Jackson serialization, and `@ControllerAdvice`. Calling the method bypasses all of that. `MockMvc` tests the full HTTP stack without a real server.

**@MockitoBean vs @Mock:**

| | Where | What it does |
|---|---|---|
| `@Mock` | Plain JUnit + Mockito (no Spring) | Creates a Mockito fake |
| `@MockitoBean` | Inside `@WebMvcTest` or `@SpringBootTest` | Creates a Mockito fake AND replaces the Spring bean |

How to read it: the split is "is Spring running?" — use `@MockitoBean` whenever a Spring context is loaded (any slice or `@SpringBootTest`), because it has to *swap out* the real bean in that context, not just create a fake. Use `@Mock` for pure service tests where no context exists and there is no bean to replace. (`@MockitoBean` is the Boot 3.4+ successor to the old `@MockBean` — see the callout above.)

---

## @SpringBootTest — full integration test

Purpose: prove that all the layers wired together actually do the job — the one test type that can catch a missing `@Transactional` or a broken security config.
File: `projects/07-timetrack/backend/timetrack/src/test/java/com/victor/timetrack/TimetrackApplicationTests.java` — the real file, and TimeTrack's only test; it uses `@SpringBootTest` with an empty body to prove the context boots. The class below is proposed, not written.
Docs: [Baeldung — Integration Testing in Spring](https://www.baeldung.com/integration-testing-in-spring) → read: "@SpringBootTest" and the `@AutoConfigureMockMvc` setup right after it

Loads the entire application context: all beans, auto-configuration, and a real database connection. Use it for the critical paths — verifying that a POST request actually writes a row to the database.

```java
@SpringBootTest
@AutoConfigureMockMvc
class TimeEntryIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    TimeEntryRepository repository;

    @Test
    @WithMockUser(username = "alice@timetrack.com", roles = "EMPLOYEE")
    void createEntry_savesToDatabase() throws Exception {
        // create() looks up the caller by email and the project by id before saving,
        // so a User with this email and an active Project id=1 must already be seeded.
        mockMvc.perform(post("/api/entries")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"projectId": 1, "date": "2026-07-17", "hours": 7.5, "description": "Backend work"}
            """))
            .andExpect(status().isCreated());

        assertEquals(1, repository.count());
    }
}
```

> **Where the `alice@timetrack.com` in `@WithMockUser` has to come from.** `TimeEntryService.create()` does `SecurityContextHolder.getContext().getAuthentication().getName()` and then `userRepository.findByEmail(name)` — so the username in `@WithMockUser` must match a **real row** in the test database, or `create()` throws `ResourceNotFoundException` and you get a 404 instead of the 201 you asserted. `@WithMockUser` fakes the *authentication* (it replaces the JWT), never the *data*: seed the user and an active project first (a `@Sql` script or a `@BeforeEach` save), then this test is honest.

> **What `@AutoConfigureMockMvc` is doing there, and why `@SpringBootTest` alone is not enough.** The two annotations answer two different questions. `@SpringBootTest` says *"build the whole application context"* — every bean, the real service, the real repository, a real database connection. It says nothing about **how you send a request into it**, because by default it starts no web server and no `MockMvc`: it hands you a context full of beans and expects you to call them as Java objects. `@Autowired MockMvc mockMvc` in that class would fail at startup with `No qualifying bean of type 'org.springframework.test.web.servlet.MockMvc' available`, because nobody created one.
>
> `@AutoConfigureMockMvc` is the annotation that creates it. It triggers the auto-configuration that builds a `MockMvc` bean wired to the real `DispatcherServlet`, the real controllers, and the real security filter chain of the context you just started — then puts it in the context so `@Autowired` finds it. That is the whole job: **`@SpringBootTest` supplies the app, `@AutoConfigureMockMvc` supplies the door into it.**
>
> You did not need it in the `@WebMvcTest` above because `@WebMvcTest` is a *slice* annotation — configuring `MockMvc` is part of the slice's definition, so it is already switched on. `@SpringBootTest` is not a slice; it makes no assumption about the web layer, so you ask for the door explicitly. And note what "mock" does *not* mean here: nothing about your app is faked. There is no Tomcat and no TCP socket — `MockMvc` calls the `DispatcherServlet` directly in the same JVM — but the routing, the Jackson binding, the `@Valid` check, the filters and your real service all run for real. That is exactly why the assertion below can check the actual database row afterwards.

**When to use:** only for the critical flows — login, registration, key writes. Not for every method.

> **Slow but real.** @SpringBootTest starts the full application. It catches bugs that unit tests miss — wrong SQL, missing @Transactional, misconfigured security. Use it sparingly because it is 10–100× slower than a @WebMvcTest.

---

## @DataJpaTest — repository layer only

Purpose: prove a derived query or a `@Query` returns the right rows, against a real JPA stack but no controllers and no services.
File: no project file yet — the proposed home is `src/test/java/com/victor/timetrack/repository/TimeEntryRepositoryTest.java`, covering the filter query behind `GET /api/entries`.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: the `@DataJpaTest` section

Loads only JPA entities, repositories, and an in-memory H2 database. Does not load controllers or services.

```java
@DataJpaTest
class TimeEntryRepositoryTest {

    @Autowired
    TimeEntryRepository repository;

    @Autowired
    TestEntityManager em;   // persist the User + Project the NOT NULL FK columns demand

    @Test
    void findByFilters_returnsOnlySubmitted_whenFilteringByStatus() {
        User user = new User();
        user.setName("Alice");
        user.setEmail("alice@timetrack.com");
        user.setPassword("x");
        user.setRole(Role.EMPLOYEE);
        em.persist(user);

        Project project = new Project();
        project.setName("Internal");
        em.persist(project);

        repository.save(entry(user, project, EntryStatus.SUBMITTED));
        repository.save(entry(user, project, EntryStatus.DRAFT));

        // the @Query behind GET /api/entries: null filters mean "no filter on that column"
        List<TimeEntry> result = repository.findByFilters(null, null, EntryStatus.SUBMITTED, null, null);

        assertEquals(1, result.size());
        assertEquals(EntryStatus.SUBMITTED, result.get(0).getStatus());
    }

    private TimeEntry entry(User user, Project project, EntryStatus status) {
        TimeEntry e = new TimeEntry();
        e.setUser(user);
        e.setProject(project);
        e.setDate(LocalDate.now());
        e.setHours(new BigDecimal("7.5"));
        e.setDescription("Backend work");   // all three are @Column(nullable = false)
        e.setStatus(status);
        return e;
    }
}
```

> **Why the `TimeEntry` needs a persisted `User` and `Project` first.** `time_entries.user_id` and `project_id` are `@JoinColumn(nullable = false)` — the row cannot exist without both foreign keys pointing at real rows. So you persist a `User` and a `Project` through `TestEntityManager` before saving any entry, or the insert fails a NOT NULL / FK constraint. This is the difference from a single-table entity: a `@DataJpaTest` still has to satisfy the whole relational graph, in memory, exactly as PostgreSQL would.

**When to use:** to verify derived query methods and `@Query` methods return the correct data.

> **`@DataJpaTest` is `@Transactional` — and this is the twist [08](./08-transactions.md) sent you here for.** `@DataJpaTest` silently puts `@Transactional` on your test class, and on a *test* that annotation means "roll everything back when the method ends, pass or fail". That is why the `save()` calls above leave nothing behind and the next test starts clean — no `DELETE` statements, no ordering games.
>
> The catch is what "roll back" implies about the SQL that never ran. Hibernate does not insert on `save()`; it queues the insert and flushes at **commit** — and there is no commit here, ever. Most of the time you are saved by chance: a `findByFilters()` in the same transaction forces a flush first, so the rows exist by the time you query. But write a test asserting that a `UNIQUE` or `NOT NULL` constraint *rejects* a bad row and it passes green while the `INSERT` was never sent to the database at all — the constraint you are testing never got the chance to fire. The fix is to force the SQL out yourself with `saveAndFlush()` instead of `save()`, or `TestEntityManager.flush()`. A test that proves nothing is worse than no test, because it is counted as coverage.

> **H2 is not PostgreSQL.** `@DataJpaTest` uses H2 (in-memory) by default — it is fast but not identical to PostgreSQL. If your query uses PostgreSQL-specific syntax (like `RETURNING` or native SQL), the test may pass on H2 but fail on the real database. For queries you care about, run an integration test against real PostgreSQL.

---

## What each test type catches

Purpose: choose which layers a given bug can hide in, so you know which test is worth writing for it.
File: no project file — this is the decision table behind "The minimum for project 07" below.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: the introduction — it frames why the slices exist rather than one test type for everything

| What went wrong | @WebMvcTest | JUnit+Mockito | @DataJpaTest | @SpringBootTest |
|---|:---:|:---:|:---:|:---:|
| Wrong URL mapping | ✓ | | | ✓ |
| Wrong HTTP status code | ✓ | | | ✓ |
| Bad validation rule | ✓ | | | ✓ |
| Wrong business logic | | ✓ | | ✓ |
| Wrong SQL query | | | ✓ | ✓ |
| Missing @Transactional | | | | ✓ |
| Security misconfiguration | | | | ✓ |

Read a ✓ as "this test type will actually fail if this bug is introduced" — an empty cell does not mean the layer is safe from that bug, it means that test type has no way to catch it even if it's there (e.g. a `JUnit+Mockito` service test can't catch a wrong URL mapping, because it never touches the web layer at all).

This is why both unit tests and integration tests are needed — they catch different kinds of bugs. A @WebMvcTest that passes does not guarantee the business logic is correct.

---

## The minimum for project 07

Purpose: the smallest set of tests that reads as "this candidate tests his backend" rather than "this candidate has heard of JUnit".
File: no project file yet — `src/test/` currently holds only `TimetrackApplicationTests.java`, so all three below are still to be written.
Docs: [Baeldung — Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing) → read: the full article once, end to end, before writing the first of the three

1. One `@ExtendWith(MockitoExtension.class)` service test — at least `approve()` happy path and not-found case
2. One `@WebMvcTest` controller test — at least `GET /api/entries` (200) and an invalid `POST /api/entries` (400)
3. One `@SpringBootTest` integration test — at least one full create flow (POST → database row)

This is what a junior developer is expected to deliver. Tests in three layers, one test per critical case per layer.

---

## Exercising the API — Postman and HTTP failures

Purpose: drive your own endpoints by hand — to demo them in an interview, and to see the exact bytes a reviewer's client will get.
File: no project file — Postman lives outside the repo, in the collection `07 - TimeTrack`. The endpoints exercised below are the real ones in `controller/TimeEntryController.java` and `controller/UserController.java`.
Docs: [Baeldung — Testing Web APIs with Postman Collections](https://www.baeldung.com/postman-testing-collections) → read: "Creating a Collection" and the request-chaining part · [Baeldung — A Guide to Variables in Postman](https://www.baeldung.com/java-postman-variables) → read: "Environment Variables"

Everything above this line automates a proof: you write the assertion once and a machine re-checks it forever. So why does a whole section end the file on clicking buttons in a GUI?

Because the two answer different questions. **A test proves the code is right; Postman shows you what the client actually receives.** Those come apart constantly — an `ErrorResponse` where `fieldErrors` is missing because `@JsonInclude(NON_NULL)` dropped it, a `LocalDate` serialised in a shape Angular cannot parse, a 403 where you swore you wrote 401. A green `jsonPath("$.status").value(400)` says nothing about the other six fields in that body. And there is the plainer reason: when an interviewer says *"show me your API"*, you do not run `mvn test` at them. You open a collection and fire real requests while they watch. Tests are for you; Postman is for the room.

> **This is also the loop you already lived through.** [06-security-jwt.md](./06-security-jwt.md) had you testing Flow 1 in Postman after step 7, and Flow 2 after step 10 — long before a single JUnit class existed. That was not a stopgap until the "real" tests arrived. Postman is how you discover the contract; JUnit is how you freeze it once you like it. You will keep doing both in a job.

### The four things every request needs

A request in Postman is exactly the four pieces of an HTTP request, and TimeTrack's `POST /api/entries` needs all four:

```
Method   POST
URL      http://localhost:8080/api/entries
Headers  Content-Type: application/json          ← what you are sending
         Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...   ← who you are
Body     raw → JSON:
         {
           "projectId": 1,
           "date": "2026-07-17",
           "hours": 7.5,
           "description": "Backend work"
         }
```

Every field there is forced by code you wrote. The four body keys are the four fields of `CreateTimeEntryRequest`, each carrying `@NotNull`/`@NotBlank` — so drop `description` and you get your own 400 back. The `Authorization` header exists because `SecurityConfig` ends in `.anyRequest().authenticated()`, so only `/api/auth/**` is reachable without it. And `Content-Type` is what tells Spring which converter turns those bytes into your DTO. Miss it and you get a 415 — the first of the three failures below.

> **The `Body` tab has a `raw` dropdown, and picking `JSON` is not cosmetic.** Selecting `JSON` there makes Postman set `Content-Type: application/json` on the request for you. Leaving it on `Text` sends the identical bytes with `Content-Type: text/plain` — same body, same URL, and a 415. This is the number-one reason "the same request works for my colleague and not for me".

### Environments and variables — why a flat collection looks amateur

Following Victor's convention, TimeTrack's collection is `07 - TimeTrack`, with folders per resource:

```
07 - TimeTrack                  (collection)
├── auth        → POST {{baseUrl}}/api/auth/login
├── entries     → GET/POST {{baseUrl}}/api/entries, PATCH .../{id}/submit, .../{id}/approve
├── projects    → GET/POST/PUT/DELETE {{baseUrl}}/api/projects
├── users       → GET {{baseUrl}}/api/users
└── reports     → GET {{baseUrl}}/api/reports/by-project?month=2026-07
```

`{{baseUrl}}` is a **variable**, and it comes from an **environment** — a named bag of key/value pairs you switch with a dropdown. Create one called `TimeTrack local` holding `baseUrl = http://localhost:8080`. The point is the day you run the same collection against Docker on another port, or a deployed URL: you change one value in one place instead of editing twenty requests.

The variable that earns its keep is `{{token}}`. Your JWT lives for 24 hours (`app.jwt.expiration=86400000`) and then every request 401s, so the manual loop is: log in, select the token out of the response, copy it, paste it into each request's `Authorization` header. Instead, put this in the **Tests** tab of the login request — a small script Postman runs *after* the response arrives:

```javascript
// auth → POST {{baseUrl}}/api/auth/login — Tests tab
pm.environment.set("token", pm.response.json().token);
```

It reads the `token` field out of `AuthResponse` and writes it into the environment. Every other request then sets its header to `Bearer {{token}}` once, forever. Logging in re-fills it for the whole collection.

> **Why this is worth ten minutes of your life.** It is the difference between handing a reviewer a collection where they hit *login* and then everything works, and handing them twenty requests with a dead token hardcoded into each one. Same endpoints; one of them says you have done this before. Postman also has `{{$timestamp}}`-style dynamic variables and per-collection variables — the environment is the one you actually need.

### 415 vs 405 vs 404 — three "it doesn't work" moments, told apart in five seconds

These three arrive with no stack trace and no log line, and juniors read all of them as "the endpoint is broken". They are not even the same *kind* of problem, and the status code alone tells you which. Note first *where* they are decided: none of your code runs in any of the three. `DispatcherServlet` rejects the request before your controller method is ever invoked, and Spring's own `DefaultHandlerExceptionResolver` sets the status and forwards to the default `/error` body — **your `GlobalExceptionHandler` never sees them.** Do not assume that is because they are unchecked-vs-checked: 405 (`HttpRequestMethodNotSupportedException`) and 404 (`NoResourceFoundException`) do extend `ServletException`, so the catch-all `@ExceptionHandler(RuntimeException.class)` could never match them anyway — but 415 (`HttpMediaTypeNotSupportedException`) *is* a `RuntimeException`, and it still bypasses the catch-all. The reason is precedence, not type: these framework MVC exceptions are raised during request mapping, and `DefaultHandlerExceptionResolver` claims them before your `@ControllerAdvice` is consulted. All three land on the default `/error`:

| Status | What Spring is telling you | The TimeTrack way to cause it |
|---|---|---|
| **415** Unsupported Media Type | The path and verb are right; I cannot **read the body you sent** | `POST /api/entries` with valid JSON but the Body tab left on `Text` |
| **405** Method Not Allowed | The path exists — with a **different verb** | `POST /api/users` (the path only maps `@GetMapping`) |
| **404** Not Found | No mapping matches that **path** at all | `GET /api/entrys` (typo — nothing is mapped there) |

How to read it: the three rows are a funnel, and reading them in order is the diagnosis. **404 = Spring never found your endpoint. 405 = it found the path but you knocked with the wrong verb. 415 = it found the exact method and refused the body's format.** Each row means you got one step further in, so the fix lives in a different place: 404 → check the URL string; 405 → check the mapping annotation; 415 → check a *header*, not the code.

**415 — the classic live-coding humiliation.** `POST /api/entries`, body correct, no `Content-Type: application/json`:

```json
{
  "timestamp": "2026-07-17T09:14:22.318+00:00",
  "status": 415,
  "error": "Unsupported Media Type",
  "message": "",
  "path": "/api/entries"
}
```

The mechanism: `@RequestBody CreateTimeEntryRequest` is a request for a **conversion**, and Spring picks the converter by the `Content-Type` header, never by looking at the body. With `application/json` it selects `MappingJackson2HttpMessageConverter` and Jackson parses your DTO. With `text/plain` — or nothing, where most clients default to `application/x-www-form-urlencoded` — it searches its converters, finds none that can turn those bytes into a `CreateTimeEntryRequest`, and throws `HttpMediaTypeNotSupportedException` before your method exists. The body is perfect JSON. Spring never looked at it.

> **415 vs 400 — the pair that gets confused, because both smell like "bad body".** They are decided at different moments. **415 = I would not even try to read it** (wrong `Content-Type`; Jackson never ran). **400 = I read it and it is wrong** — either Jackson choked on malformed JSON (`HttpMessageNotReadableException`, which your `GlobalExceptionHandler` *does* catch → `"Request body is missing or invalid"`), or it parsed fine and `@Valid` rejected a field (`MethodArgumentNotValidException` → `"Validation failed"` plus `fieldErrors`, see [07-validation.md](./07-validation.md)). So the tell is the body itself: a 400 you wrote comes back with your own message; a 415 comes back with Spring's empty one. Which brings up the field everybody trips on next.

> **`"message": ""` is not a bug.** Since Boot 3, the default `/error` body blanks the exception message unless you opt in with `server.error.include-message=always` — because that text can leak internals to whoever is calling. So the default response tells you the status and nothing else, on purpose. Locally you turn it on; in production you leave it off and read the server log instead ([12-production-debugging.md](./12-production-debugging.md) covers that switch and the log-reading loop).

**405 — the path exists, you used the wrong verb.** `POST /api/users`, where `UserController` maps only `@GetMapping`:

```json
{
  "timestamp": "2026-07-17T09:16:03.771+00:00",
  "status": 405,
  "error": "Method Not Allowed",
  "message": "",
  "path": "/api/users"
}
```

405 is *good news dressed as an error*: it is proof your controller was found and registered. Spring matched `/api/users` to `UserController`, saw the only mapping there is GET, and stopped. The real value is what it rules out — the URL is right, the app is running, security let you through. Look at the annotation, not the address. In TimeTrack the honest way to hit this is the workflow endpoints: `submit`, `approve` and `reject` are all `@PatchMapping`, so `POST /api/entries/1/submit` returns 405 while `PATCH /api/entries/1/submit` works. Postman defaults new requests to GET, and a `PATCH` left as `GET` is a 405 you will cause yourself.

**404 — nothing is mapped there.** `GET /api/entrys`:

```json
{
  "timestamp": "2026-07-17T09:17:41.209+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "",
  "path": "/api/entrys"
}
```

> **Two completely different 404s, and only the body tells them apart.** The one above is *routing*: no `@RequestMapping` matches `/api/entrys`, so Spring never reached your code. But `GET /api/projects/9999` — a path that maps perfectly — also returns 404, from `ProjectService` throwing `ResourceNotFoundException`, caught by your `GlobalExceptionHandler`. Same status, opposite meaning: "this endpoint does not exist" vs "this endpoint exists and that row does not". You tell them apart instantly because yours carries **your** message and no `path` field:
>
> ```json
> { "timestamp": "...", "status": 404, "error": "Not Found", "message": "Project not found with id: 9999" }
> ```
>
> `path` present and `message` empty → Spring's default `/error`, your code never ran. A real message and no `path` → your advice, your code ran and decided. That is the first thing to look at on any confusing response from this API.

### The 201 that lies — verify the write, not the response

`POST /api/entries` comes back `201 Created` with a body. Tempting conclusion: it saved. **The 201 proves your controller returned, not that PostgreSQL kept anything.** `ResponseEntity.status(201)` is a number you hardcoded in `TimeEntryController`; the row is written by Hibernate at commit, which happens *after* your service method returns — so a rollback triggered on the way out is entirely compatible with the 201 you just admired. This is the same silence 08 ended on, wearing a green badge.

So confirm the row, two ways:

- **In pgAdmin** — `SELECT * FROM time_entries ORDER BY id DESC LIMIT 5;` and look at it. This is the version that catches what an API response structurally cannot show you: `status` stored as `0` instead of `'DRAFT'` (a broken `@Enumerated`), `hours` truncated to `7` instead of `7.5` (wrong `precision`/`scale`), a `user_id` that is `NULL`. Your response DTO would happily render all three as fine.
- **With a follow-up `GET`** — `GET /api/entries?userId=1` in the collection right after the POST. Weaker (it can be served from the same transaction or the same session) but instant, and it is what you do live in front of an interviewer.

> **This is exactly the question they ask.** *"How do you know the entry was actually saved?"* — "I got a 201" is the junior answer. "I check the row in pgAdmin, or re-read it with a GET" is the answer of someone who has been burned. And it is the same instinct as the `@SpringBootTest` above, which asserts `repository.count()` rather than trusting the status: **never let the thing under test be the thing that reports on itself.**

### curl — when there is no GUI

The moment the app is on a server or inside a container, there is no Postman. Same request, one line:

```bash
# log in and grab the token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@timetrack.com","password":"<the password you seeded>"}'

# call a protected endpoint with it
curl -X GET "http://localhost:8080/api/entries?status=SUBMITTED" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# see the status code and the response headers, not just the body
curl -i -X POST http://localhost:8080/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{"projectId":1,"date":"2026-07-17","hours":7.5,"description":"Backend work"}'
```

The flags are the same four pieces as before: `-X` the method, `-H` a header (repeat it per header), `-d` the body, and `-i` to print the status line and response headers — without `-i` curl shows only the body, and a 415 with an empty body looks like nothing happened at all.

> **`-d` without `-H "Content-Type: application/json"` is the 415 trap again, and curl sets it for you.** Give curl `-d` and no content type and it defaults to `application/x-www-form-urlencoded` — the form encoding a browser uses. Spring finds no converter for your DTO and answers 415, with the JSON sitting right there in the request. This is the *same* mistake as the `raw → Text` dropdown in Postman, which is the point: the tool never mattered, the header always did.

Docs: [Baeldung — Test a REST API with curl](https://www.baeldung.com/curl-rest) → read: "Testing POST" and the `-d`/`-H` sections

---

## Where this leaves you — and what comes next

The invisible is now visible. A `@Transactional` that never fires, a `@PreAuthorize` that protects nothing, a validation rule that lets `null` through — each one now has something that goes red when it breaks: JUnit and Mockito for the logic, `@WebMvcTest` for the contract, `@DataJpaTest` for the queries, `@SpringBootTest` for the wiring, and Postman for the exact bytes a human will see. TimeTrack has one empty `contextLoads()` and three tests it still owes; "The minimum for project 07" above is that debt written down.

What all of it has in common is that it runs **on your machine, against your PostgreSQL, with your `DB_PASSWORD` in the IntelliJ run configuration**. Green here means "it works where I built it" — which is precisely the claim "it works on my machine" has always made. [10-tooling.md](./10-tooling.md) is where that claim stops being enough: Docker packages the app and its Java 25 runtime so the same image runs on a reviewer's laptop and a server, and Flyway does the same for the schema, replacing `ddl-auto=update` with versioned SQL scripts that are reviewable in git. Testing proves your code is right; tooling is what makes it right somewhere other than here.
