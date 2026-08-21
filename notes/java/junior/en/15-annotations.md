# Annotations

> 📖 [Baeldung — Java Annotations](https://www.baeldung.com/java-annotations)
> 📖 [Oracle Docs — Annotations](https://docs.oracle.com/javase/tutorial/java/annotations/index.html)

With enums, dates, and times you can now model the data of your domain. The next thing to understand is not a data type at all — it is the metadata mechanism that drives every Spring class you are about to write. You already met it in passing: the `@Entity`, `@Column`, and `@PrePersist` labels in the dates note made a plain Java class behave in special ways. This file explains how that works.

Before Spring Boot, you configured the framework in XML files — hundreds of lines just to register services and wire up dependencies. Annotations replaced all of that. Instead of a separate configuration file, you put a label directly on the class or method and the framework reads it. That is what an annotation is: metadata attached to code that a compiler or a framework reads and acts on. Annotations do not execute on their own — they are signals that something else processes.

---

## What annotations do

An annotation is inert on its own; something has to read it. There are three possible readers, and *which* one reads a given annotation decides when it takes effect:

| Consumer | When it reads | Examples |
|----------|--------------|---------|
| Compiler | Compile time | `@Override`, `@SuppressWarnings` |
| Build tools | Build time | `@Generated` |
| Framework / JVM | Runtime | `@Service`, `@Autowired`, `@Transactional` |

Read each row as: *this reader* looks at the annotation *at this moment* — so `@Override` is checked while you compile and is gone by the time the program runs, while `@Service` does nothing at compile time and only matters once the app is running.

Spring Boot is a runtime reader: it reads its annotations while the application starts, using **reflection** — it scans the classpath, finds classes carrying `@Component` / `@Service` / `@Repository`, and registers them as beans automatically.

> **What is reflection?** Reflection is the JVM's ability to inspect its own code *at runtime* — to ask a loaded class "what is your name? what methods do you have? which annotations are on you?" and then act on the answer. Normally your code calls methods it was written to know about; with reflection, a framework can look at a class it has never seen before, discover a `@Service` label on it, and decide to manage it — all while the program is running. This is exactly how Spring reads your annotations: it does not "run" them, it *looks* at them and reacts. Hold on to this word — it is the load-bearing mechanism for the whole Spring side of this file.

The flow, end to end, is always the same:

```
@Service on a class     ← you write the annotation in source
        │
        ▼
@Retention(RUNTIME)     ← retention policy keeps it alive into the running program
        │
        ▼
reflection reads it     ← at startup, the framework inspects the class and sees the label
        │
        ▼
framework acts          ← Spring registers the class as a bean, injects its dependencies
```

---

## Built-in Java annotations

Before you meet the Spring annotations, it helps to see the handful that ship with the language itself. These are read by the **compiler**, not a framework, so they take effect while you build — they catch mistakes or silence warnings rather than wire up behaviour at runtime.

```java
// @Override — compiler checks you are really overriding a parent method
// if you make a typo, it is a compile error instead of a silent bug
@Override
public String toString() {
    return "Employee{name=" + name + "}";
}

// @Deprecated — marks something as outdated; compiler shows a warning when it is used
@Deprecated
public void oldMethod() { ... }

// @SuppressWarnings — tells the compiler to stop showing a specific warning
@SuppressWarnings("unchecked")
public List getData() { ... }

// @FunctionalInterface — compiler verifies there is exactly one abstract method
@FunctionalInterface
public interface Validator {
    boolean validate(String value);
}
```

---

## Meta-annotations — annotations for annotations

Most days you *use* annotations someone else defined. Occasionally you define your own — and that is where meta-annotations come in: annotations you place on *your annotation's definition* to control its behaviour. Here is a complete custom annotation:

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)         // where the annotation can be used
@Retention(RetentionPolicy.RUNTIME) // when the annotation is available
public @interface Log {
    String message() default "called";
}
```

> **`@interface` declares a brand-new annotation type.** It is not a typo for `interface`. The `@` in front tells the compiler "I am defining a new annotation, not an ordinary interface." After this, `@Log` becomes a real annotation you can place on any method — you invented it.

> **An annotation's "methods" are really its attributes.** Inside `@interface Log`, the line `String message() default "called";` looks like a method but declares an *element* — a piece of data the annotation can carry. `String` is its type, `message` its name, and `default "called"` makes it optional: write `@Log` and `message` is `"called"`; write `@Log(message = "saving employee")` and you override it. Elements are how annotations like `@Column(name = "first_name", nullable = false)` carry their configuration — each of those is an element declared exactly this way.

### `@Retention` — how long the annotation lives

| Value | Meaning | Common use |
|-------|---------|-----------|
| `SOURCE` | Stripped before compilation | Developer tools only |
| `CLASS` | Kept in bytecode, not at runtime | Default |
| `RUNTIME` | Available at runtime via reflection | **Spring Boot needs this** |

Read each row as: this policy keeps the annotation alive *up to this point* and then it is gone — `SOURCE` dies before compilation, `CLASS` survives into the `.class` file but not into the running program, `RUNTIME` survives all the way into the live application.

> **This is why `@Retention(RUNTIME)` is mandatory for Spring.** Recall that Spring reads its annotations with reflection *while the app is running*. Reflection can only see what is still present at runtime — and only `RUNTIME` retention keeps an annotation there. If `@Service` were `CLASS`-retained, it would be stripped out before your program starts, reflection would find nothing, and Spring would never register the bean. The retention policy and the reflection read are two halves of the same mechanism: retention puts the label where reflection can reach it.

### `@Target` — where the annotation can be placed

| Value | Where |
|-------|-------|
| `TYPE` | Class, interface, enum |
| `METHOD` | Method |
| `FIELD` | Field |
| `PARAMETER` | Method parameter |
| `CONSTRUCTOR` | Constructor |

Read each row as: naming this value in `@Target` allows the annotation on that kind of code element — list several to allow several, and using the annotation anywhere else becomes a compile error.

---

## The repeating pattern: annotations replace configuration

Before Spring Boot, you configured beans in XML files. Annotations replaced that:

```xml
<!-- Old Spring XML configuration -->
<bean id="employeeService" class="com.example.EmployeeService">
    <property name="repository" ref="employeeRepository"/>
</bean>
```

```java
// Modern Spring Boot — annotation does the same thing
@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }
}
```

The annotation tells Spring to manage this class as a bean. The constructor tells Spring what to inject. No XML needed.

---

## Spring Boot annotations you will use every day

> **Preview — Spring Boot:** Everything from this section onwards is Spring Boot territory. You haven't studied Spring Boot yet — read this as a map of what's coming. Each annotation below has its own dedicated section in the Spring Boot notes where you'll implement it in real code.

### Bean annotations — register a class as a Spring-managed object

When Spring starts your application it scans all your packages, and for each class it uses reflection to inspect the labels on it. Because these annotations are `@Retention(RUNTIME)`, the label is still present in the running program for reflection to find — that is the mechanism from the previous section in action, not a new one. When it sees `@Component` (or one of its variants), Spring creates one instance of the class (a bean) and manages it from then on — wiring in dependencies, handling transactions, and so on. The four stereotypes below are all variations of `@Component`; they differ only in which layer they mark, which helps both Spring and you read the role of each class at a glance.

```java
@Component   // generic Spring bean
@Service     // marks the service layer (same as @Component, better intent)
@Repository  // marks the data layer (same as @Component + wraps JPA exceptions)
@Controller  // marks a web controller (returns views)
@RestController // @Controller + @ResponseBody — for REST APIs (returns JSON)
```

### Dependency injection

```java
// Field injection — works but avoid it in new code
@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository repository;
}

// Constructor injection — preferred
@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    // Spring detects the single constructor and injects automatically
    // No @Autowired needed since Spring Framework 4.3+ (bundled in every current Spring Boot)
    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }
}
```

**Why constructor injection is preferred:**
- `final` works — the field cannot be accidentally re-assigned
- Easy to test — pass a mock in the constructor without Spring
- Makes dependencies visible — you see what the class needs just by reading the constructor

> **Field injection hides a testing trap.** With `@Autowired` on a private field there is no way to set that field from a plain test — it has no setter and no constructor parameter, so outside Spring you cannot pass in a mock repository, and the field stays `null`. Constructor injection removes the trap: the dependency is just a constructor argument, so a test hands over a mock in one line with no Spring context at all. This is why teams standardise on constructor injection and treat field injection as legacy.

### REST controller annotations

```java
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) { ... }

    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody EmployeeDTO dto) { ... }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Long id, @RequestBody EmployeeDTO dto) { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
}
```

| Annotation | Purpose |
|-----------|---------|
| `@RestController` | Mark this class as a REST controller — returns JSON |
| `@RequestMapping` | Base URL for all methods in this class |
| `@GetMapping` | Handle HTTP GET |
| `@PostMapping` | Handle HTTP POST |
| `@PutMapping` | Handle HTTP PUT |
| `@DeleteMapping` | Handle HTTP DELETE |
| `@PathVariable` | Extract a value from the URL path (`/employees/{id}`) |
| `@RequestBody` | Read the request body as a Java object (JSON → object) |
| `@RequestParam` | Read a query parameter from the URL (`?status=ACTIVE`) |

Read each row as: put this annotation *there* and Spring wires *that* part of the HTTP request to your method — the mapping ones (`@GetMapping` and friends) route a URL and verb to the method, the parameter ones (`@PathVariable`, `@RequestBody`, `@RequestParam`) pull a piece of the incoming request into an argument.

### Entity annotations (JPA)

JPA is the standard that maps a Java class to a database table, and it does the mapping entirely through annotations — each label tells JPA how one part of the class corresponds to the table. You will meet these in full in the Spring Boot notes; for now, read them as the JPA counterpart to the REST annotations above.

```java
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
```

| Annotation | Purpose |
|-----------|---------|
| `@Entity` | Mark this class as a table-mapped entity JPA will manage |
| `@Table` | Set the table name (defaults to the class name if omitted) |
| `@Id` | Mark the field that maps to the primary key |
| `@GeneratedValue` | Let the database generate the id (`IDENTITY` = auto-increment column) |
| `@Column` | Configure the mapped column — name, `nullable`, `length`, `updatable` |
| `@Enumerated(EnumType.STRING)` | Store an enum as its text name instead of its ordinal number |
| `@PrePersist` | Run this method automatically just before the row is first inserted |

Read each row as: this annotation maps *this part of the class* to *that part of the table* — `@Entity`/`@Table` map the class itself, `@Id`/`@GeneratedValue`/`@Column`/`@Enumerated` map individual fields to columns, and `@PrePersist` hooks a method into the save lifecycle.

### Transaction management

A **transaction** is a group of database operations that must all succeed together or all be undone together — never half-applied. The classic case is a method that changes two rows: if the first `save()` works and the second throws, you must not leave the database in a half-changed state. `@Transactional` gives you that guarantee: Spring opens a transaction when the method starts, commits it if the method returns normally, and **rolls back** every change (as if none of them happened) if the method throws. You put it on the service method, and Spring wraps the whole method body for you.

> **How does one annotation wrap a whole method?** Spring does not modify your code — at startup it builds a **proxy**: a generated wrapper object that stands in front of your bean. Callers actually hold the proxy, not your class. When a call comes in, the proxy opens the transaction, then delegates to your real method, then commits or rolls back based on whether it threw. This is the same reflection-plus-runtime machinery from the top of the file: because `@Transactional` is `RUNTIME`-retained, Spring can see it at startup and decide to build the proxy. You'll study proxies in full in the Spring Boot notes.

```java
@Service
public class EmployeeService {

    // Wraps the method in a database transaction
    // If the method throws, Spring rolls back all changes
    @Transactional
    public void transferDepartment(Long employeeId, Long newDeptId) {
        Employee emp = repository.findById(employeeId).orElseThrow(...);
        Department dept = deptRepository.findById(newDeptId).orElseThrow(...);
        emp.setDepartment(dept);
        repository.save(emp);
        // if save() throws, the whole method is rolled back
    }
}
```

---

## Quick reference — annotation families

| Family | Annotations |
|--------|------------|
| Bean registration | `@Component`, `@Service`, `@Repository`, `@RestController` |
| Injection | `@Autowired`, `@Qualifier`, `@Value` |
| REST | `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PathVariable`, `@RequestBody` |
| JPA | `@Entity`, `@Table`, `@Id`, `@Column`, `@GeneratedValue`, `@Enumerated` |
| Lifecycle | `@PrePersist`, `@PostLoad` |
| Transactions | `@Transactional` |
| Validation | `@NotNull`, `@NotBlank`, `@Min`, `@Max`, `@Email` |
| Exception handling | `@ControllerAdvice`, `@ExceptionHandler` |
| Config | `@Configuration`, `@Bean`, `@Value` |

Read each row as: a *job* on the left, and the annotations you reach for to do that job on the right — use it as a lookup when you know *what* you want to achieve but not *which* annotation does it.

---

Every one of these Spring and JPA annotations arrives in your project as a library — `spring-boot-starter-web` brings the REST ones, `spring-boot-starter-data-jpa` brings `@Entity` and friends. Something has to download those libraries and put them on the classpath so the annotations even exist to be read. That is the job of the build tool, and it is the next file: `notes/java/junior/en/16-maven.md`.
