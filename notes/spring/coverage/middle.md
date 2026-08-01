# Middle Coverage — Spring

Core Spring Framework concepts expected when a developer owns reusable application infrastructure and diagnoses proxy, transaction, lifecycle, and concurrency behaviour.

## Container extension and lifecycle

- Bean post-processors — understand and implement container hooks that inspect or wrap beans without confusing them with ordinary application services
- Factory beans — expose an object created by specialised factory logic while distinguishing the factory bean from the object it produces
- Programmatic bean registration — register definitions dynamically only when configuration cannot be expressed clearly through normal component or `@Bean` declarations
- Custom scopes — define non-standard bean lifetimes only when an integration has a real lifecycle the built-in scopes cannot model
- Context hierarchies — use parent and child contexts deliberately when infrastructure and application beans require separate visibility boundaries

## AOP and transaction design

- JDK vs class-based proxy constraints — diagnose interface exposure, final or private methods, and other proxy-strategy limits when advice is missing
- Pointcut and advice design — target the smallest stable join-point set and avoid broad expressions that silently wrap unrelated application behaviour
- Advice precedence — control ordering when transactions, retries, security, caching, or custom advice must observe failures in a specific sequence
- Programmatic transactions — use `TransactionTemplate` when one method needs transaction boundaries that cannot be expressed safely with proxy-based annotations
- Propagation choices — select `REQUIRES_NEW`, `NESTED`, or non-transactional propagation only from a deliberate failure and consistency contract
- Isolation and concurrency anomalies — choose an isolation level from the data anomaly the operation must prevent rather than escalating every transaction globally
- Multiple transaction managers — route a boundary to the correct resource manager and recognise that separate managers do not provide distributed atomicity
- Transaction resource participation — distinguish resources enrolled through Spring's transaction-aware integrations from external calls that cannot join the local atomic boundary

## Events, scheduling, and caching

- Transaction-bound events — use `@TransactionalEventListener` when a reaction must follow a particular transaction phase and define what happens when no transaction exists
- Asynchronous event listeners — move work off the publisher thread only with explicit executor, ordering, failure, and context-propagation decisions
- Scheduled task execution — configure scheduling and its executor so one slow task does not delay every other scheduled method
- Declarative caching — place `@Cacheable`, `@CachePut`, and eviction around stable reads while defining keys and invalidation before relying on cached state
- Cache proxy limitations — account for self-invocation, mutable return values, and exceptions when diagnosing why an annotated method did not cache as expected

## Integration and test infrastructure

- Spring `Validator`, binding, and validation groups — implement reusable validation rules or phased constraint sets when annotations on one input model are insufficient
- Custom type conversion — register converters or formatters for reusable boundary types instead of parsing the same representation in controllers
- Test execution listeners and context customisation — extend the TestContext lifecycle only when reusable infrastructure cannot be expressed through normal configuration
- Context caching and `@DirtiesContext` — preserve reusable test contexts and invalidate one only when a test mutates container state that cannot be restored
- Framework integration testing — prove proxy advice, transaction boundaries, events, and lifecycle callbacks with a real Spring context where a plain unit test cannot observe them
