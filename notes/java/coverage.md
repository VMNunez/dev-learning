# Minimum Coverage — Java

Only the Java concepts needed to write and understand Spring Boot code.
Every item must be explainable by referencing a real example from Victor's projects.

## Classes and objects
- [ ] Classes, fields, constructors — defining and instantiating objects
- [ ] `private final` fields — why Spring Boot services use them (immutability, easier to test)
- [ ] Access modifiers: `public`, `private`, `protected` — what each restricts
- [ ] `this` keyword — when it appears in Spring Boot code

## Interfaces and inheritance
- [ ] Interfaces: how to define and implement — why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`)
- [ ] Implementing multiple interfaces — common in Spring Security (`UserDetails` + your entity)
- [ ] `@Override` — what it means, when it appears
- [ ] Why Spring Boot prefers interfaces over concrete classes for dependencies

## Annotations
- [ ] What annotations are — metadata on classes, methods, and fields that Spring reads at runtime
- [ ] Meta-annotations — annotations that annotate other annotations (`@Service` is a `@Component`)
- [ ] How to read an unfamiliar annotation in Spring code without panic

## Generics
- [ ] `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` — reading and using typed containers
- [ ] Why generics exist — catching type errors at compile time
- [ ] `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()`
- [ ] Why `Optional` is preferred over returning `null` in Spring Boot services

## Enums
- [ ] Defining an enum — used for status, role, type fields throughout Spring Boot
- [ ] Using enums in `switch` expressions
- [ ] `@Enumerated(EnumType.STRING)` — storing enum name in the database instead of ordinal

## Exceptions
- [ ] Checked vs unchecked exceptions — why Spring Boot uses unchecked (`RuntimeException` subclasses)
- [ ] `try` / `catch` / `throws` — reading Spring Boot exception handling code
- [ ] Creating a custom exception: `extends RuntimeException`, constructors, message
- [ ] `throw new SomeException()` — how it propagates up to `@RestControllerAdvice`

## Collections
- [ ] `List` — ordered, allows duplicates; used in repository results and service return types
- [ ] `Map` — key-value; `Map.of("key", "value")` for quick immutable error response bodies
- [ ] `Set` — no duplicates; used in many-to-many relationships
- [ ] When to use each in a Spring Boot context

## Modern Java used in Spring Boot code
- [ ] Records — `record CreateUserRequest(String name, String email) {}` — immutable DTO alternative
- [ ] `var` — local type inference; IntelliJ uses it, you will see it in code reviews
- [ ] Lambda expressions — `list.stream().filter(x -> x.isActive()).collect(Collectors.toList())`
- [ ] Stream basics: `filter()`, `map()`, `collect()`, `findFirst()`, `anyMatch()` — reading service logic
- [ ] Method references: `User::getName`, `this::convert` — shorthand for simple lambdas

## Maven
- [ ] `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build`, `plugins`
- [ ] How to add a dependency: search Maven Central, copy the `<dependency>` block
- [ ] Build lifecycle: `clean`, `compile`, `test`, `package`, `install` — what `mvn clean install` does
- [ ] Dependency scopes: `compile` (default), `test`, `provided` — when each is used
