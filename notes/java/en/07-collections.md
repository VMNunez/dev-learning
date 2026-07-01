# Collections

> 📖 [Baeldung — Java Collections](https://www.baeldung.com/java-collections)
> 📖 [Oracle Docs — Collections framework](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

Before collections existed, you had to manage your own arrays — fixed size, no built-in search, no add/remove. The Collections Framework is a set of interfaces and classes that ships with every JDK installation (in the `java.util` package) — nothing to download, it is already there. It gives you ready-made data structures for the things you do constantly in any application: ordered lists of items, key-value lookups, and sets of unique values. The three you will reach for in almost every Spring Boot service are `List`, `Map`, and `Set`.

---

## List — ordered, allows duplicates

A `List` is the go-to choice whenever you need an ordered, growable sequence — like the rows returned from a database query. Unlike an array, it resizes automatically as you add or remove elements. The methods you will use most are: `add(value)` to append to the end, `get(index)` to read by position, `remove(value)` or `remove(index)` to delete, `contains(value)` to check whether an element exists, `size()` to count elements, and `isEmpty()` to check whether the list has anything in it.

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();

// Adding — add() always appends to the end
names.add("Victor");   // → ["Victor"]
names.add("Ana");      // → ["Victor", "Ana"]
names.add("Luis");     // → ["Victor", "Ana", "Luis"]

// Reading
names.get(0);          // "Victor" — indices start at 0
names.size();          // 3 — number of elements
names.isEmpty();       // false — there is at least one element
names.contains("Ana"); // true — "Ana" is in the list

// Removing
names.remove("Ana");   // removes the first occurrence of the value "Ana"
names.remove(0);       // removes the element at position 0

// Iterating — go through all elements in order
for (String name : names) {
    System.out.println(name);
}
```

### List.of() — immutable list vs ArrayList — mutable list

There are two ways to create a list with initial values and it matters which one you reach for.

`List.of()` creates an **immutable** list — you cannot add or remove elements after it is created. If you try, Java throws `UnsupportedOperationException` at runtime:

```java
List<String> fixed = List.of("Victor", "Ana", "Luis");
fixed.add("Pedro");    // ❌ UnsupportedOperationException — this list cannot be modified
fixed.remove("Ana");   // ❌ same — immutable means it never changes
```

If you want a list you can modify but that already has starting values, wrap `List.of()` inside `new ArrayList<>()`. This creates a mutable copy with the same elements:

```java
List<String> mutable = new ArrayList<>(List.of("Victor", "Ana"));
mutable.add("Luis");    // ✅ works — this one is modifiable
mutable.remove("Ana");  // ✅ works
```

Use `List.of()` when the data will not change (for example, a fixed list of values in a test). Use `new ArrayList<>()` when you need to add or remove elements later. Immutability only blocks *structural modification* operations — `add()`, `remove()`, `set()`, and `clear()`. Read-only methods (`get()`, `contains()`, `size()`, iterating with for-each) work perfectly fine on lists created with `List.of()`.

### List vs Array

| | Array | List |
|---|-------|------|
| Size | Fixed | Dynamic |
| Syntax | `String[]` | `List<String>` |
| Methods | None | add, remove, contains, etc. |
| Used in | Low-level, fixed data | Almost everything else |

Use `List` in almost all cases. Use arrays only when size is fixed and performance is critical.

### ArrayList vs LinkedList

Both implement `List`, but they store data in memory in a completely different way — and that affects performance depending on what you do with them.

`ArrayList` is internally an array that grows automatically. When you create an `ArrayList`, Java allocates a contiguous block of memory positions. Reading an element by index (`get(0)`, `get(5)`) is instant because Java calculates the exact memory position directly. The problem appears when you insert or remove in the middle: it has to shift all subsequent elements one position.

`LinkedList` is internally a chain of nodes. Each node stores the element's value plus two references: one to the previous node and one to the next. To read the element at position 5, Java has to traverse 5 nodes from the start — that is why index access is slow. But inserting or removing in the middle is fast: you only update two references, nothing else moves.

| | ArrayList | LinkedList |
|---|-----------|------------|
| Internal structure | Array | Chain of nodes |
| `get(i)` | Fast — direct index | Slow — must traverse |
| `add` at end | Fast | Fast |
| `add`/`remove` in middle | Slow — shifts elements | Fast — just relinks nodes |
| Memory | Less | More (each node stores two references) |
| When to use | Almost always | Rarely — only if many insertions in the middle |

In practice, use `ArrayList` for everything. `LinkedList` is a theoretical answer in interviews — in real Spring Boot code you will almost never see it.

---

## Map — key-value pairs, keys are unique

A `Map` is the structure you reach for when you need to look something up by a unique identifier instead of scanning a whole list. Think of it like a dictionary: you give a word (the key) and get its definition (the value) instantly, without reading page by page.

This is useful, for example, when you want to **cache** a result — that is, store something you already computed or fetched so you do not have to repeat that work. If you have a list of 1000 employees and need to look up the same employee by ID multiple times, you store the results in a `Map<Integer, Employee>` and retrieve them in constant time, instead of scanning the list each time.

`Map<String, Integer>` reads like this: the first type inside `<>` is the key type (`String` — the employee name) and the second is the value type (`Integer` — the score). You always declare the key type first and the value type second.

You create a `Map` with `new HashMap<>()` — the interface is `Map<K, V>` and the concrete implementation is `HashMap`, the same pattern as `List` and `ArrayList`. The methods you will use most are: `put(key, value)` to add or update an entry (if the key already exists, `put()` replaces the previous value instead of adding a second entry), `get(key)` to retrieve a value, `getOrDefault(key, defaultValue)` to read with a fallback when the key does not exist, `containsKey(key)` to check whether a key is in the map, `containsValue(value)` to check whether a specific value appears in any entry, `remove(key)` to delete an entry, and `size()` to count how many entries there are.

```java
import java.util.HashMap;
import java.util.Map;

// Map<K, V>: K = key type, V = value type
Map<String, Integer> scores = new HashMap<>();

// Adding / updating — put(key, value)
scores.put("Victor", 95);       // adds entry: "Victor" → 95
scores.put("Ana", 88);          // adds entry: "Ana" → 88
scores.put("Victor", 97);       // "Victor" already exists → replaces 95 with 97

// Reading
scores.get("Victor");           // 97 — returns the value for key "Victor"
scores.getOrDefault("Luis", 0); // 0 — "Luis" does not exist, returns the default
scores.containsKey("Ana");      // true — does this key exist in the map?
scores.containsValue(88);       // true — does this value exist in any entry?
scores.size();                  // 2 — number of entries (remember: "Victor" replaced, not added)

// Removing
scores.remove("Ana");           // removes the entry with key "Ana"
```

To iterate over all entries you need `Map.Entry<K, V>`, which is the type Java uses to represent one key-value pair. `scores.entrySet()` returns a `Set<Map.Entry<String, Integer>>` — in other words, a set of key-value pairs, where each element is a complete pair (key and value together). That is why the for-each declares `Map.Entry<String, Integer> entry`: it is the type of each element the loop pulls out of that set (`scores.entrySet()`).

Inside the loop, `entry` already holds both the key and the value in the same object, so you do not need to go back to the map to look anything up. `entry.getKey()` gives you the key of that pair, and `entry.getValue()` gives you its value directly. `scores.get("Victor")` works when you already have the key and want the value — but when iterating with `entrySet()` you have both at once, and `getKey()` / `getValue()` are the methods that extract them from the pair object:

```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
    // prints: Victor: 97
}
```

If you only need the keys, `scores.keySet()` returns a `Set<String>` — useful when you want to loop over just the names without needing their scores. If you only need the values, `scores.values()` returns a `Collection<Integer>`. `Collection` is the root interface that `List`, `Set`, and other framework structures extend — `values()` uses it because the map does not guarantee any specific order for values, so it cannot commit to returning a `List`. In practice it makes no difference: you can loop over it with a for-each just like any other collection. This is useful when you want to operate on all values — summing them, finding the max — without caring which key each one belongs to:

```java
// keySet() — loop over keys only
for (String name : scores.keySet()) {
    System.out.println("Employee: " + name);  // prints: Victor, Ana
}

// values() — operate on all values
int total = 0;
for (int score : scores.values()) {
    total += score;
}
System.out.println("Total: " + total);  // 185
```

### HashMap vs LinkedHashMap vs TreeMap

There are three `Map` implementations you will see in interviews and in real code. All three store key-value pairs, but they differ in the **order** in which they store and iterate their entries.

`HashMap` is the default implementation. Internally it uses a **hash table** — a technique that converts the key into a number to calculate where in an internal array to store the entry. The result is very fast insertion and lookup (constant time), but with no guaranteed order: if you iterate over a `HashMap`, elements can come out in any order.

`LinkedHashMap` works the same as `HashMap` internally (same speed), but also maintains a linked list that remembers insertion order. When you iterate, elements come out in the same order you added them.

`TreeMap` sorts keys automatically — alphabetically for `String`, numerically for numbers. Internally it uses a balanced binary search tree, which makes insertion and lookup slightly slower than `HashMap`.

| | HashMap | LinkedHashMap | TreeMap |
|---|---------|---------------|---------|
| Order | No order | Insertion order | Sorted by key |
| Speed | Fastest | Slightly slower | Slower (sorting) |
| When to use | Most cases | Need insertion order | Need sorted keys |

---

## Set — unique values, no duplicates

Use a `Set` when duplicates would be a bug — for example, a list of roles a user has, or a set of tags on an article. A `Set` is not a `List` without duplicates — it is a different structure. The key difference: `Set` has no index access, there is no `get(0)` or `get(2)`. It is designed for one question: does this value exist? When you try to add a value that is already in the set, Java simply ignores it without throwing any exception. Nothing breaks, nothing is reported — that is what "silently" means. That is exactly what you want: duplicates disappear on their own without you having to check before every `add()`.

The methods you will use are: `add(value)` to add (ignored if already present), `remove(value)` to delete, `contains(value)` to check whether a value exists — this is the most-used operation, `size()` to count elements, and `isEmpty()` to check whether the set is empty.

The default implementation is `HashSet`, which works internally the same way as `HashMap` — it converts each value into a number (hash) to know where to store it, which makes `contains()` instant even with thousands of elements. The trade-off is that iterating has no guaranteed order.

If you need insertion order, use `LinkedHashSet`. If you need values sorted alphabetically or numerically, use `TreeSet`. In practice, `HashSet` covers 95% of cases.

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

## Common methods — List, Map, and Set

All three structures share a set of basic operations because they all implement the `Collection` interface. `Map` uses slightly different names for some because it needs to distinguish between keys and values, but the idea is the same:

| Operation | List | Set | Map |
|-----------|------|-----|-----|
| Add | `add(value)` | `add(value)` | `put(key, value)` |
| Remove | `remove(value)` | `remove(value)` | `remove(key)` |
| Check if exists | `contains(value)` | `contains(value)` | `containsKey(key)` |
| Number of elements | `size()` | `size()` | `size()` |
| Empty check | `isEmpty()` | `isEmpty()` | `isEmpty()` |
| Clear all | `clear()` | `clear()` | `clear()` |

---

## Collections utility methods

`Collections` (with an s) is a utility class in the JDK — distinct from the `Collection` interface (without an s). You never instantiate it; you just call its static methods. The most common ones are:

- `Collections.sort(list)` — sorts the list from smallest to largest. **List only** — `Set` and `Map` have no positional order.
- `Collections.reverse(list)` — reverses the order of elements. **List only**.
- `Collections.shuffle(list)` — randomises the order. **List only**.
- `Collections.max(collection)` — returns the largest element. Works with `List` and `Set`.
- `Collections.min(collection)` — returns the smallest element. Works with `List` and `Set`.
- `Collections.frequency(collection, value)` — counts how many times a value appears. Works with `List` and `Set`.

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

When you sort a list of `String` or `Integer`, Java already knows how to compare them — "Ana" comes before "Luis", 3 comes before 7. But if you have a `List<Employee>` and call `sort()`, Java does not know which field to compare. By name? By age? By department? That is what `Comparable` and `Comparator` are for: two different mechanisms for teaching Java how to sort your own classes.

> There are two equivalent ways to sort a list: `Collections.sort(employees)` and `employees.sort(...)`. Both do the same thing — the second is more modern (added in Java 8) and is what you will see most in Spring Boot code today. You can use either.

### Comparable — the class knows how to sort itself

You use `Comparable` when there is one obvious default order for your class — one that anyone would expect. For example, employees sorted by name. You implement it inside the class itself and you can only define one.

To implement it, your class adds `implements Comparable<Employee>` and defines the `compareTo()` method. Java calls this method internally when sorting the list — you never call it directly. The method compares `this` (the current object) with `other` (the object it is being compared against) and returns: a negative number if `this` should come first, zero if they are equal, and a positive number if `this` should come after.

In practice you almost never calculate that number by hand — you delegate to `String`'s own `compareTo()`, which already knows alphabetical order.

`compareTo()` does not sort any list — it defines how two `Employee` objects compare to each other. The list is external: when you call `employees.sort()`, Java takes the list and internally calls `compareTo()` on each pair of employees to decide who comes first. The comparison rule lives in the class; the list just uses it. Think of it this way: the list asks "who goes first?" and the `Employee` answers "ask me — I'll tell you."

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// 1. The class defines how two Employee objects compare to each other
public class Employee implements Comparable<Employee> {
    private String name;
    private int age;

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge()     { return age; }

    @Override
    public int compareTo(Employee other) {
        return this.name.compareTo(other.name);  // delegates to String's compareTo
    }
}

// 2. The list uses that rule when sorting — you pass nothing extra
// In Spring Boot this block would live inside a service method:
// the employees would come from repository.findAll(), not added by hand
List<Employee> employees = new ArrayList<>();
employees.add(new Employee("Luis", 30));
employees.add(new Employee("Ana", 25));
employees.add(new Employee("Victor", 28));

Collections.sort(employees);   // calls compareTo() internally — result: Ana, Luis, Victor
employees.sort(null);          // equivalent: null = "use the natural Comparable order"
```

The empty `<>` in `new ArrayList<>()` is called the **diamond operator** and is shorthand: Java can infer the generic type from the variable declaration (`List<Employee>`), so there is no need to repeat it. `new ArrayList<>()` and `new ArrayList<Employee>()` are exactly the same — the longer form existed before Java 7; since then the empty diamond is used to avoid repeating the type.

The reading of the code is correct: `List<Employee> employees` creates an empty list that can only hold objects of the `Employee` class (the one defined just above). Each `employees.add(new Employee("Luis", 30))` creates an `Employee` object and adds it to that list. That is the list `Collections.sort()` then sorts by calling `compareTo()` on each pair of employees.

`employees.sort(null)` may look odd, but `null` here means: "I am not passing an external rule — use the one the class already has." It is equivalent to `Collections.sort(employees)`. `employees.sort()` with no arguments does not exist — `sort()` requires exactly one argument: either a `Comparator` with the rule, or `null` to mean "use the natural `Comparable` order." There is no way to call it with zero arguments.

### Comparator — a sort rule defined outside the class

The problem with `Comparable` is that you can only define one sort order per class. If you want to sort employees by name on one screen and by age on another, `Comparable` is not enough — you only get one. `Comparator` solves this: you define the rule outside the class and pass it directly to `sort()`. You can create as many different `Comparator` instances as you want for the same class.

`Comparator` has three factory methods you will always use:

- **`Comparator.comparing(function)`** — sorts by the field the function returns. Use it for `String` or objects.
- **`Comparator.comparingInt(function)`** — same but optimised for `int` fields (avoids boxing the primitive `int` to an `Integer` object). Use it for age, price, quantity.
- **`.reversed()`** — chains onto the previous comparator to flip the order (largest to smallest instead of smallest to largest).
- **`.thenComparing(function)`** — tie-breaker: when two elements are equal under the first criterion, applies a second one. For `int` fields, `.thenComparingInt(function)` also exists — the optimised variant for primitives, same as `comparingInt`.

The `Employee::getName` syntax is called a **method reference** — a shorter way to write `e -> e.getName()`. It is covered in `09-streams-lambdas.md`. For now read it as "the `getName` method of `Employee`."

In Spring Boot, this code would live inside a service method — the list would come from `repository.findAll()` and you would sort it before returning it:

```java
// In a Spring Boot service
public List<Employee> getEmployeesSortedByName() {
    List<Employee> employees = repository.findAll(); // comes from the database

    // Option 1 — sort by name alphabetically (A → Z)
    employees.sort(Comparator.comparing(Employee::getName));
    // result: Ana, Luis, Victor

    return employees;
}

public List<Employee> getEmployeesSortedByAgeDesc() {
    List<Employee> employees = repository.findAll();

    // Option 2 — sort by age from highest to lowest
    employees.sort(Comparator.comparingInt(Employee::getAge).reversed());
    // result: Luis (30), Victor (28), Ana (25)

    return employees;
}

// Outside a service — sort by name and use age as a tie-breaker if names are equal
employees.sort(Comparator.comparing(Employee::getName)
                         .thenComparingInt(Employee::getAge));
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

This is a classic Java trap that catches everyone the first time. It seems completely logical to loop over a list and remove the elements you do not want — but Java does not allow it and throws `ConcurrentModificationException`.

The reason: the for-each loop uses an iterator internally. That iterator stores a version counter of the list at the moment it starts iterating. Every time you call `remove()` directly on the list, that counter changes. On the next iteration, the iterator compares its counter with the list's counter, sees they differ, and throws — because it cannot know whether the indices are still valid.

```java
// This throws ConcurrentModificationException
for (Employee e : employees) {
    if (!e.isActive()) {
        employees.remove(e);  // structural change while iterating — not allowed
    }
}
```

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

> **Preview — Spring Boot:** This section uses `JpaRepository` methods and service patterns you haven't studied yet. Read it to see how collections appear throughout a real application — you'll implement this in the Spring Boot notes.

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
