# Exceptions

> 📖 [Baeldung — Exception Handling in Java](https://www.baeldung.com/java-exceptions)
> 📖 [Oracle Docs — Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

Without exceptions, every method would have to return a special value (like `-1` or `null`) to signal that something went wrong, and the code that calls that method would have to remember to check that value every single time. That approach breaks down fast: it's easy to forget the check, the error signal gets lost after passing through a few calls, and you end up with silent bugs nobody notices.

Java solves this with exceptions. When something fails, the method *throws* an object that represents the error. That object automatically travels upward through the call stack — passing from one method to the next in reverse order of how they were called, because the last method that started executing is the first one to finish. Until some method *catches* it and decides what to do with it. If nothing catches it all the way up, the app stops and the error is printed to the console.

A note on two terms people mix up. The **call stack** is the live structure Java keeps while the program runs — like a stack of plates in a kitchen. Every time one method calls another, the new method is placed *on top* of the previous one — new methods end up higher on the stack and older ones lower. For example, if `main()` calls `methodA()`, and `methodA()` calls `methodB()`, the stack looks like this:

```
[top]    methodB()  ← currently executing
         methodA()
         main()
[bottom]
```

When `methodB()` finishes (executes its `return`), it is removed from the top of the stack — the one on top disappears first. Then `methodA()` finishes and is removed. Finally `main()`. This order is what "exiting in reverse order" means: the last one that entered is the first one that exits. In other words, LIFO (Last In, First Out).

The **stack trace** is a *snapshot* of that stack at the instant of the error: the text you see printed in the console listing the active methods at that moment. The `call stack` is the dynamic structure that changes constantly while the program runs — methods entering, methods leaving. The `stack trace` is the printed copy of that structure at one specific moment (when the error occurs). Because exceptions are ordinary objects in Java, they carry both the error message and that full stack trace inside them — so you know exactly where the problem happened and what path of method calls led to it.

---

## Checked vs unchecked exceptions

Java divides exceptions into two families. **Checked exceptions** represent problems the caller is expected to anticipate — like a file not found or a network timeout. The compiler forces you to either catch them or declare that your method might throw them. **Unchecked exceptions** (subclasses of `RuntimeException`) represent programming errors — null pointers, bad indexes, wrong arguments. The compiler does not enforce anything; they propagate up until something catches them or the app crashes.

| | Checked | Unchecked |
|---|---------|-----------|
| Extends | `Exception` | `RuntimeException` |
| Must declare? | Yes — `throws` or `try/catch` | No |
| When | Expected problems (file not found, network timeout) | Programming errors (null pointer, array out of bounds) |
| Examples | `IOException`, `SQLException` | `NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException` |

In Spring Boot you almost always work with unchecked exceptions — you throw them when something goes wrong and let Spring handle them with `@RestControllerAdvice`.

JavaScript has nothing like this split — every JS error is effectively "unchecked": there's no compiler forcing you to catch or declare anything. The checked/unchecked distinction is Java-specific, and it's exactly the kind of thing a JS developer trips over the first time the compiler refuses to build because a `catch` is missing.

---

## try / catch / finally

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

### Catching multiple exceptions in one block

```java
try {
    // ...
} catch (IOException | SQLException e) {
    System.out.println("Data error: " + e.getMessage());
}
```

---

## throw — manually throw an exception

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

Create your own exception class to give meaningful names to errors:

```java
// Unchecked — extends RuntimeException (most common in Spring Boot)
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

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

Every exception in Java extends `Throwable`. The two direct subclasses are `Error` (JVM-level failures you should never catch — out of memory, stack overflow) and `Exception` (problems your application can handle). `RuntimeException` is the unchecked branch under `Exception`. Your custom exceptions always extend `RuntimeException` in Spring Boot — they go in that bottom group.

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
