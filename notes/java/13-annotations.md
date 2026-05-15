# Annotations

> 📖 [Oracle Docs — Annotations](https://docs.oracle.com/javase/tutorial/java/annotations/index.html)

An annotation is metadata added to code — a label that gives extra information to the compiler or to a framework. Annotations do not execute on their own. They are signals that something else reads and acts on.

---

## What annotations do

There are three consumers of annotations:

| Consumer | When it reads | Examples |
|----------|--------------|---------|
| Compiler | Compile time | `@Override`, `@SuppressWarnings` |
| Build tools | Build time | `@Generated` |
| Framework / JVM | Runtime | `@Service`, `@Autowired`, `@Transactional` |

Spring Boot reads its annotations at runtime using **reflection** — it scans the classpath, finds classes with `@Component` / `@Service` / `@Repository`, and registers them as beans automatically.

---

## Built-in Java annotations

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

These go on your own annotation definition to control its behaviour:

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)         // where the annotation can be used
@Retention(RetentionPolicy.RUNTIME) // when the annotation is available
public @interface Log {
    String message() default "called";
}
```

### `@Retention` — how long the annotation lives

| Value | Meaning | Common use |
|-------|---------|-----------|
| `SOURCE` | Stripped before compilation | Developer tools only |
| `CLASS` | Kept in bytecode, not at runtime | Default |
| `RUNTIME` | Available at runtime via reflection | **Spring Boot needs this** |

Spring Boot annotations use `@Retention(RUNTIME)` so the framework can read them when the application starts.

### `@Target` — where the annotation can be placed

| Value | Where |
|-------|-------|
| `TYPE` | Class, interface, enum |
| `METHOD` | Method |
| `FIELD` | Field |
| `PARAMETER` | Method parameter |
| `CONSTRUCTOR` | Constructor |

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

### Bean annotations — register a class as a Spring-managed object

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
    // No @Autowired needed since Spring Boot 4.3+
    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }
}
```

**Why constructor injection is preferred:**
- `final` works — the field cannot be accidentally re-assigned
- Easy to test — pass a mock in the constructor without Spring
- Makes dependencies visible — you see what the class needs just by reading the constructor

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

### Entity annotations (JPA)

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

### Transaction management

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
