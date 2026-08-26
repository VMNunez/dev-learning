# Control Flow

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → read: "If-Else Statement", "Switch Statement" and "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

In [01-variables-types.md](01-variables-types.md) you learned how to declare and store typed values, and in [02-strings.md](02-strings.md) how to build, inspect and compare the text those values turn into. Both chapters left you with the same limitation, and it is the reason this one comes now: every line you wrote ran exactly once, top to bottom, in the order it was written. A program that only stores values and formats text does nothing interesting — it starts, evaluates, and stops. Control flow is what lets a program *make decisions* about those values (run this block, skip that one) and *repeat* work (loop over a list). It is the difference between a fixed script and a program that reacts to its data.

Control flow statements decide which code runs and how many times. Java uses the same structures as JavaScript — the syntax is nearly identical, so most of this will feel familiar.

**One example runs through this whole file: a weekly timesheet.** You have an `Employee`, a `day` of the week, and the `hours` that employee logged on that day. Every section below works on that same little world — deciding whether a day counts as overtime, naming the shift for a day, walking the week, walking the list of employees, and surviving a `name` that turns out to be `null`. Keeping one domain means you never have to re-orient at a new code block; you only have to notice what the *new* structure adds. `Employee` is also the model the rest of these notes reuse ([10-collections.md](10-collections.md), [12-streams-lambdas.md](12-streams-lambdas.md)), so it is worth getting familiar with here.

```java
// The world for this whole file
int hours;                        // hours logged on one day
String day;                       // "MONDAY", "SATURDAY"...
List<Employee> employees;         // the team
```

> **Two of those three lines use things you have not been taught yet, and that is deliberate.** `Employee` is a **class** — a type you write yourself, bundling data (a name, hours) with the methods that read it; how you declare one is [06-oop-classes.md](06-oop-classes.md)'s subject. `List<Employee>` is a **list of `Employee` objects** — a growable, ordered sequence, and the `<Employee>` in angle brackets is what tells the compiler what it holds; the list itself is [10-collections.md](10-collections.md) and the angle-bracket notation is [09-generics.md](09-generics.md). For this chapter you need none of that: read `Employee` as "one employee, and you can ask it for its name and its hours with `emp.getName()` and `emp.getHours()`", and `List<Employee>` as "several of them, in order". Every structure on this page is about *which lines run*, not about what is inside the box they run over.

---

## if / else

> 📖 Docs: [Baeldung — If-Else Statement in Java](https://www.baeldung.com/java-if-else) → read: "If-Else Statement" and "Nested If-Else Statement" — the chain form and why order matters.

The basic decision tool. Java evaluates the conditions top to bottom and runs the first block whose condition is true, then skips all the rest — even if a later condition would also be true. If no condition matches and you wrote an `else`, that block runs as the default.

```java
if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
```

> **Why "the first true block wins" matters.** Order is part of the logic, not a style choice. If you swap the first two branches — `hours > 0` first — then an employee with 10 hours matches `hours > 0`, prints `"Worked"`, and the overtime branch is never reached, because Java stops at the first match. The rule for any `if/else if` chain: put the **narrowest** condition first and widen as you go down.

> **The condition must be a real `boolean`.** This is the one place Java differs from JavaScript here. In JS you can write `if (name)` and it runs when `name` is any "truthy" value (a non-empty string, a non-zero number). Java has no truthy/falsy: the condition has to be an expression that evaluates to exactly `true` or `false`. `if (name)` does not compile — you get `incompatible types: String cannot be converted to boolean`. To check a string has content you write it out: `if (name != null && !name.isEmpty())`. The same rule applies to `while`, `do-while`, and the ternary below.

### Ternary operator

> 📖 Docs: [Baeldung — Ternary Operator in Java](https://www.baeldung.com/java-ternary-operator) → read: the syntax section and the nesting one — including why nesting two ternaries is usually a mistake.

A one-line shortcut for a simple `if/else` when you just need to pick a value. Same syntax as JavaScript:

```java
String label = hours > 8 ? "Overtime" : "Normal";
// condition ? valueIfTrue : valueIfFalse
```

Use it only when both values are short and the condition is easy to read. If the line becomes hard to scan, use a regular `if/else`.

> **Why a ternary and not an `if/else` here?** Because `if` is a **statement** and the ternary is an **expression**. A statement *does* something; an expression *produces a value*. Only an expression can sit on the right of an `=`, which is why `String label = if (...)` is not valid Java at all. This statement-versus-expression split is the exact same distinction that separates the two forms of `switch` below — it is worth fixing in your head now, because it comes back on the next page.

---

## switch

> 📖 Docs: [Baeldung — Java Switch Statement](https://www.baeldung.com/java-switch) → read it end to end; it walks the classic statement first and then the arrow-form switch expression.
> 📖 Docs: [Baeldung — Guide to the `yield` Keyword in Java](https://www.baeldung.com/java-yield-switch) → read it for the multi-statement arm: `yield` is what hands a value back out of a `{ }` block.

Use `switch` when you have many possible values for **one** variable. A chain of `if/else if` repeating `day.equals(...)` for each day of the week becomes hard to read — `switch` gives each value its own case and is easier to scan.

### What `switch` accepts — the exact scope

`switch` is far pickier about its selector (the value in the parentheses) than `if` is about its condition, and the limits are not guessable. On Java 25 you can switch on:

| Selector type | Allowed? | Note |
|---|---|---|
| `byte`, `short`, `char`, `int` | ✅ | the classic integer-like family |
| `Byte`, `Short`, `Character`, `Integer` | ✅ | the wrapper objects of those four |
| `String` | ✅ | since Java 7 |
| an `enum` | ✅ | the best case — see below |
| `long`, `float`, `double`, `boolean` | ❌ | rejected by the compiler |
| any other object (`Employee`, `Object`…) | ✅ *only* with type patterns (Java 21+) | `case Employee e ->` — not constant labels |

How to read this table: the "Allowed?" column is about the value in `switch (...)`, and the last two rows are the ones that surprise people. Switching on a primitive `long` — even `long x = 3L` — does **not** compile; on Java 25 the compiler answers with **two** errors at once, and the first one is confusing until you know why: `primitive patterns are a preview feature and are disabled by default` — because switching on `long`/`double`/`boolean` is a not-yet-released language feature rather than a plain type error, so the compiler assumes you were reaching for that feature. The second error is the plain-English one: `constant label of type int is not compatible with switch selector type long`. Read past the first, and the second tells you what actually happened. And an object selector is allowed only in the pattern form (`case String s ->`), never with constant labels: `Long id = 5L; switch (id) { case 5: ... }` fails with `incompatible types: int cannot be converted to Long`.

> **That last row names a form you will not write yet.** `case Employee e ->` is a **type pattern**: instead of comparing the selector against a constant, the case asks "is this value an `Employee`?" and, if it is, hands it to you already typed as one. It is real Java and it is why the row says ✅, but it belongs to a later stage of the language — this chapter, and every switch in it, uses only constant labels (a number, a `String`, an `enum` constant). Read the row as: *with plain constant labels, an arbitrary object is not a legal selector.* The same test written as a plain `if`, `instanceof` with a pattern variable, arrives in [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md).

> **Why is `boolean` banned when it looks like the easiest case of all?** Because a `boolean` has exactly two values, so a `switch` over it can never be anything an `if/else` does not already say more clearly. The language leaves it out on purpose rather than by oversight. The rule of thumb that follows: reach for `switch` at three or more possible values, `if/else` below that.

> **`enum` is the selector `switch` was made for.** With an `enum` the compiler knows the complete set of possible values, so it can check you handled every one of them — something it can never do for a `String`, where the set is infinite. When you later meet [14-enums.md](14-enums.md), this is the payoff to remember.

### Classic switch (statement)

The classic form runs the code of the case that matches. You must write `break` at the end of each case — without it, execution falls into the next case and runs that code too, **even if it does not match**. This behaviour has a name: **fall-through** (literally "falling down") — control "falls" from one case to the next without stopping.

The mechanism is worth stating plainly, because it explains everything else here: a `case` label is not the start of a separate block, it is only a **jump target**. Java jumps to the matching label and then keeps executing straight down through whatever follows it, labels included, until something stops it. `break` is that something.

```
switch (day) matches "SATURDAY"
       │
       ▼
  case "MONDAY":   ─┐  skipped (jumped over)
  case "FRIDAY":   ─┘
  case "SATURDAY":  ◀── execution lands here
      println("Weekend shift");
                          │ no break → keeps falling
                          ▼
  default:
      println("Unknown day");   ← runs too!
```

Here is that bug and its fix, side by side:

```java
// ❌ MAL — no break: a Saturday prints TWO lines
switch (day) {
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend shift");
    default:
        System.out.println("Unknown day");
}
// day = "SATURDAY" prints:
// Weekend shift
// Unknown day
```

```java
// ✅ BIEN — break stops the fall
switch (day) {
    case "MONDAY":
    case "TUESDAY":
    case "WEDNESDAY":
    case "THURSDAY":
    case "FRIDAY":
        System.out.println("Weekday shift");
        break;        // without this, execution falls into the next case
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend shift");
        break;
    default:
        System.out.println("Unknown day");
}
```

Notice that the fix uses fall-through *on purpose* too: `case "MONDAY":` through `case "THURSDAY":` have no code between them, so all five weekdays fall into the same block. That is the one legitimate use — stacking labels that share behaviour. The bug is fall-through you did not intend; the pattern is fall-through with nothing in between.

The `default` block is not required, but include it: it is your safety net for a value nobody anticipated (a typo, a new day name added later), and without it an unmatched value simply does nothing at all — silently.

> **Switching on a `null` String throws.** `switch (day)` when `day` is `null` does not fall to `default` — it crashes with a `NullPointerException` before any case is compared. On Java 25 the message is `Cannot invoke "String.hashCode()" because "<local2>" is null`. Two things in it look strange and both have an explanation. `hashCode()` appears because a `String` switch is compiled into a hash lookup — the compiler turns your cases into a jump table keyed by hash code, which is exactly what makes `switch` faster to scan than a chain of `equals()` calls. And `<localN>` appears instead of your variable name because the selector is first copied into a hidden temporary variable that has no name in your source — the number is just the JVM's slot index for that temporary, so expect it to change from `<local1>` to `<local2>` and up depending on how many variables the method already declared. So guard the value before you switch on it — see [Null guards](#null-guards) at the end of this file.

### Switch expression (Java 14+) — use this form

The classic switch is a **statement**: it runs code and returns nothing. The switch **expression** produces a value, so you can assign it straight to a variable — the same statement-versus-expression distinction you met with the ternary above.

It also removes fall-through: each arm uses `->` and runs exactly one thing, so no `break` exists and none is needed.

```java
String shift = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
```

**Exhaustiveness is enforced, and it is an error, not a warning.** A switch expression has to produce a value on *every* possible input — there is no such thing as "no branch matched, so the variable stays unassigned". So the compiler checks the arms cover everything and refuses to build otherwise:

```java
// ❌ MAL — no default, and String has infinitely many possible values
String shift = switch (day) {
    case "MONDAY" -> "Weekday";
};
// error: the switch expression does not cover all possible input values
```

That is *why* `default` is effectively mandatory — with one exception: when the selector is an `enum` and your arms name every constant, the compiler already knows the set is complete and lets you omit `default` entirely. (A classic switch **statement** does not have this problem, because a statement produces nothing, so "nothing matched" is a legal outcome.)

**`yield` — when an arm needs more than one line.** An arrow arm normally ends in a single expression, which becomes the value. If you need several statements, wrap them in `{ }` — and then Java needs to be told which value to hand back, because a block has no "last expression" rule the way a lambda does. That keyword is `yield`:

```java
int dailyLimit = switch (day) {
    case "SATURDAY", "SUNDAY" -> 0;
    default -> {
        int base = 8;
        System.out.println("Working day: " + day);
        yield base;                 // this is the value of the arm
    }
};
```

> **`yield` is not `return`.** `return` exits the whole *method*. `yield` exits only the switch arm and gives its value to the switch expression, and execution carries on with the next line of the same method. Writing `return base;` inside a switch expression does not compile at all (`attempt to return out of a switch expression`) — the two words look interchangeable and are not.

Use the switch expression form for all new code — it is cleaner, safer, and the exhaustiveness check turns a class of silent bugs into compile errors.

---

## for loops

> 📖 Docs: [Baeldung — Java For Loop](https://www.baeldung.com/java-for-loop) → read the basic three-part `for` first, then the enhanced (for-each) form at the end.
> 📖 Docs: [Baeldung — A Guide to Java Loops](https://www.baeldung.com/java-loops) → read it for the three loop types side by side, when each one fits.

Both `for` forms below walk an **array**, and an array is the one thing on this page you have not met yet. You need very little of it here, so take that little now rather than tripping over `week.length` mid-example.

> **An array, in one paragraph.** An array is a fixed-size row of slots, all holding the same type, laid out one next to another in memory. You create it either by listing its contents — `String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};` — or by asking for a size and filling it later — `String[] week = new String[3];`, whose three slots start out holding `null` (a `new int[3]` would start as three zeros instead, because an `int` cannot be `null`; that primitive-versus-reference split is [01-variables-types.md](01-variables-types.md)'s). You reach a slot by its **index** in square brackets, `week[0]`, and the counting starts at **zero**, so a row of three has indexes 0, 1 and 2 — never 3. You ask how many slots there are with `week.length`: a **field**, written with no parentheses, unlike `String.length()` and `List.size()`, which are methods. And "fixed-size" is literal — there is no `add()`, no `remove()`, and no way to grow a `String[3]` into a `String[4]`. That is the entire array vocabulary this chapter uses.

> **Why you are given only that much.** The interesting question about arrays is not their syntax, it is *when a fixed row of slots is still the right structure and when a resizable `List` replaces it* — and that question cannot be answered before you have the collection APIs to compare against. [10-collections.md](10-collections.md) answers it in full, in its `List vs Array` table, and that is also where `List` itself — the `List<Employee>` in the code at the top of this file — is properly taught. Here an array is deliberate scaffolding: the simplest concrete thing a loop can walk, so the loop stays the subject.

### Classic for

The most explicit form — you control the start, stop, and step yourself. Three parts, separated by semicolons: `(init; condition; step)`. Use it when you need the index number.

> **What is the "step"?** It is how much the counter moves on each iteration. `i++` is the most common step: it adds 1 to `i`. But you could use `i += 2` to go in twos, or `i--` to count backwards.

```java
String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};

for (int i = 0; i < week.length; i++) {
    System.out.println(i + ": " + week[i]);
}
// 0: MONDAY
// 1: TUESDAY
// 2: WEDNESDAY
```

- `int i = 0` — start at index 0
- `i < week.length` — keep going while this is true
- `i++` — increment i by 1 after each iteration

The order the three parts actually run in is the part people get wrong, so trace it once: `init` runs **once**, before anything else. Then, before every iteration, `condition` is checked; if it is false the loop ends immediately and the body never runs again. The body runs. *Then* `step` runs — at the **end** of the iteration, not the start. Then back to `condition`. That is why the body sees `i = 0` on the first pass, not `i = 1`.

> **`i` dies with the loop.** Because `int i` is declared inside the `for` parentheses, its scope is the loop and nothing else — the moment the loop finishes, the name is gone. Reading it afterwards fails at compile time with `cannot find symbol / symbol: variable i`. This is deliberate: a counter is bookkeeping for the loop, not information for the rest of the method. If you genuinely need the final value after the loop (rare — usually it means you wanted a `while`), declare the variable *before* the loop instead: `int i = 0; for (; i < week.length; i++) { ... }`. Scope in general is covered in [01-variables-types.md](01-variables-types.md) — same rule, applied to the loop header.

**The off-by-one error, and the exception it produces.** The three-part header is powerful precisely because you write the bounds yourself, which means you can also write them wrong. The classic slip is `<=` where you meant `<`:

```java
int[] weekHours = {8, 8, 6};   // length 3, valid indexes 0, 1, 2

// ❌ MAL
for (int i = 0; i <= weekHours.length; i++) {   // i reaches 3
    System.out.println(weekHours[i]);
}
// prints 8, 8, 6 and then crashes:
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3

// ✅ BIEN
for (int i = 0; i < weekHours.length; i++) {
    System.out.println(weekHours[i]);
}
```

Read the message literally and it tells you everything: `Index 3` is the value `i` had, `length 3` is the size, and an array of length 3 has its last slot at index 2. This is called an **off-by-one error** — being wrong by exactly one position. Note *when* it fails: not at compile time, at runtime, and only after three correct lines have already printed. It is the loud half of the compile-time/runtime split you met in [01-variables-types.md](01-variables-types.md).

> **Why does counting start at 0 at all?** An array is a single contiguous block of memory, and the index is not a position number — it is an **offset** from the block's start address. The first element sits at the start, so its offset is zero. Once you read `i` as "how far from the beginning", `length - 1` as the last index stops being an arbitrary rule.

### Enhanced for (for-each) — use this for collections and arrays

> 📖 Docs: [Baeldung — The for-each Loop in Java](https://www.baeldung.com/java-for-each-loop) → read it for what the loop expands into for arrays and for `Iterable`, which is the whole explanation of its limits below.

The classic index loop has two frequent problems: it is longer to write, and — as you just saw — the bounds are yours to get wrong. The enhanced `for` removes the index entirely and hands you each item directly, so the off-by-one error becomes literally unwritable. Think of it as Java's version of `for...of` in JavaScript.

Syntax: `for (Type variable : collection)` — read as "for each item of this type in this collection".

```java
String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};
for (String day : week) {
    System.out.println(day);
}

List<Employee> employees = getEmployees();
for (Employee emp : employees) {
    System.out.println(emp.getName());
}
```

**What it actually compiles to — this explains every one of its limits.** The enhanced `for` is pure syntax sugar: `javac` rewrites it into one of two older loops before producing bytecode, and *which* one depends on what you are looping over.

```
for (String day : week)          →   for (int i = 0; i < week.length; i++) {
   (an ARRAY)                            String day = week[i];
                                         ...
                                     }

for (Employee e : employees)     →   Iterator<Employee> it = employees.iterator();
   (anything Iterable, e.g. List)     while (it.hasNext()) {
                                         Employee e = it.next();
                                         ...
                                     }
```

You can confirm this yourself: compile a class with both loops and run `javap -c` on it — the array version shows `arraylength` and `iinc` (an index counter), the list version shows `invokeinterface ... Iterator.hasNext` and `Iterator.next`. Three consequences follow directly from those two rewrites:

**1. You cannot get the index.** In the list rewrite there is no counter anywhere — the iterator just hands over "the next one" with no idea what number it is. So if you need the position, the enhanced `for` cannot give it to you and you go back to the classic `for` (or `IntStream.range`, in [12-streams-lambdas.md](12-streams-lambdas.md)).

**2. You cannot `remove()` from the collection inside it.** The iterator remembers how many structural changes the list had when it started; calling `employees.remove(e)` changes the list behind its back, the two numbers stop agreeing, and the next `it.next()` throws `ConcurrentModificationException`. It is not a rule invented to annoy you — it is the iterator refusing to keep walking a list whose positions may have shifted underneath it.

Concretely: calling `employees.remove(e)` inside a `for (Employee e : employees)` compiles fine and then dies on the following iteration with `Exception in thread "main" java.util.ConcurrentModificationException` — a bare message with no "because" clause, so the stack trace pointing at `ArrayList$Itr.checkForComodification` is your only clue. The one-line fix is `employees.removeIf(e -> !e.isActive())`, which runs the same deletion through a correctly-managed iterator. (`e -> !e.isActive()` is a lambda — read it for now as "for each employee `e`, this condition"; full treatment in [12-streams-lambdas.md](12-streams-lambdas.md).)

> **Deferred on purpose — this is a collections topic, not a loop topic.** The reason it appears at all here is that it is a *consequence of the iterator rewrite* you just read, and you would otherwise have no idea why an innocent-looking loop explodes. But the version counter (`modCount`), the worked wrong-vs-right pair, and the two other legal ways to remove while iterating all belong to [10-collections.md](10-collections.md), where they are covered in full — open that file when you actually hit this. Deliberately not repeated here, so there is one canonical explanation rather than two that can drift apart.

**3. Assigning to the loop variable changes nothing.** Look at the array rewrite: `String day = week[i]` **copies** the slot into a fresh local variable on every pass. Reassigning that local just points the copy somewhere else; the array slot is untouched.

```java
// ❌ MAL — week is unchanged afterwards
for (String day : week) {
    day = day.toLowerCase();
}

// ✅ BIEN — write back through the index
for (int i = 0; i < week.length; i++) {
    week[i] = week[i].toLowerCase();
}
```

> **This is the value-versus-reference idea from [01-variables-types.md](01-variables-types.md), in loop form.** What gets copied is the *reference*, not the object. So reassigning `day` is invisible to the array — but calling a mutating method on the object it points at (`emp.setHours(0)`) **is** visible, because both the copy and the array slot point at the same `Employee`. Reassign = no effect; mutate = effect.

Use the enhanced for whenever you just need the items and do not need the index. In Spring Boot, this is what you will write most of the time — though streams (covered in [12-streams-lambdas.md](12-streams-lambdas.md)) are even more concise for transforming collections.

---

## while and do-while

> 📖 Docs: [Baeldung — Java While Loop](https://www.baeldung.com/java-while-loop) → read it for the syntax and the "check before the body" order.
> 📖 Docs: [Baeldung — Java Do-While Loop](https://www.baeldung.com/java-do-while-loop) → read it for the contrast with `while`: body first, condition second, always at least one run.

Use `while` and `do-while` when you do not know how many iterations you need in advance. A `for` loop is better when you know the range: the `for` header keeps init, condition and step together on one line precisely *because* you know all three up front. When you do not — you are reading a file until it ends, retrying a call until it succeeds, asking a queue for the next item until it is empty — that header has nothing to hold, and `while` is the honest shape.

**`while`** checks the condition first. If the condition is false from the start, the body never runs — zero times is a perfectly normal outcome.

**`do-while`** runs the body first, then checks the condition. This guarantees at least one execution — useful when you must do something before you can even know whether to continue: you cannot ask "was that page empty?" until you have fetched a page.

```java
// while — check first, may never run
int i = 0;
while (i < week.length) {
    System.out.println(week[i]);
    i++;                              // ← the step is YOUR responsibility here
}

// do-while — run at least once, then check
int page = 0;
do {
    List<Employee> batch = loadPage(page);   // must fetch before you can test
    process(batch);
    page++;
} while (page < totalPages);          // ← note the semicolon
```

> **The infinite loop — the one real hazard of `while`.** A `for` header puts the step right next to the condition, so forgetting it is hard. In a `while`, the step is an ordinary line buried somewhere in the body, and if you forget it — or an early `continue` jumps over it — the condition never changes and the loop runs forever. There is no error, no exception, no stack trace: the program simply stops responding and the CPU pins at 100%.
> ```java
> // ❌ MAL — i is never incremented; this never ends
> int i = 0;
> while (i < week.length) {
>     System.out.println(week[i]);
> }
> ```
> The habit that prevents it: when you write the `while` condition, immediately write the line that will eventually make it false, *before* you write anything else in the body.

> **`do-while` ends in a semicolon — and only `do-while` does.** `} while (page < totalPages);` — drop that `;` and you get `error: ';' expected`. The reason is that this `while` is the *tail* of a statement rather than the head of a block, so it terminates like any other statement. No other loop in Java needs a closing semicolon, which is exactly why this one is easy to forget.

`do-while` is genuinely rare — reach for it only when the "run at least once" guarantee is the point (pagination, menu prompts, retry-then-check). In Spring Boot you will mostly use for-each loops and streams; `while` appears in algorithms and when consuming something until it is exhausted, such as reading a file line by line.

### Choosing between the four loop forms

You have now seen all four, so here they are as one decision. The question that picks the form is never "which loop do I like" — it is **what the repetition promises**, and each form makes a different promise:

| What the repetition is | Form | The contract it makes |
|---|---|---|
| **Counted** — a known number of passes, and you need the position number | classic `for` | you write init, condition and step yourself, so the count is explicit and yours to get wrong |
| **Element traversal** — visit every item, position irrelevant | enhanced `for` | the loop hands you each element in turn; there is no index to write, so no off-by-one to make |
| **Pre-checked** — repeat while something holds, possibly zero times | `while` | the condition is tested *before* the body, so zero executions is a legal, normal outcome |
| **Post-checked** — repeat while something holds, but at least once | `do-while` | the body runs *before* the first test, so one execution is guaranteed |

How to read the table: the **middle** column is the answer, the **left** column is what you must be able to say about your own problem before you can pick it, and the right column is the check — if the contract in that row is not what your code actually promises, you chose wrong. Two rows are worth pressing on. The `while` row and the classic-`for` row are both pre-checked in mechanics (a `for` also tests before every pass, including the first); what separates them is *who owns the counter* — the `for` header holds init, condition and step together because you know all three in advance, and `while` is the honest shape when you do not. And the enhanced-`for` row is the only one where the loop, not you, supplies the values, which is why it is the default for arrays and collections and why it cannot give you an index.

> **Every loop is convertible into every other one — that is not the point.** You can write a counted loop as a `while`, and an enhanced `for` as a classic `for`; the compiler literally does the second one for you. Choosing the right form is not about capability, it is about what the next reader can assume without reading the body. Seeing `for (Employee emp : employees)` tells them "every employee, exactly once, in order" before they read a single line inside. Seeing `while (…)` tells them "this may run zero times and the exit condition is somewhere below" — which is true information, and misleading when the loop was really just counting.

---

## break, continue, and return

> 📖 Docs: [Baeldung — The Java `continue` and `break` Keywords](https://www.baeldung.com/java-continue-and-break) → read it for the unlabeled forms first, then the labeled ones at the end.
> 📖 Docs: [Baeldung — Labeled Breaks in Java: Useful Tool or Code Smell?](https://www.baeldung.com/java-labeled-break) → read it for the readability argument — when to extract a method instead.

Three statements cut execution short, and they are constantly confused with each other because all three "stop" something — the useful question is always *stop what, exactly*. Two of them are loop instructions: `break` and `continue` work in `for`, `while`, and `do-while`, all three loop types you have seen, and `break` additionally appears in a classic `switch` statement to stop fall-through (as you saw above), where `continue` has no meaning at all. The third, `return`, is not a loop instruction — it belongs to the method — and that difference is what the second half of this section is about.

- **`break`** exits the entire loop immediately — no more iterations happen after it.
- **`continue`** skips the rest of the current iteration and jumps straight to the next one.
- **`return`** exits the entire **method**. The loop ends as a side effect, and so does everything that was going to run after the loop.

```java
for (Employee emp : employees) {
    if (!emp.isActive()) continue;          // skip this one, keep going
    if (emp.getHours() > 40) {
        System.out.println("Overtime: " + emp.getName());
        break;                              // first offender found — stop looking
    }
}
```

Think of `break` as the emergency exit and `continue` as the skip button — and `return`, which comes next, as leaving the building altogether.

> **`continue` in a `while` is where the infinite loop bites.** `continue` jumps to the *condition check*, skipping everything left in the body — including your `i++` if it sits below the `continue`. In a classic `for` this is harmless, because the step lives in the header and still runs. In a `while` it hangs the program. Put the increment above any `continue`, or use a `for`.

### `return` — it leaves the method, not the loop

`break` and `continue` are bounded by the loop that contains them: they can only be written inside one, and the largest thing either can end is that loop. `return` is a statement of a different kind. It belongs to the **method**, it is legal almost anywhere inside one — in a loop, in an `if`, on the very first line, in a method with no loop at all — and when it runs the method is finished. (The one place it is *not* legal is inside a switch expression's arm, and you already know why: an arm has to produce a value for the switch, not walk out of the method. That is what `yield` is for.)

The way to keep the three apart is to ask, of each, exactly *what is left behind* and *where execution lands next*:

| Statement | What it leaves | Where execution lands next | Where it is legal |
|---|---|---|---|
| `continue` | the rest of the current iteration | the loop's next condition check — in a classic `for`, after the step (`i++`) has run | inside a loop only |
| `break` | the whole loop — the innermost one containing it | the first line after that loop, in the same method | inside a loop, or a classic `switch` statement |
| `return` | the whole **method**, loop included | the line after the **call**, back inside the method that called this one | anywhere in a method, except inside a switch expression's arm |

Read the third column as "where the cursor goes": for `continue` and `break` it goes somewhere else in the *same* method, a few lines away, and the method carries on. For `return` it goes into a *different* method — the one that called this one — and this method never runs again. That is the difference in kind, and it is worth saying in one line: **`break` and `continue` reposition you inside the current piece of work; `return` ends the current piece of work and hands control back to whoever asked for it.**

All three, on the same timesheet, in one method:

```java
String firstOvertimeName(List<Employee> employees) {
    for (Employee emp : employees) {
        if (!emp.isActive()) {
            continue;                  // 1 — this employee does not count; go to the next one
        }
        if (emp.getHours() > 40) {
            return emp.getName();      // 3 — found it: leave the loop AND the method, with a value
        }
        if (emp.getHours() == 0) {
            break;                     // 2 — the list is sorted; nothing after this can qualify
        }
    }
    return "none";                     // reached if the loop ends normally, or after the break
}
```

Trace the three exits. The `continue` sends control back to the `for` header, which produces the next `emp` — the loop is untouched and still running. The `break` sends control to the first line *after* the loop, which here is `return "none";` — the loop is over, the method is not. And `return emp.getName()` does neither of those: the method stops on that line, `return "none";` is never reached at all, and the value travels back out to whatever wrote `String who = firstOvertimeName(team);`.

> **Why a method cannot survive its own `return`.** Every call gets a private workspace: its parameters, its local variables, and a note of the exact instruction to come back to in the caller. `break` and `continue` never touch that workspace — they only move the instruction pointer around inside it, which is why the method keeps going. `return` discards the workspace and jumps to the recorded return point. There is nothing left to continue *with*, so "return and then keep looping" is not something the language could offer even if it wanted to. What that workspace physically is, where it lives, and why it is called the call stack is [05-memory-model.md](05-memory-model.md)'s subject; for now, "the method's private workspace, thrown away on return" is enough.

> **`return;` with nothing after it is still a `return`.** A method declared `void` — one that promises to hand nothing back — can still cut itself short with a bare `return;`, and that is one of the most common shapes in real code: test the case you cannot handle, `return;`, and let everything below assume the good case. The compiler enforces the promise in both directions: writing `return something;` in a `void` method fails with `error: incompatible types: unexpected return value`, and reaching the end of a method that promised a value without returning one fails with `error: missing return statement`. *What* a method promises — its return type, its parameters, its signature — is [04-methods.md](04-methods.md)'s subject, and it is the next chapter precisely because you have now met the statement that ends one.

> **Anything written after `break`, `continue` or `return` in the same block does not compile.** Not a warning, and not dead code the JVM quietly skips: `error: unreachable statement`, and the build stops. Java refuses to keep lines that provably can never execute. Treat it as a useful accident rather than an annoyance — when it appears while you are moving code around, it is telling you the exit happens earlier than you thought it did.

### Labelled break and continue — escaping nested loops

Plain `break` only ever exits **one** loop: the innermost one containing it. So the obvious question — "how do I break out of both loops at once?" — has its own syntax. You put a **label** (any name, followed by `:`) immediately before the outer loop, and then say which loop you mean: `break outer;`.

The timesheet gives a natural case: a grid of employees × days, and you want to stop the whole search the moment you find any unapproved entry.

```java
outer:
for (Employee emp : employees) {
    for (String day : week) {
        if (!isApproved(emp, day)) {
            System.out.println("Blocked by " + emp.getName() + " on " + day);
            break outer;          // leaves BOTH loops
        }
    }
}
System.out.println("Done");       // execution resumes here
```

```
outer:  for (emp : employees)  ◀──────────────┐
            for (day : week)                  │  break outer;
                if (...) ─────────────────────┘  (jumps past the OUTER loop)
        println("Done");   ◀── lands here

        (a plain `break` would land at the closing brace of the INNER loop,
         and the outer loop would carry on with the next employee)
```

`continue outer;` works the same way but skips to the outer loop's next iteration instead of leaving it — "this employee is a lost cause, move to the next employee" rather than "the next day":

```java
outer:
for (Employee emp : employees) {
    for (String day : week) {
        if (!isApproved(emp, day)) continue outer;   // next employee
        total += hoursOf(emp, day);
    }
}
```

> **A label is not a `goto`.** It only names a loop so `break`/`continue` can point at it, and control can only ever move *out of* or *forward in* that loop — you cannot jump backwards or into a block, so none of the spaghetti a real `goto` allows is possible. Interviewers ask about this precisely because people assume the worst.

> **`break` vs returning from a method.** In Spring Boot services, it is more common to return early from a method than to use `break`. If you are checking a condition inside a loop and want to stop all work, `return` is usually cleaner than `break` — and it is the standard alternative to a labelled break: extract the nested loops into their own method and `return` from it, which exits every loop at once with no label needed.

---

## Null guards

> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → read only the opening section for now: what a null guard is, and why it is written as an ordinary `if` rather than with any special syntax.

Two of the structures on this page break on a value that is `null` — an `if` condition that calls a method on it, and a `switch` whose selector is one — so it is worth naming the pattern that protects both before you leave the chapter. A **null guard** is nothing new: it is a plain `if`, using the conditions you already know, asking one question — does this reference point at an object at all?

```java
// ✅ the guard is an ordinary if — Java has no dedicated syntax for this
if (name != null) {
    System.out.println(name.toUpperCase());
}
```

Calling a method on a reference that holds `null` fails while the program is running, with a `NullPointerException`; and `switch (day)` on a `null` `day` throws before any case is even compared, as the callout in the switch section showed. Chaining the guard with `&&` is what makes `if (name != null && !name.isEmpty())` safe rather than a crash waiting to happen: `&&` evaluates its left side first and never looks at the right side when the left is false, so `name.isEmpty()` is simply never reached on a null `name`. That is the short-circuit rule from [01-variables-types.md](01-variables-types.md), doing real work.

**Everything else about `null` is [04-methods.md](04-methods.md)'s.** Where in a program a required value should be rejected so that the eventual failure names the real culprit instead of a line far away; what a guard clause looks like at a method boundary; how to read the "because ... is null" part of a modern `NullPointerException` message — all three are questions about the contract a method has with its caller, which is exactly what the next chapter introduces. They are deliberately answered there once, rather than here and there twice.

---

So far every loop and condition has lived inside one block of code. But real programs are not one long block — they are split into reusable, named pieces you can call by name, each taking inputs and handing back a result. Those pieces are **methods**, and the `if`, `for`, and `switch` you just learned are the building blocks that go inside them. Notice how often this file already needed one: `isApproved(emp, day)`, `loadPage(page)`, and the "extract the nested loops and `return`" tip all assume you can name a piece of logic and call it. That is where [04-methods.md](04-methods.md) picks up.
