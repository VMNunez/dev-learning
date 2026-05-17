# Error Handling

Every app fails eventually. The question is not whether errors happen — it is whether your app handles them in a way that is safe, informative, and recoverable. Error handling is a common gap in junior code, which is exactly why interviewers ask about it.

---

## Types of errors in an Angular + Spring Boot app

| Where | What can go wrong |
|-------|------------------|
| Angular HTTP call | Network failure, timeout, 4xx or 5xx from the backend |
| Spring Boot controller | Invalid request body, missing resource (404) |
| Spring Boot service | Business rule violated (duplicate email, invalid state) |
| Spring Boot repository | Database connection lost, constraint violation |

Each layer handles the error closest to it and passes a clean signal to the layer above.

---

## Angular — handling HTTP errors

Angular's `HttpClient` returns Observables. Any non-2xx response from the backend throws an error in the Observable stream.

### In the service (where to handle it)

```typescript
getEmployees(): Observable<Employee[]> {
  return this.http.get<Employee[]>('/api/employees').pipe(
    catchError((error) => {
      console.error('Failed to load employees', error);
      return of([]); // return a safe fallback so the component still works
    })
  );
}
```

`catchError` intercepts the error before it reaches the component. The component receives an empty array — it never knows an error happened.

Use this approach when you want the app to keep working even if the request fails (non-critical data, background refreshes).

### In the component (showing the error to the user)

When the user needs to know something went wrong, use a signal:

```typescript
isError = signal(false);

loadEmployees() {
  this.isError.set(false);
  this.employeeService.getEmployees().subscribe({
    next: (data) => this.employees.set(data),
    error: () => this.isError.set(true)
  });
}
```

In the template:

```html
@if (isError()) {
  <p>Failed to load data. Please try again.</p>
}
```

> Handle errors in the **service** when you want a silent fallback. Handle them in the **component** when you need to show the user a message. Both approaches appear in real projects — choose based on whether the user needs to know.

---

## Global error handling — the HTTP interceptor

For errors that affect the whole app — like an expired JWT (401) or a network failure — handle them once in the interceptor instead of repeating the logic in every service.

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => error); // rethrow so services can still handle it
    })
  );
};
```

This is what the HR portal does — a 401 anywhere in the app triggers a redirect to login. The `throwError()` means the error still reaches the service's `catchError` if it has one.

---

## Spring Boot — error responses

### Default Spring Boot error format

When something goes wrong, Spring Boot returns:

```json
{
  "timestamp": "2026-05-16T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Employee not found with id: 99",
  "path": "/api/employees/99"
}
```

The Angular app can read `error.error.message` to display a user-friendly message.

### Validation errors (400)

When you use `@Valid` on a DTO parameter, Spring Boot returns 400 with field-level errors:

```json
{
  "status": 400,
  "errors": [
    { "field": "email", "message": "must not be blank" },
    { "field": "name", "message": "size must be between 2 and 50" }
  ]
}
```

### Custom business errors — @ControllerAdvice

When the service throws an exception for a business rule violation, `@ControllerAdvice` catches it globally and returns the correct status:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateEmailException ex) {
        return ResponseEntity.status(409).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(ex.getMessage()));
    }
}
```

Without `@ControllerAdvice`, every unhandled exception returns 500 — the client gets no information about what went wrong and cannot show the user a useful message.

> Think of `@ControllerAdvice` as the HTTP interceptor of the backend: one class that handles errors from all controllers, so you do not repeat the same `try/catch` in every endpoint.

---

## Key points for interviews

- Handle errors in the **service** when you want a safe fallback
- Handle errors in the **component** when you need to show a message to the user
- Handle **global** errors (401, network failure) in the HTTP interceptor — not in every service
- `@ControllerAdvice` is the Spring Boot equivalent — one class catches exceptions from all controllers
- Never swallow errors silently without at least logging them
- `throwError()` in the interceptor lets services still handle the error if they want to
