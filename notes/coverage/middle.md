# Global Middle Coverage — All Topics

Combined middle-level coverage for every topic in the notes folder.
Source files: one `coverage/middle.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
This level becomes active only after the junior level is complete and consolidated.
Order follows study priority: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

Concepts expected once the junior Angular foundation is consolidated and a developer is becoming autonomous in a maintained production application.

### State and reusable component APIs

- NgRx Store architecture — use actions, reducers, selectors, and effects when application-wide state requires explicit event flow and tooling
- `@ngrx/signals` stores — model shared state with signal-store features while preserving clear ownership and side-effect boundaries
- `ControlValueAccessor` — build a reusable custom control that participates in Angular forms, validation, disabled state, and touched state

### Advanced reactive integration

- `toSignal()` configuration and injection context — control initial values, equality, cleanup, and custom injectors when basic conversion is insufficient
- `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams according to source behaviour
- RxJS retry and finalisation policies — retry only safe failures and guarantee loading cleanup with a deliberate `finalize()` boundary

### Rendering, loading, and diagnostics

- Route preloading strategies — balance later-navigation latency against background bandwidth using measured route usage
- `@defer` blocks — choose viewport, interaction, or idle triggers for heavy template dependencies
- Signal `resource()` APIs — evaluate signal-native asynchronous loading against established `HttpClient` and RxJS patterns
- `ChangeDetectorRef` — use manual marking, detection, or detachment only when normal Angular notifications cannot model an integration
- Angular CDK primitives — build accessible overlays, drag-and-drop interactions, portals, and virtual scrolling beyond ready-made Material components
- Bundle and rendering profiling — use Angular DevTools and build statistics to find a measured bottleneck before optimising

---

## Angular Material

Concepts expected when a developer can adapt Angular Material to a production design system and select components beyond the junior table/form/dialog floor.

### Theming and custom controls

- Custom theme palettes — define product palettes and semantic colours instead of relying only on prebuilt themes
- Component and theme token overrides — customise a narrow visual contract without depending on brittle internal selectors
- Runtime dark mode — switch complete theme token sets while preserving contrast and user preference
- Material custom form controls — integrate a `ControlValueAccessor` with `mat-form-field`, validation, focus, and error state

### CDK and scale-oriented components

- Angular CDK — choose low-level overlay, portal, drag-drop, and accessibility primitives when Material has no suitable component
- Virtual scrolling — render large collections through `CdkVirtualScrollViewport` and understand its fixed/dynamic sizing trade-offs
- `MatAutocomplete` with remote data — combine form streams, cancellation, loading, and option identity for production lookup fields
- Hierarchical and dense navigation — choose `MatTree`, tabs, or expansion panels according to information structure rather than appearance
- Multi-value inputs — implement chips, selection, removal, keyboard interaction, and validation for tag-like data

---

## Spring Boot

Concepts expected from a Spring Boot developer who owns production behaviour beyond straightforward CRUD services.

### Production boundaries and diagnostics

- `AuthenticationEntryPoint` and `AccessDeniedHandler` — control unauthenticated and forbidden responses at the security boundary
- Spring Boot Actuator — expose and secure health, metrics, and diagnostic endpoints for operations
- Dynamic query construction with `Specification<T>` — compose type-safe Criteria API predicates through `JpaSpecificationExecutor` so a query carries only the filters actually supplied, instead of a JPQL string whose every optional parameter needs its own null check ✅ 07-timetrack
- Application caching — place `@Cacheable`, eviction, and cache keys around stable reads without serving stale business state
- OpenAPI contract maintenance — keep generated documentation aligned with validation, error responses, and consumer-visible DTOs

### Distributed application foundations

- Microservice boundaries — split by business capability only when independent ownership and deployment justify distributed complexity
- Spring Cloud configuration and discovery awareness — recognise the infrastructure patterns commonly surrounding Spring microservices
- Message-driven processing — design idempotent consumers, retries, and dead-letter handling for queues or event brokers
- Resilience patterns — apply timeouts, circuit breakers, and bounded retries to remote calls without multiplying failure traffic

### Testing depth

- Spring test slices — choose `@WebMvcTest`, `@DataJpaTest`, or a full context according to the boundary under test
- Testcontainers — run integration tests against disposable real infrastructure instead of relying only on in-memory substitutes
- Contract and integration testing — verify database, HTTP, and messaging boundaries where unit mocks cannot expose configuration errors

---

## Java

Concepts expected once core Java semantics are fluent and the developer must design maintainable concurrent and library-facing code.

### Modern language modelling

- Records — model immutable data carriers and understand generated equality, accessors, and constructor constraints
- Sealed classes and interfaces — constrain a hierarchy so exhaustive domain modelling is explicit
- Pattern matching — use modern `instanceof` and switch patterns without hiding unclear domain boundaries

### Generics and reflection

- Bounded wildcards and PECS — design producer/consumer APIs without unsafe casts or unnecessary invariance
- Generic type erasure — recognise runtime type limitations and the consequences for reflection and overloaded APIs
- Reflection and runtime annotations — inspect metadata deliberately while understanding lost compile-time safety and framework cost

### Concurrency foundations

- Thread safety and shared mutable state — identify races and prefer immutability or confinement before adding locks
- Executors and task submission — manage bounded worker pools rather than creating unmanaged threads
- `CompletableFuture` composition — combine asynchronous stages with explicit error handling and executor awareness
- Synchronisation primitives — choose `synchronized`, locks, and concurrent collections according to the protected invariant

---

## Architecture

Concepts expected when a developer begins owning boundaries and trade-offs across multiple features or services.

### Application boundaries

- Hexagonal architecture — isolate domain logic behind ports so frameworks and infrastructure remain replaceable adapters
- Clean architecture — direct dependencies toward business policy while avoiding ceremonial layers with no independent responsibility
- Domain-driven design basics — identify bounded contexts, entities, value objects, and aggregates without treating DDD as folder naming
- CQRS — separate command and query models only when their behaviour or scaling needs genuinely diverge

### Distributed-system patterns

- API Gateway — centralise external routing and cross-cutting policies without moving business logic into the gateway
- Circuit breaker — stop repeated calls to a failing dependency and define recovery behaviour
- Event-driven architecture — publish domain-relevant events while handling delivery, ordering, idempotency, and eventual consistency
- Saga awareness — coordinate multi-service business operations through compensating actions rather than a distributed database transaction

### Design patterns in context

- Strategy, Factory, Builder, Observer, and Decorator — recognise the problem each pattern solves and avoid applying names without the corresponding pressure
- Pattern trade-offs — compare added indirection with the concrete variation or coupling the pattern removes

---

## Security

Concepts expected when a developer owns authentication integration and operational defences rather than only consuming a JWT-protected API.

### Identity and token lifecycle

- OAuth 2.0 roles and flows — distinguish client, resource owner, authorization server, and resource server in an appropriate authorization flow
- OpenID Connect — add identity claims and an ID token to OAuth without confusing authentication with API authorization
- Access-token and refresh-token rotation — limit access-token lifetime and detect refresh-token reuse
- Token revocation — invalidate credentials before natural expiry using stateful revocation or short-lived-token strategies

### Application and transport hardening

- Rate limiting and brute-force defence — bound abusive traffic by identity and endpoint while preserving legitimate retries
- Security headers — configure CSP, framing, content-type, referrer, and HSTS policies according to the deployed application
- TLS termination and certificate lifecycle — understand where HTTPS terminates, how certificates renew, and which hop remains protected
- Secrets rotation — replace credentials without source changes or avoidable downtime

---

## TypeScript

Concepts expected when a developer designs reusable type-safe APIs instead of only consuming application models.

### Type transformation

- Mapped types — derive related object shapes while preserving or deliberately changing modifiers
- Conditional types — select a type from an assignability condition without creating unreadable type-level programs
- `infer` in conditional types — extract a component type from another type's structure
- Template literal types — model constrained string protocols and event names from existing unions
- Advanced utility-type composition — combine standard utilities without erasing required domain invariants

### API and project boundaries

- `satisfies` — validate a value against a contract while retaining its narrower inferred type
- Declaration merging and module augmentation — extend compatible library types without silently changing unrelated global contracts
- Custom decorator typing — preserve constructor, method, and metadata types when a framework requires decorators
- Project references and `tsc --build` — split large repositories into incremental type-checking boundaries
- Declaration files — describe untyped JavaScript libraries and publish stable public TypeScript APIs

---

## JavaScript

Concepts expected when a developer diagnoses asynchronous behaviour and designs reusable language-level abstractions.

### Async control and iteration

- Debounce vs throttle implementation — control bursty events according to final-value or maximum-rate semantics
- `AbortController` — propagate cancellation through supported asynchronous APIs and distinguish cancellation from failure
- Iterators and iterable protocols — expose sequence traversal without leaking the collection's representation
- Generators — implement lazy iteration and delegated sequences with explicit suspension points
- Async iterators — consume paginated or streaming asynchronous data with backpressure-aware iteration

### Runtime objects and memory

- `WeakMap` and weak references — associate metadata without preventing key collection and recognise nondeterministic cleanup
- `Proxy` and `Reflect` — intercept object operations while preserving language invariants
- `Symbol` — create collision-resistant property keys and implement well-known language protocols
- Closures and memory retention — diagnose when long-lived callbacks retain objects that should be collectable

---

## CSS

Concepts expected when a developer owns component-system styling and responsive behaviour beyond ordinary page layouts.

### Modern cascade and authoring

- Cascade layers with `@layer` — order style origins deliberately without escalating selector specificity
- `:has()` relational selectors — style an element from descendant or sibling state while considering selector cost and browser support
- Native CSS nesting — organise related selectors without changing the resulting specificity unintentionally

### Component-responsive layout

- Container queries — adapt a component to its available container rather than the global viewport
- Subgrid — align nested content with an ancestor grid when independent nested tracks would drift
- Registered custom properties with `@property` — give custom properties syntax, inheritance, and animatable initial values

---

## SQL

Concepts expected when a developer diagnoses query behaviour and maintains database structures beyond routine application queries.

### Query diagnosis

- `EXPLAIN ANALYZE` — compare planner estimates with actual execution while recognising that the statement really runs
- Plan operators and row estimates — identify scans, joins, sorts, and cardinality errors before guessing at an index
- Composite-index design — order columns according to real predicates, selectivity, and sorting needs

### Data modelling and advanced querying

- Normal forms and deliberate denormalisation — remove update anomalies and justify duplication only for a measured access pattern
- Recursive CTEs — traverse hierarchical or graph-shaped relational data with a safe termination condition
- Materialized views — trade freshness and refresh cost for precomputed expensive reads
- Locking and deadlock diagnosis — recognise competing lock order and design transactions that reduce contention

---

## Git

Concepts expected when a developer helps maintain team history, release flow, and repository automation.

### Investigation and release history

- Annotated tags and semantic versions — mark immutable release points with metadata tied to a release policy
- `git bisect` — use binary search over history to identify the first bad commit with a reproducible check
- Reflog-based recovery — recover locally reachable commits after destructive-looking branch or reset mistakes

### Team workflow design

- Git hooks — automate local checks while recognising that unshared hooks cannot enforce a team policy
- Trunk-based development vs Git Flow — choose branch lifetime and release structure from delivery constraints rather than habit
- `git worktree` — keep multiple checked-out branches without stashing or duplicating the repository
- CI workflows triggered by Git — connect push and pull-request events to reproducible checks without storing secrets in the repository

---

## General

Framework-neutral concepts expected when a developer owns integration and operational decisions across features.

### API evolution and communication

- API versioning — evolve a contract through URL, header, or media-type strategies according to consumer independence
- OpenAPI as a shared contract — use machine-readable API descriptions for documentation, validation, and client generation
- WebSockets vs Server-Sent Events — choose bidirectional or server-push communication from the actual interaction model
- GraphQL vs REST — compare client-selected graphs with resource-oriented HTTP contracts and their operational trade-offs

### Runtime and performance reasoning

- Caching layers — distinguish browser, HTTP, application, and distributed caches and define invalidation before adding one
- Big O reasoning — compare time and space growth while recognising that real input sizes and constants still matter
- Functional-programming principles — apply purity, immutability, and composition where they reduce hidden state rather than as a style mandate
- Backpressure awareness — recognise when producers can outpace consumers in streams, queues, or real-time connections

---
