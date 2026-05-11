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

## SOLID principles

**What are the SOLID principles?**
Five design principles that make code easier to maintain and test. S — Single Responsibility (one class, one job). O — Open/Closed (extend without modifying). L — Liskov Substitution (subtypes honour their parent's contract). I — Interface Segregation (small interfaces over one large one). D — Dependency Inversion (inject dependencies, don't create them). I apply S and D every day in both Angular and Spring Boot.

**What is the Single Responsibility Principle and where do you apply it?**
A class should have only one reason to change. In the HR portal: `EmployeeService` is responsible for data, `EmployeeListComponent` is responsible for the UI — if the API changes, only the service changes; if the design changes, only the component changes. Mixing both in one class is the most common violation in junior code.

**What is Dependency Inversion and how does Angular apply it?**
What they really want to know: Do you understand what dependency injection actually solves, or do you just use it because Angular requires it?
A: Dependency Inversion means a class should not create its own dependencies — it should receive them from outside. This makes the class testable because you can inject a mock instead of the real implementation. Angular's `inject(EmployeeService)` and Spring Boot's constructor injection are both implementations of this principle. Without it, you cannot write unit tests — the class is hardwired to one specific implementation.
Red flag answer: "It means using `inject()` in Angular." — That is the mechanism, not the principle. The real answer is about testability and decoupling.

---

## MVC and architecture patterns

**Do you know any design patterns? Have you used any in your projects?**
A design pattern is a reusable solution to a common programming problem. The two I use every day without always naming them: Singleton — one shared instance across the app; Angular services with `providedIn: 'root'` are singletons, as are Spring Boot `@Service` beans. Observer — an object notifies many listeners when it changes; RxJS Observables are a direct implementation of this, and Angular signals work on the same principle. Knowing the names lets me communicate with senior developers who use pattern vocabulary naturally.

**What is MVC and how does it relate to Spring Boot?**
MVC splits the app into Model (data and business logic), View (what the user sees), and Controller (receives input and coordinates the other two). In Spring Boot the layered architecture extends this: the `@RestController` is the Controller, the JSON response is the View, and the Service + Repository together form the Model. In practice "MVC" and "layered architecture" refer to the same idea — separate concerns so each part can change independently.

**What is the difference between a monolith and microservices?**
A monolith is one application deployed as a single unit — all features in the same codebase. Microservices split the system into many small services, each responsible for one business domain, each with its own database and deployment. Monolith is simpler to develop and good for small teams. Microservices let large teams work independently and let you scale one part without scaling the whole system. The trade-off is operational complexity — microservices need infrastructure a monolith does not.

**Would you choose a monolith or microservices for a new project?**
What they really want to know: Do you understand trade-offs, or do you think microservices are always the answer?
A: For a new project with a small team, I would start with a monolith — it is faster to build, easier to debug, and simple to deploy. Once the domain is well understood and the team grows, you can extract services where it makes sense. Starting with microservices before understanding the domain is one of the most common architecture mistakes. Most projects at a consultancy will already be microservices by the time I join, so my job is to understand the service I own and how it communicates with the others.
Red flag answer: "Microservices, because they scale better." — Premature optimization. The real answer depends on team size, domain complexity, and stage of the project.

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
