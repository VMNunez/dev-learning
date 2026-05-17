# Dependency Injection and Spring Beans

> 📖 [Spring IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html)

## Why dependency injection exists

Without DI, a class creates its own dependencies. This makes the class hard to test and tightly coupled:

```java
// Without DI — hard to test, tightly coupled
public class TransactionService {
    // TransactionService creates its own repository — cannot swap it for a mock in tests
    private TransactionRepository repository = new TransactionRepository();
}
```

With DI, Spring creates and provides the dependency from outside:

```java
// With DI — Spring injects the repository, you can pass a mock in tests
@Service
public class TransactionService {
    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

This is **Inversion of Control (IoC)** — instead of the class controlling its dependencies, Spring controls them. You declare what a class needs; Spring provides it. This is the repeating pattern across all of Spring Boot.

---

## Spring beans — what Spring manages

A **bean** is any object that Spring creates and manages. Spring stores all beans in a container called the **Application Context**. When you annotate a class with `@Service`, Spring creates one instance and stores it. When another class needs it, Spring injects that same instance.

**By default, every bean is a singleton** — one instance shared across the whole application. This is why service fields must be stateless (no instance variables that change between requests).

---

## Bean annotations — which to use

All four register the class as a Spring bean. The differences are semantic and practical:

```java
@Component        // generic bean — use when no more specific annotation fits
@Service          // business logic layer (same as @Component, better intent)
@Repository       // data access layer (same as @Component + exception translation)
@RestController   // web layer — handles HTTP requests and returns JSON
```

`@Repository` has one extra feature: it translates JPA/Hibernate exceptions into Spring's `DataAccessException` hierarchy. This means the service layer does not need to handle Hibernate-specific exceptions — it only sees Spring's consistent exception types.

Using the right annotation makes the code self-documenting — any developer can see which layer a class belongs to by reading the annotation.

---

## Constructor injection — the correct way

There are three ways to inject dependencies. Only constructor injection is recommended for new code:

```java
// 1. Field injection — avoid
@Service
public class TransactionService {
    @Autowired
    private TransactionRepository repository;  // Spring sets this via reflection
}

// 2. Setter injection — rare, mostly legacy
@Service
public class TransactionService {
    private TransactionRepository repository;

    @Autowired
    public void setRepository(TransactionRepository repository) {
        this.repository = repository;
    }
}

// 3. Constructor injection — the correct choice
@Service
public class TransactionService {
    private final TransactionRepository repository;

    // @Autowired is optional since Spring Framework 4.3 — Spring detects the single constructor
    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }
}
```

**Why constructor injection is preferred:**

1. **`final` works** — the field cannot be changed after construction; no accidental reassignment
2. **Visible dependencies** — the constructor signature shows exactly what the class needs; no hidden state
3. **Easy to test** — pass a mock in the constructor without needing a Spring context at all
4. **Circular dependency detection** — Spring fails at startup with a clear error instead of a runtime crash

---

## @Qualifier and @Primary — multiple implementations

If two classes implement the same interface, Spring does not know which to inject:

```java
public interface NotificationService { void send(String message); }

@Service
@Primary  // inject this one by default when the interface is requested
public class EmailNotificationService implements NotificationService { ... }

@Service
public class SmsNotificationService implements NotificationService { ... }

// To inject the SMS one explicitly:
@Service
public class AlertService {
    public AlertService(@Qualifier("smsNotificationService") NotificationService ns) { ... }
}
```

In practice, you rarely need `@Qualifier` or `@Primary` in simple projects. They appear in larger codebases with multiple implementations of the same interface.

---

## @Value — reading configuration into beans

Read values from `application.properties` directly into a field:

```java
@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;
}
```

The `${}` syntax matches the key in `application.properties`. If the key does not exist, Spring fails at startup — better than a `NullPointerException` at runtime.

This is how you avoid hardcoding secrets in the code. The value comes from the config file, which is not committed to git in production (it uses environment variables instead).
