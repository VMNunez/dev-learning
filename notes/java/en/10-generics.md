# Generics and Optional

> 📖 [Baeldung — Generics in Java](https://www.baeldung.com/java-generics)
> 📖 [Baeldung — Guide to Optional](https://www.baeldung.com/java-optional)
> 📖 [Oracle Docs — Generics](https://docs.oracle.com/javase/tutorial/java/generics/index.html)

In `09-streams-lambdas.md` you learned to transform data fluently — `map`, `filter`, `collect` reshaping a collection in a single chain. But every one of those operations already knew what type it was working with: a `Stream<Employee>`, a `List<String>`. Nothing so far has let you write a class or a method that works with *any* type safely — one `Box` that holds a `String` today and an `Integer` tomorrow, with the compiler still checking every use. That is exactly what generics add, and it is why the streams API you just met is built on them from top to bottom.

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

So does the `List<String>` actually *know*, while the program is running, that it holds strings? No — and this surprises everyone the first time. Generics are a **compile-time-only** check. The compiler uses `<String>` to verify every `add` and every `get` while it compiles your code, and then it **erases** the type: it throws the `<String>` information away and inserts the casts for you. This is called *type erasure*.

```
What YOU write:            What the COMPILER produces (after erasure):

List<String> list;         List list;                    ← the <String> is gone
list.add("hi");            list.add("hi");
String s = list.get(0);    String s = (String) list.get(0);  ← cast inserted for you
```

The cast never disappeared — the compiler just writes it so you don't have to, after it has already proven the cast is safe. At runtime there is only a plain `List` of `Object` references.

> **Generics live only at compile time.** `List<String>` and `List<Integer>` are the *same* `List` class once the program runs — the `<...>` part is erased. That is why you cannot ask a list at runtime "what type do you hold?" and why you cannot write `new T[]` or `if (x instanceof List<String>)` — the type argument simply is not there anymore. It did its whole job while compiling.

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

Read the table like this: the `Letter` is just a name — the compiler treats them all identically, so `Box<T>` and `Box<E>` behave exactly the same. The `Common use` column is pure convention: seeing `E` signals "this is a collection element", seeing `K, V` signals "this is a map". Following it makes your generic code instantly readable to any Java developer.

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

The reason `<T>` comes *before* the return type is that the compiler reads the method left to right, and it needs to know `T` is a type parameter before it hits the first place you use it. In `<T> T getFirst(List<T> list)`, the very next token after the declaration — the return type `T` — is already `T`. If you did not declare `<T>` first, the compiler would reach that `T` and have no idea what it is: a real class you forgot to import? A typo? Declaring `<T>` up front tells it "the letters that follow in this signature are placeholders I'm introducing right now", so it can resolve every later `T` against that declaration.

> **The leading `<T>` is a declaration, not decoration.** It is the moment `T` is *born* for this method. Everything after it — the return type, the parameters, the body — can then refer to `T`. This is the same reason a generic *class* writes `class Box<T>`: the `<T>` must be introduced before any member can use it.

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

That last line does not compile, and the message names the bound exactly:

```
type argument String is not within bounds of type-variable T
```

(IntelliJ phrases the same rule as `required: T; T extends Number; found: String`.) Recognising that wording later tells you instantly that you passed a type that falls outside a generic bound — not a normal type mismatch.

---

## `Optional<T>`

`Optional<T>` is a container that either holds a value or is empty. It forces you to handle the "no value" case explicitly, instead of returning `null` and hoping the caller checks for it.

```java
// Returning null — caller might forget to check and end up with a NullPointerException
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

> **Avoid `.get()`.** It gives you nothing that the safer methods don't, and it throws `NoSuchElementException` the moment the Optional is empty — which defeats the whole point of using an Optional, since you are back to an unchecked crash exactly like a `NullPointerException`. Every time you reach for `.get()`, one of `orElse`, `orElseGet`, `orElseThrow`, or `ifPresent` expresses the intent better and cannot blow up unexpectedly. Treat `.get()` as a code smell.

> **`orElse` vs `orElseGet` — eager vs lazy.** They look interchangeable but differ in *when* the default is built. `orElse(new Employee(...))` evaluates its argument **always** — the `new Employee(...)` runs even when the Optional has a value and the result is thrown away. `orElseGet(() -> new Employee(...))` takes a supplier (a lambda) and only runs it **when the Optional is empty**. For a cheap default it does not matter; but if the default is expensive — a database call, a `new` object you'd rather not allocate — `orElseGet` is the correct choice because it is *lazy*: the code inside the lambda does not run unless it is actually needed.

### Optional.map() vs Stream.map()

Same concept — transform the value inside — but they work on different things:

| | Works on | Returns |
|---|---|---|
| `Stream.map()` | each element in a stream | a new `Stream` |
| `Optional.map()` | the value inside the Optional, if present | a new `Optional` |

Read the table as a pair of "container in → container out": each `map()` opens its own container (a `Stream` for the first row, an `Optional` for the second), transforms what is inside, and hands you back the *same kind* of container — never a raw value. That is why the return column always matches the container in the "Works on" column.

You do NOT need `.stream()` before `.map()` when working with an Optional.

### Chaining map() + orElseThrow() — real project example

This is the exact `ProjectService.getById()` from project 07 (`backend/.../service/ProjectService.java`):

```java
// projectRepository.findById(id) returns Optional<Project>
public ProjectResponse getById(Long id) {
    return projectRepository.findById(id)
        .map(this::toResponse)                   // Optional<Project> → Optional<ProjectResponse>
        .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        // Optional<ProjectResponse> → ProjectResponse  (throws if empty)
}
```

`this::toResponse` is a *method reference* (covered in full in `09-streams-lambdas.md` — read it as "call the `toResponse` method of `this` on each value"). It points at a small helper in the same service that copies a `Project` into a `ProjectResponse` field by field:

```java
private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    response.setDescription(project.getDescription());
    response.setActive(project.getActive());
    response.setCreatedAt(project.getCreatedAt());
    return response;
}
```

Extracting the mapping into `toResponse` is why `getById` stays a clean three-line chain — and why the same `.map(this::toResponse)` is reused by every other method in the service. `ResourceNotFoundException` is a custom `RuntimeException` subclass (see `08-exceptions.md`) that Spring maps to an HTTP 404.

Step by step:
1. `findById(id)` → `Optional<Project>` — present if found, empty if not
2. `.map(this::toResponse)` → `Optional<ProjectResponse>` — transforms the value inside, stays empty if was empty
3. `.orElseThrow(...)` → `ProjectResponse` — unwraps the value, or throws if empty

### The most common Spring Boot pattern

> **Preview — Spring Boot:** The `repository` and `JpaRepository` below are Spring Boot pieces you have not studied yet. Focus on the *Optional* handling — how `findById` returns an `Optional` and `orElseThrow` unwraps it. The full "## Generics in Spring Boot" section right after this explains where `<T>` shows up across Spring's API.

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

---

Generics let a type stay *open* — one `Box` works with any type you plug in. The next file, `11-enums.md`, is about the opposite need: a type that is deliberately *closed*, restricting its own values to a small fixed set you define up front (a status that can only be `ACTIVE`, `PENDING`, or `CLOSED`, never anything else). Where generics widen what a type accepts, enums narrow it — and that is exactly the guarantee you want for a field with a handful of valid states.
