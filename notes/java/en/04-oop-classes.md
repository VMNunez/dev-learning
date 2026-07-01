# OOP — Classes

> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## What is a class

A class is a blueprint for creating objects. An object is one instance of that class.

```java
// Blueprint
public class Employee {
    // Fields — the data the object holds (always private)
    private String name;
    private String email;
    private int age;

    // Constructor — runs when you create a new object with new
    public Employee(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters — read the private fields
    public String getName() { return name; }  // this.name also works; when there is no ambiguity, Java understands name as this.name
    public String getEmail() { return email; }
    public int getAge() { return age; }

    // Setters — modify the private fields
    public void setEmail(String email) { this.email = email; }
}

// Creating an object from the blueprint
Employee emp = new Employee("Victor", "victor@example.com", 31);
System.out.println(emp.getName());   // "Victor"
```

---

## `this`

`this` refers to the current object. Used to distinguish between fields and parameters with the same name:

```java
public Employee(String name) {
    this.name = name;   // this.name = field, name = parameter
}
```

Also used to call another constructor from within a constructor. Both constructors belong to the same class — it is a way to reuse initialisation logic when one constructor is a special case of the other:

```java
public class Employee {
    private String name;
    private String email;

    // One-parameter constructor — delegates to the two-parameter one to avoid duplicating code
    public Employee(String name) {
        this(name, "unknown@email.com");   // calls the two-parameter constructor of this same class
    }

    // Two-parameter constructor — contains the real initialisation logic
    public Employee(String name, String email) {
        this.name = name;
        this.email = email;
    }
}

new Employee("Victor");                        // name="Victor", email="unknown@email.com"
new Employee("Victor", "victor@example.com"); // name="Victor", email="victor@example.com"
```

Whenever you see `this(...)` inside a constructor, it means "call another constructor of this same class with these arguments." The call to `this()` must always be the first line of the constructor.

---

## Constructors

A constructor is the special method that runs when you create an object with `new`. Two fixed rules: (1) it must be named exactly the same as the class, and (2) it has no return type — not even `void`. That is how the compiler tells it apart from a regular method.

```java
public class Employee {
    private String name;
    private int age;

    // Constructor — same name as the class, no return type
    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// Invoked with new — Java runs the constructor automatically
Employee emp = new Employee("Victor", 31);
```

Constructors are almost always `public` — you need to be able to create objects from outside the class. If you do not define any constructor, Java creates an empty one automatically (no parameters, does nothing). As soon as you define one with parameters, that automatic constructor disappears.

---

## Encapsulation

Fields are always `private` — they can only be accessed through the class's own methods (getters/setters). This protects the data from being changed directly from outside:

```java
public class Employee {
    private String name;   // private — no one outside can touch it directly
    private int age;       // private — accessed only through getters/setters

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return this.name; }   // getter — controlled read access
    public int getAge() { return this.age; }         // getter — controlled read access
    public void setAge(int age) {                    // setter with validation
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.age = age;
    }
}
```

Without encapsulation, anyone could do this:

```java
// Without encapsulation — public field, anyone can assign any value
emp.age = -500;  // nothing stops this

// With encapsulation — private field, setter validates before assigning
emp.setAge(-500);  // throws IllegalArgumentException — the object protects itself
```

---

## Static fields and methods

"Members" is the general term for the fields and methods of a class. `static` members belong to the class itself, not to any individual object. `static` makes sense in two situations: (1) when the method only works with its arguments and needs no instance data — like `Integer.parseInt("42")`; (2) when you want a field shared across all instances — like a counter of how many objects have been created.

```java
public class Employee {
    private static int count = 0;   // shared by ALL instances
    private String name;

    public Employee(String name) {
        this.name = name;
        count++;   // every new Employee increments the shared count
    }

    public static int getCount() {
        return count;
    }
}

Employee.getCount();   // called on the class, not on an instance
```

---

## Constructor overloading

Constructor overloading is the same concept as method overloading: you can define multiple constructors in the same class, each with different parameters. Java picks the right one based on the arguments you pass with `new`. It is useful when you want to allow different ways to create an object — with all the data, with only the required fields, or with defaults for optional ones:

```java
public class Employee {
    private String name;
    private String role;

    public Employee(String name) {
        this(name, "employee");   // default role
    }

    public Employee(String name, String role) {
        this.name = name;
        this.role = role;
    }
}

new Employee("Victor");            // name="Victor", role="employee"
new Employee("Victor", "admin");   // name="Victor", role="admin"
```

---

## `toString()`

When you do `System.out.println(emp)`, Java needs to convert the object to text. It looks for a method named exactly `toString()` in your class — if it does not find one, it falls back to the one from the base class `Object`, which prints something unreadable like `Employee@1b6d3586` (class name + memory address, useless for debugging).

The name `toString()` is not your choice — it is the name Java expects by convention. It always returns `String` and takes no parameters.

`@Override` tells the compiler "I am replacing this method from a parent class." If you misspell the name (e.g. `tostring()` in lowercase), without `@Override` Java would treat it as a brand new unrelated method and your `println` would still show the memory address. With `@Override`, the compiler catches the typo immediately. You will learn annotations properly in `13-annotations.md` — for now, just know that `@Override` goes above any method you are intentionally replacing.

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` and `hashCode()`

You already know that for Strings you use `.equals()` instead of `==` because `==` compares references (memory addresses), not content. The same problem exists for any object you define yourself.

By default, if you do `emp1.equals(emp2)`, Java checks if they are the same object in memory — not if they hold the same data. If you want two employees to be "equal" when they have the same email, you override `equals()` in your class to define what "equal" means:

```java
// Inside the Employee class:
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;                        // same object — trivially equal
    if (!(obj instanceof Employee other)) return false;  // different types — cannot be equal
    return Objects.equals(this.email, other.email);      // your equality criterion: same email
}
```

`hashCode()` always goes together with `equals()` — collections like `HashMap` and `HashSet` use both to organise objects. The rule is simple: if two objects are equal according to `equals()`, they must have the same `hashCode()`. If you override one without the other, those collections stop working correctly:

```java
@Override
public int hashCode() {
    return Objects.hash(email);  // same field you used in equals()
}
```

In practice, IntelliJ generates both automatically: `Code → Generate → equals() and hashCode()`.

---

## Records (Java 16+) — immutable data classes

When you have a class that only carries data — no business logic, just fields and their getters — you end up writing a lot of repetitive code: constructor, `toString`, `equals`, `hashCode`, and one getter per field. Java 16 introduced records to eliminate all that boilerplate.

Before (regular class):

```java
public class EmployeeDTO {
    private final String name;
    private final String email;

    public EmployeeDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }

    @Override public boolean equals(Object o) { ... }
    @Override public int hashCode() { ... }
    @Override public String toString() { ... }
}
```

Now (record):

```java
public record EmployeeDTO(String name, String email) {}

// Automatically creates everything above:
// - constructor: new EmployeeDTO("Victor", "v@e.com")
// - getters: name(), email()   ← no "get" prefix in records
// - equals(), hashCode(), toString()
```

Records are immutable — no setters. They are perfect for carrying data between layers in a web application (this pattern is called a DTO — Data Transfer Object).

> **Preview — Spring Boot:** The example below uses a `repository` and a `controller`, which are Spring Boot concepts you haven't studied yet. Read it to see how records fit into a real project — you'll build this in the Spring Boot notes.

```java
// Classic DTO pattern in Spring Boot
public record EmployeeDTO(String name, String email) {}

// In a controller:
public EmployeeDTO getEmployee(int id) {
    Employee emp = repository.findById(id);
    return new EmployeeDTO(emp.getName(), emp.getEmail());
}
```
