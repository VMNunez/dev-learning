# Methods

> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html)

## Method declaration

```java
accessModifier returnType methodName(parameters) {
    // body
    return value;
}
```

```java
public int add(int a, int b) {
    return a + b;
}

public void printName(String name) {
    System.out.println(name);
    // no return statement — void methods return nothing
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

| Part | Example | Meaning |
|------|---------|---------|
| `public` | access modifier | who can call this method |
| `int` | return type | what type the method returns |
| `add` | method name | how you call it |
| `int a, int b` | parameters | input values with their types |

---

## Access modifiers

| Modifier | Who can access it |
|----------|------------------|
| `public` | Everyone |
| `private` | Only inside the same class |
| `protected` | Same class + subclasses + same package |
| (none) | Same package only |

In Spring Boot you will mostly use `public` for REST endpoints and service methods, and `private` for internal helper methods.

---

## Return types

```java
public String getName() { return this.name; }   // returns a String
public int getAge() { return this.age; }         // returns an int
public boolean isActive() { return this.active; }// returns boolean — by convention starts with "is"
public void save(Employee e) { ... }             // returns nothing
public Employee findById(int id) { ... }         // returns an object
public List<Employee> findAll() { ... }          // returns a collection
```

---

## void vs Void

`void` (lowercase) is a Java **keyword** — it means a method returns nothing:

```java
public void delete(Long id) { ... }  // returns nothing
```

`Void` (uppercase) is a **class**. You use it as a generic type argument when something generic needs *a type* in its `<>` but there is no real value to carry. Java only accepts a class inside `<>`, never the `void` keyword:

```java
ResponseEntity<Void>   // ✓ — Void is a class
ResponseEntity<void>   // ✗ — void is a keyword, not valid inside < >
```

> **Clearing up the confusion:** it is *not* "`void` if nothing, `Void` if maybe-null". Both mean "no value" — they just live in different places. Use the keyword `void` for a method's return type; use the class `Void` only when a generic (`ResponseEntity<T>`, `Callable<T>`) forces you to put a type in the `<>` and there is nothing to return.

> **Preview — Spring Boot:** The example below uses `ResponseEntity`, a Spring Boot class you haven't studied yet. Read it to see where `void` vs `Void` matters in practice — you'll implement this yourself in the Spring Boot notes.

This is exactly the Spring Boot `delete` pattern — the service returns `void`, but the controller returns `ResponseEntity<Void>` so it can still send a 204 status with no body (see [spring-boot/02-rest-controllers.md](../spring-boot/02-rest-controllers.md)):

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    projectService.delete(id);                  // void — returns nothing
    return ResponseEntity.noContent().build();  // 204, no body
}
```

---

## Static methods

A `static` method belongs to the class, not to an instance. You call it on the class name, not on an object:

```java
public class MathUtils {
    public static int square(int n) {
        return n * n;
    }
}

// Call without creating an object
int result = MathUtils.square(5);   // 25
```

You have already used static methods — `Integer.parseInt("42")` and `String.valueOf(42)` are static.

In Spring Boot, service and repository methods are instance methods (called on injected objects). Utility methods that do not need state are good candidates for `static`.

---

## Method overloading

Same method name, different parameters. Java picks the right version based on the arguments you pass:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // calls first version — returns 3
add(1.5, 2.5);     // calls second version — returns 4.0
add(1, 2, 3);      // calls third version — returns 6
```

The return type alone is not enough to overload — the parameters must differ.

---

## Varargs — variable number of arguments

Accept any number of arguments of the same type. Must be the last parameter:

```java
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) total += n;
    return total;
}

sum(1, 2);           // 3
sum(1, 2, 3, 4, 5);  // 15
sum();               // 0
```

Inside the method, `numbers` behaves like an array.

---

## Calling methods

```java
// Instance method — called on an object
Employee emp = new Employee();
emp.save();
String name = emp.getName();

// Static method — called on the class
int parsed = Integer.parseInt("42");

// Method chaining — each method returns the object (or a new one)
String result = "  hello  "
    .trim()
    .toUpperCase()
    .replace("HELLO", "HI");   // "HI"
```

---

## Naming conventions

- Method names: `camelCase`, start with a verb — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Boolean getters: start with `is` or `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`
