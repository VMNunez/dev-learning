# Generics and Optional

> 📖 [Baeldung — Generics in Java](https://www.baeldung.com/java-generics)
> 📖 [Baeldung — Guide to Optional](https://www.baeldung.com/java-optional)
> 📖 [Oracle Docs — Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)

## Generics

Before generics existed, a `List` could hold anything — you put a `String` in and got back an `Object`. To use the value you had to cast it manually, and if you put the wrong type in, the cast failed at runtime with a `ClassCastException`. You had no protection at compile time.

Generics fix this by letting you declare what type a class or method works with. You specify the type when you use the class, not when you write it — so `List<String>` is a list that only accepts strings, and the compiler enforces that. The cast disappears because the compiler already knows the type.

```java
// Without generics — must cast and can cause ClassCastException
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);   // cast required — will crash if the element is not a String

// With generics — type is fixed, no cast needed
List<String> list = new ArrayList<>();
list.add("hello");
String s = list.get(0);   // no cast — compiler knows it is a String
```

---

## Generic class

You write the type parameter `<T>` after the class name. `T` is a placeholder — when someone creates an instance they replace `T` with the actual type they need:

```java
public class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

Box<String> nameBox = new Box<>("Victor");
Box<Integer> ageBox = new Box<>(31);

nameBox.getValue();   // "Victor" — String
ageBox.getValue();    // 31 — Integer
```

`T` is a type parameter — it is replaced with the actual type when you create an instance. You can use any letter (`T`, `E`, `K`, `V`) but these conventions are standard:

| Letter | Meaning | Common use |
|--------|---------|-----------|
| `T` | Type | Generic class or method |
| `E` | Element | Collections (`List<E>`) |
| `K` | Key | Maps (`Map<K, V>`) |
| `V` | Value | Maps (`Map<K, V>`) |
| `R` | Return | Functions |

---

## Generic method

A method can also have its own type parameter, independent of the class. You declare it before the return type: `<T> ReturnType methodName(...)`.

```java
public static <T> T getFirst(List<T> list) {
    if (list.isEmpty()) return null;
    return list.get(0);
}

String first = getFirst(List.of("a", "b", "c"));   // "a"
Integer num  = getFirst(List.of(1, 2, 3));          // 1
```

---

## Bounded type parameters

Sometimes you need a generic method to work with multiple types but not just any type — for example, a method that sums a list of numbers must be able to call `.doubleValue()` on each element, which only makes sense for number types. You restrict which types are accepted using `extends`. The type parameter `<T extends Number>` means "T can be any type, as long as it is a subclass of `Number`" — which covers `Integer`, `Double`, `Long`, and all other numeric wrapper types.

```java
// Only accepts Number and its subclasses (Integer, Double, Long...)
public static <T extends Number> double sum(List<T> list) {
    double total = 0;
    for (T item : list) {
        total += item.doubleValue();
    }
    return total;
}

sum(List.of(1, 2, 3));         // works — Integer extends Number
sum(List.of(1.5, 2.5));        // works — Double extends Number
// sum(List.of("a", "b"));     // compile error — String does not extend Number
```

---

## `Optional<T>`

`Optional<T>` is a container that either holds a value or is empty. It forces you to handle the "no value" case explicitly, instead of returning `null` and hoping the caller checks for it.

```java
// Returning null — caller might forget to check
public Employee findById(Long id) {
    return database.get(id);   // could return null
}

// Returning Optional — caller must handle the empty case
public Optional<Employee> findById(Long id) {
    Employee emp = database.get(id);
    return Optional.ofNullable(emp);
}
```

### Creating an Optional

```java
Optional<String> withValue = Optional.of("Victor");          // has a value
Optional<String> empty     = Optional.empty();               // no value
Optional<String> nullable  = Optional.ofNullable(getName()); // value or empty, depending on null
```

### Using an Optional

```java
Optional<Employee> result = repository.findById(id);

// Check if present
result.isPresent();   // true if has value
result.isEmpty();     // true if empty

// Get the value (throws NoSuchElementException if empty — avoid this)
result.get();

// Get with default
result.orElse(new Employee("Unknown", ""));
result.orElseGet(() -> new Employee("Unknown", ""));

// Throw custom exception if empty
result.orElseThrow(() -> new EmployeeNotFoundException(id));

// Run action if present
result.ifPresent(emp -> System.out.println(emp.getName()));

// Transform if present — Optional.map() transforms the value inside the Optional
// if present, and returns a new Optional. If empty, stays empty.
Optional<String> name = result.map(Employee::getName);
// Optional<Employee>  →  Optional<String>
```

### Optional.map() vs Stream.map()

Same concept — transform the value inside — but they work on different things:

| | Works on | Returns |
|---|---|---|
| `Stream.map()` | each element in a stream | a new `Stream` |
| `Optional.map()` | the value inside the Optional, if present | a new `Optional` |

You do NOT need `.stream()` before `.map()` when working with an Optional.

### Chaining map() + orElseThrow() — real project example

This is the standard pattern in `ProjectService.getById()`:

```java
// repository.findById(id) returns Optional<Project>
public ProjectResponse getById(Long id) {
    return projectRepository.findById(id)
        .map(project -> {                        // Optional<Project> → Optional<ProjectResponse>
            ProjectResponse response = new ProjectResponse();
            response.setId(project.getId());
            response.setName(project.getName());
            response.setDescription(project.getDescription());
            response.setActive(project.getActive());
            response.setCreatedAt(project.getCreatedAt());
            return response;
        })
        .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        // Optional<ProjectResponse> → ProjectResponse  (throws if empty)
}
```

Step by step:
1. `findById(id)` → `Optional<Project>` — present if found, empty if not
2. `.map(...)` → `Optional<ProjectResponse>` — transforms the value inside, stays empty if was empty
3. `.orElseThrow(...)` → `ProjectResponse` — unwraps the value, or throws if empty

### The most common Spring Boot pattern

```java
// In the repository (Spring Data generates this automatically)
Optional<Employee> findById(Long id);

// In the service
public Employee getEmployee(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

---

## Generics in Spring Boot

> **Preview — Spring Boot:** The examples below use `JpaRepository`, `ResponseEntity`, and stream operations — Spring Boot and Java concepts you may not have studied yet. Read this to see how `<T>` appears everywhere in Spring Boot's API. It will make much more sense once you are in the Spring Boot notes.

You will see and use generics constantly:

```java
// JpaRepository<Entity, ID>
public interface EmployeeRepository extends JpaRepository<Employee, Long> {}

// ResponseEntity<T>
public ResponseEntity<Employee> getEmployee(Long id) {
    Employee emp = service.findById(id);
    return ResponseEntity.ok(emp);
}

// List<T>
public List<Employee> getAllEmployees() {
    return repository.findAll();
}

// Optional<T>
Optional<Employee> employee = repository.findById(id);

// Stream operations use generics internally
employees.stream()
    .map(Employee::getName)      // Stream<String>
    .collect(Collectors.toList()); // List<String>
```

Understanding what `<T>` means makes Spring Boot's API much easier to read.
