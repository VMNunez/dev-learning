# Variables and Types

> 📖 [Baeldung — Java primitives](https://www.baeldung.com/java-primitives) → read: "Overview" and "Primitive Data Types"
> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

The [intro](00-intro-java.md) left you with the big idea that Java is **statically typed**: every variable has a type fixed at compile time, and that type never changes. That raises the obvious next question — *what are those types?* This file answers it. Before you can write a single class, a loop, or a method, you need the raw materials: the exact set of types Java gives you to hold a number, a flag, a piece of text, and how they behave in memory. Everything from here on — every field in every Spring Boot entity, every method parameter — is built out of the types on this page.

## Primitive types

> 📖 Docs: [Baeldung — Introduction to Java Primitives](https://www.baeldung.com/java-primitives) → read: "Primitive Data Types" — the eight types with their exact ranges, one sub-section each, plus "Overflow".

In Java there are two ways to store data in memory. The first is to store the **value directly** — the number 42 or the boolean `true` is stored exactly where the variable lives. The second is to store a **reference** — instead of the data itself, the variable holds a memory address that points to where the real object is, like a link. **Primitive types** use the first form: they store the value directly, no references. **Objects** (like `String`, `User`, or any class) use the second.

This is the single most structural idea on the page, so it is worth drawing. Two declarations that look almost identical produce two completely different memory layouts:

```java
int number = 42;
String name = "Victor";
```

```
        int number = 42                  String name = "Victor"

   ┌──────────────────────┐         ┌──────────────────────┐
   │  number │    42      │         │  name   │  0x7f3a20  │  ← an address, not the text
   └──────────────────────┘         └────────────┬─────────┘
     the value IS here                           │ points to
                                                 ▼
                                    ┌──────────────────────────┐
                                    │  String object "Victor"  │
                                    └──────────────────────────┘
                                       the value lives HERE
```

Everything surprising later on this page comes out of that picture. `==` on two `String`s compares the two addresses in the left-hand boxes, not the text in the right-hand box — which is why `equals()` exists (the *String comparison* section below). An `int` can never be `null` because there is no address to leave empty; an `Integer` can, because the address slot can hold "points to nothing". And where those boxes physically live — the stack for the variable, the heap for the object — is the subject of [05-memory-model.md](05-memory-model.md), which picks this diagram back up in detail.

Java has 8 primitive types. Each has a fixed size and a range of possible values. The ranges are useful to know when you need to switch types: if a counter can exceed 2.1 billion, `int` is too small and you need `long`.

| Type      | Size   | Approximate range                          | Example                  |
| --------- | ------ | ------------------------------------------ | ------------------------ |
| `byte`    | 8 bit  | ±1.27 × 10²                                | `byte level = 5;`        |
| `short`   | 16 bit | ±3.27 × 10⁴                                | `short year = 2025;`     |
| `int`     | 32 bit | ±2.14 × 10⁹                                | `int age = 31;`          |
| `long`    | 64 bit | ±9.2 × 10¹⁸                                | `long id = 1234567890L;` |
| `float`   | 32 bit | ±3.4 × 10³⁸ (~7 significant digits)        | `float tax = 0.21f;`     |
| `double`  | 64 bit | ±1.7 × 10³⁰⁸ (~15 significant digits)      | `double price = 19.99;`  |
| `boolean` | 1 bit of information | `true` or `false`              | `boolean active = true;` |
| `char`    | 16 bit | One UTF-16 code unit (0 to 65,535)         | `char grade = 'A';`      |

Read the `Size` column as "how much information the type can hold", not always as "how many bits the JVM hands it". For the seven numeric types the two are the same. `boolean` is the exception: it carries exactly one bit of *meaning*, but the JVM specification does not define a one-bit storage form — a `boolean` local or field occupies a full slot (in practice the space of an `int`), and only inside a `boolean[]` is it packed down to a byte each. So the row tells you the type has two possible values; it does not tell you it costs one bit of RAM.

A **Unicode character** is any symbol from any writing system in the world: Latin letters, Chinese, Arabic, emojis, mathematical symbols. The Unicode standard assigns a unique number (a *code point*) to every symbol — and `char` stores one 16-bit slice of that numbering, from 0 to 65,535.

> **Exact scope: a `char` does not hold "any Unicode character".** It holds one **UTF-16 code unit**, which covers code points up to U+FFFF. Everything above that — emoji, many historical scripts, most mathematical alphanumerics — is stored as **two** `char`s (a *surrogate pair*), so it does not fit in a single `char` at all. Try it and the compiler stops you before the program ever runs:
>
> ```java
> char c = '😀';   // MAL — error: character literal contains more than one UTF-16 code unit
> ```
>
> The same split leaks into `String`, which is just a sequence of `char`s: `"😀".length()` returns **2**, not 1, because it counts code units and the emoji occupies two of them. If you ever need the human count, `"😀".codePointCount(0, 2)` returns 1. This is the mechanism behind every "my substring cut an emoji in half" bug. In web development you rarely touch `char` directly — full text goes in `String` — but the length surprise reaches you through `String`.

In practice you use `int`, `long`, `double`, and `boolean` for almost everything. `float` and `byte` are rarely needed.

### Types by category

**Integer numbers** — for counting, IDs, ages, quantities:
- `byte` and `short` — whole numbers just like `int` and `long`, only with a much smaller range. They cannot hold decimals. In practice you will see them in old code or when working with binary data.
- `int` — your everyday whole number. Use this by default.
- `long` — when `int` is not big enough. Database IDs are often `Long` because they grow very large. Notice the `L` suffix: `1234567890L`.

> **Why the `L` suffix is not optional.** A bare numeric literal in Java source is an `int`, always — the compiler decides the literal's type *before* it looks at the variable you are assigning it to. So in `long id = 1234567890123;` the compiler reads `1234567890123` as an `int` literal, finds it does not fit in 32 bits, and stops right there:
>
> ```java
> long id = 1234567890123;    // MAL — error: integer number too large
> long id = 1234567890123L;   // BIEN — the L makes it a long literal from the start
> ```
>
> Note where the error points: at the literal, not at the assignment. The `long` on the left never gets a chance to help, because the literal was already illegal on its own. The suffix is what changes the literal's type. Lowercase `l` works too, but nobody uses it — it is indistinguishable from `1` in most fonts.

**Decimal numbers** — for prices, percentages, rates:
- `float` — half the precision of `double`: only ~7 significant digits. If you need `3.141592653589793`, a `float` stores it as `3.1415927` — you lose digits. Use only if memory is critical (almost never in web development). Notice the `f` suffix: `0.21f`.

  > **The `f` suffix has the same mechanism as `L`, in the opposite direction.** A bare decimal literal is a `double`, always. So `float tax = 0.21;` asks the compiler to squeeze a 64-bit `double` into a 32-bit `float`, which can lose digits — and Java never does a lossy conversion silently on your behalf:
  >
  > ```java
  > float tax = 0.21;    // MAL — error: incompatible types: possible lossy conversion from double to float
  > float tax = 0.21f;   // BIEN — the f makes it a float literal, no conversion needed
  > ```
  >
  > Read the message literally: *possible* lossy, not *definitely* lossy. The compiler is not claiming this particular number would lose precision; it refuses the whole `double` → `float` direction on principle, because it cannot prove in general that it is safe. That word "possible" is the compiler's signature for every narrowing it blocks, and you will meet it again in the *Narrowing* section below.
- `double` — the default choice for decimals. Higher precision: up to ~15 significant digits. `3.141592653589793`, for example, fits comfortably in a `double`.

> **Money in Spring Boot:** never use `double` or `float` for financial values. Use `BigDecimal` — it is a plain Java class (`java.math` package, not Spring Boot) that does exact arithmetic. `double` cannot represent 0.1 exactly in binary because computers express numbers as sums of powers of 2 (1/2, 1/4, 1/8…), and 0.1 cannot be expressed as a finite sum of those powers — just like 1/3 cannot be written exactly in decimal (0.333…). The processor stores the closest approximation it can, and that small error accumulates across operations until you get `0.09999999...` instead of `0.1`. `BigDecimal` avoids this by operating on the actual digits, without the representation error.

**Boolean** — for flags and conditions:
- `boolean` — holds only `true` or `false`. Used for `isActive`, `hasRole`, `isEmpty`.

**Character** — for single characters:
- `char` — one character, enclosed in single quotes: `'A'`. Used rarely in web development.

### Building a `BigDecimal` — never `new BigDecimal(0.1)`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → read: "BigDecimal" — the constructors and why the `String` one is the safe default.

The callout above told you to reach for `BigDecimal` instead of `double` for money. There is a trap one step later: `BigDecimal` has a constructor that takes a `double`, and using it hands the `double` problem straight back to you, only now frozen into an object that claims to be exact.

Look at what each of the three ways to build "0.1" actually produces. This is real output, not an illustration:

```java
new BigDecimal(0.1)        // 0.1000000000000000055511151231257827021181583404541015625   ← MAL
BigDecimal.valueOf(0.1)    // 0.1                                                          ← BIEN
new BigDecimal("0.1")      // 0.1                                                          ← BIEN
```

The mechanism is the one the money callout described, caught in the act. By the time `new BigDecimal(0.1)` runs, the literal `0.1` has *already* been converted to a `double`, and a `double` cannot hold 0.1 — it holds the nearest binary value it can build out of halves, quarters and eighths, which is that 55-digit number. `BigDecimal` then does its job perfectly: it faithfully records the exact value it was handed. The error was not introduced by `BigDecimal`; it was baked into the argument before the constructor was even called, and `BigDecimal` is simply the first tool precise enough to show it to you.

The two safe forms both avoid ever letting the value exist as a `double`:

- **`new BigDecimal("0.1")`** — the `String` constructor reads the digits you literally wrote, one character at a time. No binary approximation happens because no `double` is ever involved. Reach for this when the value comes from a config file, a JSON body, or a literal you typed.
- **`BigDecimal.valueOf(0.1)`** — takes a `double`, but internally runs it through `Double.toString()` first and then parses *that* text. `Double.toString()` prints the shortest decimal that round-trips back to the same `double`, which for `0.1` is the string `"0.1"` — so you land on exactly the value the `String` constructor would have given you. Reach for this when the value is already sitting in a `double` variable and you cannot go back and change where it came from.

> **Then why does the `double` constructor exist at all?** Because it is the only one that tells the truth about a `double`. If you are debugging *why* a computation drifted, `new BigDecimal(someDouble)` is the tool that shows you the actual stored value rather than the friendly rounded print-out. It is a diagnostic instrument, not a way to create money. In application code, treat `new BigDecimal(` applied to a `double` or `float` as a bug — this is exactly what a reviewer flags in a pull request. (Passing an `int` or a `long` is harmless, since those hold their values exactly; it is only the floating-point types that arrive already wrong.)

In the TimeTrack backend, `TimeEntry.hours` is declared `private BigDecimal hours;` for this reason (`projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`) — hours get summed into reports, and a `double` would drift by a fraction of an hour once enough entries were added up.

### Comparing `BigDecimal` — `compareTo()` instead of `<`, `>`, or `equals()`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → read: "Operations on BigDecimal" — `compareTo()` and why it is not `equals()`.

Imagine a service needs to validate that hours worked fall between 0.5 and 24 (exactly the case for `TimeEntry.hours` in a timesheet). If `hours` is `BigDecimal`, writing `hours < new BigDecimal("24")` does not even compile:

```
error: bad operand types for binary operator '<'
  first type:  BigDecimal
  second type: BigDecimal
```

Read the two extra lines as the compiler showing its work: it names what it found on each side of the operator, so you can see that neither of them is a number it knows how to compare. `<` and `>` are built into the language for primitives only — they compile down to a single CPU instruction on a numeric value — and `BigDecimal` is an object, so there is nothing for that instruction to act on. Java has no operator overloading, so a class can never teach `<` to work on it; a class can only offer a *method*.

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

> 📖 Docs: [Oracle Docs — Primitive Data Types](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html) → read: "Default Values" — what a field holds before you assign to it, and why a local variable is different.

A variable is a named space in memory where you store a piece of data — one of the boxes from the diagram at the top of this file. In Java you always write the type before the name, because the compiler has to know how big that box is and what may legally go in it before the program ever runs. You can declare and assign in the same line, or declare first and assign later:

```java
int age = 31;           // declaration + assignment in one line
int count;              // declaration only — the box exists, nothing is in it yet
count = 0;              // assignment — now it holds something
```

### The compiler will not let you read a local variable you never assigned

Splitting the declaration from the assignment is legal, but there is a rule attached to it, and it is enforced at compile time rather than left to blow up at runtime. Every path through the code has to assign the variable before anything reads it:

```java
int count;
System.out.println(count);   // MAL — error: variable count might not have been initialized
```

The compiler runs an analysis called **definite assignment**: it walks every possible route the execution could take from the declaration to this line and asks "is there a route that reaches here without passing through an assignment?" If even one such route exists, it refuses to compile. That is why the message says "*might* not have been initialized" rather than "was not" — the compiler is not claiming this particular run would fail; it is saying it cannot prove the opposite for every run.

> **Then why does this compile for a field?** Because the rule applies to **local variables** only — variables declared inside a method. A **field** (declared directly in the class body, outside any method) is not covered by definite assignment: the JVM gives every field an automatic default value when the object is created. Numeric fields start at `0` (`0.0` for `double`/`float`), `boolean` fields at `false`, and every object-typed field — `String`, `Integer`, `User` — at `null`.
>
> ```java
> public class User {
>     private String name;       // starts as null   — a reference pointing at nothing
>     private boolean active;    // starts as false
>     private Long id;           // starts as null   — Integer/Long are objects, so null, not 0
> }
> ```
>
> The reason for the split is where each one lives. A field belongs to an object on the heap, and the JVM zeroes that whole block of memory as it allocates it, so a default is free. A local variable lives on the method's stack frame, which is reused memory from whatever call ran there before — so an unassigned local would hold leftover garbage, and rather than zero every frame the language simply forbids reading one. This is a direct consequence of the stack/heap split covered in [05-memory-model.md](05-memory-model.md).
>
> This is also the mechanism behind something you already met: a JPA entity's `Long id` is `null` before the row is saved, and that is not Hibernate setting it to `null` — it is the field's default, which nothing has overwritten yet.

### Scope — where the name is visible

A variable exists only inside the `{ }` block it was declared in, and vanishes at the closing brace. That block is called its **scope**:

```java
if (age > 18) {
    String message = "adult";
}
System.out.println(message);   // MAL — cannot find symbol: variable message
```

The variable is not "empty" out here — the name does not exist at all, which is why the error is `cannot find symbol` rather than a null complaint. The practical consequence is that if you need a value after a block, you declare it *before* the block and assign inside it. This is the same block-scoping as `let` and `const` in JavaScript; Java simply has no equivalent of the old function-scoped `var`.

### Naming conventions

These are not enforced by the compiler, but every Java codebase and every reviewer expects them, and Spring itself depends on the third one:

- **`camelCase` for variables, fields and methods** — `totalHours`, `isActive`, `findByEmail`. First word lowercase, each following word capitalised.
- **`UPPER_SNAKE_CASE` for constants** — `MAX_HOURS`, `DEFAULT_ROLE`. Reserved for `static final` values; seeing it tells a reader "this never changes" before they read the modifiers.
- **`PascalCase` for class names** — `TimeEntry`, `UserRepository`. Notice this is how you tell `Integer` (a class) from `int` (a primitive) at a glance.
- Names are written in full, not abbreviated. `numberOfEmployees`, not `numEmp`. Java code is verbose by culture and a consultancy code review will pick at short names.

### `final` — and the half-truth that it "is `const`"

`final` on a variable means it may be assigned exactly once; any later assignment is a compile error:

```java
final int MAX_HOURS = 24;
MAX_HOURS = 30;    // MAL — error: cannot assign a value to final variable MAX_HOURS
```

Comparing it to JavaScript's `const` is a genuinely direct anchor — the two behave the same way, including the part people get wrong in both languages. `final` freezes the **variable**, which for an object means it freezes the *reference*: the address in the box. It says nothing at all about the object that address points to.

Go back to the diagram at the top of the file and the rule becomes obvious. `final` puts a lock on the left-hand box. The object in the right-hand box is untouched, and anything holding that address can still change it:

```java
// MAL — thinking final made the list read-only
final List<String> names = new ArrayList<>();
names.add("Victor");        // ✅ compiles and runs — the list is now mutated
names.add("Ana");           // ✅ still fine — you never reassigned the variable
names = new ArrayList<>();  // ❌ error: cannot assign a value to final variable names

// BIEN — if you want the contents frozen, freeze the contents
final List<String> names = List.of("Victor", "Ana");
names.add("Luis");          // ❌ throws UnsupportedOperationException at runtime
```

Read the two errors side by side, because they are the whole lesson: reassigning the variable fails at **compile time** (`cannot assign a value to final variable names`), while mutating an immutable list fails at **runtime** (`UnsupportedOperationException`). `final` is a compiler-enforced promise about the name; immutability is a promise the object makes about itself. You need both to get "this really cannot change", and they are enforced by two different mechanisms at two different moments.

> **Why `final` shows up everywhere in Spring Boot code.** Service and controller classes declare their collaborators as `private final UserRepository userRepository;`. The `final` documents that once Spring injects the repository through the constructor, nothing may swap it out later — a bean's dependencies are fixed for the life of the application. It also lets the compiler catch a constructor that forgets to assign one of them. Constructor injection and this pattern are covered in the Spring Boot notes; here, just recognise `final` as the marker for "assigned once, never again".

---

## Type casting

> 📖 Docs: [Baeldung — Java Primitives Type Casting](https://www.baeldung.com/java-primitive-conversions) → read: "Widening Primitive Conversions" and "Narrowing Primitive Conversion" — the full conversion table and which direction needs a cast.

### Widening (automatic)

When you convert a smaller type to a larger one, the value always fits, so Java does the conversion for you with no extra syntax:

```java
int x = 42;
long y = x;        // int → long — automatic
double z = x;      // int → double — automatic
```

Java allows this silently because the destination type's range fully contains the source type's range — there is no value of `int` that a `long` cannot represent, so nothing can go wrong.

> **Exact scope: "widening" does not always mean "no data loss".** Two of the widening conversions are lossy, and Java performs them automatically anyway. `int` → `float` and `long` → `double` both move to a *wider* type that nevertheless has *fewer* significant digits, because a floating-point type spends part of its bits on the exponent instead of on the digits. A `float` has 32 bits like an `int`, but only about 24 of them carry digits:
>
> ```java
> int precise = 16777217;      // 2^24 + 1
> float widened = precise;     // automatic — no cast, no warning
> System.out.println(widened); // 1.6777216E7  ← 16777216, not 16777217. The 1 is gone.
> ```
>
> The same happens for `long` → `double` past 2⁵³. Nothing warns you, because the rule the compiler enforces is *range*, not *precision*: `float`'s range (±3.4 × 10³⁸) comfortably contains every `int`, so the conversion is legal, and the lost digit is collateral damage the language accepts. The reliable statement is therefore "widening never overflows", not "widening never loses data". For every narrowing conversion below, the compiler does stop you and demand a cast — which is exactly why these two lossy widenings are the dangerous ones: they are the losses nobody is watching.

### Narrowing (manual)

When you convert a larger type to a smaller one, there can be data loss — Java forces you to say so explicitly by writing the target type in parentheses before the value:

```java
double price = 19.99;
int rounded = (int) price;   // 19 — decimal part is dropped, not rounded

long bigNumber = 1234567890123L;
int smaller = (int) bigNumber;  // 1912276171 — not "roughly 1234567890123", a completely unrelated number
```

The `(int)` before the variable is the cast. Java does not do this automatically because you might lose data — you have to write it explicitly to signal that you accept the possible loss.

That second result deserves unpacking, because "may overflow" hides how violent the outcome is. A `long` is 64 bits and an `int` is 32, so the cast keeps the **low 32 bits and throws the high 32 away** — no rounding, no clamping to `Integer.MAX_VALUE`, no exception. It is a pair of scissors, not a conversion:

```
1234567890123L in binary (41 bits):

  100011111 01110001111110110000010011001011
  └───────┘ └──────────────────────────────┘
   high 9      the low 32 bits that survive
   bits —
   DISCARDED

  the surviving 32 bits, read back as an int  →  1912276171
```

Nine bits fall off the front and the remainder is reinterpreted as a fresh `int`. The result, 1912276171, has no useful relationship to the original 1234567890123 — it is not "approximately right", it is a different number entirely. And because the discarded bits included everything that made the value large, a number that was too big can just as easily come back **negative**: if the surviving 32nd bit happens to be a 1, that bit is the sign bit in an `int`, and the result is negative. This is the same odometer effect described next, seen from the bit level.

> **Silent wraparound:** when a number does not fit in the destination type, Java does not throw an error — it simply "rolls over". Picture a car odometer that reaches 999,999 and flips back to 000,000: exactly that happens with integers. `int`'s maximum value is 2,147,483,647; add 1 to it and you get −2,147,483,648, the minimum. The counter runs off the top end and reappears at the bottom. That is why narrowing (and integer overflow in general) can produce wrong results silently, with no exception to warn you.

---

## Integer arithmetic — two silent traps

> 📖 Docs: [Baeldung — Overflow and Underflow in Java](https://www.baeldung.com/java-overflow-underflow) → read: "Overflow and Underflow" and "Handling Underflow and Overflow of Integer Data Types" — including the `Math.addExact` family.

The wraparound callout above described what happens when a value does not fit. Casting is not the only way to get there: ordinary `+` and `*` on `int`s reach the same cliff, and so does `/`, in a different way. These two traps are the reason a report can quietly show the wrong total in production, with nothing in the logs.

### Integer division truncates — it does not round

When **both** operands are integer types, `/` performs integer division: it discards the fractional part rather than rounding it. This surprises people because the result looks like it was rounded, and half the time the rounded answer happens to be the same:

```java
7 / 2      // 3    — not 3.5, and not 4 either. The .5 is dropped.
-7 / 2     // -3   — truncation is toward zero, so it is not "round down" either
7 % 2      // 1    — the remainder that got thrown away
```

The trap is that nothing about the expression tells you which kind of division you are getting — it depends entirely on the *types of the operands*, which may be several method calls away:

```java
int totalHours = 7;
int entries = 2;

// MAL — average is 3, silently. No warning, no error, wrong report.
double average = totalHours / entries;

// BIEN — force one operand to double BEFORE the division happens
double average = (double) totalHours / entries;   // 3.5
```

The reason the first line fails is worth tracing, because it looks like it should work: the `double` on the left has no influence on the division at all. Java evaluates the right-hand side first, entirely on its own terms — two `int`s, so integer division, so `3`. Only *then* does it widen that `3` to `3.0` and store it. The `double` arrives one step too late; the information was already gone. The cast in the corrected version works because it changes an operand *before* the `/` runs, which makes the whole expression floating-point division.

> **The `(double)` goes on either operand, not on the result.** `(double) (totalHours / entries)` is still wrong — the parentheses make the integer division happen first and then widen the already-truncated `3`. You only need to convert one of the two operands; Java then widens the other one automatically to match, and the division is done in `double`. This is the single most common way this bug is "fixed" without actually being fixed.

And one operand it will not tolerate: `7 / 0` on integers throws `ArithmeticException: / by zero`. Floating point does not — `7.0 / 0` yields `Infinity` and `0.0 / 0.0` yields `NaN`, no exception at all. So the same-looking division either crashes or returns a nonsense value depending on the operand types.

### Overflow is silent, and it bites when values are multiplied

The odometer callout used `Integer.MAX_VALUE + 1` as its example, which reads like a contrived edge case. In practice you meet overflow through multiplication, where three perfectly ordinary numbers combine into something that no longer fits:

```java
// MAL — how many milliseconds in 30 days?
int ms = 1000 * 60 * 60 * 24 * 30;    // -1702967296   ← negative milliseconds
```

Every one of those literals is a small, sane `int`. But `int * int` produces an `int` in Java — the type of an arithmetic expression is decided by its operands, never by where the result is going — and the true answer, 2,592,000,000, is past `Integer.MAX_VALUE` (2,147,483,647). It wraps around into negative territory, and the program carries on cheerfully with a negative duration. Declaring the variable as `long` does not save you either, for exactly the reason integer division ignored the `double`: the multiplication has already been carried out in `int` before the assignment is considered.

```java
// BIEN — make the FIRST operand a long, so the whole chain is computed in long
long ms = 1000L * 60 * 60 * 24 * 30;   // 2592000000
```

One `L` on the first literal is enough. Java evaluates the chain left to right, and as soon as one operand is a `long`, the other is widened to `long` and the result stays `long` for the rest of the chain — so the value never passes through a 32-bit box on its way.

> **When you need to be *told* about an overflow, ask for it.** Java 8 added the `Math.*Exact` family — `addExact`, `multiplyExact`, `subtractExact` — which do the same arithmetic but throw instead of wrapping:
>
> ```java
> Math.addExact(Integer.MAX_VALUE, 1);   // throws ArithmeticException: integer overflow
> ```
>
> Use them where a wrong number is worse than a crash: totals on an invoice, quantities in a stock system, anything a person will act on. For a loop counter, plain `+` is fine. Being able to name this family in an interview is a cheap way to show you know overflow is silent by default rather than having merely heard of it.

---

## Wrapper classes — objects for primitives

> 📖 Docs: [Baeldung — Wrapper Classes in Java](https://www.baeldung.com/java-wrapper-classes) → read: "Autoboxing and Unboxing" — the conversion the compiler inserts for you, and the `valueOf()` / `intValue()` calls behind it.

Each primitive type has a corresponding wrapper class. You use wrapper classes when a method requires an **object** instead of a primitive.

**The most common case:** Java collections (`List`, `Map`, `Set`) only work with objects, not primitives. `List<int>` does not compile, and the compiler is blunt about why:

```
error: unexpected type
  required: reference
  found:    int
```

"Reference" is the word from the diagram at the top of this file — a type whose variable holds an address. A generic type argument must always be one, because a collection stores addresses in its slots; there is nowhere in it to put a raw 32-bit value. So you use `List<Integer>` instead. Collections are covered in detail in [10-collections.md](10-collections.md) — for now, just know they are Java's main data structures and they all require object types.

**Another case:** wrapper classes can be `null`. A primitive `int` cannot be null, but `Integer` can. In Spring Boot, database IDs are often typed as `Long` (not `long`) because Hibernate sets them to `null` until the entity is saved for the first time.

### When to use each — the practical rule

> **Preview — Spring Boot:** the snippet below uses `@Id`, `@GeneratedValue` and `@Value`, which are Spring Boot and JPA annotations you have not studied yet. `@Id` and `@GeneratedValue` mark the field that maps to the table's primary key and tell the database to generate it; `@Value` injects a value from the configuration file. They are here only to show *where* the primitive-vs-wrapper decision actually gets made in a real backend — you will implement all three in the Spring Boot notes.

Use the **wrapper** in two situations: (1) when `null` is a meaningful value — a JPA entity ID is `null` until it is saved for the first time, so the field goes as `Long`, not `long`; (2) when using collections, because `List<int>` does not exist in Java and you must write `List<Integer>`. In any other case, use the **primitive** — the value is always present and never null.

Both halves of this decision are live in the TimeTrack backend:

```java
// Long (wrapper) — because the id does not exist until JPA saves the entity
// File: .../com/victor/timetrack/model/User.java
@Id
@GeneratedValue
private Long id;

// long (primitive) — because the expiration is always configured, never null
// File: .../com/victor/timetrack/security/JwtUtil.java
@Value("${app.jwt.expiration}")
private long expiration;
```

(Full paths: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/User.java` and `.../com/victor/timetrack/security/JwtUtil.java`.)

| Primitive | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |

Read each row as a pair: the left column is the primitive you use when the value is always present, the right column is the object form you switch to when you need `null` or a collection. The name is not arbitrary — the wrapper is the capitalised full word (`int` → `Integer`, `char` → `Character`), which is also how you spot at a glance which of the two a field is using.

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

**The mechanism is not magic — it is the compiler writing the old code for you.** Autoboxing is a purely *compile-time* feature: the compiler sees a primitive where an object is required (or the reverse), and literally inserts the conversion call into the bytecode. The JVM at runtime has no idea autoboxing exists; it only ever sees the explicit calls. What you write and what actually gets compiled are these two columns:

| You write            | What the compiler emits          |
| -------------------- | -------------------------------- |
| `Integer a = 42;`    | `Integer a = Integer.valueOf(42);` |
| `int b = a;`         | `int b = a.intValue();`          |
| `ids.add(42);`       | `ids.add(Integer.valueOf(42));`  |
| `int f = ids.get(0);`| `int f = ids.get(0).intValue();` |

Read the right-hand column as "the code you would have had to type by hand before Java 5". Nothing else changed — same method calls, same objects, same cost. That is worth knowing for two reasons: it explains why boxing has a real performance price in a tight loop (each `valueOf` may allocate an object), and it explains the trap below, which is otherwise inexplicable.

> **Unboxing `null` throws a `NullPointerException` on a line with no visible method call.** This is the one autoboxing behaviour that will genuinely confuse you, and the mechanism above is the whole explanation:
>
> ```java
> Map<String, Integer> scores = new HashMap<>();
> int score = scores.get("missing");   // NullPointerException — but where?
> ```
>
> `get()` returns `null` for a key that is not there, which is a legal `Integer`. The problem is the assignment to `int`: an `int` has nowhere to put `null`, so the compiler has quietly appended `.intValue()`, and you are calling a method on `null`. Java's message since version 14 spells out exactly that, naming a method you never typed:
>
> ```
> java.lang.NullPointerException: Cannot invoke "java.lang.Integer.intValue()"
> because the return value of "java.util.Map.get(Object)" is null
> ```
>
> The fix is to receive it as the wrapper — `Integer score = scores.get("missing");` — and check for `null` before using it, or to ask for a fallback with `scores.getOrDefault("missing", 0)`. The general rule: any assignment from a wrapper to a primitive is a hidden `NullPointerException` waiting for a `null`, and that includes fields, method arguments and `return` statements, not just local variables.

### The `Integer` cache — why `==` accidentally works for small numbers

You already know from the String section that `==` on objects compares addresses, so comparing two `Integer`s with `==` should be wrong. Run it and you get a result that makes no sense:

```java
Integer a = 127, b = 127;
a == b            // true  ← ???

Integer c = 128, d = 128;
c == d            // false ← the same code, one number higher
```

Nothing about 127 and 128 is different as *values*. The difference is in the `Integer.valueOf()` call the compiler inserted for you a moment ago. That method does not build a new object every time: it keeps a pre-built array of `Integer` objects for the range **−128 to 127**, and for any value inside that range it hands back the *same cached object* instead of allocating. Two variables holding 127 therefore genuinely point at one object, and `==` on the two addresses is `true`. At 128 the cache is exhausted, `valueOf` allocates a fresh object each time, the two addresses differ, and `==` reverts to being wrong.

```
Integer a = 127 ─┐                 Integer c = 128 ──→ [ Integer 128 ]  (new object)
                 ├──→ [ cached Integer 127 ]
Integer b = 127 ─┘                 Integer d = 128 ──→ [ Integer 128 ]  (another new object)

     one object, so a == b is true        two objects, so c == d is false
```

> **Why does this cache exist at all?** Small integers are overwhelmingly the most common — loop counters, list sizes, status codes, ages. Boxing them millions of times would allocate millions of identical objects for the garbage collector to clean up, so the JVM pre-builds the common ones once at startup and reuses them. It is a memory optimisation that was never meant to be visible; `==` returning `true` is a side effect of it leaking through. The cache is safe precisely because `Integer` is immutable — sharing one object between unrelated pieces of code cannot cause a problem when nobody can change it.

The lesson is not "remember the range". It is that **`==` on wrappers is a bug that passes its own tests**: you write it, you try it with small numbers, it works, it ships, and it fails the first time a real ID exceeds 127. Always use `.equals()` for wrapper comparison, or unbox both sides to primitives first (`a.intValue() == b.intValue()`), where `==` compares values and is correct by definition. The same cache exists for `Long`, `Short` and `Byte` over the same −128 to 127 range (and for `Character` over 0 to 127, since a `char` has no negatives) — which is exactly why a `Long id` compared with `==` is such a reliable production bug: it behaves during development, where the test data has ids 1, 2 and 3, and breaks on real data.

### Useful wrapper methods

**Static methods** belong to the class itself, not to any specific object — that is why you call them on the class name (`Integer.parseInt("42")`) without creating an object with `new`. Static methods are covered in detail in [04-methods.md](04-methods.md).

These static methods are genuinely useful in everyday code:

```java
Integer.parseInt("42");     // String → int (primitive)
Integer.valueOf("42");      // String → Integer (object, possibly from the cache above)
Integer.MAX_VALUE;          // 2147483647 — the largest possible int value
Integer.MIN_VALUE;          // -2147483648
```

(To go the other way, `String.valueOf(42)` turns an `int` into a `"42"` — note that one is a method on `String`, not on `Integer`, so it belongs to the String section rather than here.)

**`parseInt` vs `valueOf` — the confusable pair.** They take the same argument and look interchangeable, and the difference is only in the return type: `parseInt` returns a primitive `int`, `valueOf` returns an `Integer` object. `valueOf` is in fact implemented by calling `parseInt` and then boxing the result — which means it also goes through the cache, so `Integer.valueOf("42") == Integer.valueOf("42")` is `true` while `Integer.valueOf("1000") == Integer.valueOf("1000")` is `false`. Pick by what you need next: `parseInt` when the value goes straight into arithmetic or an `int` variable, `valueOf` when it goes into a collection or a field that may be `null`. Reaching for the wrong one is harmless — autoboxing converts it — but naming the difference is a standard junior interview question.

> **Both throw when the text is not a number, and the message names the culprit.** This is the failure path you hit the first time a user types something unexpected into a form:
>
> ```java
> Integer.parseInt("abc");
> // java.lang.NumberFormatException: For input string: "abc"
> ```
>
> `NumberFormatException` is **unchecked**, so the compiler does not force you to handle it — nothing in your IDE will remind you this line can blow up. Note what counts as "not a number": `"42 "` with a trailing space fails too (unlike `Double.parseDouble`, `parseInt` does no trimming), as does `""` and `null`. Any time the string comes from outside your program — a form field, a URL path variable, a CSV row — this call needs either a `try/catch` or validation in front of it. Exception handling is covered in [11-exceptions.md](11-exceptions.md); for now, just register that this specific method is a common source of 500 errors.

---

## String

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basics" and "String Basic Manipulations" for the method catalogue, then [Guide to Java String Pool](https://www.baeldung.com/java-string-pool) → "String Interning" for why `==` sometimes appears to work.

`String` is not a primitive — it is a class. But Java treats it like a primitive in many ways (you can assign with `=`, no `new` needed).

```java
String name = "Victor";
String greeting = "Hello, " + name;                   // concatenation with +
String greeting2 = "Hello, %s".formatted(name);       // template substitution — Java 15+
```

The `.formatted()` method replaces placeholders in the string. `%s` means "a string goes here", `%d` means "an integer goes here". It is the same idea as template literals in JavaScript — `` `Hello, ${name}` `` — but with positional placeholders. The order matters: the values are matched to the placeholders left to right, in the order they appear in the string.

```java
"User %s has %d points".formatted("Victor", 100);  // "User Victor has 100 points"
"User %s has %d points".formatted(100, "Victor");  // MAL — arguments swapped
```

Swapping them does not fail at compile time — `formatted` takes `Object...`, so any argument in any order is a legal call as far as the compiler is concerned. It blows up when the line actually runs:

```
java.util.IllegalFormatConversionException: d != java.lang.String
```

Read that message as "`%d` was handed a `java.lang.String`". Note *which* placeholder complained: `%s` swallowed the `100` without a murmur, because `%s` just calls `toString()` on whatever it gets and every object has one. Only `%d` is fussy, because it has to produce digits. So a swapped pair fails at the *numeric* placeholder, never at the `%s` — worth knowing, because the error points at the second half of the string while the mistake is in the first.

For decimals, use `%f`. You can control how many decimal places to show with `.Nf` (N = number of digits): `"Price is %.2f euros".formatted(19.99)` → `"Price is 19.99 euros"`.

### Common methods

```java
name.length()                     // 6 — how many characters
name.toUpperCase()                // "VICTOR" — all uppercase
name.toLowerCase()                // "victor" — all lowercase
name.contains("ict")              // true — does the string contain this sequence?
name.startsWith("Vi")             // true — does it start with this?
name.replace("Victor", "World")   // "World" — replace all occurrences of a substring
name.trim()                       // removes leading/trailing spaces — but prefer strip(), see the next section
name.isEmpty()                    // false — true only if the string is exactly ""
name.isBlank()                    // false — true if empty OR contains only spaces
name.substring(0, 3)              // "Vic" — characters from index 0 to 2 (end index is excluded)
name.split(",")                   // splits by comma — returns String[]
name.equals("Victor")             // true — always use this for content comparison (see below)
name.equalsIgnoreCase("victor")   // true — same but ignores uppercase/lowercase
```

Two entries in that list are there because you will meet them in every tutorial, not because you should reach for them: `trim()` is superseded by `strip()`, and `isEmpty()` is usually the wrong check when `isBlank()` is available. The next section is exactly about that pair — read it before you use either.

### `strip()` vs `trim()` — use `strip()`

> 📖 Docs: [Baeldung — Java Strip Methods](https://www.baeldung.com/java-string-strip-methods) → read: "Comparing the Strip Methods vs the trim() Method" — and its sub-section "The strip() Method vs the trim() Method".

The method list above has `trim()` on it, and it is the one every tutorial written before 2018 teaches. Java 11 added `strip()`, which does the same job correctly, and `strip()` is what you should reach for from now on.

The two differ in *what they consider whitespace*, and the definitions are from different eras. `trim()` predates Unicode support in Java: it removes every character whose code point is less than or equal to `U+0020` (the ordinary space). That is a crude numeric rule — it happens to catch spaces, tabs and newlines, and it catches a few control characters that are not whitespace at all. `strip()` instead asks `Character.isWhitespace()`, which consults the actual Unicode tables:

```java
String em = "\u2003Victor\u2003";   // U+2003 EM SPACE — real Unicode whitespace

em.length()          // 8
em.trim().length()   // 8  ← MAL: trim left it alone, because U+2003 > U+0020
em.strip().length()  // 6  ← BIEN: strip knows U+2003 is whitespace
```

For plain ASCII input the two are identical — `"   Victor   "` comes back as `"Victor"` from both. The difference only shows up with text that came from somewhere real: a Word document, a PDF, a copy-paste out of a web page, a form filled in on a phone keyboard. Those routinely carry em spaces, ideographic spaces (`U+3000`, standard in Chinese and Japanese text) and non-breaking spaces, and `trim()` leaves every one of them in place — so a name that arrived as `"Victor\u2003"` fails an equality check against `"Victor"` and you get a "user not found" for a name that looks perfectly correct on screen. That is the whole argument for `strip()`: it costs nothing to type and it removes a class of bug you cannot see.

> **The one case where `strip()` also leaves the character behind.** Unicode's non-breaking space `U+00A0` — the character an HTML `&nbsp;` produces, and the most common invisible troublemaker in web input — is *not* whitespace by `Character.isWhitespace()`, because it is deliberately defined as non-breaking. Neither `trim()` nor `strip()` removes it. If you are cleaning input that came through a browser, you need `input.replace('\u00A0', ' ').strip()`. Nobody discovers this by reading docs; they discover it by staring at two strings that print identically and compare `false`.

The same upgrade applies to the emptiness checks in the list above: `isEmpty()` is `true` only for `""`, while `isBlank()` (also Java 11) is `true` for `""` *and* for any string made only of whitespace — using the same `Character.isWhitespace()` rule as `strip()`. In validation code, `isBlank()` is nearly always the check you actually meant, because `"   "` is not a real name either.

### Text blocks — multi-line strings without the escaping (Java 15+)

> 📖 Docs: [Baeldung — Java Text Blocks](https://www.baeldung.com/java-text-blocks) → read: "Usage" for the syntax and "Indentation" for the incidental-whitespace rule.

Embedding a chunk of JSON or SQL in Java source used to be genuinely painful, because every quote in the content had to be escaped and every line break spelled out:

```java
// MAL — this is what you wrote before Java 15
String json = "{\n  \"name\": \"Victor\",\n  \"role\": \"EMPLOYEE\"\n}";
```

You cannot read that, you cannot paste it into Postman to check it, and a single missing backslash is a compile error. A **text block** is a string literal delimited by three double quotes, and inside it quotes and newlines are just themselves:

```java
// BIEN — a text block
String json = """
        {
          "name": "Victor",
          "role": "EMPLOYEE"
        }""";
```

Two syntax rules the compiler enforces. The opening `"""` must be followed by a **line break** — content cannot start on the same line, and trying it gives you a message that names the rule directly:

```java
String s = """hello""";   // MAL — error: illegal text block open delimiter sequence, missing line terminator
```

The closing `"""` is freer: it may sit at the end of the last content line (as in the JSON above) or on a line of its own. That choice is not cosmetic, though — see the callout below.

> **Where did the indentation go?** The block above is indented eight spaces to line up with the surrounding code, yet the resulting string starts at column zero. The compiler strips what the spec calls **incidental whitespace**: it looks at every non-blank line *plus the line holding the closing `"""`*, finds the smallest indentation among them, and removes exactly that much from every line. So the indentation you added to keep the source readable costs nothing, and the indentation you added *on purpose* — the two spaces before `"name"` — survives, because it is deeper than the minimum.
>
> The consequence to remember: **moving the closing `"""` changes the string.** Put it on its own line at column zero and the minimum indentation becomes zero, so all eight spaces suddenly reappear inside your JSON. That is the one text-block surprise worth knowing before it happens.

The type is still `String` — a text block is a different way to *write* a literal, not a new type, so every method in the list above works on it, and `.formatted()` works on it too. Where you will actually reach for one: a JSON fixture in a test, a multi-line SQL query in a repository, or an HTML email template.

### String comparison — always use `equals()`

In Java, `==` compares **memory addresses** (references), not content. Two `String` variables can hold the exact same characters and still live at two different addresses — and `==` compares the addresses, so it returns `false` even though the text is identical.

`.equals()` always compares the actual characters — that is what you almost always want:

```java
String a = new String("hello");
String b = new String("hello");

a == b        // false — two separate objects, different addresses
a.equals(b)   // true — same characters, which is what you meant
```

> **Careful — string literals are a trap here.** If you write `String a = "hello"; String b = "hello";` (plain literals, no `new`), then `a == b` actually returns `true` — because Java keeps a single shared copy of each literal in a cache called the **string pool**, so both variables end up pointing to the very same object. That makes `==` *look* like it works. It breaks the moment one of the strings comes from somewhere else — user input, a database row, `new String(...)`, or a value built by concatenation at runtime — and then `==` silently returns `false`. The pool is exactly why you must never trust `==` for content: it works just often enough to fool you. The pool itself is covered in [05-memory-model.md](05-memory-model.md).

> **Why does `==` even exist for Strings?** For objects (including `String`), `==` checks if two variables point to the **same object in memory** — not just the same value. This matters in some cases (e.g. checking if two list entries are literally the same object), but for Strings you almost never want that.

### `String`, `StringBuilder`, `StringBuffer`

> 📖 Docs: [Baeldung — StringBuilder and StringBuffer in Java](https://www.baeldung.com/java-string-builder-string-buffer) → read: "Similarities" and "Differences" (with its "Performance" sub-section) — the synchronisation difference and when it costs you.

The problem: `String` is **immutable** — once created, it cannot be changed. Every time you do `str += something`, Java does not modify the original string. It creates a brand new `String` object with the combined content. In a loop with 1000 iterations, you create 1000 objects — slow and wasteful. ("Wasteful" is two separate costs, allocating each object and then cleaning it up; [05-memory-model.md](05-memory-model.md) picks this exact loop back up once garbage collection is on the table. For now: one object per iteration, all but the last thrown away.)

`StringBuilder` uses a **buffer** to solve this — a space in memory where it accumulates the pieces of the string while you are building it, like a whiteboard where you keep writing until you have the final result. You modify it in place without creating new objects, and when you are done you call `.toString()` to get the finished string.

The concept of **thread-safety** shows up here because `StringBuilder` is not thread-safe — and in Spring Boot this matters because each HTTP request arrives on a separate thread. If you declared a `StringBuilder` as a shared field on a Spring bean (which is a singleton), multiple threads could write to it at the same time and corrupt the result.

> **Preview — Spring Boot:** the snippet below is annotated `@Service`, which you have not studied yet. It marks a class Spring should create **once** at startup and hand to everyone who needs it — a *singleton*, one shared instance for the whole application. That single word is the whole reason the example is dangerous: one object, every request thread writing into it. You will implement `@Service` in the Spring Boot notes; here it only sets the scene.

```java
// MAL — shared across all threads (never do this with StringBuilder)
@Service
public class ReportService {
    private StringBuilder sharedBuilder = new StringBuilder();  // ← all threads share this
}

// BIEN — local to the method, only exists during that one request
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

> 📖 Docs: [Baeldung — Guide to var in Java](https://www.baeldung.com/java-10-local-variable-type-inference) → read: "Introduction" and "Illegal Use of var" — the cases where the compiler refuses to infer.

Normally you write the type on the left side: `List<Employee> employees = new ArrayList<>()`. With `var`, Java infers the type from the right side — you do not have to write it:

```java
var name = "Victor";                    // Java infers: String
var age = 31;                           // Java infers: int
var employees = new ArrayList<Employee>();  // Java infers: ArrayList<Employee>
```

This does **not** make Java dynamic like JavaScript's `var`. In JavaScript, a variable can change type while the program runs (`var x = 1; x = "hello"` is fine). In Java that is not possible.

Two concepts help here: **compile time** is when Java translates your source code to bytecode — before the program runs. **Runtime** is when the program is actually executing. With `var`, Java figures out the type during compilation: it sees `"Victor"` on the right side and decides the type is `String`. That type is locked in the bytecode and never changes — exactly as if you had written `String name = "Victor"` yourself.

Only works for local variables (inside methods). Cannot be used for fields, method parameters, or return types.

> **`var` needs something to infer *from*, and says so plainly when there is nothing.** The type comes entirely from the right-hand side, so the two ways of leaving that side uninformative are both compile errors:
>
> ```java
> var x;           // MAL — error: cannot infer type for local variable x
>                  //         (cannot use 'var' on variable without initializer)
> var y = null;    // MAL — error: cannot infer type for local variable y
>                  //         (variable initializer is 'null')
> ```
>
> The parenthesised second line is the compiler telling you *which* of the two cases you hit. The first is the split declaration you saw in the Variables section — perfectly legal with an explicit type (`int count;`), impossible with `var`, because there is nothing to read the type off. The second fails because `null` is a legal value of *every* reference type, so it narrows nothing; if you genuinely want a null-initialised variable you must name the type yourself (`String y = null;`).
>
> This is also why `var` cannot be used on a field or a method parameter: a parameter's value only arrives when the method is called, long after the compiler needed to fix the type.

Useful when the type is long and obvious from the right side: `var employees = employeeRepository.findAll()` is cleaner than `List<Employee> employees = employeeRepository.findAll()`.

---

You now have the raw materials: the eight primitives, their wrapper objects, `String` with its `strip()`/text-block conveniences, casting between types, and `var`. Two threads run through everything on this page and both continue into the next file. The first is **value versus reference** — the diagram at the top explains `==` on Strings, `final` on a `List`, the `Integer` cache, and null unboxing, and it is the idea [05-memory-model.md](05-memory-model.md) eventually finishes. The second is that **Java fails at two different moments**: some mistakes the compiler refuses outright (`integer number too large`, `possible lossy conversion`, `cannot infer type`), and some it lets through to blow up or go quietly wrong at runtime (overflow, truncated division, `NumberFormatException`). Learning which is which *is* learning Java.

But a variable that just sits there holding a value does nothing on its own — a program has to *decide* and *repeat*: run this block only if the age is over 18, loop over every entry in the list. That is control flow, and it is what [03-control-flow.md](03-control-flow.md) covers next — `if`/`else`, `switch`, and the loops that put these types to work. Watch for the same silent-versus-loud split there: switching on a `null` String and running an index one step past the end of an array are both runtime failures, and both are consequences of what you just read here.
