# Strings and text

> 📖 [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basics" and "String Basic Manipulations" for the method catalogue
> 📖 [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → the complete method list, for when you need the exact signature

[01-variables-types.md](01-variables-types.md) asked one question of every value: *how is this represented, and what does that representation force?* For numbers the answer was about bits — an `int` holds 32 of them, which is why it overflows, and a `double` stores a binary fraction, which is why it cannot hold `0.1`. Now the same question goes to the value type you touch on literally every request that reaches a web application: a username, a JSON body, a URL path, a log line, a SQL query. All of it is text, and in Java all of it is `String`.

The answer has a completely different shape. A `String` is not a primitive and it is not a bit pattern you can reason about — it is an **object**, and an object that **cannot be changed after it is created**. That single fact is the whole chapter. It explains why `name.toUpperCase()` looks like it does nothing, why gluing text together inside a loop is the classic junior performance mistake, why a class called `StringBuilder` has to exist at all, and — later, in [06-oop-classes.md](06-oop-classes.md) — why `==` turns out to compare the wrong thing entirely.

Here is the route this file takes. It opens with **immutability**, because every later section is a consequence of it. Then the **everyday method catalogue**, so you can read ordinary Java code, followed by the two places that catalogue quietly misleads you: **empty versus blank** input, and the difference between `trim()` and `strip()`. Then the two ways to **put values into text** — `+` and `.formatted()` — and the one way to **accumulate** it without generating garbage, `StringBuilder`. Then **text blocks**, the modern way to embed a chunk of JSON or SQL. Then the round trip **between text and numbers**, which is where most 500 errors in a junior REST API are born. And it closes on the one operation this chapter deliberately refuses to explain: comparing two Strings.

**One example runs through the whole file.** You are building a line for a timesheet report: an `Employee` has a `name`, a `role`, and a number of `hours` logged this week, and you want to turn that into readable text and back again. `Employee` is the same little world [03-control-flow.md](03-control-flow.md), [06-oop-classes.md](06-oop-classes.md) and [10-collections.md](10-collections.md) use, so you only ever have to notice what the *new* operation adds.

---

## Immutability — the fact everything else on this page comes from

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basics" — and note the word *immutable* in the first paragraph; the rest of this section is what that word actually costs you.

Start with the code that catches everyone at least once. You have a name in lowercase and you want it uppercase:

```java
String name = "ana";
name.toUpperCase();
System.out.println(name);   // prints: ana
```

Nothing happened. There is no error, no warning, no red squiggle in IntelliJ — the line ran, did its work, and the work went nowhere. That is not a bug in Java, it is the definition of the type: **a `String` object can never be modified after it is created.** `toUpperCase()` did not edit `name`; it built a *second* `String` containing `"ANA"` and returned it, and because nobody caught the return value, that second object was created and immediately thrown away.

The fix is to catch what the method hands back:

```java
String name = "ana";
name = name.toUpperCase();      // BIEN — reassign the variable to the new String
System.out.println(name);       // prints: ANA
```

You have met this exact shape once already. [01-variables-types.md](01-variables-types.md) showed `total.add(...)` computing a sum and throwing it away, because `BigDecimal` is immutable too and `add` can only hand you a new object. It is the same rule, and it will appear a third time in [15-dates.md](15-dates.md), where `date.plusDays(1)` returns a different date instead of moving the one you had. **Immutable class, method that looks like an edit, result you have to catch** — once you recognise the pattern you get it right in every class that follows it.

> **This is the rule for the entire class, not a quirk of `toUpperCase()`.** Every `String` method that appears to change something — `toUpperCase`, `toLowerCase`, `trim`, `strip`, `replace`, `substring`, `concat`, `repeat` — returns a **new** `String` and leaves the original exactly as it was. If a call's result is not assigned to something, stored somewhere, or passed on, the call did nothing you can observe. Any time a String operation "isn't working", check this first: you almost certainly forgot the `=`.

### What actually happens in memory

The diagram from [01-variables-types.md](01-variables-types.md) is the one to hold on to: a `String` variable does not contain the characters, it contains an **address** — an arrow pointing at an object that lives elsewhere in memory. Reassigning the variable moves the arrow; it never edits what the arrow used to point at.

Trace `name = name.toUpperCase()` step by step:

```
BEFORE                              AFTER
─────────────────────────           ────────────────────────────────
                                    ┌──────────┐
┌──────────┐    ┌───────┐           │ name     │      ┌───────┐
│ name     │───▶│ "ana" │           │ (moved)  │  ┌──▶│ "ana" │  ← still there,
│ (address)│    └───────┘           └────┬─────┘  │   └───────┘    now unreachable
└──────────┘                             │        │
                                         │        └── nothing points here any more
                                         ▼
                                    ┌───────┐
                                    │ "ANA" │  ← a brand-new object
                                    └───────┘
```

The `"ana"` object was never touched. A second object was allocated, filled with the uppercased characters, and the variable was re-aimed at it. The first object is now **unreachable** — no variable holds its address — which in Java means it is garbage, and the runtime will reclaim its memory at some point without you asking. That reclaiming process is garbage collection, and it is the subject of [05-memory-model.md](05-memory-model.md); here you only need to know that discarded Strings are not free, because that cost is the entire argument for `StringBuilder` further down.

> **Why would a language designer do this on purpose?** Immutability sounds like pure inconvenience until you look at what it buys. Three things. First, **safe sharing**: if you pass a `String` into a method, you know with certainty that the method cannot alter your copy, because nothing can alter any `String` — so no defensive copying, ever. Second, **safe reuse**: because two identical literals can never diverge, Java is free to store one shared copy of `"ANA"` and hand it to everyone who writes that literal, which saves a great deal of memory in a real application. Third, **a stable hash code**: a `String` is the most common key type in a `HashMap`, and a key whose contents could change after insertion would be lost inside the map ([10-collections.md](10-collections.md) explains why). None of the three survives a mutable `String`. The cost is exactly one thing — every edit allocates — and the rest of this file is about knowing when that cost matters.

> **"Immutable" is about the object, not about the variable.** `name` is an ordinary variable and you can reassign it as often as you like; what cannot change is the object it points at. The two ideas are independent, and Java has a separate keyword for locking the *variable*: `final`, which you met briefly in [01-variables-types.md](01-variables-types.md). `final String name = "ana";` gives you both — a variable that cannot be re-aimed, pointing at an object that cannot be edited. It also means `name = name.toUpperCase()` no longer compiles, since that line reassigns the variable.

---

## The everyday method catalogue — and what each call gives back

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basic Manipulations" — the same methods with a runnable example each.

These are the calls you need to *read* ordinary Java, which is most of what you do at first: you open a file in a real project and every third line does something to a `String`. The example is one employee record arriving as a line of text.

```java
String record = "  Ana Ruiz,DEVELOPER,38.5  ";

record.length()                    // 27  → int, the number of characters (counting the spaces)
record.strip()                     // "Ana Ruiz,DEVELOPER,38.5" → String, no leading/trailing whitespace
record.isEmpty()                   // false → boolean, true only for exactly ""
record.isBlank()                   // false → boolean, true for "" and for whitespace-only text
record.contains("DEVELOPER")       // true  → boolean, is this sequence anywhere inside?
record.startsWith("  Ana")         // true  → boolean, and endsWith() asks the same at the other end
record.indexOf(",")                // 10    → int, position of the first match, or -1 if there is none
record.toUpperCase()               // "  ANA RUIZ,DEVELOPER,38.5  " → String
record.replace(",", " | ")         // "  Ana Ruiz | DEVELOPER | 38.5  " → String, ALL occurrences
record.strip().substring(0, 8)     // "Ana Ruiz" → String, characters 0 to 7
record.strip().split(",")          // ["Ana Ruiz", "DEVELOPER", "38.5"] → String[], an array
"Ana".equals("ana")                // false → boolean, exact content comparison
"Ana".equalsIgnoreCase("ana")      // true  → boolean, content comparison ignoring case
String.join(" - ", "Ana", "Ruiz")  // "Ana - Ruiz" → String, the opposite of split
"-".repeat(20)                     // "--------------------" → String, handy for console separators
```

Read the `→` in each comment as "the type this call hands back". That column is the thing to memorise, because it is what decides whether you can chain another call onto the end. Anything returning `String` can be chained (`record.strip().toUpperCase().substring(0, 3)`); `length()` and `indexOf()` return an `int` and end the chain; `contains()`, `startsWith()`, `isBlank()` and `equals()` return a `boolean`, which is exactly the type an `if (...)` needs, so they are what you put inside a condition.

> **`length()` counts code units, not the characters a human sees.** For every name, email and role you will ever handle the two are the same number, so read it as "how many characters" and move on. The exception is the one [01-variables-types.md](01-variables-types.md) already showed you with `char`: an emoji occupies two code units, so `"😀".length()` is `2`. That is the same fact reaching you through `String` instead of through `char`, and it is also why `substring` can cut an emoji in half.

> **Only three of these read the string without producing a new one.** `length()`, `indexOf()` and the boolean checks *interrogate* the existing object and allocate nothing. Everything else on the list — `strip`, `replace`, `substring`, `toUpperCase`, `split`, `join`, `repeat` — builds something new, exactly as the previous section described. That is why you will see calls chained rather than repeated on the same variable: each link in the chain works on the fresh object the previous link returned.

### `substring` — the second index is excluded, and going past the end throws

`substring(begin, end)` takes the characters from `begin` up to **but not including** `end`. So the arithmetic is friendlier than it looks: the length of the result is always `end - begin`.

```java
String name = "Victor";

name.substring(0, 3)     // "Vic"    — indexes 0, 1, 2. Three characters: 3 - 0.
name.substring(3)        // "tor"    — one argument means "from here to the end"
name.substring(0, 6)     // "Victor" — an end index of exactly length() is legal
name.substring(0, 10)    // 💥 throws
```

That last line does not return an empty string or a truncated one. It fails at runtime with a message that tells you both numbers:

```
java.lang.StringIndexOutOfBoundsException: Range [0, 10) out of bounds for length 6
```

Read the notation literally — `[0, 10)` is exactly the "start included, end excluded" rule written in maths, and `length 6` is the string you actually had. This is the error you get whenever you slice text whose length you assumed rather than checked: a code that is normally 8 characters arriving as 6, a name field someone left short. Anywhere you `substring` input that came from outside your program, the length is a thing to verify, not to trust.

### `split` — it takes a regular expression, not a plain separator

`split` is the one method in the catalogue whose signature lies to you. It looks like it takes a separator character; it takes a **regular expression** — a small pattern language where certain characters carry a special meaning instead of standing for themselves. `.` is the loudest of them: in a regex it means "any single character".

```java
"38.5".split(",")     // ["38.5"]  → no comma found, so you get the whole string back in a 1-element array
"a.b.c".split(".")    // []        → MAL: '.' matched EVERY character, so every piece is empty
"a.b.c".split("\\.")  // ["a","b","c"] → BIEN: the backslash escapes it into a literal dot
```

The middle line is the trap: it does not throw, it returns an array of **length 0**, and the loop you wrote to walk the pieces simply never runs. Nothing in the output says why. The characters that need escaping this way are `. | ( ) [ ] { } ^ $ * + ? \` — and `|` catches people almost as often as `.`, because a pipe is a natural-looking separator in a text file. The escape is written `"\\."` with two backslashes because the first one is Java's own string escape, so the regex engine receives a single `\.`.

> **Where regular expressions get taught properly.** They are a topic of their own and are not junior-level Java scope; what you need here is the awareness that `split` and `replaceAll` speak regex while `replace` does not. `record.replace(".", "-")` treats the dot as a literal dot and works fine; `record.replaceAll(".", "-")` replaces every character in the whole string. When in doubt use `replace`, and reach for the `All` version only when you genuinely want a pattern.

> **`split` also drops trailing empty pieces, quietly.** `"a,b,,c,,".split(",")` returns `["a", "b", "", "c"]` — the empty slot in the middle survives, both empty slots at the end do not. That is deliberate (it is what you want when parsing a CSV line with a trailing comma) and it is a real bug source when you are relying on the array's length to line up with a fixed number of columns. If you need the trailing blanks, `split(",", -1)` keeps them.

---

## Empty, blank, and the whitespace you cannot see

> 📖 Docs: [Baeldung — Java Strip Methods](https://www.baeldung.com/java-string-strip-methods) → read: "Comparing the Strip Methods vs the trim() Method" — and its sub-section "The strip() Method vs the trim() Method".

Two of the calls in the catalogue above look interchangeable and are not, and the difference decides whether your validation actually validates anything.

**`isEmpty()` is true for exactly one value: `""`, a String of length zero.** Nothing else. **`isBlank()` is true for `""` *and* for any string made only of whitespace** — spaces, tabs, newlines. The whole distinction:

```java
"".isEmpty()      // true       ""     is empty
"".isBlank()      // true       ""     is also blank — every empty string is blank
"   ".isEmpty()   // false  ←   "   "  has length 3, so it is NOT empty
"   ".isBlank()   // true   ←   "   "  is blank
"\t".isEmpty()    // false      a tab is a character like any other
"\t".isBlank()    // true
"Ana".isBlank()   // false
```

The relationship is one-directional and worth stating plainly: **every empty string is blank, and most blank strings are not empty.** So `isBlank()` is the wider check, and it is nearly always the one you meant.

Which one a form field produces is the whole practical point. A user who leaves a field untouched submits `""` — empty, and `isEmpty()` catches it. A user who taps the field, hits the space bar twice and moves on submits `"  "`, and so does anyone who pastes a value with a stray tab, or whose phone keyboard adds a space after autocomplete. That value has length 2, so `isEmpty()` returns `false` and your validation waves it through — and you have just stored an employee whose name is two spaces. **In validation code, reach for `isBlank()`; `isEmpty()` is for the narrow case where you specifically care that the length is zero**, such as checking whether a list-turned-string produced any content at all.

> **Preview — Spring Boot:** you will meet this exact pair again as annotations rather than method calls. `@NotEmpty` on a request field rejects `""` and lets `"  "` through; `@NotBlank` rejects both. They are the same two rules with the same names, applied automatically at the edge of your API instead of by hand inside a method. Which annotation goes on which field is a Spring Boot notes question — what carries over from here is *why* the two exist and which one is the safe default.

### `strip()` vs `trim()` — use `strip()`

The catalogue lists `strip()`, but every tutorial written before 2018 teaches `trim()`, so you will meet both. They do the same job — remove leading and trailing whitespace — and they disagree about what whitespace *is*, because the two definitions come from different eras.

`trim()` predates Unicode support in Java: it removes every character whose code point is less than or equal to `U+0020` (the ordinary space). That is a crude numeric rule — it happens to catch spaces, tabs and newlines, and it also catches some control characters that are not whitespace at all. `strip()`, added in Java 11, asks `Character.isWhitespace()` instead, which consults the actual Unicode tables:

```java
String em = " Ana ";      // U+2003 EM SPACE — real Unicode whitespace

em.length()          // 5
em.trim().length()   // 5  ← MAL: trim left it alone, because U+2003 > U+0020
em.strip().length()  // 3  ← BIEN: strip knows U+2003 is whitespace
```

For plain ASCII input the two are identical — `"   Ana   "` comes back as `"Ana"` from both. The difference only shows up with text that came from somewhere real: a Word document, a PDF, a copy-paste out of a web page, a form filled in on a phone. Those routinely carry em spaces, ideographic spaces (`U+3000`, standard in Chinese and Japanese text) and non-breaking spaces, and `trim()` leaves every one of them in place — so a name that arrived as `"Ana "` fails an equality check against `"Ana"`, and you get "user not found" for a name that looks perfectly correct on screen. That is the whole argument: `strip()` costs nothing extra to type and removes a class of bug you cannot see.

> **The one case where `strip()` also leaves the character behind.** Unicode's non-breaking space `U+00A0` — the character an HTML `&nbsp;` produces, and the most common invisible troublemaker in web input — is *not* whitespace by `Character.isWhitespace()`, because it is deliberately defined as non-breaking. Neither `trim()` nor `strip()` removes it. If you are cleaning input that came through a browser, you need `input.replace(' ', ' ').strip()`. Nobody discovers this by reading docs; they discover it by staring at two strings that print identically and compare `false`.

> **`isBlank()` uses the same modern rule as `strip()`.** Both ask `Character.isWhitespace()`, so they agree with each other and both disagree with `trim()`. That consistency is not an accident — `isBlank()` and `strip()` arrived together in Java 11 precisely to replace the pre-Unicode pair. Treat them as one upgrade: `trim()`/`isEmpty()` is the old couple, `strip()`/`isBlank()` is the one to write.

---

## Putting values into text — `+` and `.formatted()`

> 📖 Docs: [Oracle Docs — `java.util.Formatter`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html) → read: "Format String Syntax" and the "Conversions" table — the complete list of what may follow a `%`.

You have an `Employee` and you want a readable line out of it. The obvious way is `+`, which glues text together and, when one side is not text, converts it first:

```java
String name = "Ana";
int hours = 38;

String line = name + " logged " + hours + " hours";   // "Ana logged 38 hours"
```

That works and is perfectly idiomatic for a short expression like this one. It stops being pleasant the moment the sentence has four or five holes in it, because the quotes and the `+` signs start outnumbering the actual words. `.formatted()` is the alternative: you write the sentence once, in one piece, with **placeholders** marking where values go, and hand the values in afterwards.

```java
String line = "%s logged %d hours".formatted(name, hours);   // "Ana logged 38 hours"
```

A placeholder is a `%` followed by a letter that says *what kind of value goes here*. The three you will use:

- **`%s`** — a string goes here. It accepts literally anything, because all it does is call `toString()` on the value, and every object in Java has a `toString()` ([06-oop-classes.md](06-oop-classes.md) is where you write your own).
- **`%d`** — a whole number goes here (`int`, `long`, and their wrapper types). It refuses anything else.
- **`%f`** — a decimal number goes here, and you almost always want to say how many decimal places: `%.2f` means two. `"Total: %.2f h".formatted(38.5)` gives `"Total: 38,50 h"` or `"Total: 38.50 h"` depending on the machine's regional settings, which is a detail worth knowing exists but not worth chasing at this level.

**The values are matched to the placeholders left to right, by position — nothing is matched by name.** That is the whole mechanism, and it is also the whole problem, because nothing checks that you got the order right.

> **`.formatted()` really is the closest thing Java has to a JavaScript template literal.** `` `${name} logged ${hours} hours` `` and `"%s logged %d hours".formatted(name, hours)` do the same job. The one real difference is that JS puts the variable *inside* the text and Java puts a marker there and the variables after — which is why the JS version cannot get the order wrong and the Java version can.

### Why a broken format string still compiles

Swap the two arguments and the compiler says nothing at all:

```java
"%s logged %d hours".formatted(name, hours);    // BIEN — "Ana logged 38 hours"
"%s logged %d hours".formatted(hours, name);    // MAL  — compiles, then explodes at runtime
```

The reason is in the method's signature. `formatted` is declared as `formatted(Object... args)` — it accepts **any number of arguments of any type**. From the compiler's point of view, both lines above are the same legal call: a String, on which you invoke a method that takes a list of objects, passing it two objects. It has no reason to object, because the format string `"%s logged %d hours"` is, to the compiler, just a piece of text like any other. Nothing reads what is inside it until the program runs and the value is actually needed.

So the check happens at runtime, and the second line fails with:

```
java.util.IllegalFormatConversionException: d != java.lang.String
```

Read it as "`%d` was handed a `java.lang.String`". Note *which* placeholder complained: `%s` swallowed the number `38` without a murmur, because `%s` just calls `toString()` and an `Integer` has one. Only `%d` is fussy, because it has to produce digits. So a swapped pair always fails at the *numeric* placeholder — the error points at the second half of your format string while the mistake is in the first half.

The same lateness applies to a specifier that is not a real one at all, and to one value too few:

```java
"Total: %z".formatted(5);
// java.util.UnknownFormatConversionException: Conversion = 'z'

"%s and %s".formatted("only");
// java.util.MissingFormatArgumentException: Format specifier '%s'
```

Both are typos a compiler could in principle catch — and does not, for the same reason: the format string is data, examined only when the line executes. That is the general lesson, and it is bigger than `formatted`. **A rule enforced by the compiler fails on every run, loudly, before you ship; a rule enforced at runtime fails only on the run that reaches that line.** A `%d` inside an error message you only build when a request is malformed will sit there compiling cleanly for months and then throw the first time a user hits that path. Any format string on a rarely-taken branch deserves being executed once on purpose.

> **This is why `%s` is the safe default.** It accepts everything, so it can never produce an `IllegalFormatConversionException`. Use `%d` and `%f` when you actually need the numeric behaviour — thousands separators, a fixed number of decimals — and `%s` everywhere else. And keep format strings short: the longer the sentence, the more placeholders there are to count, and counting placeholders by eye is exactly the task this failure mode punishes.

---

## Accumulating text — when `+` becomes the wrong tool

> 📖 Docs: [Baeldung — StringBuilder and StringBuffer in Java](https://www.baeldung.com/java-string-builder-string-buffer) → read: "Similarities" and "Differences" (with its "Performance" sub-section)
> 📖 [Oracle Docs — `java.lang.StringBuilder`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html) → read the class description: "no guarantee of synchronization"

`a + b` on two Strings is fine. What is not fine is `+=` inside a loop, and the reason is immutability, now with a cost attached.

> **Three pieces of syntax in the examples below are borrowed from later files.** Read them, do not study them. `for (Employee e : employees)` is a **loop**: it runs the block once for each element of `employees`, with `e` holding the current one — written in full in [03-control-flow.md](03-control-flow.md). `List<Employee>` is a **list of employees**, the ordinary way Java holds many values of one type, and the angle brackets say which type is inside — [09-generics.md](09-generics.md) explains the brackets and [10-collections.md](10-collections.md) the list. And `e.getName()` is a **method call on an object**: it asks that one employee for its name, which is [06-oop-classes.md](06-oop-classes.md). None of the three is what this section is teaching; they are only the shortest way to write "a thousand names, one after another", which is the situation the section is about.

You have a list of employees and you want one line per employee. The natural first attempt:

```java
// MAL — one new String object per iteration
String report = "";
for (Employee e : employees) {          // say the list has 1000 entries
    report += e.getName() + "\n";
}
```

`report += ...` cannot edit `report`, because no `String` can be edited. So on every single iteration Java **allocates a new `String` object** holding everything accumulated so far *plus* the new line, copies all of those characters into it, and re-aims `report` at it. The previous object is abandoned:

```
iteration 1:   "Ana\n"                        ← abandoned after iteration 2
iteration 2:   "Ana\nBeto\n"                  ← abandoned after iteration 3
iteration 3:   "Ana\nBeto\nCarla\n"           ← abandoned after iteration 4
    ...        (996 more abandoned objects)
iteration 1000: the only one you keep
```

Two costs come out of that picture, and the second is the one people miss. The first is **999 throwaway objects**, each of which the garbage collector has to reclaim. The second is the **copying**: iteration 500 does not copy one name, it copies the entire 499-line report built so far, and then iteration 501 copies 500 lines, and so on. The total work grows with the *square* of the number of lines — double the employees and you quadruple the copying. That is what turns an invisible inefficiency at ten items into a visibly slow endpoint at ten thousand.

`StringBuilder` is the answer, and its mental model is a whiteboard: one surface you keep writing on, rather than a fresh sheet of paper copied out from scratch for every word. It holds a **mutable buffer** — a block of memory you are allowed to modify in place — and `.append()` writes into it. When you are done, `.toString()` produces the finished `String` once.

```java
// BIEN — one object, appended in place
StringBuilder sb = new StringBuilder();
for (Employee e : employees) {
    sb.append(e.getName()).append("\n");   // append returns the builder, so calls chain
}
String report = sb.toString();             // exactly one String created, at the end
```

> **Why `.append()` and not `+=`?** Because `StringBuilder` is mutable, and Java does not let a class define what `+=` means. That is the **no operator overloading** rule [01-variables-types.md](01-variables-types.md) already named when `BigDecimal` turned out to need `add()` rather than `+`: a class can never teach an operator to work on it. `+` on Strings is the single exception, baked into the language itself and not available to anyone else — which is why `String` gets an operator and `StringBuilder` gets a method. So `StringBuilder` exposes `append()` instead, and the method name is doing you a favour: `append` reads as "modify this object", where `+=` reads as "compute a new value". The difference between the two is the entire point of the section.

> **When the buffer fills up, it grows — and that is still cheap.** A `StringBuilder` starts with room for a fixed number of characters and, when you append past it, allocates a bigger buffer and copies the contents across. So it is not literally zero copies. The difference is *how often*: the buffer roughly doubles each time, so a thousand appends trigger a handful of reallocations rather than a thousand. If you happen to know the final size in advance you can skip even those with `new StringBuilder(4096)`, which is a nice thing to know and almost never worth doing.

### The rule, stated so you can apply it

**Use `+` for a single expression. Use `StringBuilder` when the accumulation is repeated.** Those are genuinely different situations and the compiler treats them differently:

```java
String label = name + " (" + role + ")";   // BIEN — one expression, one statement, use +
```

For that line the compiler itself builds the result efficiently in one pass; writing a `StringBuilder` by hand for it would be longer, uglier and no faster. The moment the accumulation is spread across **iterations of a loop**, the compiler can no longer help — it cannot see that the thousand separate statements are one logical operation — and the choice becomes yours.

> **Do not go looking for `+` to replace.** This optimisation matters for loops over collections that can grow. Gluing three fields together in a `toString()`, or building a two-piece log message, allocates one extra object and is beneath noticing. Reaching for `StringBuilder` everywhere makes code harder to read in exchange for nothing, which is a worse trade than the one you were trying to avoid. And when the thing you are joining is a collection with a separator between the items, there is a more readable tool than either: `String.join(", ", names)` for a ready-made collection, and `Collectors.joining(", ")` for a stream — the stream version is in [12-streams-lambdas.md](12-streams-lambdas.md).

### `String`, `StringBuilder`, `StringBuffer`

There is a third type in this family, and you will meet it in older code. Read this table by picking your two constraints — does the object need to be modifiable, and does more than one thread touch it — and the last column names the type that fits:

|                 | Modifiable? | Thread-safe? | When to use                              |
| --------------- | ----------- | ------------ | ---------------------------------------- |
| `String`        | No          | Yes          | Most cases — reading, passing, comparing  |
| `StringBuilder` | Yes         | No           | Building text in a loop (the fast choice) |
| `StringBuffer`  | Yes         | Yes          | Multi-threaded building (rare)            |

`String` is thread-safe *because* it is immutable — there is nothing to corrupt if nothing can change. `StringBuffer` is the older, thread-safe builder; it pays for that safety with locking on every call, and since the overwhelmingly common case is a builder created and finished inside a single method, `StringBuilder` (Java 5) exists as the same class without the locks. **Write `StringBuilder`; recognise `StringBuffer` when you see it in code from 2004.**

> **What "thread-safe" means, and why it matters in a Spring Boot API.** A **thread** is a task running in parallel with others inside the same program. A REST API handles each incoming HTTP request on its own thread — that is how it serves several users at once instead of queueing them. **Thread-safe** means several threads can use the same object simultaneously without corrupting each other's work. The practical rule that follows: a `StringBuilder` declared as a **local variable inside a method** is created fresh on every call, so it belongs to exactly one thread and the question never arises. A `StringBuilder` stored as a **field on a shared object** is a real bug waiting for your second concurrent user.

> **Preview — Spring Boot:** the snippet below is annotated `@Service`, which you have not studied yet. It marks a class Spring creates **once** at startup and hands to everyone who needs it — a *singleton*, one shared instance for the whole application. That single word is what makes the example dangerous: one object, every request thread writing into it. You will implement `@Service` in the Spring Boot notes; here it only sets the scene.

```java
// MAL — one builder shared by every request thread
@Service
public class ReportService {
    private StringBuilder sharedBuilder = new StringBuilder();   // ← all threads write here
}

// BIEN — local to the method, exists only for this one call
public String buildReport(List<Employee> employees) {
    StringBuilder sb = new StringBuilder();                      // ← only this thread sees it
    for (Employee e : employees) {
        sb.append(e.getName()).append("\n");
    }
    return sb.toString();
}
```

The `MAL` version does not fail in testing. With one user at a time it behaves perfectly; it produces interleaved nonsense only under real concurrent traffic, which is the worst possible failure schedule. The habit that avoids it entirely: **a builder is a local variable, always.**

> **The garbage-collection half of this story comes later.** [05-memory-model.md](05-memory-model.md) revisits this exact loop once the heap and the garbage collector are on the table, and shows what "999 abandoned objects" costs the runtime in detail. Everything you need to make the right choice is on this page; that file explains what the machine does with the wrong one.

---

## Text blocks — multi-line text without the escaping

> 📖 Docs: [Baeldung — Java Text Blocks](https://www.baeldung.com/java-text-blocks) → read: "Usage" for the syntax and "Indentation" for the incidental-whitespace rule.

Embedding a chunk of JSON or SQL in Java source used to be genuinely painful, because every quote inside the content had to be escaped with a backslash and every line break spelled out as `\n`:

```java
// MAL — this is what you wrote before Java 15
String json = "{\n  \"name\": \"Ana\",\n  \"role\": \"DEVELOPER\"\n}";
```

You cannot read that, you cannot paste it into Postman to check it, and one missing backslash is a compile error. A **text block** is a String literal delimited by three double quotes, and inside it quotes and newlines are simply themselves:

```java
// BIEN — a text block
String json = """
        {
          "name": "Ana",
          "role": "DEVELOPER"
        }""";
```

Two syntax rules the compiler enforces. The opening `"""` must be followed by a **line break** — content cannot begin on the same line — and trying it gives you a message that names the rule directly:

```java
String s = """hello""";   // MAL — error: illegal text block open delimiter sequence, missing line terminator
```

The closing `"""` is freer: it may sit at the end of the last content line (as in the JSON above) or on a line of its own. That choice is not cosmetic — see the callout.

> **Where did the indentation go?** The block above is indented eight spaces to line up with the surrounding code, yet the resulting string starts at column zero. The compiler strips what the specification calls **incidental whitespace**: it looks at every non-blank line *plus the line holding the closing `"""`*, finds the smallest indentation among them, and removes exactly that much from every line. So the indentation you added to keep the source readable costs nothing, and the indentation you added *on purpose* — the two spaces before `"name"` — survives, because it is deeper than the minimum.
>
> The consequence to remember: **moving the closing `"""` changes the string.** Put it on its own line at column zero and the minimum indentation becomes zero, so all eight spaces suddenly reappear inside your JSON. That is the one text-block surprise worth knowing before it happens.

**The type is still `String`.** A text block is a different way to *write* a literal, not a new kind of value — so every method in the catalogue works on it, `.formatted()` works on it, and a method that takes a `String` cannot tell how the literal was written. Nothing about immutability changes either.

Where you actually reach for one: a JSON fixture in a test, an HTML email template, and above all a multi-line SQL or JPQL query. That last one is real code in project 07 — `TimeEntryRepository` writes each report query as a text block, which is the only reason a five-line `SELECT` is readable inside a Java interface:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntryRepository.java
@Query("""
        SELECT te.project.id AS projectId, te.project.name AS projectName, round(SUM(te.hours), 2) AS totalHours, te.project.active AS active
        FROM TimeEntry te
        WHERE te.date BETWEEN :start AND :end AND te.status = com.victor.timetrack.model.EntryStatus.APPROVED
        GROUP BY te.project.id, te.project.name, te.project.active
        ORDER BY SUM(te.hours) DESC, te.project.name ASC
        """)
List<ProjectHoursReportResponse> getHoursByProject(@Param("start") LocalDate start, @Param("end") LocalDate end);
```

> **Preview — Spring Boot:** `@Query` and `@Param` belong to Spring Data JPA and are covered in the Spring Boot notes. All they do here is hand that text to the database layer. Read the snippet for the *literal*: it is an ordinary `String`, written across five lines with no `\n` and no escaped quotes, which is the entire feature. Written the pre-Java-15 way, that query would be one unreadable line of backslashes — and the query is the part you need to be able to check by eye.

---

## Between text and numbers

> 📖 Docs: [Oracle Docs — Converting Between Numbers and Strings](https://docs.oracle.com/javase/tutorial/java/data/converting.html) → read both halves: "Converting Strings to Numbers" and "Converting Numbers to Strings".

Everything arriving from outside your program is text. A URL path variable, a form field, a CSV column, a command-line argument, a JWT claim — all `String`, even when the content is obviously a number. So both directions of this conversion happen constantly.

### Text → number

You met these two calls once already, in [01-variables-types.md](01-variables-types.md), from the other side of the boundary: there the question was *which type comes out*, primitive or wrapper. Here the question is *what goes in* — text you did not write, arriving from somewhere you do not control — and that changes which details matter.

```java
int hours   = Integer.parseInt("38");     // 38  → an int, the primitive
Integer h2  = Integer.valueOf("38");      // 38  → an Integer, the object
long userId = Long.parseLong("1042");     // the same pair exists for long, double, boolean...
```

The difference between `parseInt` and `valueOf` is only the return type — primitive versus wrapper object — which is the distinction [01-variables-types.md](01-variables-types.md) drew: a primitive holds the value directly and can never be `null`, a wrapper is an object and therefore can be `null` and can go inside a `List` or a `Map`. Reach for `parseInt` when you want a number to compute with, and `valueOf` when the value has to be nullable or live in a collection.

Both throw the same thing when the text is not a number:

```java
Integer.parseInt("abc");
// java.lang.NumberFormatException: For input string: "abc"
```

What counts as "not a number" is stricter than you would guess. `"abc"` obviously. But also `""`, also `null`, also `"38.5"` (that is a decimal, not an `int`), and also **`"38 "` with a trailing space** — `parseInt` does no trimming whatsoever:

```java
Integer.parseInt("38 ");
// java.lang.NumberFormatException: For input string: "38 "
```

Which closes the loop with the previous section: any user-supplied number should be `strip()`ped before it is parsed, because the space a phone keyboard added is invisible in the log and fatal to the parse.

### `NumberFormatException` is *unchecked* — and what that means today

`NumberFormatException` is an **unchecked** exception, and the practical consequence is short: **the compiler does not force you to handle it, and it does not force you to declare that your method might throw it.** The line `Integer.parseInt(input)` compiles cleanly on its own, with no `try`, no warning, and nothing in IntelliJ hinting that it can fail. Compare that with reading a file, which Java *does* force you to write handling for before it will compile — you saw that contrast in [00-intro-java.md](00-intro-java.md).

So the responsibility is entirely yours. Whenever the text comes from outside your program, this call needs either a `try/catch` around it or validation in front of it. Without one, a user typing `id=abc` into a URL turns into an uncaught exception and a 500 response — which is the single most common way a junior REST endpoint breaks.

> **Why the full model waits for [11-exceptions.md](11-exceptions.md).** "Unchecked" is one half of a rule about *two* kinds of exception, and the rule only makes sense once you know how an exception travels, where it can be caught, and what the class hierarchy underneath `Exception` looks like — because checked versus unchecked is literally a question of which branch of that hierarchy a class sits on. Entry 11 builds all of it and then settles the pair in one place. What you need here is the operational fact: nothing will remind you that `parseInt` can fail, so you have to remember it yourself.

### Number → text

The reverse direction has three spellings, and one of them is safer than the others:

```java
int hours = 38;

String a = String.valueOf(hours);      // "38" — works for any type, including objects and null
String b = Integer.toString(hours);    // "38" — the number's own conversion
String c = "" + hours;                 // "38" — works, but says nothing about intent
```

`String.valueOf(x)` is the one to reach for by default, and the reason is `null`. `valueOf` is a **static** method on `String` — you call it on the class, and the value goes in as an argument — so a null argument is just a value it inspects, and it hands back the four-character string `"null"`. `x.toString()` is an **instance** method: calling it means asking the object *at* `x` to describe itself, and if `x` is null there is no object there to ask:

```java
Employee e = null;

String s1 = String.valueOf(e);   // "null" — no crash; valueOf checks for null internally
String s2 = e.toString();        // 💥 NullPointerException — nothing there to call a method on
```

That is the whole argument. When the value definitely is not null — a primitive `int` cannot be — the two are equivalent and it is a matter of taste. When it might be, `String.valueOf` degrades into readable output and `toString()` takes down the request. In a log line or an error message, where the value being null is exactly the case you are trying to diagnose, `valueOf` is the only sane choice.

> **The one place `String.valueOf` bites back.** Writing `String.valueOf(null)` with a bare literal `null` does **not** return `"null"` — it throws a `NullPointerException`. The cause is that `String.valueOf` is overloaded many times over (`Object`, `char[]`, `int`, `boolean`…), and when the argument is a bare `null` the compiler picks the most specific one that fits, which is `char[]` — and that overload immediately reads the array's length. The error message even says so: `Cannot read the array length because "value" is null`. It only ever happens with a literal `null` written in the source, never with a null *variable*, whose declared type resolves the overload correctly. If you ever genuinely need it, `String.valueOf((Object) null)` gives you `"null"`.

Project 07 runs this round trip in both directions, in `JwtUtil`. A JWT's `subject` claim is defined as text, so the user id has to be rendered on the way out and parsed on the way back in:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/JwtUtil.java
.subject(String.valueOf(userId))                          // Long → String, when the token is issued

return Long.valueOf(parseClaims(token).getSubject());     // String → Long, when the token is read
```

That second line is `NumberFormatException` territory by design: a token whose subject is not a number — an old token from before the claim held an id, or one somebody tampered with — fails there rather than being quietly accepted. Which is the correct behaviour, and a good example of a conversion that is *also* a validation.

---

## Comparing two Strings — and the one question this chapter refuses to answer

> 📖 Docs: [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → read: the `equals(Object)` and `equalsIgnoreCase(String)` entries in the method list — both are defined in terms of *the sequence of characters*, never of the object holding them.

For comparing content, the rule is short and you can apply it today:

```java
name.equals("Ana")                  // BIEN — compares the actual characters
name.equalsIgnoreCase("ana")        // BIEN — same, ignoring upper/lower case
name == "Ana"                       // MAL — never use == to compare text
```

`equals()` compares character by character and answers the question you meant. `equalsIgnoreCase()` does the same while treating `'A'` and `'a'` as identical, which is what you want for an email address, a username, or a role name arriving from a form. **Use `equals` for content, always; `equalsIgnoreCase` when case is not part of the identity.**

> **Why the explanation of `==` waits for [06-oop-classes.md](06-oop-classes.md).** You already know from the diagram at the top of this file that a `String` variable holds an address, so `==` compares two addresses rather than two pieces of text — but knowing *that* is not the same as understanding it, and the understanding needs machinery this chapter does not have. It needs the object model: what `equals` actually *is* (a method every class inherits), what its inherited version does, and how a class replaces it to compare content instead of addresses. It also needs the reason `==` on two Strings sometimes returns `true` and fools you, which is a fact about how Java stores literals rather than about text at all. Entry 06 builds classes first, then defines identity versus value equality once, and settles `String ==`, wrapper `==` and `Objects.equals` together — where they explain each other. Memorising the rule here and meeting the mechanism there is the right order; the reverse leaves you holding a rule with nothing underneath it, which is the kind of knowledge that collapses at the first interview follow-up question.

---

## What this unlocks

You can now handle the two things every value in a Java program is made of: numbers, whose representation decides their arithmetic, and text, whose immutability decides everything else. You can read the everyday `String` API, validate input that arrives blank rather than empty, build a report line without generating a thousand throwaway objects, embed a query without escaping it, and move a value across the text/number boundary in both directions knowing exactly where it can fail.

What you still cannot do is decide anything for yourself. Apart from the two loops this file borrowed to make the `StringBuilder` argument — and borrowed is the right word, since nothing here explained them — every line so far runs exactly once, top to bottom, in the order it is written: a program that evaluates expressions but never *chooses* between them, and that repeats a block only where somebody handed you the loop. [03-control-flow.md](03-control-flow.md) is where that changes: `if` to pick which lines run based on a value, `for` and `while` to run a block as many times as the data demands. It picks up the same `Employee` and the same weekly hours, and starts asking questions of them.
