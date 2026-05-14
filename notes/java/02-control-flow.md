# Control Flow

## if / else

```java
if (age >= 18) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teenager");
} else {
    System.out.println("Child");
}
```

### Ternary operator

```java
String label = age >= 18 ? "Adult" : "Minor";
```

Same as JavaScript — condition ? valueIfTrue : valueIfFalse.

---

## switch

### Classic switch (statement)

```java
switch (day) {
    case "MONDAY":
    case "TUESDAY":
        System.out.println("Weekday");
        break;        // without break, execution falls through to the next case
    case "SATURDAY":
    case "SUNDAY":
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Unknown");
}
```

### Switch expression (Java 14+) — preferred

Returns a value, no `break` needed, no fall-through:

```java
String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};
```

Use the switch expression form — it is cleaner and avoids the fall-through bug.

---

## for loops

### Classic for

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);   // 0 1 2 3 4
}
```

### Enhanced for (for-each) — use this for collections and arrays

```java
String[] names = {"Ana", "Luis", "Maria"};
for (String name : names) {
    System.out.println(name);
}

List<Employee> employees = getEmployees();
for (Employee emp : employees) {
    System.out.println(emp.getName());
}
```

---

## while and do-while

```java
// while — check first, may never run
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while — run at least once, then check
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);
```

---

## break and continue

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) break;       // exits the loop completely
    if (i % 2 == 0) continue; // skips to the next iteration
    System.out.println(i);    // prints 1, 3
}
```

---

## Null checks

A very common pattern in Java — always check for `null` before calling methods on an object:

```java
// Risk of NullPointerException
String name = employee.getName();
System.out.println(name.toUpperCase());  // crashes if name is null

// Safe check
if (name != null) {
    System.out.println(name.toUpperCase());
}

// Or using Optional (covered in 10-generics.md)
Optional.ofNullable(name)
    .ifPresent(n -> System.out.println(n.toUpperCase()));
```

`NullPointerException` is the most common runtime error in Java. The modern approach is `Optional<T>` — but you will see both patterns in real codebases.
