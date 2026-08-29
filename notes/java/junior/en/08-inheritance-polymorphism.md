# Inheritance and Polymorphism

> 📖 [Baeldung — Guide to Inheritance in Java](https://www.baeldung.com/java-inheritance) → read: "Class Inheritance" and "Class Inheritance and Access Modifiers"
> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

In [07-interfaces-abstract.md](07-interfaces-abstract.md) you saw how classes can share a *contract*: an interface lists the methods a class promises to have, and an abstract class can even provide a half-built parent for others to finish. But a contract only says *what* methods must exist — it does not hand a subclass ready-to-run behaviour it can use as-is. This file is about the other half: how a subclass **inherits real, working behaviour** from a parent and reuses it without rewriting a line.

You reach for inheritance when two or more classes are the same *kind* of thing and share most of their behaviour, but differ in a few specific methods. Without it, you'd write the same `eat()`, `breathe()`, and `sleep()` methods in every animal class — and when you need to change one, you'd update every copy separately. Inheritance lets you write shared behaviour once in a **parent class**, and every **subclass** gets it automatically.

## Inheritance — `extends`

> Docs: [Baeldung — Guide to Inheritance in Java](https://www.baeldung.com/java-inheritance) → read: "Class Inheritance" for `extends` itself, then "Class Inheritance and Access Modifiers" for why `protected` shows up in parent classes.

A subclass inherits all `public` and `protected` fields and methods from the parent class and can also add its own.

`private` fields from the parent are the exception, and the way they are excluded is worth being precise about: they technically live inside the subclass object — they occupy memory in every `Dog` you create — but the subclass cannot *name* them. It reaches them only through the getters and setters the parent exposes. That is the whole reason `protected` exists as a middle setting: it is the modifier you choose when you want subclasses to read the field directly, without a getter. It is why you see `protected String name` rather than `private String name` in parent classes throughout this file.

The parent class does not have to be abstract. If it makes sense to create instances of it directly (`new Animal()`), leave it as a regular class; `abstract` is a decision you take separately, and only when instantiating the parent would produce a meaningless object.

> **When should the parent be `abstract`?** Ask whether any real object in your system is "just a parent". In TimeTrack, `new User()` is meaningful — a user is a concrete thing with a name, an email and a role — so `User` stays a normal class. A `BaseEntity` holding only `id`, `createdAt` and `updatedAt` is the opposite case: nothing in the system is ever "just a base entity", it is always a `User`, a `Project` or a `TimeEntry`. That class should be `abstract`, so the compiler refuses `new BaseEntity()` instead of leaving the door open to a half-object. The mechanics of `abstract` are in [07-interfaces-abstract.md](07-interfaces-abstract.md) — in short, an abstract class can declare methods with no body, so the object would have holes with nothing to run.

```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }
}

public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name);    // call the parent constructor — always the first line, by convention
        this.breed = breed;
    }

    public void fetch() {
        System.out.println(name + " is fetching");  // name inherited from Animal
    }
}

Dog dog = new Dog("Rex", "Labrador");
dog.eat();     // inherited from Animal
dog.fetch();   // defined in Dog
```

Every class in this file lives somewhere in a single tree. `Animal` is the shared parent; `Dog` and `Cat` branch off it; and — as you will see at the end of the file — everything ultimately descends from one root class called `Object`. Keeping this shape in mind makes the rest of the file click:

```
            Object          ← the root every class extends automatically
              │
            Animal          ← parent: defines eat(), speak()
            ╱     ╲
         Dog       Cat      ← subclasses: inherit + override
```

> **Why does `Object` sit above `Animal` when you never wrote `extends Object`?** Because Java inserts it for you. Any class that does not explicitly extend something extends `Object` silently, so the tree always has a single root. The last section of this file is entirely about what that gives you.

Java only allows **single inheritance** — a class can extend only one class. TypeScript classes work the same way, so nothing is new here: `class A extends B, C` is illegal there too. What TypeScript lets you combine freely is *types* (`type X = A & B`), and that is a compile-time description of a shape, not a parent handing down working code — so it is not the equivalent of what `extends` does in either language.

> **Why single inheritance?** A class having two parents creates the "diamond problem": if both parents define `save()`, which one does the subclass get? Java sidesteps the ambiguity entirely by allowing only one parent. When you genuinely need behaviour from several sources, you implement multiple *interfaces* (05) instead — a class can sign many contracts even though it can extend only one class.

---

## `super`

> Docs: [Baeldung — Guide to the `super` Java Keyword](https://www.baeldung.com/java-super) → read the sections on accessing a superclass method and on invoking the superclass constructor — the two uses shown below.

You already met `super()` as a constructor call in [07-interfaces-abstract.md](07-interfaces-abstract.md) — the same rule applies here, so this is a reminder rather than a new concept. When a subclass has its own constructor, it usually needs the parent to initialize its own fields first. `super()` triggers that initialization, and you write it as the first line:

```java
// super() — call parent constructor
public Dog(String name, String breed) {
    super(name);   // first line — the shape you should default to
    this.breed = breed;
}

// super.method() — call parent method
@Override
public void eat() {
    super.eat();                          // run the parent version first
    System.out.println("...and more!");   // then add extra behaviour
}
```

In practice, `super.method()` appears when you want to extend the parent's behaviour, not replace it entirely. When you want to replace it completely, you override without calling `super` — and that is by far the more common case, both in business logic and in framework code.

> **What this actually looks like in TimeTrack — and why `super.method()` is nowhere in it.** The project extends framework classes in two places, and neither one calls a parent method. `JwtFilter extends OncePerRequestFilter` overrides `doFilterInternal(...)` *without* `super.doFilterInternal(...)`, because the parent declares that method `abstract` — there is no parent body to run, the class exists to hand you a slot to fill. `ResourceNotFoundException extends RuntimeException` uses the *constructor* form, `super(message)`, covered at the end of this file. So the honest rule to carry away is: `super(...)` in constructors you will write constantly; `super.method()` you reach for only when the parent method has real behaviour worth keeping — which is why a framework base class that declares its hook `abstract` is telling you not to.

> **Why does `super(...)` come first?** Because a subclass object is built parent-first: the parent's fields have to exist and be initialised before the subclass can safely touch anything. Up to Java 21 the compiler enforced that literally — `super(...)` anywhere but line one was rejected with `call to super must be first statement in constructor`. Java 25 finalises **flexible constructor bodies** ([JEP 513](https://openjdk.org/jeps/513); worked through with examples in [Baeldung — Flexible Constructor Bodies in Java 25](https://www.baeldung.com/java-25-flexible-constructor-bodies)), so a short *prologue* before the delegation is now legal and the rule the compiler actually enforces is narrower: before `super(...)` has run, you may not read or call anything that belongs to the parent. Writing `super(...)` first is still the shape to default to; the exception is validating or normalising an argument before handing it over. [07-interfaces-abstract.md](07-interfaces-abstract.md) works that case through with a full example — the short version is that computing a local `String normalized = name.trim();` before `super(normalized)` compiles fine, while touching the object does not:
>
> ```java
> public Dog(String name, String breed) {
>     this.name = name;   // MAL — name is Animal's field, and Animal does not exist yet
>     super(name);
> }
> ```
> ```
> error: cannot reference name before supertype constructor has been called
> ```
>
> Calling an inherited method fails the same way (`cannot reference breathe() before supertype constructor has been called`), and any bare use of `this` reports `cannot reference this before supertype constructor has been called`.

> **What if you write no `super(...)` at all?** Java inserts a silent no-argument `super()` for you as the first thing that runs. That hidden line is what makes an otherwise baffling error make sense: if the parent declares *only* a parameterised constructor, the `super()` Java inserted is asking for something that does not exist.
>
> ```java
> class Animal { Animal(String n) { } }
> class Dog extends Animal { Dog() { } }   // MAL — the implicit super() has nothing to call
> ```
> ```
> error: constructor Animal in class Animal cannot be applied to given types;
>   required: String
>   found:    no arguments
>   reason: actual and formal argument lists differ in length
> ```
>
> IntelliJ flags the same fault before you compile with its own wording — *"There is no default constructor available in 'Animal'"* — so you will meet this one under two names. The fix is to delegate explicitly: `public Dog(String name) { super(name); }`.

---

## Method overriding — `@Override`

> Docs: [Baeldung — Method Overloading and Overriding in Java](https://www.baeldung.com/java-method-overload-override) → read: "3. Method Overriding" for the rules below, then "2. Method Overloading" for the contrast in the next sub-section.

The behaviour a subclass inherits from the parent is not always right for that specific type. Overriding lets you replace a parent method with a version tailored to the subclass, while keeping the same name — so any code that works with the parent type keeps working without changes. The method signature must match exactly:

```java
public class Animal {
    public String speak() {
        return "...";
    }
}

public class Dog extends Animal {
    @Override
    public String speak() {
        return "Woof!";
    }
}

public class Cat extends Animal {
    @Override
    public String speak() {
        return "Meow!";
    }
}
```

`@Override` is optional but always recommended — it tells the compiler to verify that you are actually overriding a parent method, not accidentally creating a new one. That verification is the whole point: a typo turns your override into an unrelated new method that nothing ever calls, and the program still compiles and runs, quietly using the parent's version forever. With the annotation, the mistake lands on the line you typed it on:

```java
public class Dog extends Animal {
    @Override
    public String Speak() { return "Woof!"; }   // MAL — capital S, this overrides nothing
}
```
```
error: method does not override or implement a method from a supertype
```

### The rules a valid override must satisfy

"The signature must match exactly" is the short version, and it hides three rules you will actually meet. What must match exactly is the **method name and the parameter list** — the part Java uses to identify the method. Around that, the compiler allows one thing to change and forbids two others, and in every case the reason is the same: code that holds the object through the *parent* type must keep working, because it was written against the parent's promises.

- **The return type may be narrower — a *covariant* return.** If `Animal.copy()` returns `Animal`, `Dog.copy()` is allowed to return `Dog`. Nobody is hurt: a caller expecting an `Animal` still gets one, since every `Dog` is an `Animal`. Going the other way — returning something wider — is rejected, because the caller would be handed less than it was promised.
- **The access modifier may not be narrower.** A `public` parent method cannot become `protected` in the subclass. If it could, a caller holding an `Animal` reference would be allowed to call `speak()` while the object underneath refused to answer.
- **The override may not declare a *broader* checked exception.** If the parent's `speak()` declares nothing, the subclass cannot suddenly declare `throws IOException` — code that called the parent version never wrote a `try/catch` for it. (Checked exceptions are covered in [11-exceptions.md](11-exceptions.md); for now read "checked" as "the compiler forces the caller to handle it".) Unchecked exceptions are unrestricted, because the compiler never forced anyone to handle those in the first place.

The compiler reports all three under the same headline sentence, with the actual reason on the line below — read the second line, not the first:

```
error: speak() in Dog cannot override speak() in Animal
  attempting to assign weaker access privileges; was public
```
```
error: speak() in Dog cannot override speak() in Animal
  overridden method does not throw IOException
```

> **Why is the return type the one thing allowed to change?** Because it is not part of what identifies the method — only the name and parameters are. A narrower return type is a *strengthened promise*: the parent said "you will get an `Animal`", the subclass says "you will get a `Dog`, which is also an `Animal`". Every existing caller is still satisfied. Access and exceptions work in the opposite direction: those are *demands on the caller*, and a subclass is never allowed to demand more than the parent already did.

### Overriding vs Overloading

**Overriding** is what you just saw: a subclass replaces a parent method with the same name and the exact same signature. What Java decides at runtime is not the type of the variable but the real type of the object in memory: if you store a `Dog` in an `Animal` variable, Java runs `Dog`'s version, not `Animal`'s. **Overloading** (covered in [04-methods.md](04-methods.md)) is different: multiple methods with the same name in the same class, each with different parameters — different number or different types. Java resolves overloading at compile time by looking at the arguments you pass. Both reuse the same method name, but they are entirely separate concepts.

| | Overriding | Overloading |
|---|-----------|-------------|
| Where | Subclass | Same class |
| Signature | Must match exactly | Different number of parameters or different types |
| Inheritance | Yes (requires subclass) | No |
| Runtime | Decided at runtime | Decided at compile time |

Two rows carry all the weight. The **`Inheritance`** row says whether the concept needs a class hierarchy at all: overriding does — with no subclass extending anything there is nothing to override; overloading does not — `calculate(int x)` and `calculate(double x)` can sit in the same standalone class.

The **`Runtime`** row is the one to read through the mechanism described above. "Decided at runtime" means overriding is resolved by the object's method table — the JVM only knows which `speak()` to run once it can see the real object. "Decided at compile time" means overloading is resolved by the compiler from the argument types you wrote, before the program ever runs: `calculate(2)` versus `calculate(2.0)` is settled while compiling, with no object involved. That is the deep difference — one waits for the object, the other never needs it.

---

## Polymorphism

> Docs: [Baeldung — Polymorphism in Java](https://www.baeldung.com/java-polymorphism) → read the "Dynamic (Runtime) Polymorphism" section — the dynamic-dispatch mechanism traced below — and "Static Polymorphism" for the overloading contrast from the previous section.

The problem polymorphism solves: you have a list of related but different types — `Dog`, `Cat`, and `Bird`, all subclasses of `Animal` — and you need to call the same method on all of them. Without polymorphism you'd write an `if` check for every type — and every time you add a new type, you modify that `if`. With polymorphism, you declare all of them as `Animal` and call `speak()` once: Java picks the right version for each object automatically.

The key is that the type of the **variable** and the type of the **object** can be different:

```java
Animal a = new Dog("Rex", "Labrador");  // variable: Animal  /  actual object: Dog
```

When you call `a.speak()`, Java does not look at the variable type (`Animal`) — it looks at the actual type of the object in memory (`Dog`) and runs `Dog`'s version of `speak()`. This is called **dynamic dispatch**: the decision of which method to run happens at runtime, not at compile time.

But how does Java *know*, at runtime, which version to run? The variable `a` is just a reference — it says nothing about whether the real object is a `Dog` or a `Cat`. The mechanism is a hidden lookup table. When the JVM loads a class, it builds one **method table** for that class (often called a *vtable*, for "virtual method table"): a list that maps each method name to the exact code that should run for that class. `Dog`'s table points `speak()` at `Dog`'s code; `Cat`'s table points `speak()` at `Cat`'s code. Every object you create carries a hidden pointer to its own class's table — a `Dog` object points at `Dog`'s table, a `Cat` object at `Cat`'s. So `a.speak()` compiles to: "follow the object's table pointer, look up `speak()` in that table, jump to whatever code it lists." The variable type is irrelevant at that moment — the object itself is holding the map.

> **Analogy — the object carries its own phone book.** Think of the method table as a small phone book each object keeps in its pocket. Calling `speak()` means "open your phone book, find the `speak` entry, dial that number." A `Dog` and a `Cat` both have a `speak` entry, but their phone books list different numbers — so the *same* call reaches different code. Java never has to guess the type; it just lets the object read from its own book.

> **Why this beats a big `if`.** The `if (a instanceof Dog)` version below has to be edited every time a new type appears. Dynamic dispatch never does, because the lookup is driven by the object's own table — add a `Bird` class with its own table and existing code calls `speak()` unchanged. The extensibility comes directly from *where* the decision lives: in the object, not in your calling code.

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — Dog's version
a2.speak();   // "Meow!" — Cat's version
```

You do not always have to declare the variable as the parent type. You use `Animal a = new Dog(...)` when you want to treat different types uniformly — that is where polymorphism pays off. If you need Dog-specific behaviour right away, declare it as `Dog dog = new Dog(...)`. The practical rule: use the most general type that still gives you what you need.

The case that makes it click is a list of mixed types. Without polymorphism you check every type manually — and the code breaks every time you add a new one:

```java
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

// MAL — without polymorphism: every new type forces a change right here
for (Animal a : animals) {
    if (a instanceof Dog) System.out.println("Woof!");
    else if (a instanceof Cat) System.out.println("Meow!");
    // adding Bird? come back here and add another else if
}

// BIEN — with polymorphism: add Bird and this loop never changes
for (Animal a : animals) {
    System.out.println(a.speak());  // Dog → "Woof!", Cat → "Meow!" — no if needed
}
```

**In Spring Boot** this pattern is fundamental. Imagine you have several notification types — `EmailNotification`, `SmsNotification`, `PushNotification` — all implementing a `Notification` interface with a `send()` method. The service that uses them does not need to know which type each one is:

```java
public void notifyAll(List<Notification> notifications) {
    for (Notification n : notifications) {
        n.send();  // Email, SMS, or Push — Java picks the right version at runtime
    }
}
```

If you add `WhatsAppNotification` tomorrow, this service does not change a single line.

---

## `instanceof` and pattern matching

> Docs: [Baeldung — The Java `instanceof` Operator](https://www.baeldung.com/java-instanceof) → read: "The `instanceof` Operator", then [Baeldung — Pattern Matching for `instanceof`](https://www.baeldung.com/java-pattern-matching-instanceof) → read: "Pattern Matching for `instanceof`" for the Java 16+ form.

When working with polymorphism, you may at some point need to access a method that only exists in a concrete subclass — not in the parent. For example, you have an `Animal` variable that actually holds a `Dog`, and you need to call `fetch()`, which only `Dog` has.

If you try to call `animal.fetch()` directly, the compiler rejects it — `Animal` does not have that method. To call it, you need to **cast** — tell the compiler "treat this variable as a `Dog`". But if the object is not actually a `Dog`, the cast would throw a `ClassCastException` at runtime. `instanceof` exists precisely to avoid that error: it checks the real type before the cast.

```java
Animal animal = new Dog("Rex", "Labrador");  // variable type: Animal — actual object in memory: Dog

// Classic form (up to Java 15)
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // explicit cast — we already know it is safe
    dog.fetch();
}

// Pattern matching (Java 16+) — cleaner, casts automatically
if (animal instanceof Dog dog) {
    dog.fetch();   // dog is already available as Dog, no manual cast needed
}
```

Skipping the check is what makes the `ClassCastException` real rather than theoretical. The compiler does not stop you, because as far as it can see the cast is *plausible*: `animal` is declared `Animal`, and a `Dog` is an `Animal`, so it might be one. It only *might* be — and the check that settles it happens at runtime, on the object itself:

```java
Animal pet = new Cat("Whiskers");

// MAL — no check: compiles cleanly, blows up only when this line runs
Dog d = (Dog) pet;
d.fetch();

// BIEN — instanceof asks the object first; if it says no, the block is simply skipped
if (pet instanceof Dog dog) {
    dog.fetch();
}
```

The wrong version fails on the cast line, before `fetch()` is ever reached:

```
Exception in thread "main" java.lang.ClassCastException: class Cat cannot be cast to class Dog (Cat and Dog are in unnamed module of loader 'app')
```

> **Why does the compiler let the bad cast through at all?** Because a cast is you overruling it. The compiler only checks that the cast is *possible* along the class tree — casting `Animal` to `Dog` is a downcast, and downcasts are exactly what casting exists for. Whether *this particular object* really is a `Dog` is knowable only when the object exists, so the JVM re-checks it at runtime and throws if you lied. That is why a `ClassCastException` is a `RuntimeException` and not a compile error — see [11-exceptions.md](11-exceptions.md), where it sits in the unchecked half of the hierarchy: the compiler cannot foresee it, so it does not force you to handle it.

> **Treat frequent `instanceof` as a design smell, not a tool you reach for.** Every `instanceof` chain is the "big `if`" from the previous section wearing a new shape: it puts the type decision in your calling code instead of in the object's method table, so every new subclass forces you to come back and edit it. The legitimate uses are narrow — implementing `equals(Object o)`, which must accept anything (you saw that shape in [06-oop-classes.md](06-oop-classes.md)), and handling a genuinely foreign object you did not design. Anywhere else, the fix is to add a method to the parent and let dynamic dispatch pick the version.

---

## `final` classes, methods, and fields

> Docs: [Baeldung — The `final` Keyword in Java](https://www.baeldung.com/java-final) → read: "`final` Classes", "`final` Methods" and "`final` Variables" — one per meaning below.

`final` can apply to three different things, each with a different meaning:

- `final class` — the class cannot be extended: no subclass can inherit from it
- `final method` — the method cannot be overridden by any subclass
- `final field` — the field can only be assigned once; normally in the constructor or at declaration. After that, its value cannot change

```java
public final class String { ... }  // no class can inherit from String

public class Animal {
    public final void breathe() { ... }  // no subclass can override this
}

public class Circle {
    private final double radius;  // can only be assigned once

    public Circle(double radius) {
        this.radius = radius;  // the only allowed assignment
    }
}
```

Each of the three produces its own error, and they are worth recognising because the words barely overlap. Extending a `final` class is rejected at the `extends` clause — this is the one you will hit first, usually by trying to subclass something from the standard library:

```java
class MyString extends String { }   // MAL
```
```
error: cannot inherit from final String
```

Overriding a `final` method reports the same headline as any other illegal override, with the real reason underneath:

```
error: breathe() in Dog cannot override breathe() in Animal
  overridden method is final
```

And reassigning a `final` field gives you one of two messages depending on *where* you do it — outside a constructor it is a flat refusal, inside a constructor that already assigned it the wording changes to reflect that the first assignment was legal:

```java
class Circle {
    private final double radius = 1;
    void grow() { radius = 2; }     // MAL
}
```
```
error: cannot assign a value to final variable radius
```
```
error: variable radius might already have been assigned
```

> **`final` on a field is JavaScript's `const`, and the same caveat applies.** `final double radius` and `const radius` behave identically: one assignment, then the name is locked. And in both languages the lock is on the *variable*, not on the object it points at — a `final List<String> tags` can never be pointed at a different list, but `tags.add("x")` works exactly as before. This is the same value-vs-reference distinction from [01-variables-types.md](01-variables-types.md): what `final` freezes is the slot, not the thing in it.

> **Why is `final` here, in an inheritance file?** Because two of its three uses are about *stopping* inheritance: a `final class` slams the door on subclassing, and a `final method` slams the door on overriding. It is the deliberate opposite of everything above — you reach for it when a class or method must never be extended or replaced, usually for safety (`String` is `final` so nobody can subclass it and break the guarantees the whole language relies on). The `final field` meaning is unrelated to inheritance; it just shares the keyword.

In Spring Boot you will see `final` constantly on the fields of service classes, holding dependencies handed in through the constructor. It is the recommended way to write beans, and the reason is exactly the "assigned once" rule above rather than a style preference:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;   // assigned once, in the constructor

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
}
```

> **What `final` buys you on an injected dependency.** Three things, all of them compiler-enforced rather than trusted. First, the field *must* be assigned by the end of every constructor, so there is no way to build a `ProjectService` whose repository is `null` — the object is either fully wired or it does not compile. Second, nothing can swap the repository out later, which matters because a Spring service is a single shared object serving every request at once; a field that could be reassigned mid-flight would be a bug you could never reproduce. Third, it documents intent: reading `final` at the top of a service tells you immediately that this is a dependency, not mutable state. Field injection (`@Autowired` straight onto the field) gives up all three, which is why it is discouraged — the field cannot be `final`, because there is no constructor doing the assigning.

---

## What cannot be overridden — `static`, `private` and `final` methods

> Docs: [Baeldung — Variable and Method Hiding in Java](https://www.baeldung.com/java-variable-method-hiding) → read: "Method Hiding" for the `static` case, then [Baeldung — Static and Dynamic Binding in Java](https://www.baeldung.com/java-static-dynamic-binding) → read: "Static Binding" for why the three cases below share one cause.

Everything so far has pointed one way: put a method in the parent, replace it in the subclass, and the object decides which body runs. Three kinds of method are quietly outside that system, and the dangerous one is `static` — because redeclaring a `static` method in a subclass *looks* exactly like an override, compiles without complaint, and then behaves differently.

The mechanism from §Polymorphism is what explains all three at once. Dynamic dispatch works because the object carries a pointer to its class's method table. A method that never needs an object, or that no subclass can even see, has no entry to look up — so there is nothing for the JVM to dispatch on, and the decision falls back to the compiler, which only knows the **reference type** you wrote.

### `static` methods are *hidden*, not overridden

A `static` method belongs to the class, not to any instance ([06-oop-classes.md](06-oop-classes.md) covers why — there is one shared copy, and no `this`). When a subclass declares a `static` method with the same signature, it does not replace the parent's version; it **hides** it. Both bodies continue to exist, and which one runs is decided at compile time from whichever name is on the left of the dot:

```java
public class Animal {
    static String describe() { return "Some animal"; }
}

public class Dog extends Animal {
    static String describe() { return "A dog"; }   // hides — it does NOT override
}
```

The classic trap is calling a hidden method through a reference, because the syntax is identical to an instance call:

```java
Animal a = new Dog("Rex", "Labrador");

Animal.describe();   // "Some animal"
Dog.describe();      // "A dog"
a.describe();        // "Some animal"  ← the object is a Dog, but Animal's version runs
```

That third line is the whole lesson. If `describe()` were an instance method, the object's table would be consulted and `"A dog"` would print — that is the behaviour you saw with `speak()`. Because it is `static`, the compiler resolves it from the declared type of `a`, which is `Animal`, and the real object in memory is never consulted at all. IntelliJ underlines `a.describe()` as a warning ("Static method accessed via instance reference") precisely because the call reads like something it is not.

> **Why can't a `static` method be dispatched dynamically?** Dispatch starts from the object: "follow this object's pointer to its class's method table". A `static` method is callable with no object in existence — `Animal.describe()` runs fine before you ever write `new` — so there is no object to start from and no per-instance table to consult. The compiler therefore has to pick a body while compiling, and the only type information it has at that moment is what you declared the variable to be.

Java gives you two guardrails around this, and it is worth knowing they exist so the errors are not a surprise. Marking the subclass version with `@Override` is rejected outright, which is the compiler telling you the two methods are not related the way you think:

```
error: static methods cannot be annotated with @Override
```

And you cannot mix the two — an instance method in the subclass may not take the place of a `static` one in the parent, or the reverse:

```
error: describe() in Dog cannot override describe() in Animal
  overridden method is static
```

> **`static` in the parent is usually the real mistake.** Hiding is almost never something you want; it produces two methods with one name and a rule nobody remembers. If a method's behaviour should vary by subclass, it must be an instance method. If it genuinely does not depend on the object, keep it `static` and call it through the class name (`Animal.describe()`) so the resolution is visible in the code instead of hidden behind a reference.

### `private` methods are invisible, so nothing can override them

A `private` method is not part of what a subclass inherits — the subclass cannot see it, let alone replace it. Declaring a method with the same name in the subclass therefore creates a completely unrelated new method, and the parent goes on calling its own:

```java
public class Animal {
    private String secret() { return "animal secret"; }
    String reveal() { return secret(); }        // always calls Animal's secret()
}

public class Dog extends Animal {
    private String secret() { return "dog secret"; }   // unrelated method, same name
}

Animal a = new Dog("Rex", "Labrador");
a.reveal();   // "animal secret" — Dog's version is never reached
```

> **Why doesn't `reveal()` reach `Dog`'s version?** Because a `private` method is bound at compile time, for the same structural reason as `static`: no subclass can see it, so no subclass entry can ever exist in the table for it, so there is nothing to dispatch on. The compiler resolves `secret()` inside `Animal` to `Animal`'s own body and that is final. Adding `@Override` to `Dog.secret()` produces `method does not override or implement a method from a supertype` — the same error as the typo case earlier, and for the same underlying reason: there is no parent method visible to override.

### `final` methods are dispatched, but locked

`final` is the odd one out of the three. A `final` method *is* an ordinary instance method — it has a table entry and it is dispatched dynamically like any other. What `final` removes is the ability of a subclass to put a different body in that entry, and the compiler enforces it at the point of the attempt (`overridden method is final`, from the previous section). Use it when a method's behaviour is a guarantee the rest of the class depends on and a subclass must not be able to break it.

| | Overridable? | Resolved by |
|---|---|---|
| Instance method | Yes | the object's real type (runtime) |
| `static` method | No — it is *hidden* | the reference type (compile time) |
| `private` method | No — invisible to subclasses | the declaring class (compile time) |
| `final` method | No — locked by the compiler | the object's real type (runtime) |

Read the `Resolved by` column as "what decides which body runs". Only the rows that say *runtime* participate in polymorphism at all; the two compile-time rows are decided from the text you wrote, which is why they can surprise you when the variable's declared type and the object's real type differ. `final` is deliberately in the runtime group: it is the one restriction that limits *who may write* the method, not *how it is chosen*.

---

## The `Object` class

> Docs: [Baeldung — `equals()` and `hashCode()` Contracts](https://www.baeldung.com/java-equals-hashcode-contracts) → read: "2.1. Overriding equals()" and "3. The .hashCode() Method" — the two `Object` methods you will actually override. You already worked through both in [06-oop-classes.md](06-oop-classes.md); read them here only as *inherited* methods.

There is one class at the very top of every inheritance hierarchy in Java: `Object`. All classes extend it automatically, even if you do not declare it. This means every object you create carries a set of methods inherited from `Object` — whether you defined them or not.

The three that appear most often in real projects are:

- **`toString()`** — called automatically when you print an object with `System.out.println(obj)` or concatenate it into a `String`. Without overriding it you get something like `com.victor.timetrack.model.User@1a2b3c` — the class name and a memory address, which tells you nothing useful. You override it to return something readable like `"User{name='Victor'}"`.
- **`equals()`** — compares whether two objects are "equal". Without overriding it, Java compares memory references: two different objects with the same data are not equal even if they represent the same entity. You override it when you want the comparison to be based on field values.
- **`hashCode()`** — used internally by `HashMap` and `HashSet` to organise objects in memory. The rule is: if you override `equals()`, you must always override `hashCode()` too — otherwise your objects will behave unexpectedly inside collections.

> **Why must `equals()` and `hashCode()` always change together?** Because a `HashMap` uses the hash code as an address and `equals()` only to confirm the match once it has arrived there — so two objects that are `equals()` with different hash codes get filed at different addresses and are never found. The full mechanism, the `equals()` contract and what goes wrong on a JPA entity are worked through in [06-oop-classes.md](06-oop-classes.md); here, just keep the rule: override one and you override the other.

You already wrote all three by hand in [06-oop-classes.md](06-oop-classes.md) — the implementation shape, which fields to pick, and what breaks on a JPA entity all live there, and this file does not repeat them. What is new *here* is only the sentence that makes them make sense at all: you were never adding those methods, you were **overriding inherited ones**. `User` gets a `toString()` for free the moment it is compiled, because `User extends Object` was written for you; your `@Override` swaps the body in the method table, and dynamic dispatch — the mechanism from §Polymorphism — is what makes `System.out.println(user)` reach *your* version instead of `Object`'s.

That is worth pinning down, because `println` never mentions your class:

```java
User u = new User("Victor", "victor@example.com");
System.out.println(u);   // without an override: "com.victor.timetrack.model.User@3a4b5c"
                         // with one:            "User{name='Victor', email='victor@example.com'}"
```

`System.out.println(Object x)` is compiled against the `Object` parameter type and calls `x.toString()`. It has no idea `User` exists — it just follows the object's own method table, finds whichever `toString()` body that class registered, and runs it. Every "magic" `toString()` you have ever seen is this one rule, and the same is true of `equals()`: `List.contains()` and `HashMap.get()` call `equals(Object)` on a parameter typed `Object`, and land in your body for exactly the same reason.

> **This is also why IntelliJ can generate the three for you (`Alt+Insert` → *equals() and hashCode()*).** The signatures are fixed by `Object` — `public String toString()`, `public boolean equals(Object o)`, `public int hashCode()` — so the only decision left is which fields to compare or print. In Spring Boot, Lombok's `@Data` or `@EqualsAndHashCode` generates them at compile time instead, which is why a TimeTrack entity has all three without a line of them in the source.

> **Because every class descends from `Object`, you can always store any object in an `Object` variable:** `Object obj = new User("Victor", "victor@example.com");` is valid, since `User` implicitly extends `Object`. This is the same upcasting you saw with `Animal a = new Dog(...)` — only now the parent is the universal root. It is exactly why methods like `equals(Object o)` take an `Object` parameter: any object at all can be passed in, and `instanceof` narrows it back to the real type inside.

---

## Spring Boot connection

> Docs: [Baeldung — Spring Data Repositories compared](https://www.baeldung.com/spring-data-repositories) → read: "Spring Data Repositories" and "JpaRepository" — what you inherit by extending, and what the two type parameters are for.

> **Preview — Spring Boot:** This section uses `JpaRepository` and `RuntimeException` in a Spring Boot context. `JpaRepository` is explained in the Spring Boot notes. `RuntimeException` is a Java class covered in [11-exceptions.md](11-exceptions.md) — if you haven't read that file yet, come back here after.

Inheritance is not an occasional technique in Spring Boot — it is how you plug into the framework at all. The two places you meet it on day one are the repositories and your own exception types, and they use it in opposite ways: in the first you inherit behaviour you never wrote, in the second you inherit *identity* so the framework recognises your class.

### Inheriting behaviour — a repository that extends `JpaRepository`

A repository in TimeTrack is an interface with almost nothing in it — the file below is the whole class, exactly as it exists in the project:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

- **`extends JpaRepository`** — the same keyword as `Dog extends Animal`, used between two interfaces (interfaces extend interfaces; `implements` is only for classes). Everything `JpaRepository` declares is now declared by `UserRepository` too: `save()`, `findById()`, `findAll()`, `deleteById()`, `count()` and more, none of which you wrote.
- **`<User, Long>`** — the two *type parameters*, and this is the part that is easy to skip over. The first says **which entity this repository stores**: rows of the `users` table, loaded as `User` objects. The second says **what type that entity's primary key is** — `User` declares `private Long id`, so the key type is `Long`. Together they are what makes the inherited methods concrete: because you supplied `User` and `Long`, `findById()` on *this* repository takes a `Long` and hands back a `User`, not some generic object you would have to cast. Get the second one wrong — write `<User, String>` while the entity's `id` is a `Long` — and the application refuses to start: Spring builds the repository when the context comes up, sees the mismatch against the `@Id` field, and fails there rather than letting it become a surprise mid-request. The `<...>` syntax itself is **generics**, covered in full in [09-generics.md](09-generics.md); for now read `JpaRepository<User, Long>` as "a repository of `User`s whose id is a `Long`".
- **`Optional<User> findByEmail(String email)`** — the `Optional<User>` return type is a small box that either holds a `User` or is empty, so a missing row comes back as "nothing found" instead of a `null` you might forget to check; it is covered in [09-generics.md](09-generics.md). The method itself has no body, which is legal here because interfaces declare rather than implement ([07-interfaces-abstract.md](07-interfaces-abstract.md)). Spring Data reads the *name* at startup and generates the query from it: `findBy` + the entity field `email` becomes `SELECT * FROM users WHERE email = ?`.

> **Where is the class that actually does the work?** There isn't one you can open. `UserRepository` is an interface with no implementation anywhere in the project — at startup Spring generates a class that implements it and registers that object as the bean you inject. This is the payoff of the whole `extends` chain: you declared a contract, the framework supplied the behaviour behind it.

### Inheriting identity — a custom exception that extends `RuntimeException`

The second pattern uses inheritance for a completely different reason. Here you are not after inherited behaviour — you want your class to *be* an exception, so that `throw` accepts it and Spring's error handling can catch it by type:

```java
// projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/ResourceNotFoundException.java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

- **`extends RuntimeException`** — this single word is what makes the class throwable. Java only lets you `throw` something that descends from `Throwable`, so without the `extends` your class is just a class. It also decides *which half* of the exception world you land in: `RuntimeException` is the unchecked branch, so callers are not forced to wrap the call in `try/catch` ([11-exceptions.md](11-exceptions.md)).
- **`super(message)`** — the same parent-constructor call from the top of this file, doing real work rather than ceremony. `RuntimeException` is where the message field actually lives; passing it up is what makes `getMessage()` return your text later, in the handler that turns the exception into an HTTP 404. In this project the message is built by the caller, so `ProjectService` throws `new ResourceNotFoundException("Project not found with id: " + id)` and the constructor's only job is to hand that string to the parent.

> **Why is the class not called `EmployeeNotFoundException`?** Because one exception type per entity would mean writing the same three lines for `User`, `Project` and `TimeEntry`, and then registering three handlers that all produce a 404. TimeTrack declares one `ResourceNotFoundException` and lets the *message* carry which resource was missing. That is a design choice, not a rule — a project with genuinely different handling per entity would split them — but it is the shape you will meet most often, and it is worth noticing that it works only because the message is passed up to the parent instead of being hardcoded here.

---

You now have objects that share behaviour through a parent, override it where they differ, and are handled uniformly through polymorphism. The natural next need is a place to *keep many of them* — a list of `Animal`s, a set of unique `User`s, a map from id to `Project`. Holding groups of objects is what [10-collections.md](10-collections.md) is about, and it leans directly on what you just learned: a `List<Animal>` stores dogs and cats side by side precisely because polymorphism lets one variable type hold many object types.
