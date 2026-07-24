# Middle Coverage — Architecture

Concepts expected when a developer begins owning boundaries and trade-offs across multiple features or services.

## Application boundaries

- Hexagonal architecture — isolate domain logic behind ports so frameworks and infrastructure remain replaceable adapters
- Clean architecture — direct dependencies toward business policy while avoiding ceremonial layers with no independent responsibility
- Domain-driven design basics — identify bounded contexts, entities, value objects, and aggregates without treating DDD as folder naming
- CQRS — separate command and query models only when their behaviour or scaling needs genuinely diverge

## Distributed-system patterns

- API Gateway — centralise external routing and cross-cutting policies without moving business logic into the gateway
- Circuit breaker — stop repeated calls to a failing dependency and define recovery behaviour
- Event-driven architecture — publish domain-relevant events while handling delivery, ordering, idempotency, and eventual consistency
- Saga awareness — coordinate multi-service business operations through compensating actions rather than a distributed database transaction

## Design patterns in context

- Strategy, Factory, Builder, Observer, and Decorator — recognise the problem each pattern solves and avoid applying names without the corresponding pressure
- Pattern trade-offs — compare added indirection with the concrete variation or coupling the pattern removes
