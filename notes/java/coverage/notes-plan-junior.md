# Java Junior Notes Plan

Plan status: current
Coverage: notes/java/coverage/junior.md
Coverage SHA-256: a199615fde8f198dfdc794ffd3a7a5a41b27f52ead775c6a16929120ffe806a1
Generated: 2026-07-24

## 01 — Variables, types, and Strings

Status: pending
Action: audit
English: notes/java/junior/en/01-variables-types.md
Spanish: notes/java/junior/es/01-variables-tipos.md
Depends on: none

Coverage concepts:

- `int` vs `long` — use `long` when the numeric range can exceed `int`; an `L` suffix is required only
  when the integer literal itself does not fit in `int`, because smaller literals widen automatically
- `primitive` vs wrapper class (`long` vs `Long`) — wrappers can represent `null`; a primitive JPA id
  compiles but defaults to `0`, so it cannot represent the unsaved state as clearly as `Long`
- `String.equals()` vs `==` — `==` compares memory addresses, not content; using `==` to compare Strings is the most common beginner bug interviewers check for in every Java code review; always use `.equals()`
- `String.isBlank()` vs `String.isEmpty()` — `isEmpty()` is true only when length is 0; `isBlank()` is also true when the string is all spaces; maps directly to understanding `@NotBlank` (rejects blanks and spaces) vs `@NotNull` (only rejects null); interviewers ask this when reviewing DTO validation
- `String.formatted()` — Java 15+ template substitution (`"User %s not found".formatted(id)`); the Java equivalent of JavaScript template literals; appears in custom exception messages
- `BigDecimal` for money — `double` cannot represent 0.1 exactly in binary; interviewers ask "what type would you use for a price field and why?"; the correct answer is `BigDecimal` — it does exact arithmetic; `double` produces rounding errors after a few operations
- `var` — local type inference (Java 10+); the type is still fixed at compile time — Java just infers it from the right side; only valid for local variables, not fields, parameters, or return types; you will see it in code reviews even if you do not write it yourself
- String immutability — every operation (`toUpperCase()`, `+`, `replace()`) returns a new `String` object instead of changing the original; interviewers ask "why does `result += name` inside a loop perform badly?" — each iteration allocates a new object that the garbage collector must clean up
- `StringBuilder` — mutable buffer for building a string inside a loop; `sb.append(x)` modifies the same object instead of creating a new one each time; interviewers ask when to reach for it instead of `+` (loops, not single-line concatenation — the compiler already optimises that case)
- Classic `switch` fall-through — without `break` at the end of a case, execution continues into the next case even if it does not match; one of the most common Java bugs interviewers ask candidates to spot in a code review
- Switch expression (Java 14+) — `->` syntax returns a value and removes fall-through; the expression
  must be exhaustive, so a missing case is a compile-time error rather than a warning

Rationale: These concepts form the coherent coverage group “Variables, types, and Strings”.

## 02 — Classes and objects

Status: pending
Action: audit
English: notes/java/junior/en/04-oop-classes.md
Spanish: notes/java/junior/es/04-poo-clases.md
Depends on: 01

Coverage concepts:

- Classes, fields, constructors — every Spring component is a class; interviewers ask "what is an object in the context of a Spring bean?"
- `private final` fields — why Spring Boot services use them: dependencies cannot change after construction, makes the class easier to unit test; the constructor injection pattern depends on this
- Access modifiers: `public`, `private`, `protected` — what each restricts and why Spring Boot services use `private` for fields and `public` for methods
- `this` keyword — disambiguates between a field and a constructor parameter; appears in Lombok-generated code and custom constructors
- `static` methods and fields — belong to the class, not to any instance; `Map.of()`, `Integer.parseInt()`, `Objects.equals()`, and utility factory methods are all `static`; interviewers ask "why can't a `static` method access instance fields?" (because there is no instance)
- `instanceof` — checks the runtime type of an object; appears in `equals()` overrides (`if (!(obj instanceof Employee other)) return false`) and in exception handlers; pattern matching form (`instanceof Dog dog`) is Java 16+ and is in the notes
- `equals()` and `hashCode()` — always override both together; `HashMap` and `HashSet` use `hashCode()` to find the bucket and `equals()` to confirm the match; breaking the contract causes silent bugs; Lombok `@Data` generates both automatically — interviewers ask "what does `@Data` generate?"
- `Objects.equals(a, b)` — null-safe equality that returns true when both references are null and
  otherwise delegates to `a.equals(b)` without throwing
- Encapsulation — fields are `private`, accessed through getters/setters; this is what Lombok's `@Data` generates; Spring Data reads and writes entity fields through this pattern
- Records (Java 16+) — generate a canonical constructor, component accessors such as `name()`,
  `equals`, `hashCode`, and `toString`; they do not generate JavaBean getters such as `getName()`

Rationale: These concepts form the coherent coverage group “Classes and objects”.

## 03 — Interfaces and abstract classes

Status: pending
Action: audit
English: notes/java/junior/en/05-interfaces-abstract.md
Spanish: notes/java/junior/es/05-interfaces-abstractas.md
Depends on: 02

Coverage concepts:

- Interfaces: how to define and implement — why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`); interviewers ask "why does Spring prefer interfaces over concrete classes?"
- Interface vs abstract class — interface: "this class CAN do X" (a class can implement many); abstract class: "this class IS a type of X" (a class can extend only one); interviewers ask this to test if the candidate understands when to choose each
- Default methods in interfaces (Java 8+) — interfaces can have a concrete implementation with `default`; Spring's `JpaRepository` uses them to provide built-in behaviour; a class can override a default method or use it as-is
- Implementing multiple interfaces — common in Spring Security (your `User` entity may implement both your domain interface and Spring Security's `UserDetails`)
- `@Override` — marks a method that implements an interface or overrides a parent; the compiler catches mismatches; appears in `loadUserByUsername()` and custom exception constructors; omitting it is not a bug but it removes the safety check
- Overriding vs overloading — overriding: same method name and signature in a subclass (decided at runtime); overloading: same method name with different parameters in the same class (decided at compile time); interviewers show code and ask "is this an override or an overload?"
- Functional interfaces — an interface with exactly one abstract method; this is what makes lambda syntax possible; `@FunctionalInterface` enforces the constraint; built-ins: `Predicate<T>` (filter/test), `Function<T, R>` (transform), `Consumer<T>` (consume with no return), `Supplier<T>` (produce with no input); interviewers ask "what type does this lambda implement?"
- Why Spring Boot prefers interfaces for dependencies — you can swap implementations without changing the caller; the foundation of testable, loosely coupled code

Rationale: These concepts form the coherent coverage group “Interfaces and abstract classes”.

## 04 — Generics

Status: pending
Action: audit
English: notes/java/junior/en/10-generics.md
Spanish: notes/java/junior/es/10-genericos.md
Depends on: 03

Coverage concepts:

- `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` — reading and writing typed containers in Spring Boot code
- Why generics exist — catch type errors at compile time instead of at runtime; without generics, a `List` could hold any type and every `.get()` required a cast that could fail at runtime
- `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()` — the correct way to handle a value that might not exist
- `Optional.get()` vs `Optional.orElseThrow()` — `get()` throws `NoSuchElementException` with no useful message if empty; `orElseThrow()` lets you throw a meaningful exception with context; interviewers treat `get()` as a red flag in code review — it is the same problem as returning `null`
- Why returning `null` is a problem — forces every caller to null-check; `Optional` makes the absence explicit in the return type; interviewers ask "why Optional instead of null?"

Rationale: These concepts form the coherent coverage group “Generics”.

## 05 — Streams and lambdas

Status: pending
Action: audit
English: notes/java/junior/en/09-streams-lambdas.md
Spanish: notes/java/junior/es/09-streams-lambdas.md
Depends on: 04

Coverage concepts:

- Lambda expressions — anonymous functions used wherever a functional interface is expected; `e -> e.isActive()` is the most common form in service methods; interviewers ask you to read a lambda and explain what it does
- Method references — shorthand for a lambda that only calls one method: `this::toResponse`, `Employee::getName`, `System.out::println`; when both forms are used in the same codebase interviewers ask "can you explain what this reference does?"
- Stream pipeline: `filter()`, `map()`, `collect()` — the core pattern for transforming a list; `filter` keeps matching elements, `map` transforms each element, `collect` builds the result; interviewers ask you to write a pipeline from a description
- `findFirst()` — returns `Optional<T>`; the safe way to get one item from a filtered stream without throwing
- `anyMatch()` / `allMatch()` — return a boolean; used instead of a for loop when you only need to check a condition across a list
- `mapToInt().sum()` — pattern for summing a numeric field across a list: `employees.stream().mapToInt(Employee::getAge).sum()`; avoids creating intermediate objects; interviewers may ask you to refactor a for loop that sums a field
- `Collectors.groupingBy()` — groups elements into `Map<Key, List<Value>>`; used when a service must return data organised by a field (status, department, date); interviewers ask you to read the result type
- `.toList()` vs `collect(Collectors.toList())` — `.toList()` is Java 16+ and returns an immutable list; `collect(Collectors.toList())` returns a mutable list; if the next line calls `.add()` on the result, `.toList()` will throw; interviewers ask the difference when reviewing modern Java code
- Stream vs for loop — streams express intent clearly (`filter` + `map`); for loops are clearer when the logic is complex or when you need early exit with `break`; know when to choose each

Rationale: These concepts form the coherent coverage group “Streams and lambdas”.

## 06 — Exceptions

Status: pending
Action: audit
English: notes/java/junior/en/08-exceptions.md
Spanish: notes/java/junior/es/08-excepciones.md
Depends on: 05

Coverage concepts:

- Checked vs unchecked exceptions — why Spring Boot uses unchecked (`RuntimeException` subclasses): they do not need to be declared in the method signature and propagate freely to `@RestControllerAdvice`
- `RuntimeException` vs `Exception` — `RuntimeException` is unchecked (no `throws` declaration needed); `Exception` is checked (must declare with `throws` or catch it); always extend `RuntimeException` for custom exceptions in Spring Boot so they propagate without boilerplate
- `try` / `catch` / `throws` — reading Spring Boot exception handling code; `throws` in a method signature is a contract: the caller must handle it
- Creating a custom exception: `extends RuntimeException`, constructor that accepts a message, why you name it after what went wrong (`ResourceNotFoundException`)
- `throw new SomeException()` — how it propagates up the call stack until `@RestControllerAdvice` catches it and returns a JSON error response

Rationale: These concepts form the coherent coverage group “Exceptions”.

## 07 — Collections

Status: pending
Action: audit
English: notes/java/junior/en/07-collections.md
Spanish: notes/java/junior/es/07-colecciones.md
Depends on: 06

Coverage concepts:

- `List` — ordered, allows duplicates; used in repository results and service return types (`List<User>`)
- `Map` — key-value pairs; `Map.of("message", "Not found")` for quick immutable error response bodies; Spring serialises it to JSON automatically
- `Set` — no duplicates; used in many-to-many relationships (e.g. a user's set of roles or permissions)
- When to use each in a Spring Boot context — `List` for ordered results from queries, `Map` for ad-hoc response bodies, `Set` for relationship collections where duplicates are meaningless
- `ArrayList` vs `LinkedList` — `ArrayList` provides fast indexed access; `LinkedList` still needs
  O(n) traversal to locate a middle position and is only O(1) to insert/remove once an iterator is
  already there, so `ArrayList` is the normal application default
- `Comparable<T>` vs `Comparator<T>` — `Comparable` is implemented inside the class itself (`compareTo()`) and defines one natural order; `Comparator` is defined outside the class (`compare()`, or `Comparator.comparing()`) and supports multiple sort orders without changing the class; interviewers ask which one to use when you need to sort the same list two different ways
- `Comparator.comparing()` — sorts a list by a field: `list.stream().sorted(Comparator.comparing(Employee::getName))`; used in service methods when you need a specific order that the query does not guarantee; interviewers ask you to read and explain the comparator
- `ConcurrentModificationException` — thrown when you call `list.remove()` directly inside a for-each loop over that same list; the for-each loop uses an internal iterator that detects the structural change and fails fast; interviewers ask how to safely remove items while iterating (`removeIf()` is the cleanest fix; an explicit `Iterator.remove()` also works)

Rationale: These concepts form the coherent coverage group “Collections”.

## 08 — Enums

Status: pending
Action: audit
English: notes/java/junior/en/11-enums.md
Spanish: notes/java/junior/es/11-enums.md
Depends on: 07

Coverage concepts:

- Defining an enum — used for `Role` (EMPLOYEE, MANAGER) and `EntryStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED) in TimeTrack; interviewers ask you to show one from the project
- Using enums in `switch` expressions — the clean way to handle each status in a service method; exhaustive by default so the compiler warns if a case is missing
- `@Enumerated(EnumType.STRING)` vs `EnumType.ORDINAL` — `STRING` stores the name ("MANAGER") in the database; `ORDINAL` stores the position (0, 1, 2); if you add a new value in the middle of the enum, `ORDINAL` silently breaks all existing records; interviewers always ask why `STRING` is the safe choice

Rationale: These concepts form the coherent coverage group “Enums”.

## 09 — Annotations

Status: pending
Action: audit
English: notes/java/junior/en/13-annotations.md
Spanish: notes/java/junior/es/13-anotaciones.md
Depends on: 08

Coverage concepts:

- What annotations are — metadata attached to a class, method, or field that Spring reads at runtime to configure behaviour; they do not change what the code does on their own — they are instructions to the framework
- Meta-annotations — annotations that annotate other annotations; `@Service` is composed of `@Component` with a semantic label; this is why `@Service` and `@Repository` behave the same way as `@Component` for dependency injection — they are all discovered by Spring's component scan
- How to read an unfamiliar annotation — look at what it is composed of (meta-annotations), what it enables (like `@EnableMethodSecurity`), and which layer it belongs to; this skill matters because Spring Boot code is dense with annotations you did not write yourself

Rationale: These concepts form the coherent coverage group “Annotations”.

## 10 — Date and time

Status: pending
Action: audit
English: notes/java/junior/en/12-dates.md
Spanish: notes/java/junior/es/12-fechas.md
Depends on: 09

Coverage concepts:

- `LocalDate` — a date without time (`2025-05-14`); used for the `date` field on a TimeEntry; immutable and thread-safe unlike the legacy `java.util.Date`
- `LocalDateTime` — a local wall-clock date and time with no offset or timezone; suitable when the
  business meaning is local, but it cannot identify one exact instant globally
- `LocalDate` vs `LocalDateTime` vs `Instant` — use `LocalDate` for a calendar date,
  `LocalDateTime` for a timezone-free local value, and `Instant` for an exact point on the UTC
  timeline; interviewers ask which contract a timestamp field actually needs
- Why not `java.util.Date` — it is mutable, poorly designed, and replaced by the `java.time` API in Java 8; interviewers ask this directly when they see date fields in your project
- `DateTimeFormatter` — formatting a date for display or for an API response; `DateTimeFormatter.ISO_LOCAL_DATE` produces the standard `2025-05-14` format
- JPA mapping — Spring Boot serialises `LocalDate` and `LocalDateTime` to JSON automatically via Jackson when `jackson-datatype-jsr310` is on the classpath (included with `spring-boot-starter-web`)

Rationale: These concepts form the coherent coverage group “Date and time”.

## 11 — Maven

Status: pending
Action: audit
English: notes/java/junior/en/14-maven.md
Spanish: notes/java/junior/es/14-maven.md
Depends on: 10

Coverage concepts:

- `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build` — what each section does and where to add a new library
- How to add a dependency — search Maven Central, copy the `<dependency>` block, Maven downloads it automatically on the next build
- Build lifecycle: `clean`, `compile`, `test`, `package`, `install` — what `mvn clean install` does and why it is the standard command to build and test before pushing
- Dependency scopes — `compile` is the default, `test` is available only to tests, and `provided` is
  available for compile/test but omitted from the runtime artifact because the target JDK/container
  is expected to supply it

Rationale: These concepts form the coherent coverage group “Maven”.

## Unassigned existing notes

- notes/java/junior/en/00-intro-java.md — no junior coverage group is assigned to this legacy file.
- notes/java/junior/en/02-control-flow.md — no junior coverage group is assigned to this legacy file.
- notes/java/junior/en/03-methods.md — no junior coverage group is assigned to this legacy file.
- notes/java/junior/en/06-inheritance-polymorphism.md — no junior coverage group is assigned to this legacy file.
- notes/java/junior/en/15-memory-model.md — no junior coverage group is assigned to this legacy file.
