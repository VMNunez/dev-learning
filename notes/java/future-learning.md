# Java — Future Learning Roadmap

Topics to study once the numbered files (01–onwards) are solid. Nothing here is needed for the first interview — needed to grow into a mid-level developer.

Spring Boot topics live in `spring-boot/future-learning.md`.

---

## What the numbered files cover (junior goal — all done ✓)

- 01 — Variables and types: primitives, wrapper classes, String, autoboxing, `var`
- 02 — Control flow: `if/else`, switch expression, for-each, while, break/continue, null checks
- 03 — Methods: declaration, access modifiers, return types, static, overloading, varargs
- 04 — OOP: classes, fields, constructors, encapsulation, static, records
- 05 — Interfaces and abstract classes: contracts, default methods, functional interfaces
- 06 — Inheritance and polymorphism: `extends`, `super`, `@Override`, `instanceof`, `final`
- 07 — Collections: `List`, `Map`, `Set`, sorting, `ConcurrentModificationException`
- 08 — Exceptions: checked vs unchecked, try/catch/finally, custom exceptions, try-with-resources
- 09 — Streams and lambdas: lambda syntax, method references, stream pipeline, collectors
- 10 — Generics and Optional: generic classes/methods, bounded types, `Optional<T>` patterns
- 11 — Enums: constants, fields/methods on enums, `@Enumerated`, switch with enums
- 12 — Date and time: `LocalDate`, `LocalDateTime`, formatting, `@PrePersist`, JPA mapping
- 13 — Annotations: built-in, meta-annotations, Spring Boot annotation families
- 14 — Maven: `pom.xml`, parent BOM, dependency scopes, lifecycle commands

---

## Phase 1 — After landing the first job

### Java 17+ features

- **Sealed classes** — restrict which classes can extend a type
- **Text blocks** — multi-line strings with `""" ... """`
- **Pattern matching for instanceof** — `if (obj instanceof String s) { s.length(); }`

Records are already part of the current junior goal — see `coverage.md`.

### Java concurrency basics

`Thread`, `ExecutorService`, `CompletableFuture`. Understanding thread safety matters when writing Spring Boot services. The `@Async` annotation runs a method in a separate thread — you need to understand what that means for exception handling and transaction boundaries.

---

## Phase 2 — After 6–12 months

### Advanced generics

Wildcards (`? extends T`, `? super T`), bounded type parameters, generic methods, and the `ParameterizedTypeReference`/`TypeReference` workarounds for erasure. Relevant when reading library code and writing reusable utilities.

(*What type erasure is* and *what raw types switch off* are now junior coverage — see `coverage.md`, "Generics"; only the wildcard/variance rules and the erasure workarounds stay here.)

### Advanced streams

Parallel streams and when they are safe, custom `Collector` implementations, `Spliterator`. The everyday pipeline (`filter`/`map`/`collect`) is already junior coverage.

### Writing your own annotations

Declaring a custom annotation with `@Retention`/`@Target` and reading it with a reflection scan or an `AbstractProcessor`. (*Reading* an existing annotation's retention and target — and knowing an annotation is inert until something processes it — is now junior coverage.)

### Design vocabulary

The GoF pattern catalogue (strategy, decorator, factory method, visitor) and SOLID applied formally class by class, as an explicit vocabulary you defend in a design review.

### Java concurrency advanced

`synchronized`, `volatile`, `ReentrantLock`, `ConcurrentHashMap`. Relevant in high-load production services.

---

## Phase 3 — Mid-level

### JVM internals and performance

Garbage collection *algorithms* (G1, ZGC) and tuning, memory leaks, profiling with VisualVM or JFR. (The *conceptual* stack-vs-heap split and what the garbage collector does are now junior coverage — see `coverage.md`, "Memory and value semantics"; only the internals, algorithms, and tuning stay here.)

### Reflection and annotations

How annotations work at runtime, how frameworks like Spring use reflection to wire dependencies. Relevant when writing custom annotations or understanding Spring Boot's magic.

---

## What NOT to study prematurely

- **Java modules (JPMS)** — added in Java 9. Almost no Spring Boot projects use it.
- **Ant / Maven lifecycle internals** — use Maven commands without understanding the internals.
- **Multi-module Maven projects and publishing to a private Nexus/Artifactory** — *consuming* an internal mirror is junior coverage (`settings.xml`); authoring modules and publishing artifacts is not.
- **Gradle** — the alternative build tool, and Maven↔Gradle migration. Learn it when a client project uses it.

---

## Additions from the 2026-07-19 coverage audit

_Analyst C generated 122 interview questions for Java and found the topic materially under-covered; most gaps were promoted into `coverage.md` (concurrency awareness, streams internals, generics wildcards, `java.time` beyond `LocalDate`, `BigDecimal` correctness, Java version literacy, reflection). These are the ones judged genuinely post-junior:_

- **`sealed` classes and `permits` (Java 17)** — a closed set of subtypes enabling exhaustive `switch` pattern matching; real and modern, but a junior is not filtered for not knowing it, and it only pays off alongside pattern matching for `switch` (Java 21). Java *version literacy* (knowing 17 introduced it) is in coverage; using it is not.
- **`clone()` and `Cloneable`** — shallow versus deep copying through the legacy cloning mechanism. Modern code uses a copy constructor, a static factory, or a record, all of which are in coverage; `Cloneable`'s broken contract is a curiosity you meet in old code.
- **Virtual threads and structured concurrency (Java 21)** — the concurrency *awareness* section in coverage stops at "a bean is shared, here is what a race condition is"; virtual threads change how a server handles blocking calls and belong with the Spring Boot 3.2+ integration, after the first job.
- **Writing concurrent code properly** — `ExecutorService` lifecycle, `CompletableFuture` composition, the `java.util.concurrent` locks, and the Java Memory Model's happens-before rules. Coverage deliberately stops at recognising the vocabulary and diagnosing shared mutable state.
- **Custom annotations with `@Retention` / `@Target` plus an annotation processor** — reading them reflectively is in coverage (it is how Spring works); authoring a processor is not.
- **JVM tuning and profiling** — heap sizing flags, choosing a garbage collector, and reading a heap dump with VisualVM or JFR. Coverage stops at "what a memory leak looks like in a GC language".
- **JavaFX** — desktop UI framework. Not used in web development.
