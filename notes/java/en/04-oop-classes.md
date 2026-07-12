# OOP — Classes

> 📖 [Baeldung — A guide to Java classes and objects](https://www.baeldung.com/java-classes-objects) → read: "Creating a Class" and "Constructors"
> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## What is object-oriented programming

At the end of [03-methods.md](03-methods.md) you turned the `Calculator` into something with a field and a constructor — a small object that holds state *and* the methods that work on it. That is not a detail of one example; it is the whole idea this file is about.

**Object-oriented programming** (OOP) is a way of organising code by grouping data and the behaviour that acts on it into single units called **objects**. Instead of loose functions floating next to loose variables, you define **classes** that bundle both together.

Take an `Employee`. In a non-OOP style you might keep a `name` string here, an `email` string there, and separate functions `getName(name)`, `setEmail(...)` somewhere else — nothing tying them together. In OOP the `Employee` *is* one thing that carries its own data (`name`, `email`, `age`) **and** the methods that operate on that data (`getName()`, `setEmail()`, `isActive()`). The data and the behaviour live in the same box.

> **Why bundle them at all?** Because the methods that change a piece of data should sit next to that data, guarding it. If `age` and `setAge()` live together in one object, the object can refuse an invalid age (see *Encapsulation* below). Scatter them and nothing stops the outside world from setting `age = -500` directly. OOP is what makes an object able to *protect itself* — the recurring theme of this whole file.

Java is object-oriented almost 100% of the way through: nearly everything you write lives inside a class. You have already been doing it without naming it — every `main` method sat inside a class, and every `String` or `Integer` you touched was an object. This file finally looks at the class itself head-on.

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

The class is written once; the objects are stamped out from it as many times as you call `new`. Each object gets its **own** copy of the fields — change one and the others are untouched:

```
        class Employee            <- the mould (one definition, written once)
        ┌──────────────────┐
        │ name  : String   │
        │ email : String   │
        │ age   : int      │
        └──────────────────┘
                 │  new Employee(...)  new Employee(...)
                 ▼                 ▼
   emp1 ┌──────────────────┐   emp2 ┌──────────────────┐
        │ name  = "Victor" │        │ name  = "Ana"    │   <- separate objects (instances),
        │ email = "v@e.com"│        │ email = "a@e.com"│      each with its own field values
        │ age   = 31       │        │ age   = 28       │
        └──────────────────┘        └──────────────────┘
```

> **Blueprint is literal.** The class holds no data of its own — `name`/`email`/`age` are just *slots* the mould promises every object will have. The actual values only exist once you `new` an object. Think of the class as an architect's plan and each object as a house built from it: the plan says "there is a front door here", each house has its own actual door.

---

## `this`

Look at the constructor in *What is a class*: the parameter is called `name` and the field is also called `name`. So what does a bare `name = name` mean? Java resolves any name to the *closest* one in scope, and the parameter is closer than the field — so `name` alone always means the parameter, and `name = name` just assigns the parameter to itself, leaving the field untouched. You need a way to say "the field, not the parameter". That word is `this`.

`this` is a reference to the current object — the specific instance whose constructor or method is running right now. Prefixing a field with `this.` reaches past the parameter and points at the object's own slot:

```java
public Employee(String name) {
    this.name = name;   // this.name = the field on this object; name = the parameter
}
```

> **Why keep the same name at all — why not just call the parameter `n`?** You could, but naming the parameter after the field it fills is the standard convention in Java: it documents which field the value is going into, and `this.` removes the only downside (the ambiguity). Reading `this.email = email` tells you at a glance "the incoming email becomes this object's email".

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

Whenever you see `this(...)` inside a constructor, it means "call another constructor of this same class with these arguments." The call to `this()` must always be the **first line** of the constructor.

> **Why must `this()` be the first line?** A constructor's one job is to bring the object from raw, uninitialised memory to a fully valid state. If you could run some statements *before* delegating, you would be touching fields on a half-built object — and then the delegated constructor would run and overwrite that work, silently throwing away whatever you did. Java removes the whole hazard by rule: the delegation happens first, on the still-blank object, and only then do the current constructor's own lines run on top of a properly initialised object. Break the rule and the compiler stops you outright: `call to this must be first statement in constructor`.

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

"Belongs to the class, not to any object" is not just a slogan — it is a fact about *where the value physically lives in memory*. A normal (non-static) field gets **one slot per object**: create three `Employee`s and there are three separate `name` slots, one inside each object, as the diagram in *What is a class* showed. A `static` field is different — Java allocates **exactly one slot**, attached to the class itself, and every object shares that same slot:

```
   static int count  ──►  ┌─────────┐   one shared slot, owned by the class
                          │   3     │   (all instances read/write the SAME box)
                          └─────────┘
                             ▲  ▲  ▲
                             │  │  │
        emp1 ────────────────┘  │  └──────────────── emp3
        (name="Victor")     emp2 (name="Ana")   (name="Leo")
        each has its OWN name slot, but they all point at the ONE count
```

This is exactly why the counter works: because there is only one `count` box in the whole program, every constructor that does `count++` is incrementing the *same* box. If each object had its own `count`, every one would sit at `1` and the total would be lost. A `static` method works the same way — there is one copy of the method attached to the class, and since it isn't tied to any object it cannot read per-object fields (there is no "this object" for it to look inside).

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

Constructor overloading is the same concept as method overloading (covered in [03-methods.md](03-methods.md) — several methods sharing a name, told apart by their parameter list): you can define multiple constructors in the same class, each with different parameters. Java picks the right one based on the arguments you pass with `new`. It is useful when you want to allow different ways to create an object — with all the data, with only the required fields, or with defaults for optional ones:

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

> **What is `other`, and why does it appear out of nowhere?** The parameter arrives typed as `Object` (that is the signature Java forces on `equals`), so you cannot read `obj.email` — the `Object` type has no `email`. You need it seen as an `Employee`. `obj instanceof Employee other` does two jobs in one line: it checks whether `obj` really is an `Employee`, and *if so* it declares a new variable `other` already cast to `Employee`, so the next line can safely read `other.email`. This "declare the cast variable inline" form is **pattern matching for `instanceof`**, added in Java 16. Before it, you wrote the check and the cast as two separate steps:
>
> ```java
> if (!(obj instanceof Employee)) return false;
> Employee other = (Employee) obj;   // the old two-step way — check, then cast by hand
> ```
>
> Both do the same thing; the Java 16 form just folds the cast into the check so you never repeat the type.

> **What is `Objects`?** `Objects` (from `java.util`) is a small utility class of static helpers for exactly this kind of code. `Objects.equals(a, b)` compares two values but survives `null` — if both are `null` it returns `true`, and it never throws a `NullPointerException` the way `a.equals(b)` would when `a` is `null`. `Objects.hash(...)` takes any number of fields and combines them into one `int` hash. You use them so you don't have to write the null-checks and the hash-mixing arithmetic by hand.

`hashCode()` always goes together with `equals()` — collections like `HashMap` and `HashSet` use both to organise objects. The rule is simple: if two objects are equal according to `equals()`, they must have the same `hashCode()`. If you override one without the other, those collections stop working correctly:

```java
@Override
public int hashCode() {
    return Objects.hash(email);  // same field you used in equals()
}
```

> **Why does a `HashMap` even need `hashCode()`?** A `HashMap` does not scan every key one by one when you look something up — that would be slow. Instead it keeps an array of "buckets", and it uses the key's `hashCode()` as an address: roughly `bucketIndex = hashCode % numberOfBuckets`. To store or find a key it jumps straight to that one bucket instead of searching the whole map. Only *inside* that bucket does it fall back on `equals()` to tell apart keys that happened to land together. Now the rule makes sense mechanically: if two equal objects returned *different* hash codes, they would be sent to *different* buckets — you would store an entry under one address and later look for it at another, and the map would swear the key isn't there even though an equal one is. That is why equal objects must share a `hashCode()`: it is what guarantees they land in the same bucket where `equals()` can then match them.

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

---

You can now model a single thing as a class: its data (fields), how it is built (constructors), what it can do (methods), and how it protects itself (encapsulation). But every class so far has stood alone. Real systems have *families* of related things — an `Employee` and a `Manager` that share most behaviour, or a dozen unrelated classes that must all promise they can `print()`. Making classes share behaviour, or agree on a common contract, is the next step. That is what [05-interfaces-abstract.md](05-interfaces-abstract.md) is about: interfaces (a contract a class signs) and abstract classes (a half-built parent others complete).
