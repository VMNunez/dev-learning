# Control Flow

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → read: "If-Else Statement", "Switch Statement" and "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

In [01-variables-types.md](01-variables-types.md) you learned how to declare and store values. On its own, a program that only stores values does nothing interesting — it runs top to bottom, one line after another, and stops. Control flow is what lets a program *make decisions* about those values (run this block, skip that one) and *repeat* work (loop over a list). It is the difference between a fixed script and a program that reacts to its data.

Control flow statements decide which code runs and how many times. Java uses the same structures as JavaScript — the syntax is nearly identical, so most of this will feel familiar.

**One example runs through this whole file: a weekly timesheet.** You have an `Employee`, a `day` of the week, and the `hours` that employee logged on that day. Every section below works on that same little world — deciding whether a day counts as overtime, naming the shift for a day, walking the week, walking the list of employees, and surviving a `name` that turns out to be `null`. Keeping one domain means you never have to re-orient at a new code block; you only have to notice what the *new* structure adds. `Employee` is also the model the rest of these notes reuse ([07-collections.md](07-collections.md), [09-streams-lambdas.md](09-streams-lambdas.md)), so it is worth getting familiar with here.

```java
// The world for this whole file
int hours;                        // hours logged on one day
String day;                       // "MONDAY", "SATURDAY"...
List<Employee> employees;         // the team
```

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

> **Why is `boolean` banned when it looks like the easiest case of all?** Because a `boolean` has exactly two values, so a `switch` over it can never be anything an `if/else` does not already say more clearly. The language leaves it out on purpose rather than by oversight. The rule of thumb that follows: reach for `switch` at three or more possible values, `if/else` below that.

> **`enum` is the selector `switch` was made for.** With an `enum` the compiler knows the complete set of possible values, so it can check you handled every one of them — something it can never do for a `String`, where the set is infinite. When you later meet [11-enums.md](11-enums.md), this is the payoff to remember.

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

> **Switching on a `null` String throws.** `switch (day)` when `day` is `null` does not fall to `default` — it crashes with a `NullPointerException` before any case is compared. On Java 25 the message is `Cannot invoke "String.hashCode()" because "<local2>" is null`. Two things in it look strange and both have an explanation. `hashCode()` appears because a `String` switch is compiled into a hash lookup — the compiler turns your cases into a jump table keyed by hash code, which is exactly what makes `switch` faster to scan than a chain of `equals()` calls. And `<localN>` appears instead of your variable name because the selector is first copied into a hidden temporary variable that has no name in your source — the number is just the JVM's slot index for that temporary, so expect it to change from `<local1>` to `<local2>` and up depending on how many variables the method already declared. So guard the value before you switch on it — see [Null checks](#null-checks) at the end of this file.

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
int[] hours = {8, 8, 6};   // length 3, valid indexes 0, 1, 2

// ❌ MAL
for (int i = 0; i <= hours.length; i++) {   // i reaches 3
    System.out.println(hours[i]);
}
// prints 8, 8, 6 and then crashes:
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3

// ✅ BIEN
for (int i = 0; i < hours.length; i++) {
    System.out.println(hours[i]);
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

**1. You cannot get the index.** In the list rewrite there is no counter anywhere — the iterator just hands over "the next one" with no idea what number it is. So if you need the position, the enhanced `for` cannot give it to you and you go back to the classic `for` (or `IntStream.range`, in [09-streams-lambdas.md](09-streams-lambdas.md)).

**2. You cannot `remove()` from the collection inside it.** The iterator remembers how many structural changes the list had when it started; calling `employees.remove(e)` changes the list behind its back, the two numbers stop agreeing, and the next `it.next()` throws `ConcurrentModificationException`. It is not a rule invented to annoy you — it is the iterator refusing to keep walking a list whose positions may have shifted underneath it.

Concretely: calling `employees.remove(e)` inside a `for (Employee e : employees)` compiles fine and then dies on the following iteration with `Exception in thread "main" java.util.ConcurrentModificationException` — a bare message with no "because" clause, so the stack trace pointing at `ArrayList$Itr.checkForComodification` is your only clue. The one-line fix is `employees.removeIf(e -> !e.isActive())`, which runs the same deletion through a correctly-managed iterator. (`e -> !e.isActive()` is a lambda — read it for now as "for each employee `e`, this condition"; full treatment in [09-streams-lambdas.md](09-streams-lambdas.md).)

> **Deferred on purpose — this is a collections topic, not a loop topic.** The reason it appears at all here is that it is a *consequence of the iterator rewrite* you just read, and you would otherwise have no idea why an innocent-looking loop explodes. But the version counter (`modCount`), the worked wrong-vs-right pair, and the two other legal ways to remove while iterating all belong to [07-collections.md](07-collections.md), where they are covered in full — open that file when you actually hit this. Deliberately not repeated here, so there is one canonical explanation rather than two that can drift apart.

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

Use the enhanced for whenever you just need the items and do not need the index. In Spring Boot, this is what you will write most of the time — though streams (covered in [09-streams-lambdas.md](09-streams-lambdas.md)) are even more concise for transforming collections.

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

---

## break and continue

> 📖 Docs: [Baeldung — The Java `continue` and `break` Keywords](https://www.baeldung.com/java-continue-and-break) → read it for the unlabeled forms first, then the labeled ones at the end.
> 📖 Docs: [Baeldung — Labeled Breaks in Java: Useful Tool or Code Smell?](https://www.baeldung.com/java-labeled-break) → read it for the readability argument — when to extract a method instead.

Both keywords change the flow inside a loop. They work in `for`, `while`, and `do-while` — all three loop types you have seen. In `switch`, `break` also appears to stop fall-through (as you saw above), but `continue` does not apply there.

- **`break`** exits the entire loop immediately — no more iterations happen after it.
- **`continue`** skips the rest of the current iteration and jumps straight to the next one.

```java
for (Employee emp : employees) {
    if (!emp.isActive()) continue;          // skip this one, keep going
    if (emp.getHours() > 40) {
        System.out.println("Overtime: " + emp.getName());
        break;                              // first offender found — stop looking
    }
}
```

Think of `break` as the emergency exit and `continue` as the skip button.

> **`continue` in a `while` is where the infinite loop bites.** `continue` jumps to the *condition check*, skipping everything left in the body — including your `i++` if it sits below the `continue`. In a classic `for` this is harmless, because the step lives in the header and still runs. In a `while` it hangs the program. Put the increment above any `continue`, or use a `for`.

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

## Null checks

> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → read it for the alternatives to a manual guard, above all `Optional` and `Objects.requireNonNull()`.
> 📖 Docs: [Baeldung — Helpful NullPointerExceptions in Java](https://www.baeldung.com/java-14-nullpointerexception) → read it for how Java 14+ (JEP 358) builds the "because ... is null" part of the message.

**Runtime error:** an error that does not happen when Java compiles the code, but when the program is already running and reaches that line. The compiler does not catch it in advance. (For the full explanation of compile time vs runtime, see the `var` section in [01-variables-types.md](01-variables-types.md).)

`NullPointerException` is the most common runtime error in Java. It happens when you call a method on a variable that is `null` — Java cannot find the object to run the method on. Only **objects** have methods: `String`, wrapper classes (`Integer`, `Long`…), and any class you define. **Primitives** (`int`, `long`, `double`…) are not objects and have no methods — they cannot be `null` and you cannot call `.something()` on them. That is why you will never see a `NullPointerException` on an `int` variable. The useful methods for wrappers and `String` are already in [01-variables-types.md](01-variables-types.md) — those are the classes you call methods on. The fix is simple: always check for `null` before calling methods on anything that might not exist.

```java
// ❌ MAL — risk of NullPointerException
String name = employee.getName();
System.out.println(name.toUpperCase());

// ✅ BIEN — guard first
if (name != null) {
    System.out.println(name.toUpperCase());
}
```

**Read the message — since Java 14 it names the culprit.** The exception the bad version throws is:

```
Exception in thread "main" java.lang.NullPointerException:
    Cannot invoke "String.toUpperCase()" because "name" is null
```

Everything after `because` is the part that saves you time. Older Java printed only `NullPointerException` plus a line number, which on a line like `a.getB().getC().getD()` left you guessing which of the three was null. Java 14 added *helpful* NPE messages: at the moment of the crash the JVM re-reads the bytecode of that instruction, works out which value it was about to dereference, and names it. On a chain it will say `because the return value of "Employee.getName()" is null`, pinpointing the exact link. Two details to expect: the variable name only appears if the class was compiled with debug information (IntelliJ does this by default, so you will see real names), and a hidden compiler-generated temporary shows up as `<localN>` — which is exactly what you saw in the `switch (null)` case earlier in this file, where it printed `<local2>`.

**`Optional` — the modern alternative.** Instead of a variable that *might* be null and a check you *might* forget, `Optional<T>` is a small wrapper object that always exists and holds either a value or nothing. The point is that the type itself tells you the value may be absent, so the compiler puts the "what if it's missing?" question in front of you instead of leaving it to your memory.

```java
// Optional in full is covered in 10-generics.md
Optional.ofNullable(name)                            // wrap: empty if name is null
        .ifPresent(n -> System.out.println(n.toUpperCase()));  // run only if there IS a value
```

- **`ofNullable(x)`** — builds the wrapper from a value that may or may not be null: an *empty* Optional if `x` is null, a full one otherwise.
- **`ifPresent(...)`** — runs the given code only when the wrapper holds something, and does nothing at all when it is empty. There is no `else` branch to forget.
- The `n -> ...` is a lambda: "given the value, call it `n` and do this with it" — full treatment in [09-streams-lambdas.md](09-streams-lambdas.md).

> **Why not just use `Optional` everywhere?** It is designed for **return values**, to signal "this lookup may find nothing" — not for fields or parameters, where it only adds a wrapper object and noise. Inside a method, a plain `if (x != null)` guard is still the normal, idiomatic Java. Optional's full API (`orElseThrow`, `map`, `orElse`) is in [10-generics.md](10-generics.md).

In Spring Boot, many methods return `Optional<T>` instead of a raw object that might be null. `repository.findById(id)` is the standard example — it returns `Optional<Employee>`, so you are forced to handle the "not found" case. But plain null guards do not disappear: in your own TimeTrack backend, `JwtFilter` opens with exactly this pattern before it trusts the token —

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/security/JwtFilter.java
String email = jwtUtil.extractUsername(token);
if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    ...
}
```

— and `TimeEntryService.findByFilter()` uses `if (month != null)` to decide whether an optional filter was supplied at all. Both are ordinary `if` statements: the guard is not a beginner's tool you grow out of, it is what production code looks like.

> **Preview — Spring Boot:** `JwtFilter`, `SecurityContextHolder` and repositories belong to Spring Boot, not to the Java language. They appear here only to show where these Java structures land in a real project — you will study them properly in the Spring Boot notes.

> **`&&` short-circuits, and that is what makes the guard work.** `email != null && ...` evaluates the left side first and, if it is false, never evaluates the right side at all. That is why `if (name != null && !name.isEmpty())` is safe: when `name` is null, `!name.isEmpty()` is never reached. Swap the order and it throws. `||` short-circuits the mirror way — it stops as soon as one side is true.

---

So far every loop and condition has lived inside one block of code. But real programs are not one long block — they are split into reusable, named pieces you can call by name, each taking inputs and handing back a result. Those pieces are **methods**, and the `if`, `for`, and `switch` you just learned are the building blocks that go inside them. Notice how often this file already needed one: `isApproved(emp, day)`, `loadPage(page)`, and the "extract the nested loops and `return`" tip all assume you can name a piece of logic and call it. That is where [03-methods.md](03-methods.md) picks up.
