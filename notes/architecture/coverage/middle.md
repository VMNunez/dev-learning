# Middle Coverage — Architecture

Concepts expected when a developer begins owning boundaries and trade-offs across multiple features or services.

## Application boundaries

- Hexagonal architecture — isolate domain logic behind ports so frameworks and infrastructure remain replaceable adapters
- Clean architecture — direct dependencies toward business policy while avoiding ceremonial layers with no independent responsibility
- Domain-driven design basics — identify bounded contexts, entities, value objects, and aggregates without treating DDD as folder naming
- CQRS — separate command and query models only when their behaviour or scaling needs genuinely diverge

## Distributed-system patterns

- Synchronous request vs asynchronous event — a direct call gives an immediate result and temporal coupling, while an event decouples timing but introduces delayed consistency, delivery, and ordering concerns
- API Gateway — centralise external routing and cross-cutting policies without moving business logic into the gateway
- Circuit breaker — stop repeated calls to a failing dependency and define recovery behaviour
- Event-driven architecture — publish domain-relevant events while handling delivery, ordering, idempotency, and eventual consistency
- Saga awareness — coordinate multi-service business operations through compensating actions rather than a distributed database transaction

## Design patterns in context

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
