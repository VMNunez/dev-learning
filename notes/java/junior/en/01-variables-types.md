# Variables and Types

> 📖 [Baeldung — Java primitives](https://www.baeldung.com/java-primitives) → read: "Overview" and "Primitive Data Types"
> 📖 [Oracle Docs — Primitive types and variables](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)

The [intro](00-intro-java.md) left you with the big idea that Java is **statically typed**: every variable has a type fixed at compile time, and that type never changes. That raises the obvious next question — *what are those types?* This file answers it. Before you can write a single class, a loop, or a method, you need the raw materials: the exact set of types Java gives you to hold a number, a true/false value, a piece of text, and how they behave in memory. Everything from here on — every field in every Spring Boot entity, every method parameter — is built out of the types on this page.

## Primitive types

> 📖 Docs: [Baeldung — Introduction to Java Primitives](https://www.baeldung.com/java-primitives) → read: "Primitive Data Types" — the eight types with their exact ranges, one sub-section each, plus "Overflow".

In Java there are two ways to store data in memory. The first is to store the **value directly**: the data itself lives inside the variable, in the memory slot that variable occupies. The second is to store a **reference** — instead of the data itself, the variable holds a memory address that points to where the real object is, like a link. **Primitive types** use the first form: they store the value directly, no references. **Objects** (like `String`, `User`, or any class) use the second.

This distinction — storing the value or storing an address — is the basis of almost everything you will see in the rest of the page, so it is worth drawing. The two declarations below are written almost the same way, but they leave memory in two different shapes: one holds the value, the other holds an address.

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

Everything that looks contradictory later on this page comes out of the diagram above — that is, out of how each piece of data is stored in memory. For example: `==` on two `String`s compares the two memory addresses the variables hold, not the text those addresses point to. That is why text is compared with `equals()` instead; the methods that actually do compare a `String` — `equals()`, `equalsIgnoreCase()`, `compareTo()` — are in [02-strings.md](02-strings.md), and what `equals()` is really asking is explained in [06-oop-classes.md](06-oop-classes.md).

Another quirk that comes out of the same thing: an `int` can never be `null`, because its memory slot only fits a number and there is no number that means "empty". An `Integer` can be, because its slot holds an address rather than a number, and an address does admit the special value "I point to no object" — which is exactly what `null` means.

What the drawing does not yet tell you is *where* those two slots sit inside the program's memory: the variable lives in one area (the stack) and the object it points to lives in another (the heap). Put in terms of the two cases in the drawing: when you declare a primitive, the variable and its value are not two things kept in two places — the variable **is** the slot reserved on the stack, and the value is written directly inside that slot; when you declare an object, the stack holds only the variable, and what is written inside it is not the object but the heap address where that object lives; the whole object sits on the heap. The rule is: **every local variable lives on the stack and every object lives on the heap** — and an object's fields are not local variables, so they travel inside their object, on the heap. That second half of the picture is the subject of [05-memory-model.md](05-memory-model.md), which picks this diagram back up in detail.

Java has 8 primitive types. Each has a fixed size and a range of possible values. The ranges are useful to know when you need to switch types: for example, if a counter can exceed 2.1 billion, `int` is too small and you need `long`.

| Type      | Size   | Approximate range                          | Typical use | Example                  |
| --------- | ------ | ------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------ |
| `byte`    | 8 bit  | ±1.27 × 10²                                | Almost never on its own: shows up as `byte[]` when reading a file or a request body     | `byte level = 5;`        |
| `short`   | 16 bit | ±3.27 × 10⁴                                | Practically never in backend code; only to save memory in very large arrays             | `short year = 2025;`     |
| `int`     | 32 bit | ±2.14 × 10⁹                                | The default integer: counters, loop indexes, ages, quantities                           | `int age = 31;`          |
| `long`    | 64 bit | ±9.2 × 10¹⁸                                | Database ids and millisecond timestamps (`System.currentTimeMillis()`)                  | `long id = 1234567890L;` |
| `float`   | 32 bit | ±3.4 × 10³⁸ (~7 significant digits)        | Almost never: graphics or scientific data where precision is spare and memory is not    | `float tax = 0.21f;`     |
| `double`  | 64 bit | ±1.7 × 10³⁰⁸ (~15 significant digits)      | Measurements and scientific maths (weights, distances, percentages). **Never money** — use `BigDecimal` | `double price = 19.99;`  |
| `boolean` | 1 bit of information | `true` or `false`              | Yes/no state and the result of a condition: `isActive`, `hasPermission`                 | `boolean active = true;` |
| `char`    | 16 bit | One UTF-16 code unit (0 to 65,535)         | A single standalone character: an initial, a separator, an exam grade                   | `char grade = 'A';`      |

The `Typical use` column is the one that answers "so which do I pick?": day to day you will write `int`, `long`, `boolean` and `double`, and the other four you will **read** in other people's code far more often than you will write them.

The `Size` column deserves a closer reading, because it actually answers two different questions that almost always give the same number:

- **How much information fits in the type** — how many different values it can represent.
- **How many bits of memory the JVM hands it** — what it really costs in RAM.

For the seven numeric types the two answers coincide: an `int` holds 32 bits of information and occupies 32 bits. That is why you can read the column without thinking about it.

`boolean` is the only row where they come apart. In information it carries exactly one bit: it has just two possible values, `true` and `false`, and one bit is enough to tell two values apart. In memory it costs far more, because the JVM specification defines no way to store a lone bit — a `boolean` local or field takes a full slot, in practice the space of an `int`. The one exception is when they sit in a row inside a `boolean[]`: there they are packed down, one byte each.

> **What the `1 bit` in that row is actually telling you.** It tells you the type has two possible values, not that it costs you one bit of RAM. That is the difference between "this piece of data only needs one bit to express itself" and "this piece of data occupies one bit in memory" — the first is true, the second is not. In practice this changes not a line of the code you write; it is here so the row does not leave you with a false idea of what a `boolean` costs.

A **Unicode character** is any symbol from any writing system in the world: Latin letters, Chinese, Arabic, emojis, mathematical symbols. The Unicode standard assigns a unique number (a *code point*) to every symbol — and `char` stores one 16-bit slice of that numbering, from 0 to 65,535.

> **Exact scope: a `char` does not hold "any Unicode character".** What a `char` holds is a 16-bit number, from 0 to 65,535, and that number is the symbol's code point: its position in the Unicode table. The catch is that the table holds far more than 65,536 symbols — it runs up to position 1,114,111 — so a `char` only reaches the symbols that fall inside its first 65,536 positions. That is what "up to U+FFFF" means: `U+FFFF` is the usual way of writing the number 65,535 in hexadecimal, and it marks the last symbol a `char` reaches. Latin letters, Greek, Cyrillic, Arabic and most of Chinese fit inside it. Everything above that number — emoji, many historical scripts, most mathematical alphanumerics — does not fit in 16 bits, and Java stores it split across **two** `char`s that only mean anything together (a *surrogate pair*). That is why no `char` can hold "😀": it is not that it barely misses, it is that two are needed. Try it and the compiler stops you before the program ever runs:
>
> ```java
> char c = '😀';   // MAL — error: unclosed character literal
> ```
>
> The message reads oddly until you know the mechanism: the compiler consumes the first of the two code units, expects the closing `'` immediately after it, finds the second code unit instead, and reports the literal as unclosed. It is not a badly worded "too many characters" error — from the compiler's point of view a `char` literal holds exactly one code unit and the emoji simply is not one.
>
> That split into one or two `char`s does not stay inside the `char` type: `String` drags it along too, since a `String` is just a sequence of `char`s. That is why `"😀".length()` returns **2**, not 1: `length()` does not count symbols, it counts how many `char`s the `String` holds, and the emoji takes two of them. If what you want is to count symbols the way a person reading them sees them — the emoji counts as one, even though it takes two `char`s internally — that count is what `"😀".codePointCount(0, 2)` gives you, and it returns **1**. This is the mechanism behind every "my substring cut an emoji in half" bug. In web development you rarely touch `char` directly — full text goes in `String` — but the length surprise reaches you through `String`.

In practice you use `int`, `long`, `double`, and `boolean` for almost everything. `float` and `byte` are rarely needed.

### Reference variables and `null` — enough to read the rest of this page

```java
int number;      // declared, not assigned yet
String name;     // declared, not assigned yet
```

In the code above, `name` raises a question `number` cannot raise: both are declared and neither has been assigned anything yet, so what is written inside `name`?

`number` is a 32-bit slot with a number always written in it. An `int` field of a class you declare and never assign starts out as `0` — yes, exactly that: declared with no value, and it begins at `0`, because Java fills those 32 bits with zeros when the object is created. (A local variable is the exception: there Java fills in nothing, and the compiler forces you to assign it before you read it.) And there is no way to leave that slot "empty": the 32 positions are always occupied by zeros and ones, and every possible arrangement of those bits is already taken — each one means some specific number. None is left over to be given the meaning "nothing here".

`name` does not hold the text: it holds the memory address where the `String` object lives. With addresses there is room left over, because some values do not correspond to any real object. Java sets one of those values aside — not an object and not a bit, but one of the bit patterns that fit in the address slot and correspond to the location of no real object — and gives it a single meaning — "this variable points at no object" — and that value is **`null`**. That is why `name` can answer the question above and `number` cannot: `null` is just another of the addresses that fit in the slot, and it exists precisely to say there is nothing there.

```java
String name = null;      // BIEN — the box exists and holds "points to nothing"
int number = null;       // MAL — error: incompatible types: <null> cannot be converted to int
```

That is the whole of the primitive-versus-reference split you need for this page: a primitive variable points at its value — or more exactly, *is* its value — while a reference variable points at an object and may point at none.

> **What is still missing about `null`, and which file each part is in.** Being able to read `null` in the examples still to come in this same file — the `user != null` check in the operators section, the `Long id` that starts out `null`, the `null` a map returns for a key that is not there — is everything this file asks of you. Three questions stay open, and none of them can be answered here because each one needs something you have not studied yet.
>
> The first: what exactly is written inside a reference variable, and why the program blows up on the line where you use a reference holding `null` and not before. That is in [05-memory-model.md](05-memory-model.md).
>
> The second: at which point in the code you check whether a value is `null`. The usual place is the first line of the method that receives it: if the incoming value is `null`, the method stops right there and never starts working with it, so a useless value never reaches the lines below or the methods those lines call. That first-line check is called a _guard clause_. Writing one means knowing what a parameter and a return value are first, so it is in [04-methods.md](04-methods.md).
>
> The third: what an object is — the thing the reference points at when it is not `null` — and how one object is compared with another. That is in [06-oop-classes.md](06-oop-classes.md).

### Types by category

The table above gave you all 8 primitives, with their size and their range. This section regroups them by what they are for, and stops only on the ones you will actually write day to day, along with the traps they bring with them.

**Integer numbers** — for counting, IDs, ages, quantities:
- `byte` and `short` — whole numbers just like `int` and `long`, only with a much smaller range. They cannot hold decimals. In practice you will see them in old code or when working with binary data.
- `int` — your everyday whole number. Use this by default.
- `long` — when `int` is not big enough. Database IDs are often `Long` because they grow very large. Notice the `L` suffix: `1234567890L`.

> **Why the `L` suffix is not optional.** A **literal** is a value written out as-is in the source code: the `1234567890123` in the example below, or the `0.21` you will meet in the next bullet — the number itself, not the variable holding it nor the result of an operation. And a bare **integer** literal in Java source is an `int`, always — the integer one only: a literal with a decimal part such as `0.21` is a `double` by default, never a `float`, and that is what the `f` suffix in the next bullet is about. The compiler decides the literal's type *before* it looks at the variable you are assigning it to. So in `long id = 1234567890123;` the compiler reads `1234567890123` as an `int` literal, finds it does not fit in 32 bits, and stops right there:
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

> **Money — never `double` or `float`.** For financial values use `BigDecimal`: a plain Java class, from the `java.math` package, that does exact arithmetic. `double` cannot represent 0.1 exactly in binary because computers express numbers as sums of powers of 2 (1/2, 1/4, 1/8…), and 0.1 cannot be expressed as a finite sum of those powers — just like 1/3 cannot be written exactly in decimal (0.333…). The processor stores the closest approximation it can, and that small error accumulates across operations until you get `0.09999999...` instead of `0.1`. `BigDecimal` avoids this by operating on the actual digits, without the representation error.

**Boolean** — for flags and conditions. A *flag* is a variable whose only job is to answer yes or no to a question about the state of something: `isActive` ("is this account still active?"), `hasRole` ("does this user have this role?"), `emailVerified` ("has the address been confirmed?"). It does not hold a piece of domain data, it holds a decision already made, so the code that comes after can ask about it with an `if` instead of recomputing it:
- `boolean` — holds only `true` or `false`. Used for `isActive`, `hasRole`, `isEmpty`.

**Character** — for single characters:
- `char` — one character, enclosed in single quotes: `'A'`. Used rarely in web development.

### `int` or `long` — how to choose, and when the literal needs the `L`

The table gives you the exact ranges, but you do not need to memorise them: to decide between `int` and `long` a single reference number is enough, the 2.1 billion ceiling of `int`. **Default to `int`, and reach for `long` only when the value can plausibly pass about 2.1 billion.** In backend work that is a short and predictable list: database identifiers (a table rarely holds two billion rows, but ids come from a sequence that never reuses a number, so they outrun the row count), timestamps in milliseconds since 1970 (`System.currentTimeMillis()` returns a `long`, and milliseconds passed the `int` range about 25 days into 1970), and time measured in nanoseconds (`System.nanoTime()`, used to time how long a method takes: an `int` of nanoseconds runs out after 2.1 seconds). Ages, list sizes, page numbers, HTTP status codes and loop counters stay `int` forever.

> **Choosing the type and writing the suffix are two separate decisions.** The `L` belongs to the *literal*, not to the variable, so a `long` variable does not automatically need one. What makes the first line below work is that there is an `int` literal being stored in a `long`, and that direction — from a smaller type to a wider one — is precisely the one Java allows without asking you for anything: it has a name of its own, **widening**, and Java performs it silently. The opposite, putting a large value into a smaller type, is **narrowing**, and that one it makes you request in writing. Both have their own section further down; for now, hold on to this: the suffix has nothing to do with the variable's type, only with whether the literal fits in an `int`:
>
> ```java
> long smallId = 5;               // BIEN — no suffix needed
> long bigId   = 1234567890123L;  // the L is required here
> ```
>
> The first line is fine because `5` is a perfectly legal `int` literal and `int` → `long` is a widening conversion, which Java performs silently (the *Widening* section below). The second needs the suffix because the literal itself does not fit in 32 bits, and the compiler judges the literal before it ever looks at the variable — the callout above traces that exact error. So the rule is: **suffix the literal only when the literal alone is too big for an `int`**. Writing `5L` is not wrong, just noise.

There is a third place the `L` decides the outcome, and it has nothing to do with the declared type of the variable: arithmetic. `1000 * 60 * 60 * 24 * 30` overflows even when you store the result in a `long`, because the multiplication is carried out in `int` before the assignment is considered. That last part is the piece worth getting right, because it is counter-intuitive: the compiler resolves the right-hand expression **whole and on its own**, without once looking at which variable it is going into. And the type of an arithmetic operation is decided by its operands, never by its destination: `int * int` gives `int`, always. The trace is this:

> 1. `1000 * 60` → both operands are `int` literals, so the result is an `int`: `60000`.
> 2. `60000 * 60` → still `int * int`: `3600000`.
> 3. `3600000 * 24` → `int`: `86400000`.
> 4. `86400000 * 30` → `int` again, but the true result, 2,592,000,000, does not fit in an `int`. It overflows **here**, at step 4, and what is left is a negative number.
> 5. **Only now** does the assignment come into play: that already-broken `int` is taken and converted to `long` (widening). The conversion works perfectly — it is converting the garbage with complete fidelity.
>
> Declaring the variable as `long` arrives too late: the damage is done at step 4. What fixes the calculation is forcing the arithmetic itself to be `long`, by putting the `L` on the first literal (`1000L * 60 * 60 * 24 * 30`): from there on every step is `long * int`, Java promotes the `int` to `long`, and the whole chain is computed in 64 bits.

That is the *Overflow* section further down — and it is the case where a missing `L` produces a wrong number instead of a compile error.

### Building a `BigDecimal` — never `new BigDecimal(0.1)`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → read: "BigDecimal" — the constructors and why the `String` one is the safe default.

The section above told you to reach for `BigDecimal` instead of `double` for money. There is a trap one step later: `BigDecimal` has a constructor that takes a `double`, and using it hands the `double` problem straight back to you, only now frozen into an object that claims to be exact.

Look at what each of the three ways to build "0.1" actually produces. This is real output, not an illustration:

```java
new BigDecimal(0.1)        // 0.1000000000000000055511151231257827021181583404541015625   ← MAL
BigDecimal.valueOf(0.1)    // 0.1                                                          ← BIEN
new BigDecimal("0.1")      // 0.1                                                          ← BIEN
```

The mechanism is the one the _Types by category_ section, earlier in this file, already described in its **Money — never `double` or `float`** note — caught in the act. By the time `new BigDecimal(0.1)` runs, the literal `0.1` has *already* been converted to a `double`, and a `double` cannot hold 0.1 — it holds the nearest binary value it can build out of halves, quarters and eighths, which is that 55-digit number. `BigDecimal` then does its job perfectly: it faithfully records the exact value it was handed. The error was not introduced by `BigDecimal`; it was baked into the argument before the constructor was even called, and `BigDecimal` is simply the first tool precise enough to show it to you.

The two safe forms both avoid ever letting the value exist as a `double`:

- **`new BigDecimal("0.1")`** — the `String` constructor reads the digits you literally wrote, one character at a time. No binary approximation happens because no `double` is ever involved. Reach for this when the value comes from a config file, a JSON body, or a literal you typed.
- **`BigDecimal.valueOf(0.1)`** — takes a `double`, but internally runs it through `Double.toString()` first and then parses *that* text. `Double.toString()` prints the shortest decimal that round-trips back to the same `double`, which for `0.1` is the string `"0.1"` — so you land on exactly the value the `String` constructor would have given you. Reach for this when the value is already sitting in a `double` variable and you cannot go back and change where it came from.

> **Then why does the `double` constructor exist at all?** Because it is the only one that tells the truth about a `double`. If you are debugging *why* a computation drifted, `new BigDecimal(someDouble)` is the tool that shows you the actual stored value rather than the rounded, friendly number. It is a diagnostic instrument, not a way to create values that hold money. In code that ships to production, treat `new BigDecimal(` applied to a `double` or `float` as a bug — this is exactly what a reviewer flags in a pull request. (Passing an `int` or a `long` is harmless, since those hold their values exactly; it is only the floating-point types that arrive already wrong.)

In the TimeTrack backend, `TimeEntry.hours` is declared `private BigDecimal hours;` for this reason (`projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/TimeEntry.java`) — hours get summed into reports, and a `double` would drift by a fraction of an hour once enough entries were added up.

### Comparing `BigDecimal` — `compareTo()` instead of `<`, `>`, or `equals()`

> 📖 Docs: [Baeldung — BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger) → read: "Operations on BigDecimal" — `compareTo()` and why it is not `equals()`.

Imagine a service needs to validate that hours worked fall between 0.5 and 24 (exactly the case for `TimeEntry.hours` in a timesheet). If `hours` is `BigDecimal`, writing `hours < new BigDecimal("24")` does not even compile:

```
error: bad operand types for binary operator '<'
  first type:  BigDecimal
  second type: BigDecimal
```

The first line of the error names the failure — `bad operand types for binary operator '<'`, meaning the operands you handed to `<` are not of a type that operator accepts. The two extra lines are the compiler telling you what it found on each side of the operator, so you can see that neither of them is a number it knows how to compare. `<` and `>` are built into the language for primitives only — they compile down to a single CPU instruction on a numeric value — and `BigDecimal` is an object, so there is nothing for that instruction to act on. Java has no **operator overloading**: it does not let you redefine what `+`, `<` or `==` mean when applied to your own classes. The meaning of each symbol is fixed inside the language and no class can change it. (Other languages do allow it — in C++ or Python a class can declare what `<` does on its objects — which is why it is worth knowing Java chose the opposite.)

That is the sentence worth taking apart. When you write `a < b`, the compiler does not go looking inside `a`'s class for anything: `<` is a language instruction that only knows how to operate on primitive numbers, so if the operands are not primitives there is nothing to execute and the error lands at compile time. The `BigDecimal` class has no way to say "when someone writes `<` on me, do this". What a class can offer you are **methods** — names you call explicitly with a dot — and that is exactly what `BigDecimal` does: instead of a symbol the language reserves, it offers you `compareTo()`.

```java
BigDecimal a = new BigDecimal("0.5");
BigDecimal b = new BigDecimal("24");

a < b;              // WRONG — does not compile: `<` does not exist for objects
a.compareTo(b) < 0; // RIGHT — a method on the class, and the `<` now compares two ints
```

The next instinct is usually to use `.equals()` to compare two `BigDecimal`s, but there is a trap: `.equals()` on `BigDecimal` also compares the **scale** (how many decimal places the number is internally represented with), not just the mathematical value. That is why `new BigDecimal("24.0").equals(new BigDecimal("24"))` returns `false` — to Java, "24.0" and "24" are objects with different scales (one decimal digit versus none), even though they are mathematically the same number.

The correct way to compare two `BigDecimal`s is with `compareTo()`. `BigDecimal` implements the `Comparable<BigDecimal>` interface, which provides the `compareTo(BigDecimal other)` method. An **interface** here is just a contract a class signs saying "I provide these methods" — what interfaces are and how you write your own is [07-interfaces-abstract.md](07-interfaces-abstract.md), and the `<BigDecimal>` in angle brackets is a *generic type argument*, read for now as "comparable specifically against other `BigDecimal`s" and covered in full in [09-generics.md](09-generics.md). Neither is something you need today; you only need to know where `compareTo` comes from. This method does compare the actual mathematical value of the two `BigDecimal`s involved — the object you call it on (`this`) and the one you pass as the argument (`other`) — ignoring scale, and returns an `int`:

- negative if `this` is less than `other`
- `0` if they are mathematically equal
- positive if `this` is greater than `other`

`this` is the `BigDecimal` on the left of the dot, and `other` is the one inside the parentheses:

```java
new BigDecimal("10").compareTo(new BigDecimal("24"));   // negative → this (10) is less than other (24)
new BigDecimal("24").compareTo(new BigDecimal("24.0")); // 0        → same mathematical value, different scales
new BigDecimal("30").compareTo(new BigDecimal("24"));   // positive → this (30) is greater than other (24)
```

> **Look at the sign only, never at the exact number.** The javadoc for `compareTo` promises a negative, zero or positive `int` and nothing more: it does not guarantee `-1` or `1`. That is why the correct pattern is always `... compareTo(...) < 0`, never `... compareTo(...) == -1`.

The pattern is always the same: call `compareTo()`, then compare the resulting `int` against `0` with the normal operators (`<`, `>`, `==`) — because now you are comparing two primitive `int`s, not two `BigDecimal` objects.

```java
BigDecimal hours = request.getHours();

if (hours.compareTo(new BigDecimal("0.5")) < 0 || hours.compareTo(new BigDecimal("24")) > 0) {
    throw new RuntimeException("Hours must be between 0.5 and 24");
}
```

(`throw new RuntimeException(...)` is **throwing an exception**: the method stops on that line and, instead of returning a value, hands an error object back to whoever called it. Throwing and handling are the two halves of the same story and here you are only doing the first — read it as "stop and report". Who picks that error up afterwards, and how it is handled, is [11-exceptions.md](11-exceptions.md).)

Read it as: "if `hours` compared to 0.5 is negative (meaning `hours` is less than 0.5) OR `hours` compared to 24 is positive (`hours` is greater than 24), throw the exception".

> **`compareTo() == 0` for equality, never `equals()` — as we saw above.** If you ever need to check value equality between two `BigDecimal`s (e.g. "is the total billed exactly 100?"), use `total.compareTo(new BigDecimal("100")) == 0`, not `total.equals(new BigDecimal("100"))` — because if `total` arrived as `"100.00"` (with two decimal places, common when it comes from a `DECIMAL(10,2)` database column), `.equals()` would return `false` even though the value is identical.

### `BigDecimal` arithmetic — every operation returns a new object, and division demands a scale

> 📖 Docs: [Java SE 25 API — `java.math.BigDecimal`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html) → read: the class description ("immutable, arbitrary-precision signed decimal numbers") and the entries for `divide` and `setScale`.

`BigDecimal` is **immutable**: no method on it ever changes the object you called it on. Every arithmetic method builds and returns a *new* `BigDecimal` and leaves the original exactly as it was. That is the most common `BigDecimal` mistake by a distance, and it fails silently — the code compiles, runs, and reports the old number:

```java
BigDecimal total = new BigDecimal("10.00");
total.add(new BigDecimal("5.00"));          // MAL — the result is computed and thrown away
System.out.println(total);                  // 10.00

total = total.add(new BigDecimal("5.00"));  // BIEN — reassign to keep the result
System.out.println(total);                  // 15.00
```

There is no compiler error, because the first call is a legal expression whose value you chose to ignore — exactly like writing `list.size();` on a line of its own. The mechanism is worth stating plainly: `add` has no way to change `total`, because the object `total` points at exposes nothing that alters its digits; all `add` can do is compute the sum, wrap it in a new object, and hand you the address of that new object. If nobody stores that address, it is garbage a moment later.

The four operations are named methods, for the reason the `compareTo` section gave: Java has no operator overloading, so a class can never teach `+` to work on it.

```java
BigDecimal net  = new BigDecimal("100.00");
BigDecimal rate = new BigDecimal("0.21");

BigDecimal vat   = net.multiply(rate);   // 21.0000   ← four decimal places, not two
BigDecimal gross = net.add(vat);         // 121.0000
BigDecimal diff  = gross.subtract(net);  // 21.0000
```

**Scale is the number of digits kept after the decimal point, and it is part of the object rather than a display setting.** `multiply` adds the two scales together — two decimals times two decimals gives four — which is why `21.0000` comes out where you were expecting `21.00`. You correct it when you are ready to store or show the value, with `setScale`, which takes the scale you want plus a `RoundingMode` saying what to do with the digits it drops:

```java
BigDecimal vatToStore = vat.setScale(2, RoundingMode.HALF_UP);   // 21.00
```

`RoundingMode.HALF_UP` is the rounding rule taught at school — a half rounds away from zero, so `0.125` becomes `0.13` — and it is normally what invoicing wants. `HALF_EVEN` (banker's rounding) is the other one you will meet in financial code: it sends a half to the nearest *even* digit, so a long series of roundings does not drift upward.

> **Division is the one operation that refuses to run until you say how to round.** `divide` with a single argument computes the *exact* quotient, and when the exact quotient never ends there is no correct value it could return — so it throws rather than silently inventing one:
>
> ```java
> new BigDecimal("10").divide(new BigDecimal("3"));
> // java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
> ```
>
> No other numeric type has this problem, because no other numeric type is exact. `10.0 / 3` in `double` returns `3.3333333333333335` without complaint — an answer that is already slightly wrong, which is precisely the behaviour `BigDecimal` exists to refuse. The fix is to state the scale and the rounding you accept, in the same call:
>
> ```java
> new BigDecimal("10").divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);   // 3.33
> ```
>
> Treat one-argument `divide` as a defect in application code: it works for `10 / 4` and throws for `10 / 3`, so it is a bug waiting for the right input — the same shape of trap as a comparison that only works for small numbers.

> **A `BigDecimal` used as a map key is the one place `equals` is the method that actually runs.** The section above told you to compare money with `compareTo`, but a `HashMap` never asks which comparison you would prefer: it calls `equals` and `hashCode` on the key itself, and both of those include the scale. So `map.put(new BigDecimal("1.0"), x)` followed by `map.get(new BigDecimal("1.00"))` gives you `null` — two keys, mathematically identical, filed apart. The API documentation warns about the same mismatch from the other side for `SortedMap` and `SortedSet`: those order by `compareTo`, so they treat the two as *one* key while `equals` insists they are two, and the javadoc calls that natural ordering "inconsistent with equals". The practical rule is to avoid `BigDecimal` keys, or to normalise every key through `setScale(2, RoundingMode.HALF_UP)` before it goes in. Maps arrive in [10-collections.md](10-collections.md); why `equals` and `hashCode` govern them is [06-oop-classes.md](06-oop-classes.md).

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

That one rule — *a name lives inside the braces it was declared in* — is the whole of scope, and it produces the four kinds of variable you will meet, each with a different lifetime:

```
class TimeEntry {                       ┐
    private BigDecimal hours;           │  FIELD — visible in every method of the
                                        │  class, lives as long as the object does
    void validate(int maxHours) {       ┤
                                        │  PARAMETER — a local variable the caller
        int extra = 0;                  │  fills in; visible in this method only,
                                        │  gone when the method returns
        if (maxHours > 8) {             ┤
            String warning = "long";    │  LOCAL — visible from its declaration to
        }                               │  the end of the method
    }                                   │
}                                       │  BLOCK-LOCAL — `warning` dies at the `}`
                                        ┘  of the if, three lines before `extra` does
```

Read it as one nesting: the field's braces are the class, so it outlives every call; the parameter's and the locals' braces are the method, so they are created fresh on each call and discarded when it returns; and a variable declared inside an inner `{ }` is discarded at that inner brace. A **parameter** is not a special category — it is a local variable whose initial assignment is performed by the caller, which is why it is always definitely assigned and never needs the rule in the previous section. Fields, and where the object holding them lives, are [06-oop-classes.md](06-oop-classes.md) and [05-memory-model.md](05-memory-model.md); parameters as a mechanism — how the caller's value gets in — are [04-methods.md](04-methods.md). Here you only need to be able to say where each name is visible.

### Naming conventions

These are not enforced by the compiler, but every Java codebase and every reviewer expects them, and Spring itself depends on the third one:

- **`camelCase` for variables, fields and methods** — `totalHours`, `isActive`, `findByEmail`. First word lowercase, each following word capitalised.
- **`UPPER_SNAKE_CASE` for constants** — `MAX_HOURS`, `DEFAULT_ROLE`. Reserved for `static final` values; seeing it tells a reader "this never changes" before they read the modifiers.
- **`PascalCase` for class names** — `TimeEntry`, `UserRepository`. Notice this is how you tell `Integer` (a class) from `int` (a primitive) at a glance.
- Names are written in full, not abbreviated. `numberOfEmployees`, not `numEmp`. Java code is verbose by culture and a consultancy code review will pick at short names.

### `final` — the one line you need here

`final` on a variable means it may be assigned exactly once; a later assignment is a compile error (`cannot assign a value to final variable MAX_HOURS`). That is enough to read the `static final` constants named above and the `private final` fields that appear in every Spring service class. What `final` does *not* do — freeze the object a reference points at — is a statement about objects rather than about values, so it is answered in [06-oop-classes.md](06-oop-classes.md), alongside immutability, records, and the difference between freezing a name and freezing what it names.

---

## Operators — the four groups, and the two that can skip their right operand

> 📖 Docs: [Oracle Java Tutorials — Operators](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html) → read: "Assignment, Arithmetic, and Unary Operators" and "Equality, Relational, and Conditional Operators". The precedence table on the parent page is worth one look and no memorising.

Everything so far has been about what a variable *holds*. Operators are how you combine what two variables hold into a new value, and Java's everyday set is small enough to lay out in one place. Four groups cover essentially all backend code:

- **Arithmetic** — `+` `-` `*` `/` `%` — take numbers, produce a number. `%` is the remainder: `7 % 2` is `1`.
- **Comparison** (relational `<` `>` `<=` `>=` and equality `==` `!=`) — take two values, produce a `boolean`.
- **Logical** — `&&` (and), `||` (or), `!` (not) — take booleans, produce a `boolean`.
- **Assignment** — `=` plus the compound forms `+=` `-=` `*=` `/=` `%=` — store a value in a variable, and the expression itself produces the value that was stored.

What each group *produces* is what decides where it may appear, and that is the part JavaScript habits get wrong. An `if (...)` needs a `boolean`, so only comparison and logical expressions may sit directly inside one; an arithmetic expression has to be compared against something first. Java has no truthy values at all — no non-empty string and no non-zero number counts as "true" — so `if (name)` and `if (count)` do not compile, and the compiler says so in exactly those terms:

```java
if (name) { ... }    // MAL — error: incompatible types: String cannot be converted to boolean
```

Two more you will read constantly: `++` and `--` add or subtract one in place (`count++`), and the three-part conditional operator `condition ? a : b` picks between two values. That last one belongs to [03-control-flow.md](03-control-flow.md), where choosing is the subject.

> **`+=` hides a cast, and that is the language definition, not a quirk.** A compound assignment is not simply `a = a + b`: the specification defines `a += b` as `a = (T) (a + b)`, where `T` is the type of the left-hand side. It therefore performs, invisibly, the narrowing conversion that plain `=` would refuse to do without an explicit cast:
>
> ```java
> int i = 5;
> i = i + 3.5;    // MAL — error: incompatible types: possible lossy conversion from double to int
> i += 3.5;       // ✅ compiles — and i is 8, because 8.5 was truncated back to int
> ```
>
> Nothing here needs fixing in your own arithmetic. The point is to recognise `+=` as the one place a narrowing conversion happens with no visible cast, so a compound assignment that compiles is never proof that the two types actually match.

### `=` where you meant `==`

Typing one equals sign instead of two is the classic C-family slip, and Java catches it — because of the type rule above, not because it guessed your intention. `if (count = 5)` assigns `5` to `count` and then hands the *assigned value*, an `int`, to the `if`, which needs a `boolean`:

```java
if (count = 5) { ... }   // MAL — error: incompatible types: int cannot be converted to boolean
```

That is a compile error every time — for every type except one. If the variable is a `boolean`, the assignment produces a `boolean`, the `if` is perfectly satisfied, and the code compiles and runs while doing something you never meant:

```java
boolean active = false;
if (active = true) {     // ✅ compiles — assigns true, then always enters the branch
    ...
}
```

Nothing warns you at compile time; IntelliJ flags it as an inspection, and that squiggle is the only thing between you and a branch that runs unconditionally. It is also the reason a boolean condition is written `if (active)` and never `if (active == true)` — the short form has no `=` to lose.

### Short-circuit evaluation — why `&&` and `||` may never look at their right operand

`&&` and `||` do not evaluate both sides and then combine the two answers. They evaluate the **left** side, and then ask whether the right side could still change the outcome:

- `A && B` — if `A` is `false`, the result is `false` whatever `B` turns out to be, so `B` is never evaluated.
- `A || B` — if `A` is `true`, the result is `true` whatever `B` turns out to be, so `B` is never evaluated.

That is **short-circuiting**, and it is not an optimisation you may or may not get: it is a guarantee written into the language, and real code is built on it. The pattern you will write a hundred times is a null check standing guard in front of the call that would fail:

```java
if (user != null && user.getName().isBlank()) { ... }
```

When `user` is `null`, the left side is `false`, the right side is never evaluated, `user.getName()` is never called, and there is no `NullPointerException`. Swap the two operands and the guard is worthless, because the call happens before the check that was supposed to protect it:

```java
if (user.getName().isBlank() && user != null) { ... }   // MAL — NPE whenever user is null
```

The order of the operands is doing real work here. That is unusual — `a + b` and `b + a` are the same expression — and it is the most important practical consequence of short-circuiting.

> **"Never evaluated" means never started, not undone.** The compiled code tests the left operand and jumps straight past the bytecode for the right one, so any method call, any increment and any exception that lived in there simply does not happen. This is why putting work with side effects inside the right operand is a reliable source of "why did this line never run?" bugs: `if (isValid() && log(request))` will not log a single invalid request.

> **Java also has `&` and `|`, which do not short-circuit.** On two booleans they produce the same answer as `&&` and `||`, but they always evaluate both sides — so the guarded null check above would throw. There is one honest reason to want that: when the right operand has a side effect that must happen regardless, such as `if (checkA() & checkB())` where both checks have to record their result. It is rare enough that a reviewer will read a lone `&` between booleans as a typo for `&&`, so write `&&` and `||` unless you can explain why not. (Between two integers the same two symbols mean something else entirely — bitwise AND and OR, working bit by bit — which you will not need in backend web code.)

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

## Floating point — why a `double` cannot hold `0.1`, and why `==` cannot be trusted on one

> 📖 Docs: [Java Language Specification (SE 25) — §4.2.3 Floating-Point Types, Formats, and Values](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.2.3) → read: the paragraphs on infinity and on NaN — this is the source for "`x != x` is `true` if and only if `x` is NaN".

The money callout near the top of this file stated the fact in passing: a `double` cannot represent `0.1` exactly. Integer arithmetic has just shown you one kind of representation failure — a fixed number of bits that runs out — and this is the other kind, and the more insidious one, because nothing overflows and no digit is visibly missing. Here it is doing damage in the shortest program that can:

```java
System.out.println(0.1 + 0.2);          // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);   // false
```

The mechanism is a base problem, not a Java problem. A `double` stores a number as a sum of powers of two — 1/2, 1/4, 1/8, 1/16 and so on. Ask it for `0.5` and the answer is exact, because 0.5 *is* 1/2. Ask it for `0.1` and no finite set of those fractions adds up to it, so the hardware keeps the closest 64-bit approximation it can build and carries on. It is the same limitation decimal notation has with one third: writing `0.3333` with as many threes as you have paper for never lands exactly on 1/3. Every language that uses IEEE 754 floating point behaves identically — `0.1 + 0.2` prints those same digits in JavaScript — so this is one place your existing instincts transfer without adjustment.

Two things follow, and it is the second that bites.

- **The error is tiny.** It sits around the seventeenth significant digit. For a temperature, a percentage, a ratio or a physics calculation it is irrelevant.
- **The error is not stable.** Two calculations that are mathematically identical can land on two *different* approximations, because they rounded at different intermediate steps. `0.1 + 0.2` and `0.3` are simply two different `double` values. So `==` between two computed `double`s is asking whether two approximations happened to end on the same bit pattern — a question about rounding history, not about the numbers you meant.

That is the whole case against `==` on floating point: it does not answer the question you were asking. It is also the second half of the case against `double` for money — the drift is meaningless on a temperature and unacceptable on an invoice, where the same total has to come out identical every single time it is computed. `BigDecimal` (the sections at the top of this file) is the fix when exactness is required; the two sections below are what to do when you are stuck with a `double` anyway.

### `NaN` — the value that is not equal to itself

Some floating-point operations have no numeric answer at all: `0.0 / 0.0`, the square root of a negative number, `Infinity - Infinity`. Instead of throwing, they produce **`NaN`** — "not a number", a legal `double` value meaning "this computation has no meaningful result". It then spreads, because any arithmetic involving `NaN` produces `NaN`: one bad step at the start of a pipeline poisons every number downstream, and you find a `NaN` printed at the end of a report with nothing pointing at where it entered.

`NaN` has one property that surprises everybody, and it is deliberate:

```java
double nan = 0.0 / 0.0;

nan == nan            // false  ← the same variable, compared against itself
Double.isNaN(nan)     // true   ← the correct test
```

`NaN` means "no meaningful value", and two meaningless results are not the *same* meaningless result, so IEEE 754 defines `==`, `<`, `>`, `<=` and `>=` as `false` whenever either side is `NaN` — `nan == nan` included. `!=` is the single exception, and it is not an inconsistency: `!=` is defined as "the operands are not equal", and since `NaN` is equal to nothing at all, that is `true`. The specification states the rule from that side, which is the version worth keeping: `x != x` is `true` if and only if `x` is `NaN`. The consequence for your code is that you can never detect a `NaN` by comparing, and must call `Double.isNaN(value)` (or `Float.isNaN`).

> **The wrapper deliberately disagrees with the operator.** `Double.equals` and `Double.compare` treat `NaN` as equal to itself, on purpose, so that sorting and collections keep behaving sanely when a `NaN` finds its way into a `List<Double>`. So `Double.valueOf(nan).equals(nan)` is `true` while `nan == nan` is `false` — the same two values, two different answers, depending on whether you asked the object or the primitive. Do not read that as "the wrapper fixed it": it only means a collection will not misbehave. Your own arithmetic still produces `NaN` silently and still cannot detect it with `==`, so test with `Double.isNaN` at the point where the value is produced, not far downstream where it has already spread.

### Comparing two `double`s — a tolerance, or the right type

When the values genuinely have to be `double`, compare them with a **tolerance**: decide how close counts as equal, and test the size of the difference instead of demanding identity.

```java
// MAL — asks whether two approximations landed on the same bits
if (measured == expected) { ... }

// BIEN — asks whether they agree to within the precision you actually care about
double epsilon = 1e-9;
if (Math.abs(measured - expected) < epsilon) { ... }
```

`Math.abs` gives the distance between the two values without caring which is larger, so one test covers both directions. `1e-9` is Java's scientific notation for 0.000000001 — far larger than the representation error and far smaller than any difference that would matter. Pick the tolerance from the domain, not from habit: nine decimal places for a computed ratio, two for anything a person reads on a screen.

> **The real fix is usually the type, not the tolerance.** A tolerance is what you reach for when you *inherited* a `double` — a reading from a sensor, a field from a third-party API, a legacy database column. When the decision is yours, ask what the number is. Money, or any quantity that has to reconcile exactly: `BigDecimal`. A value with a small fixed scale that you control, such as hours to two decimal places: `BigDecimal` again, which is exactly why `TimeEntry.hours` is one. A measurement that is an approximation in the real world before it ever reaches Java: `double`, compared with a tolerance. In none of the three cases is `==` between two computed `double`s the right test.

---

## Division by zero — the same expression either crashes or quietly returns `Infinity`

> 📖 Docs: [Java Language Specification (SE 25) — §4.2.3 Floating-Point Types, Formats, and Values](https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.2.3) → read: the sentence "1.0/0.0 has the value positive infinity" and the surrounding paragraph on infinity and NaN.

One line about this went past in the integer-division section; it earns a place of its own, because it is the sharpest example on the page of the idea the whole chapter keeps circling — *the types of the operands decide what the operator really does*. Dividing by zero is not one behaviour in Java. It is two, and which one you get depends on nothing you can see at the call site:

```java
int a = 7, b = 0;
a / b;          // throws java.lang.ArithmeticException: / by zero

double x = 7.0, y = 0.0;
x / y;          // Infinity — no exception, execution continues
0.0 / 0.0;      // NaN      — no exception, execution continues
```

The split comes from what each type has room to say. An `int` is 32 bits, and every one of those 4.3 billion bit patterns is already spoken for by an ordinary whole number — there is no pattern left over to mean "infinity", so the only honest thing the JVM can do is refuse, and it throws. A `double` reserves patterns for exactly this case: `Infinity`, `-Infinity` and `NaN` are legal `double` values with a defined representation, so the operation has something true to return and returns it. (`%` follows `/` in both directions: `7 % 0` throws the same `ArithmeticException`, and `7.0 % 0.0` is `NaN`.)

Which of the two is more dangerous is not the one people assume:

```
   int     7 / 0    →  ArithmeticException  →  loud, stops here, names the line
   double  7.0 / 0  →  Infinity             →  quiet, keeps going, poisons everything downstream
```

The exception is the *helpful* case. It ends the request, produces a stack trace pointing at the exact line, and you fix it in ten minutes. The `Infinity` flows onward into the next multiplication, the next average, the JSON response and the report a client reads — and by the time somebody notices `Infinity` where an average hourly rate should be, the line that divided by zero is nowhere in the evidence.

> **The guard is the same in both cases, and it is not a `try/catch`.** Check the divisor before you divide:
>
> ```java
> // MAL — leans on the exception, and does nothing at all in the double case
> double average = (double) totalHours / entryCount;
>
> // BIEN — the empty case is a real business case, so answer it explicitly
> double average = entryCount == 0 ? 0.0 : (double) totalHours / entryCount;
> ```
>
> A divisor of zero almost always means "the collection was empty", which is a normal state of the world rather than an error: a user with no time entries this month, a project with no tasks. Deciding what the answer *is* in that case — zero, `null`, "no data" — is a business decision, and making it at the division costs less than catching an exception later or explaining an `Infinity` to a client. (`?:` is the conditional operator named in the operators section; [03-control-flow.md](03-control-flow.md) covers it properly.)

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

"Reference" is the word from the diagram at the top of this file — a type whose variable holds an address. A generic type argument must always be one, because a collection stores addresses in its slots; there is nowhere in it to put a raw 32-bit value. So you use `List<Integer>` instead. The rule itself — that a type written between angle brackets must always be a reference type, and why the language was built that way — is *generics*, explained in full in [09-generics.md](09-generics.md); the collections that use it are [10-collections.md](10-collections.md). For now, just know they are Java's main data structures and they all require object types.

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

### Wrapper `==` — the one comparison this chapter refuses to explain

Autoboxing makes `Integer` and `int` look interchangeable, and there is exactly one place where that illusion turns dangerous: comparison. `==` between two `Integer` variables does not compare the two numbers. It compares the two *addresses* from the diagram at the top of this file — it asks "are these two variables pointing at the same object?" — and that is a different question, one that gives the right answer just often enough to survive your testing:

```java
Integer a = 127, b = 127;
a == b            // true

Integer c = 128, d = 128;
c == d            // false   ← the same code, one number higher
```

Nothing about 127 and 128 differs as a *value*. The rule you need today is short: **never compare wrappers with `==`.** Use `a.equals(b)`, or unbox both sides to primitives first (`a.intValue() == b.intValue()`), where `==` compares values and is correct by definition. Between two primitives — `int == int` — `==` is always right and always what you meant.

> **Why the explanation waits for [06-oop-classes.md](06-oop-classes.md), and why `String` comparison waits with it.** The result above has a specific cause, and comparing two `String`s with `==` has another one, but they are not two facts to memorise separately — they are the *same* question wearing two costumes: when do two references identify one object, and what does it mean for two objects to be equal rather than identical. Answering that needs the object model itself — what `equals` is, that every class inherits a default version of it which compares addresses, and how a class overrides it to compare content. None of that exists yet. Entry 06 builds classes first, then defines identity versus value equality, and settles wrapper `==`, `String ==` and `Objects.equals` in one place where they explain each other. Learning the caching ranges here, before you know what an object is, would leave you holding a rule with nothing underneath it — exactly the kind of knowledge that collapses at the first interview follow-up question.

### Useful wrapper methods

**Static methods** belong to the class itself, not to any specific object — that is why you call them on the class name (`Integer.parseInt("42")`) without creating an object with `new`. Static methods are covered in detail in [04-methods.md](04-methods.md).

These static methods are genuinely useful in everyday code:

```java
Integer.parseInt("42");     // String → int (primitive)
Integer.valueOf("42");      // String → Integer (object, so it can be null or go in a collection)
Integer.MAX_VALUE;          // 2147483647 — the largest possible int value
Integer.MIN_VALUE;          // -2147483648
```

(To go the other way, `String.valueOf(42)` turns an `int` into a `"42"` — note that one is a method on `String`, not on `Integer`, so it is covered with the rest of text handling in [02-strings.md](02-strings.md).)

**`parseInt` vs `valueOf` — the confusable pair.** They take the same argument and look interchangeable, and the difference is only in the return type: `parseInt` returns a primitive `int`, `valueOf` returns an `Integer` object. `valueOf` is in fact implemented by calling `parseInt` and then boxing the result — which is why comparing two of its results with `==` walks straight into the trap the previous section refused to explain — compare them with `.equals()` there too. Pick by what you need next: `parseInt` when the value goes straight into arithmetic or an `int` variable, `valueOf` when it goes into a collection or a field that may be `null`. Reaching for the wrong one is harmless — autoboxing converts it — but naming the difference is a standard junior interview question.

> **Both throw when the text is not a number, and the message names the culprit.** This is the failure path you hit the first time a user types something unexpected into a form:
>
> ```java
> Integer.parseInt("abc");
> // java.lang.NumberFormatException: For input string: "abc"
> ```
>
> `NumberFormatException` is **unchecked**, so the compiler does not force you to handle it — nothing in your IDE will remind you this line can blow up. Note what counts as "not a number": `"42 "` with a trailing space fails too (unlike `Double.parseDouble`, `parseInt` does no trimming), as does `""` and `null`. Any time the string comes from outside your program — a form field, a URL path variable, a CSV row — this call needs either a `try/catch` or validation in front of it. Exception handling is covered in [11-exceptions.md](11-exceptions.md); for now, just register that this specific method is a common source of 500 errors.

---

## Text values — `String` has a chapter of its own

Text does not follow from anything on this page. A `String` is an object, and an unchangeable one, so every question about it — the method catalogue, `strip()` versus `trim()`, text blocks, building text in a loop with `StringBuilder`, and why `==` is the wrong way to compare two of them — turns on facts about objects rather than on numeric representation. All of it is in [02-strings.md](02-strings.md), the next file in this topic. The only thing you need while reading this page is what the diagram at the top already showed you: a `String` variable holds an address, not the characters.

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

You now have Java's value model end to end: the eight primitives and the wrapper objects beside them, the conversions the compiler performs for you and the ones it makes you write out, `BigDecimal` for values that have to be exact, the operators that combine all of them, and `var`, which changes how you *write* a type and never what the type *is*.

One idea runs through the whole page. **A value's representation decides what the operators really do to it.** Thirty-two bits with no spare patterns is why an `int` overflows into a negative number and why `7 / 0` has no choice but to throw. Sums of powers of two is why `0.1 + 0.2` misses `0.3`, why `NaN` is not equal to itself, and why `7.0 / 0` can afford to hand back `Infinity` instead of failing. A stored scale is why `1.10` and `1.1` are one number under `compareTo` and two under `equals`. And the type on the left of the `=` never rescues an expression that was already computed in the wrong representation — integer division assigned to a `double`, an overflowing multiplication assigned to a `long`, and `new BigDecimal(0.1)` are three faces of that one sentence.

A second thread is about Java rather than about numbers: **it fails at two different moments.** Some mistakes the compiler refuses outright — `integer number too large`, `possible lossy conversion`, `int cannot be converted to boolean`, `cannot infer type`. Others it waves through to fail at runtime, either loudly (`ArithmeticException: / by zero`, a `NullPointerException` from unboxing a `null`) or silently (overflow, truncated division, an `Infinity` sitting in a report). Learning which is which is most of what makes reading Java code fast.

What you still cannot do is anything with text — and every line of a web application handles text: a request body, a username, a JSON field, a log message. [02-strings.md](02-strings.md) takes the question this chapter has been asking — how is this value represented, and what does that force? — and puts it to `String`. The answer has a different shape: text in Java is an object, and an unchangeable one, so every operation that looks like it edits a `String` quietly builds a new one instead.
