## Index of this note

- [Methods](#methods)
- [Method declaration](#method-declaration)
- [Return types](#return-types)
- [void vs Void](#void-vs-void)
- [Method overloading](#method-overloading)
  - [Which overload wins when several would fit](#which-overload-wins-when-several-would-fit)
- [Varargs — variable number of arguments](#varargs--variable-number-of-arguments)
  - [The same mechanism in the standard library](#the-same-mechanism-in-the-standard-library)
- [Calling methods](#calling-methods)
- [Packages and imports](#packages-and-imports)
  - [The package name and the folder path match, one folder per dot](#the-package-name-and-the-folder-path-match-one-folder-per-dot)
  - [Imports — using the simple name, resolved at compile time](#imports--using-the-simple-name-resolved-at-compile-time)
  - [When two classes share a simple name](#when-two-classes-share-a-simple-name)
- [`null`, `NullPointerException`, and where to reject a missing argument](#null-nullpointerexception-and-where-to-reject-a-missing-argument)
  - [The real problem: the crash names the wrong line](#the-real-problem-the-crash-names-the-wrong-line)
  - [The fix: reject the missing value at the boundary that requires it](#the-fix-reject-the-missing-value-at-the-boundary-that-requires-it)
  - [Three rules for a `null` at a method boundary](#three-rules-for-a-null-at-a-method-boundary)
- [Naming conventions](#naming-conventions)
- [What this unlocks](#what-this-unlocks)

# Methods

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → read the full article
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (official reference)

[03-control-flow.md](03-control-flow.md) ended on calls to methods you could read but had not written yourself: `loadPage(page)`, `isApproved(emp, day)`, `firstOvertimeName(employees)`. Each of those calls invokes a **method**. The `main` that every runnable example sits inside and the `System.out.println` you have been calling since [00-intro-java.md](00-intro-java.md) are methods too. In this chapter we will see how a method is written, and the contract a caller has to satisfy before a call to it compiles at all. That contract is the method's **interface**: its name, its parameters and its return type. Do not confuse it with Java's `interface` keyword, which is something else and is explained in [07-interfaces-abstract.md](07-interfaces-abstract.md).

The chapter first takes a method declaration apart and shows which of its parts the compiler checks at every call. Next it looks at what a method can hand back, and at what happens when a method is declared `void` and hands back no value. After that come the ways to call two methods that share the same name but take different arguments. Along the way we will study two different mechanisms: overloading and varargs. When we study these two mechanisms we will see the rule the compiler follows to decide which method a call runs when several share a name. Then you call methods on an object and on a class, and see what a **package** is — the folder a class belongs to — and how an `import` lets you use a class from another package by writing just its name, instead of its full name, which starts with the package it belongs to. The chapter closes with an error the compiler cannot detect: passing `null` as an argument to a method that needs a real value. That failure only shows up when the program runs, at runtime, so you will see where to check for that `null`: at the start of the method that receives it, so the error is raised right there and not later, somewhere else in the code.

## Method declaration

> Docs: https://www.baeldung.com/java-method-signature-return-type → read the whole page: it is short and settles exactly which parts of a declaration make up the signature

> **Where do methods live?** Methods always live inside a class: in Java they cannot exist outside one. We cover them here, before full classes, because you have already met them in the examples of [03-control-flow.md](03-control-flow.md). The full structure of a class (fields, constructors, methods, encapsulation, etc.) is covered in [06-oop-classes.md](06-oop-classes.md).

A method is a block of code that performs one specific task and carries a name that describes that task. You define it once and call it wherever that task has to be done.

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

Parameter and argument are two words that are often mixed up, but in Java they name different things. A **parameter** is a variable declared between the parentheses of the method declaration. The `add` above has two: `int a` and `int b`, that is, the parameter `a` and the parameter `b`, both of type `int`. A parameter exists only inside its method: the body of `add` can use the parameters `a` and `b`, but outside `add` those names mean nothing. That is because of their _scope_, the part of the code in which a variable exists, which you met in [01-variables-types.md](01-variables-types.md): a parameter's scope is the whole body of its method. An **argument** is the actual value we give a parameter at the moment we call the method — the `3` and the `4` in `add(3, 4)`. When the call runs, Java stores each argument in the parameter at the same position: in `add(3, 4)`, the first argument goes to the first parameter and the second to the second, so `a` holds `3` and `b` holds `4`. Both the word "parameter" and the word "argument" appear later in this file, and the compiler uses both words in its error messages too.

Of the four parts that make up a method declaration (the access modifier, the return type, the method name and the parameters), three decide how every call has to be written: the method name, the parameter list and the return type. Together, those three parts are the **contract** the caller of the method has to satisfy, and the compiler checks it call by call before your program ever runs. The parameter list fixes how many arguments you must supply at the moment of the call and what type each of those arguments must be. The method name plus that parameter list is what Java looks the method up by. And the return type decides what the call site is allowed to do with the result. If one of these three parts is not right in the call, then the file does not compile. The fourth part, the access modifier, is checked by the compiler too, but it decides something else: which classes may call the method. That is why it is not part of the call's contract, and it is explained in [06-oop-classes.md](06-oop-classes.md). The example below goes back to the three parts of the contract: it shows one correct call and three that do not compile because they break the parameter list or the return type. The error messages name `Calculator` because that is the class these `add` examples live in, shown whole in the section [Calling methods](#calling-methods):

```java
public int add(int a, int b) { return a + b; }

add(3, 4);              // ✅ two ints, exactly as declared
add(3);                 // ❌ error: method add in class Calculator cannot be applied to given types;
                        //    required: int,int   found: int   reason: actual and formal argument lists differ in length
add("3", "4");          // ❌ error: incompatible types: String cannot be converted to int
String s = add(3, 4);   // ❌ error: incompatible types: int cannot be converted to String
```

Read the four lines as one rule seen from four sides: a call compiles when the arguments match the parameter list in number and type, and when whatever you do with the result matches the return type. Nothing about the *values* is checked — only the declared types, which is why every one of these errors arrives before the program runs.

> **The signature — the part of a method Java uses to identify it.** A method's **signature** is its name plus the type and order of its parameters: `add(int, int)`. The parameter names are not part of it, so `add(int a, int b)` and `add(int x, int y)` have the same signature: all Java cares about is that there are two `int`s, in that order. The return type is *not* part of the signature, and neither is the access modifier. This sounds like trivia now, but it is the exact rule that decides which method Java calls when several share a name (you will see it below, in the section [Method overloading](#method-overloading)) and which method a subclass replaces (`08-inheritance-polymorphism.md`). Every time this file says "the signature", it means that name-plus-parameter-types fingerprint.

The `return` statement does two things at once: it hands the value back to whoever called the method and *it exits the method immediately, right there*. Nothing after the `return` runs: the next line to run is the line that called the method, which continues with whatever value the method returned. Putting a `return` in the body of a method is not always required: in a method whose return type is `void` you can leave it out, because the method ends on its own when it reaches its closing brace. A method that declares a return type other than `void`, on the other hand, needs a `return` on every possible exit path, as you will see right after the example.

```java
public int add(int a, int b) {
    return a + b;
    System.out.println("done");   // ❌ error: unreachable statement
                                  //    the method already finished at the return and would never reach this line
}
```

The fact that `return` leaves the method immediately can also be put to use: you can write a `return` before the end of the method to finish it early, as soon as you already have the result. You will see it in the section [Return types](#return-types). What you cannot do is leave a path without a `return`: if you declare a return type other than `void`, **every** path out of the method must hand back a value of that type. If you miss one, the file does not compile:

```java
public int getAgeOrZero(Integer age) {
    if (age != null) {
        return age;
    }
    // no else, no return here
}
// error: missing return statement
```

> **Why does the compiler refuse instead of just returning 0?** Because the method declares that it returns an `int`, and whoever calls it relies on that: if they write `int x = getAgeOrZero(null);`, they expect `x` to receive an `int` worked out by the method. If Java returned some value on its own, for example `0`, `x` would end up holding `0` without you having decided it, and the program would keep running on false data without warning you. That is exactly the kind of bug that is the reason static typing exists. The compiler traces every branch and, finding one that reaches the closing brace with nothing returned, stops the build. The fix is to return something on that path too, never to remove the return type:
>
> ```java
> public int getAgeOrZero(Integer age) {
>     if (age != null) {
>         return age;
>     }
>     return 0;   // ✅ the missing path now returns an int too
> }
> ```
>
> Now `getAgeOrZero(null)` returns `0` and `getAgeOrZero(30)` returns `30`. The difference from what Java would do on its own is that you wrote this `0` yourself, on purpose, and the method's name already says that is what it returns when there is no age.

Leaving exit paths behind now, here are two more methods to practise reading the four parts of a declaration: a `void` one, which returns nothing, and one that returns a `double`:

```java
public void printName(String name) {
    System.out.println(name);
    // no return statement — void methods return nothing
}

public static double calculateTax(double price, double rate) {
    return price * rate;
}
```

> **Three things visible in that declaration are deliberately not this chapter's.**

> The first is `public`. It is an **access modifier**: the word that says *who is allowed to call* the
> method. The full set (`public`, `private`, `protected`, and writing no access modifier at all) is settled in
> [06-oop-classes.md](06-oop-classes.md), because visibility only becomes a real decision once a class
> has a state worth hiding, that is, data each of its objects keeps.

> The second is `static`, a word you will see on some declarations below: it changes whether you call
> the method on an object or on the class name, and it is also explained in
> [06-oop-classes.md](06-oop-classes.md), for the same reason.

> The third is what the method receives when you pass it an argument. The short answer is that it always
> receives a copy of the argument's value, which is why Java is said to pass arguments by value (_pass-by-value_). With an
> object, that value is its reference, so what gets copied is the reference, not the whole object. It is a typical interview question, and
> it is explained in [05-memory-model.md](05-memory-model.md), together with the stack and the heap, which
> it takes to understand it. Until then, read `public` as "callable from anywhere" and `static` as "called
> on the class name, not on an object". That is everything this chapter asks.

---

## Return types

> Docs: https://www.baeldung.com/java-missing-return-statement → read the whole page: every example is a variant of the "not every path returns" error, which is the rule this section is built on

The declaration section showed the return type as one third of the call contract. This section looks at what kinds of return type there are, and at what each one gives the line that made the call. The return type declares what kind of value the method hands back when it finishes. If a method computes nothing to give back — it just does something — its return type is `void`.

```java
public String getName() { return this.name; }   // returns a String
public int getAge() { return this.age; }         // returns an int
public boolean isActive() { return this.active; }// returns boolean — by convention, the method name starts with "is"
public void save(Employee e) { ... }             // returns nothing
public Employee findById(int id) { ... }         // returns an object of type Employee
public List<Employee> findAll() { ... }          // returns a collection where each element is an Employee
```

In these examples, `this.name` means "the `name` field of the object the method was called on". A field is a variable that belongs to an object and holds one of its pieces of data, such as an employee's name. `this` is the word Java uses to refer to that object. Fields and `this` are explained in full in [06-oop-classes.md](06-oop-classes.md). The `{ ... }` bodies are left out because only the return types matter here.

Read that list as three groups, not six lines. `getAge()` and `isActive()` return **primitives**, so whoever calls these methods receives the value itself, a number or a `boolean`. `getName()`, `findById()` and `findAll()` return **objects** (`String`, `Employee`, `List<Employee>`), so whoever calls these methods receives a *reference* — the memory address of an object — which is the value-versus-reference split you met in [01-variables-types.md](01-variables-types.md). That means an object is not copied when it is returned: `findById()` does not hand you a new `Employee`, but the address of an `Employee` that already exists in memory. Where values and objects are stored in memory, and exactly what is copied on each call, is explained in [05-memory-model.md](05-memory-model.md). `void` returns nothing at all, which is a category of its own.

> **A `void` method returns no value, but when it finishes, execution continues at the line that called it.** It is worth being precise, because "returns nothing" sounds as if it hands back some kind of empty thing. There is no value at all — not `null`, not an empty object — so the call is a _statement_, never an expression you can read a value from:
>
> ```java
> printName("Ana");               // ✅ a complete line: prints "Ana" and leaves nothing to store
> String s = printName("Ana");    // ❌ error: incompatible types: void cannot be converted to String
> ```
>
> The second line tries to store the result of `printName` in `s`, but there is no result to store. What does happen when any method finishes, a `void` one included, is that the next line to run is the one that called it. That is why a `void` method can also finish early with a bare `return;`, the statement you met in [03-control-flow.md](03-control-flow.md): it carries no value, but it ends the method right there. Writing `return something;` in a `void` method, on the other hand, fails with `error: incompatible types: unexpected return value`.

> **If a method returns an object, whoever calls it receives a reference to that same object, not a copy, and can change it.** For example, `getName()` is a method that returns the `name` field, of type `String`, and a `String` is an object. Whoever calls `getName()` cannot change that name, because a `String` is immutable: once created, no method can change its text, as you saw in [02-strings.md](02-strings.md). With a list it is the opposite, because a `List` is mutable: it has methods such as `add()` that change its contents. In the example below, `members` is a field of the `Team` class. When you create an object of that class (an _instance_) with `new Team()` and store it in the variable `team`, that object has its own `members` list. `getMembers()` returns a reference to that list, so whoever calls the method can reach it and change it from the outside:
>
> ```java
> public class Team {
>     private List<String> members = new ArrayList<>();
>
>     public List<String> getMembers() {
>         return this.members;   // returns the reference to the list the object itself keeps
>     }
> }
>
> Team team = new Team();
> team.getMembers().add("Ana");            // adds "Ana" to the list inside team
> System.out.println(team.getMembers());   // [Ana]
> ```
>
> Here `return members;`, without `this`, would do exactly the same: since no parameter or variable of the method is called `members`, Java understands you mean the field. `this` only becomes required when a parameter has the same name as the field, a case explained in [06-oop-classes.md](06-oop-classes.md). In the call below, `add("Ana")` was not called on a copy, but on the very list inside `team`, so the object's list has changed without any method of `Team` deciding to change it. Controlling which parts of an object can be read or changed from the outside is called **encapsulation**, and it is explained in [06-oop-classes.md](06-oop-classes.md).

Because `return` ends the method the moment it runs, you can use it to deal with the special cases first. The method checks at the start whether it is facing one of them and, if it is, returns its result and ends right there. That way, when execution reaches the method's normal work, it will no longer run into special cases, and that code does not have to sit inside an `else`. This way of writing a method is called **early return** (or *guard clause*), and you will read it in almost any real codebase. It shows up above all in the methods of Spring Boot's service classes, which are the classes where an application's business logic lives and which you will study in the Spring Boot notes:

```java
// MAL — with every new condition, the normal work ends up nested inside an if or an else
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

// BIEN — handles the special cases first and leaves with return; the normal work is not nested inside any if or else
public String describe(Employee e) {
    if (e == null) return "unknown";
    if (!e.isActive()) return e.getName() + " (inactive)";
    return e.getName() + " (active)";
}
```

Both compile and both return the same text for any value of `e`, `null` included. The difference shows when the method needs to check one more thing. In the first version, every new check adds another `if` with its `else`, and the code that was already there ends up nested inside it. In the second, one more line at the start is enough, for example `if (e.getAge() < 18) return e.getName() + " (minor)";`, and the rest of the method does not change. That is why the second one reads better: each special case takes its own line, the lines read top to bottom in the order they are checked, and to understand one of them you do not have to remember which `if` it sits inside. The second version also lets you see at a glance that it follows the rule you saw in the section _Method declaration_: if a method declares a return type other than `void`, every one of its exit paths must return a value of that type. Its last `return` sits inside no `if`, so it runs whenever execution reaches that line, and no path can reach the end of the method without having returned a value. This does not mean you should avoid `else` in general. What is redundant is the `else` that follows an `if` ending in `return`: if the `if` holds, the method has already ended, so the code you write after it only runs when the `if` does not hold, exactly as if it were inside the `else`. When neither branch ends the method and both prepare a value the method goes on working with, `else` is still the right way to write it, for example in `if (e.isActive()) { label = "active"; } else { label = "inactive"; }`.

---

## void vs Void

> Docs: https://www.baeldung.com/java-void-type → read the whole page: it is short, and covers why `Void` cannot be instantiated and why `null` is its only possible value

`void` (lowercase) is a Java **keyword** — it means a method returns nothing:

```java
public void delete(Long id) { ... }  // returns nothing
```

`Void` (uppercase) is a **class**, and although it looks like the wrapper classes you saw in [01-variables-types.md](01-variables-types.md), it is not one of them. It looks like one because it sits beside `void` the way `Integer` sits beside `int`. It is not one because a wrapper holds a value of its primitive inside an object: for example, the value `5`, which is an `int`, is held inside an `Integer` object. `void`, on the other hand, has no value to hold. Its own documentation calls it an "uninstantiable placeholder class": no `Void` object can ever be created, so the only value a variable of type `Void` can hold, or a method whose return type is `Void` can return, is `null`. It exists only so that a type can be written between `<>` when there is nothing to return. Those two signs, `<` and `>`, are called **angle brackets** in English, and _corchetes angulares_ in Spanish. Why is it needed at all? Because in some places Java forces you to put a type between `<>`, and Java only accepts a class there, never a primitive and never the `void` keyword. It is the same rule that made [01-variables-types.md](01-variables-types.md) write `List<Integer>` and never `List<int>`; what the `<>` means is [09-generics.md](09-generics.md)'s subject:

```java
ResponseEntity<Void>   // ✓ — Void is a class
ResponseEntity<void>   // ✗ — void is a keyword, not valid inside < >
```

> **Clearing up the confusion:** use `void` (lowercase) as the return type of a method. Use `Void` (uppercase) only when a generic forces you to put a type between the **angle brackets**, the `<>`. For example, the `delete` method of your TimeTrack project, which you will see a little further down in this same section, returns a `ResponseEntity<Void>`: the type between `<>` says what type the response body is, and since that response has no body, there is no value to fill that place. That is why writing `Void` between the `<>` is the right choice: the method still returns a `ResponseEntity`, and `Void` says that response travels with no body.
>
> The two also differ in how a method that uses them as its return type has to end. A `void` method returns no value, so it simply ends when it reaches its closing brace. If you want it to leave earlier, you can write `return;`, a `return` with no value that only ends the method. `Void`, on the other hand, is a class, so the compiler applies to it the rule you saw in the section _Method declaration_: every exit path has to return a value of that type. Since a `Void` object can never be created, the only value the method can return is `null`, so a `Void` method has to end with a `return null;`, and a `return;` with nothing after it will not do:
>
> ```java
> // void: returns no value, so it needs no return
> public void logDeletion(Long id) {
>     System.out.println("Deleted project " + id);
> }
>
> // Void: it is a class, so a value must be returned, and the only possible one is null
> public Void logDeletionAsVoid(Long id) {
>     System.out.println("Deleted project " + id);
>     return null;
> }
> ```
>
> If you delete the `return null;` from `logDeletionAsVoid`, compilation fails with the same `missing return statement` error you saw in the section _Method declaration_. If you replace it with a bare `return;`, the kind you would write in a `void` method, it fails with `incompatible types: missing return value`, because a `return` with no value is only allowed in a `void` method. You will never declare a `Void` method by choice, because `void` does the same without forcing you to return anything. You will meet it when a generic fixes a method's return type for you, and then that `return null;` is mandatory.

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

Sometimes you need several methods that do the same task with different data: for example, adding two `int`s, adding two `double`s or adding three `int`s. If each one had to carry a different name, you would have to create the methods `addInts`, `addDoubles` and `addThreeInts`, and everyone who calls these methods would have to remember which is which. Java lets all of them share the same name, `add`, because what identifies a method and tells it apart from the others is its signature, that is, the name *plus* the number, type and order of the parameters, not the name alone. That is **overloading**: several methods sharing the same name but having a different signature, so that you can use each one according to the data you are working with. You have already called an overloaded method in [02-strings.md](02-strings.md): `String.valueOf`, which turns the value you pass it into text. `String` does not have a single `valueOf` but one version for each type of value it can receive: `valueOf(int)`, `valueOf(long)`, `valueOf(double)`, `valueOf(boolean)`, `valueOf(char)` and `valueOf(Object)`, among others. They all share the same name, but `String.valueOf(38)` runs the version that receives an `int` and returns `"38"`, and `String.valueOf(true)` runs the one that receives a `boolean` and returns `"true"`. Java picks the right version from the arguments you pass:

```java
public int add(int a, int b) { return a + b; }
public double add(double a, double b) { return a + b; }
public int add(int a, int b, int c) { return a + b + c; }

add(1, 2);         // calls first version — returns 3
add(1.5, 2.5);     // calls second version — returns 4.0
add(1, 2, 3);      // calls third version — returns 6
```

Java decides which version to call by looking at the **parameters** — their number, types and order. The return type does not count for that decision, because it is not part of the signature. If you define two methods with the same parameters but different return types, Java cannot tell them apart and the code fails at compile time, before the program even runs. When you write `add(1, 2)` you never state a return type, so the parameters are the only signal Java has to tell the methods apart.

```java
public int add(int a, int b) { return a + b; }
public double add(int a, int b) { return a + b; }   // ❌ same name, same parameters
// error: method add(int,int) is already defined in class Calculator
```

### Which overload wins when several would fit

> 📖 Docs: [JLS §15.12.2 — Compile-Time Step 2: Determine Method Signature](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.2) → read: the opening paragraphs, down to "The third phase allows overloading to be combined with variable arity methods" — the official statement of the three passes and of why they run in that order.

The examples above matched exactly, so there was nothing to decide. The interesting case is `add(1, 2)` when no overload takes `(int, int)` — several could still accept the call, since an `int` can become a `long`, or an `Integer`, or an element of an `int...`. Java does not pick "the closest one" by feel; it runs three passes in a fixed order and stops at the first that produces a match:

| Pass | What Java tries | Example that wins here |
|---|---|---|
| 1 | Exact match, or **widening** — a primitive to a larger one, or a reference to a more general type such as `Object` | `add(long, long)` |
| 2 | **Boxing / unboxing** — wrapping the primitive in its wrapper class | `add(Integer, Integer)` |
| 3 | **Varargs** — collecting the arguments into an array | `add(int...)` |

Read the table top-down as a priority list, not as three independent options: if pass 1 finds a candidate, passes 2 and 3 never run, even when a "more obvious-looking" overload lives down there. So with `add(long, long)` and `add(Integer, Integer)` both declared, `add(1, 2)` calls the **`long`** version — widening beats boxing. The ordering is not arbitrary, and it is not about speed: boxing and varargs only arrived in Java 5, so the language placed them in later passes, which guarantees that every call that already compiled before Java 5 still selects the same method and never becomes ambiguous. The whole decision happens at **compile time**, purely from the declared types at the call site.

One pass can also find several candidates at once. With `add(long, long)` and `add(double, double)` both declared, `add(1, 2)` fits both in pass 1, because an `int` widens to either. Java then keeps the **most specific** one: the candidate whose parameter types could all be passed on to the other candidate. A `long` can be passed where a `double` is expected, but not the other way round, so `add(long, long)` is more specific and wins. It is the same rule that made `String.valueOf(null)` in [02-strings.md](02-strings.md) pick `valueOf(char[])` over `valueOf(Object)`: every `char[]` is an `Object`, but not every `Object` is a `char[]`.

The failure mode is two candidates in the same pass where neither is more specific than the other:

```java
static void add(int a, long b) { }
static void add(long a, int b) { }

add(1, 2);   // ❌ both fit in pass 1, and neither is more specific: (int, long) cannot
             //    be passed to (long, int), and (long, int) cannot be passed to (int, long)
// error: reference to add is ambiguous
//   both method add(int,long) in Calculator and method add(long,int) in Calculator match
```

> **How to unstick an ambiguous call.** Do not delete an overload — make the call site say which one you mean by giving the arguments their exact declared types: `add(1, 2L)` picks `add(int, long)` with no conversion needed on the second argument, so pass 1 finds a single winner. The general lesson is that overload resolution reads *declared types*, never values. With `int x = 1; long y = 2;`, the call `add(x, y)` passes the same numbers as the ambiguous `add(1, 2)` and still compiles, choosing `add(int, long)`, because the second argument is now declared `long`.

> **Overloading vs overriding — don't confuse them.** They sound alike and both involve "two methods with the same name", but they are opposite ideas. **Overloading** (this section) is *one* class defining several versions of a method that differ in their parameters — the choice is made at compile time by the arguments you pass. **Overriding** is a *subclass* replacing a method it inherited from its parent, keeping the *exact same* parameters, to change the behaviour — the choice is made at run time by the object's real type. Rule of thumb: same name + different parameters + same class = overloading; same name + same parameters + subclass = overriding. Overriding is covered in [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md).

---

## Varargs — variable number of arguments

> Docs: https://www.baeldung.com/java-varargs → read: "Use of Varargs" and "Rules"

Normally a method with two parameters demands exactly two arguments. Varargs (`...`) let you pass any number instead — zero, one, five, as many as you like — and Java collects them into an array internally. You have already met one: [02-strings.md](02-strings.md) showed that `.formatted()` is declared `formatted(Object... args)`, which is why it accepts any number of values, and those three dots are varargs. You will also see it in `String.format()`, and in logging frameworks, where `log.info(...)` takes the message plus, once you pass more than two values, a varargs list of values to slot into each `{}`.

> **Preview — logging:** `log` is not a Java language feature. It is an SLF4J logger, the logging library Spring Boot ships with, and the `{}` placeholder style is that library's own. It appears here only because it is the varargs API you will meet most often in a real backend — you will set it up properly in the Spring Boot notes.

The syntax is `Type... name`, and it must be the **last** parameter of the method. The reason is that Java has to know where the variable-length list ends: if a fixed parameter came after it, Java could not tell which argument belongs to the varargs list and which is the next fixed argument. The same reasoning allows only one varargs parameter per method. Put it anywhere else and the declaration itself is rejected, before any call exists: `void f(int... a, int b)` fails with `error: varargs parameter must be the last parameter`.

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

> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → read: "Arbitrary Number of Arguments" — three paragraphs, ending on the `printf` signature, a third method built on the same `Object...` parameter.

`.formatted()` is not the only varargs method you will call constantly, so it is worth opening the two you will meet most and seeing the `...` in their real declarations. Both are one mechanism, not two conventions that happen to look alike:

```java
public static String format(String format, Object... args)   // java.lang.String
static <E> List<E> of(E... elements)                          // java.util.List
```

`String.format("Hi %s, you have %d messages", name, count)` compiles into exactly one call with two arguments: the format `String`, and an `Object[]` of length 2 that Java built at the call site. `List.of` given eleven or more elements is the same move — the elements are collected into an array and handed over as one parameter — which is the whole reason both accept "any number" without declaring hundreds of versions.

> **`List` and the `<E>` are not this chapter's, and you can read the line without them.** `List.of` appears here purely as a varargs declaration you will recognise. What a `List` actually is arrives in [10-collections.md](10-collections.md), and the `<E>` — a *type parameter*, the placeholder that lets one declaration work for `String`, `Integer` or anything else — is [09-generics.md](09-generics.md)'s. For now read `static <E> List<E> of(E... elements)` as "hand it any number of items of one type and get a list of them back".

There is one detail in `List.of` that ties this section back to the last one, and it is the kind of thing that looks like a mistake until you know the resolution rules. Java declares `of` **twelve** times: eleven fixed-arity versions from `of()` up to `of(E e1, ..., E e10)`, *plus* the varargs `of(E... elements)`. Why bother, when the varargs one alone would accept every call?

Because of pass 3. Overload resolution only reaches varargs after passes 1 and 2 have failed, so `List.of("a", "b")` matches the fixed two-parameter `of(E e1, E e2)` in pass 1 and stops there — no array is ever allocated. Only `List.of` with eleven or more elements falls through to the varargs version and pays for the array. The eleven extra declarations exist to make the common short calls free, and the resolution order from the previous section is what makes that optimisation invisible to you at the call site.

> **This is why `sum(scores)` and `sum(1, 2, 3)` can both compile.** The array-passing shortcut earlier in this section is the same fact seen from the other end: passes 1 and 2 read `int... numbers` as the plain `int[]` parameter it is, so `sum(scores)` already matches there, and only a call whose array still has to be built falls through to pass 3. One mechanism, two call shapes.

---

## Calling methods

> 📖 Docs: [Baeldung — Methods in Java](https://www.baeldung.com/java-methods) → read: "Calling a Method" — then jump to [Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → read: "Parameter Names", which is the shadowing rule behind every `this.name = name;` you are about to see.

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

Each method is now the right kind for what it does, and that is the point of the example: `add()` touches `this.name` and `this.history`, so it *must* be called on a particular calculator; `square()` touches nothing but its argument, so it is declared `static` and needs no object at all. What `static` actually means, and why that split is a design decision rather than a matter of taste, is settled in [06-oop-classes.md](06-oop-classes.md) — here it is only marking which of the two call shapes below each method takes. In the constructor, `this.name = name;` copies the parameter `name` into the field of the same name: `this.name` is the field of the object being built, and the bare `name` is the parameter, which inside that constructor hides the field.

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

That last one is **method chaining**, which [02-strings.md](02-strings.md) already used on `String`: a call can be chained onto another when the first one returns an object, and the chain stops at a method that returns an `int` or a `boolean`. Seen as a method rule, it is the return type at work. `"  hello  ".trim()` is declared to return `String`, so the whole expression *is* a `String` and `.toUpperCase()` can be called on it, and so on down the chain. It reads as one operation but is three calls, each creating a new `String`, because a `String` is never modified in place. The rule is not special to `String`: any method whose return type is an object can be chained the same way, and that is how `ResponseEntity.noContent().build()` in §"void vs Void" works.

---

## Packages and imports

> 📖 Docs: [Oracle Docs — Creating and Using Packages](https://docs.oracle.com/javase/tutorial/java/package/packages.html) → read: the opening definition — what a package is and the three jobs it does.
> 📖 Docs: [Oracle Docs — Naming a Package](https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html) → read: "Naming Conventions" — why package names start from a reversed internet domain.
> 📖 Docs: [Oracle Docs — Using Package Members](https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html) → read: "Referring to a Package Member by Its Qualified Name", "Importing a Package Member" and "Name Ambiguities" — the three cases below, in the compiler's own wording.

A method has a name. So does the class holding it. Once a project grows past a handful of files those names start colliding: your `User` and the `User` some library ships are both called `User`, and Java has to be able to tell one from the other or it cannot compile a single call. That is the problem **packages** solve, and it is why every real Java file opens with a `package` line.

> **You have met the `package` line once already.** [00-intro-java.md](00-intro-java.md) took it apart while reading the smallest runnable program: a package is the folder a class belongs to, written with dots instead of slashes; it works as the class's surname, so two classes with the same short name can coexist; and that makes it a **namespace**, a scope in which each name identifies exactly one thing. This section adds what that first look left out: the fully qualified name you can write in code, the `import` that saves you from writing it, the classes that need no import at all, and what the compiler does when two classes share a simple name.

As a reminder of the shape, the package is declared on the first line of the file:

```java
package com.victor.timetrack.service;

public class ProjectService {
    public ProjectResponse getById(Long id) { ... }
}
```

That class's real, unambiguous name is now `com.victor.timetrack.service.ProjectService`. Java calls that the **fully qualified name**: the package, a dot, and the class's own name. The short `ProjectService` is its **simple name**. Both refer to the same class; the fully qualified one is what Java actually works with internally.

> **The `com.victor` prefix is an internet domain written backwards, and that convention has one job.** Packages are only useful if two organisations never accidentally choose the same one, so the convention is to start from a domain you control and reverse it: `victor.com` becomes `com.victor`. Nothing enforces it — the compiler accepts `package banana;` without complaint — but every library you will ever add follows it, which is why you read `org.springframework.stereotype`, `com.fasterxml.jackson.databind` and `java.util`. The reversal puts the most general part first so the whole tree sorts sensibly.

### The package name and the folder path match, one folder per dot

[00-intro-java.md](00-intro-java.md) stated the rule that the folder path and the package name always match. This is what it looks like across a whole project, the TimeTrack backend, where you can read each package name straight off its path:

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

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/` (the tree above, trimmed to its folders)

Read the path and the declaration together: everything after `src/main/java/` **is** the package name, with `/` swapped for `.`. Note also that `dto.request` is not a "sub-package" of `dto` in any technical sense — Java has no nesting relationship between packages, and `com.victor.timetrack.dto.request` gets no special access to `com.victor.timetrack.dto`. The dots only look like a hierarchy; to the compiler each package is a flat, independent name that happens to share a prefix with its neighbours.

You will break that match the first time you move a file between folders in IntelliJ's file explorer instead of through a refactoring. Say `ProjectService.java` is dragged from `controller/` to `service/`, and its first line still says:

```java
// the file now sits in .../timetrack/service/ but its first line still says:
package com.victor.timetrack.controller;
```

Two tools react, at two different moments, and knowing which is which saves you the hunt.

1. **IntelliJ flags the file straight away**, with `Package name 'com.victor.timetrack.controller' does not correspond to the file path 'com.victor.timetrack.service'`.
2. **The build still succeeds at this point.** Maven hands `javac` every `.java` file under `src/main/java/` by its path, and `javac` takes a class's package from the `package` line, not from the folder. So the class is still `com.victor.timetrack.controller.ProjectService`, and every file that imports it under that name keeps compiling.
3. **The compiler complains once you correct the line by hand** to `package com.victor.timetrack.service;`. Now every file that still imports the old name fails on its import line with `error: cannot find symbol`, and the message's `location: package com.victor.timetrack.controller` shows where it looked. The class did not disappear; it is no longer at the name those files look it up by.

IntelliJ's **Refactor → Move** (`F6`) exists to avoid exactly that: it moves the file, rewrites its `package` line and rewrites every import of it, in one step.

> **Why the folder matters if `javac` reads the package from the line.** Because compiled classes are found by their folder. `javac` writes every `.class` file into the folder its package names — `target/classes/com/victor/timetrack/model/Project.class` for `com.victor.timetrack.model.Project` — whatever folder the source sat in. When code names a class that is not among the files being compiled right now, such as a class inside a library's `.jar`, the compiler converts the name into that path and looks exactly there in each entry of the **classpath**, the list of folders and `.jar` files it was told to search. The JVM finds a class the same way when it loads it at runtime. That lookup is a direct translation from name to path, never a search through every file, which is why it stays instant in a project with ten thousand classes. Keeping your source folders in the same layout means you, IntelliJ and any tool that looks for a class by its name find the source where the compiled class will be.

### Imports — using the simple name, resolved at compile time

Fully qualified names are correct and unreadable. You *can* write code with them, and it compiles:

```java
// ✅ legal, and nobody writes this
com.victor.timetrack.model.Project project = new com.victor.timetrack.model.Project();
```

An **import** lets you use the simple name instead. It goes after the `package` line and before the class. This is the opening of the same `ProjectService`, trimmed to five of its twelve imports:

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

Read the table as three different reasons a simple name can already be unambiguous — they are not ranked, and you do not choose between them. The first row is the one to memorise: `java.lang` holds the classes no program can avoid, so the language hands them over for free. That is the entire reason `System.out.println` works in a file with no imports, and why `Integer.parseInt` back in [02-strings.md](02-strings.md) never needed one either. The second row is why `ProjectService` imports `Project` and `ProjectRepository` but never imports `AuthenticatedUserProvider` — that class lives in `com.victor.timetrack.service` as well.

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

> 📖 Docs: [Oracle Docs — `java.lang.NullPointerException`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html) → read: the `getMessage()` entry and its "Implementation Note" — two sentences, and the official statement that the modern message is computed for you rather than written by hand.
> 📖 Docs: [Oracle Docs — `java.util.Objects.requireNonNull(T, String)`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html) → read: the `requireNonNull(T obj, String message)` entry — "designed primarily for doing parameter validation in methods", which is exactly the use below.
> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → read: the opening sections on where null values come from and on validating method arguments.

[03-control-flow.md](03-control-flow.md) left you with the null guard — the plain `if (name != null)` that stops a crash — and deferred one question to this chapter, because it is not a question about `if` at all: **where** in a program should a missing value be rejected? That is a question about the contract between a method and its caller, which is what this whole chapter has been about, so it belongs here.

As [01-variables-types.md](01-variables-types.md) showed, `null` means "this reference points at no object": it is a legal value for any reference type — `String`, `Project`, `Integer`, an array — and never for a primitive, which is why `int x = null;` does not compile. The failure happens the moment you **dereference** a `null` reference, that is, use the address it holds to reach the object there: calling a method on it, reading a field of it, indexing into it as an array. There is no object at that address, so the JVM throws a `NullPointerException`.

```java
String name = null;
name.toUpperCase();   // ❌ NullPointerException at runtime — the file compiles fine
```

> **Why is this a runtime failure and not a compiler error?** Because the compiler tracks *types*, not *values*. It knows `name` is a `String`, and `String` has a `toUpperCase()`, so the call is type-correct and the file compiles. What it cannot know is which of the many paths through your program actually reaches that line, and with what value in the variable — `name` might be a database result, a request body field, a lookup that found nothing. Nullness is a property of the run, not of the type, so it is checked when the reference is actually used. And that is why nothing in the syntax warns you: the dangerous line looks exactly like the safe one.

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

> **Each line of the trace is one frame: one method call that had started and not yet finished.** When `main` called `buildPage`, `main` did not end — it paused on line 10, waiting for the result. `buildPage` in turn paused on line 6 while `slug` ran. So at the moment of the crash three calls were open at once, and the trace lists them with the newest on top and the oldest, `main`, at the bottom. That is why the paragraph below can say a line is "two frames further down": it means two calls further back toward `main`. How the JVM keeps those paused calls — the call stack — is [05-memory-model.md](05-memory-model.md)'s subject, and reading long traces with several exceptions chained together is [11-exceptions.md](11-exceptions.md)'s.

Now notice the trap. The trace's top line is `Report.java:3`, and that line is not wrong in any way — `slug` is a fine method that was handed a bad value. The mistake was made at line 9, two frames further down, and nothing in the report points at it. On a real backend those three frames are more like fifteen, spread over a controller, two services and a mapper, and the file the trace opens is a file you had no reason to suspect.

> **The message is computed for you, and it is younger than most tutorials.** You already met this message form in [01-variables-types.md](01-variables-types.md), on the unboxing trap; here is where it comes from. It was added in Java 14 and switched on by default from Java 15. Before that, the first line read exactly `java.lang.NullPointerException` and nothing else — no method name, no variable — so a line with three chained calls gave you no way to know which link was null. Modern Java walks the bytecode of the failing instruction to reconstruct a description of the expression that was `null`, which is why you now get `because "title" is null` for free. One wrinkle worth knowing: the name it prints depends on what the compiler recorded. With the debug information IntelliJ and Maven include by default you get the real name, `"title"`. Compiled without it, the same failure prints `because "<parameter1>" is null` — same mechanism, less to go on.

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

Two things improved, and both matter more than they look. The message is now a sentence *you* wrote, naming the parameter that was missing instead of describing a method call that happens to have failed. And the trace is three lines long, with `Report2.main(Report2.java:13)` — the actual culprit, the line that passed the `null` — sitting right there as the frame directly under `buildPage`. You are not debugging any more; you are reading.

> **What the trace can point at, and what it never can.** `Report2` is the same program as `Report` with `import java.util.Objects;` and a blank line added at the top and the check added as the first line of `buildPage`; those three extra lines are why the call in `main` moved from line 10 to line 13. A stack trace lists only calls that were still open, so it can never show the line that *stored* the `null` — line 9 in `Report`, line 12 in `Report2` — because that line had already finished. The closest any trace gets is the call that carried the `null` in, and both traces contain it (`Report.java:10` and `Report2.java:13`). What the check changes is which of your frames sits on top. Before, the top was `slug`, a method whose code was fine. Now it is `buildPage`, the method whose contract was broken, and the frame right under it is the caller that broke it: you start reading at the right place instead of one call too deep here, and many calls too deep in a real backend.

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

> **That snippet uses a constructor, and constructors are [06-oop-classes.md](06-oop-classes.md)'s.** Read it here only for *where the check sits*: on the way in, before the value is stored. Why the object-building boundary is the strongest one available — an object that could never be valid is refused before it exists, instead of failing later in whichever consumer happens to touch it first — is a rule about class invariants, and that is the chapter that states it. `extends RuntimeException`, and the `super(message)` line that hands the message on to it, belong to defining an exception type of your own, which is [11-exceptions.md](11-exceptions.md)'s.

### Three rules for a `null` at a method boundary

Read these as one decision made in three places, not as a checklist:

1. **Validate what you require, at the outermost method that requires it.** One check at the boundary beats five defensive checks downstream, because the downstream methods can then be written as if their arguments are always present — which is what makes `slug(String title)` above a two-line method instead of a four-line one.
2. **Do not reject a value that is genuinely optional.** Absence is sometimes the correct answer — a middle name, a description nobody filled in — and rejecting it turns valid input into a crash. Handle it instead, the way `describe` in §"Return types" returns `"unknown"` for a `null` employee. And when absence is a normal *result* a method hands back, the tool is `Optional<T>` as the return type. [09-generics.md](09-generics.md) introduces it as that return contract, and [12-streams-lambdas.md](12-streams-lambdas.md) teaches the methods you call on one.
3. **Never return `null` from a method to mean "nothing found".** You are then handing the caller the same trap this section is about, and the crash will name their line, not yours. Return an empty collection, an `Optional`, or reject the call — anything that cannot be dereferenced by accident.

---

## Naming conventions

> Docs: https://www.baeldung.com/java-naming-conventions → read: "Method Naming Conventions" and "Variable Naming Conventions"
> Docs: https://www.baeldung.com/java-pojo-javabeans-dto-vo → read: "JavaBeans" — the convention the callout below depends on

A method's name is the one part of its signature a reader sees at every call site, so Java code follows a fixed set of naming habits, and some libraries depend on them:

- Method names: `camelCase`, start with a verb — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Boolean getters: start with `is` or `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`

> **Preview — Spring Boot:** The callout below names three libraries you haven't studied yet: **Jackson**, which turns Java objects into JSON; **JPA** (with **Hibernate**, the implementation Spring Boot uses), which stores Java objects as database rows; and **Lombok**, which writes repetitive methods for you at compile time. Read it to see why the naming convention is more than style — you'll use all three in the Spring Boot notes.

> **The get/set/is shape is not a style preference — libraries read it.** Java has a convention with a name, **JavaBeans**: a class with a no-argument constructor whose properties are reached through `getX()` / `setX()` / `isX()`. It matters because major libraries locate a property by *looking for those exact method names* at runtime. Jackson turns your object into JSON by finding `getName()` and publishing a `"name"` field — rename it to `fetchName()` and the field silently vanishes from the API response. JPA can do the same, but only for an entity whose mapping annotations sit on its getters; TimeTrack's `Project` puts `@Id` on the field, so Hibernate reads and writes its fields directly. Lombok's `@Data`, which the TimeTrack DTOs use, exists precisely to generate this boilerplate for you: `@Data class ProjectResponse { private String name; }` compiles to a class with `getName()` and `setName()` already in it. So the convention is a contract that tools like these depend on, which is why breaking it produces bugs that look like magic.
>
> **File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/dto/response/ProjectResponse.java`

Those getters and setters are your first hint of a bigger pattern: methods rarely live alone — they wrap the *fields* of a class and guard how the outside world reads and changes them. That coupling of fields and methods, plus constructors, `static`, the access modifiers this chapter kept deferring, and encapsulation, is the whole subject of [06-oop-classes.md](06-oop-classes.md), where the `Calculator` you saw above becomes a proper class with state.

---

## What this unlocks

Up to the previous chapter you could read a call; now you can write the method behind it and predict whether a call to it compiles. In practice, you can now:

- Read a declaration and say which parts form the signature, and why a call with the wrong number or types of arguments, or a result used as the wrong type, is rejected before the program runs.
- Say what a method with no return value gives back to its caller: control, with no value.
- Predict which overload a call selects, from its three passes and the most-specific rule, and fix an ambiguous call at the call site.
- Write a `Type...` parameter, knowing it must be last and arrives in the body as an array, empty rather than `null` when no argument is passed.
- Read a fully qualified name, and know what an `import` changes and what it never changes.
- Reject a required `null` argument on entry to the method whose contract needs it, so the stack trace starts at the frame whose contract was broken.

One file comes before the classes, and it answers a question this chapter deliberately left standing. You now know the full **contract** of a call: the signature the caller has to match, which overload wins when several could, what a `Type...` parameter really receives, the name the class is reached by, and where a required argument must be rejected. What you do not know is what physically *crosses* that boundary when the call happens. When you write `buildPage(title)`, is the `String` copied? When a method takes a `Project`, is the object copied? Where does the checked value actually live while `slug` is running, and how does Java know which line to come back to when it returns — the list of open calls you read in both stack traces of the `null` section? [05-memory-model.md](05-memory-model.md) opens the method boundary and draws it: the stack and the heap, what a reference is, what gets copied into a parameter and what does not, and why "Java is always pass-by-value" is the sentence that settles every version of that argument.
