# CORS — Cross-Origin Resource Sharing

Docs: [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) · [Spring — CORS](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)

---

## What is an origin?

An origin is the combination of **protocol + domain + port**.

```
http://localhost:4200   ← Angular dev server
http://localhost:8080   ← Spring Boot API
```

These are two different origins — different port. Any request from `4200` to `8080` is a **cross-origin request**.

---

## Why does the browser block cross-origin requests?

The browser enforces the **Same-Origin Policy** — by default, JavaScript running on one origin cannot read responses from a different origin. This protects users: a malicious script on `evil.com` cannot make requests to `your-bank.com` and read your account data.

CORS is the mechanism that lets servers **opt in** to allowing specific cross-origin requests. Without CORS headers in the response, the browser blocks it.

> The server always receives the request and processes it. The browser blocks the **response** from reaching the JavaScript. This is why you can call APIs from Postman (no browser, no Same-Origin Policy) but not from Angular.

---

## How CORS works

For a simple request (GET with no special headers), the browser sends the request and checks the response for the `Access-Control-Allow-Origin` header:

```
Angular (4200) → GET /api/projects → Spring Boot (8080)
Spring Boot → Access-Control-Allow-Origin: http://localhost:4200
Browser → allowed ✓
```

For a **preflight request** — any POST with a JSON body, or any request with an `Authorization` header — the browser first sends an `OPTIONS` request to ask for permission:

```
Browser → OPTIONS /api/projects (preflight)
Spring Boot → Access-Control-Allow-Origin: http://localhost:4200
             Access-Control-Allow-Methods: GET, POST, PUT, DELETE
             Access-Control-Allow-Headers: Authorization, Content-Type
Browser → ok, now send the real request
Browser → POST /api/projects
Spring Boot → 200 OK
```

The `Authorization` header triggers a preflight — this is why every protected API call in Angular first generates an OPTIONS request in the Network tab.

---

## How it is configured in Spring Boot

In TimeTrack, CORS is configured in `SecurityConfig`:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(request -> {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        return config;
    }));
    // ...
}
```

Without this, every Angular request gets blocked by the browser with:
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 
'http://localhost:4200' has been blocked by CORS policy.
```

---

## Key points for interviews

- CORS is a browser security feature — it does not affect Postman or server-to-server calls
- The browser blocks the **response**, not the request — the server already processed it
- The `Authorization` header triggers a preflight OPTIONS request even for GET
- Spring Boot must explicitly allow the Angular origin, methods, and headers
- In production, replace `http://localhost:4200` with the real frontend domain
