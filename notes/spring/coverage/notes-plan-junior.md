# Spring Junior Notes Plan

Plan status: current
Coverage: notes/spring/coverage/junior.md
Coverage SHA-256: 73e2ef58b752604921127c902222c05a749987406b792406221708784b06e9a5
Generated: 2026-08-01

## 00 — Spring Framework orientation

Status: pending
Action: create
English: notes/spring/junior/en/00-spring-framework-orientation.md
Spanish: notes/spring/junior/es/00-orientacion-spring-framework.md
Depends on: none
Pending additions: none

Narrative role: Introduce the problem Spring solves, contrast its managed object graph with manually composed JavaScript/TypeScript modules and React objects without implying equivalent lifecycles, place it beneath Spring Boot, and map the complete route from container ownership to maintained-code recognition.

Learning outcome: Victor can explain what the Spring Framework contributes to an application, distinguish it from Spring Boot, and justify the complete 01–11 route through container ownership, registration, resolution, lifecycle, context services, environment, proxies, transactions, validation, testing, and maintained code.

Prerequisites: none.

Must answer:

- What problem does Spring solve that manually constructing and connecting every application object does not scale to handle?
- How do Spring Framework and Spring Boot differ, and where does each sit in Victor's Java backend stack?
- What recurring mental model connects beans, scopes, proxies, transactions, validation, and Spring tests?
- Why must the route learn container ownership before relying on annotation-driven behaviour?
- How does a Spring-managed object graph differ from manually composing JavaScript/TypeScript modules or React objects, and where does that comparison stop being valid?
- What is the complete 01–11 study route, and why does each chapter create the need for the next one?

Coverage concepts:

Rationale: The introduction is required pedagogical scaffolding and previews the complete route without teaching later mechanisms prematurely.

Handoff: With the map established, the next chapter opens the container and traces how Spring turns definitions into managed objects and resolved dependencies.

## 01 — The container and managed objects

Status: pending
Action: create
English: notes/spring/junior/en/01-container-and-managed-objects.md
Spanish: notes/spring/junior/es/01-contenedor-y-objetos-gestionados.md
Depends on: 00
Pending additions: none

Narrative role: Establish the runtime mechanism behind Spring before introducing the several ways beans enter that runtime registry.

Learning outcome: Victor can trace how control moves from application classes to the container, identify whether an object is managed, and explain what `ApplicationContext` adds over the lower-level factory contract.

Prerequisites: 00.

Must answer:

- What control is inverted, and what exact work does the container take over?
- What is a bean definition, how does its metadata differ from the instantiated bean, and why are registration sources deferred to the next chapter?
- What happens between a bean definition entering the context and a collaborator receiving the resulting object?
- Why does an annotation have no Spring behaviour on an instance created with `new`?
- When maintained code mentions `BeanFactory`, how does it relate to the `ApplicationContext` normally used by applications?

Coverage concepts:

- [ ] Inversion of Control and dependency injection — the container creates and connects application objects so classes declare collaborators instead of locating or constructing infrastructure themselves
- [ ] `ApplicationContext` and the IoC container — recognise the runtime registry that holds bean definitions, creates managed objects, resolves dependencies, and publishes framework services
- [ ] Bean vs ordinary object — Spring lifecycle, injection, scopes, and proxy-backed annotations apply only to objects obtained from the container, not to instances created with `new`
- [ ] `BeanFactory` vs `ApplicationContext` — recognise the lower-level bean factory contract while using the application context for events, resources, environment, and normal application integration

Rationale: These concepts form one foundational mental model: container ownership determines object creation, dependency resolution, lifecycle, and access to higher-level framework services.

Handoff: Once container ownership is clear, the next question is where bean definitions come from and how scanning and configuration register them.

## 02 — Registering and discovering beans

Status: pending
Action: create
English: notes/spring/junior/en/02-registering-and-discovering-beans.md
Spanish: notes/spring/junior/es/02-registro-y-descubrimiento-de-beans.md
Depends on: 01
Pending additions: none

Narrative role: Turn the abstract container into a concrete registry by comparing component discovery with explicit Java configuration.

Learning outcome: Victor can choose scanning or `@Bean` registration, predict names and candidates created by each route, and diagnose a component that sits outside the scan boundary.

Prerequisites: 01.

Must answer:

- How does component scanning decide which classes become bean definitions and which packages it can see?
- Why do layer-specific stereotypes communicate responsibility even though they are components?
- When should application-owned code use scanning, and when should third-party or explicitly constructed objects use `@Bean`?
- How can a repository stereotype change the exception type observed by application code?
- What before-and-after path turns a provider-specific persistence exception into a portable `DataAccessException`, which infrastructure activates that translation, and why is persistence only a cross-topic preview here?
- When does a bean name matter if dependency resolution normally begins with the type?

Coverage concepts:

- [ ] Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while keeping each layer's responsibility explicit ✅ 07-timetrack
- [ ] `@Repository` exception translation — with Spring's persistence-exception translation infrastructure, the stereotype lets provider-specific failures surface through the portable `DataAccessException` hierarchy ✅ 07-timetrack
- [ ] Component scanning — understand that scanning searches configured packages for candidate components, so a valid stereotype outside the scan boundary still produces a missing-bean failure
- [ ] `@Configuration` and `@Bean` — register third-party instances or explicit construction logic in Java configuration and use scanning for application-owned component classes ✅ 07-timetrack
- [ ] Bean names and type lookup — beans are normally resolved by type, while names become relevant when several candidates share that type or external integration refers to a bean explicitly

Rationale: All five concepts explain how definitions reach the same registry and what metadata later resolution and persistence integration derive from them.

Handoff: Registered beans create a candidate pool; the next chapter follows how Spring selects from that pool and supplies collaborators safely.

## 03 — Dependency injection and candidate resolution

Status: pending
Action: create
English: notes/spring/junior/en/03-dependency-injection-and-candidate-resolution.md
Spanish: notes/spring/junior/es/03-inyeccion-de-dependencias-y-resolucion-de-candidatos.md
Depends on: 02
Pending additions: none

Narrative role: Follow one diagnostic object-graph example in two parts: first design an explicit constructor boundary and trace candidate selection; then vary the candidate set to diagnose absence, ambiguity, cycles, and maintained injection styles.

Learning outcome: Victor can design explicit constructor-injected boundaries and diagnose missing, ambiguous, optional, collection, or cyclic dependencies without changing annotations by trial and error.

Prerequisites: 02.

Must answer:

- Why does constructor injection make an invalid object graph fail early and make a class easier to test?
- What is Lombok, what does `@RequiredArgsConstructor` generate for `final` fields, and why can an all-argument constructor expose the wrong boundary?
- What differs between a required dependency, an optional lookup, a provider lookup, and collection injection when no candidate exists?
- How do `@Qualifier` and `@Primary` resolve ambiguity at different decision points?
- In what order does Spring narrow candidates by type and explicit selection metadata before choosing a default or reporting failure?
- How do `Optional<T>` injection and `ObjectProvider<T>` differ in timing, repeated lookup, and absence semantics?
- Why is a constructor cycle primarily a design problem rather than a reason to switch to field injection?
- How should Victor read `@Autowired`, `@Inject`, and `@Resource` in maintained code without adopting several new-code styles?

Coverage concepts:

- [ ] Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor ✅ 07-timetrack
- [ ] Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while an all-argument constructor is usually the wrong service boundary
- [ ] `@Autowired` requiredness — an autowired dependency is required by default; constructor inference removes the annotation, while `Optional`, `ObjectProvider`, or explicit requiredness changes absence semantics deliberately
- [ ] Collection injection — inject all beans of a type and know that empty resolution depends on the injection form: required fields or methods normally need a candidate, while a sole constructor or factory-method parameter may receive an empty collection
- [ ] `ObjectProvider<T>` — defer or optionally request a dependency when its availability or scope genuinely varies instead of hiding a required collaborator behind null
- [ ] `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- [ ] Dependency resolution failures — distinguish no candidate, multiple candidates, and a dependency cycle before changing annotations at random
- [ ] Circular dependencies — treat a constructor cycle as a design signal that responsibilities or dependency direction need correction rather than hiding it with field injection
- [ ] Field and setter injection — recognise `@Autowired` on fields or setters in existing code and explain the hidden-dependency and testability trade-offs compared with constructor injection
- [ ] `@Autowired` vs `@Inject` vs `@Resource` — recognise Spring, Jakarta, and name-oriented legacy injection annotations while preferring one consistent constructor-injection style in new code

Rationale: These are the normal and failure paths of one mechanism—selecting candidates and delivering dependencies at an injection point.

Handoff: A resolved bean is not merely constructed once; the next chapter adds lifetime, sharing, initialization, and destruction to the object graph.

## 04 — Bean scopes, sharing, and lifecycle

Status: pending
Action: create
English: notes/spring/junior/en/04-bean-scopes-sharing-and-lifecycle.md
Spanish: notes/spring/junior/es/04-scopes-comparticion-y-ciclo-de-vida-de-beans.md
Depends on: 03
Pending additions: none

Narrative role: Extend bean creation into time by showing how scope controls instance reuse and how lifecycle callbacks surround the usable phase.

Learning outcome: Victor can choose an appropriate built-in scope, keep shared services stateless, separate scope from thread safety, and place initialization or cleanup in the correct lifecycle phase.

Prerequisites: 03.

Must answer:

- What exactly is shared by Spring's singleton scope, and why is that not the GoF Singleton pattern?
- What is the GoF Singleton pattern before it is contrasted with a container-managed singleton scope?
- When does the container create a prototype, request, or session instance, and who can share it?
- Why can a singleton bean be thread-safe or unsafe independently of its scope name?
- What changes when `@Lazy` postpones singleton creation, including when failures surface?
- In what order do instantiation, injection, initialization, use, and destruction occur?
- Why should operational lifecycle work use callbacks instead of a constructor?
- Why does the container stop managing a prototype bean's destruction after handing it to the caller, and what does that mean for `@PreDestroy`?

Coverage concepts:

- [ ] Singleton scope and stateless services — the default shares one bean instance across callers, so mutable request-specific state on a service can leak across users and threads
- [ ] Singleton bean scope vs Singleton pattern — Spring's scope means one managed instance per bean definition in a container, not a class-enforced global instance with a private constructor
- [ ] Prototype scope — the container creates a new instance each time that bean is requested, unlike the shared singleton default
- [ ] Web-aware request and session scopes — recognise per-request and per-session lifetimes so request-specific state is not placed on a shared singleton
- [ ] Scope vs thread safety — bean scope controls instance lifetime and sharing, while thread safety depends on how mutable state is accessed
- [ ] Eager singleton creation vs `@Lazy` — non-lazy singletons are normally pre-instantiated when the context refreshes, while lazy creation postpones construction, lifecycle work, and related failures until first use
- [ ] Bean lifecycle phases — follow instantiation, dependency injection, initialization callbacks, ready use, and destruction so a failure can be placed in the correct phase
- [ ] `@PostConstruct` and `@PreDestroy` — run lifecycle work after injection or before managed destruction without putting operational work in a constructor

Rationale: Scope and lifecycle are two views of the same managed object's existence: how long it lives, who shares it, and what the container does around its usable period.

Handoff: With managed lifetime understood, the route can introduce the wrapper objects Spring uses to add behaviour around calls.

## 05 — Proxies and annotation-driven AOP

Status: pending
Action: create
English: notes/spring/junior/en/05-proxies-and-annotation-driven-aop.md
Spanish: notes/spring/junior/es/05-proxies-y-aop-dirigido-por-anotaciones.md
Depends on: 04
Pending additions: none

Narrative role: Explain the proxy call boundary that makes many Spring annotations active and the paths that bypass it.

Learning outcome: Victor can trace a call through a Spring proxy, identify the required infrastructure, and explain why unmanaged instances and self-invocation miss advice.

Prerequisites: 04.

Must answer:

- What cross-cutting problem does AOP solve without moving infrastructure policy into business methods?
- What object does a caller actually hold when Spring wraps a bean, and where does advice run?
- What are advice and an interceptor, and how do caller, proxy, and target participate in one intercepted call?
- At junior depth, how do interface-based and class-based proxies affect which target types and methods can be advised?
- Why does `this.someAdvisedMethod()` bypass the proxy even though both methods belong to the same bean?
- Why is an annotation inert when its matching processor or interceptor infrastructure is absent?

Coverage concepts:

- [ ] Cross-cutting concerns and AOP — apply behaviour such as transactions, security, caching, or logging around a method call without mixing that infrastructure policy into the method body
- [ ] Proxy-based annotation behaviour — Spring wraps eligible beans, so advice applies when a call crosses the proxy and silently does nothing on an unmanaged instance or self-invocation
- [ ] Self-invocation — a method calling another advised method on `this` bypasses the proxy, so moving the boundary or calling another bean is normally clearer than reaching for the proxy manually
- [ ] Proxy infrastructure activation — an annotation such as `@Transactional` or `@Validated` needs the matching Spring infrastructure; the annotation alone is inert in a bare context that has not enabled its processor

Rationale: The four bullets describe one call-interception mechanism, its purpose, activation requirement, and two most common bypass paths.

Handoff: Transactions are the first substantial application of that proxy model, so the next chapter traces one business call through transactional advice.

## 06 — Transaction boundaries and rollback

Status: pending
Action: create
English: notes/spring/junior/en/06-transaction-boundaries-and-rollback.md
Spanish: notes/spring/junior/es/06-limites-transaccionales-y-rollback.md
Depends on: 05
Pending additions: none

Narrative role: Apply the proxy mental model to database consistency, from boundary placement and metadata selection to propagation, rollback observation, and enlisted resources.

Learning outcome: Victor can place and explain a `@Transactional` boundary, predict default and configured rollback behaviour, and identify calls or resources that the transaction cannot cover.

Prerequisites: 05.

Must answer:

- When does the proxy open, join, commit, or roll back the transaction around a service call?
- What consistency problem does a transaction solve, and what do atomicity, commit, rollback, and resource participation mean before Spring adds a proxy?
- Why does the exact `@Transactional` import matter, and how do method and class metadata combine?
- Which exceptions trigger rollback by default, and what changes when code catches and suppresses one?
- Why do `new`, self-invocation, private helpers, and other non-proxy-eligible paths fail to create the promised boundary?
- What does `REQUIRED` do when an outer transaction already exists?
- Which resources participate in a local transaction, and why can an HTTP call or file write remain after database rollback?
- What does `readOnly = true` communicate, and what does it not guarantee?

Coverage concepts:

- [ ] `@Transactional` atomicity and rollback — group one business operation in a transaction and know that unchecked exceptions roll back by default while checked exceptions require an explicit rule ✅ 07-timetrack
- [ ] Spring's `@Transactional` vs the Jakarta annotation — two importable annotations with the same name use different attributes and integration semantics, so the import is part of the behaviour even though both normally roll back unchecked exceptions by default
- [ ] Transaction boundary placement — put the annotation on the externally invoked service method that spans the business operation, not on a controller, private helper, or isolated repository call ✅ 07-timetrack
- [ ] Method-level vs class-level `@Transactional` — a method annotation overrides class-level transaction metadata, so broad defaults belong on the class and exceptional boundaries stay explicit on methods
- [ ] Transactional proxy limitations — `new` instances, self-invocation, and non-proxy-eligible methods do not open the transaction the annotation appears to promise
- [ ] `@Transactional(readOnly = true)` — declare read intent so integrations may optimise work, without treating it as a portable guarantee that the database will reject writes ✅ 07-timetrack
- [ ] Caught exceptions and rollback — catching and suppressing an unchecked failure inside the advised method can let its proxy observe normal completion and commit remaining work
- [ ] Transaction propagation `REQUIRED` — recognise the default join-or-create behaviour so nested service calls participate in one boundary instead of assuming every annotation opens an independent transaction
- [ ] Transaction resource participation — a local Spring transaction covers only resources enlisted through its transaction-aware integrations; ordinary HTTP calls, files, or unenlisted messages do not roll back with the database

Rationale: Every item contributes to predicting the observable consistency outcome of one proxied business operation.

Handoff: Transaction resource participation exposed a broader question: how does the application context let managed objects communicate and access content without hard-coding an external system or storage location?

## 07 — ApplicationContext events and resources

Status: pending
Action: create
English: notes/spring/junior/en/07-applicationcontext-events-and-resources.md
Spanish: notes/spring/junior/es/07-eventos-y-recursos-de-applicationcontext.md
Depends on: 06
Pending additions: none

Narrative role: Extend `ApplicationContext` beyond bean creation through two context services that decouple a caller from event recipients or the physical location of content.

Learning outcome: Victor can use the context mental model to distinguish synchronous in-process events from durable messaging and access classpath, filesystem, or URL content through one resource contract.

Prerequisites: 06.

Must answer:

- On what thread and in what process does a default Spring application event listener run, and what delivery guarantees are absent?
- How does a listener failure propagate back to a synchronous publisher, and why is that different from a broker delivery guarantee?
- Why can a `Resource` represent classpath, filesystem, or URL content when not every resource can become a normal file?
- When is `Resource.getFile()` invalid even though the resource can still be read as a stream?

Coverage concepts:

- [ ] Spring application events vs external messaging — `ApplicationEventPublisher` notifies `@EventListener` methods in-process and synchronously by default; it provides neither broker durability nor cross-process delivery
- [ ] Spring `Resource` abstraction — read classpath, filesystem, and URL-backed content through one interface without assuming every resource is a normal file

Rationale: Both services belong to the richer application-context contract and replace a hard-coded implementation boundary with a framework abstraction while retaining important failure and locality limits.

Handoff: Once context services are visible, the next question is how the same context selects configuration and bean definitions for a particular runtime environment.

## 08 — Environment, profiles, and value resolution

Status: pending
Action: create
English: notes/spring/junior/en/08-environment-profiles-and-value-resolution.md
Spanish: notes/spring/junior/es/08-entorno-perfiles-y-resolucion-de-valores.md
Depends on: 07
Pending additions: none

Narrative role: Explain how property sources and active profiles influence context construction and simple injected values without leaking environment branches into business logic.

Learning outcome: Victor can trace effective values through property-source precedence, select beans with profile expressions, and distinguish placeholder resolution from expression evaluation while recognising when Boot's typed binding is the later integration choice.

Prerequisites: 07.

Must answer:

- How do property sources and active profiles reach the `Environment`, and how is the winning value selected when sources overlap?
- How does `@Profile` change bean registration rather than branch inside business logic?
- What happens when a required placeholder is missing, and when is an explicit default semantically safe?
- What is the difference between `${...}` property resolution and `#{...}` expression evaluation, and when does a cohesive settings group outgrow `@Value`?

Coverage concepts:

- [ ] `Environment` and profiles — query active profiles and property sources as framework context while keeping environment-specific values outside business logic
- [ ] `@Profile` conditional bean registration — include a component or configuration only when its profile expression matches the active environment instead of branching inside business code
- [ ] Property placeholders vs Spring Expression Language in `@Value` — use `${...}` to resolve external properties and `#{...}` to evaluate Spring expressions, while preferring typed configuration binding when a cohesive settings group belongs to Boot configuration

Rationale: These three concepts form one configuration-selection mechanism: the context reads sources, activates profiles, and resolves values while it builds the environment-specific graph.

Handoff: Environment-specific beans are ready, but constraints on their nested inputs and method arguments remain inert metadata until Spring activates validation at the correct boundary; the next chapter traces that mechanism.

## 09 — Validation integration and boundaries

Status: pending
Action: create
English: notes/spring/junior/en/09-validation-integration-and-boundaries.md
Spanish: notes/spring/junior/es/09-integracion-de-validacion-y-limites.md
Depends on: 05, 08
Pending additions: none

Narrative role: Separate constraint metadata from the Spring mechanisms that trigger it at object graphs, input binding, and service-method boundaries.

Learning outcome: Victor can choose `@Valid` or `@Validated`, make nested and method constraints execute, and keep structural input errors separate from business-rule failures.

Prerequisites: 05, 08.

Must answer:

- What belongs to Jakarta Validation, and what integration work does Spring add around those constraints?
- Why do nested constraints remain dormant unless validation cascades across the relationship?
- What extra capabilities does `@Validated` add beyond standard cascaded validation?
- What is a validation group, and what mechanism selects which constraint group runs?
- Why do service parameter and return constraints need both method-validation infrastructure and a proxy-crossing call?
- At which boundary should conversion or shape errors stop, and why do repository-backed rules remain application logic?
- What are data binding, conversion, and an input boundary in this chapter's Spring web preview, and how does a binding failure differ from a constraint violation?

Coverage concepts:

- [ ] Jakarta Validation vs Spring validation — Jakarta constraints describe bean rules, while Spring adapts validation into data binding, method interception, and web integration
- [ ] `@Valid` vs `@Validated` — standard `@Valid` triggers cascaded bean validation, while Spring's `@Validated` also selects validation groups and participates in method-validation integration
- [ ] Cascaded validation — nested objects require `@Valid` at the relationship boundary or their own constraints remain metadata that never runs
- [ ] Method validation through a proxy — constraints on service parameters or return values require the method-validation infrastructure and a call through the managed proxy
- [ ] Binding errors vs business-rule failures — structural conversion and validation belong at the input boundary, while repository-backed or actor-dependent invariants remain application logic

Rationale: These concepts form one execution path from declarative constraint metadata to Spring-triggered validation and correctly owned failures.

Handoff: Having seen several behaviours that exist only inside the framework, the next chapter asks which tests need a Spring context to prove them.

## 10 — Spring TestContext foundations

Status: pending
Action: create
English: notes/spring/junior/en/10-spring-testcontext-foundations.md
Spanish: notes/spring/junior/es/10-fundamentos-de-spring-testcontext.md
Depends on: 09
Pending additions: none

Narrative role: Close the modern Spring route by choosing the smallest test environment that can observe plain logic, bean wiring, proxy behaviour, configuration, or transactional isolation.

Learning outcome: Victor can decide between a plain unit test and the Spring TestContext Framework, configure a focused JUnit context, control profiles and properties, and explain transactional test rollback's benefit and blind spot.

Prerequisites: 09.

Must answer:

- What risk justifies paying the cost of a Spring context instead of constructing the subject directly?
- How does the TestContext Framework create and cache contexts across tests?
- Which configuration differences let two tests reuse a cached context, and which differences require another context?
- What roles do `SpringExtension`, `@SpringJUnitConfig`, and `@ContextConfiguration` each play?
- How can a test override profiles or properties without weakening production configuration?
- Why does automatic test rollback isolate state, and which commit-time behaviour can it hide?
- Which Spring transaction infrastructure must actually be present for transactional test rollback, and how can an explicit commit-oriented test observe work that happens only at commit?

Coverage concepts:

- [ ] Plain unit test vs Spring test context — instantiate a class directly when only its logic matters and load the container only when bean wiring or framework behaviour is the risk
- [ ] Spring TestContext Framework — build and cache an application context for tests while integrating lifecycle callbacks, profiles, properties, and dependency injection
- [ ] JUnit Jupiter TestContext integration — use `SpringExtension` or the composed `@SpringJUnitConfig` annotation so JUnit activates Spring's test lifecycle before `@ContextConfiguration` supplies the context definition
- [ ] `@ContextConfiguration` — declare the configuration classes or resources that a framework-level test context needs without loading a complete Boot application
- [ ] Test property and profile overrides — activate controlled configuration for a test without weakening production defaults or depending on a developer machine
- [ ] Transactional test rollback — a Spring-managed test transaction normally rolls back after each test, which isolates database state but can hide behaviour that occurs only at commit

Rationale: All six items answer one testing decision: how much Spring infrastructure the test must load and what that environment proves or masks.

Handoff: The final chapter applies the completed mental model to older configuration and namespace conventions Victor may meet in consultancy codebases.

## 11 — Reading maintained Spring code

Status: pending
Action: create
English: notes/spring/junior/en/11-reading-maintained-spring-code.md
Spanish: notes/spring/junior/es/11-lectura-de-codigo-spring-mantenido.md
Depends on: 10
Pending additions: none

Narrative role: Translate the modern container and lifecycle model into two historical representations still encountered in maintained applications.

Learning outcome: Victor can read XML bean and scan declarations as alternative sources of the same definitions and recognise pre-Jakarta validation or lifecycle imports without confusing namespace age with different core concepts.

Prerequisites: 10.

Must answer:

- How do an XML `<bean>` declaration and component scanning feed the same container model learned earlier?
- Which XML attributes reveal construction, dependencies, names, and scan boundaries in maintained code?
- How do XML constructor arguments and property injection correspond to constructor and setter injection in the modern model?
- Why did packages move from `javax.*` to `jakarta.*`, and what does that change when reading validation and lifecycle annotations?
- Why are matching `javax` and `jakarta` type names still distinct types rather than a cosmetic import rename?
- Which modern preference should Victor use for new code while still being able to explain the older form?

Coverage concepts:

- [ ] XML bean definitions — read legacy `<bean>` and component-scan configuration as another source of bean definitions without making XML the default for new code
- [ ] `javax.*` vs `jakarta.*` validation and lifecycle imports — current Spring generations use Jakarta namespaces, while maintained code may still use the pre-migration packages

Rationale: Both items are recognition bridges from the modern route to equivalent concepts expressed by older configuration or package names.

Handoff: This closes the junior Spring Framework journey: Victor can now follow a managed object from definition through injection, lifetime, proxy advice, integration services, validation, testing, and maintained-code variants.

## Unassigned existing notes

*(none)*
