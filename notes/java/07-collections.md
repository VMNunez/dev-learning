# Collections

> 📖 [Oracle Docs — Collections framework](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

The Collections Framework provides ready-made data structures. The three you use most are `List`, `Map`, and `Set`.

---

## List — ordered, allows duplicates

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();

// Adding
names.add("Victor");
names.add("Ana");
names.add("Luis");

// Reading
names.get(0);          // "Victor" — index access
names.size();          // 3
names.isEmpty();       // false
names.contains("Ana"); // true

// Removing
names.remove("Ana");        // remove by value
names.remove(0);            // remove by index

// Iterating
for (String name : names) {
    System.out.println(name);
}

// Creating with values (immutable — cannot add/remove)
List<String> fixed = List.of("Victor", "Ana", "Luis");

// Creating mutable from List.of
List<String> mutable = new ArrayList<>(List.of("Victor", "Ana"));
```

### List vs Array

| | Array | List |
|---|-------|------|
| Size | Fixed | Dynamic |
| Syntax | `String[]` | `List<String>` |
| Methods | None | add, remove, contains, etc. |
| Used in | Low-level, fixed data | Almost everything else |

Use `List` in almost all cases. Use arrays only when size is fixed and performance is critical.

### ArrayList vs LinkedList

Both implement `List`, but they store data differently:

| | ArrayList | LinkedList |
|---|-----------|------------|
| Internal structure | Array | Chain of nodes |
| `get(i)` | Fast — direct index | Slow — must traverse |
| `add` at end | Fast | Fast |
| `add`/`remove` in middle | Slow — shifts elements | Fast — just relinks nodes |
| Memory | Less | More (each node stores two pointers) |
| When to use | Almost always | Rarely — only if many insertions in the middle |

In practice, use `ArrayList` for everything. `LinkedList` is a theoretical answer in interviews — in real Spring Boot code you will almost never see it.

---

## Map — key-value pairs, keys are unique

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();

// Adding / updating
scores.put("Victor", 95);
scores.put("Ana", 88);
scores.put("Victor", 97);   // replaces the previous value for "Victor"

// Reading
scores.get("Victor");                    // 97
scores.getOrDefault("Luis", 0);          // 0 — key does not exist, returns default
scores.containsKey("Ana");              // true
scores.containsValue(88);              // true
scores.size();                          // 2

// Removing
scores.remove("Ana");

// Iterating
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Just keys or just values
scores.keySet();    // Set of keys
scores.values();    // Collection of values
```

### HashMap vs LinkedHashMap vs TreeMap

| | HashMap | LinkedHashMap | TreeMap |
|---|---------|---------------|---------|
| Order | No order | Insertion order | Sorted by key |
| Speed | Fastest | Slightly slower | Slower (sorting) |
| When to use | Most cases | Need insertion order | Need sorted keys |

---

## Set — unique values, no duplicates

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();

tags.add("java");
tags.add("spring");
tags.add("java");   // duplicate — silently ignored

tags.size();           // 2
tags.contains("java"); // true
tags.remove("spring");

// Iterating
for (String tag : tags) {
    System.out.println(tag);
}

// Most common use — remove duplicates from a List
List<String> withDuplicates = List.of("a", "b", "a", "c", "b");
Set<String> unique = new HashSet<>(withDuplicates);
List<String> deduplicated = new ArrayList<>(unique);
```

---

## Collections utility methods

```java
import java.util.Collections;

List<Integer> numbers = new ArrayList<>(List.of(3, 1, 4, 1, 5));

Collections.sort(numbers);           // [1, 1, 3, 4, 5]
Collections.reverse(numbers);        // [5, 4, 3, 1, 1]
Collections.shuffle(numbers);        // random order
Collections.max(numbers);            // 5
Collections.min(numbers);            // 1
Collections.frequency(numbers, 1);   // 2
```

---

## Sorting — Comparable and Comparator

### Comparable — natural order defined by the class

The class itself implements `Comparable<T>` to define its default sort order:

```java
public class Employee implements Comparable<Employee> {
    private String name;

    @Override
    public int compareTo(Employee other) {
        return this.name.compareTo(other.name);  // sort alphabetically by name
    }
}

// Now you can sort a List<Employee> without passing anything
Collections.sort(employees);
employees.sort(null);  // uses the natural order
```

Use `Comparable` when there is one obvious default sort for the class (e.g. employees by name, products by price).

### Comparator — external, flexible sorting

`Comparator` is defined outside the class — you pass it to `sort()`. Useful when you need multiple sort options or cannot modify the class:

```java
// Sort by name alphabetically
employees.sort(Comparator.comparing(Employee::getName));

// Sort by age descending
employees.sort(Comparator.comparingInt(Employee::getAge).reversed());

// Sort by multiple fields
employees.sort(Comparator.comparing(Employee::getDepartment)
                         .thenComparing(Employee::getName));
```

### Comparable vs Comparator

| | Comparable | Comparator |
|---|------------|------------|
| Where defined | Inside the class | Outside the class |
| Method | `compareTo()` | `compare()` |
| Sort options | One (the natural order) | Many |
| When to use | Default sort, you own the class | Multiple sorts, or class is not yours |

---

## ConcurrentModificationException

This exception happens when you remove elements from a List **inside a for-each loop**:

```java
// This throws ConcurrentModificationException
for (Employee e : employees) {
    if (!e.isActive()) {
        employees.remove(e);  // structural change while iterating — not allowed
    }
}
```

The for-each loop uses an iterator internally. The iterator tracks the list size. When `remove()` changes that size, the iterator detects a structural change and throws.

### How to fix it

```java
// Option 1 — removeIf (cleanest)
employees.removeIf(e -> !e.isActive());

// Option 2 — collect first, then remove
List<Employee> toRemove = employees.stream()
    .filter(e -> !e.isActive())
    .collect(Collectors.toList());
employees.removeAll(toRemove);

// Option 3 — use an explicit Iterator
Iterator<Employee> it = employees.iterator();
while (it.hasNext()) {
    if (!it.next().isActive()) {
        it.remove();  // safe — the iterator itself does the removal
    }
}
```

Use `removeIf()` — it is the shortest and most readable.

---

## Quick reference — which to use

| Situation | Use |
|-----------|-----|
| Ordered list of items | `List<T>` (ArrayList) |
| Key-value lookup | `Map<K, V>` (HashMap) |
| Unique values only | `Set<T>` (HashSet) |
| Need insertion order in Map | `LinkedHashMap` |
| Need sorted keys in Map | `TreeMap` |
| Need sorted Set | `TreeSet` |

---

## Spring Boot connection

Collections are everywhere in Spring Boot:

```java
// Repository returns a List
List<Employee> findAll();
List<Employee> findByDepartment(String department);

// Service processes a List
public List<EmployeeDTO> getAllEmployees() {
    return repository.findAll()
        .stream()
        .map(e -> new EmployeeDTO(e.getName(), e.getEmail()))
        .collect(Collectors.toList());
}
```
