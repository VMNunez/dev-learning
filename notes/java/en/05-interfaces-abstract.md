# Interfaces and Abstract Classes

> 📖 [Baeldung — Interfaces in Java](https://www.baeldung.com/java-interfaces) → read: "2. What Are Interfaces in Java?" and "4. Default Methods in Interfaces"
> 📖 [Oracle Docs — Interfaces and inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/index.html)
> 📖 [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) — how `UserDetailsService` fits into the full login flow

In [04-oop-classes.md](04-oop-classes.md) you learned to model a single thing as a class: its data, its constructor, its methods, and how it protects itself. But every class there stood alone. The moment you have a *family* of related classes, or a group of unrelated classes that must all promise they can do the same thing, a lone class is not enough — you need a way for classes to **share a contract** or **share implementation**. That is exactly what this file is about: interfaces (a contract a class signs) and abstract classes (a half-built parent others complete).

## Interface

> Docs: [Baeldung — Interfaces in Java](https://www.baeldung.com/java-interfaces) → read: "2.1. Rules for Creating Interfaces" — the list of what an interface may and may not contain, and which modifiers Java adds for you.

Imagine you want to write a method that can print anything — an employee, an order, a report. You do not know what type of object will arrive, but you do know it needs to have a `print()` method. Those three classes have nothing else in common, so they cannot share a parent — but they can all sign the same contract. Interfaces solve exactly this problem.

An interface defines a **contract**: a list of methods that any implementing class is required to have. The interface does not say how those methods are implemented — it only demands that they exist. Think of it as a written promise: "any class that signs this contract guarantees it has these methods."

```java
public interface Printable {
    void print();        // no body — just the method signature
    String getSummary(); // any class that implements Printable MUST have both of these
}
```

When a class implements an interface with `implements`, it **must** provide every method declared in it — no exceptions. You cannot implement the interface and leave a method unwritten: the compiler refuses the class itself, not the missing method, and names exactly which method you forgot. Write `Employee implements Printable` with only `print()` and `javac` answers:

```
error: Employee is not abstract and does not override abstract method getSummary() in Printable
class Employee implements Printable {
^
```

Read that message as a fork in the road, because that is literally what it offers you: either you *override* the missing method (what you normally want), or you declare `Employee` itself `abstract` — an unfinished class that hands the obligation down to whoever extends it. Java will not let a class claim to be complete while a signed method is still missing. The only exception is `default` methods (see below), which already have their own implementation and are optional to override.

A class that implements the interface must provide all the methods:

```java
public class Employee implements Printable {
    private final String name;

    public Employee(String name) {
        this.name = name;
    }

    @Override
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override
    public String getSummary() {
        return "Name: " + name;
    }
}

Printable p = new Employee("Ana");
p.print();   // "Employee: Ana"
```

Notice the constructor: without it `name` would still hold its default value `null` and `print()` would happily produce `Employee: null` — a field is only `null` because nothing ever assigned it, not because interfaces do anything to it. The interface never touches state; it only forces the two methods to exist.

> **Interface methods are implicitly `public` — and that has a bite.** You wrote `void print();` with no modifier inside `Printable`, but every method declared in an interface is `public` whether you type it or not (the same "Java adds the keyword behind the scenes" mechanic as `abstract`, below). That matters when you implement it: an override may never *narrow* the visibility it inherited, because any code holding a `Printable` reference is entitled to call `print()` — if your class could quietly make it package-private, that promise would break at runtime. So dropping `public` in the implementation is a compile error, and one that reads confusingly the first time:
>
> ```java
> public class Employee implements Printable {
>     void print() { }   // MAL — no modifier means package-private, which is narrower than public
> }
> ```
> ```
> error: print() in Employee cannot implement print() in Printable
>     void print() {}
>          ^
>   attempting to assign weaker access privileges; was public
> ```
>
> The fix is always the same: write `public` on every method that implements an interface.

> **About implicitly abstract methods:** every method you declare in an interface without a body is implicitly `abstract` — Java adds the keyword behind the scenes. That is why every class that implements the interface must define all its methods. You never write `abstract` explicitly in an interface, but it is always there. The only exception is `default` methods, which already have a body and are optional.

### A class can implement multiple interfaces

> Docs: [Baeldung — Inheritance in Java](https://www.baeldung.com/java-inheritance) → read: "4.1. Implementing Multiple Interfaces" and "4.2. Issues With Multiple Inheritance" — why Java allows many interfaces but only one parent class.

A real `Employee` is rarely just one thing. The reporting code wants to print it, the export endpoint wants it as CSV, and the compliance module wants an audit trail out of it. Those are three unrelated capabilities owned by three unrelated parts of the app, and none of them should have to know about the other two. Rather than inventing one fat `EmployeeBase` parent that carries all three concerns, you let `Employee` sign three separate contracts — one per capability — and each part of the app then depends only on the contract it cares about.

```java
public class Employee implements Printable, Exportable, Auditable {
    private final String name;
    private final String department;

    public Employee(String name, String department) {
        this.name = name;
        this.department = department;
    }

    @Override                                  // from Printable
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override                                  // from Printable
    public String getSummary() {
        return "Name: " + name;
    }

    @Override                                  // from Exportable
    public String toCsvRow() {
        return name + ";" + department;
    }

    @Override                                  // from Auditable
    public String auditId() {
        return "EMP-" + name.toUpperCase();
    }
}
```

The rule does not soften as you add interfaces: **all** methods from **all three** must be implemented, and the same `Employee is not abstract and does not override abstract method …` error names the first one you forget. Only `default` methods are optional, because they already carry a body.

The payoff is that a method can now ask for exactly the capability it needs, not for the concrete class. A reporting method declares `void render(Printable item)` and accepts an `Employee`, an `Invoice` or a `Report` — anything that signed *that* contract — while the export job takes `Exportable` and never sees `print()` at all. One object, three different views of it depending on which reference type you hold.

> **This is Java's replacement for multiple class inheritance.** Some languages let a class have several parent classes; Java deliberately does not (you will see `extends` accept exactly one class further down). The reason is the ambiguity a second parent creates — if two parents both provide a *body* for the same method, the compiler has to guess which one your object runs, and any guess it makes is silently wrong half the time. Interfaces sidestep that because, classically, they carry **no bodies at all**: signing ten contracts adds ten obligations and zero implementations, so there is nothing to collide. Java 8's `default` methods reopened that door a crack — which is exactly the diamond problem the callout below deals with, and why the language forces *you*, not the compiler, to break the tie.

### Default methods (Java 8+)

> Docs: [Baeldung — Static and Default Methods in Interfaces](https://www.baeldung.com/java-static-default-methods) → read: "2. Why Interfaces Need Default Methods" and "5. Static Interface Methods" — the backwards-compatibility problem that created them, and the second bodied form.

Before Java 8, interfaces could only have methods without implementation. Java 8 introduced `default` methods: methods with an implementation inside the interface that classes are **not required to override**. If the class does not override it, it inherits the interface's implementation. If it does override it, it uses its own.

This allows adding new methods to an interface without breaking all the classes that already implement it — if you add a `default` method, existing classes inherit it without needing any changes:

```java
public interface Printable {
    void print();

    default String getLabel() {
        return "Printable item";   // default implementation
    }
}
```

> **`getSummary()` disappeared — deliberately.** From here on, `Printable` is shown with a single abstract method (`print()`) instead of the two it had at the top of the file. That is not an oversight: the examples that follow need an interface with *exactly one* unimplemented method, both for the `static` factory returning a lambda a few callouts down and for the functional-interface section at the end. Everything said about `default` applies identically to the two-method version — it is only the lambda examples that require the trimmed one.

> **What if two interfaces declare the same default method?** If a class implements two interfaces that both provide a `default` method with the same signature, the compiler cannot decide which one wins — this is the classic *diamond problem*. Java refuses to compile it and forces you to resolve the ambiguity by overriding the method in your class. Inside your override you can pick one explicitly with `InterfaceName.super.methodName()`:
>
> ```java
> public interface A { default String hi() { return "from A"; } }
> public interface B { default String hi() { return "from B"; } }
>
> public class C implements A, B {
>     @Override
>     public String hi() {
>         return A.super.hi();   // you MUST override; pick which parent to call
>     }
> }
> ```
>
> Drop the override and the compiler tells you exactly what collided — note that it blames the *class*, not either interface, because the two contracts are each fine on their own and only conflict once one class signs both:
>
> ```
> error: types A and B are incompatible;
> public class C implements A, B { }
> ^
>   class C inherits unrelated defaults for hi() from types A and B
> ```
>
> "Unrelated" is the operative word: if `B extended A`, `B`'s version would simply win as the more specific one and there would be no error at all. The ambiguity only exists when neither default can be argued to override the other.
>
> This is why multiple interface implementation is safe where multiple class inheritance is not: with interfaces the collision is a compile error you are forced to fix, never a silent guess by the compiler.

> **`default` is not the only bodied form.** It is easy to finish the paragraph above believing "interface = no bodies, except `default`". The exact scope is wider: an interface can hold **three** kinds of method with a body.
>
> ```java
> public interface Printable {
>     void print();                                   // abstract — implicitly public, no body
>
>     default String getLabel() {                     // Java 8 — inherited by implementors, overridable
>         return decorate("Printable item");
>     }
>
>     static Printable empty() {                      // Java 8 — belongs to the interface itself
>         return () -> System.out.println("(nothing)");
>     }
>
>     private String decorate(String text) {          // Java 9 — helper, invisible outside the interface
>         return "» " + text;
>     }
> }
> ```
>
> The three differ in *who* can call them. A `default` method is inherited by every implementing class, so you call it on the object: `employee.getLabel()`. A `static` interface method is **not** inherited — it belongs to the interface itself and is called through its name, `Printable.empty()`, exactly like a static method on a class; this is where factory helpers live (`List.of(...)` and `Comparator.comparing(...)` are real examples of the pattern). A `private` interface method exists only so that `default` and `static` methods can share code without exposing that helper as part of the contract — Java 9 added it precisely because `default` methods started duplicating logic among themselves.

> **Does `default` turn an interface into an abstract class?** No, and the reason is the one thing the interface still cannot have: **fields**. A `default` method can only work with the arguments it receives and with other methods of the contract — it has no per-object state to read, because an interface has nowhere to store any (the "why can an interface only hold constants" callout further down traces that). An abstract class keeps its fields, its constructor and its ability to hold half-finished state; a `default` method is only shared *behaviour*, bolted onto a contract so that adding a method to a published interface stops being a breaking change.

---

## Abstract class

> Docs: [Baeldung — Abstract Classes in Java](https://www.baeldung.com/java-abstract-class) → read: "2. Key Concepts for Abstract Classes" and "3. When to Use Abstract Classes" — the rules the compiler enforces, and the situations that justify one.

> **Forward reference — inheritance mechanics.** This section uses `extends`, `super(...)`, and the parent/subclass relationship (the Animal/Dog hierarchy) to show what an abstract class is *for*. The full mechanics of inheritance — how `extends` wires a subclass to its parent, how `super(...)` and `@Override` work under the hood, the `Object` class every class inherits from — are the topic of [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md). Here, just read `super(name)` as "run the parent constructor first" and `extends Animal` as "Dog is a kind of Animal"; you get the deep version next file.

Use an abstract class when several classes share the same *implementation* — not just the same contract. An interface says "you must have this method"; an abstract class says "here is part of the implementation, fill in the rest." You cannot create an instance of an abstract class directly — it only exists to be extended.

An abstract class is essentially a parent class that groups fields and methods shared by all its subclasses — that is inheritance. The key is the `abstract` keyword in front of a method: it means that method **has no body in the parent class**. The abstract class only declares that the method exists, without implementing it. Each subclass must write its own version. Think of it as an internal contract: "I give you `breathe()` already implemented, but you must implement `makeSound()` because only each animal knows what its own sound is." An `abstract` method can only be declared inside an abstract class — if you try to add `abstract` to a method in a regular class, the compiler gives you an error. The reverse is also true: if a class has even one `abstract` method, that class must be declared `abstract` too.

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Concrete method — already implemented; all subclasses inherit it
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Abstract method — no body; subclasses MUST implement this
    public abstract void makeSound();
}
```

A subclass that extends an abstract class must implement all abstract methods. Concrete methods — the ones that already have a body in the abstract class — are inherited automatically without doing anything. The keyword difference: `extends` to extend a class (abstract or not), `implements` to implement an interface.

```java
public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // calls the parent constructor
    }

    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof!");
    }
}

Dog dog = new Dog("Rex");
dog.breathe();      // "Rex is breathing"  — from Animal
dog.makeSound();    // "Rex says: Woof!"   — from Dog
```

The shape of what you just built:

```
        Animal  (abstract — cannot be instantiated)
        ├── breathe()      concrete → inherited as-is
        └── makeSound()    abstract → each child MUST fill it in
              │
              ▼  extends
        Dog  (concrete — can be instantiated)
        ├── breathe()      inherited unchanged from Animal
        └── makeSound()    written here: "Woof!"
```

Read it top-down: the parent hands every child the finished `breathe()`, but leaves `makeSound()` as a hole each child is forced to fill. `Dog` fills the hole; a `Cat` would fill it with "Meow". That is the whole point of an abstract class — share the finished parts, force the rest.

> **Why can't you just write `new Animal("Rex")`?** Not because Java is being strict for the sake of it — because the object would come out with a hole in it. Creating an object means the JVM lays out a real block of memory with a slot for every field and, next to the class, a table of "which body do I run for each method". For `Animal`, the entry for `makeSound()` points at nothing: there is no body anywhere to run. So the moment someone called `animal.makeSound()` there would be no code to dispatch to, and the only honest answer would be a crash at runtime. Java prevents that a step earlier, at compile time, by refusing to build the object at all:
>
> ```
> error: Animal is abstract; cannot be instantiated
> Animal x = new Animal("Rex");
>            ^
> ```
>
> The diagram is the same picture: the arrow only ever points *down*, from the class with the hole to the class that fills it. `new` is legal exactly at the level where no holes are left — `new Dog("Rex")` works because `Dog` supplied `makeSound()`. And that is also why a subclass that forgets to fill the hole is refused with the same message you already met on interfaces, just naming the parent class instead of the contract:
>
> ```
> error: Dog is not abstract and does not override abstract method makeSound() in Animal
> class Dog extends Animal { }
> ^
> ```
>
> One class, two ways out: fill the hole, or declare `Dog` abstract as well and push the obligation one generation further down.

> **`super(name)`** calls the parent class's constructor. When you create a `Dog` object, Java needs to initialise the `Animal` part first — its fields and constructor. `super(...)` does exactly that: it runs the parent constructor with the arguments you pass. Write it as the first line and you can never get the order wrong; that is the shape you will see in essentially all Java code, and the one to default to. After `super(...)`, the subclass constructor adds its own fields and initialisations — covered with an example in the "Subclass constructors" section below.

> **About types in Java:** when you write `Dog dog = new Dog("Rex")`, `Dog` is the type because you defined the class `Dog`. In Java, any class you define becomes a valid type — there is no inference or compiler magic. It is exactly the same as `String name = "Rex"` or `int count = 5`, just using your own class as the type instead of a primitive or a standard library type.

A class can only extend **one** abstract class. This is the key difference with interfaces.

---

## Interface vs Abstract class

> Docs: [Baeldung — Java Interfaces vs Abstract Classes](https://www.baeldung.com/java-interface-vs-abstract-class) → read: "4. When to Use an Interface" and "5. When to Use an Abstract Class" — the same decision, argued case by case.

The decision comes down to one question: are you defining a *capability* a class can have, or a *base type* that classes derive from? Use an interface when unrelated classes need to share a contract (`Printable` can be implemented by `Employee`, `Invoice`, or `Report` — they have nothing else in common). Use an abstract class when a group of related classes share actual implementation code that would otherwise be duplicated.

Yes: a class can extend an abstract class and implement multiple interfaces at the same time. The order in the code is fixed — `extends` first, then `implements`:

```java
public class Dog extends Animal implements Printable, Auditable {
    // inherits breathe() from Animal
    // must implement makeSound() (abstract method from Animal)
    // must implement the methods from Printable and Auditable
}
```

| | Interface | Abstract class |
|---|-----------|----------------|
| Methods | Abstract by default; bodies only via `default`, `static` or `private` | Can have both abstract and concrete |
| Fields | Only `public static final` constants | Can have any fields |
| Multiple? | A class can implement many | A class can only extend one |
| Constructor | No | Yes |
| When to use | Define a capability a class can have | Define a base type with shared logic |

Read each row as *"here is where the two differ, and why the difference exists"* — the last row is the one that actually drives your decision (capability vs base type); the rows above it are the mechanical consequences of that choice.

> **Why can an interface only hold `public static final` constants?** Because an interface has no instances of its own — you never write `new Printable()`. Instance fields (`private String name`) only make sense on an object, since each object needs its own copy; an interface never produces an object, so it has nowhere to put per-object state. The only fields that survive without an instance are `static` (one shared copy, not per-object) and `final` (a fixed value, since there is no constructor to assign them later). Java makes every field you declare in an interface `public static final` automatically — a shared constant is the *only* kind of field that is meaningful when there is no instance. An abstract class is the opposite: it *does* participate in object creation (its constructor runs as part of building the subclass), so it can hold ordinary instance fields like `protected String name`.

Since Java 8 handed interfaces `default` methods, the obvious follow-up is: if an interface can now ship real implementations too, why would anyone still write an abstract class? The answer is the `Fields` row of the table, spelled out as a decision rule instead of a mechanical difference — **state**. A `default` method is behaviour with no memory: it can call other methods of the contract, but there is no per-object field for it to read or update, because an interface produces no objects and therefore has nowhere to keep one. The moment your shared logic needs to *remember* something per object — a `name`, a counter, an injected dependency — an interface cannot express it, and only a class with fields and a constructor can. The second reason is the constructor itself: an abstract class can force every subclass through a parameterised constructor (`super(name)`), so no `Animal` can ever exist without a name. An interface has no constructor, so it can demand no such thing.

Concretely: `Comparable` is an interface because "can be compared" is a capability, holds no data, and must be signable by `String`, `LocalDate` and your own `Employee` alike — none of which can afford to spend their single `extends` slot on it. `Animal` is an abstract class because every animal genuinely *has* a `name` field and a working `breathe()` that would otherwise be copy-pasted into every subclass.

> **The rule to apply by default:** reach for an interface unless you need shared *state* or a constructor. It costs the implementing class nothing (a class can sign any number of contracts) while `extends` is a single, non-renewable slot — spend it only when the parent brings real fields and real implementation. This is also why almost every Spring type you will meet — `UserDetailsService`, `JpaRepository`, `Filter` — is an interface: your class must stay free to extend whatever it needs.

**Interface:** "This class can do X" — `Printable`, `Exportable`, `Comparable`
**Abstract class:** "This class IS a type of X" — `Animal`, `Shape`, `BaseService`

---

## Subclass constructors

> Docs: [Baeldung — A Guide to Java Constructors](https://www.baeldung.com/java-constructors) → read: "6. A Chained Constructor" — how one constructor delegates to another before running its own body.

This expands the `super(name)` callout from the *Abstract class* section above, staying with the same `Animal`/`Dog` pair. It lives here rather than being repeated inline so the earlier section stays focused on *what* an abstract class is. The full inheritance mechanics — why the delegation to the parent comes first, what the parent constructor actually runs — belong to [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md); the point below is only that a subclass constructor can add its *own* fields on top of the parent's.

When a subclass defines its own constructor, it can add its own fields on top of the parent's. The rule that governs the order is that `super(...)` runs before anything touches the object, so the parent is fully initialised before the child adds anything of its own:

```java
public class Dog extends Animal {
    private String breed;   // Dog's own field — does not exist in Animal

    public Dog(String name, String breed) {
        super(name);        // initialise the parent first
        this.breed = breed; // then your own fields
    }
}

// When creating the object, you pass both constructors' arguments in one call
Dog dog = new Dog("Rex", "Labrador");
dog.breathe();  // "Rex is breathing"  — method inherited from Animal
```

> **What if you simply don't write `super(...)`?** Java writes it for you. When a constructor's body does not start by delegating — neither to a parent with `super(...)` nor to a sibling constructor with `this(...)` — the compiler silently inserts a no-argument `super()` as the first thing that runs. That single hidden line explains a compile error that otherwise looks unrelated to anything you typed: if the parent has *only* a parameterised constructor, the `super()` Java inserted asks for a constructor that does not exist.
>
> ```java
> public class Dog extends Animal {
>     public Dog() { }        // MAL — nothing delegates, so Java inserts super()
> }                           //       but Animal only has Animal(String)
> ```
> ```
> error: constructor Animal in class Animal cannot be applied to given types;
>     public Dog(){ }
>                 ^
>   required: String
>   found:    no arguments
>   reason: actual and formal argument lists differ in length
> ```
>
> (IntelliJ shows its own wording for the same problem before you even compile — *"There is no default constructor available in 'Animal'"* — so you will meet the fault under two different names.) The fix is to delegate explicitly, `public Dog(String name) { super(name); }`, which is what the working example above does. Note also *why* `Animal` had no no-argument constructor to fall back on: as soon as a class declares any constructor of its own, Java stops supplying the free default one.

> **Does `super(...)` have to be the literal first line?** Up to Java 21 it did, and the compiler said so (`call to super must be first statement in constructor`). Java 25 finalises **flexible constructor bodies** ([JEP 513](https://openjdk.org/jeps/513), previewed since Java 22), which allow a *prologue* of statements before the delegation — so validating an argument or normalising it before handing it to the parent is now legal:
>
> ```java
> public Dog(String name, String breed) {
>     if (breed == null) throw new IllegalArgumentException("breed required");  // legal in Java 25
>     String normalized = breed.trim();
>     super(name);
>     this.breed = normalized;
> }
> ```
>
> What has *not* changed is why the delegation goes first: until the parent constructor has run, the `Animal` half of the object does not exist yet, so nothing in the prologue may touch the object under construction. The compiler enforces that precisely, and the error you actually meet in Java 25 is about `this`, not about line order:
>
> ```java
> public Dog(String name) {
>     breathe();          // MAL — an inherited method, on a half-built object
>     super(name);
> }
> ```
> ```
> error: cannot reference breathe() before supertype constructor has been called
>         breathe();
>         ^
> ```
>
> The same refusal reappears in two more wordings, and it is worth knowing both because they look like different errors. Touch the object explicitly and the compiler names `this`:
>
> ```
> error: cannot reference this before supertype constructor has been called
>         System.out.println(this);
>                            ^
> ```
>
> Touch a field that came from the parent and it names the *field* instead — `this.name = name;` before `super(name)` is rejected as `cannot reference name before supertype constructor has been called`, because `name` is `Animal`'s slot and `Animal` does not exist yet. Assigning a field the subclass declares itself, like `this.breed`, is allowed: that slot belongs to `Dog` and does not depend on the parent existing — which is exactly why the working example above can compute `normalized` in the prologue and assign it after. The practical takeaway stays the same as the rule you learned: put `super(...)` first unless you have a concrete reason — argument validation — to run a couple of lines before it.

---

## Functional interfaces (Java 8+)

> Docs: [Baeldung — Functional Interfaces in Java 8](https://www.baeldung.com/java-8-functional-interfaces) → read: "3. Functional Interfaces" for the rule itself, then "7. Suppliers", "8. Consumers" and "9. Predicates" for the built-in ones in the table below.

Before Java 8, passing behaviour to a method meant creating a whole class just to hold one line of logic. Functional interfaces make that possible without the boilerplate: any interface with exactly **one** abstract method can be implemented by a lambda instead of a class. The single method is what Java targets when you write the lambda — it knows which method to call because there is only one.

> Lambdas are not covered in detail yet — they are explained in [09-streams-lambdas.md](09-streams-lambdas.md). For now, think of them as compact anonymous functions: a way to write the implementation of a single method without creating a whole class.

> The `@FunctionalInterface` annotation is optional, but use it: the compiler will give you an error if you accidentally add a second abstract method and break the contract. Without it, adding that second method compiles happily and the breakage only surfaces far away, at every place where someone was passing a lambda. With it, the error lands on the interface itself:
>
> ```
> error: Unexpected @FunctionalInterface annotation
> @FunctionalInterface
> ^
>   Validator is not a functional interface
>     multiple non-overriding abstract methods found in interface Validator
> ```
>
> Read the annotation as a declaration of intent — "this interface is meant to be used as a lambda" — that the compiler then keeps you honest about.

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}
```

> **"Exactly one method" means exactly one *abstract* method.** The rule counts only the unimplemented ones, which is narrower than it first sounds and is why real interfaces you already know still qualify. Three kinds of member do **not** count against the budget: `default` methods and `static` methods (they carry bodies, so a lambda has nothing to supply for them), and re-declarations of methods that every class already inherits from `Object` — `equals`, `hashCode`, `toString`. That last exemption is what saves `Comparator`, the standard-library example: it declares `int compare(T a, T b)` *and* `boolean equals(Object o)` *and* a long list of `default` methods like `reversed()` and `thenComparing()`, yet `Comparator` is a functional interface and `(a, b) -> a.getName().compareTo(b.getName())` is a valid `Comparator`. Only `compare` is genuinely abstract; `equals` would be inherited from `Object` regardless, so a lambda could never be asked to implement it.

A lambda is an anonymous function written inline. Before Java 8, to implement a functional interface you had to create a whole anonymous class. With lambdas, that collapses to a single line:

```java
// Without a lambda — an anonymous class that implements Validator
Validator emailValidator = new Validator() {
    @Override
    public boolean validate(String value) {
        return value.contains("@");
    }
};

// With a lambda — exactly the same in one line
Validator emailValidator = value -> value.contains("@");
```

The syntax is `parameter -> expression`: what is on the left of the arrow is the input parameter, and what is on the right is what gets returned. Java knows which method it targets because the interface only has one — in this case `validate(String value)`.

Once the lambda is assigned, `emailValidator` is of type `Validator`, so you can call any method the interface declares — in this case `validate()`:

```java
emailValidator.validate("test@email.com");   // true
emailValidator.validate("no-at-sign");        // false
```

The most common built-in functional interfaces already come with Java — you do not define them, you just use them. They are generic contracts for the four patterns that repeat everywhere with streams and lambdas:

| Interface | Method | Used for |
|-----------|--------|---------|
| `Predicate<T>` | `boolean test(T t)` | filtering — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)` | transforming — `list.stream().map(e -> e.getName())` |
| `Consumer<T>` | `void accept(T t)` | consuming — `list.forEach(e -> save(e))` |
| `Supplier<T>` | `T get()` | producing — `() -> new Employee()` |

Read the table by matching your task to the `Method` column: if your lambda takes a value and answers true/false you want `Predicate`; if it takes a value and returns a different one you want `Function`; if it takes a value and returns nothing you want `Consumer`; if it takes nothing and produces a value you want `Supplier`. The shape of the single method is what tells you which one to reach for.

The `T` and `R` are generics — they mean "any type". `Predicate<Employee>` is a predicate that takes an `Employee`; `Function<Employee, String>` is a function that takes an `Employee` and returns a `String`. Generics are explained in detail in [10-generics.md](10-generics.md).

Concrete examples without streams, to see how each one works on its own:

```java
// Predicate<String> — the generic type tells you what it receives: here it receives a String
Predicate<String> isLong = s -> s.length() > 10;
isLong.test("Hi");            // false
isLong.test("Hello, World!"); // true

// Function — transforms one value into another
Function<String, Integer> toLength = s -> s.length();
toLength.apply("Hi");  // 2

// Consumer — receives a value and does something with it (returns nothing)
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hi");  // prints "Hi"

// Supplier — receives nothing and produces a value
Supplier<String> greeting = () -> "Hello";
greeting.get();  // "Hello"
```

You will use these every time you work with streams and lambdas. What you have here is the *interface* half of the story — the rule that one abstract method is what a lambda can target, and the four shapes that rule produces. The *lambda* half — how the arrow syntax really works, method references, and how these four interfaces are what every stream operation secretly asks for — is [09-streams-lambdas.md](09-streams-lambdas.md), which picks the same four up again from the calling side.

---

## Spring Boot connection

> Docs: [Baeldung — Spring Data Repositories Compared](https://www.baeldung.com/spring-data-repositories) → read: "2. Spring Data Repositories" — how extending an interface is enough for Spring to generate the implementation.

> **Preview — Spring Boot:** This section uses Spring Boot and Spring Security classes (`JpaRepository`, `UserDetailsService`, `UserDetails`, `@Service`) that you haven't studied yet. Read it to see how interfaces work in a real project. You'll implement all of this in the Spring Boot notes — come back then for full understanding.

This section exists because interfaces are the central mechanism of Spring Boot — not theory you use once and forget. Every time you access the database or configure security in TimeTrack, you are following interface contracts. There are two distinct patterns: in the first you define the interface and Spring generates the implementation; in the second Spring defines the interface and you write the implementation.

---

### Pattern 1 — You define the interface, Spring generates the implementation

JPA (Java Persistence API) is the Java standard for working with databases using objects instead of raw SQL. `JpaRepository` is a Spring Data JPA interface that, when you extend it, causes Spring to automatically generate all the database access code at startup.

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

`JpaRepository<User, Long>` tells Spring this repository works with the `User` entity and that its primary key is of type `Long`. From this interface you inherit `save()`, `findById()`, `findAll()`, `delete()` and more — without writing a single line of SQL.

`findByEmail` has no body: Spring Data reads the method name and generates the SQL `SELECT * FROM users WHERE email = ?` automatically. The convention is `findBy` followed by the exact field name in the entity — `findByEmail` searches by `email`, `findByName` would search by `name`, `findByEmailAndStatus` would generate `WHERE email = ? AND status = ?`. Spring Data parses the name and builds the query; if the field does not exist in the entity, the project fails to start.

> In Java, interfaces extend other interfaces with `extends`, never with `implements` — that keyword is only for classes. That is why `UserRepository extends JpaRepository` and not `implements JpaRepository`.

---

### Pattern 2 — Spring defines the interface, you write the implementation

`UserDetailsService` is a Spring Security interface — it comes in the `spring-security-core` dependency from `pom.xml`. You will not find it in your project files because it lives inside the Spring jar; you can open it in IntelliJ by Ctrl+clicking its name.

```java
// Defined by Spring Security — not in your project files
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

`throws UsernameNotFoundException` means the method can throw that exception if no user is found. Exceptions are explained in detail in [08-exceptions.md](08-exceptions.md) — for now read it as "this method can fail with this type of error."

Spring Security knows how to call `loadUserByUsername` when a login request arrives, but it cannot provide the implementation because it does not know your database. Your job is to write that implementation:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/UserDetailsServiceImpl.java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(!user.isActive())
                .build();
    }
}
```

The name `UserDetailsServiceImpl` is a convention — the `Impl` suffix means "implementation." Spring does not look for it by name; it finds it because the class is annotated with `@Service` and implements `UserDetailsService`.

`findByEmail(username)` returns an `Optional<User>` — a container that may hold the user or be empty. `.orElseThrow()` opens it: if there is a user it returns it; if it is empty it throws the exception you pass. `Optional` is explained in [10-generics.md](10-generics.md).

The last block is where the contract is actually honoured. Your `User` is a TimeTrack entity — a database row — and the interface promised to return a `UserDetails`, which is a different contract entirely (Spring Security's own view of "a principal that can log in"): a username, a password hash, a set of roles, and a few enabled/disabled flags. So you translate one into the other, and the fully-qualified `org.springframework.security.core.userdetails.User` is Spring's ready-made class that implements `UserDetails` for you. It is spelled out in full here for a plain reason: the file already imports *your* `User` entity, and two different classes cannot share the short name in one file.

> `@Service` is what makes this class visible to Spring at startup: it tells Spring to create one instance and keep it, and — since only one bean in the app implements `UserDetailsService` — that is the object Spring Security ends up calling. The constructor taking `UserRepository` is dependency injection: you never call `new UserDetailsServiceImpl(...)` yourself, Spring passes the repository in. Both are covered properly in the Spring Boot notes.

---

### The full flow

When a login request arrives, Spring Security calls `loadUserByUsername(email)` on your `UserDetailsServiceImpl`. This calls `userRepository.findByEmail(email)`, which goes to the database. The result is returned to Spring Security, which verifies the password and decides whether the login is valid.

Drawn as the chain of hand-offs it actually is — and notice that at every arrow the caller only knows an *interface*, never the class on the other side:

```
POST /api/auth/login  { email, password }
        │
        ▼
Spring Security          ── holds a UserDetailsService reference (the interface)
        │  loadUserByUsername(email)
        ▼
UserDetailsServiceImpl   ── YOUR class (Pattern 2: Spring's contract, your code)
        │  findByEmail(email)
        ▼
UserRepository           ── YOUR interface, Spring's generated class (Pattern 1)
        │  SELECT * FROM users WHERE email = ?
        ▼
     PostgreSQL
        │  row → User entity → mapped to UserDetails
        ▼
Spring Security          ── compares the submitted password with the stored hash
        │
        ▼
   login accepted / rejected
```

That is the payoff of this whole file in one picture. Spring Security was compiled years before TimeTrack existed and knows nothing about your database, yet it calls your code — because both sides agreed on a contract, and each supplied the half it was in a position to write.

> `username` in Spring Security means the login identifier. In TimeTrack that is the email — not a separate username field. The parameter name is fixed by the interface; what it actually contains depends on your app.

---

You now have both tools for making classes relate: an **interface** is a contract unrelated classes sign, and an **abstract class** is a half-built parent that shares real implementation. But this file only *borrowed* the inheritance machinery — `extends`, `super(...)`, `@Override` — to make abstract classes work, without explaining how any of it functions. That is the next step: [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md) opens up the mechanism you kept using here — how a subclass really inherits fields and methods from its parent, how `super` and `@Override` behave, and how one method call can run different code depending on the object's real type (polymorphism).
