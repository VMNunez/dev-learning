# Architecture — Interview Questions

## REST API

**What is REST and how does your Angular app use it?**

REST is a convention for designing APIs using HTTP — each URL identifies a resource, and the HTTP method says what to do with it. Before REST, teams designed APIs in incompatible ways; REST gave everyone a shared language. Angular uses `HttpClient` to make REST calls: `http.get()`, `http.post()`, `http.put()`, `http.delete()`. In the HR portal, every service method maps to one REST operation — `getAll()` calls `GET /employees`, `create()` calls `POST /employees`.

> **Junior tip:** Emphasise that REST is a convention, not a protocol you install. It is a shared agreement about how to use HTTP — any team that follows it can be understood by any HTTP client.
> **Consejo de entrevista:** Enfatiza que REST es una convención, no un protocolo que instalas. Es un acuerdo compartido sobre cómo usar HTTP.

**What is the difference between GET, POST, PUT, and DELETE?**

GET reads data without side effects. POST creates a new resource — every call may create a new record. PUT replaces a resource completely — you send all fields; if you omit one, it gets cleared. DELETE removes a resource. PATCH is the alternative to PUT: PATCH sends only the changed fields, while PUT replaces everything. In practice, most Angular + Spring Boot projects use PUT for updates because it is simpler when the objects are small.

> **Junior tip:** The interviewer may ask about idempotency — GET, PUT, and DELETE are idempotent (safe to call multiple times); POST is not. Know the term even if they do not ask it directly.
> **Consejo de entrevista:** El entrevistador puede preguntar sobre idempotencia — GET, PUT y DELETE son idempotentes; POST no. Conoce el término aunque no te lo pregunten directamente.

**What HTTP status codes do you know and what do they mean?**

200 is success for GET and PUT. 201 is created — returned after POST. 204 is no content — returned after DELETE. 400 is a bad request — the client sent invalid data. 401 is unauthorized — the token is missing or invalid. 403 is forbidden — authenticated but not allowed. 404 is not found. 500 is a server error. The distinction between 401 and 403 matters: 401 means "I don't know who you are", 403 means "I know who you are, but you cannot do this". In the HR portal, an employee trying to access an admin route would get a 403.

> **Junior tip:** You do not need to memorise every code. Knowing the families (2xx = success, 4xx = client error, 5xx = server error) and the most common ones is enough for a junior screening.
> **Consejo de entrevista:** No necesitas memorizar todos los códigos. Conocer las familias (2xx = éxito, 4xx = error del cliente, 5xx = error del servidor) y los más comunes es suficiente.

**What is CORS and when does it happen?**

CORS is a browser security rule that blocks requests between different origins. When Angular runs on `localhost:4200` and calls Spring Boot on `localhost:8080`, the browser blocks it — different ports mean different origins. The fix is on the backend: Spring Boot must include response headers that allow the Angular origin. CORS does not affect Postman or server-to-server calls — only browsers enforce it. If a request works in Postman but fails in the browser, CORS is almost always the cause.

> **Junior tip:** The key insight is that CORS is a browser restriction, not a server restriction. The server decides which origins to allow — the browser is the one that enforces it.
> **Consejo de entrevista:** Lo clave es que CORS es una restricción del navegador, no del servidor. El servidor decide qué orígenes permitir — el navegador es quien lo impone.

**How do you name REST endpoints? What conventions do you follow?**

Use nouns, not verbs — the URL names the resource, the HTTP method expresses the action. Use plural nouns: `/employees`, not `/employee`. Use lowercase with hyphens for multi-word resources: `/leave-requests`. Nest resources for relationships: `/employees/1/leaves`. Never put verbs in the URL like `/getEmployee` or `/deleteEmployee/1` — that is RPC style, not REST.

> **Junior tip:** A common mistake is putting the action in the URL. The HTTP method IS the action. `DELETE /employees/1` is correct; `/deleteEmployee/1` is not REST.
> **Consejo de entrevista:** Un error común es poner la acción en la URL. El método HTTP ES la acción. `DELETE /employees/1` es correcto; `/deleteEmployee/1` no es REST.

**What is idempotency and why does it matter in REST?**

An operation is idempotent if calling it multiple times produces the same result as calling it once. GET, PUT, and DELETE are idempotent — retrying them is safe. POST is not idempotent — retrying a POST may create a duplicate record. This matters when building reliable systems: if a network failure causes a retry, you want to know whether the retry is safe or potentially destructive.

> **Junior tip:** You will not implement idempotency logic in a junior project, but knowing the concept shows you understand REST at a deeper level than just using `http.get()`.
> **Consejo de entrevista:** No implementarás lógica de idempotencia en un proyecto junior, pero conocer el concepto demuestra que entiendes REST a un nivel más profundo que solo usar `http.get()`.

---

## SOLID principles

**What are the SOLID principles?**

Five design principles that make code easier to maintain and test. S — Single Responsibility: one class, one job. O — Open/Closed: extend without modifying existing code. L — Liskov Substitution: subtypes must honour their parent's contract. I — Interface Segregation: small interfaces over one large one. D — Dependency Inversion: inject dependencies, do not create them inside the class. I apply S and D every day in both Angular and Spring Boot.

> **Junior tip:** Know all five by name and definition. Be ready to explain S and D with project examples — those are the two interviewers actually probe at junior level. The others are good to name but rarely go deeper.
> **Consejo de entrevista:** Conoce los cinco por nombre y definición. Sé capaz de explicar S y D con ejemplos de proyectos — esos son los dos que los entrevistadores realmente exploran a nivel junior.

**What is the Single Responsibility Principle and where do you apply it?**

A class should have only one reason to change. In the HR portal: `EmployeeService` is responsible for employee data — if the API format changes, only the service changes. `EmployeeListComponent` is responsible for the UI — if the design changes, only the component changes. Mixing both in one class is the most common SRP violation in junior code, and it makes testing much harder.

> **Junior tip:** "One reason to change" means one stakeholder owns the class. If both the business team and the API team can force changes in the same class, it violates SRP.
> **Consejo de entrevista:** "Una razón para cambiar" significa que un solo stakeholder es dueño de la clase. Si el equipo de negocio Y el equipo de API pueden forzar cambios en la misma clase, viola SRP.

**What is Dependency Inversion and how does Angular apply it?**

Dependency Inversion means a class should not create its own dependencies — it should receive them from outside. This makes the class testable because you can inject a mock instead of the real implementation. Angular's `inject(EmployeeService)` and Spring Boot's constructor injection both implement this principle. Without it, you cannot write unit tests — the class is hardwired to one specific implementation and you cannot swap it.

> **Junior tip:** Focus on WHY it matters, not just the mechanism. "Testability and decoupling" is the real answer. `inject()` is just how Angular implements the principle.
> **Consejo de entrevista:** Céntrate en POR QUÉ importa, no solo en el mecanismo. "Testeabilidad y desacoplamiento" es la respuesta real.

Red flag answer: "It means using `inject()` in Angular." — That is the mechanism, not the principle. The real answer is about testability and decoupling.

**What is the Open/Closed Principle?**

A class should be open for extension but closed for modification — you add new behaviour without changing existing working code. In the HR portal, adding a new guard to a route: `canActivate: [authGuard, adminGuard]` — you add to the array without rewriting `authGuard`. In Angular, adding a new filter: you add a new signal and extend `computed()` without touching the existing filter logic. The classic violation is a big `if/else` or `switch` that you have to modify every time a new case appears.

> **Junior tip:** The interviewer wants to know if you can recognise when a design violates OCP — not if you can recite the definition. Think of a project example where you added behaviour without breaking existing code.
> **Consejo de entrevista:** El entrevistador quiere saber si puedes reconocer cuándo un diseño viola OCP, no si puedes recitar la definición.

**What is the Liskov Substitution Principle?**

If class B extends class A, you should be able to use B anywhere A is expected and it should still work correctly. The practical lesson: be careful with inheritance. If `AdminService extends EmployeeService`, every overridden method must behave consistently with what `EmployeeService` promises. The warning sign: if callers have to check `instanceof` before calling a method, LSP is probably violated. Prefer composition over inheritance when you cannot guarantee the contract.

> **Junior tip:** LSP violations show up as surprises — you call a method expecting one behaviour and the subclass does something different. If that can happen, break the inheritance apart.
> **Consejo de entrevista:** Las violaciones de LSP se manifiestan como sorpresas — llamas a un método esperando un comportamiento y la subclase hace algo diferente.

---

## MVC and architecture patterns

**Do you know any design patterns? Have you used any in your projects?**

A design pattern is a reusable solution to a common programming problem. The two I use every day: Singleton — one shared instance across the app; Angular services with `providedIn: 'root'` are singletons, and Spring Boot `@Service` beans are singletons too. Observer — an object notifies many listeners when it changes; RxJS Observables are a direct implementation, and Angular signals work on the same principle. In project 05 I also applied the Coordinator pattern — one parent component owns all shared state and coordinates the table, filter bar, and dialog that all depend on it.

> **Junior tip:** Do not wait for the interviewer to ask about patterns — bring them up when describing your project architecture. It signals that you think in patterns, not just in code.
> **Consejo de entrevista:** No esperes a que el entrevistador te pregunte sobre patrones — menciónalos al describir la arquitectura de tu proyecto.

**What is MVC and how does it relate to Spring Boot?**

MVC splits an app into Model (data and business logic), View (what the user sees), and Controller (receives input and coordinates the other two). In Spring Boot, layered architecture extends this: the `@RestController` is the Controller, the JSON response is the View, and the Service + Repository together form the Model. In practice, "MVC" and "layered architecture" describe the same idea — separate concerns so each part can change independently.

> **Junior tip:** When an interviewer asks about MVC, they usually mean the general idea of separating concerns, not the strict three-layer definition. Your layered architecture answer covers it — just connect the vocabulary.
> **Consejo de entrevista:** Cuando un entrevistador pregunta sobre MVC, suele referirse a la idea general de separar responsabilidades. Tu respuesta sobre arquitectura en capas lo cubre — solo conecta el vocabulario.

**What is the difference between a monolith and microservices?**

A monolith is one application deployed as a single unit — all features in the same codebase. Microservices split the system into many small services, each responsible for one business domain, each with its own database and deployment. Monolith is simpler to develop and debug — good for small teams and early-stage projects. Microservices let large teams work independently and scale one part without scaling the whole system. The trade-off is operational complexity: microservices need infrastructure (service discovery, API gateway, distributed logging) that a monolith does not.

> **Junior tip:** Most consultancies already run microservices. Your job as a junior is to understand the service you own and how it communicates with others via REST — not to design the whole system.
> **Consejo de entrevista:** La mayoría de consultoras ya tienen microservicios. Tu trabajo como junior es entender el servicio asignado y cómo se comunica con los demás vía REST.

**Would you choose a monolith or microservices for a new project?**

For a new project with a small team, I would start with a monolith — it is faster to build, easier to debug, and simple to deploy. Once the domain is well understood and the team grows, you can extract services where it makes sense. Starting with microservices before understanding the domain is one of the most common architecture mistakes. Most projects at a consultancy will already be microservices by the time I join — my job is to understand the service I own and how it communicates with the others.

Red flag answer: "Microservices, because they scale better." — Premature optimisation. The real answer depends on team size, domain complexity, and stage of the project.

---

## Component patterns

**What is the smart/dumb component pattern and when did you use it?**

Smart components manage state and make decisions — they call services, handle events, and pass data down to children. Dumb (or presentational) components only display data and emit events up — they have no knowledge of the service layer. The benefit: dumb components are reusable and easy to test because they have no dependencies. I first applied this in project 03 (expense tracker) — the page component held all state and the form component only emitted events.

> **Junior tip:** The names "smart" and "dumb" are being replaced in some teams by "container" and "presentational". Same concept, different words — use whichever the interviewer uses.
> **Consejo de entrevista:** Los nombres "smart" y "dumb" están siendo reemplazados en algunos equipos por "container" y "presentational". Mismo concepto, palabras diferentes.

**What is the coordinator pattern and where did you use it?**

The coordinator pattern is an extension of smart/dumb for situations where multiple sibling components share the same state. One parent component (the coordinator) owns all the data and passes it down to each child separately. In project 05 (task manager), the page component coordinates a filter bar, a table, and a dialog — all three depend on the same task list. Without the coordinator, I would have had to choose one child as the source of truth and pass data awkwardly between siblings.

Red flag answer: "I put the state in the table component." — That makes the table the source of truth, but the dialog and filter bar cannot see it without complex sibling communication. The coordinator lifts state to one place and avoids this.

**Why did you choose the coordinator pattern in project 05 instead of smart/dumb?**

Smart/dumb works well for one smart parent with one or two dumb children. The coordinator becomes the right choice when you have multiple sibling components that all need the same data. In project 05, when I added the filter bar alongside the existing table and dialog, three siblings all needed the task list — the coordinator was the natural upgrade. The rule: start with the simplest pattern that works, promote to a more structured one when the complexity justifies it.

---

## Layered architecture

**What is a layered architecture and why does it matter?**

Splitting the app into layers where each one has a single responsibility: the controller receives HTTP requests, the service contains business logic, the repository reads and writes the database. None of them mix concerns. This matters because if the database changes, only the repository changes. If the API format changes, only the controller changes. The service — the most valuable part — stays stable. In Angular the same idea applies: components handle the template, services handle logic and HTTP calls, models define the data shape.

> **Junior tip:** The rule is simple: only call the layer directly below you. Controllers call services, services call repositories. Never skip a layer or call the repository from the controller — business logic leaks into the HTTP layer and cannot be reused or tested independently.
> **Consejo de entrevista:** La regla es simple: solo llama a la capa directamente por debajo de ti. Controllers llaman servicios, servicios llaman repositorios. Nunca saltes una capa.

**What is a DTO and why not return the entity directly from the API?**

A DTO (Data Transfer Object) is a simple class that carries only the data the client needs. The entity is the database object — it may have fields the client should never see (password hash, internal flags) or nested objects that cause circular references when serialised to JSON. Returning the entity directly also ties the API to the database schema — if the schema changes, the API changes too. The service maps the entity to a DTO before the controller returns it.

> **Junior tip:** DTOs decouple the API contract from the database schema. The benefit is not obvious until you have to change the schema and realise the API is broken for all clients. That is the moment the DTO pattern saves you.
> **Consejo de entrevista:** Los DTOs desacoplan el contrato de la API del esquema de base de datos. El beneficio no es obvio hasta que cambias el esquema y te das cuenta de que la API está rota para todos los clientes.

**Why do you put business logic in the service layer and not in the controller?**

The controller is the HTTP interface — it reads the request and returns a response. If I put business logic there, I cannot reuse it when a second endpoint needs the same rule. In the HR portal, the duplicate email check lives in the service — both the create and update flows call the same method. If it were in the controller, I would have to duplicate it. Controllers should be thin — they delegate everything to the service.

Red flag answer: "Because that is how it is done." — Shows no understanding of the reason. The real answer is about reusability and testability — if the logic is in the controller, you cannot test it independently of HTTP.

**How do you structure the folders in an Angular project for a consultancy?**

The standard at Spanish consultancies is Core/Feature/Shared: `core/` holds singleton things that run once (auth service, interceptors, guards); `features/` holds each business domain as an independent slice (employees, departments, leave requests — each with its own components, services, and models); `shared/` holds reusable UI components used across features (confirm dialog, status badge). I applied this structure in project 06 (HR portal). It makes the codebase navigable by someone who has never seen it before.

Red flag answer: "I put everything in a components folder." — Works for small projects, becomes a mess as the app grows. Consultancies use feature-based structure so teams can own independent slices of the app without stepping on each other.

---

## Authentication

**What is JWT and how does the authentication flow work?**

JWT is a token the server generates after login. It contains the user's email, role, and expiry time in a signed payload. The Angular client stores it in `localStorage` and the HTTP interceptor adds it as a `Bearer` header to every request. The Spring Boot backend verifies the signature on each request — no session lookup in the database needed. In the HR portal I simulate this: the interceptor adds the token, but `json-server` does not actually validate it. Project 07 will use real Spring Boot with proper JWT validation.

> **Junior tip:** Remember the three parts: header (algorithm), payload (user data), signature (proof the token is genuine). The payload is Base64-encoded but not encrypted — anyone can read it. Never put passwords in a JWT.
> **Consejo de entrevista:** Recuerda las tres partes: header (algoritmo), payload (datos del usuario), signature (prueba de que el token es genuino). El payload está en Base64 pero no está cifrado — nunca pongas contraseñas en un JWT.

**What is the difference between authentication and authorisation?**

Authentication is proving who you are — logging in with email and password to get a token. Authorisation is deciding what you are allowed to do — checking the role inside the token to decide if you can access an admin route. In the HR portal, `authGuard` handles authentication (is there a token?) and `adminGuard` handles authorisation (is the role `admin`?). The distinction matters for HTTP status codes: 401 is an authentication failure, 403 is an authorisation failure.

> **Junior tip:** Authentication asks "who are you?", authorisation asks "what can you do?". Keep this distinction clear — interviewers use the terms precisely and mix-ups stand out.
> **Consejo de entrevista:** Autenticación pregunta "¿quién eres?", autorización pregunta "¿qué puedes hacer?". Mantén esta distinción clara — los entrevistadores usan los términos con precisión.

**Why JWT instead of session-based authentication for a REST API?**

Sessions store state on the server — every request needs a database lookup to find the session. JWT is stateless — the token carries the user information and the server only verifies the signature. For a REST API consumed by an Angular frontend, stateless auth scales better and simplifies the backend. The trade-off is that you cannot invalidate a JWT before it expires — for that you need a token blacklist or short expiry with refresh tokens.

Red flag answer: "JWT is more secure." — This is not always true. Security depends on implementation. The real reason is statelessness and scalability.

**Where do you store the JWT token and what are the security trade-offs?**

`localStorage` is the simplest approach and what I use in the HR portal — it persists across tabs and browser restarts. The risk: JavaScript can read `localStorage`, so an XSS attack could steal the token. `sessionStorage` clears when the tab closes, reducing the window of exposure. `httpOnly cookies` are the most secure — the browser sends them automatically and JavaScript cannot read them — but they require CSRF protection. For internal business apps, `localStorage` with strong XSS prevention is the common choice at Spanish consultancies.

Red flag answer: "I use localStorage." — Acceptable, but you must immediately acknowledge the XSS risk. If you say `localStorage` without mentioning the trade-off, the interviewer will assume you are unaware of the security implications.

**What happens when a JWT expires? How does your Angular app handle it?**

When the token expires, the backend returns 401 Unauthorized. In a production Angular app, the HTTP interceptor catches 401 responses and either redirects the user to the login page or uses a refresh token to get a new access token silently. In the HR portal I handle this simply: on 401, the interceptor clears `localStorage` and redirects to login. Project 07 will implement this in the interceptor properly.

> **Junior tip:** Handling token expiry in the HTTP interceptor is one of the most common Spring Boot + Angular interview topics. Know that 401 = expired or invalid token, and the response is either redirect to login or silent refresh.
> **Consejo de entrevista:** Gestionar la expiración del token en el interceptor es uno de los temas más comunes en entrevistas Spring Boot + Angular. Sabe que 401 = token expirado o inválido.

**What is a refresh token and when would you use one?**

A refresh token is a long-lived token issued alongside the short-lived access token. When the access token expires, the Angular app sends the refresh token to a special endpoint to get a new access token without requiring the user to log in again. The benefit: you can keep access tokens short-lived (15 minutes) for security without forcing users to log in constantly. For a learning project, a single token with a longer expiry is simpler and acceptable.

> **Junior tip:** You do not need to have implemented refresh tokens — just know what the pattern is and why it exists. "Short access token for security, long refresh token for convenience" is the one-line summary.
> **Consejo de entrevista:** No necesitas haberlos implementado — solo conoce qué son y por qué existen. "Token de acceso corto por seguridad, token de refresco largo por comodidad" es el resumen en una línea.

---

## Error handling

**How does your Angular app handle HTTP errors from the backend?**

Angular's `HttpClient` throws Observable errors for any non-2xx response. I handle errors in the service using `catchError` from RxJS — it intercepts the error and returns a safe fallback or rethrows a clean error for the component to handle. For the user-facing layer, I use an `isError` signal in the component that shows an error message in the template. In the HR portal, the HTTP interceptor also handles 401 globally — it clears the session and redirects to login.

> **Junior tip:** Handle errors in the service when you want a safe fallback (empty array, null). Handle them in the component when you need to show the user a message. Handle global errors (401, network failure) in the interceptor — not in every service individually.
> **Consejo de entrevista:** Gestiona errores en el servicio cuando quieres un fallback seguro. Gestiónalos en el componente cuando necesitas mostrar un mensaje al usuario. Gestiona errores globales (401) en el interceptor.

**What does Spring Boot return when something goes wrong?**

By default, Spring Boot returns a JSON error object with `timestamp`, `status`, `error`, and `message`. For validation errors, it returns 400 with field-level details. For custom business logic errors, the service throws an exception and a `@ControllerAdvice` class catches it globally and returns the correct status code and message. Without `@ControllerAdvice`, every unhandled exception returns 500 — the client gets no useful information about what went wrong.

> **Junior tip:** `@ControllerAdvice` is a global exception handler — one class handles exceptions thrown by any controller in the app. You will see this on day one in a Spring Boot project. Know what it does even if you have not used it yet.
> **Consejo de entrevista:** `@ControllerAdvice` es un manejador global de excepciones. Lo verás desde el primer día en un proyecto Spring Boot. Sabe qué hace aunque no lo hayas usado aún.

---

## Pressure questions

**What would you change about the architecture of one of your projects if you started again?**

In the HR portal I would extract the auth state management into a proper auth module from the start, instead of keeping it spread across the root component and the auth service. As the app grew, I referenced `authService.currentUser()` from many places with no clear ownership boundary. A dedicated auth module with a clean public API would have made this cleaner. I also would have added global error handling in the HTTP interceptor from day one instead of adding it feature by feature.

**What is the hardest architecture decision you made and why?**

In project 05 (task manager), deciding between smart/dumb and the coordinator pattern. I started with smart/dumb — one parent, one child table. When I added a filter bar, three siblings all needed the same task list. Upgrading to the coordinator was right but required lifting state that was already in the table component. The lesson: start with the simplest pattern that works, and promote to a more structured one when the complexity justifies it — do not over-engineer early.
