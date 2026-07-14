# Control Flow

> 📖 [Baeldung — Control structures in Java](https://www.baeldung.com/java-control-structures) → read: "If-Else Statement", "Switch Statement" and "Loops"
> 📖 [Oracle Docs — Control flow statements](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html)

In [01-variables-types.md](01-variables-types.md) you learned how to declare and store values. On its own, a program that only stores values does nothing interesting — it runs top to bottom, one line after another, and stops. Control flow is what lets a program *make decisions* about those values (run this block, skip that one) and *repeat* work (loop over a list). It is the difference between a fixed script and a program that reacts to its data.

Control flow statements decide which code runs and how many times. Java uses the same structures as JavaScript — the syntax is nearly identical, so most of this will feel familiar.

---

## if / else

The basic decision tool. Java evaluates the conditions top to bottom and runs the first block whose condition is true, then skips all the rest — even if a later condition would also be true. If no condition matches and you wrote an `else`, that block runs as the default.

```java
if (age >= 18) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teenager");
} else {
    System.out.println("Child");
}
```

> **The condition must be a real `boolean`.** This is the one place Java differs from JavaScript here. In JS you can write `if (name)` and it runs when `name` is any "truthy" value (a non-empty string, a non-zero number). Java has no truthy/falsy: the condition has to be an expression that evaluates to exactly `true` or `false`. `if (name)` does not compile — you get `incompatible types: String cannot be converted to boolean`. To check a string has content you write it out: `if (name != null && !name.isEmpty())`. The same rule applies to `while`, `do-while`, and the ternary below.

### Ternary operator

A one-line shortcut for a simple `if/else` when you just need to pick a value. Same syntax as JavaScript:

```java
String label = age >= 18 ? "Adult" : "Minor";
// condition ? valueIfTrue : valueIfFalse
```

Use it only when both values are short and the condition is easy to read. If the line becomes hard to scan, use a regular `if/else`.

---

## switch

Use `switch` when you have many possible values for one variable. A chain of `if/else if` for each value becomes hard to read — `switch` gives each value its own case and is easier to scan.

### Classic switch (statement)

The classic form runs the code of the case that matches. You must write `break` at the end of each case — without it, execution falls into the next case and runs that code too, even if it does not match. This behaviour has a name: **fall-through** (literally "falling down") — control "falls" from one case to the next without stopping. It is a common bug in Java code.

```java
switch (day) {
    case "MONDAY":
    case "TUESDAY":
        System.out.println("Weekday");
        break;        // without break, execution falls through to the next case
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Unknown");
}
```

Two cases with no code between them (like `MONDAY` and `TUESDAY`) is intentional fall-through — a common pattern to handle multiple values the same way. The `default` block is not required, but it is good practice to always include it: it acts as a safety net for unexpected values and avoids silent bugs when no case matches.

### Switch expression (Java 14+) — use this form

The classic switch was a **statement** — it ran code but returned nothing. The switch **expression** returns a value directly. You can assign it to a variable.

It also removes fall-through: each arm uses `->` and runs exactly one thing. No `break` needed. The compiler also warns if you forget a case.

```java
String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
```

Use the switch expression form for all new code — it is cleaner, safer, and easier to read.

---

## for loops

### Classic for

The most explicit form — you control the start, stop, and step yourself. Three parts, separated by semicolons: `(init; condition; step)`. Use it when you need the index number.

> **What is the "step"?** It is how much the counter moves on each iteration. `i++` is the most common step: it adds 1 to `i`. But you could use `i += 2` to go in twos, or `i--` to count backwards.

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);   // prints: 0 1 2 3 4
}
```

- `int i = 0` — start at index 0
- `i < 5` — keep going while this is true
- `i++` — increment i by 1 after each iteration

### Enhanced for (for-each) — use this for collections and arrays

The classic index loop has two frequent problems: it is longer to write, and it is easy to get the range wrong — for example writing `i <= names.length` instead of `i < names.length`, which runs one iteration too many and reads past the end of the array (this is called an _off-by-one error_ — being off by exactly one position). The enhanced `for` removes the index entirely and gives you each item directly. Think of it as Java's version of `for...of` in JavaScript.

Syntax: `for (Type variable : collection)` — read as "for each item of this type in this collection".

```java
String[] names = {"Ana", "Luis", "Maria"};
for (String name : names) {
    System.out.println(name);   // Ana, Luis, Maria
}

List<Employee> employees = getEmployees();
for (Employee emp : employees) {
    System.out.println(emp.getName());
}
```

Use the enhanced for whenever you just need the items and do not need the index. In Spring Boot, this is what you will write most of the time — though streams (covered in `09-streams-lambdas.md`) are even more concise for transforming collections.

---

## while and do-while

Use `while` and `do-while` when you do not know how many iterations you need in advance. A `for` loop is better when you know the range.

**`while`** checks the condition first. If the condition is false from the start, the body never runs.

**`do-while`** runs the body first, then checks the condition. This guarantees at least one execution — useful when you must do something before you can check whether to continue.

```java
// while — check first, may never run
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while — run at least once, then check
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);
```

In Spring Boot you will mostly use for-each loops and streams. `while` appears more in algorithms and when reading data streams (like parsing files line by line).

---

## break and continue

Both keywords change the flow inside a loop. They work in `for`, `while`, and `do-while` — all three loop types you have seen. In practice you will see them most in `for` and `while` loops. In `switch`, `break` also appears to stop fall-through (as you saw above), but `continue` does not apply there.

- **`break`** exits the entire loop immediately — no more iterations happen after it.
- **`continue`** skips the rest of the current iteration and jumps straight to the next one.

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) break;        // stop the loop entirely when i reaches 5
    if (i % 2 == 0) continue; // skip even numbers (go to next iteration)
    System.out.println(i);    // prints: 1, 3
}
```

Think of `break` as the emergency exit and `continue` as the skip button.

> **`break` vs returning from a method:** in Spring Boot services, it is more common to return early from a method than to use `break`. If you are checking a condition inside a loop and want to stop all work, `return` is usually cleaner than `break`.

---

## Null checks

**Runtime error:** an error that does not happen when Java compiles the code, but when the program is already running and reaches that line. The compiler does not catch it in advance. (For the full explanation of compile time vs runtime, see the `var` section in [01-variables-types.md](01-variables-types.md).)

`NullPointerException` is the most common runtime error in Java. It happens when you call a method on a variable that is `null` — Java cannot find the object to run the method on. Only **objects** have methods: `String`, wrapper classes (`Integer`, `Long`…), and any class you define. **Primitives** (`int`, `long`, `double`…) are not objects and have no methods — they cannot be `null` and you cannot call `.something()` on them. That is why you will never see a `NullPointerException` on an `int` variable. The useful methods for wrappers and `String` are already in [01-variables-types.md](01-variables-types.md) — those are the classes you call methods on. The fix is simple: always check for `null` before calling methods on anything that might not exist.

```java
// Risk of NullPointerException
String name = employee.getName();
System.out.println(name.toUpperCase());  // crashes if name is null

// Safe check
if (name != null) {
    System.out.println(name.toUpperCase());
}

// Or using Optional (covered in 10-generics.md) — the modern approach
// Don't worry about the `->` syntax yet — that's a lambda, covered in 09-streams-lambdas.md
Optional.ofNullable(name)
    .ifPresent(n -> System.out.println(n.toUpperCase()));
```

In Spring Boot, many methods return `Optional<T>` instead of a raw object that might be null. `repository.findById(id)` is a good example — it returns `Optional<Employee>` so you are forced to handle the "not found" case. This pattern is covered in detail in `10-generics.md`.

---

So far every loop and condition has lived inside one block of code. But real programs are not one long block — they are split into reusable, named pieces you can call by name, each taking inputs and handing back a result. Those pieces are **methods**, and the `if`, `for`, and `switch` you just learned are the building blocks that go inside them. That is where [03-methods.md](03-methods.md) picks up.
