# Minimum Coverage — General

Cross-cutting concepts that appear in interviews regardless of the stack. These come up at every stage: the HR call, the technical test review, and the live technical interview. Every item must be explainable with a real example from a project.

## HTTP methods and request structure

- HTTP methods — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`: each expresses the intent of the request; interviewers ask you to choose the right method for a given scenario and justify it (e.g. why POST for login, why PUT vs PATCH for an update endpoint)
- `PUT` vs `PATCH` — PUT replaces the entire resource; PATCH updates only the specified fields; the most common confusable pair in REST API discussions; asked in every technical interview that touches a REST endpoint
- Idempotency — a request is idempotent if calling it multiple times leaves the system in the same state; `GET`, `PUT`, `DELETE` are idempotent; `POST` is not; interviewers use this to test whether you know REST semantics beyond CRUD names
- Headers — `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format; `Accept` specifies the expected response format; interviewers ask which header is used for authentication and what happens if you omit `Content-Type`
- Path parameters vs query parameters vs request body — path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update; interviewers ask you to choose the right placement for a given field
- HTTPS vs HTTP — TLS encrypts the connection so headers and body (including the JWT) cannot be read in transit; required for any API that handles passwords or tokens; interviewers ask why you would never send a password over plain HTTP
- Request/response lifecycle — Angular component → HTTP interceptor → browser → Spring Security filter chain → controller → service → repository → response travels back; interviewers ask you to trace a login request end-to-end to test architectural understanding

## HTTP status codes

- 2xx success codes — `200 OK` for a successful read or update, `201 Created` after a POST that creates a resource, `204 No Content` after a DELETE (success but no body); interviewers ask which to use after each HTTP method and why 201 is not the default for every POST
- `400 Bad Request` — the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails; shows you understand the difference between a client error and a server error
- `401 Unauthorized` vs `403 Forbidden` — 401 means unauthenticated (no token or invalid token); 403 means authenticated but not allowed (wrong role); the most common confusable pair in security discussions
- `401` vs `403` in Spring Security — Spring Security returns 403 for both unauthenticated and unauthorised requests by default; a custom `AuthenticationEntryPoint` is required to correctly return 401 for missing or invalid tokens; this gotcha is asked in technical interviews
- `404 Not Found` vs `409 Conflict` — 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email, name already taken); shows semantic awareness beyond just 400 and 500
- `500 Internal Server Error` — an unhandled exception reached the framework; if the API returns 500, something was not caught by `@ControllerAdvice`; interviewers ask what you would do to prevent it

## JSON and serialization

- JSON data types — objects `{}`, arrays `[]`, strings, numbers, booleans, null; keys must be double-quoted strings; no trailing commas; tested when debugging a `400` caused by malformed JSON
- Jackson — Spring Boot uses Jackson automatically to convert between JSON and Java objects; `@RestController` triggers automatic serialization without any configuration; interviewers ask how Spring Boot "knows" to return JSON
- `@JsonProperty` — maps a JSON key to a Java field with a different name; necessary when the API contract uses snake_case (`user_name`) but the Java class uses camelCase (`userName`)
- `JSON.parse()` vs `JSON.stringify()` — `stringify` converts a JavaScript object to a JSON string; `parse` converts it back; only needed for `localStorage`, never for `HttpClient` calls (Angular handles JSON automatically); confusing them leads to storing `[object Object]` in localStorage

## Error handling

- `catchError` in Angular services — intercepts HTTP errors in the Observable stream before they reach the component; returns a safe fallback value (empty array, null) so the app keeps running; tested in every Angular service review
- HTTP interceptor for global errors — the right place to handle 401 (expired token → redirect to login) and network failures; one interceptor replaces `catchError` in every service for these global concerns
- `catchError` in service vs interceptor — service-level handles specific, local failures; interceptor handles global concerns (token expiry, network outage); interviewers ask which approach you would use for a given scenario and why
- `@ControllerAdvice` + `@ExceptionHandler` — maps custom exceptions to HTTP status codes in one class; the Spring Boot equivalent of Angular's error interceptor; without it, every unhandled exception returns a generic 500 with no useful message for the client
- Error propagation — throw errors upward and handle them once at the outermost layer; never swallow an exception silently without at least logging it; catching and re-throwing without adding information hides the root cause

## Software testing

- Unit test — tests one class or method in isolation with all dependencies mocked; no database, no HTTP, no Spring context; runs in milliseconds; the base of the testing pyramid
- Integration test — tests multiple real components working together; the Spring context starts and the real database is used; slower than unit tests; written with `@SpringBootTest` in Spring Boot
- End-to-end (E2E) test — tests the full user flow through a real browser; the slowest and the fewest; covers only the most critical user journeys
- Testing pyramid — more unit tests than integration, more integration than E2E; interviewers ask the ratio and why (unit tests are cheap and fast; E2E tests are expensive and slow; the pyramid shape reflects the right investment)
- Mock vs stub — a mock is a fake dependency you can configure and verify (check how it was called afterwards); a stub just returns a fixed value with no verification; in practice "mock" is used for both; Mockito handles both in Java
- JUnit 5 + Mockito — the standard tools for Spring Boot unit tests; interviewers expect you to explain how to write `when(...).thenReturn(...)` and `verify(...)` in a service test without touching the database
- Jasmine + TestBed — the standard tools for Angular service tests and component tests; `TestBed` creates a minimal Angular module for testing without a real browser

## Browser storage

- `localStorage` — persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript, which makes it vulnerable to XSS token theft
- `sessionStorage` — cleared when the tab closes; not shared between tabs; same API as `localStorage`; used for temporary state that should not survive a browser restart
- Cookies — sent automatically with every HTTP request to the matching domain; `HttpOnly` flag prevents JavaScript from reading them; `Secure` restricts them to HTTPS; `SameSite=Strict` prevents CSRF
- `localStorage` vs `HttpOnly` cookie for JWT — the production tradeoff; localStorage is simple but XSS can steal the token; HttpOnly cookies are XSS-safe but require CSRF protection and `withCredentials: true` in Angular; interviewers ask which you would choose in production and why

## Environment variables

- Why secrets must never be committed — a committed secret is permanently visible in git history even after deletion; it must be treated as compromised and rotated immediately; tested in every project review that handles tokens or API keys
- `${VAR_NAME}` in `application.properties` — Spring Boot reads the environment variable at startup and substitutes the value; `@Value("${app.jwt.secret}")` injects the resolved value into a class field
- Fail-fast on missing variables — if a required variable is not set and has no default value, Spring Boot fails at startup with a clear error instead of a `NullPointerException` at runtime; this is intentional — fail early and loudly
- `.env.example` — documents which variables are required without exposing real values; safe to commit; the real secrets live in OS environment variables, IntelliJ run configuration, or a secret manager — never in a committed file

## Base64

- Base64 is not encryption — it is reversible text encoding for binary data using 64 printable characters; anyone can decode it in one step; interviewers ask this specifically to catch candidates who confuse encoding with security
- JWT structure — header and payload are Base64-encoded JSON separated by dots; the third part is a cryptographic signature; paste any JWT on jwt.io to read the header and payload directly; only the signature provides security
- `btoa()` / `atob()` — the browser functions for encoding and decoding Base64 strings; `Decoders.BASE64.decode()` is the JJWT equivalent in Spring Boot for converting the Base64 signing key to bytes

## Logging

- Why not `System.out.println()` / `console.log()` for debugging production code — print statements cannot be turned off, are not timestamped, and are lost once the terminal closes; interviewers ask "how would you debug an issue in a deployed app without a debugger attached?" — logs are the expected answer
- Log levels — `DEBUG` (detailed, dev only), `INFO` (normal events, e.g. "user logged in"), `WARN` (something unexpected but recoverable), `ERROR` (something failed); interviewers ask what level you would use for a caught exception that the app recovered from (`WARN`, not `ERROR`, if the request still succeeded)
- Logs vs exceptions in error handling — an exception interrupts the current operation and must be handled or propagated; a log is a side note that does not change control flow; interviewers ask why you would still log an exception even after it is already handled by `@RestControllerAdvice` (loses the stack trace otherwise — the client only sees a clean message, but the server needs the detail to debug)

## SOLID

- Single Responsibility — one class, one reason to change; controller handles HTTP, service handles rules, repository handles data; interviewers ask you to name this principle when they show a "fat controller" that mixes HTTP and business logic
- Dependency Inversion — inject dependencies instead of creating them with `new`; what Angular's `inject()` and Spring Boot's constructor injection implement; tested by asking "how would you write a unit test for this without touching the database?"
- Open/Closed — extend without modifying existing code; add a new feature by adding new code, not by changing what already works; shows you understand why stable, tested code should not be reopened unnecessarily
- Liskov Substitution — a subtype must behave correctly wherever its parent is expected; violations cause hard-to-trace bugs in class hierarchies; prefer composition over inheritance when this guarantee is hard to maintain
- Interface Segregation — prefer small specific interfaces over one large one; a class should only be required to implement methods it actually uses

## Code principles

- DRY — extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?" — the answer is extract, not copy
- KISS — the simplest solution that works is the right one; complexity is a cost that must be justified; interviewers probe this when they see overcomplicated junior code or bloated AI-generated boilerplate
- YAGNI — do not build features for hypothetical future requirements; adding pagination before it is needed, or building a plugin system for a feature with one implementation, are the classic examples; common in AI-generated code
