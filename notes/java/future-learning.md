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

Wildcards (`? extends T`, `? super T`), bounded type parameters, generic methods. Relevant when reading library code and writing reusable utilities.

### Java concurrency advanced

`synchronized`, `volatile`, `ReentrantLock`, `ConcurrentHashMap`. Relevant in high-load production services.

---

## Phase 3 — Mid-level

### JVM internals and performance

Garbage collection algorithms (G1, ZGC), heap vs stack, memory leaks, profiling with VisualVM or JFR.

### Reflection and annotations

How annotations work at runtime, how frameworks like Spring use reflection to wire dependencies. Relevant when writing custom annotations or understanding Spring Boot's magic.

---

## What NOT to study prematurely

- **Java modules (JPMS)** — added in Java 9. Almost no Spring Boot projects use it.
- **Ant / Maven lifecycle internals** — use Maven commands without understanding the internals.
- **JavaFX** — desktop UI framework. Not used in web development.
