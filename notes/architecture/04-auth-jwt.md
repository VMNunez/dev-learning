# Authentication — JWT

JWT (JSON Web Token) is the standard for authentication in REST APIs. It is stateless — the server does not store sessions. The token itself contains all the information needed to verify the user.

Official docs: https://jwt.io/introduction

---

## The problem JWT solves

HTTP is stateless — each request is independent. Without auth, the server has no way to know who is making a request. The classic solution was sessions: the server stores the logged-in user and gives the client a session ID cookie. The problem: the server must store state, which makes scaling harder.

JWT solves this by putting the user information inside the token itself. The server verifies the token's signature — no database lookup needed.

---

## JWT structure

A JWT is three Base64-encoded parts separated by dots:

```
header.payload.signature
```

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2aWN0b3JAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTcwMDAwMDB9.abc123signature
```

| Part | Contains |
| --- | --- |
| **Header** | Algorithm used to sign (`HS256`) |
| **Payload** | Claims — user data: `sub` (email), `role`, `exp` (expiry time) |
| **Signature** | Hash of header + payload using a secret key — proves the token is genuine |

The payload is Base64-encoded, not encrypted — anyone can read it. Never put sensitive data (passwords, card numbers) in a JWT.

---

## Authentication flow

```
1. User logs in
   Angular  →  POST /api/auth/login { email, password }  →  Spring Boot

2. Server validates credentials
   Spring Boot checks DB → generates JWT → returns token

3. Angular stores the token
   localStorage.setItem('token', jwt)

4. Every subsequent request includes the token
   Angular interceptor adds: Authorization: Bearer <token>

5. Server validates on every request
   Spring Boot reads token → verifies signature → checks expiry → reads role
   No DB lookup needed

6. Token expires
   User must log in again (or use a refresh token)
```

---

## Angular side

The interceptor adds the token to every outgoing request automatically:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(authReq);
};
```

The token is read from localStorage on every request — this is why the HR portal persists the user in localStorage.

---

## Spring Boot side (awareness level)

Spring Boot uses a filter to intercept every request before it reaches the controller:

```
Request → JWT Filter → validates token → extracts user → Controller
```

If the token is missing, invalid, or expired, the filter returns `401 Unauthorized` before the controller runs.

Libraries used in production: `spring-security` + `jjwt` (Java JWT library).

---

## Where to store the token

| Storage | Pros | Cons |
| --- | --- | --- |
| `localStorage` | Simple, persists across tabs | Vulnerable to XSS — JavaScript can read it |
| `sessionStorage` | Cleared when tab closes | Not shared across tabs |
| `httpOnly cookie` | JavaScript cannot read it — safer | Requires CSRF protection |

For learning projects, `localStorage` is standard. In production, `httpOnly cookies` are more secure. Spanish consultancies building internal tools mostly use `localStorage` with proper XSS prevention.

---

## Token expiry and refresh tokens

A JWT has an expiry time (`exp` claim). When it expires, the user must log in again.

**Refresh token pattern** — the server issues two tokens:
- **Access token** — short-lived (15 min, 1 hour) — used for every request
- **Refresh token** — long-lived (7 days, 30 days) — used only to get a new access token

When the access token expires, the client sends the refresh token to get a new access token without requiring the user to log in again.

For junior projects, a single token with a longer expiry is simpler and acceptable.

---

## Key points for interviews

- JWT is **stateless** — no session stored on the server
- The **signature** proves the token was not tampered with
- The **payload is readable** — never put passwords in it
- The **interceptor** in Angular adds the token to every request automatically
- **401** = not authenticated (no token or invalid), **403** = authenticated but not authorised
- In the HR portal, the auth is **simulated** — the interceptor adds the token but `json-server` does not validate it
