# Methods

> 📖 [Baeldung — Guide to Methods in Java](https://www.baeldung.com/java-methods) → read the full article
> 📖 [Oracle Docs — Defining methods](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html) (official reference)

## Method declaration

In [02-control-flow.md](02-control-flow.md) every loop and `if` you wrote lived inside a `main` method — that `main` was itself a method, and so were the `System.out.println` calls it invoked. This note steps back and looks at that building block directly: what a method is made of, and how you write your own.

> **Where do methods live?** Always inside a class — they cannot exist outside a class in Java. We cover them here before classes because you have already seen them in the control flow examples. The full structure of a class (fields, constructors, encapsulation) is covered in [04-oop-classes.md](04-oop-classes.md).

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

An access modifier controls *from where* a method can be called (or a field accessed). It is how Java protects a class's internal code and decides which parts are visible from the outside.

Read the table as "who is allowed to call this method": each row is one modifier and the scope of callers it permits, from the most open (`public`) to the most closed (`private`).

| Modifier | Who can access it |
|----------|------------------|
| `public` | Everyone |
| `private` | Only inside the same class (subclasses cannot access it either) |
| `protected` | Same class + subclasses + same package |
| (none) | Same package only |

In Spring Boot you will mostly use `public` for REST endpoints and service methods, and `private` for internal helper methods.

```java
public class UserService {
    // public — any class can call findById
    public User findById(Long id) {
        return validate(findRaw(id));
    }

    // private — only accessible inside UserService; the outside world does not know these exist
    private User findRaw(Long id) { ... }
    private User validate(User user) { ... }
}

// protected — useful in inheritance (covered in 06-inheritance-polymorphism.md):
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

---

## Return types

The return type declares what kind of value the method hands back when it finishes. If a method computes nothing to give back — it just does something — its return type is `void`.

```java
public String getName() { return this.name; }   // returns a String
public int getAge() { return this.age; }         // returns an int
public boolean isActive() { return this.active; }// returns boolean — by convention starts with "is"
public void save(Employee e) { ... }             // returns nothing
public Employee findById(int id) { ... }         // returns an object
public List<Employee> findAll() { ... }          // returns a collection
```

---

## void vs Void

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

This is exactly the Spring Boot `delete` pattern — the service returns `void`, but the controller returns `ResponseEntity<Void>` so it can still send a 204 status with no body (see [spring-boot/02-rest-controllers.md](../spring-boot/02-rest-controllers.md)):

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    projectService.delete(id);                  // void — returns nothing
    return ResponseEntity.noContent().build();  // 204, no body
}
```

---

## Static methods

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

You have already used static methods without noticing — `Integer.parseInt("42")` and `String.valueOf(42)` are static: you call them on the class `Integer` or `String`, not on a specific object. Remember that wrapper classes (`Integer`, `Long`, `Boolean`…) are real Java classes. That is exactly what distinguishes them from a primitive `int` — they are objects, they have methods, and they can be `null`. The name "wrapper" is literal: they wrap a primitive value inside an object.

> **In Spring Boot:** your service and repository methods are instance methods — you call them on objects Spring injects (`employeeService.findAll()`, `employeeRepository.save(emp)`). They need the object because they work with internal state (the database connection, the configuration, etc.). `static` methods show up in pure utility classes like `JwtUtils.generateToken(username)` — stateless operations that depend only on the arguments you pass in.

---

## Method overloading

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

> **Overloading vs overriding — don't confuse them.** They sound alike and both involve "two methods with the same name", but they are opposite ideas. **Overloading** (this section) is *one* class defining several versions of a method that differ in their parameters — the choice is made at compile time by the arguments you pass. **Overriding** is a *subclass* replacing a method it inherited from its parent, keeping the *exact same* parameters, to change the behaviour — the choice is made at run time by the object's real type. Rule of thumb: same name + different parameters + same class = overloading; same name + same parameters + subclass = overriding. Overriding is covered in [06-inheritance-polymorphism.md](06-inheritance-polymorphism.md).

---

## Varargs — variable number of arguments

Normally a method with two parameters demands exactly two arguments. Varargs (`...`) let you pass any number instead — zero, one, five, as many as you like — and Java collects them into an array internally. You will see this in logging frameworks (`log.info("User {} not found", id)`) and utilities like `String.format()` — the same pattern as the `.formatted()` you saw in [01-variables-types.md](01-variables-types.md).

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

Inside the method, `numbers` behaves like an array.

---

## Calling methods

Before looking at how a method is called, let's put everything so far into one complete example — first the class with its methods, then how we use them from the outside:

```java
public class Calculator {
    private String name;  // a field of the class — fields are covered in 04-oop-classes.md

    // constructor — runs when you do new Calculator("MyCalc"); covered in detail in 04-oop-classes.md
    public Calculator(String name) {
        this.name = name;
    }

    // ⚠ This method does not use any field of the class — it should technically be static.
    // It is here to show declaration syntax; the real instance method example is getName() below.
    public int add(int a, int b) {
        return a + b;
    }

    // Static method — no object needed
    public static double square(double n) {
        return n * n;
    }

    // Real instance method — needs the object because it accesses this.name
    public String getName() {
        return this.name;
    }
}
```

Calling them:

```java
// Instance method — you must create an object first
Calculator calc = new Calculator("MyCalc");
int result = calc.add(3, 4);           // 7
String name = calc.getName();          // "MyCalc"

// Static method — called directly on the class, no object
double squared = Calculator.square(5); // 25.0

// Method chaining — each method returns a new String so you can call the next method directly on it
String result2 = "  hello  "
    .trim()
    .toUpperCase()
    .replace("HELLO", "HI");           // "HI"
```

---

## Naming conventions

- Method names: `camelCase`, start with a verb — `getName()`, `save()`, `calculateTotal()`, `isActive()`
- Boolean getters: start with `is` or `has` — `isActive()`, `hasRole()`, `isEmpty()`
- Getters: `getName()`, `getAge()`
- Setters: `setName(String name)`, `setAge(int age)`

Those getters and setters are your first hint of a bigger pattern: methods rarely live alone — they wrap the *fields* of a class and guard how the outside world reads and changes them. That coupling of fields and methods, plus constructors and encapsulation, is the whole subject of the next note. Continue in [04-oop-classes.md](04-oop-classes.md), where the `Calculator` you just saw becomes a proper class with state.
