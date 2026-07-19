# Minimum Coverage — Architecture

Patterns and decisions a junior at a Spanish consultancy must explain confidently.
Not just what they are — but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

> This is the topic stage 4 tests hardest. Per `_shared-context.md`, the live technical interview is
> the decisive filter, and juniors fail it for being unable to justify a decision — "why JWT?", "why
> DTOs?", "why soft delete?". Every item here should end in an argument you could defend out loud.

## REST — resources and verbs

- REST principles: stateless, resources, HTTP verbs, uniform interface — the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- Idempotency — `GET`, `PUT`, `DELETE` are idempotent; `POST` is not; interviewers ask "what happens if the client sends the same DELETE request twice?"
- `PATCH` vs `PUT` — `PUT` replaces the whole resource; `PATCH` changes one part; used in TimeTrack for status transitions (submit, approve, reject)
- Modelling an action that is a verb — "approve a timesheet" has no HTTP verb, so the three real options are `PATCH /entries/{id}` with a new status, a sub-resource `POST /entries/{id}/approval`, or an explicit command endpoint; interviewers ask precisely because REST gives you no obvious answer and they want to hear you choose
- CORS — a browser security rule that blocks requests from a different origin (e.g. Angular on port 4200 calling Spring Boot on port 8080); the fix is always on the server, never in the browser or client code; if Postman works but the Angular app does not, CORS is the cause; interviewers ask where the fix lives
- Query parameters for filtering and pagination — `GET /api/entries?month=2025-05&status=SUBMITTED`; query params carry optional filtering; the backend reads them with `@RequestParam`, the frontend sends them with `HttpParams`; never use a request body on `GET` requests
- A search too complex for query parameters — a filter with ten optional fields and nested conditions does not fit in a URL, so `POST /entries/search` is the accepted compromise; interviewers ask how you square that with "POST creates things" and want you to name it as a deliberate trade, not an accident
- Sub-resource URL vs flat collection with a filter — `GET /api/projects/{id}/entries` says the child only exists inside the parent; `GET /api/entries?projectId=5` says it is a flat collection you happen to filter; interviewers ask which you chose because it exposes whether you designed the URL space or just grew it one endpoint at a time
- Offset pagination vs cursor/keyset — offset makes the database count and discard every skipped row, and rows shifting under the user cause duplicates and gaps between pages; interviewers ask what breaks on page 900 of a live table
- The pagination response envelope (`content`, `page`, `size`, `totalElements`) — a bare JSON array has nowhere to carry the metadata, which is why the wrapper exists and why adding it later is a breaking change; interviewers ask what your list endpoint returns
- Bulk operations — a user submitting thirty entries in one request versus thirty requests, and what status code partial success gets (there is no clean one, which is the point); interviewers ask how you would design it and are testing whether you notice the problem
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

## REST — status codes and the error contract

- HTTP status codes — `200 OK` (success with body), `201 Created` (POST that creates a resource), `204 No Content` (DELETE with no body), `400 Bad Request` (invalid client data), `404 Not Found` (wrong ID); sending the wrong code misleads clients and tools
- `401 Unauthorized` vs `403 Forbidden` — 401 means no valid credentials (who are you?); 403 means valid credentials but insufficient permissions (you are not allowed); interviewers ask this because it tests whether the candidate understands authentication vs authorisation
- `400` vs `422 Unprocessable Entity` — 400 is a malformed request the server could not parse or bind, 422 is a well-formed request that breaks a business rule; interviewers ask for a case where 400 is the wrong code and want "the JSON was fine, the dates were backwards"
- `409 Conflict` — the code for a clash with current state: submitting an already-approved entry, or creating a duplicate the unique constraint rejects; juniors return 400 for everything, and interviewers notice
- `200 OK` carrying an error object in the body — forces every client to parse the payload to discover whether the call worked, defeating the entire status-code system; reviewers show it and expect the objection
- One error response shape across the whole API — a consistent body (RFC 7807 problem detail: `type`, `title`, `status`, `detail`, `instance`, or your own equivalent) so the frontend writes one error handler rather than three; interviewers ask what your API returns on failure
- One global translation point rather than try/catch per controller — the exception-to-status mapping lives in a single advice class, which is what keeps the contract consistent as endpoints multiply; interviewers ask where a `ProjectNotFoundException` becomes a 404
- What an unhandled exception leaks by default — the framework's default error page returns stack traces and internal class names to the client, which is a security finding and not merely untidy; interviewers ask what the user sees when something you did not anticipate goes wrong
- A correlation id on every request and error response — the field that lets support find one user's failure among a day of logs; interviewers ask how you would investigate "it broke at 14:32" and expect this rather than a timestamp search

## API evolution and compatibility

- Who your consumer is — an Angular app you deploy yourself versus another team's service you do not control; the answer decides whether changing a field is a five-minute edit or a coordinated release, and interviewers ask it before any versioning discussion
- Why the frontend and the backend are never live at the same instant — during a rollout the old client is still calling the new API, so every change must stay compatible with the previous client for at least one release; interviewers ask "you deployed the API first — what does the old Angular bundle see?"
- Expand and contract (parallel change) — add the new field, migrate every consumer, then remove the old one in a later release; the standard way to make a breaking change without breaking anyone, and the answer interviewers want instead of "I'd just rename it"
- Tolerant reader — a client should ignore JSON fields it does not recognise rather than fail on them; interviewers ask what happens to your Angular app when the backend adds a field, and "nothing" is only true if the client is tolerant
- URL versioning (`/api/v1/...`) vs header versioning — the URL is visible, cacheable, and trivially testable in a browser, the header is cleaner but invisible to everyone debugging; interviewers ask which you would pick and, more pointedly, whether you versioned at all and why not
- Additive vs breaking changes — adding an optional field is safe, adding a required request field is not, and adding an enum value breaks any client that switches exhaustively on it; interviewers ask for three of each and the enum case is the one juniors miss
- The OpenAPI document as the published contract — generated from your code or written first and implemented against; either way it is what the consuming team actually reads; interviewers ask how the frontend learns your API without asking you

## Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly; the backend controls what data is exposed and who can access it
- Controller → Service → Repository — what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Service layer — the class (`@Service`) that holds business rules, validation beyond bean validation, and orchestration between repositories; interviewers ask "why not put this logic in the controller?" — because the controller would then be impossible to reuse from another entry point (a scheduled job, a CLI command) and impossible to unit test without starting the whole web layer
- Repository pattern — an interface (`JpaRepository<Entity, Id>`) that hides how data is actually fetched from the database behind method calls like `findByEmail()`; interviewers ask "what does the repository pattern give you?" — the service does not know or care if the data comes from PostgreSQL, an in-memory list, or a different ORM; this is what makes the service testable with a mock repository
- Why business logic belongs in the service — the controller must not decide; the repository must not know the rules; the service is the only place
- Why the controller must not call the repository directly — bypasses the business rules layer; makes the code impossible to test in isolation
- MVC — Model (data + business logic), View (what the user sees), Controller (receives input, coordinates the other two); interviewers ask "do you know MVC?" expecting you to map it onto your own stack, not recite the textbook triangle
- MVC vs Layered Architecture — MVC is for apps that render HTML (controller returns a View); Layered Architecture is for REST APIs (controller returns JSON, the View is a separate SPA); layered architecture is really MVC with the Model split into Service (business logic) and Repository (data access) because one combined Model layer gets too large for a real application
- State machine pattern — a workflow where status transitions follow fixed rules (DRAFT → SUBMITTED → APPROVED/REJECTED); the service enforces which transitions are valid
- Dependencies point downward only — the controller may call the service and the service the repository, never the reverse; an entity or repository that references a service is an inverted dependency, and interviewers show a class diagram and ask what is wrong with it
- Change amplification as a design smell — when adding one field forces an edit in the controller, the DTO, the mapper, the service, the entity and the test, the layers have become pass-through boilerplate; interviewers ask when layering earns its cost and when it is ceremony

## Structure smells and refactoring boundaries

- The anaemic domain model — entities reduced to getters and setters with every rule in the service; it is the normal Spring style rather than an automatic defect, and the useful answer names where it stops working (rules duplicated across services because no object owns them); interviewers ask whether it is a smell and want a position, not a verdict
- Where the entity↔DTO mapper lives, and hand-written vs generated — a mapper in the service keeps the controller clean, and MapStruct removes boilerplate at the cost of a generated layer nobody can step through; interviewers ask which you used and why
- A circular dependency between two services — Spring fails at startup, and the three ways out are extracting the shared logic into a third service, inverting one direction with an event, or admitting the two were one concept; interviewers ask how you would break the cycle rather than how you would silence it
- Splitting a service that has grown past comprehension — you split on cohesion, by use case or by aggregate, never on line count; interviewers ask "your service is 900 lines, what now?" and "I'd split it in half" is a failing answer
- A `utils` / `helpers` / `common` package as a design smell — it is where logic lands when nobody decided which layer owns it, and it grows forever because nothing is ever obviously out of scope; interviewers ask what its existence tells them about the codebase

## Where a responsibility belongs

- Why the service must not know about HTTP — a service that returns `ResponseEntity` or a status code can no longer be called from a scheduled job, another service, or a test without inventing a fake request; interviewers ask "could you call this method without a web request?"
- A domain exception as the contract between the service and the controller — the service throws `ProjectNotFoundException` and stays ignorant of 404; the translation to a status code happens at the edge, which is what lets one rule serve every entry point
- Swallowing an exception and returning success — a `catch` that logs and lets the method return `200 OK` leaves the caller unable to tell success from silent failure; the most common junior bug and a favourite pressure question
- Where a validation rule belongs when three layers could host it — bean validation on the request DTO checks shape, the service checks rules that need the database or another entity, a database constraint is the last line; juniors scatter the same rule across all three and the copies drift apart
- Where a cross-cutting backend concern belongs — request logging or an auth check goes in a filter or an interceptor, never copied into every controller method; interviewers ask where you would add logging to every endpoint and expect one insertion point, not thirty edits
- Where the authorisation check is enforced — on the server, always; a route guard and a hidden button improve the interface but the endpoint is still reachable with curl, so the frontend is never the boundary; interviewers ask whether your guard is security and the answer is no
- Constructor injection as an architectural argument, not a Spring preference — the constructor makes every dependency visible and impossible to ignore, so a class with eight of them announces that it does too much, and the class stays instantiable in a plain unit test without a container; interviewers ask why not field injection and "Spring recommends it" is the weak half of the answer
- `UserService` + `UserServiceImpl` — the interface-plus-implementation convention that fills legacy Spring codebases; interviewers ask whether the interface is genuine abstraction or ritual, and the honest answer (one implementation, Spring proxies fine without it) scores higher than repeating the habit

## System shape and structure

- Package by layer vs package by feature — `controller/ service/ repository/` at the top level versus `project/ user/ timeentry/` each holding their own layers; interviewers ask how you would structure the project at 40 entities, and knowing both is what lets you navigate a legacy codebase and defend a new one
- Monolith vs microservices — one deployable versus many independently deployed services; what a split actually buys (independent deploy and scaling) against what it costs (network calls, distributed transactions, ops); "microservices are more modern" is a failing answer and interviewers ask this of juniors specifically to hear the tradeoff
- The modular monolith as the honest middle ground — one deployable with enforced internal module boundaries, which buys most of the organisational benefit without the distributed-systems bill; interviewers ask "how would you scale this?" and this is the answer that shows judgement rather than fashion
- Where your own app would split, and what breaks at the seam — naming the boundary (users and identity versus time tracking and reporting) and what stops working across it: no more SQL joins, no more single transaction, a network call that can half-fail; interviewers ask you to do this to your own project
- Synchronous REST vs asynchronous messaging between services — a REST call couples the caller to the callee's availability, messaging decouples them at the cost of eventual consistency and much harder debugging; interviewers want the tradeoff named, not a preference
- Layered vs hexagonal (ports and adapters) — hexagonal puts the domain in the centre and pushes the database and HTTP out to interchangeable adapters; consultancy interviewers drop the word to see whether you can say what it means and why layered was enough for your project
- Why the Angular app and the Spring Boot API are separate deployables — the frontend is a folder of static files on nginx or a CDN, the backend is a running JVM process; interviewers ask whether CORS still exists in production, and the answer depends entirely on this choice
- One repository with `backend/` and `frontend/` versus two repositories — how the project gets cloned, built, versioned and reviewed in one pass; interviewers ask because the answer reveals whether you thought past your own machine
- The architecture that looks right and is wrong for the size — four layers, an interface per service, and a mapper for a CRUD screen is a real cost with no return at this scale; interviewers deliberately provoke with "this is over-engineered for a timesheet app" and are testing whether you can defend the layer count *or* concede it

## DTO pattern

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- DTO vs entity as the pair — an entity is a persistence object with an identity, a lifecycle managed by the ORM and a mapping to a table, while a DTO is a plain data carrier shaped by the API contract and owned by nobody else; interviewers ask you to state the difference in one sentence before they ask why you use both
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- One DTO per use case vs one shared DTO — a DTO reused by create, update and read drifts into a bag of nullable fields serving three endpoints badly; interviewers ask why the create payload and the response are separate classes
- A response DTO that mirrors every entity field — the DTO exists but insulates nothing; recognising a "DTO in name only" is what separates having read about the pattern from having applied it
- A lazy association reaching the serializer — if the entity escapes to the JSON layer, the serializer walks the relation after the transaction has closed and you get either a failure or an accidental extra query per row; this is the concrete cost of skipping the DTO, and interviewers ask what actually goes wrong rather than accepting "it is bad practice"
- How deep the response graph goes — nesting a child DTO versus returning just its id and letting the client fetch it; nesting saves a round trip and risks shipping half the database in one response; interviewers ask where you stopped and why
- Why a response DTO should be immutable — nothing downstream of the mapping should be able to alter what the client receives; interviewers ask what a Java `record` buys you over a mutable class here


## Data access decisions

- N+1 problem — when JPA loads a list of entities and fires one extra query per entity to load a related field; causes serious performance problems silently; fix with `JOIN FETCH` or `@EntityGraph`
- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- What soft delete costs — every query must now remember the filter, unique constraints still see the deleted rows, and the table only grows; interviewers ask for the downside because a candidate who names only the benefits has not used it
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- `@Transactional` as a design decision — when a service method writes to two tables, both operations must succeed or both must roll back
- Sequence-generated id vs UUID as the primary key — a sequence is compact and index-friendly but leaks how many rows exist and collides when two databases merge; a UUID is globally unique and larger; interviewers ask which you chose and expect a reason, not a default
- Enum column vs lookup table for a status — an enum is type-safe and readable but a new status needs a redeploy; a table makes the set of statuses data the business can change; interviewers ask what happens when the client invents a sixth status
- Audit columns on every table (`createdAt`, `updatedAt`, who changed it) — real systems need to answer "when did this row change and who did it", and interviewers ask because a schema without them signals someone who has never supported a system in production
- Storing every timestamp in UTC and converting at the edge — the database holds one canonical instant and the client renders local time; interviewers probe this hard on any time-tracking or booking domain, where a user in the Canaries and one in Madrid must see the same entry differently
- `BigDecimal` rather than `double` for money and decimal hours — binary floating point cannot represent 0.1 exactly, so totals drift by cents and a sum of hours stops matching what the user typed; interviewers use it as a precision-awareness check on exactly this domain

## Schema design and evolution

- Defending a schema field by field — every foreign key, every nullable column and every unique constraint is a decision, and interviewers put your diagram on screen and ask why each one is the way it is; a column that is nullable "just in case" is the one they pick
- Normalisation to third normal form as the default, and where you would break it — denormalisation is only defensible with a stated read pattern behind it (a reporting screen that would otherwise join five tables per row); interviewers ask for one place you would denormalise and why
- `@ManyToMany` versus an explicit join entity — the plain many-to-many works only while the link carries no data of its own, and the moment it needs a role, a start date, or an amount, it must become an entity; interviewers ask what happens when the client wants to know *when* a user joined a project
- Which columns get an index and what an index costs — an index makes reads faster and every write slower, and the reflex "add an index" without naming the query it serves is what interviewers are listening for
- Database constraints as the last line of defence — the service validates, but two concurrent requests can both pass validation and only a unique constraint stops both from being written; interviewers ask why you need the constraint if the service already checks
- Versioned migrations (Flyway or Liquibase) versus `ddl-auto: update` — migrations are reviewable, ordered, and reproducible on every environment, while `update` silently guesses and never drops anything; `ddl-auto: update` in production is a red flag interviewers actively look for
- Zero-downtime schema change — the migration ships first and stays backward compatible with the running version, then the code follows; it is expand-and-contract applied to the database, and interviewers ask for the order of operations

## Transactions and consistency boundaries

- The transaction boundary belongs on the service method — that is the unit of business work, whereas the repository call is one step inside it and the controller is too late; interviewers ask where `@Transactional` goes and want the reasoning about the unit of work, not the annotation's location
- `@Transactional(readOnly = true)` on query paths — tells the ORM it need not track changes and lets the database route or optimise the read; interviewers ask what it buys and a candidate who has never set it usually has not thought about read paths at all
- A side effect inside a transaction that cannot be rolled back — an email sent or a payment charged before a later failure rolls the database back leaves the two permanently disagreeing; the work belongs after commit; interviewers ask what happens when the method throws after the email goes out
- A transaction that spans a call to another system — you hold a database connection and its locks for the whole network round trip, so one slow third party degrades everything; interviewers ask what is wrong with the design rather than with the code
- Optimistic locking versus pessimistic — a version column lets both managers load the entry and fails the second write with a clear conflict, while a lock makes the second wait; interviewers give you two people approving the same timesheet and ask what each one sees
- Isolation-level awareness — enough to name your database's default (read committed for PostgreSQL), what a dirty read and a non-repeatable read are, and why you did not simply turn isolation to the maximum; interviewers rarely go deeper than this with a junior but do expect the vocabulary

## Statelessness, idempotency and scaling

> Auth *design* — JWT vs sessions, access vs refresh tokens, where the token is stored, and why a JWT cannot be revoked — is owned by the **Security** topic and deliberately not repeated here. What stays below is the system-shape consequence of choosing a stateless scheme.

- Why stateless auth matters for APIs consumed by Angular — no shared session state; the API can run on multiple servers without sticky sessions
- What breaks when you run two instances behind a load balancer — anything held in memory (a cache, a counter, a rate limiter), scheduled jobs that now fire twice, files written to the local disk, and any assumption of sticky sessions; interviewers ask this to find out whether "stateless" was a word you repeated or a property you understood
- Making a POST idempotent — a client that times out and retries must not create two timesheets, and the answers are an idempotency key the server remembers or a natural unique constraint that rejects the duplicate; interviewers ask what happens when the user double-clicks submit
- What to cache and how to invalidate it — caching the project list is cheap and safe, caching an approval status serves stale data to the person who just changed it; the invalidation strategy is the hard half and interviewers ask for it specifically
- HTTP caching (`ETag`, `Cache-Control`) — the caching layer you already have before adding any infrastructure, letting the client skip a download when nothing changed; interviewers ask who benefits and the answer includes the server, not just the browser
- Vertical versus horizontal scaling — you add instances of a stateless API easily and the relational database is the part that does not follow for free, which is why it is the first bottleneck; interviewers ask which part of your system scales worst
- Where rate limiting belongs — at the gateway or a filter in front of the application, not inside the service, because it is a cross-cutting concern about traffic rather than a business rule; a junior is not asked to build it but is expected to know it exists and where it goes

## Angular patterns

> The mechanics of smart/dumb components, the coordinator pattern, module boundaries and the HTTP interceptor live in the **Angular** topic. What stays here is only the part an architecture interview asks about: who owns the contract between the two sides.

- Two sibling features needing the same data — fetch twice, lift the state to a common parent, or cache it in a shared service; each choice trades a round trip against a staleness risk; interviewers ask what happens when one of the two updates it
- Who owns the TypeScript interfaces that mirror the backend DTOs — hand-maintained or generated from the OpenAPI document, and what breaks the day the API renames a field; interviewers ask because the answer reveals whether the two sides of your project were designed together
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

## Deployment topology and operations

- The production topology drawn end to end — browser, then a CDN or nginx serving the Angular bundle, then the API, then the database; where TLS terminates and why the database is never publicly reachable; interviewers hand you a whiteboard and ask for exactly this
- What `docker-compose up` actually starts in your project and what changes for production — one command bringing up the API and PostgreSQL on a shared network is the developer story, while production replaces the database with a managed one and the compose file with an orchestrator; `_shared-context.md` records that in 2026 being unable to explain this reads as behind
- Configuration comes from the environment, not from a file baked into the artifact — the same image is promoted from dev to production and only the injected variables change, which is also why a hardcoded secret is an architectural defect and not just a security one; interviewers name hardcoded secrets as a probe for AI-generated code
- The CI pipeline as an architectural boundary — build, test, package, image, deploy, in that order, with the test stage as the gate that stops a broken merge; interviewers ask what runs when you open a pull request
- Cloud awareness at recognition level — where this would run on Azure or AWS, and what a managed database and a container registry remove from your job; roughly 3 in 8 target postings name public cloud, and a junior is expected to recognise the shape rather than operate it
- Health and readiness endpoints and who consumes them — the load balancer and the orchestrator, deciding whether to send traffic and whether to restart the container; interviewers ask how the platform knows your app is alive

## Non-functional requirements and observability

- What a non-functional requirement is, with numbers attached — "fast" is not a requirement while "the month view returns in under 500 ms for 2,000 entries" is; interviewers ask you to name three for your own app and vagueness is the failure mode
- Logs versus metrics versus traces — logs are individual events, metrics are aggregated numbers over time, and traces follow one request across components; interviewers ask what you would reach for to answer "is the API slow right now?" versus "why did this one request fail?"
- What must never appear in a log — tokens, passwords, full request bodies containing personal data; interviewers treat logging a JWT as the same class of error as committing one
- How you find out an endpoint is slow and where you look first — the database query, an N+1, and payload size, in that order, before anything more exotic; interviewers ask for your first move and a candidate who starts by adding caching has skipped the diagnosis

## Technical debt and refactoring

- Technical debt defined honestly — a deliberate shortcut taken with the cost understood, which is different from a mistake; naming one you took in your own project and why is a maturity signal rather than a confession, and interviewers ask for it precisely to see whether you can
- The boy-scout rule versus a rewrite — given two days you improve what you touch on the way past, because a rewrite trades a working system with known bugs for a new one with unknown ones; interviewers pose the two-day scenario and watch which instinct comes first
- Refactoring safely when there are no tests — the first step is a characterisation test that pins the current behaviour, not the edit; interviewers ask how you dare change code nobody has tested
- The strangler fig — replacing a legacy module route by route while both run, rather than a big-bang cutover; interviewers ask how you would modernise a system you cannot switch off

## Working in a codebase you did not write

- Identifying a class's layer from its annotation — `@RestController`, `@Service`, `@Repository`, `@Entity` and `@Configuration` each pin a class to exactly one layer; interviewers open an unfamiliar class and ask what it is and what it is allowed to call
- Identifying a class's layer from its name suffix — `...Controller`, `...ServiceImpl`, `...Repository`, `...Mapper`, `...Config`, `...Exception`; naming convention is the fastest navigation tool in a codebase with no documentation, which is every consultancy codebase
- Following a request end to end from a URL — find the mapped path, then the service method it calls, then the repository query underneath; this is the literal first task a junior is given on day one and interviewers simulate it
- Blast radius before editing — a service method called from four controllers is not a local change, and finding its callers comes before changing its signature; interviewers ask what you check before you touch a shared method
- The ripple of adding one field — how many artifacts a single new column touches before it reaches the client; interviewers give exactly this task and count how many of them you forget
- Reading the existing tests as the specification — in an undocumented codebase the test suite is the closest thing to a statement of intended behaviour, and a test that fails after your change is telling you what you broke
- The composite code-review drill — given one unfamiliar, usually AI-generated service, naming every architectural defect at once: an entity returned from the endpoint, `@Transactional` on the wrong layer, the repository called from the controller, an exception swallowed; the 2026 stage-4 interview shows the snippet and counts how many you find, so practising them individually is not enough
- Disagreeing with the architecture on the team you are assigned to — you raise it once with a concrete cost, then follow the team's convention; interviewers ask because a consultancy places you on someone else's codebase and the wrong answer is rewriting it

## Justifying architectural choices

- The "what + why + result" formula — every architecture decision must be explainable as: what you chose, why you chose it, and what problem it avoids or enables; answers like "I used coordinator because the page is big" do not pass a technical interview
- Comparing real alternatives — an architecture decision only exists when there was a real alternative; interviewers ask "why not the simpler option?" and expect a specific tradeoff, not a general preference
- Three rehearsed decisions with the alternative you rejected for each — this is the literal script of stage 4, and it is the one preparation that cannot be improvised in the room; interviewers ask for exactly this and a candidate hunting for an example has already lost the point
- Anchoring decisions to your own projects — in 2026 interviewers expect you to refer to code you actually wrote; "in project 05 I used coordinator because three siblings shared the same task list and lifting state to a parent avoided prop drilling" is a passing answer; a textbook definition is not
- "What would you do differently if you rebuilt it today?" — the self-critique question, where having no answer reads as having done no reflection and a long list reads as having no conviction; interviewers ask it of every candidate
- "Which part of your design breaks first at a hundred times the load?" — a pressure question testing whether you know your own bottleneck, and the honest answer usually names the database or an unpaginated query
- Coupling and cohesion — the two words that explain why a change in one place broke three others (coupling) and why a class that does one thing is easier to change (cohesion); interviewers expect this vocabulary when you criticise a design, not "it was messy"
- Where architecture happens in a sprint — a user story becomes a design decision during refinement and planning, and technical work that has no story gets one; roughly 6 in 8 postings name Scrum or Kanban, so interviewers ask how a requirement reached your architecture rather than assuming it appeared
- Estimating a small feature and saying what the estimate includes — "export the month to CSV" is not just the endpoint, it is the tests, the migration if any, the review, and the deploy; interviewers ask because consultancy delivery runs on estimates and juniors quote only the coding
- Recognising a pattern in code you did not write — naming the structure from its shape (a coordinator, a repository, a state machine) and stating its tradeoff on the spot; the 2026 stage-4 interview now shows an unfamiliar, often AI-generated snippet and asks what the structure is doing, not what the syntax means

## Testing strategy

> The vocabulary — unit vs integration, the test pyramid, mock vs stub, and what an assertion-free test proves — is owned by the **General** topic. What stays here is the design judgement: what you would cover, what mocking costs you, and what a painful test says about the code.

- Unit test vs integration test — unit tests one method in isolation (fast, no context); integration test loads the full stack (slow, catches wiring issues)
- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- Spy vs mock — a spy wraps a real object and lets every unstubbed call reach the real method; interviewers ask when you would ever want the real code to run inside a test double
- Deciding what to mock and what to keep real — mocking everything produces a suite that only exercises the mocks while the query, the transaction and the mapping go untested; interviewers ask what your service test would still catch if the SQL underneath were wrong
- Why you do not test a private method directly — it is reached through the public method that uses it, and wanting to test it alone is the signal that it should be its own class

## Testing strategy — cost, environment and signals

- What the web-layer test actually covers — serialization, validation, status codes and the security chain, which is exactly what a service test cannot see; the tradeoff is that loading a slice is slower than a plain unit test and loading the whole context is slower again; interviewers ask what each level buys
- The test database decision — an in-memory database is fast and accepts SQL the real one rejects, a real containerised database is slow and honest; interviewers ask whether your tests run against the same engine as production and a green suite on the wrong engine proves less than it appears
- Coverage percentage as a target — coverage measures lines executed, not behaviour verified, so a suite can report 90% and assert almost nothing; interviewers ask what number you aim for and the good answer redirects to what is covered rather than how much
- A flaky test — caused by shared state, real time, or ordering between specs; you fix the cause or delete the test, and retrying it in CI is the option that quietly destroys trust in the whole suite; interviewers ask what you do with one
- Testability as a design signal — "this class is hard to test" almost always means it does too much or constructs its own dependencies, so the difficulty is information about the design rather than about testing; interviewers ask what a painful test is telling you
- Whether you write tests first — a position either way is fine and defensible, having no position is not; interviewers ask about TDD mainly to see whether testing is a habit or an afterthought

## SOLID

- Single Responsibility — a class should have one reason to change, which is why the controller changes when the API contract moves, the service when a business rule moves, and the repository when the query moves; interviewers ask you to name the reason each of your classes would change, and a class with two answers is the one they are hunting
- Open/Closed — you should be able to add behaviour without editing what already works; the canonical violation is a `switch` on status that must be reopened for every new status, and the fix is polymorphism or a strategy per case; interviewers hand you exactly that switch and ask what happens when the client invents a sixth status
- Liskov Substitution — a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation — a client should not be forced to depend on methods it never calls, which is why `UserDetailsService` has one method rather than fifteen; interviewers ask what goes wrong with a fat interface and the answer is that every implementer pays for every method
- Dependency Inversion — high-level code should depend on an abstraction rather than a concrete class, which is the whole basis of Spring's container and Angular's `inject()`; interviewers ask which principle dependency injection is an application of
- Composition over inheritance — inheritance couples you to a parent's whole shape forever, while composition lets you assemble behaviour and swap a piece; interviewers ask where you used inheritance in your project and whether you should have
- The Law of Demeter — `a.getB().getC().getD()` binds you to the internals of three classes, so any of them can break you; interviewers show a train wreck and ask why it is a problem beyond looking ugly
- DRY taken too far — duplication is cheaper than the wrong abstraction, because a shared class serving two things that only looked alike ends up with flags and branches for both; interviewers ask when you would deliberately leave duplicated code
- YAGNI and over-engineering — being able to name something you deliberately did *not* build is a stronger signal than the list of patterns you applied; interviewers ask what you left out
