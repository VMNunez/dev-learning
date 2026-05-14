# SOLID Principles

Five design principles that make code easier to maintain, test, and extend. The name comes from the first letter of each principle. You already apply most of them without knowing the name — this file puts the vocabulary to the practice.

---

## S — Single Responsibility Principle

> A class should have only one reason to change.

Each class does one thing and owns one area. If it changes for two different reasons, it should be two classes.

**In Angular:**
- `EmployeeService` — responsible for employee data. If the API format changes, this is the only file that changes.
- `EmployeeListComponent` — responsible for displaying the list. If the UI changes, only this file changes.
- Mixing both in one component breaks SRP — and makes testing harder.

**In Spring Boot:**
- `EmployeeController` — reads the HTTP request, returns the response.
- `EmployeeService` — contains business logic (duplicate email check, status rules).
- `EmployeeRepository` — reads and writes the database.
- If you put the database query inside the controller, you break SRP.

---

## O — Open/Closed Principle

> A class should be open for extension but closed for modification.

You should be able to add new behaviour without changing existing code. This protects working code from breaking when requirements grow.

**In Angular:**
- Adding a new filter to the employee list: add a new signal and extend `computed()`. You do not touch the existing filter logic.
- Adding a new guard to a route: `canActivate: [authGuard, adminGuard]`. You add to the array — you do not rewrite `authGuard`.

**In Spring Boot:**
- Adding a new endpoint (`GET /employees/by-department`) does not require changing the existing `GET /employees` endpoint or its service method.

---

## L — Liskov Substitution Principle

> Subtypes should be substitutable for their parent types without breaking the program.

If class B extends class A, you should be able to use B anywhere A is expected and it should still work correctly. This matters most in Java with class hierarchies and interfaces.

**In Spring Boot:**
- If `AdminService extends EmployeeService`, every method `AdminService` overrides must behave consistently with what `EmployeeService` promises — not break existing callers.
- The real-world lesson: be careful with inheritance. Prefer composition (a class that *uses* another) over inheritance (a class that *extends* another) when LSP is hard to guarantee.

---

## I — Interface Segregation Principle

> A class should not be forced to implement methods it does not use.

One large interface that covers everything is worse than several small, specific interfaces. Classes should only depend on the methods they actually need.

**In Java:**
- Bad: one `UserActions` interface with `login()`, `logout()`, `createEmployee()`, `deleteEmployee()`. An `Employee` implementation would have to implement admin methods it cannot use.
- Good: `AuthActions` with `login()` and `logout()`, and `AdminActions` with `createEmployee()` and `deleteEmployee()`. Each class implements only what it needs.

**In Angular:**
- Less visible because TypeScript interfaces are structural, but the same idea applies to services — a service that does authentication, HTTP calls, *and* validation is doing too much.

---

## D — Dependency Inversion Principle

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

In practice: don't create your dependencies with `new`. Inject them from outside. This makes swapping implementations easy and makes testing possible (you can inject a mock).

**In Angular:**
```typescript
// Bad — hard-wired dependency, impossible to test
class EmployeeListComponent {
  service = new EmployeeService(); // tied to the real implementation
}

// Good — dependency injected
class EmployeeListComponent {
  private service = inject(EmployeeService); // Angular provides it
}
```

**In Spring Boot:**
```java
// Bad — EmployeeController creates its own dependency
@RestController
public class EmployeeController {
  private EmployeeService service = new EmployeeService(); // tied forever
}

// Good — Spring injects the dependency
@RestController
public class EmployeeController {
  private final EmployeeService service;

  public EmployeeController(EmployeeService service) {
    this.service = service; // Spring provides it — can swap for a mock in tests
  }
}
```

This is exactly what Angular's `inject()` and Spring Boot's `@Autowired` / constructor injection do — they are implementations of the Dependency Inversion Principle.

---

## Summary table

| Letter | Principle | One-line rule | You already do this in... |
|--------|-----------|---------------|--------------------------|
| S | Single Responsibility | One class, one job | Angular services vs components; Spring Boot controller/service/repository |
| O | Open/Closed | Extend without modifying | Adding guards, adding filters, adding endpoints |
| L | Liskov Substitution | Subtypes must honour their parent's contract | Java class hierarchies |
| I | Interface Segregation | Small interfaces over one large one | Java service interfaces |
| D | Dependency Inversion | Inject dependencies, don't create them | Angular `inject()`, Spring Boot constructor injection |

---

## Interview tip

You do not need to memorise the formal definition. What matters is that you can name the principle and give a real example from your projects. For a junior role, S and D are the two they will actually probe — the others are good to name but rarely go deep.
