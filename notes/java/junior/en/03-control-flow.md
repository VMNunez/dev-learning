## Index of this note

- [Control Flow](#control-flow)
- [1. if / else](#if--else)
  - [Impossible values go at the top of the chain](#impossible-values-go-at-the-top-of-the-chain)
  - [Ternary operator](#ternary-operator)
- [2. switch](#switch)
  - [What `switch` accepts — the exact scope](#what-switch-accepts--the-exact-scope)
  - [Classic switch (statement)](#classic-switch-statement)
  - [Switch expression (Java 14+) — use this form](#switch-expression-java-14--use-this-form)
- [3. for loops](#for-loops)
  - [Classic for](#classic-for)
  - [Enhanced for (for-each) — use this for collections and arrays](#enhanced-for-for-each--use-this-for-collections-and-arrays)
- [4. while and do-while](#while-and-do-while)
  - [Choosing between the four loop forms](#choosing-between-the-four-loop-forms)
- [5. break, continue, and return](#break-continue-and-return)
  - [`break` and `continue` with a label: leaving a loop that sits inside another](#break-and-continue-with-a-label-leaving-a-loop-that-sits-inside-another)

# Control Flow

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → read: "If/Else/Else If", "Switch" and "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

In [01-variables-types.md](01-variables-types.md) you learned to store a value in a variable and to compute new values with expressions. An **expression** is a piece of code Java runs to get a value: if `hours` is `10`, the expression `hours * 2` gives `20`, and the expression `hours > 8` gives `true`. That second kind, an expression that gives a `boolean`, is the one this chapter uses to make decisions. In [02-strings.md](02-strings.md) you worked with text: you turned an employee's data —their name, their role and their hours worked in a week— into a readable line of text, and you recovered that same data from a line of a CSV: you started from a piece of text and turned it into data you can work with, such as the hours converted into a number you can calculate with. A `for` loop appeared there, in the `StringBuilder` section, but only to explain why joining text with `+` many times in a row is costly; how the loop works is explained in this chapter.

This chapter continues with the same employee example to explain conditions and loops. The difference is in how the hours are counted. In [02-strings.md](02-strings.md) each employee had a single number: the total hours worked in a week. Here the hours are split by day, in a **timesheet**: the list where each employee logs how many hours they worked on each day of the week. Each timesheet entry holds three pieces of data: who worked (an employee), which day they worked (for example, `"SATURDAY"`) and how many hours (for example, `10`). With that record, the company knows who has worked overtime and who has been absent. Suppose an entry says an employee worked 10 hours on a Saturday. Storing `10` and `"SATURDAY"` is not enough: the program has to decide three things. First, whether to print `Overtime`, because 10 hours go past a normal 8-hour day. Next, whether that day is a weekday or falls on the weekend, like this Saturday. Finally, when it is done with this entry and moves on to check the next employee's. **Control flow** decides which statements run, in what order, and how many times.

First you will see `if / else`, which runs one block of code or another depending on whether a condition holds: for example, it prints `Overtime` only when `hours > 8` is `true`. Alongside it you will see the ternary operator, a short version of `if / else` meant for choosing a **value**, not a block of code: it checks the condition and returns the value before the colon if it holds, or the one after it if it does not. So `String label = hours > 8 ? "Overtime" : "Normal";` stores `"Overtime"` in `label` when `hours > 8` is `true`, and `"Normal"` when it is `false`. Next you will see `switch`, which compares the value of a variable with a list of possible values and runs the code of the case that matches: for example, depending on the value of `day`, it classifies the day as a weekday or a weekend day. It can be written in two ways. In the classic form, if you forget to write `break` at the end of a case, Java does not stop there: it keeps running the code of every case that comes after it, until it finds a `break` or reaches the end of the `switch`. That extra execution leads to bugs: for example, for a Saturday the `switch` prints `Weekend shift`, which is correct, and because the `break` is missing it carries on into the next case and also prints `Unknown day`, which is wrong. The second way to write a `switch` is the modern form, the `switch` expression. In it, Java runs only the case that matches, never moving on to the next ones, and the result of that case is stored directly in a variable: with `String shift = switch (day) { … };`, if `day` is `"SATURDAY"`, `shift` becomes `"Weekend"`. Up to this point, each decision is made on a single entry of the timesheet. But the timesheet has many entries: one per employee and day. So that you do not write the same `if` once for every entry, you will see **loops**, which repeat a block of code as many times as needed: for example, once for each employee in the list. Java has four kinds of loop —the classic `for`, the _for-each_, `while` and `do-while`— and each one decides in a different way when to exit the loop: the classic `for` exits when its condition stops holding, usually when a counter reaches a limit; the _for-each_, when there are no elements left in the list; `while` checks its condition before each repetition and exits when it is `false`; and `do-while` does the same but checks it afterwards, so it always runs at least once. Sometimes you do not need to wait for the loop to end by its normal rule: for example, if you are looking for the first employee with overtime, once you find them there is no point checking the rest. For those cases, at the end of the chapter you will see `break`, `continue` and `return`, three statements that cut the loop short, each in a different way: `continue` skips the rest of the current repetition and moves on to the next one, `break` leaves the loop, and `return` leaves the whole method.

For now, `hours` is an `int` such as `10`, and `day` is a `String` such as `"SATURDAY"`. You met values and text in [01-variables-types.md](01-variables-types.md) and [02-strings.md](02-strings.md). Later examples also name `Employee` and `List<Employee>`. An `Employee` is an object that represents one worker and stores three pieces of data, called its **fields**: `name` (the worker's name), `hours` (the total hours they worked in the week) and `active` (whether they are still active in the company: `true` or `false`). A `List<Employee>` is an ordered sequence of workers. Read `emp.getName()` and `emp.getHours()` as requests for that worker's name and hours; `emp.isActive()` asks whether the worker is still active, and `emp.setHours(0)` changes the hours stored on that worker. These calls let you trace a branch or loop before you learn to write methods in the next chapter, [04-methods.md](04-methods.md). Entry [06-oop-classes.md](06-oop-classes.md) will show how to build the `Employee` class. Entry [09-generics.md](09-generics.md) will explain the `<Employee>` notation, and [10-collections.md](10-collections.md) will compare the different kinds of collection.

---

## if / else

> 📖 Docs: [Baeldung — If-Else Statement in Java](https://www.baeldung.com/java-if-else) → read: "Syntax of If-Else" and "Example of If-Else If-Else" — the boolean condition and the chain form.

Each timesheet entry needs a label based on its hours: if there are more than 8, the program must print `Overtime`; if there are between 1 and 8, `Worked`, an ordinary working day; and if there are 0, `Absent`.

What you need is for the program to know which label to show depending on the value of `hours`. That is what `if / else if` does: Java evaluates its conditions from top to bottom, runs the first block whose condition is true, and skips the rest. If none matches, an `else` block runs when you provided one.

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

> **The condition must be a real `boolean`.** [01-variables-types.md](01-variables-types.md) explained Java's lack of truthy and falsy values: `if (hours)` fails with `incompatible types: int cannot be converted to boolean`, while `if (hours > 0)` tests an actual `boolean`. The same rule applies to `while`, `do-while` and ternaries: the condition before the `?` must also be a `boolean`. This also affects a JavaScript habit: checking whether a variable has no value by writing only its name inside the `if`. In JavaScript, `if (name) { … }` enters the block only when `name` has a value, and skips it when `name` is `null`, `undefined` or an empty string. In Java, a variable of an object type, such as `String`, holds `null` when it stores the address of no object, as [01-variables-types.md](01-variables-types.md) explained in _Reference variables and `null`_. But `null` is not a `boolean`, so you have to write the comparison yourself:
>
> ```java
> if (name) { ... }          // ❌ MAL — does not compile: incompatible types: String cannot be converted to boolean
> if (name != null) { ... }  // ✅ BIEN — name != null gives true or false
> ```
>
> When this check is needed is covered in [04-methods.md](04-methods.md).

### Impossible values go at the top of the chain

The callout **Why "the first true block wins" matters**, just above, put the two ordinary cases in the right order: overtime before worked. The same rule also decides where a value that should never happen goes. An **exceptional case** is an input the chain's normal branches were not written for. In a timesheet, that means hours below zero, or more than the 24 a day has. A value like that usually arrives through a typing mistake in a form or a bug in whatever produced it.

Here is the chain from the start of the `if / else` section again, unchanged, tested with one of those impossible values: `hours` is `-3`. It will print `Absent`, because `-3` is neither greater than 8 nor greater than 0: neither of the first two conditions holds, so Java runs the `else`:

```java
// ❌ MAL — the broad branches swallow the impossible values
int hours = -3;   // impossible: fewer than 0 hours

if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
// hours = -3  prints: Absent
```

If `hours`, instead of being `-3`, becomes `30`, the first test is `30 > 8`. It is `true`, so Java runs the first block, prints `Overtime` and skips every branch below it. Neither the `-3` example nor the `30` one produces an error: the program keeps going and treats a mistake as a real absence (`-3`) or a real overtime day (`30`). That is the hidden bug. The condition `hours > 8` was written with overtime days in mind, but it holds for any number greater than 8: `30`, `100` or `1000` too. The `else` was written for days of absence, with 0 hours, but it catches everything that did not enter the branches above it: `-3` or `-100` too. Neither branch checks that the hours are a valid value, that is, a number between 0 and 24, because a real day cannot have fewer than 0 hours or more than 24.

The solution to this problem is to check the invalid values **first**, in their own branch at the start of the chain, before a broader branch accepts them:

```java
// ✅ BIEN — the impossible values are caught before any normal branch
if (hours < 0 || hours > 24) {
    System.out.println("Invalid entry");
} else if (hours > 8) {
    System.out.println("Overtime");
} else if (hours > 0) {
    System.out.println("Worked");
} else {
    System.out.println("Absent");
}
// hours = -3  prints: Invalid entry
// hours = 30  prints: Invalid entry
// hours = 10  prints: Overtime
// hours = 0   prints: Absent
```

`hours < 0 || hours > 24` is `true` for both invalid values: both when `hours` is less than 0 and when it is greater than 24. So they stop at the first branch. A real value makes that test `false` and moves on to the same three branches as before, which now only ever see hours between 0 and 24. So the whole ordering rule for an `if / else if` chain is: **impossible values first, then the narrowest real case, widening as you go down, and the `else` last for whatever is left.**

### Ternary operator

> 📖 Docs: [Baeldung — Ternary Operator in Java](https://www.baeldung.com/java-ternary-operator) → read: the syntax section and the nesting one — including why nesting two ternaries is usually a mistake.

The previous examples print a label. The ternary operator is used in a different case: when you have to choose between two values and you want to **store** the chosen one in a variable to use later. For example, storing in `label` either the label `"Overtime"` or the label `"Normal"`, depending on the hours. The ternary makes the choice and leaves the chosen value directly on the right of `=`. Its syntax matches JavaScript:

```java
String label = hours > 8 ? "Overtime" : "Normal";
// condition ? valueIfTrue : valueIfFalse
```

Use it only when both values are short and the condition is easy to read. If the line becomes hard to scan, use a regular `if/else`.

> **Why a ternary and not an `if/else` here?** Because `if` is a **statement** and the ternary is an **expression**. A statement *does* something: you use it to run blocks of code, like the `if/else`, which runs one block or another. An expression *produces a value*: you use it, for example, to assign that value to a variable. The ternary is an expression that assigns a value conditionally: it picks one of two values depending on the condition. Only an expression can sit on the right of the assignment operator `=`, which is why `String label = if (...)` is not valid Java: it produces the compile error `illegal start of expression`. This statement-versus-expression split is the exact same distinction that separates the two forms of `switch` below.

The following fragment does exactly the same as the ternary above, but written with `if/else`. That way you can compare how much code the ternary saves you:

```java
String label;                 // declared, not assigned yet
if (hours > 8) {
    label = "Overtime";
} else {
    label = "Normal";
}
```

The `if/else` does not produce a value you can assign directly. That is why you declare `label` before the `if/else` block and assign it in each branch. If you remove the `else` from the block above, when `hours` is not greater than 8 no assignment runs and `label` is left without a value. The compiler catches it before the program ever runs: the first line that uses `label` after the `if` does not compile and gives the error `variable label might not have been initialized`. That is the rule from [01-variables-types.md](01-variables-types.md) that forbids reading a local variable before every path has assigned it. The ternary has no such gap, because it has no optional half: `hours > 8 ? "Overtime"` on its own does not compile (`error: : expected`). An expression always produces a value, so both values must be written, and `label` is declared and assigned in the same line.

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

```java
long x = 3L;
switch (x) {                      // ❌
    case 3 -> System.out.println("three");
}
// error: primitive patterns are a preview feature and are disabled by default.
// error: constant label of type int is not compatible with switch selector type long
```

On Java 25 the compiler shows **two** errors. The first says that using a `long` as the selector would only work with a new Java feature that, in version 25, is still being tested (what Java calls a _preview_) and is switched off. In practice it means a `long` does not work as a selector. The second says that `case 3` is an `int` constant and is not compatible with a `long` selector. You do not need to know more about that new feature: both errors go away with the same fix, which is to use a selector of a type marked ✅ in the selector-type table just before this example, such as `int`.

The last row of the table refers to the objects that do not appear in the rows above it. The objects that can be selectors with ordinary constants are these: `String`, `Byte`, `Short`, `Character`, `Integer` and any `enum`. If the selector is any other object, you cannot write a fixed value after `case`, such as `case 5` or `case "MONDAY"`: the compiler rejects it, even when the value looks like it fits. That includes `Long`, the wrapper of `long`:

```java
Long id = 5L;
switch (id) {                     // ❌
    case 5 -> System.out.println("five");
}
// error: incompatible types: int cannot be converted to Long
```

With those objects, `switch` only works if you write a different kind of `case`, called a **type pattern**. For example, `case Employee e ->` means "if the selector is an `Employee`, enter this case and call it `e`". You do not need to write it yet, because every `case` in this chapter uses constants. How to check an object's type inside an `if`, with `instanceof`, is taught in [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md).

> **A `boolean` cannot be the selector of a `switch`.** To choose between `true` and `false`, use `if/else`.

> **With an `enum` selector, use the `switch` expression: the compiler tells you when a case is missing.** An `enum` is a type with a fixed list of named values; [14-enums.md](14-enums.md) will teach it. For example, `enum Shift { MORNING, AFTERNOON, NIGHT }` defines a `Shift` type with only three possible values. A `switch` can be written in two forms, and the next two sections teach them in detail.
>
> The first way to write it is the **classic `switch`** (_switch statement_), written with `case X:`. It is a **statement**, just like `if/else`: the whole block, from `switch` to its last brace, runs code but produces no value you can store in a variable. Having other statements inside it, like the `println` calls in each case, does not change that: the whole `switch` counts as a single statement. If you forget a value of the `enum` in a classic `switch`, the compiler does not warn you: the code compiles, and when that value arrives no case runs.
>
> ```java
> Shift shift = Shift.NIGHT;
>
> // compiles: NIGHT is missing, but a statement does not have to produce a value
> switch (shift) {
>     case MORNING:
>         System.out.println("Starts at 06:00");
>         break;
>     case AFTERNOON:
>         System.out.println("Starts at 14:00");
>         break;
> }
> // with shift = NIGHT it prints nothing
> ```
>
> The second way to write a `switch` is the **`switch` expression**, written with `->`. This one does produce a value, which you store in a variable, so the compiler requires a case for every possible value of the `enum`. Since it knows the three values of `Shift`, if `NIGHT` is missing it does not compile:
>
> ```java
> Shift shift = Shift.NIGHT;
>
> // ❌ switch expression: NIGHT is missing
> String start = switch (shift) {
>     case MORNING -> "06:00";
>     case AFTERNOON -> "14:00";
> };
> // error: the switch expression does not cover all possible input values
> ```
>
> That is why, when the selector is an `enum`, the `switch` expression is the better choice. If you forget a value, or someone later adds a new one to the `enum`, the code does not compile until you add the missing case. With a `String` the compiler cannot make this check, because a `String` accepts any text.

### Classic switch (statement)

The classic form starts executing at the case whose label matches the value of the selector. If that case has instructions and does not end with `break`, Java carries on with the instructions of the next case, **even if its label does not match**. This behaviour is called **fall-through**: execution falls from one case to the next without a new comparison.

The mechanism is worth stating plainly, because it explains everything else here: a `case` label is not the start of a separate block, it is only a **jump target**. Java jumps to the matching label and then keeps executing straight down through whatever follows it, labels included, until something stops it. `break` is that something.

Here is the bug that mechanism produces:

```java
// ❌ MAL — no break: a Saturday prints TWO lines
String day = "SATURDAY";

switch (day) {
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend shift");
    default:
        System.out.println("Unknown day");
}
// prints:
// Weekend shift
// Unknown day
```

And this is the path execution takes through that code when `day` is `"SATURDAY"`:

```
switch (day) matches "SATURDAY"
       │
       ▼
  case "SATURDAY":  ◀── execution lands here
  case "SUNDAY":        only a label, nothing to run → keeps falling
      println("Weekend shift");     ← runs
                          │ no break → keeps falling
                          ▼
  default:
      println("Unknown day");       ← runs too!
```

The fix consists of putting a `break` at the end of each group of cases:

```java
// ✅ BIEN — break stops the fall
String day = "SATURDAY";

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
// prints:
// Weekend shift
```

**Several `case` labels can share the same code.** If you write several labels in a row with no instructions between them, they all lead to the same block. That is what the fixed example does: there are no instructions between `case "MONDAY":` and `case "FRIDAY":`, so all five days reach the same `println` and share a single `break`. This grouping is an intentional fall-through, and it is the only correct use of that behaviour. The bug appears when a branch that does have instructions carries on into the next one because its `break` was forgotten. In the next section, which explains the `switch` expression, the way to group several `case` labels is to write them on one line, with the labels separated by commas: `case "SATURDAY", "SUNDAY" ->`.

> **After `case X:` you can write as many statements as you like, without braces.** They run in order until a `break` or the end of the `switch`. Indentation means nothing to Java: it is only there for you to read the code, just like everywhere else in the language. You can also open a block with braces after the colon, and you need one when two cases declare a variable with the same name. Without braces, all the statements of the cases live in the same block, the `switch` block, so the second declaration clashes with the first:
>
> ```java
> String day = "SATURDAY";
>
> // ❌ MAL — without braces, both hours variables are in the same block
> switch (day) {
>     case "MONDAY":
>         int hours = 8;
>         System.out.println(hours);
>         break;
>     case "SATURDAY":
>         int hours = 4;
>         System.out.println(hours);
>         break;
> }
> // error: variable hours is already defined in method main(String[])
>
> // ✅ BIEN — each case has its own block
> switch (day) {
>     case "MONDAY": {
>         int hours = 8;
>         System.out.println(hours);
>         break;
>     }
>     case "SATURDAY": {
>         int hours = 4;
>         System.out.println(hours);
>         break;
>     }
> }
> // prints:
> // 4
> ```

The `default` block is not required, but include it: it is your safety net for a value nobody anticipated (a typo, a new day name added later), and without it an unmatched value simply does nothing at all — silently.

> **A `null` selector does not go to `default`.** This `switch (day)` has no `case null`, so a missing day throws `NullPointerException` before any ordinary case runs. This is a preview of [04-methods.md](04-methods.md), which explains where a method should reject missing input.

### Switch expression (Java 14+) — use this form

The classic switch is a **statement**: it runs code and returns nothing. The switch **expression** produces a value, so you can assign it straight to a variable.

It also removes fall-through: each arm uses `->` and runs exactly one thing, so no `break` exists and none is needed.

The way to write it is to declare a variable and assign the whole `switch` to it, just as you would assign any other value:

1. `String shift =` declares the variable that receives the result.
2. `switch (day) { ... }` picks a branch based on the value of `day`.
3. Each branch is written `case label -> value;`. The label goes to the left of the arrow, or several labels separated by commas. The value that `shift` receives if that branch matches goes to the right.
4. The `switch` ends with `};`: the brace closes the `switch` and the semicolon closes the assignment, just like in `String name = "Ana";`.

```java
String day = "SATURDAY";

String shift = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
// shift is "Weekend"
```

**Exhaustiveness is enforced, and it is an error, not a warning.** A switch expression has to produce a value on *every* possible input — there is no such thing as "no branch matched, so the variable stays unassigned". So the compiler checks the arms cover everything and refuses to build otherwise:

```java
// ❌ MAL — no default, and these cases do not cover every String
String shift = switch (day) {
    case "MONDAY" -> "Weekday";
};
// error: the switch expression does not cover all possible input values
```

That is *why* `default` is effectively mandatory — with one exception at this level: when the selector is an `enum` and your arms name every constant, the compiler already knows the set is complete and lets you omit `default` entirely. (A classic switch **statement** does not have this problem, because a statement produces nothing, so "nothing matched" is a legal outcome.)

> **Exhaustive does not mean null-safe.** The compiler's coverage check accounts for the ordinary values of the selector type. As with the classic `switch` above, a `null` `day` still throws `NullPointerException` unless you write a `case null`; `default` alone does not handle it. Entry [04-methods.md](04-methods.md) will show where to reject a missing argument before it reaches this expression.

**`yield` — when an arm needs more than one line.** An arrow arm normally ends in a single expression, which becomes the value. If you need several statements, wrap them in `{ }`. Inside that block, Java does not know which value the branch should return, so you have to say it yourself with the keyword `yield`:

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
>
> The difference shows in the line that comes after the `switch`. With `yield`, that line runs. With `return`, the method ends and that line never runs:
>
> ```java
> void printLimit(String day) {
>     int dailyLimit = switch (day) {
>         case "SATURDAY", "SUNDAY" -> 0;
>         default -> {
>             int base = 8;
>             yield base;                        // leaves only the branch: dailyLimit is 8
>         }
>     };
>     System.out.println("Limit: " + dailyLimit);   // runs
> }
>
> void printShift(String day) {
>     switch (day) {
>         case "SATURDAY":
>             System.out.println("Weekend");
>             return;                            // leaves the whole printShift method
>         default:
>             System.out.println("Weekday");
>     }
>     System.out.println("Shift checked");       // with "SATURDAY" it does not run: return already left printShift
> }
>
> // printLimit("MONDAY") prints:
> // Limit: 8
>
> // printShift("SATURDAY") prints:
> // Weekend
> ```

When you need to **produce a value** from several cases, or when the selector is an `enum`, choose the `switch` expression. When you only need to perform an action, a `switch` statement also fits; the two forms answer different needs.

---

## for loops

> 📖 Docs: [Baeldung — Java For Loop](https://www.baeldung.com/java-for-loop) → read the basic three-part `for` first, then the enhanced (for-each) form at the end.
> 📖 Docs: [Baeldung — A Guide to Java Loops](https://www.baeldung.com/java-loops) → read it for the three loop types side by side, when each one fits.

Imagine you have the names of the days of the week stored in a single variable, `week`, and you want to print each of them on its own line. That variable is an **array**, a fixed-size list of values. Without a loop you would have to write one `System.out.println` per day, seven nearly identical lines, and a hundred if the array had a hundred elements. `for` repeats the same instruction for each element you want to walk through. In this section you will see two ways to write a `for`: the classic `for` and the enhanced `for` (also called _for-each_). Both can walk an array, and the _for-each_ can also walk a `List`, a list that can change size. Before the code, you need to know how an array's positions and length are read.

> **Introduction to arrays: the minimum you need to know to walk one with a loop.** An array stores several values of the same type in a fixed number of positions, and each position is reached by a number. You can create it in two ways:
>
> ```java
> String[] week = {"MONDAY", "TUESDAY", "WEDNESDAY"};   // 1. with its values
> int[] weekHours = {8, 8, 6};                           // 1. with its values
>
> String[] names = new String[3];                        // 2. with only its size: null, null, null
> int[] totals = new int[3];                             // 2. with only its size: 0, 0, 0
> ```
>
> The brackets in `String[]` and `int[]` say that the variable is an array of `String` or of `int`. The first form writes its values between braces, separated by commas. The second states only how many positions it has, with `new` and the size between brackets, so you can fill them later. With `new String[3]`, an array of `String`, its three positions start out holding `null`. With `new int[3]`, an array of `int`, they would start at `0`, because an `int` cannot be `null`. This is what you saw in [01-variables-types.md](01-variables-types.md), in the section _Reference variables and `null`_: a primitive variable, such as an `int`, holds the value directly, while a variable of an object, such as a `String`, holds a reference to the memory address where that object lives. `null` means that reference does not point to any object yet.
>
> Once the array is created, you need two things to walk it with a loop: read a specific element, by writing its position between brackets after the array's name, and know how many positions it has, with `.length`:
>
> ```java
> System.out.println(week[0]);       // MONDAY
> System.out.println(week.length);   // 3
> ```
>
> You reach an element by its **index**, between brackets: `week[0]`. The first index is **zero**, so an array of three elements has indexes 0, 1 and 2, never 3. `week.length` tells you how many positions it has; it is a **field**, with no parentheses, unlike the methods `String.length()` and `List.size()`. That an array has a fixed size means that, once it is created, you cannot add or remove elements: it has no methods like `add()` or `remove()`. What you can do is change the value of a position that already exists, for example `week[0] = "SUNDAY";`.

> **Why this is enough for now.** The interesting question is _when to use a fixed-size array and when a `List` that can change size_. To answer it you need to know collections. [10-collections.md](10-collections.md) makes the comparison and teaches `List`, including the `List<Employee>` mentioned earlier. Here the array serves as a simple example to walk with a loop.

### Classic for

If the report must print each day's **position** beside its name, you need a number that moves from the first slot to the last. The classic `for` gives you that counter. Its header has three parts separated by semicolons, `(init; condition; step)`, and you control when the counter starts, stops, and moves.

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

- `int i = 0` — start at index 0, that is, at the first element of the array
- `i < week.length` — keep going while this is true, that is, up to the last element of the array, the one at index `week.length - 1`
- `i++` — increment i by 1 after each iteration

The `for` runs the three parts of its header in this order:

1. `int i = 0` sets the starting position. It runs only once, when the loop is entered.
2. It checks the condition `i < week.length`. If it is false, the loop ends.
3. If the condition `i < week.length` is true, it runs the body of the `for`.
4. When the body finishes, it runs the step, `i++`, and goes back to step 2. Steps 2, 3 and 4 keep repeating until the condition is false.

This is how the loop above runs with a three-element `week`, fragment by fragment:

```
int i = 0;                                  // step 1: i is 0 (only this once)

i < week.length  →  0 < 3  →  true         // step 2
System.out.println(i + ": " + week[i]);     // step 3: prints "0: MONDAY"
i++;                                        // step 4: i is 1

i < week.length  →  1 < 3  →  true         // step 2
System.out.println(i + ": " + week[i]);     // step 3: prints "1: TUESDAY"
i++;                                        // step 4: i is 2

i < week.length  →  2 < 3  →  true         // step 2
System.out.println(i + ": " + week[i]);     // step 3: prints "2: WEDNESDAY"
i++;                                        // step 4: i is 3

i < week.length  →  3 < 3  →  false        // step 2: the loop ends
```

That is why the first time the body runs `i` is `0`, not `1`: the step `i++` only runs after the body.

> **`i` only exists inside the loop.** Because `int i` is declared in the `for` header, its scope ends when the loop closes. Trying to read it afterwards fails at compile time with `cannot find symbol / symbol: variable i`. You will almost never need the value of `i` after the loop. If you ever do, declare `i` before the `for`: `int i = 0; for (; i < week.length; i++) { ... }`. It is an unusual form: when it happens, it is usually a sign that a `while` loop, covered further down in this chapter, fits better. [01-variables-types.md](01-variables-types.md) explains the same scope rule for other local variables.

**The off-by-one error, and the exception it produces.** The three-part header is powerful precisely because you write the bounds yourself, which means you can also write them wrong. The classic slip is writing `<=` where you meant `<`. With `<=`, the loop runs one extra pass and tries to access a position that does not exist:

```java
int[] weekHours = {8, 8, 6};   // length 3, valid indexes 0, 1, 2

// ❌ MAL
for (int i = 0; i <= weekHours.length; i++) {   // i reaches 3
    System.out.println(weekHours[i]);           // with i = 3 it fails: weekHours[3] does not exist
}
// prints 8, 8, 6 and then crashes:
// Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3

// ✅ BIEN
for (int i = 0; i < weekHours.length; i++) {
    System.out.println(weekHours[i]);
}
```

The error message tells you exactly what happened: `Index 3` is the value of `i`, `length 3` is the length of the array, and the last valid position has index 2. This is an **off-by-one error**: the limit has been passed by one position. It happens at runtime, after the program has printed three correct lines; [00-intro-java.md](00-intro-java.md) distinguished these failures from the ones the compiler detects.

> **Indexes start at zero, so the last one is `length - 1`.** In Java's array model, the index is a position number starting at zero: the first slot is `week[0]`, and each next slot increases the index by one. For an array of `length` slots, the last position is `length - 1`.

### Enhanced for (for-each) — use this for collections and arrays

> 📖 Docs: [Baeldung — The for-each Loop in Java](https://www.baeldung.com/java-for-each-loop) → read: "Working" and "Pros and Cons" — the drawbacks listed there are the limits explained below.
> 📖 Docs: [JLS §14.14.2 — The enhanced for statement](https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.14.2) → read: the two expansions, one for an `Iterable` and one for an array — the source of the rewrite diagram below.

With the classic `for` you are forced to write the index yourself: its starting value (`int i = 0`), the condition that stops it (`i < week.length`) and the step that moves it forward (`i++`). If you only want to walk through each element, that index is unnecessary and can cause the off-by-one error you just saw. The _for-each_ gives you each element directly, one after another, without you having to write an index or work out where the array ends. It is equivalent to JavaScript's `for...of`.

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

`getEmployees()` is a placeholder for a method that supplies the employee list; [04-methods.md](04-methods.md) will show how a call supplies a value. The first loop prints the three day names in array order. The second prints one name for each employee in list order.

**The compiler turns the _for-each_ into another loop, and that explains its limits.** The _for-each_ is shorthand: before translating it into bytecode, `javac` (the Java compiler, the program that translates your source code into bytecode, as you saw in [00-intro-java.md](00-intro-java.md)) rewrites the _for-each_ as another loop. The loop it writes in its place depends on what the _for-each_ walks through. If it walks through an array, it turns it into a classic `for` with an index, like the one in the previous section. If it walks through a `List`, it turns it into a loop that uses an **iterator**.

An **iterator** is an object that walks through a collection from start to end, one element at a time, and remembers where it is. It has two methods: `hasNext()` returns `true` if there are still elements left, and `next()` gives you the next element and moves forward one position. It works like a bookmark: it always marks where you are, and each `next()` turns to the next page. A list gives you its iterator when you call its `iterator()` method; in the diagram below that is `employees.iterator()`. With it, the loop asks `hasNext()` before each iteration, and while the answer is `true`, `next()` gives it the next employee. When none are left, `hasNext()` returns `false` and the loop ends. That loop is a `while`, which repeats its body while its condition is true and is explained further down this chapter.

Java calls **`Iterable`** ("something that can be walked through") any type that has that `iterator()` method, that is, any type able to give you an iterator. `List` is `Iterable`, and so is `Set` (a set: a collection that allows no duplicate elements and guarantees no order), because in Java every collection is `Iterable`. An array is not, which is why the compiler translates it into a classic `for` that uses an index. `Iterable` is an **interface**, a list of methods a type promises to have; interfaces are explained in [07-interfaces-abstract.md](07-interfaces-abstract.md). For this chapter, all you need is that the _for-each_ walks through an array or any type that is `Iterable`.

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

Three consequences follow directly from those two rewrites:

**1. You cannot get the index from the loop variable.** The array translation has a hidden counter, but the _for-each_ does not expose it to your body. The iterator translation hands over the next element with no index at all. If you need the position, use a classic `for` over an array or a `List` that supports indexed access. [10-collections.md](10-collections.md) explains which collections have positions.

**2. This loop is for walking through elements, not for changing the collection's structure.** The `List` version asks its iterator for the next element on each iteration. If you remove an employee directly from some lists while that iterator is in use, a later iteration can fail. The exact failure and the safe ways to remove elements are explained in [10-collections.md](10-collections.md). For now, choose this loop when you only need to walk through an array or a collection, without adding or removing elements.

**3. Reassigning the loop variable does not change the array.** If you give the _for-each_ variable a new value, the array does not change. The reason is that this variable, `day` in the example below, is a variable separate from the array: on each iteration, Java copies into `day` what is in one position of the array. It is the same as copying one variable into another:

```java
int a = 5;
int b = a;   // b receives a copy of what is in a
b = 10;      // b changes; a is still 5
```

If you then change `day`, you change the copy, and the array position still holds what it had. With a classic `for` you can change it, because you assign the new value directly to a position of the array, with `week[i] = ...`. For example, this loop tries to turn the days in `week` into lowercase and fails:

```java
// ❌ MAL — week is unchanged afterwards
for (String day : week) {
    day = day.toLowerCase();
}
```

The ❌ loop fails because of the translation you saw above. `javac` rewrites it as the classic `for` below, in which `day` is a local variable separate from `week[i]`: `day` holds a copy of the reference stored in `week[i]`. There is a reference in `week[i]` because `week` is an array of `String`, and `String` is an object: each position of an array of objects stores a reference that points to the object, not the object itself. In an array of `int`, each position would store the number directly. It is the same thing you saw when creating arrays, with `null` in a new `String[]` and `0` in an `int[]`. So when you change `day`, which is a local variable, you are not changing the array, as you saw with `a` and `b` in the code above.

```java
for (int i = 0; i < week.length; i++) {
    String day = week[i];        // day receives a copy of the reference stored in week[i]
    day = day.toLowerCase();     // day now points to another String; week[i] does not change
}
```

This is what happens in the first iteration, with `week[0]` pointing to `"MONDAY"`:

1. `String day = week[0]` copies into `day` the reference stored in `week[0]`. Both variables now hold the same reference, which points to the same `"MONDAY"`.
2. `day.toLowerCase()` does not modify `"MONDAY"`, because a `String` cannot be changed once created. It creates a new `String`, `"monday"`, and returns a new reference, which points to that new object. [02-strings.md](02-strings.md) explains why in its _Immutability_ section.
3. `day = ...` stores in `day` the reference to `"monday"`. Only `day` changes; `week[0]` still points to `"MONDAY"`.
4. When the iteration ends, `day` stops existing, and `"monday"` is lost with it.

The same happens with `week[1]` and `week[2]`, so when the loop ends `week` is still `{"MONDAY", "TUESDAY", "WEDNESDAY"}`.

This other loop does succeed, because it stores the result in the array position itself, with `week[i] = ...`, and not in a copy:

```java
// ✅ BIEN — write back through the index
for (int i = 0; i < week.length; i++) {
    week[i] = week[i].toLowerCase();
}
```

> **This is the value-versus-reference idea from [01-variables-types.md](01-variables-types.md), in loop form.** What gets copied is the *reference*, not the object. So reassigning `day` is invisible to the array — but calling a mutating method on the object it points at (`emp.setHours(0)`) **is** visible, because both the loop variable and the list element point at the same `Employee`. Reassign = no effect; mutate = effect.

Use the _for-each_ whenever you just need the items and do not need the index. In Spring Boot, this is what you will write most of the time — though streams (covered in [13-streams-collectors.md](13-streams-collectors.md)) are even more concise for transforming collections.

---

## while and do-while

> 📖 Docs: [Baeldung — Java While Loop](https://www.baeldung.com/java-while-loop) → read it for the syntax and the "check before the body" order.
> 📖 Docs: [Baeldung — Java Do-While Loop](https://www.baeldung.com/java-do-while-loop) → read it for the contrast with `while`: body first, condition second, always at least one run.

Use `while` or `do-while` when the exit condition depends on what happens in each iteration and you do not know how many iterations you will need. For example: asking for a day's hours until the user types a valid number, between 0 and 24, without knowing how many times they will get it wrong; downloading the employees page by page until an empty page arrives, which is the `do-while` example further down; or calling a service that does not respond again until it responds. In those cases, a `for` with a counter does not express well when the work should end.

**`while`** checks the condition before running the body. If the condition is false from the start, the body does not run even once, so a `while` can run 0 times.

**`do-while`** runs the body first and then checks the condition, so the body runs at least once. It is useful when you have to do something before you know whether to continue. For example, to know whether a page of employees is empty, you first have to download it: the download goes in the body and the check goes in the condition.

```java
// while — check first, may never run
int i = 0;
while (i < week.length) {
    System.out.println(week[i]);
    i++;                              // ← the step is YOUR responsibility here
}

// do-while — run at least once, then check
int page = 0;
List<Employee> batch;                 // declared OUTSIDE the loop — see below
do {
    batch = loadPage(page);           // must fetch before you can test
    if (!batch.isEmpty()) {
        process(batch);               // only handle pages with employees
    }
    page++;
} while (!batch.isEmpty());           // ← note the semicolon
```

In the `do-while`, `loadPage(page)` stands for fetching one page of employees and `process(batch)` stands for handling that page; these are placeholder methods, not calls already defined in this chapter. On the first pass the code fetches page 0, processes it only if it contains employees, increments `page` to 1, and then tests whether the fetched page was empty. When an empty page arrives, no employees are processed and the loop stops after that pass. `batch` is declared before `do`, not inside the body, because of the scope rule from [01-variables-types.md](01-variables-types.md): a variable declared inside the `{ }` is no longer available after the closing brace, because that is where its scope ends, and the `while (...)` test sits after that brace. Declare `batch` inside the body and the test fails with `cannot find symbol`.

> **A `while` with no progress becomes an infinite loop.** In a classic `for`, the increment is in the header; in a `while`, you have to write it inside the body. If you forget it or a `continue` skips it, `i` does not change and the condition stays true forever, so the loop never ends. The example prints `MONDAY` over and over until you stop the program. There is no compile error and no exception.
> ```java
> // ❌ MAL — i is never incremented; this never ends
> int i = 0;
> while (i < week.length) {
>     System.out.println(week[i]);
> }
> ```
> To avoid an infinite loop, when you write the `while` condition, immediately write the line that will eventually make it false, *before* you write anything else in the body.

> **`do-while` ends in a semicolon — and only `do-while` does.** `} while (!batch.isEmpty());` — drop that `;` and you get `error: ';' expected`. The reason is that this `while` is the *tail* of a statement rather than the head of a block, so it terminates like any other statement. No other loop in Java needs a closing semicolon, which is exactly why this one is easy to forget.

Choose `do-while` when the body must run at least once, for example to download the first page before checking whether there are results left. Use `while` to repeat something while a condition holds that may be false from the start; in that case, the body may not run even once. For example, to read a file line by line until the end: if the file is empty, there is no line to read.

### Choosing between the four loop forms

You have now seen the four kinds of loop. To choose between them, ask yourself **what decides how many times the loop repeats**, that is, what makes the loop end. There are three possible answers: a counter that reaches a limit, no elements left to walk through, or a condition that stops holding and is checked before or after each iteration.

| What decides how many times it repeats | Form | What it guarantees you |
|---|---|---|
| **With a counter** — you know how many iterations you need and you need each element's index | classic `for` | you write the starting value, the condition and the step yourself, so you control how many iterations the loop does and which index it uses in each one |
| **With the elements** — you want to walk through every element of an array or a collection and you do not need its index | _for-each_ | the loop gives you each element, one after another, without you writing any index, so you cannot make an off-by-one error |
| **With a condition checked before** — you do not know how many iterations you need, and you may need none | `while` | it checks the condition before running the body, so, if it is false from the start, the body does not run even once |
| **With a condition checked after** — you do not know how many iterations you need, but the body has to run at least once | `do-while` | it runs the body before checking the condition, so the body runs at least once |

> **Choose the loop that best conveys your intention.** You can almost always do the same thing with several kinds of loop: for example, a walk with an index can be written with a classic `for` or with a `while`. But each kind tells whoever reads your code something different, before they read the body:
>
> - `for (Employee emp : employees)` says: "I am going to walk through the employees in the list and I do not need their index".
> - `for (int i = 0; i < week.length; i++)` says: "I am going to repeat this a known number of times, using the index `i`".
> - `while (...)` says: "I am going to repeat this while a condition holds, and it may not run even once".
>
> So even though a `while` can do the same as a `for`, choose the loop that describes what you want to do: whoever reads your code will understand your intention without reading the whole body.

---

## break, continue, and return

> 📖 Docs: [Baeldung — The Java `continue` and `break` Keywords](https://www.baeldung.com/java-continue-and-break) → read: "The break Statement" and "The continue Statement" — each shows its unlabeled form first, then its labeled one.
> 📖 Docs: [Baeldung — Labeled Breaks in Java: Useful Tool or Code Smell?](https://www.baeldung.com/java-labeled-break) → read it for the readability argument — when to extract a method instead.

Sometimes you do not want to wait for a loop to end by its normal rule. For example, if you are looking for the first employee with overtime, once you find them there is no point checking the rest. For those cases, Java has three statements that cut execution short: `break`, `continue` and `return`. All three "stop" something, which is why they are often confused: the difference is what they stop and which line runs next. This is what each one stops:

**`break`** exits the innermost loop or classic `switch` that contains it. When it exits a loop, that loop has no more iterations, and execution continues at the first line after the loop. In this example, the loop checks each day's hours and stops at the first day with overtime:

```java
int[] weekHours = {8, 6, 10, 7};
for (int hours : weekHours) {
    if (hours > 8) {
        System.out.println("Overtime: " + hours);
        break;                    // leaves the loop: the 7 is never checked
    }
    System.out.println("Normal: " + hours);
}
System.out.println("End");
// Normal: 8
// Normal: 6
// Overtime: 10
// End
```

The `7` is never checked because `break` leaves the loop at the `10`. `End` is printed, because it is after the loop and `break` only leaves the loop.

`break` also lets you leave a classic `switch`. When it runs, the `switch` ends, and execution continues at the first line after the `switch`. It is the `break` you saw in the _Classic switch_ section:

```java
String day = "SATURDAY";
switch (day) {
    case "SATURDAY":
        System.out.println("Weekend shift");
        break;                    // leaves the switch: the next case does not run
    default:
        System.out.println("Unknown day");
}
System.out.println("End");
// Weekend shift
// End
```

Without that `break`, execution would carry on into the next case and also print `Unknown day`. With it, it leaves the `switch` and continues at `System.out.println("End")`.

**`continue`** skips the rest of the current iteration and goes straight to the next one. In this example, days with `0` hours are not printed:

```java
int[] weekHours = {8, 0, 10, 6};
for (int hours : weekHours) {
    if (hours == 0) {
        continue;                 // with the 0: skips the rest of this iteration and continues with the iteration for 10
    }
    System.out.println("Worked " + hours + " hours");
}
// Worked 8 hours
// Worked 10 hours
// Worked 6 hours
```

With the `0`, `continue` skips the `println` and the loop moves on to the `10`. The loop does not stop: it carries on until the last day.

**`return`** exits the entire **method**. The loop ends as a side effect, and so does everything that was going to run after the loop. This is the same loop as the `break` example, inside a method and with `return` instead of `break`:

```java
void printUntilOvertime(int[] weekHours) {
    for (int hours : weekHours) {
        if (hours > 8) {
            System.out.println("Overtime: " + hours);
            return;               // "End" is not printed because it has already left the printUntilOvertime method
        }
        System.out.println("Normal: " + hours);
    }
    System.out.println("End");
}

printUntilOvertime(new int[] {8, 6, 10, 7});
// Normal: 8
// Normal: 6
// Overtime: 10
```

Unlike the `break` example, `End` is not printed: `return` leaves the whole method, so the line after the loop never runs.

All three can appear together in the same loop:

```java
for (Employee emp : employees) {
    if (!emp.isActive()) continue;          // skip this one, keep going
    if (emp.getHours() > 40) {
        System.out.println("Overtime: " + emp.getName());
        break;                              // it has found the first employee with overtime: stop looking
    }
}
```

In the example, `continue` skips the inactive employee and moves on to the next one. `break` ends the search as soon as it finds the first case of overtime.

> **`continue` can stop a `while` from moving forward.** In a `while`, the `i++` is just another line of the body. `continue` skips the rest of the body and goes straight back to checking the condition, so, if the `i++` is after the `continue`, it skips that too. Then `i` does not change, the condition stays true and the loop never ends: you have created an infinite loop. For example, this loop tries to print each day's hours, skipping days with `0`:
>
> ```java
> int[] weekHours = {8, 0, 10};
>
> // ❌ MAL — with the 0, continue skips i++ and the loop never ends
> int i = 0;
> while (i < weekHours.length) {
>     if (weekHours[i] == 0) {
>         continue;             // goes back to the condition without reaching i++
>     }
>     System.out.println(weekHours[i]);
>     i++;
> }
> // 8
> // (prints nothing else, but the program keeps running)
> ```
>
> This is what happens, iteration by iteration:
>
> 1. With `i = 0`, `weekHours[0]` is `8`: it prints `8` and `i++` sets `i` to `1`.
> 2. With `i = 1`, `weekHours[1]` is `0`: since `weekHours[1] == 0` is `true`, it enters the `if` and `continue` runs, which goes back to the condition without reaching `i++`. `i` is still `1`.
> 3. `1 < 3` is still `true`, `weekHours[1]` is still `0` and `continue` runs again. Step 3 repeats forever.
>
> The fix is to put the `i++` before any `continue` that could skip it:
>
> ```java
> // ✅ BIEN — i++ runs before continue can skip it
> int i = 0;
> while (i < weekHours.length) {
>     int hours = weekHours[i];
>     i++;
>     if (hours == 0) {
>         continue;
>     }
>     System.out.println(hours);
> }
> // 8
> // 10
> ```
>
> The same happens in a `do-while`. `continue` jumps to the condition check, which in a `do-while` is at the end.
>
> ```java
> // ❌ MAL — the same problem in a do-while
> int i = 0;
> do {
>     if (weekHours[i] == 0) {
>         continue;             // jumps to the while (...) at the end without reaching i++
>     }
>     System.out.println(weekHours[i]);
>     i++;
> } while (i < weekHours.length);
> // 8
> // (prints nothing else, but the program keeps running)
> ```
>
> The fix is the same as in the `while`: put the `i++` before the `continue`.
>
> A classic `for` does not have this problem: the `i++` is in the header, and the `for` always runs it before the next check, also after a `continue`:
>
> ```java
> for (int i = 0; i < weekHours.length; i++) {
>     if (weekHours[i] == 0) {
>         continue;             // the for runs i++ anyway
>     }
>     System.out.println(weekHours[i]);
> }
> // 8
> // 10
> ```

This table sums up the three statements: which part of the code stops running with each one and which line runs right after.

| Statement | What it leaves | Where execution lands next | Where it is legal |
|---|---|---|---|
| `continue` | the rest of the current iteration | the loop's next condition check — in a classic `for`, after the step (`i++`) has run | inside a loop only |
| `break` | the innermost enclosing loop or classic `switch` | the first line after that loop or `switch`, in the same method | inside a loop, or a classic `switch` |
| `return` | the whole **method**, loop included | it leaves the method and runs the line that comes right after the **call** to that method | anywhere in a method, except inside a switch expression's arm |

To see all three together in one method, here is an example in which the method searches the timesheet for the name of the first active employee with overtime. The employee list arrives sorted by weekly hours, highest first. So, as soon as an employee with `0` hours appears, every employee after it also has `0`, and there is no need to keep searching:

```java
String firstOvertimeName(List<Employee> employees) {
    for (Employee emp : employees) {
        if (!emp.isActive()) {
            continue;                  // this employee does not count; go to the next one
        }
        if (emp.getHours() > 40) {
            return emp.getName();      // found it: leave the loop AND the method, with a value
        }
        if (emp.getHours() == 0) {
            break;                     // sorted list: nobody after this can have overtime
        }
    }
    return "none";                     // reached if the loop ends normally, or after the break
}
```

Trace the three exits. The `continue` sends control back to the `for` header, which produces the next `emp` — the loop is untouched and still running. The `break` sends control to the first line *after* the loop, which here is `return "none";` — the loop is over, the method is not. And `return emp.getName()` does neither of those: the method stops on that line, `return "none";` is never reached, and the value travels back out to whatever wrote `String who = firstOvertimeName(team);`.

> **`return;` with nothing after it is still a `return`.** A method declared `void` — one that promises to hand nothing back — can still cut itself short with a bare `return;`. Leaving a method early on purpose, before it does its main work, is a pattern with its own name, and [04-methods.md](04-methods.md) teaches it. The compiler enforces the promise in both directions: writing `return something;` in a `void` method fails with `error: incompatible types: unexpected return value`, and reaching the end of a method that promised a value without returning one fails with `error: missing return statement`. *What* a method promises — its return type, its parameters, its signature — is [04-methods.md](04-methods.md)'s subject.

> **Code written right after `break`, `continue` or `return`, in the same block, does not compile.** That line could never run, because execution always leaves before reaching it. A line like that is called **dead code**, and Java does not just warn you: it treats it as an error and the compilation stops. For example:
>
> ```java
> for (int hours : weekHours) {
>     if (hours > 8) {
>         return;
>         System.out.println("Overtime");   // ❌ would never run
>     }
> }
> ```
>
> The compiler rejects the `println` line with `error: unreachable statement`. If you get this error while moving code around, it is telling you that the `break`, `continue` or `return` comes earlier than you thought: execution leaves the block before reaching that line.

### `break` and `continue` with a label: leaving a loop that sits inside another

When a loop sits inside another, a plain `break` only leaves the loop it is written in, the innermost loop, and the outer loop carries on with its next iteration. To leave both at once, you first have to give the outer loop a name. That name is called a **label**, and it is written on the line before the loop, followed by a colon, for example `outer:`.

```java
outer:                               // the label: the name outer followed by a colon
for (Employee emp : employees) {     // the outer loop, which is now called outer
    for (String day : week) {        // the innermost loop
        // ...
    }
}
```

Then, inside the innermost loop, `break outer;` leaves the loop that carries that label, and with it the innermost loop too.

The timesheet gives a real case. You want to check that every entry is approved, so you walk through the employees and, for each employee, through the days of the week. As soon as you find an unapproved entry, you want to stop the whole search, not just the current employee's. `isApproved(emp, day)` is an example call that returns `true` when that employee's entry for that day is approved.

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
int total = 0;
outer:
for (Employee emp : employees) {
    for (String day : week) {
        if (!isApproved(emp, day)) continue outer;   // next employee
        total += hoursOf(emp, day);
    }
}
```

> **Labels are rarely used in real code.** A label works the same with three or more loops, one inside another: `break outer;` leaves all of them until it reaches the labelled loop. But a label is already rare with two loops, and with three or more it is rarer still: that many levels of loops inside loops make the code hard to read, and in a normal project it gets reorganised first. The usual approach is to move the loops into a method and leave with `return`, as the last callout of this section explains. Even so, you should be able to read a label, because it can appear in old code and in interview questions.

> **A label is not a `goto`.** Languages such as C have the `goto` statement, which jumps to any line of the program that has a label, whether it comes before or after. Java has no `goto`, and its labels are much more limited: in practice, they only say which loop `break` and `continue` leave.
>
> - `break outer;` leaves the loop that carries the label `outer`, and execution continues at the first line after that loop.
> - `continue outer;` moves on to the next iteration of the loop that carries the label `outer`.
>
> Neither of them can jump back to an arbitrary line or into another block. That is why they are not arbitrary jumps like `goto`'s in C.

> **A small method can avoid a labelled `break`.** This is usually used for searches: you walk through several loops to find an element and, as soon as you find it, you no longer need to carry on. It is the most common way to solve this case in real code, much more than a `break` with a label; in Spring Boot services, for example, the norm is to leave the method with `return` as soon as you have the result. If the search must end when it finds a result, you can put the loops in a method and return that result with `return`. That way you leave both loops and the method at once. The search from the `break outer;` example in this section, the one that stops at the first unapproved entry, can also be written another way. First, the version with a labelled `break`:
>
> ```java
> outer:
> for (Employee emp : employees) {
>     for (String day : week) {
>         if (!isApproved(emp, day)) {
>             System.out.println("Blocked by " + emp.getName() + " on " + day);
>             break outer;          // leaves BOTH loops
>         }
>     }
> }
> System.out.println("Done");
> ```
>
> And the same search with a method and `return`, with no label:
>
> ```java
> String firstBlocked(List<Employee> employees, String[] week) {
>     for (Employee emp : employees) {
>         for (String day : week) {
>             if (!isApproved(emp, day)) {
>                 return emp.getName() + " on " + day;   // leaves both loops and the method
>             }
>         }
>     }
>     return "none";                                      // every entry was approved
> }
> ```

---

You can now trace how a timesheet runs: conditions choose branches, loops repeat instructions and early exits change the point where the program continues. You have read calls such as `loadPage(page)`, `isApproved(emp, day)` and `firstOvertimeName(...)` without having to write them. In [04-methods.md](04-methods.md) you will learn to define and call those **methods**, with the values they receive and return. There you will also see how a method checks, before anything else, that it has not received a `null` value, so that its `if`, loops and `switch` do not fail with `NullPointerException`.
