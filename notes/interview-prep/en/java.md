# Java Interview Questions

## Variables and types

**What is the difference between a primitive and an object in Java?**
Primitives (`int`, `boolean`, `double`) store the value directly in memory and are faster. Objects store a reference to the data on the heap. In Java, every primitive has a wrapper class (`Integer`, `Boolean`, `Double`) that is needed when working with collections — you cannot have a `List<int>`, only `List<Integer>`.

**What is autoboxing?**
Autoboxing is the automatic conversion between a primitive and its wrapper class. Java does this for you — when you write `List<Integer> list = new ArrayList<>(); list.add(5);`, the `5` is automatically converted to `Integer.valueOf(5)`. The reverse (unboxing) happens when you read the value back.

**What happens if you compare two Integer objects with `==`?**
It depends on the value. Java caches `Integer` objects from -128 to 127, so `Integer a = 100; Integer b = 100; a == b` is `true` because they are the same cached object. But `Integer a = 200; Integer b = 200; a == b` is `false` — they are different objects. Always use `.equals()` to compare Integer values.

**What is `var` in Java?**
`var` is a local variable type inference introduced in Java 10. The compiler infers the type from the right side: `var name = "Victor"` is the same as `String name = "Victor"`. It only works for local variables — not for method parameters or return types. It does not make Java dynamic; the type is still fixed at compile time.

---

## Strings

**Why can't you use `==` to compare Strings in Java?**
`==` checks if two variables point to the same object in memory. Two Strings with the same content can be different objects, so `==` may return `false` even when the content is equal. Always use `.equals()` or `.equalsIgnoreCase()`. This is the most common Java beginner mistake — interviewers ask it specifically because it catches people who come from JavaScript, where `==` on strings compares content.

**What is String immutability and why does it matter?**
A String cannot be changed after it is created. Operations like `toUpperCase()` or `+` do not modify the original — they return a new String object. This means Strings are safe to share between threads and the JVM can cache them in the String pool. The implication: `String result = ""; for (...) result += name;` creates a new object on every iteration — which is why you use `StringBuilder` in loops.

**When should you use StringBuilder instead of String `+`?**
When you are building a String inside a loop. Each `+` allocates a new object — in a loop of 1000 iterations, that is 1000 String objects. `StringBuilder` appends to a single buffer: `sb.append(name).append(", ")`, then `sb.toString()` once at the end. For single-line concatenation like `"Hello " + name`, the compiler optimises it automatically — you only need `StringBuilder` explicitly inside loops.

**What is the String pool and how does it relate to immutability?**
The JVM maintains a pool of String literals. When you write `String a = "hello"; String b = "hello";`, both variables point to the same object in the pool — Java reuses it because Strings are immutable and safe to share. This is why `==` can return `true` for literals but `false` for `new String("hello")`, which bypasses the pool and creates a separate object. Always use `.equals()` — do not rely on the pool.

> **Junior tip:** Mention the pool to show you understand WHY immutability matters in Java, not just WHAT it means.

Red flag answer: "Strings are immutable because Java decided that" — no explanation of what immutability enables.

---

## Control flow

**What is the difference between `==` and `.equals()` in Java?**
`==` compares references — it checks if two variables point to the same object in memory. `.equals()` compares content — it checks if two objects have the same value. For Strings, always use `.equals()`. For enums and primitives, `==` is correct.

**What is the switch expression introduced in Java 14?**
The new `switch` uses `->` instead of `case:` and `break`, and can return a value directly. It also forces the compiler to warn you if you miss a case. Example: `String result = switch (status) { case ACTIVE -> "Active"; case INACTIVE -> "Disabled"; };`. This is the pattern you use with enums in Spring Boot.

**When would you use a switch expression on an enum instead of if-else?**
When you have a fixed set of known values and need to handle each one differently. The switch expression forces the compiler to warn you if you add a new enum constant and forget to handle it — this is impossible with if-else. In Spring Boot this is the standard pattern for status or role fields: `switch(employee.getStatus()) { case ACTIVE -> ...; case INACTIVE -> ...; }`.

> **Junior tip:** Say "the compiler warns me if I miss a case" — that shows you understand the type-safety benefit, not just the syntax.

Red flag answer: "I prefer switch because it is shorter" — misses the safety benefit entirely.

---

## Methods

**What is method overloading?**
Method overloading means having two or more methods with the same name but different parameters. The compiler chooses the right one based on the arguments you pass. Example: `void log(String msg)` and `void log(String msg, int level)` — both are valid in the same class.

**What is the difference between `static` and instance methods?**
A `static` method belongs to the class and can be called without creating an object: `Math.max(a, b)`. An instance method belongs to an object and needs an instance to run. In Spring Boot, service methods are instance methods called through dependency injection — you never call them statically.

**What is the difference between a constructor and a regular method?**
A constructor has no return type, has the same name as the class, and runs exactly once when the object is created. A regular method can be called any number of times. Constructors initialise the object's fields — after `new Employee("Victor")` the object is in a valid state. In Spring Boot, JPA entities need a no-argument constructor because Hibernate creates the object with `new` and then sets the fields via reflection.

> **Junior tip:** Mention that Hibernate needs a no-arg constructor — this shows the connection between basic Java and Spring Boot's behaviour.

Red flag answer: "A constructor is just a special method" — true but incomplete; misses why JPA requires it.

---

## Access modifiers

**What are the four access modifiers in Java?**
`private` — only accessible within the same class. Package-private (no keyword) — accessible within the same package. `protected` — accessible within the same package and in subclasses. `public` — accessible from anywhere. In Spring Boot: fields are always `private`, service and repository classes are `public`, and internal helper methods are `private`.

**Why make fields private if you are going to write public getters anyway?**
Because the getter gives you control over read access, and the setter gives you control over write access. If the field were `public`, any code could change it directly — bypassing validation. With `private` and a setter you can add rules: `if (age < 0) throw new IllegalArgumentException(...)`. JPA also needs getters to map the entity to JSON. Encapsulation is not about hiding — it is about control.

---

## OOP and classes

**What is encapsulation and why does it matter?**
Encapsulation means hiding the internal state of an object and only exposing it through methods. Fields are `private`; access goes through `getters` and `setters`. This lets you change the internal logic without breaking the code that uses the class. Every JPA entity in Spring Boot follows this pattern.

**What does `final` mean in Java?**
It means something cannot be changed after it is first assigned. On a field: `private final String name` — cannot be reassigned after the constructor sets it. On a method: it cannot be overridden in a subclass. On a class: it cannot be extended — `String` is `final`. In Spring Boot, `final` on a field signals immutability and is the same idea as `const` in JavaScript.

**What is a record in Java?**
A record (Java 16+) is a class where all fields are defined in the header and Java generates the constructor, getters, `equals`, `hashCode`, and `toString` automatically. Records are immutable — you cannot change the fields after creation. They are perfect for DTOs: `public record EmployeeDTO(String name, String email) {}`.

**Why use a record for a DTO instead of a regular class?**
A regular class needs a constructor, getters, and `equals`/`hashCode` — that is a lot of boilerplate for a simple data carrier. A record gives you all of that in one line. It also makes the immutability explicit — a DTO should not be modified after it is created.

**What is the `Object` class and why does every Java class extend it?**
`Object` is the root of the Java class hierarchy. Every class implicitly extends it, which means every object already has `toString()`, `equals()`, and `hashCode()` out of the box. This is why you can print any object with `System.out.println()` and why collections like `HashMap` can work with any type. When you override `equals()` in your own class, you are replacing the `Object` default.

> **Junior tip:** Link this to collections — "I override `equals()` and `hashCode()` so that `HashSet` knows when two Employee objects are the same."

Red flag answer: "I have heard of the Object class" — no connection to why it matters in day-to-day code.

---

## Interfaces and abstract classes

**What is the difference between an interface and an abstract class?**
An interface is a contract — it defines what a class must do, not how. An abstract class is a partial implementation — it can have both abstract methods (no body) and concrete methods (with body). A class can implement multiple interfaces but can only extend one abstract class. In Spring Boot, repositories extend `JpaRepository` (an interface), and Spring generates the implementation automatically.

**What is a functional interface?**
A functional interface has exactly one abstract method. It can be used with a lambda. Common examples: `Predicate<T>` (takes T, returns boolean), `Function<T, R>` (takes T, returns R), `Consumer<T>` (takes T, returns nothing). The Stream API uses these — `filter()` takes a `Predicate`, `map()` takes a `Function`.

**What is a `default` method in an interface and why does it exist?**
A `default` method has a body inside the interface. Classes that implement the interface can use it as-is or override it. It was added in Java 8 to let existing interfaces gain new methods without breaking all the classes that already implement them. In practice you will mostly see them in the standard library — `List.sort()` is a default method on the `List` interface.

> **Junior tip:** This is a "Java 8 added it to avoid breaking backward compatibility" story — interviewers like to hear that you understand the WHY behind language features.

Red flag answer: "A default method is a method that uses the default keyword" — circular, explains nothing.

**When would you choose an abstract class over an interface?**
When multiple related classes share real implementation — not just a contract. If `AdminService` and `EmployeeService` both need the same `validatePermissions()` logic, you can put that method in an abstract `BaseService` and have both extend it. Use an interface when you only need to define the contract. In Spring Boot you almost always use interfaces — `JpaRepository`, `UserDetailsService` — because Spring provides the implementation.

> **Junior tip:** "Interface for contract, abstract class for shared logic" — that is the one sentence to remember.

Red flag answer: "I always use interfaces" — shows you know the rule but not when the exception makes sense.

---

## Inheritance and polymorphism

**What is polymorphism in Java?**
Polymorphism means one reference can behave differently depending on the actual object it points to. If `Dog` and `Cat` both extend `Animal` and override `speak()`, then a `List<Animal>` can hold both, and calling `speak()` on each gives different results. In project 06's HR portal, `AuthService implements UserDetailsService` — when Spring Security calls `loadUserByUsername()`, it only knows it has a `UserDetailsService`. It does not care that it is specifically an `AuthService`.

**What does `@Override` do?**
It tells the compiler that the method intentionally overrides a method from a parent class or interface. If you make a typo in the method name, the compiler gives an error instead of silently creating a new method. Always use `@Override` when overriding.

**What is the difference between overriding and overloading?**
Overriding replaces the parent's method in a subclass — same name, same parameters, different class. Overloading adds a method with the same name but different parameters in the same class. Overriding is a runtime decision; overloading is a compile-time decision.

**When would you choose composition over inheritance?**
When the relationship is "has a" rather than "is a". An `EmployeeService` has a repository — it is not a type of repository. Inheritance is for "is a" relationships. Overusing inheritance creates tight coupling — a change in the parent can break all subclasses. In Spring Boot, composition through dependency injection is the standard: services receive repositories through the constructor, they do not extend them.

> **Junior tip:** "Favour composition over inheritance" is a classic design principle. Saying it with a concrete example shows you are thinking about design, not just syntax.

Red flag answer: "I use inheritance when I need to reuse code" — that is the wrong reason; use composition for reuse.

---

## Collections

**What is the difference between `List`, `Set`, and `Map`?**
A `List` is an ordered collection that allows duplicates. A `Set` is an unordered collection with no duplicates. A `Map` stores key-value pairs — keys are unique, values can repeat. In Spring Boot: `List<Employee>` for all employees, `Set<String>` for unique roles, `Map<Long, Employee>` to look up by ID.

**What is the difference between `ArrayList` and `LinkedList`?**
`ArrayList` stores elements in a continuous array — fast for random access (`get(i)`) but slow for insertions in the middle. `LinkedList` stores each element as a node with a pointer to the next — fast for insertions at the front or middle but slow for random access. In practice, use `ArrayList` for almost everything. `LinkedList` is rarely the right choice in modern Java.

**What is the difference between `HashMap`, `LinkedHashMap`, and `TreeMap`?**
`HashMap` has no guaranteed order — fastest for lookups. `LinkedHashMap` maintains insertion order — use when order matters. `TreeMap` sorts keys alphabetically or by a comparator — use when you need sorted output. In most Spring Boot code you use `HashMap` unless you need a specific order.

**When would you use `getOrDefault()` on a `Map`?**
When you are not sure if a key exists and you want a fallback value instead of `null`. Example: `map.getOrDefault(userId, "Unknown")`. This avoids a `NullPointerException` and makes the intent clear.

**What is the difference between `Comparable` and `Comparator`?**
`Comparable` is implemented by the class itself — it defines the natural sort order: `class Employee implements Comparable<Employee>` with a `compareTo()` method. `Comparator` is external — you pass it to `sorted()` without modifying the class: `Comparator.comparing(Employee::getName)`. Use `Comparable` for the default sort. Use `Comparator` when you need multiple sort options or when you cannot modify the class.

**What is a `ConcurrentModificationException` and how do you fix it?**
It happens when you remove elements from a List inside a for-each loop. The iterator tracks the list size and throws when it detects a structural change. The fix is `removeIf()`: `employees.removeIf(e -> !e.isActive())` — one line, safe, and readable. Alternatively, collect the items to remove first and delete them after the loop.

**What is the difference between `List.of()` and `new ArrayList<>()`?**
`List.of()` creates an immutable list — you cannot add, remove, or change elements after creation. It is perfect for fixed data like a list of allowed values or constants. `new ArrayList<>()` creates a mutable list. A common mistake is calling `.add()` on a `List.of()` and getting an `UnsupportedOperationException`. If you need a mutable list from known values, use `new ArrayList<>(List.of("a", "b", "c"))`.

> **Junior tip:** Mention `UnsupportedOperationException` by name — it shows you have seen or read about this mistake and know how to avoid it.

Red flag answer: "List.of is shorter to write" — misses the immutability point entirely.

**Why must you override both `equals()` and `hashCode()` together?**
Because `HashMap` and `HashSet` use both in sequence — first `hashCode()` to find the right bucket, then `equals()` to confirm the match. If you override `equals()` but not `hashCode()`, two objects that are logically equal can have different hash codes and land in different buckets, so `set.contains(employee)` returns `false` even when the employee is in the set. Java's contract is: if `a.equals(b)` is `true`, then `a.hashCode()` must equal `b.hashCode()`.

> **Junior tip:** "hashCode finds the bucket, equals confirms the match — they are a pair."

Red flag answer: "I always override both just to be safe" — you need to explain WHY they must match, not just that they do.

---

## Exceptions

**What is the difference between checked and unchecked exceptions?**
Checked exceptions extend `Exception` and must be declared with `throws` or caught — examples: `IOException`, `SQLException`. Unchecked exceptions extend `RuntimeException` and do not need to be declared — examples: `NullPointerException`, `IllegalArgumentException`. In Spring Boot you almost always use unchecked exceptions and let `@ControllerAdvice` handle them centrally.

**How do you handle exceptions globally in Spring Boot?**
With `@ControllerAdvice` and `@ExceptionHandler`. You create one class that catches specific exception types and returns the right HTTP status. Example: catching `EmployeeNotFoundException` and returning a 404 response. This keeps the controllers and services clean — they just throw the exception and the handler does the rest.

**Why create a custom exception instead of using `IllegalArgumentException`?**
A custom exception like `EmployeeNotFoundException` gives a clear name to the error. When you read the code, you immediately know what went wrong without reading the message. It also lets you handle it separately in `@ControllerAdvice` — you can return 404 for `EmployeeNotFoundException` and 400 for `IllegalArgumentException` with different handlers.

**How do you avoid `NullPointerException` in Java?**
Three patterns: use `Optional<T>` instead of returning `null` from methods; use `Objects.requireNonNull()` at method entry points to fail early with a clear message; check with `str != null && !str.isEmpty()` before using a String. In Spring Boot, the main protection is `Optional` in repositories and `@NotNull` validation on request DTOs — by the time data reaches the service, it is already validated.

**What is the difference between `Error` and `Exception`?**
Both extend `Throwable`, but they serve different purposes. `Error` signals a serious JVM-level problem — `OutOfMemoryError`, `StackOverflowError` — that your code should not try to catch or recover from. `Exception` is a recoverable problem your code can handle. The rule is simple: never catch `Error`. In Spring Boot you only work with `Exception` and its subclasses.

> **Junior tip:** "Never catch Error" is the one rule interviewers check. Say it clearly and simply.

Red flag answer: "Error and Exception are both kinds of exceptions" — misses the critical difference in intent.

**What is try-with-resources and when do you use it?**
Try-with-resources automatically closes a resource when the block ends — no `finally` needed. The resource must implement `AutoCloseable`. Use it for files, streams, and database connections. In Spring Boot, database connections are managed by the framework so you rarely write it yourself, but you will see it in file operations and in code written before modern Spring.

> **Junior tip:** "Spring Boot manages connections for you, but you still need to know this for files and for reading legacy code."

Red flag answer: "I use it instead of try-catch" — confuses resource management with exception handling.

---

## Streams and lambdas

**What is a lambda in Java?**
A lambda is a short anonymous function. Instead of writing a full anonymous class, you write the logic inline: `employees.stream().filter(e -> e.isActive())`. The `e -> e.isActive()` part is a lambda — it takes one parameter and returns a boolean.

**What is the Stream API?**
The Stream API lets you process collections with a pipeline of operations. You start with `.stream()`, chain intermediate operations (`filter`, `map`, `sorted`), and end with a terminal operation (`collect`, `count`, `forEach`). It is similar to the `Array.prototype` methods in JavaScript — `filter`, `map`, `reduce`.

**What is the difference between `map()` and `filter()` in a stream?**
`filter()` keeps elements that match a condition — the output has fewer or equal elements. `map()` transforms each element into something else — the output has the same number of elements but a different type. Example: `filter(e -> e.isActive())` gives a smaller list; `map(Employee::getName)` gives a list of strings.

**What does `collect(Collectors.toList())` do?**
It ends the stream pipeline and collects all the results into a `List`. Without a terminal operation, the stream does nothing — it is lazy. `collect` is the most common terminal operation in Spring Boot because most service methods return a `List`.

**When would you use a for loop instead of a stream?**
When the logic is complex, needs to break early (`break`), or modifies external state in multiple ways. Streams are best when the pipeline is linear and readable. If you need a `try/catch` inside the loop or you are building several different results at once, a for loop is clearer. The rule: streams make simple pipelines shorter; complex logic is easier to read as a loop.

**What is a method reference and when would you use it instead of a lambda?**
A method reference is a shorthand for a lambda that calls a single existing method. `employees.stream().map(Employee::getName)` is the same as `.map(e -> e.getName())` — just shorter. Use method references when the lambda does nothing but forward to one method. If there is any extra logic (`e -> e.getName().toUpperCase()`), keep the lambda — a method reference would not help there.

> **Junior tip:** "Method reference is just a shorter lambda — I use it when the lambda does nothing but call one method."

Red flag answer: "Method references are more efficient" — there is no performance difference; it is a readability choice only.

**What does `flatMap()` do and when would you use it?**
`map()` transforms each element into one value. `flatMap()` transforms each element into a stream and then flattens all those streams into one. Use it when each element expands into a list. Example: a `List<Department>` where each department has a `List<Employee>` — `departments.stream().flatMap(d -> d.getEmployees().stream())` gives you all employees in one flat stream.

> **Junior tip:** "flatMap is map + flatten — I use it when one element produces many elements."

Red flag answer: Confusing `flatMap` with `map` or not knowing it exists — shows lack of stream practice.

**What is `Collectors.groupingBy()` and when is it useful?**
`groupingBy` collects stream elements into a `Map` grouped by a key. `employees.stream().collect(Collectors.groupingBy(Employee::getDepartment))` gives `Map<String, List<Employee>>` — one list per department. In Spring Boot this is useful when you need to aggregate data in the service layer instead of writing a GROUP BY query, for example when building a summary view or populating a report.

> **Junior tip:** "groupingBy is the stream equivalent of SQL GROUP BY — use it when you need to organise a flat list by category."

Red flag answer: "I would write a SQL GROUP BY instead" — shows no knowledge of when the service layer handles grouping.

---

## Generics

**What are generics and why do they exist?**
Generics let you write a class or method that works with any type while keeping type safety. Without generics, a `List` stores `Object` and you need to cast. With `List<Employee>`, the compiler knows the type and prevents you from adding the wrong type. You see this everywhere in Spring Boot: `JpaRepository<Employee, Long>`, `ResponseEntity<Employee>`, `Optional<Employee>`.

**What is `Optional<T>` and why is it better than returning `null`?**
`Optional<T>` is a container that either holds a value or is empty. When a method returns `Optional`, the caller is forced to handle the "not found" case explicitly — they cannot just forget. The most common pattern in Spring Boot: `repository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id))`.

**What is the difference between `orElse()` and `orElseGet()`?**
`orElse(value)` always evaluates the value — even if the Optional already has a result. `orElseGet(() -> value)` only runs the lambda if the Optional is empty. Use `orElseGet` when the default value is expensive to create — for example, a database call or a complex object. Use `orElse` for simple constants like `""` or `0`. In project 06 I always used `orElseThrow`, but if I needed a fallback in project 07's finance tracker — like returning a default currency — I would use `orElseGet(() -> currencyService.getDefault())` to avoid an unnecessary database call.

> **Junior tip:** "orElse always runs; orElseGet only runs when empty. Use orElseGet when the default is expensive."

Red flag answer: "They both return a default — I use whichever" — shows no understanding of lazy evaluation.

---

## Enums

**What is an enum and why use it instead of a String constant?**
An enum is a type with a fixed set of named constants. If you use `String` for a role (`"ADMIN"`, `"EMPLOYEE"`), a typo compiles and fails silently. With `Role.ADMIN`, a typo is a compile error. Enums also let you add methods and fields — a Java enum is much more powerful than a TypeScript enum.

**How do you store an enum in a database with JPA?**
With `@Enumerated(EnumType.STRING)` on the field. This stores the constant name as a string (`"ADMIN"`) instead of a number. Never use `EnumType.ORDINAL` — if you add a new constant in the middle of the enum, all the numbers shift and your existing data becomes wrong.

**How do you iterate all values of an enum?**
With `EnumName.values()`, which returns an array of all constants. Example: `for (Role r : Role.values()) { ... }`. This is the same pattern as `Object.values()` in JavaScript — useful for populating a dropdown or a select list.

---

## Date and time

**Why use `LocalDate` instead of the old `java.util.Date`?**
`LocalDate` is immutable and readable — `date.plusDays(7)` returns a new date without changing the original. The old `Date` class is mutable and confusing (months start at 0, years are relative to 1900). Spring Data JPA maps `LocalDate` to a SQL `DATE` column automatically, so there is no reason to use the old API in new code.

**What is the difference between `LocalDate` and `LocalDateTime`?**
`LocalDate` has only a date — no hours, minutes, or seconds. `LocalDateTime` has both. Use `LocalDate` for birthdays, hire dates, and deadlines. Use `LocalDateTime` for timestamps like `createdAt` and `updatedAt` in JPA entities.

**How do you set `createdAt` automatically on save in Spring Boot?**
With `@PrePersist` — a lifecycle method that runs just before the entity is saved for the first time: `this.createdAt = LocalDateTime.now()`. Add `updatable = false` on the `@Column` annotation to prevent JPA from changing it on updates.

**What is `ZonedDateTime` and when do you need it instead of `LocalDateTime`?**
`ZonedDateTime` adds timezone information to a date and time. Use it when your application serves users in different timezones — for example, a meeting scheduled at 10:00 in Madrid needs to show as 09:00 in London. For most business data (hire dates, deadlines, `createdAt` timestamps on a single-country app) `LocalDateTime` is enough. In practice, most Spanish backend applications stay with `LocalDateTime` and only reach for `ZonedDateTime` when working with international scheduling or external APIs that include timezone offsets.

> **Junior tip:** "Start with LocalDateTime. Add ZonedDateTime only if timezone matters — for most Spanish apps it does not."

Red flag answer: "I always use ZonedDateTime to be safe" — unnecessary complexity that most projects do not need.

---

## Annotations

**What is an annotation in Java and what does it do?**
An annotation is metadata added to code — a label that gives extra information to the compiler or to a framework at runtime. `@Override` tells the compiler to verify you are overriding a parent method. Spring Boot annotations like `@Service`, `@Repository`, and `@Autowired` tell the framework how to wire up the application at startup. The key point: an annotation does nothing on its own — it is a signal that something else reads and acts on.

> **Junior tip:** "An annotation is a signal. The compiler or framework reads it and acts — the annotation itself executes nothing."

Red flag answer: "Annotations are like comments" — comments are ignored completely; annotations are processed by the compiler or framework.

**What is the difference between `@Override` and a Spring annotation like `@Service`?**
`@Override` is a compile-time annotation — the compiler reads it during compilation and adds a verification check. Spring annotations like `@Service` are runtime annotations — Spring Boot reads them via reflection when the application starts, and registers the class as a managed bean. They are the same Java feature used at different times for different consumers.

> **Junior tip:** Mention retention types to show depth: "compile-time vs runtime retention — Spring needs RUNTIME so it can read the annotation when the app starts."

Red flag answer: "Spring annotations are different from regular Java annotations" — they are the same mechanism, just consumed at a different time.

**Why does Spring Boot use annotations so heavily instead of XML configuration?**
Annotations let you configure behaviour declaratively inside the code itself. `@Service` marks a class as a Spring bean. `@Transactional` wraps a method in a database transaction. `@GetMapping("/employees")` maps a URL to a method. Before Spring Boot, all of this needed XML files. Annotations make the code self-documenting — you can read what a class does just by looking at its annotations. Spring Boot took this further by auto-configuring sensible defaults, so you need almost no configuration at all.

> **Junior tip:** "Annotations replaced XML configuration — that is the whole story of Spring Boot over old Spring."

Red flag answer: "Spring Boot uses annotations because it is the Java way" — no understanding of what they replaced or why.

---

## Maven

**What is Maven and what does it do?**
Maven is the standard build tool and dependency manager for Java projects. It reads `pom.xml`, downloads the listed libraries from Maven Central, compiles the code, runs tests, and packages everything into a `.jar`. The JavaScript equivalent is `npm` — `pom.xml` is `package.json`, Maven Central is the npm registry.

> **Junior tip:** "Maven is npm for Java — say it that way and every interviewer who knows JavaScript will immediately understand."

Red flag answer: "Maven compiles Java code" — true but incomplete; dependency management is the most important part.

**What is the structure of a `pom.xml` and what does the parent block do?**
The three required fields are `groupId` (your organisation), `artifactId` (the project name), and `version`. The `<dependencies>` block lists the libraries the project uses. The `<parent>` block inherits from `spring-boot-starter-parent`, which manages all Spring library versions — this is why most Spring dependencies do not need a `<version>` tag. The parent is what makes Spring Boot "just work" out of the box.

> **Junior tip:** "The parent is why you don't specify versions for Spring libraries — it already knows which versions are compatible."

Red flag answer: "I use Spring Initializr so I don't need to understand pom.xml" — you always need to add dependencies manually.

**How do you add a new dependency to a Spring Boot project?**
Search `mvnrepository.com` for the library, copy the `<dependency>` block, and paste it inside `<dependencies>` in `pom.xml`. For Spring libraries, leave out `<version>` — the parent manages it. For other libraries like JWT, include the version. IntelliJ detects the change and downloads the dependency automatically. If needed, run `mvn install` manually.

> **Junior tip:** "Always copy from mvnrepository.com — never type a dependency block by hand. Getting the groupId or artifactId wrong by one character breaks the build silently."

Red flag answer: "I would download the jar and add it to the project manually" — that is the pre-Maven way; it defeats the purpose entirely.

---

## Pressure

**You are reviewing a colleague's code and find a String being built with `+` inside a loop that runs thousands of times. What do you say?**
I would raise it in the code review and explain the issue — each `+` creates a new String object, so a loop of 10,000 iterations creates 10,000 short-lived objects that the garbage collector has to clean up. The fix is a `StringBuilder` before the loop and `sb.append()` on each iteration. I would explain the reason, not just give the fix, so the colleague understands the pattern.

**A junior on your team gets a `ConcurrentModificationException` but has no idea why. How do you explain it?**
I would explain that a for-each loop uses an iterator internally, and the iterator tracks the list structure. If you call `list.remove()` inside the loop, the structure changes and the iterator detects it as a violation — so it throws. Then I would show the fix: `employees.removeIf(e -> !e.isActive())`. One line, safe, and readable. No need to manage the iterator manually.

**An interviewer says: "Java is very verbose. Why not just use Node.js for the backend?" How do you respond?**
Java is verbose in some areas, but that verbosity buys you things that matter at scale — strong static typing that catches bugs at compile time, a mature ecosystem for enterprise applications (Spring Boot, JPA, Spring Security), and the kind of long-term stability that large organisations need. Spanish consultancies use Java because their clients — banks, insurance companies, public sector — run systems for 10 or 20 years. Node.js is great for fast prototypes; Java is the standard when the project needs to be maintained by a team for a long time.

**Your interviewer asks: "What is the most confusing part of Java for someone coming from JavaScript?"**
The thing that surprises most people is that Java is pass-by-value, but for objects it passes a copy of the reference — so it looks like pass-by-reference. Another thing is that `==` checks identity, not equality, which trips up anyone used to JavaScript's loose comparison. And the type system is strict — you cannot just add a String and a number. Once you accept that Java is explicit about types and mutability, the confusion goes away and it actually feels safer.

**A colleague argues that returning `null` is simpler than using `Optional`. How do you respond?**
I understand the argument — `Optional` does add a wrapper. But the problem with `null` is that it is invisible. When a method returns `null`, nothing in the code tells the caller that they need to check for it. With `Optional`, the signature itself communicates that the value may not be there — the caller cannot forget because they have to call `orElse` or `orElseThrow` to get the value. In Spring Boot, `JpaRepository.findById()` returns `Optional<T>` for exactly this reason. The extra wrapper is worth the safety.
