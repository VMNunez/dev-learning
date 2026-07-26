# Java Junior Notes Plan

Plan status: current
Coverage: notes/java/coverage/junior.md
Coverage SHA-256: d30b9c5455aa8a6f33195d34e29c95fbfcc98153c6801ebd0d4cb1c351fdd42b
Generated: 2026-07-24

## 00 — Java execution foundations

Status: pending
Action: audit
English: notes/java/junior/en/00-intro-java.md
Spanish: notes/java/junior/es/00-intro-java.md
Depends on: none

Narrative role: Introduce Java as the execution language behind Victor's Spring Boot work and provide the map for the complete junior journey.

Learning outcome: Explain how Java source becomes a running program, distinguish compile-time from runtime failures, and describe why the remaining chapters follow this order.

Prerequisites: none

Must answer:

- What practical problem does Java solve in Victor's target Angular and Spring Boot stack?
- What happens between writing a `.java` file and the JVM executing its bytecode?
- How do compiler errors, runtime exceptions, and logic errors differ?
- Which learning route runs from values and control flow through objects, collections, failures, functional APIs, metadata, dates, and Maven, and why is it ordered that way?
- Why does that route introduce each dependency before later chapters rely on it?

Coverage concepts:

- Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs

Rationale: How source becomes executable and when failures surface is the foundation for reading every later Java example.

Handoff: Once Victor knows how Java code is checked and executed, entry 01 can introduce the values and types that every running program manipulates.

## 01 — Variables, types, Strings, and decimal values

Status: pending
Action: audit
English: notes/java/junior/en/01-variables-types.md
Spanish: notes/java/junior/es/01-variables-tipos.md
Depends on: 00

Narrative role: Establish Java's fixed type and value model before expressions, decisions, methods, or objects depend on it.

Learning outcome: Declare, initialise, convert, compare, and combine ordinary Java values while choosing safe representations for text, integers, nullable values, and money.

Prerequisites: 00

Must answer:

- Where does each kind of variable exist, and why must a local variable be definitely assigned before use?
- What is physically copied or stored by a primitive variable versus a reference variable?
- When do widening, narrowing, integer division, overflow, boxing, unboxing, and `null` produce surprising results?
- When should `int` become `long`, and when does the integer literal itself require an `L` suffix?
- Why are `String` and `BigDecimal` immutable, and when is `StringBuilder` the clearer accumulation tool?
- How do `isEmpty` and `isBlank` differ, why can an invalid `formatted` specifier fail at runtime, and how are scale and rounding chosen for `BigDecimal` division?
- Why does `var` still produce one fixed compile-time type?

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

Handoff: With values and their types established, entry 02 can control which operations run and how often they repeat.

## 02 — Control flow

Status: pending
Action: audit
English: notes/java/junior/en/02-control-flow.md
Spanish: notes/java/junior/es/02-flujo-de-control.md
Depends on: 01

Narrative role: Turn individual expressions into programs that choose, repeat, skip, and terminate work predictably.

Learning outcome: Select the appropriate conditional, loop, switch form, or control-transfer statement for a concrete execution contract and trace its effect.

Prerequisites: 01

Must answer:

- Why can short-circuit evaluation prevent both unnecessary work and runtime failure?
- How should conditions be ordered so a broad case does not hide a specific one?
- Which loop form matches counted, element-based, pre-checked, or post-checked repetition?
- What exactly leaves the current loop or method when `break`, `continue`, or `return` executes?
- Why does classic `switch` fall through, and how do switch expressions remove that risk while remaining exhaustive?

Coverage concepts:

- Operators and short-circuit evaluation — use arithmetic, comparison, logical, and assignment operators and explain why `&&` and `||` may skip the right operand
- `if` / `else` — select one branch from boolean conditions and order conditions so specific or exceptional cases are not hidden by broader ones
- `for`, enhanced `for`, `while`, and `do-while` — choose counted iteration, element traversal, pre-checked repetition, or post-checked repetition according to the loop contract
- `break`, `continue`, and `return` — distinguish leaving a loop, skipping to its next iteration, and leaving the current method
- Classic `switch` fall-through — without `break`, a matching statement case continues into later cases and can create a hidden logic bug
- Switch expressions — arrow cases can produce a value without fall-through, and an expression must cover every possible input

Rationale: Conditions, loops, control-transfer statements, and switch forms belong together because they determine which statements execute and in what order.

Handoff: After Victor can control statement execution, entry 03 packages that behaviour into callable methods and explains what crosses each call boundary.

## 03 — Methods and object references

Status: pending
Action: audit
English: notes/java/junior/en/03-methods.md
Spanish: notes/java/junior/es/03-metodos.md
Depends on: 02

Narrative role: Introduce methods as named contracts and connect calls to reference copying, stack frames, packages, aliases, and null safety at the call boundary.

Learning outcome: Read and design a method signature, predict overload selection and argument effects, and trace a call until it returns, with throwing marked only as a preview of entry 08.

Prerequisites: 02

Must answer:

- How do a signature, parameter list, return type, and overload determine whether a call compiles?
- If Java is always pass-by-value, why can a method mutate an object but not replace the caller's variable?
- What does a call-stack frame contain, and why is it removed on both return and throw?
- How do static members, instance members, packages, imports, aliases, and `null` change what a method can access safely?
- What constructor rules will entry 04 add once classes and inheritance have been introduced?

Coverage concepts:

- Method signatures, parameters, and return values — read what a method accepts, what it returns, and which overload a call can match
- Java pass-by-value — every argument is copied; for an object the copied value is a reference, so a method can mutate that object but cannot replace the caller's variable
- Call stack and method returns — each call creates a frame holding its local state, and returning or throwing removes frames toward the caller
- Overloading — methods share a name but have different parameter lists, and the compiler selects the applicable signature
- `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object
- Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other
- `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries

Rationale: Method contracts, calls, argument copying, stack frames, constructors, and references form one continuous account of how Java code invokes behaviour.

Handoff: Methods now have a call model; entry 04 places them inside classes whose state, invariants, equality, and diagnostic representation form usable domain objects.

## 04 — Classes, encapsulation, equality, and records

Status: pending
Action: audit
English: notes/java/junior/en/04-oop-classes.md
Spanish: notes/java/junior/es/04-poo-clases.md
Depends on: 03

Narrative role: Build valid domain objects from the method and reference mechanics already learned, then define how those objects protect state and represent value.

Learning outcome: Design a small class or record with valid construction, controlled visibility, appropriate immutability, semantic equality, hashing, and useful diagnostics.

Prerequisites: 03

Must answer:

- What do a class, object, field, constructor, and `this` each contribute to an instance?
- How do access modifiers and encapsulation prevent callers from breaking an invariant?
- What does each use of `final` prevent, and why does a final reference not make its object deeply immutable?
- What does `private final` guarantee about replacing a field reference, and what does it not guarantee about the referenced object?
- When does Java provide a default constructor, and how does `this(...)` chain overloads within one class?
- When is a record appropriate, and what does Java generate for its components?
- Why must `equals` and `hashCode` agree, and how can mutating a hash key make it unreachable?
- When should code use identity, semantic equality, `Objects.equals`, or `toString`, and why must `toString` neither expose secrets nor become a serialization contract?

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

Handoff: Once concrete objects can preserve valid state, entry 05 separates the behaviour callers need from the classes that happen to implement it.

## 05 — Interfaces and abstract classes

Status: pending
Action: audit
English: notes/java/junior/en/05-interfaces-abstract.md
Spanish: notes/java/junior/es/05-interfaces-abstractas.md
Depends on: 04

Narrative role: Replace dependence on one concrete class with explicit behavioural contracts while showing where shared state or implementation still justifies an abstract class.

Learning outcome: Choose and implement an interface or abstract class, including default methods and multiple contracts, while using `@Override` as a compiler-checked guarantee.

Prerequisites: 04

Must answer:

- How does an interface let callers depend on behaviour rather than a concrete implementation?
- When does shared instance state or construction make an abstract class more suitable?
- How can one class implement multiple interfaces but extend only one class?
- What problem do default methods solve, and how can an implementation replace their behaviour?
- What mistake does `@Override` make the compiler detect?

Coverage concepts:

- Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class
- Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration

Rationale: Interfaces, abstract classes, default methods, and multiple contracts are one coherent unit about declaring shared behaviour independently of concrete implementations.

Handoff: With contracts separated from implementations and superclass construction previewed, entry 06 explains how inheritance and runtime dispatch select behaviour and when composition is the safer design.

## 06 — Inheritance and polymorphism

Status: pending
Action: audit
English: notes/java/junior/en/06-inheritance-polymorphism.md
Spanish: notes/java/junior/es/06-herencia-polimorfismo.md
Depends on: 05

Narrative role: Explain runtime substitution across class and interface hierarchies while contrasting inheritance with composition and compile-time overloading.

Learning outcome: Predict which overridden method runs through a parent or interface reference and choose inheritance, composition, or a guarded subtype check deliberately.

Prerequisites: 05

Must answer:

- What is the practical difference between an is-a inheritance relationship and a has-a composition relationship?
- How does dynamic dispatch choose an overridden instance method from the runtime object?
- When does Java supply a default constructor, how does `this(...)` chain within one class, and why must `super(...)` initialise the superclass first?
- Why is overriding resolved at runtime while overloading is selected at compile time?
- When is `instanceof` pattern matching justified, and when does it reveal a weak abstraction?
- How do `final` classes or methods constrain extension and dispatch?

Coverage concepts:

- Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object
- Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast
- Constructor defaults and chaining — recognise when Java supplies a no-argument constructor, chain overloads with `this(...)`, and initialise the superclass first through `super(...)`

Rationale: Inheritance, composition, dynamic dispatch, overriding, and runtime type checks belong together as alternative and related ways to reuse and select behaviour.

Handoff: Polymorphic APIs expose parameterised types and possibly absent results; entry 07 teaches generics and Optional before collections and streams rely on them.

## 07 — Generics and Optional

Status: pending
Action: audit
English: notes/java/junior/en/10-generics.md
Spanish: notes/java/junior/es/10-genericos.md
Depends on: 06

Narrative role: Make container type contracts explicit and then apply them to APIs where a value may be absent.

Learning outcome: Read and use generic and nested generic APIs safely, explain invariance and wildcard intent, and handle an `Optional` result without eager fallbacks or unchecked access.

Prerequisites: 06

Must answer:

- How do generic types and methods preserve compile-time safety and remove casts?
- What safety is lost with a raw type, and when can diamond inference recover constructor arguments?
- Why is `List<Dog>` not a subtype of `List<Animal>`?
- How should `?`, `? extends T`, `? super T`, and a nested type such as `ResponseEntity<List<User>>` be read?
- When is `Optional<T>` an honest return contract, and why is it usually inappropriate for fields and parameters?
- How do `map`, `ifPresent`, `orElseGet`, and `orElseThrow` handle presence and absence?
- Why can `orElse` perform unnecessary work that `orElseGet` avoids?

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

Handoff: With parameterised containers and absence understood, entry 08 can teach collection contracts without unexplained generic syntax.

## 08 — Collections and ordering

Status: pending
Action: audit
English: notes/java/junior/en/07-collections.md
Spanish: notes/java/junior/es/07-colecciones.md
Depends on: 07

Narrative role: Move from individual objects to groups whose sequence, uniqueness, lookup, mutation, and ordering semantics are explicit.

Learning outcome: Read the minimal parameterised-type syntax used by collection APIs, choose an appropriate collection interface and implementation, iterate and remove safely, and define ordering consistent with equality.

Prerequisites: 07

Must answer:

- When does a problem require an array, `List`, `Set`, or `Map`?
- How can `Map` distinguish an absent key from a key explicitly mapped to `null`?
- Why should a declaration normally expose the weakest useful interface while construction chooses a concrete implementation?
- What guarantees and restrictions come from collection factories, and why are their elements not automatically deeply immutable?
- Why is `ArrayList` the normal list choice, and what operations remain linear or expected constant time?
- Why can structural modification during for-each fail, and which removal mechanisms are safe?
- How do `Comparable`, a named `Comparator`, equality, and sorted-key uniqueness interact, and why is `Comparator.comparing` only previewed until entry 09 teaches lambdas and method references?

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

Handoff: Collections create more opportunities for lookup, mutation, and I/O failures; entry 09 develops a complete model for propagating, handling, and diagnosing those failures.

## 09 — Exceptions and diagnostics

Status: pending
Action: audit
English: notes/java/junior/en/08-exceptions.md
Spanish: notes/java/junior/es/08-excepciones.md
Depends on: 08

Narrative role: Treat failure as part of a method's contract and follow it from the throw site through stack unwinding, handling, cleanup, and diagnosis.

Learning outcome: Distinguish exception categories, preserve useful context, choose a targeted handling boundary, close resources safely, and extract the actionable cause from a stack trace.

Prerequisites: 08

Must answer:

- What compile-time obligation separates checked from unchecked exceptions?
- What does `throw` do at one execution point, and what does a `throws` clause communicate to callers?
- How does an exception remove call frames until a compatible handler is found?
- What belongs in `try`, targeted `catch`, `finally`, or try-with-resources, and why is an empty broad catch dangerous?
- How should a custom exception preserve its original cause?
- In what order should the type, message, cause chain, and first application frame be read?

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

Handoff: Once failure paths are explicit, entry 10 can introduce small behaviour values and lazy stream pipelines without hiding errors or stateful control flow.

## 10 — Lambdas and streams

Status: pending
Action: audit
English: notes/java/junior/en/09-streams-lambdas.md
Spanish: notes/java/junior/es/09-streams-lambdas.md
Depends on: 07, 08, 09

Narrative role: Add Java's functional vocabulary and use it to express focused collection transformations while preserving the earlier equality, ordering, and exception contracts.

Learning outcome: Match a lambda or method reference to its functional interface and build, execute, and evaluate a readable stream pipeline without mutating its source.

Prerequisites: 07, 08, 09

Must answer:

- How do `Predicate`, `Function`, `Consumer`, and `Supplier` determine a lambda's accepted input and produced result?
- When is a method reference exactly equivalent to a delegating lambda?
- Which stream operations are lazy intermediate stages, and what happens when a terminal operation consumes the stream?
- Why can a consumed stream not be reused?
- How do `filter`, `map`, `flatMap`, ordering, deduplication, reduction, `findFirst`, `anyMatch`, and `allMatch` change the pipeline's result?
- Why must a reduction operation be associative?
- When is a loop clearer than a stream because branching, early exit, or mutable state dominates?
- What mutability guarantee differs between `Stream.toList()` and `Collectors.toList()`?
- How does the `Optional<T>` contract from entry 07 shape the result of `findFirst`?

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

Handoff: Functional pipelines complete Java's main data-processing route; entry 11 then narrows arbitrary values into compiler-known closed domain sets.

## 11 — Enums

Status: pending
Action: audit
English: notes/java/junior/en/11-enums.md
Spanish: notes/java/junior/es/11-enums.md
Depends on: 02, 04

Narrative role: Replace fragile magic strings with a closed domain type whose identity, data, behaviour, and exhaustive branching the compiler can understand.

Learning outcome: Model a closed set with an enum, compare constants safely, attach domain behaviour when justified, and write an exhaustive switch expression.

Prerequisites: 02, 04

Must answer:

- Why is an enum safer than scattering string constants through the codebase?
- Why is `==` correct for enum constants even though object value equality normally uses `equals`?
- When do fields or methods belong on an enum rather than in external conditionals?
- How does an enum switch expression expose a newly added constant at compile time?
- Why can a default branch hide a missing domain case?

Coverage concepts:

- Enums — model a closed set of named domain values instead of scattering magic Strings through control flow
- Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour
- Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions

Rationale: Enum identity, behaviour, and exhaustive switching jointly model and operate on a closed set of domain values.

Handoff: Domain values often include business dates and timestamps; entry 12 chooses the right immutable time type by reading its API contract.

## 12 — Date, time, and API literacy

Status: pending
Action: audit
English: notes/java/junior/en/12-dates.md
Spanish: notes/java/junior/es/12-fechas.md
Depends on: 01, 03

Narrative role: Apply the value-object model to time and develop the API-reading skill needed to use unfamiliar standard-library types independently.

Learning outcome: Choose and format the correct immutable `java.time` value for a business contract and infer usage constraints from Javadoc signatures.

Prerequisites: 01, 03

Must answer:

- Which business fact calls for `LocalDate`, `LocalDateTime`, or `Instant`?
- Why does a timezone-free local date-time not identify one universal moment?
- How does immutability affect date arithmetic and formatting?
- Why is `DateTimeFormatter` safer than ambiguous hand-built strings or legacy mutable date APIs?
- How can a Javadoc signature reveal arguments, return values, generic types, and possible exceptions before code is written?

Coverage concepts:

- `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract
- Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

Rationale: The java.time value types, formatting, and signature-reading skills form one unit for choosing and using library types from their contracts.

Handoff: Javadoc explains ordinary API contracts; entry 13 adds metadata contracts that compilers, frameworks, and other tools inspect around Java declarations.

## 13 — Annotations

Status: pending
Action: audit
English: notes/java/junior/en/13-annotations.md
Spanish: notes/java/junior/es/13-anotaciones.md
Depends on: 03, 12

Narrative role: Introduce annotations as metadata consumed by a specific tool, so familiar Spring-shaped annotations can be read without mistaking them for executable method calls.

Learning outcome: Determine where an annotation may appear, how long it is retained, who processes it, and where to find the contract of an unfamiliar annotation.

Prerequisites: 03, 12

Must answer:

- What information does an annotation record, and why does the annotation itself not perform the advertised behaviour?
- How do target and retention constrain placement and availability?
- What changes when metadata is consumed by the compiler, a build tool, or a runtime framework?
- Which parts of an unfamiliar annotation's documented contract must be checked before using it?
- Why should framework examples be treated as previews of Spring Boot rather than as hidden Java syntax?

Coverage concepts:

- Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

Rationale: Annotation metadata and the process for reading unfamiliar annotations form one focused unit about tool-consumed declarations.

Handoff: Once source and metadata depend on external libraries and tools, entry 14 closes the junior route by making the Maven build that resolves, tests, and packages them understandable.

## 14 — Maven fundamentals

Status: pending
Action: audit
English: notes/java/junior/en/14-maven.md
Spanish: notes/java/junior/es/14-maven.md
Depends on: 13

Narrative role: Connect Java source, external artifacts, tests, plugins, and reproducible project builds through Maven's declarative model.

Learning outcome: Read a `pom.xml`, identify and verify a dependency, predict lifecycle and scope effects, and use the repository's wrapper for a consistent build.

Prerequisites: 13

Must answer:

- How do `groupId`, `artifactId`, and `version` identify one artifact?
- What distinct jobs do dependencies, plugins, properties, and inherited configuration perform in a POM?
- How does Maven resolve direct and transitive dependencies, and where can an unexpected version be inspected?
- Why does invoking a later lifecycle phase also run earlier phases?
- Which compile, runtime, test, or provided classpath should contain a dependency?
- Why does the Maven Wrapper improve consistency between Victor's machine and CI?

Coverage concepts:

- Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version`
- `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles
- Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions
- Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended
- Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version

Rationale: Coordinates, POM structure, resolution, lifecycle, scopes, and the wrapper describe one complete beginner workflow for building Java projects with Maven.

Handoff: Maven closes the junior journey by turning the language concepts from entries 00–13 into a repeatable compile-test-package workflow ready for Spring Boot projects and later middle-level Java design.

## Unassigned existing notes

- notes/java/junior/en/15-memory-model.md — its JVM memory and garbage-collection depth is not owned by the selected junior coverage.
