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

Java divides exceptions into two families — checked and unchecked — and what separates them isn't the name: the compiler actively watches one of the two families, forcing you to declare or catch its errors, while it leaves the other one free to propagate without asking anything of you.

**Checked exceptions** represent problems the caller is expected to anticipate because they depend on something external to the code itself — a file that might not exist, a network connection that might drop, a database that might be down. They're failures that can happen even if your logic is written perfectly. That's why the compiler forces you to do something about them: either catch them with `try/catch`, or declare in the method signature that your method might throw them using `throws` (covered in full in the `throws` section below). If you do neither, the code simply doesn't compile:

```java
public void readConfig() {
    Files.readString(Path.of("config.txt")); // COMPILE ERROR
    // Files.readString() already carries "throws IOException" in ITS OWN signature —
    // it's not "readConfig" that declares it, it's the method it calls inside.
    // That's why it falls on you to decide what to do with that borrowed exception.
}
```

Java refuses to compile exactly because that file might not exist at runtime, and the compiler won't let you ignore that possibility. The error you see here isn't a runtime exception (the program never even starts) — it's a compile error with a characteristic message: `unreported exception IOException; must be caught or declared to be thrown`. Only once you fix that (with `try/catch` or `throws`) does the code compile.

> **When to use `throws` vs. `try/catch`.** Both, but in different places — they're not interchangeable alternatives. Use `try/catch` when the method you're in *can* do something sensible with the failure right there — show a message, fall back to a default value, retry. Use `throws` when that method isn't the right place to decide what to do — for example, a low-level method that just reads a file has no idea whether it should show an error to the user or retry the operation; that decision belongs to whoever calls it, which has more context. In a real app the typical chain is several methods declaring `throws` and passing the exception up to each other, until a method that actually knows what to do with it (usually close to the UI, or in Spring Boot the `@RestControllerAdvice` you'll see below) finally catches it with `try/catch`.

Here are the two ways to fix the example above:

```java
// Fixed with throws — the decision of what to do moves to whoever calls readConfig()
public void readConfig() throws IOException {
    Files.readString(Path.of("config.txt"));
}
```

```java
// Fixed with try/catch — you handle it right here; nobody outside this method ever finds out it happened
public void readConfig() {
    try {
        Files.readString(Path.of("config.txt"));
    } catch (IOException e) {
        System.out.println("Could not read the file: " + e.getMessage());
    }
}
```

> **Why `throws` and `try/catch` don't produce the same result at runtime.** The *compile* error disappears either way — that's the only thing `throws` and `try/catch` have in common. But at runtime they're not the same. With `try/catch`, if the file doesn't exist, your own `catch` block receives the `IOException` object (or its more specific subclass, `FileNotFoundException`) and decides what to do with it — here, printing a message — and the program keeps running normally afterward. With `throws`, on the other hand, you catch nothing inside `readConfig()`: the exception leaves that method unhandled and follows the same LIFO path you saw at the start of this note — if whoever calls `readConfig()` doesn't catch it either, it keeps climbing until something handles it or it reaches `main()`, and there you'd see the exact same unhandled stack trace you'd get if `readConfig()` had never had a `try/catch` at all.

These are the most typical checked exceptions you'll run into, together with the exact scenario that triggers each one:

- `IOException` — an input/output operation fails: reading or writing a file that doesn't exist or that you don't have permission for, or that gets cut off mid-read. `Files.readString(Path.of("config.txt"))` throws it if `config.txt` isn't at that path.
- `SQLException` — something fails while talking to the database: the connection drops, the query has a syntax error, or the database rejects the operation (e.g. a duplicate unique key). Any JDBC method that runs a query can throw it — JDBC is Java's standard API for connecting to relational databases and running SQL from Java code; Spring Boot uses JDBC underneath even though you'll usually work through a higher-level layer like JPA.

Both are in the table below.

**Unchecked exceptions** (subclasses of `RuntimeException`) represent programming errors — a `null` that shouldn't be, an index that falls outside an array, an argument that makes no sense. The phrase "subclasses of `RuntimeException`" means exactly what it sounds like: these are distinct error types, but they all inherit from the same parent class, `RuntimeException` — that shared inheritance is exactly what the compiler uses to decide none of them need declaring (you'll see it drawn out in the "Exception hierarchy" diagram below). These are bugs, not external events: "external event" here is the opposite of what you saw with checked exceptions — it's not "the file doesn't exist" (something outside your control that can happen even with perfectly written code), it's a failure that happens *only* because your own code has a bug in it. If your code were written correctly, they should never happen. That's why the compiler doesn't enforce anything — it wouldn't make sense to force you to declare every possible bug you might write in the signature of every method. They propagate freely toward the caller (the same LIFO path you already know from the section above) until something catches them or the app crashes.

These are the most typical `RuntimeException` subclasses you'll run into constantly in Java (and in technical interviews), together with the exact scenario that triggers each one:

- `NullPointerException` — you call a method or access a field on a variable that's `null`: `String s = null; s.length();` blows up because there's no real object behind `s` to run `length()` on.
- `IllegalArgumentException` — a method receives a value that, while it has the right type, makes no sense for what that method does: passing `-5` to `setAge(int age)` compiles fine (it's a valid `int`), but a negative age isn't a logical value.
- `IndexOutOfBoundsException` — you access a position of a list or array that doesn't exist: `list.get(10)` when `list` only has 3 elements, because valid positions run from `0` to `2`.

`ArithmeticException` joins these three — you'll see it right below in the `divide()` example — and the four together are the ones you'll run into most in practice.

Here's what that looks like in real code:

```java
// UNCHECKED — nothing forces you to declare it, it's a bug if it happens
public int divide(int a, int b) {
    return a / b; // if b is 0, throws ArithmeticException with no warning — nothing requires declaring it
}
```

If you call it as `divide(10, 0)` and nobody catches the error, the console prints something like this:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at ExceptionDemo.divide(ExceptionDemo.java:6)
    at ExceptionDemo.main(ExceptionDemo.java:2)
```

That's the stack trace from earlier in this note: the first line (`Exception in thread "main" ...`) gives you the exception type and message; the `at ...` lines are the snapshot of the stack at the instant of the failure — the method where it was thrown (`divide`, line 6) and the method it passed through, uncaught, on its way to `main` (line 2).

> **Why no `try/catch` or `throw` is required to "fix" this.** Unlike checked exceptions, the compiler never forces anything here: `divide()` compiles perfectly fine as it is, even though `b` might end up being `0` at runtime. Adding handling for this is a design decision you make, not a compiler requirement — you can wrap the call in a `try/catch` to catch the failure after it happens, or check the condition beforehand with `if (b == 0) throw new IllegalArgumentException("b cannot be 0")` to catch it yourself with a clearer message before Java throws its own `ArithmeticException`. Neither is mandatory; `IOException` was mandatory because the compiler watches it, `ArithmeticException` isn't because nobody watches it but you.

> It's easy to fall into the same trap from earlier here: "propagates up" is the standard phrase in Java's documentation, but as you already saw, "up" means "toward the calling method," not "up in the stack diagram" — which is actually drawn going down. The stack in the earlier section is drawn correctly; it's the phrase "up" that's misleading if you take it literally. From here on you'll see both forms in real documentation (*"propagates up the stack"*) — when you see it, mentally translate it as "toward the caller."

| | Checked | Unchecked |
|---|---------|-----------|
| Parent class (`extends`) | `Exception` | `RuntimeException` |
| Must declare? | Yes — `throws` or `try/catch` | No |
| Represents | Expected external problems — the file doesn't exist, the database connection drops, a call to another API times out | Programming errors — bugs that shouldn't happen if the code is written correctly |
| Examples (real scenario) | `IOException` (reading a file that doesn't exist), `SQLException` (the database rejects the query or the connection drops) | `NullPointerException` (calling a method on something that's `null`), `IllegalArgumentException` (passing a value that makes no sense, like a negative age), `IndexOutOfBoundsException` (accessing position 10 of a 3-element list) |

The "Parent class" column shows which class each exception type inherits from — that's what determines whether the compiler treats it as checked or unchecked: any exception that extends `Exception` (but not `RuntimeException`) is checked; any exception that extends `RuntimeException` is unchecked. The full hierarchy is explained below in "Exception hierarchy."

In Spring Boot you almost always work with unchecked exceptions — even when the underlying problem is "external" in the same sense you saw above (an employee missing from the database is exactly the kind of expectable failure that, in theory, would qualify as checked). The reason for not doing it that way is architectural, not about the error type itself: a typical REST API has several stacked layers (`repository` → `service` → `controller`), and if `EmployeeNotFoundException` were checked, every one of those layers would need to declare `throws EmployeeNotFoundException` or wrap it in its own `try/catch` — repeating the same boilerplate in every controller that calls that service, just to compile. With an unchecked exception, on the other hand, the compiler imposes nothing: the object propagates freely upward (the same LIFO path as always) without any intermediate layer having to touch it, until it reaches a single centralized point — the `@RestControllerAdvice` class you'll see below — that catches it and decides which HTTP status to return. That's why the Spring Boot convention is to throw your own unchecked exception (like `EmployeeNotFoundException` below) and let that `@RestControllerAdvice` handle it in one place, instead of forcing every controller to declare `throws` and fill the code with repeated `try/catch` blocks. To throw a custom exception, the first thing you need is the class that represents it — it extends `RuntimeException` (unchecked, as you already know) and gets a constructor:

```java
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found with id: " + id);
    }
}
```

It extends `RuntimeException` directly — that's why it's unchecked from the moment you write it, regardless of whether there's a checked exception anywhere further down the stack. The constructor takes the `id` that wasn't found and calls `super(...)`, `RuntimeException`'s own constructor, passing it the already-built message; that message is exactly what `e.getMessage()` returns later inside an `@ExceptionHandler` (you'll see one below). The fact that the missing data is "external" — a row that doesn't exist in the database — doesn't require wrapping anything: wrapping is only needed when you're calling someone else's method that the compiler already treats as checked, like `Files.readString()` in the example below. There's no external method throwing a checked exception here — you decide to create `EmployeeNotFoundException` from scratch as unchecked, so there's no prior checked exception to convert. You'll see this same class again, with more context, in the "Custom exceptions" section below.

With the class defined, throwing it is as simple as any other `throw` — no need to declare anything in the method signature, precisely because it's unchecked:

```java
public void setManager(Employee employee) {
    if (employee == null) {
        throw new EmployeeNotFoundException(-1L);
    }
    // ...
}
```

That's the general case — a plain `throw new EmployeeNotFoundException(...)`, in the middle of any method, nothing special around it. In the project, though, you'll almost always throw it from a method that returns an `Optional`, like `repository.findById(id)` (a Spring Boot method you'll see later). `Optional` is the type Spring Data uses to say "there might be a value, there might not" instead of returning a plain `null`, and its `orElseThrow()` method does exactly that: if the `Optional` has a value inside, it returns it; if it's empty, it runs the function you pass it and throws whatever that function returns. That's why you see this pattern so often:

```java
public Employee findById(Long id) {
    return repository.findById(id)
        .orElseThrow(() -> new EmployeeNotFoundException(id));
}
```

It's not a different syntax for throwing exceptions — it's the same `throw new EmployeeNotFoundException(id)` from above, just wrapped in the `() -> ...` lambda that `orElseThrow()` expects to receive, so it can run it only if it's actually needed.

Your instinct is right: in a typical Spring Boot project you'll create far more custom exceptions (like `EmployeeNotFoundException`) than wrapped ones — wrapping is the exception, not the norm. The real cases where you'll use it are few and specific: reading or writing files with the `java.io`/`java.nio` classes (`Files.readString()`, `FileReader`, all checked), parsing dates with the old date classes (`java.text.SimpleDateFormat` throws `ParseException`, checked), or implementing a method of someone else's interface that doesn't let you add `throws` to your own signature because the interface method doesn't declare it. `SQLException` is checked in raw JDBC, but in Spring Boot you almost never see it directly — Spring Data already wraps it for you into its own unchecked exception hierarchy (`DataAccessException` and subclasses) before it ever reaches you, so you won't need to wrap it yourself either. The "wrapping" pattern is for rethrowing an exception that's genuinely checked — like `IOException` or `SQLException` — as an unchecked one. This is a different case from `EmployeeNotFoundException` above, even though both represent an "external" problem in the sense of depending on data that might be missing: `EmployeeNotFoundException` has never been a checked exception — you define it yourself by extending `RuntimeException` directly from the start, so the compiler never treated it as checked and there's nothing to wrap. Wrapping is only needed when the compiler does require `throws` or `try/catch` because the original exception — like `IOException` — extends `Exception` and not `RuntimeException`. The example below uses `Files.readString()`, which does throw a checked `IOException`, to show the pattern in practice:

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

`Throwable` is the root class of Java's entire exception hierarchy — literally "something that can be thrown": any object you hand to `throw` has to be a `Throwable` somewhere in its inheritance tree. Saying "every exception inherits from `Throwable`" means `Exception`, `RuntimeException`, `IOException`, and even your own `EmployeeNotFoundException` are all — directly or indirectly — subtypes of that same root class (you'll see the full tree drawn out in the "Exception hierarchy" diagram at the end of this note). That's exactly what makes the constructor here possible: since everything you can throw in Java is a `Throwable`, a constructor that accepts a `Throwable` parameter can accept *any* exception type as its argument — there's no need to overload a separate method for each possible type.

`RuntimeException` (like almost every Java exception) has a constructor that accepts a `Throwable` as its second argument. Watch the word "wrap" here: you're not rethrowing the same `IOException` object — you create a brand new object, of type `RuntimeException`, and pass the original exception (`e`) as the second argument to its constructor; that original object is stored inside the new one as its **cause** to link it to whatever exception actually caused it, so the trace of the real failure is never lost. If something later catches this new `RuntimeException` (for example with `catch (RuntimeException e)`), it can retrieve the original exception by calling `e.getCause()` on that same caught object — no special variable name needed, it's just the ordinary `e` from any `catch` block. This matters: you don't lose information, the original exception's stack trace is still available inside the new one (you'll see something like `Caused by: java.io.IOException...` at the bottom of the printed stack trace). The benefit is that `loadFile()` no longer needs `throws IOException` in its signature — the caller is no longer forced by the compiler to handle it, though it still can if it wants to with `catch (RuntimeException e)`. In a real Spring Boot project the usual approach is not to catch it manually at any intermediate point: you let it propagate unhandled, just like `EmployeeNotFoundException`, until the `@RestControllerAdvice` catches it in one place and decides the HTTP status — the `catch (RuntimeException e)` mentioned here is just the manual alternative, for when you genuinely want to handle it yourself right there instead of centralizing it.

> **Be careful "wrapping" a checked exception.** This is a valid and very common pattern in Spring Boot, but it drops the compiler's guarantee — from that point on, nothing forces you to remember to handle it. Do it deliberately (usually because you want to simplify your method signatures and let a `@RestControllerAdvice` handle the error centrally), not just to avoid writing `throws` without thinking about it.

The two ways of ending up with a `RuntimeException` you saw in this section — a custom one like `EmployeeNotFoundException` (you create it from scratch, it wraps nothing) and a wrapped one like the one in `loadFile()` (born from a caught `IOException`) — both arrive equally "unchecked" as far as the compiler is concerned, so the same `@RestControllerAdvice` can catch them together. The only thing that distinguishes one `@ExceptionHandler` from another is the type it declares — that is, *which* exception each one responds to, not *how* it handles it: the "how" is entirely up to you, written inside each method's body (here, a different HTTP status per case), with no automatic link between the caught type and the logic you write:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Catches the custom exception — EmployeeNotFoundException, defined above
    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EmployeeNotFoundException e) {
        return ResponseEntity.status(404).body(e.getMessage());
    }

    // Catches the generic RuntimeException that "wraps" the IOException from loadFile()
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleWrapped(RuntimeException e) {
        return ResponseEntity.status(500).body(e.getMessage());
    }
}
```

Two syntax and style details that apply to any `@ExceptionHandler` you write, not just these two:

> **Do you always have to add `.class`?** Yes. `@ExceptionHandler` expects a `Class` object as its argument — the runtime representation of a specific class, not an instance of that class — and `.class` is the syntax Java uses to get that object from a type's name (`EmployeeNotFoundException.class`, `RuntimeException.class`, etc.). Without `.class` you'd be trying to pass the type itself as if it were a variable, and that doesn't compile.

> **Are `handleNotFound` and `handleWrapped` required names?** No — you choose the method name yourself, exactly like any other Java method; there's no Spring convention forcing you to call it `handleSomething`. Spring doesn't look at the method's name to decide which exception each one handles: it looks at the type declared inside `@ExceptionHandler(...)` (and the method's parameter type, which must match). You could name these two methods `foo` and `bar` and they'd work exactly the same — the descriptive name is purely for whoever reads the code later, starting with yourself.

This is the full `GlobalExceptionHandler` class, with both handlers together — the same code you'll see again in the "Spring Boot connection" section below, where the `@RestControllerAdvice` pattern is explained from scratch.

JavaScript has nothing like this split — every JS error is effectively "unchecked": there's no compiler forcing you to catch or declare anything, no `throws` in a function signature, no compile error if you forget a `catch`. The checked/unchecked distinction is Java-specific (it also exists, with different nuances, in other typed languages like C# — though C# doesn't enforce it at compile time either), and it's exactly the kind of thing a JS developer trips over the first time the compiler refuses to build because a `catch` is missing.

---

## try / catch / finally

> Docs: https://docs.oracle.com/javase/tutorial/essential/exceptions/handling.html → read: "Catching and Handling Exceptions"

You wrap the code that might fail in a `try` block and handle each possible failure in its own `catch` block. `finally` runs no matter what — use it to close connections or release resources even when an exception occurs. The syntax itself will feel familiar: `try`/`catch`/`finally` works the same way in JavaScript — the difference in Java is what you're allowed to catch and what the compiler requires you to declare (see checked vs unchecked above):

```java
try {
    // code that might throw an exception
    String content = readFile("data.txt");
    int number = Integer.parseInt(content);
} catch (IOException e) {
    System.out.println("File error: " + e.getMessage());
    e.printStackTrace(); // prints the full stack trace to the error console
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} finally {
    System.out.println("This always runs — clean up resources here");
}
```

- `catch` receives the exception object — use `e.getMessage()` when you only need the error text, `e.printStackTrace()` when you also want to see the full trace of where the exception passed through (useful while debugging; it's added as an example above in the `catch (IOException e)` block)
- Multiple `catch` blocks are checked from top to bottom, and Java runs the first one whose type matches the thrown exception: if something fails, it looks at the error's actual type and compares it against the first `catch`; if it doesn't match (say the error is a `NumberFormatException` and the first block expects `IOException`), it moves on to check the next `catch`, and so on until one fits. That's why you put more specific exceptions before more general ones — explained in full in the callout below
- `finally` always runs — used to close files, database connections, etc.

> **Why not leave a `catch` block empty?** An empty `catch` swallows the error silently — the program carries on as if nothing happened and you lose both the message and the stack trace, so the bug becomes invisible. At the very least log the exception; never write `catch (Exception e) {}`.

> **Why does `catch` order matter — what actually happens if you get it wrong?** Java checks `catch` blocks top to bottom and runs the *first* one whose type matches the thrown exception. The moment one matches and runs, Java stops checking the rest — it never even looks at the `catch` blocks that come after, even if one of them would also match that exception. If the two exceptions are unrelated (like `IOException` and `NumberFormatException` above), the order is just a style choice. But if one is a superclass of the other — say `Exception` and `IOException` — and you put the superclass (`Exception`) first, the compiler refuses to build: `catch (IOException e)` becomes unreachable, since every `IOException` already matches `catch (Exception e)` above it. The exact error is `exception IOException has already been caught`. That's why the general rule is to order `catch` blocks from most specific to most general — the more concrete subclasses first, and the superclass (if you catch it at all) always last; it's not a style preference, it's what makes every block reachable at all.

> **Does `finally` run even if the `try` block has a `return`?** Yes — this is the classic "gotcha" every Java interview asks about. A "gotcha" (informal English, from "got you") is what programmers call a behavior that's technically correct and well documented, but surprises almost everyone the first time because it isn't what the syntax seems to suggest at first glance; they're called that because they're the kind of detail that "gets you" if you only know the surface of the language, which is exactly why they're a favorite interview question — they reveal whether you actually understand the mechanism underneath, not just the syntax. Here's the mechanism: when execution reaches the `return` inside `try`, Java computes the value to return (`1`) but doesn't leave the method yet — before the call actually ends and that value reaches whoever invoked the method, Java first runs the entire `finally` block. Only once `finally` finishes does the method actually return the value it had already computed:
> ```java
> public int test() {
>     try {
>         return 1;
>     } finally {
>         System.out.println("finally runs first"); // prints before test() returns the 1 to its caller
>     }
> }
> // test() still returns 1 — but only after "finally runs first" is printed
> ```
> The one trap to avoid: if `finally` itself has *another* `return`, that new value wins and silently replaces the one that came from `try` — that is, the `1` that `try` had already computed is discarded with no warning or error, and the method returns whatever `finally`'s `return` says instead. For example, if the `finally` block here had `return 2;`, `test()` would return `2`, not `1` — the `try` block's `return 1` would never actually leave the method. This is bad practice precisely because the change is so silent: nobody skimming the code would expect the return value to be decided inside the cleanup block — that's why the rule is absolute: never put a `return` inside `finally`.

### Catching multiple exceptions in one block

```java
try {
    // ...
} catch (IOException | SQLException e) {
    System.out.println("Data error: " + e.getMessage());
}
```

> Multi-catch — the name for this exact syntax, `catch (TypeA | TypeB e)`, with both exceptions inside the *same* `catch` block separated by `|` — is a different mechanism from chaining several separate `catch` blocks, which is why it has its own rule instead of the "most specific first" one. The rule about ordering from most specific to most general that you saw above (the `Exception`/`IOException` one) only applies when you have **separate `catch` blocks, each with its own braces `{ }`** — there you can and should put `catch (FileNotFoundException e) { ... }` before `catch (IOException e) { ... }`, exactly as you'd expect, because Java walks through them in order and each one is an independent check. Multi-catch is a different animal: writing `catch (IOException | SQLException e)` doesn't create two checks in sequence — it's a single `catch` block that reacts the same way (with the same code body) to either type. There's no "first" or "second" inside that list, so the concept of order doesn't apply at all. That's why the rule here is different: since the types sit together on the same line with no hierarchy between them, the compiler requires that none of them already be a subtype of another — if one were (like `FileNotFoundException` relative to `IOException`), including them together would be redundant, since catching `IOException` alone would already cover `FileNotFoundException` too.

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
