# Variables and Types

> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

## Primitive types

Java has 8 primitive types. These store values directly, not references.

| Type | Size | What it holds | Example |
|------|------|---------------|---------|
| `int` | 32 bit | Whole numbers (−2B to 2B) | `int age = 31;` |
| `long` | 64 bit | Large whole numbers | `long id = 1234567890L;` |
| `double` | 64 bit | Decimal numbers | `double price = 19.99;` |
| `float` | 32 bit | Decimal, less precision | `float tax = 0.21f;` |
| `boolean` | 1 bit | `true` or `false` | `boolean active = true;` |
| `char` | 16 bit | One character | `char grade = 'A';` |
| `byte` | 8 bit | Small numbers (−128 to 127) | `byte level = 5;` |
| `short` | 16 bit | Medium numbers | `short year = 2025;` |

In practice you use `int`, `long`, `double`, and `boolean` for almost everything. `float` and `byte` are rarely needed.

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

Larger type → smaller type. May lose data. You must cast explicitly:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — decimal part is dropped, not rounded

long bigNumber = 1234567890L;
int smaller = (int) bigNumber;  // may overflow if number is too large
```

---

## Wrapper classes — objects for primitives

Every primitive type has a wrapper class. Used when a method requires an object instead of a primitive (for example, `List<Integer>` — lists cannot hold `int`).

| Primitive | Wrapper |
|-----------|---------|
| `int` | `Integer` |
| `long` | `Long` |
| `double` | `Double` |
| `boolean` | `Boolean` |
| `char` | `Character` |

```java
Integer a = 42;           // autoboxing — Java converts int to Integer automatically
int b = a;                // unboxing — Integer back to int automatically

Integer.parseInt("42");   // String → int (very common — form inputs arrive as strings)
String.valueOf(42);       // int → String
Integer.MAX_VALUE;        // 2147483647
```

---

## String

`String` is not a primitive — it is a class. But Java treats it like a primitive in many ways.

```java
String name = "Victor";
String greeting = "Hello, " + name;          // concatenation with +
String greeting2 = "Hello, %s".formatted(name);  // formatted string (Java 15+)

// Common methods
name.length()             // 6
name.toUpperCase()        // "VICTOR"
name.toLowerCase()        // "victor"
name.contains("ict")      // true
name.startsWith("Vi")     // true
name.replace("Victor", "World")   // "World"
name.trim()               // removes leading and trailing spaces
name.isEmpty()            // false
name.isBlank()            // false (isEmpty but also checks whitespace-only)
name.substring(0, 3)      // "Vic"
name.split(",")           // splits by comma — returns String[]
name.equals("Victor")     // true — always use equals() for String comparison, not ==
name.equalsIgnoreCase("victor")  // true
```

### String comparison — always use `equals()`

```java
String a = "hello";
String b = "hello";

a == b        // unreliable — compares memory addresses, not content
a.equals(b)   // true — always use this
```

### `String`, `StringBuilder`, `StringBuffer`

| | Immutable? | Thread-safe? | When to use |
|---|---|---|---|
| `String` | Yes | Yes | Most cases |
| `StringBuilder` | No | No | Building strings in a loop (fast) |
| `StringBuffer` | No | Yes | Multi-threaded string building (rare) |

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

---

## `var` — local type inference (Java 10+)

Let Java infer the type from the assigned value:

```java
var name = "Victor";        // String
var age = 31;               // int
var prices = new ArrayList<Double>();  // ArrayList<Double>
```

Only works for local variables (inside methods). Cannot be used for fields, parameters, or return types. Equivalent to TypeScript's type inference — the type is still fixed, just not written explicitly.
