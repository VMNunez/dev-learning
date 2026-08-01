# Middle Coverage — Spring

Core Spring Framework concepts expected when a developer owns reusable application infrastructure and diagnoses proxy, transaction, lifecycle, and concurrency behaviour.

## Container extension and lifecycle

- `@Bean` method dependencies — prefer parameters for explicit wiring that also works in lite configuration; calls between methods are container-intercepted only in full `@Configuration` mode with bean-method proxying enabled
- Map injection — inject beans of one value type under their bean names as keys when callers need both strategy lookup and container-defined identity
- Shorter-lived beans inside singletons — direct injection resolves the dependency when the singleton is created, so use a provider or scoped proxy only when each runtime use genuinely needs the current prototype, request, or session instance
- Bean post-processors — understand and implement container hooks that inspect or wrap beans without confusing them with ordinary application services
- Factory beans — expose an object created by specialised factory logic while distinguishing the factory bean from the object it produces
- Programmatic bean registration — register definitions dynamically only when configuration cannot be expressed clearly through normal component or `@Bean` declarations
- Custom scopes — define non-standard bean lifetimes only when an integration has a real lifecycle the built-in scopes cannot model
- Context hierarchies — use parent and child contexts deliberately when infrastructure and application beans require separate visibility boundaries

## AOP and transaction design

- Shared-transaction rollback-only failure — catching an inner transactional failure may still leave the shared transaction rollback-only and make the outer commit fail
- JDK vs class-based proxy constraints — diagnose interface exposure, final or private methods, and other proxy-strategy limits when advice is missing
- Pointcut and advice design — target the smallest stable join-point set and avoid broad expressions that silently wrap unrelated application behaviour
- Advice precedence — control ordering when transactions, retries, security, caching, or custom advice must observe failures in a specific sequence
- Programmatic transactions — use `TransactionTemplate` when one method needs transaction boundaries that cannot be expressed safely with proxy-based annotations
- Propagation choices — select `REQUIRES_NEW`, `NESTED`, or non-transactional propagation only from a deliberate failure and consistency contract
- Isolation and concurrency anomalies — choose an isolation level from the data anomaly the operation must prevent rather than escalating every transaction globally
- Multiple transaction managers — route a boundary to the correct resource manager and recognise that separate managers do not provide distributed atomicity

## Events, scheduling, and caching

- Transaction-bound events — use `@TransactionalEventListener` when a reaction must follow a particular transaction phase and define what happens when no transaction exists
- Asynchronous event listeners — move work off the publisher thread only with explicit executor, ordering, failure, and context-propagation decisions
- Scheduled task execution — configure scheduling and its executor so one slow task does not delay every other scheduled method
- Declarative caching — place `@Cacheable`, `@CachePut`, and eviction around stable reads while defining keys and invalidation before relying on cached state
- Cache proxy limitations — account for self-invocation, mutable return values, and exceptions when diagnosing why an annotated method did not cache as expected

## Integration and test infrastructure

- Spring `Validator`, binding, and validation groups — implement reusable validation rules or phased constraint sets when annotations on one input model are insufficient
- Custom type conversion — register converters or formatters for reusable boundary types instead of parsing the same representation in controllers
- Context caching and `@DirtiesContext` — preserve reusable test contexts and invalidate one only when a test mutates container state that cannot be restored
- Framework integration testing — prove proxy advice, transaction boundaries, events, and lifecycle callbacks with a real Spring context where a plain unit test cannot observe them
