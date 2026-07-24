# Java Junior Notes Plan

Plan status: current
Coverage: notes/java/coverage/junior.md
Coverage SHA-256: d30b9c5455aa8a6f33195d34e29c95fbfcc98153c6801ebd0d4cb1c351fdd42b
Generated: 2026-07-24

## 00 — Java execution foundations

Status: complete
Action: audit
English: notes/java/junior/en/00-intro-java.md
Spanish: notes/java/junior/es/00-intro-java.md
Depends on: none

Coverage concepts:

- Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs

Rationale: How source becomes executable and when failures surface is the foundation for reading every later Java example.

## 01 — Variables, types, Strings, and decimal values

Status: pending
Action: audit
English: notes/java/junior/en/01-variables-types.md
Spanish: notes/java/junior/es/01-variables-tipos.md
Depends on: 00

Coverage concepts:

- Variables, declared types, initialization, and scope — know where a local, parameter, field, or block variable exists and that local variables must be definitely assigned before use
- Primitive vs reference types — primitives hold a value, while reference variables identify objects and may be `null`
- `int` vs `long` — choose `long` when the range can exceed `int`; use an `L` suffix only when the integer literal itself does not fit in `int`
- Primitive vs wrapper types — wrappers support generics and `null`, while unboxing a null wrapper throws `NullPointerException`
- Numeric conversions and casts — widening conversions are normally safe, while narrowing can lose range or precision and therefore requires an explicit cast
- Integer arithmetic — recognise integer division, overflow, and the need to promote an operand when fractional or wider arithmetic is required
- `var` — local type inference does not make Java dynamically typed; the compiler infers one fixed type from the initializer
- String immutability — String operations return new values rather than modifying the original object
- `String.isEmpty()` vs `String.isBlank()` — empty means length zero, while blank also includes whitespace-only content
- `String.formatted()` — substitute values into a format string while understanding that invalid format specifiers fail at runtime
- `String` concatenation vs `StringBuilder` — use simple `+` for small expressions and a mutable builder for repeated accumulation that would create many intermediate Strings
- `BigDecimal` for money and decimal arithmetic — avoid binary floating-point error, remember operations return new values, and choose explicit scale and rounding for division

Rationale: These concepts share Java's value model: declared types, numeric representation, nullability, inference, and immutable text and decimal values.

## 02 — Control flow

Status: pending
Action: audit
English: notes/java/junior/en/02-control-flow.md
Spanish: notes/java/junior/es/02-flujo-de-control.md
Depends on: 01

Coverage concepts:

- Operators and short-circuit evaluation — use arithmetic, comparison, logical, and assignment operators and explain why `&&` and `||` may skip the right operand
- `if` / `else` — select one branch from boolean conditions and order conditions so specific or exceptional cases are not hidden by broader ones
- `for`, enhanced `for`, `while`, and `do-while` — choose counted iteration, element traversal, pre-checked repetition, or post-checked repetition according to the loop contract
- `break`, `continue`, and `return` — distinguish leaving a loop, skipping to its next iteration, and leaving the current method
- Classic `switch` fall-through — without `break`, a matching statement case continues into later cases and can create a hidden logic bug
- Switch expressions — arrow cases can produce a value without fall-through, and an expression must cover every possible input

Rationale: Conditions, loops, control-transfer statements, and switch forms belong together because they determine which statements execute and in what order.

## 03 — Methods and object references

Status: pending
Action: audit
English: notes/java/junior/en/03-methods.md
Spanish: notes/java/junior/es/03-metodos.md
Depends on: 02

Coverage concepts:

- Method signatures, parameters, and return values — read what a method accepts, what it returns, and which overload a call can match
- Java pass-by-value — every argument is copied; for an object the copied value is a reference, so a method can mutate that object but cannot replace the caller's variable
- Call stack and method returns — each call creates a frame holding its local state, and returning or throwing removes frames toward the caller
- Overloading — methods share a name but have different parameter lists, and the compiler selects the applicable signature
- Constructor defaults and chaining — recognise when Java supplies a no-argument constructor, chain overloads with `this(...)`, and initialise the superclass first through `super(...)`
- `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object
- Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other
- `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries

Rationale: Method contracts, calls, argument copying, stack frames, constructors, and references form one continuous account of how Java code invokes behaviour.

## 04 — Classes, encapsulation, equality, and records

Status: pending
Action: audit
English: notes/java/junior/en/04-oop-classes.md
Spanish: notes/java/junior/es/04-poo-clases.md
Depends on: 03

Coverage concepts:

- Classes, objects, fields, and constructors — define state and behaviour, create instances, and establish valid initial state during construction
- `this` — refer to the current instance and disambiguate a field from a parameter with the same name
- Encapsulation — keep representation private and expose behaviour or controlled access so callers cannot bypass class invariants
- Access modifiers — distinguish `public`, `protected`, package-private, and `private` visibility when reading code across packages and hierarchies
- `final` variables, fields, methods, and classes — prevent reassignment, overriding, or inheritance as applicable; a final reference does not make its object immutable
- `private final` fields — a constructor can assign the reference once and later methods cannot replace it, although the referenced object may still be mutable
- Records — use a concise data carrier with final components and generated accessors, canonical construction, `equals`, `hashCode`, and `toString`
- Shallow vs deep immutability — final fields or record components prevent reassignment but do not make referenced mutable objects immutable
- Identity vs value equality — `==` compares primitive values or reference identity, while `equals` expresses semantic equality for objects
- `String.equals()` vs `==` — compare String content with `equals`; `==` only asks whether both references identify the same object
- Wrapper equality and boxing — automatic boxing/unboxing converts between primitives and wrappers, but wrapper `==` may appear to work because of caching and must not be used for value equality
- `Objects.equals(a, b)` — perform null-safe object equality by handling nulls before delegating to `equals`
- The `equals` / `hashCode` contract — equal objects must have equal hash codes, and both methods must change together for correct `HashSet` and `HashMap` behaviour
- Mutable hash keys — changing fields used by `equals` or `hashCode` after insertion can make an entry effectively unreachable in a hash-based collection
- `toString()` — provide a useful textual representation for diagnostics without exposing secrets or relying on it as a serialization contract

Rationale: Class state, visibility, immutability boundaries, records, and equality contracts jointly define how ordinary domain objects are represented and compared.

## 05 — Interfaces and abstract classes

Status: pending
Action: audit
English: notes/java/junior/en/05-interfaces-abstract.md
Spanish: notes/java/junior/es/05-interfaces-abstractas.md
Depends on: 04

Coverage concepts:

- Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class
- Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration

Rationale: Interfaces, abstract classes, default methods, and multiple contracts are one coherent unit about declaring shared behaviour independently of concrete implementations.

## 06 — Inheritance and polymorphism

Status: pending
Action: audit
English: notes/java/junior/en/06-inheritance-polymorphism.md
Spanish: notes/java/junior/es/06-herencia-polimorfismo.md
Depends on: 05

Coverage concepts:

- Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object
- Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast

Rationale: Inheritance, composition, dynamic dispatch, overriding, and runtime type checks belong together as alternative and related ways to reuse and select behaviour.

## 07 — Collections and ordering

Status: pending
Action: audit
English: notes/java/junior/en/07-collections.md
Spanish: notes/java/junior/es/07-colecciones.md
Depends on: 06

Coverage concepts:

- Arrays vs collections — arrays have a fixed length and indexed elements, while collection APIs provide resizable and semantic data structures
- `List` — preserve encounter order and allow duplicates when position or sequence matters
- `Set` — represent unique elements when duplicates have no meaning
- `Map` — associate unique keys with values and distinguish missing keys from keys explicitly mapped to `null`
- `ArrayList`, `HashSet`, and `HashMap` — recognise the normal general-purpose implementations for list, set, and map semantics
- Collection interfaces vs implementations — declare the weakest useful contract such as `List` while choosing a concrete implementation such as `ArrayList` at construction
- Collection factories and copies — `List.of`, `Set.of`, and `Map.of` reject nulls and return unmodifiable collections, which still does not make mutable elements deeply immutable
- `ArrayList` vs `LinkedList` — prefer `ArrayList` for normal application access; linked nodes do not make locating a middle position constant-time
- Iteration and safe removal — do not structurally modify a collection through the collection itself during for-each iteration; use `removeIf` or the iterator's own `remove`
- Practical complexity recognition — distinguish linear list search from expected constant-time hash lookup without treating Big-O as a substitute for measurement
- `Comparable<T>` vs `Comparator<T>` — define one natural order inside a type or multiple external orderings without changing that type
- `Comparator.comparing()` — build a field-based ordering and compose tie-breakers when the primary key is equal
- Equality vs ordering consistency — understand that sorted sets and maps treat `compareTo` or `compare` returning zero as the same key even when `equals` disagrees

Rationale: Collection semantics, implementations, mutation rules, lookup cost, and ordering contracts form the practical toolkit for storing groups of objects.

## 08 — Exceptions and diagnostics

Status: pending
Action: audit
English: notes/java/junior/en/08-exceptions.md
Spanish: notes/java/junior/es/08-excepciones.md
Depends on: 07

Coverage concepts:

- Checked vs unchecked exceptions — checked exceptions must be caught or declared, while `RuntimeException` subclasses do not carry that compile-time requirement
- `throw` vs `throws` — a `throw` statement evaluates an exception reference and completes abruptly, while a `throws` clause declares possible checked failures to callers
- Exception propagation and stack unwinding — an uncaught exception removes call frames until a compatible handler is found or the thread terminates
- Targeted `try` / `catch` / `finally` — catch only failures that can be handled or contextualised and use `finally` for cleanup that must run
- Try-with-resources — close `AutoCloseable` resources on both success and failure without duplicating cleanup code
- Custom exceptions and preserved causes — name a meaningful failure and pass the original cause when adding context
- Do not swallow exceptions — an empty or over-broad catch hides the failure and leaves callers unable to distinguish success from corruption
- Reading stack traces — identify the exception type, message, cause chain, and first relevant application frame before changing code

Rationale: Exception categories, propagation, handling, cleanup, causes, and stack traces form one failure lifecycle from origin to diagnosis.

## 09 — Lambdas and streams

Status: pending
Action: audit
English: notes/java/junior/en/09-streams-lambdas.md
Spanish: notes/java/junior/es/09-streams-lambdas.md
Depends on: 08

Coverage concepts:

- `Predicate<T>` — represent a test from one input to a boolean result
- `Function<T, R>` — represent a transformation from an input type to an output type
- `Consumer<T>` — accept a value for a side effect without returning a result
- `Supplier<T>` — produce a value without receiving an input
- Lambda expressions — pass small pieces of behaviour to APIs while keeping parameter and return types consistent with the target functional interface
- Method references — use forms such as `Employee::getName` when a lambda only delegates to an existing method
- Stream pipeline lifecycle — create a lazy intermediate pipeline and trigger it once with a terminal operation; a consumed stream cannot be reused
- `filter`, `map`, and `toList` — select and transform elements into a result without mutating the source collection
- `flatMap` — transform each element into zero or more elements and flatten the nested results into one stream
- `sorted` and `distinct` — order elements or remove duplicates while recognising their dependence on comparison and equality contracts
- `reduce` and simple aggregation — combine stream elements into one result with an identity or accumulator whose operation is associative
- `findFirst`, `anyMatch`, and `allMatch` — express search and predicate checks with the appropriate Optional or boolean result
- Stream side effects vs loops — keep stream transformations side-effect free and choose a loop when stateful branching or early control flow is clearer
- `Stream.toList()` vs `Collectors.toList()` — `Stream.toList()` returns an unmodifiable list, while `Collectors.toList()` makes no mutability guarantee

Rationale: Functional interfaces, lambdas, method references, and stream operations form one pipeline-oriented way to pass behaviour and transform data.

## 10 — Generics and Optional

Status: pending
Action: audit
English: notes/java/junior/en/10-generics.md
Spanish: notes/java/junior/es/10-genericos.md
Depends on: 09

Coverage concepts:

- Generic types and methods — use type parameters such as `List<User>` and `<T>` to preserve compile-time type safety and avoid casts
- Raw types and diamond inference — avoid raw collections that discard type checks and use `<>` when the compiler can infer constructor type arguments
- Generic invariance — `List<Dog>` is not a subtype of `List<Animal>` because adding another Animal through that alias would break type safety
- Wildcard recognition — read `?`, `? extends T`, and `? super T` in library signatures without attempting advanced generic API design
- Nested generic APIs — read types such as `Optional<User>`, `Page<User>`, and `ResponseEntity<List<User>>` by working from the outer container inward
- `Optional<T>` as a return contract — make an absent result explicit when absence is normal, rather than using it for every nullable field or parameter
- `Optional.map` and `ifPresent` — transform a present value or run a side effect without manually branching on presence
- `Optional.orElseGet` and `orElseThrow` — produce a lazy fallback or fail with a meaningful exception instead of calling unchecked `get`
- `orElse` vs `orElseGet` — `orElse` evaluates its fallback eagerly, while `orElseGet` calls its supplier only when the Optional is empty

Rationale: Generic type safety, variance recognition, nested containers, and Optional contracts belong together because they express what values a container may hold.

## 11 — Enums

Status: pending
Action: audit
English: notes/java/junior/en/11-enums.md
Spanish: notes/java/junior/es/11-enums.md
Depends on: 10

Coverage concepts:

- Enums — model a closed set of named domain values instead of scattering magic Strings through control flow
- Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour
- Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions

Rationale: Enum identity, behaviour, and exhaustive switching jointly model and operate on a closed set of domain values.

## 12 — Date, time, and API literacy

Status: pending
Action: audit
English: notes/java/junior/en/12-dates.md
Spanish: notes/java/junior/es/12-fechas.md
Depends on: 11

Coverage concepts:

- `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract
- Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

Rationale: The java.time value types, formatting, and signature-reading skills form one unit for choosing and using library types from their contracts.

## 13 — Annotations

Status: pending
Action: audit
English: notes/java/junior/en/13-annotations.md
Spanish: notes/java/junior/es/13-anotaciones.md
Depends on: 12

Coverage concepts:

- Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

Rationale: Annotation metadata and the process for reading unfamiliar annotations form one focused unit about tool-consumed declarations.

## 14 — Maven fundamentals

Status: pending
Action: audit
English: notes/java/junior/en/14-maven.md
Spanish: notes/java/junior/es/14-maven.md
Depends on: 13

Coverage concepts:

- Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version`
- `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles
- Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions
- Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended
- Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version

Rationale: Coordinates, POM structure, resolution, lifecycle, scopes, and the wrapper describe one complete beginner workflow for building Java projects with Maven.

## Unassigned existing notes

- notes/java/junior/en/15-memory-model.md — its JVM memory and garbage-collection depth is not owned by the selected junior coverage.
