# Beans and Dependency Injection

Docs: [Spring — IoC Container](https://docs.spring.io/spring-framework/reference/core/beans.html) · [Spring — Stereotypes](https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html) · [Spring — DI](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

---

## The problem that DI solves

Without dependency injection, a class creates its own dependencies:

```java
public class AuthService {
    private JwtUtil jwtUtil = new JwtUtil();  // AuthService creates JwtUtil itself
}
```

This is a problem: `AuthService` is now tied to one specific `JwtUtil`. You can't swap it, test it in isolation, or change how `JwtUtil` is built.

With dependency injection, the class receives its dependencies from outside:

```java
@Service
public class AuthService {
    private final JwtUtil jwtUtil;

    public AuthService(JwtUtil jwtUtil) {  // Spring provides JwtUtil
        this.jwtUtil = jwtUtil;
    }
}
```

`AuthService` no longer knows how `JwtUtil` is created — it just uses it. Spring handles the creation.

---

## What is a bean?

A **bean** is any object that Spring creates, manages, and injects automatically.

When Spring starts, it scans all your classes for annotations like `@Component`, `@Service`, `@Repository`. For each one it finds, it creates one instance and stores it in the **application context** (also called the IoC container).

When another class needs one of those objects (via constructor parameter), Spring takes the instance from the container and injects it.

```
Spring startup:
1. Scans all classes
2. Finds @Component, @Service, @Repository, @Controller
3. Creates one instance of each (by default — singleton)
4. Stores them in the ApplicationContext
5. Wires them together (constructor injection)
```

> **IoC — Inversion of Control:** normally your code controls when objects are created. With IoC, you give that control to Spring. You write `@Service` and Spring decides when, how, and how many instances to create. Hence "inversion" — Spring controls the lifecycle, not you.

---

## @Component vs @Service vs @Repository vs @Controller

All four do the same thing: they mark a class as a bean so Spring creates and manages it. The difference is **meaning and layer**.

| Annotation      | Layer           | Extra behaviour                                                      |
| --------------- | --------------- | -------------------------------------------------------------------- |
| `@Component`    | Any             | Generic bean — use when the class doesn't fit a specific layer       |
| `@Service`      | Business logic  | No extra behaviour — just communicates intent to the reader          |
| `@Repository`   | Database access | Translates database exceptions into Spring's exception hierarchy     |
| `@Controller`   | Web layer       | Marks a class as an MVC controller (for returning views, not JSON)   |
| `@RestController` | Web layer     | `@Controller` + `@ResponseBody` — returns JSON, not views            |

In TimeTrack:
- `JwtUtil` → `@Component` (security utility, no specific layer)
- `JwtFilter` → `@Component` (filter, no specific layer)
- `UserDetailsServiceImpl` → `@Service`
- `AuthService` → `@Service`
- `AuthController` → `@RestController`

> Why use `@Service` if it adds no extra behaviour? Because it communicates intent. A reader who sees `@Service` immediately knows this class contains business logic. Spring is also free to add behaviour to `@Service` in future versions without breaking your code.

---

## @Bean — method-level beans

Sometimes you need to create a bean from a class you don't own (a library class) — you can't put `@Component` on it because you can't edit the source.

`@Bean` solves this. You put it on a method inside a `@Configuration` class:

```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

`BCryptPasswordEncoder` is a library class — you can't annotate it. But by putting `@Bean` on a method that returns one, you tell Spring: "whenever someone needs a `PasswordEncoder`, call this method and use the result."

After this, any class that has `PasswordEncoder` as a constructor parameter will receive the `BCryptPasswordEncoder` instance automatically.

---

## Constructor injection — the right way

There are three ways to inject a bean. Only one is recommended.

```java
// ✅ Constructor injection — recommended
@Service
public class AuthService {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public AuthService(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }
}
```

```java
// ❌ Field injection — avoid
@Service
public class AuthService {
    @Autowired
    private JwtUtil jwtUtil;
}
```

Why constructor injection is better:
- Dependencies are declared explicitly — you can see them in one place
- The field can be `final` — it never changes after construction
- Easy to test — you pass mock objects directly in the constructor
- Spring cannot create the bean if a dependency is missing — it fails at startup, not at runtime

> You don't need to write `@Autowired` on the constructor. If there is only one constructor, Spring uses it automatically.

---

## Singleton scope — one instance for everyone

By default, Spring creates **one instance** of each bean for the whole application. This is called singleton scope.

```
Application starts
    → Spring creates: one JwtUtil, one AuthService, one UserDetailsServiceImpl ...
    → Stores them all in the ApplicationContext

Request 1 comes in → uses the same AuthService instance
Request 2 comes in → uses the same AuthService instance
Request 3 comes in → uses the same AuthService instance
```

This means your beans must be **stateless** — they must not store request-specific data in fields. If `AuthService` stored `currentUser` in a field, Request 2 would overwrite Request 1's user.

`JwtUtil`, `AuthService`, `UserDetailsServiceImpl` in TimeTrack are all correctly stateless — they only use method parameters, never instance fields for request data.

---

## How Spring connects everything at startup

```
Spring scans all classes in com.victor.timetrack.*
        ↓
Finds @Component on JwtUtil          → creates JwtUtil bean
Finds @Component on JwtFilter        → needs JwtUtil and UserDetailsService
Finds @Service on UserDetailsServiceImpl → needs UserRepository
Finds @Service on AuthService        → needs AuthenticationManager, JwtUtil
Finds @Configuration on SecurityConfig → calls @Bean methods
   → passwordEncoder() → creates BCryptPasswordEncoder bean
   → authenticationManager() → creates AuthenticationManager bean
        ↓
Spring wires all dependencies via constructor injection
        ↓
Application ready — all beans created and connected
```

If any bean is missing (e.g. you forgot `@Service` on `AuthService`), Spring throws `NoSuchBeanDefinitionException` at startup and the app doesn't start.
