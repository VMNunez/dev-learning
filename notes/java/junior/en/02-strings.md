## Index of this note

- [Strings and text](#strings-and-text)
- [Immutability — the fact everything else on this page comes from](#immutability--the-fact-everything-else-on-this-page-comes-from)
  - [What actually happens in memory](#what-actually-happens-in-memory)
- [The everyday method catalogue — and what each call gives back](#the-everyday-method-catalogue--and-what-each-call-gives-back)
  - [`substring` — the second index is excluded, and going past the end throws](#substring--the-second-index-is-excluded-and-going-past-the-end-throws)
  - [`split` — the separator you pass it is a regular expression](#split--the-separator-you-pass-it-is-a-regular-expression)
- [`isEmpty()` and `isBlank()` — empty and blank](#isempty-and-isblank--empty-and-blank)
  - [`strip()` vs `trim()`](#strip-vs-trim)
- [Putting values into text — `+` and `.formatted()`](#putting-values-into-text---and-formatted)
  - [Why a broken format string still compiles](#why-a-broken-format-string-still-compiles)
- [Accumulating text — when `+` becomes the wrong tool](#accumulating-text--when--becomes-the-wrong-tool)
  - [The rule for when to use `+` and when `StringBuilder`](#the-rule-for-when-to-use--and-when-stringbuilder)
  - [`String`, `StringBuilder`, `StringBuffer`](#string-stringbuilder-stringbuffer)
- [Text blocks — multi-line text without the escaping](#text-blocks--multi-line-text-without-the-escaping)
- [Converting text to numbers and numbers to text](#converting-text-to-numbers-and-numbers-to-text)
  - [Text → number](#text--number)
  - [The compiler does not force you to handle `NumberFormatException`](#the-compiler-does-not-force-you-to-handle-numberformatexception)
  - [Number → text](#number--text)
- [Comparing two Strings](#comparing-two-strings)
- [What this unlocks](#what-this-unlocks)

# Strings and text

> 📖 [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basics" and "String Basic Manipulations" for the method catalogue
> 📖 [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → the complete method list, for when you need the exact signature

[01-variables-types.md](01-variables-types.md) explained every value through how Java stores it in memory, because the way it is stored decides what you can do with it. For numbers the answer was in the bits: an `int` holds 32 of them, which is why it overflows once it goes past its maximum value; a `double` stores a 64-bit decimal number, and that explains part of how it behaves: on that fixed budget it only has room for about 15 significant digits, so past that it stops storing digits at all. Now the same question goes to a different kind of value: the `String`. A `String` can be a username, a JSON, a URL, a log line you read to debug an error, a SQL query, and so on. All of it is text, and in Java all text is a `String`.

The answer is completely different from the one you saw for primitives in [01-variables-types.md](01-variables-types.md). A `String` is not a primitive, and its value does not fit in a fixed number of bits — it is an **object**, and an object that **cannot be changed after it is created**. That single fact explains the properties of a `String` this chapter is built on: why `name.toUpperCase()` looks like it does nothing when you do not keep what it returns, since the new `String` is lost; why concatenating text inside a loop creates a new object on every pass and ends up costing performance; why a class called `StringBuilder` has to exist, and — later, in [06-oop-classes.md](06-oop-classes.md) — why `==` turns out to compare the wrong thing entirely.

This file opens by explaining **immutability**, because every later section is a consequence of it. Next comes the **everyday method catalogue**, the set of calls you will be using constantly, so that you can read ordinary Java code correctly. After that come the two places where those methods mislead you: the difference between **empty and blank**, and the difference between `trim()` and `strip()`. Then the two possible ways to put values inside a piece of text: concatenating with `+`, and the `.formatted()` method. Following that, the one way to **accumulate** text —adding pieces to it inside a loop— without leaving behind a pile of objects nobody uses any more: `StringBuilder`. Further on come **text blocks**, the modern way to write a chunk of JSON or SQL inside the Java source file itself. Near the end come the conversions from **text to number and from number to text**, which is where most 500 errors in a junior REST API are born. And it closes on comparing two Strings, the one operation this chapter does not explain: the full explanation is in [06-oop-classes.md](06-oop-classes.md).

**The same example is used for the whole file.** In it you build a line of a timesheet report: an `Employee` has a `name`, a `role`, and a number of `hours` logged this week. From there both directions get covered. The outward one turns the data of an employee you already have in memory —normally because you have just read it from the database— into a readable line of text, which is what ends up printed in the report. The return one does the opposite: it receives the data from a CSV someone hands you or from a form someone fills in, and you have to recover the `name`, the `role` and the `hours`, which are what you can then run calculations on. `Employee` is the same example used in [03-control-flow.md](03-control-flow.md), [06-oop-classes.md](06-oop-classes.md) and [10-collections.md](10-collections.md), so you never have to learn a different example in each file: only what each file adds that is new.

---

## Immutability — the fact everything else on this page comes from

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basics" — and note the word *immutable* in the first paragraph; the rest of this section is what that word actually costs you.

Start with a mistake almost everyone makes at least once. You have a name in lowercase and you want it uppercase:

```java
String name = "ana";
name.toUpperCase();
System.out.println(name);   // prints: ana
```

The name is still in lowercase. There is no error, no warning, no red squiggle in IntelliJ — the line ran, did its work, and the work went nowhere. That is not a bug in Java, it is how `String` works by design: **a `String` object can never be modified after it is created.** `toUpperCase()` did not edit `name`; it built a second `String` object containing `"ANA"` and returned it, and because that object was not stored in any variable, it was created and immediately thrown away.

The fix is to store what the method hands back in a variable:

```java
String name = "ana";
name = name.toUpperCase();      // BIEN — reassign the variable to the new String
System.out.println(name);       // prints: ANA
```

> **The variable is not created again: what changes is the address it holds.** The variable `name` already existed, and because a `String` is an object, that variable does not hold the characters but an **address** in memory: the address of the `"ana"` object. The line `name = name.toUpperCase()` never touches that object. It builds a new one containing `"ANA"` and writes **its new address in memory** into `name`, so from that point on the variable points at the new object and the old one is left with nothing pointing at it. Reusing the same variable name is exactly what makes the line look like an edit of the previous object when it is not. The section _What actually happens in memory_, just below, draws it step by step.

You have seen this pattern once already. In [01-variables-types.md](01-variables-types.md), `total.add(...)` was used to compute a sum that was then lost without ever being stored, because `BigDecimal` is immutable too and `add` can only hand you a new object. It is the same rule, and it will appear a third time in [15-dates.md](15-dates.md), where `date.plusDays(1)` creates a new date object instead of modifying the previous one. The pattern is always the same: if the class is immutable, the method that looks like it edits the object returns a new one, and you have to store it in a variable. Once you recognise it, you get it right in any class that follows it.

> **Immutability affects the whole `String` class, not just the `toUpperCase()` method.** Every `String` method that appears to change something — `toUpperCase`, `toLowerCase`, `trim`, `strip`, `replace`, `substring`, `concat`, `repeat` — returns a **new** `String` and leaves the original exactly as it was. If a call's result is not assigned to something, stored somewhere, or passed on, the call did nothing you can observe. Any time a String operation "isn't working", check this first: you almost certainly forgot the assignment, the `=`.

### What actually happens in memory

The diagram from [01-variables-types.md](01-variables-types.md) is the one to keep in mind: a `String` variable does not contain the text itself, it contains an **address in memory** pointing at an object that lives elsewhere, on the heap (the area of memory where all objects live). Reassigning the variable changes the address it points at, but it does not modify the object it was pointing at before.

The diagram below shows the state of memory before and after `name = name.toUpperCase()` runs:

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
                                    │ "ANA" │  ← a new object
                                    └───────┘
```

The `"ana"` object was never touched. What happened goes in three steps: first the memory for a second object was allocated on the heap, then it was filled with the uppercased characters, and finally the variable came to point at it. The first object is now **unreachable**: no variable points at it any more, none holds its address. In Java that means it is garbage, and at run time the JVM will reclaim its memory at some point without you asking. That memory-reclaiming process is garbage collection, and it is the subject of [05-memory-model.md](05-memory-model.md). What matters here is what each discarded `String` costs: it takes up room on the heap until something frees it, and freeing it costs CPU time, because the garbage collector has to run to find it and reclaim its memory. A single discarded object goes unnoticed; a thousand created inside a loop do not, and that is the reason `StringBuilder` is needed further down.

> **Why would James Gosling, the creator of Java, do this on purpose?** Immutability sounds like pure inconvenience until you see the three advantages it brings. First, **sharing a `String` safely**: if you pass a `String` into a method, you know with certainty that the method cannot alter your copy, because nothing can alter any `String` — so you never have to hand it a separate copy in case it modifies it. Second, **safe reuse**: a **String literal** is the text you write between quotes in your code, such as `"ANA"`; in practice people just say *literal*. If in two different places in your program you write `String a = "ANA";` and `String b = "ANA";`, Java does not create two objects: it creates one, and both the variable `a` and the variable `b` hold the memory address of that single object, the one containing `"ANA"`. It can afford that precisely because nobody can modify that object — if `a` could change its contents, `b` would change along with it without asking. That saves a great deal of memory in a real application, where the same literal appears hundreds of times. Third, **a stable hash code**: a `String` is the most common key type in a `HashMap`, and a key whose contents could change after insertion would stop being findable. A `HashMap` decides where it stores each entry from the key's **hash**: a number the `hashCode()` method computes from that key's contents, which the map uses to pick the position it puts the entry in. If the key's contents change, its hash changes, so `get()` goes and looks at a different position, and it does not find the key ([10-collections.md](10-collections.md) explains why). All three advantages disappear if a `String` can be modified. In exchange there is a single cost: every edit allocates memory for a new object. The rest of this file is about knowing when that cost really matters.

> **"Immutable" is about the object, not about the variable.** `name` is an ordinary variable and you can reassign it as often as you like; what cannot change is the object it points at. The two ideas are independent, and Java has a separate keyword for locking the *variable*: `final`, which you met briefly in [01-variables-types.md](01-variables-types.md). `final String name = "ana";` gives you both — a variable whose address in memory can no longer be changed, pointing at an object that cannot be edited. It also means `name = name.toUpperCase()` no longer compiles, since that line reassigns the variable.

---

## The everyday method catalogue — and what each call gives back

> 📖 Docs: [Baeldung — All About String in Java](https://www.baeldung.com/java-string) → read: "String Basic Manipulations" — the same methods with a runnable example each.

These are the methods you need in order to read Java code correctly, which is most of what you do at first: you open a file in a real project and you find `String` operations everywhere. In the example, one employee's **record** — their sign-up data: name, role and weekly hours — arrives as a single line of text. A line like that is called a _record_: one row of data about a single thing, with the fields separated by commas, exactly as it comes out of a CSV or an exported file.

Here is each method on its own, so you can come back to this as a reference. Three things matter about each one: what it does, what you actually reach for it for, and what type it hands back. That type is what decides whether you can chain another call onto the end: if the method returns `String`, you can chain; if it returns `int` or `boolean`, you cannot chain and the chain stops there.

- **`length()`** → `int`. Gives back how many characters the text has, spaces included.

  ```java
  "Ana Ruiz".length()     // 8  → the 'A', the seven that follow… and the space in the middle counts too
  "28001".length() == 5   // true → this is how you check a postcode has its five digits
  ```

- **`strip()`** → `String`. Gives back the text without leading or trailing whitespace. If it has whitespace in the middle, that is left alone. It is the first method you apply to any text coming from a form or a file, because it almost always carries spaces nobody typed on purpose.

  ```java
  "  Ana Ruiz  ".strip()   // "Ana Ruiz"     → the two in front and the two behind are gone
  "  Ana  Ruiz  ".strip()  // "Ana  Ruiz"    → the two spaces in the middle are still there
  ```

- **`isEmpty()`** → `boolean`. Gives back `true` only when the text has no characters at all, i.e. `""`. A text holding one space is no longer empty, and therefore gives `false`.

  ```java
  "".isEmpty()     // true
  " ".isEmpty()    // false → it has one character, the space
  "Ana".isEmpty()  // false
  ```

- **`isBlank()`** → `boolean`. Gives back `true` for `""` and also for any text made only of spaces, tabs or newlines — for example `" "`.

  ```java
  "".isBlank()      // true
  " ".isBlank()     // true → spaces only
  "\t\n".isBlank()  // true → a tab and a newline are whitespace too
  "Ana".isBlank()   // false
  ```

- **`contains(...)`** → `boolean`. Answers whether that sequence appears anywhere inside the text, telling upper and lower case apart: it looks for the sequence exactly as you pass it. It does not tell you where, only whether. Used for simple searches and filters.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.contains("DEVELOPER")  // true
  record.contains("MANAGER")    // false
  record.contains("developer")  // false → the text holds it in upper case
  ```

- **`startsWith(...)`** → `boolean`. Used to find out whether a `String` begins exactly with the sequence you pass it. **`endsWith(...)`** → `boolean` is used to find out whether a `String` finishes exactly with that sequence. The important word in both is *exactly*: they count every character, spaces included, and they tell upper and lower case apart just like `contains`.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.startsWith("  Ana")  // true  → the text begins with two spaces and then "Ana"
  record.startsWith("Ana")    // false → it begins with two spaces, not with the 'A'
  record.startsWith("  ana")  // false → case counts too
  "report.pdf".endsWith(".pdf")  // true → this is how you check a file extension
  ```

- **`indexOf(...)`** → `int`. Gives back the position of the first place the sequence appears, counting from 0, or `-1` when it does not appear anywhere. That `-1` is the "not found" signal, and you have to check for it before using that number at all, whatever you use it for: cutting the text, breaking out of a loop, anything else.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.indexOf(",")   // 10 → the first comma sits at position 10
  record.indexOf(";")   // -1 → there is no semicolon in the text
  ```

- **`toUpperCase()`** → `String`. Gives back a new `String` with every letter in upper case; **`toLowerCase()`** does the same, but gives the text back in lower case. The original text does not change, as with everything in this class. Mostly used to normalise before comparing or storing.

  ```java
  "Ana Ruiz".toUpperCase()  // "ANA RUIZ"
  "Ana Ruiz".toLowerCase()  // "ana ruiz"
  ```

- **`replace(a, b)`** → `String`. Gives back a copy with **every** occurrence of `a` swapped for `b`, not just the first.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.replace(",", " | ")   // "  Ana Ruiz | DEVELOPER | 38.5  " → both commas become " | ", not only the first
  ```

- **`substring(begin, end)`** → `String`. Gives back the slice of text between those two positions. It is the trickiest method of them all and it gets its own sub-section just below to explain it.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.strip().substring(0, 8)  // "Ana Ruiz" → from position 0 up to 7
  ```

- **`split(separator)`** → `String[]`. Cuts the text by the separator and gives back an array of the pieces. It is what you use to cut up a line of a CSV. A **CSV** (_comma-separated values_) is a text file where each line is one record and the values are separated by commas, exactly like the `record` in the example: `split(",")` hands those values back separately, one per position of the array, so you can work with them one at a time. It also gets its own sub-section just below, because the separator is not what it looks like.

  ```java
  String record = "  Ana Ruiz,DEVELOPER,38.5  ";

  record.strip().split(",")  // ["Ana Ruiz", "DEVELOPER", "38.5"] → the record's three fields
  ```

- **`equals(...)`** → `boolean`. Compares the **content** of two texts, character by character, telling upper and lower case apart. This is the one you use to compare text in Java, always.

  ```java
  "Ana".equals("Ana")  // true
  "Ana".equals("ana")  // false → upper-case 'A' and lower-case 'a' are different characters
  ```

- **`equalsIgnoreCase(...)`** → `boolean`. The same, but treating `A` and `a` as equal — that is, without telling upper and lower case apart. We use it to check emails, usernames and any other data where nobody types the case consistently.

  ```java
  "Ana@Mail.com".equalsIgnoreCase("ana@mail.com")  // true
  ```

- **`String.join(separator, ...)`** → `String`. Glues several texts together with the separator you give it. It is the opposite operation to `split`: one cuts a line into fields, the other builds the `String` out of the texts we pass it. Notice the method is called on the `String` class and not on a variable, because it does not operate on one particular text: it receives them all as arguments. You can pass it as many as you like, not just two.

  ```java
  String.join(" - ", "Ana", "Ruiz")             // "Ana - Ruiz"
  String.join(",", "Ana Ruiz", "DEVELOPER", "38.5")  // "Ana Ruiz,DEVELOPER,38.5" → three texts, and this is how the whole CSV line is built back up
  ```

- **`repeat(n)`** → `String`. Gives back the text repeated `n` times. Mostly for drawing console separators without typing twenty dashes by hand.

  ```java
  "-".repeat(20)  // "--------------------"
  ```

The type each one returns is what is worth memorising, because it is what decides what you can do with the result. The ones returning `String` — and therefore the ones you can chain, since every call hands back another text to call on — are `strip()`, `toUpperCase()`, `toLowerCase()`, `replace()`, `substring()`, `repeat()` and `String.join()`: that is why you can write `record.strip().toUpperCase().substring(0, 3)`. The ones returning `int` are `length()` and `indexOf()`, and the chain ends there: the result is a number, and a number has no `String` method behind it to call. The ones returning `boolean` are `isEmpty()`, `isBlank()`, `contains()`, `startsWith()`, `endsWith()`, `equals()` and `equalsIgnoreCase()`, and those are the ones you normally put inside a conditional, because `if (...)` needs exactly that type. And `split()` is the only one outside the three: it returns an array (`String[]`), so whatever you chain after it is array work, not text work.

> **`length()` counts code units, not the characters a human sees.** For every name, email and role you will ever handle, the number of code units and the number of characters are the same, so you can read `length()` as "how many characters the text has" and move on. The exception is the one [01-variables-types.md](01-variables-types.md) already showed you with `char`: an emoji occupies two code units, so `"😀".length()` is `2`. That is the same fact reaching you through `String` instead of through `char`, and it is also why `substring` can cut an emoji in half.

> **Nine of these methods read the `String` without producing a new one.** `length()`, `indexOf()` and the seven boolean checks — `isEmpty()`, `isBlank()`, `contains()`, `startsWith()`, `endsWith()`, `equals()` and `equalsIgnoreCase()` — only query the object that already exists: they walk its characters to answer a question and hand back a number or a `true`/`false`, without reserving memory for any object. All the remaining methods — `strip`, `replace`, `substring`, `toUpperCase`, `toLowerCase`, `split`, `join`, `repeat` — build a new `String` object, exactly as the previous section described. (When there is nothing to change — `strip()` on text with no surrounding spaces, a `replace` that finds nothing — they may hand you back the same object; it makes no difference, because the rule of keeping what they return stays the same.) That is the reason calls are written chained: each link in the chain works on the new object the previous link returned.

### `substring` — the second index is excluded, and going past the end throws

`substring(begin, end)` takes the characters from `begin` up to `end`, **not including** `end`. That is why the length of the substring it produces is always `end - begin`. The key to how far `end` may go is that `end` is not a position that gets read, but the point where the cut stops: `substring` copies the characters from `begin` and halts just before `end`, so whatever sits at `end` is never touched. That is why `end` may be 6 in `"Victor"`, which has 6 characters and whose indices run from 0 to 5, without any character existing at position 6: `substring(0, 6)` means "stop when you reach the end of the text", not "read character 6". What does fail is `substring(0, 7)`, because there you are asking it to stop past the end, and that is exactly the check `substring` runs before copying anything. `begin`, by contrast, is a position that does get read — except when it equals `end`, since then there is nothing to copy and the result is the empty string `""`.

```java
String name = "Victor";

name.substring(0, 3)     // "Vic"    — indexes 0, 1, 2. Three characters: 3 - 0.
name.substring(3)        // "tor"    — one argument means "from here to the end"
name.substring(6)        // ""       — starting exactly at length() is legal: there is no text left behind it, so the result is an empty substring
name.substring(3, name.length())  // "tor" — the same thing spelled out: length() is the largest value end can take
name.substring(0, 6)     // "Victor" — an end index of exactly length() is legal
name.substring(3, 3)     // ""       — begin and end are equal: nothing to copy, you get the empty string
name.substring(3, 1)     // 💥 throws — end sits behind begin
name.substring(0, 10)    // 💥 throws — end goes past the end of the text
```

That last line does not return an empty string or a truncated one: it throws an exception. In JavaScript this does not happen, because there, if `end` goes past the length of the text, `slice` and `substring` throw nothing: they simply cut up to the end. `"Victor".slice(0, 10)` returns `"Victor"`. Java does not do that: an index that is not valid is rejected, not adjusted. This is the exception it throws, and its message tells you two things: the range you asked for and the length the text actually had, which is also the largest value you could have passed as `end`.

```
java.lang.StringIndexOutOfBoundsException: Range [0, 10) out of bounds for length 6
```

These are all the cases where `substring` throws that exception, on the same 6-character `"Victor"`:

| Call | Result | Why |
|---|---|---|
| `substring(-1)` / `substring(-1, 3)` | 💥 | negative `begin`: there is no position before 0 |
| `substring(7)` / `substring(0, 7)` | 💥 | the index goes past `length()`, which is the maximum allowed |
| `substring(3, 1)` | 💥 | `end` sits behind `begin`, so the length would come out negative |
| `substring(6)` / `substring(3, 3)` | `""` | allowed, and throws nothing: it returns an empty string, because the range is empty, which is not the same as being out of bounds |

The first three rows throw `StringIndexOutOfBoundsException`. The fourth throws nothing, and it is in the table because it is the one most often mistaken for an error: asking for an empty range is legal. About the three that do fail, the only thing to remember is that none of them fixes itself: if the index falls outside `0..length()`, or the range runs backwards, the call blows up at runtime.

### `split` — the separator you pass it is a regular expression

`split` is the method in the catalogue whose signature confuses people most, and it can end up lying to you. It looks like it takes a character that will be used to separate the `String`, but what it really takes is a **regular expression**: a character, or a set of characters, with a specific meaning, which Java reads as a pattern and not as literal text. The one to watch is the dot: inside a regular expression `.` means "any character at all". To split on a real dot you have to escape it, and in Java source you write it with two backslashes, `"\\."`, because the first one is the `String`'s own escape and what reaches the regex engine is a single `\.`.

```java
"38.5".split(",")     // ["38.5"]  → no comma found, so you get the whole string back in a 1-element array
"a.b.c".split(".")    // []        → MAL: '.' matched EVERY character, so every piece is empty
"a.b.c".split("\\.")  // ["a","b","c"] → BIEN: the backslash escapes it into a literal dot
```

The middle line is the trap: it does not throw, it returns an empty array, of **length 0**. The characters that need escaping this way are `. | ( ) [ ] { } ^ $ * + ? \` — and `|` catches people almost as often as `.`, because a pipe is a natural-looking separator in a text file.

> **Where do you learn regular expressions properly?** They are a topic of their own and are not junior-level Java scope; what you need here is to know that `split` and `replaceAll` take a regular expression as their argument, while `replace` does not. `replaceAll` is the sibling of `replace` that does interpret patterns, and that is where the difference lies: `record.replace(".", "-")` treats the dot as a literal dot and works fine; `record.replaceAll(".", "-")` replaces every character in the string, because to the regex engine the dot stands for all of them. When in doubt use `replace`, and reach for `replaceAll` only when you genuinely want a pattern.

> **`split` also drops the empty pieces left at the end, silently.** `"a,b,,c,,".split(",")` returns `["a", "b", "", "c"]`, and not `["a", "b", "", "c", "", ""]`. Splitting on each of the commas gives six pieces: `"a"`, `"b"`, `""`, `"c"`, `""` and `""` — the middle `""` is the gap left by the two consecutive commas, and the last two are the ones left by the two trailing commas: one is the gap between those two commas, and the other runs from the last comma to the end of the text, where there is nothing left. Java hands you only the first four positions: the middle gap survives and the two at the end disappear. That is deliberate, and it is what you want when parsing a CSV line with a trailing comma — parsing is reading a text that has a known structure and pulling the data out of it, and for a CSV that starts by dividing the line into fields, which are the columns that make up the file. But it is also a real source of bugs: if you expect six columns and the line ends with two empty fields, the array reaches you with four columns, and the first line of code that reads `fields[4]` blows up with `ArrayIndexOutOfBoundsException` with nothing having warned you that pieces were missing. To make the number of fields always match the number of columns you need `split(",", -1)`: that second argument is called `limit`, says how many pieces you want at most, and any negative number means "no limit, and take nothing off the end" — it does not have to be `-1`, that is just the one people write out of habit. Calling `split` with a single argument is the same as `limit = 0`, which means "no limit, but drop the trailing empties": hence the default behaviour.

---

## `isEmpty()` and `isBlank()` — empty and blank

> 📖 Docs: [Baeldung — Java Strip Methods](https://www.baeldung.com/java-string-strip-methods) → read: "Comparing the Strip Methods vs the trim() Method" — and its sub-section "The strip() Method vs the trim() Method".

Two of the methods you saw above look interchangeable and are not: picking one over the other changes **what** you are validating. With one you reject only the field that arrives completely empty; with the other you also reject the one that arrives full of spaces. Those are two different validations, not two ways of writing the same one.

**`isEmpty()` is true for exactly one value: `""`, a String of length zero — an empty piece of text with no character inside it at all, not even a space.** Nothing else. **`isBlank()` is true for `""` *and* for any string made only of whitespace, such as `"   "`** — spaces, tabs, newlines. The whole distinction:

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

The most common case you will meet is a form field. A user who leaves a field untouched submits `""` — empty, and `isEmpty()` catches it. A user who taps the field, hits the space bar twice and moves on submits `"  "`, and so does anyone who pastes a value with a stray tab, or whose phone keyboard adds a space after autocomplete. That value has length 2 — or whatever length the number of spaces gives it; what matters is that its length is **not zero** —, so `isEmpty()` returns `false` and your validation waves it through. Put in one sentence: if the field arrives completely empty, `isEmpty()` catches it; if it arrives with spaces the user left behind by accident, `isEmpty()` does **not** catch it and the one to use is `isBlank()`. **In validation code, reach for `isBlank()`; `isEmpty()` is for the narrow case where you specifically care that the length is zero**, such as checking whether a list-turned-string produced any content at all — that is, whether it produced text or ended up with nothing.

> **Preview — Spring Boot:** you will meet this exact pair again as annotations rather than method calls. `@NotEmpty` on a request field rejects `""` and lets `"  "` through; `@NotBlank` rejects both. They are the same two rules with the same names, applied automatically by Spring the moment the request arrives, without you writing a single `if`. Which annotation goes on which field is a question the Spring Boot notes answer.

### `strip()` vs `trim()`

Among the methods above is `strip()`, but in tutorials and in older code you will see `trim()` doing the same thing, so you will meet both. They do the same job — remove leading and trailing whitespace — and they differ in what they count as *whitespace*, because the two definitions come from different eras.

`trim()` comes from the earliest versions of Java, and it was designed with a simpler rule that does not consult the Unicode tables to decide what counts as whitespace. Numbers it always had: every character in a `String` is stored as a number, the one Unicode assigns it — Unicode being the standard that hands every character that exists, letters, symbols and emojis, a unique number. That assignment is made in advance, not something the program looks up while running: the number **is** the character. That number is the character's **code point**, written in hexadecimal with a `U+` prefix, and the ordinary space, the one on the space bar, is `U+0020`.

That is exactly the difference between the two methods: `trim()` only knows how to compare that number, while `strip()` does consult the table. The rule `trim()` follows is purely numeric: it removes from the start and the end every character whose number is less than or equal to `U+0020`, without asking Unicode whether that character really is whitespace. Tabs and newlines have lower numbers (than `U+0020`), so it removes them — but below `U+0020` there are also control characters that are not whitespace at all, and it takes those too. And the other way round: any space whose number is higher than `U+0020` it leaves alone, even though on screen it looks exactly like a space. `strip()`, added in Java 11, asks `Character.isWhitespace()` instead, which consults the actual Unicode tables:

```java
String em = " Ana ";      // U+2003 EM SPACE — real Unicode whitespace

em.length()          // 5
em.trim().length()   // 5  ← MAL: trim left it alone, because U+2003 > U+0020
em.strip().length()  // 3  ← BIEN: strip knows U+2003 is whitespace
```

ASCII is the most basic group of characters there is: the unaccented letters of the English alphabet, the numbers and the ordinary punctuation marks. They occupy the first 128 numbers of Unicode, and the ordinary space is one of them. As long as the text only carries characters from that group, the two methods do exactly the same thing: `"   Ana   "` comes back as `"Ana"` from either of them. The difference only shows up with text that came from somewhere real: a Word document, a PDF, a copy-paste out of a web page, a form filled in on a phone. Such text routinely carries spaces that are not `U+0020` and that look exactly like an ordinary one on screen:

- the **em space** (`U+2003`), a space wider than the normal one — as wide as the letter M, which is where the name comes from — used by Word and PDFs; it is the same one from the example above;
- the **ideographic space** (`U+3000`), the space used when writing Chinese or Japanese;
- the **non-breaking space** (`U+00A0`), the one a web page puts between two words when it does not want them split across two lines; not even `strip()` can deal with this one, and the callout below explains why.

`trim()` acts on none of the three, because all three have a number higher than `U+0020`. That is why `strip()` is the one to reach for: it costs nothing extra to type and removes a class of bug you cannot see.

> **The one case where `strip()` does not remove the space either.** One character escapes both methods: the non-breaking space, `U+00A0`. It is what an HTML `&nbsp;` produces: a whitespace character written into the page's code, with the twist that the browser may not break the line there. When somebody copies a chunk of a web page and pastes it into a form, or when the browser itself sends that text to your backend, that `&nbsp;` travels as the character `U+00A0` and ends up inside the `String` your Java code receives. `Character.isWhitespace()` answers `false` for it, and that is not an oversight: Unicode defines it as a space that does **not** break — its whole job is the opposite, keeping two words together on the same line — and `isWhitespace()` only says yes to characters that break. The result is that neither `trim()` nor `strip()` touches it, and you have to remove it yourself before cleaning: `input.replace(' ', ' ').strip()` swaps every one of those for an ordinary space, and then `strip()` takes it away. Nobody discovers this by reading docs; they discover it by staring at two strings that print identically and compare `false`.

> **`isBlank()` uses the same modern rule as `strip()`.** Both ask `Character.isWhitespace()`, so they behave exactly the same way — including on `&nbsp;`: `" ".isBlank()` returns `false`, just as `strip()` does not remove it — and both behave differently from `trim()`. That consistency is not an accident — `isBlank()` and `strip()` arrived together in Java 11 precisely to replace the pre-Unicode pair. Treat them as one upgrade: `trim()`/`isEmpty()` is the old couple, `strip()`/`isBlank()` is the one to write.

---

## `toLowerCase()` and `toUpperCase()` depend on the machine's language

> 📖 Docs: [Oracle Docs — `String.toLowerCase()`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html#toLowerCase()) → read: the "API Note" under it, which gives this section's Turkish example, and the table of lowercase mapping examples under `toLowerCase(Locale)` just above it.
> 📖 [Oracle Docs — `java.util.Locale`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Locale.html#default_locale) → read: "Default Locale", for how the JVM picks it at startup, and the description of the `ROOT` field.

The method catalogue showed `"Ana Ruiz".toUpperCase()` giving `"ANA RUIZ"`, and said the case methods are mostly used to normalise text before comparing or storing it. That result is true on your computer, but not on every computer. Run the very same line, with the very same text, on a computer whose language is set to Turkish, and it returns `"ANA RUİZ"`, with a capital `İ` that carries a dot. The code did not change; only the computer did. This section explains where that difference comes from, what it breaks when the converted text is used to find something, and the one argument that makes the result identical everywhere.

### The default locale decides what `toLowerCase()` and `toUpperCase()` return

Changing letters to lower or upper case is not the same operation in every language, so Java needs to know which language's rules to apply. That information is called a **locale**. Java represents it with the `Locale` class, which ships with the language itself: each `Locale` object holds one code that identifies the language and another that identifies the region, written as the two joined by a hyphen. In `es-ES`, `es` is the language (Spanish) and `ES` is the region (Spain); in `tr-TR`, `tr` is Turkish and `TR` is Turkey. The region is there because one language is not written the same way in every country: in `es-MX`, Spanish as used in Mexico, decimals are written with a point rather than a comma. Methods that format numbers for people to read, or change text by the rules of a language, work with a locale. You will see another one at work in the section _Putting values into text_, further down this file: `"%.2f"` prints `38,50` or `38.50` depending on the computer's regional settings, and those settings are the computer's locale.

The steps behind every call to `toLowerCase()` or `toUpperCase()` with no argument are listed below. The first two steps happen only once, when the program starts; the last two happen on every call:

1. When the JVM starts, it reads the language settings of the operating system and stores them as **system properties**, which are values with a fixed name that the whole program can read. The two system properties that matter here are `user.language` (for example `es` or `tr`) and `user.country` (`ES`, `TR`).
2. From those properties it builds one `Locale` object, the **default locale**. From then on, that default locale is obtained with `Locale.getDefault()`, unless some code replaces it by calling `Locale.setDefault(...)`.
3. `toLowerCase()` with no argument does exactly what `toLowerCase(Locale.getDefault())` does. So it asks for the default locale and applies that language's case rules. `toUpperCase()` with no argument works the same way, because internally it uses `toUpperCase(Locale.getDefault())`.
4. If the default locale is Turkish, those rules turn a capital `I` into `ı` when lowering, and a small `i` into `İ`, a capital I with a dot, when raising.

Having two different machines can mean, for example, having your laptop, whose default locale is Spanish or English, and a server whose operating system is set to Turkish or to any other locale. You can reproduce the second machine without touching Windows, because step 1 lets you override the properties when you launch the program. The `-D` option sets a system property for that one run only:

```java
String email = "Isabel@Mail.com";
System.out.println(email.toLowerCase());
```

```
java Main                                        →  isabel@mail.com   (the locale your operating system gives)
java -Duser.language=tr -Duser.country=TR Main   →  ısabel@mail.com   (locale changed to Turkish, for this run only)
```

Read the second line letter by letter. The capital `I` became `ı`, and the capital `M` became `m` as usual. The `i` in `Mail` was already lower case, so lowering left it alone: only a capital `I` is affected. If your terminal prints `?sabel@mail.com` instead, the `?` comes from the output step: that terminal's character set has no `ı`, so Java writes a `?` in its place when it prints. The `String` itself still holds `ı`.

The reason is the Turkish alphabet. English and Spanish have one letter i, written `i` in lower case and `I` in upper case. Turkish has **two** separate letters: an i with a dot and an i without one, and each keeps its dot, or its lack of one, in both cases:

```
English / Spanish rules                Turkish rules
  'I' ──lower──▶ 'i'                     'I' ──lower──▶ 'ı'   U+0131  small dotless i
  'i' ──upper──▶ 'I'                     'i' ──upper──▶ 'İ'   U+0130  capital I with a dot
```

In Turkish, the capital without a dot, `I`, belongs to the dotless `ı`, so lowering `I` has to give `ı`. And the dotted `i` keeps its dot when raised, so `i` becomes `İ`. That is why `"Ana Ruiz"` became `"ANA RUİZ"` above. Java is applying correct Turkish here; it is not a bug in the JDK.

> **`ı` is a different character from `i`, not another way of drawing it.** Each one has its own code point, the Unicode number the section _`strip()` vs `trim()`_ explained: `i` is `U+0069` and `ı` is `U+0131`. `"ısabel@mail.com".equals("isabel@mail.com")` is `false`, because `equals` compares character by character and the first characters differ. Both texts have the same length and look almost the same in a log, which is what makes this bug so hard to see.

> **Turkish is not the only language with this rule.** Azerbaijani has the same two i's, and Java lowers `I` to `ı` under an Azerbaijani locale too. Lithuanian has special case rules of its own, but they only touch accented i's, so a plain `I` still lowers to `i` there. Spanish and English have no such rule, which is why you never meet the problem on your own machine.

### What the dotless `ı` breaks when an email is a lookup key

The damage appears when the lowered text is used to **find** something. Follow one employee, Isabel, through an application that lowers emails with the no-argument `toLowerCase()`:

1. Isabel signs up typing `isabel@mail.com`. The application lowers it and stores `isabel@mail.com`. There is no capital `I` in it, so every machine stores the same text.
2. Months later she logs in from her phone. The phone capitalises the first letter, so the request carries `Isabel@mail.com`, together with her correct password.
3. The server's default locale is Turkish, so `toLowerCase()` produces `ısabel@mail.com`.
4. The application asks the database for the user whose email is equal to `ısabel@mail.com`. There is no such row: the stored email starts with `U+0069`, not `U+0131`.
5. The login is refused as if the password were wrong. Nothing is thrown and nothing warns you, and the log line shows an address that reads just like hers.

A lookup key only works if every way of typing the same thing produces the same key. `Isabel@mail.com` and `isabel@mail.com` must both become `isabel@mail.com`, and the default locale breaks exactly that promise. The same applies to anything else that stores or finds by that text: a key in a `HashMap`, a cache entry, a counter.

```java
// MAL — the result depends on the language of the machine the code runs on
String key = email.toLowerCase();
```

```java
// BIEN — the same result on every machine
String key = email.toLowerCase(Locale.ROOT);   // "isabel@mail.com", also on a Turkish machine
```

**`Locale.ROOT` is the locale that belongs to no language.** Its language and its country are both empty text, and the Javadoc describes it as the neutral locale for these operations. Under it, case conversion follows the general Unicode rules, which contain no Turkish exception, so `I` lowers to `i` on every machine. Two pieces of syntax come with it:

- **`Locale.ROOT`** is a ready-made `Locale` value that belongs to the `Locale` class itself, not to one particular `Locale` object. That is why you read it off the class name, the same way you call `Integer.parseInt` on `Integer`. What it means for a member to belong to the class is explained in [06-oop-classes.md](06-oop-classes.md).
- **`import java.util.Locale;`** goes at the top of the file. `String` lives in the package `java.lang`, which every file can use without an import. `Locale` lives in `java.util`, so without this line you would have to write its full name, `java.util.Locale`, every time. [04-methods.md](04-methods.md) explains packages and imports.

> **Why not skip the lowering and compare with `equalsIgnoreCase`?** Its Javadoc says it does not take the locale into account, so `"Isabel@mail.com".equalsIgnoreCase("isabel@mail.com")` is `true` on every machine. But it only compares two texts you already hold side by side. A lookup does not work that way. The database looks for a stored email equal to the text you give it. A `HashMap` goes to the position that the key's hash picks, as the callout about the three advantages of immutability explained. Both need one agreed spelling of the key before the search starts, and `toLowerCase(Locale.ROOT)` is what produces it.

> **Why not simply make sure the server is never set to Turkish?** You do not decide where your code runs: a colleague's laptop, the machine that runs the tests, a client's server. A line that depends on the default locale passes every test on your computer and fails only on the machine with the other language, the same way the shared `StringBuilder` in _Accumulating text_, further down this file, only fails when requests arrive at the same time. Passing `Locale.ROOT` makes the line correct wherever it runs.

> **Preview — Spring Boot:** the fragment below comes from project 07's login code. `AuthService` and `LoginAttemptService` are Spring service classes you have not studied yet; you will build classes like them in the Spring Boot notes. Here, only the email text passing through them matters.

Project 07 does exactly this. Every email the application receives goes through one method, `EmailNormalizer.normalize`, before it is used:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/util/EmailNormalizer.java
return email == null ? null : email.trim().toLowerCase(Locale.ROOT);

// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/AuthService.java — inside login(...)
String email = EmailNormalizer.normalize(request.getEmail());
// ...
loginAttemptService.recordFailure(email);
```

The first line reads: "if `email` is `null`, return `null`; otherwise return the email with its surrounding spaces removed and lowered with `Locale.ROOT`". The `condition ? a : b` form is the conditional operator, which [03-control-flow.md](03-control-flow.md) covers. The line uses `trim()` rather than the `strip()` recommended in the section _`strip()` vs `trim()`_; here, only the `toLowerCase(Locale.ROOT)` at its end matters.

In `login`, `request.getEmail()` is the email as the user typed it, and `email` is its normalised form. That normalised value is then used as a key. The method that loads the user by email normalises with the same method, and `recordFailure(email)` adds one failed attempt to a tally stored under that email. After five failures, the next attempt is refused until a minute has passed since the last failure. The project's plan states that an email differing only in letter case uses the **same** tally, because the key is the normalised address. With the no-argument `toLowerCase()` on a Turkish server, that stops being true: `Isabel@mail.com` would be counted under `ısabel@mail.com` and `isabel@mail.com` under `isabel@mail.com`, two separate tallies for one account.

### `Locale.ROOT` or the user's locale — which argument goes where

The previous part showed the one wrong call and the right one for a key. There is a third option, and the choice between the three comes down to one question: will a **program** read the result, or a **person**?

| Call | Whose rules | Use it for |
|---|---|---|
| `toLowerCase()` / `toUpperCase()` | the default locale of whatever machine runs the code | nothing whose result must be predictable — in practice, avoid it |
| `toLowerCase(Locale.ROOT)` / `toUpperCase(Locale.ROOT)` | no particular language | identifiers, keys and protocol values: an email used to find a user, a `HashMap` key, a role name compared with `equals`, the name of an HTTP header |
| `toUpperCase(Locale.of("tr", "TR"))` — the user's own locale | that user's language | text a person reads in their own language: a title in capitals shown to a Turkish reader must show `İ` |

Read the table by its last column. If a program will compare, store or look up the result, it is an identifier, and `Locale.ROOT` is the argument. If a person will read it, the correct letters are the ones of that person's language, so you pass their locale. `Locale.of("tr", "TR")` builds that locale from a language code and a country code (the method exists since Java 19). In a web application the user's language usually arrives with the browser's request; how you read it there belongs to the Spring Boot notes. The no-argument form fits neither case, because its result depends on the machine instead of the program or the person.

A role name shows the identifier row at work, and it goes wrong in the other direction, through `toUpperCase()`:

```java
String role = "admin";

role.toUpperCase().equals("ADMIN")              // MAL  — false on a Turkish machine: the result is "ADMİN"
role.toUpperCase(Locale.ROOT).equals("ADMIN")   // BIEN — true on every machine
```

The lower-case `i` in `admin` becomes the dotted capital `İ` under Turkish rules, so the result no longer equals `"ADMIN"`, and the check fails for every administrator on that server.

> **You will also meet `Locale.ENGLISH` or `Locale.US` in the same position.** Older code often writes `toUpperCase(Locale.ENGLISH)` for identifiers. The result is the same as with `Locale.ROOT`, because English has no special case rules. `Locale.ROOT` is the clearer choice, because it says that no language is meant, while `Locale.ENGLISH` suggests the text is English when it is really an identifier.

---

## Putting values into text — `+` and `.formatted()`

> 📖 Docs: [Oracle Docs — `java.util.Formatter`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html) → read: "Format String Syntax" and the "Conversions" table — the complete list of what may follow a `%`.

You have an `Employee` with a `name` field and an `hours` field, and you want to build a readable sentence out of them. The obvious way is `+`, which glues text together and, when one side is not text, converts it first:

```java
String name = "Ana";
int hours = 38;

String line = name + " logged " + hours + " hours";   // "Ana logged 38 hours"
```

That works and is the normal thing to write for a short expression like this one. It stops being the right choice the moment the sentence has four or five holes in it, because the quotes and the `+` signs end up outnumbering the words the sentence actually has. `.formatted()` is the alternative: you write the sentence once, in one piece, with **placeholders** marking where values go, and hand the values in afterwards.

```java
String line = "%s logged %d hours".formatted(name, hours);   // "Ana logged 38 hours"
```

A placeholder is a `%` followed by a letter that says *what kind of value goes here*. The three you will use:

- **`%s`** — a string goes here. It accepts literally anything, because all it does is call `toString()` on the value, and every object in Java has a `toString()` ([06-oop-classes.md](06-oop-classes.md) is where you write your own).
- **`%d`** — a whole number goes here (`int`, `long`, and their wrapper types; also `byte`, `short` and `BigInteger`). It refuses decimals, text and anything else.
- **`%f`** — a decimal number goes here, and you almost always want to say how many decimal places: `%.2f` means two. `"Total: %.2f h".formatted(38.5)` gives `"Total: 38,50 h"` or `"Total: 38.50 h"` depending on the computer's regional settings.

**The placeholders are filled by position: the first value goes to the first placeholder, the second to the second, and so on from left to right. None of them is matched by name.** That is the whole mechanism, and it is also the whole problem, because nothing checks that you got the order right.

> **`.formatted()` really is the closest thing Java has to a JavaScript template literal.** `` `${name} logged ${hours} hours` `` and `"%s logged %d hours".formatted(name, hours)` do the same job. The one real difference is that JS puts the variable *inside* the text and Java puts a marker there and the variables after — which is why the JS version cannot get the order wrong and the Java version can.

### Why a broken format string still compiles

Swap the two arguments and the compiler says nothing at all:

```java
"%s logged %d hours".formatted(name, hours);    // BIEN — "Ana logged 38 hours"
"%s logged %d hours".formatted(hours, name);    // MAL  — compiles, then explodes at runtime
```

The reason is in the method's signature. `formatted` is declared as `formatted(Object... args)` — it accepts **any number of arguments of any type**. From the compiler's point of view, both lines above are the same legal call: a String, on which you invoke a method that takes a list of objects, passing it two objects. It has no reason to object, because the format string `"%s logged %d hours"` is, to the compiler, just a piece of text like any other. Nothing reads what is inside it until the program runs: that is where the formatter walks the string, meets the `%d`, takes the real value you passed in that position and finds out it is not a number.

So the check happens at runtime, and the second line fails with:

```
java.util.IllegalFormatConversionException: d != java.lang.String
```

Read it as "`%d` was handed a `java.lang.String`". Note *which* placeholder complained: `%s` swallowed the number `38` without a murmur, because `%s` just calls `toString()`, and an `Integer` has one: when a number reaches a `%s`, the number-to-text conversion goes through that `toString()`, which is why it never fails. The one that gives trouble is `%d`, because it would have to do the opposite conversion — turn what it receives into digits — and converting a `String` into a number is not possible. So a swapped pair always blows up at the *numeric* placeholder. The swap does affect both placeholders — `%s` got the number instead of the name and `%d` the other way round — but only one of them complains: `%s` accepts anything silently, so the error message points only at the `%d`.

The same behaviour — the failure not showing up until the program runs — repeats with a specifier that is not a real one at all, and when you hand `formatted()` one argument fewer than the string asks for:

```java
"Total: %z".formatted(5);
// java.util.UnknownFormatConversionException: Conversion = 'z'

"%s and %s".formatted("only");
// java.util.MissingFormatArgumentException: Format specifier '%s'
```

Both are typos a compiler could in principle catch — and does not, for the same reason: the format string is data, and it is only examined when the line executes. The compiler sees a `String` and a call to a method that accepts arguments, checks that this is legal, and looks no further: it never reads what is inside the quotes. That is why the failure turns up later. That is the general lesson, and it does not apply to `formatted()` alone. **If a rule is checked by the compiler, the error shows up at compile time, every time, before you ship anything. If the rule is checked at runtime, the error only shows up the day the program goes through that line.**

> **This is why `%s` is the safe default.** It accepts everything, so it can never produce an `IllegalFormatConversionException`. Use `%d` and `%f` when you actually need the numeric behaviour — thousands separators, a fixed number of decimals — and `%s` everywhere else. And keep format strings short: the longer the sentence, the more placeholders there are to count, and counting placeholders by eye makes a mistake more likely.

---

## Accumulating text — when `+` becomes the wrong tool

> 📖 Docs: [Baeldung — StringBuilder and StringBuffer in Java](https://www.baeldung.com/java-string-builder-string-buffer) → read: "Similarities" and "Differences" (with its "Performance" sub-section)
> 📖 [Oracle Docs — `java.lang.StringBuilder`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html) → read the class description: "no guarantee of synchronization"

`a + b` on two Strings is fine. What is not fine is `+=` inside a loop, and the reason is immutability: since a `String` cannot be modified, every turn of the loop builds a brand new `String` object instead of extending the one you already had.

> **The three pieces of code shown in the examples below belong to later files.** `for (Employee e : employees)` is a **loop**: it runs the block once for each element of `employees`, with `e` holding the current one — written in full in [03-control-flow.md](03-control-flow.md). `List<Employee>` is a **list of employees**, the ordinary way Java holds many values of one type, and the angle brackets say which type is inside — [09-generics.md](09-generics.md) explains the brackets and [10-collections.md](10-collections.md) the list. And `e.getName()` is a **method call on an object**: it asks that one employee for its name, which is [06-oop-classes.md](06-oop-classes.md). None of these three concepts is what this section studies, but you need them to understand the problem immutability creates when you build Strings up inside a loop.

You have a list of employees and you want a `String` showing each employee on its own line. The natural first attempt:

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

This example shows both problems. The first is the creation of **999 throwaway objects**, each of which the garbage collector has to reclaim.

The second is **copying the contents of the previous object into the new one**, and it is the one people miss. Remember what each iteration actually does: it does not add the new line to the object that already exists — it cannot, the object is immutable — it allocates a new object and writes **everything that was in the previous object** into it, and then adds the characters of the new line on top. So iteration 500 does not copy one name: it copies the 499 lines accumulated so far and then adds the 500th. Iteration 501 copies 500 lines. Iteration 502 copies 501.

```
iteration    2 → copies   1 line
iteration    3 → copies   2 lines
iteration  500 → copies 499 lines
iteration 1000 → copies 999 lines
                 ───────────────────
     total       ≈ 500,000 lines copied to produce 1,000
```

That total grows with the *square* of the number of elements you iterate over: double the employees and the copying work is multiplied by four. At ten items you notice nothing; at ten thousand you have a visibly slow endpoint.

`StringBuilder` is the answer: an object that can be modified, one you keep adding text to without creating a new object on every turn. It holds a **mutable buffer** — a block of memory you are allowed to modify in place — and `.append()` writes into it. It works like a whiteboard you keep writing on, rather than a fresh sheet of paper copied out from scratch for every word. When you are done, `.toString()` produces the finished `String` once.

```java
// BIEN — one object, appended in place
StringBuilder sb = new StringBuilder();
for (Employee e : employees) {
    sb.append(e.getName()).append("\n");   // append returns the builder, so calls chain
}
String report = sb.toString();             // exactly one String created, at the end
```


> **The buffer has a fixed size, and when it fills up another, bigger one has to be allocated.** When a `StringBuilder` is created, Java reserves a place in memory with room for a fixed number of characters. When you append more than fits there, it reserves a new, bigger place and copies the existing contents into it. So there is copying: it is not literally zero. The difference from `+=` is how often it happens: each new buffer has roughly twice the capacity of the last, so a thousand appends cause a handful of buffer changes rather than a thousand copies. If you know in advance how many characters the finished text will have, you can avoid creating those intermediate buffers by passing that number as an argument when you create it. That argument is called the **initial capacity** and it is counted in characters, not bytes: `new StringBuilder(4096)` reserves room for 4096 characters in one go. It is not a limit — go past it and the buffer grows just as before — it only avoids the intermediate buffers. It is rarely done.

### The rule for when to use `+` and when `StringBuilder`

**Use `+` for a single expression. Use `StringBuilder` when the accumulation is repeated.** The difference between the two is not a matter of style: in one the compiler optimises the work for you, and in the other it cannot:

```java
String label = name + " (" + role + ")";   // BIEN — one expression, one statement, use +
```

For that line the compiler itself builds the result efficiently in one pass; writing a `StringBuilder` by hand for it would be longer, uglier and no faster. The moment the accumulation is spread across **iterations of a loop**, the compiler can no longer help — it cannot see that the thousand separate statements are one logical operation — and the choice becomes yours.

> **Do not go changing every `+` you have already written.** This optimisation matters for loops over collections that can grow. Joining an object's three fields with `+` to return them as one sentence from its `toString()`, or putting a fixed piece of text together with a value to write a log line, allocates one extra object, but it does not affect performance and you will not notice it. Reaching for `StringBuilder` everywhere makes code harder to read in exchange for nothing, which is a worse trade than the one you were trying to avoid. And when the thing you are joining is a set of items with a separator between them, there are better tools than `+` and `StringBuilder`: `String.join(", ", names)` when you already have the collection — a `List`, a `Set` —, and `Collectors.joining(", ")` for a stream — the stream version is in [12-streams-lambdas.md](12-streams-lambdas.md).

### `String`, `StringBuilder`, `StringBuffer`

There is a third type in this family, `StringBuffer`, and you will meet it in older code. The table compares the three by the two questions that decide which one to use: whether the object can be modified, and whether it can be used safely from several threads at once — what is called being thread-safe, which is explained at the end of the section. The last column says what each one is used for:

|                 | Modifiable? | Thread-safe? | When to use                              |
| --------------- | ----------- | ------------ | ---------------------------------------- |
| `String`        | No          | Yes          | Most cases — reading, passing, comparing  |
| `StringBuilder` | Yes         | No           | Building text in a loop (the fast choice) |
| `StringBuffer`  | Yes         | Yes          | Multi-threaded building (rare)            |

`String` is thread-safe *because* it is immutable: there is nothing to corrupt if nothing can change.

`StringBuffer` is the older builder, and it is thread-safe because it protects itself with **locking**: on every `append` call it locks the object, makes the change and unlocks it again, so that while one thread is writing no other can touch it. That is exactly what stops two threads writing at once and leaving the buffer half-written — but the lock is paid for on **every** call, including when there is no other thread at all.

`StringBuilder` (Java 5) is that same class without the locks: that is why it is faster, and why it is not thread-safe. And it is the one you want, because the normal case is a builder created and finished inside one method, where only one thread touches it. **Write `StringBuilder`; recognise `StringBuffer` when you see it in older code.**

> **What "thread-safe" means, and why it matters in a Spring Boot API.** A **thread** is a task running in parallel with others inside the same program. A REST API handles each incoming HTTP request on its own thread — that is why several users can use it at once, instead of having to be queued. **Thread-safe** means several threads can use the same object simultaneously without corrupting each other's work. The practical rule that follows: a `StringBuilder` declared as a **local variable inside a method** is created fresh on every call, so it belongs to exactly one thread, and there is no need to think about locking because that buffer lives inside a single thread. A `StringBuilder` stored as a **field on a shared object** is a genuine problem: the moment two requests arrive at once, both threads write into the same buffer and the text comes out mixed together.

> **Preview — Spring Boot:** the snippet below is annotated `@Service`, which you have not studied yet. It marks a class as a service Spring creates **once** at startup and then makes available to any part of the application that needs it — a *singleton*, one shared instance for the whole application. That is what makes the example dangerous: there is a single object, and every request thread writes into it. You will implement `@Service` in the Spring Boot notes; here it only sets the scene.

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

The `MAL` version behaves correctly with a single user, so it does not fail in testing: it only produces mixed-up text when requests arrive at the same time — that is, in production. The habit that avoids the problem: **a builder is always a local variable, never a field on a class.**

> **The other half of this story, the garbage-collection one, comes later.** [05-memory-model.md](05-memory-model.md) comes back to this same loop once the heap and the garbage collector have been explained, and details what leaving "999 abandoned objects" costs the program. Everything you need to make the right choice is on this page; that file explains what the machine does with the wrong one.

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

Two syntax rules the compiler enforces. The opening `"""` must be followed by a **line break** — content cannot begin on the same line — and if you try it you get this error, which names the rule directly:

```java
String s = """hello""";   // MAL — error: illegal text block open delimiter sequence, missing line terminator
```

The closing `"""` can go in two places: at the end of the last content line, as in Ana's JSON, or on a line of its own. The position you pick decides how many indentation spaces end up inside the string, and the next block explains why.

> **What happens to the code's indentation spaces?** In Ana's JSON, every line of the block starts with eight spaces: they are there only so the text lines up with the rest of the method's code. Those eight spaces never reach the string. If you print `json`, the `{` sits against the left margin (column zero), not shifted eight positions:
>
> ```
> {
>   "name": "Ana",
>   "role": "DEVELOPER"
> }
> ```
>
> This happens because the compiler strips what the specification calls **incidental whitespace**, in three steps:
>
> 1. It looks at every non-blank line of the block _plus the line holding the closing `"""`_.
> 2. It counts the leading spaces of each and keeps the smallest. Here `{` and `}"""` have eight, and the `"name"` and `"role"` lines have ten, so the minimum is eight.
> 3. It removes exactly those eight spaces from the start of every line.
>
> So the indentation you added to keep the source readable disappears, and the indentation you added _on purpose_ — the two extra spaces before `"name"` — survives, because it goes past the minimum.
>
> The consequence to remember: **moving the closing `"""` changes the string.** Put it on its own line at column zero and the minimum indentation becomes zero, so all eight spaces suddenly reappear inside your JSON. That is the one text-block surprise worth knowing.
>
> Compare the two versions. The only change is where the closing `"""` sits:
>
> ```java
> // A — closing on the last content line: the smallest line has 8 spaces
> String jsonA = """
>         {
>           "name": "Ana",
>           "role": "DEVELOPER"
>         }""";
>
> // B — closing on its own line, at column zero: the smallest line has 0 spaces
> String jsonB = """
>         {
>           "name": "Ana",
>           "role": "DEVELOPER"
>         }
> """;
> ```
>
> And this is what each variable holds (each `·` marks a space that stays inside the string):
>
> ```
> jsonA:                  jsonB:
> {                       ········{
> ··"name": "Ana",        ··········"name": "Ana",
> ··"role": "DEVELOPER"   ··········"role": "DEVELOPER"
> }                       ········}
>                         (final line break)
> ```
>
> In A eight spaces are removed from every line and the string ends right at `}`. In B the minimum is zero, so nothing is removed: every line keeps its eight or ten spaces, and the string also ends with a line break after `}`, because the `"""` is no longer on the same line as the brace.

**The type is still `String`.** A text block is a different way to *write* a literal, not a new kind of value — so every method works on it. Nothing about immutability changes either.

Where you actually reach for one: the sample JSON a test sends as a request body to check an endpoint, an HTML email template, and above all a multi-line SQL or JPQL query. That last one is real code in project 07 — `TimeEntryRepository` writes every query that builds the hours reports as a text block, and that is the only reason a five-line `SELECT` is readable inside a Java interface:

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

> **Preview — Spring Boot:** `@Query` and `@Param` belong to Spring Data JPA and are covered in the Spring Boot notes. All they do here is hand that text to the database layer. The point of the snippet is to see a text block used as a literal: the query text is an ordinary `String`, written across five lines with no `\n` and no escaped quotes. Written the pre-Java-15 way, that query would be one unreadable line, packed with backslashes

---

## Converting text to numbers and numbers to text

> 📖 Docs: [Oracle Docs — Converting Between Numbers and Strings](https://docs.oracle.com/javase/tutorial/java/data/converting.html) → read both halves: "Converting Strings to Numbers" and "Converting Numbers to Strings".

Any data your program does not write itself, but receives from somewhere else (the browser, a file, the terminal, another server), arrives as text. These are the cases you will meet:

- **A URL path variable**: the part of the URL that changes from one request to the next to identify a specific resource. In `GET /projects/42`, the `42` is a path variable, and it reaches your controller as the text `"42"`.
- **A form field**: whatever the user types into an `<input>`, even their age.
- **A CSV column**: each value in a comma-separated text file, such as `Ana,38.5`.
- **A command-line argument**: whatever you type after the program's name when you launch it from the terminal. In `java Main 10`, the `10` reaches `main(String[] args)` as `args[0]`, which is the text `"10"`.
- **A JWT claim**: each piece of data travelling inside the authentication token, such as the user's id or role. The token is text, so its claims are too.

All of them are `String`, even when the content looks like a number. So converting text to numbers and numbers to text happens very often.

### Text → number

You have already met this conversion in [01-variables-types.md](01-variables-types.md), with `Integer.parseInt` and `Integer.valueOf`. There, what mattered was the type each method returns: a primitive `int` or an `Integer` object. Here, what matters is the text you pass them. You did not write that text: it arrives from a request, a form or a file, so it may come empty, with spaces or with letters. That is why this section focuses on what happens when the text is not a valid number.

Every numeric primitive type has its wrapper class (`int` → `Integer`, `long` → `Long` and `double` → `Double`), and that class offers two methods to go from text to number. Both are **static**: you call them on the class (`Integer.parseInt(...)`), not on an object, because you do not have a number yet, only the text.

- **`parseXxx(String)`** returns the **primitive**. `Xxx` is the type's name: `Integer.parseInt` returns an `int`, `Long.parseLong` a `long` and `Double.parseDouble` a `double`.
- **`valueOf(String)`** returns the **wrapper object**. It has the same name in every class: `Integer.valueOf` returns an `Integer`, `Long.valueOf` a `Long`, `Double.valueOf` a `Double`.

Both read the text the same way; the only difference is what they give back. This table sums up the most common pairs:

| Type | Returns the primitive | Returns the wrapper |
|---|---|---|
| `int` | `Integer.parseInt("38")` → `38` (`int`) | `Integer.valueOf("38")` → `38` (`Integer`) |
| `long` | `Long.parseLong("1042")` → `1042` (`long`) | `Long.valueOf("1042")` → `1042` (`Long`) |
| `double` | `Double.parseDouble("38.5")` → `38.5` (`double`) | `Double.valueOf("38.5")` → `38.5` (`Double`) |

```java
// int: the same text, two kinds of result
int hours      = Integer.parseInt("38");      // 38 → int, the primitive
Integer hoursW = Integer.valueOf("38");       // 38 → Integer, the object

// long: for ids, which can exceed an int's maximum
long userId    = Long.parseLong("1042");      // 1042 → long
Long userIdW   = Long.valueOf("1042");        // 1042 → Long

// double: for text with decimals
double rate    = Double.parseDouble("38.5");  // 38.5 → double
Double rateW   = Double.valueOf("38.5");      // 38.5 → Double

```

The difference between `parseInt` and `valueOf` is only the return type — primitive versus wrapper object — which is the distinction [01-variables-types.md](01-variables-types.md) drew: a primitive holds the value directly and can never be `null`, a wrapper is an object and therefore can be `null` and can go inside a `List` or a `Map`. Reach for `parseInt` when you want a number to compute with, and `valueOf` when the value can be `null` or live in a collection.

Both throw the same thing when the text is not a number:

```java
Integer.parseInt("abc");
// java.lang.NumberFormatException: For input string: "abc"
```

What counts as "not a number" is stricter than you would guess. `"abc"` is obviously not a number. But also `""`, `null`, `"38.5"` (that is a decimal, not an `int`), and **`"38 "` with a trailing space** — `parseInt` does not remove spaces at the start or the end, so one extra space is enough to make it fail:

```java
Integer.parseInt("38 ");
// java.lang.NumberFormatException: For input string: "38 "
```

That is why any number that comes from the user must have its spaces removed with `strip()` before you convert it to a number. One extra space (for example, the one a phone keyboard adds) is invisible when you read the log, but it is enough for `parseInt` to throw the exception:

```java
Integer.parseInt("38 ");          // NumberFormatException
Integer.parseInt("38 ".strip());  // 38
```

### The compiler does not force you to handle `NumberFormatException`

`NumberFormatException` is an **unchecked** exception, and the consequence is that **the compiler does not force you to handle it**. Handling an exception means writing the code that decides what to do when it happens, that is, when `parseInt` receives text it cannot turn into a number, such as `"abc"` or `"38 "`: wrapping the call in a `try/catch` or, instead, adding `throws NumberFormatException` to the method's signature so the caller deals with it. With an unchecked exception you do not have to do either. The line `Integer.parseInt(input)` compiles on its own, with no `try/catch`, no warning, and nothing in IntelliJ suggesting it can fail.

With **checked** exceptions it is the other way round. For example, `Files.readString(path)` reads a file and can throw `IOException`, which is checked: if you neither wrap it in `try/catch` nor add `throws IOException` to the method, the code does not compile. You saw this same example, with `Files.readString`, in [00-intro-java.md](00-intro-java.md).

So the responsibility is yours. Whenever the text comes from outside, you have two ways to protect yourself: wrap the call in a `try/catch`, or validate the text before converting it, that is, check first that it contains only digits and call `parseInt` only if it does:

```java
// Option 1 — try/catch: you try to convert and decide what to do if it fails
try {
    int id = Integer.parseInt(input.strip());
} catch (NumberFormatException e) {
    // rethrow an exception with a clear message and keep the original as its cause
    throw new IllegalArgumentException("The id must be a number: " + input, e);
}

// Option 2 — validate first: you only convert if the text is digits
String clean = input.strip();
if (clean.matches("\\d+")) {          // \d+ = one or more digits
    int id = Integer.parseInt(clean);
} else {
    throw new IllegalArgumentException("The id must be a number: " + input);
}
```

Without either, if a user types `id=abc` into a URL, the exception is not caught and the API responds with a 500 error. It is one of the most common mistakes when building a REST API.

> **Why is the difference between checked and unchecked explained in [11-exceptions.md](11-exceptions.md)?** Java splits exceptions into two kinds, checked and unchecked, and here you have only met one of them. To understand the difference you first need to know how an exception travels, where it can be caught, and how the classes that inherit from `Exception` are organised, because whether an exception is checked or unchecked depends precisely on the class it inherits from. All of that is explained in note 11. For now, keep the important part: the compiler does not warn you that `parseInt` can fail, so you have to remember it yourself.

### Number → text

To turn a number of type `int` into text there are three possible ways to do it, using `String.valueOf(x)`, `Integer.toString(x)` or concatenating with an empty string (`"" + x`), with `String.valueOf(x)` being the safest of them. Why it is the safest does not show when what you are converting is an `int`, but when the number arrives as an `Integer` that can be `null`, and it is explained right below the block:

```java
int hours = 38;

String a = String.valueOf(hours);      // "38" — works for any type, including objects and null
String b = Integer.toString(hours);    // "38" — the number's own conversion
String c = "" + hours;                 // "38" — works, but says nothing about intent
```

The three forms shown in the code block above convert an `int` into text, and an `int` can never be `null`: it is a primitive type and always holds a number. The `null` problem appears when the number arrives as an `Integer`, the wrapper of `int`, which, as you will remember, can be `null`. So when what you want to convert is not a primitive but an object that can be `null` (such as an `Integer`), the way you convert it does matter, and you have to use `String.valueOf(x)`, because it does not fail when `x` is `null`.

`valueOf` is a **static** method of `String`: you call it on the class (`String.valueOf(...)`) and pass the value you want to convert as its argument. That value can be an `int`, a `long`, a `double`, a `boolean`, a `char` or any object, because `String` has a version of `valueOf` for each type. If the argument is `null`, `valueOf` checks for it before doing anything and returns the text `"null"`, without throwing any exception.

> **What about `long`, `float` or `double`?** It works exactly the same way. The three forms exist for every numeric type: `String.valueOf(x)` accepts any of them, each wrapper has its own static method (`Long.toString(x)`, `Float.toString(x)`, `Double.toString(x)`) and `"" + x` works too. The `null` rule is the same: a `double` can never be `null`, but a `Double` can, and there you also have to use `String.valueOf(x)`. The only difference is the text you get with decimals, because Java writes the number exactly as it stores it:
>
> ```java
> String.valueOf(38.5);        // "38.5"
> String.valueOf(38.0);        // "38.0"  — with decimals, even though it is a whole number
> String.valueOf(10000000.0);  // "1.0E7" — from 10 million up it uses scientific notation
> String.valueOf(0.1 + 0.2);   // "0.30000000000000004" — the same rounding error you saw in 01-variables-types.md
> ```
>
> That is why, if the number is going to appear in a report, you do not convert it with these forms but with `.formatted()`, which you saw earlier in this note: `"%.2f".formatted(38.0)` gives `"38,00"` or `"38.00"` depending on the computer's locale settings.

With an object there is also a fourth form that is not in the previous examples: `x.toString()`, called directly on the variable. It is not the same as `Integer.toString(hours)`, nor as `Long.toString(x)` or `Double.toString(x)`: those are static methods of each wrapper that take the primitive number as their argument, whereas `x.toString()` can only be written when `x` holds an object, that is, an `Integer`, a `Long` or a `Double`, never with an `int`, a `long` or a `double`. Also, unlike `String.valueOf(x)`, this form throws an exception if `x` is `null`, as explained next.

`x.toString()` works differently from `String.valueOf(x)`, because it is an **instance** method: it is not called on the class but on one specific object, the one the variable `x` holds. Remember that an object variable does not hold the object itself but the memory address where it lives. When you write `x.toString()`, Java goes to that address, finds the object and runs its `toString()` method. If `x` is `null`, the variable holds no address: there is no object to run the method on, and Java throws `NullPointerException`:

```java
Employee e = null;

String s1 = String.valueOf(e);   // "null" — no crash; valueOf checks for null internally
String s2 = e.toString();        // 💥 NullPointerException — nothing there to call a method on
```

That is the reason `String.valueOf(x)` is the recommended choice. When we are sure the value is not `null`, `String.valueOf(e)` and `e.toString()` are equivalent. When the value can be `null`, `String.valueOf(e)` returns readable text, since it shows `"null"`, whereas `e.toString()` throws an exception and the request fails. Where it shows most is in logs and error messages. A log is written precisely to find out what went wrong, and very often what went wrong is that a value arrived as `null`. If you write `log.error("Employee: " + e.toString())` and `e` is `null`, the log line itself throws `NullPointerException`: the message is never written and you lose the clue you were looking for. With `log.error("Employee: " + String.valueOf(e))` the log shows `Employee: null`, and that already tells you what the problem is. That is why, in a log or an error message, you always use `String.valueOf`.

> **The one case where `String.valueOf` can cause problems.** Writing `String.valueOf(null)` with a bare literal `null` does **not** return `"null"` — it throws a `NullPointerException`. The cause is that `String.valueOf` is **overloaded**, that is, the `String` class does not have just one `valueOf` but several with the same name (`valueOf(int)`, `valueOf(boolean)`, `valueOf(char)`, `valueOf(Object)`, `valueOf(char[])`…), and each one accepts a different data type:
>
> ```java
> String.valueOf(38);         // uses valueOf(int)
> String.valueOf(true);       // uses valueOf(boolean)
> String.valueOf(employee);   // uses valueOf(Object)
> String.valueOf(letters);    // uses valueOf(char[]) — letters is an array of characters
> ```
>
> Java decides which one to use by looking at the type of what you pass it. With a bare `null` there is a problem: `null` is not a number or a boolean, but it can take the place of an `Object` or of a `char[]`, so there are two versions of `valueOf` that could receive it. When more than one version of `valueOf` could receive the argument, Java always picks the most specific one: every `char[]` is an `Object`, but not every `Object` is a `char[]`, so `valueOf(char[])` wins for being the most specific. And the first thing that version does is check how many characters the argument has, which in this case is an array because it is a `char[]`; since that array is `null`, it throws the exception. The error message even says so: `Cannot read the array length because "value" is null`. It only ever happens with a literal `null` written in the source, never with a null *variable*, whose declared type resolves the overload correctly. If we ever need to use `String.valueOf` with a `null` written by hand, we have to tell Java to treat it as an `Object`, since `String.valueOf((Object) null)` picks the `valueOf(Object)` version and gives you `"null"`.

In project 07, the `JwtUtil` class performs these conversions in both directions, from number to text and from text to number. When a user logs in, the application creates a JWT and stores that user's id inside it, in the `subject` claim. The problem is that `subject` only accepts text, whereas the id is a number of type `Long`. So when creating the token the id has to be converted to text, and when a request arrives with that token and the application reads the `subject` to find out which user it is, that text has to be converted back to a `Long`:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/JwtUtil.java
.subject(String.valueOf(userId))                          // Long → String, when the token is issued

return Long.valueOf(parseClaims(token).getSubject());     // String → Long, when the token is read
```

That second line can throw `NumberFormatException`, because here `Long.valueOf` receives text: it is the method you saw in "Text → number", the one that turns a text such as `"1042"` into a `Long` object. Do not confuse it with `String.valueOf`, which goes the opposite way, from number to text. Like every text-to-number method, if the text is not a valid number, it throws the exception. And here the text comes from outside, from the token the client sends with every request, so nothing guarantees it is a number. That it can throw is on purpose: if a token arrives whose `subject` is not a number —for example, an old token from before the `subject` held an id—, `Long.valueOf` throws the exception and the request is rejected, instead of carrying on with a user who is not authenticated. Which is the correct behaviour, and a good example of a conversion that is *also* a validation.

---

## Comparing two Strings

> 📖 Docs: [Oracle Docs — `java.lang.String`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html) → read: the `equals(Object)` and `equalsIgnoreCase(String)` entries in the method list — both are defined in terms of *the sequence of characters*, never of the object holding them.

To compare two Strings we have the `equals()` and `equalsIgnoreCase()` methods. With `==` they cannot really be compared: it compiles, but it does not compare the content of the two Strings, only the reference to the objects, and that is why it is a mistake:

```java
String name = form.getName();       // "Ana", what the user typed into the form

name.equals("Ana")                  // BIEN — compares the actual characters
name.equalsIgnoreCase("ana")        // BIEN — same, ignoring upper/lower case
name == "Ana"                       // MAL — never use == to compare text
```

`equals()` compares character by character, taking uppercase, accents, spaces, etc. into account, and tells you whether the content of two Strings is equal. With `name` holding `"Ana"`, `name.equals("Ana")` gives `true`, whereas `name.equals("ana")` gives `false`; and if `name` holds `"José"`, `name.equals("Jose")` gives `false` too. `equalsIgnoreCase()` does the same while treating `'A'` and `'a'` as identical: with `name` holding `"Ana"`, `name.equalsIgnoreCase("ana")` gives `true`. It only ignores case, not accents: if `name` holds `"José"`, `name.equalsIgnoreCase("jose")` still gives `false`. **To compare the content of two Strings always use `equals`, and `equalsIgnoreCase` when it does not matter whether the text is in uppercase or lowercase, as with an email or a username.**

> **Why the explanation of `==` waits for [06-oop-classes.md](06-oop-classes.md).** You already know from the diagram at the start of this file that a `String` variable holds an address, so `==` compares two addresses instead of two pieces of text — but knowing *that* is not the same as understanding it, and the understanding needs machinery this chapter does not have. It needs the object model: what `equals` really *is* (a method every class inherits), what its inherited version does, and how a class replaces it to compare content instead of addresses. It also needs to explain why `==` on two Strings sometimes returns `true`: not because it compares the text, but because of how Java stores literals in memory. Entry 06 builds classes first, then defines identity equality versus value equality, and resolves `String ==`, wrapper `==` and `Objects.equals`, three cases that are easier to understand when seen together. For now it is enough to keep the rule, use `equals` and never `==`; the why comes in note 06. If you only memorise the rule without ever understanding the reason, you will struggle to defend it when an interviewer asks you why.

---

## What this unlocks

With this file and [01-variables-types.md](01-variables-types.md) you can now work with the two kinds of value that show up in almost any Java program: numbers and text. For numbers, you saw that their type decides how arithmetic operations are carried out on them; for text, that a `String` cannot be modified, and that this immutability explains everything else. In practice, you can now:

- Read and use the `String` methods that come up most often, knowing each one returns a new `String` you have to keep.
- Validate a field that arrives with only spaces using `isBlank()`, not just an empty one with `isEmpty()`.
- Build a report line with `+` or `.formatted()`, and use `StringBuilder` when the text accumulates inside a loop.
- Write a multiline JSON body or SQL query with a text block, without needing to escape quotes or line breaks.
- Convert text to a number and a number to text, knowing that `parseInt` throws `NumberFormatException` when the text is not a valid number, and that the compiler does not warn you.
- Compare two Strings with `equals` or `equalsIgnoreCase`, and never with `==`.

What you still cannot do is make your program take decisions. So far every line runs exactly once, top to bottom, in the order it is written. The `for` loops that appeared in the `StringBuilder` section you used without anyone explaining them, only to understand the problem of accumulating text. [03-control-flow.md](03-control-flow.md) explains that: `if` to decide which lines run based on a value, and `for` and `while` to repeat a block as many times as needed. And it does so with the same `Employee` example and its weekly hours that you saw in this file.
