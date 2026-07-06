# Streams and Lambdas

> 📖 [Baeldung — Java 8 Streams](https://www.baeldung.com/java-8-streams)
> 📖 [Baeldung — Lambda Expressions](https://www.baeldung.com/java-8-lambda-expressions-tips)

---

## Why this topic matters for Spring Boot

Open any Spring Boot service and you will find streams and lambdas within the first few methods. They are not an advanced topic you reach later — they are the default way to work with data in Java. Consider what a typical service method does:

- fetch a list of entities from the repository
- filter out the ones that do not meet a condition
- convert each entity into a DTO before sending it to the controller
- or find one specific entity by id and throw an exception if it does not exist

Every one of those steps is written with a stream pipeline and a lambda. Without understanding this syntax, you cannot read or write a real Spring Boot service. The goal of this file is to build that understanding from scratch, starting with *why lambdas exist* before touching streams at all.

---

## The problem lambdas solve

Before Java 8, if you wanted to pass a piece of behaviour to a method — for example, "sort this list by name" — you had to create a whole class or an anonymous inner class just to hold that one line of logic. It was verbose and hard to read.

```java
// Old way — anonymous class just to define one piece of behaviour
List<String> names = Arrays.asList("Luis", "Ana", "Victor");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});
```

Java 8 introduced **lambda expressions**: a short, anonymous function you can pass around as if it were a value. The same sort becomes one line:

```java
Collections.sort(names, (a, b) -> a.compareTo(b));
```

The arrow `->` separates the parameters on the left from the body on the right. You do not need to name the function, declare a class, or write `@Override`. Java infers the types from context.

---

## Functional interfaces — the rule that makes lambdas work

A lambda can only be used where Java expects a **functional interface**: an interface that has exactly one abstract method. `Comparator<T>` is one example — it has one abstract method (`compare`). `Runnable` is another — it has `run`. Because there is only one method, Java knows exactly which method the lambda is implementing.

You rarely need to worry about this rule directly. What matters in practice is: whenever a Spring Boot method or a stream operation asks for a `Predicate`, a `Function`, a `Consumer`, or a `Comparator`, you pass a lambda. The compiler handles the rest.

---

## Lambda syntax

```java
// No parameters
() -> System.out.println("Hello")

// One parameter — parentheses are optional
name -> name.toUpperCase()

// Multiple parameters
(a, b) -> a + b

// Body with multiple lines — braces required, and you must write return explicitly
(a, b) -> {
    int sum = a + b;
    return sum * 2;
}
```

The types of the parameters are almost always omitted — Java infers them. You only add them when the compiler cannot figure it out, which is rare.

---

## Method references — an even shorter lambda

If a lambda does nothing except call an existing method and pass the argument straight through, you can replace it with a **method reference** using `::`.

```java
// Lambda
list.forEach(name -> System.out.println(name));

// Method reference — identical behaviour, shorter
list.forEach(System.out::println);
```

The rule is simple: use a method reference only when the lambda body is just one method call and the argument goes in directly without any transformation.

```java
// Can use method reference — argument goes straight in
.map(project -> toResponse(project))   // lambda
.map(this::toResponse)                 // method reference — same thing

// Cannot use method reference — the lambda does something extra first
.map(project -> toResponse(project.getName()))
```

The four forms you will see most often:

| Form                                | Syntax              | Reads as              |
| ----------------------------------- | ------------------- | --------------------- |
| Static method                       | `ClassName::method` | `Integer::parseInt`   |
| Instance method (on a known object) | `object::method`    | `System.out::println` |
| Instance method (on each element)   | `ClassName::method` | `String::toUpperCase` |
| Constructor                         | `ClassName::new`    | `Employee::new`       |

In Spring Boot you will frequently see `this::toResponse` in service methods — it calls the private mapping method on the current service instance.

---

## What a stream is

A **stream** is not a data structure — it does not store anything. It is a pipeline that describes a sequence of operations to apply to data from a source (usually a `List`). You chain operations together, and Java runs them all in one pass when you ask for a result.

```
source → [intermediate operations] → terminal operation → result
```

Think of it like a production line: the raw material (your list) enters at one end, each station transforms or filters it, and a finished product comes out at the other end.

```java
List<Employee> employees = getEmployees();

List<String> activeNames = employees
    .stream()                              // open the pipeline
    .filter(e -> e.isActive())            // station 1: keep only active employees
    .map(e -> e.getName())                // station 2: take the name from each one
    .sorted()                             // station 3: sort alphabetically
    .collect(Collectors.toList());        // close the pipeline, collect the result
```

The result is a new `List<String>`. The original `employees` list is never modified.

---

## Intermediate vs terminal operations

**Intermediate operations** — each one returns a new stream, so you can chain them. They are also **lazy**: they do not actually run until a terminal operation is called. Java waits until it knows the full pipeline before doing any work.

| Operation                         | What it does                                                     |
| --------------------------------- | ---------------------------------------------------------------- |
| `filter(predicate)`               | Keeps only the elements where the condition is true              |
| `map(function)`                   | Transforms each element into something else                      |
| `sorted()` / `sorted(comparator)` | Sorts the elements                                               |
| `distinct()`                      | Removes duplicate elements                                       |
| `limit(n)`                        | Keeps only the first `n` elements                                |
| `peek(consumer)`                  | Inspects each element without changing it — useful for debugging |

**Terminal operations** — these trigger the pipeline and produce a result. Once a terminal operation runs, the stream is consumed and cannot be reused.

| Operation                             | What it produces                                      |
| ------------------------------------- | ----------------------------------------------------- |
| `collect(collector)`                  | Gathers elements into a collection (List, Set, Map…)  |
| `forEach(consumer)`                   | Runs an action on each element, returns nothing       |
| `count()`                             | Returns the number of elements as `long`              |
| `findFirst()`                         | Returns the first element wrapped in an `Optional<T>` |
| `anyMatch(predicate)`                 | Returns `true` if at least one element matches        |
| `allMatch(predicate)`                 | Returns `true` if every element matches               |
| `noneMatch(predicate)`                | Returns `true` if no element matches                  |
| `min(comparator)` / `max(comparator)` | Finds the smallest or largest element                 |
| `reduce(identity, accumulator)`       | Folds all elements into a single value                |

---

## Optional — what findFirst returns and why

`findFirst()` does not return `T` directly — it returns `Optional<T>`. An `Optional` is a container that either holds a value or is empty. It forces you to handle the case where nothing was found, instead of getting a `NullPointerException`.

```java
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Safe ways to get the value out
found.isPresent();                     // true if there is a value
found.get();                           // get the value — throws if empty, use carefully
found.orElse(null);                    // return null if empty
found.orElseThrow(() -> new RuntimeException("Not found"));  // throw if empty
```

In Spring Boot services you will see `.orElseThrow()` constantly — it is the standard pattern for "find by id or throw a 404 exception".

---

## Common patterns you will write every day

These are the stream pipelines you will write most often in a Spring Boot service. The method references (`Employee::isActive`, `Employee::getEmail`) are the short form — each is equivalent to a lambda like `e -> e.isActive()`. For the full explanation of method references, see the "Method references" section above.

```java
List<Employee> employees = getEmployees();

// Filter and collect
List<Employee> active = employees.stream()
    .filter(Employee::isActive)
    .collect(Collectors.toList());

// Transform to a different type
List<String> emails = employees.stream()
    .map(Employee::getEmail)
    .collect(Collectors.toList());

// Count matches
long adminCount = employees.stream()
    .filter(e -> e.getRole().equals("admin"))
    .count();

// Check if any match
boolean hasAdmin = employees.stream()
    .anyMatch(e -> e.getRole().equals("admin"));

// Find one by id
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Sort by a field
List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .collect(Collectors.toList());

// Sum a numeric field
int totalAge = employees.stream()
    .mapToInt(Employee::getAge)
    .sum();

// Group elements by a field
Map<String, List<Employee>> byDepartment = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// Join strings with a separator
String names = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.joining(", "));
// result: "Victor, Ana, Luis"
```

---

## Entity to DTO mapping — the pattern you will use in every service

> **Preview — Spring Boot:** This section uses `projectRepository`, `ProjectResponse`, and Spring Boot service patterns you haven't studied yet. Read it to see streams applied to a real project — you'll implement this exact pattern in the Spring Boot notes.

In Spring Boot, a service method must never return the raw entity from the database — it returns a DTO (Data Transfer Object) that only exposes the fields the API needs. The standard way to convert a list of entities to a list of DTOs is a stream pipeline:

```java
// ProjectService — getAll()
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(project -> {
            ProjectResponse response = new ProjectResponse();
            response.setId(project.getId());
            response.setName(project.getName());
            response.setDescription(project.getDescription());
            response.setActive(project.getActive());
            response.setCreatedAt(project.getCreatedAt());
            return response;
        })
        .toList();
}
```

`.toList()` (Java 16+) is a shorter alternative to `.collect(Collectors.toList())`. Both work in Java 25. The difference: `.toList()` returns an **immutable** list — you cannot add or remove elements from the result. Use `.collect(Collectors.toList())` only when you need to modify the result list afterwards, which is rare.

As the mapping logic grows, you typically extract it into a private method and use a method reference:

```java
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(this::toResponse)
        .toList();
}

private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    // ...
    return response;
}
```

---

## Stream vs for loop — when to use each

Streams make the _intent_ of the code clear — filter, map, sort — in a way that a for loop does not. But a for loop is sometimes the right tool.

```java
// for loop
List<String> result = new ArrayList<>();
for (Employee e : employees) {
    if (e.isActive()) {
        result.add(e.getName().toUpperCase());
    }
}

// Stream — same result, intent is immediately visible
List<String> result = employees.stream()
    .filter(Employee::isActive)
    .map(e -> e.getName().toUpperCase())
    .collect(Collectors.toList());
```

Use a stream when the pipeline is clear and each step fits in a line or two. Use a for loop when:

- the logic inside is complex and spans many lines
- you need to `break` out of the loop early
- you are updating an external variable inside the loop (streams discourage side effects)

---

## Collectors quick reference

`Collectors` is a utility class that provides ready-made strategies for the `collect()` terminal operation.

```java
// Collect into a List
.collect(Collectors.toList())

// Collect into a Set (duplicates removed automatically)
.collect(Collectors.toSet())

// Collect into a Map
.collect(Collectors.toMap(
    Employee::getId,    // each element becomes a key
    Employee::getName   // each element becomes a value
))

// Join strings
.collect(Collectors.joining(", "))             // "a, b, c"
.collect(Collectors.joining(", ", "[", "]"))   // "[a, b, c]"

// Group into a Map<key, List<element>>
.collect(Collectors.groupingBy(Employee::getDepartment))
// result: Map<String, List<Employee>>

// Count per group
.collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()))
// result: Map<String, Long>
```
