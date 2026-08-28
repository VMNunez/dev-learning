# Junior Coverage — Java

Java language and core-library concepts needed to read, write, test, and debug ordinary Spring Boot application code.
Framework behaviour remains in Spring Boot coverage; examples here may use Spring-shaped classes when they expose a Java mechanism.

## Execution, variables, and control flow

- Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs
- Variables, declared types, initialization, and scope — know where a local, parameter, field, or block variable exists and that local variables must be definitely assigned before use
- Primitive vs reference types — primitives hold a value, while reference variables identify objects and may be `null`
- `int` vs `long` — choose `long` when the range can exceed `int`; use an `L` suffix only when the integer literal itself does not fit in `int`
- Primitive vs wrapper types — wrappers support generics and `null`, while unboxing a null wrapper throws `NullPointerException` ✅ 07-timetrack
- Numeric conversions and casts — widening conversions are normally safe, while narrowing can lose range or precision and therefore requires an explicit cast
- Integer arithmetic — recognise integer division, overflow, and the need to promote an operand when fractional or wider arithmetic is required
- Operators and short-circuit evaluation — use arithmetic, comparison, logical, and assignment operators and explain why `&&` and `||` may skip the right operand
- `if` / `else` — select one branch from boolean conditions and order conditions so specific or exceptional cases are not hidden by broader ones
- Conditional (ternary) operator — `condition ? a : b` chooses one of two values as an expression, unlike an `if` / `else` statement, which does not itself produce a value
- `for`, enhanced `for`, `while`, and `do-while` — choose counted iteration, element traversal, pre-checked repetition, or post-checked repetition according to the loop contract
- `break`, `continue`, and `return` — distinguish leaving a loop, skipping to its next iteration, and leaving the current method
- Classic `switch` fall-through — without `break`, a matching statement case continues into later cases and can create a hidden logic bug
- Switch expressions — arrow cases can produce a value without fall-through, and an expression must cover every possible input
- `var` — local type inference does not make Java dynamically typed; the compiler infers one fixed type from the initializer

## Methods and object references

- Method signatures, parameters, and return values — read what a method accepts, what it returns, and which overload a call can match
- Java pass-by-value — every argument is copied; for an object the copied value is a reference, so a method can mutate that object but cannot replace the caller's variable
- Call stack and method returns — each call creates a frame holding its local state, and returning or throwing removes frames toward the caller
- Overloading — methods share a name but have different parameter lists, and the compiler selects the applicable signature
- Varargs — a `Type...` parameter accepts zero or more arguments collected into an array and must be the last parameter, as seen in APIs such as `List.of` and `String.format`
- Constructor defaults and chaining — recognise when Java supplies a no-argument constructor, chain overloads with `this(...)`, and initialise the superclass first through `super(...)`
- `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object ✅ 07-timetrack
- Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other
- `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries ✅ 07-timetrack

## Classes and object-oriented behaviour

- Classes, objects, fields, and constructors — define state and behaviour, create instances, and establish valid initial state during construction ✅ 07-timetrack
- `this` — refer to the current instance and disambiguate a field from a parameter with the same name ✅ 07-timetrack
- Encapsulation — keep representation private and expose behaviour or controlled access so callers cannot bypass class invariants ✅ 07-timetrack
- Access modifiers — distinguish `public`, `protected`, package-private, and `private` visibility when reading code across packages and hierarchies ✅ 07-timetrack
- Non-instantiable utility classes — a class holding only `static` members receives a public no-argument constructor from the compiler unless it declares one, so a private constructor is how the class states that an instance of it would be meaningless ✅ 07-timetrack — `TimeEntrySpecifications` declares an empty private constructor guarding its five static `Specification` factories
- `final` variables, fields, methods, and classes — prevent reassignment, overriding, or inheritance as applicable; a final field must be assigned exactly once (typically in the constructor), yet a final reference still does not make its object immutable ✅ 07-timetrack
- Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object ✅ 07-timetrack
- Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class ✅ 07-timetrack
- Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- Anonymous inner classes — recognise inline implementations such as `new Runnable() {...}` or `new Comparator<>() {...}` in maintained code and read them as the pre-lambda form of a functional-interface or abstract-type instance
- `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration ✅ 07-timetrack
- Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast
- Records — use a concise data carrier with final components and generated accessors, canonical construction, `equals`, `hashCode`, and `toString` ✅ 07-timetrack — the private `Attempts(int count, Instant lastFailure)` carrier whose generated `equals` makes the compare-and-remove work
- Shallow vs deep immutability — final fields or record components prevent reassignment but do not make referenced mutable objects immutable

## Equality and hashing

- Identity vs value equality — `==` compares primitive values or reference identity, while `equals` expresses semantic equality for objects ✅ 07-timetrack
- `String.equals()` vs `==` — compare String content with `equals`; `==` only asks whether both references identify the same object
- Wrapper equality and boxing — automatic boxing/unboxing converts between primitives and wrappers, but wrapper `==` may appear to work because of caching and must not be used for value equality
- `Objects.equals(a, b)` — perform null-safe object equality by handling nulls before delegating to `equals`
- The `equals` / `hashCode` contract — equal objects must have equal hash codes, and both methods must change together for correct `HashSet` and `HashMap` behaviour ✅ 07-timetrack
- Mutable hash keys — changing fields used by `equals` or `hashCode` after insertion can make an entry effectively unreachable in a hash-based collection ✅ 07-timetrack
- `toString()` — provide a useful textual representation for diagnostics without exposing secrets or relying on it as a serialization contract ✅ 07-timetrack — every credential field (`LoginRequest.password`, both `ChangePasswordRequest` fields, `AuthResponse.token`) carries `@ToString.Exclude`, so Lombok's generated string cannot publish it

## Strings and decimal values

- String immutability — String operations return new values rather than modifying the original object
- Text blocks — read a triple-quoted `"""` multi-line String literal as ordinary String content, used for embedded JSON, SQL, or HTML fragments in modern (Java 17+) code ✅ 07-timetrack
- `String.isEmpty()` vs `String.isBlank()` — empty means length zero, while blank also includes whitespace-only content
- `String.formatted()` — substitute values into a format string while understanding that invalid format specifiers fail at runtime
- String and number conversion — parse text into numbers with `Integer.parseInt` or `Integer.valueOf` and render values back with `String.valueOf`, knowing that malformed input throws the unchecked `NumberFormatException` ✅ 07-timetrack — `JwtUtil` renders the id with `String.valueOf` and reads it back with `Long.valueOf`, whose `NumberFormatException` rejects a legacy token
- `String` concatenation vs `StringBuilder` — use simple `+` for small expressions and a mutable builder for repeated accumulation that would create many intermediate Strings
- Floating-point representation and comparison — `double` and `float` cannot represent most decimals exactly, so `==` between them is unreliable and `NaN` is never equal to itself, which is why floating-point equality needs a tolerance or `BigDecimal`
- Integer vs floating-point division by zero — integer division by zero throws `ArithmeticException`, while floating-point division by zero produces `Infinity` or `NaN` instead of failing
- `BigDecimal` for money and decimal arithmetic — avoid binary floating-point error, remember operations return new values, and choose explicit scale and rounding for division ✅ 07-timetrack
- `BigDecimal.equals()` vs `compareTo()` — recognise that `equals` includes scale while `compareTo` compares numerical value, and choose deliberately for money comparisons and collection keys

## Collections and generics

- Arrays vs collections — arrays have a fixed length and indexed elements, while collection APIs provide resizable and semantic data structures
- Array access and bounds — index elements with `[i]` and read length via the `.length` field (a field, not a method, unlike `String.length()` or `List.size()`), knowing that an out-of-range index throws `ArrayIndexOutOfBoundsException`
- `List` — preserve encounter order and allow duplicates when position or sequence matters ✅ 07-timetrack
- `Set` — represent unique elements when duplicates have no meaning
- `Map` — associate unique keys with values and distinguish missing keys from keys explicitly mapped to `null` ✅ 07-timetrack — an absent key in the login-attempt map means "no failures yet", read straight off the `null` from `get`
- `ArrayList`, `HashSet`, and `HashMap` — recognise the normal general-purpose implementations for list, set, and map semantics
- Map accumulator idioms — use `getOrDefault` and `computeIfAbsent` for the common count-or-group pattern instead of manual get-check-put null handling
- Collection interfaces vs implementations — declare the weakest useful contract such as `List` while choosing a concrete implementation such as `ArrayList` at construction ✅ 07-timetrack
- Collection factories and copies — `List.of`, `Set.of`, and `Map.of` reject nulls and return unmodifiable collections, which still does not make mutable elements deeply immutable ✅ 07-timetrack
- `Arrays.asList()` vs `List.of()` and `List.copyOf()` — distinguish a fixed-size list backed by an array from an unmodifiable factory or copy, including mutation, null, and aliasing consequences
- `ArrayList` vs `LinkedList` — prefer `ArrayList` for normal application access; linked nodes do not make locating a middle position constant-time
- Iteration and safe removal — do not structurally modify a collection through the collection itself during for-each iteration; use `removeIf` or the iterator's own `remove`
- Practical complexity recognition — distinguish linear list search from expected constant-time hash lookup without treating Big-O as a substitute for measurement
- `Comparable<T>` vs `Comparator<T>` — define one natural order inside a type or multiple external orderings without changing that type
- `Comparator.comparing()` — build a field-based ordering and compose tie-breakers when the primary key is equal
- Equality vs ordering consistency — understand that sorted sets and maps treat `compareTo` or `compare` returning zero as the same key even when `equals` disagrees
- Generic types and methods — use type parameters such as `List<User>` and `<T>` to preserve compile-time type safety and avoid casts ✅ 07-timetrack
- Raw types and diamond inference — avoid raw collections that discard type checks and use `<>` when the compiler can infer constructor type arguments
- Generic invariance — `List<Dog>` is not a subtype of `List<Animal>` because adding another Animal through that alias would break type safety
- Wildcard recognition — read `?`, `? extends T`, and `? super T` in library signatures without attempting advanced generic API design
- Nested generic APIs — read types such as `Optional<User>`, `Page<User>`, and `ResponseEntity<List<User>>` by working from the outer container inward ✅ 07-timetrack

## Optional, lambdas, and streams

- `Optional<T>` as a return contract — make an absent result explicit when absence is normal, rather than using it for every nullable field or parameter ✅ 07-timetrack
- `Optional.map` and `ifPresent` — transform a present value or run a side effect without manually branching on presence
- `Optional.filter` — reject a present value that fails a predicate by turning it into an empty Optional, so one terminal operation handles both absence and rejection ✅ 07-timetrack
- `Optional.orElseGet` and `orElseThrow` — produce a lazy fallback or fail with a meaningful exception instead of calling unchecked `get` ✅ 07-timetrack
- `orElse` vs `orElseGet` — `orElse` evaluates its fallback eagerly, while `orElseGet` calls its supplier only when the Optional is empty
- `Predicate<T>` — represent a test from one input to a boolean result ✅ 07-timetrack
- `Function<T, R>` — represent a transformation from an input type to an output type ✅ 07-timetrack
- `Consumer<T>` — accept a value for a side effect without returning a result
- `Supplier<T>` — produce a value without receiving an input ✅ 07-timetrack
- Lambda expressions — pass small pieces of behaviour to APIs while keeping parameter and return types consistent with the target functional interface ✅ 07-timetrack
- Method references — use forms such as `Employee::getName` when a lambda only delegates to an existing method ✅ 07-timetrack
- Stream pipeline lifecycle — create a lazy intermediate pipeline and trigger it once with a terminal operation; a consumed stream cannot be reused ✅ 07-timetrack
- `filter`, `map`, and `toList` — select and transform elements into a result without mutating the source collection ✅ 07-timetrack
- `flatMap` — transform each element into zero or more elements and flatten the nested results into one stream
- `sorted` and `distinct` — order elements or remove duplicates while recognising their dependence on comparison and equality contracts
- `reduce` and simple aggregation — combine stream elements into one result with an identity or accumulator whose operation is associative ✅ 07-timetrack
- `anyMatch` — answer whether at least one element satisfies a predicate, short-circuiting on the first match rather than materialising a filtered collection to test that it is non-empty ✅ 07-timetrack
- `findFirst` and `allMatch` — retrieve the first matching element as an `Optional`, or assert that every element satisfies a predicate, choosing the result type the caller actually needs
- Stream side effects vs loops — keep stream transformations side-effect free and choose a loop when stateful branching or early control flow is clearer
- `Stream.toList()` vs `Collectors.toList()` — `Stream.toList()` returns an unmodifiable list, while `Collectors.toList()` makes no mutability guarantee
- `Collectors.toMap` — gather a stream into a key/value map, supplying a merge function because a duplicate key otherwise throws instead of silently overwriting ✅ 07-timetrack
- `Collectors.joining` — gather a stream of text into one delimited String, with an optional prefix and suffix, instead of accumulating with a manual separator flag

## Exceptions and diagnostics

- Checked vs unchecked exceptions — checked exceptions must be caught or declared, while `RuntimeException` subclasses do not carry that compile-time requirement ✅ 07-timetrack
- `throw` vs `throws` — a `throw` statement evaluates an exception reference and completes abruptly, while a `throws` clause declares possible checked failures to callers ✅ 07-timetrack
- Exception propagation and stack unwinding — an uncaught exception removes call frames until a compatible handler is found or the thread terminates
- Targeted `try` / `catch` / `finally` — catch only failures that can be handled or contextualised and use `finally` for cleanup that must run ✅ 07-timetrack
- Try-with-resources — close `AutoCloseable` resources on both success and failure without duplicating cleanup code
- Custom exception types — name a meaningful failure with a dedicated unchecked type so a caller or a boundary handler can react to that failure specifically instead of parsing a message string ✅ 07-timetrack
- Constructor invariants — validate an object's required state where it is built, with `Objects.requireNonNull` or an explicit throw, so an instance that would break its consumers cannot exist; a check placed at the point of use instead leaves the invalid object constructible and pushes the failure to whichever caller notices first ✅ 07-timetrack — `InvalidPasswordException` requires its `field` in the constructor, because the exception handler that reads it feeds `Map.of`, which rejects a null key and would turn a 400 into a 500
- Preserved exception causes — pass the original throwable into the wrapping exception so the trace still shows where the failure actually started
- Do not swallow exceptions — an empty or over-broad catch hides the failure and leaves callers unable to distinguish success from corruption ✅ 07-timetrack
- Reading stack traces — identify the exception type, message, cause chain, and first relevant application frame before changing code

## Enums and annotations

- Enums — model a closed set of named domain values instead of scattering magic Strings through control flow ✅ 07-timetrack
- Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour ✅ 07-timetrack
- Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions
- Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

## Date, time, and API literacy

- `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract ✅ 07-timetrack
- `Duration` vs `Period` — measure an elapsed time-based amount with `Duration` and a calendar date-based amount with `Period`, rather than computing intervals by hand
- `YearMonth` — represent a whole month as one value when no day is meaningful, and derive its date range with `atDay` and `atEndOfMonth` instead of assembling boundary dates by hand ✅ 07-timetrack
- Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

## Maven fundamentals

Maven is ecosystem tooling rather than Java language syntax; this section owns generic Java-build mechanics, while Spring Boot coverage owns starter, parent, and plugin behaviour.

- Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version` ✅ 07-timetrack
- `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles ✅ 07-timetrack
- Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions ✅ 07-timetrack
- Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended ✅ 07-timetrack
- Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version
