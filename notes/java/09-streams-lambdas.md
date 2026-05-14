# Streams and Lambdas

## Lambda expressions

A lambda is a short, anonymous function. Used wherever a functional interface is expected:

```java
// Without lambda — anonymous class
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// With lambda — same thing, much shorter
Runnable r = () -> System.out.println("Hello");
```

### Lambda syntax

```java
// No parameters
() -> System.out.println("Hello")

// One parameter — parentheses optional
name -> name.toUpperCase()
(name) -> name.toUpperCase()

// Multiple parameters
(a, b) -> a + b

// Multiple lines — use braces and explicit return
(a, b) -> {
    int sum = a + b;
    return sum * 2;
}
```

---

## Method references

Even shorter than lambdas — reference an existing method directly:

```java
// Lambda
list.forEach(name -> System.out.println(name));

// Method reference — same thing
list.forEach(System.out::println);
```

| Type | Syntax | Example |
|------|--------|---------|
| Static method | `ClassName::method` | `Integer::parseInt` |
| Instance method on object | `object::method` | `System.out::println` |
| Instance method on type | `ClassName::method` | `String::toUpperCase` |
| Constructor | `ClassName::new` | `Employee::new` |

---

## Stream API

A stream is a sequence of elements that you can process with a pipeline of operations. It does not store data — it processes data from a source (usually a List).

```java
List<Employee> employees = getEmployees();

// Pipeline: source → intermediate operations → terminal operation
List<String> activeNames = employees
    .stream()                              // create stream from list
    .filter(e -> e.isActive())            // keep only active
    .map(e -> e.getName())                // transform to name
    .sorted()                             // sort alphabetically
    .collect(Collectors.toList());        // collect result into a List
```

### The two types of operations

**Intermediate** — return a new stream, lazy (do not run until terminal is called):
- `filter(predicate)` — keep elements that match
- `map(function)` — transform each element
- `sorted()` / `sorted(comparator)` — sort
- `distinct()` — remove duplicates
- `limit(n)` — keep only the first n elements
- `peek(consumer)` — see each element without changing it (useful for debugging)

**Terminal** — produce a result, trigger the pipeline:
- `collect(collector)` — gather into a collection
- `forEach(consumer)` — run an action for each element
- `count()` — count elements
- `findFirst()` — return the first element as `Optional<T>`
- `anyMatch(predicate)` — true if any element matches
- `allMatch(predicate)` — true if all elements match
- `noneMatch(predicate)` — true if no element matches
- `min(comparator)` / `max(comparator)` — find min or max
- `reduce(identity, accumulator)` — fold all elements into one value

---

## Common patterns

```java
List<Employee> employees = getEmployees();

// Filter + collect
List<Employee> active = employees.stream()
    .filter(Employee::isActive)
    .collect(Collectors.toList());

// Map to different type
List<String> emails = employees.stream()
    .map(Employee::getEmail)
    .collect(Collectors.toList());

// Count
long adminCount = employees.stream()
    .filter(e -> e.getRole().equals("admin"))
    .count();

// Any match
boolean hasAdmin = employees.stream()
    .anyMatch(e -> e.getRole().equals("admin"));

// Find one
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Sort by field
List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .collect(Collectors.toList());

// Sum
int totalAge = employees.stream()
    .mapToInt(Employee::getAge)
    .sum();

// Group by field
Map<String, List<Employee>> byDepartment = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// Join strings
String names = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.joining(", "));
// "Victor, Ana, Luis"
```

---

## Stream vs for loop

```java
// for loop
List<String> result = new ArrayList<>();
for (Employee e : employees) {
    if (e.isActive()) {
        result.add(e.getName().toUpperCase());
    }
}

// Stream — same result
List<String> result = employees.stream()
    .filter(Employee::isActive)
    .map(e -> e.getName().toUpperCase())
    .collect(Collectors.toList());
```

Use streams when the pipeline is clear and readable. Use a for loop when the logic is complex or when you need to break early.

---

## Collectors reference

```java
// To List
.collect(Collectors.toList())

// To Set (removes duplicates)
.collect(Collectors.toSet())

// To Map
.collect(Collectors.toMap(
    Employee::getId,    // key
    Employee::getName   // value
))

// Join strings
.collect(Collectors.joining(", "))        // "a, b, c"
.collect(Collectors.joining(", ", "[", "]")) // "[a, b, c]"

// Group by
.collect(Collectors.groupingBy(Employee::getDepartment))
// Map<String, List<Employee>>

// Count per group
.collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()))
// Map<String, Long>
```
