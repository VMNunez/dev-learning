# Generics and Optional

> 📖 [Oracle Docs — Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)

## Generics

Generics let you write a class or method that works with any type, while keeping type safety. The type is specified when you use the class, not when you write it.

```java
// Without generics — must cast and can cause ClassCastException
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);   // cast required

// With generics — type is fixed, no cast needed
List<String> list = new ArrayList<>();
list.add("hello");
String s = list.get(0);   // no cast — compiler knows the type
```

---

## Generic class

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

Restrict which types are allowed with `extends`:

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

// Transform if present
Optional<String> name = result.map(Employee::getName);
```

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
