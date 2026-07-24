# Java Execution Foundations

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) and "Java Virtual Machine" (section 5) for the two stages from source code to execution

---

You already know that JavaScript can begin running a file and only discover a bad operation when execution reaches that line. Java puts a separate checkpoint before execution: a compiler checks the source first. That checkpoint explains both how a `.java` file becomes a running program and why some mistakes stop you before launch while others appear only after launch.

This first note follows that journey in two steps. You will see what `javac` produces and what a JVM executes, then use that boundary to distinguish compile-time failures from exceptions and logic errors. The next note builds on the same checkpoint by showing the types that the compiler checks.

---

## From source code to bytecode to JVM execution

Purpose: You use this pipeline whenever you build or run Java code, because it identifies which tool checks the source, what that tool produces, and what actually executes the result.

Docs: [Baeldung — Is Java a Compiled or Interpreted Language?](https://www.baeldung.com/java-compiled-interpreted) → read: "Java Compiler" (section 4) for compilation and "Java Virtual Machine" (section 5) for execution

Writing a `.java` file is not enough to make its instructions run. The text you write is **source code**, designed for people and the Java compiler to read. A processor does not execute that source file directly, so Java uses two distinct stages:

1. **Compilation:** the Java compiler, called `javac`, reads the source code. It checks Java's syntax and type rules; if those checks pass, it translates the source into **bytecode** and normally stores that bytecode in a `.class` file.
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

The two stages are separate even when IntelliJ hides them behind one green Run button. Conceptually, the compiler must accept the source before the JVM can execute the new version.

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

Every instruction is legal. `javac` accepts integer addition, and a JVM executes it successfully. The failure is in the reasoning expressed by the code: the program does what you wrote, but not what the requirement intended. That is a **logic error**, found by comparing the actual result with the expected result—often through a test.

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

You can now locate a problem on Java's basic lifecycle: source is checked and compiled into bytecode, then a JVM executes that bytecode. Next, [01-variables-types.md](01-variables-types.md) examines the declared types behind those compiler checks—what values Java lets each variable hold and why mismatched types are rejected before execution.
