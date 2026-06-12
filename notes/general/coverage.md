# Minimum Coverage — General

Cross-cutting concepts that appear in interviews regardless of the stack.
These come up in the HR call, the technical interview, and the technical test review.

## HTTP
- HTTP methods: GET, POST, PUT, PATCH, DELETE — what each is for and the semantic difference between PUT (replace the whole resource) and PATCH (partial update)
- Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error — the ones that appear in every REST API
- Headers: `Content-Type`, `Authorization`, `Accept` — what each carries; `Authorization: Bearer <token>` is how JWT is sent with every request
- Request vs response structure — method, URL, headers, optional body for requests; status, headers, body for responses
- HTTPS vs HTTP — TLS encrypts the connection so headers and body cannot be read in transit; required for any API that handles passwords or tokens

## JSON
- JSON structure: objects `{}`, arrays `[]`, strings, numbers, booleans, null — the six data types
- `JSON.parse` and `JSON.stringify` — converting between JSON string and JavaScript object; used for localStorage and API responses
- Why JSON is the standard for REST APIs — text-based, human-readable, natively supported in browsers and every backend language

## Environment variables
- What they are — key-value pairs set outside the code to configure behaviour without changing source files
- How they are used: Angular (`environment.ts`), Spring Boot (`application.properties` with `${VAR_NAME}`) — the pattern you use in every project
- Why secrets must never be committed — anyone who can read the repo can use the credentials; the damage is permanent even after deletion

## Error handling patterns
- Try/catch at the boundary — catch at the outermost layer (controller, component), let errors propagate naturally from inside
- Fail fast — detect invalid state as early as possible and throw an exception; do not silently continue with bad data
- Error propagation — throw upward and handle once at the top; avoid catching and re-throwing without adding value

## Code principles
- DRY — Don't Repeat Yourself: extract shared logic into a function or service; interviewers ask "what would you do if you saw the same code in three places?"
- KISS — Keep It Simple: the simplest solution that works is usually the best; complexity is a cost that must be justified
- YAGNI — You Aren't Gonna Need It: do not build features for hypothetical future requirements; build what is needed now

## Testing concepts
- Unit test vs integration test vs end-to-end test — unit tests one function in isolation; integration tests multiple components together; E2E tests the full system; interviewers ask the difference and when to use each
- What a mock is — a controlled replacement for a real dependency; lets you test one unit without its dependencies; the risk is that the mock behaves differently from reality
- Test coverage — the percentage of code touched by tests; 100% coverage does not mean the code is correct, only that it was executed
- TDD — write the test first, then the code that makes it pass; not always practised daily but asked in technical interviews

## Base64
- What Base64 is — encoding binary data as printable ASCII text; not encryption, not compression; just a safe text representation of arbitrary bytes
- When it appears: JWT payload encoding, `Authorization: Basic` headers, image data URIs — you will see it in every project
- `btoa()` / `atob()` in the browser — encoding and decoding Base64 strings in JavaScript

## Browser storage
- `localStorage` — persists after the tab closes; string key-value pairs; no expiry; used for JWT tokens in Angular
- `sessionStorage` — cleared when the tab closes; used for temporary page state
- Cookies — sent with every HTTP request automatically; can be `HttpOnly` (not accessible to JavaScript)
- When to use each — localStorage for JWT in SPAs; HttpOnly cookies for more secure token storage; sessionStorage for one-session data
- The security tradeoff: localStorage is vulnerable to XSS; HttpOnly cookies are vulnerable to CSRF; the choice depends on which threat you prioritise

## SOLID
- Single Responsibility — one class, one reason to change; controllers handle HTTP, services handle rules
- Open/Closed — extend without modifying; add a new feature by adding new code, not changing existing code
- Liskov Substitution — a subtype can replace its parent without breaking callers; why Spring interfaces work
- Interface Segregation — prefer small specific interfaces over one large one
- Dependency Inversion — depend on abstractions; the foundation of Spring DI and Angular's `inject()`
