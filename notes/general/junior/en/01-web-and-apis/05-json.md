# JSON

Docs: [MDN — JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON) · [MDN — JSON.parse / JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)

---

JSON (JavaScript Object Notation) is the format used to send data between a frontend (Angular) and a backend (Spring Boot).

```json
{
  "email": "victor@example.com",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

Rules:
- Keys are always strings in double quotes
- Values can be: string `"text"`, number `42`, boolean `true/false`, null, array `[...]`, object `{...}`
- No trailing commas

---

## JSON in Spring Boot

Spring Boot's `@RestController` automatically converts Java objects to JSON (serialization) and JSON to Java objects (deserialization) using a library called Jackson. You don't configure this — Spring Boot includes Jackson and enables it by default.

```java
// Spring Boot receives this JSON body:
// { "email": "victor@example.com", "password": "pass123" }
// and automatically fills the LoginRequest object:

@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    // request.getEmail() → "victor@example.com"
    // request.getPassword() → "pass123"
}
```

The Java field name must match the JSON key name. If they differ, use `@JsonProperty("key_name")` on the field.

---

## JSON in Angular

Angular's `HttpClient` handles JSON automatically too — it serializes the request body to JSON and parses the response back to a TypeScript object.

```typescript
// Angular sends this automatically as JSON:
this.http.post<AuthResponse>('/api/auth/login', { email, password })
```

You don't call `JSON.stringify()` or `JSON.parse()` yourself when using `HttpClient`.

> Use `JSON.stringify()` / `JSON.parse()` manually only when working with `localStorage`, since it stores everything as plain strings.
