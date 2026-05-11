# Architecture — Future Learning Roadmap

Topics to study once the current foundation is solid. Not needed for the first junior role — needed to grow into a mid-level developer and to work confidently in the codebases consultancies actually run.

Study these in order. Each one builds on the previous.

---

## Concept to know before the interview (no implementation needed)

### Monolith vs Microservices

You will be asked this in interviews even as a junior. You do not need to have built either — you just need to know what they are and the trade-off.

**Monolith** — one application, one deployable unit. All features live in the same codebase and run in the same process. Simpler to build and debug. Good for small teams and early-stage projects.

**Microservices** — many small, independent services. Each owns one business domain (employees, payments, notifications) and has its own database and deployment. Teams can work and deploy independently. The trade-off: much more complex to run, debug, and coordinate.

**The key point for a junior:** consultancies already run microservices by the time you join. Your job is to understand the service you own and how it communicates with the others via REST. You are not expected to design the system — just to work safely within it.

**What to say in an interview:** "For a new project I would start with a monolith — faster to build and easier to understand the domain. Microservices make sense when the team grows and you need teams to deploy independently. Starting with microservices before understanding the domain is a common mistake."

---

## Phase 1 — After landing the first job (mid 2026)

These are concepts you will encounter in a real consultancy codebase on day one. You do not need to implement them before the job, but you need to recognise them.

### Design patterns (GoF basics)

The four patterns you will see most often in Spring Boot codebases:

| Pattern | What it is | Where you've already seen it |
|---------|-----------|------------------------------|
| **Singleton** | One instance shared across the app | Angular services (`providedIn: 'root'`), Spring `@Service` beans |
| **Factory** | A method/class that creates objects | Spring `@Bean` methods in `@Configuration` classes |
| **Observer** | One object notifies many when it changes | RxJS Observables, Angular signals |
| **Strategy** | Swap algorithms at runtime via an interface | `Comparator` in Java sorting, Angular `ErrorStateMatcher` |

Why this matters: when a senior developer says "we use the Strategy pattern here", you should know immediately what to look for in the code.

### API Gateway pattern

A single entry point that sits in front of all your microservices. The Angular app talks only to the gateway — the gateway routes requests to the correct service.

- Handles cross-cutting concerns: auth, rate limiting, logging
- In Spring Boot: Spring Cloud Gateway
- In practice: you configure routes in a YAML file, not code

### Circuit breaker

When a downstream service fails, stop calling it for a while instead of letting the failure cascade. The circuit "opens" and returns a fallback response. Used with Resilience4j in Spring Boot.

Why it matters: you will see `@CircuitBreaker` annotations in production code and need to know what they do.

---

## Phase 2 — After 6–12 months of experience

These require real project experience to understand properly. Reading about them without hands-on context does not stick.

### Hexagonal architecture (Ports and Adapters)

The idea: the business logic at the centre knows nothing about the outside world (databases, HTTP, messaging). It defines "ports" (interfaces), and "adapters" implement those ports.

```
HTTP Controller ─── Port (interface) ─── Core business logic
JPA Repository  ─── Port (interface) ─┘
Kafka Consumer  ─── Port (interface) ─┘
```

Why companies use it: you can swap the database, the API framework, or the messaging system without touching the business logic. Very common in large consultancy projects.

Why to wait: without having worked in a layered architecture project first, the benefits are not obvious. Learn layered first, see its limitations, then hexagonal makes sense.

### CQRS — Command Query Responsibility Segregation

Split reads and writes into separate models. Commands (write operations) go through one path; queries (read operations) go through another.

Why it matters at scale: the data shape you need for a list page is often very different from the data shape you need for a write. Separate models let you optimise each independently.

### Domain-Driven Design (DDD) basics

A way of structuring the codebase around business concepts (domains) rather than technical layers. Key vocabulary: bounded context, aggregate, entity, value object, domain event.

Why to wait: DDD is a mindset shift that requires seeing real domain complexity first. It does not make sense on todo lists or HR portals — it makes sense on billing systems, logistics platforms, and insurance software. That is exactly what consultancies build.

---

## Phase 3 — Mid-level (12–24 months of experience)

### Event-driven architecture

Services communicate by publishing events to a message broker (Kafka, RabbitMQ) instead of calling each other directly. Other services subscribe and react.

```
Employee Service ──publishes──▶ Kafka topic: employee.created
                                      │
                          ┌───────────┴──────────┐
                          ▼                      ▼
                   Notification Service    Audit Service
```

Why it matters: this is how large consultancy systems actually work. REST between services is synchronous and fragile — events decouple producers from consumers.

### Clean architecture

Robert C. Martin's (Uncle Bob) formalisation of hexagonal ideas. Adds more explicit layer rules and dependency directions. Common in Java and .NET enterprise codebases.

---

## What NOT to study prematurely

These are real topics but studying them now would be wasted time — you need production experience first:

- **Kubernetes / container orchestration** — ops concern, not developer concern at junior level
- **Service mesh (Istio, Linkerd)** — infrastructure, not application architecture
- **SAGA pattern** — distributed transactions, only relevant when working across multiple databases
- **Event sourcing** — advanced persistence pattern; start with CQRS first

---

## How to know when you're ready for the next phase

Move to Phase 1 patterns when: you have been working in a real codebase for 1–2 months and can navigate it confidently.

Move to Phase 2 when: you feel friction with layered architecture — when you find yourself wanting to test the business logic without spinning up the whole Spring Boot context.

Move to Phase 3 when: you have worked on a project where two teams' services communicate, and you have felt the pain of one service going down and breaking the other.

Architecture knowledge that comes from real problems sticks. Architecture knowledge from reading docs before facing the problem does not.
