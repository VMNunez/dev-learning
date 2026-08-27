# Methods

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → read the full article
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (official reference)

## Method declaration

> Docs: https://www.baeldung.com/java-method-signature-return-type → read the whole page: it is short and settles exactly which parts of a declaration make up the signature

In [03-control-flow.md](03-control-flow.md) every loop and `if` you wrote lived inside a `main` method — that `main` was itself a method, and so were the `System.out.println` calls it invoked. This note steps back and looks at that building block directly: what a method is made of, and how you write your own.

> **Where do methods live?** Always inside a class — they cannot exist outside a class in Java. We cover them here before classes because you have already seen them in the control flow examples. The full structure of a class (fields, constructors, encapsulation) is covered in [06-oop-classes.md](06-oop-classes.md).

A method is a named block of code that performs one specific task. You define it once and call it from anywhere in the program.

```java
public int add(int a, int b) {
    return a + b;
}
```

This method has four parts: `public` is the access modifier (who can call it), `int` is the return type, `add` is its name, and `int a, int b` are the input parameters. The general structure looks like this:

```java
accessModifier returnType methodName(parameters) {
    // body
    return value;
}
```

Two words for the same slot, and Java people use them precisely, so learn the pair now. A **parameter** is the variable written in the declaration — `int a` above; it exists only inside the method. An **argument** is the actual value you hand over at the call site — the `3` in `add(3, 4)`. Parameters are the empty boxes; arguments are what you drop into them. Both words appear later in this file, and the compiler uses them in its error messages too.

Those three parts are not decoration: together they are the **contract** the caller has to satisfy, and the compiler checks it call by call before your program ever runs. The parameter list fixes how many arguments you must supply and of what type; the name plus that list is what Java looks the method up by; and the return type decides what the call site is allowed to do with the result. Break any of the three and the file does not compile:

```java
public int add(int a, int b) { return a + b; }

add(3, 4);              // ✅ two ints, exactly as declared
add(3);                 // ❌ error: method add in class Calculator cannot be applied to given types;
                        //    required: int,int   found: int   reason: actual and formal argument lists differ in length
add("3", "4");          // ❌ error: incompatible types: String cannot be converted to int
String s = add(3, 4);   // ❌ error: incompatible types: int cannot be converted to String
```

Read the four lines as one rule seen from four sides: a call compiles when the arguments match the parameter list in number and type, and when whatever you do with the result matches the return type. Nothing about the *values* is checked — only the declared types, which is why every one of these errors arrives before the program runs.

> **The signature — the part of a method Java uses to identify it.** A method's **signature** is its name plus the type and order of its parameters: `add(int, int)`. That's it — the return type is *not* part of the signature, and neither is the access modifier. This sounds like trivia now, but it is the exact rule that decides which method Java calls when several share a name (§"Method overloading" below) and which method a subclass replaces (`08-inheritance-polymorphism.md`). Every time this file says "the signature", it means that name-plus-parameter-types fingerprint.

The `return` statement does two things at once, and the second one is easy to miss. It hands the value back to whoever called the method — *and it exits the method immediately*, right there. Nothing after it runs; control jumps straight back to the line that made the call, which continues with the returned value in hand.

```java
public int add(int a, int b) {
    return a + b;
    // System.out.println("done");   // ❌ unreachable — the method already left
}
```

That immediacy is a tool, not just a rule: you use it deliberately to leave early (see §"Return types"). And it comes with an obligation — if you declare a return type other than `void`, **every** path out of the method must hand a value back. Miss one and the file does not compile:

```java
public int getAgeOrZero(Integer age) {
    if (age != null) {
        return age;
    }
    // no else, no return here
}
// error: missing return statement
```

> **Why does the compiler refuse instead of just returning 0?** Because the caller wrote `int x = getAgeOrZero(null);` and the type system promised `x` would get an `int`. If Java silently invented a value, the promise would be kept with a number you never chose — the exact class of bug static typing exists to prevent. The compiler traces every branch and, finding one that reaches the closing brace with nothing returned, stops the build. The fix is to return something on that path too, never to remove the return type.

More examples:

```java
public void printName(String name) {
    System.out.println(name);
    // no return statement — void methods return nothing
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

> **Three things visible in that declaration are deliberately not this chapter's.** The first is
> `public`. It is an **access modifier** — the word that says *who is allowed to call* the method — and
> the full set (`public`, `private`, `protected`, and writing nothing at all) is settled in
> [06-oop-classes.md](06-oop-classes.md), because visibility only becomes a real decision once a class
> has state worth hiding. The second is `static`, a word you will see on some declarations below: it
> changes whether you call the method on an object or on the class name, and it belongs to that same
> chapter for the same reason. The third is what physically travels when you hand `int a` a value — a
> copy, a reference, and why "Java is always pass-by-value" is the answer interviewers are listening
> for; that is [05-memory-model.md](05-memory-model.md)'s subject, and it needs the stack and the heap
> to be worth explaining. Until then, read `public` as "callable from anywhere" and `static` as "called
> on the class name, not on an object". That is everything this chapter asks of them.

---

## Return types

> Docs: https://www.baeldung.com/java-missing-return-statement → read the whole page: every example is a variant of the "not every path returns" error, which is the rule this section is built on

The return type declares what kind of value the method hands back when it finishes. If a method computes nothing to give back — it just does something — its return type is `void`.

```java
public String getName() { return this.name; }   // returns a String
public int getAge() { return this.age; }         // returns an int
public boolean isActive() { return this.active; }// returns boolean — by convention starts with "is"
public void save(Employee e) { ... }             // returns nothing
public Employee findById(int id) { ... }         // returns an object
public List<Employee> findAll() { ... }          // returns a collection
```

Read that list as three groups, not six lines. The first three return **primitives** — a raw value gets copied back to the caller. The next two return **objects** (`Employee`, `List<Employee>`) — and what travels back is not the object but a *reference* to it, the same value-vs-reference split you met in [01-variables-types.md](01-variables-types.md): the caller ends up holding an arrow that points at the very same object the method was working on, never a copy of it. `void` returns nothing at all, which is a category of its own.

> **What a `void` method actually gives back is control, and nothing else.** It is worth being precise, because "returns nothing" sounds like it returns some empty thing. There is no value at all — not `null`, not an empty object — so the call is a *statement*, never an expression you can read a value out of. `printName("Ana");` is a complete line; `String s = printName("Ana");` does not compile, and the compiler says `error: incompatible types: void cannot be converted to String`. What does come back is the one thing every call returns: the flow of execution, which resumes on the line after the call. That is also why a `void` method may still end early with a bare `return;` — the statement you met in [03-control-flow.md](03-control-flow.md) — since there is a jump to perform even when there is no value to carry: `return;` hands control back immediately, and writing `return something;` there fails with `error: incompatible types: unexpected return value`.

> **Returning an object hands out a live arrow, and that has a consequence.** If `getName()` returns the `String` field, the caller cannot hurt you — `String` is immutable, so there is nothing to change. But if a method returns the internal `List` field, the caller can now call `.add()` on your object's own list from the outside, behind your back. The fix (a *defensive copy* — returning `new ArrayList<>(this.items)` instead) belongs with encapsulation and is covered in [06-oop-classes.md](06-oop-classes.md); flag it now so the "returns a collection" line above doesn't read as harmless.

Because `return` exits the method on the spot, the natural shape for a method with a special case is to deal with it first and leave, instead of wrapping the real work in an `else`. This is the **early return** (or *guard clause*) pattern, and it is what you will read in almost every service method in a real codebase:

```java
// MAL — the real work drifts to the right with every new condition
public String describe(Employee e) {
    if (e != null) {
        if (e.isActive()) {
            return e.getName() + " (active)";
        } else {
            return e.getName() + " (inactive)";
        }
    } else {
        return "unknown";
    }
}

// BIEN — handle the exceptional cases and get out; the main path stays flat at the end
public String describe(Employee e) {
    if (e == null) return "unknown";
    if (!e.isActive()) return e.getName() + " (inactive)";
    return e.getName() + " (active)";
}
```

Both compile and both are correct; the second is the one that survives three more conditions being added. It also satisfies the "every path must return" rule visibly — the last line is unconditional, so there is no branch left that could fall off the end.

---

## void vs Void

> Docs: https://www.baeldung.com/java-void-type → read the whole page: it is short, and covers why `Void` cannot be instantiated and why `null` is its only possible value

`void` (lowercase) is a Java **keyword** — it means a method returns nothing:

```java
public void delete(Long id) { ... }  // returns nothing
```

`Void` (uppercase) is a **class** — technically the wrapper class for `void`, just like `Integer` is the wrapper for `int`. Unlike `Integer`, it holds no useful value; it exists only so that generics can write `<Void>` when there is nothing to return. Why is it needed at all? Because in some places Java forces you to put a type between `<>` — for example `ResponseEntity<T>` or `Callable<T>` — and Java only accepts a class inside `<>`, never the `void` keyword:

```java
ResponseEntity<Void>   // ✓ — Void is a class
ResponseEntity<void>   // ✗ — void is a keyword, not valid inside < >
```

> **Clearing up the confusion:** use `void` (lowercase) as the return type of a method. Use `Void` (uppercase) only when a generic forces you to put a type between the **angle brackets** — the `<>`, which most developers also call *diamonds* — and there is nothing real to return. The distinction has nothing to do with null — both mean "no value". The difference is purely context: `void` is the keyword for return types; `Void` is the class for when a generic demands a type.

> **Preview — Spring Boot:** The example below uses `ResponseEntity`, a Spring Boot class you haven't studied yet. Read it to see where `void` vs `Void` matters in practice — you'll implement this yourself in the Spring Boot notes.

This is exactly the Spring Boot `delete` pattern — the service returns `void`, but the controller returns `ResponseEntity<Void>` so it can still send a 204 status with no body (see [spring-boot/02-rest-controllers.md](../../../spring-boot/junior/en/02-rest-controllers.md)):

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/controller/ProjectController.java`

```java
@PreAuthorize("hasRole('MANAGER')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id){
    projectService.delete(id);                  // void — returns nothing
    return ResponseEntity.noContent().build();  // 204, no body
}
```

---

## Method overloading

> Docs: https://www.baeldung.com/java-method-overload-override → read: "Method Overloading", especially "Type Promotion" and "Static Binding"

Same method name, different parameters. Java picks the right version based on the arguments you pass:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // calls first version — returns 3
add(1.5, 2.5);     // calls second version — returns 4.0
add(1, 2, 3);      // calls third version — returns 6
```

Java decides which version to call by looking at the **parameters** — their number and types. The return type does not count for that decision. If you define two methods with the same parameters but different return types, Java cannot tell them apart and the compiler rejects the file before it even runs — at the call site there is no way to know which of the two you want. When you write `add(1, 2)` you never state a return type, so the parameters are the only signal Java has — two methods sharing them would be indistinguishable.

```java
public int add(int a, int b) { return a + b; }
public double add(int a, int b) { return a + b; }   // ❌ same name, same parameters
// error: method add(int,int) is already defined in class Calculator
```

### Which overload wins when several would fit

The examples above matched exactly, so there was nothing to decide. The interesting case is `add(1, 2)` when no overload takes `(int, int)` — several could still accept the call, since an `int` can become a `long`, or an `Integer`, or an element of an `int...`. Java does not pick "the closest one" by feel; it runs three passes in a fixed order and stops at the first that produces a match:

| Pass | What Java tries | Example that wins here |
|---|---|---|
| 1 | Exact match, or **widening** a primitive to a larger one | `add(long, long)` |
| 2 | **Boxing / unboxing** — wrapping the primitive in its wrapper class | `add(Integer, Integer)` |
| 3 | **Varargs** — collecting the arguments into an array | `add(int...)` |

Read the table top-down as a priority list, not as three independent options: if pass 1 finds a candidate, passes 2 and 3 never run, even when a "more obvious-looking" overload lives down there. So with `add(long, long)` and `add(Integer, Integer)` both declared, `add(1, 2)` calls the **`long`** version — widening beats boxing. The ordering is not arbitrary: widening a primitive is free at runtime, boxing allocates an object, and varargs allocates an array, so Java prefers the cheapest conversion it can get away with. The whole decision happens at **compile time**, purely from the declared types at the call site.

The failure mode is two overloads that are equally good in the same pass, with neither reachable without a conversion the other also needs:

```java
static void add(int a, long b) { }
static void add(long a, int b) { }

add(1, 2);   // ❌ neither is preferable — each needs one widening
// error: reference to add is ambiguous
//   both method add(int,long) in Calculator and method add(long,int) in Calculator match
```

> **How to unstick an ambiguous call.** Do not delete an overload — make the call site say which one you mean by giving the arguments their exact declared types: `add(1, 2L)` picks `add(int, long)` with no conversion needed on the second argument, so pass 1 finds a single winner. The general lesson is that overload resolution reads *declared types*, never values, which is also why `add(1, 2)` and `add(x, y)` can resolve differently when `x` and `y` are declared `long`.

> **Overloading vs overriding — don't confuse them.** They sound alike and both involve "two methods with the same name", but they are opposite ideas. **Overloading** (this section) is *one* class defining several versions of a method that differ in their parameters — the choice is made at compile time by the arguments you pass. **Overriding** is a *subclass* replacing a method it inherited from its parent, keeping the *exact same* parameters, to change the behaviour — the choice is made at run time by the object's real type. Rule of thumb: same name + different parameters + same class = overloading; same name + same parameters + subclass = overriding. Overriding is covered in [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md).

---

## Varargs — variable number of arguments

> Docs: https://www.baeldung.com/java-varargs → read: "Use of Varargs" and "Rules"

Normally a method with two parameters demands exactly two arguments. Varargs (`...`) let you pass any number instead — zero, one, five, as many as you like — and Java collects them into an array internally. You will see this in utilities like `String.format()` — the same pattern as the `.formatted()` you saw in [01-variables-types.md](01-variables-types.md) — and in logging frameworks, where `log.info("User {} not found", id)` takes the message plus a varargs list of values to slot into each `{}`.

> **Preview — logging:** `log` is not a Java language feature. It is an SLF4J logger, the logging library Spring Boot ships with, and the `{}` placeholder style is that library's own. It appears here only because it is the varargs API you will meet most often in a real backend — you will set it up properly in the Spring Boot notes.

The syntax is `Type... name`, and it must be the **last** parameter of the method. The reason is that Java has to know where the variable-length list ends: if a fixed parameter came after it, Java could not tell which argument belongs to the varargs list and which is the next fixed argument.

```java
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) total += n;  // numbers is an array — iterate with for-each just like any array
    return total;
}

sum(1, 2);           // 3
sum(1, 2, 3, 4, 5);  // 15
sum();               // 0
```

Inside the method, `numbers` does not merely "behave like" an array — it **is** one. `int... numbers` and `int[] numbers` are the same parameter as far as the method body is concerned; the `...` only changes what the *call site* is allowed to look like. Java builds the array for you at the point of the call and hands it over. Two consequences follow directly, and both are things a junior gets wrong once:

**An existing array can be passed straight in.** Since the parameter is an `int[]`, you may skip the collecting step and hand over an array you already have — no unpacking, no loop:

```java
int[] scores = {1, 2, 3};
sum(scores);   // 6 — the array IS the varargs parameter
```

**A zero-argument call gives you an empty array, never `null`.** This is the trap: it looks like "nothing was passed", so the instinct is to null-check. Java guarantees an array of length `0` instead, which is why the `for (int n : numbers)` in `sum()` above simply runs zero times and returns `0` rather than throwing.

```java
sum();                       // 0 — numbers.length == 0
// numbers == null           // ❌ never true; a null-check here is dead code
```

> **Why an empty array instead of `null`?** Because the whole point of varargs is that the method body should not care how it was called. If a zero-argument call produced `null`, every varargs method would have to open with a defensive `if (numbers == null)` before it could loop, and forgetting it would mean a `NullPointerException` on the *easiest* call of all. Handing over an empty array makes the no-arguments case the same code path as every other case. (You *can* still force a `null` in by passing one explicitly — `sum((int[]) null)` — but that is you overriding the guarantee, not Java breaking it.)

### The same mechanism in the standard library

> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → read: "Arbitrary Number of Arguments" — three paragraphs, and the `printf` signature at the end is the one you already use every day.

You have been calling varargs methods since your first `System.out.printf`, so it is worth opening the two you will meet most and seeing the `...` in their real declarations. Both are one mechanism, not two conventions that happen to look alike:

```java
public static String format(String format, Object... args)   // java.lang.String
static <E> List<E> of(E... elements)                          // java.util.List
```

`String.format("Hi %s, you have %d messages", name, count)` compiles into exactly one call with two arguments: the format `String`, and an `Object[]` of length 2 that Java built at the call site. `List.of("a", "b", "c")` is the same move — the three strings are boxed into an array and handed over as one parameter — which is the whole reason both accept "any number" without declaring hundreds of versions.

> **`List` and the `<E>` are not this chapter's, and you can read the line without them.** `List.of` appears here purely as a varargs declaration you will recognise. What a `List` actually is arrives in [10-collections.md](10-collections.md), and the `<E>` — a *type parameter*, the placeholder that lets one declaration work for `String`, `Integer` or anything else — is [09-generics.md](09-generics.md)'s. For now read `static <E> List<E> of(E... elements)` as "hand it any number of items of one type and get a list of them back".

There is one detail in `List.of` that ties this section back to the last one, and it is the kind of thing that looks like a mistake until you know the resolution rules. Java declares `of` **twelve** times: eleven fixed-arity versions from `of()` up to `of(E e1, ..., E e10)`, *plus* the varargs `of(E... elements)`. Why bother, when the varargs one alone would accept every call?

Because of pass 3. Overload resolution only reaches varargs after passes 1 and 2 have failed, so `List.of("a", "b")` matches the fixed two-parameter `of(E e1, E e2)` in pass 1 and stops there — no array is ever allocated. Only `List.of` with eleven or more elements falls through to the varargs version and pays for the array. The eleven extra declarations exist to make the common short calls free, and the resolution order from the previous section is what makes that optimisation invisible to you at the call site.

> **This is why `sum(scores)` and `sum(1, 2, 3)` can both compile.** The array-passing shortcut earlier in this section is the same fact seen from the other end: pass 3 does not *convert* your arguments into an array so much as *accept* one, and if you already hold an `int[]` there is nothing left to build. One mechanism, two call shapes.

---

## Calling methods

> 📖 Docs: [Oracle Docs — Defining Methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) → read: "Naming a Method" and the two paragraphs above it on calling — then jump to [Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → read: "Parameter Names", which is the shadowing rule behind every `this.name = name;` you are about to see.

Before looking at how a method is called, let's put everything so far into one complete example — first the class with its methods, then how we use them from the outside:

```java
public class Calculator {
    // fields of the class — state each object carries; covered in 06-oop-classes.md
    private String name;
    private List<String> history = new ArrayList<>();

    // constructor — runs when you do new Calculator("MyCalc"); covered in detail in 06-oop-classes.md
    public Calculator(String name) {
        this.name = name;
    }

    // Instance method — needs the object, because it reads this.name
    public String getName() {
        return this.name;
    }

    // Instance method too — it appends to this calculator's own history
    public int add(int a, int b) {
        int result = a + b;
        this.history.add(this.name + ": " + a + " + " + b + " = " + result);
        return result;
    }

    // Static method — depends only on its argument, so no object is needed
    public static double square(double n) {
        return n * n;
    }
}
```

Each method is now the right kind for what it does, and that is the point of the example: `add()` touches `this.name` and `this.history`, so it *must* be called on a particular calculator; `square()` touches nothing but its argument, so it is declared `static` and needs no object at all. What `static` actually means, and why that split is a design decision rather than a matter of taste, is settled in [06-oop-classes.md](06-oop-classes.md) — here it is only marking which of the two call shapes below each method takes.

> `List<String>` and `ArrayList` are Java's growable list — covered in full in [10-collections.md](10-collections.md). For now read it as "an array that can grow", and `history.add(...)` as "append one item to the end".

Calling them:

```java
// Instance method — you must create an object first
Calculator calc = new Calculator("MyCalc");
int result = calc.add(3, 4);           // 7
String name = calc.getName();          // "MyCalc"

// Static method — called directly on the class, no object
double squared = Calculator.square(5); // 25.0

// Method chaining — each call returns a value you can immediately call the next method on
String result2 = "  hello  "
    .trim()
    .toUpperCase()
    .replace("HELLO", "HI");           // "HI"
```

That last one is **method chaining**, and it works for a specific reason rather than by syntax magic. Each of those `String` methods returns a *new* `String` — `String` is immutable, so `trim()` cannot edit `"  hello  "` in place and instead produces `"hello"` as a separate object (the mechanism is worked through in [01-variables-types.md](01-variables-types.md): every "modification" of a String allocates a new one). Because the expression `"  hello  ".trim()` therefore *is* a `String`, you can put `.toUpperCase()` straight after it, and so on down the chain. Chaining is nothing more than calling a method on the value the previous call returned; it reads as one operation but is four calls creating four objects. Any method that returns an object can be chained the same way — this is exactly how `ResponseEntity.noContent().build()` above worked.

---

## Packages and imports

> 📖 Docs: [Oracle Docs — Creating and Using Packages](https://docs.oracle.com/javase/tutorial/java/package/packages.html) → read: "Creating a Package" — what a package is and why the reversed-domain naming exists.
> 📖 Docs: [Oracle Docs — Using Package Members](https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html) → read: "Referring to a Package Member by Its Qualified Name", "Importing a Package Member" and "Name Ambiguities" — the three cases below, in the compiler's own wording.

A method has a name. So does the class holding it. Once a project grows past a handful of files those names start colliding: your `User` and the `User` some library ships are both called `User`, and Java has to be able to tell one from the other or it cannot compile a single call. That is the problem **packages** solve, and it is why every real Java file opens with a line you have been ignoring so far.

A package is a **namespace** — a prefix that turns a short, reusable name into a globally unique one. You declare it on the first line of the file:

```java
package com.victor.timetrack.service;

public class ProjectService {
    public ProjectResponse getById(Long id) { ... }
}
```

That class's real, unambiguous name is now `com.victor.timetrack.service.ProjectService`. Java calls that the **fully qualified name**: the package, a dot, and the class's own name. The short `ProjectService` is its **simple name**. Both refer to the same class; the fully qualified one is what Java actually works with internally.

> **The `com.victor` prefix is an internet domain written backwards, and that convention has one job.** Packages are only useful if two organisations never accidentally choose the same one, so the convention is to start from a domain you control and reverse it: `victor.com` becomes `com.victor`. Nothing enforces it — the compiler accepts `package banana;` without complaint — but every library you will ever add follows it, which is why you read `org.springframework.stereotype`, `com.fasterxml.jackson.databind` and `java.util`. The reversal puts the most general part first so the whole tree sorts sensibly.

### The package line and the folder structure are one fact written twice

The package declaration is not free-form: the folders on disk must mirror it, one folder per dot. This is what the TimeTrack backend actually looks like, and you can read each package name straight off its path:

```
src/main/java/
  └── com/
      └── victor/
          └── timetrack/
              ├── controller/    → package com.victor.timetrack.controller;
              ├── service/       → package com.victor.timetrack.service;
              ├── model/         → package com.victor.timetrack.model;
              ├── repository/    → package com.victor.timetrack.repository;
              ├── exception/     → package com.victor.timetrack.exception;
              ├── dto/
              │   ├── request/   → package com.victor.timetrack.dto.request;
              │   └── response/  → package com.victor.timetrack.dto.response;
              └── config/, security/, util/   → same rule, one package each
```

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

Read the path and the declaration together: everything after `src/main/java/` **is** the package name, with `/` swapped for `.`. Note also that `dto.request` is not a "sub-package" of `dto` in any technical sense — Java has no nesting relationship between packages, and `com.victor.timetrack.dto.request` gets no special access to `com.victor.timetrack.dto`. The dots only look like a hierarchy; to the compiler each package is a flat, independent name that happens to share a prefix with its neighbours.

That path-equals-name rule is the mechanism behind an error you will hit the first time you drag a file between folders in IntelliJ and fix the `package` line by hand:

```java
// the file now sits in .../timetrack/service/ but its first line still says:
package com.victor.timetrack.controller;
```

Two different tools complain, at two different moments, and knowing which is which saves you the hunt. IntelliJ flags the file itself straight away, with `Package name 'com.victor.timetrack.controller' does not correspond to the file path 'com.victor.timetrack.service'`. The compiler says nothing about that line — it happens on the *other* side, in every file that tried to use the class under the name its folder implies: `error: cannot find symbol` on the type, or `error: package com.victor.timetrack.service does not exist` on the import. The class did not disappear; it is simply not at the address everyone is looking it up by.

> **Why does Java care where the file physically sits?** Because that is how it finds classes. When your code names `com.victor.timetrack.model.Project`, the compiler does not scan every file looking for a matching class — it converts the name into a path, `com/victor/timetrack/model/Project.class`, and looks exactly there. The lookup is a direct address translation, which is why it stays instant in a project with ten thousand classes, and why a file in the wrong folder is not "hard to find" but simply invisible. IntelliJ's **Refactor → Move** (`F6`) exists precisely to move the file and rewrite the line in one step; moving it in the file explorer and patching the line afterwards is how the mismatch happens in the first place.

### Imports — a nickname, resolved at compile time

Fully qualified names are correct and unreadable. You *can* write code with them, and it compiles:

```java
// ✅ legal, and nobody writes this
com.victor.timetrack.model.Project project = new com.victor.timetrack.model.Project();
```

An **import** lets you use the simple name instead. It goes after the `package` line and before the class, and this is the real opening of the TimeTrack service you have already read twice in this file:

```java
package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    public List<ProjectResponse> getAll() { ... }   // ✅ simple names throughout
}
```

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

> **An import does not copy anything into your file, and it costs nothing at runtime.** This is the single most common misreading of the keyword, and it comes straight from JavaScript, where `import { x } from './y'` genuinely pulls a module in and the bundler tracks every one. Java's `import` is pure bookkeeping for the compiler: it says "in this file, when I write `Project`, I mean `com.victor.timetrack.model.Project`". By the time the file has become a `.class`, every name inside it has already been rewritten to its fully qualified form and the import line no longer exists. So an unused import is untidy, never slow; `import java.util.*;` does not "load a whole package"; and deleting an import can never change what your program does at runtime — only whether it compiles.

Three cases need no import at all, and knowing which is why `String` has never asked you for one:

| Case | Example | Why no import is needed |
|---|---|---|
| Classes in `java.lang` | `String`, `Integer`, `System`, `Object`, `Math` | Java imports `java.lang.*` into every file automatically |
| Classes in the **same package** | `ProjectService` using `AuthenticatedUserProvider` | Same namespace, so the simple name is already unambiguous |
| A fully qualified use | `java.sql.Date now = ...` | You spelled the whole name, so there is nothing to translate |

Read the table as three different reasons a simple name can already be unambiguous — they are not ranked, and you do not choose between them. The first row is the one to memorise: `java.lang` holds the classes no program can avoid, so the language hands them over for free. That is the entire reason `System.out.println` works in a file with no imports, and why `Integer.parseInt` back in [01-variables-types.md](01-variables-types.md) never needed one either. The second row is why `ProjectService` imports `Project` and `ProjectRepository` but never imports `AuthenticatedUserProvider` — that class lives in `com.victor.timetrack.service` as well.

### When two classes share a simple name

Sooner or later you need both `java.util.Date` and `java.sql.Date` in one file. Importing both is not a judgement call the compiler makes for you — it refuses outright:

```java
import java.util.Date;
import java.sql.Date;   // ❌
// error: a type with the same simple name is already defined by the single-type-import of Date
```

Inside one file, one simple name means exactly one class, always. The fix is to import whichever you use most and spell the other one out in full at the two or three places it appears:

```java
import java.util.Date;

Date utilDate = new Date();                          // ✅ the imported one
java.sql.Date sqlDate = new java.sql.Date(millis);   // ✅ fully qualified, no ambiguity
```

> **`import java.util.*;` is not a shortcut worth taking, and this rule is why.** A wildcard import brings in every class of a package under its simple name, so adding one is quietly volunteering for a clash with any other package imported the same way — and the clash can appear the day a *library upgrade* adds a class you never wrote, in code you never touched. IntelliJ writes explicit single-type imports by default and only collapses them past a threshold you can raise (`Settings → Editor → Code Style → Java → Imports`). Keep them explicit: the import block then doubles as an honest summary of what the file depends on, which is the first thing you read when you open an unfamiliar class.

---

## `null`, `NullPointerException`, and where to reject a missing argument

> 📖 Docs: [Oracle Docs — `java.lang.NullPointerException`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html) → read: the "Implementation Note" at the bottom — it is two sentences, and it is the official statement that the modern message is computed for you rather than written by hand.
> 📖 Docs: [Oracle Docs — `java.util.Objects.requireNonNull(T, String)`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html) → read: the `requireNonNull(T obj, String message)` entry — "designed primarily for doing parameter validation in methods", which is exactly the use below.
> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → read: the opening sections on where null values come from and on validating method arguments.

[03-control-flow.md](03-control-flow.md) left you with the null guard — the plain `if (name != null)` that stops a crash — and deferred one question to this chapter, because it is not a question about `if` at all: **where** in a program should a missing value be rejected? That is a question about the contract between a method and its caller, which is what this whole chapter has been about, so it belongs here.

`null` means "this reference points at no object". It is a legal value for any reference type — `String`, `Project`, `Integer`, an array — and never for a primitive; `int x = null;` does not compile, because an `int` variable holds a number directly and there is no "points at nothing" state for a number to be in. The failure happens the moment you **dereference** a `null` reference — that is, follow the arrow to reach something on the other end: calling a method on it, reading a field of it, indexing into it as an array. There is nothing at the other end, so the JVM stops the thread and throws a `NullPointerException`.

```java
String name = null;
name.toUpperCase();   // ❌ NullPointerException at runtime — the file compiles fine
```

> **Why is this a runtime failure and not a compiler error?** Because the compiler tracks *types*, not *values*. It knows `name` is a `String`, and `String` has a `toUpperCase()`, so the call is type-correct and the file compiles. What it cannot know is which of the many paths through your program actually reaches that line, and with what value in the variable — `name` might be a database result, a request body field, a lookup that found nothing. Nullness is a property of the run, not of the type, so it is checked when the arrow is actually followed. And that is why nothing in the syntax warns you: the dangerous line looks exactly like the safe one.

### The real problem: the crash names the wrong line

The exception itself is never the hard part. The hard part is that a `null` travels silently, and the crash happens wherever it is first *used* — which can be several methods away from wherever it was first *accepted*. Here is that gap, made small enough to see all at once:

```java
public class Report {
    static String slug(String title) {
        return title.toLowerCase().replace(' ', '-');   // line 3 — the crash lands here
    }
    static String buildPage(String title) {
        return "<h1>" + slug(title) + "</h1>";          // line 6 — passed it along
    }
    public static void main(String[] args) {
        String titleFromRequest = null;                 // line 9 — the real culprit
        System.out.println(buildPage(titleFromRequest)); // line 10
    }
}
```

Run it and Java tells you this, verbatim:

```
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toLowerCase()" because "title" is null
	at Report.slug(Report.java:3)
	at Report.buildPage(Report.java:6)
	at Report.main(Report.java:10)
```

Read the two halves separately, because they answer different questions. The **message** answers *what went wrong*: `Cannot invoke "String.toLowerCase()" because "title" is null` — the method you tried to call, and the exact expression that was `null`. The **stack trace** below it answers *where you were*: the list of methods that were in progress, most recent first, so `slug` was running, called from `buildPage`, called from `main`.

Now notice the trap. The trace's top line is `Report.java:3`, and that line is not wrong in any way — `slug` is a fine method that was handed a bad value. The mistake was made at line 9, two frames further down, and nothing in the report points at it. On a real backend those three frames are more like fifteen, spread over a controller, two services and a mapper, and the file the trace opens is a file you had no reason to suspect.

> **The message is computed for you, and it is younger than most tutorials.** Before Java 14 that first line read exactly `java.lang.NullPointerException` and nothing else — no method name, no variable — so a line with three chained calls gave you no way to know which link was null. Modern Java walks the bytecode of the failing instruction to reconstruct a description of the expression that was `null`, which is why you now get `because "title" is null` for free. One wrinkle worth knowing: the name it prints depends on what the compiler recorded. With the debug information IntelliJ and Maven include by default you get the real name, `"title"`. Compiled without it, the same failure prints `because "<parameter1>" is null` — same mechanism, less to go on.

### The fix: reject the missing value at the boundary that requires it

The lesson is not "add more null checks". Sprinkling `if (x != null)` down every method hides the bug instead of reporting it, and produces the second-worst outcome: a page that renders `<h1>null</h1>` and nobody notices for a month.

The lesson is **where**. A method that cannot do its job without an argument should say so *on entry*, before doing anything else — this is the **guard clause** shape you already met under §"Return types", now applied to the method's contract rather than to its control flow. The right boundary is the outermost method that declares the value as required. In the example that is `buildPage`, the public entry point of this little feature: it is the one whose contract says "give me a title and I give you a page".

```java
import java.util.Objects;

static String buildPage(String title) {
    Objects.requireNonNull(title, "title must not be null");   // ✅ the boundary
    return "<h1>" + slug(title) + "</h1>";
}
```

Run it again with `null` and the report changes completely:

```
Exception in thread "main" java.lang.NullPointerException: title must not be null
	at java.base/java.util.Objects.requireNonNull(Objects.java:246)
	at Report2.buildPage(Report2.java:8)
	at Report2.main(Report2.java:13)
```

Two things improved, and both matter more than they look. The message is now a sentence *you* wrote, naming the parameter that was missing instead of describing a method call that happens to have failed. And the trace is three lines long, with `Report2.main(Report2.java:13)` — the actual culprit, the line that passed the `null` — sitting right there as the second frame. You are not debugging any more; you are reading.

> **`Objects.requireNonNull(x, "…")` is declared scaffolding in this chapter, and here is exactly what it does.** It is an ordinary `static` method in `java.util.Objects` that takes your value and a message. If the value is not `null` it hands it straight back and execution carries on as though the line were not there; if it *is* `null` it raises the `NullPointerException` with your message as its text. That is the whole behaviour, and it is all you need to read and write the line. What "raise" means mechanically — the `throw` keyword, what an exception object is, how it unwinds the stack, and when to catch one — is [11-exceptions.md](11-exceptions.md)'s subject and is not assumed here. Use the one-line form for now; the chapter that owns the machinery will come back for it.

> **Why prefer it over `if (title == null) { ... }`?** Nothing is wrong with the `if` — the two are equivalent and Baeldung shows both. `requireNonNull` wins on three small counts that add up across a codebase: it is one line instead of three, so a constructor validating four parameters stays readable; the name states the *intent* ("this is required") where an `if` only states a mechanism; and it **returns the value**, which lets you validate and assign in one expression — `this.field = Objects.requireNonNull(field, "…");`. That assigning form is the one you will meet most often, because the sharpest boundary in real code is the one where an object is built. TimeTrack uses it exactly there:

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/InvalidPasswordException.java`

```java
public class InvalidPasswordException extends RuntimeException {
    private final String field;

    public InvalidPasswordException(String field, String message) {
        super(message);
        this.field = Objects.requireNonNull(field, "field must not be null");
    }
}
```

> **That snippet uses a constructor, and constructors are [06-oop-classes.md](06-oop-classes.md)'s.** Read it here only for *where the check sits*: on the way in, before the value is stored. Why the object-building boundary is the strongest one available — an object that could never be valid is refused before it exists, instead of failing later in whichever consumer happens to touch it first — is a rule about class invariants, and that is the chapter that states it. `extends RuntimeException` is [11-exceptions.md](11-exceptions.md)'s.

### The three rules worth carrying out of this section

Read these as one decision made in three places, not as a checklist:

1. **Validate what you require, at the outermost method that requires it.** One check at the boundary beats five defensive checks downstream, because the downstream methods can then be written as if their arguments are always present — which is what makes `slug(String title)` above a two-line method instead of a four-line one.
2. **Do not guard a value that is genuinely optional.** Absence is sometimes the correct answer — a middle name, a description nobody filled in — and rejecting it turns valid input into a crash. When absence is a normal outcome rather than a mistake, the tool is `Optional<T>` rather than a guard, and it is covered in [12-streams-lambdas.md](12-streams-lambdas.md).
3. **Never return `null` from a method to mean "nothing found".** You are then handing the caller the same trap this section is about, and the crash will name their line, not yours. Return an empty collection, an `Optional`, or reject the call — anything that cannot be dereferenced by accident.

---

## Naming conventions

> Docs: https://www.baeldung.com/java-naming-conventions → read: "Methods" and "Variables"
> Docs: https://www.baeldung.com/java-pojo-javabeans-dto-vo → read: "JavaBeans" — the convention the callout below depends on

- Method names: `camelCase`, start with a verb — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Boolean getters: start with `is` or `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`

> **The get/set/is shape is not a style preference — libraries read it.** Java has a convention with a name, **JavaBeans**: a class with a no-argument constructor whose properties are reached through `getX()` / `setX()` / `isX()`. It matters because major libraries locate a property by *looking for those exact method names* at runtime. Jackson turns your object into JSON by finding `getName()` and publishing a `"name"` field — rename it to `fetchName()` and the field silently vanishes from the API response. JPA maps a `Project` row the same way. Lombok's `@Data`, which the TimeTrack DTOs use, exists precisely to generate this boilerplate for you: `@Data class ProjectResponse { private String name; }` compiles to a class with `getName()` and `setName()` already in it. So the convention is the contract three separate tools depend on, which is why breaking it produces bugs that look like magic.
>
> **File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/dto/response/ProjectResponse.java`

Those getters and setters are your first hint of a bigger pattern: methods rarely live alone — they wrap the *fields* of a class and guard how the outside world reads and changes them. That coupling of fields and methods, plus constructors, `static`, the access modifiers this chapter kept deferring, and encapsulation, is the whole subject of [06-oop-classes.md](06-oop-classes.md), where the `Calculator` you saw above becomes a proper class with state.

But one file comes first, and it answers a question this chapter deliberately left standing. You now know the full **contract** of a call: the signature the caller has to match, which overload wins when several could, what a `Type...` parameter really receives, the name the class is reached by, and where a required argument must be rejected. What you do not know is what physically *crosses* that boundary when the call happens. When you write `buildPage(title)`, is the `String` copied? Is `Project` copied? Where does the guarded value actually live while `slug` is running, and how does Java know which line to come back to when it returns — the same stack trace you just read three times in the `null` section? [05-memory-model.md](05-memory-model.md) opens the method boundary and draws it: the stack and the heap, what a reference is, what gets copied into a parameter and what does not, and why "Java is always pass-by-value" is the sentence that settles every version of that argument.
