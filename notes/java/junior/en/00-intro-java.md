# Java Execution Foundations

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) and "Java Virtual Machine" (section 5) for the two stages from source code to execution

---

JavaScript can start running a file and only discover a bad operation once execution reaches that line. Java adds a check that runs before execution: a compiler reviews the entire source first, before a single line of it runs. That upfront check explains both how a `.java` file becomes a running program and why some mistakes stop you before launch while others only appear after launch.

This note is the map for everything that follows. It starts with what kind of language Java is and which of its traits keep reappearing, compares those traits against the ones you already know from JavaScript, then shows a concrete example: the smallest program that runs at all in Java, naming the chapter that owns each piece of it. After that it lays out the full reading route, from chapter `01` to `16`. Only then does it follow one `.java` file through the two stages that turn it into a running program, and use that boundary to explain the three different ways your code can fail.

---

## What Java is, and the job it does in your stack

Purpose: You use this orientation whenever you need to say what Java actually is and why the server half of your projects is written in it, because every later chapter assumes you already know which part of the work the language is doing.

Docs: [Baeldung — Spring Boot Tutorial: Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → read: the opening overview and the first bootstrapped application, to see that a Spring Boot service is ordinary Java source, compiled and started like any other Java program

Java is a **general-purpose, statically typed, class-based language that compiles to bytecode and runs on a JVM**. That is a dense sentence, so take it one word at a time — each of those words is a decision the language made, and each one shapes how the rest of these notes read.

- **General-purpose** — Java is not tied to one kind of program. It is used for web back ends, Android apps, desktop tools, and batch jobs that move millions of database rows overnight. You are learning it for the first of those.
- **Statically typed** — every variable is declared with a type (`int`, `String`, `User`), that type is fixed from that moment on, and a tool checks every use of it *before* the program is allowed to start.
- **Class-based** — there is no such thing as a loose function floating in a Java file. Every line of executable code is a member of a class, and a class is the unit the compiler produces output for.
- **Compiles to bytecode and runs on a JVM** — the two-stage pipeline the section below walks through in full. For now: one tool checks and translates your source, and a second program executes the translation.

Here is where that language sits in the stack you are building towards. Angular owns the browser, Java owns the server, and the database sits behind Java and is only ever reached through it.

```text
  ┌──────────────┐               ┌────────────────────┐        ┌────────────┐
  │   Angular    │  HTTP + JSON  │ Spring Boot (Java) │  SQL   │ PostgreSQL │
  │ (TypeScript) │ ────────────► │  rules, security,  │ ─────► │   tables   │
  │   screens    │ ◄──────────── │    data access     │ ◄───── │            │
  └──────────────┘               └────────────────────┘        └────────────┘
```

The browser never talks to the database directly: it sends an HTTP request to the Java server and gets JSON back. The Java server is the only thing holding the database connection, which is exactly why it is also the only place that can truly enforce a **business rule** — a condition that decides what each user is allowed to do, like "an employee may only see their own time entries." Putting that same check in Angular is not wrong as a first barrier, to improve the experience and avoid unnecessary requests, but it is not real security: anyone can open the browser's *Network* tab and call the endpoint directly, bypassing the Angular code entirely. The only rule that truly counts is the one living in the backend.

> **Java is the language; Spring Boot is a framework written in that language.** These two get mixed up as one thing early on, and untangling them now saves a lot of confusion later. Java gives you classes, types, methods and exceptions. Spring Boot is a large pile of pre-written Java that your build downloads as `.jar` files, and it handles the parts nobody wants to write by hand: opening a port, parsing an HTTP request, mapping a database row onto an object. When you write `@RestController`, you are not using a new piece of Java syntax — you are using an **annotation**, an ordinary language feature: a marker Java lets you attach to a class or a method, which some other tool then reads and acts on to decide what to do. Here, that tool is Spring Boot's own code, which looks for `@RestController` and, on finding it, registers that class as a controller that handles HTTP requests. Annotations as a language feature in their own right are step 15 of the route below, in [13-annotations.md](13-annotations.md). Everything in these notes is plain Java, independent of any framework — annotations themselves included — which is why it stays true no matter which framework you end up working in.

---

## Five traits that come back in every later chapter

Purpose: You use these five traits as the through-line of the whole topic, because each later chapter is essentially one of them examined closely — recognising them here is what stops a chapter arriving out of nowhere.

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → read: the section on statically typed languages, for why the type check happens before execution instead of during it

Java has a personality, and it is remarkably consistent. Five traits explain almost every "why does it make me do that?" moment you are going to have, and each one is picked up in full by a later file.

**1. Static typing — the type is part of the declaration, and it never changes.** When you write `int quantity = 2;`, the name `quantity` is bound to the type `int` for the rest of its life. This is not just a rule to memorise, it is a concrete mechanism: because the type is written down in the source itself, the compiler can reason about a line *without ever running it*. It does not need to know that `quantity` will be `2` at one moment and `40` at another — it only needs the declared type to decide whether an operation is legal. That is why Java can reject code before it ever launches, instead of letting that same error only surface at runtime, on the day the program finally executes the operation that was not allowed. This trait is explained in [01-variables-types.md](01-variables-types.md), and it returns with force in [10-generics.md](10-generics.md), where the type of the values *inside* a collection is itself declared and checked.

**2. All executable code lives inside a class.** In JavaScript you can put a function alone in a file and export it. Java has no equivalent: `main`, and every other method, has to belong to some class. The reason has to do with how the compiler stores the result: it emits one `.class` file per class, so a class is the smallest unit that can be compiled and loaded on its own. What a class actually is, what it holds, and how you design one is [04-oop-classes.md](04-oop-classes.md).

**3. Compile first, run second — always two moments.** Even when IntelliJ hides both behind one green button, they stay two separate moments with two different kinds of error, and knowing which of the two is speaking to you — the compiler, or the program already running — tells you immediately where to look for the problem. The section below traces that process step by step; [14-maven.md](14-maven.md) is the tool that automates both steps once a real project has dozens of source files and external libraries to fetch before it can even compile.

**4. The compiler targets the JVM, not your processor.** It does not produce instructions for your particular processor, but bytecode for an abstract machine — the JVM — and a distinct JVM exists for Windows, macOS, Linux, and whatever your employer runs in production. This is the origin of Java's old slogan, *write once, run anywhere*, and it is not marketing: the `.class` file you generate on your Windows laptop — the compiled bytecode, also called the "artifact" — is exactly the one a Linux server runs in production, unchanged and without recompiling it, because both machines run that same bytecode inside their own JVM, instead of running your source code directly. The JVM is also what manages memory for you while the program runs — you don't have to — which is the subject of [15-memory-model.md](15-memory-model.md). For a precise breakdown of the JVM against the JRE and the JDK you installed — roughly, the JDK brings the tools to develop and compile, the JRE brings only what's needed to run, and the JVM is the virtual machine inside both — see [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk).

**5. More explicit code, by design.** Java spells out explicitly a lot of things that JavaScript or TypeScript leave for the language itself to infer. For example, a data shape you declare in TypeScript as a four-field interface:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
```

becomes, in classic Java, a class with four private fields, a constructor that receives and assigns each of them, and four *getter* methods — one per field, so it can be read from outside the class —: quite a bit more code to represent exactly the same information. This is a design decision, not an oversight: Java optimises for the person *reading* code they did not write, years later, over the person writing it today — the more explicit the code, the less guessing it requires. The language has also been trimming that extra code where it can: *records*, in [04-oop-classes.md](04-oop-classes.md), collapse that same kind of data class — a class whose only job is to hold a handful of related values, with no logic of its own — into a single line, and *lambdas*, in [09-streams-lambdas.md](09-streams-lambdas.md), do the same when what you want to pass is not a piece of data but an action, like the very function that decides how to compare two elements when sorting them.

| Trait | What it forces on you | Where it is examined in full |
|---|---|---|
| Static typing | Declare a type and keep it; the compiler checks every use before launch | `01-variables-types.md`, `10-generics.md` |
| Code lives in a class | No standalone functions; a class is the unit of compilation | `04-oop-classes.md` |
| Compile, then run | Two separate steps — compile first, then run —, two moments, two kinds of error message | this file, then `14-maven.md` |
| The JVM is the target | Bytecode is portable; the JVM manages memory for you, not you | `15-memory-model.md` |
| More explicit code | More typing, optimised for the reader rather than the writer | `04-oop-classes.md`, `09-streams-lambdas.md` |

---

## Coming from JavaScript — where the comparison helps, and where it lies

Purpose: You use this when a Java construct looks like something you already know from JavaScript or TypeScript, because roughly half of those resemblances are real and the other half will cost you an afternoon.

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → read: the section on dynamically typed languages, which is the JavaScript side of every contrast below

Your React and TypeScript background is an advantage here — you are not learning to program, you are mapping known ideas onto a new language. The risk is that some of that mapping is wrong in ways that look right, and those are the ones that waste an afternoon.

**This is used the same way in both languages.** The syntax of `if`, `while` and `for` is the same. `try { } catch (e) { }` looks identical — although what Java does inside it when throwing and catching an exception is different, and the callout below explains it. A loop over a collection reads the same as JavaScript's `for...of`: `for (String name : names)`. Adding a number to a piece of text with `+` concatenates in both languages, so `"total: " + 30` produces `"total: 30"` exactly as you expect. And `final` on a variable behaves close enough to `const` that the analogy is worth using, though it is not exactly the same: `const` in JavaScript locks the variable but not what it contains, and `final` in Java does exactly the same thing — that is a half-truth, not a real difference, and [01-variables-types.md](01-variables-types.md) spells out the exact nuance.

**These look the same and are not.**

*`var` is not `var`.* Java reused the keyword, but gave it nearly the opposite meaning. In JavaScript, `var` declares a variable with no type at all. In Java, `var` means "work the type out from what I am assigning, then hold me to it forever", for example:

```java
// ✅ fine — javac (the Java compiler) infers int from the initialiser
var total = 30;

// ❌ WRONG — total is an int, permanently
total = "thirty";
```

```text
error: incompatible types: String cannot be converted to int
```

So `var` does not commit any typing error: the type is still fixed the moment you write the line, you just did not have to spell it out — it is a shorthand *inside* the type system, not a hole in it. It is worth using when the type is already obvious from the right-hand side of the assignment, as in the example above; avoid it when it hides the real type and makes the code harder to read. [01-variables-types.md](01-variables-types.md) has the full section.

*An object's shape is fixed at compile time.* In JavaScript you can attach a property to an object whenever you like and the object simply grows. In Java the set of fields is decided by the class: only the fields the class declared exist, and one it never declared does not. For example, with a `User` class that only declares `name` and `email`:

```java
public class User {
    private String name;
    private String email;
}
```

```java
User user = new User();

// ❌ WRONG — the User class declares no field called age
user.age = 30;
```

```text
error: cannot find symbol
        user.age = 30;
            ^
  symbol:   variable age
  location: variable user of type User
```

That message is worth recognising early, because `cannot find symbol` is the error you will meet most often in your first weeks. It always means the same thing: the compiler looked for a name — a variable, a method, a class — and nothing by that name exists anywhere the compiler can see from that line.

*`==` is asking a different question.* In JavaScript the interesting distinction is `==` versus `===`: `===` compares whether the type and the value match on both sides, while `==` first tries to convert one side so the types match and only then compares — that is type coercion. Java has no `===`, and Java's `==` does no coercion at all: when used on objects — for example, two `String` variables — it asks "are these two variables pointing at the same object in memory?", which is almost never the question you meant to ask when comparing two pieces of text. Getting this wrong is the single most common beginner bug in Java, and it is settled in two places. The case you will hit first, comparing the content of two pieces of text, is answered in the very next file: [01-variables-types.md](01-variables-types.md) shows why `.equals()` — which compares the actual text content, character by character, instead of the memory address — is the method you actually wanted, and why writing two plain string literals side by side, like `"hello" == "hello"`, makes `==` look like it works correctly just often enough to fool you (Java reuses the same object in memory for identical text literals, so that particular case really does point at the same place, even though the general rule still is not that). The general rule — how you yourself define when two objects of a class you wrote should count as equal — waits for [04-oop-classes.md](04-oop-classes.md).

*TypeScript's types vanish before runtime; Java's do not.* TypeScript checks your types and then **deletes them**: the JavaScript that actually runs in the browser contains no types at all, and nothing re-checks anything while it runs. Java's declared types survive compilation — they are recorded in the `.class` file, and the JVM itself refuses an invalid conversion at runtime. There is exactly one exception to this in Java: generics. A generic's type arguments, like the `String` inside `List<String>`, *are* discarded after being checked at compile time — that phenomenon is called *type erasure*, and [10-generics.md](10-generics.md) explains exactly what it stops you from doing as a result.

| Habit from JS/TS | What JavaScript/TypeScript does | What Java does | Does it behave the same? |
|---|---|---|---|
| `for...of` over an array | Iterates its elements one by one | `for (String name : names)` iterates a collection the same way | Yes |
| `const` | Locks the variable, not what it contains | `final` does the same | Yes, with a caveat in `01` |
| `try / catch` syntax | `try { } catch (e) { }` | Identical shape | Yes, in the syntax |
| `var` | Declares a variable with no type at all | Infers one fixed type and enforces it forever | No — near-opposite meaning |
| Adding a property at runtime | The object grows with any new property | Fields are declared by the class only; none can be added later | No — throws `cannot find symbol` |
| `==` vs `===` | Compares with or without type coercion | `==` on objects compares whether they point at the same object in memory, not whether the content is equal | No — use `.equals()` |
| TS types erased at build | Types vanish at compile time; nothing checks them at runtime | Types survive into the bytecode | No — except for generics |

> **One comparison to refuse outright: exceptions.** It is tempting to read Java's `try/catch` as the JavaScript one because the syntax looks the same. The mechanism underneath is not. Java organises exceptions into a type hierarchy, and for one specific branch of it the *compiler* itself forces you to do something about the failure before it lets you build the program: either you catch it right there with a `catch`, or you explicitly declare in the method's signature that the failure can rise unhandled to whoever called you — and that obligation is checked at compile time, with no JavaScript equivalent whatsoever. Applying your JS error-handling habits here produces code that simply does not compile, with a message that makes no sense until you know this model. That topic is explained from scratch in [08-exceptions.md](08-exceptions.md).

---

## The smallest Java program that runs

Purpose: You use this skeleton as the frame every example in every later file sits inside, because Java has a fixed minimum before a single line of your own logic can execute.

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → read: the opening explanation of the common signature, where `public` and `static` are unpacked keyword by keyword

In JavaScript, a file with one line in it is a program. Java has a minimum, and it is three things: a class whose name matches the file, an entry point with an exact signature, and something that produces output so you can see that anything happened at all.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
```

Saved as `Hello.java`, compiled with `javac Hello.java` and started with `java Hello`, that prints:

```text
Hello from Java
```

**The file name is not a convention, it is a rule.** A `public` class must live in a file with exactly its own name plus `.java`. Put the class `PriceCalculator` in a file called `Wrong.java` and nothing compiles:

```text
error: class PriceCalculator is public, should be declared in a file named PriceCalculator.java
```

The reason is that the compiler and the JVM both find a class *by its name*: when something asks for `PriceCalculator`, the tooling goes looking for `PriceCalculator.class`, produced from `PriceCalculator.java`. Making the two names line up turns "find this class" into a predictable file lookup instead of a search through every file on disk.

**`main` is the door, and the JVM only knows one door.** When you run `java Hello`, the JVM loads that class and looks for a method with exactly this shape. Every token in it is doing a job:

```text
public static void main(String[] args)
  │      │     │    │      │
  │      │     │    │      └─ the command-line arguments, handed over as an array of text
  │      │     │    └─ the fixed name the JVM looks for — nothing else will do
  │      │     └─ gives nothing back; there is no caller in your code to return to
  │      └─ callable without creating an object of the class first
  └─ visible from anywhere, including from outside this class's own package
```

One word in that last line needs unpacking before you can read it at all: a **package** is the namespace a class is declared in, written as a dotted name that mirrors its folder path on disk. Your TimeTrack classes sit in `com.victor.timetrack` and its sub-packages, which is exactly the `com/victor/timetrack/` folder chain you saw above. It is the boundary that "visible from anywhere" is measured against.

If that method is missing, the class still compiles perfectly — nothing is wrong with it *as a class* — and the failure comes later, from the JVM, at the moment you try to start it:

```text
Error: Main method not found in class NoMain, please define the main method as:
   public static void main(String[] args)
```

> **Why does that fail then, and not at compile time?** Because a class without a `main` method is a completely normal, useful class — most of the classes in project 07 have no `main` at all and are compiled and used constantly. "Has an entry point" is not a property the compiler could sensibly demand of every class; it is a demand the JVM makes of the *one* class you name on the command line, at the moment you name it.

**Do not unpack that signature yet — and that is deliberate.** You have just met `public`, `static` and `String[]`, and each is a real concept with a chapter of its own. `public` and `static` are visibility and class-level membership, which belong with classes in [04-oop-classes.md](04-oop-classes.md). `String[]` is an array, a fixed-length row of values, which belongs with the other ways of holding many values in [07-collections.md](07-collections.md). Read them here as a fixed formula you can recognise. Every example from `01` onwards prints something, so this is the frame those examples live in — and it stops being a formula in the two chapters that own it.

**`System.out.println` is how you see anything at all.** `System.out` is the standard output stream, which for you is the console in IntelliJ, and `println` writes its argument there and then moves to a new line. Its sibling `print` writes without the line break. For your whole junior route this is the debugging tool of choice; a real application uses a logging library instead, so that output can be switched off, timestamped, and routed to a file in production.

> **Preview — Spring Boot:** the snippet below is from your own project and uses Spring Boot classes you have not studied yet. It is here only to show that the same `main` signature sits underneath a framework application — `@SpringBootApplication` and `SpringApplication.run` are explained properly in the Spring Boot notes.

`Hello` is not a toy version of something real programs do differently. It is exactly what a Spring Boot application does. `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/TimetrackApplication.java` is barely a dozen lines long, and the important one is the signature you just read:

```java
@SpringBootApplication
public class TimetrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimetrackApplication.class, args);
	}

}
```

The whole TimeTrack back end — every controller, every security rule, the database connection — starts from that one call. Spring Boot does not replace Java's entry point; it starts on top of it.

> **You may see Java code with no class around it.** Since Java 25, the version your machine and project 07 both run, a file containing only `void main() { ... }` can be launched directly with `java file.java`, with no class and no `static`. It works, and it exists to make a first lesson shorter. It is not what any real project uses — every file in project 07, and every example in these notes, uses the full form — so treat the short one as a curiosity to recognise, not as the shape to learn.

---

## The route from here to Maven, and why it runs in that order

Purpose: You use this map to know why the next sixteen chapters arrive in the order they do and, more practically, which file on disk each step actually is — because the numbers in the file names are not the reading order.

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → read: the ordered list of articles in the series, as a second opinion on how the same ground is usually sequenced

The route starts with the smallest thing a program can hold and ends with the tool that builds the whole thing, and every step is placed immediately before the step that needs it. `01` gives you values — numbers, booleans, the rules that decide when an `int` becomes a `long`, and why a decimal is never exactly the number you typed — because every later line manipulates a value of some type. `02` takes the one value type big enough to deserve its own chapter, text, and shows why a `String` you appear to modify is really a new object every time. With single values understood, `03` stops evaluating expressions one at a time and starts choosing and repeating them, and `04` packages that behaviour into named methods with a contract each call has to satisfy. `05` then opens that method boundary and shows the machinery: what is copied into a parameter, where the object itself actually lives, and how the JVM tracks a chain of calls — the mechanism that objects, exceptions and collections all reason about later. Only then does `06` build real objects with valid state and answer the question objects immediately raise: when are two of them equal? `07` separates the behaviour a caller needs from the class that happens to provide it, and `08` explains how Java decides at runtime which implementation actually runs. `09` teaches you to read `Map<String, List<Order>>` *before* `10` fills the screen with exactly that, so no collection example ever contains syntax you cannot parse. `11` develops the full model of failure — how it travels, where to handle it, how to read the trace — now that lookups, conversions and iteration have given you several ways to fail. `12` gives Java the ability to pass behaviour as a value, which is what makes stream pipelines readable at all. `13` closes a value set into an enum the compiler can check exhaustively; `14` applies the same immutable-value thinking to dates and times, where the set of possible values is unbounded and no compiler check can save you; `15` generalises `@Override` into annotations as metadata that some specific tool reads, which is what makes the Spring annotations you see daily stop looking like hidden Java syntax. `16` closes with Maven, the build that resolves, compiles, tests and packages everything the fifteen chapters before it produced.

> **The numbers in the file names are not the reading order.** Only `00` and `01` line up. The files were written before this route was planned, and renumbering them would break several hundred links across the repository, so the names were deliberately left alone. Read the order from the table below and ignore the number on the file — the table is the authority, not the folder listing.

| Reading order | File in `en/` | Why it sits here |
|---|---|---|
| 01 | `01-variables-types.md` | Every later line manipulates a typed value |
| 02 | `16-strings.md` | Text is the value type you touch in every request |
| 03 | `02-control-flow.md` | Choosing and repeating needs values to choose between |
| 04 | `03-methods.md` | Packages that behaviour behind a callable contract |
| 05 | `15-memory-model.md` | Opens the method boundary: copies, references, the call stack |
| 06 | `04-oop-classes.md` | Builds objects from methods and references, and defines equality |
| 07 | `05-interfaces-abstract.md` | Separates the behaviour needed from the class providing it |
| 08 | `06-inheritance-polymorphism.md` | Decides at runtime which implementation runs |
| 09 | `10-generics.md` | Teaches the angle-bracket syntax before collections use it everywhere |
| 10 | `07-collections.md` | Groups of objects, and the hashing that makes lookup fast |
| 11 | `08-exceptions.md` | The failures the previous chapters made possible |
| 12 | `09-streams-lambdas.md` | Behaviour as a value, and the pipelines built from it |
| 13 | `11-enums.md` | A closed value set the compiler can check exhaustively |
| 14 | `12-dates.md` | The same immutability applied where no compiler check exists |
| 15 | `13-annotations.md` | Metadata a tool reads — the shape of every Spring annotation |
| 16 | `14-maven.md` | The build that compiles, tests and packages all of the above |

Two notes on reading this table. The middle column is the file to open in `notes/java/junior/en/`, and it is the only column to trust — reading order `05` really is the file named `15-memory-model.md`. And step `02`, `16-strings.md`, has not been written yet: until it exists, the material on text still lives inside `01-variables-types.md` under its `## String` section, which is where to read it from when you reach that step.

---

## From source code to bytecode to JVM execution

Purpose: You use this pipeline whenever you build or run Java code, because it identifies which tool checks the source, what that tool produces, and what actually executes the result.

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) for compilation and "Java Virtual Machine" (section 5) for execution

Writing a `.java` file is not enough to make its instructions run. The text you write is **source code**, designed for people and the Java compiler to read. A processor does not execute that source file directly, so Java uses two distinct stages:

1. **Compilation:** the Java compiler, called `javac`, reads the source code. It checks Java's syntax and type rules; if those checks pass, it translates the source into **bytecode** and writes that bytecode into a `.class` file. (There is exactly one case where no `.class` file appears on disk: the single-file shortcut from the previous section. `java Hello.java` compiles in memory and runs immediately, leaving the folder with nothing in it but the `.java` you started with. Every real build writes the files — `target/classes/` in project 07 is that output.)
2. **Execution:** a **JVM** (Java Virtual Machine) loads the bytecode and executes its instructions as a running Java program.

```text
PriceCalculator.java
        │
        │ javac checks syntax and types,
        │ then compiles the source
        ▼
PriceCalculator.class
        │
        │ a JVM loads and executes the bytecode
        ▼
running program
```

Read the diagram from top to bottom. The `.java` file is your input, `javac` is the checkpoint and translator, the `.class` file contains the resulting bytecode, and a JVM is the engine that executes it.

> **Bytecode is the hand-off format.** It is neither the Java source you wrote nor the processor-specific machine code your CPU executes directly. It is the instruction format passed from the compiler to a JVM. For junior Java work, that relationship is the useful limit: you do not need to learn individual bytecode instructions, class loading, or JVM optimisation to understand this pipeline.

Suppose your source contains a small price calculation:

```java
int quantity = 2;
int unitPrice = 15;
int total = quantity * unitPrice;
System.out.println(total);
```

When the source follows Java's rules, `javac` can produce bytecode for those instructions. When a JVM later executes that bytecode, the program prints:

```text
30
```

The two stages are separate even when IntelliJ hides them behind one green Run button, and the same holds for the single-file shortcut: both hide the compiler, neither skips it. The compiler must accept the source before the JVM can execute the new version, every time.

> **A JVM does not check your original source.** By the execution stage, the compiler has already translated accepted source into bytecode. This is why a message from `javac` and a failure during JVM execution belong to different moments.

---

## Compile-time failures vs runtime failures

Purpose: You use this distinction when reading an error or debugging a wrong result, because the moment of failure tells you whether the compiler rejected the source or the problem appeared during execution.

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) and "Java Virtual Machine" (section 5) to see the boundary between compiler rejection and execution

Different mistakes surface at different points in the pipeline. The quickest way to classify one is to ask:

> **Did `javac` reject the source, or did a JVM begin executing its bytecode?**

Use the same price calculation to compare all three outcomes.

### Syntax and type errors — rejected at compile time

A **syntax error** breaks Java's grammar: the source is not written in a form the language accepts. Removing the semicolon from the first line is one example:

```java
// WRONG — the statement is missing its required semicolon
int quantity = 2
int unitPrice = 15;
```

`javac` rejects it with a compiler message such as:

```text
error: ';' expected
```

A **type error** uses values in a combination that Java's type rules do not allow. Here the multiplication operator receives an integer on one side and text on the other:

```java
// WRONG — "15" is text, not an integer
int quantity = 2;
int total = quantity * "15";
```

`javac` reports:

```text
error: bad operand types for binary operator '*'
```

In both cases the reason differs, but the outcome is the same: `javac` rejects the changed source before a JVM can execute that version.

```text
source code
    │
    ├── syntax is invalid ──► javac rejects it
    │
    └── types do not fit ───► javac rejects it
```

> **Compile time is a checkpoint, not a running program.** None of your application instructions are being carried out while `javac` checks the source. A compile-time failure therefore cannot be caught by runtime error-handling code: there is no execution to catch it.

### Exceptions — valid source that fails during execution

Some source is legal even though particular runtime values make an operation impossible. Dividing one integer by another is valid Java, so this code passes compilation:

```java
int unitPrice = 15;
int divisor = 0;
int total = unitPrice / divisor;
System.out.println(total);
```

The problem appears only when a JVM executes the division with `divisor` equal to zero. Java creates and throws an **exception**: an object that reports a problem encountered while the program is running. The exact exception begins:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
```

Execution reached the division, so this is a **runtime failure**. If the exception is not handled, the current operation stops and Java prints information about the failure.

> **Why can the compiler not reject this first?** The operation `int / int` is allowed. In a real program, `divisor` might come from user input, a calculation, or a database while the program runs, so its actual value is not generally fixed by the source line. The compiler checks whether the operation is legal for the declared types; execution reveals whether the values make that legal operation fail.

The mechanics of throwing, catching, and propagating exceptions belong to [08-exceptions.md](08-exceptions.md). For now, the important reminder is that an exception exists only after execution has begun.

### Logic errors — execution succeeds but the answer is wrong

A program can also compile and finish without throwing anything while still producing the wrong result. Change multiplication to addition:

```java
int quantity = 2;
int unitPrice = 15;

// WRONG for the requirement "quantity multiplied by unit price"
int total = quantity + unitPrice;
System.out.println(total); // prints 17
```

Every instruction is legal. `javac` accepts integer addition, and a JVM executes it successfully. The failure is in the reasoning expressed by the code: the program does what you wrote, but not what the requirement intended. That is a **logic error**, found by comparing the actual result with the expected result — often through a test.

> **Compilation proves that the source follows Java's rules, not that it solves the right problem.** The compiler has no knowledge of the business requirement "multiply quantity by unit price," so it cannot decide that `+` should have been `*`.

The table below classifies the same example by the boundary it crosses:

| Problem | Does `javac` accept the source? | Does execution begin? | How it appears |
|---|---:|---:|---|
| Missing `;` | No | No | Syntax-error compiler message |
| `int * String` | No | No | Type-error compiler message |
| Integer division by zero | Yes | Yes | `ArithmeticException` interrupts execution |
| Addition instead of multiplication | Yes | Yes | Program finishes with the wrong result |

Read the first two columns together: if `javac` says no, the failure is at compile time; if both say yes, only running and observing the program can expose an exception or a logic error.

```text
source
  │
  ├── rejected by javac ─────────────► compile-time failure
  │                                     syntax error or type error
  │
  └── accepted ─► bytecode ─► JVM
                              ├────────► exception: execution is interrupted
                              └────────► logic error: execution completes,
                                                    but the result is wrong
```

### Which of the three is cheapest to find

The three are not equally expensive, and the gap between them is wide enough to change how you write code.

A **compile-time failure** costs you seconds. `javac` reads every line of the source whether or not that line would ever have executed, so it finds the mistake without needing the right input, the right user, or the right day of the month to arrive first. It reports the file, the line, and a caret under the exact character — and it does all of that before the program has run once, so nobody except you ever sees it.

An **exception** costs more, because nothing finds it until the failing line actually executes. The division above is invisible until a request arrives whose `divisor` really is `0`; on every other request that same code is fine. Its saving grace is that when it finally happens it is loud: execution stops, and Java prints the exception type, its message, and the list of methods that were active at that moment — the **stack trace** — which names the exact line.

A **logic error** is the expensive one, and for a precise reason: neither checkpoint is even looking for it. The compiler checks that the source obeys Java's rules. The JVM checks that each operation is possible on the values it actually received. Nothing anywhere in that pipeline holds a copy of what you *meant*. `quantity + unitPrice` is a perfectly legal addition of two `int` values, so the program compiles, runs, finishes successfully, and prints `17` with complete confidence. The only thing that can catch it is a comparison against an expected result — you reading the output, a colleague reviewing the code, or a test that asserts `30`. Left uncaught it does not crash; it invoices a customer the wrong amount, quietly, for months.

| Failure | What finds it | How soon | What it costs when missed |
|---|---|---|---|
| Syntax or type error | `javac` | Before the program starts at all | Seconds, and only your own time |
| Exception | The JVM, when that line executes | Only on the path that actually fails | A visible crash with a stack trace |
| Logic error | A person or a test comparing expected against actual | Possibly never | Wrong data, produced silently |

The third column is the one that matters: "how soon" is really "how cheap", because a failure is cheapest to fix at the moment it is created and most expensive once it has been running in production for a month. Read the table top to bottom as a cost ladder, not as a list of three equivalent things.

> **This ladder is the argument behind two habits that look like extra work.** Java's verbosity — declaring a type on every variable, being told off for a missing semicolon — is what buys you the top row: it converts as many mistakes as possible into compiler errors, which are the cheap kind. Tests are what buy you the bottom row, because a logic error has no other detector; that is exactly why project 07 is the first of your projects to plan real ones. Its Step 8 writes a JUnit test per service method, asserting the business rules themselves — that approving an entry which was never submitted throws, that the summary's approved hours equal the per-project sum. Projects 01 to 06 shipped only the empty `should be created` specs the Angular CLI generates for you, which assert nothing about what the code was supposed to compute.

You can now locate a problem on Java's basic lifecycle: source is checked and compiled into bytecode, then a JVM executes that bytecode. Next, [01-variables-types.md](01-variables-types.md) examines the declared types behind those compiler checks — what values Java lets each variable hold and why mismatched types are rejected before execution.
