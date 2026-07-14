# Variables and Types

> 📖 [Baeldung — Java primitives](https://www.baeldung.com/java-primitives) → read: "Overview" and "Primitive Data Types"
> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

The [intro](00-intro-java.md) left you with the big idea that Java is **statically typed**: every variable has a type fixed at compile time, and that type never changes. That raises the obvious next question — *what are those types?* This file answers it. Before you can write a single class, a loop, or a method, you need the raw materials: the exact set of types Java gives you to hold a number, a flag, a piece of text, and how they behave in memory. Everything from here on — every field in every Spring Boot entity, every method parameter — is built out of the types on this page.

## Primitive types

In Java there are two ways to store data in memory. The first is to store the **value directly** — the number 42 or the boolean `true` is stored exactly where the variable lives. The second is to store a **reference** — instead of the data itself, the variable holds a memory address that points to where the real object is, like a link. **Primitive types** use the first form: they store the value directly, no references. **Objects** (like `String`, `Employee`, or any class) use the second.

Java has 8 primitive types. Each has a fixed size and a range of possible values. The ranges are useful to know when you need to switch types: if a counter can exceed 2.1 billion, `int` is too small and you need `long`.

| Type      | Size   | Approximate range                          | Example                  |
| --------- | ------ | ------------------------------------------ | ------------------------ |
| `byte`    | 8 bit  | ±1.27 × 10²                                | `byte level = 5;`        |
| `short`   | 16 bit | ±3.27 × 10⁴                                | `short year = 2025;`     |
| `int`     | 32 bit | ±2.14 × 10⁹                                | `int age = 31;`          |
| `long`    | 64 bit | ±9.2 × 10¹⁸                                | `long id = 1234567890L;` |
| `float`   | 32 bit | ±3.4 × 10³⁸ (~7 significant digits)        | `float tax = 0.21f;`     |
| `double`  | 64 bit | ±1.7 × 10³⁰⁸ (~15 significant digits)      | `double price = 19.99;`  |
| `boolean` | 1 bit  | `true` or `false`                          | `boolean active = true;` |
| `char`    | 16 bit | Any Unicode character (0 to 65,535)        | `char grade = 'A';`      |

A **Unicode character** is any symbol from any writing system in the world: Latin letters, Chinese, Arabic, emojis, mathematical symbols. The Unicode standard assigns a unique number to every symbol — `char` stores that number, which goes from 0 to 65,535. In practice you rarely use `char` directly in web development — full text goes in `String`.

In practice you use `int`, `long`, `double`, and `boolean` for almost everything. `float` and `byte` are rarely needed.

### Types by category

**Integer numbers** — for counting, IDs, ages, quantities:
- `byte` and `short` — whole numbers just like `int` and `long`, only with a much smaller range. They cannot hold decimals. In practice you will see them in old code or when working with binary data.
- `int` — your everyday whole number. Use this by default.
- `long` — when `int` is not big enough. Database IDs are often `Long` because they grow very large. Notice the `L` suffix: `1234567890L` — without it Java treats the number as `int` and may reject it.

**Decimal numbers** — for prices, percentages, rates:
- `float` — half the precision of `double`: only ~7 significant digits. If you need `3.141592653589793`, a `float` stores it as `3.1415927` — you lose digits. Use only if memory is critical (almost never in web development). Notice the `f` suffix: `0.21f`.
- `double` — the default choice for decimals. Higher precision: up to ~15 significant digits. `3.141592653589793`, for example, fits comfortably in a `double`.

> **Money in Spring Boot:** never use `double` or `float` for financial values. Use `BigDecimal` — it is a plain Java class (`java.math` package, not Spring Boot) that does exact arithmetic. `double` cannot represent 0.1 exactly in binary because computers express numbers as sums of powers of 2 (1/2, 1/4, 1/8…), and 0.1 cannot be expressed as a finite sum of those powers — just like 1/3 cannot be written exactly in decimal (0.333…). The processor stores the closest approximation it can, and that small error accumulates across operations until you get `0.09999999...` instead of `0.1`. `BigDecimal` avoids this by operating on the actual digits, without the representation error.

**Boolean** — for flags and conditions:
- `boolean` — holds only `true` or `false`. Used for `isActive`, `hasRole`, `isEmpty`.

**Character** — for single characters:
- `char` — one character, enclosed in single quotes: `'A'`. Used rarely in web development.

### Comparing `BigDecimal` — `compareTo()` instead of `<`, `>`, or `equals()`

Imagine a service needs to validate that hours worked fall between 0.5 and 24 (exactly the case for `TimeEntry.hours` in a timesheet). If `hours` is `BigDecimal`, writing `request.getHours() < 24` does not even compile — the error is `bad operand type BigDecimal for binary operator '<'`. The reason is the same as with wrapper classes: `<` and `>` only exist for primitives, and `BigDecimal` is an object.

The next instinct is usually `.equals()`, but there is a trap: `.equals()` on `BigDecimal` also compares the **scale** (how many decimal places the number is internally represented with), not just the mathematical value. That is why `new BigDecimal("24.0").equals(new BigDecimal("24"))` returns `false` — to Java, "24.0" and "24" are objects with different scales (one decimal digit versus none), even though they are mathematically the same number.

`BigDecimal` implements the `Comparable<BigDecimal>` interface, which provides the `compareTo(BigDecimal other)` method. This method does compare the actual mathematical value, ignoring scale, and returns an `int`:

- negative if `this` is less than `other`
- `0` if they are mathematically equal
- positive if `this` is greater than `other`

The pattern is always the same: call `compareTo()`, then compare the resulting `int` against `0` with the normal operators (`<`, `>`, `==`) — because now you are comparing two primitive `int`s, not two `BigDecimal` objects.

```java
BigDecimal hours = request.getHours();

if (hours.compareTo(new BigDecimal("0.5")) < 0 || hours.compareTo(new BigDecimal("24")) > 0) {
    throw new RuntimeException("Hours must be between 0.5 and 24");
}
```

Read it as: "if `hours` compared to 0.5 is negative (meaning `hours` is less than 0.5) OR `hours` compared to 24 is positive (`hours` is greater than 24), throw the exception".

> **`compareTo() == 0` for equality, never `equals()`.** If you ever need to check value equality between two `BigDecimal`s (e.g. "is the total billed exactly 100?"), use `total.compareTo(new BigDecimal("100")) == 0`, not `total.equals(new BigDecimal("100"))` — because if `total` arrived as `"100.00"` (with two decimal places, common when it comes from a `DECIMAL(10,2)` database column), `.equals()` would return `false` even though the value is identical.

---

## Variables

A variable is a named space in memory where you store a piece of data. In Java you always have to declare the type before the name — the compiler needs to know what type of data will go in there. You can declare and assign in the same line, or declare first and assign later:

```java
int age = 31;           // declare and assign in the same line
int count;              // declare only (must assign before use — the compiler enforces this)
count = 0;              // assign later

final int MAX = 100;    // constant — cannot be reassigned (like const in JS)
```

`final` is the Java equivalent of JavaScript's `const`.

---

## Type casting

### Widening (automatic)

When you convert a smaller type to a larger one, there is no data loss — Java does it automatically, no extra syntax needed:

```java
int x = 42;
long y = x;        // int → long — automatic
double z = x;      // int → double — automatic
```

### Narrowing (manual)

When you convert a larger type to a smaller one, there can be data loss — Java forces you to say so explicitly by writing the target type in parentheses before the value:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — decimal part is dropped, not rounded

long bigNumber = 1234567890123L;
int smaller = (int) bigNumber;  // may overflow if the number is too large for int
```

The `(int)` before the variable is the cast. Java does not do this automatically because you might lose data — you have to write it explicitly to signal that you accept the possible loss. The loss happens specifically when the larger number does not fit in the smaller type: if the value exceeds the destination type's range, a silent wraparound (described below) happens instead of an error — which is why narrowing can produce unexpected results.

> **Silent wraparound:** when a number does not fit in the destination type, Java does not throw an error — it simply "rolls over". Picture a car odometer that reaches 999,999 and flips back to 000,000: exactly that happens with integers. `int`'s maximum value is 2,147,483,647; add 1 to it and you get −2,147,483,648, the minimum. The counter runs off the top end and reappears at the bottom. That is why narrowing (and integer overflow in general) can produce wrong results silently, with no exception to warn you.

---

## Wrapper classes — objects for primitives

Each primitive type has a corresponding wrapper class. You use wrapper classes when a method requires an **object** instead of a primitive.

**The most common case:** Java collections (`List`, `Map`, `Set`) only work with objects, not primitives. `List<int>` does not compile — the compiler throws a type error: `Type argument int is not within bounds of type-variable E`. You use `List<Integer>` instead. Collections are covered in detail in [07-collections.md](07-collections.md) — for now, just know they are Java's main data structures and they all require object types.

**Another case:** wrapper classes can be `null`. A primitive `int` cannot be null, but `Integer` can. In Spring Boot, database IDs are often typed as `Long` (not `long`) because Hibernate sets them to `null` until the entity is saved for the first time.

### When to use each — the practical rule

Use the **wrapper** in two situations: (1) when `null` is a meaningful value — a JPA entity ID is `null` until it is saved for the first time, so the field goes as `Long`, not `long`; (2) when using collections, because `List<int>` does not exist in Java and you must write `List<Integer>`. In any other case, use the **primitive** — the value is always present and never null.

```java
// Long (wrapper) — because the id does not exist until JPA saves the entity
@Id
@GeneratedValue
private Long id;

// long (primitive) — because expiration is always 86400000, never null
@Value("${app.jwt.expiration}")
private long expiration;
```

Read each row as a pair: the left column is the primitive you use when the value is always present, the right column is the object form you switch to when you need `null` or a collection. The name is not arbitrary — the wrapper is the capitalised full word (`int` → `Integer`, `char` → `Character`).

| Primitive | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |

### Autoboxing and unboxing

Autoboxing happens every time you add an `int` to a `List<Integer>` or assign an `int` to an `Integer` variable — situations that appear constantly in real code. Before Java 5, the compiler rejected that and you had to do the conversion by hand: `list.add(Integer.valueOf(42))`. From Java 5 onwards, Java does that conversion automatically. This is called **autoboxing** (primitive → wrapper) and **unboxing** (wrapper → primitive).

In practice, you almost never think about it. Java just handles it:

```java
Integer a = 42;           // autoboxing — Java converts int 42 to Integer automatically
int b = a;                // unboxing — Integer back to int automatically

List<Integer> ids = new ArrayList<>();
ids.add(42);              // autoboxing — you pass an int, Java wraps it as Integer
int first = ids.get(0);   // unboxing — Java unwraps it back to int
```

### Useful wrapper methods

**Static methods** belong to the class itself, not to any specific object — that is why you call them on the class name (`Integer.parseInt("42")`) without creating an object with `new`. Static methods are covered in detail in [03-methods.md](03-methods.md).

These static methods are genuinely useful in everyday code:

```java
Integer.parseInt("42");   // converts a String to int — very common when reading form inputs or URL parameters
String.valueOf(42);       // converts int to String
Integer.MAX_VALUE;        // 2147483647 — the largest possible int value
Integer.MIN_VALUE;        // -2147483648
```

---

## String

`String` is not a primitive — it is a class. But Java treats it like a primitive in many ways (you can assign with `=`, no `new` needed).

```java
String name = "Victor";
String greeting = "Hello, " + name;                   // concatenation with +
String greeting2 = "Hello, %s".formatted(name);       // template substitution — Java 15+
```

The `.formatted()` method replaces placeholders in the string. `%s` means "a string goes here", `%d` means "an integer goes here". It is the same idea as template literals in JavaScript — `` `Hello, ${name}` `` — but with positional placeholders. The order matters: the values are matched to the placeholders left to right, in the order they appear in the string.

```java
"User %s has %d points".formatted("Victor", 100);  // "User Victor has 100 points"
"User %s has %d points".formatted(100, "Victor");  // MAL — 100 is not a String for %s
```

For decimals, use `%f`. You can control how many decimal places to show with `.Nf` (N = number of digits): `"Price is %.2f euros".formatted(19.99)` → `"Price is 19.99 euros"`.

### Common methods

```java
name.length()                     // 6 — how many characters
name.toUpperCase()                // "VICTOR" — all uppercase
name.toLowerCase()                // "victor" — all lowercase
name.contains("ict")              // true — does the string contain this sequence?
name.startsWith("Vi")             // true — does it start with this?
name.replace("Victor", "World")   // "World" — replace all occurrences of a substring
name.trim()                       // removes leading and trailing spaces — useful for cleaning user input
name.isEmpty()                    // false — true only if the string is exactly ""
name.isBlank()                    // false — true if empty OR contains only spaces
name.substring(0, 3)              // "Vic" — characters from index 0 to 2 (end index is excluded)
name.split(",")                   // splits by comma — returns String[]
name.equals("Victor")             // true — always use this for content comparison (see below)
name.equalsIgnoreCase("victor")   // true — same but ignores uppercase/lowercase
```

### String comparison — always use `equals()`

In Java, `==` compares **memory addresses** (references), not content. Two `String` variables can hold the exact same characters and still live at two different addresses — and `==` compares the addresses, so it returns `false` even though the text is identical.

`.equals()` always compares the actual characters — that is what you almost always want:

```java
String a = new String("hello");
String b = new String("hello");

a == b        // false — two separate objects, different addresses
a.equals(b)   // true — same characters, which is what you meant
```

> **Careful — string literals are a trap here.** If you write `String a = "hello"; String b = "hello";` (plain literals, no `new`), then `a == b` actually returns `true` — because Java keeps a single shared copy of each literal in a cache called the **string pool**, so both variables end up pointing to the very same object. That makes `==` *look* like it works. It breaks the moment one of the strings comes from somewhere else — user input, a database row, `new String(...)`, or a value built by concatenation at runtime — and then `==` silently returns `false`. The pool is exactly why you must never trust `==` for content: it works just often enough to fool you. The pool itself is covered in [15-memory-model.md](15-memory-model.md).

> **Why does `==` even exist for Strings?** For objects (including `String`), `==` checks if two variables point to the **same object in memory** — not just the same value. This matters in some cases (e.g. checking if two list entries are literally the same object), but for Strings you almost never want that.

### `String`, `StringBuilder`, `StringBuffer`

The problem: `String` is **immutable** — once created, it cannot be changed. Every time you do `str += something`, Java does not modify the original string. It creates a brand new `String` object with the combined content. In a loop with 1000 iterations, you create 1000 objects — slow and wasteful.

`StringBuilder` uses a **buffer** to solve this — a space in memory where it accumulates the pieces of the string while you are building it, like a whiteboard where you keep writing until you have the final result. You modify it in place without creating new objects, and when you are done you call `.toString()` to get the finished string.

The concept of **thread-safety** shows up here because `StringBuilder` is not thread-safe — and in Spring Boot this matters because each HTTP request arrives on a separate thread. If you declared a `StringBuilder` as a shared field on a Spring bean (which is a singleton), multiple threads could write to it at the same time and corrupt the result. For example:

```java
// BAD — shared across all threads (never do this with StringBuilder)
@Service
public class ReportService {
    private StringBuilder sharedBuilder = new StringBuilder();  // ← all threads share this
}

// GOOD — local to the method, only exists during that one request
public String buildReport(List<String> lines) {
    StringBuilder sb = new StringBuilder();  // ← only this thread sees it
    for (String line : lines) sb.append(line).append("\n");
    return sb.toString();
}
```

> **What does thread-safe mean?** A **thread** is a task that runs in parallel with others inside the same program. In a REST API, Spring Boot assigns a separate thread to each incoming HTTP request — that is how it serves several at once without waiting for the first to finish. **Thread-safe** means several threads can use the same object at the same time without one corrupting the other's work. `String` and `StringBuffer` are thread-safe; `StringBuilder` is not. In practice the risk simply does not exist if you create the `StringBuilder` as a local variable inside a method — that object is yours and no other thread ever touches it.

Read the table by picking your two constraints — do you need the object to be modifiable, and does more than one thread touch it — and the last column names the type that fits. Almost always you land on `String` (immutable, safe) for everyday values and `StringBuilder` (mutable, single-thread) for loops.

|                 | Immutable? | Thread-safe? | When to use                             |
| --------------- | ---------- | ------------ | --------------------------------------- |
| `String`        | Yes        | Yes          | Most cases — reading, passing, comparing |
| `StringBuilder` | No         | No           | Building strings in a loop (fast)       |
| `StringBuffer`  | No         | Yes          | Multi-threaded string building (rare)   |

```java
// Inefficient — creates a new String object on every iteration
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;
}

// Efficient — mutates the same object
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);   // modifies the StringBuilder instead of creating a new one
}
String result = sb.toString();
```

> **Why `.append()` and not `+=`?** Because `StringBuilder` is mutable — `.append()` modifies the existing object without creating anything new. `+=` on a `String` creates a brand-new object every time (that is exactly why it is slow). `StringBuilder` does not overload the `+=` operator, so it exposes its own `.append()` method to make it explicit that you are mutating the object in place.

In Spring Boot you will mostly work with `String`. Use `StringBuilder` when you are building a long string by joining many pieces — for example, generating a comma-separated list or assembling a SQL fragment in a service method.

---

## `var` — local type inference (Java 10+)

Normally you write the type on the left side: `List<Employee> employees = new ArrayList<>()`. With `var`, Java infers the type from the right side — you do not have to write it:

```java
var name = "Victor";                    // Java infers: String
var age = 31;                           // Java infers: int
var employees = new ArrayList<Employee>();  // Java infers: ArrayList<Employee>
```

This does **not** make Java dynamic like JavaScript's `var`. In JavaScript, a variable can change type while the program runs (`var x = 1; x = "hello"` is fine). In Java that is not possible.

Two concepts help here: **compile time** is when Java translates your source code to bytecode — before the program runs. **Runtime** is when the program is actually executing. With `var`, Java figures out the type during compilation: it sees `"Victor"` on the right side and decides the type is `String`. That type is locked in the bytecode and never changes — exactly as if you had written `String name = "Victor"` yourself.

Only works for local variables (inside methods). Cannot be used for fields, method parameters, or return types.

Useful when the type is long and obvious from the right side: `var employees = employeeRepository.findAll()` is cleaner than `List<Employee> employees = employeeRepository.findAll()`.

---

You now have the raw materials: the eight primitives, their wrapper objects, `String` and its mutable cousins, casting between types, and `var`. But a variable that just sits there holding a value does nothing on its own — a program has to *decide* and *repeat*: run this block only if the age is over 18, loop over every employee in the list. That is control flow, and it is what [02-control-flow.md](02-control-flow.md) covers next — `if`/`else`, `switch`, and the loops that put these types to work.
