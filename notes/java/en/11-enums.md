# Enums

> 📖 [Baeldung — A Guide to Java Enums](https://www.baeldung.com/a-guide-to-java-enums)
> 📖 [Oracle Docs — Enum types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)

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

---

## Enum with fields and methods

Java enums can have fields, constructors, and methods. This is more powerful than TypeScript enums:

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

---

## Built-in enum methods

Every enum in Java automatically inherits a set of useful methods. You do not need to write these — they come for free. The most important ones are `name()` (returns the constant name as a string), `values()` (returns all constants as an array), and `valueOf()` (converts a string back to the enum constant).

```java
Role role = Role.ADMIN;

role.name()      // "ADMIN" — the constant name as a String
role.ordinal()   // 0 — position in the declaration (0-based)

Role.valueOf("ADMIN")   // Role.ADMIN — String → enum constant (throws if not found)
Role.values()           // Role[] — all constants: [ADMIN, EMPLOYEE, MANAGER]
```

### Iterating all values

```java
for (Role r : Role.values()) {
    System.out.println(r.name());
}
```

Useful for populating a dropdown or select list — same pattern you used in Angular with `Object.values()`.

---

## Enum in switch expression

Enums are the ideal companion to switch expressions. The compiler knows all possible values of the enum, so it can warn you if you forget a case — something it cannot do with a plain `String` switch.

```java
String message = switch (status) {
    case PENDING  -> "Waiting for approval";
    case ACTIVE   -> "Currently active";
    case INACTIVE -> "Disabled";
};
```

The compiler warns you if you forget a case — one of the main benefits of enums over strings.

---

## Comparing enums

Use `==` — enums are singletons (only one instance per constant):

```java
if (role == Role.ADMIN) { ... }      // correct
if (role.equals(Role.ADMIN)) { ... } // also works but unnecessary
```

---

## Spring Boot connection

> **Preview — Spring Boot:** This section uses `@Entity`, `@Enumerated`, and Spring Security concepts you haven't studied yet. Read it to see where enums appear in a real application — you'll implement this in the Spring Boot notes.

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

`EnumType.STRING` stores the name as text. `EnumType.ORDINAL` stores the position number — avoid it, because adding a new constant changes the numbers of all existing ones.

### In a Spring Security guard

```java
// Checking role in a guard
if (user.getRole() == Role.ADMIN) {
    return true;
}
```

### In a filter

```java
// Filtering by status — same pattern as Angular computed() with signals
List<Employee> active = employees.stream()
    .filter(e -> e.getStatus() == Status.ACTIVE)
    .collect(Collectors.toList());
```

---

## Enum vs constant strings vs TypeScript enum

| | Java enum | `public static final String` | TypeScript union type |
|---|-----------|------------------------------|----------------------|
| Type safety | ✅ compile error for wrong value | ❌ any string accepted | ✅ compile error |
| Methods/fields | ✅ yes | ❌ no | ❌ no |
| Iterable | ✅ `values()` | ❌ manual | ❌ manual |
| Database mapping | ✅ `@Enumerated` | manual | — |
| Use | Always in Java | Legacy code | TypeScript simple cases |

In Java, always use enums for fixed sets of values. `public static final String ROLE_ADMIN = "ADMIN"` is the old pattern you may see in legacy code — avoid it in new code.
