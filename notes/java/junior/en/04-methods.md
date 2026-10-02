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
  - [Each part of the package name is a folder](#each-part-of-the-package-name-is-a-folder)
  - [Imports — using the simple name, resolved at compile time](#imports--using-the-simple-name-resolved-at-compile-time)
  - [When two classes share a simple name](#when-two-classes-share-a-simple-name)
- [`null`, `NullPointerException`, and where to reject a missing argument in a method](#null-nullpointerexception-and-where-to-reject-a-missing-argument-in-a-method)
  - [A `NullPointerException` is thrown where the `null` is used, not where it appeared](#a-nullpointerexception-is-thrown-where-the-null-is-used-not-where-it-appeared)
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

In the examples above, every call had a version of `add` whose parameters were exactly the types of its arguments: `add(1, 2)` passes two `int`s, and `add(int a, int b)` existed. So Java had nothing to decide. Now imagine a class in which no version of `add` takes two `int`s, but these three exist:

```java
public long add(long a, long b) { return a + b; }
public int add(Integer a, Integer b) { return a + b; }
public int add(int... numbers) { ... }
```

The call `add(1, 2)` could fit any of them, because Java knows three ways to convert an `int`: into a `long`, into an `Integer` object, or into an element of an `int[]` array, which is what `int...` means (you will see it in the section _Varargs — variable number of arguments_ of this same file). To pick one, Java does not look for the closest one by feel. It tries those three ways one at a time, always in the same order, and keeps the first one that works. Each of those attempts is called a **pass**:

| Pass | What Java tries | Example that wins here |
|---|---|---|
| 1 | Exact match, or **widening** — a primitive to a larger one, or a reference to a more general type such as `Object` | `add(long, long)` |
| 2 | **Boxing / unboxing** — wrapping the primitive in its wrapper class | `add(Integer, Integer)` |
| 3 | **Varargs** — collecting the arguments into an array | `add(int...)` |

Read the table top-down as a priority list, not as three independent options: if some version of `add` fits in pass 1, passes 2 and 3 never run, even if another version would also have fitted in them. So with `add(long, long)` and `add(Integer, Integer)` both declared, `add(1, 2)` calls the **`long`** version — widening beats boxing. You saw both conversions in [01-variables-types.md](01-variables-types.md): widening, in the section [Widening (automatic)](01-variables-types.md#widening-automatic), turns an `int` into a larger primitive such as `long` without you writing anything, and boxing, in the section [Autoboxing and unboxing](01-variables-types.md#autoboxing-and-unboxing), wraps the `int` in an `Integer` object. The ordering is not arbitrary, and it is not about speed: boxing and varargs only arrived in Java 5, so the language placed them in later passes, which guarantees that every call that already compiled before Java 5 keeps working, because Java picks the same method it picked before. The whole decision happens at **compile time**, purely from the declared types at the call site.

One pass can also find several candidates at once. With `add(long, long)` and `add(double, double)` both declared, `add(1, 2)` fits both in pass 1, because an `int` widens to either. Java then keeps the **most specific** one: the candidate whose parameter types could all be passed on to the other candidate. A `long` can be passed where a `double` is expected, but not the other way round:

```java
static void takesDouble(double d) { System.out.println(d); }
static void takesLong(long n) { System.out.println(n); }

takesDouble(5L);   // ✓ prints 5.0 — Java converts the long to double on its own (widening)
takesLong(2.5);    // ❌ error: incompatible types: possible lossy conversion from double to long
```

To fit `2.5` into a `long`, Java would have to remove the `.5`, and it only does that loss if you write the cast. So `add(long, long)` is more specific and wins. It is the same rule that made `String.valueOf(null)` in [02-strings.md](02-strings.md) pick `valueOf(char[])` over `valueOf(Object)`: every `char[]` is an `Object`, but not every `Object` is a `char[]`.

The failure mode is two candidates in the same pass where neither is more specific than the other:

```java
static void add(int a, long b) { }
static void add(long a, int b) { }

add(1, 2);   // ❌ both fit in pass 1, and neither is more specific:
             //    (int, long) cannot be passed to (long, int), because its second parameter is long
             //    and a long cannot be passed where an int is expected without writing a cast;
             //    (long, int) cannot be passed to (int, long) for the same reason, in the first parameter
// error: reference to add is ambiguous
//   both method add(int,long) in Calculator and method add(long,int) in Calculator match
```

> **How to unstick an ambiguous call.** Do not remove any of the methods. What you have to change is the call: write the arguments so that their types match the types of the parameters of one of the versions exactly. `add(1, 2L)` passes an `int` and a `long`, because the trailing `L` makes `2L` a literal of type `long`. That call fits `add(int, long)` with no conversion, and it does not fit `add(long, int)`, because its second parameter is `int` and a `long` cannot be passed there without a cast. So pass 1 finds a single candidate.
>
> To understand why it works, think of every argument you pass to a method as having two things: a **type** and a **value**. In `add(1, 2)`, both arguments are of type `int`, and their values are `1` and `2`. To choose which version of `add` to call, Java only takes the types of the arguments into account, never their values. The reason is that this choice is made by the compiler, before the program runs. At that moment the compiler cannot count on the value of a variable, because it may depend on what happens when the program runs, for example on what the user types. The type, on the other hand, it is sure of, because it is written in the variable's declaration. So, to Java, `add(1, 2)` is just a call with one `int` and another `int`, and that is why it is ambiguous. As soon as one of the arguments has another type, the choice changes. You can see it with two variables of different types holding those same numbers:
>
> ```java
> int x = 1;
> long y = 2;
> add(x, y);   // ✓ compiles and calls add(int, long)
> ```
>
> `add(x, y)` passes the same numbers as the ambiguous call `add(1, 2)`, and still compiles, because `y` is declared as `long`. That `2` would easily fit in an `int` does not matter: Java does not look at the `2`, it looks at the fact that `y` is a `long`.

> **Overloading vs overriding — don't confuse them.** They sound alike and both involve "two methods with the same name", but they are opposite ideas. **Overloading** (this section) is *one* class defining several versions of a method that differ in their parameters — the choice is made at compile time by the arguments you pass. **Overriding** is a *subclass* replacing a method it inherited from its parent, keeping the *exact same* parameters, to change the behaviour — the choice is made at run time by the object's real type. Rule of thumb: same name + different parameters + same class = overloading; same name + same parameters + subclass = overriding. Overriding is covered in [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md).

---

## Varargs — variable number of arguments

> Docs: https://www.baeldung.com/java-varargs → read: "Use of Varargs" and "Rules"

Normally a method with two parameters demands exactly two arguments. Varargs (`...`) let you pass any number instead — zero, one, five, as many as you like — and collect them into an array internally. You have already met one: [02-strings.md](02-strings.md) showed that `.formatted()` is declared `formatted(Object... args)`, which is why it accepts any number of values, those three dots are varargs.

```java
"Project %d deleted by %s at %s".formatted(7, "Ana", "10:42");
// returns: "Project 7 deleted by Ana at 10:42"
```

You will also see it in `String.format()` and in `log.info(...)`, a method of **SLF4J**, the logging library that Spring Boot includes in every project. `log.info(...)` writes a line to the console about what the application is doing, and each `{}` in its message is replaced, in order, with the values you pass after it. To be able to receive any number of values, it has a version declared with varargs: `info(String format, Object... arguments)`.

```java
log.info("Project {} deleted by {} at {}", 7, "Ana", "10:42");
// the line that appears in the console ends in: Project 7 deleted by Ana at 10:42
```

The syntax is `Type... name`, and it must be the **last** parameter of the method. The reason is that Java has to know where the variable-length list ends: if a fixed parameter came after it, Java could not tell which argument belongs to the varargs list and which is the next fixed argument. The same reasoning is what makes Java allow only one varargs parameter per method. If you put the varargs parameter anywhere else, the code fails at compile time. For example, `void f(int... a, int b)` fails with `error: varargs parameter must be the last parameter`, while `void f(int a, int... b)` compiles.

Since the method does not know in advance how many values it will receive, the usual thing is to go through them with a loop, which is why almost every varargs method has one. For example, in the following code `sum` goes through the numbers with a for-each and adds each one to `total`. The loop is not mandatory: as with any array, you can also read one specific position with `numbers[0]`, as long as at least one value arrived, or find out how many arrived with `numbers.length`.

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

Inside the method, `numbers` **is** an array. `int... numbers` and `int[] numbers` are the same parameter as far as the method body is concerned; the `...` only changes what you are allowed to write at the moment the method is called. Java builds the array for you at that moment and hands it over. Two consequences follow directly:

**An array can be passed as the argument for the varargs parameter.** Normally you pass loose values, as in `sum(1, 2, 3)`, and Java puts them into a new array. But we have seen that a varargs parameter really is an array: in the `sum(int... numbers)` example of this same section, `numbers` is an `int[]`. That is why a varargs parameter also accepts an already-created array as the argument. In that case Java does not build any array from the one you passed; it directly uses the one you passed. There is no need to take its values out one by one to pass them separately:

```java
int[] scores = {1, 2, 3};
sum(scores);   // 6 — the array IS the varargs parameter
```

**A zero-argument call gives you an empty array, never `null`.** This is the trap: it looks like "nothing was passed", so the instinct is to null-check. Java guarantees an array of length `0` instead, which is why the `for (int n : numbers)` in `sum()` above simply runs zero times and returns `0` when we pass it no arguments, rather than throwing.

```java
sum();                       // 0 — numbers.length == 0
// numbers == null           // ❌ never true; a null-check here is dead code
```

> **Why an empty array instead of `null`?** Because that way the method always receives an array, whether you pass it zero values or many, and it can go through it the same way in every case. If a zero-argument call produced `null`, every varargs method would have to open with a defensive `if (numbers == null)` before it could go through the array, and forgetting it would mean a `NullPointerException`. Handing over an empty array makes the no-arguments case the same code path as every other case. `numbers` can only be `null` if you are the one passing a `null` in place of the array. For example, in `sum((int[]) null)` the `(int[])` says that this `null` takes the place of the whole array. In that case the for-each in `sum` throws a `NullPointerException`, because the `null` was put there by your call. In real code nobody writes `sum((int[]) null)` on purpose. What you can run into is passing `sum` an `int[]` variable that holds `null`, for example because its value came from another method that returned `null` instead of an array:
>
> ```java
> int[] scores = null;   // the variable exists, but it points to no array
> sum(scores);           // ❌ NullPointerException: numbers receives that null as it is
> ```
>
> Java only creates the empty array when you call with no arguments, as in `sum()`. A variable that holds `null` reaches the method as it is, just like the `sum((int[]) null)` above, so the for-each in `sum` throws the `NullPointerException`.

### The same mechanism in the standard library

> 📖 Docs: [Oracle Docs — Passing Information to a Method or a Constructor](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html) → read: "Arbitrary Number of Arguments" — three paragraphs, ending on the `printf` signature, a third method built on the same `Object...` parameter.

At the start of this section you saw that `.formatted()` and `log.info(...)` accept any number of values because they are declared with varargs. The Java standard library does the same in two other methods you will use often, `String.format()` and `List.of()`. These are their real declarations, and both have the `...`:

```java
public static String format(String format, Object... args)   // java.lang.String
static <E> List<E> of(E... elements)                          // java.util.List
```

`String.format("Hi %s, you have %d messages", name, count)` compiles into exactly one call with two arguments: the format `String`, and an `Object[]` array that Java built at the moment of the call. That array has length 2 because we passed two values, `name` and `count`. `List.of` works the same way: the elements are put into an array and handed over as a single parameter. Further down you will see that this only happens from a certain number of elements on. That is why both accept any number of arguments without declaring hundreds of versions of the same method.

> **`String.format()` and `.formatted()` give the same result; what changes is what you call them on.**
>
> ```java
> String.format("Project %d deleted by %s", 7, "Ana");   // "Project 7 deleted by Ana"
> "Project %d deleted by %s".formatted(7, "Ana");        // "Project 7 deleted by Ana"
> ```
>
> `String.format` is called on the `String` class, so the text with the `%d` and `%s` has to go as the first argument, and the values follow it, in the varargs parameter. `.formatted()` is called on the text itself, so it only receives the values, all of them in its varargs parameter. `.formatted()` arrived in Java 15 and does the same job as `String.format`, so in real code you will see both. Why one is called on the class and the other on a specific text (the difference between a `static` method and an instance method) you will see in [06-oop-classes.md](06-oop-classes.md).

> **In the declaration `static <E> List<E> of(E... elements)`, keep in mind that `List` and the `<E>` are not part of this chapter, although you can read the line without having studied these concepts in depth.** `List.of` appears here only to show the varargs in its declaration, `E... elements`. What a `List` actually is arrives in [10-collections.md](10-collections.md), and the `<E>` — a *type parameter* — is [09-generics.md](09-generics.md)'s. For now read `static <E> List<E> of(E... elements)` as "hand it any number of items of one type and get a list of them back".

`List.of` has a detail that only makes sense with the three passes you saw in the section [Method overloading](#method-overloading). `List` does not have a single `of` method, but twelve overloads with that name. Eleven take a fixed number of elements, from zero to ten, and the twelfth is the varargs version:

```java
static <E> List<E> of()                    // 0 elements
static <E> List<E> of(E e1)                // 1 element
static <E> List<E> of(E e1, E e2)          // 2 elements
// and so on, one version for each number of elements, up to the one for 10 (e1 to e10)
static <E> List<E> of(E... elements)       // any number of elements
```

Why so many versions, when the varargs one alone would accept every call?

As we saw in the section [Method overloading](#method-overloading), overload resolution only reaches varargs after passes 1 and 2 have failed. So `List.of("a", "b")` matches `of(E e1, E e2)` in pass 1 and stays there: `"a"` goes straight to the parameter `e1` and `"b"` to `e2`, without Java having to create any array to hold them, as it would with a varargs. Only a `List.of` with eleven or more elements reaches the varargs version, and only then does Java create an array with all of them. Creating an array costs memory and time on every call, so the eleven fixed versions exist to spare the short calls that cost, and the short calls are the most common ones. The passes, on the other hand, cost nothing when the program runs: the compiler does them once, at compile time, to decide which version each line calls. What repeats every time the call runs is creating the array, and that is the only thing these versions save. And since it is the passes that choose the version, you write `List.of(...)` the same way in every case and never notice whether a fixed version or the varargs version is being used.

> **If you pass `List.of` an array you already have, the varargs version is used and Java does not create another array.**
>
> ```java
> String[] names = {"a", "b"};
> List<String> list = List.of(names);   // [a, b] — a list with 2 elements
> ```
>
> It works just like `sum(scores)`: the varargs parameter really is an array, so your array fits directly and Java uses it as it is. That said, `List.of` copies the elements into the list it returns, so if you later change `names[0]`, the list is still `[a, b]`.
>
> In practice, if you have loose values, pass them loose, as in `List.of("a", "b")`: with ten arguments or fewer no array is created. Putting them into an array first just to call `List.of` would mean creating the array yourself, and saving that array is the reason the fixed versions exist. If you already have the array, pass it directly.

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

This class has two kinds of methods: instance methods, which are declared with no special keyword, like `public int add(int a, int b)`, and static methods, which use the `static` keyword to declare them, like `public static double square(double n)`. Each one is declared as one kind or the other depending on the data it uses:

- `add()` touches `this.name` and `this.history`. `this` is the object the method is called on: in `calc.add(3, 4)`, `this` is `calc`, that is, an instance of the `Calculator` class. So `this.name` and `this.history` are the fields of that object. The fields are not declared in the constructor but at the top, in the class (`private String name;` and `private List<String> history`), and each `Calculator` object has its own. Fields are usually declared `private`: that way only the class's own methods can read or change them, and from outside you reach them through methods like `getName()`. Why that is the norm you will see in [06-oop-classes.md](06-oop-classes.md), with encapsulation. When the object is created, those fields get their value: `name` in the constructor, and `history` in its own declaration, with `new ArrayList<>()`. Since `add()` needs the fields of a particular object, because it uses `this` to reach them, it *must* be called on an instance of the class, that is, on a `Calculator` object already created. That is why it is an instance method.
- `square()` touches nothing but its argument, that is, it needs no instance of the class and no particular object, since it does not use any field either. That is why it is declared `static`: so it can be used directly on the class, as in `Calculator.square(5)`, without creating any object.

What `static` actually means, and why that split is a design decision rather than a matter of taste, you will see in [06-oop-classes.md](06-oop-classes.md). Here it is enough to know that `static` decides how the method is called: on an object, like `calc.add(3, 4)`, or directly on the class, like `Calculator.square(5)`. Both forms appear in the code below. In the constructor, `this.name = name;` copies the parameter `name` that the constructor receives into the object's `name` field (the object's, not the class's: each object has its own).

> `List<String>` and `ArrayList` are Java's variable-length list — covered in full in [10-collections.md](10-collections.md). For now read it as "an array that can grow or shrink". The `add` method in `history.add(...)` is used to append one item to the end of the list. It is not `Calculator`'s `add()`: it is a method of the list itself, which comes with `List` and `ArrayList`.

This is how `Calculator`'s methods are called from outside the class:

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

That last one is **method chaining**, which [02-strings.md](02-strings.md) already used on `String`: a call can be chained onto another when the first one returns an object, of any type, and the next call has to be a method that exists on that type. The chain stops when a method returns a primitive, like an `int` or a `boolean`, because primitives have no methods, or when it returns `void`, because there is nothing left to call on. What makes the chain possible is the return type of each method. Follow the `result2` above step by step:

1. `"  hello  ".trim()` returns a `String`: `"hello"`.
2. Since that result is a `String`, `.toUpperCase()` can be called on it, which returns another `String`: `"HELLO"`.
3. On that `String`, `.replace("HELLO", "HI")` is called, which returns `"HI"`.

It looks like a single operation, but it is three calls, and each one creates a new `String`, because a `String` is immutable: its methods always return a new `String` object. Method chaining is not something special to `String`: any method that returns an object can be chained the same way. For example, `ResponseEntity.noContent().build()`, from the section [void vs Void](#void-vs-void), works like this.

---

## Packages and imports

> 📖 Docs: [Oracle Docs — Creating and Using Packages](https://docs.oracle.com/javase/tutorial/java/package/packages.html) → read: the opening definition — what a package is and the three jobs it does.
> 📖 Docs: [Oracle Docs — Naming a Package](https://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html) → read: "Naming Conventions" — why package names start from a reversed internet domain.
> 📖 Docs: [Oracle Docs — Using Package Members](https://docs.oracle.com/javase/tutorial/java/package/usepkgs.html) → read: "Referring to a Package Member by Its Qualified Name", "Importing a Package Member" and "Name Ambiguities" — the three cases below, in the compiler's own wording.

A method has a name. The class holding it has a name too. Once a project grows, those names start colliding: your `User` class and the `User` class some library ships are both called the same way, `User`, and Java has to be able to tell one from the other. If it cannot, the code does not compile, because Java does not know which of the two classes you mean. That is the problem **packages** solve, and it is why every real Java file opens with a `package` line.

> **You have met the `package` line before.** [00-intro-java.md](00-intro-java.md) explained it with the smallest program that can be run in Java. A package is the folder a class belongs to, written with dots instead of slashes; it is a way of identifying the class, so two classes with the same name can coexist; and that makes the package a **namespace**, a scope in which each name identifies exactly one thing: inside a package, each class name corresponds to a single class.
>
> This section adds three things that first explanation left out:
>
> 1. The **fully qualified name** of a class (often shortened to FQN): the class name with the package it belongs to in front, like `com.victor.timetrack.service.ProjectService`.
>    - The **`import`** is the way to avoid writing that full name every time. It is a line at the top of the file, like `import com.victor.timetrack.service.ProjectService;`, that tells Java which class you mean when you later write just `ProjectService`.
> 2. The classes used without any `import`, like `String`, because Java imports their package, `java.lang`, in every file.
> 3. What the compiler does when you use two classes with the same name, like the two `User` classes above.

Remember how it is written: the `package` line is the first line of code in the file, before the class.

```java
package com.victor.timetrack.service;

public class ProjectService {
    public ProjectResponse getById(Long id) { ... }
}
```

That class's real, unambiguous name is now `com.victor.timetrack.service.ProjectService`. Java calls that the **fully qualified name**: the package, which is `com.victor.timetrack.service`, the one declared on the first line; a dot; and the class's own name, `ProjectService`. `ProjectService` is its **simple name**. Both refer to the same class; the fully qualified one is what Java actually works with internally.

> **The `com.victor` prefix is an internet domain written backwards.** This convention prevents one specific problem: two companies or organisations unknowingly creating a package with the same name. Your code does not mix with other companies' code on its own: it meets it when you use libraries. Spring, Jackson and the other libraries your project adds are classes written by other companies or organisations, and when the application runs they are all loaded alongside yours, in the same program. If one of those libraries had a package called `service` with a `ProjectService` class inside, just like yours, Java could not tell one class from the other.
>
> The fix is to start the package with something that is already unique: an internet domain, because each domain has a single owner. You do not need to have bought the domain, because Java checks nothing: in a company you use the company's domain, and in a personal project like TimeTrack a name that is yours and hard to repeat is enough, like `com.victor`. Only if you ever publish a library for others to use will you be asked to prove you control that name; for that people usually use the one from their GitHub account, like `io.github.vmnunez`. And it is written backwards, starting with the most general part:
>
> - `victor.com` → `com.victor`
> - `springframework.org` → `org.springframework`, in packages like `org.springframework.stereotype`
> - `fasterxml.com` → `com.fasterxml`, in packages like `com.fasterxml.jackson.databind`
>
> Writing it backwards orders packages from general to specific: first `com`, inside it `com.victor`, inside that `com.victor.timetrack`, and so on.
>
> It is a convention, not a compiler rule: `package banana;` compiles without any problem, although it could end up causing problems: if a library also used a package called `banana`, you would be back to the name clash this convention prevents. That is why it is the standard way to name packages, and you will see it in Spring, in Jackson and in practically any library you add to a project. The exception is the classes that come with Java itself, like those in `java.util`, which use the `java.` prefix, reserved for them.

### Each part of the package name is a folder

[00-intro-java.md](00-intro-java.md) already told you that the folder path and the package name always match. For example, the `ProjectService` class is stored in the folder `src/main/java/com/victor/timetrack/service/`, and that is why its first line is `package com.victor.timetrack.service;`. The `src/main/java/` at the start is not part of the package: it is the root folder where Maven, the tool that builds the project, looks for all the Java code. The package name starts counting from inside that folder. What Maven is and why it uses that folder you will see in [17-maven.md](17-maven.md). This is how the package names look in the TimeTrack backend, folder by folder:

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

Read the path and the declaration together: everything after `src/main/java/` **is** the package name, with `/` swapped for `.`. Note also that `dto.request` is not a package inside the `dto` package, even though its `request/` folder does sit inside the `dto/` folder. To Java they are two independent packages: there is no nesting between packages. That is why a class in `com.victor.timetrack.dto.request` that wants to use a class from `com.victor.timetrack.dto` has to import it, just as if it were in any other package. Although the dots make them look like a hierarchy, to the compiler they are two different names that only share their beginning.

You will break that match the first time you move a file between folders in IntelliJ's file explorer instead of through a refactoring. Say `ProjectService.java` is dragged from `controller/` to `service/`, and its first line still says:

```java
// the file now sits in .../timetrack/service/ but its first line still says:
package com.victor.timetrack.controller;
```

From there, two tools warn you about the problem, IntelliJ and the compiler, and each one does so at a different moment. This is the order in which you will see it:

1. **IntelliJ flags the file straight away**, with `Package name 'com.victor.timetrack.controller' does not correspond to the file path 'com.victor.timetrack.service'`.
2. **The build still succeeds at this point.** Maven hands `javac` every `.java` file under `src/main/java/` by its path. To know which package a class belongs to, `javac` reads the `package` line of the file and does not look at which folder it is stored in. So the class is still `com.victor.timetrack.controller.ProjectService`, and every file that imports it under that name keeps compiling.
3. **The compiler complains if you change the package from `com.victor.timetrack.controller` to `com.victor.timetrack.service` by hand.** When you do, every file that still imports the old name fails on its import line with `error: cannot find symbol`, and the message's `location: package com.victor.timetrack.controller` shows where it looked. The class did not disappear; it is no longer under the name those files look it up by.

IntelliJ's **Refactor → Move** (`F6`) exists to avoid exactly that: it moves the file, rewrites its `package` line and rewrites every import of it, in one step.

> **Why the folder the class sits in still matters if `javac` reads the package from the `package` line.** Because the compiler and the JVM look for every compiled class in the folder that matches its package.
>
> It all starts at compile time. For each class it compiles, `javac` generates a `.class` file, which is that class already compiled, and stores it in the folder its package indicates. For example, the class `com.victor.timetrack.model.Project` is stored in `target/classes/com/victor/timetrack/model/Project.class`. The leading `target/classes/` is the folder where Maven puts everything it compiles. It does not matter which folder `Project.java` sat in: the folder of the `.class` is always decided by the package.
>
> Library classes are stored the same way. A library such as Spring does not reach your project as source code but already compiled, in `.jar` files. A `.jar` is a compressed file, much like a `.zip`, that holds many `.class` files inside the folders of their packages. For example, the real `ProjectService` file has this `import` line:
>
> ```java
> import org.springframework.stereotype.Service;
> ```
>
> `org.springframework.stereotype.Service` belongs to Spring, so it is not among your `.java` files. Its `.class` file is inside one of Spring's `.jar` files, at `org/springframework/stereotype/Service.class`.
>
> Because every compiled class is stored like that, its name is all it takes to find one. Staying with the same example, when `javac` compiles `ProjectService` and reaches that `import` line, it does the following with the name `org.springframework.stereotype.Service`:
>
> 1. It converts the name into a path: it swaps the dots for slashes and adds `.class` at the end, which gives `org/springframework/stereotype/Service.class`.
> 2. It looks for that path in each entry of the **classpath**, the list of folders and `.jar` files where Maven tells it compiled classes are.
> 3. It finds it inside Spring's `.jar`, and that tells it the name `ProjectService` uses exists.
>
> The JVM finds classes the same way when it needs them while running the program, and it does so with your own classes as well as with a library's. For example, for `com.victor.timetrack.model.Project` it looks for the path `com/victor/timetrack/model/Project.class` and finds it in `target/classes/`. For `org.springframework.stereotype.Service` it looks for `org/springframework/stereotype/Service.class` and finds it in Spring's `.jar`. Neither `javac` nor the JVM goes through every file until it comes across the class: they go straight to the path its name gives. That is why the lookup stays instant in a project with ten thousand classes.
>
> Your source code follows the same layout for that reason, that is, the package names match the path of the folders the `.java` files are in, even though `javac` does not require it. For example, `Project.java`, which is the uncompiled file, and `Project.class`, which is the compiled one, have the same folder path, `com/victor/timetrack/model/`, and only the folder each one starts from changes:
>
> ```
> src/main/java/com/victor/timetrack/model/Project.java      ← source code
> target/classes/com/victor/timetrack/model/Project.class    ← compiled class
> ```
>
> That way, whoever looks for a class by its name knows where its source code is, whether that is you, IntelliJ or any other tool.

### Imports — using the simple name, resolved at compile time

Fully qualified names are correct, but they are hard to read. You *can* write code with them, putting them wherever you need to use a class from another package, and it compiles:

```java
// ✅ legal, but hard to read, and it is not going to be written like this
public java.util.List<com.victor.timetrack.dto.response.ProjectResponse> getAll() { ... }
```

An **import** lets you use the simple name of the class instead. It is written with the word `import`, followed by the fully qualified name of the class and a semicolon, for example `import com.victor.timetrack.dto.response.ProjectResponse;`. With this you will be able to use the simple name of the class, `ProjectResponse`, in the rest of the file, without having to write `com.victor.timetrack.dto.response.ProjectResponse` every time. The import is placed after the `package` line, which defines the name of the package you are in, and before the class. This is the opening of the same `ProjectService`, trimmed to five of its twelve imports:

```java
package com.victor.timetrack.service;

import com.victor.timetrack.dto.response.ProjectResponse;
import com.victor.timetrack.model.Project;
import com.victor.timetrack.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    // ✅ the same method as before: thanks to the imports above, writing List and ProjectResponse is enough
    public List<ProjectResponse> getAll() { ... }
}
```

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

> **An `import` is only for the compiler: it brings no code into your file and changes nothing when the program runs.** Thinking otherwise is the most common mistake with the `import` keyword, and it comes from JavaScript. There, `import { x } from './y'` loads the code of the `./y` file so that you can use `x`. Java's `import` loads nothing. It only tells the compiler: "in this file, when I write `ProjectResponse`, I mean `com.victor.timetrack.dto.response.ProjectResponse`". When compiling, `javac` replaces every simple name with its fully qualified name, so no import line is left in the `.class` file. Three consequences follow:
>
> - An import that is not used does not make the program slower. It is just a line that is not needed.
> - `import java.util.*;`, which is the way to import every class of the `java.util` package with a single line, loads none of them. It only lets you use the simple name of any of them.
> - Deleting an import does not change what the program does at runtime. The only thing that can happen is that the file stops compiling.

Three cases need no import at all, and knowing which is why `String` has never asked you for one:

| Case | Example | Why no import is needed |
|---|---|---|
| Classes in `java.lang` | `String`, `Integer`, `System`, `Object`, `Math` | Java imports `java.lang.*` into every file automatically |
| Classes in the **same package** | `ProjectService` uses `AuthenticatedUserProvider` with no import, because both classes are in the `com.victor.timetrack.service` package | Same namespace, so the simple name is already unambiguous |
| Using the fully qualified name directly | `java.sql.Date now = ...` | You spelled the whole name, so there is nothing to import |

The first row is the classes of `java.lang`, which are the ones every program uses, so Java imports them for you in every file. That is why `System.out.println` and `Integer.parseInt` work in a file with no imports. The second row explains why `ProjectService` imports `Project` and `ProjectRepository` but not `AuthenticatedUserProvider`: that class is in its same package, `com.victor.timetrack.service`. The third row is the case where you write the fully qualified name of the class, as in `java.sql.Date now = ...`: Java already knows which class you mean because you wrote it in full, so it needs no import. The next section, *When two classes share a simple name*, explains in which case you need to write the whole name.

### When two classes share a simple name

Sooner or later you need both `java.util.Date` and `java.sql.Date` in one file. If you try to import both, the compiler rejects the second import:

```java
import java.util.Date;
import java.sql.Date;   // ❌
// error: a type with the same simple name is already defined by the single-type-import of Date
```

Inside one file, a simple name always refers to one class. If two of the simple names match, as with `Date` here, the compiler would not know which of the two classes you mean when you write `Date`, and that is why it rejects the second import. The fix is to import whichever you use most and spell the other one out in full at the two or three places it appears:

```java
import java.util.Date;

Date utilDate = new Date();                          // ✅ the imported one
java.sql.Date sqlDate = new java.sql.Date(millis);   // ✅ fully qualified, no ambiguity
```

> **Using `import java.util.*;` is not recommended, because of the name conflict we have just seen.** An import ending in `*`, called a wildcard import, lets you use the simple name of every class in that package. That is why it can cause conflicts: if you import two packages that way and both have a class with the same name, the compiler does not know which of the two you want. For example, `java.util` and `java.sql` each have a `Date` class:
>
> ```java
> import java.util.*;
> import java.sql.*;
>
> Date today = new Date();   // ❌ error: reference to Date is ambiguous
> ```
>
> The conflict can appear without you changing anything in the file: it is enough for a library to add, in a new version, a class with a name you were already using from another package. By default, IntelliJ writes one import per class you use (`import java.util.List;`, `import java.util.Map;`), which is what the error message in this section's first example calls a _single-type import_. It only merges them into a single `import java.util.*;` once the file uses five or more classes from the same package, and you can raise that threshold in `Settings → Editor → Code Style → Java → Imports` (the _Class count to use import with '\*'_ option). The usual rule is to keep them explicit: that way, the import block doubles as an honest summary of what the file depends on, which is the first thing you read when you open an unfamiliar class.

---

## `null`, `NullPointerException`, and where to reject a missing argument in a method

> 📖 Docs: [Oracle Docs — `java.lang.NullPointerException`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/NullPointerException.html) → read: the `getMessage()` entry and its "Implementation Note" — two sentences, and the official statement that the modern message is computed for you rather than written by hand.
> 📖 Docs: [Oracle Docs — `java.util.Objects.requireNonNull(T, String)`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html) → read: the `requireNonNull(T obj, String message)` entry — "designed primarily for doing parameter validation in methods", which is exactly the use below.
> 📖 Docs: [Baeldung — Avoid Check for Null Statement in Java](https://www.baeldung.com/java-avoid-null-check) → read: the opening sections on where null values come from and on validating method arguments.

In [03-control-flow.md](03-control-flow.md), in the _if / else_ section, you saw the null check. It means asking whether a variable is `null` before using it:

```java
if (name != null) {
    System.out.println(name.toUpperCase());   // only runs if name is not null
}
```

If `name` is `null`, the condition `name != null` is `false` and Java skips the whole block, so `toUpperCase()` is never called on `null`. Without the `if`, that call would stop the program with a `NullPointerException`, the error the following paragraphs explain. [03-control-flow.md](03-control-flow.md) taught you how to write this check, but not where in a program to make it. That is the question this section answers: **where** should an argument that arrives as `null` be rejected? In the _Method declaration_ section you saw that the compiler checks, on every call, that the method's contract is met: its name, its parameters and its return type. But it cannot reject a `null` argument, because `null` is a valid value for any parameter of an object type. For example, `printName`'s parameter is a `String`, which is an object type, so `printName(null)` compiles just like `printName("Ana")`. So when a method really needs a value, you have to write the check yourself, and the rest of this section explains which method it belongs in.

As [01-variables-types.md](01-variables-types.md) showed, `null` means "this reference points at no object". It is a valid value for any variable that holds a reference, that is, the memory address of an object, such as variables of type `String`, `Project` or `Integer`, and those that hold an array. On the other hand, `null` is not a valid value for a variable of a primitive type, which holds its value directly and not a memory address. That is why `int x = null;` does not compile.

A variable being `null` is not an error in itself. The error appears when you use that variable to reach the object it should point at: for example, when you call a method on a variable that is `null` (`name.toUpperCase()`), read one of its fields or read a position of an array (`numbers[0]`). In other words, whenever you try to do something with the object the variable is supposed to point at. To do any of those things, the JVM goes to the memory address the variable holds and works with the object there. That operation is called **dereferencing**. If the variable is `null`, it holds no address and there is no object to work with, so the JVM throws a `NullPointerException`: the code expected an object and actually had a `null`.

```java
String name = null;
name.toUpperCase();   // ❌ NullPointerException at runtime — the file compiles fine
```

> **Why is this a runtime failure and not a compiler error?** Because the compiler tracks *types*, not *values*. It knows `name` is a `String`, and `String` has a `toUpperCase()`, so the call is correct as far as types go and the file compiles. What it cannot know is which of the many paths through your program actually reaches that line, and with what value the variable arrives. For example, `name` might be the result of a database query, a field of an HTTP request body, a lookup that found nothing, and so on. Whether a variable is `null` depends on what happens when the program runs, not on its type, so it is checked at the moment the variable is used. And that is why nothing in the syntax warns you until the program runs and throws the exception.

### A `NullPointerException` is thrown where the `null` is used, not where it appeared

The hard part of a `NullPointerException` is not understanding the error, but finding where the `null` came from. A `null` can be passed from one method to another as an argument without anything failing: as long as the `null` is only passed and not used, no error is thrown. The exception is thrown in the first method that uses it, and that method can be several calls away from the place where the `null` appeared. This example shows that distance with just three methods: `main` creates the `null` on line 9, `buildPage` receives it and passes it on to `slug` without using it, and `slug` is the one that fails on line 3, when it calls `toLowerCase()` on it:

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

The **message** answers *what went wrong*: `Cannot invoke "String.toLowerCase()" because "title" is null` — the method you tried to call, and the exact expression that was `null`. The **stack trace** below it answers *where you were*: the list of methods that were in progress, most recent first, so `slug` was running, called from `buildPage`, called from `main`.

> **Each line of the stack trace is one frame: one method call that had started and not yet finished.** When `main` called `buildPage`, `main` did not end — it paused on line 10, waiting for the result. `buildPage` in turn paused on line 6 while `slug` ran. So at the moment of the crash three calls were open at once, and the stack trace lists them with the most recent, `slug`, on top and the oldest, `main`, at the bottom. That is why line 9, where `main` creates the `null`, is said to be two frames further down than line 3, where the exception is thrown: in the stack trace you go down two calls, from `slug` to `buildPage` and from `buildPage` to `main`, the method that contains line 9. How the JVM keeps those paused calls — the call stack — is [05-memory-model.md](05-memory-model.md)'s subject, and reading long traces with several exceptions chained together is [11-exceptions.md](11-exceptions.md)'s.

Now notice the trap. The stack trace's top line is `Report.java:3`, and that line is not wrong in any way — `slug` is a fine method that we passed a `null` value we should not have passed it. The mistake was made at line 9, two frames further down, and nothing in the report points at it. In a real application there can be many more calls between the method where the `null` appears and the one that uses it, spread over several classes, and the file at the top of the stack trace can be one you had no reason to suspect. That is why, in a real project, finding where a `null` came from can be much harder than in this example.

> **Since Java 15, the exception message says which method could not be called and which value was `null`.** In [01-variables-types.md](01-variables-types.md), in the _Autoboxing and unboxing_ section, you saw a message of this same form when unboxing a `null`: `Cannot invoke "java.lang.Integer.intValue()" because the return value of "java.util.Map.get(Object)" is null`. This kind of message appeared in Java 14, but it was only shown if you turned it on with an option when starting the program. Since Java 15 it is always shown, without you having to do anything. Before Java 14, the first line read exactly `java.lang.NullPointerException` and nothing else — no method name, no variable — so a line with three chained calls gave you no way to know which link was null. Modern Java walks the bytecode of the failing instruction to find out which expression was `null`, and with that it builds a message like the one in the `Report` example: `Cannot invoke "String.toLowerCase()" because "title" is null`. One detail worth knowing: the variable name in the message comes from the `.class` file, and it is not always there. When compiling, `javac` only stores the names of parameters and local variables in the `.class` file if you ask it to with the `-g` option, which adds what is called debug information. IntelliJ and Maven compile with that option by default, so you will normally see the real name: `because "title" is null`. If a class is compiled without it, the JVM does not know the name `title`, only that it is the method's first parameter, and the same failure prints `because "<parameter1>" is null`. The message still says which value was `null`, but you have to look at the method's declaration yourself to know which parameter is its first one.

### The fix: reject the missing value at the boundary that requires it

The fix is not to fill your methods with `if (x != null)` checks. If each method simply skips its work when it receives a `null`, the program stops throwing the exception, but the error is still there and nothing warns you about it any more. For example, if `slug` checked `title` and returned `null` instead of failing:

```java
static String slug(String title) {
    if (title == null) {
        return null;   // ❌ skips its work, but the null keeps going
    }
    return title.toLowerCase().replace(' ', '-');
}
```

`buildPage` would receive that `null` and join it with `+` to `"<h1>"` and `"</h1>"`. When you concatenate a `null`, Java writes the text `null`, so the page would show `<h1>null</h1>`. The program does not fail, and nobody notices the error until someone looks at the page. That is why this outcome is worse than the exception: the exception at least warns you at the moment it happens.

The fix is knowing **where** to reject the `null`. A method that cannot do its job without an argument should say so as soon as the method starts, before doing anything else. This is what is known as a **guard clause**, which you already saw in the [Return types](#return-types) section. That check goes in the first method that receives the value from outside and needs it to do its job, that is, the place where the value enters this part of the code. In the example, the calls go from `main` to `buildPage` and from `buildPage` to `slug`. `main` creates the `null`, and `buildPage` is the first method that receives it: it is the public entry point of this little feature, the one whose contract says "give me a title and I give you a page". If `buildPage` rejects the `null` as soon as it starts, the exception is thrown there and not later, inside `slug`.

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

With the check in `buildPage`, the report improves in two ways. The first is the message: it is now the sentence you wrote in `requireNonNull`, `title must not be null`, and it says directly which parameter was missing. Before, it described the call that had failed inside `slug`, and you had to work out for yourself which rule had been broken. The second is the stack trace. Its first line is `Objects.requireNonNull`, which is Java's code and not yours. Right below it is `Report2.buildPage`, the method that requires the title, and below that, `Report2.main(Report2.java:13)`, the line that passed it the `null`. So you do not have to investigate where the error comes from: the stack trace takes you straight to the call that caused it.

> **What the trace can point at, and what it never can.** `Report2` is the same program as `Report` with three lines added: `import java.util.Objects;` and a blank line at the top, and the check `Objects.requireNonNull(title, "title must not be null");` as the first line of `buildPage`. Those three extra lines are why the call in `main` moved from line 10 to line 13. A stack trace lists only the methods that had not finished at the moment the failure happens, and for each one it shows the line where it was paused. That is why it can never show the line that created the `null` (line 9 in `Report`, line 12 in `Report2`): when the failure happens, that line has already run, and `main` is paused on the next line, waiting for `buildPage` to finish. That next line does appear in both traces (`Report.java:10` and `Report2.java:13`). It is the one that passes the `null` to `buildPage`, and in this example the line that created it sits right above it. What changes from one trace to the other is which of your frames appears at the very top, that is, the most recent method of your code that had not finished. Before, the top was `slug`, a method whose code was fine. Now it is `buildPage`, the method that needs a title to do its job and has received `null`, and the next frame, `main`, is the one that passed it that `null`. So the stack trace now takes you to the right place: the method where the failure happens and the call that caused it. Before, it left you in `slug`, the method `buildPage` had passed the `null` on to, and in a real backend, with many calls in between, it would leave you much further from that place.

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
