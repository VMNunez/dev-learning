# Testing in Spring Boot

> 📖 [Spring Boot Testing Reference](https://docs.spring.io/spring-boot/reference/testing/)

## The problem without tests

Without tests, you find bugs in production — or worse, the interviewer finds them when you demo your project. More importantly: Spanish consultancies in 2026 explicitly ask whether candidates can write tests. A project with zero tests is a yellow flag.

Spring Boot testing is not one tool — it is three tools with a clear rule for when to use each.

---

## The layered testing strategy — one tool per layer

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

JUnit 5 is the standard Java test framework. Spring Boot includes it automatically through the `spring-boot-starter-test` dependency — already in the `pom.xml` when you generate the project.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class TransactionServiceTest {

    @BeforeEach
    void setUp() {
        // runs before every @Test — reset state here
    }

    @Test
    void shouldReturnTransaction_whenFound() {
        // test code here
    }

    @Test
    void shouldThrow_whenNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            service.getById(999L);
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

This is the fastest test you write. You do not load Spring at all — you create the service with a mock repository passed through the constructor, just like constructor injection works in production.

```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)    // activates Mockito annotations
class TransactionServiceTest {

    @Mock
    TransactionRepository repository;  // Mockito creates a fake — returns null by default

    @InjectMocks
    TransactionService service;        // real service, with the mock injected

    @Test
    void getById_returnsDTO_whenFound() {
        // Arrange — tell the mock what to return
        Transaction t = new Transaction(1L, BigDecimal.valueOf(50), "Lunch");
        when(repository.findById(1L)).thenReturn(Optional.of(t));

        // Act
        TransactionDTO result = service.getById(1L);

        // Assert
        assertEquals(1L, result.id());
        assertEquals(BigDecimal.valueOf(50), result.amount());
    }

    @Test
    void getById_throws_whenNotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }
}
```

**Arrange / Act / Assert** — always structure tests this way:
- **Arrange** — set up test data and mock behaviour
- **Act** — call the method you are testing
- **Assert** — check the result

**Why not call `repository.findById()` in a service test without mocking?** Because `repository` is a Spring-generated bean — it only exists when Spring is running. Without a mock, the test would fail with a `NullPointerException` before it even gets to your code.

---

## Mockito — the most useful methods

```java
// Make the mock return something
when(repository.findById(1L)).thenReturn(Optional.of(transaction));
when(repository.findAll()).thenReturn(List.of(t1, t2));

// Make the mock throw
when(repository.findById(999L)).thenThrow(new ResourceNotFoundException("Transaction", 999L));

// Verify a method was called
verify(repository).save(any(Transaction.class));
verify(repository, times(1)).deleteById(1L);
verify(repository, never()).delete(any());

// Matchers — when you don't care about the exact value
when(repository.findById(anyLong())).thenReturn(Optional.empty());
```

> **`any()` and `anyLong()` are Mockito matchers.** They match any argument of the given type. Use them when the exact value does not matter for what you are testing.

---

## @WebMvcTest — controller layer only

Loads only the web layer: controllers, filters, and `@ControllerAdvice`. Services and repositories are not loaded — you replace them with `@MockBean`.

```java
@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    MockMvc mockMvc;               // simulates HTTP requests without a real server

    @MockBean
    TransactionService service;    // replaces the real service in the Spring context

    @Test
    void getAll_returns200_withList() throws Exception {
        TransactionDTO dto = new TransactionDTO(1L, BigDecimal.valueOf(50), "Lunch", LocalDate.now(), "food");
        when(service.getAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/transactions"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].amount").value(50));
    }

    @Test
    void create_returns400_whenAmountMissing() throws Exception {
        mockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"description": "Lunch", "category": "food", "date": "2026-05-01"}"""))
            .andExpect(status().isBadRequest());
    }
}
```

**What to test with @WebMvcTest:**
- Correct HTTP status codes (200, 201, 400, 404)
- Response JSON shape (`jsonPath("$.field").value(...)`)
- Validation rejects bad input (returns 400)
- `@ControllerAdvice` maps exceptions to the right status code

> **Why not call the controller method directly?** Because the controller's behaviour depends on Spring's request mapping, Jackson serialization, and `@ControllerAdvice`. Calling the method bypasses all of that. `MockMvc` tests the full HTTP stack without a real server.

**@MockBean vs @Mock:**

| | Where | What it does |
|---|---|---|
| `@Mock` | Plain JUnit + Mockito (no Spring) | Creates a Mockito fake |
| `@MockBean` | Inside `@WebMvcTest` or `@SpringBootTest` | Creates a Mockito fake AND replaces the Spring bean |

Use `@MockBean` whenever Spring is involved. Use `@Mock` for pure service tests.

---

## @SpringBootTest — full integration test

Loads the entire application context: all beans, auto-configuration, and a real database connection. Use it for the critical paths — verifying that a POST request actually writes a row to the database.

```java
@SpringBootTest
@AutoConfigureMockMvc
class TransactionIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    TransactionRepository repository;

    @Test
    void createTransaction_savesToDatabase() throws Exception {
        mockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"amount": 50.00, "description": "Lunch", "category": "food", "date": "2026-05-01"}
            """))
            .andExpect(status().isCreated());

        assertEquals(1, repository.count());
    }
}
```

**When to use:** only for the critical flows — login, registration, key writes. Not for every method.

> **Slow but real.** @SpringBootTest starts the full application. It catches bugs that unit tests miss — wrong SQL, missing @Transactional, misconfigured security. Use it sparingly because it is 10–100× slower than a @WebMvcTest.

---

## @DataJpaTest — repository layer only

Loads only JPA entities, repositories, and an in-memory H2 database. Does not load controllers or services.

```java
@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    TransactionRepository repository;

    @Test
    void findByType_returnsOnlyExpenses() {
        Transaction expense = new Transaction(null, BigDecimal.valueOf(50), "Lunch", TransactionType.EXPENSE, null);
        Transaction income = new Transaction(null, BigDecimal.valueOf(2000), "Salary", TransactionType.INCOME, null);
        repository.saveAll(List.of(expense, income));

        List<Transaction> result = repository.findByType(TransactionType.EXPENSE);

        assertEquals(1, result.size());
        assertEquals("Lunch", result.get(0).getDescription());
    }
}
```

**When to use:** to verify derived query methods and `@Query` methods return the correct data.

> **H2 is not PostgreSQL.** `@DataJpaTest` uses H2 (in-memory) by default — it is fast but not identical to PostgreSQL. If your query uses PostgreSQL-specific syntax (like `RETURNING` or native SQL), the test may pass on H2 but fail on the real database. For queries you care about, run an integration test against real PostgreSQL.

---

## What each test type catches

| What went wrong | @WebMvcTest | JUnit+Mockito | @DataJpaTest | @SpringBootTest |
|---|:---:|:---:|:---:|:---:|
| Wrong URL mapping | ✓ | | | ✓ |
| Wrong HTTP status code | ✓ | | | ✓ |
| Bad validation rule | ✓ | | | ✓ |
| Wrong business logic | | ✓ | | ✓ |
| Wrong SQL query | | | ✓ | ✓ |
| Missing @Transactional | | | | ✓ |
| Security misconfiguration | | | | ✓ |

This is why both unit tests and integration tests are needed — they catch different kinds of bugs. A @WebMvcTest that passes does not guarantee the business logic is correct.

---

## The minimum for project 07

1. One `@ExtendWith(MockitoExtension.class)` service test — at least `getById` happy path and not-found case
2. One `@WebMvcTest` controller test — at least GET list (200) and invalid POST (400)
3. One `@SpringBootTest` integration test — at least one full create flow (POST → database row)

This is what a junior developer is expected to deliver. Tests in three layers, one test per critical case per layer.
