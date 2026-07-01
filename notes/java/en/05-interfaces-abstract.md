# Interfaces and Abstract Classes

> 📖 [Oracle Docs — Interfaces and inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/index.html)
> 📖 [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) — how `UserDetailsService` fits into the full login flow

## Interface

Imagine you want to write a method that can print anything — an employee, an order, a report. You do not know what type of object will arrive, but you do know it needs to have a `print()` method. Interfaces solve exactly this problem.

An interface defines a **contract**: a list of methods that any implementing class is required to have. The interface does not say how those methods are implemented — it only demands that they exist. Think of it as a written promise: "any class that signs this contract guarantees it has these methods."

```java
public interface Printable {
    void print();        // no body — just the method signature
    String getSummary(); // any class that implements Printable MUST have both of these
}
```

When a class implements an interface with `implements`, it **must** provide every method declared in it — no exceptions. You cannot implement the interface and leave a method unwritten: the compiler gives you an error. The only exception is `default` methods (see below), which already have their own implementation and are optional to override.

A class that implements the interface must provide all the methods:

```java
public class Employee implements Printable {
    private String name;

    @Override
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override
    public String getSummary() {
        return "Name: " + name;
    }
}
```

> **About implicitly abstract methods:** every method you declare in an interface without a body is implicitly `abstract` — Java adds the keyword behind the scenes. That is why every class that implements the interface must define all its methods. You never write `abstract` explicitly in an interface, but it is always there. The only exception is `default` methods, which already have a body and are optional.

### A class can implement multiple interfaces

```java
public class Employee implements Printable, Exportable, Auditable {
    // must implement ALL methods from all three interfaces — no exceptions
    // (except methods with a default implementation, which are optional to override)
}
```

### Default methods (Java 8+)

Before Java 8, interfaces could only have methods without implementation. Java 8 introduced `default` methods: methods with an implementation inside the interface that classes are **not required to override**. If the class does not override it, it inherits the interface's implementation. If it does override it, it uses its own.

This allows adding new methods to an interface without breaking all the classes that already implement it — if you add a `default` method, existing classes inherit it without needing any changes:

```java
public interface Printable {
    void print();

    default String getLabel() {
        return "Printable item";   // default implementation
    }
}
```

---

## Abstract class

Use an abstract class when several classes share the same *implementation* — not just the same contract. An interface says "you must have this method"; an abstract class says "here is part of the implementation, fill in the rest." You cannot create an instance of an abstract class directly — it only exists to be extended.

An abstract class is essentially a parent class that groups fields and methods shared by all its subclasses — that is inheritance. The key is the `abstract` keyword in front of a method: it means that method **has no body in the parent class**. The abstract class only declares that the method exists, without implementing it. Each subclass must write its own version. Think of it as an internal contract: "I give you `breathe()` already implemented, but you must implement `makeSound()` because only each animal knows what its own sound is."

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Concrete method — already implemented; all subclasses inherit it
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Abstract method — no body; subclasses MUST implement this
    public abstract void makeSound();
}
```

A subclass that extends an abstract class must implement all abstract methods. Concrete methods — the ones that already have a body in the abstract class — are inherited automatically without doing anything. The keyword difference: `extends` to extend a class (abstract or not), `implements` to implement an interface.

```java
public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // calls the parent constructor
    }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof!");
    }
}

Dog dog = new Dog("Rex");
dog.breathe();      // "Rex is breathing"  — from Animal
dog.makeSound();    // "Rex says: Woof!"   — from Dog
```

> **`super(name)`** calls the parent class's constructor. When you create a `Dog` object, Java needs to initialise the `Animal` part first — its fields and constructor. `super(...)` does exactly that: it runs the parent constructor with the arguments you pass. It must always be the first line of the subclass constructor.

> **About types in Java:** when you write `Dog dog = new Dog("Rex")`, `Dog` is the type because you defined the class `Dog`. In Java, any class you define becomes a valid type — there is no inference or compiler magic. It is exactly the same as `String name = "Rex"` or `int count = 5`, just using your own class as the type instead of a primitive or a standard library type.

A class can only extend **one** abstract class. This is the key difference with interfaces.

---

## Interface vs Abstract class

The decision comes down to one question: are you defining a *capability* a class can have, or a *base type* that classes derive from? Use an interface when unrelated classes need to share a contract (`Printable` can be implemented by `Employee`, `Invoice`, or `Report` — they have nothing else in common). Use an abstract class when a group of related classes share actual implementation code that would otherwise be duplicated.

Yes: a class can extend an abstract class and implement multiple interfaces at the same time. The order in the code is fixed — `extends` first, then `implements`:

```java
public class Dog extends Animal implements Printable, Auditable {
    // inherits breathe() from Animal
    // must implement makeSound() (abstract method from Animal)
    // must implement the methods from Printable and Auditable
}
```

| | Interface | Abstract class |
|---|-----------|----------------|
| Methods | Abstract by default; can have `default` | Can have both abstract and concrete |
| Fields | Only `public static final` constants | Can have any fields |
| Multiple? | A class can implement many | A class can only extend one |
| Constructor | No | Yes |
| When to use | Define a capability a class can have | Define a base type with shared logic |

**Interface:** "This class can do X" — `Printable`, `Exportable`, `Comparable`
**Abstract class:** "This class IS a type of X" — `Animal`, `Shape`, `BaseService`

---

## Can a subclass add its own constructor?

Yes, and it is the most common pattern. When a subclass defines its own constructor, it can add its own fields on top of the parent's. The only rule is that `super(...)` must be the first line, so the parent is fully initialised before adding anything of its own:

```java
public class Dog extends Animal {
    private String breed;   // Dog's own field — does not exist in Animal

    public Dog(String name, String breed) {
        super(name);        // initialise the parent first
        this.breed = breed; // then your own fields
    }
}
```

---

## Functional interfaces (Java 8+)

Before Java 8, passing behaviour to a method meant creating a whole class just to hold one line of logic. Functional interfaces make that possible without the boilerplate: any interface with exactly **one** abstract method can be implemented by a lambda instead of a class. The single method is what Java targets when you write the lambda — it knows which method to call because there is only one.

> Lambdas are not covered in detail yet — they are explained in [09-streams-lambdas.md](09-streams-lambdas.md). For now, think of them as compact anonymous functions: a way to write the implementation of a single method without creating a whole class.

> The `@FunctionalInterface` annotation is optional, but use it: the compiler will give you an error if you accidentally add a second abstract method and break the contract.

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}
```

A lambda is an anonymous function written inline. The basic syntax is `parameter -> expression`: what is on the left of the arrow is the input parameter, and what is on the right is what gets returned. So `value -> value.contains("@")` is equivalent to writing a class that implements `Validator` with a body that does `return value.contains("@");`. Java knows which method it targets because the interface only has one:

```java
// Used with a lambda
Validator emailValidator = value -> value.contains("@");
emailValidator.validate("test@email.com");   // true
```

The most common built-in functional interfaces already come with Java — you do not define them, you just use them. They are generic contracts for the four patterns that repeat everywhere with streams and lambdas:

| Interface | Method | Used for |
|-----------|--------|---------|
| `Predicate<T>` | `boolean test(T t)` | filtering — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)` | transforming — `list.stream().map(e -> e.getName())` |
| `Consumer<T>` | `void accept(T t)` | consuming — `list.forEach(e -> save(e))` |
| `Supplier<T>` | `T get()` | producing — `() -> new Employee()` |

The `T` and `R` are generics — they mean "any type". `Predicate<Employee>` is a predicate that takes an `Employee`; `Function<Employee, String>` is a function that takes an `Employee` and returns a `String`. Generics are explained in detail in [08-generics.md](08-generics.md).

Concrete examples without streams, to see how each one works on its own:

```java
// Predicate — returns true or false
Predicate<String> isLong = s -> s.length() > 10;
isLong.test("Hi");            // false
isLong.test("Hello, World!"); // true

// Function — transforms one value into another
Function<String, Integer> toLength = s -> s.length();
toLength.apply("Hi");  // 2

// Consumer — receives a value and does something with it (returns nothing)
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hi");  // prints "Hi"

// Supplier — receives nothing and produces a value
Supplier<String> greeting = () -> "Hello";
greeting.get();  // "Hello"
```

You will use these every time you work with streams and lambdas.

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses Spring Boot and Spring Security classes (`JpaRepository`, `UserDetailsService`, `UserDetails`, `@Service`) that you haven't studied yet. Read it to see how interfaces work in a real project. You'll implement all of this in the Spring Boot notes — come back then for full understanding.

Spring Boot uses interfaces extensively. There are two main patterns: interfaces you define (and Spring generates the implementation), and Spring interfaces you implement (and Spring calls your code).

```java
// JpaRepository is a Spring Data interface — Spring generates the implementation automatically
// It gives you save(), findById(), findAll(), delete() and more without writing any SQL
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
}

// UserDetailsService is a Spring Security interface — you implement it
// to tell Spring how to find a user in YOUR database
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) { ... }
}
```

> **Why does `EmployeeRepository` use `extends` instead of `implements`?** Because in Java, interfaces do not implement other interfaces — they *extend* them. `extends` between interfaces means interface inheritance: `EmployeeRepository` inherits all the method signatures from `JpaRepository`. Only classes use `implements`.

When you write `extends JpaRepository` or `implements UserDetailsService`, you are following the interface contract that Spring Boot expects. `JpaRepository` gives you database operations without writing SQL. `UserDetailsService` gives Spring Security a way to find a user by their login identifier — without this, Spring Security has no way to reach your database.

### Why `UserDetailsService` exists — the plug and socket

Spring Security needs to load a user when a request comes in. But Spring Security has no idea about your database — it does not know you have a `User` entity or a `UserRepository`.

So Spring Security defines an interface with one method. This interface is part of the `spring-security-core` dependency you added in `pom.xml` — you do not write it:

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

This is the **socket**: Spring Security knows how to call this method when a login request arrives, but it does not provide the implementation because it does not know your database. The socket defines the shape of the plug; you build the plug.

Your job is to build the **plug** — a class that implements this interface and connects Spring Security to your database:

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
```

`UserRepository` is your own JPA repository (the one that extends `JpaRepository`). When you call `userRepository.findByEmail(username)`, Spring Data automatically generates the SQL `SELECT * FROM users WHERE email = ?` from the method name. Spring Security knows nothing about this — it only calls `loadUserByUsername()` on your class and receives the result.

When Spring Security needs a user, it calls `loadUserByUsername` on your implementation — and your code goes to the database to find it.

> `username` in Spring Security means the login identifier. In TimeTrack that is the email — not a separate username field. The parameter name is fixed by the interface; what it actually contains depends on your app.
