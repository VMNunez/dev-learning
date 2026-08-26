# OOP — Classes

> 📖 [Baeldung — A guide to Java classes and objects](https://www.baeldung.com/java-classes-objects) → read: "2. Classes" and "3. Objects"
> 📖 [Oracle Docs — Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html)

## What is object-oriented programming

> Docs: https://www.baeldung.com/java-oop → read: "1. Overview" and "4. Abstraction" — the four pillars named in one place; you will meet each one across this file and the two that follow

At the end of [04-methods.md](04-methods.md) you turned the `Calculator` into something with a field and a constructor — a small object that holds state *and* the methods that work on it. That is not a detail of one example; it is the whole idea this file is about.

**Object-oriented programming** (OOP) is a way of organising code by grouping data and the behaviour that acts on it into single units called **objects**. Instead of loose functions floating next to loose variables, you define **classes** that bundle both together.

Take an `Employee`. In a non-OOP style you might keep a `name` string here, an `email` string there, and separate functions `getName(name)`, `setEmail(...)` somewhere else — nothing tying them together. In OOP the `Employee` *is* one thing that carries its own data (`name`, `email`, `age`) **and** the methods that operate on that data (`getName()`, `setEmail()`, `isActive()`). The data and the behaviour live in the same box.

> **Why bundle them at all?** Because the methods that change a piece of data should sit next to that data, guarding it. If `age` and `setAge()` live together in one object, the object can refuse an invalid age (see *Encapsulation* below). Scatter them and nothing stops the outside world from setting `age = -500` directly. OOP is what makes an object able to *protect itself* — the recurring theme of this whole file.

Java is object-oriented almost 100% of the way through: nearly everything you write lives inside a class. You have already been doing it without naming it — every `main` method sat inside a class, and every `String` or `Integer` you touched was an object. This file finally looks at the class itself head-on.

## What is a class

> Docs: https://www.baeldung.com/java-classes-objects → read: "2. Classes" and "3. Objects" — the minimal class/instance pair, written out step by step

A class is a blueprint for creating objects. An object is one instance of that class.

```java
// Blueprint
public class Employee {
    // Fields — the data the object holds (always private)
    private String name;
    private String email;
    private int age;

    // Constructor — runs when you create a new object with new
    public Employee(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    // Getters — read the private fields
    public String getName() { return name; }  // this.name also works; when there is no ambiguity, Java understands name as this.name
    public String getEmail() { return email; }
    public int getAge() { return age; }

    // Setters — modify the private fields
    public void setEmail(String email) { this.email = email; }
}

// Creating an object from the blueprint
Employee emp = new Employee("Victor", "victor@example.com", 31);
System.out.println(emp.getName());   // "Victor"
```

The class is written once; the objects are stamped out from it as many times as you call `new`. Each object gets its **own** copy of the fields — change one and the others are untouched:

```
        class Employee            <- the mould (one definition, written once)
        ┌──────────────────┐
        │ name  : String   │
        │ email : String   │
        │ age   : int      │
        └──────────────────┘
                 │  new Employee(...)  new Employee(...)
                 ▼                 ▼
   emp1 ┌──────────────────┐   emp2 ┌──────────────────┐
        │ name  = "Victor" │        │ name  = "Ana"    │   <- separate objects (instances),
        │ email = "v@e.com"│        │ email = "a@e.com"│      each with its own field values
        │ age   = 31       │        │ age   = 28       │
        └──────────────────┘        └──────────────────┘
```

> **Blueprint is literal.** The class holds no data of its own — `name`/`email`/`age` are just *slots* the mould promises every object will have. The actual values only exist once you `new` an object. Think of the class as an architect's plan and each object as a house built from it: the plan says "there is a front door here", each house has its own actual door.

### What `new` actually does

`new` is doing three separate jobs in one word, and the rest of this file only makes sense once you can name them:

1. It **reserves memory** for a fresh object — enough room for one copy of every field the class declares. That memory comes from a shared region called the **heap**, and the field slots start out at their default values (`null` for objects, `0` for numbers, `false` for `boolean`) before any of your code touches them.
2. It **runs the constructor** on that raw memory, which is what fills the slots with real values.
3. It **hands back a reference** to the finished object — not the object itself, but the address where it lives.

That third step is the one that matters most. When you write `Employee emp = new Employee(...)`, the variable `emp` does not *contain* the employee: it contains an arrow pointing at it. Two variables can hold arrows to the same single object, and that is precisely why `==` and `equals()` answer different questions later in this file — `==` compares the arrows, `equals()` compares what they point at.

```
   emp  ●───────────►  ┌────────────────────────┐
                       │ Employee               │   the object itself, on the heap
   emp2 ●───────────►  │  name  = "Victor"      │   both variables hold an arrow
                       │  email = "v@e.com"     │   to the SAME box
                       └────────────────────────┘
```

> **Where does that memory go afterwards?** Nothing in your code frees it. Java tracks whether any arrow still points at the object and reclaims it automatically once none does — the garbage collector. The full picture of stack, heap and collection is the last file of these notes, [05-memory-model.md](05-memory-model.md); for now all you need is "`new` puts the object on the heap and gives you an arrow to it".

---

## `this`

> Docs: https://www.baeldung.com/java-this → read: "2. Disambiguating Field Shadowing" and "3. Referencing Constructors of the Same Class" — the two uses this section covers, in that order

Look at the constructor in *What is a class*: the parameter is called `name` and the field is also called `name`. So what does a bare `name = name` mean? Java resolves any name to the *closest* one in scope, and the parameter is closer than the field — so `name` alone always means the parameter, and `name = name` just assigns the parameter to itself, leaving the field untouched. You need a way to say "the field, not the parameter". That word is `this`.

`this` is a reference to the current object — the specific instance whose constructor or method is running right now. Prefixing a field with `this.` reaches past the parameter and points at the object's own slot:

```java
public Employee(String name) {
    this.name = name;   // this.name = the field on this object; name = the parameter
}
```

> **Why keep the same name at all — why not just call the parameter `n`?** You could, but naming the parameter after the field it fills is the standard convention in Java: it documents which field the value is going into, and `this.` removes the only downside (the ambiguity). Reading `this.email = email` tells you at a glance "the incoming email becomes this object's email".

Also used to call another constructor from within a constructor. Both constructors belong to the same class — it is a way to reuse initialisation logic when one constructor is a special case of the other:

```java
public class Employee {
    private String name;
    private String email;

    // One-parameter constructor — delegates to the two-parameter one to avoid duplicating code
    public Employee(String name) {
        this(name, "unknown@email.com");   // calls the two-parameter constructor of this same class
    }

    // Two-parameter constructor — contains the real initialisation logic
    public Employee(String name, String email) {
        this.name = name;
        this.email = email;
    }
}

new Employee("Victor");                        // name="Victor", email="unknown@email.com"
new Employee("Victor", "victor@example.com"); // name="Victor", email="victor@example.com"
```

Whenever you see `this(...)` inside a constructor, it means "call another constructor of this same class with these arguments." In practice you will almost always write it as the **first line**, and until recently the compiler forced you to.

> **Why the delegation goes first.** A constructor's one job is to bring the object from raw, uninitialised memory to a fully valid state. Statements that run *before* the delegation are working on a half-built object, and the delegated constructor then runs and overwrites whatever they did — silently throwing the work away. That is why "delegate first, then add your own lines on top of a properly initialised object" is the shape you want, and the shape every codebase you read will use.

> **The rule was relaxed in Java 25 — but the reason survives.** Through Java 21, `this(...)` (and `super(...)`) had to be literally the first statement, and anything before it was a compile error. Java 25 finalised **flexible constructor bodies**: you may now run a *prologue* before delegating — argument validation, a value computed once and passed to both branches — as long as it does not touch the object being built. The moment the prologue reads a field or calls an instance method, the compiler stops you, because that object does not exist yet:
>
> ```java
> public Employee(String name) {
>     System.out.println(this.name);   // ❌ reads a field that has not been created
>     this(name, "unknown@email.com");
> }
> ```
>
> ```
> error: cannot reference this before supertype constructor has been called
>     System.out.println(this.name);
>                        ^
> ```
>
> Note what the compiler does *not* stop: writing `this.name = "early";` before the delegation compiles fine, and the delegated constructor then overwrites it. The old rule made that mistake impossible; now it is legal and silent. Keep `this(...)` first unless you have a concrete reason not to.

---

## Constructors

> Docs: https://www.baeldung.com/java-constructors → read: "3. A No-Argument Constructor" and "4. A Parameterized Constructor" — the two forms this section contrasts

A constructor is the special method that runs when you create an object with `new`. Two fixed rules: (1) it must be named exactly the same as the class, and (2) it has no return type — not even `void`. That is how the compiler tells it apart from a regular method.

```java
public class Employee {
    private String name;
    private int age;

    // Constructor — same name as the class, no return type
    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

// Invoked with new — Java runs the constructor automatically
Employee emp = new Employee("Victor", 31);
```

### What the object looks like before the constructor runs

The constructor body is not where the fields come into existence — `new` has already reserved the slots by then (see *What `new` actually does* above). Every slot starts at its type's **default value**, and the constructor's job is to overwrite those defaults with real data. You can watch it happen by printing the fields on the very first line of the constructor, before any assignment:

```java
public class Employee {
    private String name;      // slot exists, holds null
    private int age;          // slot exists, holds 0
    private boolean active;   // slot exists, holds false

    public Employee(String name) {
        System.out.println(this.name + " " + age + " " + active);  // prints: null 0 false
        this.name = name;
    }
}
```

> **The `this.` on that first line is doing real work.** Drop it and you print `Victor 0 false`, not `null 0 false` — because a bare `name` resolves to the parameter, exactly as §`this` explained, and the parameter already holds the value you passed to `new`. Only `this.name` looks inside the object's own slot, which is what is still empty at that moment. `age` and `active` need no prefix because no parameter shadows them.

> **This is the difference between a field and a local variable.** A local variable inside a method has no default — read it before assigning and the compiler refuses to build (`variable count might not have been initialized`). A *field* is always defaulted, because `new` zeroes the memory it hands over. That is why an `int` field is `0` and never garbage, and why forgetting to assign a field in the constructor gives you a silent `null` rather than a compiler error — a bug the compiler will not catch for you.

### The default constructor, and how you lose it

If you write no constructor at all, the compiler quietly supplies one for you: no parameters, empty body. That is the whole reason `new Employee()` works on a class where you never wrote `Employee()`.

The rule underneath is narrower than it looks: **the compiler only supplies that constructor when you supplied none.** It is a fallback, not an addition. Declare any constructor — even one — and the fallback is never generated, so the no-argument form stops existing:

```java
public class Employee {
    private String name;
    private int age;

    public Employee(String name, int age) {   // the moment this exists, Employee() does not
        this.name = name;
        this.age = age;
    }
}

Employee emp = new Employee();   // ❌ does not compile
```

```
error: constructor Employee in class Employee cannot be applied to given types;
        Employee emp = new Employee();
                       ^
  required: String,int
  found:    no arguments
  reason: actual and formal argument lists differ in length
```

> **Why does the compiler take it away instead of keeping both?** Because a constructor with parameters is a statement about what an object needs in order to be valid. If you demand a `name` and an `age`, an empty `Employee` with `null` and `0` in it is exactly the object you were trying to prevent. Silently leaving the no-arg door open would defeat the constructor you just wrote. If you *do* want both — the parameterised one and an empty one — you write the empty one yourself; that is what §"Constructor overloading" below is about. This bites in Spring Boot too: JPA requires a no-argument constructor to rebuild an entity from a database row, which is why the TimeTrack `User` class carries Lombok's `@NoArgsConstructor` next to `@AllArgsConstructor` (`projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/User.java`) — writing the all-args one alone would have removed the empty one JPA needs.

### A `private` constructor — when nobody may instantiate

Constructors are *usually* `public`, since the point of most classes is that other code creates objects from them. But the modifier is a real choice, not a formality, and marking a constructor `private` means "no code outside this class may call `new` on me":

```java
public final class ValidationUtils {
    private ValidationUtils() {}   // nobody instantiates this — it is a bag of static helpers

    public static boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}

new ValidationUtils();   // ❌ error: ValidationUtils() has private access in ValidationUtils
```

> **Why bother forbidding it?** A class whose methods are all `static` has nothing per-object to hold — an instance of it would be an empty box with no purpose, and creating one would signal to a reader that it carries state when it does not. The private constructor makes the intent enforceable instead of a comment. The same trick is how the singleton pattern works: the class hides its constructor and hands out one shared instance through a static method, so nobody can make a second one behind its back.

---

## Encapsulation

> Docs: https://www.baeldung.com/java-oop → read: "5. Encapsulation" — the private-field-plus-accessor shape, and why it is one of the four pillars

Fields are always `private` — they can only be accessed through the class's own methods (getters/setters). This protects the data from being changed directly from outside:

```java
public class Employee {
    private String name;   // private — no one outside can touch it directly
    private int age;       // private — accessed only through getters/setters

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return this.name; }   // getter — controlled read access
    public int getAge() { return this.age; }         // getter — controlled read access
    public void setAge(int age) {                    // setter with validation
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.age = age;
    }
}
```

The protection is not a convention the caller is trusted to respect — `private` is enforced by the compiler, and code outside the class never even builds:

```java
// ❌ MAL — reaching for the field directly, from outside the class
emp.age = -500;
// error: age has private access in Employee
//     emp.age = -500;
//        ^

// ✅ BIEN — the only way in is the setter, which validates first
emp.setAge(-500);   // throws IllegalArgumentException: Age cannot be negative
```

> **Note where each failure happens.** The first line is not a bug you find in production — it is a red squiggle in IntelliJ; the class is unreachable from outside, full stop. The second line *compiles*, because calling `setAge` is legal; it fails at runtime, on the object's own terms, with the message the object chose. That is the whole trade encapsulation makes: it converts "anyone can put anything in this field" into "the field can only change through a method that gets to say no".

### The leak that breaks encapsulation anyway

Making fields `private` is the part everyone remembers. The part that actually goes wrong in real code is this: **a getter that returns the internal object hands the caller a live arrow to your state.** Nothing was made public, and yet the outside world can now change the object from behind:

```java
public class Employee {
    private final List<String> skills = new ArrayList<>();

    // ❌ MAL — returns the object's OWN list
    public List<String> getSkills() {
        return skills;
    }
}

Employee emp = new Employee();
emp.getSkills().add("Java");   // compiles, runs, and mutates the employee's internal list
```

The field is `private`. It is even `final`. Neither helps, because — as *What `new` actually does* established — the getter returns the arrow, not a copy, so caller and object are now pointing at one single list. `final` only freezes which list the field points at; it says nothing about what may be added to it.

```java
public class Employee {
    private final List<String> skills = new ArrayList<>();

    // ✅ BIEN — hands out a read-only snapshot; the internal list stays private
    public List<String> getSkills() {
        return List.copyOf(skills);
    }

    // the only supported way to change the state: a method the object controls
    public void addSkill(String skill) {
        if (skill == null || skill.isBlank()) throw new IllegalArgumentException("Skill required");
        skills.add(skill);
    }
}

emp.getSkills().add("Angular");   // throws UnsupportedOperationException — the copy is immutable
```

This move is called a **defensive copy**: you never let a reference to your mutable internals escape. `List.copyOf(...)` gives back an unmodifiable list, so an attempt to write through it fails loudly instead of silently corrupting the object.

> **Why is a `String` field safe without any of this?** Because `String` is immutable — there is no method on it that changes its contents, so handing out the reference gives the caller nothing to break. The rule follows from that: return immutable things freely, copy mutable ones. `List`, `Map`, `Date` and your own classes with setters are mutable; `String`, `Integer`, `LocalDate` and records of immutable components are not.

> **Read-only objects take the idea further.** Drop the setters entirely and mark every field `final`, and the object cannot change after construction at all — no validation to write, no leak to guard, and it is safe to share anywhere. That is exactly what §"Records" at the end of this file gives you as a one-liner.

> **The `getX()` / `setX()` / `isX()` shape is not just style.** It is the **JavaBeans** convention, and Jackson, JPA and Lombok locate a property by looking for those exact method names at runtime — rename `getName()` to `fetchName()` and the field silently disappears from your JSON. It is explained in full in [04-methods.md](04-methods.md) §"Naming conventions"; the one-line version is: name accessors this way or three separate tools stop seeing your data.

---

## Static fields and methods

> Docs: https://www.baeldung.com/java-static → read: "2. The static Fields (Or Class Variables)", "3. The static Methods (Or Class Methods)" and "6. Understanding the 'Non-static variable' Error"

"Members" is the general term for the fields and methods of a class. `static` members belong to the class itself, not to any individual object. `static` makes sense in two situations: (1) when the method only works with its arguments and needs no instance data — like `Integer.parseInt("42")`; (2) when you want a field shared across all instances — like a counter of how many objects have been created.

"Belongs to the class, not to any object" is not just a slogan — it is a fact about *where the value physically lives in memory*. A normal (non-static) field gets **one slot per object**: create three `Employee`s and there are three separate `name` slots, one inside each object, as the diagram in *What is a class* showed. A `static` field is different — Java allocates **exactly one slot**, attached to the class itself, and every object shares that same slot:

```
   static int count  ──►  ┌─────────┐   one shared slot, owned by the class
                          │   3     │   (all instances read/write the SAME box)
                          └─────────┘
                             ▲  ▲  ▲
                             │  │  │
        emp1 ────────────────┘  │  └──────────────── emp3
        (name="Victor")     emp2 (name="Ana")   (name="Leo")
        each has its OWN name slot, but they all point at the ONE count
```

This is exactly why the counter works: because there is only one `count` box in the whole program, every constructor that does `count++` is incrementing the *same* box. If each object had its own `count`, every one would sit at `1` and the total would be lost. A `static` method works the same way — there is one copy of the method attached to the class, and since it isn't tied to any object it cannot read per-object fields (there is no "this object" for it to look inside).

```java
public class Employee {
    private static int count = 0;   // shared by ALL instances
    private String name;

    public Employee(String name) {
        this.name = name;
        count++;   // every new Employee increments the shared count
    }

    public static int getCount() {
        return count;
    }
}

Employee.getCount();   // called on the class, not on an instance
```

### A static method has no `this`

The consequence of "one copy, attached to the class" arrives the first time you try to touch a normal field from a `static` method. There is no object involved in the call — `Employee.getCount()` names the class, not an instance — so there is no `this` for the method to look inside, and therefore no `name` to read:

```java
public class Employee {
    private String name;

    public static String shout() {
        return name.toUpperCase();   // ❌ which employee's name? there is no object here
    }
}
```

```
error: non-static variable name cannot be referenced from a static context
    public static String shout() { return name.toUpperCase(); }
                                          ^
```

The fix is to make the value arrive as an argument (`shout(String name)`) or to drop `static` so the method is called on an object. You met the same error from the other side in [04-methods.md](04-methods.md) §"Static methods" — it is also the reason `main` must be `static`: the JVM has to call it before a single object exists.

### When the static field is initialised

A `static` field is set up **once, when the class is loaded** — before any instance exists, and before `main` runs a line of your logic. Instance fields are initialised per object, every time you call `new`; a static field is initialised per *class*, exactly once, for the entire life of the program.

For anything more involved than a single assignment, there is a dedicated place to put that one-time setup: a **static initialiser block** — a bare `static { ... }` block in the class body, which runs at class-loading time in the order it appears:

```java
public class Employee {
    private static final Map<String, Integer> LEVELS = new HashMap<>();

    static {                       // runs once, at class loading, before any Employee exists
        LEVELS.put("junior", 1);
        LEVELS.put("mid", 2);
        LEVELS.put("senior", 3);
    }
}
```

> **Why a block instead of just writing it in the constructor?** Because the constructor runs on every `new` — putting shared setup there would rebuild the same table for the tenth employee as for the first, and worse, the table would not exist until somebody happened to create an object. The static block ties the work to the class being loaded, which is the moment the shared slot actually comes into being. It runs at most once, whether you create a thousand objects or none.

---

## Constructor overloading

> Docs: https://www.baeldung.com/java-constructors → read: "6. A Chained Constructor" — the delegating pair, and how the compiler tells overloads apart

You have already written a pair of overloaded constructors: the two-`Employee`-constructor example in §`this` — a one-parameter form delegating to a two-parameter one — *is* constructor overloading. The name for it comes from method overloading in [04-methods.md](04-methods.md): several members sharing a name, told apart by their **signature**, meaning the type and order of their parameters. Constructors all share the class's name by force, so the parameter list is the only thing that can distinguish them, and you can declare as many as you like.

What that section did not cover is how Java decides *which* one a given `new` runs. That is the piece worth adding here, because it is where overloading stops being obvious.

### Which constructor wins

The compiler resolves the call at compile time, from the static types of the arguments, in the same order as for methods: an exact match first, then a **widening** conversion (an `int` argument accepted by a `long` parameter), then **boxing** (an `int` accepted by an `Integer`), then **varargs** as the last resort. It never guesses at runtime — the choice is baked into the compiled code.

The rule breaks down when two candidates are equally good, and the compiler refuses rather than picking one:

```java
public class Employee {
    public Employee(String name) { }
    public Employee(Integer id) { }
}

new Employee(null);   // ❌ String or Integer? both accept null
```

```
error: reference to Employee is ambiguous
    Employee e = new Employee(null);
                 ^
  both constructor Employee(String) in Employee and constructor Employee(Integer) in Employee match
```

> **How do you get out of it?** Tell the compiler which one you mean by typing the `null`: `new Employee((String) null)` compiles and picks the first. But the cast is a signal, not a solution — if callers need a cast to say what they mean, the two constructors are ambiguous *to humans* too. The usual real fix is a static factory method with a name that says which one it is (`Employee.fromName(...)` / `Employee.fromId(...)`), because a name can distinguish two things that a shared parameter shape cannot.

---

## `toString()`

> Docs: https://www.baeldung.com/java-tostring → read: "2. Default Behavior" and "3. Overriding Default Behavior" — what you get for free and what changes when you override it

When you do `System.out.println(emp)`, Java needs to convert the object to text. It looks for a method named exactly `toString()` in your class — if it does not find one, it falls back to the one from `Object`, which prints something unreadable like `Employee@1b6d3586` (class name + memory address, useless for debugging).

> **Where does that fallback come from, if your class has no parent?** Every class in Java implicitly extends a class called `Object`, whether you write it or not — `public class Employee { }` is compiled as if it said `extends Object`. `Object` already defines `toString()`, `equals()` and `hashCode()`, so those three methods exist on *every* object that has ever been created, including yours, before you write a line. That is the mechanism behind this whole section and the next: you are never adding these methods, you are always replacing an inherited one. Inheritance itself — what `extends` means, how a subclass replaces a parent's method — is the subject of [08-inheritance-polymorphism.md](08-inheritance-polymorphism.md), which comes back to `Object` in its own section. For now you only need the fact: your class already inherits these three, and they behave badly by default.

The name `toString()` is not your choice — it is the name Java expects by convention. It always returns `String` and takes no parameters.

`@Override` tells the compiler "I am replacing this method from a parent class." If you misspell the name (e.g. `tostring()` in lowercase), without `@Override` Java would treat it as a brand new unrelated method and your `println` would still show the memory address. With `@Override` the compiler catches the typo immediately, because it goes looking for a method with that exact signature in `Object` and does not find one:

```
error: method does not override or implement a method from a supertype
    @Override
    ^
```

That error is the entire value of the annotation: without it, the misspelled method compiles perfectly and does nothing, and you spend an afternoon wondering why your logs still show memory addresses. You will learn annotations properly in [16-annotations.md](16-annotations.md) — for now, just know that `@Override` goes above any method you are intentionally replacing.

```java
@Override
public String toString() {
    return "Employee{name='" + name + "', email='" + email + "'}";
}

System.out.println(emp);   // Employee{name='Victor', email='victor@example.com'}
```

---

## `equals()` and `hashCode()`

> Docs: https://www.baeldung.com/java-equals-hashcode-contracts → read: "2.1. Overriding equals()" and "3. The .hashCode() Method" — the implementation shape; the contract itself is the next section here

Both of these are inherited from `Object` too (see the callout in §`toString()` above), which is why calling `emp1.equals(emp2)` compiles on a class where you never wrote `equals` — you are always overriding, never inventing.

You already know that for Strings you use `.equals()` instead of `==` because `==` compares references (memory addresses), not content. The same problem exists for any object you define yourself.

By default, if you do `emp1.equals(emp2)`, Java checks if they are the same object in memory — not if they hold the same data. If you want two employees to be "equal" when they have the same email, you override `equals()` in your class to define what "equal" means:

```java
// Inside the Employee class:
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;                        // same object — trivially equal
    if (!(obj instanceof Employee other)) return false;  // different types — cannot be equal
    return Objects.equals(this.email, other.email);      // your equality criterion: same email
}
```

> **What is `other`, and why does it appear out of nowhere?** The parameter arrives typed as `Object` (that is the signature Java forces on `equals`), so you cannot read `obj.email` — the `Object` type has no `email`. You need it seen as an `Employee`. `obj instanceof Employee other` does two jobs in one line: it checks whether `obj` really is an `Employee`, and *if so* it declares a new variable `other` already cast to `Employee`, so the next line can safely read `other.email`. This "declare the cast variable inline" form is **pattern matching for `instanceof`**, added in Java 16. Before it, you wrote the check and the cast as two separate steps:
>
> ```java
> if (!(obj instanceof Employee)) return false;
> Employee other = (Employee) obj;   // the old two-step way — check, then cast by hand
> ```
>
> Both do the same thing; the Java 16 form just folds the cast into the check so you never repeat the type.

> **What is `Objects`?** `Objects` (from `java.util`) is a small utility class of static helpers for exactly this kind of code. `Objects.equals(a, b)` compares two values but survives `null` — if both are `null` it returns `true`, and it never throws a `NullPointerException` the way `a.equals(b)` would when `a` is `null`. `Objects.hash(...)` takes any number of fields and combines them into one `int` hash. You use them so you don't have to write the null-checks and the hash-mixing arithmetic by hand.

`hashCode()` always goes together with `equals()` — collections like `HashMap` and `HashSet` use both to organise objects. The rule is simple: if two objects are equal according to `equals()`, they must have the same `hashCode()`. If you override one without the other, those collections stop working correctly:

```java
@Override
public int hashCode() {
    return Objects.hash(email);  // same field you used in equals()
}
```

> **Why does a `HashMap` even need `hashCode()`?** A `HashMap` does not scan every key one by one when you look something up — that would be slow. Instead it keeps an array of "buckets", and it uses the key's `hashCode()` as an address: roughly `bucketIndex = hashCode % numberOfBuckets`. To store or find a key it jumps straight to that one bucket instead of searching the whole map. Only *inside* that bucket does it fall back on `equals()` to tell apart keys that happened to land together. Now the rule makes sense mechanically: if two equal objects returned *different* hash codes, they would be sent to *different* buckets — you would store an entry under one address and later look for it at another, and the map would swear the key isn't there even though an equal one is. That is why equal objects must share a `hashCode()`: it is what guarantees they land in the same bucket where `equals()` can then match them.

In practice, IntelliJ generates both automatically: `Code → Generate → equals() and hashCode()`.

---

## The `equals()` contract

> Docs: https://www.baeldung.com/java-equals-hashcode-contracts → read: "2.2. The .equals() Contract" and "3.1. The .hashCode() Contract" — the five rules and the hash rule, with the violations spelled out

`equals()` looks like a method you can implement however you like: it takes an `Object`, it returns a `boolean`, nothing stops you. But `HashMap`, `HashSet`, `List.contains()` and `List.remove()` all call it and all assume it behaves sanely. Those assumptions are written down as a **contract** — five rules your implementation must satisfy. Break one and nothing fails at compile time; the collections simply start giving wrong answers.

| Rule | What it demands | Broken by |
|---|---|---|
| Reflexive | `x.equals(x)` is always `true` | comparing a field that is `NaN`, or a "freshness" timestamp |
| Symmetric | if `x.equals(y)` then `y.equals(x)` | a subclass that accepts its parent, while the parent rejects the subclass |
| Transitive | if `x.equals(y)` and `y.equals(z)` then `x.equals(z)` | comparing on different fields depending on the argument's type |
| Consistent | repeated calls give the same answer, as long as nothing used in the comparison changed | comparing on a mutable field, or on the current time |
| Null-false | `x.equals(null)` is `false`, never an exception | reading a field off the argument before the `instanceof` check |

Read the table as *obligations on your code*, not as behaviour Java provides: the middle column is what a caller is entitled to assume, and the right-hand column is the mistake that removes that guarantee. The `instanceof` pattern from the previous section satisfies the last rule for free, because `null instanceof Employee` is `false` — which is exactly why the standard implementation starts with that check instead of a `null` test.

There is one more rule, and it links the two methods:

> **Equal objects must have equal hash codes — but equal hash codes do NOT mean equal objects.** The arrow only points one way, and the asymmetry is not a wart, it is arithmetic: a `hashCode()` returns an `int`, so there are about four billion possible values and an unlimited number of possible objects. Two different objects landing on the same number is unavoidable — that is a **collision**, and a `HashMap` deals with it by keeping several entries in the same bucket and using `equals()` to tell them apart. What a map cannot recover from is the other direction: two *equal* objects with *different* hash codes are sent to different buckets, and `equals()` never gets the chance to run.

That asymmetry has a consequence worth seeing, because it is a favourite interview question:

```java
@Override
public int hashCode() {
    return 42;   // technically legal — never breaks the contract
}
```

This is a *correct* `hashCode()`. Equal objects certainly return equal hash codes, since everything returns 42. What it destroys is performance: every key lands in the same bucket, so the map has one long chain to walk and `get()` degenerates from "jump straight to the entry" to "compare against every key you ever stored". A `HashMap` with a constant hash is a `List` wearing a costume.

> **Which fields belong in `equals()` then?** The ones that identify the object, and nothing else — usually the business identifier (`email` for a user, an invoice number for an invoice). Never include a mutable field that changes during the object's life, or you break *consistency*: an object stored in a `HashSet` under one hash becomes unfindable the moment you change that field, because the set still looks in the old bucket. And whichever fields you pick for `equals()`, use exactly the same ones in `hashCode()` — that is what keeps the two in step.

---

## `equals()` and `hashCode()` on a JPA entity

> Docs: https://www.baeldung.com/jpa-entity-equality → read: "2.2. Transient Entities" and "3.3. Using a Business Key" — the null-id problem and the answer this section lands on

> **Preview — Spring Boot:** this section uses JPA entities — classes that Spring maps to database rows. You will study them properly in the Spring Boot notes; here they are the case that shows why the contract above is not academic. The class it discusses is real: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/model/User.java`.

The obvious answer to "which field identifies a `User`?" is the database id. In TimeTrack, `User` carries one:

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Long id;
    // name, email, password, role, active
}
```

`@GeneratedValue` means the database assigns the id, and the database only sees the object when you save it. So a `User` you have just created with `new` has `id == null`, and stays that way until the moment it is persisted. Write the natural `equals()` on `id` and both halves of the contract come apart:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User other)) return false;
    return Objects.equals(id, other.id);   // ❌ null == null before either is saved
}

@Override
public int hashCode() {
    return Objects.hash(id);
}
```

```java
// the 6-argument constructor is the one @AllArgsConstructor generates on User:
// (Long id, String name, String email, String password, Role role, boolean active)
Set<User> batch = new HashSet<>();
batch.add(new User(null, "Ana",    "ana@e.com",    "hash", Role.EMPLOYEE, true));
batch.add(new User(null, "Victor", "victor@e.com", "hash", Role.EMPLOYEE, true));
System.out.println(batch.size());   // prints 1 — two different users, both id null, "equal"
```

The second failure is worse, because it happens after the object is already inside a collection:

```java
Set<User> batch = new HashSet<>();
User u = new User(null, "Victor", "victor@e.com", "hash", Role.EMPLOYEE, true);
batch.add(u);                  // hashed from id == null
userRepository.save(u);        // JPA fills in id = 1
System.out.println(batch.contains(u));   // prints false — the set still holds it, in the old bucket
```

Nothing threw. The set contains an object it swears it does not contain, because `hashCode()` changed under it and the lookup now goes to a different bucket. This is the *consistency* rule from the table above, broken by a field that the framework mutates for you.

> **Then why not compare all the fields, the way Lombok's `@Data` does?** That is what TimeTrack's `User` currently gets — `@Data` generates `equals`/`hashCode` over every field, `password` and `active` included. Two problems follow. First, the same consistency break: change the user's `role` and the object becomes unfindable in any set that already holds it. Second, and specific to JPA: an entity field can be a **lazy** relation the framework has not loaded yet, and touching it inside `equals()` fires an extra database query — or throws, if the persistence session is already closed. `@Data` on an entity is fast to write and quietly wrong; the standard advice is `@EqualsAndHashCode(onlyExplicitlyIncluded = true)`, or writing the two methods by hand.

The answer the ecosystem settled on is a **business key**: a field that identifies the row in the real world, that exists before the database is involved, and that never changes. For `User` that is the `email` — and note it is already declared `@Column(nullable = false, unique = true)`, which is the database saying the same thing:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User other)) return false;
    return Objects.equals(email, other.email);   // stable before and after saving
}

@Override
public int hashCode() {
    return Objects.hash(email);
}
```

> **Why does `hashCode()` on a business key survive a save when the id version did not?** Because nothing about the email changes when the row is written. The object's hash is the same value before `save()` and after, so it stays in the bucket it was filed under, and a `contains()` after persisting finds it. That is the whole criterion for choosing the field: not "what is unique in the database", but "what is unique *and already known* the instant the object exists".

---

## Records (Java 16+) — immutable data classes

> Docs: https://www.baeldung.com/java-record-keyword → read: "3. The Basics" for what is generated and "4. Constructors" for the compact constructor

When you have a class that only carries data — no business logic, just fields and their getters — you end up writing a lot of repetitive code: constructor, `toString`, `equals`, `hashCode`, and one getter per field. Java 16 introduced records to eliminate all that boilerplate.

Before (regular class):

```java
public class EmployeeDTO {
    private final String name;
    private final String email;

    public EmployeeDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }

    @Override public boolean equals(Object o) { ... }
    @Override public int hashCode() { ... }
    @Override public String toString() { ... }
}
```

Now (record):

```java
public record EmployeeDTO(String name, String email) {}

// Automatically creates everything above:
// - constructor: new EmployeeDTO("Victor", "v@e.com")
// - getters: name(), email()   ← no "get" prefix in records
// - equals(), hashCode(), toString()
```

Records are immutable — no setters. They are perfect for carrying data between layers in a web application (this pattern is called a DTO — Data Transfer Object).

### What "immutable" does and does not mean here

The components of a record are implicitly `final`. That is not a convention the compiler hopes you follow — try to assign one, even from inside the record itself, and the build stops:

```java
public record EmployeeDTO(String name) {
    void rename() { this.name = "other"; }   // ❌
}
```

```
error: cannot assign a value to final variable name
    void rename() { this.name = "other"; }
                        ^
```

But `final` freezes the *reference*, exactly as it did for the leaking getter in §"Encapsulation" — so a record's immutability is only as deep as its components. Hold a `List` in one and the list is still perfectly mutable through the accessor the record generated for you:

```java
public record EmployeeDTO(String name, List<String> skills) {}

List<String> skills = new ArrayList<>(List.of("Java"));
EmployeeDTO dto = new EmployeeDTO("Victor", skills);
dto.skills().add("Angular");
System.out.println(dto);   // EmployeeDTO[name=Victor, skills=[Java, Angular]]
```

This is called **shallow immutability**: nobody can point the record at a *different* list, and anybody can change the list it points at. If you need the guarantee to hold all the way down, the record's components must themselves be immutable types (`String`, `int`, `LocalDate`, `List.copyOf(...)`) — the same defensive-copy rule from §"Encapsulation", now applied at construction time instead of at the getter.

### The compact constructor — validating a record

"No setters" raises the obvious question: if the only moment a record's data can be set is construction, where do you put the validation? In a **compact constructor** — the constructor written without a parameter list, whose body runs *before* the components are assigned:

```java
public record EmployeeDTO(String name, List<String> skills) {
    public EmployeeDTO {                 // no parentheses with parameters — that is the compact form
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        skills = List.copyOf(skills);    // reassigning the PARAMETER — becomes what is stored
    }
}

new EmployeeDTO("", List.of());
// Exception in thread "main" java.lang.IllegalArgumentException: name required
```

> **Why is `skills = ...` legal here when `this.skills = ...` was not?** Because inside a compact constructor the bare names are the incoming **parameters**, not the fields — the fields do not exist yet. Java assigns each parameter to its matching component automatically, on the last line, after your body has run. So whatever you leave in the parameter is what gets stored: this is the one place you can sanitise or copy a value on its way in, and it is why the defensive copy above makes the record genuinely immutable rather than shallowly so.

> **Two more limits worth knowing before you reach for a record.** A record cannot extend another class — it already extends `java.lang.Record` internally, and Java allows one parent, so `public record F(String n) extends Base {}` is not even parsed (`error: '{' expected`). It *can* implement interfaces, which is usually what you actually wanted. And a record cannot declare extra instance fields beyond its components: everything the object holds is in the header, by design, which is what lets the compiler generate a correct `equals`/`hashCode`/`toString` without you choosing fields.

> **Preview — Spring Boot:** The example below uses a `repository` and a `controller`, which are Spring Boot concepts you haven't studied yet. Read it to see how records fit into a real project — you'll build this in the Spring Boot notes.

```java
// Classic DTO pattern in Spring Boot
public record EmployeeDTO(String name, String email) {}

// In a controller:
public EmployeeDTO getEmployee(int id) {
    Employee emp = repository.findById(id);
    return new EmployeeDTO(emp.getName(), emp.getEmail());
}
```

---

## Nested classes — a class declared inside another class

> Docs: https://www.baeldung.com/java-nested-classes → read: "2. Static Nested Classes", "3. Non-Static Nested Classes" and "3.2. Anonymous Classes"

Every class in this file has been a top-level class: one class, one file, its own name. Sooner or later you meet a helper class that only makes sense inside one other class — a node inside a linked list, a builder for the object that owns it, a small comparison rule used in one method. Giving it its own file scatters something that is only meaningful in one place, so Java lets you declare a class **inside** another class.

There are three forms, and the difference between them is entirely about **whether the nested object is tied to an instance of the outer class**. That single distinction decides how you create it, what it can see, and — as the last part of this section shows — whether it can leak memory.

```
   class Outer
   ├── static class Nested      → independent; created with new Outer.Nested()
   ├── class Inner              → tied to an Outer object; created with outer.new Inner()
   └── new Runnable() { ... }   → anonymous: declared and instantiated in one expression
```

### `static` nested class — independent, just namespaced

A `static` nested class is a normal class that happens to live inside another one for organisation. It has no connection to any `Outer` object and cannot see `Outer`'s instance fields, so you create it without one:

```java
public class Employee {
    private String name;

    public static class Address {          // static — no link to any particular Employee
        private String city;
        public Address(String city) { this.city = city; }
    }
}

Employee.Address addr = new Employee.Address("Madrid");   // no Employee needed
```

> **Why `static` is the default you should reach for.** The keyword here does not mean "shared single copy" the way it did for fields — it means "not attached to an outer instance". Since the class does not need an `Employee` to exist, the compiler does not give it one, and that is exactly the property that keeps it lightweight and safe. If your nested class does not read the outer object's fields, make it `static`; IntelliJ will suggest it.

### Inner class — carries a hidden reference to its outer object

Drop the `static` and the class becomes an **inner class**, and something invisible happens: every instance of it silently holds a reference to the `Outer` object that created it. That is what lets its methods read `name` directly, with no qualification:

```java
public class Employee {
    private String name = "Victor";

    public class Badge {                    // no static — this is an inner class
        public String label() {
            return "Badge of " + name;      // reads the OUTER object's field, for free
        }
    }
}

Employee emp = new Employee();
Employee.Badge badge = emp.new Badge();     // note the syntax: an EXISTING employee makes the badge
System.out.println(badge.label());          // Badge of Victor
```

The `emp.new Badge()` syntax looks strange the first time, and it is the mechanism made visible: a `Badge` cannot exist without an `Employee` to belong to, so you have to say *which* employee. Try to create one from a `static` context and the compiler says so directly:

```
error: non-static variable this cannot be referenced from a static context
        Badge bad = new Badge();
                    ^
```

> **The memory leak hiding in that convenience.** The hidden outer reference is a real arrow, and the garbage collector honours it. So if a `Badge` outlives its `Employee` — stored in a long-lived cache, registered as a listener, handed to a background task — the `Employee` **cannot be collected**, even though nothing in your code refers to it any more, because the badge is still pointing at it. One small object pins a large one, and repeated over the life of a server that is a leak that grows quietly under load. The fix is almost always the same: if the nested class does not actually need the outer instance, mark it `static` and the arrow is never created. Baeldung lists this under "3.4. Inner Classes That Reference Outer Classes" at https://www.baeldung.com/java-memory-leaks.

### Anonymous class — declared and created in one go

The third form has no name at all. When you need exactly one object that implements an interface, and naming a class for it would be ceremony, you write the implementation inline as part of the `new` expression:

```java
Runnable task = new Runnable() {          // no class name — the body IS the class
    @Override
    public void run() {
        System.out.println("Sending the weekly report");
    }
};
task.run();
```

An **interface** is a contract a class promises to fulfil — the subject of the next file, [07-interfaces-abstract.md](07-interfaces-abstract.md); for now read `Runnable` as "something with a `run()` method". What the compiler does here is generate a nameless class implementing it, create one instance, and hand it back. An anonymous class is a form of inner class, so it carries the same hidden reference to whatever object created it — and therefore the same leak risk when it is stored somewhere long-lived.

> **You will hardly ever write this form again.** When the interface has exactly one method, Java 8's lambda expresses the same object in one line: `Runnable task = () -> System.out.println("Sending the weekly report");`. That is covered in [12-streams-lambdas.md](12-streams-lambdas.md), which opens on this exact comparison. Anonymous classes still matter for two reasons: you will read them constantly in older codebases, and they remain the only option when the interface has more than one method to implement.

---

You can now model a single thing as a class: its data (fields), how it is built (constructors), what it can do (methods), how it protects itself (encapsulation), how it says whether it equals another (the `equals`/`hashCode` contract), and where a helper class can live inside it (nested classes). But every class so far has stood alone — and the last section left an IOU: the `Runnable` an anonymous class implemented was an *interface*, a word used but never explained. Real systems have *families* of related things — an `Employee` and a `Manager` that share most behaviour, or a dozen unrelated classes that must all promise they can `print()`. Making classes share behaviour, or agree on a common contract, is the next step. That is what [07-interfaces-abstract.md](07-interfaces-abstract.md) is about: interfaces (a contract a class signs) and abstract classes (a half-built parent others complete).
