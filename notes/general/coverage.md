# Minimum Coverage — General

Cross-cutting concepts that appear in interviews regardless of the stack. These come up at every stage: the HR call, the technical test review, and the live technical interview. Every item must be explainable with a real example from a project.

## HTTP methods and request structure

- HTTP methods — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`: each expresses the intent of the request; interviewers ask you to choose the right method for a given scenario and justify it (e.g. why POST for login, why PUT vs PATCH for an update endpoint)
- `PUT` vs `PATCH` — PUT replaces the entire resource; PATCH updates only the specified fields; the most common confusable pair in REST API discussions; asked in every technical interview that touches a REST endpoint
- Idempotency — repeating an idempotent request has the same intended effect as sending it once;
  HTTP defines `GET`, `PUT`, and `DELETE` as idempotent, while `POST` has no idempotency guarantee
  unless the application deliberately adds one
- Headers — `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format; `Accept` specifies the expected response format; interviewers ask which header is used for authentication and what happens if you omit `Content-Type`
- Path parameters vs query parameters vs request body — path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update; interviewers ask you to choose the right placement for a given field
- HTTPS vs HTTP — TLS encrypts the connection so headers and body (including the JWT) cannot be read in transit; required for any API that handles passwords or tokens; interviewers ask why you would never send a password over plain HTTP
- Request/response lifecycle — Angular component → HTTP interceptor → browser → Spring Security filter chain → controller → service → repository → response travels back; interviewers ask you to trace a login request end-to-end to test architectural understanding

## HTTP status codes

- 2xx success codes — `200 OK` for a successful read or update, `201 Created` after a POST that creates a resource, `204 No Content` after a DELETE (success but no body); interviewers ask which to use after each HTTP method and why 201 is not the default for every POST
- `400 Bad Request` — the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails; shows you understand the difference between a client error and a server error
- `401 Unauthorized` vs `403 Forbidden` — 401 means unauthenticated (no token or invalid token); 403 means authenticated but not allowed (wrong role); the most common confusable pair in security discussions
- `404 Not Found` vs `409 Conflict` — 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email, name already taken); shows semantic awareness beyond just 400 and 500
- `500 Internal Server Error` — the server encountered an unexpected failure; global error handling
  should format and log it consistently, not disguise every genuine server fault as a client error

## JSON and serialization

- JSON data types — objects `{}`, arrays `[]`, strings, numbers, booleans, null; keys must be double-quoted strings; no trailing commas; tested when debugging a `400` caused by malformed JSON
- Jackson — Spring Boot uses Jackson automatically to convert between JSON and Java objects; `@RestController` triggers automatic serialization without any configuration; interviewers ask how Spring Boot "knows" to return JSON
- `@JsonProperty` — maps a JSON key to a Java field with a different name; necessary when the API contract uses snake_case (`user_name`) but the Java class uses camelCase (`userName`)
- `JSON.parse()` vs `JSON.stringify()` — `stringify` converts a JavaScript object to a JSON string; `parse` converts it back; only needed for `localStorage`, never for `HttpClient` calls (Angular handles JSON automatically); confusing them leads to storing `[object Object]` in localStorage

## Error handling

- Local error recovery — a caller may replace a failed operation with a fallback only when that
  fallback is semantically honest; silently converting every failure into empty data fabricates success
- HTTP interceptor for global errors — the right place to handle 401 (expired token → redirect to login) and network failures; one interceptor replaces `catchError` in every service for these global concerns
- `catchError` in service vs interceptor — service-level handles specific, local failures; interceptor handles global concerns (token expiry, network outage); interviewers ask which approach you would use for a given scenario and why
- `@ControllerAdvice` + `@ExceptionHandler` — maps custom exceptions to HTTP status codes in one class; the Spring Boot equivalent of Angular's error interceptor; without it, every unhandled exception returns a generic 500 with no useful message for the client
- Error propagation — throw errors upward and handle them once at the outermost layer; never swallow an exception silently without at least logging it; catching and re-throwing without adding information hides the root cause

## Software testing

- Unit test — verifies one unit of behaviour through a small boundary; collaborators may be real,
  stubbed, faked, or mocked depending on what keeps the test focused
- Integration test — verifies selected real components working together; it may load part or all of
  an application and may use real or controlled infrastructure depending on the boundary under test
- End-to-end (E2E) test — tests the full user flow through a real browser; the slowest and the fewest; covers only the most critical user journeys
- Testing pyramid — a heuristic that favours many fast focused tests and fewer expensive broad tests;
  it communicates trade-offs, not a universal numeric ratio
- Mock vs stub — a mock is a fake dependency you can configure and verify (check how it was called afterwards); a stub just returns a fixed value with no verification; in practice "mock" is used for both; Mockito handles both in Java
- Jasmine + TestBed — the standard tools for Angular service tests and component tests; `TestBed` creates a minimal Angular module for testing without a real browser

## Browser storage

- `localStorage` — persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript, which makes it vulnerable to XSS token theft
- `sessionStorage` — cleared when the tab closes; not shared between tabs; same API as `localStorage`; used for temporary state that should not survive a browser restart
- Cookies — sent automatically with matching requests; `HttpOnly` blocks JavaScript access,
  `Secure` restricts transport to HTTPS, and `SameSite` mitigates cross-site requests without being a
  universal replacement for CSRF protection

## Environment variables

- Why secrets must never be committed — a committed secret is permanently visible in git history even after deletion; it must be treated as compromised and rotated immediately; tested in every project review that handles tokens or API keys
- `${VAR_NAME}` in `application.properties` — Spring Boot reads the environment variable at startup and substitutes the value; `@Value("${app.jwt.secret}")` injects the resolved value into a class field
- Fail-fast on missing variables — if a required variable is not set and has no default value, Spring Boot fails at startup with a clear error instead of a `NullPointerException` at runtime; this is intentional — fail early and loudly
- `.env.example` — documents which variables are required without exposing real values; safe to commit; the real secrets live in OS environment variables, IntelliJ run configuration, or a secret manager — never in a committed file

## Containerisation (Docker)

- What a container is — a lightweight, isolated process that bundles the app with its exact runtime and dependencies so it behaves the same on every machine; interviewers ask "what problem does Docker solve?" and expect the "works on my machine" answer, not a recital of virtualisation theory
- Container vs virtual machine — a container shares the host OS kernel and starts in milliseconds; a VM ships a whole guest OS and is far heavier; interviewers ask the difference to check you understand why containers, not VMs, became the standard for shipping services
- Image vs container — an image is the immutable blueprint built from a `Dockerfile`; a container is a running instance of that image; the most common Docker confusable pair, asked the same way as "class vs object"
- `Dockerfile` — the recipe that builds an image step by step (base image, copy the build artifact, set the entry point); interviewers ask what each instruction does and why each line becomes a cached layer
- `docker-compose up` — starts every service declared in `docker-compose.yml` (e.g. Spring Boot + PostgreSQL) with one command and one network; interviewers ask "how does a new developer run your project without installing PostgreSQL by hand?" — this is the expected answer
- Environment variables in Compose — config and secrets (DB URL, JWT secret) are passed to the container through the `environment` block or an `.env` file, never baked into the image; interviewers ask how you keep credentials out of an image that may be shared or pushed to a registry
- Why containerisation matters in a consultancy — identical environments across dev, CI, and production remove a whole class of "it ran locally" deployment bugs; in 2026 large Spanish consultancies treat basic Docker fluency as a baseline expectation, so not being able to explain `docker-compose up` reads as behind

## Base64

- Base64 is not encryption — it is reversible text encoding for binary data using 64 printable characters; anyone can decode it in one step; interviewers ask this specifically to catch candidates who confuse encoding with security
- `btoa()` / `atob()` — browser functions for basic Base64 text conversion; they do not add
  confidentiality or integrity and have Unicode limitations that production code must handle
- Text encoding vs binary encoding — UTF-8 maps characters to bytes while Base64 maps bytes to safe
  text; confusing these layers produces corrupted non-ASCII data and false security assumptions

## Logging

- Why not `System.out.println()` / `console.log()` for debugging production code — print statements cannot be turned off, are not timestamped, and are lost once the terminal closes; interviewers ask "how would you debug an issue in a deployed app without a debugger attached?" — logs are the expected answer
- Log levels — `DEBUG` (detailed, dev only), `INFO` (normal events, e.g. "user logged in"), `WARN` (something unexpected but recoverable), `ERROR` (something failed); interviewers ask what level you would use for a caught exception that the app recovered from (`WARN`, not `ERROR`, if the request still succeeded)
- Logs vs exceptions in error handling — an exception interrupts the current operation and must be handled or propagated; a log is a side note that does not change control flow; interviewers ask why you would still log an exception even after it is already handled by `@RestControllerAdvice` (loses the stack trace otherwise — the client only sees a clean message, but the server needs the detail to debug)

## Code principles

- DRY — extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?" — the answer is extract, not copy
- KISS — the simplest solution that works is the right one; complexity is a cost that must be justified; interviewers probe this when they see overcomplicated junior code or bloated AI-generated boilerplate
- YAGNI — do not build features for hypothetical future requirements; adding pagination before it is needed, or building a plugin system for a feature with one implementation, are the classic examples; common in AI-generated code

## Agile and delivery awareness

- Scrum roles — Product Owner prioritises value, Scrum Master facilitates the framework, and
  Developers deliver the increment; interviewers expect recognition rather than certification detail
- Sprint and increment — a sprint is a fixed iteration and the increment is the usable result that
  meets the Definition of Done
- Planning, daily Scrum, review, and retrospective — each event has a distinct purpose: select work,
  inspect progress, inspect the product, and improve the process
- User story and acceptance criteria — the story expresses user value while acceptance criteria make
  the behaviour testable; they are not interchangeable with implementation tasks
- Definition of Done — a shared quality gate such as reviewed, tested, integrated, and deployable;
  it prevents each person from using a private meaning of “finished”
- CI/CD awareness — continuous integration builds and tests small merged changes; continuous delivery
  keeps a releasable artefact, while deployment automation is a later operational depth
- Cloud awareness — AWS or Azure provides managed compute, storage, networking, and databases;
  junior coverage is recognising the deployment model, not designing cloud infrastructure
