# Layered Architecture

The simplest way to write a REST endpoint is to put everything in one class: read the request, query the database, apply the business rule, return the response. That works for one endpoint. The problem shows up when a second endpoint needs the same business rule — in a class that does everything, you either copy-paste the logic or find an awkward way to share it. Layered architecture solves this by giving each layer one job and one job only. Each layer only talks to the layer directly below it.

---

## Frontend / Backend separation

The Angular app and the Spring Boot app are two independent programs. Angular runs in the browser, Spring Boot runs on a server. They communicate only through HTTP requests.

```
Browser                          Server
┌─────────────────┐              ┌─────────────────────┐
│  Angular App    │  HTTP/REST   │  Spring Boot API    │
│                 │ ──────────→  │                     │
│  Components     │              │  Controllers        │
│  Services       │  ←────────── │  Services           │
│  Models         │  JSON        │  Repositories       │
└─────────────────┘              └──────────┬──────────┘
                                            │
                                  ┌─────────▼──────────┐
                                  │    PostgreSQL DB    │
                                  └────────────────────┘
```

Angular never talks to the database directly. The backend controls what data is exposed and who can access it.

---

## Spring Boot layers

### Controller — receives HTTP requests

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeDTO> getAll() {
        return employeeService.getAll();
    }

    @PostMapping
    public EmployeeDTO create(@RequestBody CreateEmployeeDTO dto) {
        return employeeService.create(dto);
    }
}
```

The controller only handles the HTTP layer — it reads the request, calls the service, and returns the response. No business logic here.

### Service — business logic

```java
@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeDTO> getAll() {
        return employeeRepository.findAll()
            .stream()
            .map(this::toDTO)
            .toList();
    }

    public EmployeeDTO create(CreateEmployeeDTO dto) {
        // validate, transform, apply business rules
        Employee employee = new Employee(dto.getName(), dto.getEmail());
        Employee saved = employeeRepository.save(employee);
        return toDTO(saved);
    }
}
```

The service contains the rules — duplicate checks, transformations, conditions. It is the only layer that knows about business logic.

### Repository — database access

```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email); // Spring generates the SQL automatically
}
```

The repository only reads and writes data. No logic. Spring Data JPA generates the SQL from the method name.

---

## Why this separation?

| Layer | Reason for the split |
| --- | --- |
| Controller vs Service | Controller can change (REST today, WebSocket tomorrow) without touching business logic |
| Service vs Repository | Database can change (PostgreSQL → MySQL) without touching business rules |
| Frontend vs Backend | Angular can be replaced or a mobile app added without changing the backend |

> The rule is: only call the layer directly below you. Controllers call services, services call repositories. Never call the repository from the controller — if you do, the business logic leaks into the HTTP layer and cannot be tested or reused independently.

---

## DTO — Data Transfer Object

A DTO is a simple class that carries data between layers. It is not the database entity — it is what you send over the network.

**Why not return the Entity directly?**

- The Entity may have fields the client should not see (password hash, internal flags)
- The Entity structure matches the database — not always what the frontend needs
- Returning the Entity ties your API to your database schema — if the schema changes, the API changes too

```java
// Entity — matches the database table
public class Employee {
    private Long id;
    private String name;
    private String email;
    private String passwordHash; // should NEVER be sent to the client
    private Department department; // nested object — may cause circular references
}

// DTO — what you actually send in the response
public class EmployeeDTO {
    private Long id;
    private String name;
    private String email;
    private String departmentName; // just the name, not the whole object
}
```

The service maps the Entity to the DTO before returning it to the controller.

---

## Angular equivalent

Angular follows the same layered thinking:

| Spring Boot | Angular equivalent |
| --- | --- |
| Controller | Component (receives user events) |
| Service | Service (business logic, HTTP calls) |
| Repository | `HttpClient` (data access) |
| DTO | Interface / Model |

The patterns are the same — the technology changes.
