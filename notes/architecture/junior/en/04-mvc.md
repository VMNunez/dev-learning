# MVC — Model View Controller

A pattern that separates an application into three parts. You already use this every day — this file gives you the vocabulary to name it in an interview.

---

## The three parts

| Part | Responsibility | In Spring Boot | In Angular |
|------|---------------|----------------|------------|
| **Model** | Data and business logic | `Employee` entity + `EmployeeService` | `Employee` interface + `EmployeeService` |
| **View** | What the user sees | JSON response (REST API) | Component template (HTML) |
| **Controller** | Receives input, coordinates model and view | `@RestController` | Component class (handles user events) |

---

## How it maps to layered architecture

The layered architecture you use in Spring Boot (Controller → Service → Repository) is an evolution of MVC:

```
MVC:         Model        ←→   Controller   ←→   View
Layered:  Repository → Service → Controller → JSON / HTML
```

The difference: layered architecture splits the Model into Service (business logic) and Repository (data access). This is the standard in Spring Boot because putting both in one "Model" layer gets too large for real applications.

So when an interviewer says "do you know MVC?", the correct answer is yes — you use it every day, and you can explain how Spring Boot extends it with a third layer.

---

## The term in interviews

When an interviewer says "MVC", they usually mean the general idea of separating concerns — not the strict 3-layer definition.

Your answer: "I use a layered architecture that extends MVC — the controller handles HTTP, the service handles business logic, and the repository handles data access. The separation means that if the database changes, only the repository changes, and if the API format changes, only the controller changes."
