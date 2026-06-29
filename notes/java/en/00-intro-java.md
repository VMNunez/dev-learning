# Introduction to Java

Docs: [Baeldung — Introduction to Java](https://www.baeldung.com/java-tutorial) → read the "What is Java?" and "How Java Works" sections

---

## How Java works — source code to running program

Most languages are either **compiled** (translated to machine code before running) or **interpreted** (read and executed line by line at runtime). Java is both, and that is what makes it special.

When you write Java code, two things happen:

1. **Compile time** — the Java compiler (`javac`) reads your `.java` files and translates them to **bytecode** (`.class` files). Bytecode is not machine code — it is a platform-neutral instruction set that no processor understands directly. This step happens before the program ever runs. The compiler catches syntax errors and type mismatches here.

2. **Runtime** — the **JVM** (Java Virtual Machine) reads the bytecode and executes it. The JVM is what actually runs your program. Because the JVM exists for every operating system (Windows, Linux, Mac), the same bytecode runs everywhere without recompilation. This is the meaning of Java's old slogan: *"Write once, run anywhere."*

```
YourCode.java  →  [javac compiler]  →  YourCode.class  →  [JVM]  →  running program
  source code        compile time         bytecode            runtime
```

> **Why does this matter for Spring Boot?** When you run `mvn spring-boot:run` or click the green button in IntelliJ, Maven compiles your code and the JVM starts your application. When you see a `NullPointerException` in the logs, that is a **runtime error** — the compiler missed it because it only happened with specific data at runtime.

---

## Static typing — types are fixed at compile time

Java is **statically typed**: every variable has a fixed type that you declare when you create it, and that type never changes. The compiler checks every type assignment before the program runs.

```java
String name = "Victor";  // type is String — always, forever
name = 42;               // compile error — you cannot assign an int to a String
```

This is the first big contrast with JavaScript, where variables can change type at any point:

```javascript
let name = "Victor";  // string
name = 42;            // fine in JS — type changed to number at runtime
```

Static typing feels stricter, but it catches an entire class of bugs before the program ever runs. In a Spring Boot codebase with hundreds of classes, the compiler is your first line of defence.

> **`var` does not break static typing.** With `var name = "Victor"`, Java still fixes the type as `String` at compile time — it just infers it from the right side so you do not have to write it. The type cannot change later. See [01-variables-types.md](01-variables-types.md).

---

## Everything is a class — the minimum unit of Java code

In JavaScript you can write standalone functions and variables anywhere. In Java, **every piece of code must live inside a class**. There are no free-floating functions.

```java
// This is illegal in Java — there is no standalone function
public void greet() {
    System.out.println("Hello");
}

// This is the correct form — the method lives inside a class
public class Greeter {
    public void greet() {
        System.out.println("Hello");
    }
}
```

This is not a quirk — it is a deliberate consequence of Java being an object-oriented language (see OOP section below). Every Spring Boot component (`@Service`, `@Controller`, `@Repository`) is a class. When Spring starts your application, it creates objects from those classes and manages them for you.

---

## The entry point — `public static void main(String[] args)`

Every Java program starts from one specific method. The JVM looks for this exact signature when it starts:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```

Each keyword has a reason:

| Keyword | Why it is there |
|---------|----------------|
| `public` | The JVM must be able to call it from outside the class |
| `static` | The JVM calls it without creating an object first — the class is just loaded |
| `void` | The entry point does not return anything to the JVM |
| `main` | The name the JVM looks for by convention |
| `String[] args` | Command-line arguments passed when starting the program |

> **In Spring Boot you never write `main` yourself.** Spring Initializr generates one `Application.java` with a `main` that calls `SpringApplication.run()`. That one line starts the whole framework — it bootstraps the application context, discovers all your beans, and starts the embedded server. You will not touch `main` again after that.

---

## Object-oriented programming — why Java is built this way

Java is an **object-oriented language** (OOP). That is not just a label — it shapes how every line of code is structured. Understanding OOP is not optional in Java; it is the mental model the entire language is built on.

### The core idea — objects have state and behaviour

An object combines two things: **data** (called fields or state) and **actions** (called methods or behaviour). In the real world, a car has state (colour, speed, fuel level) and behaviour (accelerate, brake, refuel). In Java:

```java
public class Car {
    // state — data this object holds
    private String colour;
    private int speed;

    // behaviour — actions this object can perform
    public void accelerate(int amount) {
        this.speed += amount;
    }

    public int getSpeed() {
        return this.speed;
    }
}
```

The class is the blueprint. An object is one specific instance created from that blueprint:

```java
Car myCar = new Car();    // creates one object from the Car blueprint
Car yourCar = new Car();  // creates a different object — same blueprint, different data
```

### The four pillars

Java's OOP is built on four principles. You do not need to master them now — just know what each word means when you encounter it.

**Encapsulation** — hide internal details; expose only what the outside needs. Fields are `private`; you access them through methods (`getSpeed()`, not `car.speed` directly). This is why Spring Boot services have `private` fields and `public` methods.

**Inheritance** — a class can extend another class and reuse its code. `Dog extends Animal` — Dog gets everything Animal has, plus its own additions. In Spring Boot you see this in custom exceptions (`extends RuntimeException`) and Spring Security (`extends WebSecurityConfigurerAdapter`).

**Polymorphism** — one interface, many implementations. You can treat a `Dog` as an `Animal` and call `.makeSound()` — the JVM decides at runtime which version to run. This is the mechanism behind Spring's dependency injection: you inject an interface, and Spring decides which implementation to use.

**Abstraction** — expose what a thing does, hide how it does it. `JpaRepository.save(entity)` saves to the database — you do not need to know about the SQL it generates. The interface is the abstraction; the implementation is hidden.

> **In TimeTrack:** your `ProjectService` class is encapsulation in action — the controller calls `projectService.findAll()` without knowing anything about the repository or the database query underneath. Each Spring Boot layer abstracts the one below it.

Docs: [Baeldung — OOP Concepts in Java](https://www.baeldung.com/java-oop) → read: "What is OOP", "Encapsulation", "Inheritance", "Polymorphism"

---

## Java vs JavaScript — the mental model shift

Since you come from JavaScript, these are the things that will trip you up most:

| Concept | JavaScript | Java |
|---------|-----------|------|
| Types | Dynamic — variables can change type | Static — type is fixed at compile time |
| Code structure | Functions can exist anywhere | All code lives inside a class |
| Classes | Optional pattern | Mandatory — the basic unit |
| `null` errors | `undefined is not a function` at runtime | `NullPointerException` at runtime |
| Entry point | Node runs the file top to bottom | JVM calls `main()` |
| Compilation | Not needed (interpreted) | Required before running |

The biggest shift: **in JavaScript, functions are first-class citizens**. In Java, **classes are the first-class citizens**. Everything else flows from that difference.
