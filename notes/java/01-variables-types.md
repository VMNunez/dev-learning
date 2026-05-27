# Variables and Types

> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

## Primitive types

Java has 8 primitive types. These store values directly — not references to objects.

| Type      | Size   | What it holds               | Example                  |
| --------- | ------ | --------------------------- | ------------------------ |
| `int`     | 32 bit | Whole numbers (−2B to 2B)   | `int age = 31;`          |
| `long`    | 64 bit | Large whole numbers         | `long id = 1234567890L;` |
| `double`  | 64 bit | Decimal numbers             | `double price = 19.99;`  |
| `float`   | 32 bit | Decimal, less precision     | `float tax = 0.21f;`     |
| `boolean` | 1 bit  | `true` or `false`           | `boolean active = true;` |
| `char`    | 16 bit | One character               | `char grade = 'A';`      |
| `byte`    | 8 bit  | Small numbers (−128 to 127) | `byte level = 5;`        |
| `short`   | 16 bit | Medium numbers              | `short year = 2025;`     |

In practice you use `int`, `long`, `double`, and `boolean` for almost everything. `float` and `byte` are rarely needed.

### Types by category

**Integer numbers** — for counting, IDs, ages, quantities:
- `int` — your everyday whole number. Use this by default.
- `long` — when `int` is not big enough. Database IDs are often `Long` because they grow very large. Notice the `L` suffix: `1234567890L` — without it Java treats the number as `int` and may reject it.
- `byte` and `short` — very rarely used in practice. You will see them in old code or when working with binary data.

**Decimal numbers** — for prices, percentages, rates:
- `double` — the default choice for decimals. Higher precision.
- `float` — half the precision of `double`. Use only if memory is critical (almost never in web development). Notice the `f` suffix: `0.21f`.

> **Money in Spring Boot:** never use `double` or `float` for financial values. Use `BigDecimal` — it avoids rounding errors that floating-point types produce. `double` cannot represent 0.1 exactly in binary — after a few operations, you get `0.09999999...`. `BigDecimal` does exact arithmetic.

**Boolean** — for flags and conditions:
- `boolean` — holds only `true` or `false`. Used for `isActive`, `hasRole`, `isEmpty`.

**Character** — for single characters:
- `char` — one character, enclosed in single quotes: `'A'`. Used rarely in web development.

---

## Variables

```java
int age = 31;           // declare and assign
int count;              // declare only (must assign before use)
count = 0;              // assign later

final int MAX = 100;    // constant — cannot be reassigned (like const in JS)
```

`final` is the Java equivalent of JavaScript's `const`.

---

## Type casting

### Widening (automatic)

Smaller type → larger type. No data loss. Java does it automatically:

```java
int x = 42;
long y = x;        // int → long — automatic
double z = x;      // int → double — automatic
```

### Narrowing (manual)

Larger type → smaller type. You must tell Java explicitly that you accept potential data loss. The syntax is `(targetType) value` — you put the target type in parentheses before the value:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — decimal part is dropped, not rounded

long bigNumber = 1234567890123L;
int smaller = (int) bigNumber;  // may overflow if the number is too large for int
```

The `(int)` before the variable is the cast. Java does not do this automatically because you might lose data — you have to opt in. If the number does not fit, Java does not throw an error — it wraps around silently, which is why narrowing can produce unexpected results.

---

## Wrapper classes — objects for primitives

Each primitive type has a corresponding wrapper class. You use wrapper classes when a method requires an **object** instead of a primitive.

**The most common case:** Java collections (`List`, `Map`, `Set`) only work with objects, not primitives. So `List<int>` does not compile — you use `List<Integer>` instead.

**Another case:** wrapper classes can be `null`. A primitive `int` cannot be null, but `Integer` can. In Spring Boot, database IDs are often typed as `Long` (not `long`) because Hibernate sets them to `null` until the entity is saved for the first time.

### When to use each — the practical rule

Use the **wrapper class** when `null` is a meaningful value.
Use the **primitive** when the value is always present.

```java
// Long (wrapper) — because the id does not exist until JPA saves the entity
@Id
@GeneratedValue
private Long id;

// long (primitive) — because expiration is always 86400000, never null
@Value("${app.jwt.expiration}")
private long expiration;
```

In practice: JPA entity ids → always `Long`. Configuration values, counters, calculations → always `long`.

| Primitive | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |

### Autoboxing and unboxing

Normally, converting between `int` and `Integer` would require an explicit call like `Integer.valueOf(42)`. Java does this conversion automatically when it needs to — this is called **autoboxing** (primitive → wrapper) and **unboxing** (wrapper → primitive).

In practice, you almost never think about it. Java just handles it:

```java
Integer a = 42;           // autoboxing — Java converts int 42 to Integer automatically
int b = a;                // unboxing — Integer back to int automatically

List<Integer> ids = new ArrayList<>();
ids.add(42);              // autoboxing — you pass an int, Java wraps it as Integer
int first = ids.get(0);   // unboxing — Java unwraps it back to int
```

### Useful wrapper methods

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

The `.formatted()` method replaces placeholders in the string. `%s` means "a string goes here", `%d` means "an integer goes here". It is the same idea as template literals in JavaScript — `` `Hello, ${name}` `` — but with `%s` as the placeholder. You can chain it directly on the string literal.

```java
"User %s has %d points".formatted("Victor", 100);  // "User Victor has 100 points"
```

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

In Java, `==` compares **memory addresses** (references), not content. Two string variables with the same text might be stored at different memory locations, so `==` can return `false` even when the content looks identical.

`.equals()` always compares the actual characters — that is what you almost always want:

```java
String a = "hello";
String b = "hello";

a == b        // unreliable — compares memory addresses, not content
a.equals(b)   // true — always use this for String comparison
```

> **Why does `==` even exist for Strings?** For objects (including String), `==` checks if two variables point to the **same object in memory** — not just the same value. This matters in some cases (e.g. checking if two list entries are literally the same object), but for Strings you almost never want that.

### `String`, `StringBuilder`, `StringBuffer`

The problem: `String` is **immutable** — once created, it cannot be changed. Every time you do `str += something`, Java does not modify the original string. It creates a brand new `String` object with the combined content. In a loop with 1000 iterations, you create 1000 objects — slow and wasteful.

`StringBuilder` solves this. It is a mutable buffer you modify in place. When you are done building the string, you call `.toString()` to get the final result.

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
    sb.append(i);
}
String result = sb.toString();
```

In Spring Boot you will mostly work with `String`. Use `StringBuilder` when you are building a long string by joining many pieces — for example, generating a comma-separated list or assembling a SQL fragment in a service method.

---

## `var` — local type inference (Java 10+)

Normally you write the type on the left side: `List<Employee> employees = new ArrayList<>()`. With `var`, Java infers the type from the right side — you do not have to write it:

```java
var name = "Victor";                    // Java infers: String
var age = 31;                           // Java infers: int
var employees = new ArrayList<Employee>();  // Java infers: ArrayList<Employee>
```

This does **not** make Java dynamic like JavaScript's `var`. The type is still fixed at compile time — Java just figures it out for you so you do not have to write it twice.

Only works for local variables (inside methods). Cannot be used for fields, method parameters, or return types.

Useful when the type is long and obvious from the right side: `var employees = employeeRepository.findAll()` is cleaner than `List<Employee> employees = employeeRepository.findAll()`.
