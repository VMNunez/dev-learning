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

An abstract class is a **partial implementation** — it can have both concrete methods (with body) and abstract methods (without body). It cannot be instantiated directly.

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Concrete method — already implemented
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Abstract method — subclasses MUST implement this
    public abstract void makeSound();
}
```

A subclass that extends an abstract class must implement all abstract methods:

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

A class can only extend **one** abstract class. This is the key difference with interfaces.

---

## Interface vs Abstract class

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

## Functional interfaces (Java 8+)

An interface with exactly **one** abstract method. Used with lambdas:

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}

// Used with a lambda
Validator emailValidator = value -> value.contains("@");
emailValidator.validate("test@email.com");   // true
```

The most common built-in functional interfaces:

| Interface | Method | Used for |
|-----------|--------|---------|
| `Predicate<T>` | `boolean test(T t)` | filtering — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)` | transforming — `list.stream().map(e -> e.getName())` |
| `Consumer<T>` | `void accept(T t)` | consuming — `list.forEach(e -> save(e))` |
| `Supplier<T>` | `T get()` | producing — `() -> new Employee()` |

You will use these every time you work with streams and lambdas.

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses Spring Boot and Spring Security classes (`JpaRepository`, `UserDetailsService`, `UserDetails`, `@Service`) that you haven't studied yet. Read it to see how interfaces work in a real project. You'll implement all of this in the Spring Boot notes — come back then for full understanding.

Spring Boot uses interfaces extensively:

```java
// JpaRepository is an interface — Spring generates the implementation
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
}

// UserDetailsService is an interface — you implement it for authentication
public class UserDetailsServiceImpl implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) { ... }
}
```

When you write `implements JpaRepository` or `implements UserDetailsService`, you are following the interface contract that Spring Boot expects.

### Why `UserDetailsService` exists — the plug and socket

Spring Security needs to load a user when a request comes in. But Spring Security has no idea about your database — it does not know you have a `User` entity or a `UserRepository`.

So Spring Security defines an interface with one method:

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

This is the **socket**. Spring Security knows how to call it, but it does not provide the implementation.

Your job is to build the **plug** — a class that implements this interface and connects it to your database:

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

When Spring Security needs a user, it calls `loadUserByUsername` on your implementation — and your code goes to the database to find it.

> `username` in Spring Security means the login identifier. In TimeTrack that is the email — not a separate username field. The parameter name is fixed by the interface; what it actually contains depends on your app.
