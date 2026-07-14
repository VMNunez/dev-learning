# Enums

> 📖 [Baeldung — A Guide to Java Enums](https://www.baeldung.com/a-guide-to-java-enums)
> 📖 [Oracle Docs — Enum types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)

Generics (the previous file) let you write type-safe code that works with *any* type you plug in — the type stays open. But nothing so far lets a type restrict *itself* to a small, fixed set of values. That is exactly the gap an enum fills.

Imagine you have a user role that can only be `ADMIN`, `EMPLOYEE`, or `MANAGER`. If you store it as a `String`, any value is accepted — a typo like `"ADNIM"` compiles fine and becomes a silent bug that only shows up at runtime. An enum solves this by making the valid values part of the type itself. Only the declared constants are valid, and a typo is a compile error instead of a runtime bug.

```java
// Without enum — any string can be passed, typos are silent bugs
public void setRole(String role) { ... }
setRole("ADNIM");  // typo — no compile error, the bug hides until runtime

// With enum — only valid values are allowed
public void setRole(Role role) { ... }
setRole(Role.ADMIN);  // compile error if you type Role.ADNIM — caught immediately
```

---

## Basic enum

> Docs: https://www.baeldung.com/a-guide-to-java-enums → read: the opening section on declaring an enum and using it in `switch`.

An enum is declared with `enum` instead of `class`. Each constant is written in UPPER_SNAKE_CASE by convention. You use the constant by prefixing with the enum name: `Role.ADMIN`. You compare enums with `==` (explained in the "Comparing enums" section below).

```java
public enum Role {
    ADMIN,
    EMPLOYEE,
    MANAGER
}

// Usage
Role role = Role.ADMIN;

if (role == Role.ADMIN) {
    System.out.println("Admin access");
}

// Switch with enum
switch (role) {
    case ADMIN    -> System.out.println("Full access");
    case MANAGER  -> System.out.println("Team access");
    case EMPLOYEE -> System.out.println("Read access");
}
```

> **Why the `case` labels are bare `ADMIN`, not `Role.ADMIN`.** Inside a `switch` on an enum, the compiler already knows the type of the value being switched on is `Role`, so it looks up each label in that enum automatically — writing `Role.ADMIN` there is actually a compile error (`an enum switch case label must be the unqualified name of an enumeration constant`). Everywhere *else* — assignments, `if` comparisons — you still need the full `Role.ADMIN`, because nothing tells the compiler which enum you mean.

---

## Enum with fields and methods

> Docs: https://www.baeldung.com/a-guide-to-java-enums → read: the section on enum fields, methods and the constructor.

Java enums can have fields, constructors, and methods — a TypeScript enum cannot; its constants are plain numbers or strings with no behaviour attached, so you cannot ask a TS enum constant "what is your label?" the way you can here:

```java
public enum Status {
    PENDING("Pending review"),
    ACTIVE("Active"),
    INACTIVE("Inactive");

    private final String label;

    // Constructor — runs once for each constant
    Status(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

Status.ACTIVE.getLabel();    // "Active"
Status.PENDING.getLabel();   // "Pending review"
```

To read this you need to know what actually happens when the class loads, because it explains three things that otherwise look like magic: how the constructor gets called when you never wrote `new`, why there is a semicolon after the last constant, and why the constructor is not `public`.

Each constant — `PENDING`, `ACTIVE`, `INACTIVE` — is not a label or an index. It *is* a fully-built `Status` object. When the JVM first loads the `Status` class, it runs the constructor once for each constant, in declaration order, passing the argument in the parentheses. So `PENDING("Pending review")` means "build a `Status` object by calling `Status("Pending review")`". After class load, exactly three `Status` objects exist in memory, forever — one per constant. That is what makes an enum constant a *singleton*: there is only ever one instance of `Status.ACTIVE`, and every reference to it points at that same object.

```
Class load runs the constructor 3 times, building 3 fixed objects:

   Status.PENDING  ─────▶ ┌───────────────────────────┐
                          │ Status object              │
                          │ label = "Pending review"   │
                          └───────────────────────────┘

   Status.ACTIVE   ─────▶ ┌───────────────────────────┐
                          │ Status object              │
                          │ label = "Active"           │
                          └───────────────────────────┘

   Status.INACTIVE ─────▶ ┌───────────────────────────┐
                          │ Status object              │
                          │ label = "Inactive"         │
                          └───────────────────────────┘

   Every `Status.ACTIVE` in your whole program points at the SAME box.
```

> **Why you never write `new Status(...)`.** The enum constructor is *implicitly private* — you cannot make it `public` even if you try, and `new Status("x")` is a compile error. Java calls it for you, once per constant, at class-load time, and never again. This is the mechanism that guarantees the fixed set: no other code can ever manufacture a fourth `Status`.

> **Why the semicolon after the last constant.** In a plain enum (`ADMIN, EMPLOYEE, MANAGER`) you don't need one. The moment you add fields, a constructor, or methods, Java needs to know where the *list of constants* ends and the *member declarations* begin — the `;` after `INACTIVE("Inactive")` is that separator. Forget it and the code won't compile.

---

## Built-in enum methods

> Docs: https://www.baeldung.com/a-guide-to-java-enums → read: the sections covering `values()`, `valueOf()` and `ordinal()`.

Every enum in Java automatically inherits a set of useful methods. You do not need to write these — they come for free. The most important ones are `name()` (returns the constant name as a string), `values()` (returns all constants as an array), and `valueOf()` (converts a string back to the enum constant).

```java
Role role = Role.ADMIN;

role.name()      // "ADMIN" — the constant name as a String
role.ordinal()   // 0 — position in the declaration (0-based)

Role.valueOf("ADMIN")   // Role.ADMIN — String → enum constant
Role.valueOf("ADNIM")   // throws — see below
Role.values()           // Role[] — all constants: [ADMIN, EMPLOYEE, MANAGER]
```

`valueOf()` does an exact, case-sensitive match against the constant names. If the string matches none of them it does not return `null` — it throws:

```
java.lang.IllegalArgumentException: No enum constant Role.ADNIM
```

> **Watch out at the boundaries of your app.** `valueOf()` is where a bad string from *outside* your type system (a query param, a JSON body, a database column) turns into an exception. If you expose an enum in a request DTO, an invalid value like `?role=ADNIM` becomes an `IllegalArgumentException` — worth catching and turning into a clean 400 response rather than a 500.

### Iterating all values

```java
for (Role r : Role.values()) {
    System.out.println(r.name());
}
```

Useful for populating a dropdown or select list — same pattern you used in Angular with `Object.values()`.

---

## Enum in switch expression

> Docs: https://www.baeldung.com/java-switch → read: "Switch Expressions" for the arrow syntax and exhaustiveness.

Enums are the ideal companion to switch expressions. The compiler knows the complete, fixed set of values an enum can take — something it can never know for a plain `String` — and it uses that to enforce *exhaustiveness*.

```java
String message = switch (status) {
    case PENDING  -> "Waiting for approval";
    case ACTIVE   -> "Currently active";
    case INACTIVE -> "Disabled";
};
```

> **A missing case is a compile *error*, not a warning.** This is a switch *expression*: it has to produce a value for `message` no matter which constant `status` holds. If you leave out `case INACTIVE`, there is a value the switch could receive and have no answer for — so the compiler refuses to compile it ("the switch expression does not cover all possible input values") unless you handle every constant or add a `default`. Contrast this with a switch *statement* (one that just runs code and returns nothing), where a missing case is legal and silently does nothing. The practical payoff: add a fourth constant to the enum later, and every exhaustive switch expression that consumed it stops compiling until you handle the new case — the compiler hands you the list of places to update.

---

## Comparing enums

> Docs: https://www.baeldung.com/a-guide-to-java-enums → read: the section comparing enum values with the `==` operator.

Use `==`. This works because of the mechanism from the fields section above: each constant is a single object built once at class load, so there is only ever one instance of `Role.ADMIN` in the whole program. `==` compares object identity ("are these the exact same object?"), and since there is exactly one `Role.ADMIN` object, `role == Role.ADMIN` is true precisely when `role` *is* that object.

```java
if (role == Role.ADMIN) { ... }      // correct
if (role.equals(Role.ADMIN)) { ... } // also works but unnecessary
```

> **`==` is null-safe here; `equals` is not.** If `role` is `null`, `role == Role.ADMIN` simply evaluates to `false` — no crash. But `role.equals(Role.ADMIN)` calls a method *on* `role`, and calling a method on `null` throws a `NullPointerException`. With reference types you normally reach for `.equals()` to avoid comparing identities by accident, but enums are the one case where `==` is both correct *and* safer — another reason it is the idiom.

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses `@Entity`, `@Enumerated`, and Spring Security concepts you haven't studied yet. Read it to see where enums appear in a real application — you'll implement this in the Spring Boot notes.

> Docs: https://www.baeldung.com/jpa-persisting-enums-in-databases → read: "Using @Enumerated" for `EnumType.STRING` vs `EnumType.ORDINAL`.

Enums appear constantly in Spring Boot applications:

### In an entity

```java
@Entity
public class Employee {
    @Enumerated(EnumType.STRING)  // stores "ADMIN" in the database, not 0
    private Role role;

    @Enumerated(EnumType.STRING)
    private Status status;
}
```

`EnumType.STRING` stores the name as text (`"ADMIN"`). `EnumType.ORDINAL` stores the `ordinal()` position number instead (`0`, `1`, `2`).

> **Always use `EnumType.STRING`, never `ORDINAL`.** The ordinal is just the constant's position in the declaration, and positions shift. Insert a new constant in the middle, or reorder them, and every existing row in the database silently points at the wrong constant — `0` used to mean `ADMIN`, now it means whatever you put first. `EnumType.STRING` stores `"ADMIN"` literally, so the mapping survives any reordering. This is the single most common enum bug in production Spring apps, and it corrupts data quietly.

### In a Spring Security guard

```java
// Checking role in a guard
if (user.getRole() == Role.ADMIN) {
    return true;
}
```

### In a filter

```java
// Filtering by status — the enum makes the comparison exact and typo-proof
List<Employee> active = employees.stream()
    .filter(e -> e.getStatus() == Status.ACTIVE)
    .collect(Collectors.toList());
```

---

## Enum vs constant strings vs TypeScript enum

Read this table row by row: each row is a capability, and the three columns show whether Java's `enum`, the old `public static final String` pattern, and a TypeScript union type each give it to you (✅) or not (❌). The bottom row is the verdict, not a capability.

| | Java enum | `public static final String` | TypeScript union type |
|---|-----------|------------------------------|----------------------|
| Type safety | ✅ compile error for wrong value | ❌ any string accepted | ✅ compile error |
| Methods/fields | ✅ yes | ❌ no | ❌ no |
| Iterable | ✅ `values()` | ❌ manual | ❌ manual |
| Database mapping | ✅ `@Enumerated` | manual | — |
| Use | Always in Java | Legacy code | TypeScript simple cases |

In Java, always use enums for fixed sets of values. `public static final String ROLE_ADMIN = "ADMIN"` is the old pattern you may see in legacy code — avoid it in new code.

---

Enums close off a type so it can hold only a handful of values you decide up front. The next file, `12-dates.md`, deals with the opposite kind of value — dates and times, which come from an effectively infinite range and have their own arithmetic (durations, time zones, "three days from now"). Java's older date classes were mutable and error-prone; the modern `java.time` API fixes that, and it is what every project reaches for the moment it needs a timestamp on an entity.
