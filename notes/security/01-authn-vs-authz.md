# Authentication vs Authorization

Docs: [Spring Security — Authentication](https://docs.spring.io/spring-security/reference/features/authentication/index.html) · [Spring Security — Authorization](https://docs.spring.io/spring-security/reference/features/authorization/index.html)

---

Two concepts that are always used together but do completely different things.

**Authentication (AuthN)** — "Who are you?" Proving your identity. You provide credentials (email + password), the system verifies them and issues a token.

**Authorization (AuthZ)** — "What can you do?" Checking your permissions. The system already knows who you are — now it decides whether you are allowed to perform this action.

Authentication always happens first. You cannot check permissions for someone whose identity you don't know.

```
1. POST /api/auth/login → email + password verified → JWT issued        ← Authentication
2. GET  /api/projects   → JWT validated → role checked → access granted  ← Authorization
```

---

## How this maps to TimeTrack

### Authentication

The `JwtFilter` runs on every request and validates the token:

```
JwtFilter: is there a valid JWT in the Authorization header?
→ Yes → extract the email, load the user, set SecurityContextHolder
→ No  → do nothing (SecurityFilterChain will block protected routes)
```

This is authentication — confirming that the JWT was issued by this server and has not expired or been tampered with.

### Authorization

After authentication, Spring Security checks whether the authenticated user can access the specific endpoint:

**Backend** — `@PreAuthorize` on the endpoint:
```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
```

**Frontend** — route guards:
```typescript
canActivate: [authGuard, adminGuard]
```

`authGuard` checks that the user is logged in (authentication). `adminGuard` checks that the user has the admin role (authorization).

---

## 401 vs 403 — the HTTP signal

| Code | Meaning | When |
|------|---------|------|
| `401 Unauthorized` | Not authenticated | No token, expired token, invalid token |
| `403 Forbidden` | Authenticated but not authorized | Valid token, but wrong role or insufficient permissions |

The naming is confusing — "Unauthorized" actually means "unauthenticated". But this is the standard and every interviewer expects you to know it.

> Spring Security returns 403 by default for both cases unless you configure a custom `AuthenticationEntryPoint`. In TimeTrack, `GlobalExceptionHandler` handles this distinction.

---

## Generic authentication errors — prevent user enumeration

When login fails, return **one generic message** — "Invalid email or password" — never "email not found" or "wrong password". A specific message lets an attacker enumerate your users: they try an email, and if the error says "wrong password" rather than "email not found", they now know that email is registered. Repeat with a list of emails and they have a list of real accounts to target.

This is why Spring Security throws a single `BadCredentialsException` for both cases — wrong email *and* wrong password — and why `GlobalExceptionHandler` maps it to one 401 with a generic body:

```java
@ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<Map<String, String>> handle(BadCredentialsException e) {
    return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
}
```

> Interview answer to "why one generic message?": to prevent **user enumeration** — leaking which emails are registered.

---

## The key difference in one sentence

Authentication proves you are who you claim to be. Authorization decides what you are allowed to do once your identity is confirmed.
