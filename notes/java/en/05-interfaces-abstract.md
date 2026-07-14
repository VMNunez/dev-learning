# Interfaces and Abstract Classes

> 📖 [Baeldung — Interfaces in Java](https://www.baeldung.com/java-interfaces) → read: "What Are Interfaces in Java?" and "Default Methods in Java 8"
> 📖 [Oracle Docs — Interfaces and inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/index.html)
> 📖 [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) — how `UserDetailsService` fits into the full login flow

In [04-oop-classes.md](04-oop-classes.md) you learned to model a single thing as a class: its data, its constructor, its methods, and how it protects itself. But every class there stood alone. The moment you have a *family* of related classes, or a group of unrelated classes that must all promise they can do the same thing, a lone class is not enough — you need a way for classes to **share a contract** or **share implementation**. That is exactly what this file is about: interfaces (a contract a class signs) and abstract classes (a half-built parent others complete).

## Interface

Imagine you want to write a method that can print anything — an employee, an order, a report. You do not know what type of object will arrive, but you do know it needs to have a `print()` method. Those three classes have nothing else in common, so they cannot share a parent — but they can all sign the same contract. Interfaces solve exactly this problem.

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

> **What if two interfaces declare the same default method?** If a class implements two interfaces that both provide a `default` method with the same signature, the compiler cannot decide which one wins — this is the classic *diamond problem*. Java refuses to compile it and forces you to resolve the ambiguity by overriding the method in your class. Inside your override you can pick one explicitly with `InterfaceName.super.methodName()`:
>
> ```java
> public interface A { default String hi() { return "from A"; } }
> public interface B { default String hi() { return "from B"; } }
>
> public class C implements A, B {
>     @Override
>     public String hi() {
>         return A.super.hi();   // you MUST override; pick which parent to call
>     }
> }
> ```
>
> This is why multiple interface implementation is safe where multiple class inheritance is not: with interfaces the collision is a compile error you are forced to fix, never a silent guess by the compiler.

---

## Abstract class

> **Forward reference — inheritance mechanics.** This section uses `extends`, `super(...)`, and the parent/subclass relationship (the Animal/Dog hierarchy) to show what an abstract class is *for*. The full mechanics of inheritance — how `extends` wires a subclass to its parent, how `super(...)` and `@Override` work under the hood, the `Object` class every class inherits from — are the topic of [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md). Here, just read `super(name)` as "run the parent constructor first" and `extends Animal` as "Dog is a kind of Animal"; you get the deep version next file.

Use an abstract class when several classes share the same *implementation* — not just the same contract. An interface says "you must have this method"; an abstract class says "here is part of the implementation, fill in the rest." You cannot create an instance of an abstract class directly — it only exists to be extended.

An abstract class is essentially a parent class that groups fields and methods shared by all its subclasses — that is inheritance. The key is the `abstract` keyword in front of a method: it means that method **has no body in the parent class**. The abstract class only declares that the method exists, without implementing it. Each subclass must write its own version. Think of it as an internal contract: "I give you `breathe()` already implemented, but you must implement `makeSound()` because only each animal knows what its own sound is." An `abstract` method can only be declared inside an abstract class — if you try to add `abstract` to a method in a regular class, the compiler gives you an error. The reverse is also true: if a class has even one `abstract` method, that class must be declared `abstract` too.

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

The shape of what you just built:

```
        Animal  (abstract — cannot be instantiated)
        ├── breathe()      concrete → inherited as-is
        └── makeSound()    abstract → each child MUST fill it in
              │
              ▼  extends
        Dog  (concrete — can be instantiated)
        ├── breathe()      inherited unchanged from Animal
        └── makeSound()    written here: "Woof!"
```

Read it top-down: the parent hands every child the finished `breathe()`, but leaves `makeSound()` as a hole each child is forced to fill. `Dog` fills the hole; a `Cat` would fill it with "Meow". That is the whole point of an abstract class — share the finished parts, force the rest.

> **`super(name)`** calls the parent class's constructor. When you create a `Dog` object, Java needs to initialise the `Animal` part first — its fields and constructor. `super(...)` does exactly that: it runs the parent constructor with the arguments you pass. It must always be the first line of the subclass constructor. After `super(...)`, the subclass constructor can add its own fields and initialisations — covered with an example in the "Subclass constructors" section below.

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

Read each row as *"here is where the two differ, and why the difference exists"* — the last row is the one that actually drives your decision (capability vs base type); the rows above it are the mechanical consequences of that choice.

> **Why can an interface only hold `public static final` constants?** Because an interface has no instances of its own — you never write `new Printable()`. Instance fields (`private String name`) only make sense on an object, since each object needs its own copy; an interface never produces an object, so it has nowhere to put per-object state. The only fields that survive without an instance are `static` (one shared copy, not per-object) and `final` (a fixed value, since there is no constructor to assign them later). Java makes every field you declare in an interface `public static final` automatically — a shared constant is the *only* kind of field that is meaningful when there is no instance. An abstract class is the opposite: it *does* participate in object creation (its constructor runs as part of building the subclass), so it can hold ordinary instance fields like `protected String name`.

**Interface:** "This class can do X" — `Printable`, `Exportable`, `Comparable`
**Abstract class:** "This class IS a type of X" — `Animal`, `Shape`, `BaseService`

---

## Subclass constructors

This expands the `super(name)` callout from the *Abstract class* section above, staying with the same `Animal`/`Dog` pair. It lives here rather than being repeated inline so the earlier section stays focused on *what* an abstract class is. The full inheritance mechanics — why `super(...)` must come first, what the parent constructor actually runs — belong to [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md); the point below is only that a subclass constructor can add its *own* fields on top of the parent's.

When a subclass defines its own constructor, it can add its own fields on top of the parent's. The only rule is that `super(...)` must be the first line, so the parent is fully initialised before adding anything of its own:

```java
public class Dog extends Animal {
    private String breed;   // Dog's own field — does not exist in Animal

    public Dog(String name, String breed) {
        super(name);        // initialise the parent first
        this.breed = breed; // then your own fields
    }
}

// When creating the object, you pass both constructors' arguments in one call
Dog dog = new Dog("Rex", "Labrador");
dog.breathe();  // "Rex is breathing"  — method inherited from Animal
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

A lambda is an anonymous function written inline. Before Java 8, to implement a functional interface you had to create a whole anonymous class. With lambdas, that collapses to a single line:

```java
// Without a lambda — an anonymous class that implements Validator
Validator emailValidator = new Validator() {
    @Override
    public boolean validate(String value) {
        return value.contains("@");
    }
};

// With a lambda — exactly the same in one line
Validator emailValidator = value -> value.contains("@");
```

The syntax is `parameter -> expression`: what is on the left of the arrow is the input parameter, and what is on the right is what gets returned. Java knows which method it targets because the interface only has one — in this case `validate(String value)`.

Once the lambda is assigned, `emailValidator` is of type `Validator`, so you can call any method the interface declares — in this case `validate()`:

```java
emailValidator.validate("test@email.com");   // true
emailValidator.validate("no-at-sign");        // false
```

The most common built-in functional interfaces already come with Java — you do not define them, you just use them. They are generic contracts for the four patterns that repeat everywhere with streams and lambdas:

| Interface | Method | Used for |
|-----------|--------|---------|
| `Predicate<T>` | `boolean test(T t)` | filtering — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)` | transforming — `list.stream().map(e -> e.getName())` |
| `Consumer<T>` | `void accept(T t)` | consuming — `list.forEach(e -> save(e))` |
| `Supplier<T>` | `T get()` | producing — `() -> new Employee()` |

Read the table by matching your task to the `Method` column: if your lambda takes a value and answers true/false you want `Predicate`; if it takes a value and returns a different one you want `Function`; if it takes a value and returns nothing you want `Consumer`; if it takes nothing and produces a value you want `Supplier`. The shape of the single method is what tells you which one to reach for.

The `T` and `R` are generics — they mean "any type". `Predicate<Employee>` is a predicate that takes an `Employee`; `Function<Employee, String>` is a function that takes an `Employee` and returns a `String`. Generics are explained in detail in [10-generics.md](10-generics.md).

Concrete examples without streams, to see how each one works on its own:

```java
// Predicate<String> — the generic type tells you what it receives: here it receives a String
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

This section exists because interfaces are the central mechanism of Spring Boot — not theory you use once and forget. Every time you access the database or configure security in TimeTrack, you are following interface contracts. There are two distinct patterns: in the first you define the interface and Spring generates the implementation; in the second Spring defines the interface and you write the implementation.

---

### Pattern 1 — You define the interface, Spring generates the implementation

JPA (Java Persistence API) is the Java standard for working with databases using objects instead of raw SQL. `JpaRepository` is a Spring Data JPA interface that, when you extend it, causes Spring to automatically generate all the database access code at startup.

```java
// projects/07-timetrack/src/main/java/com/timetrack/repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

`JpaRepository<User, Long>` tells Spring this repository works with the `User` entity and that its primary key is of type `Long`. From this interface you inherit `save()`, `findById()`, `findAll()`, `delete()` and more — without writing a single line of SQL.

`findByEmail` has no body: Spring Data reads the method name and generates the SQL `SELECT * FROM users WHERE email = ?` automatically. The convention is `findBy` followed by the exact field name in the entity — `findByEmail` searches by `email`, `findByName` would search by `name`, `findByEmailAndStatus` would generate `WHERE email = ? AND status = ?`. Spring Data parses the name and builds the query; if the field does not exist in the entity, the project fails to start.

> In Java, interfaces extend other interfaces with `extends`, never with `implements` — that keyword is only for classes. That is why `UserRepository extends JpaRepository` and not `implements JpaRepository`.

---

### Pattern 2 — Spring defines the interface, you write the implementation

`UserDetailsService` is a Spring Security interface — it comes in the `spring-security-core` dependency from `pom.xml`. You will not find it in your project files because it lives inside the Spring jar; you can open it in IntelliJ by Ctrl+clicking its name.

```java
// Defined by Spring Security — not in your project files
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

`throws UsernameNotFoundException` means the method can throw that exception if no user is found. Exceptions are explained in detail in [08-exceptions.md](08-exceptions.md) — for now read it as "this method can fail with this type of error."

Spring Security knows how to call `loadUserByUsername` when a login request arrives, but it cannot provide the implementation because it does not know your database. Your job is to write that implementation:

```java
// projects/07-timetrack/src/main/java/com/timetrack/security/UserDetailsServiceImpl.java
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

The name `UserDetailsServiceImpl` is a convention — the `Impl` suffix means "implementation." Spring does not look for it by name; it finds it because the class is annotated with `@Service` and implements `UserDetailsService`.

`findByEmail(username)` returns an `Optional<User>` — a container that may hold the user or be empty. `.orElseThrow()` opens it: if there is a user it returns it; if it is empty it throws the exception you pass. `Optional` is explained in [10-generics.md](10-generics.md).

---

### The full flow

When a login request arrives, Spring Security calls `loadUserByUsername(email)` on your `UserDetailsServiceImpl`. This calls `userRepository.findByEmail(email)`, which goes to the database. The result is returned to Spring Security, which verifies the password and decides whether the login is valid.

> `username` in Spring Security means the login identifier. In TimeTrack that is the email — not a separate username field. The parameter name is fixed by the interface; what it actually contains depends on your app.

---

You now have both tools for making classes relate: an **interface** is a contract unrelated classes sign, and an **abstract class** is a half-built parent that shares real implementation. But this file only *borrowed* the inheritance machinery — `extends`, `super(...)`, `@Override` — to make abstract classes work, without explaining how any of it functions. That is the next step: [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md) opens up the mechanism you kept using here — how a subclass really inherits fields and methods from its parent, how `super` and `@Override` behave, and how one method call can run different code depending on the object's real type (polymorphism).
