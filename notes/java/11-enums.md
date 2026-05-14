# Enums

An enum is a type with a fixed set of named constants. It prevents magic strings and typos, and makes the code self-documenting.

```java
// Without enum — any string can be passed, typos are silent bugs
public void setRole(String role) { ... }
setRole("ADNIM");  // typo — no compile error

// With enum — only valid values are allowed
public void setRole(Role role) { ... }
setRole(Role.ADMIN);  // compile error if you type Role.ADNIM
```

---

## Basic enum

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
