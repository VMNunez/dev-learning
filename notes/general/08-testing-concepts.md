# Software testing concepts

Docs: [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) · [Mockito](https://site.mockito.org/) · [Jasmine](https://jasmine.github.io/tutorials/your_first_suite)

---

## Why test?

Three reasons that matter in practice:

1. **Catch bugs before users do** — a failing test at development time is free; a failing feature in production is expensive.
2. **Document expected behaviour** — a test named `should_return_401_when_token_is_invalid` is documentation that never goes out of date.
3. **Enable safe refactoring** — if the tests pass after you change the code, you know you did not break anything.

---

## Types of tests

### Unit test

Tests one unit of code — a single method or class — in complete isolation. All dependencies are replaced with fakes (mocks). No database, no HTTP, no Spring context.

```
AuthService.generateToken()
    → does not call JwtUtil for real
    → uses a mock that returns a fixed token
    → tests only the AuthService logic
```

Fast (milliseconds). Many of them. The base of the testing pyramid.

### Integration test

Tests multiple real components working together. Dependencies are not mocked — the real Spring context starts, the real database is used.

```
POST /api/auth/login (with @SpringBootTest)
    → real Spring Security filter chain
    → real database (H2 in-memory or test PostgreSQL)
    → real JWT is generated
    → tests the full login flow end to end on the backend
```

Slower (seconds). Fewer of them.

### End-to-end test (E2E)

Tests the full application from the user's perspective — opens a real browser, clicks buttons, fills forms, checks what appears on screen.

```
Playwright or Cypress opens the browser
    → navigates to /login
    → fills in email and password
    → clicks Submit
    → checks the dashboard is visible
```

Slowest (minutes for a full suite). Very few of them. Cover only the most critical user flows.

---

## The testing pyramid

```
          /\
         /  \       E2E tests
        /    \      (few — test critical flows in the real browser)
       /------\
      /        \    Integration tests
     /          \   (some — test layers working together)
    /------------\
   /              \  Unit tests
  /                \ (many — test every method, every edge case)
 /------------------\
```

More unit tests than integration, more integration than E2E. Unit tests are cheap to write and fast to run. E2E tests are expensive and slow.

---

## Mocks and stubs

Both are fake implementations of a dependency used in tests.

**Mock** — a fake object you can configure and verify. You control what it returns and you can check afterwards how it was called.

```java
// Mockito mock
when(jwtUtil.generateToken(anyString())).thenReturn("fake-token");

// Verify it was called
verify(jwtUtil).generateToken("victor@example.com");
```

**Stub** — a simpler fake that just returns a fixed value. No verification. Used when you only care about the return value, not how the dependency was called.

The difference matters in theory, but in practice the word "mock" is used for both. Mockito handles both.

---

## In Victor's projects

| Layer | Tool | Type |
|-------|------|------|
| Spring Boot services | JUnit 5 + Mockito | Unit tests |
| Spring Boot full flow | JUnit 5 + `@SpringBootTest` | Integration tests |
| Angular services | Jasmine + TestBed | Unit tests |
| Angular components | Jasmine + TestBed | Component tests (project 08+) |

The rule from project 07: every service must have at least one unit test. From project 08: every component must have at least one TestBed test.

---

## Key points for interviews

- A unit test tests one thing in isolation — if it touches the database, it is not a unit test
- Mocks let you test a class without needing its real dependencies to exist or work
- The testing pyramid exists because unit tests are cheap and E2E tests are expensive — write more of the cheap kind
- Tests are not just about finding bugs — they are documentation and a safety net for future changes
