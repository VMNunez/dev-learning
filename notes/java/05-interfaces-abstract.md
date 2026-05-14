# Interfaces and Abstract Classes

## Interface

An interface defines a **contract** — a list of methods that any implementing class must provide. It does not contain any implementation (by default).

```java
public interface Printable {
    void print();        // no body — just the signature
    String getSummary(); // any class that implements Printable must have these two methods
}
```

A class that implements the interface must provide all the methods:

```java
public class Employee implements Printable {
    private String name;

    @Override
    public void print() {
        System.out.println("Employee: " + name);
    }

    @Override
    public String getSummary() {
        return "Name: " + name;
    }
}
```

### A class can implement multiple interfaces

```java
public class Employee implements Printable, Exportable, Auditable {
    // must implement all methods from all three interfaces
}
```

### Default methods (Java 8+)

Interfaces can have a default implementation. Classes can override it or use it as-is:

```java
public interface Printable {
    void print();

    default String getLabel() {
        return "Printable item";   // default implementation
    }
}
```

---

## Abstract class

An abstract class is a **partial implementation** — it can have both concrete methods (with body) and abstract methods (without body). It cannot be instantiated directly.

```java
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Concrete method — already implemented
    public void breathe() {
        System.out.println(name + " is breathing");
    }

    // Abstract method — subclasses MUST implement this
    public abstract void makeSound();
}
```

A subclass that extends an abstract class must implement all abstract methods:

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

A class can only extend **one** abstract class. This is the key difference with interfaces.

---

## Interface vs Abstract class

| | Interface | Abstract class |
|---|-----------|----------------|
| Methods | Abstract by default; can have `default` | Can have both abstract and concrete |
| Fields | Only `public static final` constants | Can have any fields |
| Multiple? | A class can implement many | A class can only extend one |
| Constructor | No | Yes |
| When to use | Define a capability a class can have | Define a base type with shared logic |

**Interface:** "This class can do X" — `Printable`, `Exportable`, `Comparable`
**Abstract class:** "This class IS a type of X" — `Animal`, `Shape`, `BaseService`

---

## Functional interfaces (Java 8+)

An interface with exactly **one** abstract method. Used with lambdas:

```java
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}

// Used with a lambda
Validator emailValidator = value -> value.contains("@");
emailValidator.validate("test@email.com");   // true
```

The most common built-in functional interfaces:

| Interface | Method | Used for |
|-----------|--------|---------|
| `Predicate<T>` | `boolean test(T t)` | filtering — `list.stream().filter(e -> e.isActive())` |
| `Function<T, R>` | `R apply(T t)` | transforming — `list.stream().map(e -> e.getName())` |
| `Consumer<T>` | `void accept(T t)` | consuming — `list.forEach(e -> save(e))` |
| `Supplier<T>` | `T get()` | producing — `() -> new Employee()` |

You will use these every time you work with streams and lambdas.

---

## Spring Boot connection

Spring Boot uses interfaces extensively:

```java
// JpaRepository is an interface — Spring generates the implementation
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
}

// UserDetailsService is an interface — you implement it for authentication
public class AuthService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) { ... }
}
```

When you write `implements JpaRepository` or `implements UserDetailsService`, you are following the interface contract that Spring Boot expects.
