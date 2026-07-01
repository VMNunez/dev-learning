# Inheritance and Polymorphism

> 📖 [Oracle Docs — Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)

You reach for inheritance when two or more classes are the same *kind* of thing and share most of their behaviour, but differ in a few specific methods. Without it, you'd write the same `eat()`, `breathe()`, and `sleep()` methods in every animal class — and when you need to change one, you'd update every copy separately. Inheritance lets you write shared behaviour once in a **parent class**, and every **subclass** gets it automatically.

## Inheritance — `extends`

A subclass inherits all `public` and `protected` fields and methods from the parent class and can also add its own:

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
        super(name);    // call the parent constructor — MUST be the first line
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

Java only allows **single inheritance** — a class can extend only one class. This is different from TypeScript where you can compose types with intersections.

---

## `super`

When a subclass has its own constructor, it usually needs the parent to initialize its own fields first. `super()` triggers that initialization — and it must be the first line:

```java
// super() — call parent constructor
public Dog(String name, String breed) {
    super(name);   // must be the first line in the constructor
    this.breed = breed;
}

// super.method() — call parent method
@Override
public void eat() {
    super.eat();                          // run the parent version first
    System.out.println("...and more!");   // then add extra behaviour
}
```

---

## Method overriding — `@Override`

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

`@Override` is optional but always recommended — it tells the compiler to verify that you are actually overriding a parent method, not accidentally creating a new one.

### Overriding vs Overloading

| | Overriding | Overloading |
|---|-----------|-------------|
| Where | Subclass | Same class |
| Signature | Must match exactly | Different parameters |
| Inheritance | Yes | No |
| Runtime | Decided at runtime | Decided at compile time |

---

## Polymorphism

The real payoff of inheritance comes when you have code that works with the parent type and you want it to handle any subclass automatically — without changing it every time you add a new one. That is polymorphism: a parent-type variable can hold a subclass object, and the method that runs is always the subclass's version:

```java
Animal a1 = new Dog("Rex", "Labrador");
Animal a2 = new Cat("Whiskers");

a1.speak();   // "Woof!" — Dog's version
a2.speak();   // "Meow!" — Cat's version

// Store different types in one list
List<Animal> animals = new ArrayList<>();
animals.add(new Dog("Rex", "Labrador"));
animals.add(new Cat("Whiskers"));

for (Animal a : animals) {
    System.out.println(a.speak());  // calls the right version for each
}
```

This is powerful in Spring Boot — a service method that accepts `Animal` works with `Dog`, `Cat`, or any future subclass.

---

## `instanceof` and pattern matching

Sometimes you have a variable typed as `Animal` but you need to call a method that only `Dog` has. `instanceof` lets you check the real type at runtime before attempting the cast:

```java
// Classic
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // cast to access Dog-specific methods
    dog.fetch();
}

// Pattern matching (Java 16+) — cleaner
if (animal instanceof Dog dog) {
    dog.fetch();   // dog is already cast and ready to use
}
```

---

## `final` class and methods

Use `final` when you need to protect a class or a method from being changed by subclasses — for example, to guard critical logic that must always behave the same way regardless of the subtype:

- `final class` — cannot be extended
- `final method` — cannot be overridden by a subclass

```java
public final class String { ... }  // String cannot be subclassed

public class Animal {
    public final void breathe() { ... }  // no subclass can override this
}
```

---

## The Object class

Every Java class implicitly extends `Object`. This is why every class has `toString()`, `equals()`, and `hashCode()` — they are defined in `Object`. When you override them, you replace the default `Object` implementation.

```java
Object obj = new Employee("Victor");  // valid — everything is an Object
```

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses `JpaRepository` and `RuntimeException` in a Spring Boot context. `JpaRepository` is explained in the Spring Boot notes. `RuntimeException` is a Java class covered in `08-exceptions.md` — if you haven't read that file yet, come back here after.

Inheritance appears constantly in Spring Boot:

```java
// Your repository extends JpaRepository — you inherit findById, findAll, save, delete, etc.
public interface EmployeeRepository extends JpaRepository<Employee, Long> {}

// RuntimeException is a superclass — you extend it to create custom exceptions
public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Employee not found: " + id);
    }
}
```
