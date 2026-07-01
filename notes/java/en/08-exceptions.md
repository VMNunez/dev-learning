# Exceptions

> 📖 [Baeldung — Exception Handling in Java](https://www.baeldung.com/java-exceptions)
> 📖 [Oracle Docs — Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

Without exceptions, every method would need to return a special value (like `-1` or `null`) to signal that something went wrong — and every caller would need to check that value. That convention breaks down quickly: callers forget to check, the signal gets lost after a few method calls, and errors become silent bugs. Java uses exceptions instead: when something goes wrong, the method *throws* an object that travels up the call stack until something *catches* it. The call stack — the full trace of every method that was running when the error happened — is what you see in the console when your app crashes. Exceptions are objects in Java, so they carry both a message and the full stack trace.

---

## Checked vs unchecked exceptions

| | Checked | Unchecked |
|---|---------|-----------|
| Extends | `Exception` | `RuntimeException` |
| Must declare? | Yes — `throws` or `try/catch` | No |
| When | Expected problems (file not found, network timeout) | Programming errors (null pointer, array out of bounds) |
| Examples | `IOException`, `SQLException` | `NullPointerException`, `IllegalArgumentException`, `IndexOutOfBoundsException` |

In Spring Boot you almost always work with unchecked exceptions — you throw them when something goes wrong and let Spring handle them with `@RestControllerAdvice`.

---

## try / catch / finally

You wrap the risky code in a `try` block and handle each possible failure in its own `catch` block. `finally` runs no matter what — use it to close connections or release resources even when an exception occurs:

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

---

## throws — declare checked exceptions

Checked exceptions must be declared at the method signature level so the compiler forces every caller to decide: handle it here, or pass it up. If a method can throw a checked exception and does not catch it, it must declare it with `throws`:

```java
public String readFile(String path) throws IOException {
    // if this throws IOException, the caller must handle it
    return Files.readString(Path.of(path));
}
```

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
