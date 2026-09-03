# Junior Coverage — Architecture

Framework-neutral boundaries and design decisions a junior at a Spanish consultancy must understand,
apply in a small codebase, and defend with concrete trade-offs.

## Architecture fundamentals

- Software architecture vs design vs implementation — architecture sets system-wide boundaries and
  dependency constraints, design patterns solve narrower recurring problems, and implementation is the
  concrete code that realises those decisions
- Layer vs tier — a layer is a logical separation of responsibility inside the code, while a tier is
  a separately deployed or executed part of the system; three layers can still run in one backend tier ✅ 07-timetrack
- Logical module vs deployed service — a module groups a cohesive responsibility inside an application,
  while a separately deployed service adds a network and operational boundary
- Architectural drivers and quality attributes — connect a structural choice to requirements such as
  maintainability, testability, security, performance, availability, and scalability and name the
  trade-off rather than claiming one design maximises every quality

## API and resource boundaries

- REST architectural style — keep client and server responsibilities separate, make requests stateless,
  and expose a uniform resource interface so calls do not depend on hidden conversational state ✅ 07-timetrack
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action ✅ 07-timetrack
- Resource modelling — paths identify resources and relationships, while HTTP methods express the operation ✅ 07-timetrack
- A name must not imply a guarantee the query does not enforce — an endpoint or field named after a
  narrower concept than what it actually returns (e.g. `by-employee` on a query that groups by user
  with no role filter) reads as correct until someone relies on the implied filter; rename to what the
  data actually is, or add the filter, but never leave the two disagreeing ✅ 07-timetrack
- Endpoints deriving totals from the same rows must apply identical filter criteria — when a headline
  summary and its detail tables are computed independently, a summary built on a looser filter than its
  breakdown produces a total that cannot equal the sum of the rows the client is shown ✅ 07-timetrack
- The serialised shape of a value belongs to the response contract — two endpoints returning the same
  quantity in different decimal scales, date formats or units present one figure as two, and a client
  cannot tell a formatting difference from a disagreement about the data; fix the shape in one place
  every endpoint reads from, because a rule restated per endpoint drifts the first time one is edited ✅ 07-timetrack — the scale rule lives only in the three report queries; `ReportService.getSummary` no longer re-applies `setScale(2)`, so `summary`, `by-project` and `by-user` cannot disagree on shape
- Identifier canonicalisation — user-supplied identifiers arrive in arbitrary case and surrounding
  whitespace, so the boundary must reduce them to one canonical form and then use that same value both
  for the uniqueness comparison and for what is persisted; comparing one form while storing another lets
  a single logical identity become two rows, and no later lookup can tell which one is the real account ✅ 07-timetrack — `EmailNormalizer.normalize` runs before `existsByEmail` and before the setter in `UserService.create`/`update`, `UserDetailsServiceImpl` and `DataInitializer`, while `ProjectService` trims the name and asks `existsByNameIgnoreCase`
- A documented response contract lists every status the endpoint can produce, and a constraint on a
  field belongs to every operation that writes that field, not only to the one that introduces it — a
  create documenting its uniqueness conflict while the update writing the same unique field documents
  only success and absence leaves the client with no branch for a refusal the server really returns,
  and the gap survives manual testing because such a guard normally exempts a resource compared
  against itself, so the conflict only appears when two distinct resources collide ✅ 07-timetrack — `ProjectService.update` runs `create`'s `existsByNameIgnoreCase` guard, exempting only the project's own name

- Guard precedence — a refusal check on the loaded resource's own state (it exists, it belongs to the
  caller, it is in the status the transition requires) is evaluated before any check that depends on the
  request body, because a resource guard returns the same verdict whatever the body contains while a
  body check does not; ordered the other way, the status code a refusal produces depends on what the
  client happened to send, so the refusal an endpoint documents is only sometimes the one it returns,
  and a caller corrects the wrong thing and retries ✅ 07-timetrack — `TimeEntryService.update` evaluates the DRAFT guard immediately after `findOwnedEntry` and before `resolveProject`, so a non-DRAFT entry answers 409 whatever `projectId` the body carries, the order `submit`, `reopen` and `delete` already used
## Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; the client
  reaches the backend through an explicit network API boundary, commonly HTTP, and never queries the
  database directly ✅ 07-timetrack
- Controller → Service → Repository — controllers translate HTTP, services apply and orchestrate
  business rules, and repositories encapsulate persistence access ✅ 07-timetrack
- Service layer — the application boundary that holds business rules, validation beyond structural
  input checks, and orchestration between persistence ports so another entry point can reuse the policy and tests can
  exercise it without the web layer ✅ 07-timetrack
- Repository pattern — places data-access operations behind a contract so application logic does
  not contain queries directly; a repository abstraction still carries persistence semantics and is not a
  promise that every storage technology is interchangeable ✅ 07-timetrack
- Business-rule placement — keep application rules outside delivery and persistence code so another
  entry point can reuse them and focused tests do not require the web or database layer ✅ 07-timetrack
- Why the controller should not call the repository directly — it bypasses application policy, mixes
  HTTP and persistence responsibilities, and makes changes and focused tests more brittle ✅ 07-timetrack
- MVC — separates input coordination, presentation, and application/domain state; it is not limited
  to server-rendered HTML and is a different design axis from controller/service/repository layering
- MVC vs layered architecture — MVC organises interaction and presentation responsibilities, while
  layers organise dependency direction; a system can use both without one being a subtype of the other
- Layered dependency direction — higher-level policy should not depend directly on delivery or
  persistence details; dependencies crossing a boundary point through an appropriate contract ✅ 07-timetrack

## DTO pattern

- Why not expose persistence entities directly — a JPA entity is coupled to persistence concerns;
  exposing it couples the API shape to the database mapping and can disclose fields unintentionally ✅ 07-timetrack
- Request DTO — represent and structurally validate untrusted input without confusing transport
  validation with business invariants ✅ 07-timetrack
- Response DTO — shape a stable outward representation and minimise field disclosure independently of
  the internal persistence or domain model ✅ 07-timetrack
- Relationship identifiers in a response — showing a related entity by display label alone forces the
  client to re-derive its key before the next write, and that lookup is only correct while the label
  happens to be unique; carry the identifier beside the label and read minimal disclosure as a rule
  about sensitive fields, not about keys the caller must send back ✅ 07-timetrack — `TimeEntryService.toResponse` sets `projectId` and `userId` beside `projectName`/`userName`, so an entry from `GET /api/entries` is sent straight back to `PUT /api/entries/{id}` without a name lookup against the projects list
- Framework types are not response contracts — a library's implementation class serialised by reflection
  makes the payload shape an internal detail of a dependency; wrap it in a DTO you own so an upgrade
  cannot silently change the API ✅ 07-timetrack
- Mapping placement — translate transport DTOs at the application/API boundary and persistence models
  at the persistence boundary; avoid making controllers own business rules or exposing entities as contracts ✅ 07-timetrack
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- Create vs Update request DTOs — separate them when the operations have different validation,
  optionality, or evolution pressure; a shared shape is acceptable while their contracts genuinely match ✅ 07-timetrack
- Nullable field in a request versus in a response — in a partial-update request an absent value legitimately means "leave this one alone", so the field must be able to hold nothing; in a response the same shape advertises a state the model can never be in, so a value the domain always has is declared as one that cannot be absent ✅ 07-timetrack — `ProjectResponse.active` is primitive while `UpdateProjectRequest.active` stays nullable, so an omitted field and `false` never collapse
- Backward-compatible API evolution — treat public fields and semantics as consumer contracts and
  prefer additive changes or explicit versioning when a rename, removal, or behaviour change would break clients ✅ 07-timetrack

## Data access decisions

- Soft delete vs hard delete — retain a record when audit, recovery, or historical references justify
  the extra filtering and uniqueness complexity; otherwise permanent deletion may be the simpler contract ✅ 07-timetrack
- Pagination — bound large collection responses when volume can grow, choosing an explicit page or
  cursor contract instead of assuming every list is safely returned at once ✅ 07-timetrack
- Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics ✅ 07-timetrack
- Generated identity — an identifier must come from a source that guarantees uniqueness by
  construction, such as a database sequence, a counter owned by the single writer of the collection, or
  a random identifier wide enough that collisions are negligible; a clock reading is not one, because
  every record created inside the same tick receives the same value, and any later operation that
  locates a record by its identifier then acts on all of them at once ✅ 01-todo-list — `TaskService` owns a private `nextId` counter and stamps each new task with `nextId++`, so `toggleTask` and `deleteTask`, which `map`/`filter` over every match, and the `@for ... track task.id` in `task-list.html` can never resolve to two rows

## Presentation boundaries

- Container / presentational component pattern — a container owns feature integration while focused
  presentation components render inputs and emit user intent without fetching their own remote data ✅ 01-todo-list
- A presentation component's emitted event is a contract, not an echo of the DOM — the raw input
  value is normalised and checked before it crosses the boundary, so the parent and every later
  listener receive a value already fit to use; deferring that check to the consumer makes each new
  listener repeat it, and a template expression cannot hold the guard at all ✅ 02-weather-app — `WeatherForm.submit` trims and rejects a blank city before `cityToSearch.emit`, so `WeatherPage` never receives raw input
- Page coordinator pattern — a page coordinates feature state and delegates focused presentation work to
  children, while shared or independently reusable state may belong in a service rather than in the page ✅ 02-weather-app
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

## Testing strategy

- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- Test doubles as coupling feedback — a unit test that needs many unrelated mocks often signals a class
  with too many responsibilities or hidden boundary dependencies

## Design qualities and boundaries

- Coupling — the number and strength of dependencies between modules; lower coupling limits the
  blast radius of a change
- Cohesion — how strongly a module's responsibilities belong together; high cohesion is the reason
  related business rules stay in one service or feature
- Encapsulation and information hiding — expose the smallest stable module contract callers need and
  keep implementation details private so internal changes do not ripple through the codebase
- Dependency direction — outer delivery and persistence details may depend on application contracts,
  while business rules should not depend on HTTP or database APIs
- Dependency graph and circular dependencies — follow which module depends on which and break a cycle
  by relocating responsibility or introducing a justified boundary, not by hiding it with global access
- Abstraction vs interface — an abstraction defines the stable idea or contract callers depend on,
  while an interface is one language mechanism that can express it and is not valuable by itself
- Dependency injection vs Dependency Inversion — injection supplies a collaborator from outside,
  while the SOLID principle directs high-level policy to depend on abstractions; injection can be used
  without achieving inversion
- Dependency injection vs service locator — explicit constructor or framework injection reveals a
  class's collaborators, while pulling dependencies from a global registry hides them and weakens tests
- Boundary failure ownership — translate infrastructure and domain failures at the boundary that has
  enough context to produce a stable outward error contract without leaking framework exceptions ✅ 07-timetrack
- Package by feature vs package by layer — feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree ✅ 06-hr-portal
- Horizontal layering vs vertical feature slices — layers group code by technical role, while a
  feature slice groups the delivery, application, and persistence pieces that change for one capability
- Composition over inheritance — assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- Composition vs delegation — composition assembles or owns collaborators, while delegation forwards a
  responsibility to one of them; they often work together but describe different relationships
- Over-engineering — an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- Dead code — state, members and generated scaffolding no caller or template reads are deleted rather than
  kept "just in case"; they cost nothing at runtime and mislead every later reader about what the unit
  is responsible for ✅ 05-task-manager — the root `App` declares no members at all: the CLI's `title` signal and the `should render title` spec asserting on an `<h1>` went out with the scaffold template
- DRY and duplicated knowledge — remove repeated business rules that can diverge, without forcing
  superficially similar code with different reasons to change into one abstraction ✅ 05-task-manager
- Extract Method — move a coherent block behind a well-named method when that clarifies intent or
  centralises one repeated rule, not merely to reduce line count ✅ 02-weather-app
- Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect
- Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary
- Modular monolith vs unstructured monolith — one deployment can still enforce feature boundaries and
  dependency direction; a monolith becomes problematic when unrelated responsibilities freely couple

## Business behaviour

- Domain rule vs application orchestration — a domain rule states what is valid in the business,
  while application orchestration coordinates repositories and collaborators to complete a use case ✅ 07-timetrack

## Workflow modelling

- State machine pattern — model a workflow as explicit states and allowed transitions so invalid moves
  such as APPROVED → DRAFT are rejected at one business boundary ✅ 07-timetrack
- Actor-dependent transitions — when a transition is gated on a mutable attribute of the actor such as a
  role, changing that attribute can strand entities in a state no actor is able to leave, so the change
  itself becomes part of the workflow's invariants ✅ 07-timetrack — `UserService.update` refuses a
  promotion to MANAGER while the user still holds DRAFT or REJECTED entries, whose submit and reopen
  transitions are EMPLOYEE-only

## Boundary patterns in maintained code

- Adapter pattern — translate an external or incompatible interface into the contract the application
  expects so vendor details do not spread through business code
- Facade pattern — expose a small use-case-oriented interface over a complicated subsystem without
  turning the facade into a second home for all business logic

## Architecture decisions and review

- Architectural decision record (ADR) — capture the context, chosen option, rejected alternatives, and
  consequences of a material decision so later maintainers know why the constraint exists
- Architecture diagram as a code claim — a small context, container, component, or dependency diagram
  must match real runtime and dependency boundaries rather than presenting aspirational boxes

## SOLID

- Single Responsibility — split a class when unrelated actors or policies make it change for different
  reasons, not simply because it has many lines or methods ✅ 07-timetrack
- Open/Closed — keep stable abstractions open to extension without treating existing code as forbidden
  to change when requirements or a poor abstraction demand it
- Liskov Substitution — a subtype can replace its parent only when it preserves the caller-visible
  contract, including valid inputs, promised outputs, and invariants
- Interface Segregation — give a client the smallest cohesive contract it needs so implementations and
  tests are not forced to depend on unrelated operations
- Dependency Inversion — high-level policy depends on stable abstractions rather than lower-level
  details; dependency injection is a delivery mechanism that may help but does not guarantee this design
