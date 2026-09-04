# Spring Security and JWT

Docs: [jjwt — README](https://github.com/jwtk/jjwt) (the JWT library used here — creating, signing and parsing tokens) · [Baeldung — Spring Security: authentication with a database](https://www.baeldung.com/spring-security-authentication-with-a-database) (the practical companion for the Spring Security side) · [Spring Security Reference](https://docs.spring.io/spring-security/reference/) (authoritative, reference-style)

---

## Picking up the thread — the handlers that had nothing to throw them

[05-exception-handling.md](./05-exception-handling.md) left you with a `GlobalExceptionHandler` that already contains two handlers you never had a way to trigger: `BadCredentialsException` → `401`, and `AccessDeniedException` → `403`. Nothing in the project throws them, because nothing in the project checks *who* is calling. The same file also walked you through the `/error` trap — a bug where a missing query param surfaces as a `401` — and that trap only exists *because* a security filter chain sits in front of every request, deciding who gets in before any controller runs. You debugged the symptom without ever building the machine that causes it.

This file builds that machine. It is where those two exceptions finally get thrown by something real: `BadCredentialsException` when a password does not match a stored BCrypt hash, `AccessDeniedException` when an authenticated employee reaches for a manager-only endpoint. And it is where the filter chain from that `/error` diagram stops being a black box — you write one of its filters yourself.

The order below is the **build order**: each class depends on the ones above it, so you can compile and test as you go instead of writing ten classes and hoping.

---

## Java syntax you'll meet in this file — read this first

If you have never written Java, a handful of syntax shapes here will look like magic before you even reach the security logic. None of them are Spring — they are everyday Java, and each one has a full explanation in your own Java notes. Skim this table once, then come back to it whenever a symbol confuses you. If a line in this file looks strange, it is almost always one of these seven rows.

| Syntax you'll see | What it actually is | Where it's explained in your notes |
| --- | --- | --- |
| `auth -> auth.anyRequest()...` · `() -> new Something()` | A **lambda** — a short, nameless function passed as an argument. The part before `->` is the input the method hands you; the part after is what you do with it. Spring Security's config methods take lambdas so you can describe each rule inline. | [java/12-streams-lambdas.md — Lambda expressions](../../../java/junior/en/12-streams-lambdas.md#lambda-syntax) |
| `findByEmail(email).orElseThrow(...)` | The method returns an **`Optional<User>`** — a box that either holds a user or is empty. `.orElseThrow()` opens the box, or throws if it's empty. This is how Spring Data avoids ever returning `null`. | [java/09-generics.md — `Optional<T>`](../../../java/junior/en/09-generics.md#optionalt) |
| `ResponseEntity<AuthResponse>` · `Map<String, String>` · `List.of(...)` | **Generics** — the `<...>` says what type lives inside a container. `List<String>` is a list of strings; `ResponseEntity<AuthResponse>` is an HTTP response carrying an `AuthResponse`. | [java/09-generics.md — Generics](../../../java/junior/en/09-generics.md#generics) |
| `.stream().map(...).findFirst()` | The **Stream API** — a pipeline that transforms a collection step by step. It shows up once here, inside `GlobalExceptionHandler`. | [java/12-streams-lambdas.md — Stream API](../../../java/junior/en/12-streams-lambdas.md#what-a-stream-is) |
| `Jwts.builder().subject(...).signWith(...).compact()` | The **builder pattern** — chain methods to configure an object, then a final call (`.build()` / `.compact()`) produces it. jjwt and Spring use it everywhere. | explained line by line in the `JwtUtil` section below |
| `@Component` · `@Service` · `@Bean` · `@Override` | **Annotations** — metadata you stick on a class or method to tell Spring (or the compiler) how to treat it. | [java/16-annotations.md](../../../java/junior/en/16-annotations.md) |
| `private final JwtUtil jwtUtil;` + constructor | **Constructor injection** — Spring passes dependencies in through the constructor. `final` means the field is set once and never reassigned. | [spring-boot/18-dependency-injection.md](./18-dependency-injection.md) |
| `@Bean` method vs `@Component` / `@Service` class · the word *bean* | A **bean** is simply an object that Spring creates and manages for you, so it can inject it wherever it's needed. You mark *your own* classes with `@Component` / `@Service`. For objects from *library* classes you don't own (like `PasswordEncoder`), you write a `@Bean` method inside a config class instead. Both end up as beans — same result, two ways in. | [spring-boot/18-dependency-injection.md — Spring beans](./18-dependency-injection.md#spring-beans--what-spring-manages) |

> Two more Java rules you'll hit: `throws Exception` / `throws UsernameNotFoundException` in a method signature is Java's **checked-exception** rule — you must declare an exception a method might throw ([java/11-exceptions.md](../../../java/junior/en/11-exceptions.md)). And `enum Role { EMPLOYEE, MANAGER }` (Step 4) is a type with a fixed set of named values ([java/14-enums.md](../../../java/junior/en/14-enums.md)).

---

## What we are building — and why

### The problem

Without security, your API is completely open. Anyone who knows the URL can call `GET /api/entries/1` and read someone else's data, or `DELETE /api/users/5` and destroy it. Security is not a feature — it is the foundation.

There are two separate concepts that are often confused:

**Authentication** — who are you? The server checks your identity. Example: you send your email and password, the server confirms you exist.

**Authorization** — what are you allowed to do? The server checks your permissions. Example: you are authenticated, but you are an employee — you cannot access the manager-only endpoints.

This file covers both. Flow 1 is authentication (login). Flow 2 + `@PreAuthorize` is authorization (roles).

---

### Other ways to implement authentication

Before choosing JWT, it is worth understanding the alternatives. Every approach has trade-offs.

**1. Session-based authentication** (the classic approach)

```
Client sends email + password
    ↓
Server verifies credentials
    ↓
Server creates a session in memory (e.g. session ID: "abc123")
    ↓
Server sends a cookie with the session ID to the client
    ↓
Client sends the cookie on every future request
    ↓
Server looks up "abc123" in its session store → finds the user → allows access
```

The session is stored **on the server** (in memory or a database). The client only holds a reference (the session ID in the cookie).

**Problem:** if you have multiple servers (horizontal scaling), each server has its own session store. A request that goes to Server 2 does not find the session created by Server 1. You need shared session storage (Redis, database) — extra infrastructure.

---

**2. JWT — JSON Web Token** (what we are implementing)

```
Client sends email + password
    ↓
Server verifies credentials
    ↓
Server generates a signed token containing the user's email (and later, role)
    ↓
Server sends the token to the client
    ↓
Client stores the token in localStorage and sends it in the Authorization header on every request
    ↓
Server validates the token's signature — no database lookup needed
```

The token is stored **on the client**. The server is stateless — it holds no memory of who is logged in.

**Advantage:** any server can validate a JWT because the signature uses a shared secret. No shared session storage needed. This is why APIs that need to scale use JWT.

**Disadvantage:** you cannot invalidate a token before it expires (unless you build a token blacklist). Session-based auth can invalidate a session instantly by deleting it from the store.

---

**3. OAuth2 / OpenID Connect** (third-party login)

Used when the application delegates authentication to a third party: "Log in with Google", "Log in with GitHub". The third party confirms the user's identity and sends a token back. Common in consumer apps. More complex to implement — not used here.

---

**4. API Keys** (for machine-to-machine communication)

A long random string (`sk-abc123...`) sent in a header on every request. No login flow — the key is generated once and stored. Used for internal services or developer APIs (Stripe, SendGrid). Not suitable for user authentication.

---

**5. Basic Auth** (username + password on every request)

The client sends `email:password` encoded in Base64 on every request. Simple, but the password travels on every request — even with HTTPS this is considered a bad practice for user-facing APIs. Used sometimes for internal admin tools.

---

### Why JWT for this project

| Criterion             | Session-based               | JWT                    |
| --------------------- | --------------------------- | ---------------------- |
| Stateless             | No — server stores sessions | Yes — no server memory |
| Scales horizontally   | Needs shared session store  | Works out of the box   |
| Invalidate instantly  | Yes                         | No (wait for expiry)   |
| Standard in REST APIs | Less common                 | Standard               |
| Complexity            | Simpler to understand       | Slightly more complex  |

We chose JWT because this is a REST API that Angular will consume. REST APIs are designed to be stateless — each request carries everything the server needs to process it. JWT fits naturally. Session-based auth would require managing server-side state, which contradicts the REST principle.

Spanish consultancies build stateless REST APIs as standard. JWT is what you will see in every Spring Boot project in a real company.

---

### JWT signing algorithms — why HS256

A JWT is signed to prevent tampering. The algorithm determines how that signature is produced and verified. Three algorithms are commonly used:

| Algorithm | Full name    | Key type                | Use case                                            |
| --------- | ------------ | ----------------------- | --------------------------------------------------- |
| **HS256** | HMAC-SHA256  | One shared secret       | Single server or trusted backend — simple, fast     |
| **RS256** | RSA-SHA256   | Public/private key pair | Multiple services — public key can be shared safely |
| **ES256** | ECDSA-SHA256 | Public/private key pair | Same as RS256 but smaller keys, faster verification |

**How to read this table:** the column that decides everything is **Key type**. "One shared secret" means the same string both signs and verifies, so every party that can *check* a token can also *forge* one — fine when there is a single backend, fatal the moment you hand the key to a second service. "Public/private key pair" splits those two powers: the private key signs, the public key only verifies, so you can publish the public half freely. The **Use case** column is just that trade-off restated in terms of how many services you have.

**HS256** uses one secret key to both sign and verify. Everyone who knows the secret can create and validate tokens — which means the secret must never leave the server. This is the simplest option and the right choice when there is only one backend service.

**RS256 / ES256** use asymmetric keys. The private key signs the token (only the server holds it). The public key verifies it (can be shared with anyone). This is used when multiple services need to verify tokens independently — for example, a microservices architecture where Service A issues tokens and Service B validates them without sharing a secret.

We use **HS256** because this is a single Spring Boot backend. One secret, one place. RS256 would add complexity with no benefit here.

---

### AuthenticationProvider — why DaoAuthenticationProvider

`AuthenticationManager` is designed to be flexible. It does not verify credentials itself — it delegates to an `AuthenticationProvider`. Spring Security includes several providers, each designed for a different type of authentication:

| Provider                            | What it does                                                                                   | When you use it                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **`DaoAuthenticationProvider`**     | Loads user from a database via `UserDetailsService`, compares passwords with `PasswordEncoder` | Standard login with email + password stored in your own database — what we use   |
| `LdapAuthenticationProvider`        | Authenticates against LDAP / Active Directory                                                  | Large corporations where IT manages users centrally (not a database you control) |
| `JwtAuthenticationProvider`         | Spring's built-in JWT provider, part of the OAuth2 Resource Server module                      | When you are consuming tokens issued by a third party (e.g. Keycloak, Auth0)     |
| `OAuth2LoginAuthenticationProvider` | Handles "Login with Google / GitHub" flows                                                     | Consumer apps with social login                                                  |
| `RememberMeAuthenticationProvider`  | Handles "remember me" cookies                                                                  | Session-based apps with persistent login                                         |

**How to read this table:** you never pick a provider by "which is best" — you pick by **where your users actually live**, which is what the "When you use it" column encodes. Users in your own PostgreSQL table → `Dao`. Users in the company's Active Directory → `Ldap`. Users owned by an external identity provider that already issued the token → `Jwt`. Read the rows as five different answers to one question ("who holds the credentials?"), not as five competing options for the same situation. Note also that the `Jwt` row is *not* what this file builds: it is for **consuming** tokens someone else issued, whereas here you issue your own with `JwtUtil` and validate them in your own `JwtFilter`.

`AuthenticationManager` loops through all registered providers when a login attempt arrives. It picks the one that can handle the type of token passed. If none can handle it, it throws an exception.

**Why `DaoAuthenticationProvider` for this project:**
Our users are stored in PostgreSQL and log in with email + password. `DaoAuthenticationProvider` is built exactly for this case. You give it a `UserDetailsService` (how to load the user from the database) and a `PasswordEncoder` (how to compare passwords), and it handles the full verification. You write less than 10 lines of configuration and the whole login mechanism works.

The other providers exist for different infrastructure that most junior projects will never need. In Spanish consultancies, `DaoAuthenticationProvider` with a PostgreSQL user table is the standard pattern for internal apps.

---

### This is a reusable pattern

The JWT security layer is a **boilerplate pattern** — the structure does not change between projects. Once you understand it and implement it once, you copy it to every future Spring Boot app that needs JWT auth.

**Files that are always identical:**

- `JwtUtil.java` — no changes ever
- `JwtFilter.java` — no changes ever
- `JwtAuthenticationEntryPoint.java` — no changes ever
- `AuthService.java` — no changes ever
- `AuthController.java` — no changes ever
- `LoginRequest.java` + `AuthResponse.java` — no changes ever

**Files where only small details change:**

| File                          | What changes                                                    |
| ----------------------------- | --------------------------------------------------------------- |
| `SecurityConfig.java`         | The route rules — which paths are public, which are protected   |
| `UserDetailsServiceImpl.java` | The field used to find the user (email, username) and the roles |
| `JwtUtil.java` (optional)     | Extra claims added to the token — e.g. role, userId             |
| `GlobalExceptionHandler.java` | Only its **security** handlers are boilerplate (`BadCredentialsException` → 401, `AccessDeniedException` → 403). The rest of the class is app-specific and keeps growing with the project |

**How to read this table:** the left column is *not* "files you rewrite from scratch" — it is "files you paste in and then touch in one or two places". `GlobalExceptionHandler` is the one to watch: two of its handlers belong to this security pattern and travel with it unchanged, but the class as a whole is not boilerplate. In TimeTrack it already carries around eleven handlers, a shared `ErrorResponse` DTO and a `buildError()` helper — all of it built in [05-exception-handling.md](./05-exception-handling.md) and driven by *your* domain exceptions (`ResourceNotFoundException`, `BusinessRuleViolationException`, …), which are different in every app.

This is why senior developers implement JWT auth quickly — they are not thinking, they are copying a known pattern and adjusting two or three things. After TimeTrack, you will do the same.

---

### The two flows — overview

Everything in this file serves one of two flows. Read this before writing any code — it is the map.

---

### Flow 1 — Initial login (complete)

```
─ ─ ─ ─ ─ ─ AT STARTUP — runs once when app starts ─ ─ ─
┌─────────────────────────────────────────────────────────┐
│ [SecurityConfig]                                        │
│   creates CORS filter  (corsConfigurationSource)        │
│   creates SecurityFilterChain with route rules          │
│     permitAll: /api/auth/**                             │
│     authenticated: everything else                      │
│     STATELESS sessions — CSRF disabled                  │
│   registers JwtFilter before the default Spring filter  │
│   exposes PasswordEncoder bean  (BCrypt)                │
│   exposes AuthenticationManager bean                    │
└─────────────────────────────────────────────────────────┘
─ ─ ─ ─ ─ ─ PER REQUEST — runs on every HTTP call ─ ─ ─

POST /api/auth/login
{ "email": "...",
  "password": "..." }
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [CORS filter]  (browser only — Postman skips this)      │
│   Origin: http://localhost:4200                         │
│   POST triggers preflight OPTIONS ("is this allowed?")  │
│   Spring: YES, 4200 is in allowedOrigins                │
│   → browser sends the real POST request                 │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter]                                             │
│   reads Authorization header                            │
│   → header is null → no token                          │
│   → filterChain.doFilter() — passes to next filter      │
│     (next in chain: SecurityFilterChain)                │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityFilterChain]                                   │
│   /api/auth/** → permitAll()                            │
│   → /api/auth/login is in the permitAll list            │
│     no token required → request reaches AuthController  │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthController]                                        │
│   @Valid → email: @NotBlank — password: @NotBlank       │
│   invalid → GlobalExceptionHandler → HTTP 400           │
│             { "error": "field: must not be blank" }     │
│   valid → calls AuthService.login(request)              │
└─────────────────────────────────────────────────────────┘
         │ valid
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthService]                                           │
│   calls authenticationManager.authenticate(email, pwd)  │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthenticationManager]                                 │
│   receives the login attempt                            │
│   routes to the right provider for this auth type       │
│   → delegates to DaoAuthenticationProvider             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [DaoAuthenticationProvider]  ← Spring internal         │
│                                                         │
│   step 1: to verify the password it needs the stored   │
│           hash from the DB — so it calls               │
│           UserDetailsServiceImpl.loadUserByUsername()   │
│           → queries DB → returns UserDetails {          │
│                getUsername()    = email                 │
│                getPassword()    = BCrypt hash  ← used   │
│                getAuthorities() = [ROLE_MANAGER]        │
│             }                                           │
│                                                         │
│   step 2: BCrypt.matches(rawPassword,                   │
│             userDetails.getPassword())                  │
│           no match → GlobalExceptionHandler → HTTP 401  │
│                       { "error": "Invalid email         │
│                          or password" }                 │
│           match → authentication succeeds               │
└─────────────────────────────────────────────────────────┘
         │ match
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthService]                                           │
│   calls JwtUtil.generateToken(email)                    │
│   → builds header + payload + signature                 │
│   → returns AuthResponse(token) to AuthController       │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthController]                                        │
│   receives AuthResponse from AuthService                │
│   → ResponseEntity.ok(authResponse)                     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
         { "token": "eyJ..." }  HTTP 200
         │
         ▼
Angular stores token in localStorage
```

---

### Flow 2 — Every subsequent request (complete)

```
─ ─ ─ ─ ─ ─ SecurityConfig already ran at startup ─ ─ ─
─ ─ ─ ─ ─ ─ PER REQUEST — runs on every HTTP call ─ ─ ─

GET /api/projects
Authorization: Bearer eyJ...
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [CORS filter]  (browser only — Postman skips this)      │
│   Origin: http://localhost:4200                         │
│   is this in allowedOrigins? YES                        │
│   Authorization header is non-simple → preflight sent   │
│   Spring approves → real request continues              │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter]                                             │
│   reads Authorization header                            │
│   → "Bearer eyJ..." → strips prefix → raw token        │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtUtil.extractUsername(token)]                        │
│   parseClaims() → reads "sub" claim → returns email     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [UserDetailsServiceImpl.loadUserByUsername(email)]      │
│   queries DB → returns UserDetails {                    │
│      getUsername()    = email          → isValid()      │
│      getPassword()    = BCrypt hash    → not used here  │
│      getAuthorities() = [ROLE_MANAGER] → setAuth()      │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtUtil.isValid(token, userDetails.getUsername())]     │
│   signature OK + not expired?                           │
│   false → setAuthentication() never called              │
│           JwtFilter still calls filterChain.doFilter()  │
│           SecurityFilterChain: no auth found            │
│           → JwtAuthenticationEntryPoint → HTTP 401      │
│   true → continue                                       │
└─────────────────────────────────────────────────────────┘
         │ true
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityContextHolder]                                 │
│   thread-local storage — holds the authenticated user   │
│   for the duration of this request only                 │
│   setAuthentication(                                    │
│     new UsernamePasswordAuthenticationToken(            │
│       userDetails,              ← who the user is       │
│       null,                     ← JWT proved identity   │
│       userDetails.getAuthorities() ← roles              │
│     )                                                   │
│   )                                                     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter] → filterChain.doFilter()                    │
│   JwtFilter's only job: set (or not) the auth context   │
│   it never blocks — always passes request onward        │
│   SecurityFilterChain decides: allow or deny            │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityFilterChain]                                   │
│   reads SecurityContextHolder                           │
│   .anyRequest().authenticated()                         │
│   user in context → request is allowed                  │
│   no user in context → JwtAuthenticationEntryPoint      │
│                        → HTTP 401 Unauthorized          │
│                        { "message":                     │
│                          "Authentication required" }    │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [@PreAuthorize("hasRole('MANAGER')")]  ← if present     │
│   reads SecurityContextHolder                           │
│   wrong role → AccessDeniedException → HTTP 403         │
│   role OK → method runs                                 │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [@RestController method]                                │
│   all checks passed — business logic runs here          │
│   getProjects(), createProject(), etc.                  │
└─────────────────────────────────────────────────────────┘
         │
         ▼
         HTTP 200 + response data
```

---

### Both flows combined — the complete picture

```
─ ─ ─ AT STARTUP ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
[SecurityConfig] → creates CORS filter, SecurityFilterChain,
                   registers JwtFilter, exposes beans
─ ─ ─ PER REQUEST ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

        POST /api/auth/login              GET /api/any-protected-route
        { email, password }               Authorization: Bearer eyJ...
                │                                      │
                └──────────────────┬───────────────────┘
                                   │
                           [CORS filter]
                      origin allowed? YES → continue
                                   │
                              [JwtFilter]
                                   │
                  ┌────────────────┴─────────────────┐
             no token                            token found
                  │                                   │
  filterChain.doFilter()             extractUsername() → email
  "pass through"                     loadUserByUsername(email)
                  │                  isValid(token) → OK
       [SecurityFilterChain]         SecurityContextHolder ← set
       /api/auth/** → permitAll()    filterChain.doFilter()
                  │                       [SecurityFilterChain]
          [AuthController]                authenticated() → OK
                  │                                  │
          [AuthService]                      [@PreAuthorize]
                  │                           role check → OK
       [AuthenticationManager]                        │
                  │                         [@RestController]
       [DaoAuthenticationProvider]          request is processed
           ╱              ╲
[UserDetailsServiceImpl]  [BCrypt]
   loads user from DB     matches()
           ╲              ╱
         both OK?
              │
  [JwtUtil.generateToken()]
              │
      [AuthController]
    ResponseEntity.ok()
              │
    { "token": "eyJ..." }

error paths
  [GlobalExceptionHandler]  (exceptions that reach the MVC layer)
    @Valid fails       → HTTP 400  { "message": "Validation failed" }
    wrong password     → HTTP 401  { "message": "Invalid email or password" }
    wrong role         → HTTP 403  (AccessDeniedException)

  [JwtAuthenticationEntryPoint]  (rejected inside the filter chain)
    no / bad / expired token → HTTP 401
                               { "message": "Authentication required" }
```

---

### Error flows — what happens when things go wrong

**Wrong password:**

```
POST /api/auth/login { email: ok, password: wrong }
         │
         ▼
AuthService → authenticationManager.authenticate()
         │
         ▼
DaoAuthenticationProvider → BCrypt.matches() → NO MATCH
         │
         ▼
throws BadCredentialsException
         │
         ▼
GlobalExceptionHandler.handleBadCredentials()
         │
         ▼
HTTP 401  { "error": "Invalid email or password" }
```

> Spring Security also converts `UsernameNotFoundException` to `BadCredentialsException` internally — so a wrong email and a wrong password return the same 401 message. Intentional: if the API returned different errors, an attacker could enumerate valid emails.

---

**Expired or tampered token:**

```
GET /api/projects
Authorization: Bearer <expired-or-fake-token>
         │
         ▼
JwtFilter → JwtUtil.extractUsername(token)
         │
         ▼
parseClaims() → parseSignedClaims() throws JwtException
   (ExpiredJwtException if expired, SignatureException if tampered)
         │
         ▼
isValid() catches JwtException → returns false
         │
         ▼
SecurityContextHolder NOT set  (no authenticated user for this request)
         │
         ▼
filterChain.doFilter() continues
         │
         ▼
SecurityFilterChain: .anyRequest().authenticated()
    → no user in SecurityContextHolder → DENIED
    → AuthenticationException → JwtAuthenticationEntryPoint.commence()
         │
         ▼
HTTP 401 Unauthorized
{ "timestamp": ..., "status": 401,
  "error": "Unauthorized", "message": "Authentication required" }
```

---

**Authenticated but wrong role:**

```
POST /api/projects
Authorization: Bearer <valid-employee-token>
         │
         ▼
JwtFilter validates token → sets EMPLOYEE in SecurityContextHolder
         │
         ▼
SecurityFilterChain: authenticated() → OK  (user is authenticated)
         │
         ▼
@PreAuthorize("hasRole('MANAGER')") reads SecurityContextHolder
    current role: EMPLOYEE
    required role: MANAGER
    → EMPLOYEE ≠ MANAGER
         │
         ▼
throws AccessDeniedException
         │
         ▼
HTTP 403 Forbidden
```

> **Note the difference: 401 and 403 are not the same rejection.** A missing or invalid token means Spring Security never authenticated you at all — you get **401 Unauthorized** with `"message": "Authentication required"`, produced by the `JwtAuthenticationEntryPoint` you wire into the chain (see [AuthenticationEntryPoint — 401 instead of the default empty 403](#authenticationentrypoint--401-instead-of-the-default-empty-403) below). A wrong role means you *were* authenticated — Spring knows exactly who you are — but the role check failed, so you get **403 Forbidden**. Out of the box, without that entry point, Spring Security would return an empty 403 for *both* cases, which is why the 401/403 split is something you have to configure rather than something you get for free.

---

**What each class is responsible for:**

| Class                    | Flow        | Responsibility                                                      |
| ------------------------ | ----------- | ------------------------------------------------------------------- |
| `SecurityConfig`         | Both        | Configures all rules: routes, filter registration, CORS             |
| `JwtUtil`                | Both        | Creates tokens (Flow 1) and validates them (Flow 2)                 |
| `UserDetailsServiceImpl` | Both        | Loads a user from the database by email                             |
| `BCryptPasswordEncoder`  | Flow 1 only | Compares raw password against stored hash                           |
| `AuthService`            | Flow 1 only | Orchestrates login — calls authenticate(), then generateToken()     |
| `AuthController`         | Flow 1 only | Receives the login HTTP request, returns the token                  |
| `JwtFilter`              | Flow 2 only | Intercepts every request, validates JWT, sets SecurityContextHolder |
| `JwtAuthenticationEntryPoint` | Flow 2 only | Writes the 401 JSON when a request carries no valid authentication at all |
| `GlobalExceptionHandler` | Both        | Converts exceptions into clean JSON error responses                 |

**How to read this table:** the **Flow** column tells you *when* the class is even loaded into the story — "Flow 1 only" classes exist purely to hand out a token, "Flow 2 only" classes exist purely to check one, and "Both" classes are the shared plumbing that runs in either case. If you are debugging a login that fails, only the Flow 1 and Both rows can be at fault; if a token is rejected on a protected route, look at Flow 2 and Both. The **Responsibility** column is deliberately one sentence each — if you cannot say a class's job in one sentence, it is doing too much.

---

### Why the creation order is not the flow order

The flow reads **top-down** — a request enters at `AuthController` and goes deeper toward `JwtUtil`.
The creation order reads **bottom-up** — you build the deepest dependency first, because each class needs the classes below it to compile.

```
Flow order (top-down)          Creation order (bottom-up)        Why this order

AuthController                 1. SecurityConfig skeleton    ← open ALL routes so you can
    ↓                             (anyRequest().permitAll())    test each class as you build it
AuthService                                                      without needing a token yet
    ↓                          2. JwtUtil                   ← no dependencies — standalone
DaoAuthenticationProvider                                        utility class; builds first
    ↓                          3. UserDetailsServiceImpl    ← depends on UserRepository
UserDetailsServiceImpl            (reads role from User)         (already exists)
    ↓                          
JwtUtil                        4. SecurityConfig beans      ← PasswordEncoder + AuthManager
    ↓                             (PasswordEncoder,              exposed here so AuthService
SecurityFilterChain               AuthenticationManager)         can inject AuthManager
                               
                               5. DTOs                      ← LoginRequest + AuthResponse
                                  (LoginRequest,                 plain classes, no dependencies
                                   AuthResponse)            
                               
                               6. AuthService               ← depends on AuthManager (step 4)
                                                                 and JwtUtil (step 2)
                               
                               7. AuthController            ← depends on AuthService (step 6)
                               
                               8. GlobalExceptionHandler    ← no dependencies — standalone
                                                                 intercepts exceptions globally
                               
                               9. JwtFilter                 ← depends on JwtUtil (step 2)
                                                                 and UserDetailsServiceImpl (step 3)
                               
                              10. SecurityConfig final      ← depends on JwtFilter (step 9)
                                  (register JwtFilter,          closes routes — /api/auth/**
                                   protect routes,              permitAll, everything else
                                   add CORS config)             authenticated()
```

`SecurityConfig` is special: it appears **first** (as a skeleton that opens all routes) and **last** (as the final version that closes them). You open routes at the start so you can test each class as you build it. If you locked the routes at step 1, nothing would work until step 10.

Every other class follows the dependency rule: if `AuthService` calls `JwtUtil`, then `JwtUtil` must exist first.

**Test after each step** — do not wait until step 10 to run the app. After step 7, test Flow 1 in Postman (login + get token). After step 10, test Flow 2 (use the token to call a protected route). Catching problems early is much easier than debugging a chain of 10 classes at once.

---

## Documentation

| What you need to do                                    | Read this                                                                                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Generate and parse JWT tokens in Java                  | [jjwt — Quickstart](https://github.com/jwtk/jjwt#quickstart) · [Reading a JWT](https://github.com/jwtk/jjwt#reading-a-jwt)                      |
| Configure the filter chain (SecurityFilterChain)       | [Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)                                          |
| Set route-level permissions (permitAll, authenticated) | [Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)                  |
| Configure STATELESS sessions for JWT                   | [Session Management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)                           |
| Password hashing with BCrypt                           | [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)            |
| How UserDetailsService fits into login                 | [DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) |
| Method-level role checks (@PreAuthorize)               | [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)                |
| SecurityContextHolder — reading the current user       | [Spring Security — SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder) |
| Full Spring Security reference                         | [Spring Security Reference](https://docs.spring.io/spring-security/reference/)                                                                  |

> **Practical companion — Baeldung (baeldung.com):** the official docs are reference-style — they define what each piece is, not how to wire it together. For every concept in this file, search `baeldung <concept>` (e.g. "baeldung spring security jwt", "baeldung userdetailsservice", "baeldung preauthorize"). Baeldung articles show real code examples and explain the why behind each step. Use both: official docs for the authoritative definition, Baeldung for the practical implementation guide.

---

## Dependencies — what to add to pom.xml

Two separate things need to be installed: Spring Security and a JWT library.

### Spring Security

Search `spring-boot-starter-security` on [mvnrepository.com](https://mvnrepository.com). You do **not** need to write a version — Spring Boot manages it automatically through the parent POM.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

**What it does when you add it:** immediately blocks every endpoint with a default login page and a random password printed in the console. This is Spring Security's default "deny all" behaviour — you replace it with your own `SecurityConfig`.

### JJWT

JJWT is a Java library for creating and validating JWT tokens. Find it on [mvnrepository.com](https://mvnrepository.com) by searching `jjwt-api` (group: `io.jsonwebtoken`).

It is split into three artifacts on purpose:

| Artifact       | Scope               | Why                                                                                 |
| -------------- | ------------------- | ----------------------------------------------------------------------------------- |
| `jjwt-api`     | (default — compile) | The public interface you import in your code                                        |
| `jjwt-impl`    | runtime             | The internal logic that creates and parses tokens — you never reference it directly |
| `jjwt-jackson` | runtime             | Handles JSON serialization inside the token — you never reference it directly       |

A **JAR** (Java ARchive) is a file that contains compiled Java code — think of it as a ZIP file of `.class` files. When you add a dependency in `pom.xml`, Maven downloads the corresponding JAR and makes the code inside available to your project. Every library you use (jjwt, Spring Security, Lombok) arrives as a JAR.

`runtime` scope means the JAR is only available when the app runs, not when it compiles. Your code only imports from `jjwt-api`. If you accidentally try to import an internal class from `jjwt-impl`, Maven blocks it at compile time — it forces you to use only the public API.

**How to pick the version:** on mvnrepository.com, look at the usages column. Pick the version with the most usages in the most recent major family — that version has been tested by the most real projects. Avoid versions released in the last few weeks (usages will be very low).

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

After adding all dependencies, reload Maven in IntelliJ: right-click `pom.xml` → Maven → Reload project (or click the elephant icon in the Maven panel).

---

## Where each file goes — the package structure

Before writing any class, you need to know where it lives. IntelliJ does **not** create packages for you — you create each one yourself, then put the class inside. A "package" is just a folder under `src/main/java/com/victor/timetrack/`, and the convention is one folder per role (one for controllers, one for services, and so on). Java's only hard rule: the `package` line at the top of every file must match the folder it sits in, or it won't compile. IntelliJ writes that line for you when you create the class in the right place.

These are the packages this feature touches — some already exist from earlier steps:

```
src/main/java/com/victor/timetrack/
├── security/
│   ├── JwtUtil.java                ← creates & validates tokens
│   ├── JwtFilter.java              ← runs on every request
│   ├── JwtAuthenticationEntryPoint.java ← 401 JSON when no valid auth
│   └── SecurityConfig.java         ← all security rules + beans
├── service/
│   ├── UserDetailsServiceImpl.java ← loads the user from the DB
│   └── AuthService.java            ← orchestrates login
├── controller/
│   └── AuthController.java         ← POST /api/auth/login
├── dto/
│   ├── request/
│   │   └── LoginRequest.java       ← what the client sends
│   └── response/
│       └── AuthResponse.java       ← what the server returns back
├── exception/
│   └── GlobalExceptionHandler.java ← turns exceptions into clean JSON
└── model/
    ├── User.java                   ← entity (already exists)
    └── Role.java                   ← enum, added in Step 4
```

> The `File:` line at the top of each section below repeats the exact path for that class, so you never have to guess where to put it. In IntelliJ: right-click the parent folder → New → Package to create a folder, then right-click the package → New → Java Class. The packaging idea (one folder per layer) is the same pattern as [layer-reference.md](../../layer-reference.md).

---

## How Spring Security works — the filter chain

Spring Security does not live inside your controllers. It works as a chain of filters that sits in front of them. Every HTTP request passes through this chain before it can reach any `@RestController`. If a request fails a security check, it is rejected there — the controller never runs.

You configure the chain with one bean: `SecurityFilterChain`. Your `JwtFilter` is one link in that chain. Spring Security provides the others.

```
HTTP request
    ↓
[JwtFilter] ← your custom filter — reads and validates the JWT
    ↓
[SecurityFilterChain rules] ← checks route permissions (permitAll vs authenticated)
    ↓
[@RestController] ← only reached if all checks passed
```

---

## The full login flow — how all the pieces connect

Docs: [DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html)

There are two separate flows. Understand both — they are different.

**When does each flow happen?**

- **Flow 1** — when the user logs in: they send email + password and receive a token. This happens on first login, or when a previous token has expired.
- **Flow 2** — every request after login: the user already has a token and sends it in the header to access protected routes.

---

**Flow 1 — Initial login (POST /api/auth/login)**

_Quick summary:_

```
1. Request arrives → JwtFilter runs, sees no token → passes through
2. SecurityFilterChain checks the route → /api/auth/** is permitAll() → allows it
3. AuthController receives the request → calls AuthService.login()
4. AuthService calls AuthenticationManager.authenticate()
5. AuthenticationManager delegates to DaoAuthenticationProvider
6. DaoAuthenticationProvider calls UserDetailsService.loadUserByUsername(email)
7. DaoAuthenticationProvider calls PasswordEncoder.matches(rawPassword, hashedPassword)
8. If both checks pass → authentication is successful
9. AuthService calls JwtUtil.generateToken(email) → returns a signed JWT
10. AuthController returns AuthResponse with the token
```

_Step by step:_

**1. Request arrives → JwtFilter runs, sees no token → passes through**
`security/JwtFilter.java` — Every request passes through `JwtFilter` first. It looks for an `Authorization: Bearer <token>` header. On login, the user does not have a token yet, so the header is missing. `JwtFilter` detects this and does nothing — it simply passes the request to the next step.

**2. SecurityFilterChain checks the route → `/api/auth/**` is `permitAll()` → allows it**
`security/SecurityConfig.java` — `SecurityFilterChain` is the set of security rules you configured. `permitAll()` means "no authentication required for this URL". Since you marked `/api/auth/**` as public, the login endpoint is allowed through.

**3. AuthController receives the request → calls AuthService.login()**
`controller/AuthController.java` — The request reaches your controller, which reads the JSON body (email + password) and calls the service.

**4. AuthService calls AuthenticationManager.authenticate()**
`service/AuthService.java` — Passes the email and raw password to Spring Security's coordinator. This triggers the whole verification process.

**5. AuthenticationManager delegates to DaoAuthenticationProvider**
Spring Security internal — `AuthenticationManager` does not verify anything itself. It delegates to `DaoAuthenticationProvider`, which is Spring Security's internal class for username/password logins. You do not write this class.

**6. DaoAuthenticationProvider calls UserDetailsService.loadUserByUsername(email)**
`service/UserDetailsServiceImpl.java` — Goes to the database, finds the user by email, and returns a `UserDetails` object with the stored hashed password and roles.

**7. DaoAuthenticationProvider calls PasswordEncoder.matches(rawPassword, hashedPassword)**
`security/SecurityConfig.java` (the `passwordEncoder()` bean) — Compares the plain text password the user sent with the BCrypt hash stored in the database. If it does not match, `BadCredentialsException` is thrown.

**8. If both checks pass → authentication is successful**
`authenticate()` returns without throwing. This means: the user exists in the database AND the password is correct.

**9. AuthService calls JwtUtil.generateToken(email) → returns a signed JWT**
`service/AuthService.java` + `security/JwtUtil.java` — Now that the credentials are verified, generate the token. The email goes into the `sub` claim and it is signed with the secret key.

**10. AuthController returns AuthResponse with the token**
`controller/AuthController.java` — The response is a JSON object `{ "token": "eyJ..." }`. The client (Angular) stores it in `localStorage` and sends it on every future request.

---

**Flow 2 — Every subsequent request (any protected route)**

_Quick summary:_

```
1. Request arrives with header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
2. JwtFilter runs → extracts the token from the header
3. JwtFilter calls JwtUtil.extractUsername(token) → gets the email
4. JwtFilter calls UserDetailsService.loadUserByUsername(email) → loads user from DB
5. JwtFilter calls JwtUtil.isValid(token, email) → checks signature + expiry
6. If valid → JwtFilter puts the user in SecurityContextHolder
7. SecurityFilterChain checks the route → requires authenticated() → user is in context → allowed
8. Request reaches the controller
```

_Step by step:_

**1. Request arrives with header: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...`**
Angular interceptor (frontend) — The client sends the token it stored after login. It goes in a header — not in the body, not in a cookie.

**2. JwtFilter runs → extracts the token from the header**
`security/JwtFilter.java` — Detects the `Authorization` header, strips the `Bearer ` prefix (7 characters), and gets the raw token string.

**3. JwtFilter calls JwtUtil.extractUsername(token) → gets the email**
`security/JwtFilter.java` + `security/JwtUtil.java` — Reads the `sub` claim from the token payload. This is the email of the user who logged in.

**4. JwtFilter calls UserDetailsService.loadUserByUsername(email) → loads user from DB**
`security/JwtFilter.java` + `service/UserDetailsServiceImpl.java` — Even though the token already contains the email, Spring Security requires loading the full `UserDetails` to get the current roles and confirm the account is still active.

**5. JwtFilter calls JwtUtil.isValid(token, email) → checks signature + expiry**
`security/JwtFilter.java` + `security/JwtUtil.java` — Verifies that the token was signed with the correct secret key (not tampered with) and has not expired.

**6. If valid → JwtFilter puts the user in SecurityContextHolder**
`security/JwtFilter.java` — `SecurityContextHolder` is a thread-local storage that Spring Security reads throughout the request lifecycle. Putting the user here tells Spring: "this request is authenticated as this user".

**7. SecurityFilterChain checks the route → requires authenticated() → user is in context → allowed**
`security/SecurityConfig.java` — Since `SecurityContextHolder` has a valid user, the route rule `authenticated()` is satisfied. The request is allowed through.

**8. Request reaches the controller**
Any controller — The controller can now call `SecurityContextHolder.getContext().getAuthentication()` to know who is making the request, without checking the database again.

Spring Security knows who is making the request from the `SecurityContextHolder` — no password check needed, just the token.

**Why each class exists:**

| Class                    | Role in the flow                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JwtUtil`                | Creates and validates JWT tokens                                                                                                                              |
| `UserDetailsServiceImpl` | Loads a user from the database by email                                                                                                                       |
| `AuthService`            | Orchestrates login: calls `AuthenticationManager`, generates token                                                                                            |
| `AuthController`         | Receives the HTTP request, returns the token                                                                                                                  |
| `JwtFilter`              | Intercepts every subsequent request and validates the token                                                                                                   |
| `SecurityConfig`         | Configures which routes are public, which are protected, and registers all the beans above                                                                    |
| `AuthenticationManager`  | Spring Security's internal coordinator — receives the login attempt and delegates to `DaoAuthenticationProvider`. Registered as a `@Bean` in `SecurityConfig` |

---

## JWT — what it is and why it works for stateless auth

Docs: [jwt.io/introduction](https://jwt.io/introduction)

JWT (JSON Web Token) is a signed, self-contained token. It has three parts separated by dots:

```
header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.abc123
```

- **Header** — which signing algorithm was used (e.g. HS256)
- **Payload** — the claims: user data stored as key-value pairs (`sub` = email, `iat` = issued at, `exp` = expiration)
- **Signature** — HMAC of header + payload using the secret key — proves the token was not tampered with

> **What is HMAC?** Hash-based Message Authentication Code. In plain words: it runs the header + payload through a one-way hash **mixed with your secret key** to produce a short fingerprint — the signature. Anyone can recompute it, but only someone who knows the secret can produce the *correct* fingerprint. So if even one character of the payload changes, the recomputed signature no longer matches and the token is rejected. That is exactly what `.signWith()` (creating) and `.verifyWith()` (reading) do in `JwtUtil` below.

Any server with the same secret key can verify the token without calling the database. This is the whole point — no session, no shared state, just a signed token the client carries on every request.

One important limitation: you cannot invalidate a JWT before it expires. Once issued, the token is valid until its `exp` claim passes — there is no server-side state to delete. If a user logs out or their account is banned, the token keeps working until expiry. The practical solution is a short expiry time (15–60 minutes). The workaround is a token blacklist stored in Redis, but that introduces server-side state and partially defeats the purpose of stateless auth.

**A claim is a key-value pair stored in the payload.** Standard claims: `sub` (subject = who the token belongs to), `iat` (issued at), `exp` (expiration). You read them back when validating the token.

---

## Build order — create the SecurityConfig skeleton first

The sections below explain each class in **concept order** — simplest and most standalone first, starting with `JwtUtil`. But you do not *build* them in that order. You build them in the 10-step **creation order** from [Why the creation order is not the flow order](#why-the-creation-order-is-not-the-flow-order) above — and step 1 there is **not** `JwtUtil`, it is the `SecurityConfig` skeleton.

Why first? The moment you added `spring-boot-starter-security`, Spring locked every endpoint behind a default login page. Until a `SecurityConfig` opens the routes, you cannot test anything in Postman. So before writing `JwtUtil`, create the development skeleton shown in [SecurityFilterChain → During development](#during-development--open-everything-while-building-jwt) (the version with `anyRequest().permitAll()`). It opens all routes so every class you build next is testable straight away. In the very last step you replace it with the locked-down final version.

> **In short:** read the sections top to bottom to *understand* each class, but *assemble* them in the numbered creation order. The `SecurityConfig` skeleton is step 1 even though its code lives near the bottom of this file — don't wait until you reach that section to create it.

---

## JwtUtil — generating and validating tokens

File: `src/main/java/com/victor/timetrack/security/JwtUtil.java`

Docs to read before writing this class:

- [Quickstart](https://github.com/jwtk/jjwt#quickstart) — read the two code snippets: `parseSignedClaims` and the `try/catch`. Stop there.
- [Reading a JWT](https://github.com/jwtk/jjwt#reading-a-jwt) — read the 5-step list at the top only. Stop before "Constant Parsing Key".

`JwtUtil` is a `@Component` (a Spring bean with no specific role). It has two `@Value` fields that read from `application.properties`, and five methods — three public and two private.

The sections below explain each part in the order it appears in the class:

### application.properties — JWT config

```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

`app.jwt` is just a naming convention — you invent the property names. The `${JWT_SECRET}` pattern reads from an environment variable at startup, the same way `${DB_PASSWORD}` works. `86400000` is 24 hours in milliseconds.

**The JWT_SECRET must always be a Base64-encoded string.** Why? Because environment variables are text-only — you cannot store raw binary bytes in them. A cryptographic key is binary data (just a sequence of bytes). Base64 converts those bytes into a safe text string you can store anywhere. When the app starts, `getSigningKey()` decodes it back to the raw bytes to build the actual cryptographic key.

You need to generate that Base64 string once, and there are two ways to do it — `openssl` or a tiny jjwt snippet, both shown right below. They produce the same kind of result: a Base64 string that you copy and save as the `JWT_SECRET` environment variable in IntelliJ. Pick whichever is handier — the two options are just different tools for the exact same job.

**Option 1 — openssl** (simplest):

Run this in any terminal:

```
openssl rand -base64 32
```

It prints a Base64 string. Copy it. Done.

**Option 2 — jjwt code** (if you do not have openssl):

This is **not** application code. It is a one-time throwaway snippet. Here is where to put it:

1. In IntelliJ, right-click anywhere in `src/main/java` → New → Java Class → name it anything, e.g. `GenerateSecret`
2. Add a `main` method and paste this inside:

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import javax.crypto.SecretKey;

public class GenerateSecret {
    public static void main(String[] args) {
        SecretKey key = Jwts.SIG.HS256.key().build();
        String secretString = Encoders.BASE64.encode(key.getEncoded());
        System.out.println(secretString);
    }
}
```

3. Run it — it prints a Base64 string to the console. Copy it.
4. **Delete the class** — it was only needed to generate the value once. Never commit it.

This option is better than openssl because jjwt validates the key length for HS256 automatically.

**After generating the string — set the environment variable in IntelliJ:**

1. Run → Edit Configurations → select your Spring Boot run configuration
2. Modify options → Environment variables
3. Add: `JWT_SECRET=<the string you copied>`
4. Click OK

The app reads it at startup via `${JWT_SECRET}` in `application.properties`. Same pattern as `DB_PASSWORD`.

### Reading config values with @Value

Docs: [Spring @Value annotation](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/value-annotations.html)

`@Value` is a Spring annotation that reads a value from `application.properties` and assigns it to the field on the next line. The `${...}` inside is the property name — Spring looks it up at startup and injects the value.

```java
@Value("${app.jwt.secret}")
private String secret;        // Spring reads app.jwt.secret and assigns it here

@Value("${app.jwt.expiration}")
private long expiration;      // Spring reads app.jwt.expiration and assigns it here
                              // primitive long (not Long) — this value is always present, never null
```

> **`long` vs `Long`?** `long` (lowercase) is a *primitive* — a plain number that always holds a value and can never be `null`. `Long` (capital) is the object wrapper around it, which *can* be `null`. Here you want `long` because the expiration always comes from `application.properties`, so it is guaranteed to be present — using the primitive documents that intent and avoids an accidental `null`. Full primitives-vs-wrappers explanation in [java/01-variables-types.md](../../../java/junior/en/01-variables-types.md).

### getSigningKey() — the foundation

Docs: [jjwt — Creating Safe Keys](https://github.com/jwtk/jjwt#creating-safe-keys) · [jjwt — Base64 Support](https://github.com/jwtk/jjwt#base64-support)

**Purpose:** private — never called from outside `JwtUtil`. It converts the raw `JWT_SECRET` string into a `SecretKey` object that jjwt can use. Every other method that creates or reads a token calls this first — without the key, nothing else works.

The `JWT_SECRET` environment variable is stored as a **Base64 string**. Base64 is a way to represent binary data (raw bytes) as plain text — so you can store it safely in a config file or environment variable without special characters causing problems.

jjwt cannot use the Base64 text directly as a key. It needs the raw bytes that the Base64 string represents. `getSigningKey()` does that conversion in two steps:

```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
}
```

**`Decoders.BASE64.decode(secret)`** — `Decoders` is a jjwt utility class from `jjwt-api`. It takes the Base64 string (e.g. `"K7fqJk2m..."`) and converts it back to the original raw bytes — a `byte[]`. This is the reverse of what Base64 encoding does.

**`Keys.hmacShaKeyFor(keyBytes)`** — `Keys` is another jjwt utility class. The raw `byte[]` is just a list of numbers — Java's cryptography system does not accept it directly for signing. It requires a specific object type called `SecretKey`. This method takes the raw bytes and creates a `SecretKey` object — same bytes inside, just wrapped in the type that both `.signWith()` and `.verifyWith()` accept. It also checks that the key is long enough for HMAC-SHA256 (at least 256 bits = 32 bytes). If too short, it throws at startup rather than producing weak signatures silently.

### generateToken() — building the signed token

Docs: [jjwt — Creating a JWT](https://github.com/jwtk/jjwt#creating-a-jwt)

**Purpose:** called by `AuthService` when a user logs in successfully. It takes the user's email, builds a signed JWT with an expiry time, and returns the token string that the server sends back to the client. The client stores this token and sends it on every future request.

```java
public String generateToken(String username) {
    return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
}
```

**`.subject(username)`** — stores the user's email in the `sub` (subject) claim. This is the standard JWT way to identify who the token belongs to. When validating later, you call `parseClaims(token).getSubject()` to read it back.

**`.issuedAt(new Date())`** — stores the current timestamp in the `iat` (issued at) claim. Not required, but good practice — tells the recipient exactly when the token was created.

**`.expiration(new Date(System.currentTimeMillis() + expiration))`** — stores the expiry timestamp in the `exp` claim. `new Date(long)` takes a timestamp in milliseconds since January 1, 1970. `currentTimeMillis()` gives you now. Adding `expiration` (86400000 = 24 hours in ms) gives you the exact moment 24 hours from now. jjwt checks this automatically during `parseSignedClaims` — if the token is past this time, it throws `ExpiredJwtException` and you never get a `Claims` object back.

**`.signWith(getSigningKey())`** — signs the header + payload with the secret key. The signature is the third part of `header.payload.signature`. Without this, anyone could change the payload and the server would have no way to detect it.

**`.compact()`** — assembles everything: Base64URL-encodes the header and payload, computes the signature, joins all three parts with dots, and returns the final compact JWT string.

### parseClaims() — reading the token payload

Docs: [jjwt — Reading a JWT](https://github.com/jwtk/jjwt#reading-a-jwt)

**Purpose:** private helper — never called from outside `JwtUtil`. Both `extractUsername` and `isValid` depend on it. It verifies the token signature, checks the expiry, and returns the payload as a `Claims` map. If anything is wrong (expired, tampered, malformed), it throws `JwtException` — the caller never gets `Claims` back.

```java
private Claims parseClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}
```

**`Jwts.parser()`** — the starting point for reading a token, the same way `Jwts.builder()` is the starting point for creating one. Returns a builder you configure before parsing.

**`.verifyWith(getSigningKey())`** — sets the secret key the parser will use to check the signature. Must be the same key used in `generateToken()` — if it is different, the signature does not match and `.parseSignedClaims()` throws.

**`.build()`** — locks the parser configuration and returns a ready-to-use `JwtParser`. The builder pattern separates setup from use: you set options (like the signing key) before `.build()`, and after `.build()` you only call parse methods. The returned parser is immutable — safe to reuse across multiple requests without reconfiguring it each time. This is the same `.build()` pattern used in `Jwts.builder()` on the generation side: configure first, then use.

**`.parseSignedClaims(token)`** — does all the work in one call: checks the signature, checks that the token has not expired, and parses the payload. If anything is wrong — wrong signature, expired, malformed string — it throws `JwtException` immediately. You only get a result back if everything is valid.

**`.getPayload()`** — extracts the claims map from the result. The map contains the values stored when the token was created: `sub` (email), `iat` (issued at), `exp` (expiration).

### extractUsername() — reading the subject claim

**Purpose:** called by `JwtFilter` as the first step when a request arrives. The filter needs to know which user sent the request before it can look them up in the database. This method extracts that email from the token payload.

```java
public String extractUsername(String token) {
    return parseClaims(token).getSubject();
}
```

**`parseClaims(token)`** — verifies the token and returns the `Claims` map. Throws `JwtException` if the token is invalid or expired — that exception is intentionally not caught here. The caller (`isValid()`) handles it.

**`.getSubject()`** — reads the `sub` key from the `Claims` map. Returns the email we stored when the token was created.

### isValid() — full validation check

**Purpose:** called by `JwtFilter` after loading the user from the database. It answers one question: can I trust this token? It checks that the token is structurally valid (not expired, not tampered with) and that the email inside matches the user we just loaded. If yes, the filter allows the request through.

```java
public boolean isValid(String token, String email) {
    try {
        return extractUsername(token).equals(email);
    } catch (JwtException e) {
        return false;
    }
}
```

**`extractUsername(token).equals(email)`** — `extractUsername` calls `parseClaims` internally, which throws `JwtException` if the token is expired, tampered with, or malformed. If it does not throw, the token is structurally valid — then you also check that the email inside matches the one you expect. Both checks happen in one line.

**`catch (JwtException e) { return false }`** — any JWT problem (expired, wrong signature, malformed) lands here. Returning `false` is cleaner than letting the exception propagate — `JwtFilter` just gets a boolean and rejects the request quietly, without a stack trace.

### Full JwtUtil class

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token, String email) {
        try {
            return extractUsername(token).equals(email);
        } catch (JwtException e) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
```

---

## UserDetailsService — teaching Spring where your users are

Docs: [Baeldung — Database-backed UserDetailsService](https://www.baeldung.com/spring-security-authentication-with-a-database) (start here — full working example) · [Spring Security — UserDetailsService](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html) · [DaoAuthenticationProvider — full flow](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider)

> **The official docs are reference-style — they explain what each piece is, not how to wire them together.** For a practical walkthrough with code examples, search **"baeldung spring security userdetailsservice"** — Baeldung (baeldung.com) is the go-to practical companion for Spring developers. Every concept in this file has a Baeldung article next to the official docs. Use both: official docs for the authoritative definition, Baeldung for the "how do I actually write this" example.

File: `src/main/java/com/victor/timetrack/service/UserDetailsServiceImpl.java`

From the DaoAuthenticationProvider flow (see "The full login flow" section above):

- **Step 3** — `DaoAuthenticationProvider` calls `UserDetailsService.loadUserByUsername(email)` to load the user from your database
- **Step 4** — `DaoAuthenticationProvider` takes the `UserDetails` object returned by step 3 and uses `PasswordEncoder` to compare the stored hash with what the user sent

This means `UserDetailsService` has one job: receive an email, go to the database, return a `UserDetails` object. `DaoAuthenticationProvider` handles the password check itself — you do not do that here.

You never call `loadUserByUsername()` yourself. Spring Security calls it automatically during login. Your only job is to implement it correctly and register the class as a `@Service` so Spring finds it.

**What is `UserDetails`?**

`UserDetails` is a Spring Security interface that represents a user. It has four things Spring Security needs to work:

- `getUsername()` — the login identifier (email in your case)
- `getPassword()` — the hashed password stored in the database
- `getAuthorities()` — the roles/permissions (e.g. `ROLE_USER`, `ROLE_MANAGER`)
- Four boolean flags — `isEnabled()`, `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()` — each is an account-status check, and if any returns `false`, Spring Security blocks the login (for example, a disabled or locked account). Spring's `User.builder()` defaults all four to `true`, so you only override the ones you actually need.

Spring Security does not know about your `User` entity — it only works with `UserDetails`. Your job is to take your entity and convert it into a `UserDetails` object. That is what the `User.withUsername(...).build()` builder does at the end of `loadUserByUsername()`.

```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())
            .roles("USER") // placeholder — replaced in Step 4 when role is added to the User entity
            .build();
    }
}
```

**`implements UserDetailsService`** — this is a Spring Security interface with one required method. Implementing it is how Spring discovers your custom user lookup logic.

**`private final UserRepository userRepository` + constructor** — `private final` means the field cannot change after the object is created. The constructor receives the dependency from Spring (constructor injection). This is the recommended pattern over `@Autowired` — it makes dependencies explicit and the class easier to test.

**`loadUserByUsername(String username)`** — despite the name, `username` here is the email. Spring Security uses "username" as a generic term for "the identifier used to log in". The method signature is fixed by the interface — you cannot rename the parameter.

**`throws UsernameNotFoundException`** — this is part of the interface contract. It tells Java that this method is allowed to throw that exception. The actual throw happens inside with `.orElseThrow()` — but you must declare it in the signature because the interface requires it.

**`.orElseThrow(() -> new UsernameNotFoundException(...))`** — if no user is found in the database, throw `UsernameNotFoundException`. Spring Security catches this and converts it to a 401 response automatically.

**`org.springframework.security.core.userdetails.User.withUsername(...).password(...).roles(...).build()`** — this is Spring Security's own `User` builder, not your `User` entity. It creates a `UserDetails` object — the type Spring Security works with internally. `.roles()` automatically adds the `ROLE_` prefix that Spring Security expects (so `"MANAGER"` becomes `"ROLE_MANAGER"`).

> **Import conflict to avoid:** Spring Security has its own class called `User` (`org.springframework.security.core.userdetails.User`). Your entity is also called `User`. If you import the Spring Security one, the variable on the left side (`User user = userRepository.findByEmail(...)`) will fail with a type mismatch. Fix: import your entity (`com.victor.timetrack.model.User`) and use the full qualified path for the Spring Security builder (`org.springframework.security.core.userdetails.User.withUsername(...)`).

> **New to Java? Three things on the lines above.** `findByEmail(username)` returns an **`Optional<User>`** — a box that may or may not contain a user — and `.orElseThrow(...)` opens the box or throws when it's empty ([java/09-generics.md — the most common Spring Boot pattern](../../../java/junior/en/09-generics.md#the-most-common-spring-boot-pattern)). The `() -> new UsernameNotFoundException(...)` inside it is a **lambda** — a nameless function Spring runs *only if* the box is empty ([java/12-streams-lambdas.md](../../../java/junior/en/12-streams-lambdas.md#lambda-syntax)). And `throws UsernameNotFoundException` in the signature is the **checked-exception** rule — Java forces you to declare it ([java/11-exceptions.md](../../../java/junior/en/11-exceptions.md)).

---

## BCryptPasswordEncoder — never store plain text passwords

Docs: [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html) — read only the **BCryptPasswordEncoder** section (scroll past DelegatingPasswordEncoder). The official page is confusing because it leads with `DelegatingPasswordEncoder`, which is a more complex wrapper you do not use here. Skip straight to BCrypt. For a clearer explanation with examples, start with [Baeldung — BCrypt password encoding](https://www.baeldung.com/spring-security-registration-password-encoding-bcrypt).

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java` (defined as a `@Bean`)

> **This `@Bean` lives *inside* the `SecurityConfig` class.** If you haven't created that class yet, that's expected — it's step 1 of the creation order, but its full code is near the bottom of this file. Use the [development skeleton](#during-development--open-everything-while-building-jwt) and add this method inside it. The `AuthenticationManager` bean in the next section goes in the same class — both beans share the one `SecurityConfig`.

If the database is ever compromised, plain text passwords expose every user immediately. BCrypt is a one-way hashing algorithm — you cannot reverse a hash back to the original password. Each hash also includes a random "salt", so two users with the same password produce different hashes.

```java
// SecurityConfig.java — define the bean once
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

You do not call `.matches()` yourself. `DaoAuthenticationProvider` calls it internally when you call `authenticationManager.authenticate(...)` in `AuthService`. You only need the bean — Spring Security does the rest.

When you create a new user account (e.g. in `UserService.create()`), you call `.encode()` yourself to hash the password before saving it:

```java
// UserService.java — hash the password before saving a new user
user.setPassword(passwordEncoder.encode(request.getPassword()));
userRepository.save(user);
```

**`new BCryptPasswordEncoder()`** — creates an encoder using BCrypt with the default strength (10 rounds). Higher rounds = slower hashing = harder to brute-force. The default is a good balance for most apps.

> **The cost factor lives inside the hash.** A BCrypt hash starts with `$2a$10$...` — that `10` is the cost it was generated with. `.matches()` reads the cost straight from the stored hash, so login works even when the hash was created with a *different* cost than the encoder's default. That is why the test steps further down can hash a password at cost 12 (and the seed file at cost 10) and both still verify against a default-10 encoder — the number you choose when generating a hash does not have to match the encoder's. So don't worry if the cost factors look inconsistent: each hash carries its own.

**`.matches(raw, encoded)`** — hashes the `raw` string and checks if it matches the stored `encoded` hash. You never need to decode the hash — BCrypt is designed to only go in one direction.

> Never call `.encode()` on a password that is already hashed — you would hash the hash. Always pass only the raw password that came from the user.

---

## AuthenticationManager bean — exposing the login coordinator

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: [Baeldung — AuthenticationProvider in Spring Security](https://www.baeldung.com/spring-security-authentication-provider) (how the manager delegates to a provider) · [Spring Security — AuthenticationManager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager) — read only the **AuthenticationManager** section

Spring Boot auto-configures an `AuthenticationManager` internally — it wires it with your `UserDetailsService` and `PasswordEncoder` automatically. But it does not expose it as a Spring bean by default.

`AuthService` needs to inject it to call `.authenticate()` during login. For that injection to work, you must expose it explicitly with `@Bean`.

```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
```

**`AuthenticationConfiguration config`** — Spring injects this automatically. It is a Spring class that holds the already-configured `AuthenticationManager` — the one wired with your `UserDetailsService` and `PasswordEncoder` beans.

**`config.getAuthenticationManager()`** — retrieves the pre-configured `AuthenticationManager`. You do not build it yourself — Spring already built it using your beans. You just expose it so other classes can inject it.

**`throws Exception`** — required because `getAuthenticationManager()` is declared with `throws Exception` in Spring's source code. You must declare it in your method signature too.

> You never call `authenticationManager()` directly. Spring injects it into `AuthService` automatically. The `@Bean` annotation is what makes injection possible.

---

## DTOs — LoginRequest and AuthResponse

DTOs (Data Transfer Objects) are plain classes that define the shape of data crossing the HTTP boundary — what the client sends in the request body, and what the server sends back in the response. They are not entities and they do not interact with the database.

Both use Lombok annotations to avoid writing boilerplate getters, setters, and constructors by hand.

### LoginRequest

File: `src/main/java/com/victor/timetrack/dto/request/LoginRequest.java`

What the client sends in the body of `POST /api/auth/login`:

```json
{ "email": "user@test.com", "password": "password123" }
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
```

**`@Data`** (Lombok) — generates `getEmail()`, `getPassword()`, `setEmail()`, `setPassword()`, `equals()`, `hashCode()`, and `toString()` automatically. You never write these by hand.

**`@NoArgsConstructor`** (Lombok) — generates a constructor with no arguments. Jackson (the JSON library Spring Boot uses) needs this to deserialize the JSON body into a `LoginRequest` object.

**`@AllArgsConstructor`** (Lombok) — generates a constructor that takes all fields. Useful for tests.

**`@NotBlank`** — a Bean Validation annotation. `@NotBlank` means: not null, not empty, and not just whitespace. When `@Valid` is present on the controller method parameter, Spring validates all `@NotBlank` fields before the method runs. If validation fails, `MethodArgumentNotValidException` is thrown and `GlobalExceptionHandler` returns a 400.

### AuthResponse

File: `src/main/java/com/victor/timetrack/dto/response/AuthResponse.java`

What the server sends back after a successful login:

```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
```

This is the simplest possible DTO — one field. Spring serializes it to JSON automatically via Jackson when the controller returns it inside a `ResponseEntity`.

> Neither DTO extends any class or implements any interface. They are just plain Java classes. Lombok handles the boilerplate; validation annotations handle the input rules.

---

## AuthService — orchestrating the login

File: `src/main/java/com/victor/timetrack/service/AuthService.java`

Docs: [Baeldung — Spring Security form login](https://www.baeldung.com/spring-security-login) (the `authenticate()` flow end to end) · [DaoAuthenticationProvider — full flow](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider) — read the **DaoAuthenticationProvider** section

**Purpose:** called by `AuthController` when a login request arrives. It coordinates the full login: verifies credentials via `AuthenticationManager`, generates a JWT via `JwtUtil`, and returns an `AuthResponse` with the token.

### Why these two dependencies?

`AuthService` needs exactly two things injected:

**`AuthenticationManager`** — you exposed this as a `@Bean` in `SecurityConfig` precisely so it can be injected here. Without that `@Bean` definition, Spring cannot inject it and throws an error at startup. This is the object that coordinates the whole login: it calls `UserDetailsService` to load the user and `PasswordEncoder` to compare passwords.

**`JwtUtil`** — created in Step 1 with `@Component`. Spring already manages it. `AuthService` uses it to generate the token after login succeeds. Both dependencies arrive via the constructor — same pattern as every other class in this project.

```java
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
}
```

**`authenticationManager.authenticate(...)`** — triggers the full Spring Security login flow internally: calls `UserDetailsService.loadUserByUsername()` to load the user from the database, then `PasswordEncoder.matches()` to compare the raw password against the stored hash. If either check fails, it throws `BadCredentialsException` — you do not catch it here. `GlobalExceptionHandler` will handle it and return a clean JSON error.

**`new UsernamePasswordAuthenticationToken(email, password)`** — a Spring Security class that acts as a simple data carrier for a login attempt. It holds two values: the email (principal) and the raw password (credentials). You create it with `new` because it is not a Spring bean — it is just an object you pass to `authenticate()`. `AuthenticationManager` reads the email and password from it and passes them to `DaoAuthenticationProvider`.

**`request.getEmail()` and `request.getPassword()`** — `LoginRequest` uses Lombok's `@Data` annotation, which generates standard getters automatically. So you call `request.getEmail()` instead of accessing the field directly. If `LoginRequest` were a Java record instead, you would call `request.email()` — but with Lombok classes, always use the `get` prefix.

**`jwtUtil.generateToken(request.getEmail())`** — called only after `authenticate()` returns without throwing. At that point the credentials are verified — it is safe to generate the signed JWT. The email goes into the token's `sub` claim, exactly as documented in the `JwtUtil` section above.

**`new AuthResponse(token)`** — wraps the token string in the DTO. `AuthController` will receive this object and Spring will serialize it to JSON automatically before sending it to the client.

> `AuthService` never touches the database directly. It delegates all credential checks to `AuthenticationManager` and all token logic to `JwtUtil`. No `UserRepository` injection here — that separation is intentional.

---

## AuthController — the login endpoint

File: `src/main/java/com/victor/timetrack/controller/AuthController.java`

Docs: [Spring — @RequestMapping](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html) — read only the **Explicit Registrations** and **URI patterns** sections

**Purpose:** receives `POST /api/auth/login`, passes the request to `AuthService`, and returns the token as JSON. This is the only public endpoint in the API — everything else requires a valid JWT.

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
```

**`@RestController`** — marks the class as a controller that returns JSON automatically. Under the hood it bundles two older annotations so you don't write them by hand: `@Controller` (this class handles incoming web requests) and `@ResponseBody` (whatever a method returns becomes the response body as JSON, instead of being treated as the name of an HTML page to render).

**`@RequestMapping("/api/auth")`** — sets the base URL for all endpoints in this class. Every method inside will be under `/api/auth`. Combined with `@PostMapping("/login")`, the full URL is `POST /api/auth/login`.

**`@PostMapping("/login")`** — maps this method to `POST /api/auth/login`. `@PostMapping` is a shortcut for `@RequestMapping(method = RequestMethod.POST)`.

**`@RequestBody LoginRequest request`** — tells Spring to read the JSON body of the request and convert it into a `LoginRequest` object automatically. Spring uses Jackson (included with Spring Boot) to do the conversion.

**`@Valid`** — triggers the validation annotations on `LoginRequest` (`@NotBlank` on email and password). If validation fails, Spring returns a 400 error automatically before the method runs — `AuthService` is never called.

**`ResponseEntity<AuthResponse>`** — the return type that lets you control the HTTP status code. `ResponseEntity.ok(body)` returns status 200 with the body serialized as JSON. Using `ResponseEntity` is the standard in Spring Boot controllers — it makes the status code explicit and visible in the code.

> `AuthController` has no logic — it only receives the request, delegates to `AuthService`, and wraps the result in a `ResponseEntity`. All business logic lives in the service layer.

---

## GlobalExceptionHandler — clean error responses

File: `src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java`

Docs: [Spring — @ControllerAdvice](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html)

**Purpose:** catches exceptions thrown anywhere in the application and converts them into clean JSON responses with the correct HTTP status code. Without this, Spring returns a generic HTML error page or a confusing 500 — the client has no idea what went wrong.

When `AuthService` calls `authenticationManager.authenticate()` and the credentials are wrong, Spring Security throws `BadCredentialsException`. That exception travels up the call stack until something catches it. `GlobalExceptionHandler` is that thing.

> **The version below is the two-handler teaching version, not the class as it stands in TimeTrack today.** It returns a raw `Map.of("error", ...)` body so you can see the mechanism with nothing else in the way. The real `exception/GlobalExceptionHandler.java` in the project has since grown to a shared `ErrorResponse` DTO built by a `buildError(status, message)` helper, a `fieldErrors` map instead of just the first validation error, and handlers for `AccessDeniedException`, `ResourceNotFoundException`, `BusinessRuleViolationException` and more — that is the class you built in [05-exception-handling.md](./05-exception-handling.md). Read this block as "the two handlers security needs"; read `05` for the shape the project actually uses.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return ResponseEntity.badRequest().body(Map.of("error", message));
    }
}
```

**`@RestControllerAdvice`** — marks this class as a global exception handler for all `@RestController` classes. Equivalent to `@ControllerAdvice` + `@ResponseBody`. Spring scans for this annotation at startup and registers the handlers automatically.

**`@ExceptionHandler(BadCredentialsException.class)`** — tells Spring: "when this exception is thrown anywhere in a controller flow, run this method instead of the default error handling". The method parameter receives the exception object. `BadCredentialsException` is thrown by Spring Security when email or password is wrong — it does not tell you which one, for security reasons.

**`HttpStatus.UNAUTHORIZED`** — the correct status code for failed authentication. 401 means "you are not authenticated". 403 means "you are authenticated but not allowed" — that is a different case.

**`Map.of("error", "Invalid email or password")`** — a simple JSON response body. `Map.of()` creates an immutable map (one you cannot add to or change after it is built — perfectly fine here, since the error body never changes). Spring serializes it to `{ "error": "Invalid email or password" }` automatically.

**`@ExceptionHandler(MethodArgumentNotValidException.class)`** — catches validation failures from `@Valid` on `LoginRequest`. Extracts the first field error and returns a 400 with a readable message. Without this, Spring returns a verbose 400 body that is hard to read.

**`.getBindingResult().getFieldErrors().stream().map(...).findFirst()`** — `getBindingResult()` returns all validation errors. `.getFieldErrors()` filters to field-level errors (not global ones). `.stream().map(...).findFirst()` picks the first one and formats it as `"fieldName: error message"`.

> **New to the `.stream().map(...).findFirst()` chain?** This is the **Stream API** — a pipeline that processes a list step by step: `.stream()` opens the list, `.map(err -> ...)` transforms each error into a `"field: message"` string (that `err -> ...` is a lambda again), `.findFirst()` takes the first result as an `Optional`, and `.orElse("Validation failed")` supplies a fallback if the list was empty. Full walkthrough in [java/12-streams-lambdas.md — Stream API](../../../java/junior/en/12-streams-lambdas.md#what-a-stream-is).

> `GlobalExceptionHandler` does not catch `UsernameNotFoundException` directly. Spring Security converts it to `BadCredentialsException` internally — this is intentional. If the API told the client "user not found", an attacker could enumerate valid email addresses. Returning the same error for both cases prevents that.

> **This class only handles the exceptions you register.** Right now that is exactly two: `BadCredentialsException` (→ 401) and `MethodArgumentNotValidException` (→ 400). Any other exception you have not written an `@ExceptionHandler` for still falls through to Spring's default handler and becomes a generic 500. It is not a catch-all — as the app grows you add one handler method per exception type you want to control (you do this for your own custom exceptions in later steps).

---

## ✅ Flow 1 complete — test it in Postman

Flow 1 needs all these classes to exist: `JwtUtil`, `UserDetailsServiceImpl`, `SecurityConfig` (with `PasswordEncoder`, `AuthenticationManager`, `SecurityFilterChain`, `CorsConfigurationSource`), `AuthService`, `AuthController`, `GlobalExceptionHandler`. If any is missing, the app will not start or the login will not work.

> **`SecurityConfig` is the one to double-check here.** The login route only works if a `SecurityFilterChain` permits `/api/auth/**` — or, in the skeleton, permits everything. If you've been reading top to bottom, the `SecurityFilterChain` and `CorsConfigurationSource` code is taught in the two sections *below* this test, so make sure you already created the [development skeleton](#during-development--open-everything-while-building-jwt) (step 1 of the build order) with your `PasswordEncoder` and `AuthenticationManager` beans inside it. Without it, login returns Spring's default login page or a 401 — not your token. For the Flow 1 test, the skeleton (`anyRequest().permitAll()`) is enough; you don't need the locked-down final version or CORS until Flow 2.

### Step 1 — start the app and check for errors

Run the app in IntelliJ (green play button or Shift + F10). Watch the console — it should end with:

```
Started TimetrackApplication in X seconds
```

If you see a red error instead, read the first line of the stack trace. That is always the real cause. Fix it before moving on.

### Step 2 — generate a BCrypt hash for your test password

Go to [bcrypt.online](https://bcrypt.online), type `password123` as the plain text, keep the cost factor at 12, and click "Hash". Copy the result — it looks like `$2a$12$...`.

You cannot reverse a BCrypt hash. The app calls `PasswordEncoder.matches("password123", storedHash)` on every login to compare them — it never decodes.

### Step 3 — insert a test user in pgAdmin

Open pgAdmin → your database → right-click the database → Query Tool. Run:

```sql
INSERT INTO users (name, email, password)
VALUES ('Test User', 'test@test.com', '$2a$12$PASTE_YOUR_HASH_HERE');
```

Replace `$2a$12$PASTE_YOUR_HASH_HERE` with the full hash you copied in step 2. Then run this to confirm the user is there:

```sql
SELECT * FROM users;
```

### Step 4 — test the happy path in Postman

Open Postman. Click **New → HTTP Request**.

- Set the method to **POST** (dropdown on the left of the URL bar)
- Enter the URL: `http://localhost:8080/api/auth/login`
- Click the **Body** tab → select **raw** → change the format dropdown from "Text" to **JSON**
- Paste this into the body:

```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

Click **Send**. Expected response — status **200 OK**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Copy the full token value** — you will need it to test Flow 2.

### Step 5 — test the error path

Send the same request but with the wrong password:

```json
{
  "email": "test@test.com",
  "password": "wrongpassword"
}
```

Expected response — status **401 Unauthorized**:

```json
{
  "error": "Invalid email or password"
}
```

If you get a 401 with your custom message, `GlobalExceptionHandler` is working correctly. If you get a long JSON with `"status": 401` and a `"path"` field, Spring's default error handler is still running — check that `@RestControllerAdvice` is on the class.

### Step 6 — test validation

Send a request with an empty email:

```json
{
  "email": "",
  "password": "password123"
}
```

Expected response — status **400 Bad Request**:

```json
{
  "error": "email: must not be blank"
}
```

If all three cases work — 200, 401, 400 — Flow 1 is fully working.

---

## 🔒 Flow 2 starts here — protected requests

Everything below this line validates the JWT token that was issued in Flow 1. The classes above build the login endpoint. The classes below protect every other endpoint.

---

## OncePerRequestFilter — the JWT filter

File: `src/main/java/com/victor/timetrack/security/JwtFilter.java`

Docs: [Spring Security — Filter Chain Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filters-review)

`OncePerRequestFilter` is the correct base class for a JWT filter — Spring guarantees it runs exactly **once** for a given request, even if that request gets forwarded internally to another servlet during normal processing (so you never accidentally re-check the same token twice for one client call).

> **"Once" has a second, less obvious side.** The same guarantee has a flip side that matters a lot once you hit the bug below: by default, `OncePerRequestFilter` **skips itself entirely** when the dispatch is an internal `ERROR` forward (Tomcat re-routing a request to `/error` after an uncaught exception) or an `ASYNC` dispatch. That is not a bug — it exists so your filter's business logic (checking a token) does not run again on an internal, synthetic re-dispatch of a request it already saw. But it has a sharp edge: if `JwtFilter` itself is the thing that crashes, the forward to `/error` that follows will **not** go through `JwtFilter` again — see "Why a filter can't rely on `GlobalExceptionHandler`" below.

Every HTTP request passes through this filter before reaching any controller. The filter reads the JWT from the `Authorization` header, validates it, and — if valid — sets the authentication in `SecurityContextHolder`. Once that is set, Spring Security knows who is making the request and applies the route rules from `SecurityFilterChain`.

**Decision flow — what happens inside every request:**

```
Request arrives
      │
      ▼
Has "Authorization" header?
  NO ────────────────────────→ filterChain.doFilter() → pass through
      │                        (SecurityFilterChain rejects if auth required)
  YES
      ▼
Starts with "Bearer "?
  NO ────────────────────────→ filterChain.doFilter() → pass through
      │
  YES → strip "Bearer " prefix (7 chars) → raw token
      ▼
try { JwtUtil.extractUsername(token) → get email from "sub" claim
      │
      ▼
      Already authenticated this request? (getAuthentication() != null)
        YES ───────────────────────→ skip — already processed
            │
        NO
            ▼
      UserDetailsService.loadUserByUsername(email) → loads user from DB
            │
            ▼
      JwtUtil.isValid(token, email)?
        NO ────────────────────────→ do nothing → falls through to filterChain.doFilter()
            │
        YES
            ▼
      SecurityContextHolder.setAuthentication(
        new UsernamePasswordAuthenticationToken(userDetails, null, authorities)
      )
} catch (JwtException | UsernameNotFoundException e) {
      logger.warn(...)   ← swallow it, do NOT rethrow — see below
}
      │
      ▼
filterChain.doFilter() → continues to SecurityFilterChain → controller
      │                   (no auth set → JwtAuthenticationEntryPoint → 401)
```

**SecurityContextHolder — lifecycle per request:**

```
Request arrives
      │
      ▼
JwtFilter sets SecurityContextHolder   ← thread-local storage
      │                                   (isolated per thread — each request
      ▼                                    has its own copy, never shared)
SecurityFilterChain  ──reads──┐
@PreAuthorize        ──reads──┤  all read the same SecurityContextHolder
@RestController      ──reads──┘
      │
      ▼
Request ends → SecurityContextHolder is cleared automatically
```

It is **thread-local** — each request runs on its own thread. The next request from the same user starts fresh and goes through `JwtFilter` again. This is why the `getAuthentication() == null` check is safe — you are never reading another user's auth by accident.

> **What is a "thread" here?** When a request reaches the server, Spring runs it from start to finish on one worker thread (think of a thread as one worker handling one request at a time). *Thread-local* storage means every thread gets its own private copy of the `SecurityContextHolder`. So even if 50 users hit the API at the same moment — 50 threads running in parallel — none of them can see another user's data, because each reads only its own copy. When the request finishes, Spring clears that copy automatically.

```java
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractUsername(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtUtil.isValid(token, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                        );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException | UsernameNotFoundException e) {
            logger.warn("Invalid JWT token: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
```

> **The three method parameters first.** `HttpServletRequest request` is Java's raw incoming-request object — you read headers, the body and the URL from it. `HttpServletResponse response` is the raw outgoing-response object — you write the status and headers to it. `FilterChain filterChain` is the ordered list of the remaining filters; calling `filterChain.doFilter(...)` hands the request to the next one (fully explained at the end of this section).

**`request.getHeader("Authorization")`** — reads the `Authorization` header. The Angular interceptor sends `Bearer <token>` here on every request.

**`if (authHeader == null || !authHeader.startsWith("Bearer "))`** — if there is no token (public route, or user not logged in), skip everything and pass the request through. The `SecurityFilterChain` rules will block it if authentication is required.

**`authHeader.substring(7)`** — removes the `"Bearer "` prefix (7 characters) to get just the token string.

**`SecurityContextHolder.getContext().getAuthentication() == null`** — only set the authentication if it has not been set already. Prevents processing the same request twice if it passes through the filter more than once.

**Why load the user from the database if the token already has the email?** The token was signed at login and cannot be modified — but the user's state in the database can change after the token was issued. The account might have been deleted, banned, or had its role changed. Loading `UserDetails` from the database ensures you are working with the current state of the account, not a snapshot from when the token was created.

**`UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())`** — creates the authentication object that goes into `SecurityContextHolder`. The three arguments are: the principal (who), the credentials (null — no password needed here), and the authorities (roles). Once this is in the `SecurityContextHolder`, Spring Security considers the user authenticated for this request.

> **2-arg vs 3-arg — two different meanings, same class.** `AuthService` (Flow 1) built a 2-arg version: `new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())` — email and *raw* password, handed to `authenticationManager.authenticate()` as an unverified login **attempt** still waiting to be checked. `JwtFilter` (Flow 2) builds the 3-arg version here — principal, `null` credentials, authorities — which is not an attempt at all: it is a **confirmed** authentication, already proven by the valid JWT signature, ready to be stored directly in `SecurityContextHolder`. The number of arguments is the tell: 2-arg always means "please verify this", 3-arg always means "this is already verified, here are the roles". That is also why Flow 2 passes `null` for credentials — there is no password to check anymore, the token already did that job.

**`filterChain.doFilter(request, response)`** — `filterChain` is the ordered list of all filters in the chain. Calling `.doFilter()` means: "I am done — pass this request to the next filter in the chain". Every filter that does not want to block a request must call this, otherwise the request is dropped silently.

`JwtFilter` calls it in two places:

1. **Early return (no token):** `JwtFilter` has nothing to do — it calls `filterChain.doFilter()` immediately and returns. The request continues through the chain and eventually reaches `SecurityFilterChain`, which checks the route rules.

2. **At the end (after processing):** whether the token was valid or not, `JwtFilter` always calls `filterChain.doFilter()` at the very end. This is important: `JwtFilter`'s job is not to block requests — it only sets (or does not set) the user in `SecurityContextHolder`. Blocking is `SecurityFilterChain`'s job. If the token was invalid and nothing was set in `SecurityContextHolder`, `SecurityFilterChain` will reject the request because `authenticated()` is not satisfied.

### Why a filter can't rely on `GlobalExceptionHandler`

The version of `JwtFilter` above wraps `extractUsername` and `loadUserByUsername` in a `try/catch`. Without it, sending a request with a tampered token (change one character of the signature) does not fail cleanly — it produces a very specific, misleading bug.

**What actually happens with no `try/catch`:**

```
1. jwtUtil.extractUsername(token) throws SignatureException (uncaught)
2. No catch anywhere in JwtFilter → the exception climbs the call stack
3. GlobalExceptionHandler (@RestControllerAdvice) never sees it —
   it only intercepts exceptions thrown FROM INSIDE a @Controller method.
   JwtFilter runs earlier in the pipeline, before the DispatcherServlet
   even routes the request to a controller:

   Request → [security filters incl. JwtFilter] → DispatcherServlet → @Controller
                        ↑ exception happens here      ↑ @RestControllerAdvice only
                          — outside MVC's reach          watches from here onward

4. Uncaught exception reaches Tomcat → Spring Boot's default error handling
   makes Tomcat do an INTERNAL FORWARD of the same request to "/error"
   (not a new HTTP request — the same one, re-routed server-side)
5. OncePerRequestFilter skips itself on an ERROR dispatch by default
   (see the callout above) → JwtFilter does NOT run on this second pass
   → SecurityContextHolder stays empty for the /error request
6. "/error" is not excluded from .anyRequest().authenticated() in
   SecurityConfig → Spring Security rejects it as unauthenticated
   → jwtAuthenticationEntryPoint.commence() fires → client gets 401
```

The client receives a normal-looking `401 Unauthorized` with the exact same body as "no token sent at all":

```json
{
    "error": "Unauthorized",
    "message": "Authentication required",
    "status": 401,
    "timestamp": "2026-07-15T09:22:19.647166500Z"
}
```

> **Why this is worse than an obvious bug.** The response *looks* correct — a bad token really should result in a 401. But it is the wrong 401, produced by the wrong mechanism, entirely by coincidence of how `/error` is (not) excluded from the security rules. The real event — an unhandled `RuntimeException` inside a servlet filter — still happened underneath and still gets logged as a server-side error:
> ```
> ERROR ... o.a.c.c.C.[.[.[/].[dispatcherServlet]  : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception
> io.jsonwebtoken.security.SignatureException: JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.
> 	at io.jsonwebtoken.impl.DefaultJwtParser.verifySignature(...)
> 	at com.victor.timetrack.security.JwtUtil.parseClaims(JwtUtil.java:49)
> 	at com.victor.timetrack.security.JwtUtil.extractUsername(JwtUtil.java:34)
> 	at com.victor.timetrack.security.JwtFilter.doFilterInternal(JwtFilter.java:39)
> ```
> If `/error` were ever excluded from `.anyRequest().authenticated()` for some other reason (e.g. to serve a custom error page), this same tampered token would suddenly return a raw `500` instead — because the accidental 401 mechanism would no longer apply. A fix that only "looks right" by accident is not a fix.

**How to actually notice this kind of bug.** Postman only shows you what the *client* received — it cannot tell you whether that status code was produced by the mechanism you intended. The tell is a mismatch between the two sides: if the backend console prints an `ERROR`-level stack trace (`Servlet.service() ... threw exception`) for a request you expected to be handled cleanly by `GlobalExceptionHandler` or `JwtAuthenticationEntryPoint`, that is proof something crashed outside your intended flow — regardless of what the client ended up seeing. A clean, expected 401 through `JwtAuthenticationEntryPoint` never logs at `ERROR` level, because it is not a failure — it is normal authentication rejection.

**The fix — catch inside the filter, don't rethrow:**

```java
try {
    String email = jwtUtil.extractUsername(token);
    // ... rest of the logic
} catch (JwtException | UsernameNotFoundException e) {
    logger.warn("Invalid JWT token: " + e.getMessage());
}
```

**`catch (JwtException | UsernameNotFoundException e)`** — a *multi-catch*: one `catch` block handling two unrelated exception types the same way, joined with `|`. `JwtException` is the common superclass for everything `jjwt` can throw while parsing a token — `SignatureException` (tampered), `ExpiredJwtException` (past the 24h expiry from `application.properties`), `MalformedJwtException` (not a valid JWT string at all). Catching the **supertype** rather than one concrete subclass matters here: a `catch (SignatureException e)` would still let an `ExpiredJwtException` through uncaught, because they are sibling subclasses, not parent/child. `UsernameNotFoundException` covers the other failure path: the email inside a *still cryptographically valid* token no longer matches any row in `users` — for example, the account was soft-deleted after the token was issued (`UserDetailsServiceImpl.loadUserByUsername`, line 21: `.orElseThrow(() -> new UsernameNotFoundException(...))`).

> **Why not `throw new RuntimeException(...)` inside the `catch`?** That was the tempting fix, and it does not work — for the exact same reason the original bug existed. Rethrowing *anything* from inside a servlet filter still lands outside `GlobalExceptionHandler`'s reach; you would just be re-creating the same uncaught-exception-in-a-filter problem with a different exception type. The correct pattern in a security filter is not "throw and let something translate it" — it is "leave `SecurityContextHolder` empty and call `filterChain.doFilter()` anyway". A component further down the chain that *does* understand "no authentication present" (the `AuthorizationFilter` enforcing `.anyRequest().authenticated()`) takes over from there, and it already knows how to turn that into a real, intentional 401 via `jwtAuthenticationEntryPoint`. The filter's job is only ever to set or not set the context — never to decide the HTTP response itself.

> **Why `logger.warn(...)` and not `logger.error(...)`?** `OncePerRequestFilter` already exposes a protected `logger` field, so no `@Slf4j` or manual declaration is needed. The distinction between the two levels is not cosmetic — `ERROR` is reserved for things that should never happen in normal operation (a bug, a dependency outage) and is what monitoring tools (Sentry, Datadog, on-call alerts) watch for. A tampered or expired token is not a bug — tokens are *designed* to expire, and malicious/malformed tokens are routine background noise on any public API. Logging it at `ERROR` would mean a legitimate user's session expiring — something that happens constantly — pages an on-call engineer as if the server were broken. `WARN` records the event for later debugging without triggering that alarm.

---

## SecurityFilterChain — one place for all security rules

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: [Baeldung — adding a custom filter to the chain](https://www.baeldung.com/spring-security-custom-filter) (the `addFilterBefore` pattern, with code) · [Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html) · [Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)

`SecurityFilterChain` is the single bean that configures all security rules for your API. Every JWT app needs the same three things:

| #   | What                 | Why                                                                               |
| --- | -------------------- | --------------------------------------------------------------------------------- |
| 1   | Disable CSRF         | JWT uses headers, not cookies — CSRF attacks are impossible                       |
| 2   | `STATELESS` sessions | JWT carries all information — no server session needed                            |
| 3   | Route rules          | Which routes are public (`permitAll`) and which require a token (`authenticated`) |

### During development — open everything while building JWT

Use this version while you are still building the JWT flow. It lets you test endpoints freely in Postman without needing a token yet.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
```

**`@Configuration`** — marks this class as a place where beans are defined. At startup, Spring reads the class and runs every `@Bean` method inside it, registering what they return.

**`@EnableWebSecurity`** — switches on Spring Security's filter chain and tells Spring to use *your* `SecurityFilterChain` bean instead of its default one. Without this annotation, your security rules are never applied.

**`HttpSecurity http`** — you do not create this object; Spring passes it into the method for you. You call its chained methods (`.csrf()`, `.sessionManagement()`, `.authorizeHttpRequests()`, …) to describe the rules step by step, and `http.build()` turns all of that into the finished filter chain that gets returned.

> **What is `csrf -> csrf.disable()`?** Each of these is a **lambda** — a mini-function you hand to Spring Security to describe one rule. Read `csrf -> csrf.disable()` as: "Spring gives you the `csrf` config object; call `.disable()` on it." The exact same shape repeats for `session -> ...`, `auth -> ...` and `cors -> ...` in the final version below — the word before `->` is just a name *you* pick for the object Spring passes in, so `auth` and `csrf` are not keywords, only labels. Full explanation in [java/12-streams-lambdas.md — Lambda expressions](../../../java/junior/en/12-streams-lambdas.md#lambda-syntax).

### Final version — protect all routes, add JWT filter

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**`@EnableMethodSecurity`** — enables `@PreAuthorize` on individual methods. Without this annotation, `@PreAuthorize` is silently ignored — no error, just no protection.

**`.requestMatchers("/api/auth/**").permitAll()`** — opens every URL under `/api/auth/` (login, register) without a token. The `/**` matches any path below that prefix.

**`.anyRequest().authenticated()`** — every other URL requires a valid JWT. Order matters: `requestMatchers` rules are checked first, in the order they are declared. `.anyRequest()` is always last — it is the catch-all.

**`.csrf(csrf -> csrf.disable())`** — CSRF (Cross-Site Request Forgery) is an attack where a malicious website tricks your browser into making a request to your API. It works because browsers automatically include cookies with every request to a domain. JWT does not use cookies — the token lives in `localStorage` and is attached manually by Angular in the `Authorization` header. Browsers never send custom headers automatically to other domains, so the attack does not apply. CSRF protection is not needed and disabling it removes a source of confusing 403 errors.

**`.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`** — inserts your `JwtFilter` into the filter chain, just before Spring's default authentication filter. This ensures the JWT is validated before Spring tries its own (form-based) authentication logic.

**`.cors(cors -> cors.configurationSource(corsConfigurationSource()))`** — applies the CORS rules defined in the `corsConfigurationSource()` bean. CORS must be configured inside Spring Security — not with `@CrossOrigin` — so the Security layer handles it before blocking the request.

> The code block above omits `authenticationManager()` and `corsConfigurationSource()` for clarity. Both must be inside the same `SecurityConfig` class. `authenticationManager()` was defined in the previous step. `corsConfigurationSource()` is defined in the CORS section below — add it after `authenticationManager()`.

---

## AuthenticationEntryPoint — 401 instead of the default empty 403

Purpose: intercepts the exact moment Spring Security detects a request has **no valid authentication at all** (no token, or a token so broken it can't even be processed) and controls what to respond with — instead of letting Spring apply its default behavior.

File: `src/main/java/com/victor/timetrack/security/JwtAuthenticationEntryPoint.java`

Docs: [Baeldung — Handle Spring Security Exceptions](https://www.baeldung.com/spring-security-exceptions) → read: the `AuthenticationEntryPoint` section, where `commence()` writes the error JSON straight onto the response

With no configuration, when a request with no token reaches a protected endpoint (`.anyRequest().authenticated()`), Spring Security returns **403 Forbidden with no body at all**. This is exactly the mistake already flagged in "Common mistakes" below: **403 isn't the right code here**. The HTTP distinction is:

- **401 Unauthorized** — "I don't know who you are." There's no authentication, or what's there is invalid.
- **403 Forbidden** — "I know who you are, but you're not allowed." The user is authenticated with a valid token, but is missing the required role.

> Internally, Spring Security throws two different exception types for these two cases: `AuthenticationException` when there's no authentication at all, and `AccessDeniedException` when there is authentication but authorization fails (the latter is the one you catch in `GlobalExceptionHandler` with `@ExceptionHandler(AccessDeniedException.class)` — see the exception handling section). The component that decides what to do with each is different: `AuthenticationEntryPoint` for the first, your regular `@RestControllerAdvice` for the second — because `AccessDeniedException` does reach the controller layer, while `AuthenticationException` gets resolved earlier, inside the security filter itself.

**Why can't you fix this with a regular `@ExceptionHandler`, the way you did with `AccessDeniedException`?** Because the rejection for missing authentication happens **before** the request ever reaches a controller — it happens inside Spring Security's filter chain, a layer that runs entirely before Spring MVC (and therefore your `@RestControllerAdvice`) ever comes into play. `@ExceptionHandler` can only catch exceptions thrown from inside a controller method or below it — not from a filter that hasn't even let the request get that far.

```java
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(Instant.now());
        errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        errorResponse.setError(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorResponse.setMessage("Authentication required");

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
```

> **Don't forget `@Component`.** Without this annotation, the class compiles perfectly fine on its own — the error only shows up when the application starts, when Spring tries to build `SecurityConfig` and discovers it has no bean of type `JwtAuthenticationEntryPoint` to inject into its constructor. The exact message is: `Parameter 1 of constructor in com.victor.timetrack.security.SecurityConfig required a bean of type 'com.victor.timetrack.security.JwtAuthenticationEntryPoint' that could not be found.` `@Component` is what tells Spring "manage this class yourself, create it automatically, and make it available for injection" — without it, the class exists as plain Java code, but outside Spring's control, so no constructor can request it as a dependency.

**`implements AuthenticationEntryPoint`** — this Spring Security interface requires a single method, `commence(...)`, which Spring calls automatically whenever a request with no valid authentication tries to reach a protected resource. The name comes from the fact that this method is literally where the process of asking the client to authenticate "commences" — in a traditional web app with form login, this is where you'd redirect to the login page; in a JWT API, this is where you return the JSON error instead.

**`ObjectMapper objectMapper`** — Jackson's class (the library Spring Boot uses to convert between JSON and Java objects) for turning a Java object into JSON text. In a regular `@RestController` you never see it because Spring uses it automatically for you behind `return ResponseEntity...`. Here, since you're outside the world of controllers (inside a low-level security component), you have to call it yourself. It's injected through the constructor because Spring Boot already has an `ObjectMapper` configured as a bean available in the container — the same one it uses internally for all your normal responses, so you don't need to create a new one.

**`response.setStatus(...)` / `response.setContentType(...)`** — unlike an `@ExceptionHandler`, where you simply return a `ResponseEntity` and Spring builds the HTTP response for you, here you write directly onto the `HttpServletResponse` object — the low-level object representing the raw HTTP response, before any concept of "controller" or "DTO" exists. You have to set the status code and content type by hand, one at a time.

**`objectMapper.writeValue(response.getWriter(), errorResponse)`** — `response.getWriter()` gives you the response's write channel; `writeValue(destination, object)` serializes `errorResponse` to JSON and writes it there directly, in one step. It's the same work a `@RestControllerAdvice` does for you automatically — here you do it by hand because there's no controller in the middle to do it for you.

Wire it into `SecurityConfig` with `.exceptionHandling(...)`:

```java
private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

public SecurityConfig(JwtFilter jwtFilter, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
    this.jwtFilter = jwtFilter;
    this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
}

@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .exceptionHandling(exceptions -> exceptions
            .authenticationEntryPoint(jwtAuthenticationEntryPoint)
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}
```

**`.exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint))`** — tells the filter chain: "when you detect there's no valid authentication, don't use your default behavior — use this `AuthenticationEntryPoint` instead". Without this line, the `JwtAuthenticationEntryPoint` class compiles perfectly fine but Spring Security never calls it — it keeps applying the same old empty 403.

The resulting JSON when hitting a protected endpoint with no token at all:

```json
{
    "timestamp": "2026-07-09T09:30:00.000Z",
    "status": 401,
    "error": "Unauthorized",
    "message": "Authentication required"
}
```

---

## CORS — allowing Angular to call the API

Docs: [Baeldung — CORS with Spring](https://www.baeldung.com/spring-cors) (start here — clear, full example) · [Spring Security — CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)

CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks JavaScript from calling a server on a different origin. When Angular (localhost:4200) calls Spring Boot (localhost:8080), the browser blocks it — different ports = different origins.

Configure CORS inside `SecurityConfig` — not with `@CrossOrigin` on every controller. That way the Security layer handles it consistently for every endpoint.

**How the preflight works:**

```
Angular sends POST /api/auth/login
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Browser — same-origin check                             │
│   Angular is on localhost:4200                          │
│   Spring Boot is on localhost:8080                      │
│   different port = different origin → CORS applies      │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Browser sends preflight OPTIONS request first           │
│   Origin: http://localhost:4200                         │
│   Access-Control-Request-Method: POST                   │
│   Access-Control-Request-Headers: Authorization         │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Spring Boot CORS filter (corsConfigurationSource)       │
│   is "http://localhost:4200" in allowedOrigins? YES     │
│   responds with:                                        │
│     Access-Control-Allow-Origin: http://localhost:4200  │
│     Access-Control-Allow-Methods: GET, POST, PUT, ...   │
│     Access-Control-Allow-Headers: *                     │
└─────────────────────────────────────────────────────────┘
         │
         ▼
Browser receives OK → sends the real POST request
         │
         ▼
Spring processes the request normally
```

> The CORS error only appears in the **browser** — Postman never sends a preflight, so CORS errors are invisible in Postman. If your Angular app gets a CORS error but Postman works, the fix is always on the server.

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

**`setAllowedOrigins(List.of("http://localhost:4200"))`** — only requests from this origin are allowed. In production you would change this to your deployed Angular URL.

**`setAllowedMethods(...)`** — the HTTP methods Angular is allowed to use. `OPTIONS` must be included — the browser sends a preflight `OPTIONS` request before every `POST`, `PUT`, etc. to check if CORS is allowed.

**`setAllowedHeaders(List.of("*"))`** — allows any request header. This is needed so the `Authorization: Bearer <token>` header is not blocked.

**`setAllowCredentials(true)`** — allows cookies and `Authorization` headers to be sent cross-origin. Required for JWT to work.

> **Why not just allow every origin with `"*"`?** Because `setAllowCredentials(true)` and `setAllowedOrigins(List.of("*"))` cannot be used together — Spring throws an error at startup and the browser rejects the response. The wildcard `"*"` means "anyone", and "anyone **plus** send credentials" is a security hole the CORS spec forbids. If you ever genuinely need a wildcard with credentials, the replacement is `setAllowedOriginPatterns(List.of("*"))`. In this project you list the exact Angular origin, so the trap never bites — but it is the single most common CORS mistake juniors hit, so it's worth recognising.

**`source.registerCorsConfiguration("/**", config)`** — applies this CORS config to every URL in the API.

> The CORS error only appears in the browser — it is not a backend bug. The browser blocks the response, not the request. The fix is always on the server.

---

## @PreAuthorize — method-level authorization

Docs: [Baeldung — Spring Method Security](https://www.baeldung.com/spring-security-method-security) (`@PreAuthorize` with `hasRole`, full example) · [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)

Requires `@EnableMethodSecurity` on `SecurityConfig` — without it, `@PreAuthorize` is silently ignored.

`SecurityFilterChain` controls which routes need a token. `@PreAuthorize` goes one step further — it controls which roles can use a specific method, after the JWT filter has already confirmed who the user is.

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}
```

> **Why is there code inside a string?** The text inside `@PreAuthorize("...")` is **SpEL** (Spring Expression Language), not Java. Spring evaluates it at runtime, right before the method runs. `hasRole(...)`, `hasAuthority(...)` and `authentication` are built-in helpers Spring gives you for security checks — you can only use them inside these security annotation strings, not in normal Java code.

**`hasRole('MANAGER')`** — checks that the authenticated user has the `ROLE_MANAGER` authority. Spring Security adds the `ROLE_` prefix automatically, so you write `'MANAGER'` here and `.roles("MANAGER")` in `UserDetailsServiceImpl`.

**`hasAuthority('ROLE_MANAGER')`** — the same check, but you write the full string including `ROLE_`. Both work — `hasRole` is the shorter version.

> The method body returns `ResponseEntity.noContent().build()` — HTTP **204 No Content**, the standard reply for a successful `DELETE` that has nothing to send back. (Full status-code guidance in [02-rest-controllers.md](./02-rest-controllers.md).)

---

## Common mistakes

**Forgetting `SessionCreationPolicy.STATELESS`** — Spring creates HTTP sessions by default. Without this, you get sessions AND JWT at the same time, which conflict and waste memory.

**Wrong filter order** — `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` is required. If the JWT filter runs after Spring's default filter, the request is rejected before your filter has a chance to authenticate it.

**CSRF enabled with JWT** — CSRF is for cookie-based sessions. If you leave it on, every non-GET request will be rejected with a 403 for missing a CSRF token.

**Returning 403 instead of 401** — 401 means "not authenticated" (no token or invalid). 403 means "authenticated but not allowed" (wrong role). Spring Security's default entry point returns an empty 403 for *both*, which is wrong for the first case. The fix is the `JwtAuthenticationEntryPoint` registered with `.exceptionHandling(...)` — you already built it in [the AuthenticationEntryPoint section](#authenticationentrypoint--401-instead-of-the-default-empty-403), so TimeTrack answers a no-token request with a proper 401 JSON body. If you copy this security layer into a new project and forget that one `.exceptionHandling(...)` line, the empty 403 comes straight back.

**`@PreAuthorize` silently ignored** — if you forget `@EnableMethodSecurity` on `SecurityConfig`, the annotation does nothing and every role can access the protected endpoint. No error — the protection just does not exist.

**`AccessDeniedException` with no specific handler → 500 instead of 403** — when `@PreAuthorize("hasRole('MANAGER')")` rejects a user without the right role, Spring throws `org.springframework.security.access.AccessDeniedException`. This class extends `RuntimeException`, so if your `@RestControllerAdvice` only has a generic catch-all for `RuntimeException` (and no specific `@ExceptionHandler(AccessDeniedException.class)`), that exception falls into the catch-all and returns a 500 — even though a role rejection is a perfectly normal case, not an unexpected server failure.

```java
// No specific handler — the catch-all wrongly intercepts AccessDeniedException
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}

// With the correct handler, ahead of the catch-all
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(buildError(HttpStatus.FORBIDDEN, "You don't have permission to perform this action"));
}
```

> The order of methods inside the class doesn't matter to Spring — `@RestControllerAdvice` always looks for the **most specific** handler matching the exact type of the thrown exception, before falling back to the generic catch-all. It doesn't matter whether `handleAccessDenied` sits before or after `handleRuntime` in the file; what matters is that it exists at all.

> **Don't confuse this with your own custom `UnauthorizedException`.** If you already have a custom exception (say, one you throw by hand in the service when an employee tries to act on data that isn't theirs) that also maps to 403, it won't catch `AccessDeniedException` — the two classes have no inheritance relationship. `AccessDeniedException` is thrown by the framework itself, inside the `@PreAuthorize` mechanism; your exception is thrown by you, in your own business logic. You need one `@ExceptionHandler` per exception, even if both end up returning the same HTTP code.

---

## Step 4 — Role-based authorization

Steps 1–3 built authentication: any authenticated user could call any endpoint. Step 4 adds authorization: only users with the right role can call specific endpoints.

Three things change in Step 4:

| What changes | Why |
|---|---|
| `User` entity gets `role` and `active` fields | The role must be stored in the database |
| `UserDetailsServiceImpl` uses the real role | The JWT filter sets authorities from `UserDetails` — it must reflect the actual role |
| `@PreAuthorize` on write endpoints | Spring Security enforces the role check before the method runs |
| `data.sql` seed file | Without a manager account in the database, nobody can log in as a manager to test |

### Role enum

File: `src/main/java/com/victor/timetrack/model/Role.java`

```java
public enum Role {
    EMPLOYEE,
    MANAGER
}
```

A Java `enum` is a type with a fixed set of named constants. Using an enum instead of a plain `String` means the compiler catches typos — `Role.MANAGGER` is a compile error; `"MANAGGER"` in a string field is not.

### User entity — adding role and active

The `User` entity needs two new fields. `role` maps to a `VARCHAR` column using `@Enumerated(STRING)`, which tells Hibernate to store the enum name (`"EMPLOYEE"`, `"MANAGER"`) rather than its ordinal position (0, 1). Storing the name is safer — if you reorder the enum values later, ordinal positions shift and all existing data breaks.

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private Role role;

@Column(nullable = false)
private Boolean active = true;
```

`active` defaults to `true` — a new account is active unless explicitly deactivated. *Soft delete* sets it to `false`: instead of removing the row from the database (a *hard delete*), you just flag it as inactive. The record stays for history and can be reactivated later, and the login check in `UserDetailsServiceImpl` refuses any account whose `active` is `false`.

### UserDetailsServiceImpl — using the real role

The placeholder `.roles("USER")` must be replaced with the actual role from the database. The `JwtFilter` loads `UserDetails` on every request and puts the authorities into `SecurityContextHolder` — if the role here is wrong, `@PreAuthorize` checks will also be wrong.

```java
return org.springframework.security.core.userdetails.User
    .withUsername(user.getEmail())
    .password(user.getPassword())
    .roles(user.getRole().name())  // "EMPLOYEE" or "MANAGER" → Spring adds ROLE_ prefix automatically
    .build();
```

**`user.getRole().name()`** — `.name()` is a built-in method on every Java enum that returns the constant name as a `String`. `Role.MANAGER.name()` returns `"MANAGER"`. `.roles()` then stores it as `"ROLE_MANAGER"` in the `UserDetails` authorities.

You should also block inactive users from logging in. Add a check before returning:

```java
if (!user.getActive()) {
    throw new UsernameNotFoundException("Account is disabled: " + username);
}
```

### data.sql — the first manager account

File: `src/main/resources/data.sql`

There is no public register endpoint — accounts are created by a manager from the Team page. But the first manager cannot log in because no manager exists yet. `data.sql` is Spring Boot's solution: it runs this SQL file automatically on every startup, before the application is ready. `ON CONFLICT DO NOTHING` makes it idempotent — safe to run multiple times without creating duplicates.

```sql
INSERT INTO users (name, email, password, role, active, created_at)
VALUES (
    'Admin',
    'admin@timetrack.com',
    '$2a$10$REPLACE_WITH_REAL_BCRYPT_HASH',
    'MANAGER',
    true,
    NOW()
)
ON CONFLICT (email) DO NOTHING;
```

**How to generate the BCrypt hash for the seed password:**

Go to [bcrypt.online](https://bcrypt.online), type `Admin2024!` as the plain text, keep the cost factor at 10, and click Hash. Copy the result and replace the placeholder above.

**One important `application.properties` setting** — by default Spring Boot only runs `data.sql` when it creates the schema (i.e. when `spring.jpa.hibernate.ddl-auto=create` or `create-drop`). To run it on every startup regardless:

```properties
spring.sql.init.mode=always
```

Without this line, `data.sql` is silently ignored when `ddl-auto=update` or `validate`.

### @PreAuthorize on write endpoints

With `@EnableMethodSecurity` already on `SecurityConfig`, you can now protect individual methods. Add the annotation above any method that should be MANAGER only:

```java
@PostMapping
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<ProjectResponse> create(@RequestBody CreateProjectRequest request) {
    return ResponseEntity.status(201).body(projectService.create(request));
}
```

Apply it to POST, PUT, and DELETE in both `ProjectController` and `UserController`. GET stays open to both roles — employees need to read the project list to select a project when logging hours.

### SecurityContextHolder — reading the current user inside a service

Docs: [Spring Security — SecurityContextHolder](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-securitycontextholder)

**The problem this solves:** HTTP is stateless — each request is a brand new connection with no memory of anything before it. So when `TimeEntryService.create()` runs, how does it know *who* is calling, right now, in this exact request? It cannot ask the client (see the IDOR section in [security/06-security-vulnerabilities.md](../../../security/junior/en/06-security-vulnerabilities.md) for why not). It needs somewhere to look up "the authenticated user of *this* request" — that place is `SecurityContextHolder`.

**What it actually is, mechanically:** it is a **thread-local** — a storage slot that holds a different value per execution thread. In Spring Boot, every incoming HTTP request is handled by one thread from the server's thread pool (Tomcat, by default). While that thread processes your request, it can stash data in its own slot without colliding with a different thread handling a different, simultaneous request from a different user. That is exactly the guarantee you need: "the authenticated user for *this* request," never mixed up with someone else's concurrent request.

> A thread is the unit of execution the server hands one request to. Two users hitting your API at the same instant are handled by two separate threads — each with its own thread-local slot. That is why `SecurityContextHolder` never leaks user A's identity into user B's request, even under heavy concurrent traffic.

**Who fills it, and when:** `JwtFilter` — the same class you already built — writes to it on every single request, before your controller or service ever runs:

```java
// JwtFilter.java — this already exists in your project
if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
        userDetails, null, userDetails.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(authToken);
}
```

`JwtFilter` decodes the JWT, extracts the email, loads the `UserDetails`, wraps it in an `Authentication` object, and **stores** that object in the current thread's slot with `setAuthentication(...)`.

**Who reads it, and why it gets the same value:** because the thread stays the same for the entire lifetime of one request — it enters at `JwtFilter`, passes through `SecurityFilterChain`, reaches your `@RestController`, and drops down into your `@Service` — reading `SecurityContextHolder.getContext().getAuthentication()` later in that same request returns **the exact same object** `JwtFilter` stored moments earlier, on that same thread. There is no network call, no database lookup here — it is literally reading a value another class, earlier in the same request, already left in a shared slot.

```
one HTTP request → one thread → one thread-local slot

[JwtFilter]                          [TimeEntryService.create()]
   writes:                              reads:
   SecurityContextHolder                SecurityContextHolder
     .getContext()                        .getContext()
     .setAuthentication(authToken)        .getAuthentication()
        │                                    │
        └──────────── same thread ───────────┘
             (same request, same slot)
```

**Why `.getName()` returns the email specifically:** `Authentication` has a `getName()` method that, when the "principal" (the authenticated subject) is a `UserDetails` — which yours is — returns `userDetails.getUsername()`. In `UserDetailsServiceImpl`, the "username" you configured **is the email** — your app has no separate username concept, it uses email as the login identifier. That is why `getName()` hands you the email directly, with no extra lookup:

```java
// Inside any @Service method — get the email of the currently logged-in user
String email = SecurityContextHolder.getContext()
        .getAuthentication()
        .getName();  // resolves to userDetails.getUsername() — the email
```

> Analogy: think of `SecurityContextHolder` as a blackboard only your thread (this one request) can see and write on. `JwtFilter` is the first to enter the room and writes "this request belongs to victor@email.com." Any class that enters the same room afterward — your service, your controller — can read that same blackboard without asking the client anything again.

You use this in Step 5 when `TimeEntryService` needs to know which user is creating an entry, or when `GET /api/entries` needs to filter results by the current user. The key point: **never trust a `userId` sent by the client** — always read it from the security context. A client can send any `userId` they want; the `SecurityContext` reflects who actually logged in.

```java
// Full pattern — load the User entity from the security context
String email = SecurityContextHolder.getContext().getAuthentication().getName();
User currentUser = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
```

### Done condition for Step 4

```
Postman: POST /api/projects with EMPLOYEE token → 403 Forbidden
Postman: POST /api/projects with MANAGER token  → 201 Created
```

To get an EMPLOYEE token: add a user with `role = 'EMPLOYEE'` in pgAdmin and log in via Postman. To get a MANAGER token: log in with the `admin@timetrack.com` account seeded by `data.sql`.

---

## Where this leaves you — and what comes next

The API now knows two things it did not know before: **who** is calling (the JWT filter puts a `UserDetails` in `SecurityContextHolder` before any controller runs) and **whether they are allowed** (`.anyRequest().authenticated()` for the route, `@PreAuthorize("hasRole('MANAGER')")` for the method). The two orphaned handlers from `05` finally have something throwing them, and the exceptions land exactly where that file predicted: `BadCredentialsException` → `401`, `AccessDeniedException` → `403`.

But look closely at what is still trusted. `LoginRequest` arrives with `@NotBlank` on two fields and `@Valid` on the controller parameter — and those annotations were used here without ever being explained. That is not an accident of this file: it is the next hole. Authentication answers "is this really Victor?"; it says nothing about whether the *body* he sent is coherent. A logged-in manager with a perfectly valid token can still `POST` a project with a blank name, a negative budget, or an end date before the start date — every security check passes, and the garbage goes straight into PostgreSQL.

[07-validation.md](./07-validation.md) closes that gap: what `@Valid` actually triggers, which annotations exist (`@NotBlank`, `@Email`, `@Positive`, `@Size`), where the resulting `MethodArgumentNotValidException` is caught, and why validating at the DTO boundary beats scattering `if (x == null)` checks through your services.
