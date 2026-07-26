# Java Junior Notes Plan

Plan status: current
Coverage: notes/java/coverage/junior.md
Coverage SHA-256: 4c9d4cc95f4edfde8378c8fdb98ebfe521cae8344eb43202dd463702edce3245
Generated: 2026-07-26
Study order: the entry number is the reading order, 00 → 15. It is **not** the number in the filename. Only entries 00–03 coincide; from entry 04 onward the filenames are legacy and must be read from the `English:` / `Spanish:` line of each entry, never guessed from the number. Two causes: `15-memory-model.md` was promoted to entry 04, which shifts every later file one place behind its entry; and generics/collections are swapped relative to the filenames, so entry 08 reads `10-generics.md` and entry 09 reads `07-collections.md`. Full correspondence:

| Entry | English file | Entry | English file |
| --- | --- | --- | --- |
| 00 | `00-intro-java.md` | 08 | `10-generics.md` |
| 01 | `01-variables-types.md` | 09 | `07-collections.md` |
| 02 | `02-control-flow.md` | 10 | `08-exceptions.md` |
| 03 | `03-methods.md` | 11 | `09-streams-lambdas.md` |
| 04 | `15-memory-model.md` | 12 | `11-enums.md` |
| 05 | `04-oop-classes.md` | 13 | `12-dates.md` |
| 06 | `05-interfaces-abstract.md` | 14 | `13-annotations.md` |
| 07 | `06-inheritance-polymorphism.md` | 15 | `14-maven.md` |

The files are not renumbered because renaming existing bilingual notes is outside this planner's authority.

## 00 — Java execution foundations

Status: pending
Action: audit
English: notes/java/junior/en/00-intro-java.md
Spanish: notes/java/junior/es/00-intro-java.md
Depends on: none

Narrative role: Introduce Java as the execution language behind Victor's Spring Boot work and provide the map for the complete junior journey.

Learning outcome: Explain what kind of language Java is, how its source becomes a running program, how compile-time and runtime failures differ, and why the remaining chapters follow this order.

Prerequisites: none

Must answer:

- What practical problem does Java solve in Victor's target Angular and Spring Boot stack?
- What are Java's defining characteristics — static typing, code that always lives inside a class, compile-then-run, JVM portability, deliberate verbosity — and where will each of them reappear in later chapters?
- What happens between writing a `.java` file and the JVM executing its bytecode?
- How do compiler errors, runtime exceptions, and logic errors differ, and which one is cheapest to discover?
- Which learning route runs from values and text, through control flow, methods, references and the call stack, objects and equality, contracts, polymorphism, generics, collections, failures, functional APIs, enums, dates, annotations, and finally Maven — and why is each step placed before the one that needs it?
- Where does Java's fixed, compile-checked type system change habits carried over from JavaScript, and where would that comparison mislead rather than help?

Coverage concepts:

- Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs

Rationale: What Java is, how source becomes executable, and when failures surface are the orientation every later chapter assumes.

Handoff: Once Victor knows what kind of language Java is and how it runs, entry 01 can introduce the typed values that every running program stores, converts, and combines.

## 01 — Variables, types, operators, text, and decimal values

Status: pending
Action: audit
English: notes/java/junior/en/01-variables-types.md
Spanish: notes/java/junior/es/01-variables-tipos.md
Depends on: 00

Narrative role: Establish everything Java can do with one value at a time — how it is declared, stored, converted, operated on, and represented as text or as an exact decimal — before any statement, method, or object depends on it.

Learning outcome: Declare, initialise, convert, compare, combine, and format Java's primitive, wrapper, text, and decimal values while predicting where the representation itself changes the result.

Prerequisites: 00

Must answer:

- Where does each kind of variable exist, and why must a local variable be definitely assigned before use?
- What is physically stored by a primitive variable versus a reference variable?
- When should `int` become `long`, and when does the integer literal itself require an `L` suffix?
- Why can a collection or generic type hold an `Integer` but never an `int`, and where is that rule explained in full?
- What exactly fails when a null `Integer` is unboxed, and why does the failure surface at that line rather than earlier?
- Why is widening allowed silently while narrowing demands an explicit cast, and what is lost when the cast happens?
- Why does `5 / 2` produce `2`, and what makes an `int` wrap around to a negative number instead of growing?
- Which operator groups does Java have, and what does the compiler do when `=` is written where `==` was meant?
- Why may `&&` and `||` never evaluate their right operand, and how does that prevent a `NullPointerException`?
- If a `String` cannot change, what exactly happens in memory when code appends to one, and when does `+` in a loop become the wrong tool?
- Which everyday `String` operations does Victor need to read ordinary code — length, substring, splitting, trimming, containment, case-insensitive comparison — and what does each return?
- What is the practical difference between a String that is empty and one that contains only spaces or a tab?
- Why does an invalid format specifier survive compilation and fail only when the line executes?
- How is a multi-line JSON or SQL fragment written without escaping every quote and newline?
- What turns the text `"42"` into the number `42`, what does it mean that the resulting `NumberFormatException` is *unchecked*, and why is the full checked/unchecked model deferred to entry 10?
- Why can a `double` not hold `0.1` exactly, why is `NaN` not equal to itself, and why does comparing two `double` values with `==` fail even when the arithmetic looks right?
- Why does dividing an `int` by zero throw while dividing a `double` by zero quietly returns `Infinity`?
- Why must a `BigDecimal` be created from a String, and why does its division demand an explicit scale and rounding mode when no other numeric type does?
- Why does `var` still produce one fixed compile-time type rather than making Java dynamic?
- Why is comparing two Strings with `==` deferred to entry 05 instead of being answered here?

Coverage concepts:

- Variables, declared types, initialization, and scope — know where a local, parameter, field, or block variable exists and that local variables must be definitely assigned before use
- Primitive vs reference types — primitives hold a value, while reference variables identify objects and may be `null`
- `int` vs `long` — choose `long` when the range can exceed `int`; use an `L` suffix only when the integer literal itself does not fit in `int`
- Primitive vs wrapper types — wrappers support generics and `null`, while unboxing a null wrapper throws `NullPointerException`
- Numeric conversions and casts — widening conversions are normally safe, while narrowing can lose range or precision and therefore requires an explicit cast
- Integer arithmetic — recognise integer division, overflow, and the need to promote an operand when fractional or wider arithmetic is required
- Operators and short-circuit evaluation — use arithmetic, comparison, logical, and assignment operators and explain why `&&` and `||` may skip the right operand
- `var` — local type inference does not make Java dynamically typed; the compiler infers one fixed type from the initializer
- String immutability — String operations return new values rather than modifying the original object
- Text blocks — read a triple-quoted `"""` multi-line String literal as ordinary String content, used for embedded JSON, SQL, or HTML fragments in modern (Java 17+) code
- `String.isEmpty()` vs `String.isBlank()` — empty means length zero, while blank also includes whitespace-only content
- `String.formatted()` — substitute values into a format string while understanding that invalid format specifiers fail at runtime
- String and number conversion — parse text into numbers with `Integer.parseInt` or `Integer.valueOf` and render values back with `String.valueOf`, knowing that malformed input throws the unchecked `NumberFormatException`
- `String` concatenation vs `StringBuilder` — use simple `+` for small expressions and a mutable builder for repeated accumulation that would create many intermediate Strings
- Floating-point representation and comparison — `double` and `float` cannot represent most decimals exactly, so `==` between them is unreliable and `NaN` is never equal to itself, which is why floating-point equality needs a tolerance or `BigDecimal`
- Integer vs floating-point division by zero — integer division by zero throws `ArithmeticException`, while floating-point division by zero produces `Infinity` or `NaN` instead of failing
- `BigDecimal` for money and decimal arithmetic — avoid binary floating-point error, remember operations return new values, and choose explicit scale and rounding for division

Rationale: One mental model runs through all of it — a Java value has a fixed declared type, and how that type is represented decides what conversion, comparison, and arithmetic really do. The chapter is deliberately large: it maps to one existing file whose scope is already exactly this, and splitting text and decimals into new files would number them 16 and 17, placing them last in the folder while being read third — a worse outcome for a topic that must read as one journey from 00 to 15. The chapter is therefore taught in three ordered movements: the value model, then text, then inexact and exact decimals.

Handoff: With single values fully understood, entry 02 stops evaluating expressions one at a time and starts controlling which statements run, and how often.

## 02 — Control flow

Status: pending
Action: audit
English: notes/java/junior/en/02-control-flow.md
Spanish: notes/java/junior/es/02-flujo-de-control.md
Depends on: 01

Narrative role: Turn individual values and expressions into programs that choose, repeat, skip, and terminate work predictably.

Learning outcome: Select the appropriate conditional, loop, or switch form for a concrete execution contract and trace exactly which statements run.

Prerequisites: 01

Must answer:

- How should conditions be ordered so a broad case does not hide a specific one?
- When does `condition ? a : b` say something an `if` / `else` statement cannot, and why is that difference about producing a value?
- Which loop form matches counted, element-based, pre-checked, or post-checked repetition?
- What is the minimum a reader needs to know about an array — a fixed-size row of slots, indexed from zero — to read an enhanced `for`, and where does entry 09 give arrays their full treatment against collections?
- What exactly is left when `break`, `continue`, or `return` executes, and why is `return` different in kind from the other two?
- Why does a classic `switch` continue into the next case, and what real bug does that create?
- What does an arrow-case switch expression change, and why must an expression cover every possible input?

Coverage concepts:

- `if` / `else` — select one branch from boolean conditions and order conditions so specific or exceptional cases are not hidden by broader ones
- Conditional (ternary) operator — `condition ? a : b` chooses one of two values as an expression, unlike an `if` / `else` statement, which does not itself produce a value
- `for`, enhanced `for`, `while`, and `do-while` — choose counted iteration, element traversal, pre-checked repetition, or post-checked repetition according to the loop contract
- `break`, `continue`, and `return` — distinguish leaving a loop, skipping to its next iteration, and leaving the current method
- Classic `switch` fall-through — without `break`, a matching statement case continues into later cases and can create a hidden logic bug
- Switch expressions — arrow cases can produce a value without fall-through, and an expression must cover every possible input

Rationale: Conditionals, loops, control-transfer statements, and both switch forms belong together because they all answer one question — which statements execute, and in what order. Minimal array syntax is declared scaffolding here so the enhanced `for` has something to traverse; the array-versus-collection contrast itself belongs to entry 09.

Handoff: After Victor can control statement execution, entry 03 packages that behaviour into named, callable methods and defines the contract each call must satisfy.

## 03 — Methods

Status: pending
Action: audit
English: notes/java/junior/en/03-methods.md
Spanish: notes/java/junior/es/03-metodos.md
Depends on: 02

Narrative role: Introduce the method as Java's unit of named, reusable behaviour, and establish the contract a caller must satisfy for a call to compile at all.

Learning outcome: Read and design a method signature, predict which overload a call selects, and organise methods into packages while rejecting invalid input at the boundary.

Prerequisites: 02

Must answer:

- How do a signature, parameter list, and return type together decide whether a call compiles?
- What does a method with no return value actually give back to its caller?
- How does the compiler pick between two overloads that share a name?
- Why must a `Type...` parameter be the last one, and what does the method actually receive inside its body?
- Why do `List.of` and `String.format` accept any number of arguments, and how is that the same mechanism?
- What do packages and imports change about the name a class is referred to by, and what does a fully qualified name look like?
- Where should a `null` argument be rejected so the eventual `NullPointerException` names the real culprit instead of a line far away?

Coverage concepts:

- Method signatures, parameters, and return values — read what a method accepts, what it returns, and which overload a call can match
- Overloading — methods share a name but have different parameter lists, and the compiler selects the applicable signature
- Varargs — a `Type...` parameter accepts zero or more arguments collected into an array and must be the last parameter, as seen in APIs such as `List.of` and `String.format`
- Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries

Rationale: Signatures, overload selection, variable argument lists, package naming, and boundary validation are one unit — everything the compiler and the caller must agree on before a method runs.

Handoff: The call contract is now clear, but not what physically crosses it; entry 04 opens the method boundary and shows what is copied, where objects actually live, and how a call is tracked.

## 04 — References, the call stack, and memory

Status: pending
Action: audit
English: notes/java/junior/en/15-memory-model.md
Spanish: notes/java/junior/es/15-modelo-de-memoria.md
Depends on: 03

Narrative role: Explain the mechanism behind every call and every assignment made so far — what is copied into a parameter, where the object itself lives, and how the JVM tracks calls — because later chapters on objects, exceptions, and collections all reason about it.

Learning outcome: Predict exactly what a method can and cannot change about its caller's data, and trace a chain of calls as frames appearing and disappearing on the call stack.

Prerequisites: 03

Must answer:

- If Java is always pass-by-value, why can a method mutate an object but never replace the caller's variable?
- What is copied when an object is passed — the object, or something smaller?
- What does one call-stack frame actually contain, in what order are frames added and removed, and why is the newest frame the one that can fail?
- Where do local variables live compared with the objects they refer to, and why does that split exist at all?
- If two references point to one mutable object, which changes become visible through the other reference, and how does that produce a bug nobody wrote on purpose?
- When a `String` is rebuilt or an object is no longer referenced, what happens to the abandoned one, and why does Java not require Victor to free it?
- Why is garbage collection covered here only as a mechanism to recognise, with tuning and diagnosis left to a later professional level?

Coverage concepts:

- Java pass-by-value — every argument is copied; for an object the copied value is a reference, so a method can mutate that object but cannot replace the caller's variable
- Call stack and method returns — each call creates a frame holding its local state, and returning or throwing removes frames toward the caller
- Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other

Rationale: Argument copying, the call stack, and aliasing are three consequences of one fact — a variable holds either a value or a reference to something stored elsewhere. The stack/heap picture and a single garbage-collection callout are declared scaffolding: they are the mechanism this chapter's own questions depend on, and the standard requires mechanism over behaviour.

Handoff: References are now understood in isolation; entry 05 uses them to build classes whose state stays valid, and defines what it means for two of those objects to be equal.

## 05 — Classes, encapsulation, records, and equality

Status: pending
Action: audit
English: notes/java/junior/en/04-oop-classes.md
Spanish: notes/java/junior/es/04-poo-clases.md
Depends on: 04

Narrative role: Build valid domain objects from the method and reference mechanics already learned, then answer the question those objects immediately raise — when are two of them the same?

Learning outcome: Design a small class or record with valid construction, controlled visibility, appropriate immutability, and correct value equality, and explain why identity comparison is the wrong default.

Prerequisites: 04

Must answer:

- What does a class, an object, a field, a constructor, and `this` each contribute to one instance?
- How do access modifiers and encapsulation stop a caller from breaking an invariant the class promised?
- What can a `static` member reach that an instance member cannot, and why does a `static` method have no `this`?
- What does each use of `final` prevent, when must a final field be assigned, and why does a final reference still not make its object immutable?
- If a record's components are final, why can the object it holds still be modified from outside?
- When is a record the right choice, and what exactly does Java generate for its components?
- Why is `==` wrong for comparing two `String` values that were built at runtime, when it appears to work for two literals?
- Why does `Integer` `==` seem to work for small numbers and then fail for large ones?
- What does `Objects.equals(a, b)` do that `a.equals(b)` cannot, and which of the two arguments was the dangerous one?
- What belongs in `toString()`, and why is it neither a serialization format nor a place for a password or token?

Coverage concepts:

- Classes, objects, fields, and constructors — define state and behaviour, create instances, and establish valid initial state during construction
- `this` — refer to the current instance and disambiguate a field from a parameter with the same name
- Encapsulation — keep representation private and expose behaviour or controlled access so callers cannot bypass class invariants
- Access modifiers — distinguish `public`, `protected`, package-private, and `private` visibility when reading code across packages and hierarchies
- `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object
- `final` variables, fields, methods, and classes — prevent reassignment, overriding, or inheritance as applicable; a final field must be assigned exactly once (typically in the constructor), yet a final reference still does not make its object immutable
- Records — use a concise data carrier with final components and generated accessors, canonical construction, `equals`, `hashCode`, and `toString`
- Shallow vs deep immutability — final fields or record components prevent reassignment but do not make referenced mutable objects immutable
- Identity vs value equality — `==` compares primitive values or reference identity, while `equals` expresses semantic equality for objects
- `String.equals()` vs `==` — compare String content with `equals`; `==` only asks whether both references identify the same object
- Wrapper equality and boxing — automatic boxing/unboxing converts between primitives and wrappers, but wrapper `==` may appear to work because of caching and must not be used for value equality
- `Objects.equals(a, b)` — perform null-safe object equality by handling nulls before delegating to `equals`
- `toString()` — provide a useful textual representation for diagnostics without exposing secrets or relying on it as a serialization contract

Rationale: State, visibility, immutability boundaries, records, and value equality all describe one object standing alone. The `hashCode` half of the equality contract is deliberately deferred to entry 09, where the hash-based collections that give it meaning are actually taught.

Handoff: Concrete classes can now hold valid state and compare correctly; entry 06 separates the behaviour a caller needs from the particular class that happens to provide it.

## 06 — Interfaces and abstract classes

Status: pending
Action: audit
English: notes/java/junior/en/05-interfaces-abstract.md
Spanish: notes/java/junior/es/05-interfaces-abstractas.md
Depends on: 05

Narrative role: Replace dependence on one concrete class with an explicit behavioural contract, and show where shared state or construction still justifies an abstract class.

Learning outcome: Choose and implement an interface or abstract class — including default methods, multiple contracts, and an inline anonymous implementation — with `@Override` as a compiler-checked guarantee.

Prerequisites: 05

Must answer:

- What does a caller gain by depending on an interface instead of the class that implements it?
- When does shared instance state or a required constructor make an abstract class the better tool?
- Why can a class implement several interfaces but extend only one class?
- What problem do default methods solve, and how does an implementing class replace that inherited behaviour?
- What is actually happening in code such as `new Runnable() { ... }`, which appears to instantiate something that has no body?
- Why did older codebases need anonymous inner classes where modern code writes a lambda, and why is the `new Comparator<>() { ... }` form left as recognition-only until entries 08 and 11 explain its generics and its lambda replacement?
- What mistake does `@Override` make the compiler catch that would otherwise become a silent runtime bug?

Coverage concepts:

- Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class
- Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- Anonymous inner classes — recognise inline implementations such as `new Runnable() {...}` or `new Comparator<>() {...}` in maintained code and read them as the pre-lambda form of a functional-interface or abstract-type instance
- `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration

Rationale: Interfaces, abstract classes, default methods, multiple contracts, and anonymous implementations are one unit about declaring and supplying behaviour independently of a named concrete class.

Handoff: With contracts separated from implementations, entry 07 explains how Java decides at runtime which implementation actually runs, and when composition is the better design than a hierarchy.

## 07 — Inheritance and polymorphism

Status: pending
Action: audit
English: notes/java/junior/en/06-inheritance-polymorphism.md
Spanish: notes/java/junior/es/06-herencia-polimorfismo.md
Depends on: 06

Narrative role: Explain runtime substitution across class and interface hierarchies, contrasting it with compile-time overloading and with composition as a design alternative.

Learning outcome: Predict which overridden method runs through a parent or interface reference and choose inheritance, composition, or a guarded subtype check deliberately.

Prerequisites: 06

Must answer:

- What is the practical difference between an is-a inheritance relationship and a has-a composition relationship, and which one couples the two classes more tightly?
- If the variable's declared type is the parent, how does Java know to run the child's method?
- When does Java supply a no-argument constructor for free, how does `this(...)` chain one constructor to another, and why must `super(...)` run before the subclass body?
- Why is overriding resolved at runtime while overloading is decided at compile time, and what bug does confusing the two produce?
- When is an `instanceof` pattern variable the honest solution, and when is it a sign the abstraction is wrong?
- What do `final` classes and `final` methods remove from this picture?

Coverage concepts:

- Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object
- Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast
- Constructor defaults and chaining — recognise when Java supplies a no-argument constructor, chain overloads with `this(...)`, and initialise the superclass first through `super(...)`

Rationale: Inheritance, composition, dynamic dispatch, overriding, and runtime type checks belong together as the related and competing ways to reuse and select behaviour.

Handoff: Polymorphic APIs are almost always parameterised; entry 08 teaches how to read those type parameters before entry 09 fills the screen with them.

## 08 — Generics and reading nested types

Status: pending
Action: audit
English: notes/java/junior/en/10-generics.md
Spanish: notes/java/junior/es/10-genericos.md
Depends on: 07

Narrative role: Teach the type-parameter syntax that every remaining chapter uses, so no later example contains angle brackets Victor cannot read.

Learning outcome: Read and use generic and nested generic APIs safely, explain invariance and wildcard intent, and recognise `Optional<T>` as a return contract before its methods are taught.

Prerequisites: 07

Must answer:

- What does `<T>` actually give the compiler that a plain `Object` container does not?
- What safety disappears the moment a collection is declared raw, and what can `<>` infer on its own?
- Why is `List<Dog>` not a `List<Animal>` when a `Dog` is an `Animal`?
- How should `?`, `? extends T`, and `? super T` be read in a library signature Victor did not write?
- How is a type such as `ResponseEntity<List<User>>` unwrapped from the outside in?
- Why do `ResponseEntity` and `Page` need a Spring Boot preview callout here rather than an explanation, and where will Victor actually meet them?
- When is returning `Optional<T>` an honest contract, and why is it the wrong choice for a field or a parameter?
- Why are `map`, `orElseGet`, and `orElseThrow` deferred to entry 11 rather than taught here?

Coverage concepts:

- Generic types and methods — use type parameters such as `List<User>` and `<T>` to preserve compile-time type safety and avoid casts
- Raw types and diamond inference — avoid raw collections that discard type checks and use `<>` when the compiler can infer constructor type arguments
- Generic invariance — `List<Dog>` is not a subtype of `List<Animal>` because adding another Animal through that alias would break type safety
- Wildcard recognition — read `?`, `? extends T`, and `? super T` in library signatures without attempting advanced generic API design
- Nested generic APIs — read types such as `Optional<User>`, `Page<User>`, and `ResponseEntity<List<User>>` by working from the outer container inward
- `Optional<T>` as a return contract — make an absent result explicit when absence is normal, rather than using it for every nullable field or parameter

Rationale: All of these answer one question — what does this container promise about the values inside it, and how does the compiler enforce that promise? `Optional` appears here as a type to read; operating on it requires lambdas and is therefore entry 11's work.

Handoff: Parameterised types can now be read fluently, so entry 09 can teach the real collection contracts without a single line of unexplained syntax.

## 09 — Collections, hashing, and ordering

Status: pending
Action: audit
English: notes/java/junior/en/07-collections.md
Spanish: notes/java/junior/es/07-colecciones.md
Depends on: 05, 08

Narrative role: Move from individual objects to groups whose sequence, uniqueness, lookup cost, mutation rules, and ordering are all explicit decisions — and complete the equality contract now that hash-based storage gives `hashCode` a purpose.

Learning outcome: Choose an appropriate array or collection type and implementation, access and iterate it safely, use the standard accumulation idioms, implement `equals` and `hashCode` correctly for a stored element, and define ordering consistent with equality.

Prerequisites: 05, 08

Must answer:

- When is a fixed-length array still the right structure, and when does a collection replace it?
- Why is `array.length` written without parentheses while `String.length()` and `List.size()` need them, and what error appears when the index is out of range?
- When does a problem need a `List`, a `Set`, or a `Map`?
- How does a `Map` distinguish a key that is missing from a key mapped to `null`, and why does `get` alone not tell you?
- Why should a variable be declared as `List` while the object created is an `ArrayList`?
- Why do `List.of` and its siblings reject nulls and refuse modification, and why is the result still not deeply immutable?
- Why is `ArrayList` the default choice, and why does `LinkedList` not make reaching a middle element cheap?
- Why does finding an element in a `List` cost time proportional to its size while a `HashMap` lookup does not grow with the map, and why is a Big-O label still no substitute for measuring?
- What do `getOrDefault` and `computeIfAbsent` replace in the manual get-check-put pattern?
- Why does removing an element during a for-each loop throw, and which two removal mechanisms are safe?
- What does `removeIf` receive as its argument, and why is that syntax only fully explained in entry 11?
- Why must `equals` and `hashCode` change together, and what exactly goes wrong in a `HashMap` when only one of them is defined?
- Why does mutating a field of a key already stored in a `HashSet` make that entry unreachable even though it is still inside the set?
- When does an order belong inside the type as `Comparable` and when does it belong outside as a `Comparator`, and how is an external order written before lambdas are available?
- Why can a `TreeSet` treat two objects as the same key even when their `equals` says they differ?

Coverage concepts:

- Arrays vs collections — arrays have a fixed length and indexed elements, while collection APIs provide resizable and semantic data structures
- Array access and bounds — index elements with `[i]` and read length via the `.length` field (a field, not a method, unlike `String.length()` or `List.size()`), knowing that an out-of-range index throws `ArrayIndexOutOfBoundsException`
- `List` — preserve encounter order and allow duplicates when position or sequence matters
- `Set` — represent unique elements when duplicates have no meaning
- `Map` — associate unique keys with values and distinguish missing keys from keys explicitly mapped to `null`
- `ArrayList`, `HashSet`, and `HashMap` — recognise the normal general-purpose implementations for list, set, and map semantics
- Map accumulator idioms — use `getOrDefault` and `computeIfAbsent` for the common count-or-group pattern instead of manual get-check-put null handling
- Collection interfaces vs implementations — declare the weakest useful contract such as `List` while choosing a concrete implementation such as `ArrayList` at construction
- Collection factories and copies — `List.of`, `Set.of`, and `Map.of` reject nulls and return unmodifiable collections, which still does not make mutable elements deeply immutable
- `ArrayList` vs `LinkedList` — prefer `ArrayList` for normal application access; linked nodes do not make locating a middle position constant-time
- Iteration and safe removal — do not structurally modify a collection through the collection itself during for-each iteration; use `removeIf` or the iterator's own `remove`
- Practical complexity recognition — distinguish linear list search from expected constant-time hash lookup without treating Big-O as a substitute for measurement
- The `equals` / `hashCode` contract — equal objects must have equal hash codes, and both methods must change together for correct `HashSet` and `HashMap` behaviour
- Mutable hash keys — changing fields used by `equals` or `hashCode` after insertion can make an entry effectively unreachable in a hash-based collection
- `Comparable<T>` vs `Comparator<T>` — define one natural order inside a type or multiple external orderings without changing that type
- Equality vs ordering consistency — understand that sorted sets and maps treat `compareTo` or `compare` returning zero as the same key even when `equals` disagrees

Rationale: Storage semantics, implementation choice, mutation rules, lookup cost, hashing, and ordering are one subject because each of them is a property of how a collection finds and distinguishes the elements it holds — which is exactly why `hashCode` and ordering consistency belong here and not in entry 05.

Handoff: Lookups, conversions, and iteration have now produced several ways to fail; entry 10 develops the full model of how a Java failure travels, is handled, and is diagnosed.

## 10 — Exceptions and diagnostics

Status: pending
Action: audit
English: notes/java/junior/en/08-exceptions.md
Spanish: notes/java/junior/es/08-excepciones.md
Depends on: 04, 09

Narrative role: Treat failure as part of a method's contract and follow one failure from the throw site through stack unwinding, handling, cleanup, and diagnosis.

Learning outcome: Distinguish exception categories, choose a targeted handling boundary, preserve useful context, close resources safely, and extract the actionable cause from a stack trace.

Prerequisites: 04, 09

Must answer:

- What compile-time obligation separates a checked exception from a `RuntimeException`, and what is the exact compiler message when it is ignored?
- What does a `throw` statement do to the method it appears in, and what does a `throws` clause promise the caller?
- Using the call-stack model from entry 04, how does an uncaught exception remove frames, and why is "up" the standard word for it even when the diagram is drawn downward?
- What belongs in `try`, in a targeted `catch`, and in `finally`, and what still runs when the `try` block throws?
- What does try-with-resources do that a `finally` block previously had to do by hand?
- How does a custom exception add meaning without discarding the original cause?
- Why is an empty or over-broad `catch` worse than letting the failure escape?
- In what order should the type, message, `Caused by` chain, and first application frame of a real trace be read?

Coverage concepts:

- Checked vs unchecked exceptions — checked exceptions must be caught or declared, while `RuntimeException` subclasses do not carry that compile-time requirement
- `throw` vs `throws` — a `throw` statement evaluates an exception reference and completes abruptly, while a `throws` clause declares possible checked failures to callers
- Exception propagation and stack unwinding — an uncaught exception removes call frames until a compatible handler is found or the thread terminates
- Targeted `try` / `catch` / `finally` — catch only failures that can be handled or contextualised and use `finally` for cleanup that must run
- Try-with-resources — close `AutoCloseable` resources on both success and failure without duplicating cleanup code
- Custom exceptions and preserved causes — name a meaningful failure and pass the original cause when adding context
- Do not swallow exceptions — an empty or over-broad catch hides the failure and leaves callers unable to distinguish success from corruption
- Reading stack traces — identify the exception type, message, cause chain, and first relevant application frame before changing code

Rationale: Exception categories, propagation, handling, cleanup, causes, and stack traces are one lifecycle, followed from the origin of a failure to its diagnosis.

Handoff: Failure paths are now explicit, so entry 11 can introduce behaviour-as-a-value and lazy pipelines without hiding errors or control flow inside them.

## 11 — Lambdas, streams, and Optional pipelines

Status: pending
Action: audit
English: notes/java/junior/en/09-streams-lambdas.md
Spanish: notes/java/junior/es/09-streams-lambdas.md
Depends on: 08, 09, 10

Narrative role: Give Java the ability to pass behaviour as a value, then use it to finish the three subjects that were deliberately left open — stream processing, external ordering, and operating on an `Optional`.

Learning outcome: Match a lambda or method reference to its functional interface, build and evaluate a readable stream pipeline without mutating its source, order elements by a field, and resolve an `Optional` without an eager fallback or an unchecked `get`.

Prerequisites: 08, 09, 10

Must answer:

- How do `Predicate`, `Function`, `Consumer`, and `Supplier` decide what a lambda may accept and must return?
- How does the anonymous inner class from entry 06 become a lambda, and what did the language have to add for that to be possible?
- When is `Employee::getName` exactly equivalent to a lambda, and when is it not?
- Which operations only describe work, and what makes the pipeline actually run?
- Why does reusing a consumed stream throw instead of starting over?
- What do `filter`, `map`, `flatMap`, `sorted`, and `distinct` each do to the elements flowing through, and which of them depend on contracts from entries 05 and 09?
- Why must a `reduce` operation be associative, and what breaks when it is not?
- What is the difference in result type between `findFirst`, `anyMatch`, and `allMatch`?
- When is a plain loop the clearer choice because of branching, early exit, or mutable state?
- Why can the list from `Stream.toList()` not be modified when the one from `Collectors.toList()` sometimes can?
- What separator and what result does `Collectors.joining` produce, and what does `Collectors.toMap` do when two elements produce the same key?
- How does `Comparator.comparing(Employee::getName)` replace the hand-written comparator from entry 09, and how is a tie-breaker added to it?
- How do `map` and `ifPresent` remove an explicit presence check on an `Optional`?
- Why does `orElse` do work that `orElseGet` skips, and when does that difference actually matter?
- Why is `orElseThrow` preferred over `get()`, and which exception should it throw given entry 10?

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
- `Collectors.joining` and `Collectors.toMap` — gather a stream into a delimited String or a key/value map, leaving multi-level grouping to a later level
- `Comparator.comparing()` — build a field-based ordering and compose tie-breakers when the primary key is equal
- `Optional.map` and `ifPresent` — transform a present value or run a side effect without manually branching on presence
- `Optional.orElseGet` and `orElseThrow` — produce a lazy fallback or fail with a meaningful exception instead of calling unchecked `get`
- `orElse` vs `orElseGet` — `orElse` evaluates its fallback eagerly, while `orElseGet` calls its supplier only when the Optional is empty

Rationale: Every bullet here needs the same one thing — a small piece of behaviour written inline and handed to an API. That is why the stream operations, the field-based comparator, and the `Optional` methods all resolve in this chapter and nowhere earlier.

Handoff: Functional pipelines complete Java's data-processing route; entry 12 turns from processing arbitrary values to narrowing them into a closed set the compiler itself can police.

## 12 — Enums

Status: pending
Action: audit
English: notes/java/junior/en/11-enums.md
Spanish: notes/java/junior/es/11-enums.md
Depends on: 02, 05

Narrative role: Replace fragile magic strings with a closed domain type whose identity, data, behaviour, and exhaustive branching the compiler can reason about.

Learning outcome: Model a closed set with an enum, compare constants safely, attach domain data or behaviour when justified, and write a switch expression the compiler keeps exhaustive.

Prerequisites: 02, 05

Must answer:

- What kind of bug does a `String` status field allow that an enum makes impossible?
- Why is `==` the correct comparison for enum constants when entry 05 argued against it for other objects?
- When do fields and methods belong on the enum itself instead of in external `if` chains?
- What does the compiler report the moment a new constant is added and one switch expression stops covering every case?
- Why does adding a `default` branch silence exactly the warning that was most useful?

Coverage concepts:

- Enums — model a closed set of named domain values instead of scattering magic Strings through control flow
- Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour
- Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions

Rationale: Enum identity, per-constant behaviour, and exhaustive switching are one idea — a fixed set of domain values the type system can check.

Handoff: Domain values also include business dates and timestamps; entry 13 chooses the right immutable time type and builds the habit of reading an unfamiliar API from its own documentation.

## 13 — Date, time, and API literacy

Status: pending
Action: audit
English: notes/java/junior/en/12-dates.md
Spanish: notes/java/junior/es/12-fechas.md
Depends on: 01, 03

Narrative role: Apply the immutable-value model to time, and use `java.time` as the worked example for reading any unfamiliar standard-library type from its signatures.

Learning outcome: Choose, calculate with, and format the correct immutable `java.time` value for a business contract, and infer usage constraints from a Javadoc signature.

Prerequisites: 01, 03

Must answer:

- Which business fact calls for `LocalDate`, which for `LocalDateTime`, and which for `Instant`?
- Why does a `LocalDateTime` not identify one universal moment, and what breaks when it is stored as if it did?
- When is an elapsed amount a `Duration` and when is it a `Period`, and why does adding one month differ from adding thirty days?
- If a date object cannot change, what does `plusDays(1)` return, and what happens when the result is discarded?
- Why is `DateTimeFormatter` safer than assembling a date string by hand, and why are the legacy mutable date classes avoided entirely?
- How does a Javadoc signature reveal the arguments, return type, generic parameters, and possible exceptions before a single line is written?

Coverage concepts:

- `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract
- `Duration` vs `Period` — measure an elapsed time-based amount with `Duration` and a calendar date-based amount with `Period`, rather than computing intervals by hand
- Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

Rationale: The `java.time` value types, amount types, formatting, and the signature-reading skill form one unit about selecting a library type from its documented contract rather than by guesswork.

Handoff: Javadoc explains ordinary API contracts; entry 14 covers the metadata contracts that compilers, frameworks, and tools read from around a declaration instead of from its signature.

## 14 — Annotations

Status: pending
Action: audit
English: notes/java/junior/en/13-annotations.md
Spanish: notes/java/junior/es/13-anotaciones.md
Depends on: 03, 06

Narrative role: Generalise from `@Override`, the one annotation Victor has already used, to annotations as metadata that some specific tool reads — so the Spring-shaped annotations he sees daily stop looking like hidden Java syntax.

Learning outcome: Determine where an annotation may appear, how long it is retained, which tool processes it, and where its real contract is documented.

Prerequisites: 03, 06

Must answer:

- `@Override` changed nothing at runtime yet caught a real bug — what does that reveal about what an annotation is?
- If an annotation is only metadata, what actually performs the behaviour it appears to describe?
- How do target and retention decide where an annotation may be written and whether anything can still see it at runtime?
- What changes when the consumer is the compiler, a build plugin, or a running framework?
- Which parts of an unfamiliar annotation's documented contract must be checked before trusting it?
- Why should `@Service` or `@Transactional` be treated as a preview of Spring Boot rather than as Java syntax?

Coverage concepts:

- Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

Rationale: Annotation metadata and the method for reading an unfamiliar annotation are one focused unit about declarations that exist for a tool rather than for the JVM.

Handoff: Annotations, libraries, and frameworks all arrive from outside the source tree; entry 15 closes the junior route with the build that resolves, compiles, tests, and packages every one of them.

## 15 — Maven fundamentals

Status: pending
Action: audit
English: notes/java/junior/en/14-maven.md
Spanish: notes/java/junior/es/14-maven.md
Depends on: 00, 03

Narrative role: Connect Java source, external artifacts, and plugins into one reproducible build, closing the gap between the `.java` files of entries 01–14 and a runnable application.

Learning outcome: Read a `pom.xml`, add and verify a dependency, predict lifecycle and scope effects, and use the repository's wrapper for a consistent build.

Prerequisites: 00, 03

Must answer:

- How do `groupId`, `artifactId`, and `version` identify exactly one artifact?
- What distinct jobs do dependencies, plugins, properties, and inherited configuration each perform inside a POM?
- Where does Maven find a library, and how does a dependency Victor never declared end up on the classpath?
- Which phases run when `package` is invoked, why does a later phase imply the earlier ones, and what does `clean` remove?
- What is the `test` phase for, given that writing tests belongs to a different topic, and where will Victor learn to write them?
- Which scope keeps a testing library out of the shipped application, and what does `provided` assume about the runtime environment?
- Why does `mvnw` produce a more trustworthy build than whatever Maven happens to be installed on the machine?

Coverage concepts:

- Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version`
- `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles
- Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions
- Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended
- Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version

Rationale: Coordinates, POM structure, resolution, lifecycle, scopes, and the wrapper describe one complete beginner workflow for building a Java project. The testing references are cross-topic previews only; JUnit itself is owned by `notes/general/`.

Handoff: Maven closes the junior journey by turning the language concepts from entries 00–14 into a repeatable compile-test-package workflow, ready for the Spring Boot notes and for middle-level Java design.
