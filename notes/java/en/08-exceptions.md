# Exceptions

> 📖 [Baeldung — Exception Handling in Java](https://www.baeldung.com/java-exceptions)
> 📖 [Oracle Docs — Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

Without exceptions, every method would have to return a special value (like `-1` or `null`) to signal that something went wrong, and the code that calls that method would have to remember to check that value every single time. That approach breaks down fast: it's easy to forget the check, the error signal gets lost after passing through a few calls, and you end up with silent bugs nobody notices.

A note on two terms people mix up, before looking at how an exception travels. The **call stack** is the live structure Java keeps while the program runs — like a stack of plates in a kitchen. Every time one method calls another, the new method is placed *on top* of the previous one — new methods end up higher on the stack and older ones lower. For example, if `main()` calls `methodA()`, and `methodA()` calls `methodB()`, the stack looks like this:

```
[top]    methodB()  ← currently executing
         methodA()
         main()
[bottom]
```

When `methodB()` finishes (executes its `return`), it is removed from the top of the stack — the one on top disappears first. Then `methodA()` finishes and is removed. Finally `main()`. This order is what "exiting in reverse order" means: the last one that entered is the first one that exits. In other words, LIFO (Last In, First Out).

The **stack trace** is a *snapshot* of that stack at the instant of the error: the text you see printed in the console listing the active methods at that moment. The `call stack` is the dynamic structure that changes constantly while the program runs; the `stack trace` is the printed copy of that structure at one specific moment. Because exceptions are ordinary objects in Java, they carry both the error message and that full stack trace inside them — so you know exactly where the problem happened and which methods the exception passed through to get there.

With both concepts clear, here's how an exception actually travels. Java throws an object that represents the error right at the method where the failure happens — always the one currently at the top of the stack, because only the method executing *right now* can fail right now. From there, the object does not "go up" in the literal sense of the diagram — it propagates **toward the caller** (the method that called it), following the same LIFO exit path a normal `return` would take, with one key difference: instead of returning its normal value, what reaches each caller is the exception object. So `methodB()` exits carrying the exception instead of a return value; if `methodA()` doesn't catch it with a `catch` block, it also exits toward `main()` carrying it.

If `main()` doesn't catch it either, that's the end of the road — `main()` is always the first method on the stack, so there's no caller above it to keep propagating the error to. The app terminates and Java prints the stack trace to the console: the list of methods that were active when the error happened (`methodB()`, `methodA()`, `main()`) and that the exception propagated through without anyone catching it.

> The phrase "propagates up the call stack" is the one you'll see in official docs, but don't picture it as an arrow going up in the diagram above. "Up" here means "toward the method that called it," which is drawn going *down* in the diagram — the exact same path a `return` follows, just interrupted by an error instead of a normal value.

---

## Checked vs unchecked exceptions

> Docs: https://www.baeldung.com/java-exceptions → read: "Checked Exception" and "Unchecked Exception"

Java divides exceptions into two families, and the difference isn't just naming — it's a rule the compiler actively enforces on one family and not the other.

**Checked exceptions** represent problems the caller is expected to anticipate because they depend on something external to the code itself — a file that might not exist, a network connection that might drop, a database that might be down. They're failures that can happen even if your logic is written perfectly. That's why the compiler forces you to do something about them: either catch them with `try/catch`, or declare in the method signature that your method might throw them using `throws` (covered in full in the `throws` section below). If you do neither, the code simply doesn't compile:

```java
public void readConfig() {
    Files.readString(Path.of("config.txt")); // COMPILE ERROR
    // Files.readString() declares "throws IOException" —
    // this method neither catches it nor declares it, so Java refuses to compile
}
```

Java refuses to compile exactly because that file might not exist at runtime, and the compiler won't let you ignore that possibility. The error you see here isn't a runtime exception (the program never even starts) — it's a compile error with a characteristic message: `unreported exception IOException; must be caught or declared to be thrown`. Only once you fix that (with `try/catch` or `throws`) does the code compile; and if you choose `try/catch`, the actual runtime error you'd see if the file didn't exist would be an `IOException` object (or its more specific subclass, `FileNotFoundException`) delivered to your `catch` block.

Here's the same contrast with real code, checked and unchecked side by side:

```java
// CHECKED — the compiler forces you to handle it
public String loadFile(String path) throws IOException {
    return Files.readString(Path.of(path)); // can fail for an external reason: the file doesn't exist
}

// UNCHECKED — nothing forces you to declare it, it's a bug if it happens
public int divide(int a, int b) {
    return a / b; // if b is 0, throws ArithmeticException with no warning — nothing requires declaring it
}
```

**Unchecked exceptions** (subclasses of `RuntimeException`) represent programming errors — a `null` that shouldn't be, an index that falls outside an array, an argument that makes no sense. These are bugs, not expectable external events: if your code were written correctly, they should never happen. That's why the compiler doesn't enforce anything — it wouldn't make sense to force you to declare every possible bug you might write in the signature of every method. They propagate freely toward the caller (the same LIFO path you already know from the section above) until something catches them or the app crashes.

> It's easy to fall into the same trap from earlier here: "propagates up" is the standard phrase in Java's documentation, but as you already saw, "up" means "toward the calling method," not "up in the stack diagram" — which is actually drawn going down. The stack in the earlier section is drawn correctly; it's the phrase "up" that's misleading if you take it literally. From here on you'll see both forms in real documentation (*"propagates up the stack"*) — when you see it, mentally translate it as "toward the caller."

| | Checked | Unchecked |
|---|---------|-----------|
| Parent class (`extends`) | `Exception` | `RuntimeException` |
| Must declare? | Yes — `throws` or `try/catch` | No |
| Represents | Expected external problems — the file doesn't exist, the database connection drops, a call to another API times out | Programming errors — bugs that shouldn't happen if the code is written correctly |
| Examples (real scenario) | `IOException` (reading a file that doesn't exist), `SQLException` (the database rejects the query or the connection drops) | `NullPointerException` (calling a method on something that's `null`), `IllegalArgumentException` (passing a value that makes no sense, like a negative age), `IndexOutOfBoundsException` (accessing position 10 of a 3-element list) |

The "Parent class" column shows which class each exception type inherits from — that's what determines whether the compiler treats it as checked or unchecked: any exception that extends `Exception` (but not `RuntimeException`) is checked; any exception that extends `RuntimeException` is unchecked. The full hierarchy is explained below in "Exception hierarchy."

In Spring Boot you almost always work with unchecked exceptions — even when the underlying problem is "external" (say, a resource missing from the database), the convention is to throw your own unchecked exception (like `EmployeeNotFoundException` below) and let Spring catch it globally with `@RestControllerAdvice`, instead of forcing every controller to declare `throws` and fill the code with repeated `try/catch` blocks.

Rethrowing a checked exception as unchecked — known as "wrapping" — looks like this in practice:

```java
public String loadFile(String path) {
    try {
        return Files.readString(Path.of(path));
    } catch (IOException e) {
        // you "wrap" the checked exception inside an unchecked one
        throw new RuntimeException("Could not read file: " + path, e);
        //                                                          ^ this second argument
        //                          is the "cause" — the original exception is kept inside
    }
}
```

`RuntimeException` (like almost every Java exception) has a constructor that accepts a `Throwable` as its second argument — the original exception (`e`) is stored as the **cause** inside the new one. This matters: you don't lose information, the original exception's stack trace is still available inside the new one (you'll see something like `Caused by: java.io.IOException...` at the bottom of the printed stack trace). The benefit is that `loadFile()` no longer needs `throws IOException` in its signature — the caller is no longer forced by the compiler to handle it, though it still can if it wants to with `catch (RuntimeException e)`.

> **Be careful "wrapping" a checked exception.** This is a valid and very common pattern in Spring Boot, but it drops the compiler's guarantee — from that point on, nothing forces you to remember to handle it. Do it deliberately (usually because you want to simplify your method signatures and let a `@RestControllerAdvice` handle the error centrally), not just to avoid writing `throws` without thinking about it.

JavaScript has nothing like this split — every JS error is effectively "unchecked": there's no compiler forcing you to catch or declare anything, no `throws` in a function signature, no compile error if you forget a `catch`. The checked/unchecked distinction is Java-specific (it also exists, with different nuances, in other typed languages like C# — though C# doesn't enforce it at compile time either), and it's exactly the kind of thing a JS developer trips over the first time the compiler refuses to build because a `catch` is missing.

---

## try / catch / finally

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html → read: "Catching and Handling Exceptions"

You wrap the risky code in a `try` block and handle each possible failure in its own `catch` block. `finally` runs no matter what — use it to close connections or release resources even when an exception occurs. The syntax itself will feel familiar: `try`/`catch`/`finally` works the same way in JavaScript — the difference in Java is what you're allowed to catch and what the compiler requires you to declare (see checked vs unchecked above):

```java
try {
    // code that might throw an exception
    String content = readFile("data.txt");
    int number = Integer.parseInt(content);
} catch (IOException e) {
    System.out.println("File error: " + e.getMessage());
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} finally {
    System.out.println("This always runs — clean up resources here");
}
```

- `catch` receives the exception object — use `e.getMessage()` for the message, `e.printStackTrace()` for the full trace
- Multiple `catch` blocks are checked from top to bottom — put more specific exceptions before more general ones
- `finally` always runs — used to close files, database connections, etc.

> **Why not leave a `catch` block empty?** An empty `catch` swallows the error silently — the program carries on as if nothing happened and you lose both the message and the stack trace, so the bug becomes invisible. At the very least log the exception; never write `catch (Exception e) {}`.

> **Why does `catch` order matter — what actually happens if you get it wrong?** Java checks `catch` blocks top to bottom and runs the *first* one whose type matches the thrown exception — it never checks further, even if a later block would also match. If the two exceptions are unrelated (like `IOException` and `NumberFormatException` above), the order is just a style choice. But if one is a superclass of the other — say `Exception` and `IOException` — and you put the superclass (`Exception`) first, the compiler refuses to build: `catch (IOException e)` becomes unreachable, since every `IOException` already matches `catch (Exception e)` above it. The exact error is `exception IOException has already been caught`. That's why the rule is "most specific first": it's not a style preference, it's what makes both blocks reachable at all.

> **Does `finally` run even if the `try` block has a `return`?** Yes — this is the gotcha every Java interview asks about. `finally` runs *before* the method actually returns, even if `try` already hit a `return` statement:
> ```java
> public int test() {
>     try {
>         return 1;
>     } finally {
>         System.out.println("finally runs first"); // prints before the method returns
>     }
> }
> // test() still returns 1 — but only after "finally runs first" is printed
> ```
> The one trap to avoid: if `finally` *also* has a `return`, it silently overrides the value from `try` — the `try` block's `return 1` is discarded and replaced. This is considered bad practice precisely because it hides a return value change inside cleanup code; never put a `return` inside `finally`.

### Catching multiple exceptions in one block

```java
try {
    // ...
} catch (IOException | SQLException e) {
    System.out.println("Data error: " + e.getMessage());
}
```

> Multi-catch only accepts exception types that have no parent-child relationship with each other. `IOException | SQLException` works because neither extends the other. `IOException | FileNotFoundException` would not compile, because `FileNotFoundException` already extends `IOException` — the compiler rejects it as redundant, since catching `IOException` alone already covers it.

---

## throw — manually throw an exception

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/throwing.html → read: "Throwing Exceptions"

You use `throw` when you detect an invalid state in your own code and want to stop execution immediately with a clear explanation — for example, when a caller passes a value that makes no sense:

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative: " + age);
    }
    this.age = age;
}
```

Always throw with a message that explains what went wrong and what value caused it.

`throw` is the same keyword you already know from JavaScript — the difference is what you throw. JS lets you throw any value (a string, a number, a plain object); Java only lets you throw an object whose class extends `Throwable`, which is why every exception you throw has to be a real exception class.

---

## throws — declare checked exceptions

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/declaring.html → read: "Specifying the Exceptions Thrown by a Method"

Checked exceptions must be declared at the method signature level so the compiler forces every caller to decide: handle it here, or pass it up. If a method can throw a checked exception and does not catch it, it must declare it with `throws`:

```java
public String readFile(String path) throws IOException {
    // if this throws IOException, the caller must handle it
    return Files.readString(Path.of(path));
}
```

JavaScript has no equivalent to `throws` — there's no way to declare in a function signature that it might throw, and nothing forces a caller to handle it. `throws` only exists in Java to satisfy the checked-exception rule above; you'll never write it for an unchecked exception.

---

## Custom exceptions

> Docs: https://www.baeldung.com/java-exceptions → read: "Custom Exception"

Create your own exception class to give meaningful names to errors:

```java
// Unchecked — extends RuntimeException (most common in Spring Boot)
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

`super("Employee not found with id: " + id)` calls `RuntimeException`'s own constructor — the one that stores a message — passing it the string you build here. That's the same `super()` call you already use to invoke a parent class's constructor in any subclass; `RuntimeException` just happens to be the parent this time. That message is what `e.getMessage()` returns later in a `catch` block or an `@ExceptionHandler`.

JavaScript lets you do something that looks similar (`class NotFoundError extends Error {}`), but it's not the same mechanism. In JS this is a convention with no enforcement — nothing stops you from throwing a plain string instead, and there's no compiler checking the type. In Java, extending `RuntimeException` plugs the class into the real type hierarchy: `catch (EmployeeNotFoundException e)` only matches that exact type (or its subclasses), and `@ExceptionHandler(EmployeeNotFoundException.class)` in Spring Boot relies on that hierarchy to route errors to the right handler.

The usage example below calls `repository.findById(id)` — `repository` is a Spring Boot concept you haven't studied yet. Read it to see why custom exceptions exist; you will write this exact pattern in the Spring Boot notes.

```java
// Usage
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

---

## try-with-resources

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html → read: "The try-with-resources Statement"

Automatically closes resources (files, database connections) when the try block ends — no `finally` needed:

```java
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}
// reader is closed automatically here, even if an exception occurred
```

The resource must implement `AutoCloseable`. Database connections in Spring Boot are managed automatically — you will not write try-with-resources for database work, but you will see it in file and network operations.

JavaScript has no direct equivalent — the closest you've done is manually closing a resource inside `finally`. `try-with-resources` just automates that `finally`-based cleanup and guarantees it happens even if the `try` block throws.

---

## Spring Boot connection

> Docs: https://www.baeldung.com/exception-handling-for-rest-with-spring → read: "Using @ControllerAdvice" and "The Handler Methods"

> **Preview — Spring Boot:** This section uses `@RestControllerAdvice`, `@ExceptionHandler`, and `ResponseEntity` — all Spring Boot classes you haven't studied yet. Read it to see how Java exceptions plug into a web API. You'll build this exact pattern in the Spring Boot notes.

The standard pattern in Spring Boot:

```java
// 1. Throw a custom exception in the service
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}

// 2. Catch it globally and return a proper HTTP response
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EmployeeNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}
```

This way, the service throws exceptions cleanly and the controller advice handles the HTTP status codes in one central place.

---

## Exception hierarchy

> Docs: https://www.baeldung.com/java-exceptions → read: "Exception Hierarchy"

Every exception in Java extends `Throwable`. The two direct subclasses are `Error` (JVM-level failures you should never catch — out of memory, stack overflow) and `Exception` (problems your application can handle). `RuntimeException` is the unchecked branch under `Exception`. Your custom exceptions always extend `RuntimeException` in Spring Boot — they go in that bottom group.

> **Why not catch `Error`?** By the time an `Error` like `OutOfMemoryError` or `StackOverflowError` is thrown, the JVM itself is already in a broken state — there's no free memory left to even run your `catch` block reliably, or the call stack itself just overflowed. Catching it doesn't fix anything; it just delays a crash that's going to happen anyway, and can hide the real problem instead of letting the app fail fast and visibly.

```
Throwable
├── Error (JVM-level problems — OutOfMemoryError, StackOverflowError — do not catch these)
└── Exception
    ├── IOException (checked)
    ├── SQLException (checked)
    └── RuntimeException (unchecked)
        ├── NullPointerException
        ├── IllegalArgumentException
        ├── IllegalStateException
        ├── IndexOutOfBoundsException
        └── your custom RuntimeException subclasses
```
