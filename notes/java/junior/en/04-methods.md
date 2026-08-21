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

---

## Access modifiers

> Docs: https://www.baeldung.com/java-access-modifiers → read: "Private", "Protected" and "Comparison"

An access modifier controls *from where* a method can be called (or a field accessed). It is how Java protects a class's internal code and decides which parts are visible from the outside.

> **The same four modifiers apply to methods, fields and classes alike.** Nothing in this section is method-specific: `private String name;` hides a field exactly the way `private ProjectResponse toResponse(...)` hides a method, and a `public class` vs a package-private `class Foo` (no modifier) decides which classes may even name the type. The only restriction is that a top-level class cannot be `private` or `protected` — there is no enclosing scope for those to mean anything in. Methods are just where you meet the modifiers first.

Read the table as "who is allowed to call this method": each row is one modifier and the scope of callers it permits, from the most open (`public`) to the most closed (`private`).

| Modifier | Who can access it |
|----------|------------------|
| `public` | Everyone |
| `private` | Only inside the same class (subclasses cannot access it either) |
| `protected` | Same class + subclasses + same package |
| (none) | Same package only |

In Spring Boot you will mostly use `public` for REST endpoints and service methods, and `private` for internal helper methods. This is exactly the split in the TimeTrack service you wrote — the five methods the controller calls are `public`, and the one that converts a `Project` entity into the DTO sent back over HTTP is `private`, because nobody outside the service has any business calling it:

**File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/ProjectService.java`

```java
@Service
public class ProjectService {
    // public — the controller calls these
    public ProjectResponse getById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toResponse(project);
    }

    // private — an internal helper; the outside world does not know it exists
    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        return response;
    }
}
```

> `ProjectResponse`, `@Service` and `ResourceNotFoundException` are Spring Boot / project classes, not Java keywords — you meet them properly in the Spring Boot notes. Read the snippet only for the `public` vs `private` split, which is pure Java.

```java
// protected — useful in inheritance (covered in 08-inheritance-polymorphism.md):
// subclasses can access it, the outside world cannot
public class Animal {
    protected String sound;
}

public class Dog extends Animal {
    public void bark() {
        System.out.println(this.sound);  // ✓ — Dog extends Animal and can see sound
    }
}
```

The two failure messages are worth memorising, because IntelliJ shows you the string and not the rule. Calling a `private` method from outside its class:

```java
ProjectService service = new ProjectService(projectRepository);
service.toResponse(project);
// error: toResponse(Project) has private access in ProjectService
```

Note *when* that happens: at **compile time**. `private` is not a runtime guard that throws — the code containing the illegal call never becomes a `.class` file at all.

> **`protected` has a sharper scope than "subclasses can access it".** Split the row in the table in two, because the two halves behave differently. **Same package:** any class in the package reaches a `protected` member, subclass or not — there it behaves exactly like the no-modifier default. **Different package:** only a subclass reaches it, and only *through its own inheritance* — meaning through `this` (or through a reference whose declared type is the subclass itself). A subclass in another package still cannot read the member off some *other* `Animal` it was handed:
>
> ```java
> // package p2 — Dog extends p1.Animal
> public void bark() { System.out.println(this.sound); }             // ✓ its own inherited copy
> public void peek(Animal other) { System.out.println(other.sound); } // ❌
> // error: sound has protected access in Animal
> ```
>
> The reason is what `protected` is *for*: it opens the member to a subclass so the subclass can do its own job with its own state — not so it can inspect unrelated instances of the parent. Inside the same package Java relaxes this, on the assumption that classes shipped together are written by the same people and trust each other.

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

## Static methods

> Docs: https://www.baeldung.com/java-static → read: "The static Methods (Or Class Methods)" and "Understanding the 'Non-static variable' Error"

To understand `static`, you first need the difference between a **class** and an **object** (also called an instance). The class is the mould — the definition of what the objects look like. The objects are the concrete copies stamped out from that mould.

A normal (instance) method belongs to each individual object. Every `Employee` you create has its own `getName()`, because it returns the name of *that* specific employee — it needs the object to do its job.

A `static` method belongs to the **class itself**, not to any individual object. You don't need to create an object to call it — you call it directly on the class name:

```java
public class MathUtils {
    public static int square(int n) {
        return n * n;
    }
}

// No need to create a MathUtils to use it
int result = MathUtils.square(5);   // 25
```

When does `static` make sense? When the method performs an operation that does not depend on any data held by a particular object — only on the arguments you pass it. `MathUtils.square(5)` doesn't need to know anything about any `Employee` or any other object's state.

Here is the picture that makes the rest of this section obvious, and it uses the `Employee` you have been seeing since the previous sections. Give it one static method — `Employee.count()`, which returns how many employees have been created so far. That number belongs to the *class* as a whole, not to Ana or to Luis individually, which is precisely why it is `static`. The class is loaded into memory once; every object stamped from it is a separate box with its own field values. A `static` method lives up in the class box, next to nothing that belongs to any particular object:

```
   ┌──────────────────────────────────────────────────┐
   │  class Employee                                  │
   │     static count()   ← ONE copy, no object needed│
   └──────────────────────────────────────────────────┘
              │ stamps out            │ stamps out
              ▼                       ▼
   ┌──────────────────────┐  ┌──────────────────────┐
   │ Employee object #1   │  │ Employee object #2   │
   │   name = "Ana"       │  │   name = "Luis"      │
   │   getName()  ← this  │  │   getName()  ← this  │
   └──────────────────────┘  └──────────────────────┘
```

That layout is the whole mechanism, and it explains the error you are about to hit. An instance method is always called *on* an object (`ana.getName()`), so Java quietly hands it a hidden reference to that object, named `this` — which is how `getName()` knows whose name to return. A `static` method is called on the class (`Employee.count()`), and there is no object in that call at all, so **there is no `this` to hand over**. Any line inside it that reads an instance field would be asking "the name of *which* employee?" with no answer available. The compiler stops it:

```java
public class Employee {
    private String name = "Ana";

    public static void print() {
        System.out.println(name);   // ❌
    }
}
// error: non-static variable name cannot be referenced from a static context
```

The fix is one of two things, and choosing between them is the real decision: either the method genuinely needs an employee, in which case drop `static` and call it on an object — or it does not, in which case pass what it needs in as a parameter (`print(String name)`).

> **The rule only runs one way.** A `static` method cannot reach instance members, but an *instance* method can freely call `static` ones — `getName()` may call `Employee.count()` without any trouble. The asymmetry follows from the diagram: going from an object up to the class box is always possible, since the object was stamped from it. Going the other way means picking one object out of thousands, and nothing in a static call says which.

> **Why `main` is `static` — the question you have carried since [00-intro-java.md](00-intro-java.md).** `public static void main(String[] args)` is the method the JVM calls to start your program. Now ask what the JVM would have to do if `main` were an instance method: it would have to create an object of your class first, which means picking a constructor and inventing arguments for it — with your program not yet running to tell it which. `static` removes the problem entirely. The class is loaded, and `main` can be invoked directly on it **before a single object exists**. Everything else in your program is created from inside `main`, downstream of that first call. In the TimeTrack backend that entry point is `TimetrackApplication.main(...)`, and it does exactly this: `SpringApplication.run(...)` from a static context builds the entire object graph.

You have already used static methods without noticing — `Integer.parseInt("42")` and `String.valueOf(42)` are static: you call them on the class `Integer` or `String`, not on a specific object. Remember that wrapper classes (`Integer`, `Long`, `Boolean`…) are real Java classes. That is exactly what distinguishes them from a primitive `int` — they are objects, they have methods, and they can be `null`. The name "wrapper" is literal: they wrap a primitive value inside an object.

> **In Spring Boot:** your service and repository methods are instance methods — you call them on objects Spring injects (`projectService.getAll()`, `projectRepository.save(project)`). They need the object because they hold state Spring put there: the repository, the database connection, the configuration. `static` shows up in the genuinely stateless helper classes. In TimeTrack that is `TimeEntrySpecifications`, whose methods are all `public static Specification<TimeEntry> hasUserId(Long userId)` and friends — nothing is stored, the answer depends only on the argument, so there is nothing an object would add.
>
> **File:** `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/repository/TimeEntrySpecifications.java`
>
> The counter-example in the same project is the sharper lesson. `JwtUtil` *sounds* like a utility class, but `generateToken(String username)` is an **instance** method — because the class holds injected configuration (`@Value("${app.jwt.secret}") private String secret;`). The moment a helper needs a value from `application.properties`, it needs an object for Spring to inject that value into, and `static` is off the table. "Utility" in the name is not what decides it; holding state is.

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

---

## Calling methods

> Docs: https://www.baeldung.com/java-pass-by-value-or-pass-by-reference → read: "Parameter Passing in Java" — both "Passing Primitive Types" and "Passing Object References"

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

Each method is now the right kind for what it does, and that is the point of the example: `add()` touches `this.name` and `this.history`, so it *must* be an instance method; `square()` touches nothing but its argument, so `static` is correct. Deciding this is not style — it is the mechanism from the previous section applied.

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

### How arguments are actually passed — Java is always pass-by-value

Here is the question every reader has by this point, and it is the one interviewers ask precisely because most candidates get it half-right: *if I change a parameter inside a method, does the caller see it?* The honest answer is "it depends on what you mean by change" — and once you see the mechanism, it stops being a coin flip.

The rule, in one line: **Java copies the argument into the parameter. Always. For a primitive it copies the value; for an object it copies the *reference* — the arrow pointing at the object — never the object itself.** There is no pass-by-reference in Java, for any type.

Start with a primitive, where nothing is surprising:

```java
static void tryToChange(int hours) {
    hours = 999;              // edits this method's own copy
}

int worked = 8;
tryToChange(worked);
System.out.println(worked);   // 8 — not 999
```

`hours` is a brand-new variable that briefly held a copy of `8`. Assigning to it overwrote the copy. The caller's `worked` was never in the room.

Objects are where the confusion lives, so split what a method can do with one into the two cases — because they give **opposite** answers:

```java
// The object we pass around: a Project with a mutable name
Project project = new Project();
project.setName("TimeTrack");
```

```java
// ✅ MUTATING the object — the caller SEES it
static void rename(Project p) {
    p.setName("Renamed");     // follows the arrow, edits the one shared object
}

rename(project);
System.out.println(project.getName());   // "Renamed"
```

```java
// ❌ REASSIGNING the parameter — the caller does NOT see it
static void replace(Project p) {
    p = new Project();        // re-aims only THIS method's copy of the arrow
    p.setName("Renamed");
}

replace(project);
System.out.println(project.getName());   // "TimeTrack" — unchanged
```

Both methods look like they "change the project". Draw what each one does to the arrows and the difference becomes mechanical. On entry, the copy means two arrows point at one object:

```
caller's `project` ──┐
                     ├──►  [ Project: name="TimeTrack" ]
method's  `p`      ──┘
```

`rename` follows the arrow and edits the object they share, so both names see the new value. `replace` builds a second object and re-aims **only** the method's own arrow at it — the caller's arrow never moved, and the new object is discarded the moment the method ends:

```
caller's `project` ──────►  [ Project: name="TimeTrack" ]   ← caller still sees this

method's  `p`      ──────►  [ Project: name="Renamed"   ]   ← thrown away on return
```

> **The single test that answers every version of this question.** Ask: *did I follow the arrow, or re-aim it?* Calling a method on the parameter or touching its fields (`p.setName(...)`, `list.add(...)`) follows the arrow → the caller **sees** it. Assigning to the parameter itself (`p = ...`) re-aims the copy → the caller **does not**. Nothing else matters, and it holds for every object type.

> **A `String` parameter can never surprise you.** `String` is immutable — there is no `setName()`-equivalent on it — so the "mutate" case does not exist and only reassignment is possible, which is invisible to the caller. That is why passing a `String` feels like passing a primitive even though it is an object. Arrays, by contrast, *are* objects with mutable slots: `arr[0] = 99` inside a method is a mutation, and the caller sees it.

> **Where this goes next.** Two questions are deliberately left open here because they are memory questions, not method questions: *why* copy the arrow rather than the whole object, and *where* the copied arrow and the shared object physically sit. [05-memory-model.md](05-memory-model.md) picks up this exact topic and answers both by drawing the split between the stack and the heap — short version for now: a reference is one small fixed-size value no matter how big the object is, so copying it is free. Everything above stays true there; it just gains an address. That file is also where the interview framing lives, so if you are revising for one, read it there rather than re-deriving it here.

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

Those getters and setters are your first hint of a bigger pattern: methods rarely live alone — they wrap the *fields* of a class and guard how the outside world reads and changes them. That coupling of fields and methods, plus constructors and encapsulation, is the whole subject of the next note. Continue in [06-oop-classes.md](06-oop-classes.md), where the `Calculator` you just saw becomes a proper class with state.
