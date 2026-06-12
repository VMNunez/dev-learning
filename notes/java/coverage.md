# Minimum Coverage — Java

Java language concepts needed to write and understand Spring Boot code.
Nothing beyond what appears in a real Spring Boot project — not a general Java course.

## Classes and objects
- Classes, fields, constructors — every Spring component is a class; interviewers ask "what is an object in the context of a Spring bean?"
- `private final` fields — why Spring Boot services use them: dependencies cannot change after construction, easier to unit test
- Access modifiers: `public`, `private`, `protected` — what each restricts and why Spring Boot services use `private` for fields and `public` for methods
- `this` keyword — disambiguates between a field and a constructor parameter; appears in Lombok-generated code and custom constructors

## Interfaces and inheritance
- Interfaces: how to define and implement — why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`); interviewers ask "why does Spring prefer interfaces over concrete classes?"
- Implementing multiple interfaces — common in Spring Security (`UserDetails` combined with your entity class)
- `@Override` — marks a method that implements an interface or overrides a parent; the compiler catches mismatches; appears in `loadUserByUsername()`
- Why Spring Boot prefers interfaces for dependencies — you can swap implementations without changing the caller; the foundation of testable code

## Annotations
- What annotations are — metadata attached to a class, method, or field that Spring reads at runtime to configure behaviour
- Meta-annotations — annotations that annotate other annotations; `@Service` is a `@Component` with a semantic label; explains why `@Service` and `@Component` behave the same way
- How to read an unfamiliar annotation — look at what it is composed of, what it enables, and which layer it belongs to

## Generics
- `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` — reading and writing typed containers in Spring Boot code
- Why generics exist — catch type errors at compile time instead of at runtime
- `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()` — the correct way to handle a value that might not exist
- Why returning `null` is a problem — forces every caller to null-check; `Optional` makes the absence explicit in the return type; interviewers ask "why Optional instead of null?"

## Enums
- Defining an enum — used for `Role` (EMPLOYEE, MANAGER) and `EntryStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED) in TimeTrack
- Using enums in `switch` expressions — the clean way to handle each status in a service method
- `@Enumerated(EnumType.STRING)` — stores the name in the database instead of the ordinal position; interviewers ask why `STRING` is safer than the default

## Exceptions
- Checked vs unchecked exceptions — why Spring Boot uses unchecked (`RuntimeException` subclasses): they do not need to be declared in the method signature and propagate freely to `@RestControllerAdvice`
- `try` / `catch` / `throws` — reading Spring Boot exception handling code
- Creating a custom exception: `extends RuntimeException`, constructor that accepts a message, why you name it after what went wrong (`ResourceNotFoundException`)
- `throw new SomeException()` — how it propagates up the call stack until `@RestControllerAdvice` catches it and returns a JSON error

## Collections
- `List` — ordered, allows duplicates; used in repository results and service return types (`List<User>`)
- `Map` — key-value; `Map.of("message", "Not found")` for quick immutable error response bodies; Spring serialises it to JSON automatically
- `Set` — no duplicates; used in many-to-many relationships (e.g. a user's set of roles or permissions)
- When to use each in a Spring Boot context — `List` for ordered results, `Map` for ad-hoc response bodies, `Set` for relationship collections

## Date and time
- `LocalDate` — a date without time (`2025-05-14`); used for the `date` field on TimeEntry; immutable and thread-safe unlike the legacy `java.util.Date`
- `LocalDateTime` — a date with time (`2025-05-14T09:30:00`); used for `createdAt` and `updatedAt` timestamps; also immutable
- Why not `java.util.Date` — it is mutable, poorly designed, and replaced by the `java.time` API in Java 8; interviewers ask this directly when they see date fields in your project
- `DateTimeFormatter` — formatting a date for display or for an API response; `DateTimeFormatter.ISO_LOCAL_DATE` for standard ISO format
- JPA mapping — Spring Boot serialises `LocalDate` and `LocalDateTime` to JSON automatically via Jackson when `jackson-datatype-jsr310` is on the classpath (included with `spring-boot-starter-web`)

## Modern Java used in Spring Boot code
- Records — `record CreateUserRequest(String name, String email) {}` — immutable DTO alternative; Java 16+; interviewers ask "have you seen records used as DTOs?"
- `var` — local type inference; IntelliJ suggests it; you will see it in code reviews even if you do not write it yourself
- Lambda expressions — `list.stream().filter(x -> x.isActive()).collect(Collectors.toList())` — the syntax you see in service methods
- Stream basics: `filter()`, `map()`, `collect()`, `findFirst()`, `anyMatch()` — reading and writing stream pipelines in service logic
- Method references: `User::getName`, `this::toResponse` — shorthand for simple one-method lambdas; appear in code reviews

## Maven
- `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build` — what each section does and where to add a new library
- How to add a dependency — search Maven Central, copy the `<dependency>` block, Maven downloads it automatically
- Build lifecycle: `clean`, `compile`, `test`, `package`, `install` — what `mvn clean install` does and why it is the standard command
- Dependency scopes: `compile` (default, always available), `test` (only in tests), `provided` (available at runtime but not packaged) — why `spring-boot-starter-test` uses `test` scope
