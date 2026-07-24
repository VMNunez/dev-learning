# Introduction to Java

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → read the "Java Language Basics" and "Java OOP" blocks — the two that match this file

---

You already know how to make a program run: you write JavaScript, you hand the file to Node, it runs. Nothing checks anything first. That works beautifully until the codebase grows — a typo in a property name, a function called with two arguments instead of three, an object that is `undefined` on one branch out of forty — and none of it surfaces until a user hits that exact line in production. On a small app you absorb that. On a banking backend with three hundred classes and eight developers touching it, you cannot.

Java is the answer a whole industry settled on for that problem: **make a machine read the entire program and refuse to build it if anything does not add up**, before a single line ever runs. That is why it dominates the enterprise backend — and why the Spanish consultancies you are targeting run on it. Everything that feels heavy about Java at first (declaring every type, wrapping every method in a class, compiling before running) buys the same thing: mistakes caught at build time, by a compiler, instead of at 3am by a customer.

This file is the map. It covers the four things that shape every Java line you will write — how code gets from a `.java` file to a running program, what static typing actually enforces, why every piece of code lives inside a class, and the OOP model the language is built on — then closes with the route through the rest of the notes. Nothing here is covered in full depth: each idea is introduced far enough that the file that owns it can go deep.

---

## How Java works — source code to running program

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) and "Just in Time Compiler" (section 5.4) — together they explain why Java is both at once.

Most languages are either **compiled** (translated to machine code before running) or **interpreted** (read and executed line by line at runtime). Java combines both phases: first your code is compiled to bytecode (that is the compiled part), and then the JVM reads and interprets that bytecode to run it (that is the interpreted part — and it stops being the whole truth the moment the JIT compiler enters, two subsections below). What makes this combination special is that bytecode is not tied to any operating system — the same `.class` file runs on Windows, Linux, and Mac without recompiling.

When you write Java code, two things happen:

1. **Compile time** — the Java compiler (`javac`) reads your `.java` files and translates them to **bytecode** (`.class` files). Bytecode is not machine code — it is a platform-neutral instruction set that no processor understands directly. This step happens before the program ever runs. The compiler catches syntax errors and type mismatches here.

2. **Runtime** — the **JVM** (Java Virtual Machine) reads the bytecode and executes it. The JVM is what actually runs your program. Because the JVM exists for every operating system (Windows, Linux, Mac), the same bytecode runs everywhere without recompilation. This is the meaning of Java's old slogan: *"Write once, run anywhere."*

```
YourCode.java  →  [javac compiler]  →  YourCode.class  →  [JVM]  →  running program
  source code        compile time         bytecode            runtime
```

### JDK, JRE, JVM — three names for three different boxes

Docs: [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk) → read: "JRE" (section 3) and "JDK" (section 4) — the tool lists there show concretely what each box adds on top of the previous one.

Those three acronyms are thrown around as if they were interchangeable, and they are not. They are **nested**: each one contains the previous one plus something extra.

- **JVM** (Java Virtual Machine) — the engine that *executes* bytecode. It is a program, like any other, that reads `.class` files and turns their instructions into things your actual processor does. It is what makes "write once, run anywhere" true: the bytecode never changes, only the JVM does, and a different JVM build exists for Windows, Linux and Mac.
- **JRE** (Java Runtime Environment) — the JVM **plus the standard library**: `String`, `List`, `Optional`, `LocalDate` and the thousands of other classes your code calls without ever having written them. The JRE is everything needed to *run* an already-compiled Java program, and nothing more. It cannot compile.
- **JDK** (Java Development Kit) — the JRE **plus the development tools**: `javac` (the compiler), `jar` (the packager), the debugger. This is what you install as a developer. When IntelliJ asks you for a "Project SDK" and you point it at Java 25, that is a JDK.

```
┌─ JDK (what you install to develop) ─────────────┐
│  javac   jar   javadoc   jdb   ...              │
│  ┌─ JRE (what you need to just run) ─────────┐  │
│  │  standard library (java.util, java.io…)   │  │
│  │  ┌─ JVM (the engine) ─────────────────┐   │  │
│  │  │  loads .class, executes bytecode   │   │  │
│  │  └────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

> **Which one do you have?** You installed a JDK — running `java -version` on your machine prints `java version "25"` followed by `Java(TM) SE Runtime Environment` and `Java HotSpot(TM) 64-Bit Server VM`, which is the JRE and the JVM reporting themselves from inside it. Since Java 11 the JRE is no longer distributed as a separate download; you get it inside the JDK. The distinction still matters in interviews and in deployment conversations ("does the server need a JDK or just a runtime?"), which is exactly where it gets asked.

### The JVM does not only interpret — the JIT compiler is the missing half

Saying "the JVM interprets bytecode" describes the first seconds of your program and then stops being true. If interpretation were the whole story, Java would be permanently slow: interpreting means decoding the same instruction over and over, every single time a loop goes round.

What actually happens is a two-speed system. The JVM starts by **interpreting** bytecode instruction by instruction — cheap to begin, no waiting. While it does that, it **counts**: how many times each method is called, how many times each loop repeats. When a method crosses a threshold (it becomes "hot"), the **JIT compiler** — Just-In-Time, part of the JVM, HotSpot in the standard Java 25 you have installed — compiles that method's bytecode into real machine code for *your* processor, and every later call jumps straight to that native version, skipping interpretation entirely.

```
run starts   →  bytecode interpreted, one instruction at a time  (slow, instant start)
method gets called 10,000 times  →  JIT compiles it to native machine code
from then on →  native code runs directly on the CPU            (fast, no interpretation)
```

Because the JIT watches the program *while it runs*, it can optimise using facts an ahead-of-time compiler never has — which branch of an `if` actually gets taken in production, which concrete class a polymorphic call really lands on — and it re-optimises if the pattern changes. That is how a language shipped as portable bytecode ends up competitive with compiled languages.

> **This is why the first requests to your API are the slow ones.** Start a Spring Boot app, hit an endpoint, and the first call takes noticeably longer than the hundredth — nothing is wrong. Nothing is cached wrong either: the JVM is still interpreting that code path and has not compiled it yet. It is called **JVM warm-up**, and it is the standard explanation when someone reports "the first request after a deploy is slow".

> **Why does this matter for Spring Boot?** When you run `mvn spring-boot:run` or click the green button in IntelliJ, Maven compiles your code and the JVM starts your application. When you see a `NullPointerException` in the logs, that is a **runtime error** — the compiler missed it because it only happened with specific data at runtime.

---

## Static typing — types are fixed at compile time

Docs: [Baeldung CS — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → read: "Statically Typed Languages" — for when the type check happens and what that buys you.

Java is **statically typed**: every variable has a fixed type that you declare when you create it, and that type never changes. The compiler checks every type assignment before the program runs.

```java
String name = "Victor";  // type is String — always, forever
name = 42;               // compile error — you cannot assign an int to a String
```

"Compile error" is worth making concrete, because you will meet the exact wording in IntelliJ within your first hour. Put those two lines inside a class called `A` (they have to live in a method — that is the next section) and compile with `javac A.java`. It refuses, printing the file, the line number, the offending line, and a caret pointing at the value it rejected:

```
A.java:4: error: incompatible types: int cannot be converted to String
    name = 42;
           ^
1 error
```

Read that message as a sentence: *the type on the right cannot become the type on the left*. `incompatible types: X cannot be converted to Y` is one of the two or three messages you will see most often in your first months, and it always means the same thing — you handed something a value of the wrong type. Note what did **not** happen: no `.class` file was produced at all. A program that does not type-check is never built, so there is no broken version of it to accidentally run.

> **Where does that message come from?** Not from the JVM — the JVM never saw this code. It came from `javac`, at compile time, before any bytecode existed. That is the whole point of the arrangement: this class of bug cannot reach runtime, so it cannot reach a user. A `NullPointerException`, by contrast, *is* a runtime error — the compiler cannot know in advance which reference will be empty when real data flows through.

This is the first big contrast with JavaScript, where variables can change type at any point:

```javascript
let name = "Victor";  // string
name = 42;            // fine in JS — type changed to number at runtime
```

Static typing feels stricter, but it catches an entire class of bugs before the program ever runs. In a Spring Boot codebase with hundreds of classes, the compiler is your first line of defence.

> **`var` does not break static typing.** With `var name = "Victor"`, Java still fixes the type as `String` at compile time — it just infers it from the right side so you do not have to write it. The type cannot change later. See [01-variables-types.md](01-variables-types.md).

---

## Everything is a class — the minimum unit of Java code

Docs: [Baeldung — Java Classes and Objects](https://www.baeldung.com/java-classes-objects) → read: "Classes" — what a class may contain (fields, constructors, methods) and nothing else.

In JavaScript you can write standalone functions and variables anywhere. In Java, **every piece of code must live inside a class**. There are no free-floating functions.

```java
// ❌ MAL — a method cannot float on its own in a file, outside any class
public void greet() {
    System.out.println("Hello");
}

// ✅ BIEN — the method lives inside a class
public class Greeter {
    public void greet() {
        System.out.println("Hello");
    }
}
```

The rule is enforced by the compiler, and the message it gives you names every construct that *is* allowed at the top level of a file — which is the fastest way to learn the list. Put a bare statement outside any class and `javac` says:

```
B.java:1: error: class, interface, annotation type, enum, record, method or field expected
System.out.println("hi");
^
1 error
```

Read it as a list of what the compiler was willing to accept at that position: a class, an interface, an annotation type, an enum, a record, a method, or a field — but never a loose instruction. Statements only exist *inside* a method, and a method only exists inside a type.

> **"Method" is in that list — so can I write a method outside a class after all?** In a **compact source file** (Java 21 preview, standardised in Java 25 — the version you have), yes: a file containing only `void main() { ... }` compiles and runs with `java Main.java`. It looks like the rule is broken, but it is not — the compiler *synthesises* an unnamed class around your method, so the code still ends up inside a class exactly as before. It exists so a beginner's first program or a throwaway script is not four lines of ceremony. You will not see it in a real project: Spring Boot, Maven and every codebase you join use explicitly declared classes, because a synthesised class cannot be imported, extended or injected. Treat it as a scripting convenience, not as an exception to the model.

This is not a quirk — it is a deliberate consequence of Java being an object-oriented language (see OOP section below). Every Spring Boot component (`@Service`, `@Controller`, `@Repository`) is a class. When Spring starts your application, it creates objects from those classes and manages them for you.

> **Preview — Spring Boot:** `@Service`, `@Controller` and `@Repository` are Spring Boot annotations, not Java language keywords, and you have not studied them yet. They are mentioned here only to show where this rule lands in practice: each one marks a class that Spring itself instantiates and hands to whoever needs it. The `@` mechanism that makes annotations work is Java, and it is covered in [13-annotations.md](13-annotations.md); what these specific ones *do* belongs to the Spring Boot notes, which you will reach after this topic.

---

## The entry point — `public static void main(String[] args)`

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → read: "Common Signature" (section 2) and "Different Ways to Write a main() Method" (section 3) — each keyword of the signature and which variations the JVM still accepts.

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

Read each row as: *this keyword is in the signature because the JVM needs it to be there* — the left column is the word, the right column is the requirement it satisfies. Drop any one of them and the JVM no longer recognises the method as the entry point.

### Running it by hand — the two commands IntelliJ hides from you

The green button in IntelliJ runs both steps of the compile-then-execute pipeline from the first section without showing you either. Doing it once by hand is what makes that diagram concrete:

```bash
javac Main.java   # compile time — reads the .java, writes Main.class next to it
java Main         # runtime — the JVM loads Main.class and calls its main method
```

Two details catch everyone the first time. You pass `javac` a **filename** (`Main.java`, extension included, because it is a file being read), but you pass `java` a **class name** (`Main`, no `.class`, no extension — you are naming the class you want the JVM to start, and the JVM finds the file itself). And `javac` writes `Main.class` into the current folder — that is the bytecode from the diagram, sitting on disk, and it is the *only* thing `java` needs from then on. Delete the `.java` and `java Main` still runs.

### `args` — what the JVM actually hands you

`String[] args` is not decoration. Everything you type after the class name arrives inside that array, in order:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, " + args[0]);
    }
}
```

```bash
$ java Main Victor
Hello, Victor
```

That is the same channel Spring Boot uses when you start a JAR with `java -jar app.jar --server.port=8081` — the flag lands in `args`, `SpringApplication.run(Main.class, args)` passes the array straight through, and Spring reads the setting out of it. That is why the generated `main` forwards `args` instead of ignoring it.

> **The array is empty, never null, when you pass nothing.** Run `java Main` with no arguments and `args` is a `String[]` of length 0 — so `args[0]` does not give you a null check to forget, it gives you a crash: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0`. Guard with `args.length > 0` before reading a position. The distinction between "empty" and "null" comes back constantly with collections in [07-collections.md](07-collections.md).

### When the signature is wrong

Getting one keyword wrong does not produce a compile error — the file compiles perfectly, because a method named `run` or a `main` with the wrong shape is still a valid Java method. The failure comes later, from the JVM, at launch:

```
Error: Main method not found in class E, please define the main method as:
   public static void main(String[] args)
or a JavaFX application class must extend javafx.application.Application
```

The message is unusually helpful: it prints the signature it wanted. What it tells you underneath is *where* the check happens — the compiler has no opinion about entry points, so this is a **runtime** failure, discovered when the JVM loads the class and looks for a method it cannot find. Whenever you see it, compare your signature word by word against the one in the error.

> **The rules relaxed in Java 25.** Alongside compact source files, the JVM now also accepts a non-`static` `main`, and one with no `String[]` parameter — `void main()` is a legal entry point in the Java 25 you have installed. It exists to lower the barrier for a first program; the classic `public static void main(String[] args)` is what Spring Initializr generates and what every codebase you join will contain, so learn the reasons behind each keyword in the table above rather than treating the relaxation as the new normal.

> **In Spring Boot you never write `main` yourself.** Spring Initializr generates one `Application.java` with a `main` that calls `SpringApplication.run()`. That one line starts the whole framework — it bootstraps the application context, discovers all your beans, and starts the **embedded server** — Tomcat by default, which Spring Boot carries bundled inside the JAR itself. You do not install Tomcat separately; it comes included. You will not touch `main` again after that.

---

## Object-oriented programming — why Java is built this way

Docs: [Baeldung — Object-Oriented Programming Concepts in Java](https://www.baeldung.com/java-oop) → read: "Abstraction", "Encapsulation", "Inheritance" and "Polymorphism" (sections 4–7) — one short section per pillar, in the same order as below.

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

> **Preview — Spring Boot:** the examples below reach for Spring Boot ideas you have not studied yet — service classes, repositories, and *dependency injection* (the framework creating your objects and passing them to whoever needs them, instead of you writing `new`). They appear here because each pillar is easiest to recognise in the place you will actually meet it. Read them as a preview of where this Java concept lands; you will implement all of it in the Spring Boot notes.

**Encapsulation** — hide internal details; expose only what the outside needs. Fields are almost always `private`, no exceptions. Methods, on the other hand, can be `public` (if called from outside) or `private` (internal helpers that no one outside the class needs to know about). You will see this combination constantly in Spring Boot: `private` fields, `public` service methods, `private` helper methods. You always access fields through methods (`getSpeed()`, not `car.speed` directly).

> **Why bother, if the getter returns the field anyway?** Because the getter is a *door* and the field is a *hole in the wall*. As long as everyone goes through `getSpeed()`, you keep three powers that a public field takes away from you. You can **validate** — `accelerate()` can refuse a negative amount, while `car.speed = -80` from anywhere in the codebase cannot be stopped. You can **change the inside later** — store speed in km/h instead of m/s, or compute it from two other fields, and no caller notices, whereas every line touching `car.speed` would have to be found and edited. And you can **look**: put a breakpoint or a log line in one method and you see every read of that value in the whole application; a public field gives you nowhere to stand. The rule "fields `private`, access through methods" is not ceremony — it is what makes a class something you can change without fear.

Keep this pairing in mind, because the two get confused constantly: encapsulation protects *state*, while abstraction — the fourth pillar below — hides *behaviour*. `private` fields are encapsulation; "the controller does not know how the service does its job" is abstraction.

**Inheritance** — a class can extend another class and reuse its code. The child class gets everything the parent has, plus its own additions. Drawn out, the relationship is a tree, and the arrow always points from the child *up* to the parent — the child knows who its parent is, never the other way round:

```
            Animal              ← the parent (superclass)
        ┌── name: String
        └── breathe()
              ▲
              │ extends
        ┌─────┴─────┐
      Dog          Cat          ← the children (subclasses)
      bark()       meow()         each adds its own behaviour,
                                  both already have name + breathe()
```

Read the diagram as *"a Dog is an Animal"* — everything drawn in the `Animal` box also exists in every `Dog` object, without being written again in `Dog`. That is the reuse. `Animal` has no idea `Dog` exists, which is why you can add a `Bird` tomorrow and change nothing above it.

```java
public class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void breathe() { System.out.println(name + " breathes"); }
}

public class Dog extends Animal {
    public Dog(String name) { super(name); }
    public void bark() { System.out.println(name + " barks"); }
}

Dog dog = new Dog("Rex");
dog.breathe();  // "Rex breathes"  — inherited from Animal
dog.bark();     // "Rex barks"     — Dog's own method
```

In Spring Boot you see this in custom exceptions (`extends RuntimeException`) and Spring Security.

**Polymorphism** — the same code can work with different types of objects. If you have a variable of type `Animal`, you can store a `Dog`, a `Cat`, or any other animal in it. When you call a method, the JVM decides at runtime which version to run based on the actual object:

```java
Animal a = new Dog("Rex");   // Dog extends Animal — fits perfectly in the variable
a.breathe();                 // the JVM runs the breathe() that matches the real object
```

Interfaces (covered in [05-interfaces-abstract.md](05-interfaces-abstract.md)) take this further. It is the mechanism behind Spring's dependency injection: you declare the type as an interface, and the framework injects the concrete implementation at runtime.

**Abstraction** — expose what a thing does, hide how it does it. The distinction from encapsulation is subtle: encapsulation protects the internal state of an object; abstraction hides internal behaviour to simplify what the outside needs to know. It is the controller that practises abstraction — it calls the service without knowing anything about how that method obtains the data:

File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/controller/ProjectController.java`

```java
// The controller only knows getAll() returns the project responses — not how
public ResponseEntity<List<ProjectResponse>> getAll(){
    return ResponseEntity.ok(projectService.getAll());
}
```

One line, and everything underneath it is invisible from here: that `getAll()` asks a repository for the rows, that the repository turns into SQL, that each `Project` entity is then converted into a `ProjectResponse`. The controller could not describe any of it, and that is the point — the day the query changes, this line does not.

> **In TimeTrack:** the call `projectService.getAll()` from the controller is abstraction in action — the controller knows nothing about the repository or the SQL query underneath. The `private final ProjectRepository projectRepository` field inside `ProjectService` is encapsulation. Each Spring Boot layer abstracts the one below it: controller → service → repository → database.

---

## Java vs JavaScript — the mental model shift

Docs: [MDN — JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures) → read: "Dynamic and weak typing" — the exact behaviour of the language you are unlearning, stated by its own docs.

Since you come from JavaScript, these are the things that will trip you up most:

Read each row as one habit you have to unlearn: the middle column is what your JS instinct expects, the right column is what Java actually does. When something surprises you in Spring Boot, it is almost always one of these rows biting you.

| Concept | JavaScript | Java |
|---------|-----------|------|
| Types | Dynamic — variables can change type | Static — type is fixed at compile time |
| Code structure | Functions can exist anywhere | All code lives inside a class |
| Classes | Optional pattern | Mandatory — the basic unit |
| `null` errors | `undefined is not a function` at runtime | `NullPointerException` at runtime |
| Entry point | Node runs the file top to bottom | JVM calls `main()` |
| Compilation | Not needed (interpreted) | Required before running |

The biggest shift: **in JavaScript, functions are first-class citizens**. In Java, **classes are the first-class citizens**. Everything else flows from that difference.

---

## The route ahead — how these notes are ordered

These notes are numbered in the order that builds understanding from the ground up, not alphabetically or by importance. The path is deliberate: each file only assumes what the earlier ones already taught. It runs in four stretches.

**The raw materials (01–03).** [01-variables-types.md](01-variables-types.md) covers the primitive and reference types every line of Java is made of, [02-control-flow.md](02-control-flow.md) the `if`/`for`/`switch` that decide what runs, and [03-methods.md](03-methods.md) how behaviour is packaged into a method and called. Nothing here needs objects yet — this is the vocabulary everything later is written in.

**The heart of the language: object orientation (04–06).** Three files that build on each other and turn the preview above into the real thing: [04-oop-classes.md](04-oop-classes.md) (classes, objects, constructors, `this`), [05-interfaces-abstract.md](05-interfaces-abstract.md) (the contracts Spring injects against) and [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md) (`extends`, `super`, and the runtime method dispatch you met on this page). The OOP section above is only their trailer.

**The everyday tools (07–12).** What you actually reach for inside a service method: [07-collections.md](07-collections.md) (`List`, `Map`, `Set`), [08-exceptions.md](08-exceptions.md) — the deepest file of the topic and the model for the quality bar of all the others — [09-streams-lambdas.md](09-streams-lambdas.md) (functional-style data pipelines), [10-generics.md](10-generics.md) (`<T>` and `Optional`, which collections and repositories both lean on), [11-enums.md](11-enums.md) and [12-dates.md](12-dates.md) (`LocalDate`/`LocalDateTime`).

**How real projects are wired (13–16).** [13-annotations.md](13-annotations.md) explains the `@` mechanism the whole framework is driven by, [14-maven.md](14-maven.md) the dependencies and the build. Then [15-memory-model.md](15-memory-model.md) — stack, heap and garbage collection — placed near the end on purpose, because it explains *why* everything you saw earlier (references, `null`, object identity) behaves the way it does. The topic closes with `16-concurrency-awareness.md` — the one file on this route not written yet, so there is nothing to link to until it lands — which takes that memory model one step further: your Spring Boot application serves many requests at the same time, on many threads, through objects it created only once — and knowing what that implies is a standard interview probe for a junior, even though you will not be writing threads yourself.

Read them in order the first time; after that, treat each as a standalone reference.

Start with [01-variables-types.md](01-variables-types.md) — it turns the static-typing idea from this page into the concrete set of types you will declare in every class from here on.
