# Inheritance and Polymorphism

> 📖 [Baeldung — Guide to Java inheritance](https://www.baeldung.com/java-inheritance) → read: "Types of Inheritance" and "Polymorphism"
> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

In [05-interfaces-abstract.md](05-interfaces-abstract.md) you saw how classes can share a *contract*: an interface lists the methods a class promises to have, and an abstract class can even provide a half-built parent for others to finish. But a contract only says *what* methods must exist — it does not hand a subclass ready-to-run behaviour it can use as-is. This file is about the other half: how a subclass **inherits real, working behaviour** from a parent and reuses it without rewriting a line.

You reach for inheritance when two or more classes are the same *kind* of thing and share most of their behaviour, but differ in a few specific methods. Without it, you'd write the same `eat()`, `breathe()`, and `sleep()` methods in every animal class — and when you need to change one, you'd update every copy separately. Inheritance lets you write shared behaviour once in a **parent class**, and every **subclass** gets it automatically.

## Inheritance — `extends`

A subclass inherits all `public` and `protected` fields and methods from the parent class and can also add its own. `private` fields from the parent technically live inside the subclass object — they occupy memory — but the subclass cannot access them directly: only through the getters and setters the parent exposes. `protected` is the modifier you choose precisely when you want subclasses to read the field directly without a getter — which is why you see `protected` fields in parent classes in inheritance examples. The parent class does not have to be abstract: if it makes sense to create instances of it directly (`new Animal()`), leave it as a regular class. You declare it abstract only when it makes no sense to instantiate it directly — when `Animal` is too generic and no concrete object should be "just an Animal" without being a more specific type. In TimeTrack it makes sense to create `new User()` directly — a user is a concrete object with real data. In contrast, a `BaseEntity` class holding only `id`, `createdAt`, and `updatedAt` should be abstract: you would never create `new BaseEntity()` because no object in the system is "just a base entity" — it is always a `User`, a `Project`, or something similar:

```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }
}

public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name);    // call the parent constructor — MUST be the first line
        this.breed = breed;
    }

    public void fetch() {
        System.out.println(name + " is fetching");  // name inherited from Animal
    }
}

Dog dog = new Dog("Rex", "Labrador");
dog.eat();     // inherited from Animal
dog.fetch();   // defined in Dog
```

Every class in this file lives somewhere in a single tree. `Animal` is the shared parent; `Dog` and `Cat` branch off it; and — as you will see at the end of the file — everything ultimately descends from one root class called `Object`. Keeping this shape in mind makes the rest of the file click:

```
            Object          ← the root every class extends automatically
              │
            Animal          ← parent: defines eat(), speak()
            ╱     ╲
         Dog       Cat      ← subclasses: inherit + override
```

> **Why does `Object` sit above `Animal` when you never wrote `extends Object`?** Because Java inserts it for you. Any class that does not explicitly extend something extends `Object` silently, so the tree always has a single root. The last section of this file is entirely about what that gives you.

Java only allows **single inheritance** — a class can extend only one class. This is different from TypeScript where you can compose types with intersections.

> **Why single inheritance?** A class having two parents creates the "diamond problem": if both parents define `save()`, which one does the subclass get? Java sidesteps the ambiguity entirely by allowing only one parent. When you genuinely need behaviour from several sources, you implement multiple *interfaces* (05) instead — a class can sign many contracts even though it can extend only one class.

---

## `super`

You already met `super()` as a constructor call in [05-interfaces-abstract.md](05-interfaces-abstract.md) — the same rule applies here, so this is a reminder rather than a new concept. When a subclass has its own constructor, it usually needs the parent to initialize its own fields first. `super()` triggers that initialization — and it must be the first line:

```java
// super() — call parent constructor
public Dog(String name, String breed) {
    super(name);   // must be the first line in the constructor
    this.breed = breed;
}

// super.method() — call parent method
@Override
public void eat() {
    super.eat();                          // run the parent version first
    System.out.println("...and more!");   // then add extra behaviour
}
```

In practice, `super.method()` appears when you want to extend the parent's behaviour, not replace it entirely. The most common Spring Boot case is when you extend a configuration class: you call `super.configure(...)` so the parent applies its base configuration, then you add your own rules on top. You also see this pattern at the end of this file: `super("Employee not found: " + id)` in the `EmployeeNotFoundException` constructor calls the `RuntimeException` constructor to initialise the standard error message — you only add the custom part. When you want to replace behaviour completely, you override without calling `super` — that is the most common case in business logic.

> **Why must `super()` be the very first line?** Because a subclass object is built parent-first: the parent's fields have to exist and be initialised before the subclass can safely touch anything. Java enforces the order by refusing to compile if `super()` appears anywhere but line one. If you write no `super(...)` call at all, Java inserts a silent `super()` with no arguments — which is why a subclass compiles fine only when the parent has a no-argument constructor.

---

## Method overriding — `@Override`

The behaviour a subclass inherits from the parent is not always right for that specific type. Overriding lets you replace a parent method with a version tailored to the subclass, while keeping the same name — so any code that works with the parent type keeps working without changes. The method signature must match exactly:

```java
public class Animal {
    public String speak() {
        return "...";
    }
}

public class Dog extends Animal {
    @Override
    public String speak() {
        return "Woof!";
    }
}

public class Cat extends Animal {
    @Override
    public String speak() {
        return "Meow!";
    }
}
```

`@Override` is optional but always recommended — it tells the compiler to verify that you are actually overriding a parent method, not accidentally creating a new one.

### Overriding vs Overloading

**Overriding** is what you just saw: a subclass replaces a parent method with the same name and the exact same signature. What Java decides at runtime is not the type of the variable but the real type of the object in memory: if you store a `Dog` in an `Animal` variable, Java runs `Dog`'s version, not `Animal`'s. **Overloading** (covered in [03-methods.md](03-methods.md)) is different: multiple methods with the same name in the same class, each with different parameters — different number or different types. Java resolves overloading at compile time by looking at the arguments you pass. Both reuse the same method name, but they are entirely separate concepts.

> **Read the `Runtime` row through the mechanism above.** "Decided at runtime" means overriding is resolved by the object's method table — the JVM only knows which `speak()` to run once it can see the real object. "Decided at compile time" means overloading is resolved by the compiler from the argument types you wrote, before the program ever runs: `calculate(2)` versus `calculate(2.0)` is settled while compiling, with no object involved. That is the deep difference — one waits for the object, the other never needs it.

The "Inheritance" row in the table indicates whether the concept requires a class hierarchy: overriding does — without a subclass extending another, there is nothing to override; overloading does not require inheritance — you can define `calculate(int x)` and `calculate(double x)` in the same class without extending anything.

| | Overriding | Overloading |
|---|-----------|-------------|
| Where | Subclass | Same class |
| Signature | Must match exactly | Different number of parameters or different types |
| Inheritance | Yes (requires subclass) | No |
| Runtime | Decided at runtime | Decided at compile time |

---

## Polymorphism

The problem polymorphism solves: you have a list of related but different types — `Dog`, `Cat`, and `Bird`, all subclasses of `Animal` — and you need to call the same method on all of them. Without polymorphism you'd write an `if` check for every type — and every time you add a new type, you modify that `if`. With polymorphism, you declare all of them as `Animal` and call `speak()` once: Java picks the right version for each object automatically.

The key is that the type of the **variable** and the type of the **object** can be different:

```java
Animal a = new Dog("Rex", "Labrador");  // variable: Animal  /  actual object: Dog
```

When you call `a.speak()`, Java does not look at the variable type (`Animal`) — it looks at the actual type of the object in memory (`Dog`) and runs `Dog`'s version of `speak()`. This is called **dynamic dispatch**: the decision of which method to run happens at runtime, not at compile time.

But how does Java *know*, at runtime, which version to run? The variable `a` is just a reference — it says nothing about whether the real object is a `Dog` or a `Cat`. The mechanism is a hidden lookup table. When the JVM loads a class, it builds one **method table** for that class (often called a *vtable*, for "virtual method table"): a list that maps each method name to the exact code that should run for that class. `Dog`'s table points `speak()` at `Dog`'s code; `Cat`'s table points `speak()` at `Cat`'s code. Every object you create carries a hidden pointer to its own class's table — a `Dog` object points at `Dog`'s table, a `Cat` object at `Cat`'s. So `a.speak()` compiles to: "follow the object's table pointer, look up `speak()` in that table, jump to whatever code it lists." The variable type is irrelevant at that moment — the object itself is holding the map.

> **Analogy — the object carries its own phone book.** Think of the method table as a small phone book each object keeps in its pocket. Calling `speak()` means "open your phone book, find the `speak` entry, dial that number." A `Dog` and a `Cat` both have a `speak` entry, but their phone books list different numbers — so the *same* call reaches different code. Java never has to guess the type; it just lets the object read from its own book.

> **Why this beats a big `if`.** The `if (a instanceof Dog)` version below has to be edited every time a new type appears. Dynamic dispatch never does, because the lookup is driven by the object's own table — add a `Bird` class with its own table and existing code calls `speak()` unchanged. The extensibility comes directly from *where* the decision lives: in the object, not in your calling code.

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — Dog's version
a2.speak();   // "Meow!" — Cat's version
```

You do not always have to declare the variable as the parent type. You use `Animal a = new Dog(...)` when you want to treat different types uniformly — that is where polymorphism pays off. If you need Dog-specific behaviour right away, declare it as `Dog dog = new Dog(...)`. The practical rule: use the most general type that still gives you what you need.

The case that makes it click is a list of mixed types. Without polymorphism you check every type manually — and the code breaks every time you add a new one:

```java
// Without polymorphism — fragile: every new type forces a change here
for (Animal a : animals) {
    if (a instanceof Dog) System.out.println("Woof!");
    else if (a instanceof Cat) System.out.println("Meow!");
    // adding Bird? come back here and add another else if
}

// With polymorphism — extensible: add Bird and this loop never changes
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

for (Animal a : animals) {
    System.out.println(a.speak());  // Dog → "Woof!", Cat → "Meow!" — no if needed
}
```

**In Spring Boot** this pattern is fundamental. Imagine you have several notification types — `EmailNotification`, `SmsNotification`, `PushNotification` — all implementing a `Notification` interface with a `send()` method. The service that uses them does not need to know which type each one is:

```java
public void notifyAll(List<Notification> notifications) {
    for (Notification n : notifications) {
        n.send();  // Email, SMS, or Push — Java picks the right version at runtime
    }
}
```

If you add `WhatsAppNotification` tomorrow, this service does not change a single line.

---

## `instanceof` and pattern matching

When working with polymorphism, you may at some point need to access a method that only exists in a concrete subclass — not in the parent. For example, you have an `Animal` variable that actually holds a `Dog`, and you need to call `fetch()`, which only `Dog` has.

If you try to call `animal.fetch()` directly, the compiler rejects it — `Animal` does not have that method. To call it, you need to **cast** — tell the compiler "treat this variable as a `Dog`". But if the object is not actually a `Dog`, the cast would throw a `ClassCastException` at runtime. `instanceof` exists precisely to avoid that error: it checks the real type before the cast.

```java
Animal animal = new Dog("Rex", "Labrador");  // variable type: Animal — actual object in memory: Dog

// Classic form (up to Java 15)
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // explicit cast — we already know it is safe
    dog.fetch();
}

// Pattern matching (Java 16+) — cleaner, casts automatically
if (animal instanceof Dog dog) {
    dog.fetch();   // dog is already available as Dog, no manual cast needed
}
```

> That said, if you find yourself using `instanceof` frequently, it is a signal that the design could improve — polymorphism is meant precisely to avoid these manual type checks.

---

## `final` classes, methods, and fields

`final` can apply to three different things, each with a different meaning:

- `final class` — the class cannot be extended: no subclass can inherit from it
- `final method` — the method cannot be overridden by any subclass
- `final field` — the field can only be assigned once; normally in the constructor or at declaration. After that, its value cannot change

```java
public final class String { ... }  // no class can inherit from String

public class Animal {
    public final void breathe() { ... }  // no subclass can override this
}

public class Circle {
    private final double radius;  // can only be assigned once

    public Circle(double radius) {
        this.radius = radius;  // the only allowed assignment
    }
}
```

> **Why is `final` here, in an inheritance file?** Because two of its three uses are about *stopping* inheritance: a `final class` slams the door on subclassing, and a `final method` slams the door on overriding. It is the deliberate opposite of everything above — you reach for it when a class or method must never be extended or replaced, usually for safety (`String` is `final` so nobody can subclass it and break the guarantees the whole language relies on). The `final field` meaning is unrelated to inheritance; it just shares the keyword.

In Spring Boot you will see `final` frequently on fields in service classes when dependencies are injected through the constructor — it is the recommended way to write beans.

---

## The Object class

There is one class at the very top of every inheritance hierarchy in Java: `Object`. All classes extend it automatically, even if you do not declare it. This means every object you create carries a set of methods inherited from `Object` — whether you defined them or not.

The three that appear most often in real projects are:

- **`toString()`** — called automatically when you print an object with `System.out.println(obj)` or concatenate it into a `String`. Without overriding it you get something like `com.victor.timetrack.model.User@1a2b3c` — the class name and a memory address, which tells you nothing useful. You override it to return something readable like `"User{name='Victor'}"`.
- **`equals()`** — compares whether two objects are "equal". Without overriding it, Java compares memory references: two different objects with the same data are not equal even if they represent the same entity. You override it when you want the comparison to be based on field values.
- **`hashCode()`** — used internally by `HashMap` and `HashSet` to organise objects in memory. The rule is: if you override `equals()`, you must always override `hashCode()` too — otherwise your objects will behave unexpectedly inside collections.

> **Why must `equals()` and `hashCode()` always change together?** A `HashMap` finds an object in two steps: it first uses `hashCode()` to jump to the right "bucket", then uses `equals()` to confirm the match inside that bucket. If two objects are `equals()` but return different hash codes, they land in *different* buckets — so the map looks in the wrong place and never finds the entry, even though your `equals()` says they match. Overriding one without the other quietly breaks lookups; that is why the rule is absolute, not a style preference.

Overriding all three is very common in real projects: `toString()` almost always, because it makes debugging much easier when printing objects; `equals()` and `hashCode()` together when objects are compared by value or used as keys in a `HashMap`. In Spring Boot, Lombok can generate all of them automatically with `@Data` or `@EqualsAndHashCode`, so you rarely write them by hand.

To see what overriding looks like in practice, think of a `User` class from TimeTrack. Without any `@Override`, printing a user or comparing two users with the same data does not behave the way you'd expect:

```java
User u1 = new User("Victor", "victor@example.com");
User u2 = new User("Victor", "victor@example.com");

System.out.println(u1);             // → "com.victor.timetrack.model.User@3a4b5c" — useless in logs
System.out.println(u1 == u2);       // → false — different references in memory
System.out.println(u1.equals(u2));  // → false — without override, equals also compares references
```

Overriding all three (IntelliJ generates this for you with `Alt+Insert`): IntelliJ writes all the code — the `@Override`, the method signature, and all the internal logic (`if (this == o)`, the `instanceof`, the cast, `Objects.equals()`, `Objects.hash()`). The only thing you do is choose which fields to include in the comparison or in the output text — in this case, `name` and `email`.

```java
public class User {
    private String name;
    private String email;

    // toString() — so that logs and debugging are readable
    @Override
    public String toString() {
        return "User{name='" + name + "', email='" + email + "'}";
    }

    // equals() — two Users are equal if they have the same email
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User other = (User) o;
        return Objects.equals(email, other.email);
    }

    // hashCode() — required whenever you override equals()
    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}
```

Now the behaviour is what you expect:

```java
System.out.println(u1);             // → "User{name='Victor', email='victor@example.com'}"
System.out.println(u1.equals(u2));  // → true — same email, same user
```

In real Spring Boot projects, JPA entities almost always have these three methods — or use Lombok's `@Data` to generate them automatically.

> **Because every class descends from `Object`, you can always store any object in an `Object` variable:** `Object obj = new User("Victor", "victor@example.com");` is valid, since `User` implicitly extends `Object`. This is the same upcasting you saw with `Animal a = new Dog(...)` — only now the parent is the universal root. It is exactly why methods like `equals(Object o)` take an `Object` parameter: any object at all can be passed in, and `instanceof` narrows it back to the real type inside.

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses `JpaRepository` and `RuntimeException` in a Spring Boot context. `JpaRepository` is explained in the Spring Boot notes. `RuntimeException` is a Java class covered in `08-exceptions.md` — if you haven't read that file yet, come back here after.

Inheritance appears constantly in Spring Boot:

```java
// Your repository extends JpaRepository — you inherit findById, findAll, save, delete, etc.
public interface EmployeeRepository extends JpaRepository<Employee, Long> {}

// RuntimeException is a superclass — you extend it to create custom exceptions
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found: " + id);
    }
}
```

---

You now have objects that share behaviour through a parent, override it where they differ, and are handled uniformly through polymorphism. The natural next need is a place to *keep many of them* — a list of `Animal`s, a set of unique `User`s, a map from id to `Project`. Holding groups of objects is what [07-collections.md](07-collections.md) is about, and it leans directly on what you just learned: a `List<Animal>` stores dogs and cats side by side precisely because polymorphism lets one variable type hold many object types.
