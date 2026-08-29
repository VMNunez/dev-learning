# Architecture Junior Notes Plan

Plan status: current
Coverage: notes/architecture/coverage/junior.md
Coverage SHA-256: 974fd9957643e794ad2ba5a447e894d7ffa8b6ae8375ecfe1745c796a44c91d3
Generated: 2026-08-27

## 00 — Architecture orientation

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/00-architecture-orientation.md
Spanish: notes/architecture/junior/es/00-orientacion-sobre-arquitectura.md

Depends on: none

Pending additions: none

Narrative role: Introduce architecture as the discipline of making and defending system-shaping choices, contrast that concern with Victor's React and TypeScript component/code decisions, establish the journey's boundary-and-trade-off mental model, and locate it in his Angular and Spring Boot work.

Learning outcome: Given a small Angular/Spring system, identify one concrete boundary and name the quality trade-off it creates, and distinguish that system-shaping decision from a React component or TypeScript implementation choice.

Prerequisites: none.

Must answer:

- What practical problem does software architecture solve for a team maintaining an application?
- Which recurring ideas should Victor look for when reading every later chapter?
- How is choosing a system boundary different from choosing React component state or a TypeScript implementation technique, and where can those smaller choices still express an architectural constraint?
- How does architecture connect the Angular frontend, Spring Boot backend, and their API without replacing the framework-specific knowledge that Spring Boot, Angular, SQL and Security notes own?
- Which sections does this introduction itself contain, in which order, and why does each one come where it does before the reader meets it?
- Which concrete things must Victor already understand before opening `01` — what a running process or deployment is, what a module is, what a dependency between two pieces of code means, and what a request to a server is — and what is settled here rather than left to be discovered mid-chapter?
- How does one paragraph name and connect the complete `01` → `19` route—fundamentals, REST, layers, MVC, components, DTOs, field-level contracts, data access, endpoint-contract consistency, design qualities, testability, dependency mechanisms, failure and packaging, composition and refactoring, system shapes, business workflows, Adapter/Facade, decisions/review, and SOLID—and explain why that order is used?

Coverage concepts:

- none

Rationale: The introduction owes orientation rather than coverage scope: it establishes the vocabulary, the comparison with what Victor already knows, and the shape of the route before any boundary is studied in detail.

Handoff: With the discipline and the route framed, file 01 supplies the vocabulary that separates architecture from design and implementation, and logical boundaries from deployed ones.

## 01 — Architecture fundamentals

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/01-architecture-fundamentals.md
Spanish: notes/architecture/junior/es/01-fundamentos-de-arquitectura.md

Depends on: 00

Pending additions: none

Narrative role: Supply the foundational vocabulary needed to distinguish system-wide choices from local code and logical boundaries from deployment boundaries.

Learning outcome: Classify a choice as architecture, design, or implementation; distinguish layers, tiers, modules, and services; and justify a choice through explicit quality-attribute trade-offs.

Prerequisites: 00.

Must answer:

- Which scope and consequences distinguish architecture from design and implementation?
- How can one application contain several logical layers while running in one tier?
- When does a logical module become a separately deployed service, and what new costs appear?
- How do architectural drivers prevent claims that one structure is simply “best”?

Coverage concepts:

- [ ] Software architecture vs design vs implementation — architecture sets system-wide boundaries and
  dependency constraints, design patterns solve narrower recurring problems, and implementation is the
  concrete code that realises those decisions
- [ ] Layer vs tier — a layer is a logical separation of responsibility inside the code, while a tier is
  a separately deployed or executed part of the system; three layers can still run in one backend tier
- [ ] Logical module vs deployed service — a module groups a cohesive responsibility inside an application,
  while a separately deployed service adds a network and operational boundary
- [ ] Architectural drivers and quality attributes — connect a structural choice to requirements such as
  maintainability, testability, security, performance, availability, and scalability and name the
  trade-off rather than claiming one design maximises every quality

Rationale: These concepts form the vocabulary for locating a boundary and evaluating why it exists before studying concrete API and code structures.

Handoff: Once boundary types and drivers are clear, file 02 applies them to the first visible boundary in Victor's stack: the REST API.

## 02 — REST resource contract

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/architecture/junior/en/02-rest-api.md
Spanish: notes/architecture/junior/es/02-api-rest.md

Depends on: 01

Pending additions: none

Narrative role: Apply architectural boundaries to client-server communication by treating URLs, methods, and stateless requests as one uniform resource model that any HTTP client can read.

Learning outcome: Model a small REST API around resources, explain the constraints that make it an architectural style rather than a naming convention, and say what each method and status code commits the server to.

Prerequisites: 01.

Must answer:

- Which constraints make REST a client-server architectural style rather than a URL naming convention?
- Why does the HTTP method carry the action while the path names a resource?
- How do paths express resources and their relationships without becoming verb-heavy commands?
- What does an HTTP status code commit the server to, and which families does a client branch on?
- Which methods are idempotent, and why does that change what a client may safely retry?
- Which existing CORS section belongs in Security rather than this Architecture chapter, and how should the audit replace it with a short cross-topic link instead of re-teaching it?

Coverage concepts:

- [ ] REST architectural style — keep client and server responsibilities separate, make requests stateless,
  and expose a uniform resource interface so calls do not depend on hidden conversational state
- [ ] Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- [ ] Resource modelling — paths identify resources and relationships, while HTTP methods express the operation

Rationale: All three concepts define one thing: the resource model the network boundary presents. The defects that make a set of endpoints disagree with that model are a separate mental model and are owned by file 09, once persistence, DTOs and data-access decisions exist to make them legible.

Handoff: A coherent external API still needs an internal path for policy and persistence; file 03 traces that path through layered architecture.

## 03 — Layered architecture

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/architecture/junior/en/03-layered-architecture.md
Spanish: notes/architecture/junior/es/03-arquitectura-por-capas.md

Depends on: 02

Pending additions: none

Narrative role: Move behind the API boundary and assign HTTP translation, application policy, and persistence access to explicit layers with a controlled dependency direction.

Learning outcome: Trace a request through controller, service, and repository; distinguish a domain rule preview from application orchestration; place policy in the reusable application boundary; and explain why dependencies must not bypass it.

Prerequisites: 02.

Must answer:

- What does the browser/server boundary change about how Angular reaches data?
- What does each controller, service, and repository layer own and exclude?
- Why is the service layer reusable and independently testable when policy stays out of HTTP and persistence code?
- What does a repository contract hide, and which persistence semantics can it still expose?
- What is a persistence port — the contract through which application policy reaches stored data — and why is naming it a port a statement about direction rather than about technology?
- Why does a controller-to-repository shortcut make policy and focused tests brittle?
- In which direction should a dependency crossing a layer boundary point?
- At this point in the route, what is a use case—an actor's goal completed through one application boundary with a meaningful result—and why may it coordinate several collaborators instead of meaning one controller method?
- What is the zero-assumption distinction between a domain rule (what the business permits) and application orchestration (how one use case coordinates collaborators), before file 16 teaches it formally?
- Which existing DTO section must be relocated or removed in favour of file 06, and which existing state-machine section must be relocated or reduced to a forward link to file 16 so this chapter keeps one layered-architecture mental model?

Coverage concepts:

- [ ] Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; the client
  reaches the backend through an explicit network API boundary, commonly HTTP, and never queries the
  database directly
- [ ] Controller → Service → Repository — controllers translate HTTP, services apply and orchestrate
  business rules, and repositories encapsulate persistence access
- [ ] Service layer — the application boundary that holds business rules, validation beyond structural
  input checks, and orchestration between persistence ports so another entry point can reuse the policy and tests can
  exercise it without the web layer
- [ ] Repository pattern — places data-access operations behind a contract so application logic does
  not contain queries directly; a repository abstraction still carries persistence semantics and is not a
  promise that every storage technology is interchangeable
- [ ] Business-rule placement — keep application rules outside delivery and persistence code so another
  entry point can reuse them and focused tests do not require the web or database layer
- [ ] Why the controller should not call the repository directly — it bypasses application policy, mixes
  HTTP and persistence responsibilities, and makes changes and focused tests more brittle
- [ ] Layered dependency direction — higher-level policy should not depend directly on delivery or
  persistence details; dependencies crossing a boundary point through an appropriate contract

Rationale: These concepts define one request path, the responsibility of every layer on it, and the dependency rule that keeps application policy reusable.

Handoff: Layers organise dependency direction; file 04 separates that concern from MVC's model for organising interaction and presentation.

## 04 — MVC and layered architecture

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/architecture/junior/en/04-mvc.md
Spanish: notes/architecture/junior/es/04-mvc.md

Depends on: 03

Pending additions: none

Narrative role: Prevent a common category error by placing MVC and controller/service/repository layering on two compatible but different design axes.

Learning outcome: Explain the responsibilities separated by MVC, contrast them with layered dependency direction, and show how one application can use both.

Prerequisites: 03.

Must answer:

- Which interaction, presentation, and state responsibilities does MVC separate?
- Why is MVC not limited to server-rendered HTML?
- How can MVC and controller/service/repository layering coexist without either being a subtype of the other?

Coverage concepts:

- [ ] MVC — separates input coordination, presentation, and application/domain state; it is not limited
  to server-rendered HTML and is a different design axis from controller/service/repository layering
- [ ] MVC vs layered architecture — MVC organises interaction and presentation responsibilities, while
  layers organise dependency direction; a system can use both without one being a subtype of the other

Rationale: The direct contrast gives Victor one stable mental model for two structures that share words but solve different organisational problems.

Handoff: MVC opens the interaction and presentation axis; file 05 follows that axis into the frontend, where the same separation decides which component owns state and which one only renders it.

## 05 — Component boundaries

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/architecture/junior/en/05-component-patterns.md
Spanish: notes/architecture/junior/es/05-patrones-de-componentes.md

Depends on: 04

Pending additions: none

Narrative role: Carry the interaction axis opened by MVC into the frontend by separating feature coordination and state ownership from focused presentation, while previewing Single Responsibility as distinct reasons to change before file 19 consolidates the principle.

Learning outcome: Split a page into a coordinator and presentational children, place state according to its reuse boundary, and recognise when the coordinator needs extraction.

Prerequisites: 04.

Must answer:

- Which integration work belongs to a container and which rendering work belongs to a presentational component?
- When should a page own feature state, and when should independently reusable state move to a service?
- Which growth signals mean a coordinator should extract a service or become several sub-pages?
- How does “different reasons to change” make the extraction signal more precise than component size, and why is this only an SRP preview before file 19?
- Why must the audit rebuild this legacy chapter around the declared container/coordinator contract rather than append new sections to its project-specific structure?

Coverage concepts:

- [ ] Container / presentational component pattern — a container owns feature integration while focused
  presentation components render inputs and emit user intent without fetching their own remote data
- [ ] Page coordinator pattern — a page coordinates feature state and delegates focused presentation work to
  children, while shared or independently reusable state may belong in a service rather than in the page
- [ ] When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

Rationale: All three concepts answer where a frontend feature's state, integration, rendering, and growing responsibilities should live — the presentation half of the axis MVC named in file 04.

Handoff: Both sides of the network boundary now have owners; file 06 designs the transport contracts that pass between them without exposing persistence models.

## 06 — DTO boundaries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/06-dto-boundaries.md
Spanish: notes/architecture/junior/es/06-limites-con-dto.md

Depends on: 05

Pending additions: none

Narrative role: Protect the API boundary by keeping the transport contract deliberately separate from the persistence and domain representations behind it.

Learning outcome: Design request and response DTOs for a use case, place each mapping at the correct boundary, and evolve the public contract without unintentionally exposing entity changes.

Prerequisites: 05.

Must answer:

- What is a persistence entity — an object whose fields an ORM maps to database columns — and which persistence concerns does that mapping attach to it?
- Which persistence coupling and disclosure risks appear when an entity becomes the API contract?
- Why do request DTO validation and business-invariant validation remain different responsibilities?
- How does a response DTO control outward stability and disclosure?
- At which boundary should each transport or persistence mapping happen?
- Why can an entity field change remain invisible to clients?
- When do create and update operations need different request shapes?
- Which changes are additive, and when is explicit versioning needed?

Coverage concepts:

- [ ] Why not expose persistence entities directly — a JPA entity is coupled to persistence concerns;
  exposing it couples the API shape to the database mapping and can disclose fields unintentionally
- [ ] Request DTO — represent and structurally validate untrusted input without confusing transport
  validation with business invariants
- [ ] Response DTO — shape a stable outward representation and minimise field disclosure independently of
  the internal persistence or domain model
- [ ] Mapping placement — translate transport DTOs at the application/API boundary and persistence models
  at the persistence boundary; avoid making controllers own business rules or exposing entities as contracts
- [ ] What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- [ ] Create vs Update request DTOs — separate them when the operations have different validation,
  optionality, or evolution pressure; a shared shape is acceptable while their contracts genuinely match
- [ ] Backward-compatible API evolution — treat public fields and semantics as consumer contracts and
  prefer additive changes or explicit versioning when a rename, removal, or behaviour change would break clients

Rationale: One mental model runs through all seven: the transport contract is a different object from the model behind it, and stays different across creation, mapping, disclosure, and evolution.

Handoff: Having a DTO does not yet say what each of its fields promises; file 07 decides optionality, serialised shape, ownership, and the keys a client must be able to send back.

## 07 — Field-level contract decisions

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/07-field-level-contract-decisions.md
Spanish: notes/architecture/junior/es/07-decisiones-de-contrato-por-campo.md

Depends on: 06

Pending additions: none

Narrative role: Descend from the shape of a payload to the promise made by each individual field: what it may be absent, which type owns it, how it is serialised, and whether the client can act on it without a second lookup.

Learning outcome: Justify a field's optionality by the direction it travels, keep third-party implementation types out of a payload, carry the identifier a caller must send back, and place a value's serialised shape in one location every endpoint reads from.

Prerequisites: 06.

Must answer:

- Why does a response that names a related entity without carrying its identifier force the client into a lookup that is only accidentally correct?
- Why is a nullable field legitimate in a partial-update request and a defect in the response for the same resource?
- Where should the decimal scale, date format, or unit of a value be decided so two endpoints cannot present one figure as two?
- Why is serialising a library's own implementation class a contract you do not control, and what does a dependency upgrade then change?
- How is minimal disclosure a rule about sensitive fields rather than about the keys a caller has to send back?

Coverage concepts:

- [ ] Relationship identifiers in a response — showing a related entity by display label alone forces the
  client to re-derive its key before the next write, and that lookup is only correct while the label
  happens to be unique; carry the identifier beside the label and read minimal disclosure as a rule
  about sensitive fields, not about keys the caller must send back
- [ ] Framework types are not response contracts — a library's implementation class serialised by reflection
  makes the payload shape an internal detail of a dependency; wrap it in a DTO you own so an upgrade
  cannot silently change the API
- [ ] Nullable field in a request versus in a response — in a partial-update request an absent value legitimately means "leave this one alone", so the field must be able to hold nothing; in a response the same shape advertises a state the model can never be in, so a value the domain always has is declared as one that cannot be absent
- [ ] The serialised shape of a value belongs to the response contract — two endpoints returning the same
  quantity in different decimal scales, date formats or units present one figure as two, and a client
  cannot tell a formatting difference from a disagreement about the data; fix the shape in one place
  every endpoint reads from, because a rule restated per endpoint drifts the first time one is edited

Rationale: Each concept is the same decision at field altitude — what this one value promises the client — which the file-06 model of a DTO as a whole shape cannot settle on its own.

Handoff: Field promises assume there is data behind them; file 08 decides how that data is retained, bounded, and written atomically.

## 08 — Data access decisions

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/08-data-access-decisions.md
Spanish: notes/architecture/junior/es/08-decisiones-de-acceso-a-datos.md

Depends on: 07

Pending additions: none

Narrative role: Show how retention, collection size, and atomic business operations become explicit architectural contracts rather than incidental database behaviour.

Learning outcome: Choose and defend a deletion, pagination, and consistency boundary for a small use case while naming each option's complexity and ownership.

Prerequisites: 07.

Must answer:

- Which audit, recovery, and historical-reference needs justify soft delete despite its filtering and uniqueness costs?
- When should a collection boundary use a page or cursor rather than return every row?
- What does it mean for several writes to succeed or fail as one unit, and which half-finished state would the system be left in without that guarantee?
- How does architecture choose an atomic business boundary without duplicating SQL or Spring transaction mechanics?

Coverage concepts:

- [ ] Soft delete vs hard delete — retain a record when audit, recovery, or historical references justify
  the extra filtering and uniqueness complexity; otherwise permanent deletion may be the simpler contract
- [ ] Pagination — bound large collection responses when volume can grow, choosing an explicit page or
  cursor contract instead of assuming every list is safely returned at once
- [ ] Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics

Rationale: Each decision sets a data-facing boundary whose correct choice depends on business guarantees and explicit operational cost.

Handoff: Resources, contracts, fields and stored rows are now all in view; file 09 uses them to audit whether a whole set of endpoints still tells one consistent story.

## 09 — Endpoint contract consistency

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/09-endpoint-contract-consistency.md
Spanish: notes/architecture/junior/es/09-coherencia-del-contrato-entre-endpoints.md

Depends on: 08

Pending additions: none

Narrative role: Audit an existing set of endpoints for the defects that appear only between them — where every endpoint is individually correct and the contract they jointly present is not.

Learning outcome: Given several endpoints over the same data, detect a name whose implied guarantee the query does not enforce, a total computed on a looser filter than its own breakdown, an identifier compared in one form and stored in another, and a documented status list that omits a refusal the server really returns — then order an endpoint's guards so the refusal it documents is the one it returns.

Prerequisites: 08.

Must answer:

- Why is a misleading endpoint or field name an architectural contract defect even when the query runs correctly?
- Why can a summary figure and the rows beneath it disagree when both queries are individually correct, and where must the shared filter criteria live?
- Which form of a user-supplied identifier does the boundary compare, and which one does it store — and how does one logical identity become two rows when those differ?
- Why does a constraint documented only on the operation that introduced it leave a client with no branch for a refusal the server really returns, and why does manual testing usually miss it?
- Why does checking the request body before checking the loaded resource make the status code of a refusal depend on what the caller happened to send?
- How is the shared-filter defect here the same insight as file 07's rule that a value's serialised shape belongs in one place, one altitude up?

Coverage concepts:

- [ ] A name must not imply a guarantee the query does not enforce — an endpoint or field named after a
  narrower concept than what it actually returns (e.g. `by-employee` on a query that groups by user
  with no role filter) reads as correct until someone relies on the implied filter; rename to what the
  data actually is, or add the filter, but never leave the two disagreeing
- [ ] Endpoints deriving totals from the same rows must apply identical filter criteria — when a headline
  summary and its detail tables are computed independently, a summary built on a looser filter than its
  breakdown produces a total that cannot equal the sum of the rows the client is shown
- [ ] Identifier canonicalisation — user-supplied identifiers arrive in arbitrary case and surrounding
  whitespace, so the boundary must reduce them to one canonical form and then use that same value both
  for the uniqueness comparison and for what is persisted; comparing one form while storing another lets
  a single logical identity become two rows, and no later lookup can tell which one is the real account
- [ ] A documented response contract lists every status the endpoint can produce, and a constraint on a
  field belongs to every operation that writes that field, not only to the one that introduces it — a
  create documenting its uniqueness conflict while the update writing the same unique field documents
  only success and absence leaves the client with no branch for a refusal the server really returns,
  and the gap survives manual testing because such a guard normally exempts a resource compared
  against itself, so the conflict only appears when two distinct resources collide
- [ ] Guard precedence — a refusal check on the loaded resource's own state (it exists, it belongs to the
  caller, it is in the status the transition requires) is evaluated before any check that depends on the
  request body, because a resource guard returns the same verdict whatever the body contains while a
  body check does not; ordered the other way, the status code a refusal produces depends on what the
  client happened to send, so the refusal an endpoint documents is only sometimes the one it returns,
  and a caller corrects the wrong thing and retries

Rationale: Every concept here is a defect of the set, not of an endpoint: it becomes visible only when two endpoints over the same rows are read against each other, which is why the route reaches it after resources, layers, DTOs, fields, and stored data are all available.

Handoff: Contract defects travel along dependencies; file 10 makes those dependencies and their qualities visible as a graph.

## 10 — Design qualities and dependency graphs

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/10-design-qualities-and-dependency-graphs.md
Spanish: notes/architecture/junior/es/10-cualidades-de-diseno-y-grafos-de-dependencias.md

Depends on: 09

Pending additions: none

Narrative role: Make change propagation visible by combining coupling, cohesion, information hiding, dependency direction, and cycles in one drawable dependency-graph model.

Learning outcome: Draw and annotate a dependency graph for a small feature, locate a circular dependency or boundary violation, and justify either moving a responsibility or introducing a stable contract to correct it.

Prerequisites: 09.

Must answer:

- How should nodes and directed edges be labelled so a dependency graph makes change propagation visible?
- Coupling and cohesion both describe how things relate — which one is measured between modules and which inside one, and how can a change reduce one while worsening the other?
- How do coupling, cohesion, and information hiding predict the blast radius of a change?
- How can the graph expose a cycle or a wrong-way edge?
- When should responsibility move to restore cohesion, and when is a stable contract a justified boundary?

Coverage concepts:

- [ ] Coupling — the number and strength of dependencies between modules; lower coupling limits the
  blast radius of a change
- [ ] Cohesion — how strongly a module's responsibilities belong together; high cohesion is the reason
  related business rules stay in one service or feature
- [ ] Encapsulation and information hiding — expose the smallest stable module contract callers need and
  keep implementation details private so internal changes do not ripple through the codebase
- [ ] Dependency direction — outer delivery and persistence details may depend on application contracts,
  while business rules should not depend on HTTP or database APIs
- [ ] Dependency graph and circular dependencies — follow which module depends on which and break a cycle
  by relocating responsibility or introducing a justified boundary, not by hiding it with global access

Rationale: These concepts are the qualities and graph-reading tools needed to observe how responsibilities and changes travel through code boundaries.

Handoff: Coupling and cohesion are named here but felt somewhere concrete; file 11 uses tests and their setup cost as the place the design reports them back.

## 11 — Testability feedback

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/11-testability-feedback.md
Spanish: notes/architecture/junior/es/11-feedback-de-testabilidad.md

Depends on: 10

Pending additions: none

Narrative role: Turn test friction into observable evidence about the coupling and cohesion just defined, and about hidden dependencies, mixed responsibilities, and misplaced policy.

Learning outcome: Define and sketch a focused unit/service test, distinguish the test-double family from mocks specifically, and diagnose coupling from unrelated bootstrapping or a mock graph whose collaborators do not belong to the tested responsibility.

Prerequisites: 10.

Must answer:

- Why does testing the service directly isolate business-rule feedback from HTTP?
- What makes a test a unit test, and what does “service test” mean here without implying that every service test uses the same framework setup?
- What is a test double, how do stub, fake, spy, and mock differ within that family, and why should “mock” not be used as a synonym for all of them?
- What does bootstrapping mean, and what hidden dependency or responsibility problem can starting unrelated layers reveal?
- When does a long list of unrelated mocks indicate that the production class owns too much — in the coupling and cohesion terms of file 10 — and why is mock count alone not evidence when every collaborator is cohesive and necessary?

Coverage concepts:

- [ ] Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- [ ] Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- [ ] Test doubles as coupling feedback — a unit test that needs many unrelated mocks often signals a class
  with too many responsibilities or hidden boundary dependencies

Rationale: These concepts treat focused tests and their setup cost as one feedback loop reporting the qualities file 10 defined.

Handoff: Once the design's dependency edges are both visible and felt, file 12 names the mechanisms used to make those edges explicit.

## 12 — Dependency mechanisms

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/12-dependency-mechanisms.md
Spanish: notes/architecture/junior/es/12-mecanismos-de-dependencias.md

Depends on: 11

Pending additions: none

Narrative role: Give precise names to stable abstractions, language interfaces, external collaborator supply, policy-level inversion, and hidden service lookup.

Learning outcome: Given a dependency edge, distinguish its abstraction from the interface mechanism, show how injection supplies the collaborator, and judge whether the design actually inverts policy or merely hides lookup.

Prerequisites: 11.

Must answer:

- Why is an abstraction a stable idea or contract while an interface is only one possible language mechanism?
- What does dependency injection do at object construction or framework wiring time?
- Which dependency direction must change before injection also supports Dependency Inversion?
- Why does a service locator hide a class's real collaborators and weaken focused tests?

Coverage concepts:

- [ ] Abstraction vs interface — an abstraction defines the stable idea or contract callers depend on,
  while an interface is one language mechanism that can express it and is not valuable by itself
- [ ] Dependency injection vs Dependency Inversion — injection supplies a collaborator from outside,
  while the SOLID principle directs high-level policy to depend on abstractions; injection can be used
  without achieving inversion
- [ ] Dependency injection vs service locator — explicit constructor or framework injection reveals a
  class's collaborators, while pulling dependencies from a global registry hides them and weakens tests

Rationale: These three distinctions prevent framework wiring and interface syntax from being mistaken for an architecture whose high-level policy truly owns its contracts.

Handoff: Explicit dependency mechanisms still cross delivery, error, and source-tree boundaries; file 13 decides where failures are translated and how feature work is packaged.

## 13 — Failure and packaging boundaries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/13-failure-and-packaging-boundaries.md
Spanish: notes/architecture/junior/es/13-limites-de-fallos-y-empaquetado.md

Depends on: 12

Pending additions: none

Narrative role: Apply dependency direction to two maintained-code decisions: the boundary that owns outward error translation and the source layout that keeps a feature's changes local.

Learning outcome: Place failure translation at the boundary with enough context and compare package-by-feature, package-by-layer, horizontal layers, and vertical slices for one concrete change.

Prerequisites: 12.

Must answer:

- Which boundary knows enough to translate an infrastructure or domain failure into a stable outward error?
- Why should framework exceptions not leak through the public contract?
- What change-locality trade-off separates package-by-feature from package-by-layer?
- How do horizontal layers and vertical feature slices group the same delivery, application, and persistence code along different axes?

Coverage concepts:

- [ ] Boundary failure ownership — translate infrastructure and domain failures at the boundary that has
  enough context to produce a stable outward error contract without leaking framework exceptions
- [ ] Package by feature vs package by layer — feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree
- [ ] Horizontal layering vs vertical feature slices — layers group code by technical role, while a
  feature slice groups the delivery, application, and persistence pieces that change for one capability

Rationale: These concepts locate responsibility at boundaries that must contain change: outward failures and the code files touched by one capability.

Handoff: With dependency, error, and packaging boundaries explicit, file 14 examines proportionate local design moves for reshaping responsibilities under real change pressure.

## 14 — Composition, refactoring, and design pressure

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/14-composition-refactoring-and-design-pressure.md
Spanish: notes/architecture/junior/es/14-composicion-refactorizacion-y-presion-de-diseno.md

Depends on: 13

Pending additions: none

Narrative role: Convert dependency analysis into proportionate design action, first scaffolding inheritance and subtyping so composition is a meaningful alternative, then distinguishing delegation, deduplication, extraction, over-engineering, and owned debt.

Learning outcome: Given a class relationship or repeated rule, distinguish inheritance/subtyping from composition/delegation and choose a proportionate refactoring because of present change pressure rather than speculative flexibility.

Prerequisites: 13.

Must answer:

- What does inheritance give a subtype in terms of parent behaviour and state, and what caller-visible substitution claim does subtyping add?
- Why can composition avoid inheriting behaviour or state a subtype does not need?
- How does delegation differ from composition even when both appear in the same design?
- What real variation or repeated pressure justifies an abstraction?
- Which duplicated knowledge can diverge, and which similar code should remain separate?
- When does Extract Method clarify intent rather than merely shorten a method?
- What makes a shortcut technical debt instead of unowned accidental complexity?

Coverage concepts:

- [ ] Composition over inheritance — assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- [ ] Composition vs delegation — composition assembles or owns collaborators, while delegation forwards a
  responsibility to one of them; they often work together but describe different relationships
- [ ] Over-engineering — an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- [ ] DRY and duplicated knowledge — remove repeated business rules that can diverge, without forcing
  superficially similar code with different reasons to change into one abstraction
- [ ] Extract Method — move a coherent block behind a well-named method when that clarifies intent or
  centralises one repeated rule, not merely to reduce line count
- [ ] Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect

Rationale: These are proportional responses to concrete design pressure, united by the need to improve changeability without adding unjustified structure.

Handoff: Local structure is now deliberate; file 15 widens the view to deployment shape, where distribution introduces qualitatively different costs.

## 15 — System shapes

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/15-system-shapes.md
Spanish: notes/architecture/junior/es/15-formas-de-sistema.md

Depends on: 14

Pending additions: none

Narrative role: Scale boundary reasoning from classes and modules to deployment units without treating distribution as automatic maturity.

Learning outcome: Contrast unstructured, modular, and distributed application shapes and decide whether a given pressure justifies a deployment boundary, naming the network, data, and operational costs the split creates.

Prerequisites: 14.

Must answer:

- Which simplicity does a monolith retain, and which network, data, and operational costs do microservices add?
- How can a modular monolith enforce useful boundaries inside one deployment?
- Which real independent-deployment or scaling pressure justifies a service boundary, and why is placing a module behind HTTP not enough to make it a good service?

Coverage concepts:

- [ ] Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary
- [ ] Modular monolith vs unstructured monolith — one deployment can still enforce feature boundaries and
  dependency direction; a monolith becomes problematic when unrelated responsibilities freely couple

Rationale: Both concepts compare system-scale boundary choices through the new costs each choice creates; the interaction style between deployed services is middle-level scope and is deliberately left out.

Handoff: Whatever shape the system takes, a use case still needs clear business ownership; file 16 separates domain validity from application coordination and models workflow transitions.

## 16 — Business rules and workflows

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/16-business-rules-and-workflows.md
Spanish: notes/architecture/junior/es/16-reglas-de-negocio-y-flujos.md

Depends on: 15

Pending additions: none

Narrative role: Focus the architecture on business behaviour by defining a use case as one actor goal completed through the application boundary, separating what must be valid from its orchestration, and centralising workflow transitions.

Learning outcome: Distinguish a domain rule from application orchestration, model a workflow whose valid state transitions are enforced at one business boundary, and recognise when changing an actor's own attributes can strand an entity in a state no actor is able to leave.

Prerequisites: 15.

Must answer:

- What is a use case, which actor goal and result bound it, and why is it not merely one controller method?
- Which statement belongs to the domain because it defines business validity?
- Which repository and collaborator coordination belongs to application orchestration?
- How do explicit states and allowed transitions prevent invalid workflow moves from being checked inconsistently?
- When a transition is gated on the actor's role, why does changing that role become part of the workflow's own invariants?

Coverage concepts:

- [ ] Domain rule vs application orchestration — a domain rule states what is valid in the business,
  while application orchestration coordinates repositories and collaborators to complete a use case
- [ ] State machine pattern — model a workflow as explicit states and allowed transitions so invalid moves
  such as APPROVED → DRAFT are rejected at one business boundary
- [ ] Actor-dependent transitions — when a transition is gated on a mutable attribute of the actor such as a
  role, changing that attribute can strand entities in a state no actor is able to leave, so the change
  itself becomes part of the workflow's invariants

Rationale: The three concepts identify where business meaning lives, how one use-case boundary coordinates and protects it, and why a workflow's invariants extend to the actor attributes its transitions depend on.

Handoff: Business policy often meets vendor or subsystem interfaces; file 17 introduces Adapter and Facade as focused boundary patterns for those encounters.

## 17 — Adapter and Facade boundaries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/17-adapter-and-facade-boundaries.md
Spanish: notes/architecture/junior/es/17-limites-con-adapter-y-facade.md

Depends on: 16

Pending additions: none

Narrative role: Provide two maintained-code patterns for stopping incompatible vendor details or subsystem complexity from spreading into application callers.

Learning outcome: Recognise when to translate an external interface with Adapter and when to simplify a subsystem with Facade without moving all business policy into either boundary.

Prerequisites: 16.

Must answer:

- Which interface mismatch does an Adapter translate, and which application contract should remain stable?
- Which complexity does a Facade hide from callers?
- Why must neither pattern become a second home for unrelated business logic?
- How do Adapter and Facade differ when both sit at a boundary?

Coverage concepts:

- [ ] Adapter pattern — translate an external or incompatible interface into the contract the application
  expects so vendor details do not spread through business code
- [ ] Facade pattern — expose a small use-case-oriented interface over a complicated subsystem without
  turning the facade into a second home for all business logic

Rationale: Both patterns protect callers at a boundary, but one translates an interface while the other simplifies access to a subsystem.

Handoff: With concrete boundaries and patterns available, file 18 records why material choices were made and verifies that diagrams still match the code.

## 18 — Architecture decisions and review

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/architecture/junior/en/18-architecture-decisions.md
Spanish: notes/architecture/junior/es/18-decisiones-de-arquitectura.md

Depends on: 17

Pending additions: none

Narrative role: Turn architectural reasoning into maintainable evidence through decision records and diagrams whose every edge is checkable against the code.

Learning outcome: Write a concise ADR and draw one context/container/component or dependency diagram for a concrete system, verifying every shown edge against real runtime calls or code dependencies.

Prerequisites: 17.

Must answer:

- Which context, option, rejected alternatives, and consequences make an ADR useful to a later maintainer?
- How can a context, container, component, or dependency diagram make a falsifiable claim about the code?
- How does a later maintainer distinguish an intended boundary from an aspirational box that the implementation violates?
- Which thin legacy sections must the audit materially expand so ADR context/options/consequences and one edge-verified diagram become teachable mechanisms rather than a README advice list?

Coverage concepts:

- [ ] Architectural decision record (ADR) — capture the context, chosen option, rejected alternatives, and
  consequences of a material decision so later maintainers know why the constraint exists
- [ ] Architecture diagram as a code claim — a small context, container, component, or dependency diagram
  must match real runtime and dependency boundaries rather than presenting aspirational boxes

Rationale: Both practices preserve and communicate the architectural constraints established throughout the route in a form a later maintainer can check against the code; reviewing someone else's change against a dependency graph is middle-level scope and is left out.

Handoff: The recorded choices now need a compact review vocabulary; file 19 closes the junior journey by applying all five SOLID principles with their real qualifications.

## 19 — SOLID

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/19-solid.md
Spanish: notes/architecture/junior/es/19-solid.md

Depends on: 18

Pending additions: none

Narrative role: Consolidate the route's responsibility, extension, substitution, contract, and dependency lessons into five principles used during design discussion and code review.

Learning outcome: Diagnose a concrete design problem with the appropriate SOLID principle, read Liskov substitution in terms of caller-visible preconditions, postconditions, and invariants, and propose a proportionate correction without reducing any principle to a slogan.

Prerequisites: 18.

Must answer:

- Which independent actors or policies create distinct reasons for a class to change?
- Why is the component-level rule previewed in file 05 the same Single Responsibility principle at a different altitude rather than a second, unrelated rule?
- Why does Open/Closed permit changing a poor abstraction or responding to new requirements?
- What do subtype, substitutability, precondition, postcondition, and invariant mean before applying Liskov Substitution?
- Why may a subtype not strengthen accepted-input preconditions, weaken promised-output postconditions, or break invariants its caller relies on?
- How does a small cohesive client contract reduce forced dependencies in implementations and tests?
- Why can dependency injection exist without Dependency Inversion?

Coverage concepts:

- [ ] Single Responsibility — split a class when unrelated actors or policies make it change for different
  reasons, not simply because it has many lines or methods
- [ ] Open/Closed — keep stable abstractions open to extension without treating existing code as forbidden
  to change when requirements or a poor abstraction demand it
- [ ] Liskov Substitution — a subtype can replace its parent only when it preserves the caller-visible
  contract, including valid inputs, promised outputs, and invariants
- [ ] Interface Segregation — give a client the smallest cohesive contract it needs so implementations and
  tests are not forced to depend on unrelated operations
- [ ] Dependency Inversion — high-level policy depends on stable abstractions rather than lower-level
  details; dependency injection is a delivery mechanism that may help but does not guarantee this design

Rationale: SOLID restates the route's central architectural pressures as five distinct diagnostic lenses rather than universal recipes.

Handoff: This closes the junior journey: Victor can now identify boundaries, trace dependencies and business policy, audit an endpoint set against its own contract, choose proportionate patterns and system shapes, and defend or record those choices through explicit trade-offs.

## Unassigned existing notes

- none
