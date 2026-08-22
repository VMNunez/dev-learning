## Index of this note

- [Java Execution Foundations](#java-execution-foundations)
- [1. What Java is, and the job it does in your stack](#what-java-is-and-the-job-it-does-in-your-stack)
  - [Java is an object-oriented language](#java-is-an-object-oriented-language)
  - [Where Java sits in your stack](#where-java-sits-in-your-stack)
- [2. From source code to bytecode to execution on the JVM](#from-source-code-to-bytecode-to-execution-on-the-jvm)
- [3. Compile-time failures versus runtime failures](#compile-time-failures-versus-runtime-failures)
  - [Syntax and type errors — rejected at compile time](#syntax-and-type-errors--rejected-at-compile-time)
  - [Exceptions — valid source that fails at runtime](#exceptions--valid-source-that-fails-at-runtime)
  - [Logic errors — execution finishes, but the answer is wrong](#logic-errors--execution-finishes-but-the-answer-is-wrong)
  - [Which of the three is cheapest to find](#which-of-the-three-is-cheapest-to-find)
- [4. Five traits that come back in every later chapter](#five-traits-that-come-back-in-every-later-chapter)
- [5. Coming from JavaScript — where the comparison helps, and where it lies](#coming-from-javascript--where-the-comparison-helps-and-where-it-lies)
  - [What works the same in both languages](#what-works-the-same-in-both-languages)
  - [What looks like it works the same, and does not](#what-looks-like-it-works-the-same-and-does-not)
  - [Summary table](#summary-table)
- [6. The smallest Java program that runs](#the-smallest-java-program-that-runs)
- [7. The route from here to Maven, and why it runs in that order](#the-route-from-here-to-maven-and-why-it-runs-in-that-order)

# Java Execution Foundations

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) and "Java Virtual Machine" (section 5) for the two stages from source code to execution

---

JavaScript can start running a file and only discover a bad operation once execution reaches that line. Java adds a check that runs before execution: a compiler reviews the entire source first, before a single line of it runs. That upfront check explains why some mistakes stop you before launch while others only appear after launch.

This note is the map for everything that follows, and its seven sections are ordered so that each one sets up the next. The first answers what kind of language Java is, explains the model the whole language rests on — object-oriented programming — and places the job Java does in the stack you are building. The second follows one `.java` file through the two stages that turn it into a running program, because everything else follows from that. That boundary between the two stages is exactly what explains the three different ways your code can fail, and that is what the third section covers. With that settled, the fourth goes over the five Java traits that keep reappearing in every chapter, and the fifth holds them up against what you already know from JavaScript: which habits you can bring over as they are, and which ones will cost you an error. The sixth shows the smallest program that runs at all in Java, naming the chapter of these notes that owns each piece of it. And the seventh lays out the full reading route, from chapter `01` to `16`.

## What Java is, and the job it does in your stack

Docs: [Baeldung — Spring Boot Tutorial: Bootstrap a Simple Application](https://www.baeldung.com/spring-boot-start) → read: the opening overview and the first bootstrapped application, to see that a Spring Boot service is ordinary Java source, compiled and started like any other Java program

Java is a **general-purpose, statically typed, class-based language that compiles to bytecode and runs on a JVM**. That is a dense sentence, so take it one part at a time:

- **General-purpose** — Java is not tied to one kind of program. It is used for web back ends, Android apps, desktop tools, and batch jobs — programs with no screen and nobody sitting in front of them, which start themselves at a scheduled hour and process a whole batch of data in one go — that move millions of rows from one system to another overnight.
- **Statically typed** — every variable is declared with a type (`int`, `String`, `User`, etc), that type is fixed from that moment on, and the compiler checks every use of that variable during compilation, before the program is allowed to start, precisely so that type errors are caught before they ever get to run.
- **Class-based** — there is no such thing as a loose function floating in a Java file. Every line of executable code is a member of a class, and the class is the elementary unit the compiler needs in order to compile and produce output.
- **Compiles to bytecode and runs on a JVM** — the two-stage pipeline the next section walks through in full. For now: one tool checks and translates your source, and a second program executes the translation.

### Java is an object-oriented language

Of the four traits above, the one that will change how you write code the most is "class-based", because there is a whole model behind that word: **object-oriented programming** (OOP). Its idea is a single one. Instead of keeping the data on one side and the functions that manipulate it on the other, OOP puts both in the same unit.

That unit is the **object**: a value that holds data inside it — its **state** — and that also knows how to do things with that data — its **behaviour**, written as methods. And the **class** is the template the objects are made from: it declares which fields every object will have and which methods it will be able to run. One single `Invoice` class lets you create a thousand different invoices, each with its own data and all of them with the same methods.

```java
public class Invoice {

    private int quantity;      // state: the data each invoice holds
    private int unitPrice;

    public int total() {       // behaviour: what the invoice knows how to do with its data
        return quantity * unitPrice;
    }
}
```

Notice what you do not have to write: `total()` takes no parameter. It does not need one, because `quantity` and `unitPrice` are already inside the object running the method. In JavaScript you usually write `calculateTotal(quantity, unitPrice)`, with the function on one side and the data on the other, and it is the caller that has to bring them together; in Java you write `invoice.total()`, and the data travels inside the object already.

Four ideas come out of that model, and you will meet all four by name in any junior interview:

| Idea | What it means | Where it is studied |
|---|---|---|
| **Encapsulation** | Fields are declared `private` and are only read or changed through the class's own methods | `06-oop-classes.md` |
| **Abstraction** | Describing which methods must exist without saying how they are implemented — that is an interface | `07-interfaces-abstract.md` |
| **Inheritance** | One class starts from another and keeps its fields and methods instead of repeating them | `08-inheritance-polymorphism.md` |
| **Polymorphism** | Several classes answer the same method each in their own way, and Java decides at runtime which one runs | `08-inheritance-polymorphism.md` |

The third column is the one to read carefully: none of the four ideas is learned here. Here you only need to recognise the names, because you will hear them before you get to study them; each one is explained in full in the file that column points at.

> **Why putting the data and the behaviour together actually changes something.** Once the fields are declared `private`, the only code in the world that can modify an invoice's `quantity` is the methods of the `Invoice` class. That leaves the class as the single place bad data can get in through, so that — and only that — is where you write the checks ("the quantity cannot be negative"), and they are then guaranteed for every invoice in the program. If the data were loose in an object anyone could touch, that check would have to be repeated at every site that modifies it, and forgetting it once would be enough.
>
> One nuance worth settling now: not everything in Java is an object. The **primitive** types — `int`, `double`, `boolean` and a few more — are plain values, with no methods and no state inside them, and they are the exception to the rule. Everything else you handle is an object of some class. The full list is in [01-variables-types.md](01-variables-types.md).

### Where Java sits in your stack

Here is where that language sits in the stack you are building towards. Angular owns the browser, Java owns the server, and the database sits behind Java and is only ever reached through it.

```text
  ┌──────────────┐               ┌────────────────────┐        ┌────────────┐
  │   Angular    │  HTTP + JSON  │ Spring Boot (Java) │  SQL   │ PostgreSQL │
  │ (TypeScript) │ ────────────► │  rules, security,  │ ─────► │   tables   │
  │   screens    │ ◄──────────── │    data access     │ ◄───── │            │
  └──────────────┘               └────────────────────┘        └────────────┘
```

The browser has no connection to the database, and it cannot have one. All it does is send an HTTP request to the Java server and wait for the answer. The Java server receives that request, queries the database itself, and hands the browser back the result already turned into JSON.

That split has one direct consequence. Because the Java server is the only thing holding the database connection, it is also the only place that can truly enforce a **business rule** — a condition that decides what each user is allowed to do. Putting that same check in Angular is not wrong as a first barrier, to improve the experience and avoid unnecessary requests, but it is not real security: anyone can open the browser's *Network* tab and call the endpoint directly, bypassing the Angular code entirely. The only rule that truly counts is the one living in the backend.

> **Java is the language; Spring Boot is a framework written in that language.** These two get mixed up as one thing early on, and untangling them now saves a lot of confusion later. Java gives you classes, types, methods and exceptions. Spring Boot is a large pile of Java other people already wrote, which you download and use — the same way you pull npm packages in Node.
>
> Those downloads arrive as `.jar` files. There is nothing magic about a `.jar`: it is a compressed archive holding already-compiled classes, the `.class` files the next section talks about. You never open one, and you never download one by hand: you write in a configuration file which libraries you need, your build tool downloads them into a folder on your machine, and from then on the compiler and the JVM look for classes inside those `.jar` files exactly as they look for yours. That build tool is Maven, and how you declare that list of libraries is the subject of [16-maven.md](16-maven.md).
>
> What all that code buys you is the parts nobody wants to write by hand: opening a port so the server sits there listening for requests, turning the text of an HTTP request into Java objects, and **mapping a database row onto an object**. That last one means taking a row from a table — say `(3, 'Ana', 'ana@mail.com')` from the `users` table — and building a Java `User` object out of it whose `id`, `name` and `email` fields already hold `3`, `"Ana"` and `"ana@mail.com"`. Without that mapping you would read column by column and assign them by hand on every query; with it you work with ordinary objects and forget there are rows and columns underneath.
>
> For example, when you write `@RestController`, you are not using a new piece of Java syntax — you are using an **annotation**, an ordinary language feature: a marker Java lets you attach to a class or a method, which some other tool then reads and acts on to decide what to do. Here, that tool is Spring Boot's own code, which looks for `@RestController` and, on finding it, registers that class as a controller that handles HTTP requests. Annotations as a language feature in their own right are explained in [15-annotations.md](15-annotations.md). Everything in these notes is plain Java, independent of any framework — annotations themselves included — which is why it stays true no matter which framework you end up working in.

---

## From source code to bytecode to execution on the JVM

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) for compilation and "Java Virtual Machine" (section 5) for execution

This section comes this early because everything else rests on it: **Java is a compiled language**. That single fact is what explains why the language forces you to declare types, why some errors stop you before launch and others do not, and why the same compiled file behaves identically on your laptop and on a production server.

Writing a `.java` file is not enough for its instructions to run. The code you write is **source code**, meant to be read by people and by the Java compiler. A processor does not execute that source file directly, so Java uses two distinct stages:

1. **Compilation:** the Java compiler, called `javac`, reads the source code. It checks Java's syntax and typing rules; if those checks pass, it translates the source into **bytecode** and writes that bytecode into a `.class` file.
2. **Execution:** a **JVM** (Java Virtual Machine) loads the bytecode and executes its instructions as a Java program.

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

Read the diagram top to bottom. The `.java` file is the input, `javac` acts as checkpoint and translator, the `.class` file holds the resulting bytecode, and a JVM is the engine that runs it.

> **Bytecode is the delivery format.** It is neither the Java source you wrote nor the processor-specific machine code your CPU executes directly. It is the instruction format the compiler hands to a JVM. To work with Java at junior level this relationship is enough: you do not need to learn individual bytecode instructions, class loading, or JVM optimisations to understand this process.

Say your source contains a small price calculation:

```java
int quantity = 2;
int unitPrice = 15;
int total = quantity * unitPrice;
System.out.println(total);
```

When the source respects Java's rules, `javac` can produce bytecode for those instructions. Then, when a JVM executes that bytecode, the program prints:

```text
30
```

The two stages stay separate even though IntelliJ hides them behind a single green Run button. The compiler has to accept the source before the JVM can run the new version, always.

> **There is exactly one case where no `.class` file appears on disk.** It is the shortcut for running a single loose file without compiling it yourself first, which you will meet further down in "The smallest Java program that runs". When you launch `java Hello.java`, the compiler still does its job exactly as usual, but it leaves the bytecode in memory instead of writing it, so the only thing left in the folder is the `.java` you started with. The shortcut hides the compiler; it does not skip it. Any real build does write the files — with Maven, into the `target/classes/` folder.

> **A JVM does not check your original source code.** By the time the execution stage arrives, the compiler has already translated the accepted source into bytecode. That is why a `javac` message and a failure during execution on the JVM belong to different moments.

---

## Compile-time failures versus runtime failures

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) and "Java Virtual Machine" (section 5) for the boundary between compiler rejection and execution

The two stages you just walked through draw a boundary, and each kind of error shows up on a different side of it. The fastest way to classify a failure is to ask yourself:

> **Did `javac` reject the source, or did a JVM get as far as starting to execute its bytecode?**

Use the same price calculation to compare the three outcomes.

### Syntax and type errors — rejected at compile time

A **syntax error** breaks Java's grammar: the source is not written in a form the language accepts. Dropping the semicolon on the first line is an example:

```java
// WRONG — the statement is missing its mandatory semicolon
int quantity = 2
int unitPrice = 15;
```

`javac` rejects it with a compiler message like this:

```text
error: ';' expected
```

A **type error** combines values in a way Java's typing rules do not allow. Here the multiplication operator gets an integer on one side and text on the other:

```java
// WRONG — "15" is text, not an integer
int quantity = 2;
int total = quantity * "15";
```

`javac` reports:

```text
error: bad operand types for binary operator '*'
```

In both cases the reason differs, but the outcome is the same: `javac` rejects the modified source before a JVM can execute that version.

```text
source code
    │
    ├── invalid syntax ──────► javac rejects it
    │
    └── incompatible types ──► javac rejects it
```

**How to tell, sitting in front of the screen, whether what you are looking at is a compile-time failure or a runtime one.** You do not have to reason it out: the message itself tells you, and in IntelliJ it also shows up in two different places. These are the three signals:

| Signal | Compile-time failure | Runtime failure |
|---|---|---|
| How the message starts | `error:` followed by the file, the line and a `^` pointing at the character | `Exception in thread "main"` followed by the full name of an exception class |
| Did any output appear? | No. The program never started, so it printed nothing | Yes. Everything the program printed before failing is there, above the error |
| Where it shows in IntelliJ | Red underline in the editor before you press Run, and in the *Build* tab | In the *Run* tab, the same console where you were watching the program's output |

The middle row settles almost every doubtful case: if any line of your program made it to the console, the program started, and if it started then `javac` had already said yes. Anything failing from that point on is runtime.

> **Compile time is a checkpoint, not a running program.** While `javac` checks the source, none of your application's instructions are executing. Runtime error-handling code therefore cannot catch a compile-time failure: there is no execution yet in which to catch it.

### Exceptions — valid source that fails at runtime

Some source is valid even though particular runtime values make an operation impossible. Dividing one integer by another is a valid operation in Java, so this code passes compilation:

```java
int unitPrice = 15;
int divisor = 0;
int total = unitPrice / divisor;
System.out.println(total);
```

The problem only appears when a JVM executes the division with `divisor` equal to zero. Java creates and throws an **exception**: an object reporting a problem met while the program is running. The exact exception message starts like this:

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
```

Program execution reached the division, so this is a **runtime failure**. If nobody catches that exception, the program stops right there and prints that line together with the list of methods that were in flight at the time, which is what lets you locate where it happened.

> **Why can't the compiler reject this earlier?** The `int / int` operation is allowed. In a real program, `divisor` could come from user input, from a calculation, or from a database while the program is running, so its actual value is usually not fixed by the source line. The compiler checks whether the operation is valid for the declared types; execution reveals whether the values make that valid operation fail.

The mechanics of throwing, catching and propagating exceptions belong to [11-exceptions.md](11-exceptions.md). For now, hold on to this: an exception can only appear after execution has begun.

### Logic errors — execution finishes, but the answer is wrong

A program can also compile and finish without throwing anything, and still produce a wrong result. The requirement says the total is the quantity **multiplied** by the unit price; if you carelessly write an addition instead of a multiplication, the program compiles and runs without complaining:

```java
int quantity = 2;
int unitPrice = 15;

// WRONG for the requirement "quantity multiplied by unit price"
int total = quantity + unitPrice;
System.out.println(total); // prints 17
```

Every instruction is valid. `javac` accepts adding two integers and a JVM executes it correctly. The failure is in the reasoning the code expresses: the program does what you wrote, but not what the requirement asked for. This is a **logic error**, and it is found by comparing the actual result against the expected one, often through a test.

> **Compiling proves the source respects Java's rules, not that it solves the right problem.** The compiler does not know the business requirement "multiply quantity by unit price", so it cannot decide that `*` should have been used instead of `+`.

The table below classifies the same example by the boundary it crosses:

| Problem | Does `javac` accept the source? | Does execution start? | How it shows up |
|---|---:|---:|---|
| Missing `;` | No | No | Compiler message for a syntax error |
| `int * String` | No | No | Compiler message for a type error |
| Integer division by zero | Yes | Yes | `ArithmeticException` interrupts execution |
| Addition instead of multiplication | Yes | Yes | The program finishes with a wrong result |

Read the first two columns together: if `javac` says no, the failure happens at compile time; if both say yes, only running and observing the program can reveal an exception or a logic error.

```text
source code
  │
  ├── javac rejects it ──────────────► compile-time failure
  │                                     syntax error or type error
  │
  └── accepted ─► bytecode ─► JVM
                              ├────────► exception: execution is interrupted
                              └────────► logic error: execution finishes,
                                                      but the result is wrong
```

### Which of the three is cheapest to find

The three do not cost the same, and the gap between them is wide enough to matter.

A **compile-time failure** costs you seconds. `javac` reads every line of the source, whether it would ever run or not, so it finds the error without needing the exact conditions that trigger it to occur first. It also tells you the file, the line and the exact character, with a `^` underneath. And it does all that before the program has run even once, so nobody but you ever sees it.

An **exception** costs more, because nobody finds it until the failing line actually runs. The division above is invisible until a request arrives where `divisor` really is `0`; with any other value that same code works fine. The good part is that when it finally happens, it does not go unnoticed: execution stops and Java prints the exception type, its message, and the list of methods in flight at that moment — the **stack trace** — which points you at the exact line.

A **logic error** is the expensive one, for a very concrete reason: neither of the two checks is even looking for it. The compiler checks that the code respects Java's rules. The JVM checks that each operation is possible with the values it received. Nowhere in that process is there a copy of what you *meant* the program to do. `quantity + unitPrice` is a perfectly legal addition of two `int`s, so the program compiles, runs, finishes cleanly and prints `17` without a care. The only thing that catches it is comparing the result against the expected one: you reading the output, a colleague reviewing the code, or a test asserting that it should have been `30`. If nobody catches it, nothing crashes; it just invoices the customer the wrong amount, silently, for months.

| Failure | What finds it | When | What it costs if missed |
|---|---|---|---|
| Syntax or type error | `javac` | Before the program even starts | Seconds, and only your own time |
| Exception | The JVM, when that line runs | Only on the path that actually fails | A visible crash with a stack trace |
| Logic error | A person or a test comparing expected against actual | Possibly never | Wrong data, produced silently |

Read this table top to bottom as a ladder of cost, not as a list of three equivalent things: the further down, the later the failure is discovered and the more it costs. The "when" column is really the price column, because a failure is cheap to fix the moment you write it and expensive once it has been running in production for a month.

> **This ladder explains two habits that look like extra work.** Everything Java forces you to write out — declaring a type on every variable, refusing to compile over a missing semicolon — serves to move as many failures as possible into the top row: it turns them into compiler errors, which are the cheap ones. And tests are the only thing that covers the bottom row, because a logic error has no other detector. That is exactly why project 07 is the first of your projects to plan real tests. Its Step 8 writes one JUnit test per service method, asserting the business rules themselves — that approving an entry which was never submitted throws an exception, that the summary's approved hours match the per-project sum. Projects 01 to 06 only ever shipped the empty `should be created` specs the Angular CLI generates, which assert nothing about what the code was supposed to compute.

---

## Five traits that come back in every later chapter

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → read: the section on statically typed languages, for why the type check happens before execution instead of during it

Java has a personality, and it is remarkably consistent. Five traits explain almost every "why does it make me do that?" moment you are going to have, and each one is picked up in full by a later file.

**1. Static typing — the type is part of the declaration, and it never changes.** When you write `int quantity = 2;`, the name `quantity` is bound to the type `int` for the rest of its life. This is not just a rule to memorise, it is a concrete mechanism: because the type is written down in the source itself, the compiler can reason about a line *without ever running it*. It does not need to know that `quantity` will be `2` at one moment and `40` at another — it only needs the declared type to decide whether an operation is legal. That is why Java can reject code before it ever launches, instead of letting that same error only surface at runtime, on the day the program finally executes the operation that was not allowed. This trait is explained in [01-variables-types.md](01-variables-types.md), and it returns with force in [09-generics.md](09-generics.md), where the type of the values *inside* a collection is itself declared and checked.

**2. All executable code lives inside a class.** It is the direct consequence of the object-oriented model you read about in the first section. In JavaScript you can put a function alone in a file and export it. Java has no equivalent: `main`, and every other method, has to belong to some class. The reason has to do with how the compiler stores the result: it emits one `.class` file per class, so a class is the smallest unit that can be compiled and loaded on its own. What a class actually is, what it holds, and how you design one is [06-oop-classes.md](06-oop-classes.md).

**3. Compile first, run second — always two moments.** It is the process you just walked through in the two sections above. Even when IntelliJ hides both stages behind one green button, they stay two separate moments with two different kinds of error, and knowing which of the two is speaking to you — the compiler, or the program already running — tells you immediately where to look for the problem. [16-maven.md](16-maven.md) is the tool that automates both steps once a real project has dozens of source files and external libraries to fetch before it can even compile.

**4. The compiler generates code for the JVM, not for your processor.** What `javac` produces is not instructions for your particular processor, but bytecode for an abstract machine: the JVM. A distinct JVM exists for Windows, for macOS, for Linux, and for whatever your employer runs in production, and every one of them executes that same bytecode. This is the origin of Java's old slogan, *write once, run anywhere*, and it is not marketing: the `.class` file you generate on your Windows laptop — the compiled bytecode, also called the "artifact" — is exactly the same file a Linux server runs in production, unchanged and without recompiling it. The JVM is also what manages memory for you while the program runs, instead of you having to reserve and release it by hand, and that is the subject of [05-memory-model.md](05-memory-model.md).

> **JDK, JRE and JVM: what each one is.** The three names show up together constantly and are easy to confuse, so it is worth pinning them down now. The **JDK** (Java Development Kit) is what you installed, and it is the full package: it brings the tools to **develop**, among them `javac` (the compiler), `jar` (the packager that creates `.jar` files), `javadoc` (the documentation generator that reads your comments) and `jdb` (the debugger). The **JRE** (Java Runtime Environment) is the subset that only serves to **run** already-compiled programs: the `java` launcher plus the standard library, meaning all the classes Java gives you ready-made, like `String`, `List` or `LocalDate`. And the **JVM** is the virtual machine inside both: the engine that loads bytecode and executes it. In short, JDK ⊃ JRE ⊃ JVM.
>
> One practical detail: since Java 9 the JRE is no longer distributed separately, so today you install a JDK and that is that. The distinction still comes up in interviews and in older documentation, which is why it is worth having straight. The full breakdown is in [Baeldung — Difference Between JVM, JRE, and JDK](https://www.baeldung.com/jvm-vs-jre-vs-jdk).

**5. More explicit code, by design.** Java spells out explicitly a lot of things that JavaScript or TypeScript leave for the language itself to infer. For example, a data shape you declare in TypeScript as a four-field interface:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
```

becomes this in classic Java:

```java
public class User {

    private final int id;
    private final String name;
    private final String email;
    private final int age;

    public User(int id, String name, String email, int age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getAge() { return age; }
}
```

Compare the two blocks: four private fields, a constructor that receives and assigns each of them one by one, and four *getter* methods — one per field, so that field can be read from outside the class — against TypeScript's seven lines. That is quite a bit more code to represent exactly the same information.

This is a design decision, not an oversight. Java optimises for the person *reading* code they did not write, years later, over the person writing it today: the more explicit the code, the less guessing it requires. The language has also been trimming that extra code where it can. *Records*, in [06-oop-classes.md](06-oop-classes.md), collapse that same kind of data class — a class whose only job is to hold a handful of related values, with no logic of its own — into a single line. And *lambdas*, in [12-streams-lambdas.md](12-streams-lambdas.md), do the same when what you want to pass is not a piece of data but an action, like the very function that decides how to compare two elements when sorting them.

| Trait | What it forces on you | Where it is examined in full |
|---|---|---|
| Static typing | Declare a type and keep it; the compiler checks every use before launch | `01-variables-types.md`, `09-generics.md` |
| Code lives in a class | No standalone functions; a class is the unit of compilation | `06-oop-classes.md` |
| Compile, then run | Two separate steps — compile first, then run —, two moments, two kinds of error message | this file, then `16-maven.md` |
| The JVM is the target | The compiler produces bytecode for the JVM, not for your processor; and the JVM manages memory for you | `05-memory-model.md` |
| More explicit code | More typing, optimised for the reader rather than the writer | `06-oop-classes.md`, `12-streams-lambdas.md` |

---

## Coming from JavaScript — where the comparison helps, and where it lies

Docs: [Baeldung on Computer Science — Statically Typed vs Dynamically Typed Languages](https://www.baeldung.com/cs/statically-vs-dynamically-typed-languages) → read: the section on dynamically typed languages, which is the JavaScript side of every contrast below

### What works the same in both languages

The syntax of `if`, `while` and `for` is the same. So is the way you walk a **collection**, which is the name Java gives to any object holding several elements inside it. There are three basic shapes: a **list**, which keeps its elements in order and allows duplicates; a **set**, which guarantees no order and allows no duplicates — add the same element twice and only one stays inside; and an **array**, the simplest of the three, a fixed-length row whose size is decided the moment you create it and never changes afterwards. The other two can grow and shrink, and all of them are studied in [10-collections.md](10-collections.md).

To walk a whole collection from start to finish, JavaScript has the `for...of` loop: on each pass it puts the next element into the variable you declared and runs the loop body with it.

```javascript
const names = ['Ana', 'Luis'];
for (const name of names) {
  console.log(name);
}
```

Java does exactly the same thing and only the punctuation changes: where JavaScript writes `of`, Java writes a colon, and the variable is declared with its type in front.

```java
List<String> names = List.of("Ana", "Luis");
for (String name : names) {
    System.out.println(name);
}
```

Both loops print `Ana` and then `Luis`. In neither of them do you keep an index yourself or ask how many elements there are: the loop walks the whole collection and stops on its own when it runs out. In Java that loop is called the _for-each_ loop. (`List.of(...)` creates a list holding the elements you pass it; lists are the subject of [10-collections.md](10-collections.md).)

Adding a number to a piece of text with `+` concatenates in both languages, so `"total: " + 30` produces `"total: 30"` exactly as you expect. And `final` on a variable does the same job as `const`: both lock the variable, not the contents of what is inside it. Declare `final List<String> names = new ArrayList<>();` and you cannot reassign `names` to a different list, but you can still add and remove elements from the list it already holds. [01-variables-types.md](01-variables-types.md) takes it further.

`try { } catch (e) { }` is also written the same way in both languages, and that is exactly why it deserves the callout below before you go on.

> **`try/catch` is written the same way in Java and in JavaScript, but the exception model underneath is different.** The syntax looks identical, so it is tempting to read one as the other. Underneath they are nothing alike.
>
> An **exception** is how Java reports that something went wrong while the program was running. When an operation cannot finish — a file that does not exist, a division by zero — the code **throws** an object describing that failure; the method it happened in stops right there, and that object travels back, method by method, until one of them **catches** it and decides what to do with it. If nobody catches it, the program stops.
>
> So far, JavaScript does something similar. The difference is that Java splits exceptions into two families, and with one of them the compiler gets involved: **checked** ones and **unchecked** ones.
>
> With checked exceptions the compiler turns strict: if your method calls something that can throw one — reading a file, for instance, which is what `Files.readString` does in the code below — it will not let you compile until you say what you intend to do about that failure. And you only have two possible answers, both written in the code:
>
> - you catch it right there with a `try/catch` and deal with the problem yourself:
>
>   ```java
>   public String readConfig() {
>       try {
>           return Files.readString(Path.of("config.txt"));   // reads a whole file as text
>       } catch (IOException e) {
>           return "";   // no file: carry on with the default configuration
>       }
>   }
>   ```
>
> - or you write `throws IOException` in your method's signature, which means "not my job":
>
>   ```java
>   public String readConfig() throws IOException {
>       return Files.readString(Path.of("config.txt"));   // if it fails, it is my caller's problem
>   }
>   ```
>
>   The failure then passes to the method that called yours, and that method meets the same obligation: either it catches it, or it declares it again. So it keeps climbing from method to method until one catches it, or until it reaches the very top and the program stops.
>
> **Unchecked** exceptions are precisely the ones the compiler does not police — the `ArithmeticException` from dividing by zero is one of them: you declare nothing and catch nothing, and if nobody catches one, the program stops when it reaches that point.
>
> What matters is not which option you pick, but that picking is mandatory: it is a condition for the program to compile at all, and there is nothing like it in JavaScript. Applying your JS habits here therefore produces code that plainly does not compile, with a message that means nothing until you know this model:
>
> ```text
> error: unreported exception IOException; must be caught or declared to be thrown
> ```
>
> Exceptions in full — the two kinds, how one is thrown, where it travels until somebody catches it, and how to read the trace it prints when nobody does — are explained from zero in [11-exceptions.md](11-exceptions.md).

### What looks like it works the same, and does not

#### `var` does not mean the same thing in Java as in JavaScript

Java reused the keyword, but gave it nearly the opposite meaning. In JavaScript, `var` declares a variable with no type at all. In Java, `var` means "work the type out from what I am assigning, then hold me to it forever", for example:

```java
// ✅ fine — javac, the Java compiler, infers int from the initialiser
var total = 30;

// ❌ WRONG — total is an int, permanently
total = "thirty";
```

```text
error: incompatible types: String cannot be converted to int
```

So `var` does not commit any typing error: the type is still fixed the moment you write the line, you just did not have to spell it out — it is a shorthand *inside* the type system, not a hole in it. It is worth using when the type is already obvious from the right-hand side of the assignment, as in the example above; avoid it when it hides the real type and makes the code harder to read. [01-variables-types.md](01-variables-types.md) has the full section.

#### An object's shape is fixed at compile time

In JavaScript you can attach a property to an object whenever you like and the object simply grows. In Java the set of fields is decided by the class: only the fields the class declared exist, and one it never declared does not. For example, this `Customer` class declares only `name` and `email`:

```java
public class Customer {
    private String name;
    private String email;
}
```

```java
Customer customer = new Customer();

// ❌ WRONG — the Customer class declares no field called age
customer.age = 30;
```

```text
error: cannot find symbol
        customer.age = 30;
                ^
  symbol:   variable age
  location: variable customer of type Customer
```

It is worth recognising that message early, because `cannot find symbol` is the error you will hit most in your first weeks. It always means the same thing: the compiler looked for a name — a variable, a method, a class — and nothing by that name exists anywhere the compiler can see from that line.

#### `==` is not asking the same question in Java as in JavaScript

In JavaScript you have two equality operators. `===` is **strict equality**: it compares whether the type and the value match on both sides. `==` is **loose equality** (also called abstract or non-strict): it first tries to convert one of the two sides so the types match, and only then compares — that is what type coercion means.

In Java there is no `===`, and Java's `==` performs no coercion at all. When used on objects — two `String` variables, for instance — it asks "do these two variables point at the same object in memory?". And that is almost never the question you meant to ask when comparing two pieces of text, because two texts with identical content can perfectly well be two distinct objects stored in two different places in memory. Getting this wrong is the most common beginner bug in Java.

This comparison will come up in two places, and each one is solved differently.

The first is comparing the content of two `String` variables — that is, of two pieces of text — which is the one you will hit soonest. It is answered in the very next file: [01-variables-types.md](01-variables-types.md) shows that the method you actually wanted for comparing two `String`s is `.equals()`, which compares the real content, character by character, instead of the memory address. That file also explains why writing two bare text literals, like `"hola" == "hola"`, makes `==` appear to work correctly just often enough to fool you: Java reuses the same object in memory for identical text literals, so that particular case really does point at the same place, even though the general rule still is not that.

The second place you meet this comparison is when comparing two objects of a class you wrote yourself — a `User` against another `User`. There, calling `.equals()` is not enough on its own, because Java cannot guess what it means for two users to be "the same". Same `id`? Same email? That decision is yours, and you write it out for Java inside the class. How that is done is in [06-oop-classes.md](06-oop-classes.md).

#### TypeScript's types disappear before execution; Java's do not

TypeScript never actually runs: before reaching the browser it is **transpiled**, meaning translated into ordinary JavaScript, and in that translation the types fall away because JavaScript would not know what to do with them. The file running in the browser contains no types at all, so during execution nobody is left checking anything. Java is the exact opposite: the types you declare survive compilation, are written inside the `.class` file, and the JVM itself rejects a conversion that does not fit at runtime.

There is one single exception, and that is generics. A generic's **type argument** — which is the correct term for it: the concrete type you write between the `<` and `>` signs, the `String` in `List<String>` — is checked during compilation and then discarded. So at runtime a `List<String>` and a `List<Integer>` are exactly the same type: a plain `List`. That discarding is called *type erasure*.

What the erasure stops you doing is asking about the type argument once the program is already running. In practice, three things do not compile:

```java
// ❌ WRONG — that information no longer exists at runtime
if (list instanceof List<String>) { }

// ❌ WRONG — nobody knows any more what T was
T[] copy = new T[10];

// ❌ WRONG — after erasure these are the same method written twice
void process(List<String> names) { }
void process(List<Integer> ages) { }
```

[09-generics.md](09-generics.md) develops all of it.

### Summary table

| JS/TS habit | What JavaScript/TypeScript does | What Java does | Same behaviour? |
|---|---|---|---|
| `for...of` over an array | `for (const name of names)` iterates its elements one by one | `for (String name : names)` iterates a collection the same way | Yes |
| `const` | Locks the variable, not what it holds | `final` does the same | Yes; `01` explains the nuance |
| `try / catch` syntax | `try { } catch (e) { }` | Written identically, but the exception model underneath differs | In syntax only |
| `var` | Declares a variable with no type at all | Infers one fixed type and enforces it forever | No — nearly the opposite meaning |
| Adding a property at runtime | The object grows with any new property | Only the class declares fields; none can be added later | No — raises `cannot find symbol` |
| `==` versus `===` | Compares with or without type coercion | `==` on objects compares whether they point at the same object in memory, not whether the content matches | No — use `.equals()` |
| Types erased at compile time | Types vanish at compile time; nothing checks them at runtime | Types survive into the bytecode | No — except for generics |

Read the last column as each row's verdict: "Yes" means you can bring your JavaScript habit across unchanged, and anything else means that habit is going to cost you an error, whether from the compiler or as a wrong result.

---

## The smallest Java program that runs

Docs: [Baeldung — Java main() Method Explained](https://www.baeldung.com/java-main-method) → read: the opening explanation of the standard signature, where `public` and `static` are taken apart word by word

In JavaScript, a file with a single line is already a program. The smallest runnable Java program is made of three pieces: a class whose name matches the file's, a `main` method with an exact signature — which is where the JVM starts executing — and something that produces output so you can see that anything happened at all.

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}
```

To see it work you save it in a file called `Hello.java` and go through the two stages from "From source code to bytecode": compile first, then run. In IntelliJ that is a single green Run button, and that is what you will always use. Underneath, that button launches two distinct programs that ship inside the JDK you installed: `javac`, which turns `Hello.java` into `Hello.class`, and `java`, which starts a JVM and executes that `.class`. Typed by hand in a terminal they would be these two commands, and seeing them helps you understand what the button does, even though you are never going to type them:

```text
javac Hello.java     ← javac is the compiler: it reads Hello.java, checks it and emits Hello.class
java Hello           ← java is the launcher: it starts a JVM, loads Hello.class and runs it
```

Notice one detail that trips people up at first: when compiling you write the name of the **file** with its extension (`Hello.java`), and when running you write the name of the **class** without one (`Hello`), because from that point on you are no longer working with your text file but with the compiled class. The console output is:

```text
Hello from Java
```

**The file name is not a convention, it is a rule.** If you declare `public class PriceCalculator`, the file has to be called `PriceCalculator.java`: the exact same name, capitalisation included, plus the `.java` extension. If you save that same class in a file with a different name, say `Wrong.java`, it does not compile:

```java
// file: Wrong.java
// ❌ WRONG — this file should be called PriceCalculator.java
public class PriceCalculator {
}
```

```text
error: class PriceCalculator is public, should be declared in a file named PriceCalculator.java
```

The reason is that both the compiler and the JVM find a class *by its name*: when something asks for `PriceCalculator`, the tool goes looking for `PriceCalculator.class`, produced from `PriceCalculator.java`. Having the two names match turns "find this class" into a predictable file lookup, rather than a search across every file on disk.

**`main` is the entry point: that is where the program starts executing.** A program has to start at some specific line, and in Java that line is always inside a method called `main`. When you run `java Hello`, the JVM loads the `Hello` class, looks inside it for a method with exactly this shape and calls it; that is where your program starts, and when that method finishes, the program finishes.

There can be many classes with a `main` in the same project — each one would be a separately launchable program — but in any given run only the `main` of the class you launched is used. Every word of that signature is doing a job:

```text
public static void main(String[] args)
  │      │     │    │      │
  │      │     │    │      └─ the data handed to the program at launch, in an array of text
  │      │     │    └─ the fixed name the JVM looks for — no other will do
  │      │     └─ returns nothing
  │      └─ can be called without creating an object of the class first
  └─ visible from anywhere, including outside this class's own package
```

> **Why always `String[] args`?** Because a program can be launched with data written right after the class name: `java Hello Ana 30`. Those two values arrive in your `main` inside `args`, which in that case would hold `["Ana", "30"]`. And it is of type `String` because everything typed in a terminal is text: that `30` arrives as the text `"30"`, not as the number `30`, and if you need it as a number you have to convert it yourself. `args` has to appear in the signature even if you never use it — as happens 99% of the time — because this is the exact shape the JVM and build tools recognise as an entry point.
>
> **And isn't an array, being fixed-length, exactly the wrong choice here?** It is the reasonable doubt, and the answer is in *when* that length gets fixed. "Fixed-length" does not mean the size is written in your source; it means the size is decided the instant the array is created, and never changes after that. And you are not the one creating this array: the JVM creates it at launch, when it already knows perfectly well how many values you typed after the class name. With `java Hello Ana 30` it counts two, creates an array of size 2, fills it and hands it to your `main`. Throughout the whole run those arguments are never going to grow or shrink, so an array fits perfectly: what you cannot do is add a third argument halfway through the program, and that is something nobody needs to do.

There is one word left to take apart from that last line: **package**. A package is the folder a class belongs to, but written with dots instead of slashes. The classes of your TimeTrack project live on disk inside `src/main/java/com/victor/timetrack/`, which is why the first line of code in every one of them is:

```java
package com.victor.timetrack;
```

It is the same `com/victor/timetrack` path, with dots where the slashes were. Classes in subfolders belong to subpackages: `.../timetrack/service/TimeEntryService.java` is in the package `com.victor.timetrack.service`. The folder path and the package name always have to match, and the reason is the same as before: it is how the compiler and the JVM know which folder to look in for a class's file given its name.

What all that is for: the package is the class's surname. Your service's full name is not `TimeEntryService` but `com.victor.timetrack.service.TimeEntryService`. That is what lets two classes with the same short name exist without colliding. You could perfectly well have a second `TimeEntryService` class in a different package — say `com.victor.timetrack.admin.TimeEntryService` — and the two would coexist without trouble, because their full names differ. It is the same thing that would let you write your own `List` class without clashing with the `List` you will use daily, which is really called `java.util.List`. That is what a **namespace** is: a scope within which each name identifies exactly one thing.

**And packages are also the visibility boundary, which is what `public` was measuring in `main`'s signature.** The rule: a class or method marked `public` can be used from any package; without `public`, it can only be used from classes in that same package. So `public` opens the door outwards, and its absence leaves it shut inside the package.

Applied to `main`, that explains why it carries `public`: whoever calls `main` is not another of your classes, it is the JVM, which is code sitting outside your project and therefore outside all of your packages. Without `public`, the JVM could not call it. The full visibility rules — there are four levels, not two — are in [06-oop-classes.md](06-oop-classes.md).

If the class you try to launch has no `main` method, the class compiles perfectly well — as a class there is nothing wrong with it — and the failure arrives later, from the JVM, at the exact moment you try to start it:

```text
Error: Main method not found in class NoMain, please define the main method as:
   public static void main(String[] args)
```

> **Why does this fail at launch and not at compile time?** Because a class with no `main` is a perfectly normal and useful class: in any project, the vast majority of classes have no `main` and are compiled and used constantly. Having an entry point is not something that can be demanded of every class; it is only needed in the class the program starts from. And the compiler cannot know which class that will be, because you decide it later, when you run `java Hello`. The JVM does know, because you just gave it the name. That is why the message above does not say "this class is badly written" but something far more literal: "I loaded the class you asked for, I looked inside for a `main` method, and I did not find one".

**For now, what you have just read about `public`, `static` and `String[]` is enough.** Each of those three words is an entire concept in its own right, and each has its own chapter later on: the full rules for `public` and `static` — who can see a class member, and whether that member belongs to the class as a whole or to each object separately — are in [06-oop-classes.md](06-oop-classes.md); `String[]` is explained alongside the other ways of holding several values, in [10-collections.md](10-collections.md). Here it is enough to recognise the template and be able to copy it, because every example in the following chapters prints something to the console and, to try them yourself, you are going to have to put them inside a `main` like this one.

**`System.out.println` is how you print something to the screen.** `System.out` is the program's standard output, which in your case is IntelliJ's console, and `println` writes whatever you pass it there and then moves to the next line. Its sibling `print` writes exactly the same thing without that line break, so two `print`s in a row leave the text stuck together on one line:

```java
System.out.print("Hola ");
System.out.print("Ana");
System.out.println("!");
System.out.println("Segunda línea");
```

```text
Hola Ana!
Segunda línea
```

Throughout your junior route this is going to be your main tool for seeing what is happening inside the program: you print the value of a variable in the middle of a method and check whether it is the one you expected.

> **In a real application you do not print with `System.out.println`, you use a logger.** The problem with `System.out.println` is that there is no way to switch it off: it is written into the code, so it always prints, in production too. A logging library — Spring Boot ships with one already configured — writes the same thing but adds the date and time, the class that wrote it, and an importance level (`INFO`, `WARN`, `ERROR`). That lets you say "in production I only want to see the `ERROR`s" by changing one line of configuration, without touching the code, and send that output to a file instead of the screen — which is exactly what you need when the program has been running for weeks on a server nobody is watching.

> **Preview:** the snippet below is from your own project and uses Spring Boot classes you have not studied yet. It is here only so you can see that the `main` signature you have just read is also the one that starts a framework application. `@SpringBootApplication` and `SpringApplication.run` are explained in due course in the Spring Boot notes.

`Hello` is not a toy example that real life does some other way. Any Java application starts exactly the same, through a `main` method, and a Spring Boot application is no exception. The file `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/TimetrackApplication.java` is barely a dozen lines long, and the one that matters is the signature you have just seen:

```java
@SpringBootApplication
public class TimetrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(TimetrackApplication.class, args);
	}

}
```

The whole TimeTrack backend — every controller, every security rule, the database connection — is set in motion from that single call to `SpringApplication.run`. Spring Boot does not replace Java's entry point: it is built on top of it.

> **Since Java 25 there is a shorthand way to write a program, and you will run into it in tutorials.** Everything you have read so far describes the full form: a class, and inside it a `public static void main(String[] args)`. Java 25 — the version you have installed and the one project 07 uses — added a shortcut that lets you write only this in a file, with no class around it and no `static`:
>
> ```java
> // shorthand form — valid only from Java 25 onwards
> void main() {
>     System.out.println("Hello from Java");
> }
> ```
>
> And launch it directly with `java Hello.java`, without compiling by hand first. Underneath, Java still creates the class and the full `main` for you; it just lets you not write them.
>
> It was added for a teaching reason: so a beginner's first Java lesson does not have to open by explaining `public`, `static` and `String[]`, three words that cannot be understood yet at that point. The catch is that no real project uses it — not project 07, and not the examples in these notes — because the moment you have more than one file you need real classes. So your rule is simple: if you meet it in a tutorial, recognise it and know that it is the same thing; but always write the full form yourself.

---

## The route from here to Maven, and why it runs in that order

Docs: [Baeldung — Get Started with Java](https://www.baeldung.com/get-started-with-java-series) → read: the ordered list of articles in the series, as a second opinion on how the same ground is usually sequenced

The learning route starts with the smallest piece there can be inside a program written in Java — a value — and ends with the tool that builds the whole project. Each file sits right in front of the file that needs it, and the journey runs in four stretches.

Every file below is named in full, and the number it starts with is its place in the route.

**Readings 01 to 04 — the data, and the instructions that manipulate it.** [01-variables-types.md](01-variables-types.md) teaches you Java's basic value types: whole and decimal numbers, booleans, when an `int` turns into a `long`, and why a decimal number is almost never exactly what you wrote. It goes first because every line you write afterwards manipulates some value, and in Java every value has a concrete, declared type. `02-strings.md` takes the kind of value you will touch the most, text, and explains why a `String` you appear to be modifying is really a new one every time. [03-control-flow.md](03-control-flow.md) introduces conditionals and loops: `if` to choose which lines run based on a condition, and `for` and `while` to repeat a block of code. And [04-methods.md](04-methods.md) teaches you **methods**, which are Java's equivalent of JavaScript's functions: a named block of code that takes parameters and returns a value. The only fundamental difference is that a method always lives inside a class.

**Readings 05 to 08 — memory and objects.** [05-memory-model.md](05-memory-model.md) teaches you what happens underneath when you call a method: what exactly gets copied when you pass it an argument, which area of memory each object lives in, and how the JVM keeps track of which method called which. It goes here because it is the mechanism that objects, exceptions and collections all lean on afterwards: understand it, and those three topics can be reasoned about instead of memorised. Only then does [06-oop-classes.md](06-oop-classes.md) build real objects, and it does so through the **constructor**: the method that runs at the moment the object is created and that can reject data which does not qualify, so that an invoice with no amount or a user with no email never comes into existence at all. That file also answers the question objects raise the moment they appear: when two of them count as equal. [07-interfaces-abstract.md](07-interfaces-abstract.md) teaches you **interfaces**: a list of methods a class commits to having, without saying how it implements them, so that the code calling those methods depends on no concrete class and you can swap the implementation without touching the caller. And [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md) explains how Java decides, at runtime, which of those implementations actually runs.

**Readings 09 to 12 — holding many objects, and handling failure.** [09-generics.md](09-generics.md) teaches you **generics**: what is written between the `<` and `>` signs of `List<String>`, which is the way to tell the compiler what kind of elements a collection holds. It deliberately comes before collections, so that when you reach [10-collections.md](10-collections.md) you are not facing syntax you cannot yet read. [10-collections.md](10-collections.md) is **collections** proper: lists, sets and maps, how you choose between them, and why searching inside them is fast. [11-exceptions.md](11-exceptions.md) develops **error handling** in full: how an exception is thrown, where it travels, where it is caught, and how to read the trace that appears when nobody catches it. It arrives at exactly this point because the earlier files have already taught you a good handful of operations that can fail — looking up an element that is not there, converting text into a number, walking a collection past its last index — so you already have concrete failures to practise on. And [12-streams-lambdas.md](12-streams-lambdas.md) closes the stretch with **lambdas** and **streams**: until then you only ever handed a method data, and a lambda lets you hand it an action as well — the condition you want to filter by, for instance — which is what makes walking and filtering an entire collection readable in three lines.

**Readings 13 to 16 — the special types, and the build.** [13-enums.md](13-enums.md) teaches you **enums**: when a value can only be one of a closed set — `PENDING`, `APPROVED`, `REJECTED` — an enum writes that complete list into the code, and from then on the compiler knows no other value is possible and can warn you if you left one of the cases unhandled. [14-dates.md](14-dates.md) takes **dates and times**, which are also values that never change once created: add a day to a date and you do not modify the one you had, you get a different one back. The difference from an enum is that here the possible values are infinite, so the compiler cannot check the list and there is no safety net to tell you the date you calculated was not the one you meant. [15-annotations.md](15-annotations.md) starts from `@Override`, the only annotation you will have used by then, and explains **annotations** in general: markers you put in the code that some tool reads afterwards. With that, the Spring annotations you see daily stop looking like secret language syntax: they are ordinary Java markers, and the tool that reads them is Spring's own code. And [16-maven.md](16-maven.md) closes with **Maven**, the tool that downloads the libraries, compiles, runs the tests and packages everything the previous fifteen files produced.

> **The number in a file name is its place in this route.** `01-variables-types.md` is reading 01, `11-exceptions.md` is reading 11, and so on, so opening the folder in alphabetical order already gives you the right order. Only `02` is missing today: that number is reserved for the text chapter and the file is not written yet. The table below therefore has no order column — the file name already carries it. The second column gives the one reason that file cannot be read any earlier.

| File in `en/` | Why it sits here |
|---|---|
| `01-variables-types.md` | Every later line manipulates a typed value |
| `02-strings.md` | Text is the value type you touch on every request |
| `03-control-flow.md` | Choosing and repeating needs values to choose between |
| `04-methods.md` | Packages that behaviour behind a callable contract |
| `05-memory-model.md` | Opens the method boundary: copies, references, the call stack |
| `06-oop-classes.md` | Builds objects out of methods and references, and defines equality |
| `07-interfaces-abstract.md` | Separates the behaviour needed from the class providing it |
| `08-inheritance-polymorphism.md` | Decides at runtime which implementation runs |
| `09-generics.md` | Teaches the angle-bracket syntax before collections use it everywhere |
| `10-collections.md` | Groups of objects, and the hashing that makes lookup fast |
| `11-exceptions.md` | The failures the earlier chapters made possible |
| `12-streams-lambdas.md` | Behaviour as a value, and the pipelines built from it |
| `13-enums.md` | A closed set of values the compiler can check exhaustively |
| `14-dates.md` | The same immutability applied where no compiler check exists |
| `15-annotations.md` | Metadata a tool reads — the shape of every Spring annotation |
| `16-maven.md` | The build that compiles, tests and packages all of the above |

With this you can place any problem inside Java's basic life cycle: the source is checked and compiled into bytecode, and then a JVM executes that bytecode. The route's first stop, [01-variables-types.md](01-variables-types.md), examines the declared types that underpin those compiler checks: which values Java lets each variable hold, and why incompatible types are rejected before execution.
