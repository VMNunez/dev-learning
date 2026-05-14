# Java — Future Learning Roadmap

Topics to study once the numbered files (01–onwards) are solid. Nothing here is needed for the first interview — needed to grow into a mid-level developer.

Spring Boot topics live in `spring-boot/future-learning.md`.

---

## What the numbered files will cover (junior goal)

These are the topics that will become numbered files as Victor studies Java:

- Variables, types, control flow, methods
- OOP — classes, interfaces, inheritance, polymorphism, abstract classes
- Collections — `List`, `Map`, `Set`, `ArrayList`, `HashMap`
- Exceptions — checked vs unchecked, try/catch, custom exceptions
- Streams and lambdas — `filter`, `map`, `collect`, method references
- Generics basics — `List<T>`, `Optional<T>`

---

## Phase 1 — After landing the first job

### Java 17+ features

- **Records** — immutable data classes: `record Point(int x, int y) {}`
- **Sealed classes** — restrict which classes can extend a type
- **Text blocks** — multi-line strings with `""" ... """`
- **Pattern matching for instanceof** — `if (obj instanceof String s) { s.length(); }`

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
