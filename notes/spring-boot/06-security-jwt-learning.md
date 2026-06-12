# Spring Security and JWT — Study order

> Open this file when **studying or reviewing**. Open `06-security-jwt.md` when **implementing**.
>
> The order here is: understand the concept → see the code. The reference file is ordered for building (each class depends on the ones above it).

---

## 1. The problem — why security exists

Without security, your API is completely open. Anyone who knows the URL can call `GET /api/entries/1` and read someone else's data, or `DELETE /api/users/5` and destroy it. Security is not a feature — it is the foundation.

There are two separate concepts that are often confused:

**Authentication** — who are you? The server checks your identity. Example: you send your email and password, the server confirms you exist.

**Authorization** — what are you allowed to do? The server checks your permissions. Example: you are authenticated, but you are an employee — you cannot access the manager-only endpoints.

---

## 2. Other auth approaches — why JWT

Before understanding JWT, it helps to see the alternatives and why we chose JWT over them.

**Session-based authentication** (the classic approach)

```
Client sends email + password
    ↓
Server verifies credentials
    ↓
Server creates a session in memory (session ID: "abc123")
    ↓
Server sends a cookie with the session ID
    ↓
Client sends the cookie on every future request
    ↓
Server reads the session ID from the cookie → looks it up in the session store → finds the user
```

The session lives **on the server**. Problem: if you have multiple servers, each has its own session store. You need shared session storage (Redis) — extra infrastructure.

**JWT** (what we use)

```
Client sends email + password
    ↓
Server verifies credentials
    ↓
Server generates a signed token containing the user's email + role
    ↓
Client stores the token and sends it in every future request header
    ↓
Server validates the token's signature — no database lookup needed
```

The token lives **on the client**. The server is stateless — any server can validate a JWT because the signature uses a shared secret.

**Why JWT for this project:**

| Criterion             | Session-based               | JWT                    |
| --------------------- | --------------------------- | ---------------------- |
| Stateless             | No — server stores sessions | Yes — no server memory |
| Scales horizontally   | Needs shared session store  | Works out of the box   |
| Invalidate instantly  | Yes                         | No (wait for expiry)   |
| Standard in REST APIs | Less common                 | Standard               |

REST APIs are designed to be stateless — each request carries everything the server needs. JWT fits naturally. Spanish consultancies build stateless REST APIs as standard.

---

## 3. JWT — what the token is

JWT (JSON Web Token) is a signed, self-contained token. Three parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0 . abc123
─────────────────────   ──────────────────────────────────────   ──────
      HEADER                         PAYLOAD                    SIGNATURE
  { alg: "HS256" }        { sub: "user@example.com",           HMAC of
                             role: "USER",                     header +
                             exp: 1234567890 }                 payload +
                                                               secret key
```

- **Header** — which signing algorithm was used (HS256)
- **Payload** — the claims: user data as key-value pairs (`sub` = email, `iat` = issued at, `exp` = expiration)
- **Signature** — HMAC of header + payload using the secret key — proves the token was not tampered with

Any server with the same secret key can verify the token without calling the database. This is the whole point — no session, no shared state.

One important limitation: you cannot invalidate a JWT before it expires. Once issued, the token is valid until its `exp` claim passes — there is no server-side state to delete. If a user logs out or their account is banned, the token keeps working until expiry. The practical solution is a short expiry time (15–60 minutes). The workaround is a token blacklist stored in Redis, but that introduces server-side state and partially defeats the purpose of stateless auth.

**HS256 vs RS256:** HS256 uses one shared secret to sign and verify — correct for a single backend. RS256 uses a private/public key pair — needed only when multiple services verify tokens independently (microservices). We use HS256.

---

## 4. The big picture — both flows before any code

Everything in this file serves one of two flows. Understand this before reading any class.

---

### Flow 1 — Initial login (complete)

```
POST /api/auth/login
{ "email": "...",
  "password": "..." }
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter]                                             │
│   reads Authorization header                           │
│   → header is null → no token                          │
│   → filterChain.doFilter()  "pass through"             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityFilterChain]                                   │
│   /api/auth/** → permitAll()                           │
│   → allowed without a token                            │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthController]                                        │
│   @Valid → validates email + password fields           │
│   → calls AuthService.login(request)                   │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthService]                                           │
│   calls authenticationManager.authenticate(email, pwd) │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthenticationManager]                                 │
│   receives the login attempt                           │
│   → delegates to DaoAuthenticationProvider             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [DaoAuthenticationProvider]  ← Spring internal         │
│                                                         │
│   step 1: to verify the password it needs the stored  │
│           hash from the DB — so it calls              │
│           UserDetailsServiceImpl.loadUserByUsername()  │
│           → queries DB → returns UserDetails           │
│              (stored hash + roles)                     │
│                                                         │
│   step 2: BCrypt.matches(rawPassword, storedHash)      │
│           → match → authentication succeeds            │
│           → no match → throws BadCredentialsException  │
└─────────────────────────────────────────────────────────┘
         │ success
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthService]                                           │
│   calls JwtUtil.generateToken(email)                   │
│   → builds header + payload + signature                │
│   → returns AuthResponse(token) to AuthController      │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [AuthController]                                        │
│   receives AuthResponse from AuthService               │
│   → ResponseEntity.ok(authResponse)                    │
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
GET /api/timesheets
Authorization: Bearer eyJ...
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtFilter]                                             │
│   reads Authorization header                           │
│   → "Bearer eyJ..." → strips prefix → raw token       │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtUtil.extractUsername(token)]                        │
│   parseClaims() → reads "sub" claim → returns email    │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [UserDetailsServiceImpl.loadUserByUsername(email)]      │
│   queries DB → returns UserDetails (hash + roles)      │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [JwtUtil.isValid(token, email)]                         │
│   signature OK? + not expired? → true                  │
└─────────────────────────────────────────────────────────┘
         │ valid
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityContextHolder]                                 │
│   setAuthentication(user)                              │
│   → request is now marked as authenticated             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [SecurityFilterChain]                                   │
│   .anyRequest().authenticated()                        │
│   → user is in SecurityContextHolder → OK             │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [@PreAuthorize("hasRole('MANAGER')")]  ← if present    │
│   reads roles from SecurityContextHolder               │
│   → role matches? → allowed                           │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ [@RestController method]                                │
│   request is processed normally                        │
└─────────────────────────────────────────────────────────┘
         │
         ▼
         HTTP 200 + response data
```

---

### Global — both flows in context

```
        POST /api/auth/login              GET /api/any-protected-route
        { email, password }               Authorization: Bearer eyJ...
                │                                      │
                └──────────────────┬───────────────────┘
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
       /api/auth/** → permitAll()                    │
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
```

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
| `GlobalExceptionHandler` | Both        | Converts exceptions into clean JSON error responses                 |

---

## 5. BCryptPasswordEncoder — how passwords are stored

This is the first concept to understand because every other class assumes passwords are stored as BCrypt hashes.

If the database is ever compromised, plain text passwords expose every user immediately. BCrypt is a one-way hashing algorithm — you cannot reverse a hash back to the original password. Each hash includes a random "salt", so two users with the same password produce different hashes.

```java
// SecurityConfig — define the bean once
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// AuthService — compare raw password against the stored hash on login
passwordEncoder.matches(rawPasswordFromRequest, user.getPassword()); // returns true or false
```

**`new BCryptPasswordEncoder()`** — creates an encoder with the default strength (10 rounds). Higher rounds = slower hashing = harder to brute-force.

**`.matches(raw, encoded)`** — hashes the raw string and checks if it matches the stored hash. You never decode — BCrypt only goes in one direction.

> Never call `.encode()` on a password that is already hashed — you would hash the hash. Always pass only the raw password that came from the user.

---

## 6. UserDetailsService — teaching Spring where your users are

Spring Security does not know how to find users in your database. You implement `UserDetailsService` to teach it. This is the bridge between Spring Security and your `User` entity.

It has one job: receive an email, go to the database, return a `UserDetails` object. `DaoAuthenticationProvider` handles the password check itself — you do not do that here.

```
[DaoAuthenticationProvider]
       ↓
loadUserByUsername(email)   ← you implement this
       ↓
[UserRepository.findByEmail(email)]
       ↓
returns UserDetails (email + hashed password + roles)
       ↓
[DaoAuthenticationProvider calls BCrypt.matches()]
```

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
            .roles("USER")
            .build();
    }
}
```

**`loadUserByUsername(String username)`** — despite the name, `username` is the email. Spring Security uses "username" as a generic term for "the login identifier". You never call this yourself — Spring calls it automatically during login.

**`org.springframework.security.core.userdetails.User.withUsername(...).build()`** — Spring Security's own `User` builder. It converts your entity into the `UserDetails` format Spring works with internally.

> Import conflict: Spring Security has its own class called `User`. Your entity is also called `User`. Import your entity and use the full path for the Spring Security builder.

---

## 7. JwtUtil — creating and validating tokens

Now you understand what a JWT is (section 3) and how users are stored (sections 5–6). `JwtUtil` is what creates and validates the actual tokens.

It has five methods: three public, two private. The private ones are called by the public ones.

```
generateToken(email)           ← called by AuthService after login
extractUsername(token)         ← called by JwtFilter to get email from token
isValid(token, email)          ← called by JwtFilter to confirm token is OK
─────────────────────────────────────────────────────────
parseClaims(token)             ← private, used by extractUsername + isValid
getSigningKey()                ← private, used by generateToken + parseClaims
```

### application.properties — JWT config

```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

`${JWT_SECRET}` reads from an environment variable at startup — same pattern as `${DB_PASSWORD}`. `86400000` is 24 hours in milliseconds. The secret must be Base64-encoded.

### getSigningKey() — converts the secret string to a cryptographic key

```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
}
```

**`Decoders.BASE64.decode(secret)`** — converts the Base64 string back to raw bytes.

**`Keys.hmacShaKeyFor(keyBytes)`** — wraps the raw bytes in the `SecretKey` type that jjwt requires. Also validates that the key is long enough for HS256.

### generateToken() — build the signed token

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

**`.subject(username)`** — stores the email in the `sub` claim. This is how you identify who the token belongs to when validating later.

**`.expiration(...)`** — `System.currentTimeMillis()` is now. Adding `expiration` (86400000 ms) gives you 24 hours from now. jjwt checks this automatically when parsing.

**`.compact()`** — assembles the three parts, signs them, and returns `header.payload.signature`.

### parseClaims() — read and verify the token

```java
private Claims parseClaims(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
}
```

**`.parseSignedClaims(token)`** — checks the signature, checks expiry, parses the payload. If anything is wrong, it throws `JwtException`. You only get `Claims` back if everything is valid.

### extractUsername() and isValid()

```java
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
```

**`isValid()`** — calls `extractUsername()` which calls `parseClaims()`. If the token is expired or tampered, `parseClaims()` throws `JwtException` — caught here and returns `false`. The caller never needs to handle exceptions.

---

## 8. JwtFilter — validating every request

Now you know what a JWT is, how users are stored, and how to validate a token. `JwtFilter` is what puts it all together on every incoming request.

`OncePerRequestFilter` guarantees the filter runs exactly once per request, never twice.

**Decision flow — what happens inside every request:**

```
Request arrives
      │
      ▼
Has "Authorization" header?
  NO ────────────────────────→ pass through
      │                        (Spring rejects if endpoint needs auth)
  YES
      ▼
Starts with "Bearer "?
  NO ────────────────────────→ pass through
      │
  YES → strip "Bearer " prefix (7 chars)
      ▼
JwtUtil.extractUsername(token) → get email
      │
      ▼
UserDetailsService.loadUserByUsername(email)
      │
      ▼
JwtUtil.isValid(token, email)?
  NO ────────────────────────→ pass through (Spring rejects)
      │
  YES
      ▼
SecurityContextHolder.setAuthentication(...)
      │
      ▼
filterChain.doFilter() → continue to controller
```

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

        filterChain.doFilter(request, response);
    }
}
```

**`SecurityContextHolder.getContext().getAuthentication() == null`** — only process if not already authenticated. Prevents doing the work twice.

**Why load the user from the database if the token already has the email?** The token was signed at login and cannot be modified — but the user's state in the database can change after the token was issued. The account might have been deleted, banned, or had its role changed. Loading `UserDetails` from the database ensures you are working with the current state of the account, not a snapshot from when the token was created.

**`UsernamePasswordAuthenticationToken(userDetails, null, authorities)`** — the object Spring Security uses to represent an authenticated user. `null` for credentials — the JWT already proved identity. The authorities are the roles.

**`filterChain.doFilter()`** — always called at the end, whether the token was valid or not. `JwtFilter`'s job is to set (or not set) the user in `SecurityContextHolder`. Blocking is `SecurityFilterChain`'s job — if nothing was set, it rejects the request there.

**SecurityContextHolder — lifecycle per request:**

```
Request arrives
      │
      ▼
JwtFilter sets SecurityContextHolder   ← thread-local storage
      │                                   (only exists for this request)
      ▼
SecurityFilterChain  ──reads──┐
@PreAuthorize        ──reads──┤  all read the same SecurityContextHolder
@RestController      ──reads──┘
      │
      ▼
Request ends → SecurityContextHolder is cleared automatically
```

It is **thread-local** — each request runs on its own thread and has its own isolated `SecurityContextHolder`. The next request from the same user starts fresh and goes through `JwtFilter` again. This is why the check `getAuthentication() == null` is safe — you are never reading another user's auth by accident.

---

## 9. SecurityFilterChain — wiring it all together

Now that you know what `JwtFilter` and `UserDetailsService` do, the config makes sense. This is where you register every piece and set the route rules.

```
HTTP request
    ↓
[CORS check]          → allowed origin?
    ↓
[JwtFilter]           → reads and validates JWT, sets SecurityContextHolder
    ↓
[SecurityFilterChain] → checks route rules: permitAll or authenticated?
    ↓
[@PreAuthorize]       → checks role (if annotation is present)
    ↓
[@RestController]     → only reached if all checks passed
```

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

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

| Setting                           | Why                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `csrf().disable()`                | JWT uses headers, not cookies — CSRF attacks do not apply here (explained below) |
| `SessionCreationPolicy.STATELESS` | No HTTP sessions. Each request carries its own JWT                               |
| `addFilterBefore(jwtFilter, ...)` | Your JWT filter runs before Spring's default authentication filter               |
| `@EnableMethodSecurity`           | Enables `@PreAuthorize` — without this it is silently ignored                    |

**Why CSRF is disabled:** CSRF (Cross-Site Request Forgery) is an attack where a malicious website tricks your browser into making a request to your API. It works because browsers automatically include cookies with every request to a domain — if your API uses session cookies, an attacker can forge a request and the browser sends the cookie without the user knowing. JWT does not use cookies. The token lives in `localStorage` and is attached manually by Angular in the `Authorization` header. Browsers never send custom headers automatically to other domains, so the attack does not work. CSRF protection is not needed.

**`authenticationManager()` bean** — Spring auto-configures an `AuthenticationManager` internally but does not expose it. `AuthService` needs to inject it to call `.authenticate()` — so you expose it here with `@Bean`.

---

## 10. CORS — allowing Angular to call the API

CORS is a browser security policy. When Angular (localhost:4200) calls Spring Boot (localhost:8080), the browser blocks it — different ports = different origins.

Configure it inside `SecurityConfig` — not with `@CrossOrigin` on every controller:

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

**`OPTIONS` in allowed methods** — the browser sends a preflight `OPTIONS` request before every `POST`, `PUT`, etc. to check if CORS is allowed. It must be included.

**`setAllowedHeaders(List.of("*"))`** — allows any header, including `Authorization: Bearer <token>`.

> The CORS error only appears in the browser — it is not a backend bug. The fix is always on the server.

---

## 11. AuthService — orchestrating the login

With BCrypt (5), UserDetailsService (6), JwtUtil (7), and SecurityFilterChain (9) in place, `AuthService` can coordinate the full login in three lines:

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

**`authenticationManager.authenticate(...)`** — triggers the full Spring Security login flow: calls `UserDetailsService.loadUserByUsername()` to load the user, then `BCrypt.matches()` to compare passwords. If either fails, throws `BadCredentialsException` — `GlobalExceptionHandler` handles it.

**`new UsernamePasswordAuthenticationToken(email, password)`** — a simple data carrier. Not a Spring bean — just an object that holds the email and raw password for `AuthenticationManager` to use.

**`jwtUtil.generateToken(email)`** — only called after `authenticate()` returns without throwing. At that point the credentials are verified.

> `AuthService` never touches the database directly. It delegates credential checks to `AuthenticationManager` and token logic to `JwtUtil`.

---

## 12. AuthController — the login endpoint

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

**`@Valid`** — triggers validation on `LoginRequest` (`@NotBlank` on email and password). If validation fails, Spring returns 400 before the method runs — `AuthService` is never called.

**`ResponseEntity.ok(body)`** — returns status 200 with the body as JSON. Always use `ResponseEntity` in controllers — it makes the status code explicit and visible in the code.

> `AuthController` has no logic. It receives the request, delegates to `AuthService`, and wraps the result. All business logic lives in the service layer.

---

## 13. GlobalExceptionHandler — clean error responses

Without this, Spring returns a generic HTML error page or a confusing 500. This class catches exceptions and converts them into clean JSON.

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

**`@RestControllerAdvice`** — marks this as a global exception handler for all `@RestController` classes.

**`@ExceptionHandler(BadCredentialsException.class)`** — Spring calls this method when `BadCredentialsException` is thrown anywhere in a controller flow.

**`HttpStatus.UNAUTHORIZED`** — 401 = not authenticated. 403 = authenticated but not allowed. These are different — use the right one.

> `GlobalExceptionHandler` does not catch `UsernameNotFoundException` directly. Spring Security converts it to `BadCredentialsException` internally — intentional, so the API does not reveal whether the email exists.

---

## 14. @PreAuthorize — restricting access by role

After the JWT filter sets the `SecurityContext`, you can restrict access at the method level:

```java
@DeleteMapping("/{id}")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}
```

**`hasRole('MANAGER')`** — Spring Security adds the `ROLE_` prefix automatically. So `'MANAGER'` here matches `ROLE_MANAGER` in `UserDetailsService`.

Requires `@EnableMethodSecurity` on `SecurityConfig` — without it, the annotation is silently ignored.

---

## 15. Error flows — what happens when things go wrong

These three paths are completely missing from the happy-path flows above. Interviewers ask about them often.

---

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

> Spring Security also converts `UsernameNotFoundException` into `BadCredentialsException` internally — so a wrong email and a wrong password return the same 401 message. This is intentional: if the API returned different errors, an attacker could enumerate valid emails.

---

**Expired or tampered token:**

```
GET /api/timesheets
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
         │
         ▼
HTTP 403 Forbidden
```

---

**Authenticated but wrong role:**

```
DELETE /api/users/1
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

> Note the difference: a missing/invalid token returns 403 because Spring Security's default behaviour. A wrong role also returns 403. Both are 403 but for different reasons — authentication failure vs authorisation failure. Ideally an invalid token should return 401. You fix this with a custom `AuthenticationEntryPoint` (see Common mistakes below).

---

## 16. Common mistakes

**Forgetting `SessionCreationPolicy.STATELESS`** — Spring creates HTTP sessions by default. Without this, you get sessions AND JWT, which conflict and waste memory.

**Wrong filter order** — `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` is required. If the JWT filter runs after Spring's default filter, the request is rejected before your filter has a chance to authenticate it.

**CSRF enabled with JWT** — CSRF is for cookie-based sessions. If you leave it on, every non-GET request will be rejected for missing a CSRF token.

**Returning 403 instead of 401** — 401 = not authenticated (no token). 403 = authenticated but not allowed (wrong role). Spring Security sometimes returns 403 for unauthenticated requests by default.

**`@PreAuthorize` silently ignored** — if you forget `@EnableMethodSecurity` on `SecurityConfig`, the annotation does nothing and every role can access the protected endpoint.

---

## 17. This is a reusable pattern

The JWT security layer is boilerplate — the structure does not change between projects. Once you understand and implement it once, you copy it to every future Spring Boot app.

**Files that are always identical:**

- `JwtUtil.java`
- `JwtFilter.java`
- `GlobalExceptionHandler.java`
- `AuthService.java`
- `AuthController.java`
- `LoginRequest.java` + `AuthResponse.java`

**Files where only small details change:**

| File                          | What changes                                                    |
| ----------------------------- | --------------------------------------------------------------- |
| `SecurityConfig.java`         | Route rules — which paths are public, which are protected       |
| `UserDetailsServiceImpl.java` | The field used to find the user (email, username) and the roles |

After TimeTrack, implementing JWT in the next project will take less than an hour.
