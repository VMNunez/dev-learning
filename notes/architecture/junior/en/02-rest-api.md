# REST API

Before REST, every team designed their API differently. Some used URLs like `/getEmployee?id=1` (RPC style), some used SOAP with XML envelopes. Integrating with a new backend meant learning their private convention from scratch. REST is a shared agreement: the URL names the resource (what you are working with), the HTTP method says what you want to do with it. Any HTTP client that understands REST can work with any REST API — no custom protocol needed.

Official docs: https://developer.mozilla.org/en-US/docs/Glossary/REST

---

## REST principles — what makes an API "RESTful"

Interviewers ask "is your API RESTful, and how do you know?". REST is not a library — it is a set of *constraints* an API follows. The ones that matter at junior level:

- **Client–server** — the frontend (Angular) and the backend (Spring Boot) are independent and communicate only over HTTP. Either can change without the other, as long as the contract holds.
- **Statelessness** — every request carries everything the server needs to handle it; the server keeps no per-client memory between requests. This is exactly why you send the JWT on *every* request instead of relying on a server session — and it is what lets the API run on several servers behind a load balancer.
- **Uniform interface** — resources are named with nouns (`/api/projects`) and the HTTP verb carries the action. Any client that speaks HTTP can use the API without a custom protocol.
- **Resource-based** — you model *things* (projects, entries, users), not actions. The URL identifies the thing; the method says what to do with it.
- **Cacheable / layered** — responses can declare whether they are cacheable, and intermediaries (a gateway, a proxy) can sit between client and server without the client knowing.

So the answer to "is your API RESTful?" is: it uses nouns for resources, HTTP verbs for actions, the correct status codes, and it is stateless (JWT on every request, no server session). That is what "RESTful" means in practice.

> **Why REST and not GraphQL or RPC?** REST is the default in Spanish consultancies: simple to build, understood by every tool, and a perfect fit for resource-style CRUD. GraphQL shines when clients need to shape their own queries over a complex data graph (at the cost of more setup); RPC-style URLs (`/getProject`) couple the client to method names instead of resources. For a standard business CRUD API consumed by Angular, REST is the right and expected choice.

---

## HTTP methods

Each method has a specific meaning. The backend decides what to do based on the method + the URL together.

| Method | Meaning | Example |
| --- | --- | --- |
| `GET` | Read data — no side effects | `GET /employees` |
| `POST` | Create a new resource | `POST /employees` |
| `PUT` | Replace a resource completely | `PUT /employees/1` |
| `PATCH` | Update specific fields only | `PATCH /employees/1` |
| `DELETE` | Remove a resource | `DELETE /employees/1` |

**GET** never sends a body. **POST** and **PUT** send the data in the request body as JSON.

The difference between **PUT** and **PATCH**: PUT replaces the whole object — you must send every field. PATCH sends only the fields that changed. In practice, most Angular + Spring Boot apps use PUT for updates.

> You will see tutorials that use PUT for partial updates (sending only some fields). That is technically wrong — it should be PATCH. In practice most teams use PUT anyway because the objects are small. Know the correct definition even if the convention is flexible.

---

## Idempotency

An operation is **idempotent** if calling it multiple times gives the same result as calling it once.

| Method | Idempotent? | Why |
| --- | --- | --- |
| `GET` | ✅ Yes | Reading never changes data |
| `PUT` | ✅ Yes | Replacing with the same data gives the same result |
| `DELETE` | ✅ Yes | Deleting something twice still leaves it deleted |
| `POST` | ❌ No | Every call may create a new record |

This matters when building reliable systems: if a request fails and you retry, an idempotent method is safe to call again. A POST retry might create duplicates.

---

## Status codes

The backend tells the frontend what happened through a numeric status code.

| Code | Meaning | When |
| --- | --- | --- |
| `200 OK` | Success | GET, PUT, PATCH |
| `201 Created` | Resource created | POST |
| `204 No Content` | Success, no body | DELETE |
| `400 Bad Request` | Client sent invalid data | Validation errors |
| `401 Unauthorized` | Not authenticated | Missing or invalid token |
| `403 Forbidden` | Authenticated but not allowed | Wrong role |
| `404 Not Found` | Resource does not exist | Wrong ID |
| `500 Internal Server Error` | Bug on the server | Unexpected crash |

**401 vs 403**: 401 means "I don't know who you are". 403 means "I know who you are, but you cannot do this". In the HR portal simulation, an employee trying to access an admin route would get a 403.

---

## Endpoint naming conventions

| Rule | Good | Bad |
| --- | --- | --- |
| Use nouns, not verbs | `/employees` | `/getEmployees` |
| Use plural nouns | `/employees` | `/employee` |
| Use lowercase with hyphens | `/leave-requests` | `/leaveRequests` |
| Nest for relationships | `/employees/1/leaves` | `/getEmployeeLeaves?id=1` |
| Use the method to express the action | `DELETE /employees/1` | `/deleteEmployee/1` |

---

## Query parameters — filtering, sorting, pagination

The URL **path** identifies *which* resource; **query parameters** (after the `?`) carry *optional* refinements — filters, sorting, pagination. They never go in a request body, and a `GET` never has a body.

```
GET /api/entries?month=2025-05&status=SUBMITTED
GET /api/entries?page=0&size=20&sort=date,desc
```

- The frontend builds them with Angular's `HttpParams`; the backend reads them with `@RequestParam`.
- Use them for anything **optional** (filters, pagination). Never use them for the resource identity — that is a path variable (`/entries/42`).

---

## CORS

CORS (Cross-Origin Resource Sharing) is a browser security rule. When Angular (running on `localhost:4200`) makes a request to Spring Boot (`localhost:8080`), the browser blocks it by default — the origins are different.

The fix is on the **backend**: Spring Boot must include headers in its responses that tell the browser "this origin is allowed".

```java
// Spring Boot — enable CORS for Angular dev server
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class EmployeeController { ... }
```

Or globally in a config class:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

CORS is a browser restriction — it does not affect server-to-server requests or tools like Postman. If a request works in Postman but not in the browser, CORS is the likely cause.

> If a colleague says "it works in Postman but not in my app", CORS is the first thing to check — not the backend logic. The backend is fine; the browser is blocking it.

---

## REST in Angular

Angular's `HttpClient` maps directly to REST methods:

```typescript
this.http.get<Employee[]>('/api/employees')         // GET
this.http.post<Employee>('/api/employees', payload) // POST
this.http.put<Employee>(`/api/employees/${id}`, payload) // PUT
this.http.delete<void>(`/api/employees/${id}`)      // DELETE
```

The base URL (`http://localhost:8080`) goes in the Angular environment file so you only change it in one place when deploying.
