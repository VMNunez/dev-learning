# Architecture — Interview Questions

## REST API

**What is REST and how does your Angular app use it?**
REST is a convention for designing APIs around HTTP — each URL identifies a resource, and the HTTP method says what to do with it. Angular uses `HttpClient` to make REST calls: `http.get()`, `http.post()`, `http.put()`, `http.delete()`. In the HR portal every service method maps to one REST operation — `getAll()` calls `GET /employees`, `create()` calls `POST /employees`.

**What is the difference between GET, POST, PUT, and DELETE?**
GET reads data without side effects. POST creates a new resource. PUT replaces a resource completely — you send all fields. DELETE removes a resource. The difference between PUT and PATCH: PATCH sends only the fields that changed, PUT replaces everything. In practice most of my projects use PUT for updates.

**What HTTP status codes do you know and what do they mean?**
200 is success for GET and PUT. 201 is created — returned after POST. 204 is no content — returned after DELETE. 400 is a bad request — the client sent invalid data. 401 is unauthorized — the token is missing or invalid. 403 is forbidden — authenticated but not allowed. 404 is not found. 500 is a server error. The distinction between 401 and 403 matters in the HR portal: a request without a token gets 401, an employee trying to access an admin route gets 403.

**What is CORS and when does it happen?**
CORS is a browser security rule that blocks requests between different origins. When Angular runs on `localhost:4200` and calls Spring Boot on `localhost:8080`, the browser blocks it — the ports are different so the origins are different. The fix is on the backend: Spring Boot must include headers in the response that allow the Angular origin. CORS does not affect Postman or server-to-server calls — only browsers enforce it.

---

## Layered architecture

**What is a layered architecture and why does it matter?**
Splitting the app into layers where each one has a single responsibility: the controller receives HTTP requests, the service contains business logic, the repository reads and writes the database. None of them mix concerns. This matters because if the database changes, only the repository changes. If the API format changes, only the controller changes. The service — the most valuable part — stays stable. In Angular the same idea applies: components handle the template, services handle logic and HTTP, the models define the data shape.

**What is a DTO and why not return the entity directly from the API?**
A DTO (Data Transfer Object) is a simple class that carries only the data the client needs. The entity is the database object — it may have fields the client should never see (password hash, internal flags) or nested objects that cause circular references. Returning the entity directly also ties the API to the database schema — if the schema changes, the API breaks. The service maps the entity to a DTO before the controller returns it.

**Why do you put business logic in the service layer and not in the controller?**
What they really want to know: Do you understand why the layers exist, or did you just follow a tutorial?
A: The controller is the HTTP interface — it reads the request and returns a response. If I put business logic there, I cannot reuse it when a second endpoint needs the same rule. In the HR portal the duplicate email check lives in the service — both the create and update flows call the same method. If it were in the controller, I would have to duplicate it.
Red flag answer: "Because that is how it is done." — Shows no understanding of the reason.

---

## Authentication

**What is JWT and how does the authentication flow work?**
JWT is a token the server generates after login. It contains the user's email, role, and expiry time in a signed payload. The Angular client stores it in localStorage and the interceptor adds it as a `Bearer` header to every request. The Spring Boot backend verifies the signature on each request — no session lookup in the database. In the HR portal I simulate this: the interceptor adds the token, but `json-server` does not actually validate it. Project 07 will use real Spring Boot with proper JWT validation.

**What is the difference between authentication and authorisation?**
Authentication is proving who you are — logging in with email and password to get a token. Authorisation is deciding what you are allowed to do — checking the role inside the token to decide if you can access an admin route. In the HR portal, `authGuard` handles authentication (is there a token?) and `adminGuard` handles authorisation (is the role `admin`?).

**Why JWT instead of session-based authentication for a REST API?**
What they really want to know: Do you understand the trade-off, not just the implementation?
A: Sessions store state on the server — every request needs a database lookup to find the session. JWT is stateless — the token carries the user information and the server only verifies the signature. For a REST API consumed by an Angular frontend, stateless auth scales better and simplifies the backend. The trade-off is that you cannot invalidate a JWT before it expires — for that you need a token blacklist or short expiry with refresh tokens.
Red flag answer: "JWT is more secure." — This is not always true. Security depends on implementation. The real reason is statelessness and scalability.
