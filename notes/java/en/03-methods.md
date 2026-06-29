# Methods

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → read the full article
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (official reference)

## Method declaration

> **Where do methods live?** Always inside a class — they cannot exist outside a class in Java. We cover them here before classes because you have already seen them in the control flow examples. The full structure of a class (fields, constructors, encapsulation) is covered in [04-oop-classes.md](04-oop-classes.md).

A method is a named block of code that performs one specific task. You define it once and call it from anywhere in the program.

```java
public int add(int a, int b) {
    return a + b;
}
```

This method has four parts: `public` is the access modifier (who can call it), `int` is the return type, `add` is its name, and `int a, int b` are the input parameters. The general structure looks like this:

```java
accessModifier returnType methodName(parameters) {
    // body
    return value;
}
```

More examples:

```java
public void printName(String name) {
    System.out.println(name);
    // no return statement — void methods return nothing
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

---

## Access modifiers

| Modifier | Who can access it |
|----------|------------------|
| `public` | Everyone |
| `private` | Only inside the same class |
| `protected` | Same class + subclasses + same package |
| (none) | Same package only |

In Spring Boot you will mostly use `public` for REST endpoints and service methods, and `private` for internal helper methods.

```java
public class UserService {
    // public — any class can call findById
    public User findById(Long id) {
        return validate(findRaw(id));
    }

    // private — only accessible inside UserService; the outside world does not know these exist
    private User findRaw(Long id) { ... }
    private User validate(User user) { ... }
}

// protected — useful in inheritance (covered in 06-inheritance-polymorphism.md):
// subclasses can access it, the outside world cannot
public class Animal {
    protected String sound;
}

public class Dog extends Animal {
    public void bark() {
        System.out.println(this.sound);  // ✓ — Dog extends Animal and can see sound
    }
}
```

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

`Void` (uppercase) is a **class** — technically the wrapper class for `void`, just like `Integer` is the wrapper for `int`. Unlike `Integer`, it holds no useful value; it exists only so that generics can write `<Void>` when there is nothing to return. Java only accepts a class inside `<>`, never the `void` keyword:

```java
ResponseEntity<Void>   // ✓ — Void is a class
ResponseEntity<void>   // ✗ — void is a keyword, not valid inside < >
```

> **Clearing up the confusion:** the distinction has nothing to do with null — both mean "no value". The difference is context: `void` is the keyword for return types; `Void` is the class for when a generic forces you to put a type in `<>` and there is nothing to return.

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

Java decides which version to call by looking at the **parameters** — their number and types. The return type does not count. If you define two methods with the same parameters but different return types, Java cannot tell them apart and the compiler throws an error.

---

## Varargs — variable number of arguments

Accept any number of arguments of the same type. Must be the last parameter. You will see this in logging frameworks (`log.info("User {} not found", id)`) and utilities like `String.format()` — the same pattern as the `.formatted()` you saw in [01-variables-types.md](01-variables-types.md).

```java
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) total += n;  // numbers is an array — iterate with for-each just like any array
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

// Method chaining — each method returns a new String so you can call the next method directly on it
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
