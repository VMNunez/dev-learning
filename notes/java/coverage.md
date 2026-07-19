# Minimum Coverage — Java

Java language concepts needed to write and understand Spring Boot code.
Nothing beyond what appears in a real Spring Boot project — not a general Java course.
Every item must be explainable with a real example from TimeTrack or the Java notes.

## Variables, types, and Strings

- `int` vs `long` — use `int` for most whole numbers, `long` for large numbers and database IDs; the `L` suffix is required for long literals (`1234567890L`) — forgetting it is a common mistake interviewers spot
- `primitive` vs wrapper class (`long` vs `Long`) — wrapper classes can be `null`; interviewers ask "why does your entity ID use `Long` and not `long`?" — because JPA sets the ID to `null` before the first save; a `long` cannot be `null` so it would cause a compile error
- `String.equals()` vs `==` — `==` compares memory addresses, not content; using `==` to compare Strings is the most common beginner bug interviewers check for in every Java code review; always use `.equals()`
- String pool / literal interning — string literals (`"hi"`) are placed in a shared pool, so `==` between two identical literals is accidentally `true`, while `new String("hi")` or a runtime-built string is a separate object and returns `false`; interviewers use this as the follow-up to `==` vs `.equals()` to check you understand *why* `==` sometimes appears to work on Strings and know never to rely on it
- `String.isBlank()` vs `String.isEmpty()` — `isEmpty()` is true only when length is 0; `isBlank()` is also true when the string is all spaces; maps directly to understanding `@NotBlank` (rejects blanks and spaces) vs `@NotNull` (only rejects null); interviewers ask this when reviewing DTO validation
- `String.formatted()` — Java 15+ template substitution (`"User %s not found".formatted(id)`); the Java equivalent of JavaScript template literals; appears in custom exception messages
- `BigDecimal` for money — `double` cannot represent 0.1 exactly in binary; interviewers ask "what type would you use for a price field and why?"; the correct answer is `BigDecimal` — it does exact arithmetic; `double` produces rounding errors after a few operations
- `var` — local type inference (Java 10+); the type is still fixed at compile time — Java just infers it from the right side; only valid for local variables, not fields, parameters, or return types; you will see it in code reviews even if you do not write it yourself
- String immutability — every operation (`toUpperCase()`, `+`, `replace()`) returns a new `String` object instead of changing the original; interviewers ask "why does `result += name` inside a loop perform badly?" — each iteration allocates a new object that the garbage collector must clean up
- `StringBuilder` — mutable buffer for building a string inside a loop; `sb.append(x)` modifies the same object instead of creating a new one each time; interviewers ask when to reach for it instead of `+` (loops, not single-line concatenation — the compiler already optimises that case)
- autoboxing / unboxing — the compiler silently converts between a primitive and its wrapper (`long` ↔ `Long`); unboxing a `null` wrapper into a primitive throws `NullPointerException`; interviewers show `long id = mapThatMightReturnNull.get(key)` and ask what blows up and why
- `Integer` / `Long` cache and `==` on boxed values — boxed values from -128 to 127 are cached, so `==` on two boxed `100L` is accidentally `true` but two boxed `1000L` is `false`; interviewers use this gotcha to check you never compare wrapper objects with `==`, only `.equals()`

- `StringBuilder` vs `StringBuffer` — both build strings mutably, but `StringBuffer` is the legacy synchronised one and you pay for locking you never use; interviewers ask which you would reach for and why concatenating in a loop with `+` is the thing you are avoiding in the first place
- Why immutability is worth it — an immutable `String` can be shared without defensive copies, cached, safely used as a map key (its hash never changes), and cannot be altered after a security check has passed it; interviewers ask "why is `String` immutable?" and want the consequences, not the fact
- Text blocks (`"""`, Java 15+) — multi-line literals for SQL, JSON, and expected test payloads without escaped quotes and `\n`; interviewers ask how you embed a JSON fixture in a test without it becoming unreadable
- `strip()` vs `trim()` — `trim()` only removes characters below U+0020 while `strip()` is Unicode-aware, which matters the moment real user input carries a non-breaking space; interviewers use it as the "do you know the modern API?" probe
- `BigDecimal.equals` vs `compareTo` — `equals` also compares the scale, so `2.0` and `2.00` are not equal while `compareTo` returns 0; interviewers show a test that fails "for no reason" and expect this
- Constructing a `BigDecimal` correctly — `new BigDecimal(0.1)` captures the binary rounding error you were trying to escape, so it is always `BigDecimal.valueOf(0.1)` or the `String` constructor, plus `setScale(2, RoundingMode.HALF_UP)` before display; interviewers ask why the money total came out with fifteen decimals
- Integer division and silent overflow — `5 / 2` is `2` because both operands are `int`, and an `int` sum past `2^31-1` wraps around without an error; interviewers plant an average calculation that returns a whole number and ask what happened
- `Integer.parseInt` vs `Integer.valueOf` — `parseInt` returns a primitive `int`, `valueOf` returns an `Integer` from the cache for small values; interviewers pair it with the `Integer` cache gotcha to check you know which one allocates

---

## Control flow and source structure

- Classic `switch` fall-through — without `break` at the end of a case, execution continues into the next case even if it does not match; one of the most common Java bugs interviewers ask candidates to spot in a code review
- Switch expression (Java 14+) — `->` syntax that returns a value directly and removes fall-through entirely; the compiler warns if a case is missing; interviewers ask why this form is safer than the classic statement and expect you to know it is the standard pattern for handling enum status fields in a service method
- `package` declaration must mirror the folder path — the declared package and the directory the file sits in have to match or the compiler refuses to build; interviewers ask this when a candidate drags a file to another folder in the IDE and cannot explain the resulting error
- `import` resolves a name, it does not load anything — an import only tells the compiler which class a simple name refers to; the class itself must be on the classpath, and `java.lang` needs no import because it is imported implicitly; interviewers ask what an import actually does to separate it from a JavaScript `import`, which really does fetch a module
- Fully-qualified class names and same-name collisions — when two libraries expose a class with the same simple name (`java.util.Date` and `java.sql.Date`) you can import only one and must write the other in full; interviewers show a file that needs both and ask how you resolve it

## Compiling and running Java

- JDK vs JRE vs JVM — the JDK contains the compiler (`javac`) and the tools, the JVM executes bytecode, the JRE is the runtime subset; interviewers ask this to check you understand why a machine with only a runtime cannot build the project
- Compile-time vs runtime failure — the compiler checks syntax, types, and signatures; anything that depends on a *value* (a null reference, a bad cast, a missing class on the classpath) can only fail while running; interviewers show a list of errors and ask you to classify them, because "it compiles" proves almost nothing
- Reading the common compiler messages — `cannot find symbol`, `incompatible types`, `unreported exception X must be caught or declared to be thrown`, `class Y is public, should be declared in a file named Y.java`; interviewers expect you to translate each into the fix without searching, since these are the four you will hit weekly
- `NoClassDefFoundError` vs `ClassNotFoundException` — both mean a class the code needs is not on the classpath at runtime even though it compiled fine; the usual cause is a dependency declared with the wrong scope or missing from the package; interviewers ask why a `provided`-scope library breaks the deployed application
- `NoSuchMethodError` — the code was compiled against one version of a library and a different version is on the classpath at runtime; it is a runtime error with a clean compile, and the way you find it is by inspecting the dependency tree; interviewers use it for "it works on my machine, it breaks in the pipeline"

- Source, bytecode, and the JVM — `javac` turns `.java` into `.class` bytecode that any JVM can run, which is what "write once, run anywhere" actually means and why the JVM, not the code, is the portable part; interviewers ask what a `.class` file contains
- The classpath — the list of directories and jars the JVM searches for classes at runtime, which is why a class that compiled fine can still be "not found" when you run it; interviewers ask what the classpath is before asking about `ClassNotFoundException`
- Reflection — reading and invoking a class's members by name at runtime; it is the mechanism behind component scanning, `@Autowired` injection, Hibernate instantiating your entities, and Jackson mapping JSON, which is exactly why those things need a no-arg constructor and `RUNTIME` retention; interviewers ask "how does Spring create an object it has never seen?"
- Java version literacy — Java 8 gave lambdas, streams, `java.time` and `Optional`; Java 11 added the HTTP client; Java 17 added records, sealed types, pattern matching for `instanceof`, switch expressions and text blocks; Java 21 added pattern matching for `switch` and virtual threads; LTS releases are why client projects sit on 8, 11, or 17; postings name Java 8 *and* Java 17 side by side, so interviewers ask which you have used and what the newer one gives you

---

## Classes and objects

- Classes, fields, constructors — every Spring component is a class; interviewers ask "what is an object in the context of a Spring bean?"
- `private final` fields — why Spring Boot services use them: dependencies cannot change after construction, makes the class easier to unit test; the constructor injection pattern depends on this
- Access modifiers: `public`, `private`, `protected` — what each restricts and why Spring Boot services use `private` for fields and `public` for methods
- Package-private (default) access — a field or method with no modifier is visible only within the same package, not public; interviewers list all four levels and expect you to name the "default" one because it is the one juniors forget
- `this` keyword — disambiguates between a field and a constructor parameter; appears in Lombok-generated code and custom constructors
- No-arg (default) constructor — Java gives a class a public no-arg constructor only when you declare no constructor at all; the moment you add any constructor that default disappears; interviewers ask "why does your JPA entity need a no-arg constructor?" — Hibernate instantiates the entity by reflection and then sets the fields, so an entity that has only an all-args constructor fails at runtime
- `static` methods and fields — belong to the class, not to any instance; `Map.of()`, `Integer.parseInt()`, `Objects.equals()`, and utility factory methods are all `static`; interviewers ask "why can't a `static` method access instance fields?" (because there is no instance)
- Encapsulation — fields are `private`, accessed through getters/setters; this is what Lombok's `@Data` generates; Spring Data reads and writes entity fields through this pattern

- Why an abstract class still has a constructor — it cannot be instantiated on its own, but the subclass's constructor calls `super(...)` to initialise the inherited state; interviewers ask what a constructor is for on a class you can never `new`
- Constructor chaining and initialisation order — the implicit `super()` runs first, then field initialisers and instance blocks, then the constructor body, and `this(...)` delegates to another constructor of the same class; interviewers ask why a field read inside the parent constructor is still null
- Nested classes — a `static` nested class stands alone, an inner (non-static) class holds an implicit reference to its outer instance and can therefore keep it alive as a memory leak, and an anonymous class is the pre-lambda way to implement a one-method interface on the spot; interviewers ask the difference and where you have seen each

---

## Object identity and immutable data

- `instanceof` — checks the runtime type of an object; appears in `equals()` overrides (`if (!(obj instanceof Employee other)) return false`) and in exception handlers; pattern matching form (`instanceof Dog dog`) is Java 16+ and is in the notes
- `equals()` and `hashCode()` — always override both together; `HashMap` and `HashSet` use `hashCode()` to find the bucket and `equals()` to confirm the match; breaking the contract causes silent bugs; Lombok `@Data` generates both automatically — interviewers ask "what does `@Data` generate?"
- `Objects.equals(a, b)` — null-safe comparison utility; equivalent to `a != null && a.equals(b)` but shorter and cleaner; use inside `equals()` overrides to avoid NullPointerException
- Records (Java 16+) — `record CreateUserRequest(String name, String email) {}` generates the constructor, getters, `equals`, `hashCode`, and `toString` automatically; immutable by design; interviewers ask "have you seen records used as DTOs?" because it shows you know modern Java
- Record vs class, and why an entity cannot be a record — a record is the right shape for a request/response payload (immutable, value equality, no Lombok needed) but Hibernate needs a no-arg constructor and mutable fields, so an entity stays a class; interviewers ask "why is your DTO a record and your entity is not?"
- Immutability as a design default — a class with `final` fields and no setters cannot be changed by a caller after construction, which removes a whole class of surprise bugs and makes the object safe to share; interviewers ask "when would you make a class immutable and what do you gain?"
- Static factory method vs constructor — a factory (`Optional.of()`, `Employee.of(...)`) can carry a meaningful name, validate before constructing, and return a cached or subclass instance, none of which a constructor can do; interviewers ask why `Optional` has no public constructor

- The `equals` contract stated properly — reflexive, symmetric, transitive, consistent, and false against `null`; equal objects must have equal hash codes, but equal hash codes do *not* imply equal objects; interviewers ask you to state it, then ask whether a `hashCode()` returning a constant is legal (it is, and it degrades every `HashMap` lookup to a linear scan)
- `equals`/`hashCode` on a JPA entity — the id is null until the row is persisted, so an entity added to a `HashSet` before saving lands in the wrong bucket afterwards, and generating them from *all* fields drags lazy relations into the comparison; the usual answer is a business key or only the id with the caveat understood; interviewers ask what you would include and why the naive Lombok answer is a trap
- A record's compact constructor — validation and normalisation written once without repeating the parameter list, since a record's fields are final and assigned for you; interviewers ask where you would reject a negative amount in a record DTO

---

## Inheritance and polymorphism

- `extends` and `super` — a subclass inherits a parent's fields and methods; `super(...)` calls the parent constructor and `super.method()` calls the overridden parent method; interviewers ask you to distinguish inheritance from implementing an interface (single `extends` vs many `implements`) and where Spring uses it (your custom exception `extends RuntimeException`)
- Polymorphism (runtime dispatch) — a variable of the parent/interface type can hold any subclass, and the overridden method chosen is decided at runtime, not compile time; this is why Spring can inject any implementation of an interface without the caller knowing which one; the classic "what is polymorphism, show an example" question
- `final` (variable, method, class) — `final` on a variable forbids reassignment, on a method forbids overriding it in a subclass, on a class forbids extending it at all; interviewers ask "what does `final` mean in these three places?" because juniors only know the field case, and it explains why a `private final` service dependency cannot be swapped after construction
- Composition over inheritance — the default rule is to hold a collaborator as a field rather than extend a class, because inheritance couples you to the parent's internals and you only get one; interviewers ask "where do you actually use `extends` in a Spring Boot app?" and the honest answer is custom exceptions and framework base classes, almost nothing else

- `Object` as the universal superclass — every class extends it implicitly, which is where `equals`, `hashCode`, `toString`, and `getClass` come from and why you can put anything in a `List<Object>`; interviewers ask what a class with no `extends` still inherits
- What cannot be overridden — a `static` method redeclared in a subclass is *hidden*, not overridden (the reference type decides which runs), and `private` and `final` methods are not polymorphic at all; interviewers show a static method called through a subclass reference and ask which body executes

---

## Memory and value semantics

- Pass-by-value (Java has no pass-by-reference) — Java always copies the argument; for objects it copies the *reference*, so a method can mutate the object's fields (the caller sees it) but reassigning the parameter changes nothing for the caller; interviewers ask "does the caller see the change?" to catch candidates who confuse Java with C++
- Stack vs heap — local variables and object *references* live on the per-method call stack, while the objects themselves live on the shared heap; interviewers ask this to test whether you truly understand pass-by-value (the reference is copied on the stack, the object on the heap is shared) and where a `NullPointerException` really comes from
- Garbage collection — Java reclaims heap objects automatically once nothing can reach them any more, so there is no manual `free()`/`delete` like in C++; interviewers ask "how is memory managed in Java?" and expect you to name the garbage collector and connect it to why `result += name` in a loop is wasteful — each iteration leaves an unreachable `String` behind for the GC to clean up

- A memory leak in a garbage-collected language — the collector frees what is unreachable, so a leak is something still *reachable* that should not be: a `static` collection that only ever grows, an unclosed resource, a cache with no eviction, or an inner class pinning its outer instance; `OutOfMemoryError: Java heap space` is the symptom, and `System.gc()` is only a hint the JVM may ignore; interviewers ask how you can leak memory when Java "handles memory for you"

---

## Concurrency — the awareness a junior needs

Not because a junior writes threaded code, but because every Spring application *is* multi-threaded: one bean instance serves many simultaneous requests, and this is where interviewers find out whether a candidate understands that.

- Shared mutable state in a singleton bean — a Spring `@Service` is one instance shared by every request thread, so an instance field holding per-request data is read and overwritten by concurrent users; it works perfectly in local testing and corrupts under load; interviewers ask "your service has a `private User currentUser` field — what happens with two simultaneous requests?"
- What a race condition is — two threads reading and writing the same state with no ordering guarantee, so the result depends on timing; the classic is `count++`, which is three operations (read, add, write) and not one; interviewers ask why a counter under load ends up lower than the number of increments
- `synchronized` and `volatile` at naming depth — `synchronized` serialises access to a critical section, `volatile` only guarantees visibility of a value across threads and does *not* make `count++` atomic; interviewers ask which one fixes the counter and expect you to know `volatile` alone does not
- `HashMap` vs `ConcurrentHashMap` vs `Collections.synchronizedMap` — a plain `HashMap` written concurrently can corrupt its internal structure or spin forever, `ConcurrentHashMap` is the designed-for-concurrency answer, and the wrapper merely locks the whole map; interviewers ask which one belongs in a shared cache field
- `AtomicInteger` and friends — lock-free atomic operations for the counter case, which is the right answer before reaching for `synchronized`; interviewers ask how you count requests safely
- Thread-safety of shared utilities — `SimpleDateFormat` is mutable and unsafe to share as a static field (a genuine production bug that produces wrong dates under load), while `DateTimeFormatter` and `String` are immutable and therefore safe; interviewers ask why the modern date API changed this
- The vocabulary you must recognise — `Thread`, `Runnable`, `Callable`, `ExecutorService` and thread pools, and Spring's `@Async` sitting on top of them; interviewers do not ask a junior to write them, but they do expect you to know what the words mean when a senior uses them

---

## Interfaces and abstract classes

- Interfaces: how to define and implement — why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`); interviewers ask "why does Spring prefer interfaces over concrete classes?"
- Interface vs abstract class — interface: "this class CAN do X" (a class can implement many); abstract class: "this class IS a type of X" (a class can extend only one); interviewers ask this to test if the candidate understands when to choose each
- Default methods in interfaces (Java 8+) — interfaces can have a concrete implementation with `default`; Spring's `JpaRepository` uses them to provide built-in behaviour; a class can override a default method or use it as-is
- Implementing multiple interfaces — common in Spring Security (your `User` entity may implement both your domain interface and Spring Security's `UserDetails`)
- `@Override` — marks a method that implements an interface or overrides a parent; the compiler catches mismatches; appears in `loadUserByUsername()` and custom exception constructors; omitting it is not a bug but it removes the safety check
- Overriding vs overloading — overriding: same method name and signature in a subclass (decided at runtime); overloading: same method name with different parameters in the same class (decided at compile time); interviewers show code and ask "is this an override or an overload?"
- Functional interfaces — an interface with exactly one abstract method; this is what makes lambda syntax possible; `@FunctionalInterface` enforces the constraint; built-ins: `Predicate<T>` (filter/test), `Function<T, R>` (transform), `Consumer<T>` (consume with no return), `Supplier<T>` (produce with no input); interviewers ask "what type does this lambda implement?"
- Why Spring Boot prefers interfaces for dependencies — you can swap implementations without changing the caller; the foundation of testable, loosely coupled code
- Interface-per-service vs the concrete class alone — the `UserService` + `UserServiceImpl` pair is a convention, not a law: an interface with exactly one implementation adds indirection for nothing, but it is what lets you swap or stub the collaborator later; interviewers ask "do you always create both? why?" and want a reasoned answer rather than cargo cult
- Program to the interface in declarations — write `List<X> x = new ArrayList<>()` and `Map<K, V>` rather than `ArrayList`/`HashMap` on the left-hand side, so callers depend on the capability and not the implementation; a standard code-review comment interviewers expect you to justify

## Generics

- `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` — reading and writing typed containers in Spring Boot code
- Why generics exist — catch type errors at compile time instead of at runtime; without generics, a `List` could hold any type and every `.get()` required a cast that could fail at runtime
- Generics hold reference types only, not primitives — `List<int>` does not compile; you write `List<Integer>` and autoboxing bridges the two; interviewers show `List<int>` and ask why it fails, tying generics back to the wrapper-vs-primitive distinction
- Raw types (`List` with no type parameter) — still legal for backward compatibility, but they switch off every generic check, produce "unchecked" warnings, and move the failure to a runtime `ClassCastException`; interviewers show a raw `List` and ask what the compiler has stopped doing for you
- Type erasure — generic type information exists only at compile time and is erased from the bytecode, which is why you cannot overload on `List<String>` vs `List<Integer>`, cannot write `x instanceof List<String>`, and cannot do `new T[]`; interviewers use it to explain several "why won't this compile?" snippets
- `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()` — the correct way to handle a value that might not exist
- `Optional.get()` vs `Optional.orElseThrow()` — `get()` throws `NoSuchElementException` with no useful message if empty; `orElseThrow()` lets you throw a meaningful exception with context; interviewers treat `get()` as a red flag in code review — it is the same problem as returning `null`
- `if (o.isPresent()) return o.get();` is the reviewable smell — `Optional` is meant to be chained with `map`/`filter`/`orElseThrow`, not unwrapped with a manual check, which is just a null check with extra syntax; interviewers show both forms and ask you to rewrite the first
- `Optional` is a return type, never a field or a parameter — it is not serialisable, JPA cannot map it, and an `Optional` that can itself be null is a double negative; interviewers ask "would you make an entity field `Optional<String>`?" and the answer is no
- Why returning `null` is a problem — forces every caller to null-check; `Optional` makes the absence explicit in the return type; interviewers ask "why Optional instead of null?"

- Generics are invariant — a `List<Dog>` is *not* a `List<Animal>`, because if it were you could add a `Cat` through the wider reference; interviewers hand you the assignment, ask why it does not compile, and are checking you can explain the danger rather than recite the rule
- Wildcards and PECS — `? extends T` when you only read from the structure (a producer), `? super T` when you only write into it (a consumer); interviewers ask what `List<? extends Number>` lets you do and why you cannot add to it
- Writing a generic method — `<T> T firstOrNull(List<T> items)` and bounded parameters like `<T extends Comparable<T>>`; interviewers ask you to write a small generic utility on the spot, which is where a candidate who only *consumes* generics is exposed

---

## Optional

- `Optional<T>` as a return type — makes "there may be nothing here" part of the signature instead of a null the caller forgets to check; this is why `findById` returns one; interviewers ask what problem it solves and expect "the compiler forces the caller to consider absence"
- `get()` vs `orElseThrow()` — `get()` on an empty `Optional` throws `NoSuchElementException` with no context, `orElseThrow(() -> new EntryNotFoundException(id))` throws the exception your `@RestControllerAdvice` maps to a 404; reviewers show `.get()` and expect the objection
- `orElse` vs `orElseGet` — the argument to `orElse` is evaluated *always*, even when the value is present, so an expensive default or one with a side effect runs when it should not; `orElseGet` takes a supplier and only runs on absence; interviewers show `orElse(repository.findDefault())` and ask what it costs
- `map` vs `flatMap` on an `Optional` — `map` wraps the result, so a mapper that itself returns an `Optional` gives you `Optional<Optional<T>>`; `flatMap` is the one that keeps it flat; interviewers ask when you need each
- `Optional` as a field or a method parameter — it is designed as a return type only: it is not serialisable, it adds a wrapper to every access, and an optional parameter is better expressed as an overload; interviewers ask where `Optional` does *not* belong
- `ifPresent` and `isPresent` — the callback form keeps the flow declarative while `isPresent()` followed by `get()` is just a null check wearing a costume; interviewers show the second form and ask what was gained

---

## Streams and lambdas

- Lambda expressions — anonymous functions used wherever a functional interface is expected; `e -> e.isActive()` is the most common form in service methods; interviewers ask you to read a lambda and explain what it does
- Method references — shorthand for a lambda that only calls one method: `this::toResponse`, `Employee::getName`, `System.out::println`; when both forms are used in the same codebase interviewers ask "can you explain what this reference does?"
- Stream pipeline: `filter()`, `map()`, `collect()` — the core pattern for transforming a list; `filter` keeps matching elements, `map` transforms each element, `collect` builds the result; interviewers ask you to write a pipeline from a description
- `findFirst()` — returns `Optional<T>`; the safe way to get one item from a filtered stream without throwing
- `anyMatch()` / `allMatch()` — return a boolean; used instead of a for loop when you only need to check a condition across a list
- `mapToInt().sum()` — pattern for summing a numeric field across a list: `employees.stream().mapToInt(Employee::getAge).sum()`; avoids creating intermediate objects; interviewers may ask you to refactor a for loop that sums a field
- `Collectors.groupingBy()` — groups elements into `Map<Key, List<Value>>`; used when a service must return data organised by a field (status, department, date); interviewers ask you to read the result type
- `.toList()` vs `collect(Collectors.toList())` — `.toList()` is Java 16+ and returns an immutable list; `collect(Collectors.toList())` returns a mutable list; if the next line calls `.add()` on the result, `.toList()` will throw; interviewers ask the difference when reviewing modern Java code
- Stream vs for loop — streams express intent clearly (`filter` + `map`); for loops are clearer when the logic is complex or when you need early exit with `break`; know when to choose each
- Intermediate vs terminal operations (lazy evaluation) — `filter`/`map` are intermediate and do nothing until a terminal operation (`collect`, `forEach`, `findFirst`) runs; a stream with no terminal operation never executes; interviewers ask "does this `filter` run?" to test whether you know streams are lazy, not eager
- Side effects inside a lambda — a `forEach` that adds to a list declared outside the stream, or a `map` that saves to the database, defeats the point of a pipeline built on pure transformations and breaks outright if the stream is ever parallel; interviewers show a `forEach` mutating an external list and ask you to rewrite it with `collect`

- `flatMap` on a stream — flattens a stream of collections into one stream of elements, which is the "every role of every user" or "every entry of every project" operation; interviewers ask the difference from `map` and it is the single most common streams follow-up
- `reduce` — folds a stream into one value with an identity and a combining function, which is what `sum()` and `joining()` are specialised versions of; interviewers ask you to total a `BigDecimal` column, where `reduce(BigDecimal.ZERO, BigDecimal::add)` is the answer and `mapToDouble` is the wrong one
- The `Collectors` beyond `toList` — `toMap` (which throws `IllegalStateException` on a duplicate key unless you pass a merge function), `joining`, `counting`, `summingInt`, `partitioningBy`, and `groupingBy` with a downstream collector; interviewers ask you to build a `Map<Status, Long>` count and watch whether you reach for a loop
- A stream is single-use — reusing one after a terminal operation throws `IllegalStateException: stream has already been operated upon or closed`; interviewers ask why assigning a stream to a variable and consuming it twice fails
- Stateful operations — `sorted` and `distinct` must buffer the whole stream before they can emit, which is what makes them expensive on a large source, unlike `filter` and `map`; interviewers ask which operations cost memory
- `peek` is for debugging, not side effects — it may be skipped entirely when the pipeline can be optimised, so a `peek` that saves entities silently does nothing; reviewers show `list.stream().map(this::save).count()` and ask whether `save` runs
- `findFirst` vs `findAny` — identical on a sequential stream, but `findAny` lets a parallel stream return whichever element it reaches first; interviewers ask why both exist
- `parallelStream()` — splits work across the shared common ForkJoinPool, which pays only for large CPU-bound stateless work and is close to always wrong inside a web request, since it does not carry the transaction or security context and competes with every other request; interviewers ask when you would use it and the good answer is "almost never here"
- Effectively-final capture — a lambda can only capture a local variable that is never reassigned, which is why you cannot accumulate into a counter inside `forEach`; interviewers show that exact attempt and ask for the stream-native fix
- `this` inside a lambda vs inside an anonymous class — a lambda has no scope of its own, so `this` is the enclosing instance, while in an anonymous class `this` is the anonymous object; interviewers use it to check you know a lambda is not just shorthand for an anonymous class
- The wider functional interfaces — `BiFunction`, `UnaryOperator`, `BinaryOperator`, `BiPredicate`, and the primitive variants that avoid boxing; interviewers ask what `BinaryOperator<BigDecimal>` describes once you have named the core four
- The four kinds of method reference — static (`Integer::parseInt`), bound instance (`this::save`), unbound instance (`String::length`), and constructor (`Employee::new`); interviewers show `String::length` used where a `Function<String, Integer>` is expected and ask which kind it is

---

## Exceptions — mechanics

- `Throwable` hierarchy: `Error` vs `Exception` — `Error` (`StackOverflowError`, `OutOfMemoryError`) signals a JVM-level failure you are not meant to catch, `Exception` is application-level, and both sit under `Throwable`; interviewers ask "why does `catch (Exception e)` not catch everything, and why is `catch (Throwable)` wrong?"
- Checked vs unchecked exceptions — why Spring Boot uses unchecked (`RuntimeException` subclasses): they do not need to be declared in the method signature and propagate freely to `@RestControllerAdvice`
- `RuntimeException` vs `Exception` — `RuntimeException` is unchecked (no `throws` declaration needed); `Exception` is checked (must declare with `throws` or catch it); always extend `RuntimeException` for custom exceptions in Spring Boot so they propagate without boilerplate
- `try` / `catch` / `throws` — reading Spring Boot exception handling code; `throws` in a method signature is a contract: the caller must handle it
- Creating a custom exception: `extends RuntimeException`, constructor that accepts a message, why you name it after what went wrong (`ResourceNotFoundException`)
- Designing the exception hierarchy — one abstract base (`AppException`) with a subclass per failure type lets the global handler catch the base and stay small, whereas a flat set of unrelated `RuntimeException`s forces a new handler method for every error; interviewers ask how you would add a new error type without touching the advice
- `throw new SomeException()` — how it propagates up the call stack until `@RestControllerAdvice` catches it and returns a JSON error response
- `finally` — always runs even when the `try` returns or throws, used for cleanup; the gotcha is that a `return` inside `finally` overrides the try's return and swallows the exception; interviewers use it to test control-flow depth
- try-with-resources — the modern way to guarantee a resource (`Connection`, `InputStream`) is closed via `AutoCloseable`, replacing a hand-written `finally { close(); }`; interviewers ask how you close resources safely and expect this over manual cleanup
- exception chaining / cause constructor (`throw new X(msg, cause)`) — how you rethrow while preserving the original stack trace; interviewers ask "if you catch and rethrow, how do you avoid losing where it really failed?" and a missing cause is a classic junior mistake that hides the real error
- catch-block ordering — a more specific exception must be caught before a more general one, or the code does not compile (`catch (Exception e)` before `catch (IllegalArgumentException e)` is a compile error); interviewers use it as a quick pressure check on how catch resolution works

- Multi-catch (`catch (SQLException | IOException e)`) — one block for two unrelated exceptions, where the variable is implicitly final and the types must not be in a subtype relationship with each other; interviewers ask when you would use it instead of catching a common supertype
- An overriding method cannot broaden checked exceptions — a subclass may declare fewer or narrower checked exceptions than the method it overrides, never more, because callers only know the parent's contract; interviewers ask why their override does not compile
- Swallowing an exception — an empty `catch` block, or one whose whole body is `e.printStackTrace()`, loses the failure: nothing is logged with context, nothing is rethrown, and the caller proceeds as if it worked; reviewers plant it and expect "log with context or rethrow wrapped", plus the point that `printStackTrace` writes outside the logging framework entirely

---

## The exceptions you will actually hit

- `NullPointerException` — the most common runtime failure; interviewers ask where it comes from (calling a method on `null`, unboxing a `null` wrapper, `Optional.get()` on an empty Optional) and how you prevent it (`Optional`, `Objects.requireNonNull`, null checks); not knowing its causes reads as no real Java experience
- Helpful NullPointerException messages (Java 14+) — the JVM now names the exact expression that was null (`Cannot invoke "User.getName()" because "user" is null`), so a line with three chained calls no longer leaves you guessing which one failed; interviewers paste the message and expect you to point at the dereference instead of adding print statements
- `StackOverflowError` — every method call pushes a frame onto the call stack, so recursion with no exit condition (or two objects whose `toString()` call each other) fills it and the JVM gives up; interviewers ask what causes it because it shows up in almost every first project with a bidirectional relationship
- `ClassCastException` — a cast fails at runtime because the object is not the type you claimed; interviewers pair it with `instanceof` and ask why the compiler allowed the cast in the first place
- `NumberFormatException` — thrown by `Integer.parseInt("abc")`; the real source is almost always untrusted input arriving as a String, so the answer interviewers want is validating at the boundary rather than catching it deep in a service
- `IndexOutOfBoundsException` — off-by-one on `list.get(size)` or treating an empty result as populated; the message prints both the offending index and the size, and interviewers expect you to read the two numbers rather than re-run the code
- `IllegalArgumentException` vs `IllegalStateException` — the two exceptions you throw *on purpose*: the first for a parameter that is invalid on its own, the second for an object that is in the wrong state for the call; interviewers ask which one fits a given validation and treat a bare `RuntimeException` as a smell

## Collections — choosing and using

- `List` — the one that keeps insertion order and permits duplicates, which is why every repository query and service return type is a `List<User>` and why the order the database gave you survives to the JSON; interviewers ask what a `List` guarantees that the other two do not
- `Map` — lookup by key rather than by position, which is what makes `Map.of("message", "Not found")` an instant response body and what turns an O(n) scan for a matching id into O(1); interviewers ask what you would use to look something up by id inside a loop
- `Set` — rejects duplicates by using `equals`/`hashCode` on the elements themselves, which is exactly why it models a user's roles and why putting a badly-implemented entity in one silently admits two "identical" rows; interviewers ask what a `Set` uses to decide two elements are the same
- When to use each in a Spring Boot context — `List` for ordered results from queries, `Map` for ad-hoc response bodies, `Set` for relationship collections where duplicates are meaningless
- Choosing by the operation you need, not by habit — need uniqueness → `Set`, need lookup by key → `Map`, need order and index → `List`; interviewers ask "what would you store a user's roles in, and why not a `List`?" to see whether the choice was reasoned or automatic
- `HashMap` vs `LinkedHashMap` vs `TreeMap` — `HashMap` gives no order guarantee at all, `LinkedHashMap` preserves insertion order, `TreeMap` keeps keys sorted; a response that must come back in a stable order is a requirement, not an implementation detail, and interviewers ask which one you would pick
- `ArrayList` vs `LinkedList` — `ArrayList` is backed by an array (fast random access via `get(i)`, slow insert/remove in the middle); `LinkedList` is a chain of nodes (slow `get(i)`, fast insert/remove in the middle); interviewers ask this as a data-structure tradeoff question even though `ArrayList` is what you actually use in almost every Spring Boot project
- Immutable collection factories — `List.of()`, `Map.of()`, `Arrays.asList()`, and `.toList()` return collections that reject `add`/`remove` with `UnsupportedOperationException`; the bug is never the list, it is the caller assuming it could be modified; interviewers ask what that exception means when it appears in a stack trace

- `HashSet` vs `LinkedHashSet` vs `TreeSet` — the `Set` mirror of the `Map` ordering trio: no order, insertion order, sorted order; a `TreeSet` needs its elements to be `Comparable` or to be given a `Comparator`, and throws `ClassCastException` at runtime if neither holds; interviewers ask which one preserves the order you inserted
- `Queue` and `Deque` — FIFO and double-ended access, with `ArrayDeque` as the modern replacement for the legacy synchronised `Stack` and `Vector`; interviewers ask what you would use for a processing queue and whether `Stack` is still appropriate
- `Arrays.asList` vs `List.of` — `Arrays.asList` returns a fixed-size view where `set` works but `add` throws, while `List.of` is fully immutable so even `set` throws; interviewers show `add` on one of them and ask which exception and why they differ
- `list.remove(1)` on a `List<Integer>` — the `int` overload wins over the `Object` one, so it removes the element at *index* 1 rather than the value 1; interviewers plant it as a pure gotcha and expect `remove(Integer.valueOf(1))`

---

## Collections — ordering, identity, and cost

- `Comparable<T>` vs `Comparator<T>` — `Comparable` is implemented inside the class itself (`compareTo()`) and defines one natural order; `Comparator` is defined outside the class (`compare()`, or `Comparator.comparing()`) and supports multiple sort orders without changing the class; interviewers ask which one to use when you need to sort the same list two different ways
- `Comparator.comparing()` — sorts a list by a field: `list.stream().sorted(Comparator.comparing(Employee::getName))`; used in service methods when you need a specific order that the query does not guarantee; interviewers ask you to read and explain the comparator
- `ConcurrentModificationException` — thrown when you call `list.remove()` directly inside a for-each loop over that same list; the for-each loop uses an internal iterator that detects the structural change and fails fast; interviewers ask how to safely remove items while iterating (`removeIf()` is the cleanest fix; an explicit `Iterator.remove()` also works)
- Mutating a field after the object is in a `HashSet` — the set placed it in a bucket derived from the old `hashCode()`, so once the field changes the object is in the wrong bucket and `contains()` returns false for an object that is physically inside the set; interviewers describe exactly that symptom and ask why
- Defensive copies from a getter — returning the internal `List` directly lets any caller mutate your object's state behind its back, which is why a getter on a collection field often returns a copy or an unmodifiable view; interviewers ask how you protect an entity's collection
- Cost of the collection operation you chose — `HashMap.get()` and `Set.contains()` are constant time while `List.contains()` and `indexOf()` scan the whole list, so a `list.contains()` inside a loop over another list turns an O(n) job into O(n²); the standard refactor is to build a `Map` of the lookup side once, and interviewers hand you exactly that nested loop to fix

- How a `HashMap` finds a value — `hashCode()` picks the bucket, `equals()` then distinguishes entries inside it, collisions chain in a list that converts to a tree past a threshold, and the map resizes and rehashes when it passes its load factor; interviewers ask "what happens when you call `get`?" and this is what separates a candidate who uses maps from one who understands them
- What a `HashMap` key must guarantee — a stable `hashCode` consistent with `equals`, which is why a mutable object used as a key becomes unfindable and why `String` and enums are the safe defaults; interviewers ask what makes a good key
- `Iterable` and `Iterator` — the for-each loop compiles down to an `Iterator`, which is exactly why removing from the collection inside the loop throws `ConcurrentModificationException` while `iterator.remove()` is legal; interviewers ask what the enhanced for loop actually does
- Composing comparators — `Comparator.comparing(Entry::getDate).thenComparing(Entry::getProject).reversed()`, plus `nullsFirst` for a nullable field; interviewers ask you to sort by two fields and watch whether you hand-write a comparison chain
- A `Comparator` inconsistent with `equals` — a `TreeSet` and `TreeMap` decide identity by comparison, not by `equals`, so a comparator that returns 0 for two distinct objects silently drops one of them; interviewers ask why an element disappeared from a sorted set

---

## Enums

- Defining an enum — used for `Role` (EMPLOYEE, MANAGER) and `EntryStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED) in TimeTrack; interviewers ask you to show one from the project
- Using enums in `switch` expressions — the clean way to handle each status in a service method; exhaustive by default so the compiler warns if a case is missing
- Enums carry fields and behaviour, not just names — a constant can hold a label, a code, or an HTTP status and expose it through a method, which removes the `switch` that would otherwise be duplicated everywhere the enum is used; interviewers ask how you would attach a display name to each status
- Enum vs a lookup table in the database — an enum is compile-time-safe but a new value needs a code change and a redeploy, while a table lets the business add values at runtime with no type safety; interviewers ask which you would choose for "status" and which for something the client edits
- `@Enumerated(EnumType.STRING)` vs `EnumType.ORDINAL` — `STRING` stores the name ("MANAGER") in the database; `ORDINAL` stores the position (0, 1, 2); if you add a new value in the middle of the enum, `ORDINAL` silently breaks all existing records; interviewers always ask why `STRING` is the safe choice

- `values()`, `name()`, `ordinal()`, and `valueOf()` — `valueOf` throws `IllegalArgumentException` on a string that matches no constant, which is exactly what happens when the client posts an unknown status; interviewers ask what your API does with `"PENDINGG"` in the request body
- Enum constants are singletons — the JVM guarantees one instance per constant, so `==` is safe and even correct on enums, and they work as keys in the specialised `EnumMap`/`EnumSet`; interviewers ask whether you should compare enums with `equals` or `==` and want the reasoning, not a preference

---

## Annotations

- What annotations are — metadata attached to a class, method, or field that Spring reads at runtime to configure behaviour; they do not change what the code does on their own — they are instructions to the framework
- An annotation does nothing until something reads it — an annotation is inert metadata; unless a runtime reflection scan, a generated proxy, or a compile-time processor looks for it, it has no effect whatsoever; this single mechanism explains every "the annotation is right there but nothing happens" bug interviewers plant in a review snippet
- `@Retention` — decides whether the annotation survives into the `.class` file and is visible at runtime (`RUNTIME`) or is discarded (`SOURCE`, `CLASS`, the default); a framework that reads annotations reflectively can only see `RUNTIME` ones; interviewers show a custom annotation being ignored and ask why
- `@Target` — restricts which elements an annotation may be placed on (type, method, field, parameter); putting one where it is not legal either fails to compile or is quietly skipped, which is the first thing a reviewer checks when an annotation has no effect
- Annotation attributes and the `value` shorthand — `@Foo("x")` is shorthand for `@Foo(value = "x")`, and every other attribute must be named; assuming a default or naming the wrong attribute changes behaviour with no error; interviewers hand you an unfamiliar annotation and ask you to read its attributes
- Meta-annotations — annotations that annotate other annotations; `@Service` is composed of `@Component` with a semantic label; this is why `@Service` and `@Repository` behave the same way as `@Component` for dependency injection — they are all discovered by Spring's component scan
- How to read an unfamiliar annotation — look at what it is composed of (meta-annotations), what it enables (like `@EnableMethodSecurity`), and which layer it belongs to; this skill matters because Spring Boot code is dense with annotations you did not write yourself

## Date and time

- `LocalDate` — a date without time (`2025-05-14`); used for the `date` field on a TimeEntry; immutable and thread-safe unlike the legacy `java.util.Date`
- `LocalDateTime` — a date with time (`2025-05-14T09:30:00`); used for `createdAt` and `updatedAt` timestamps; also immutable
- `LocalDate` vs `LocalDateTime` — use `LocalDate` when time is not relevant (a deadline, a work date); use `LocalDateTime` when you need the exact moment something happened; they are different types — mixing them causes a compile error; interviewers ask which one you used for each field and why
- Why not `java.util.Date` — it is mutable, poorly designed, and replaced by the `java.time` API in Java 8; interviewers ask this directly when they see date fields in your project
- `DateTimeFormatter` — formatting a date for display or for an API response; `DateTimeFormatter.ISO_LOCAL_DATE` produces the standard `2025-05-14` format
- JPA mapping — Spring Boot serialises `LocalDate` and `LocalDateTime` to JSON automatically via Jackson when `jackson-datatype-jsr310` is on the classpath (included with `spring-boot-starter-web`)

- `Instant` vs `ZonedDateTime` vs `OffsetDateTime` — `Instant` is a point on the global timeline (the right type for a `createdAt` audit stamp), while the other two attach a zone or an offset so the same instant can be shown as local time; interviewers ask which type stores "the exact moment this record was created" in a system with users in several countries
- `Duration` vs `Period` — `Duration` measures time-based amounts (hours, minutes, seconds), `Period` measures date-based ones (years, months, days), and mixing them is why "one month" cannot be expressed as a fixed number of hours; interviewers ask which one you use to compute worked hours between two `LocalDateTime`s (`Duration.between(start, end).toMinutes()`)

---

## Maven

- `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build` — what each section does and where to add a new library
- How to add a dependency — search Maven Central, copy the `<dependency>` block, Maven downloads it automatically on the next build
- Build lifecycle: `clean`, `compile`, `test`, `package`, `install` — what `mvn clean install` does and why it is the standard command to build and test before pushing
- Dependency scopes: `compile` (default, always available), `test` (only in tests), `provided` (available at runtime but not packaged) — why `spring-boot-starter-test` uses `test` scope; interviewers ask what scope to use for a testing library
- Transitive dependencies and `mvn dependency:tree` — every dependency drags in its own, so libraries you never declared end up on the classpath and two of them can demand different versions of the same thing; the tree is how you see who pulled what, and it is the first move when a `NoSuchMethodError` appears; interviewers ask how you would debug that
- Nearest-wins version resolution — when two paths in the tree lead to the same library at different versions, Maven picks the one closest to your project rather than the newest, which is how a build silently downgrades a library; interviewers ask why the parent POM pins versions instead of trusting resolution
- Why `mvn clean` fixes "impossible" errors — `target/` holds compiled classes from previous builds, so a renamed or deleted source file can leave a stale `.class` on the classpath that keeps working until you wipe it; interviewers ask when `clean` is genuinely necessary rather than superstition
- `-DskipTests` vs `-Dmaven.test.skip=true` — the first compiles the tests but does not run them, the second does not even compile them; interviewers ask the difference because reaching for either to make a red build go green is hiding a failure, not fixing one
- `settings.xml` and internal mirrors — a consultancy points Maven at a corporate Nexus or Artifactory instead of Maven Central through the per-user `settings.xml`, so a first build failing with `Could not transfer artifact … Connection refused` on a client laptop is a configuration problem, not a code one; day-one reality on a client project
