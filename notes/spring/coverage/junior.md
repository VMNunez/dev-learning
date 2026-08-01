# Junior Coverage — Spring

Core Spring Framework mechanisms a junior Java developer must understand to read, test, and debug conventional Spring applications without confusing them with Spring Boot conveniences.

## Container and bean registration

- Inversion of Control and dependency injection — the container creates and connects application objects so classes declare collaborators instead of locating or constructing infrastructure themselves
- `ApplicationContext` and the IoC container — recognise the runtime registry that holds bean definitions, creates managed objects, resolves dependencies, and publishes framework services
- Bean vs ordinary object — Spring lifecycle, injection, scopes, and proxy-backed annotations apply only to objects obtained from the container, not to instances created with `new`
- Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while keeping each layer's responsibility explicit ✅ 07-timetrack
- `@Repository` exception translation — with Spring's persistence-exception translation infrastructure, the stereotype lets provider-specific failures surface through the portable `DataAccessException` hierarchy ✅ 07-timetrack
- Component scanning — understand that scanning searches configured packages for candidate components, so a valid stereotype outside the scan boundary still produces a missing-bean failure
- `@Configuration` and `@Bean` — register third-party instances or explicit construction logic in Java configuration and use scanning for application-owned component classes ✅ 07-timetrack
- `@Bean` method dependencies — declare collaborators as method parameters so the container resolves them instead of calling other factory methods as hidden service locators
- Bean names and type lookup — beans are normally resolved by type, while names become relevant when several candidates share that type or external integration refers to a bean explicitly
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor ✅ 07-timetrack
- Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while an all-argument constructor is usually the wrong service boundary
- `@Autowired` requiredness — an autowired dependency is required by default; constructor inference removes the annotation, while `Optional`, `ObjectProvider`, or explicit requiredness changes absence semantics deliberately
- Collection and map injection — inject all beans of a type when at least one strategy is part of the contract; use an explicitly optional form when an empty set is valid
- `ObjectProvider<T>` — defer or optionally request a dependency when its availability or scope genuinely varies instead of hiding a required collaborator behind null
- `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- Dependency resolution failures — distinguish no candidate, multiple candidates, and a dependency cycle before changing annotations at random
- Circular dependencies — treat a constructor cycle as a design signal that responsibilities or dependency direction need correction rather than hiding it with field injection

## Scope and lifecycle

- Singleton scope and stateless services — the default shares one bean instance across callers, so mutable request-specific state on a service can leak across users and threads
- Singleton bean scope vs Singleton pattern — Spring's scope means one managed instance per bean definition in a container, not a class-enforced global instance with a private constructor
- Prototype scope — the container creates a new instance each time that bean is requested, unlike the shared singleton default
- Web-aware request and session scopes — recognise per-request and per-session lifetimes so request-specific state is not placed on a shared singleton
- Scope vs thread safety — bean scope controls instance lifetime and sharing, while thread safety depends on how mutable state is accessed
- Bean lifecycle phases — follow instantiation, dependency injection, initialization callbacks, ready use, and destruction so a failure can be placed in the correct phase
- `@PostConstruct` and `@PreDestroy` — run lifecycle work after injection or before managed destruction without putting operational work in a constructor

## Proxies and AOP

- Cross-cutting concerns and AOP — apply behaviour such as transactions, security, caching, or logging around a method call without mixing that infrastructure policy into the method body
- Proxy-based annotation behaviour — Spring wraps eligible beans, so advice applies when a call crosses the proxy and silently does nothing on an unmanaged instance or self-invocation
- Self-invocation — a method calling another advised method on `this` bypasses the proxy, so moving the boundary or calling another bean is normally clearer than reaching for the proxy manually
- Proxy infrastructure activation — an annotation such as `@Transactional` or `@Validated` needs the matching Spring infrastructure; the annotation alone is inert in a bare context that has not enabled its processor

## Transaction abstraction

- `@Transactional` atomicity and rollback — group one business operation in a transaction and know that unchecked exceptions roll back by default while checked exceptions require an explicit rule ✅ 07-timetrack
- Spring's `@Transactional` vs the Jakarta annotation — two importable annotations with the same name use different attributes and integration semantics, so the import is part of the behaviour even though both normally roll back unchecked exceptions by default
- Transaction boundary placement — put the annotation on the externally invoked service method that spans the business operation, not on a controller, private helper, or isolated repository call ✅ 07-timetrack
- Method-level vs class-level `@Transactional` — a method annotation overrides class-level transaction metadata, so broad defaults belong on the class and exceptional boundaries stay explicit on methods
- Transactional proxy limitations — `new` instances, self-invocation, and non-proxy-eligible methods do not open the transaction the annotation appears to promise
- `@Transactional(readOnly = true)` — declare read intent so integrations may optimise work, without treating it as a portable guarantee that the database will reject writes ✅ 07-timetrack
- Caught exceptions and rollback — swallowing a failure can let the proxy observe normal completion and commit unless rollback is re-established deliberately
- Transaction propagation `REQUIRED` — recognise the default join-or-create behaviour so nested service calls participate in one boundary instead of assuming every annotation opens an independent transaction

## Events, resources, and environment

- Spring application events vs external messaging — `ApplicationEventPublisher` notifies `@EventListener` methods in-process and synchronously by default; it provides neither broker durability nor cross-process delivery
- Spring `Resource` abstraction — read classpath, filesystem, and URL-backed content through one interface without assuming every resource is a normal file
- `Environment` and profiles — query active profiles and property sources as framework context while keeping environment-specific values outside business logic
- `@Value` placeholders — inject a small scalar value or expression while preferring typed configuration binding when a cohesive settings group belongs to Boot configuration

## Validation integration

- Jakarta Validation vs Spring validation — Jakarta constraints describe bean rules, while Spring adapts validation into data binding, method interception, and web integration
- `@Valid` vs `@Validated` — standard `@Valid` triggers cascaded bean validation, while Spring's `@Validated` also selects validation groups and participates in method-validation integration
- Cascaded validation — nested objects require `@Valid` at the relationship boundary or their own constraints remain metadata that never runs
- Method validation through a proxy — constraints on service parameters or return values require the method-validation infrastructure and a call through the managed proxy
- Binding errors vs business-rule failures — structural conversion and validation belong at the input boundary, while repository-backed or actor-dependent invariants remain application logic

## Spring testing foundations

- Plain unit test vs Spring test context — instantiate a class directly when only its logic matters and load the container only when bean wiring or framework behaviour is the risk
- Spring TestContext Framework — build and cache an application context for tests while integrating lifecycle callbacks, profiles, properties, and dependency injection
- `@ContextConfiguration` — declare the configuration classes or resources that a framework-level test context needs without loading a complete Boot application
- Test property and profile overrides — activate controlled configuration for a test without weakening production defaults or depending on a developer machine
- Transactional test rollback — a Spring-managed test transaction normally rolls back after each test, which isolates database state but can hide behaviour that occurs only at commit

## Maintained-code recognition

- Field and setter injection — recognise `@Autowired` on fields or setters in existing code and explain the hidden-dependency and testability trade-offs compared with constructor injection
- `@Autowired` vs `@Inject` vs `@Resource` — recognise Spring, Jakarta, and name-oriented legacy injection annotations while preferring one consistent constructor-injection style in new code
- XML bean definitions — read legacy `<bean>` and component-scan configuration as another source of bean definitions without making XML the default for new code
- `BeanFactory` vs `ApplicationContext` — recognise the lower-level bean factory contract while using the application context for events, resources, environment, and normal application integration
- `javax.*` vs `jakarta.*` validation and lifecycle imports — current Spring generations use Jakarta namespaces, while maintained code may still use the pre-migration packages
