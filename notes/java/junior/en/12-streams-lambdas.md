# Streams and Lambdas

> 📖 [Baeldung — Java 8 Streams](https://www.baeldung.com/java-8-streams)
> 📖 [Baeldung — Lambda Expressions](https://www.baeldung.com/java-8-lambda-expressions-tips)

---

## Where this fits in the story

In file 08 you learned to handle failure: a method can `throw` an exception and something up the call stack catches it. That was about what happens when a single operation goes wrong.

Almost everything else a real backend does is the opposite of a single operation — it is *bulk work over a collection*. You rarely have one employee; you have a `List<Employee>` and you need to keep the active ones, pull out their emails, sort them, or turn each one into a different shape before sending it to the frontend. Doing that with hand-written `for` loops works, but it is noisy and the intent gets buried in bookkeeping (temporary lists, index variables, `if` blocks).

Streams and lambdas are the Java tools for exactly this: expressing "transform this whole collection" as a short, readable chain. This file builds them from zero — first *why lambdas exist*, then *what a stream is*, then the handful of patterns you will actually write every day.

---

## Why this matters for Spring Boot

Open any Spring Boot service and you will find streams and lambdas within the first few methods. They are not an advanced topic you reach later — they are the default way to work with data in Java. Here is what a very common service method does, step by step:

- **Fetch the rows from the database.** A repository (the object that talks to the database — you will study it in the Spring Boot notes) hands you back a `List` of *entities*. An entity is just a plain Java object that mirrors one database row: a `Project` entity has a `name` field because the `projects` table has a `name` column. So "fetch a list of entities" means "get a `List<Project>` filled with the rows from the table".
- **Drop the rows you do not want** — e.g. keep only the active projects.
- **Reshape each row** into a DTO, a smaller object that exposes only the fields the API should return (more on this in the DTO section below).
- **Or look for one specific row** by id, and if it is not there, throw the kind of exception you saw in file 08.

Every one of those steps is written with a *stream pipeline* and a *lambda*. Do not worry about those two words yet — the whole point of this file is to define them properly. By the end they will read as plain English. We start with lambdas, because a stream is built out of them.

---

## The problem lambdas solve

A lambda is a way to pass **a piece of behaviour** — a small block of code — into a method, the same way you would pass a number or a string. That is the whole idea. Normally the argument you pass to a method is *data* (`sort(list)`). A lambda lets the argument be *an action* ("...and here is how to compare two elements while you sort").

Why would you ever need that? Take sorting. The `sort` method knows the *algorithm* for putting things in order, but it does not know *your* rule for which of two elements comes first — by name? by age? descending? That decision is yours, so you have to hand it to `sort`. The thing you hand over is behaviour: "given two elements `a` and `b`, tell me which goes first."

Before Java 8 there was no lightweight way to pass behaviour. You had to wrap that one line of logic in a whole **anonymous class** — a class with no name, written inline just to hold a single method:

```java
// Old way — an anonymous class whose only job is to hold one comparison rule
List<String> names = Arrays.asList("Luis", "Ana", "Victor");

Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);   // negative if a < b, 0 if equal, positive if a > b
    }
});
```

Read that from the inside out. `Collections.sort` needs a rule for comparing two strings. The rule lives in the `compare` method, which returns a negative number if `a` should come before `b`, zero if they are equal, and a positive number if `a` should come after `b` (that is the contract every Java comparison follows — `a.compareTo(b)` already implements it for strings, alphabetically). To deliver that one method, the old syntax forces you to write `new Comparator<String>() { @Override public int compare... }` — six lines of ceremony around a single line of actual logic.

> **Why so much ceremony for one line?** Because before Java 8 the only way to pass code was to pass an *object*, and to make an object you need a *class*. The `compare` logic had to be a method, the method had to live in a class, and since you only use that class once you write it inline and nameless. The five lines of `new Comparator...` `@Override` `public int compare` are pure packaging — none of it is the rule you actually care about.

Java 8 introduced **lambda expressions** to strip that packaging away. A lambda is an anonymous function — a function with no name that you write inline and pass as a value. Same rule, one line:

```java
Collections.sort(names, (a, b) -> a.compareTo(b));
```

`(a, b) -> a.compareTo(b)` *is* the comparison rule, and nothing else. The arrow `->` splits it into two halves: on the left, the parameters the function receives (`a` and `b`, the two strings being compared); on the right, the body — what to do with them and return. You did not name the function, you did not write `class`, and you did not write `@Override`. You also did not write the types of `a` and `b`: Java looks at where the lambda is being passed (`Collections.sort` on a `List<String>`), sees that the comparison must be between two `String`s, and fills in the types for you. This is called **type inference**, and it is why lambdas stay short.

---

## Functional interfaces — the rule that makes lambdas work

There is one rule behind lambdas: a lambda can only be used where Java expects a **functional interface** — an interface with *exactly one abstract method*. (Recall from file 05 that an interface is a contract: a list of method signatures with no bodies. "Abstract method" just means one of those bodyless methods that an implementation must fill in.)

The single-method rule is what makes the shorthand possible. When there is only one method to implement, Java knows *which* method your lambda is the body of — there is no ambiguity. `(a, b) -> a.compareTo(b)` can only be the body of `compare`, because `compare` is the only method `Comparator` has.

So what is `Comparator<T>`? It is a functional interface that **ships with Java** — you do not write it, it lives in `java.util` and has been there for years. Its single abstract method is `compare(T a, T b)`, the "which of these two comes first" rule from the previous section. The `<T>` means it works for any type: `Comparator<String>` compares strings, `Comparator<Employee>` compares employees. (The `<T>` angle-bracket syntax is *generics* — you will study it in full in [09-generics.md](09-generics.md); for now read `Comparator<Employee>` as "a comparator for `Employee` objects".) `Runnable` is another built-in functional interface — its one method is `run` — which is why you can pass a lambda anywhere a `Runnable` is expected.

You almost never define your own functional interface. What you *do* constantly is pass lambdas to methods that already ask for one of the four built-in ones below. Each is just a functional interface with a single method, named for the shape of that method:

| Interface     | Its one method takes… | …and returns | You use it to…                          | Example lambda            |
| ------------- | --------------------- | ------------ | --------------------------------------- | ------------------------- |
| `Predicate<T>`  | one `T`               | `boolean`    | test a condition (keep / drop)          | `e -> e.isActive()`       |
| `Function<T,R>` | one `T`               | an `R`       | transform a `T` into something else     | `e -> e.getName()`        |
| `Consumer<T>`   | one `T`               | nothing      | do something with each element          | `e -> System.out.println(e)` |
| `Supplier<T>`   | nothing               | a `T`        | produce a value on demand               | `() -> new Employee()`    |

You will not usually type these names yourself — the stream methods in the next sections ask for them internally. When you write `.filter(e -> e.isActive())`, the `filter` method's parameter is a `Predicate`, and your lambda becomes its `test` method. When you write `.map(e -> e.getName())`, `map`'s parameter is a `Function`, and your lambda becomes its `apply` method. That is the entire connection between lambdas and streams: **every stream operation takes a functional interface, and you satisfy it with a lambda.**

> **How to read the table:** the "takes / returns" columns are the whole personality of each interface. A `Predicate` returns `boolean`, so it is the natural fit for filtering (keep the element or not). A `Function` returns a *different* type, so it is the fit for transforming (turn an `Employee` into a `String`). You do not memorise the names — you recognise, when a method wants "something that returns a boolean per element", that it wants a `Predicate` and a lambda will do.

---

## Lambda syntax

The arrow form flexes a little depending on how many parameters there are and how long the body is. These are all the shapes you will meet:

```java
// No parameters — empty parentheses on the left
() -> System.out.println("Hello")

// One parameter — the parentheses are optional, so this is common
name -> name.toUpperCase()

// Multiple parameters — parentheses required
(a, b) -> a + b

// Body with multiple lines — braces required, and you must write return explicitly
(a, b) -> {
    int sum = a + b;
    return sum * 2;
}
```

Two things to notice. First, when the body is a single expression (the first three), there are no braces and no `return` — the value of that expression is returned automatically. The moment you need braces (the last one), you are writing a normal method body, so you must `return` explicitly. Second, the parameter types are almost always omitted, because Java infers them from the functional interface the lambda is being passed to (the type inference from the first section). You only spell them out on the rare occasion the compiler cannot work them out.

---

## Method references — an even shorter lambda

Sometimes a lambda does *nothing of its own* — it just forwards its argument straight into an existing method and hands back whatever that method returns. When that is all it does, Java lets you drop the lambda entirely and name the method directly with `::`. That shorthand is a **method reference**.

```java
// Lambda: take each name, and call System.out.println on it
list.forEach(name -> System.out.println(name));

// Method reference: "for each element, call System.out.println" — same thing, no plumbing
list.forEach(System.out::println);
```

The rule, stated precisely: you can use a method reference **only when the lambda's entire body is one method call whose argument is exactly the lambda's parameter, passed straight through with no changes.** The lambda `name -> System.out.println(name)` receives `name` and immediately feeds that same `name`, untouched, into `println`. Because the parameter just passes through, naming the method (`System.out::println`) says everything the lambda said. If the lambda alters the argument first, or calls the method on something other than the argument, the pass-through rule is broken and you must keep the lambda:

```java
// ✅ Method reference works — project goes straight into toResponse, unchanged
.map(project -> toResponse(project))   // lambda
.map(this::toResponse)                 // method reference — identical

// ❌ Method reference impossible — project is transformed first (.getName()), so the
//    argument is NOT passed through unchanged. Must stay a lambda.
.map(project -> toResponse(project.getName()))
```

### Why the two examples look different: `System.out::println` vs `this::toResponse`

These two references look unlike each other, and the reason is *where the method lives* — the part before `::` is always the thing you are calling the method **on**:

- `System.out::println` — `println` is a method on the object `System.out` (the console). So the reference is `object::method`. Read it as "call `println` on `System.out`".
- `this::toResponse` — `toResponse` is a private method on the current object (`this` — the service instance you are inside). So the reference is `this::method`, a special case of `object::method` where the object is `this`. Read it as "call *my own* `toResponse` method".

Both are the same category — *call an instance method on a specific, already-known object* — they just differ in which object (`System.out` vs `this`). Nothing was skipped between them; they are two instances of the same form.

### The four forms, each shown as a lambda first

A method reference always corresponds to some lambda — the lambda is what it means. Seeing both side by side is the fastest way to read a `::` you have not met before: mentally expand it back into its lambda.

**1. Static method** — `ClassName::method`. The method belongs to the class itself, not to an object.

```java
// You have a List<String> of numbers as text and want them as Integers.
.map(s -> Integer.parseInt(s))   // lambda: take s, call the static Integer.parseInt on it
.map(Integer::parseInt)          // method reference: same — parseInt is static on Integer
```

**2. Instance method on one known object** — `object::method`. The object exists already and is the same for every element; only the argument changes.

```java
// Print every element to the console. System.out is the one fixed object; each element is the argument.
.forEach(x -> System.out.println(x))   // lambda
.forEach(System.out::println)          // method reference
```

**3. Instance method called *on each element*** — `ClassName::method`. This one is the tricky one: it looks identical to the static form (`ClassName::method`), but here the element itself is the object the method runs on, not an argument.

```java
// Uppercase every string. There is no fixed object — each element IS the object toUpperCase runs on.
.map(s -> s.toUpperCase())   // lambda: the parameter s is the receiver of toUpperCase
.map(String::toUpperCase)    // method reference: "call toUpperCase on each String"
```

> **`String::toUpperCase` vs `Integer::parseInt` — why the same shape means two different things.** Both read `ClassName::method`, yet one calls a static method (`parseInt`, which belongs to the `Integer` class) and the other calls an instance method on each element (`toUpperCase`, which belongs to each `String` object). Java tells them apart by checking the actual method: `parseInt` is declared `static`, so the element is passed *to* it; `toUpperCase` is not static, so the element is the thing it runs *on*. You do not have to resolve this by hand — but it explains why two references that look the same behave differently.

**4. Constructor** — `ClassName::new`. A reference to a constructor, used when each element should be fed into `new`.

```java
// Turn each name String into a new Employee (assuming a constructor Employee(String name)).
.map(name -> new Employee(name))   // lambda
.map(Employee::new)                // method reference: "call the Employee constructor"
```

Here is the same four in one table, now that each has been shown:

| Form                                 | Syntax              | Reads as              | Equivalent lambda            |
| ------------------------------------ | ------------------- | --------------------- | ---------------------------- |
| Static method                        | `ClassName::method` | `Integer::parseInt`   | `s -> Integer.parseInt(s)`   |
| Instance method (one known object)   | `object::method`    | `System.out::println` | `x -> System.out.println(x)` |
| Instance method (on each element)    | `ClassName::method` | `String::toUpperCase` | `s -> s.toUpperCase()`       |
| Constructor                          | `ClassName::new`    | `Employee::new`       | `n -> new Employee(n)`       |

In Spring Boot the one you will type most is `this::toResponse` — form 2, the object being `this` — because mapping an entity to a DTO is a private method on the service and you call it once per element. Whenever a `::` confuses you, expand it into its lambda using this table and it becomes obvious.

---

## What a stream is

A **stream** is not a data structure — it does not store anything and it is not "the list". It is a *description of a sequence of operations* to run over the elements of a source (usually a `List`). You take a list, open a stream on it, chain the operations you want, and ask for a result at the end; only then does Java actually run through the elements.

The chain of operations is called a **pipeline** — the word is literal. Data flows in at one end, passes through each operation in turn, and a result comes out the other end. Each link in the pipeline either drops some elements, changes them, or reorders them, and hands what is left to the next link.

```
List<Employee>  ──►  filter  ──►  map  ──►  sorted  ──►  collect  ──►  List<String>
   (source)         (drop the    (turn     (put in      (gather      (result)
                     inactive)    each into  order)       into a
                                  its name)               new list)
```

Read left to right: the source list enters, `filter` throws away the elements that fail a test, `map` replaces each surviving element with something derived from it, `sorted` reorders them, and `collect` packs the final elements into a real list you can use. That last step is where the data leaves the pipeline.

```java
List<Employee> employees = getEmployees();

List<String> activeNames = employees
    .stream()
    .filter(e -> e.isActive())
    .map(e -> e.getName())
    .sorted()
    .collect(Collectors.toList());
```

Line by line: `.stream()` opens the pipeline on the list. `.filter(e -> e.isActive())` keeps only the employees whose `isActive()` returns `true` (its lambda is a `Predicate` — returns a boolean). `.map(e -> e.getName())` replaces each remaining `Employee` with its name `String` (its lambda is a `Function` — returns a different type, so after this point the pipeline carries `String`s, not `Employee`s). `.sorted()` orders those strings alphabetically. `.collect(Collectors.toList())` ends the pipeline and gathers the results into a new `List<String>`.

The result is a brand-new `List<String>`. The original `employees` list is never touched — a stream reads from its source but does not modify it.

> **`.collect(...)` vs `.toList()` — what "collect" even means.** Inside the pipeline the elements are in motion; they are not a list yet. The final step has to *collect* them into a real container. `.collect(Collectors.toList())` is the general-purpose way to do that: `collect` is the operation, and you hand it a *recipe* (a `Collector`) describing the container to build — `Collectors.toList()` for a list, `Collectors.toSet()` for a set, and so on (see the Collectors section at the end). Because "collect into a list" is so common, Java 16 added a shortcut, `.toList()`, that does exactly that with no recipe argument. So `.collect(Collectors.toList())` and `.toList()` produce the same elements — the difference is only that `.toList()` returns an **immutable** list, covered in the DTO section. Use `.toList()` by default; reach for `.collect(Collectors.toList())` when you specifically need a list you can still add to or remove from.

> **A stream can be used only once.** Once a terminal operation runs (the `.collect` / `.toList` at the end), the stream is *consumed* — it has pushed its elements through and is finished. Trying to reuse the same stream variable for a second pipeline throws `IllegalStateException: stream has already been operated upon or closed`. In practice this never bites you, because you almost always write the whole pipeline in one chain starting from a fresh `.stream()`. But it explains why you never store a stream in a field and reuse it — you store the *list* and call `.stream()` again each time.

---

## Intermediate vs terminal operations

The operations in a pipeline come in two kinds, and telling them apart is what lets you read any chain. The distinction is simply *what each operation returns*.

An **intermediate operation** returns another stream. Because it hands you back a stream, you can immediately call the next operation on it — that is why they chain (`.filter(...).map(...).sorted()`). `filter`, `map`, and `sorted` above are all intermediate. This first table is a menu of the intermediate operations you can stack between opening the stream and finishing it:

| Operation                         | What it does                                                     |
| --------------------------------- | ---------------------------------------------------------------- |
| `filter(predicate)`               | Keeps only the elements where the condition is true              |
| `map(function)`                   | Transforms each element into something else                      |
| `sorted()` / `sorted(comparator)` | Sorts the elements                                               |
| `distinct()`                      | Removes duplicate elements                                       |
| `limit(n)`                        | Keeps only the first `n` elements                                |
| `peek(consumer)`                  | Inspects each element without changing it — useful for debugging |

A **terminal operation** does *not* return a stream — it returns a final result (a list, a number, a boolean, an `Optional`) or nothing at all. It sits at the end of the chain and is what makes the pipeline actually execute. Once it runs, the stream is consumed (the single-use rule above). This second table is the menu of ways to *finish* a pipeline — most of these are new to you, so treat it as a reference to come back to; the ones you will use immediately are `collect`, `count`, and `findFirst`:

| Operation                             | What it produces                                      |
| ------------------------------------- | ----------------------------------------------------- |
| `collect(collector)`                  | Gathers elements into a collection (List, Set, Map…)  |
| `forEach(consumer)`                   | Runs an action on each element, returns nothing       |
| `count()`                             | Returns the number of elements as `long`              |
| `findFirst()`                         | Returns the first element wrapped in an `Optional<T>` |
| `anyMatch(predicate)`                 | Returns `true` if at least one element matches        |
| `allMatch(predicate)`                 | Returns `true` if every element matches               |
| `noneMatch(predicate)`                | Returns `true` if no element matches                  |
| `min(comparator)` / `max(comparator)` | Finds the smallest or largest element                 |
| `reduce(identity, accumulator)`       | Folds all elements into a single value                |

> **Intermediate operations are lazy — they do nothing until a terminal operation asks.** This is the surprising part. When you write `.filter(...).map(...)`, no filtering and no mapping happen at that moment. Each intermediate operation just *records* what you want done and hands back a stream carrying that recorded plan. Nothing runs until you add a terminal operation; at that instant Java executes the whole recorded pipeline in a single pass over the elements. The reason for this design is efficiency: because Java sees the full plan before starting, it can push each element through *all* the steps at once instead of building a throwaway intermediate list after every operation — and an operation like `limit(3)` can stop early after three elements instead of processing the whole source. A pipeline with no terminal operation is dead code: it compiles, but not a single element is ever touched.

---

## `reduce` — folding a stream into a single value

`int` and `double` streams have a built-in `.sum()`. A `Stream<BigDecimal>` does not — `BigDecimal` is a regular class, not a primitive, so Java has no automatic notion of "add these objects together". `BigDecimal` is used instead of `double` specifically *because* `double` loses precision on decimals (the same `0.1 + 0.2 != 0.3` trap you may already know from JavaScript), which is unacceptable for money or billable hours — but the price of that precision is losing the primitive streams' free `.sum()`. `reduce` is the general-purpose tool that fills the gap: it folds every element into one result, and you tell it exactly *how* to combine them.

```java
BigDecimal approvedHours = entries.stream()
    .filter(e -> e.getStatus() == EntryStatus.APPROVED)
    .map(TimeEntry::getHours)
    .reduce(BigDecimal.ZERO, BigDecimal::add);
```

`reduce(identity, accumulator)` takes two arguments:

- **`identity`** — the starting value, what you are "carrying" before looking at the first element. For a sum it must be the additive identity, `BigDecimal.ZERO` (for a product it would be `BigDecimal.ONE` instead — the value that combining with it changes nothing).
- **`accumulator`** — a function that combines "what you're carrying so far" with "the current element" into the new running value. `BigDecimal::add` is the method reference for `BigDecimal`'s own `.add(BigDecimal other)` method — reduce calls it as `carried.add(element)` at every step.

**Traced by hand**, over three `BigDecimal` values `[4.00, 21.00, 6.00]` (three `APPROVED` entries' hours):

```
carried (start) = BigDecimal.ZERO           → 0.00

step 1: carried = carried.add(4.00)   →  0.00.add(4.00)   = 4.00
step 2: carried = carried.add(21.00)  →  4.00.add(21.00)  = 25.00
step 3: carried = carried.add(6.00)   →  25.00.add(6.00)  = 31.00

final result: 31.00
```

> This is the exact same shape as the accumulator-variable loop you already know — `reduce` is just the stream's name for it:
> ```java
> BigDecimal total = BigDecimal.ZERO;
> for (BigDecimal hours : listOfHours) {
>     total = total.add(hours);
> }
> ```
> `reduce(identity, accumulator)` is `total = identity`, then `total = accumulator.apply(total, element)` once per element, with the loop itself hidden inside the stream machinery.

> **Why not the one-argument `reduce(accumulator)` overload?** It exists (see the `Optional`-returning family in the next section), but it has no identity to fall back on, so it returns `Optional<BigDecimal>` — empty if the stream had zero elements, because there is nothing to combine. The two-argument form you used above sidesteps that: `BigDecimal.ZERO` **is** the right answer for "sum of nothing", so it can return a plain `BigDecimal` instead of an `Optional`, never empty, never needing an `orElse(...)` afterward. Prefer the two-argument form whenever your identity value is a genuine, meaningful "nothing happened" answer — sum and count both qualify; "the maximum of an empty list" does not, which is why `max()` stays `Optional`-returning.

This exact pattern — `filter` by an enum status, `map` to the field you care about, `reduce` to a single `BigDecimal` — is the real code behind `ReportService.getSummary()` in project 07: `approvedHours` and `pendingHours` are each one `filter → map → reduce` pipeline, differing only in which `EntryStatus` the `filter` keeps.

---

## Optional — the "maybe empty" result

Some operations can honestly come back with *nothing*. If you search a list for the first employee with a given id and no employee has it, there is no value to return. In most languages that gap is filled with `null`, and forgetting to check for `null` is the single most common source of crashes. Java's answer is `Optional<T>`: a small box that either holds a value or is explicitly empty, and that *forces you at compile time to say what happens in the empty case* before you can touch the value.

The section is named after `Optional` because it is the type these "might find nothing" operations return, and `findFirst()` is the one you meet first — but it is not the only one. `findAny()`, `min()`, `max()`, and `reduce()` (the single-argument form) all return `Optional<T>` for the same reason: they might be called on an empty stream, or find no match, and there would be no element to give back. Anything that returns *one element that might not exist* returns it wrapped in an `Optional`.

`findFirst()` is a terminal operation: it runs the pipeline and returns the **first element that survived** all the earlier operations, wrapped in `Optional<T>`. You reach for it when you want a single result out of a stream — the classic case is "find the one element matching a condition", so it almost always comes right after a `filter` that narrows the stream down to the matches. In the example below the pipeline keeps only the employee whose id equals `targetId`, then `findFirst()` pulls out that one match (or an empty `Optional` if the filter left nothing):

```java
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))   // narrow to the matching employee(s)
    .findFirst();                               // take the first — may be empty

// Deciding what to do with the box:
found.isPresent();                     // true if there is a value inside
found.get();                           // pull the value out — THROWS if empty, so only after isPresent()
found.orElse(null);                    // give me the value, or null if empty
found.orElseThrow(() -> new EmployeeNotFoundException(targetId));  // value, or throw if empty
```

> **`Optional` forces you to handle the empty case.** With a plain `null` result nothing stops you from calling `found.getName()` on a value that was never set — the crash comes later, at runtime, as a `NullPointerException`. `Optional` closes that hole by construction: the value is *inside* the box, and every way of opening the box (`get`, `orElse`, `orElseThrow`, `isPresent`) makes you state, right there, what the empty case does. You cannot accidentally skip the check, because there is no value to reach until you open the box. That is the whole point of the type.

In Spring Boot services the last line is the pattern you will write constantly — `repository.findById(id).orElseThrow(...)` — "find the row by id, or throw the not-found exception from file 08". `orElseThrow` is the natural bridge between "this might be empty" and "then this request should fail with a 404".

---

## Common patterns you will write every day

These are the stream pipelines you will reach for most in a Spring Boot service. A couple use methods introduced only here, so they are flagged inline; everything else was built up above. The method references (`Employee::isActive`, `Employee::getEmail`) are the short form from the method-references section — each equals a lambda like `e -> e.isActive()`.

```java
List<Employee> employees = getEmployees();

// Filter and collect — keep the active ones
List<Employee> active = employees.stream()
    .filter(Employee::isActive)
    .collect(Collectors.toList());

// Transform to a different type — a list of just the emails
List<String> emails = employees.stream()
    .map(Employee::getEmail)
    .collect(Collectors.toList());

// Count matches — how many admins
long adminCount = employees.stream()
    .filter(e -> e.getRole().equals("admin"))
    .count();

// Check if any match — is there at least one admin?
boolean hasAdmin = employees.stream()
    .anyMatch(e -> e.getRole().equals("admin"));

// Find one by id — returns Optional, handled with orElseThrow (see the Optional section)
Optional<Employee> found = employees.stream()
    .filter(e -> e.getId().equals(targetId))
    .findFirst();

// Sort by a field
List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .collect(Collectors.toList());

// Sum a numeric field
int totalAge = employees.stream()
    .mapToInt(Employee::getAge)
    .sum();
```

Two of these use something new:

**`Comparator.comparing(Employee::getName)`** builds a comparator without writing the two-argument `(a, b) -> ...` by hand. Back in the first section a comparator was "given `a` and `b`, decide which comes first". Almost always that decision is "compare them *by some field*" — by name, by age. `Comparator.comparing` is a helper that builds exactly that: you give it *how to extract the field* (`Employee::getName`, "get the name of each employee") and it returns a full `Comparator` that orders employees by that field. So `.sorted(Comparator.comparing(Employee::getName))` reads as "sort by name", and it is far cleaner than spelling out `(a, b) -> a.getName().compareTo(b.getName())`.

**`.mapToInt(Employee::getAge).sum()`** is how you total a number across a stream. A normal `Stream<Employee>` has no `.sum()` — summing only makes sense for numbers, and the stream holds employees. `mapToInt` converts the stream into an `IntStream`, a specialised stream of primitive `int` values (here, each employee's age). Because an `IntStream` is guaranteed to hold numbers, it *does* offer numeric terminals like `.sum()`, `.average()`, and `.max()`. So the two steps read as "pull out each age as an int, then add them all up". The same idea gives you `mapToLong` and `mapToDouble` for the other numeric types.

---

## Grouping and joining — Collectors that build more than a plain list

`collect` can build far more than a list. You pass it a different `Collector` recipe and it assembles a different result. These two come up constantly in real services:

```java
// Group elements into a Map, keyed by a field
Map<String, List<Employee>> byDepartment = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// Join the names into one string with a separator
String names = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.joining(", "));
// result: "Victor, Ana, Luis"
```

**`Collectors.groupingBy(Employee::getDepartment)`** buckets the elements. You give it a function that extracts a key from each element (the department), and it returns a `Map` where each key maps to the *list* of elements that share it — so `Map<String, List<Employee>>` reads as "for each department name, the list of employees in it". It is the stream way of writing "group these rows by column X", which you will recognise if you have written `GROUP BY` in SQL.

**`Collectors.joining(", ")`** works only on a stream of strings (hence the `.map(Employee::getName)` first) and glues them into a single string with the separator you give — the everyday tool for turning a list into a readable `"a, b, c"` line.

---

## Entity to DTO mapping — the pattern you will use in every service

> **Preview — Spring Boot:** This section uses `projectRepository`, `ProjectResponse`, and Spring Boot service patterns you haven't studied yet. Read it to see streams applied to a real project — you'll implement this exact pattern in the Spring Boot notes.

In Spring Boot, a service method must never return the raw entity from the database — it returns a DTO (Data Transfer Object) that only exposes the fields the API needs. The standard way to convert a list of entities to a list of DTOs is a stream pipeline:

```java
// ProjectService — getAll()
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(project -> {
            ProjectResponse response = new ProjectResponse();
            response.setId(project.getId());
            response.setName(project.getName());
            response.setDescription(project.getDescription());
            response.setActive(project.getActive());
            response.setCreatedAt(project.getCreatedAt());
            return response;
        })
        .toList();
}
```

`findAll()` hands back the `List<Project>` of database rows; `.stream()` opens the pipeline; `.map(...)` turns each `Project` entity into a `ProjectResponse` DTO (the lambda uses the multi-line, braces-and-`return` form because it does several assignments); `.toList()` gathers the DTOs.

> **`.toList()` returns an immutable list.** `.toList()` (Java 16+) is the shorter alternative to `.collect(Collectors.toList())`, and both work in Java 25 — but they are not identical. The list from `.toList()` is **immutable**: calling `.add(...)` or `.remove(...)` on it throws `UnsupportedOperationException` at runtime. This is a feature, not a limitation — the result of a query is usually something you return and read, never modify, so immutability protects you from an accidental change. Only when you genuinely need to keep adding to the result should you fall back to `.collect(Collectors.toList())`, which gives a normal mutable `ArrayList`.

As the mapping logic grows, you typically extract it into a private method and use a method reference — this is the real reason `this::toResponse` from the method-references section shows up everywhere:

```java
public List<ProjectResponse> getAll() {
    return projectRepository.findAll()
        .stream()
        .map(this::toResponse)
        .toList();
}

private ProjectResponse toResponse(Project project) {
    ProjectResponse response = new ProjectResponse();
    response.setId(project.getId());
    response.setName(project.getName());
    // ...
    return response;
}
```

---

## Stream vs for loop — when to use each

Streams make the _intent_ of the code clear — filter, map, sort — in a way that a for loop does not. But a for loop is sometimes the right tool.

```java
// for loop
List<String> result = new ArrayList<>();
for (Employee e : employees) {
    if (e.isActive()) {
        result.add(e.getName().toUpperCase());
    }
}

// Stream — same result, intent is immediately visible
List<String> result = employees.stream()
    .filter(Employee::isActive)
    .map(e -> e.getName().toUpperCase())
    .collect(Collectors.toList());
```

Use a stream when the pipeline is clear and each step fits in a line or two. Use a for loop when:

- the logic inside is complex and spans many lines
- you need to `break` out of the loop early
- you are updating an external variable inside the loop (streams discourage side effects)

---

## Collectors quick reference

`Collectors` is a utility class that provides ready-made recipes for the `collect()` terminal operation. Each static method returns a `Collector` describing what container to build. You met `groupingBy` and `joining` above; this is the full menu in one place for reference.

```java
// Collect into a List
.collect(Collectors.toList())

// Collect into a Set (duplicates removed automatically)
.collect(Collectors.toSet())

// Collect into a Map — give it how to derive the key and the value from each element
.collect(Collectors.toMap(
    Employee::getId,    // each element's id becomes the key
    Employee::getName   // each element's name becomes the value
))
// result: Map<Long, String> — id → name

// Join strings
.collect(Collectors.joining(", "))             // "a, b, c"
.collect(Collectors.joining(", ", "[", "]"))   // "[a, b, c]"

// Group into a Map<key, List<element>>
.collect(Collectors.groupingBy(Employee::getDepartment))
// result: Map<String, List<Employee>>

// Group and count per group
.collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()))
// result: Map<String, Long> — department → how many employees
```

Two of these deserve a note. **`Collectors.toMap`** turns the stream into a `Map` — you give it two functions, one that produces the key for each element and one that produces the value, so `toMap(Employee::getId, Employee::getName)` builds an "id → name" lookup. (Watch out: if two elements produce the same key, `toMap` throws — it expects keys to be unique.) **`Collectors.groupingBy(..., Collectors.counting())`** is `groupingBy` with a second argument that says *what to do with each bucket* instead of keeping the whole list: `counting()` replaces each group's list with its size, giving you `Map<String, Long>` — "how many employees per department". This nesting of a second collector inside `groupingBy` is a common shape once you need counts or sums per group.

---

## Where this leads next

You can now transform whole collections fluently — the last core piece of everyday Java syntax. You will have noticed the angle brackets everywhere in this file: `List<String>`, `Optional<Employee>`, `Comparator<T>`, `Function<T, R>`, `Stream<T>`. That `<...>` notation is **generics**, and so far you have been reading it by feel ("a list *of* strings", "an optional *of* employee"). File 10 explains what those brackets actually are — how `<T>` lets one class like `Optional` or `Comparator` work for any type while still being type-safe — and picks up `Optional` again to cover the rest of its methods. That is the natural next step now that you have seen generics used on every line without yet being told the rule behind them.
