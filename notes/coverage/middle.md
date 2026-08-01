# Global Middle Coverage — All Topics

Combined middle-level coverage for every topic in the notes folder.
Source files: one `coverage/middle.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
This level becomes active only after the junior level is complete and consolidated.
Order follows study priority: Angular → Angular Material → Spring → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

### State and reusable component APIs

- `model()` component APIs — expose a writable value and matching change output when a reusable component deliberately owns two-way binding
- NgRx Store architecture — use actions, reducers, selectors, and effects when application-wide state requires explicit event flow and tooling
- `@ngrx/signals` stores — model shared state with signal-store features while preserving clear ownership and side-effect boundaries
- `ControlValueAccessor` — build a reusable custom control that participates in Angular forms, validation, disabled state, and touched state

### Advanced reactive integration

- `toSignal()` configuration and injection context — control initial values, equality, cleanup, and custom injectors when basic conversion is insufficient
- `toSignal()` vs `toObservable()` — cross the signal/Observable boundary in the direction required by an integration without wrapping reactive primitives back and forth
- RxJS retry policies — retry only failures whose operation and failure mode make another attempt safe

### Rendering, loading, and diagnostics

- Route preloading strategies — balance later-navigation latency against background bandwidth using measured route usage
- `@defer` blocks — choose viewport, interaction, or idle triggers for heavy template dependencies
- Signal `resource()` APIs — evaluate signal-native asynchronous loading against established `HttpClient` and RxJS patterns only when the project's Angular version provides the required stable API
- `ChangeDetectorRef` — use manual marking, detection, or detachment only when normal Angular notifications cannot model an integration
- Bundle and rendering profiling — use Angular DevTools and build statistics to find a measured bottleneck before optimising

## Angular Material

### Theming and custom controls

- Custom theme palettes — define product palettes and semantic colours instead of relying only on prebuilt themes
- Component and theme token overrides — customise a narrow visual contract without depending on brittle internal selectors
- Selective theme emission — choose all-component or per-component base, colour, typography, and density mixins while preventing duplicated CSS output
- Runtime dark mode — switch complete theme token sets while preserving contrast and user preference
- Material custom form controls — integrate a `ControlValueAccessor` with `mat-form-field`, validation, focus, and error state
- Custom error-state policies — implement and provide an `ErrorStateMatcher` when the product's submission or cross-field rules cannot use Material's default interaction timing ✅ 05-task-manager

### CDK and scale-oriented components

- Angular CDK — choose low-level overlay, portal, drag-drop, and accessibility primitives when Material has no suitable component ✅ 05-task-manager
- Virtual scrolling — render large collections through `CdkVirtualScrollViewport` and understand its fixed/dynamic sizing trade-offs
- `MatAutocomplete` with remote data — combine form streams, cancellation, loading, and option identity for production lookup fields
- Hierarchical and dense navigation — choose `MatTree`, tabs, or expansion panels according to information structure rather than appearance
- Multi-value inputs — implement chips, selection, removal, keyboard interaction, and validation for tag-like data
- Programmatic stepper navigation — drive step movement from component code without bypassing linear validity, focus, or error presentation ✅ 06-hr-portal
- Conditional stepper flows — include, skip, or reorder steps according to earlier answers while keeping the linear contract coherent

## Spring

### Container extension and lifecycle

- `@Bean` method dependencies — prefer parameters for explicit wiring that also works in lite configuration; calls between methods are container-intercepted only in full `@Configuration` mode with bean-method proxying enabled
- Map injection — inject beans of one value type under their bean names as keys when callers need both strategy lookup and container-defined identity
- Shorter-lived beans inside singletons — direct injection resolves the dependency when the singleton is created, so use a provider or scoped proxy only when each runtime use genuinely needs the current prototype, request, or session instance
- Bean post-processors — understand and implement container hooks that inspect or wrap beans without confusing them with ordinary application services
- Factory beans — expose an object created by specialised factory logic while distinguishing the factory bean from the object it produces
- Programmatic bean registration — register definitions dynamically only when configuration cannot be expressed clearly through normal component or `@Bean` declarations
- Custom scopes — define non-standard bean lifetimes only when an integration has a real lifecycle the built-in scopes cannot model
- Context hierarchies — use parent and child contexts deliberately when infrastructure and application beans require separate visibility boundaries

### AOP and transaction design

- Shared-transaction rollback-only failure — catching an inner transactional failure may still leave the shared transaction rollback-only and make the outer commit fail
- JDK vs class-based proxy constraints — diagnose interface exposure, final or private methods, and other proxy-strategy limits when advice is missing
- Pointcut and advice design — target the smallest stable join-point set and avoid broad expressions that silently wrap unrelated application behaviour
- Advice precedence — control ordering when transactions, retries, security, caching, or custom advice must observe failures in a specific sequence
- Programmatic transactions — use `TransactionTemplate` when one method needs transaction boundaries that cannot be expressed safely with proxy-based annotations
- Propagation choices — select `REQUIRES_NEW`, `NESTED`, or non-transactional propagation only from a deliberate failure and consistency contract
- Isolation and concurrency anomalies — choose an isolation level from the data anomaly the operation must prevent rather than escalating every transaction globally
- Multiple transaction managers — route a boundary to the correct resource manager and recognise that separate managers do not provide distributed atomicity

### Events, scheduling, and caching

- Transaction-bound events — use `@TransactionalEventListener` when a reaction must follow a particular transaction phase and define what happens when no transaction exists
- Asynchronous event listeners — move work off the publisher thread only with explicit executor, ordering, failure, and context-propagation decisions
- Scheduled task execution — configure scheduling and its executor so one slow task does not delay every other scheduled method
- Declarative caching — place `@Cacheable`, `@CachePut`, and eviction around stable reads while defining keys and invalidation before relying on cached state
- Cache proxy limitations — account for self-invocation, mutable return values, and exceptions when diagnosing why an annotated method did not cache as expected

### Integration and test infrastructure

- Spring `Validator`, binding, and validation groups — implement reusable validation rules or phased constraint sets when annotations on one input model are insufficient
- Custom type conversion — register converters or formatters for reusable boundary types instead of parsing the same representation in controllers
- Context caching and `@DirtiesContext` — preserve reusable test contexts and invalidate one only when a test mutates container state that cannot be restored
- Framework integration testing — prove proxy advice, transaction boundaries, events, and lifecycle callbacks with a real Spring context where a plain unit test cannot observe them

## Spring Boot

### Production boundaries and diagnostics

- Custom Spring Data entity newness — use version/id inspection or `Persistable.isNew()` deliberately when assigned identifiers or unusual lifecycle rules make the default decision incorrect
- Identifier generation performance — evaluate sequence allocation and identity batching trade-offs only when measured persistence throughput or database portability makes them relevant
- Dynamic query construction with `Specification<T>` — compose type-safe Criteria API predicates through `JpaSpecificationExecutor` so a query carries only the filters actually supplied, instead of a JPQL string whose every optional parameter needs its own null check ✅ 07-timetrack
- Multiple security chains — order matcher-specific `SecurityFilterChain` beans when one application exposes genuinely different security boundaries
- Filter dispatch control — decide whether a `OncePerRequestFilter` participates in async or error dispatches and test those paths explicitly
- MVC method-validation models — align exception handling with built-in method validation or the older AOP-based `@Validated` path when maintaining mixed framework generations
- Spring Boot Actuator — expose and secure health, metrics, and diagnostic endpoints for operations
- OpenAPI contract maintenance — keep generated documentation aligned with validation, error responses, and consumer-visible DTOs

### Distributed application foundations

- Microservice boundaries — split by business capability only when independent ownership and deployment justify distributed complexity
- Spring Cloud configuration and discovery awareness — recognise the infrastructure patterns commonly surrounding Spring microservices
- Message-driven processing — design idempotent consumers, retries, and dead-letter handling for queues or event brokers
- Resilience patterns — apply timeouts, circuit breakers, and bounded retries to remote calls without multiplying failure traffic

### Testing depth

- Testcontainers — run integration tests against disposable real infrastructure instead of relying only on in-memory substitutes
- Contract and integration testing — verify database, HTTP, and messaging boundaries where unit mocks cannot expose configuration errors

## Java

### Language modelling and API design

- Sealed classes and interfaces — constrain a hierarchy so exhaustive domain modelling is explicit
- Record invariants and defensive copying — enforce valid immutable data in compact constructors when record components include mutable objects
- Pattern-matching switch and guarded cases — model exhaustive type-based decisions without turning domain design into procedural branching

### Generics and reflection

- Bounded wildcards and PECS — design producer/consumer APIs without unsafe casts or unnecessary invariance
- Generic type erasure — recognise runtime type limitations and the consequences for reflection and overloaded APIs
- Reflection and runtime annotations — inspect metadata deliberately while understanding lost compile-time safety and framework cost
- Meta-annotations and annotation processing — design annotation contracts and distinguish compile-time processors from runtime reflection or framework scanning

### Streams and collection design

- Primitive stream specialisations and numeric aggregation — use `IntStream`, `LongStream`, or `DoubleStream` when boxing would obscure a measured or API-relevant cost
- Downstream collectors and multi-level grouping — design `groupingBy`, partitioning, reduction, and map results whose types remain understandable to callers ✅ 07-timetrack
- Custom collection API contracts — expose mutability, ordering, null, ownership, and defensive-copy guarantees explicitly at service and library boundaries

### Concurrency foundations

- Thread safety and shared mutable state — identify races and prefer immutability or confinement before adding locks
- Executors and task submission — manage bounded worker pools rather than creating unmanaged threads
- `CompletableFuture` composition — combine asynchronous stages with explicit error handling and executor awareness
- Synchronisation primitives — choose `synchronized`, locks, and concurrent collections according to the protected invariant

## Architecture

### Application boundaries

- Hexagonal architecture — isolate domain logic behind ports so frameworks and infrastructure remain replaceable adapters
- Clean architecture — direct dependencies toward business policy while avoiding ceremonial layers with no independent responsibility
- Domain-driven design basics — identify bounded contexts, entities, value objects, and aggregates without treating DDD as folder naming
- CQRS — separate command and query models only when their behaviour or scaling needs genuinely diverge

### Distributed-system patterns

- Synchronous request vs asynchronous event — a direct call gives an immediate result and temporal coupling, while an event decouples timing but introduces delayed consistency, delivery, and ordering concerns
- API Gateway — centralise external routing and cross-cutting policies without moving business logic into the gateway
- Circuit breaker — stop repeated calls to a failing dependency and define recovery behaviour
- Event-driven architecture — publish domain-relevant events while handling delivery, ordering, idempotency, and eventual consistency
- Saga awareness — coordinate multi-service business operations through compensating actions rather than a distributed database transaction

### Design patterns in context

- Architecture-focused code review — trace a change through its dependency graph and verify that each responsibility and dependency still respects the declared boundaries before approving it
- Strategy pattern — vary behaviour behind a stable contract when independent algorithms or policies
  must evolve without branching through the caller
- Factory pattern — own creation policy when selecting and assembling concrete collaborators is a
  responsibility that should not leak into consumers
- Builder pattern — construct complex objects step by step when optional combinations or readability
  justify more machinery than a constructor or factory method
- Observer pattern — decouple publishers from subscribers while defining lifecycle, ordering, and
  failure behaviour explicitly
- Decorator pattern — add behaviour around a collaborator without subclass proliferation while
  preserving the wrapped contract
- Contract-testing strategy — define executable provider/consumer boundary checks when independently
  evolving services or modules would otherwise discover contract drift only after integration
- Pattern trade-offs — compare added indirection with the concrete variation or coupling the pattern removes

## Security

### Identity and token lifecycle

- OAuth 2.0 roles and flows — distinguish client, resource owner, authorization server, and resource server in an appropriate authorization flow
- OpenID Connect — add identity claims and an ID token to OAuth without confusing authentication with API authorization
- Refresh-token rotation and reuse detection — operate the refresh-token family lifecycle and respond
  when an already rotated credential is presented again
- Token-revocation strategy — design and operate early invalidation using stateful revocation,
  credential versioning, or deliberately short-lived access tokens

### Application and transport hardening

- Distributed rate-limit policy — design limits across instances and identities, choose storage and
  failure behaviour, and balance abusive traffic against legitimate retries
- Security-header policy — design and operate CSP, framing, content-type, referrer, and HSTS policies
  for the application's deployed content and integrations
- TLS termination and certificate lifecycle — understand where HTTPS terminates, how certificates renew, and which hop remains protected
- Secrets rotation — replace credentials without source changes or avoidable downtime
- Segregation of duties — design independent approval and sign-off controls so privileged workflows
  cannot be completed by the same actor ✅ 07-timetrack — `approve`/`reject` refuse a manager whose id matches the entry's owner
- Vulnerability reachability and risk acceptance — analyse affected components, configuration, and
  reachable code paths, then document remediation priority or a justified acceptance decision

## TypeScript

### Type transformation

- Mapped types — derive related object shapes while preserving or deliberately changing modifiers
- Conditional types — select a type from an assignability condition without creating unreadable type-level programs
- `infer` in conditional types — extract a component type from another type's structure
- Template literal types — model constrained string protocols and event names from existing unions
- Advanced utility-type composition — combine standard utilities without erasing required domain invariants
- `Exclude<T, U>` and `Extract<T, U>` — filter union members by assignability when designing reusable derived contracts
- `ReturnType<T>` and `Parameters<T>` — derive callable contracts without manually duplicating function signatures
- Assertion functions — design `asserts` signatures whose runtime failure and compile-time narrowing remain aligned
- Generic parameter defaults — provide ergonomic reusable APIs without hiding an important type choice

### API and project boundaries

- Declaration merging and module augmentation — extend compatible library types without silently changing unrelated global contracts
- `const enum` trade-offs — evaluate inlining against isolated compilation, library publication, and tooling compatibility
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — adopt stricter project-wide semantics and manage the migration cost across an application
- Custom decorator typing — preserve constructor, method, and metadata types when a framework requires decorators
- Project references and `tsc --build` — split large repositories into incremental type-checking boundaries
- Declaration files — describe untyped JavaScript libraries and publish stable public TypeScript APIs

## JavaScript

### Async control and iteration

- Timer-and-state mechanics for rate limiting — implement quiet-period and maximum-rate behaviour without duplicate calls or stale state
- Iterators and iterable protocols — expose sequence traversal without leaking the collection's representation
- Generators — implement lazy iteration and delegated sequences with explicit suspension points
- Async iterators — consume paginated or streaming asynchronous data with backpressure-aware iteration

### Runtime objects and memory

- `Object.is` edge semantics — choose SameValue comparison when `NaN` equality or signed zero must differ from strict equality
- Sparse-array behaviour — diagnose holes, explicit `undefined`, length, and iteration-method differences in array-like data
- `WeakMap` and weak references — associate metadata without preventing key collection and recognise nondeterministic cleanup
- `Proxy` and `Reflect` — intercept object operations while preserving language invariants
- `Symbol` — create collision-resistant property keys and implement well-known language protocols
- Retained-object diagnosis — trace long-lived callbacks and lexical environments that keep otherwise-unused objects collectable

### Module graph diagnosis

- Live module bindings — diagnose updates and initialisation order across imported and exported bindings
- Circular module dependencies — resolve partially initialised or order-sensitive module graphs instead of masking the cycle
- Tree-shaking constraints — design analyzable module boundaries and controlled side effects so bundlers can remove unused code

## CSS

### Modern cascade and authoring

- `:has()` relational selector — read and write simple parent- or sibling-state selectors while keeping a class or state attribute as the clearer option when application logic already owns the state
- `:is()` vs `:where()` — both group selector alternatives, but `:is()` takes the specificity of its most specific argument while `:where()` always contributes zero specificity
- Cascade layers with `@layer` — order style origins deliberately without escalating selector specificity
- Native CSS nesting — organise related selectors without changing the resulting specificity unintentionally
- Sass nesting vs native CSS nesting — compare their parsing and emitted-selector behaviour before migrating build-time Sass syntax to the platform
- Deep BEM structures — keep element names flat rather than encoding DOM depth when a team chooses BEM for a large global stylesheet

### Component-responsive layout

- Intrinsic sizing — recognise `min-content`, `max-content`, and `fit-content()` as sizes derived from content rather than arbitrary fixed dimensions
- Container queries — adapt a component to its available container rather than the global viewport
- Subgrid — align nested content with an ancestor grid when independent nested tracks would drift
- Registered custom properties with `@property` — give custom properties syntax, inheritance, and animatable initial values

## SQL

### Query diagnosis

- `EXPLAIN ANALYZE` — compare planner estimates with actual execution while recognising that the statement really runs
- Plan operators and row estimates — identify scans, joins, sorts, and cardinality errors before guessing at an index
- Composite-index design — order columns according to real predicates, selectivity, and sorting needs
- Query rewrites — compare equivalent joins, correlated subqueries, pre-aggregation, and set-based formulations using measured plans rather than universal speed rules
- Partial, expression, and covering indexes — match specialised index structures to a measured predicate or access pattern

### Data modelling and advanced querying

- `DENSE_RANK()` vs `RANK()` — both give ties the same rank, but `DENSE_RANK()` does not leave gaps after a tie; choose it when the next distinct value must receive the next consecutive rank
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; use it for comparisons between consecutive rows
- Partition total vs running total — `SUM(value) OVER (PARTITION BY group_key)` repeats the whole partition total; adding `ORDER BY` and an explicit cumulative frame produces a running total
- Normal forms and deliberate denormalisation — remove update anomalies and justify duplication only for a measured access pattern
- Recursive CTEs — traverse hierarchical or graph-shaped relational data with a safe termination condition
- Views vs materialized views — a normal view stores a query and reads current base data, while a materialized view stores results and needs an explicit refresh; choose from freshness, read cost, and refresh cost
- Window frames — choose `ROWS`, `RANGE`, or `GROUPS` boundaries deliberately for cumulative and moving analytics, including peer-row behaviour
- Isolation anomalies — distinguish dirty reads, non-repeatable reads, phantom reads, and lost updates when selecting a transaction strategy
- PostgreSQL snapshot behaviour — reason about statement snapshots in `READ COMMITTED` and transaction snapshots in stronger isolation levels
- Row locking with `SELECT ... FOR UPDATE` — coordinate read-then-change workflows while keeping locked scopes and transaction duration small
- Locking and deadlock diagnosis — recognise competing lock order and design transactions that reduce contention

## Git

### Investigation and release history

- Semantic version and release-tag policy — maintain release identifiers intended to remain stable and align them with the team's compatibility policy

### Team workflow design

- Git hooks — automate local checks while recognising that unshared hooks cannot enforce a team policy
- Trunk-based development vs Git Flow — choose branch lifetime and release structure from delivery constraints rather than habit
- `git worktree` — keep multiple checked-out branches without stashing or duplicating the repository

## General

### API evolution and communication

- API versioning — evolve a contract through URL, header, or media-type strategies according to consumer independence
- OpenAPI contract governance — manage compatibility, validation, and generated consumers from a machine-readable description instead of only rendering documentation
- Redirect code selection — choose among `301`, `302`, `303`, `307`, and `308` from permanence and whether the original method and body must be preserved
- WebSockets vs Server-Sent Events — choose bidirectional or server-push communication from the actual interaction model
- GraphQL vs REST — compare client-selected graphs with resource-oriented HTTP contracts and their operational trade-offs

### Runtime and performance reasoning

- CI workflows triggered by Git — connect push and pull-request events to reproducible checks without storing secrets in the repository
- Caching layers — choose among browser, HTTP, application, and distributed caches and define invalidation after mastering HTTP freshness and validators
- Image tag vs digest — choose a movable version label or exact immutable image identity according to the deployment's reproducibility requirement
- Functional-programming principles — apply purity, immutability, and composition where they reduce hidden state rather than as a style mandate
- Backpressure awareness — recognise when producers can outpace consumers in streams, queues, or real-time connections
- Request correlation and trace context — propagate identifiers across services so production logs and traces can reconstruct one distributed request
- Verification vs validation in testing — distinguish conformance to a specification from evidence that the delivered behaviour solves the intended user need
- Test-double boundary design — choose among dummy, stub, fake, mock, and spy roles and decide which dependency boundary should be replaced rather than treating every collaborator as a mock
