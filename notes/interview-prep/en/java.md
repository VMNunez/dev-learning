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

---

## Control flow

**What is the difference between `==` and `.equals()` in Java?**
`==` compares references — it checks if two variables point to the same object in memory. `.equals()` compares content — it checks if two objects have the same value. For Strings, always use `.equals()`. For enums and primitives, `==` is correct.

**What is the switch expression introduced in Java 14?**
The new `switch` uses `->` instead of `case:` and `break`, and can return a value directly. It also forces the compiler to warn you if you miss a case. Example: `String result = switch (status) { case ACTIVE -> "Active"; case INACTIVE -> "Disabled"; };`. This is the pattern you use with enums in Spring Boot.

---

## Methods

**What is method overloading?**
Method overloading means having two or more methods with the same name but different parameters. The compiler chooses the right one based on the arguments you pass. Example: `void log(String msg)` and `void log(String msg, int level)` — both are valid in the same class.

**What is the difference between `static` and instance methods?**
A `static` method belongs to the class and can be called without creating an object: `Math.max(a, b)`. An instance method belongs to an object and needs an instance to run. In Spring Boot, service methods are instance methods called through dependency injection — you never call them statically.

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

---

## Interfaces and abstract classes

**What is the difference between an interface and an abstract class?**
An interface is a contract — it defines what a class must do, not how. An abstract class is a partial implementation — it can have both abstract methods (no body) and concrete methods (with body). A class can implement multiple interfaces but can only extend one abstract class. In Spring Boot, repositories extend `JpaRepository` (an interface), and Spring generates the implementation automatically.

**What is a functional interface?**
A functional interface has exactly one abstract method. It can be used with a lambda. Common examples: `Predicate<T>` (takes T, returns boolean), `Function<T, R>` (takes T, returns R), `Consumer<T>` (takes T, returns nothing). The Stream API uses these — `filter()` takes a `Predicate`, `map()` takes a `Function`.

---

## Inheritance and polymorphism

**What is polymorphism in Java?**
Polymorphism means one reference can behave differently depending on the actual object it points to. If `Dog` and `Cat` both extend `Animal` and override `speak()`, then a `List<Animal>` can hold both, and calling `speak()` on each gives different results. In Spring Boot, you use this when you have multiple implementations of an interface — Spring injects the right one at runtime.

**What does `@Override` do?**
It tells the compiler that the method intentionally overrides a method from a parent class or interface. If you make a typo in the method name, the compiler gives an error instead of silently creating a new method. Always use `@Override` when overriding.

**What is the difference between overriding and overloading?**
Overriding replaces the parent's method in a subclass — same name, same parameters, different class. Overloading adds a method with the same name but different parameters in the same class. Overriding is a runtime decision; overloading is a compile-time decision.

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

---

## Generics

**What are generics and why do they exist?**
Generics let you write a class or method that works with any type while keeping type safety. Without generics, a `List` stores `Object` and you need to cast. With `List<Employee>`, the compiler knows the type and prevents you from adding the wrong type. You see this everywhere in Spring Boot: `JpaRepository<Employee, Long>`, `ResponseEntity<Employee>`, `Optional<Employee>`.

**What is `Optional<T>` and why is it better than returning `null`?**
`Optional<T>` is a container that either holds a value or is empty. When a method returns `Optional`, the caller is forced to handle the "not found" case explicitly — they cannot just forget. The most common pattern in Spring Boot: `repository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id))`.

**What is the difference between `orElse()` and `orElseGet()`?**
`orElse(value)` always evaluates the value — even if the Optional has a result. `orElseGet(() -> value)` only runs the lambda if the Optional is empty. Use `orElseGet` when the default value is expensive to create (a database call, a new object). Use `orElse` for simple values like strings or null checks.

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
