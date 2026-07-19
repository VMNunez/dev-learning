# Minimum Coverage — General

Cross-cutting concepts that appear in interviews regardless of the stack. These come up at every stage: the HR call, the technical test review, and the live technical interview. Every item must be explainable with a real example from a project.

## HTTP methods and semantics

- HTTP methods — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`: each expresses the intent of the request; interviewers ask you to choose the right method for a given scenario and justify it (e.g. why POST for login, why PUT vs PATCH for an update endpoint)
- `PUT` vs `PATCH` — PUT replaces the entire resource; PATCH updates only the specified fields; the most common confusable pair in REST API discussions; asked in every technical interview that touches a REST endpoint
- Idempotency — a request is idempotent if calling it multiple times leaves the system in the same state; `GET`, `PUT`, `DELETE` are idempotent; `POST` is not; interviewers use this to test whether you know REST semantics beyond CRUD names
- Safe methods vs idempotent methods — a safe method changes no state at all (`GET`), an idempotent one may change state but repeating it harmlessly lands on the same result (`PUT`, `DELETE`); interviewers push past "idempotent" to ask why retrying a timed-out `PUT` is fine while retrying a `POST` can create two records
- Path parameters vs query parameters vs request body — path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update; interviewers ask you to choose the right placement for a given field
- HTTPS vs HTTP — TLS encrypts the connection so headers and body (including the JWT) cannot be read in transit; required for any API that handles passwords or tokens; interviewers ask why you would never send a password over plain HTTP
- Request/response lifecycle — Angular component → HTTP interceptor → browser → Spring Security filter chain → controller → service → repository → response travels back; interviewers ask you to trace a login request end-to-end to test architectural understanding

## Reading the raw HTTP exchange

- Anatomy of a request — a request line (`POST /api/entries HTTP/1.1`), a block of headers, a blank line, then the optional body; interviewers show a curl transcript or Postman's raw view and ask you to point at the method, the path, the headers, and where the body starts
- Anatomy of a response — a status line (`HTTP/1.1 201 Created`), response headers, a blank line, then the body; interviewers ask where the status code physically sits and why a client can react to it before the body has finished arriving
- Headers — `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format; `Accept` specifies the expected response format; interviewers ask which header is used for authentication and what happens if you omit `Content-Type`
- Request headers vs response headers — `Authorization` and `Content-Type` are sent upward; `Set-Cookie`, `Location` and `Cache-Control` come back down; juniors routinely hunt for a response header in the request pane of DevTools and conclude the server never sent it
- `Content-Type` vs `Accept` — `Content-Type` describes the body you are sending, `Accept` describes the representation you want back; interviewers ask which one causes a `415 Unsupported Media Type` and which causes a `406 Not Acceptable`
- `application/json` vs `application/x-www-form-urlencoded` vs `multipart/form-data` — three body encodings on the wire; interviewers ask which one a file upload uses and why binary cannot be carried safely as `key=value` text
- Percent-encoding in the query string — a space, `&`, `=` or `/` inside a parameter value must be escaped or the server parses it as extra parameters; interviewers use a search box containing an ampersand to check you know the escaping layer exists

## HTTP status codes — choosing the right one

- 2xx success codes — `200 OK` for a successful read or update, `201 Created` after a POST that creates a resource, `204 No Content` after a DELETE (success but no body); interviewers ask which to use after each HTTP method and why 201 is not the default for every POST
- `400 Bad Request` — the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails; shows you understand the difference between a client error and a server error
- `400` vs `422 Unprocessable Entity` — 400 for input the server cannot parse or bind; 422 for well-formed input that breaks a business rule; interviewers ask which one you return when the JSON is valid but the end date precedes the start date
- `401 Unauthorized` vs `403 Forbidden` — 401 means unauthenticated (no token or invalid token); 403 means authenticated but not allowed (wrong role); the most common confusable pair in security discussions
- `401` vs `403` in Spring Security — Spring Security returns 403 for both unauthenticated and unauthorised requests by default; a custom `AuthenticationEntryPoint` is required to correctly return 401 for missing or invalid tokens; this gotcha is asked in technical interviews
- `404 Not Found` vs `409 Conflict` — 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email, name already taken); shows semantic awareness beyond just 400 and 500
- `405 Method Not Allowed` — the path exists but not for that verb; the standard symptom of a frontend sending `POST` to an endpoint mapped as `@PutMapping`, and it is diagnosed straight from the request line
- Returning `200 OK` with an error payload — a body containing `{"error": ...}` under a 200 breaks every client's error handling, because the status code is the contract the client branches on; interviewers show this snippet in the review round

## Failure responses and who produced them

- `500 Internal Server Error` — an unhandled exception reached the framework; if the API returns 500, something was not caught by `@ControllerAdvice`; interviewers ask what you would do to prevent it
- `(failed) net::ERR_CONNECTION_REFUSED` vs a `500` — a connection error means nothing ever answered on that host and port (server down, wrong port, wrong protocol); a 500 means the server ran your code and it threw; the first is an infrastructure fault and the second an application fault, and confusing them sends a junior to debug the wrong system
- `502` / `504` from a gateway vs a `500` from the app — a proxy or load balancer produced the error because the app timed out or was unreachable; interviewers ask who wrote the error page when the body does not look like your API's error format
- A `2xx` in the server log with an error in the browser — the server answered correctly and the failure happened after the response arrived (a blocked read, a JSON parse error, a wrong content type); interviewers use it to check you can localise a bug to a layer instead of blaming "the API"
- `3xx` redirects and the `Location` header — a `301` or `302` tells the client to re-request a different URL and the browser follows automatically, producing two rows in the Network tab; interviewers ask why a redirect to a login page appears where JSON was expected
- `301` vs `302` — permanent versus temporary; the browser caches a 301 and keeps honouring it after the server is fixed, which is why a wrong permanent redirect is far harder to undo

## Caching and conditional requests

- `Cache-Control` — `no-store`, `no-cache` and `max-age` decide whether the browser may reuse a response without asking again; interviewers ask why a deployed frontend still serves the old bundle after a release
- `ETag` and `If-None-Match` — the server sends a version fingerprint, the browser echoes it on the next request, and a match returns `304` with no body; interviewers ask how a browser revalidates a cached response without re-downloading the payload
- `304 Not Modified` — a successful response that carries no body because the cached copy is still valid; interviewers ask why the payload size is zero while the page still renders
- `Last-Modified` and `If-Modified-Since` — the timestamp variant of the conditional handshake, weaker than `ETag` because one-second granularity means two edits within the same second are served stale; interviewers ask why `ETag` is preferred
- Why `GET` is cacheable and `POST` is not — caching layers rely on the safety and idempotency guarantees of the method, which is the practical payoff of REST semantics rather than trivia

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
- Scope of a `try` block — wrapping a whole method body hides which statement can actually fail and makes the recovery path meaningless; keep the `try` around the risky call; a standard review-round observation
- Catch-log-rethrow at every layer — one failure produces a duplicated stack trace per layer, so the log suggests several errors where there was only one; interviewers show a log holding three traces and ask how many things actually broke
- Fail fast vs graceful degradation — some failures must kill the request, others should fall back to a default; interviewers ask whether a failed sidebar widget call should break the whole page, and the concept being tested is that the answer depends on whether the data is essential

## Software testing

- Unit test — tests one class or method in isolation with all dependencies mocked; no database, no HTTP, no Spring context; runs in milliseconds; the base of the testing pyramid
- Integration test — tests multiple real components working together; the Spring context starts and the real database is used; slower than unit tests; written with `@SpringBootTest` in Spring Boot
- End-to-end (E2E) test — tests the full user flow through a real browser; the slowest and the fewest; covers only the most critical user journeys
- Testing pyramid — more unit tests than integration, more integration than E2E; interviewers ask the ratio and why (unit tests are cheap and fast; E2E tests are expensive and slow; the pyramid shape reflects the right investment)
- Mock vs stub — a mock is a fake dependency you can configure and verify (check how it was called afterwards); a stub just returns a fixed value with no verification; in practice "mock" is used for both; Mockito handles both in Java
- JUnit 5 + Mockito — the standard tools for Spring Boot unit tests; interviewers expect you to explain how to write `when(...).thenReturn(...)` and `verify(...)` in a service test without touching the database
- Jasmine + TestBed — the standard tools for Angular service tests and component tests; `TestBed` creates a minimal Angular module for testing without a real browser

## What makes a test worth writing

- Assertion-free test — a test that calls the method and never asserts anything passes forever and proves nothing; the canonical "tests that pass but never catch a bug" snippet handed over in the 2026 code-review round
- Tautological mock test — stubbing a collaborator to return X and then asserting the method returns X re-tests Mockito rather than your logic; interviewers ask what such a test would catch if the method body were deleted
- Verifying a call vs asserting on the result — `verify()` proves an interaction happened, not that the outcome is correct, and over-verifying couples the test to the implementation so any refactor breaks it
- Happy-path-only suite — high line coverage with no null, empty, boundary or exception case; interviewers ask "what does this test *not* cover?" because that is where the bug lives
- Code coverage percentage as a misleading metric — coverage counts lines executed, not behaviour verified, so an assertion-free suite can report 90%; interviewers ask whether 100% coverage means the code works
- Non-deterministic test — a test reading `LocalDateTime.now()`, a random value, or a real network call is flaky by construction; the fix concept is injecting the varying thing (a fixed `Clock`, a seed) so the assertion is stable
- Arrange-Act-Assert (Given/When/Then) — the three-part shape that makes a test readable at a glance; interviewers judge test readability alongside correctness because an unreadable test is not maintained
- Over-mocking as a design smell — a test that needs five mocks is telling you the class under test has too many dependencies; interviewers use it to bridge testing into Single Responsibility
- What to test and what not to test — business rules and branching logic, not getters, framework wiring, or the mocks you just configured; interviewers ask where you would start on an untested service

## Debugging and diagnosis

- Startup failure vs runtime failure — a startup failure means configuration or wiring is wrong and the app never served a request; a runtime failure means the app is up and one path breaks; they have disjoint causes, so this is the first question to ask before reading any code
- Reading the *first* error, not the last — a cascade in a startup log usually has one true cause at the top and consequences below it; this is the deliberate inverse of the `Caused by:` rule for a single stack trace, and confusing the two sends you to the wrong line
- Minimal reproduction — a failure you cannot trigger on demand cannot be verified as fixed; reducing it to the smallest input or steps that still break is simultaneously the diagnosis and the future regression test
- Bisecting a failure by layer — walk browser → network → controller → service → repository → database and find where the data stops, instead of reading all the code hoping to spot it; interviewers ask "where would you put the first breakpoint?"
- Confounded changes — when two edits ship together, a passing result cannot attribute the fix to either one, so neither change has actually been verified; interviewers ask how you would confirm which of two edits resolved the bug
- The client as a variable in a failed call — issuing the same request outside the framework (curl, Postman) removes interceptors, base URLs and serialisation from the picture, isolating whether the bug is in the request itself or in the code that built it; interviewers ask how you would narrow down "the frontend can't call the API"
- Conditional breakpoint — a breakpoint that only fires when an expression is true (`id == 42`), which is the only practical tool for a bug that appears on one record out of thousands; naming it separates a candidate who has debugged from one who has read about debugging
- Debugger vs log statement — a debugger needs the process attached and the bug reproducible locally, while logs are the only option in a deployed environment; interviewers ask which you reach for and expect the answer to depend on where the bug happens
- Browser Network tab as the client/server split — if the response already contains the correct JSON the bug is in the frontend; if the response is wrong or missing the bug is behind the API; interviewers ask exactly this to test diagnostic method rather than tool familiarity
- Browser Console vs Network tab — the Console shows JavaScript exceptions, the Network tab shows wire traffic; a blank page with a clean Network tab is a rendering or JS error, not an API failure
- Comparing the sent payload against what the endpoint expects — most 400s are diagnosed by reading the actual request body rather than the server code; interviewers ask "the endpoint returns 400, what is your first step?"

## Build and run outside the IDE

- Build artifact — the single packaged output that actually gets deployed: a Spring Boot fat JAR containing the compiled classes and an embedded server, or an Angular `dist/` folder of static files; interviewers ask "what do you actually deploy?" and expect the artifact, not "the repository"
- `java -jar app.jar` vs running from the IDE — the IDE runs loose classes with its own classpath and run configuration, while the artifact runs standalone with only what was packaged; the classic cause of "it works in IntelliJ but not from the terminal", usually an env var that only ever existed in the run configuration
- Compile time vs build time vs runtime — compilation turns source into bytecode, the build packages it and can bake values in permanently, runtime is when the process is alive and reads its environment; interviewers use this to check you understand why some settings can change without a rebuild and some cannot
- The app crashing vs the app never starting — a startup failure kills the process before any request is served, a crash happens under traffic on a specific request; interviewers ask "the container exits immediately, where do you look?" and the answer is the startup log, not the endpoint
- Port already in use — a previous process still holds the socket, so the new one dies at startup with `Address already in use`; interviewers use it as the smallest possible debugging probe, expecting you to recognise the message rather than restart the machine

## Configuration and environment variables

- Why secrets must never be committed — a committed secret is permanently visible in git history even after deletion; it must be treated as compromised and rotated immediately; tested in every project review that handles tokens or API keys
- `${VAR_NAME}` in `application.properties` — Spring Boot reads the environment variable at startup and substitutes the value; `@Value("${app.jwt.secret}")` injects the resolved value into a class field
- Fail-fast on missing variables — if a required variable is not set and has no default value, Spring Boot fails at startup with a clear error instead of a `NullPointerException` at runtime; this is intentional — fail early and loudly
- `${VAR:fallback}` default syntax — supplies a value when the variable is absent, which deliberately removes the fail-fast behaviour above; interviewers ask when a default is appropriate (a port) and when it is dangerous (a JWT secret with a hardcoded fallback that silently ships to production)
- `.env.example` — documents which variables are required without exposing real values; safe to commit; the real secrets live in OS environment variables, IntelliJ run configuration, or a secret manager — never in a committed file
- Configuration precedence — later sources override earlier ones: defaults in code, then the properties file, then OS environment variables, then command-line flags; interviewers ask "the file says port 8080 but it started on 9090 — why?" and expect the override chain rather than a guess
- Externalised configuration — the same artifact must run in every environment with only its configuration changed; interviewers ask why you would not build a separate JAR per environment, and the answer is that you would no longer be shipping the artifact you tested
- Config vs secret — a value that merely changes per environment is configuration, a value that must never be readable is a secret, and the two are stored differently; interviewers ask whether the database URL and the database password are handled the same way

## Containerisation (Docker)

- What a container is — a lightweight, isolated process that bundles the app with its exact runtime and dependencies so it behaves the same on every machine; interviewers ask "what problem does Docker solve?" and expect the "works on my machine" answer, not a recital of virtualisation theory
- Container vs virtual machine — a container shares the host OS kernel and starts in milliseconds; a VM ships a whole guest OS and is far heavier; interviewers ask the difference to check you understand why containers, not VMs, became the standard for shipping services
- Image vs container — an image is the immutable blueprint built from a `Dockerfile`; a container is a running instance of that image; the most common Docker confusable pair, asked the same way as "class vs object"
- `Dockerfile` — the recipe that builds an image step by step (base image, copy the build artifact, set the entry point); interviewers ask what each instruction does and why each line becomes a cached layer
- `docker-compose up` — starts every service declared in `docker-compose.yml` (e.g. Spring Boot + PostgreSQL) with one command and one network; interviewers ask "how does a new developer run your project without installing PostgreSQL by hand?" — this is the expected answer
- Environment variables in Compose — config and secrets (DB URL, JWT secret) are passed to the container through the `environment` block or an `.env` file, never baked into the image; interviewers ask how you keep credentials out of an image that may be shared or pushed to a registry
- Why containerisation matters in a consultancy — identical environments across dev, CI, and production remove a whole class of "it ran locally" deployment bugs; in 2026 large Spanish consultancies treat basic Docker fluency as a baseline expectation, so not being able to explain `docker-compose up` reads as behind

## Running containers day to day

- Why the image must be rebuilt after a code change — the image is an immutable snapshot taken at build time, so editing a source file changes nothing until `docker compose up --build`; the single most common "my fix didn't apply" moment for a junior
- `environment:` values vs values baked by the build — a Compose `environment:` entry is read at process start, so one image can serve every deployment, whereas anything consumed during the build requires a rebuilt image to change; interviewers ask how you point the same image at a different database
- `localhost` inside a container is the container itself — a backend container reaching its database at `localhost:5432` fails, because on a Compose network you address the other service by its service name; interviewers ask this exact scenario since it separates people who ran Docker from people who read about it
- Port mapping `8081:8080` — the left side is the host port and the right side the port inside the container; interviewers ask why the app "isn't reachable" when only `EXPOSE` was declared and no mapping was made
- The container filesystem is ephemeral — anything written inside a container disappears when it is removed, which is why a PostgreSQL container loses every row; interviewers ask "your database is empty after restarting, what happened?"
- Volumes — map a host directory or a named volume onto a container path so data outlives the container; interviewers ask which part of a Compose stack needs one, and the answer is the database, not the stateless app
- `docker compose down` vs `down -v` — the second also deletes the named volumes and therefore the database contents; the destructive confusable pair of this section
- Container logs as the primary debugging surface — with no IDE attached, `docker compose logs` is where a startup failure or stack trace is actually read; interviewers ask how you diagnose a container that keeps restarting
- `.dockerignore` — keeps `target/`, `node_modules/` and `.env` out of the build context, which speeds the build and stops secrets being copied into a layer; interviewers ask how a secret ends up inside an image that was never committed
- Pinning the base image tag instead of `:latest` — `latest` makes a build non-reproducible because the same `Dockerfile` yields different images over time; interviewers probe this as a reproducibility question, not Docker trivia

## Why it behaves differently there

- "Works on my machine" traced to a concrete cause — the honest answers are a different dependency or JDK version, a config value that only exists in the IDE run configuration, or data that only exists in the local database; interviewers want the specific cause because the vague answer signals someone who has never debugged an environment
- Timezone differences between machine and container — a container commonly runs UTC while the laptop runs local time, so timestamps shift by hours; interviewers ask why storing UTC and formatting at the edge is the safe pattern
- Locale differences — the default locale changes number and date formatting and some string-casing edge cases, so output differs between environments unless the locale is set explicitly; the quieter twin of the timezone gotcha
- Environment parity as the goal — dev, CI and production should differ only in configuration and data, never in runtime version or topology; interviewers ask what containerisation actually buys you and expect parity, not "it's lightweight"

## Base64

- Base64 is not encryption — it is reversible text encoding for binary data using 64 printable characters; anyone can decode it in one step; interviewers ask this specifically to catch candidates who confuse encoding with security
- JWT structure — header and payload are Base64-encoded JSON separated by dots; the third part is a cryptographic signature; paste any JWT on jwt.io to read the header and payload directly; only the signature provides security
- `btoa()` / `atob()` — the browser functions for encoding and decoding Base64 strings; `Decoders.BASE64.decode()` is the JJWT equivalent in Spring Boot for converting the Base64 signing key to bytes

## Browser storage

- `localStorage` — persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript, which makes it vulnerable to XSS token theft
- `sessionStorage` — cleared when the tab closes; not shared between tabs; same API as `localStorage`; used for temporary state that should not survive a browser restart
- Cookies — sent automatically with every HTTP request to the matching domain; `HttpOnly` flag prevents JavaScript from reading them; `Secure` restricts them to HTTPS; `SameSite=Strict` prevents CSRF
- `localStorage` vs `HttpOnly` cookie for JWT — the production tradeoff; localStorage is simple but XSS can steal the token; HttpOnly cookies are XSS-safe but require CSRF protection and `withCredentials: true` in Angular; interviewers ask which you would choose in production and why
- Cookies travel automatically, `Authorization` does not — the browser attaches matching cookies to every request with no code, while a token header must be set by an interceptor on each call; interviewers ask which mechanism still works after a full page reload and why
- Storage limits and shape — a few megabytes, strings only, and synchronous (so a large read blocks the main thread); interviewers ask why you would not cache a large API response set in `localStorage`
- Where non-token state belongs — in-memory service state, `sessionStorage` or `localStorage`, decided by whether the value must survive a reload, a tab close, or neither; interviewers ask where you would keep a half-filled form or a chosen theme

## Logging

- Why not `System.out.println()` / `console.log()` for debugging production code — print statements cannot be turned off, are not timestamped, and are lost once the terminal closes; interviewers ask "how would you debug an issue in a deployed app without a debugger attached?" — logs are the expected answer
- Log levels — `DEBUG` (detailed, dev only), `INFO` (normal events, e.g. "user logged in"), `WARN` (something unexpected but recoverable), `ERROR` (something failed); interviewers ask what level you would use for a caught exception that the app recovered from (`WARN`, not `ERROR`, if the request still succeeded)
- Logs vs exceptions in error handling — an exception interrupts the current operation and must be handled or propagated; a log is a side note that does not change control flow; interviewers ask why you would still log an exception even after it is already handled by `@RestControllerAdvice` (loses the stack trace otherwise — the client only sees a clean message, but the server needs the detail to debug)
- What must never reach a log — passwords, raw JWTs and personal data; interviewers show a line that dumps the whole request object and ask what you would remove, because a log file is read by more people than the database
- Choosing the log level per environment — `DEBUG` locally and `INFO` or `WARN` in production, changed by configuration rather than by editing and redeploying code; interviewers ask how you would raise verbosity on an app that is already running

- Character-encoding mismatches — accented names arriving as `Ã±` mean the bytes were written as UTF-8 and read as something else, and the mismatch hides between the terminal, the database's encoding, and a container's default locale; it is the third member of the timezone-and-locale family and interviewers on any Spanish-language product ask where you would look

---

## SOLID

> SOLID is owned by the **Architecture** topic, where it is anchored to real project decisions and paired with coupling, cohesion and the concrete violations interviewers show you. It is deliberately not duplicated here.

## Code principles

- DRY — extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?" — the answer is extract, not copy
- KISS — the simplest solution that works is the right one; complexity is a cost that must be justified; interviewers probe this when they see overcomplicated junior code or bloated AI-generated boilerplate
- YAGNI — do not build features for hypothetical future requirements; adding pagination before it is needed, or building a plugin system for a feature with one implementation, are the classic examples; common in AI-generated code
- DRY vs premature abstraction — two blocks that merely look alike may be a coincidence rather than duplication, and extracting too early creates a shared abstraction that fights both callers when they diverge; interviewers ask when you would deliberately *not* deduplicate
- Technical debt as a deliberate decision — a shortcut taken knowingly and written down as a ticket is debt; the same shortcut taken unknowingly is a defect; interviewers ask how you would handle a deadline that forces the shortcut
- Code smell — a surface symptom pointing at a deeper design problem rather than a bug: a long method, a god class, a long parameter list, a class reaching repeatedly into another object's data; interviewers ask you to name three you would flag on sight, because "clean code" without concrete smells is a slogan
- Refactoring, precisely — changing the structure without changing the behaviour, which is only safe when tests already pin that behaviour down; interviewers ask what separates refactoring from rewriting, and the presence of tests is the whole answer
- Naming versus comments — a comment explaining *what* the code does is usually a rename waiting to happen, while a comment explaining *why* a non-obvious decision was made is the one worth keeping; interviewers use a commented block to check which kind you write

## Agile and Scrum — the framework

Named in ~6 of every 8 junior postings at Spanish consultancies ("metodologías ágiles", "Scrum/Kanban") and asked in almost every HR call — you will be placed on a Scrum team from day one, so recruiters check you know the ceremonies and vocabulary even without formal team experience.

- Agile vs waterfall — waterfall plans the whole project up front and delivers once at the end; agile delivers small working increments in short cycles and adapts to feedback; interviewers ask why consultancies moved to agile (requirements change, and a client wants to see working software early, not after six months)
- Scrum vs Kanban — Scrum works in fixed-length sprints with defined roles and ceremonies; Kanban is a continuous flow of tasks pulled from a board with work-in-progress limits and no sprints; interviewers ask the difference and when a team would pick one over the other
- Sprint — a fixed time-box (usually 2 weeks) in which the team commits to a set of items and delivers a potentially shippable increment; interviewers ask how long a sprint is and what "done" means at the end of one
- The four Scrum ceremonies — sprint planning (decide what to build this sprint), daily stand-up (15-min sync: what I did, what I'll do, any blocker), sprint review (demo the increment to stakeholders), retrospective (the team improves its own process); interviewers ask you to describe the daily stand-up because it is the one a junior attends every morning
- Refinement (grooming) — the session where upcoming backlog items are clarified and estimated so that planning is not the first time anyone reads them; interviewers ask in which ceremony estimation actually happens, because juniors reflexively answer "planning"
- Scrum roles — Product Owner (owns and prioritises the backlog, represents the client), Scrum Master (removes blockers, protects the process, not a manager), Development Team (builds the increment); interviewers ask who decides priority (the PO, not the developer) and who a junior raises a blocker to (the Scrum Master)
- Product backlog vs sprint backlog — the product backlog is the full prioritised list of everything the product might need; the sprint backlog is the subset the team pulled in for the current sprint; interviewers ask where a new feature request goes (the product backlog, for the PO to prioritise — not straight into the current sprint)
- Where a junior fits — you take a story from the sprint backlog, implement it on a feature branch, open a PR for review, and demo it at the sprint review; interviewers ask this to confirm you understand your day-to-day inside the process, not just the theory

## Working a story

- User story — a requirement written from the user's perspective: "As a [role], I want [goal] so that [benefit]"; interviewers ask you to phrase a feature as a user story to check you think in terms of user value, not just tasks
- Story points and estimation — relative effort estimates (often a Fibonacci-like scale) rather than hours, because relative sizing is more reliable than time guesses at junior level; interviewers ask why teams estimate in points instead of hours
- Definition of Done — the shared checklist an item must meet to count as finished (code reviewed, tested, merged, meets acceptance criteria); interviewers ask what "done" means on your team to check you don't call code "done" when it only compiles locally
- Acceptance criteria vs Definition of Done — acceptance criteria are per-story and describe what that specific story must do to be accepted; the Definition of Done is a team-wide quality bar identical for every story; interviewers ask the difference because confusing the two is the clearest sign of someone who has never worked a real ticket
- Sprint goal — the one-sentence outcome the sprint aims at, which is what the team protects when scope has to be cut; interviewers ask what happens when the team cannot finish everything, and the expected answer is dropping items while keeping the goal
- An unfinished item at sprint end — an incomplete story is not "half done"; it returns to the backlog and is re-estimated, with no partial credit; interviewers ask this to test whether you understand that points measure delivered increments, not effort spent
- Velocity — the average points a team actually completes per sprint, used to forecast how much to pull into the next one; interviewers ask what velocity is for and why comparing it between teams is meaningless, since points are relative to one team's own scale
- Why a junior's estimate is expected to be wrong — estimation error is a known property of inexperience, which is exactly why teams size relatively and correct through velocity instead of trusting individual numbers; interviewers ask what you do on realising mid-sprint that a story is twice the size you thought
- Blocker — an impediment the team cannot resolve within the sprint (missing credentials, a dependency on another team, an ambiguous requirement); interviewers ask when you would raise one and to whom, because a junior sitting silently on a blocker for two days is the failure mode they screen for
- Splitting a story too big for one sprint — vertical slices that each deliver working end-to-end value, rather than horizontal "backend this sprint, frontend next"; interviewers ask how you would break down a feature you cannot finish
- Spike — a time-boxed investigation ticket whose deliverable is knowledge (a decision, a proof of concept) rather than shippable code; interviewers ask how you would ticket "we don't know whether this library can do X"

## Tickets and requirements

- What makes a bug ticket actionable — environment, exact steps to reproduce, expected result, actual result, and evidence (a log excerpt, a screenshot, the request and response); interviewers ask you to describe a bug report because a ticket saying "it doesn't work" is unassignable and is the most common junior failure on a client project
- What an intermittent bug ticket must capture — timestamps, correlation IDs and logs from the occurrences that *were* observed, since reproduction steps do not exist yet and the ticket is otherwise unassignable; interviewers ask what you file for a bug that only happens sometimes
- Defect vs change request — a defect is behaviour that contradicts the agreed specification and is fixed at no extra cost; a change request is new scope and is negotiated and billed; consultancy interviewers ask this because a junior who "just adds it because the client asked" gives away contracted hours
- Story vs task vs bug vs epic — a story is user-facing value, a task is a technical unit beneath it, a bug is defective existing behaviour, an epic spans sprints; interviewers ask you to classify an item to check you can navigate a real board
- Ticket states and who closes them — an item flows to-do → in progress → in review → QA → done, and the developer is not the one who declares it done after QA validation; interviewers ask this to check you do not equate "merged" with "accepted"
- Traceability from ticket to code — the ticket ID travels into the branch name, the commits and the PR title so any line of production code can be traced back to the requirement that justified it; interviewers ask why the ID matters, and the answer is audit and impact analysis on a client engagement, not tidiness
- An ambiguous requirement is a defect in the ticket — an unclear acceptance criterion is resolved with the Product Owner before implementation, because guessing produces work that is rejected at review; interviewers frame it as "the story doesn't say what happens when the list is empty"
- Scope creep — small additions accepted informally mid-sprint that were never estimated or agreed; interviewers ask what you do when a client asks you directly for "one small extra thing", and the concept is that scope changes go through the PO and the backlog
- Non-functional requirement — a constraint on how the system behaves (response time, availability, browser support, accessibility) rather than what it does; interviewers ask for an example because juniors list only features, and NFRs are what client contracts are actually held to

## Environments and releases

- The environment chain dev → test/QA → staging → production — each is a progressively more production-like copy, and promotion moves the same built artifact forward rather than rebuilding it; interviewers ask why staging exists when test already passed, and the answer is production-like data, configuration and integrations
- Release vs deploy — a deploy puts code onto an environment, a release makes it available to users; interviewers ask this to check you know code can sit in production switched off
- Rollback — returning production to the previous known-good version when a release fails, which is why the previous artifact is kept and why an irreversible database migration is dangerous; interviewers ask "the release broke production at 18:00, what happens now?" and expect rollback rather than a hotfix under pressure
- Hotfix — an urgent fix branched from what is actually in production rather than from the current development line, then merged back; interviewers ask why you cannot simply ship the dev branch, and the answer is that it contains unreleased, unverified work
- CI pipeline as a merge gate — an automated build and test run on every push that must pass before a merge is allowed; interviewers ask what happens when the pipeline goes red on your branch, and the concept is that it is yours to fix and it blocks everyone once it is on the shared branch
- Smoke test after a deploy — a minimal check that the deployed system is alive and its critical path works, distinct from the full test suite; interviewers ask how you know a deploy actually succeeded

---

## Cloud awareness

Named in roughly 3 of every 8 target postings (Indra's "proyectos sobre cloud pública" is the explicit one). Nobody expects a junior to operate a cloud platform, but they do expect you to recognise the shape of one and know what changes when the app stops running on your laptop.

- What a managed service is — the provider runs the database, the queue or the container platform, so you stop patching, backing up and scaling it and start paying for it; interviewers ask what a managed database buys you and expect the operational answer rather than "it's in the cloud"
- Where a containerised app actually runs — an image is pushed to a registry and a service pulls and runs it, which is the same image you built locally rather than a rebuild; interviewers ask how your `docker build` output reaches production
- Configuration and secrets at deploy time — the environment variables that were a `.env` file locally arrive from the platform's configuration or secret store, which is exactly why the twelve-factor rule matters; interviewers ask where the production database password lives
- What does not change — your Spring Boot jar, your SQL and your Angular bundle are identical; the cloud changes who runs them and how they are configured, not what they are; interviewers ask whether you would need to rewrite the app to deploy it and the honest answer is no

---

## Reviewing code — what to look for

Distinct from Git's pull-request mechanics: this is the judgement you apply once the diff is open. The 2026 technical interview is largely a review round.

- What a reviewer actually checks, in order — does it do what the ticket says, is it correct at the edges, is the new behaviour tested, and is it named so the next person understands it; interviewers ask because a junior who only comments on formatting adds nothing to a team
- Reviewability is a property of the change — a small single-purpose diff gets a genuine review while a two-thousand-line one gets an approval nobody read; interviewers ask why you would split a change and want the reviewer's attention budget named
- Unrelated changes inside one review — a formatting sweep bundled with a bug fix hides the fix inside the noise; the same atomicity rule as commits, applied to the diff
- Separating a blocking objection from a preference — a correctness or security problem blocks, a naming quibble does not, and treating both the same way makes a reviewer easy to ignore; interviewers ask how you decide what is worth a comment
- Being asked "why did you do it this way?" — the second follow-up is what exposes code that was copied rather than reasoned about; this is the review round's real question, and it is why every line you submit must be defensible

---

## Working with AI as a developer

`_shared-context.md` records this as the defining change of 2026: the question moved from "can you write the code?" to "can you explain it, defend it, and catch what the assistant got wrong?" These are concepts a screening now tests directly.

- Using an assistant professionally — expected rather than suspect in 2026, but the code you submit is yours and is judged as yours; interviewers ask how you use Copilot or Cursor and are equally wary of "never" and "for everything"
- Never commit code you cannot explain — the single rule separating a developer from a prompt runner, and interviewers test it by pointing at any line of your own project and asking why it is there
- The defects AI reliably produces at junior level — a hardcoded secret instead of an environment variable, `@Transactional` on the controller instead of the service, the wrong validation annotation (`@NotNull` where `@NotBlank` was meant), a test that asserts nothing, and an N+1 query from a missing fetch strategy; the 2026 technical test increasingly hands you a snippet containing several of these and counts how many you find
- Verifying a claim about an unfamiliar framework — you check the official documentation and run it, because a confidently invented API name reads perfectly and compiles nowhere; interviewers ask how you check an answer you cannot yet evaluate
- AI on a take-home — the deliverable is graded by whether you can defend it live, so anything you cannot explain is a liability rather than a shortcut; interviewers ask what you would disclose and the honest position is the defensible one
