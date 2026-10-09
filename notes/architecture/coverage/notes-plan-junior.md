# Architecture Junior Notes Plan

Plan status: current
Coverage: notes/architecture/coverage/junior.md
Coverage SHA-256: 0a6ec62c6208920d49f129e8b3ba0b77a602481392acdf78460f9695a417efd3
Generated: 2026-10-09

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

Learning outcome: Say in his own words what architecture decides that code alone does not, point at one boundary in a small Angular/Spring system and say what it gains and what it costs, and name the order in which the route builds from that idea.

Prerequisites: none.

Must answer:

- What practical problem does software architecture solve for a team maintaining an application?
- What do “boundary”, “contract”, “dependency” and “trade-off” mean in plain words, shown once on the Angular–Spring API, given that every later chapter uses all four?
- How is choosing a system boundary different from choosing React component state or a TypeScript implementation technique, and where can those smaller choices still express an architectural constraint?
- How does architecture connect the Angular frontend, Spring Boot backend, and their API without replacing the framework-specific knowledge that Spring Boot, Angular, SQL and Security notes own?
- Which sections does this introduction itself contain, in which order, and why does each one come where it does before the reader meets it?
- Which concrete things must Victor already understand before opening `01` — that a browser app, a server and a database are three separate programs, what a running process or deployment is, what a module is, what a dependency between two pieces of code means, and what a request to a server is — and what is settled here rather than left to be discovered mid-chapter?
- Which route do files `01` → `24` follow, in which groups, and why does each group come after the one before it — the vocabulary (01); the API and the code behind it (02–04); the presentation side (05–06); the data that crosses the boundary and what identifies it (07–10); promises implied, enforced and refused (11–13); how change travels and how dependencies are made explicit (14–16); proportionate local design (17–19); how the source tree and the system are cut (20–21); and boundary patterns, review vocabulary and recorded decisions (22–24)?

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
- What is a design pattern, and what makes its scope narrower than an architectural choice?
- How can one application contain several logical layers while running in one tier?
- When does a logical module become a separately deployed service, and what new costs appear?
- What does it mean for a module's responsibility to be cohesive, in one plain sentence, before file 14 measures it?
- What does each of maintainability, testability, security, performance, availability, and scalability mean in one concrete sentence for a small Angular + Spring Boot application, and what does one trade-off between two of them look like?
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

- Through which parts of an HTTP request and its response does a REST contract speak — method, path, query string, headers, body, status code — shown once on one concrete call?
- Which constraints make REST a client-server architectural style rather than a URL naming convention?
- What does stateless mean concretely — what must every request carry, and what would hidden conversational state look like?
- Why does the HTTP method carry the action while the path names a resource?
- What does each of GET, POST, PUT, PATCH, and DELETE commit the server to?
- How do paths express resources and their relationships without becoming verb-heavy commands?
- What does an HTTP status code commit the server to, and which families does a client branch on?
- Which methods are idempotent, and why does that change what a client may safely retry?

Coverage concepts:

- [ ] REST architectural style — keep client and server responsibilities separate, make requests stateless,
  and expose a uniform resource interface so calls do not depend on hidden conversational state
- [ ] Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- [ ] Resource modelling — paths identify resources and relationships, while HTTP methods express the operation

Audit note: The existing `## CORS` section teaches a Security concept, not one of this entry's: the audit replaces it with a short cross-topic link instead of re-teaching it here. The existing `## Query parameters — filtering, sorting, pagination` section keeps the query-string mechanics and reduces pagination to a forward reference to entry 10, which owns that bullet.

Rationale: All three concepts define one thing: the resource model the network boundary presents. The defects that make a set of endpoints disagree with that model are separate mental models and are owned by files 11 and 13, once persistence, DTOs and data-access decisions exist to make them legible.

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

Learning outcome: Trace a request through controller, service, and repository; distinguish a domain rule from application orchestration; place policy in the reusable application boundary; and explain why dependencies must not bypass it.

Prerequisites: 02.

Must answer:

- What does the browser/server boundary change about how Angular reaches data?
- What does each controller, service, and repository layer own and exclude?
- What do “policy”, “delivery”, and “persistence detail” name in this chapter, and what makes policy higher-level than the code that delivers or stores it?
- Why is the service layer reusable and independently testable when policy stays out of HTTP and persistence code?
- What is “another entry point” concretely — which second caller could reuse the service without HTTP?
- What is a structural input check, as opposed to the business validation the service owns, before file 07 separates them formally?
- What does a repository contract hide, and which persistence semantics can it still expose?
- What is a persistence port — the contract through which application policy reaches stored data — and why is naming it a port a statement about direction rather than about technology?
- Why does a controller-to-repository shortcut make policy and focused tests brittle?
- In which direction should a dependency crossing a layer boundary point?
- What is a use case, and why can one use case coordinate several collaborators instead of being one controller method?
- Inside one service method, which lines state what the business allows and which only coordinate repositories and collaborators to get the use case done?

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
- [ ] Domain rule vs application orchestration — a domain rule states what is valid in the business,
  while application orchestration coordinates repositories and collaborators to complete a use case
- [ ] Why the controller should not call the repository directly — it bypasses application policy, mixes
  HTTP and persistence responsibilities, and makes changes and focused tests more brittle
- [ ] Layered dependency direction — higher-level policy should not depend directly on delivery or
  persistence details; dependencies crossing a boundary point through an appropriate contract

Audit note: The existing `## DTO — Data Transfer Object` section belongs to entry 07 and is relocated there or removed in its favour; the existing `## State machine pattern — the service enforces valid transitions` section belongs to entry 12 and is relocated there or reduced to a forward link, so this chapter keeps one layered-architecture mental model.

Rationale: These concepts define one request path, the responsibility of every layer on it, what the service on that path holds — business rules and their orchestration — and the dependency rule that keeps application policy reusable.

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
- What does “server-rendered HTML” mean, and where are the model, the view, and the controller when Spring returns JSON and Angular renders it?
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

Narrative role: Carry the interaction axis opened by MVC into the frontend by separating feature coordination and state ownership from focused presentation, while previewing Single Responsibility as distinct reasons to change before file 23 consolidates the principle.

Learning outcome: Split a page into a coordinator and presentational children, place state according to its reuse boundary, and recognise when the coordinator needs extraction.

Prerequisites: 04.

Must answer:

- What are a component's inputs and emitted events, in the props-and-callbacks terms Victor already knows?
- Which integration work belongs to a container and which rendering work belongs to a presentational component?
- How does a page coordinator differ from a container — is every coordinator a container, and when do you name one rather than the other?
- What is a service on the frontend, and how is it the same word but a different thing from the service layer of file 03?
- When should a page own feature state, and when should independently reusable state move to a service?
- Which growth signals mean a coordinator should extract a service or become several sub-pages?
- How does “different reasons to change” make the extraction signal more precise than component size, and why is this only an SRP preview before file 23?
- In what limited sense do a container and its presentational children continue the separation MVC named, and where does that comparison stop?

Coverage concepts:

- [ ] Container / presentational component pattern — a container owns feature integration while focused
  presentation components render inputs and emit user intent without fetching their own remote data
- [ ] Page coordinator pattern — a page coordinates feature state and delegates focused presentation work to
  children, while shared or independently reusable state may belong in a service rather than in the page
- [ ] When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

Audit note: The existing file is organised around two project walkthroughs (`### Example from project 03 (expense tracker)`, `### Example from project 05 (task manager)`) and interview phrasing; the audit rebuilds it around the container/coordinator contract this entry declares rather than appending new sections to that structure.

Rationale: All three concepts answer where a frontend feature's state, integration, rendering, and growing responsibilities should live — the presentation half of the axis MVC named in file 04.

Handoff: Every piece of the feature now has an owner, but a rule written inside one of those pieces can still fail to hold; file 06 shows the three ways a presentation-layer guard leaks and where it has to live instead.

## 06 — Guards at the presentation boundary

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/06-presentation-boundary-guards.md
Spanish: notes/architecture/junior/es/06-guardas-en-el-limite-de-presentacion.md

Depends on: 05

Pending additions: none

Narrative role: Having given every component an owner in file 05, show the three ways a rule placed in the presentation layer silently stops holding — it covers one listener, one path, or one item — and where it has to live instead.

Learning outcome: Given a component with a form, a multi-step flow, or a list of rows with operations in flight, locate each check and flag, say which listener, path, or item it fails to cover, and move it to the emitting boundary, the single exit, or a per-item collection.

Prerequisites: 05.

Must answer:

- What is a guard, in zero-assumption terms — a check that refuses an action before it takes effect, or a flag that disables the control that would start it — which of the two forms does each example in this chapter use, and how is this general sense different from an Angular route guard, which is one specific use of the word?
- What does a presentation component promise its parent when it emits an event, and why is forwarding the raw input value a broken promise rather than a neutral choice?
- What is a template expression, and what does normalising a raw input value involve before it is emitted?
- Why can a template expression in the parent not hold the check the child skipped, and what does every additional listener then have to repeat?
- In a multi-step form, how does a second navigation route reach the save without passing through the handler that carried the rule?
- What is the single exit where the data leaves the boundary, and why does the earlier handler keep its check only as feedback?
- What does it mean for a request to be in flight, and why does a page need to remember that per row?
- Why does one value answering “is this row busy?” release the first row the moment a second one starts, and which control does that re-enable while the first operation is still running?
- How do you read the shape a piece of state needs — one value or a set — from the question it has to answer?

Coverage concepts:

- [ ] A presentation component's emitted event is a contract, not an echo of the DOM — the raw input
  value is normalised and checked before it crosses the boundary, so the parent and every later
  listener receive a value already fit to use; deferring that check to the consumer makes each new
  listener repeat it, and a template expression cannot hold the guard at all
- [ ] A rule enforced inside a control's event handler is only as strong as the number of paths that reach
  that control — a multi-step form whose navigation offers a second route to the same save leaves the
  rule unchecked, so the guard belongs at the single exit where the data leaves the boundary and the
  handler keeps only the earlier feedback
- [ ] Per-item state does not fit in a single slot — a flag answering "is *this* item busy" held as one
  value is overwritten the moment a second item enters the same condition, silently releasing the first
  while its own operation is still running and re-enabling the control that flag was protecting; state
  takes the shape of the question it answers, so a condition several items can be in at once is a set,
  never a scalar

Rationale: The three concepts are one failure seen from three sides: a presentation-layer guard that is correct where it was written and does not cover every listener, every path, or every item.

Handoff: These guards hold inside the browser, but the server must treat everything that arrives as untrusted and must not send out whatever it happens to store; file 07 returns to the API of file 02 and the entity behind the repository of file 03, and gives the data crossing that boundary a deliberate shape.

## 07 — DTO boundaries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/07-dto-boundaries.md
Spanish: notes/architecture/junior/es/07-limites-con-dto.md

Depends on: 02, 03, 06

Pending additions: none

Narrative role: Return to the API boundary of file 02 and the entity behind the repository of file 03: protect that boundary by keeping the transport contract deliberately separate from the persistence and domain representations behind it, and from any object the application does not own.

Learning outcome: Design request and response DTOs for a use case, place each mapping at the correct boundary, keep entities and third-party implementation types out of the payload, and evolve the public contract without unintentionally exposing entity changes.

Prerequisites: 02, 03, 06.

Must answer:

- What is a DTO, literally — which fields, no behaviour — and where does it sit on the request path of file 03?
- What is a persistence entity — an object whose fields an ORM maps to database columns — and which persistence concerns does that mapping attach to it?
- What happens between the object a controller returns and the JSON the client receives — what is serialisation, and why does whatever gets serialised become the contract?
- What does it mean for an entity to be coupled to persistence concerns, in one plain sentence, before file 14 defines coupling?
- Which persistence coupling and disclosure risks appear when an entity becomes the API contract?
- What is the domain model as distinct from the persistence entity, and when are they the same class in a small project?
- What is a business invariant, and how is it different from a structural rule such as “this field is not blank”?
- Why do request DTO validation and business-invariant validation remain different responsibilities?
- How does a response DTO control outward stability and disclosure?
- What does “serialised by reflection” mean — who decides which fields appear in the payload?
- Why is serialising a library's own implementation class a contract you do not control, and what does a dependency upgrade then change?
- At which boundary should each transport or persistence mapping happen?
- Why can an entity field change remain invisible to clients?
- Which changes are additive, and when is explicit versioning needed?

Coverage concepts:

- [ ] Why not expose persistence entities directly — a JPA entity is coupled to persistence concerns;
  exposing it couples the API shape to the database mapping and can disclose fields unintentionally
- [ ] Request DTO — represent and structurally validate untrusted input without confusing transport
  validation with business invariants
- [ ] Response DTO — shape a stable outward representation and minimise field disclosure independently of
  the internal persistence or domain model
- [ ] Framework types are not response contracts — a library's implementation class serialised by reflection
  makes the payload shape an internal detail of a dependency; wrap it in a DTO you own so an upgrade
  cannot silently change the API
- [ ] Mapping placement — translate transport DTOs at the application/API boundary and persistence models
  at the persistence boundary; avoid making controllers own business rules or exposing entities as contracts
- [ ] What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- [ ] Backward-compatible API evolution — treat public fields and semantics as consumer contracts and
  prefer additive changes or explicit versioning when a rename, removal, or behaviour change would break clients

Rationale: One mental model runs through all seven: the transport contract is an object the application owns and shapes on purpose, different from the entity behind it and from any library type, and it stays different across creation, mapping, disclosure, and evolution.

Handoff: Having a DTO does not yet say what each of its fields promises; file 08 decides optionality, serialised shape, and the keys a client must be able to send back.

## 08 — Field-level contract decisions

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/08-field-level-contract-decisions.md
Spanish: notes/architecture/junior/es/08-decisiones-de-contrato-por-campo.md

Depends on: 07

Pending additions: none

Narrative role: Descend from the shape of a payload to the promise made by each individual field: whether it may be absent, how it is serialised, and whether the client can act on it without a second lookup.

Learning outcome: Justify a field's optionality by the direction it travels, decide when create and update need different request shapes, carry the identifier a caller must send back, and place a value's serialised shape in one location every endpoint reads from.

Prerequisites: 07.

Must answer:

- Why does a response that names a related entity without carrying its identifier force the client into a lookup that is only accidentally correct?
- How is minimal disclosure a rule about sensitive fields rather than about the keys a caller has to send back?
- What is a partial update, and how does the server tell a field that was omitted from one sent as `null` or `false`?
- Why is a nullable field legitimate in a partial-update request and a defect in the response for the same resource?
- When do create and update operations need different request shapes?
- Where should the decimal scale, date format, or unit of a value be decided so two endpoints cannot present one figure as two?

Coverage concepts:

- [ ] Relationship identifiers in a response — showing a related entity by display label alone forces the
  client to re-derive its key before the next write, and that lookup is only correct while the label
  happens to be unique; carry the identifier beside the label and read minimal disclosure as a rule
  about sensitive fields, not about keys the caller must send back
- [ ] Nullable field in a request versus in a response — in a partial-update request an absent value legitimately means "leave this one alone", so the field must be able to hold nothing; in a response the same shape advertises a state the model can never be in, so a value the domain always has is declared as one that cannot be absent
- [ ] Create vs Update request DTOs — separate them when the operations have different validation,
  optionality, or evolution pressure; a shared shape is acceptable while their contracts genuinely match
- [ ] The serialised shape of a value belongs to the response contract — two endpoints returning the same
  quantity in different decimal scales, date formats or units present one figure as two, and a client
  cannot tell a formatting difference from a disagreement about the data; fix the shape in one place
  every endpoint reads from, because a rule restated per endpoint drifts the first time one is edited

Rationale: Each concept is the same decision at field altitude — what this one value promises the client, in which direction — which the file-07 model of a DTO as a whole shape cannot settle on its own.

Handoff: A response now carries the identifiers a caller must send back; file 09 follows an identifier to its source and asks what is allowed to produce it.

## 09 — Record identity

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/09-record-identity.md
Spanish: notes/architecture/junior/es/09-identidad-de-los-registros.md

Depends on: 08

Pending additions: none

Narrative role: Follow the identifier the client was just handed back to its source: decide what may generate it, who is allowed to stamp it, and how a user-supplied identifier is reduced to one form, so that one logical thing is always exactly one record.

Learning outcome: For a collection of records, choose an identifier source that is unique by construction, make the collection's owner the only place that stamps it, and canonicalise a user-supplied identifier once so that the value compared is the value stored — naming for each the duplicate or collision that appears otherwise.

Prerequisites: 08.

Must answer:

- What does “unique by construction” mean, and how do a database sequence, a counter owned by the collection's single writer, and a sufficiently wide random identifier each provide it?
- Why does a clock reading fail as an identifier, and what does an operation that locates a record by its identifier then do to two records created inside the same tick?
- Why does the signature of the create operation — every field except the identifier — say where the identifier comes from more reliably than a comment could?
- What goes wrong when each caller supplies its own identifier, even when every caller is individually careful?
- How is a user-supplied identifier such as an email different from a generated one, and why does it need a canonical form at all?
- How does comparing one form while storing another turn one account into two rows that no later lookup can tell apart?
- Where does the reduction to the canonical form have to run so that every path that writes or looks up the identifier passes through it?

Coverage concepts:

- [ ] Generated identity — an identifier must come from a source that guarantees uniqueness by
  construction, such as a database sequence, a counter owned by the single writer of the collection, or
  a random identifier wide enough that collisions are negligible; a clock reading is not one, because
  every record created inside the same tick receives the same value, and any later operation that
  locates a record by its identifier then acts on all of them at once
- [ ] Identity is stamped by the collection's owner, not by the caller — the operation that creates a record accepts every field except the generated identifier, so there is exactly one place the identifier can come from and the signature is what says so; letting the caller supply it puts the generation rule in as many places as there are callers, and each one is free to use a different source
- [ ] Identifier canonicalisation — user-supplied identifiers arrive in arbitrary case and surrounding
  whitespace, so the boundary must reduce them to one canonical form and then use that same value both
  for the uniqueness comparison and for what is persisted; comparing one form while storing another lets
  a single logical identity become two rows, and no later lookup can tell which one is the real account

Rationale: All three protect one invariant — one logical thing, one record, one identifier value — against the three places it breaks: the source of the value, the writer that stamps it, and the form it is compared and stored in.

Handoff: With every record uniquely identified, file 10 decides how long those records are retained, how many are returned at once, and which writes must succeed together.

## 10 — Data access decisions

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/10-data-access-decisions.md
Spanish: notes/architecture/junior/es/10-decisiones-de-acceso-a-datos.md

Depends on: 02, 03, 09

Pending additions: none

Narrative role: Show how retention, collection size, and atomic business operations become explicit architectural contracts rather than incidental database behaviour.

Learning outcome: Choose and defend a deletion, pagination, and consistency boundary for a small use case while naming each option's complexity and ownership.

Prerequisites: 02, 03, 09.

Must answer:

- Which audit, recovery, and historical-reference needs justify soft delete despite its filtering and uniqueness costs?
- What do the filtering and uniqueness costs of soft delete look like concretely — which queries must now exclude deleted rows, and what happens when a deleted record's unique value is reused?
- When should a collection boundary use a page or cursor rather than return every row?
- What does the client send and receive under a page contract and under a cursor contract, and what breaks in each when rows are inserted between two requests?
- What does it mean for several writes to succeed or fail as one unit, and which half-finished state would the system be left in without that guarantee?
- What is that all-or-nothing guarantee called, in one sentence, so that file 21 can refer to it by name?
- How does architecture choose an atomic business boundary without duplicating SQL or Spring transaction mechanics?

Coverage concepts:

- [ ] Soft delete vs hard delete — retain a record when audit, recovery, or historical references justify
  the extra filtering and uniqueness complexity; otherwise permanent deletion may be the simpler contract
- [ ] Pagination — bound large collection responses when volume can grow, choosing an explicit page or
  cursor contract instead of assuming every list is safely returned at once
- [ ] Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics

Rationale: Each is a storage decision the caller can observe — whether a deleted record can still be referenced, how much of a list comes back, and whether a half-finished operation can ever be seen — so each is decided as a contract and not left to the database.

Handoff: Every decision so far was stated out loud; file 11 turns to the promises an API and its screen make without stating them — through a name, a total, or a format.

## 11 — Implied guarantees

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/11-implied-guarantees.md
Spanish: notes/architecture/junior/es/11-garantias-implicitas.md

Depends on: 05, 08, 10

Pending additions: none

Narrative role: Read an API and its screen the way a consumer does — through what a name, a headline total, and a rendered format imply — and check each implied claim against the query that actually produced the data.

Learning outcome: Given an endpoint, its summary, and the view that renders them, detect a name that implies a filter the query does not apply, a total computed on a looser filter than its breakdown, and a rendered value whose format implies a scope the query never bounded — and for each one choose between changing the claim and changing the query.

Prerequisites: 05, 08, 10.

Must answer:

- Why is a misleading endpoint or field name an architectural contract defect even when the query runs correctly?
- In the `by-employee` example, what does the query group by, which filter is missing, and which rows therefore appear under a name that excludes them?
- When a name and its data disagree, how do you choose between renaming to what the data is and adding the filter the name promised?
- Why can a summary figure and the rows beneath it disagree when both queries are individually correct, and where must the shared filter criteria live?
- How is the shared-filter defect the same insight as file 08's rule that a value's serialised shape belongs in one place, one altitude up?
- What does a date printed without its year, an amount without its currency, or a measure without its unit tell the reader about the surrounding view, and when is that claim false?
- Why is the format of a rendered value chosen from the range the query can return rather than from what the screen is called?
- What do the three defects have in common that makes each one invisible while its endpoint or component is tested alone?

Coverage concepts:

- [ ] A name must not imply a guarantee the query does not enforce — an endpoint or field named after a
  narrower concept than what it actually returns (e.g. `by-employee` on a query that groups by user
  with no role filter) reads as correct until someone relies on the implied filter; rename to what the
  data actually is, or add the filter, but never leave the two disagreeing
- [ ] Endpoints deriving totals from the same rows must apply identical filter criteria — when a headline
  summary and its detail tables are computed independently, a summary built on a looser filter than its
  breakdown produces a total that cannot equal the sum of the rows the client is shown
- [ ] A rendered value must not imply a scope the query never applied — omitting the year from a date, the
  currency from an amount or the unit from a measure reads as a claim that the surrounding view fixes
  it, so a list the server never bounded shows values the reader cannot place; the format is chosen
  from the range the query can return, never from what the screen is called

Rationale: Each concept is an implied claim — carried by a name, a sum, or a format — that only the query can make true, which is why the three are taught as one check rather than as an API rule, a reporting rule, and a UI rule.

Handoff: An implied claim is a rule nobody enforces. File 12 takes the rules a business does enforce — which moves a record may make — and asks who owns them.

## 12 — Workflows

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/12-workflows.md
Spanish: notes/architecture/junior/es/12-flujos-de-trabajo.md

Depends on: 03, 05, 06, 11

Pending additions: none

Narrative role: Model a workflow as explicit states and allowed transitions, and make the owner of the state the one place those transitions are enforced and answered for.

Learning outcome: Model a workflow whose valid state transitions are enforced by the owner of the state rather than by the view that hides the action, make a refused transition observable to its caller, and recognise when changing an actor's own attributes can strand an entity in a state no actor is able to leave.

Prerequisites: 03, 05, 06, 11.

Must answer:

- How do explicit states and allowed transitions prevent invalid workflow moves from being checked inconsistently?
- Is a transition check a domain rule or orchestration in the terms of file 03, and why does that decide who owns it?
- Why is a transition rule expressed only by hiding the unavailable action not enforced at all, and which other callers can still perform the move?
- What separates removing the button from removing the transition, and why does a correct design normally keep both?
- When a guard refuses a transition and leaves the state unchanged, what does a caller that is told nothing report to the user?
- How does an operation answer whether it applied, and how does that continue the single-exit guard of file 06?
- What is an invariant of a workflow — a statement that must stay true whichever move is made — shown on one concrete workflow before the actor-dependent case relies on the word?
- When a transition is gated on the actor's role, why does changing that role become part of the workflow's own invariants?

Coverage concepts:

- [ ] State machine pattern — model a workflow as explicit states and allowed transitions so invalid moves
  such as APPROVED → DRAFT are rejected at one business boundary
- [ ] Enforcement lives with the state's owner — a transition rule expressed only in the view that hides
  the unavailable action is not enforced at all, because the component or service that owns the state
  still accepts that move from any other caller and persists it; conditional rendering removes the
  button, while a guard in the owner removes the transition
- [ ] A refused transition has to be observable to its caller — a guard that leaves the state unchanged and
  says nothing lets the caller report the success it assumed, so the operation answers whether it
  applied and the caller's feedback branches on that answer rather than on having been called
- [ ] Actor-dependent transitions — when a transition is gated on a mutable attribute of the actor such as a
  role, changing that attribute can strand entities in a state no actor is able to leave, so the change
  itself becomes part of the workflow's invariants

Rationale: The four concepts are one model: a workflow's state has one owner, and that owner enforces each transition, answers for a refused one, and protects the actor attributes its transitions depend on.

Handoff: A refused transition has to reach its caller; over HTTP that answer is a status code, and file 13 makes every such refusal documented, deterministic, and predictable.

## 13 — Refusal and failure contracts

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/13-refusal-and-failure-contracts.md
Spanish: notes/architecture/junior/es/13-contratos-de-rechazo-y-fallo.md

Depends on: 02, 03, 06, 07, 09, 12

Pending additions: none

Narrative role: Treat the refusal as a first-class part of an endpoint's contract: every refusal the server can return is documented on every operation that can produce it, the same resource state always produces the same one, the client's own checks agree with it, and a failure rising from below is shaped at one boundary instead of leaking out as it is.

Learning outcome: For one resource with a create, an update, and a state-dependent operation, list every status each operation can produce, order its guards so that the documented refusal is the one returned whatever the body contains, align a client-side validation with the server rule it anticipates, and place the translation of an infrastructure or domain failure at the boundary that can produce a stable outward error.

Prerequisites: 02, 03, 06, 07, 09, 12.

Must answer:

- Where is a response contract written down, who reads it, and what does a client do with a status that is not listed there?
- Which kinds of guard does a server endpoint run before doing its work — on the loaded resource's own state and on the request body — and what does each one refuse?
- Why does a constraint on a field belong to every operation that writes that field, and not only to the one that introduced it?
- Why does a create that documents its uniqueness conflict leave the client with no branch when the update returns the same refusal undocumented?
- Why does manual testing usually miss the update's conflict — what does a guard that exempts a resource compared against itself hide?
- Why does a check on the loaded resource's own state return the same verdict whatever the body contains, while a body check does not?
- When the body check runs first, how does the status code of a refusal come to depend on what the caller happened to send, and what does the caller then correct by mistake?
- What is client-side validation for when the server is the only authority, and what does the user pay when the client's test is looser than the server's?
- How do you check that a client rule and the server rule it anticipates measure the same thing — for example an empty value against a value made only of whitespace?
- What is an infrastructure failure as opposed to a domain failure — one example of each — and what does the client receive when a framework exception escapes untranslated?
- Which boundary knows enough to translate an infrastructure or domain failure into a stable outward error?
- Why should framework exceptions not leak through the public contract?

Coverage concepts:

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
- [ ] A rule stated on both sides of a network boundary must measure the same thing — client-side validation exists
  for immediate feedback rather than authority, so when it applies a looser test than the server's the form
  accepts a value the request is about to be refused for, and the user pays a round trip to learn what the
  client already held enough information to say
- [ ] Boundary failure ownership — translate infrastructure and domain failures at the boundary that has
  enough context to produce a stable outward error contract without leaking framework exceptions

Rationale: The four concepts make one promise from four directions: the refusal a client meets is one the contract listed, the one this resource state always produces, one the client's own form could have predicted, and one shaped at a single boundary rather than leaked by whichever exception escaped.

Handoff: A contract defect in one place is felt wherever something depends on it; file 14 makes those dependencies and their qualities visible as a graph.

## 14 — Design qualities and dependency graphs

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/14-design-qualities-and-dependency-graphs.md
Spanish: notes/architecture/junior/es/14-cualidades-de-diseno-y-grafos-de-dependencias.md

Depends on: 01, 03, 13

Pending additions: none

Narrative role: Make change propagation visible by combining coupling, cohesion, information hiding, dependency direction, and cycles in one drawable dependency-graph model.

Learning outcome: Draw and annotate a dependency graph for a small feature, locate a circular dependency or boundary violation, and justify either moving a responsibility or introducing a stable contract to correct it.

Prerequisites: 01, 03, 13.

Must answer:

- How should nodes and directed edges be labelled so a dependency graph makes change propagation visible?
- Coupling and cohesion both describe how things relate — which one is measured between modules and which inside one, and how can a change reduce one while worsening the other?
- Are encapsulation and information hiding the same thing, and which one is the language feature and which the design decision?
- How do coupling, cohesion, and information hiding predict the blast radius of a change?
- What does this chapter's dependency direction add to the layered rule of file 03?
- How can the graph expose a cycle or a wrong-way edge?
- What does hiding a cycle behind global access look like, and why is the dependency still there afterwards?
- When should responsibility move to restore cohesion, and when is a stable contract a justified boundary — shown on one cycle, with the mechanism named only as “a contract one side owns” until file 16?

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

Handoff: Coupling and cohesion are named here but felt somewhere concrete; file 15 uses tests and their setup cost as the place the design reports them back.

## 15 — Testability feedback

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/15-testability-feedback.md
Spanish: notes/architecture/junior/es/15-feedback-de-testabilidad.md

Depends on: 03, 14

Pending additions: none

Narrative role: Turn test friction into observable evidence about the coupling and cohesion just defined, and about hidden dependencies, mixed responsibilities, and misplaced policy.

Learning outcome: Define and sketch a focused unit/service test, distinguish the test-double family from mocks specifically, and diagnose coupling from unrelated bootstrapping or a mock graph whose collaborators do not belong to the tested responsibility.

Prerequisites: 03, 14.

Must answer:

- Why does testing the service directly isolate business-rule feedback from HTTP?
- What makes a test a unit test, and what does “service test” mean here without implying that every service test uses the same framework setup?
- What is a test double, how do stub, fake, spy, and mock differ within that family, and why should “mock” not be used as a synonym for all of them?
- How does a test hand a double to the class under test — what must the constructor accept — before file 16 names that dependency injection, and what makes a dependency hidden by contrast?
- What does bootstrapping mean, and what hidden dependency or responsibility problem can starting unrelated layers reveal?
- When does a long list of unrelated mocks indicate that the production class owns too much — in the coupling and cohesion terms of file 14 — and why is mock count alone not evidence when every collaborator is cohesive and necessary?

Coverage concepts:

- [ ] Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- [ ] Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- [ ] Test doubles as coupling feedback — a unit test that needs many unrelated mocks often signals a class
  with too many responsibilities or hidden boundary dependencies

Rationale: These concepts treat focused tests and their setup cost as one feedback loop reporting the qualities file 14 defined.

Handoff: Once the design's dependency edges are both visible and felt, file 16 names the mechanisms used to make those edges explicit.

## 16 — Dependency mechanisms

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/16-dependency-mechanisms.md
Spanish: notes/architecture/junior/es/16-mecanismos-de-dependencias.md

Depends on: 03, 14, 15

Pending additions: none

Narrative role: Give precise names to stable abstractions, language interfaces, external collaborator supply, policy-level inversion, and hidden service lookup.

Learning outcome: Given a dependency edge, distinguish its abstraction from the interface mechanism, show how injection supplies the collaborator, and judge whether the design actually inverts policy or merely hides lookup.

Prerequisites: 03, 14, 15.

Must answer:

- Why is an abstraction a stable idea or contract while an interface is only one possible language mechanism?
- What does dependency injection do at object construction or framework wiring time?
- What is SOLID in one sentence, and which of its letters is Dependency Inversion — enough to read this chapter before file 23?
- Which dependency direction must change before injection also supports Dependency Inversion?
- What does a service locator look like in code, compared with the same class receiving its collaborator through the constructor?
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

Handoff: Injection hands a class its collaborators; file 17 asks the question that comes first — whether a class should get a behaviour from a collaborator at all, or inherit it.

## 17 — Composition and delegation

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/17-composition-and-delegation.md
Spanish: notes/architecture/junior/es/17-composicion-y-delegacion.md

Depends on: 16

Pending additions: none

Narrative role: Turn dependency analysis into the first local design choice — how a class obtains a behaviour — by scaffolding inheritance and subtyping first, so that composition and delegation are meaningful alternatives rather than slogans.

Learning outcome: Given a class relationship, say what inheritance hands the subtype, rebuild the same behaviour by composing focused collaborators, and name which of the resulting calls are delegation.

Prerequisites: 16.

Must answer:

- What does inheritance give a subtype in terms of parent behaviour and state, and what caller-visible substitution claim does subtyping add?
- Why can composition avoid inheriting behaviour or state a subtype does not need?
- How does delegation differ from composition even when both appear in the same design?
- In which situation is inheritance still the proportionate choice, so that “composition over inheritance” reads as a default rather than as a ban?

Coverage concepts:

- [ ] Composition over inheritance — assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- [ ] Composition vs delegation — composition assembles or owns collaborators, while delegation forwards a
  responsibility to one of them; they often work together but describe different relationships

Rationale: Both concepts answer one question — how a class comes to have a behaviour — and the second is unreadable until the first has separated owning a collaborator from being a subtype.

Handoff: Composition adds structure on purpose; file 18 asks when adding any structure — an abstraction, a shared helper, an extracted method — is justified by pressure that actually exists.

## 18 — Abstraction under real pressure

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/18-abstraction-under-real-pressure.md
Spanish: notes/architecture/junior/es/18-abstraccion-bajo-presion-real.md

Depends on: 16, 17

Pending additions: none

Narrative role: Decide when to merge, extract, or abstract code by asking which knowledge is actually duplicated and which variation actually exists, rather than what looks similar or might be needed one day.

Learning outcome: Given two similar fragments or a proposed abstraction, decide whether to merge, extract, or leave them, citing the duplicated rule that can diverge, the different reason to change or moment of execution that keeps them apart, or the real variation that justifies the new structure.

Prerequisites: 16, 17.

Must answer:

- What real variation or repeated pressure justifies an abstraction, and what does a speculative one cost every later reader?
- Which duplicated knowledge can diverge, and which similar code should remain separate?
- Why is “these two fragments apply the same test” not enough to make them one rule?
- What is a predicate, and what are the two fragments in this chapter's example actually testing?
- What does it mean for one check to be measured synchronously and another after a later tick or render, explained for a reader who has never scheduled work in a browser?
- Why is that moment invisible in the predicate itself, and what behaviour is deleted when the two fragments are folded into one helper?
- When does Extract Method clarify intent rather than merely shorten a method?
- How do DRY and the warning against over-engineering pull in opposite directions, and which question settles a concrete case?

Coverage concepts:

- [ ] Over-engineering — an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- [ ] DRY and duplicated knowledge — remove repeated business rules that can diverge, without forcing
  superficially similar code with different reasons to change into one abstraction
- [ ] Similar code that runs at different moments — two fragments applying the same test are still two
  rules when one is measured synchronously and the other after a later tick or render; the moment is
  not visible in the predicate, so folding them into one helper deletes the behaviour of whichever
  moment does not survive
- [ ] Extract Method — move a coherent block behind a well-named method when that clarifies intent or
  centralises one repeated rule, not merely to reduce line count

Rationale: The four concepts are one decision — whether to introduce shared structure — taken on the same evidence: knowledge that is genuinely one thing, and pressure that is genuinely present.

Handoff: Adding structure is half of proportion; file 19 covers the other half — what is deleted, what must stay although it looks unused, and what is knowingly left imperfect.

## 19 — Dead code and technical debt

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/19-dead-code-and-technical-debt.md
Spanish: notes/architecture/junior/es/19-codigo-muerto-y-deuda-tecnica.md

Depends on: 18

Pending additions: none

Narrative role: Close the proportion argument from the removal side: decide which code is deleted because nothing reads it, which must stay because the type still admits it, and which imperfect code is a recorded debt rather than a defect.

Learning outcome: Given a class with unused members, a branch no current configuration reaches, and a known shortcut, classify each as dead code to delete, a live branch to keep or to retire at its producer, or technical debt with an owner and a follow-up condition.

Prerequisites: 18.

Must answer:

- What makes state, a member, or generated scaffolding dead — which readers have to be absent — and why is “it costs nothing at runtime” not a reason to keep it?
- How does unused code mislead the next reader about what the unit is responsible for?
- Why is a branch that today's configuration never reaches not dead code, and which test separates the two?
- What does it mean for the declared type of an input to still admit a case, shown on a concrete type?
- How is such a branch retired correctly — by narrowing the type at its producer — and what breaks when the handling is deleted at the consumer instead?
- What turns a shortcut into technical debt: which cost and which follow-up condition have to be written down?
- How is accidental complexity that nobody owns different from debt, and why is it called a defect?

Coverage concepts:

- [ ] Dead code — state, members and generated scaffolding no caller or template reads are deleted rather than
  kept "just in case"; they cost nothing at runtime and mislead every later reader about what the unit
  is responsible for
- [ ] A branch excluded by configuration is not dead code — the test is the declared type of the input, not
  the settings that happen to narrow it today; a case the type still admits stays handled, and the branch
  is retired by narrowing the type at its producer rather than by deleting the handling at its consumer
- [ ] Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect

Rationale: Each concept is a verdict on code that looks as if it should not be there — delete it, keep it, or own it — and the three are confusable precisely because they look alike in a diff.

Handoff: Classes are now deliberate in what they add and what they remove; file 20 decides how the source tree groups them — by technical role or by feature.

## 20 — Packaging boundaries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/20-packaging-boundaries.md
Spanish: notes/architecture/junior/es/20-limites-de-empaquetado.md

Depends on: 03, 14, 19

Pending additions: none

Narrative role: Decide how the source tree groups the classes the previous chapters shaped — by technical role or by the capability that changes — so that one change touches one place.

Learning outcome: Compare package-by-feature, package-by-layer, horizontal layers, and vertical slices for one concrete change, and say which files each layout makes that change touch.

Prerequisites: 03, 14, 19.

Must answer:

- What change-locality trade-off separates package-by-feature from package-by-layer?
- How do horizontal layers and vertical feature slices group the same delivery, application, and persistence code along different axes?
- How is the packaging question — where a file lives — different from the layering question of file 03 — what a class may depend on — and can one codebase answer them differently?

Coverage concepts:

- [ ] Package by feature vs package by layer — feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree
- [ ] Horizontal layering vs vertical feature slices — layers group code by technical role, while a
  feature slice groups the delivery, application, and persistence pieces that change for one capability

Rationale: Both concepts answer one question: along which axis the code is cut, and therefore how far one change spreads.

Handoff: A feature kept together in one package is a boundary inside one deployment; file 21 asks when such a boundary should become a deployment boundary.

## 21 — System shapes

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/21-system-shapes.md
Spanish: notes/architecture/junior/es/21-formas-de-sistema.md

Depends on: 01, 10, 14, 20

Pending additions: none

Narrative role: Scale boundary reasoning from classes and modules to deployment units without treating distribution as automatic maturity.

Learning outcome: Contrast unstructured, modular, and distributed application shapes and decide whether a given pressure justifies a deployment boundary, naming the network, data, and operational costs the split creates.

Prerequisites: 01, 10, 14, 20.

Must answer:

- What does this chapter add to file 01's module-versus-service distinction?
- Which simplicity does a monolith retain, and which network, data, and operational costs do microservices add?
- What does distributed data mean concretely — why can two services not share the all-or-nothing boundary of file 10?
- How can a modular monolith enforce useful boundaries inside one deployment?
- Which real independent-deployment or scaling pressure justifies a service boundary, and why is placing a module behind HTTP not enough to make it a good service?

Coverage concepts:

- [ ] Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary
- [ ] Modular monolith vs unstructured monolith — one deployment can still enforce feature boundaries and
  dependency direction; a monolith becomes problematic when unrelated responsibilities freely couple

Rationale: Both concepts compare system-scale boundary choices through the new costs each choice creates; the interaction style between deployed services is middle-level scope and is deliberately left out.

Handoff: A split service, or any vendor, puts an interface you do not control on the other side of a boundary; file 22 keeps such interfaces from spreading into application code.

## 22 — Adapter and Facade boundaries

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/22-adapter-and-facade-boundaries.md
Spanish: notes/architecture/junior/es/22-limites-con-adapter-y-facade.md

Depends on: 03, 07, 13, 14, 16, 21

Pending additions: none

Narrative role: Provide two maintained-code patterns for stopping incompatible vendor details or subsystem complexity from spreading into application callers.

Learning outcome: Recognise when to translate an external interface with Adapter and when to simplify a subsystem with Facade without moving all business policy into either boundary.

Prerequisites: 03, 07, 13, 14, 16, 21.

Must answer:

- Which interface mismatch does an Adapter translate, and which application contract should remain stable?
- How is an Adapter different from the DTO mapping of file 07 and from the failure translation of file 13, when all three translate at a boundary?
- Which complexity does a Facade hide from callers?
- How does a Facade differ from the service layer of file 03, and what is the sign that a Facade has started to hold business rules?
- Why must neither pattern become a second home for unrelated business logic?
- How do Adapter and Facade differ when both sit at a boundary?

Coverage concepts:

- [ ] Adapter pattern — translate an external or incompatible interface into the contract the application
  expects so vendor details do not spread through business code
- [ ] Facade pattern — expose a small use-case-oriented interface over a complicated subsystem without
  turning the facade into a second home for all business logic

Rationale: Both patterns protect callers at a boundary, but one translates an interface while the other simplifies access to a subsystem.

Handoff: Adapter and Facade are two named answers; file 23 gives the five named questions used to review any class or contract.

## 23 — SOLID

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/architecture/junior/en/23-solid.md
Spanish: notes/architecture/junior/es/23-solid.md

Depends on: 03, 05, 14, 16, 17, 22

Pending additions: none

Narrative role: Consolidate the route's responsibility, extension, substitution, contract, and dependency lessons into five principles used during design discussion and code review.

Learning outcome: Diagnose a concrete design problem with the appropriate SOLID principle, read Liskov substitution in terms of caller-visible preconditions, postconditions, and invariants, and propose a proportionate correction without reducing any principle to a slogan.

Prerequisites: 03, 05, 14, 16, 17, 22.

Must answer:

- Which independent actors or policies create distinct reasons for a class to change?
- Why is the component-level rule previewed in file 05 the same Single Responsibility principle at a different altitude rather than a second, unrelated rule?
- What does “open for extension, closed for modification” mean on one concrete class, before its qualifications apply?
- Why does Open/Closed permit changing a poor abstraction or responding to new requirements?
- Building on the substitution claim of file 17, what do subtype, substitutability, precondition, postcondition, and invariant mean before applying Liskov Substitution?
- Why may a subtype not strengthen accepted-input preconditions, weaken promised-output postconditions, or break invariants its caller relies on?
- How does a small cohesive client contract reduce forced dependencies in implementations and tests?
- Which earlier chapters already applied Dependency Inversion without naming it — the persistence port of file 03, the wrong-way edge of file 14, the injected collaborator of file 16 — and what does the principle add as a review question?

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

Handoff: With a vocabulary to diagnose a design, the last step is to record the decision and show it is true of the code; file 24 closes the route there.

## 24 — Architecture decisions and review

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/architecture/junior/en/24-architecture-decisions.md
Spanish: notes/architecture/junior/es/24-decisiones-de-arquitectura.md

Depends on: 01, 05, 14, 23

Pending additions: none

Narrative role: Turn architectural reasoning into maintainable evidence through decision records and diagrams whose every edge is checkable against the code.

Learning outcome: Write a concise ADR and draw one context/container/component or dependency diagram for a concrete system, verifying every shown edge against real runtime calls or code dependencies.

Prerequisites: 01, 05, 14, 23.

Must answer:

- What makes a decision material enough to deserve a record, as opposed to a choice nobody will need explained?
- Which context, option, rejected alternatives, and consequences make an ADR useful to a later maintainer?
- What do “context”, “container”, and “component” mean as diagram levels, and why is this container neither the container component of file 05 nor a Docker container?
- What is the difference between a runtime boundary and a code dependency, and which diagram shows which?
- How can a context, container, component, or dependency diagram make a falsifiable claim about the code?
- How does a later maintainer distinguish an intended boundary from an aspirational box that the implementation violates?

Coverage concepts:

- [ ] Architectural decision record (ADR) — capture the context, chosen option, rejected alternatives, and
  consequences of a material decision so later maintainers know why the constraint exists
- [ ] Architecture diagram as a code claim — a small context, container, component, or dependency diagram
  must match real runtime and dependency boundaries rather than presenting aspirational boxes

Audit note: The existing file is a thin advice list aimed at a README section and at interviews (`## Why this matters for interviews`, `## How to write the section in a README`, `## Questions to ask yourself before writing the section`); the audit materially expands it so that an ADR's context, options and consequences, and one edge-verified diagram, become teachable mechanisms. The README-oriented sections are judged against that contract: what survives is the ADR mechanism applied to one README entry, not README-format advice.

Rationale: Both practices preserve and communicate the architectural constraints established throughout the route in a form a later maintainer can check against the code; reviewing someone else's change against a dependency graph is middle-level scope and is left out.

Handoff: This closes the junior journey: Victor can now identify boundaries, trace dependencies and business policy, keep an identifier, a guard and a refusal true to what they promise, audit an endpoint set against its own contract, choose proportionate patterns and system shapes, and defend or record those choices through explicit trade-offs.

## Unassigned existing notes

- none
