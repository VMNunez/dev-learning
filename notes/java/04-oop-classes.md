# OOP — Classes

> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## What is a class

A class is a blueprint for creating objects. An object is one instance of that class.

```java
// Blueprint
public class Employee {
    // Fields — the data the object holds
    private String name;
    private String email;
    private int age;

    // Constructor — runs when you create a new object
    public Employee(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters — read the private fields
    public String getName() { return name; }
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

Also used to call another constructor from within a constructor:

```java
public Employee(String name) {
    this(name, "unknown@email.com");   // calls the two-parameter constructor
}

public Employee(String name, String email) {
    this.name = name;
    this.email = email;
}
```

---

## Encapsulation

Fields are `private` — they can only be accessed through the class's own methods (getters/setters). This protects the data from being changed directly from outside:

```java
// Bad — field is public, anyone can set any value
emp.age = -500;  // nothing stops this

// Good — field is private, setter can validate
public void setAge(int age) {
    if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
    this.age = age;
}
```

---

## Static fields and methods

`static` members belong to the class, not to any individual object:

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

Multiple constructors with different parameters. Java picks the right one:

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

Override `toString()` to get a readable representation of the object. Java calls it automatically when you print an object:

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` and `hashCode()`

By default, `==` compares object references (memory addresses). Override `equals()` to compare by content:

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Employee other)) return false;
    return Objects.equals(this.email, other.email);
}

@Override
public int hashCode() {
    return Objects.hash(email);
}
```

Always override both together — collections like `HashMap` and `HashSet` use both.

---

## Records (Java 16+) — immutable data classes

A shorter way to write a class that only holds data. Java generates the constructor, getters, `equals`, `hashCode`, and `toString` automatically:

```java
public record Employee(String name, String email, int age) {}

// Creates:
// - constructor: new Employee("Victor", "v@e.com", 31)
// - getters: name(), email(), age()   ← no "get" prefix in records
// - equals(), hashCode(), toString()
```

Records are immutable — no setters. Use them for DTOs (Data Transfer Objects) in Spring Boot — objects that carry data between layers and should not change.

```java
// Classic DTO pattern in Spring Boot
public record EmployeeDTO(String name, String email) {}

// In a controller:
public EmployeeDTO getEmployee(int id) {
    Employee emp = repository.findById(id);
    return new EmployeeDTO(emp.getName(), emp.getEmail());
}
```
