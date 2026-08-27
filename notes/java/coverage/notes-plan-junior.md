# Java Junior Notes Plan

Plan status: current
Coverage: notes/java/coverage/junior.md
Coverage SHA-256: 8c66ee9b1f9117ae8394a2a72b43bf6a048c29725b90f45b138f478b537ba2d5
Generated: 2026-08-26
Study order: the entry number is the reading order, 00 → 17, and it is identical to the number in the filename — the `NN` of `## NN` is always the `NN-` prefix of that entry’s `English:` and `Spanish:` files. The legacy files that broke this correspondence were renumbered on 2026-08-21, together with every repository-relative link that targeted them; `notes-plan-prompt.md` → Planning algorithm step 6 makes the match a standing requirement, so a future entry inserted into this route renumbers what follows it instead of leaving a gap or a remap table. On 2026-08-26 entry 12 was split into 12 (behaviour as a value) and 13 (streams and collectors) because one file carried two mental models, and entries 13–16 were renumbered to 14–17 with every repository-relative link that targeted them; entry 13's pair is the one prefix the route still owes a file, and its `Action: create` reserves the number.

`Prerequisites` and `Depends on` list the nearest entries a chapter assumes; the full assumed set is their **transitive closure**. Entry 12 relies on entry 07's anonymous inner classes through the chain 09 → 08 → 07, and that is legal without restating 07.

Existing sections that carry no assigned coverage bullet are **preserved** unless another entry owns the concept; the audit neither expands nor removes them on its own initiative. This rule exists so that seventeen independent cold audits do not each reach a different verdict on the same paragraph.

## 00 — Java execution foundations

Status: refined

Studied: pending

Pending study: none

Action: audit

English: notes/java/junior/en/00-intro-java.md
Spanish: notes/java/junior/es/00-intro-java.md

Depends on: none

Pending additions: none

Narrative role: Introduce Java as the execution language behind Victor's Spring Boot work and provide the map for the complete junior journey.

Learning outcome: Explain what kind of language Java is, how its source becomes a running program, how compile-time and runtime failures differ, and why the remaining chapters follow this order.

Prerequisites: none

Must answer:

- What practical problem does Java solve in Victor's target Angular and Spring Boot stack?
- What are Java's defining characteristics — static typing, code that always lives inside a class, compile-then-run, JVM portability, deliberate verbosity — and where will each of them reappear in later chapters?
- What happens between writing a `.java` file and the JVM executing its bytecode?
- What is the minimum a Java program needs in order to run at all — a class whose name matches its file, a `public static void main(String[] args)` entry point, and `System.out.println` for output — and why is every token of that signature (`public`, `static`, `String[]`) left for entries 06 and 10 to explain rather than unpacked here?
- How do compiler errors, runtime exceptions, and logic errors differ, and which one is cheapest to discover?
- Which learning route runs from values, text, control flow, methods, references and the call stack, objects and equality, contracts, polymorphism, generics, collections, failures, behaviour-as-a-value, streams, enums, dates, annotations, and finally Maven — and why is each step placed before the one that needs it?
- Where does Java's fixed, compile-checked type system change habits carried over from JavaScript, and where would that comparison mislead rather than help?

Coverage concepts:

- [x] Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- [x] Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs

Audit note: `00-intro-java.md` is `refined` and frozen — nothing already in it may be rewritten. The topic-introduction invariants it once lacked were written by the 2026-08-20 run and are present today: `## Index of this note` and the seven-section orientation paragraph, `## What Java is, and the job it does in your stack`, `## Five traits that come back in every later chapter`, `## Coming from JavaScript — where the comparison helps, and where it lies`, and `## The route from here to Maven, and why it runs in that order` with its full table. Two defects remain, both correctable in place without restructuring: (a) the route callout still reads "Only `02` is missing today: that number is reserved for the text chapter and the file is not written yet" and leaves `02-strings.md` as the one unlinked route entry, while both files now exist and the entry is `complete`; (b) the closing paragraph never states outright what a reader must have settled before opening `01`. Both are Victor's to authorise on a frozen pair — report them, do not rewrite around them.

Rationale: What Java is, how source becomes executable, and when failures surface are the orientation every later chapter assumes. The entry-point signature and `System.out.println` are declared scaffolding: every subsequent chapter's examples print something, so the tokens must be recognisable here even though `static`, visibility, and arrays are each owned by a later entry.

Handoff: Once Victor knows what kind of language Java is and how it runs, entry 01 can introduce the typed values that every running program stores, converts, and combines.

## 01 — Values, types, conversion, and arithmetic

Status: complete

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/01-variables-types.md
Spanish: notes/java/junior/es/01-variables-tipos.md

Depends on: 00

Pending additions: none

Narrative role: Establish Java's numeric and boolean value model — how a value is declared, stored, converted, operated on, and where its representation silently changes the result — before any statement, method, or object depends on it.

Learning outcome: Declare, initialise, convert, compare, and combine Java's primitive, wrapper, and decimal values while predicting where the representation itself changes the result.

Prerequisites: 00

Must answer:

- Where does each kind of variable exist, and why must a local variable be definitely assigned before use?
- What is physically stored by a primitive variable versus a reference variable?
- What does it mean that a reference variable may be `null`, why does unboxing a null wrapper throw `NullPointerException`, and why are the object model (entry 06), what a reference physically holds and why the failure surfaces at that exact line (entry 05), and boundary null-validation (entry 04) all deferred rather than answered here?
- When should `int` become `long`, and when does the integer literal itself require an `L` suffix?
- Why can a collection or generic type hold an `Integer` but never an `int`, and where is that rule explained in full?
- Why is widening allowed silently while narrowing demands an explicit cast, and what is lost when the cast happens?
- Why does `5 / 2` produce `2`, and what makes an `int` wrap around to a negative number instead of growing?
- Which operator groups does Java have, and what does the compiler do when `=` is written where `==` was meant?
- Why may `&&` and `||` never evaluate their right operand, and how does that prevent a `NullPointerException`?
- Why can a `double` not hold `0.1` exactly, why is `NaN` not equal to itself, and why does comparing two `double` values with `==` fail even when the arithmetic looks right?
- Why does dividing an `int` by zero throw while dividing a `double` by zero quietly returns `Infinity`?
- Why must a `BigDecimal` be created from a String, and why does its division demand an explicit scale and rounding mode when no other numeric type does?
- Why do `new BigDecimal("1.10")` and `new BigDecimal("1.1")` disagree under `equals` but agree under `compareTo`, and which of the two is the right test for a money amount and for a `HashMap` key?
- Why does `var` still produce one fixed compile-time type rather than making Java dynamic?
- Why is comparing two Strings with `==`, and the `Integer` cache that makes wrapper `==` look reliable, deferred to entry 06 instead of being answered here?

Coverage concepts:

- [x] Variables, declared types, initialization, and scope — know where a local, parameter, field, or block variable exists and that local variables must be definitely assigned before use
- [x] Primitive vs reference types — primitives hold a value, while reference variables identify objects and may be `null`
- [x] `int` vs `long` — choose `long` when the range can exceed `int`; use an `L` suffix only when the integer literal itself does not fit in `int`
- [x] Primitive vs wrapper types — wrappers support generics and `null`, while unboxing a null wrapper throws `NullPointerException`
- [x] Numeric conversions and casts — widening conversions are normally safe, while narrowing can lose range or precision and therefore requires an explicit cast
- [x] Integer arithmetic — recognise integer division, overflow, and the need to promote an operand when fractional or wider arithmetic is required
- [x] Operators and short-circuit evaluation — use arithmetic, comparison, logical, and assignment operators and explain why `&&` and `||` may skip the right operand
- [x] `var` — local type inference does not make Java dynamically typed; the compiler infers one fixed type from the initializer
- [x] Floating-point representation and comparison — `double` and `float` cannot represent most decimals exactly, so `==` between them is unreliable and `NaN` is never equal to itself, which is why floating-point equality needs a tolerance or `BigDecimal`
- [x] Integer vs floating-point division by zero — integer division by zero throws `ArithmeticException`, while floating-point division by zero produces `Infinity` or `NaN` instead of failing
- [x] `BigDecimal` for money and decimal arithmetic — avoid binary floating-point error, remember operations return new values, and choose explicit scale and rounding for division
- [x] `BigDecimal.equals()` vs `compareTo()` — recognise that `equals` includes scale while `compareTo` compares numerical value, and choose deliberately for money comparisons and collection keys

Audit note: none. The `String` treatment, the `Integer` cache passage and the String-comparison section have already left this file for entries 02 and 06; what remains are the two bounded deferral callouts (`### Wrapper == — the one comparison this chapter refuses to explain`, `### final — the one line you need here`), which are correct as they stand.

Rationale: One mental model runs through all of it — a Java value has a fixed declared type, and how that type is represented decides what conversion, comparison, and arithmetic really do. Integer overflow, silent widening, `double` inexactness and `BigDecimal` scale are four faces of that single idea. The `String` API does not follow from it, which is precisely why the text material is now entry 02 rather than a third movement bolted onto this chapter. Objects, references, and `null` appear here as recognition-only scaffolding: the coverage bullets for wrappers and reference types name them, so they must be readable, but every mechanism behind them is owned by entries 04, 05 and 06.

Handoff: Numbers behave the way their representation forces them to; entry 02 asks the same question of the one value type Victor will touch in every single line of a web application, and finds a different answer — text in Java is an object, and an unchangeable one.

## 02 — Strings and text

Status: complete

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/02-strings.md
Spanish: notes/java/junior/es/02-cadenas-de-texto.md

Depends on: 01

Pending additions: none

Narrative role: Give Java's text type the chapter its API size deserves, built on one fact the numeric chapter never needed — a `String` is an object that cannot be changed, so every operation that appears to modify one actually produces another.

Learning outcome: Read and write the everyday `String` operations, choose between concatenation and a builder for a given accumulation, convert between text and numbers, and explain what immutability costs and buys.

Prerequisites: 01

Must answer:

- If a `String` cannot change, what exactly happens in memory when code appends to one, and when does `+` in a loop become the wrong tool?
- Which everyday `String` operations does Victor need to read ordinary code — length, substring, splitting, trimming, containment, case-insensitive comparison — and what does each return?
- What is the practical difference between a String that is empty and one that contains only spaces or a tab, and which of the two does a submitted form field usually produce?
- Why does an invalid format specifier survive compilation and fail only when the line executes?
- How is a multi-line JSON or SQL fragment written without escaping every quote and newline?
- What turns the text `"42"` into the number `42`, what does it mean that the resulting `NumberFormatException` is _unchecked_, and why is the full checked/unchecked model deferred to entry 11?
- What turns a number, a boolean, or an arbitrary object back into text, and why is `String.valueOf(x)` safer than `x.toString()` when `x` might be null?
- Why is comparing two Strings with `==` deferred to entry 06 rather than answered in the chapter that teaches every other String operation?

Coverage concepts:

- [x] String immutability — String operations return new values rather than modifying the original object
- [x] Text blocks — read a triple-quoted `"""` multi-line String literal as ordinary String content, used for embedded JSON, SQL, or HTML fragments in modern (Java 17+) code
- [x] `String.isEmpty()` vs `String.isBlank()` — empty means length zero, while blank also includes whitespace-only content
- [x] `String.formatted()` — substitute values into a format string while understanding that invalid format specifiers fail at runtime
- [x] String and number conversion — parse text into numbers with `Integer.parseInt` or `Integer.valueOf` and render values back with `String.valueOf`, knowing that malformed input throws the unchecked `NumberFormatException`
- [x] `String` concatenation vs `StringBuilder` — use simple `+` for small expressions and a mutable builder for repeated accumulation that would create many intermediate Strings

Audit note: none. Both files were authored and committed on 2026-08-25; the entry is an ordinary audit target from here on.

Rationale: Every bullet here is a consequence of one mechanism — a `String` is an immutable object — and that mechanism is what makes the chapter teachable as a unit rather than as an API list. Immutability explains why `+` in a loop allocates, why `StringBuilder` exists, why every method returns a new value, and why `==` will later turn out to compare the wrong thing. The chapter is separated from entry 01 because the numeric chapter's organising idea, that representation decides arithmetic, says nothing about `substring` or `isBlank`.

Handoff: With values and text both understood one at a time, entry 03 stops evaluating expressions individually and starts controlling which statements run, and how often.

## 03 — Control flow

Status: complete

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/03-control-flow.md
Spanish: notes/java/junior/es/03-flujo-de-control.md

Depends on: 01, 02

Pending additions: none

Narrative role: Turn individual values and expressions into programs that choose, repeat, skip, and terminate work predictably.

Learning outcome: Select the appropriate conditional, loop, or switch form for a concrete execution contract and trace exactly which statements run.

Prerequisites: 01, 02

Must answer:

- How should conditions be ordered so a broad case does not hide a specific one?
- When does `condition ? a : b` say something an `if` / `else` statement cannot, and why is that difference about producing a value?
- Which loop form matches counted, element-based, pre-checked, or post-checked repetition?
- What is the minimum a reader needs to know about an array — a fixed-size row of slots, indexed from zero — to read an enhanced `for`, and where does entry 10 give arrays their full treatment against collections?
- What exactly is left when `break`, `continue`, or `return` executes, and why is `return` different in kind from the other two?
- Why does a classic `switch` continue into the next case, and what real bug does that create?
- What does an arrow-case switch expression change, and why must an expression cover every possible input?

Coverage concepts:

- [x] `if` / `else` — select one branch from boolean conditions and order conditions so specific or exceptional cases are not hidden by broader ones
- [x] Conditional (ternary) operator — `condition ? a : b` chooses one of two values as an expression, unlike an `if` / `else` statement, which does not itself produce a value
- [x] `for`, enhanced `for`, `while`, and `do-while` — choose counted iteration, element traversal, pre-checked repetition, or post-checked repetition according to the loop contract
- [x] `break`, `continue`, and `return` — distinguish leaving a loop, skipping to its next iteration, and leaving the current method
- [x] Classic `switch` fall-through — without `break`, a matching statement case continues into later cases and can create a hidden logic bug
- [x] Switch expressions — arrow cases can produce a value without fall-through, and an expression must cover every possible input

Rationale: Conditionals, loops, control-transfer statements, and both switch forms belong together because they all answer one question — which statements execute, and in what order. Minimal array syntax is declared scaffolding here so the enhanced `for` has something to traverse; the array-versus-collection contrast itself belongs to entry 10.

Handoff: After Victor can control statement execution, entry 04 packages that behaviour into named, callable methods and defines the contract each call must satisfy.

## 04 — Methods

Status: complete

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/04-methods.md
Spanish: notes/java/junior/es/04-metodos.md

Depends on: 03

Pending additions: none

Narrative role: Introduce the method as Java's unit of named, reusable behaviour, and establish the contract a caller must satisfy for a call to compile at all.

Learning outcome: Read and design a method signature, predict which overload a call selects, organise methods into packages, and identify the boundary at which a required argument must be rejected.

Prerequisites: 03

Must answer:

- How do a signature, parameter list, and return type together decide whether a call compiles?
- What does a method with no return value actually give back to its caller?
- How does the compiler pick between two overloads that share a name?
- Why must a `Type...` parameter be the last one, and what does the method actually receive inside its body?
- Why do `List.of` and `String.format` accept any number of arguments, and how is that the same mechanism? `List.of` is used here only as a varargs example — what a `List` is and what `<E>` means arrive in entries 10 and 09.
- What do packages and imports change about the name a class is referred to by, and what does a fully qualified name look like?
- Where should a `null` argument be rejected so the eventual `NullPointerException` names the real culprit instead of a line far away?
- Writing the rejection itself needs `throw`, which entry 11 owns, and a constructor's version of it arrives in entry 06 — so what can this chapter settle, and why may it use the single line `Objects.requireNonNull(x, "…")` as declared scaffolding without explaining the exception it raises?

Coverage concepts:

- [x] Method signatures, parameters, and return values — read what a method accepts, what it returns, and which overload a call can match
- [x] Overloading — methods share a name but have different parameter lists, and the compiler selects the applicable signature
- [x] Varargs — a `Type...` parameter accepts zero or more arguments collected into an array and must be the last parameter, as seen in APIs such as `List.of` and `String.format`
- [x] Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- [x] `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries

Audit note: `04-methods.md` currently carries three sections that teach bullets this plan assigns elsewhere — `### How arguments are actually passed — Java is always pass-by-value` belongs to entry 05, and `## Access modifiers` and `## Static methods` belong to entry 06. All three are consolidated into their owning chapters; this file keeps at most a marked forward reference. `03-control-flow.md`'s `## Null checks` section also teaches this entry's `null` / `NullPointerException` bullet one chapter early; it consolidates here, and entry 03 keeps at most a marked forward reference.

Rationale: Signatures, overload selection, variable argument lists, package naming, and boundary validation are one unit — everything the compiler and the caller must agree on before a method runs.

Handoff: The call contract is now clear, but not what physically crosses it; entry 05 opens the method boundary and shows what is copied, where objects actually live, and how a call is tracked.

## 05 — References, the call stack, and memory

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/05-memory-model.md
Spanish: notes/java/junior/es/05-modelo-de-memoria.md

Depends on: 04

Pending additions: none

Narrative role: Explain the mechanism behind every call and every assignment made so far — what is copied into a parameter, where the object itself lives, and how the JVM tracks calls — because later chapters on objects, exceptions, and collections all reason about it.

Learning outcome: Predict exactly what a method can and cannot change about its caller's data, and trace a chain of calls as frames appearing and disappearing on the call stack.

Prerequisites: 04

Must answer:

- If Java is always pass-by-value, why can a method mutate an object but never replace the caller's variable?
- What is copied when an object is passed — the object, or something smaller?
- What does one call-stack frame actually contain, in what order are frames added and removed, and why is the newest frame the one that can fail?
- Where do local variables live compared with the objects they refer to, and why does that split exist at all?
- If two references point to one mutable object, which changes become visible through the other reference, and how does that produce a bug nobody wrote on purpose?
- When a `String` is rebuilt or an object is no longer referenced, what happens to the abandoned one, and why does Java not require Victor to free it?
- Why is garbage collection covered here only as a mechanism to recognise, with tuning and diagnosis left to a later professional level?

Coverage concepts:

- [ ] Java pass-by-value — every argument is copied; for an object the copied value is a reference, so a method can mutate that object but cannot replace the caller's variable
- [ ] Call stack and method returns — each call creates a frame holding its local state, and returning or throwing removes frames toward the caller
- [ ] Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other

Audit note: the pass-by-value bullet is currently taught twice — here at `05-memory-model.md`'s opening section and again at `04-methods.md`. This file is the owner; the audit of entry 04 removes the duplicate there. Two further defects, both from the 2026-08-21 renumber: the file closes with `## How this closes out the Java notes`, which declares the whole topic finished and hands off to Spring Boot from chapter five — it must become a handoff to entry 06 — and its prose still cites the pre-renumber numbering ("files 04–06", "file 07", "file 01") while three passages refer to `11-exceptions.md` as a chapter already read. All of it is corrected in both languages.

Rationale: Argument copying, the call stack, and aliasing are three consequences of one fact — a variable holds either a value or a reference to something stored elsewhere. The stack/heap picture and a single garbage-collection callout are declared scaffolding: they are the mechanism this chapter's own questions depend on, and the standard requires mechanism over behaviour.

Handoff: References are now understood in isolation; entry 06 uses them to build classes whose state stays valid, and defines what it means for two of those objects to be equal.

## 06 — Classes, encapsulation, records, and equality

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/06-oop-classes.md
Spanish: notes/java/junior/es/06-poo-clases.md

Depends on: 05

Pending additions: none

Narrative role: Build valid domain objects from the method and reference mechanics already learned, then answer the question those objects immediately raise — when are two of them the same?

Learning outcome: Design a small class or record whose constructor refuses invalid state, with controlled visibility, appropriate immutability, and correct value equality, and explain why identity comparison is the wrong default.

Prerequisites: 05

Must answer:

- What does a class, an object, a field, a constructor, and `this` each contribute to one instance?
- How do access modifiers and encapsulation stop a caller from breaking an invariant the class promised?
- A constructor can already assign whatever it is handed, so where does a class actually stop an object that would break its consumers from existing at all, and what does `Objects.requireNonNull(x, "message")` add over a bare assignment?
- If that same check is written at the point where the field is finally used instead, what still exists in memory in the meantime, and which caller ends up seeing the failure?
- What do `public`, package-private and `private` each let through, what does `protected` add over package-private, and why can that fourth one only be fully answered once entry 08 introduces subclasses?
- What can a `static` member reach that an instance member cannot, and why does a `static` method have no `this`?
- What does each use of `final` prevent, when must a final field be assigned, and why does a final reference still not make its object immutable?
- If a record's components are final, why can the object it holds still be modified from outside?
- When is a record the right choice, what exactly does Java generate for its components, and why does defensively **copying** a mutable component in a compact constructor stay a middle-level concern even though **validating** a required component does not?
- A record generates `hashCode` as well as `equals` — what is a hash code at the level this chapter needs, and why does what it is _for_ have to wait until entry 10 introduces hash-based collections?
- Why is `==` wrong for comparing two `String` values that were built at runtime, when it appears to work for two literals?
- Why does `Integer` `==` seem to work for small numbers and then fail for large ones?
- What does `Objects.equals(a, b)` do that `a.equals(b)` cannot, and which of the two arguments was the dangerous one?
- What belongs in `toString()`, and why is it neither a serialization format nor a place for a password or token?

Coverage concepts:

- [ ] Classes, objects, fields, and constructors — define state and behaviour, create instances, and establish valid initial state during construction
- [ ] `this` — refer to the current instance and disambiguate a field from a parameter with the same name
- [ ] Constructor invariants — validate an object's required state where it is built, with `Objects.requireNonNull` or an explicit throw, so an instance that would break its consumers cannot exist; a check placed at the point of use instead leaves the invalid object constructible and pushes the failure to whichever caller notices first
- [ ] Encapsulation — keep representation private and expose behaviour or controlled access so callers cannot bypass class invariants
- [ ] Access modifiers — distinguish `public`, `protected`, package-private, and `private` visibility when reading code across packages and hierarchies
- [ ] `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object
- [ ] `final` variables, fields, methods, and classes — prevent reassignment, overriding, or inheritance as applicable; a final field must be assigned exactly once (typically in the constructor), yet a final reference still does not make its object immutable
- [ ] Records — use a concise data carrier with final components and generated accessors, canonical construction, `equals`, `hashCode`, and `toString`
- [ ] Shallow vs deep immutability — final fields or record components prevent reassignment but do not make referenced mutable objects immutable
- [ ] Identity vs value equality — `==` compares primitive values or reference identity, while `equals` expresses semantic equality for objects
- [ ] `String.equals()` vs `==` — compare String content with `equals`; `==` only asks whether both references identify the same object
- [ ] Wrapper equality and boxing — automatic boxing/unboxing converts between primitives and wrappers, but wrapper `==` may appear to work because of caching and must not be used for value equality
- [ ] `Objects.equals(a, b)` — perform null-safe object equality by handling nulls before delegating to `equals`
- [ ] `toString()` — provide a useful textual representation for diagnostics without exposing secrets or relying on it as a serialization contract

Audit note: four separate conflicts, all requiring prose to move rather than merely be cross-referenced.
(a) `06-oop-classes.md` carries a compact-constructor passage that teaches middle's record-invariant and defensive-copy bullet. The **validation** half of it is now junior scope through this entry's `Constructor invariants` bullet and stays; the **defensive copy** of a mutable component leaves. The `throw` it needs is declared scaffolding here — the exception model itself belongs to entry 11 and is not explained in this chapter.
(b) `## equals() and hashCode()`, `## The equals() contract` and `## equals() and hashCode() on a JPA entity` develop the `hashCode` half of the contract, which this plan assigns to entry 10 where hash-based collections give it a purpose. Reduce this file to value equality and move the rest; the deferral stated in the rationale is not real until the prose moves.
(c) `### Anonymous class` belongs to entry 07; the surrounding `## Nested classes` framing stays here under the preservation rule, and entry 07's moved section opens with a one-sentence link back to it so the term is not orphaned.
(d) The access-modifier and static-member bullets are currently also taught in `04-methods.md`; they consolidate here.

Rationale: State, visibility, immutability boundaries, records, and value equality all describe one object standing alone. `protected` is the one part of the access-modifier bullet this chapter cannot fully discharge, because its meaning is "visible to subclasses" and subclasses arrive in entry 08 — so it is named and bounded here, not silently promised.

Handoff: Concrete classes can now hold valid state and compare correctly; entry 07 separates the behaviour a caller needs from the particular class that happens to provide it.

## 07 — Interfaces and abstract classes

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/07-interfaces-abstract.md
Spanish: notes/java/junior/es/07-interfaces-abstractas.md

Depends on: 06

Pending additions: none

Narrative role: Replace dependence on one concrete class with an explicit behavioural contract, and show where shared state or construction still justifies an abstract class.

Learning outcome: Choose and implement an interface or abstract class — including default methods, multiple contracts, and an inline anonymous implementation — with `@Override` as a compiler-checked guarantee.

Prerequisites: 06

Must answer:

- What does a caller gain by depending on an interface instead of the class that implements it?
- When does shared instance state or a required constructor make an abstract class the better tool?
- Why can a class implement several interfaces but extend only one class?
- What problem do default methods solve, and how does an implementing class replace that inherited behaviour?
- What is actually happening in code such as `new Runnable() { ... }`, which appears to instantiate something that has no body?
- Why did older codebases need anonymous inner classes where modern code writes a lambda, and why is the `new Comparator<>() { ... }` form left as recognition-only until entries 09 and 12 explain its generics and its lambda replacement?
- What mistake does `@Override` make the compiler catch that would otherwise become a silent runtime bug?
- What makes an interface a "functional" one, and why does that single-abstract-method shape matter both for reading `new Runnable() { … }` today and for entry 12's lambdas later?

Coverage concepts:

- [ ] Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class
- [ ] Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- [ ] Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- [ ] Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- [ ] Anonymous inner classes — recognise inline implementations such as `new Runnable() {...}` or `new Comparator<>() {...}` in maintained code and read them as the pre-lambda form of a functional-interface or abstract-type instance
- [ ] `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration

Audit note: `07-interfaces-abstract.md` carries `## Subclass constructors`, which teaches entry 08's constructor-chaining bullet and uses `super(...)` before entry 08 introduces subclasses — it consolidates into entry 08, leaving at most the one-sentence `super(name)` callout the abstract-class section needs. `## Functional interfaces (Java 8+)` teaches bullets entry 12 owns; reduce it to the single fact the anonymous-inner-class bullet needs — an interface with exactly one abstract method — and defer the four standard interfaces to entry 12.

Rationale: Interfaces, abstract classes, default methods, multiple contracts, and anonymous implementations are one unit about declaring and supplying behaviour independently of a named concrete class.

Handoff: With contracts separated from implementations, entry 08 explains how Java decides at runtime which implementation actually runs, and when composition is the better design than a hierarchy.

## 08 — Inheritance and polymorphism

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/08-inheritance-polymorphism.md
Spanish: notes/java/junior/es/08-herencia-polimorfismo.md

Depends on: 07

Pending additions: none

Narrative role: Explain runtime substitution across class and interface hierarchies, contrasting it with compile-time overloading and with composition as a design alternative.

Learning outcome: Predict which overridden method runs through a parent or interface reference and choose inheritance, composition, or a guarded subtype check deliberately.

Prerequisites: 07

Must answer:

- What is the practical difference between an is-a inheritance relationship and a has-a composition relationship, and which one couples the two classes more tightly?
- If the variable's declared type is the parent, how does Java know to run the child's method?
- Now that subclasses exist, what does `protected` actually permit that entry 06 could only name?
- When does Java supply a no-argument constructor for free, how does `this(...)` chain one constructor to another, and why must `super(...)` run before the subclass body?
- Why is overriding resolved at runtime while overloading is decided at compile time, and what bug does confusing the two produce?
- When is an `instanceof` pattern variable the honest solution, and when is it a sign the abstraction is wrong?
- What do `final` classes and `final` methods remove from this picture?

Coverage concepts:

- [ ] Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- [ ] Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object
- [ ] Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- [ ] `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast
- [ ] Constructor defaults and chaining — recognise when Java supplies a no-argument constructor, chain overloads with `this(...)`, and initialise the superclass first through `super(...)`

Rationale: Inheritance, composition, dynamic dispatch, overriding, and runtime type checks belong together as the related and competing ways to reuse and select behaviour. This is also where the `protected` half of entry 06's access-modifier bullet is finally discharged, which is why the deferral there was explicit rather than silent.

Handoff: Polymorphic APIs are almost always parameterised; entry 09 teaches how to read those type parameters before entry 10 fills the screen with them.

## 09 — Generics and reading nested types

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/09-generics.md
Spanish: notes/java/junior/es/09-genericos.md

Depends on: 08

Pending additions: none

Narrative role: Teach the type-parameter syntax that every remaining chapter uses, so no later example contains angle brackets Victor cannot read.

Learning outcome: Read and use generic and nested generic APIs safely, explain invariance and wildcard intent, and recognise `Optional<T>` as a return contract before its methods are taught.

Prerequisites: 08

Must answer:

- What does `<T>` actually give the compiler that a plain `Object` container does not?
- What safety disappears the moment a collection is declared raw, and what can `<>` infer on its own?
- Why is `List<Dog>` not a `List<Animal>` when a `Dog` is an `Animal`?
- How should `?`, `? extends T`, and `? super T` be read in a library signature Victor did not write?
- Why is "the type argument is a compile-time-only check" the whole answer this chapter owes, while naming the mechanism as erasure and working through its reflection and overload consequences belongs to the middle level?
- How is a type such as `ResponseEntity<List<User>>` unwrapped from the outside in?
- Why do `ResponseEntity` and `Page` need a Spring Boot preview callout here rather than an explanation, and where will Victor actually meet them?
- When is returning `Optional<T>` an honest contract, and why is it the wrong choice for a field or a parameter?
- Why are `map`, `filter`, `orElseGet`, and `orElseThrow` deferred to entry 12 rather than taught here?

Coverage concepts:

- [ ] Generic types and methods — use type parameters such as `List<User>` and `<T>` to preserve compile-time type safety and avoid casts
- [ ] Raw types and diamond inference — avoid raw collections that discard type checks and use `<>` when the compiler can infer constructor type arguments
- [ ] Generic invariance — `List<Dog>` is not a subtype of `List<Animal>` because adding another Animal through that alias would break type safety
- [ ] Wildcard recognition — read `?`, `? extends T`, and `? super T` in library signatures without attempting advanced generic API design
- [ ] Nested generic APIs — read types such as `Optional<User>`, `Page<User>`, and `ResponseEntity<List<User>>` by working from the outer container inward
- [ ] `Optional<T>` as a return contract — make an absent result explicit when absence is normal, rather than using it for every nullable field or parameter

Audit note: `09-generics.md` diverges from this contract in three directions.
(a) It develops **type erasure** as a named mechanism with runtime consequences — middle's bullet — where junior needs only "the type argument is checked at compile time and is not there at runtime".
(b) It never mentions `?`, `? extends T` or `? super T` at all, so the wildcard-recognition bullet this entry owns is currently unwritten.
(c) `### Using an Optional`, `### Optional.map() vs Stream.map()` and `### Chaining map() + orElseThrow()` teach `Optional` _usage_, which this entry's own must-answer question defers to entry 12; and `## Bounded type parameters` plus the generic-class and generic-method authoring sections exceed bullets that specify recognition and explicitly exclude advanced generic API design.

Rationale: All of these answer one question — what does this container promise about the values inside it, and how does the compiler enforce that promise? `Optional` appears here as a type to read; operating on it requires lambdas and is therefore entry 12's work.

Handoff: Parameterised types can now be read fluently, so entry 10 can teach the real collection contracts without a single line of unexplained syntax.

## 10 — Collections, hashing, and ordering

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/10-collections.md
Spanish: notes/java/junior/es/10-colecciones.md

Depends on: 06, 09

Pending additions: none

Narrative role: Move from individual objects to groups whose sequence, uniqueness, lookup cost, mutation rules, and ordering are all explicit decisions — and complete the equality contract now that hash-based storage gives `hashCode` a purpose.

Learning outcome: Choose an appropriate array or collection type and implementation, access and iterate it safely, use the standard accumulation idioms, implement `equals` and `hashCode` correctly for a stored element, and define ordering consistent with equality.

Prerequisites: 06, 09

Must answer:

- When is a fixed-length array still the right structure, and when does a collection replace it?
- Why is `array.length` written without parentheses while `String.length()` and `List.size()` need them, and what error appears when the index is out of range?
- When does a problem need a `List`, a `Set`, or a `Map`?
- How does a `Map` distinguish a key that is missing from a key mapped to `null`, and why does `get` alone not tell you?
- Why should a variable be declared as `List` while the object created is an `ArrayList`?
- Why do `List.of` and its siblings reject nulls and refuse modification, and why is the result still not deeply immutable?
- What are the three different things `Arrays.asList(...)`, `List.of(...)`, and `List.copyOf(...)` actually return, which of them accepts a null element, which one still writes through to the array behind it, and which one is the right choice for defending a field returned from a getter?
- Why is `ArrayList` the default choice, and why does `LinkedList` not make reaching a middle element cheap?
- Why does finding an element in a `List` cost time proportional to its size while a `HashMap` lookup does not grow with the map, and why is a Big-O label still no substitute for measuring?
- What do `getOrDefault` and `computeIfAbsent` replace in the manual get-check-put pattern?
- Why does removing an element during a for-each loop throw, and which two removal mechanisms are safe?
- What does `removeIf` receive as its argument, and why is that syntax only fully explained in entry 12?
- Why must `equals` and `hashCode` change together, and what exactly goes wrong in a `HashMap` when only one of them is defined?
- Why does mutating a field of a key already stored in a `HashSet` make that entry unreachable even though it is still inside the set?
- When does an order belong inside the type as `Comparable` and when does it belong outside as a `Comparator`, and how is an external order written before lambdas are available?
- Why can a `TreeSet` treat two objects as the same key even when their `equals` says they differ?

Coverage concepts:

- [ ] Arrays vs collections — arrays have a fixed length and indexed elements, while collection APIs provide resizable and semantic data structures
- [ ] Array access and bounds — index elements with `[i]` and read length via the `.length` field (a field, not a method, unlike `String.length()` or `List.size()`), knowing that an out-of-range index throws `ArrayIndexOutOfBoundsException`
- [ ] `List` — preserve encounter order and allow duplicates when position or sequence matters
- [ ] `Set` — represent unique elements when duplicates have no meaning
- [ ] `Map` — associate unique keys with values and distinguish missing keys from keys explicitly mapped to `null`
- [ ] `ArrayList`, `HashSet`, and `HashMap` — recognise the normal general-purpose implementations for list, set, and map semantics
- [ ] Map accumulator idioms — use `getOrDefault` and `computeIfAbsent` for the common count-or-group pattern instead of manual get-check-put null handling
- [ ] Collection interfaces vs implementations — declare the weakest useful contract such as `List` while choosing a concrete implementation such as `ArrayList` at construction
- [ ] Collection factories and copies — `List.of`, `Set.of`, and `Map.of` reject nulls and return unmodifiable collections, which still does not make mutable elements deeply immutable
- [ ] `Arrays.asList()` vs `List.of()` and `List.copyOf()` — distinguish a fixed-size list backed by an array from an unmodifiable factory or copy, including mutation, null, and aliasing consequences
- [ ] `ArrayList` vs `LinkedList` — prefer `ArrayList` for normal application access; linked nodes do not make locating a middle position constant-time
- [ ] Iteration and safe removal — do not structurally modify a collection through the collection itself during for-each iteration; use `removeIf` or the iterator's own `remove`
- [ ] Practical complexity recognition — distinguish linear list search from expected constant-time hash lookup without treating Big-O as a substitute for measurement
- [ ] The `equals` / `hashCode` contract — equal objects must have equal hash codes, and both methods must change together for correct `HashSet` and `HashMap` behaviour
- [ ] Mutable hash keys — changing fields used by `equals` or `hashCode` after insertion can make an entry effectively unreachable in a hash-based collection
- [ ] `Comparable<T>` vs `Comparator<T>` — define one natural order inside a type or multiple external orderings without changing that type
- [ ] Equality vs ordering consistency — understand that sorted sets and maps treat `compareTo` or `compare` returning zero as the same key even when `equals` disagrees

Audit note: two bullets this entry owns are currently unwritten in `10-collections.md` — the three-way `Arrays.asList` / `List.of` / `List.copyOf` comparison (the file teaches `List.of` versus `ArrayList` only, and never mentions the other two), and the `equals` / `hashCode` contract and mutable-hash-key material, which currently lives in `06-oop-classes.md` and moves here under entry 06's audit note.

Rationale: Storage semantics, implementation choice, mutation rules, lookup cost, hashing, and ordering are one subject because each of them is a property of how a collection finds and distinguishes the elements it holds — which is exactly why `hashCode` and ordering consistency belong here and not in entry 06. The three-way factory comparison sits beside the factory bullet because it is the same question — what does this list let you do to it afterwards — asked of the constructor Victor will actually meet in legacy code.

Handoff: Lookups, conversions, and iteration have now produced several ways to fail; entry 11 develops the full model of how a Java failure travels, is handled, and is diagnosed.

## 11 — Exceptions and diagnostics

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/11-exceptions.md
Spanish: notes/java/junior/es/11-excepciones.md

Depends on: 05, 10

Pending additions: none

Narrative role: Treat failure as part of a method's contract and follow one failure from the throw site through stack unwinding, handling, cleanup, and diagnosis.

Learning outcome: Distinguish exception categories, choose a targeted handling boundary, preserve useful context, close resources safely, and extract the actionable cause from a stack trace.

Prerequisites: 05, 10

Must answer:

- What compile-time obligation separates a checked exception from a `RuntimeException`, and what is the exact compiler message when it is ignored?
- What does a `throw` statement do to the method it appears in, and what does a `throws` clause promise the caller?
- Using the call-stack model from entry 05, how does an uncaught exception remove frames, and why is "up" the standard word for it even when the diagram is drawn downward?
- What belongs in `try`, in a targeted `catch`, and in `finally`, and what still runs when the `try` block throws?
- What does try-with-resources do that a `finally` block previously had to do by hand?
- Why does a caller that has to inspect the message text to decide what went wrong mean the failure needed its own exception type, and what does naming that type let a boundary handler do?
- Entry 06 rejected invalid arguments inside a constructor; now that the exception model is explicit, which category does the failure it raises belong to, and why is that a caller's programming error rather than something a `catch` should recover from?
- What must a class do to be usable inside try-with-resources parentheses, and how does that requirement reuse the interface contract from entry 07?
- If the wrapping exception is constructed without passing the original throwable, what exactly disappears from the printed trace, and how far from the real fault does the investigation then start?
- Why is an empty or over-broad `catch` worse than letting the failure escape?
- In what order should the type, message, `Caused by` chain, and first application frame of a real trace be read?

Coverage concepts:

- [ ] Checked vs unchecked exceptions — checked exceptions must be caught or declared, while `RuntimeException` subclasses do not carry that compile-time requirement
- [ ] `throw` vs `throws` — a `throw` statement evaluates an exception reference and completes abruptly, while a `throws` clause declares possible checked failures to callers
- [ ] Exception propagation and stack unwinding — an uncaught exception removes call frames until a compatible handler is found or the thread terminates
- [ ] Targeted `try` / `catch` / `finally` — catch only failures that can be handled or contextualised and use `finally` for cleanup that must run
- [ ] Try-with-resources — close `AutoCloseable` resources on both success and failure without duplicating cleanup code
- [ ] Custom exception types — name a meaningful failure with a dedicated unchecked type so a caller or a boundary handler can react to that failure specifically instead of parsing a message string
- [ ] Preserved exception causes — pass the original throwable into the wrapping exception so the trace still shows where the failure actually started
- [ ] Do not swallow exceptions — an empty or over-broad catch hides the failure and leaves callers unable to distinguish success from corruption
- [ ] Reading stack traces — identify the exception type, message, cause chain, and first relevant application frame before changing code

Coverage split note: the single bullet this entry previously carried for custom exceptions and preserved causes has been split by coverage into two, and each now has its own must-answer question — naming a failure type and preserving a cause are separate decisions with separate failure modes. The existing note teaches both, but only the cause half is developed at any depth.

Rationale: Exception categories, propagation, handling, cleanup, causes, and stack traces are one lifecycle, followed from the origin of a failure to its diagnosis.

Handoff: Failure paths are now explicit, so entry 12 can introduce behaviour-as-a-value and lazy pipelines without hiding errors or control flow inside them.

## 12 — Lambdas, method references, and Optional pipelines

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/12-streams-lambdas.md
Spanish: notes/java/junior/es/12-streams-lambdas.md

Depends on: 09, 11

Pending additions: none

Narrative role: Give Java the ability to hand a small piece of behaviour to an API as if it were a value, and use that ability to finish the one type left open since entry 09 — an `Optional` whose contents are reached without ever asking whether it is empty.

Learning outcome: Match a lambda or method reference to the functional interface it targets, and resolve an `Optional` through `map`, `filter`, and a lazy or throwing terminal without an eager fallback or an unchecked `get`.

Prerequisites: 09, 11

Must answer:

- How do `Predicate`, `Function`, `Consumer`, and `Supplier` decide what a lambda may accept and must return?
- How does the anonymous inner class from entry 07 become a lambda, and what did the language have to add for that to be possible?
- When is `Employee::getName` exactly equivalent to a lambda, and when is it not?
- How do `map` and `ifPresent` remove an explicit presence check on an `Optional`?
- How does `filter` on an `Optional` turn a present-but-rejected value into an empty one, and why does that let a single `orElseThrow` handle both "not found" and "found but not allowed"?
- Why does `orElse` do work that `orElseGet` skips, and when does that difference actually matter?
- Why is `orElseThrow` preferred over `get()`, and which exception should it throw given entry 11?

Coverage concepts:

- [ ] `Predicate<T>` — represent a test from one input to a boolean result
- [ ] `Function<T, R>` — represent a transformation from an input type to an output type
- [ ] `Consumer<T>` — accept a value for a side effect without returning a result
- [ ] `Supplier<T>` — produce a value without receiving an input
- [ ] Lambda expressions — pass small pieces of behaviour to APIs while keeping parameter and return types consistent with the target functional interface
- [ ] Method references — use forms such as `Employee::getName` when a lambda only delegates to an existing method
- [ ] `Optional.map` and `ifPresent` — transform a present value or run a side effect without manually branching on presence
- [ ] `Optional.filter` — reject a present value that fails a predicate by turning it into an empty Optional, so one terminal operation handles both absence and rejection
- [ ] `Optional.orElseGet` and `orElseThrow` — produce a lazy fallback or fail with a meaningful exception instead of calling unchecked `get`
- [ ] `orElse` vs `orElseGet` — `orElse` evaluates its fallback eagerly, while `orElseGet` calls its supplier only when the Optional is empty

Audit note: this entry and entry 13 divide one existing file. `12-streams-lambdas.md` currently carries both halves and keeps its legacy slug — the stream and collector sections move out to the new `13-streams-collectors.md`, and the `Optional` usage sections still sitting in `09-generics.md` move in. Coverage has also added `Optional.filter`, which the file never mentions, and the note reduces `orElse` versus `orElseGet` to a table row rather than the eager-argument mechanism the bullet asks for.

Rationale: One mechanism runs through every bullet here — a function written where a value is expected, checked by the compiler against a single-abstract-method interface. `Optional` belongs with it and not with streams, because every useful `Optional` method takes exactly such a function and because the type's real subject is absence, not iteration.

Handoff: Behaviour can now be passed to an API; entry 13 hands it to a pipeline that applies it to every element of a collection and collects the result.

## 13 — Streams, collectors, and ordering

Status: pending

Studied: pending
Pending study: none

Action: create

English: notes/java/junior/en/13-streams-collectors.md
Spanish: notes/java/junior/es/13-streams-colectores.md

Depends on: 10, 12

Pending additions: none

Narrative role: Apply the behaviour of entry 12 to a whole collection at once, through a pipeline that is described first, run once, and turned back into a result the caller can use.

Learning outcome: Build and evaluate a readable stream pipeline without mutating its source, order its elements by a field, and choose the collector whose result type the caller actually needs.

Prerequisites: 10, 12

Must answer:

- Which operations only describe work, and what makes the pipeline actually run?
- Why does reusing a consumed stream throw instead of starting over?
- What do `filter`, `map`, `flatMap`, `sorted`, and `distinct` each do to the elements flowing through, and which of them depend on contracts from entries 06 and 10?
- Why must a `reduce` operation be associative, and what breaks when it is not?
- Why is `anyMatch` the honest way to ask "is there at least one", and what does it stop doing the moment it finds a match that `filter(...).toList().isEmpty()` would have carried on doing?
- What does `findFirst` hand back that `anyMatch` cannot, what does `allMatch` answer instead, and how does the caller's real question decide between the three?
- When is a plain loop the clearer choice because of branching, early exit, or mutable state?
- Why can the list from `Stream.toList()` not be modified when the one from `Collectors.toList()` sometimes can?
- What does `Collectors.joining` remove from the hand-written "append a separator unless this is the first element" loop, and what do its optional prefix and suffix arguments produce?
- What happens when two elements of a stream produce the same key under `Collectors.toMap`, why is the two-argument form therefore a trap, and what does the merge function receive?
- How does `Comparator.comparing(Employee::getName)` replace the hand-written comparator from entry 10, and how is a tie-breaker added to it?
- Why does grouping a stream into a `Map` of lists sit outside this chapter, when `toMap` and `joining` do not?

Coverage concepts:

- [ ] Stream pipeline lifecycle — create a lazy intermediate pipeline and trigger it once with a terminal operation; a consumed stream cannot be reused
- [ ] `filter`, `map`, and `toList` — select and transform elements into a result without mutating the source collection
- [ ] `flatMap` — transform each element into zero or more elements and flatten the nested results into one stream
- [ ] `sorted` and `distinct` — order elements or remove duplicates while recognising their dependence on comparison and equality contracts
- [ ] `reduce` and simple aggregation — combine stream elements into one result with an identity or accumulator whose operation is associative
- [ ] `anyMatch` — answer whether at least one element satisfies a predicate, short-circuiting on the first match rather than materialising a filtered collection to test that it is non-empty
- [ ] `findFirst` and `allMatch` — retrieve the first matching element as an `Optional`, or assert that every element satisfies a predicate, choosing the result type the caller actually needs
- [ ] Stream side effects vs loops — keep stream transformations side-effect free and choose a loop when stateful branching or early control flow is clearer
- [ ] `Stream.toList()` vs `Collectors.toList()` — `Stream.toList()` returns an unmodifiable list, while `Collectors.toList()` makes no mutability guarantee
- [ ] `Collectors.toMap` — gather a stream into a key/value map, supplying a merge function because a duplicate key otherwise throws instead of silently overwriting
- [ ] `Collectors.joining` — gather a stream of text into one delimited String, with an optional prefix and suffix, instead of accumulating with a manual separator flag
- [ ] `Comparator.comparing()` — build a field-based ordering and compose tie-breakers when the primary key is equal

Audit note: the source prose is the stream half of `12-streams-lambdas.md` — `## What a stream is` through `## Collectors quick reference` — and it moves here rather than being written from nothing; the two chapters are authored together. Three defects come with it. `Collectors.groupingBy` is developed twice at full length (in `## Grouping and joining — Collectors that build more than a plain list` and in the last two rows of `## Collectors quick reference`) and no junior bullet owns it — `Downstream collectors and multi-level grouping` is middle scope, so it is reduced to a named boundary, exactly as entry 06 does with the record compact constructor. `allMatch` survives only as a table row, and `Collectors.toMap` is shown only in its trap-prone two-argument form. The `mapToInt(...).sum()` mention in `## Common patterns you will write every day` is two sentences of primitive-stream scope and is left alone.

Rationale: Laziness is the mental model, not "the functional API". A pipeline that describes work and runs once explains, in a single stroke, why an intermediate operation prints nothing, why a consumed stream throws, why `sorted` needs a contract from entry 10, and why the collector — not the stream — decides whether the result can be modified.

Handoff: Arbitrary values can now be filtered, transformed, ordered, and collected; entry 14 turns from processing values to narrowing them into a closed set the compiler itself can police.

## 14 — Enums

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/14-enums.md
Spanish: notes/java/junior/es/14-enums.md

Depends on: 03, 06

Pending additions: none

Narrative role: Replace fragile magic strings with a closed domain type whose identity, data, behaviour, and exhaustive branching the compiler can reason about. Nothing in this chapter needs entries 12 or 13: a reader may take it directly after entry 06, and the seam from the stream chapter is a change of subject rather than a dependency.

Learning outcome: Model a closed set with an enum, compare constants safely, attach domain data or behaviour when justified, and write a switch expression the compiler keeps exhaustive.

Prerequisites: 03, 06

Must answer:

- What kind of bug does a `String` status field allow that an enum makes impossible?
- Why is `==` the correct comparison for enum constants when entry 06 argued against it for other objects?
- When do fields and methods belong on the enum itself instead of in external `if` chains?
- What does the compiler report the moment a new constant is added and one switch expression stops covering every case?
- Why does adding a `default` branch silence exactly the warning that was most useful?

Coverage concepts:

- [ ] Enums — model a closed set of named domain values instead of scattering magic Strings through control flow
- [ ] Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour
- [ ] Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions

Rationale: Enum identity, per-constant behaviour, and exhaustive switching are one idea — a fixed set of domain values the type system can check.

Handoff: An enum is the case where the value set is closed and the compiler can therefore guarantee exhaustiveness for you. Entry 15 takes the opposite case — dates and times, where the set of possible values is unbounded and no compiler check exists — so correctness has to come instead from choosing the right immutable type for the business fact being recorded.

## 15 — Date, time, and API literacy

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/15-dates.md
Spanish: notes/java/junior/es/15-fechas.md

Depends on: 01, 04, 06, 09, 11

Pending additions: none

Narrative role: Apply the immutable-value model to time, and use `java.time` as the worked example for reading any unfamiliar standard-library type from its signatures.

Learning outcome: Choose, calculate with, and format the correct immutable `java.time` value for a business contract, and infer usage constraints from a Javadoc signature.

Prerequisites: 01, 04, 06, 09, 11

Must answer:

- Which business fact calls for `LocalDate`, which for `LocalDateTime`, and which for `Instant`?
- Why does a `LocalDateTime` not identify one universal moment, and what breaks when it is stored as if it did?
- When is an elapsed amount a `Duration` and when is it a `Period`, and why does adding one month differ from adding thirty days?
- When the business fact is "the month of March 2026" and no particular day is meaningful, what does storing it as a `LocalDate` on the first of the month cost, and how do `YearMonth.atDay(1)` and `atEndOfMonth()` produce the reporting range without hard-coding 28, 30, or 31?
- If a date object cannot change, what does `plusDays(1)` return, and what happens when the result is discarded?
- Why is `DateTimeFormatter` safer than assembling a date string by hand, and why are the legacy mutable date classes avoided entirely?
- How does a Javadoc signature reveal the arguments, the return type, the generic parameters read with entry 09's syntax, and the declared exceptions read with entry 11's, before a single line is written?

Coverage concepts:

- [ ] `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract
- [ ] `Duration` vs `Period` — measure an elapsed time-based amount with `Duration` and a calendar date-based amount with `Period`, rather than computing intervals by hand
- [ ] `YearMonth` — represent a whole month as one value when no day is meaningful, and derive its date range with `atDay` and `atEndOfMonth` instead of assembling boundary dates by hand
- [ ] Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- [ ] Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

Audit note: two bullets this entry owns are unwritten in `15-dates.md`. `YearMonth` is not mentioned anywhere in the file, and there is no section at all on reading an unfamiliar API from its Javadoc signature — the second of these is the skill the chapter's own narrative role is built on.

Rationale: The `java.time` value types, amount types, formatting, and the signature-reading skill form one unit about selecting a library type from its documented contract rather than by guesswork. `YearMonth` belongs beside `LocalDate` for the same reason `Period` belongs beside `Duration` — the choice is driven by which fact the business actually records. The prerequisite list is long because this chapter is late for a reason: its types are immutable objects built through static factories (entry 06), and the Javadoc skill it teaches means reading generic parameters (entry 09) and declared exceptions (entry 11) out of a signature.

Handoff: Javadoc explains ordinary API contracts; entry 16 covers the metadata contracts that compilers, frameworks, and tools read from around a declaration instead of from its signature.

## 16 — Annotations

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/16-annotations.md
Spanish: notes/java/junior/es/16-anotaciones.md

Depends on: 04, 07

Pending additions: none

Narrative role: Generalise from `@Override`, the one annotation Victor has already used, to annotations as metadata that some specific tool reads — so the Spring-shaped annotations he sees daily stop looking like hidden Java syntax.

Learning outcome: Determine where an annotation may appear, how long it is retained, which tool processes it, and where its real contract is documented.

Prerequisites: 04, 07

Must answer:

- `@Override` changed nothing at runtime yet caught a real bug — what does that reveal about what an annotation is?
- If an annotation is only metadata, what actually performs the behaviour it appears to describe?
- How do target and retention decide where an annotation may be written and whether anything can still see it at runtime?
- What changes when the consumer is the compiler, a build plugin, or a running framework?
- Which parts of an unfamiliar annotation's documented contract must be checked before trusting it?
- Why should `@Service` or `@Transactional` be treated as a preview of Spring Boot rather than as Java syntax?
- Why should `@Service` or `@Transactional` be read as a preview of Spring Boot rather than as Java syntax, and where does this file's cross-topic preview callout belong?

Coverage concepts:

- [ ] Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- [ ] Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

Rationale: Annotation metadata and the method for reading an unfamiliar annotation are one focused unit about declarations that exist for a tool rather than for the JVM. The chapter stays descriptive throughout: writing reflection code, designing a meta-annotation contract, and building an annotation processor are owned by the middle and senior levels.

Handoff: Annotations, libraries, and frameworks all arrive from outside the source tree; entry 17 closes the junior route with the build that resolves, compiles, tests, and packages every one of them.

## 17 — Maven fundamentals

Status: pending

Studied: pending
Pending study: none

Action: audit

English: notes/java/junior/en/17-maven.md
Spanish: notes/java/junior/es/17-maven.md

Depends on: 00, 04

Pending additions: none

Narrative role: Connect Java source, external artifacts, and plugins into one reproducible build, closing the gap between the `.java` files of entries 01–16 and a runnable application.

Learning outcome: Read a `pom.xml`, add and verify a dependency, predict lifecycle and scope effects, and use the repository's wrapper for a consistent build.

Prerequisites: 00, 04

Must answer:

- How do `groupId`, `artifactId`, and `version` identify exactly one artifact?
- What distinct jobs do dependencies, plugins, properties, and inherited configuration each perform inside a POM?
- Where does Maven find a library, and how does a dependency Victor never declared end up on the classpath?
- Why are the Spring Boot starter and the `spring-boot-starter-parent` block named here only as the concrete case of generic POM inheritance, with what they actually bundle and pin belonging to the Spring Boot notes rather than to Java?
- Which phases run when `package` is invoked, why does a later phase imply the earlier ones, and what does `clean` remove?
- What is the `test` phase for, given that writing tests belongs to a different topic, and where will Victor learn to write them?
- Which scope keeps a testing library out of the shipped application, and what does `provided` assume about the runtime environment?
- Why does `mvnw` produce a more trustworthy build than whatever Maven happens to be installed on the machine?

Coverage concepts:

- [ ] Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version`
- [ ] `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles
- [ ] Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions
- [ ] Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- [ ] Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended
- [ ] Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version

Audit note: the junior coverage section header assigns starter, parent, and plugin behaviour to Spring Boot coverage, not Java. `17-maven.md` currently explains both as Maven topics — a starter callout inside the POM-structure section and a whole section on `spring-boot-starter-parent` version management. Reduce both to the generic mechanism (POM inheritance, dependency aggregation) with the Spring-specific behaviour deferred. The Maven Wrapper bullet is also barely covered and needs real content.

Rationale: Coordinates, POM structure, resolution, lifecycle, scopes, and the wrapper describe one complete beginner workflow for building a Java project. The testing references are cross-topic previews only; JUnit itself is owned by `notes/general/`.

Handoff: Maven closes the junior journey by turning the language concepts from entries 00–16 into a repeatable compile-test-package workflow, ready for the Spring Boot notes and for middle-level Java design.
