# Spring Security and JWT

> 📖 [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
> 📖 [Java Configuration (SecurityFilterChain)](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)
> 📖 [Authorize HTTP Requests (requestMatchers, permitAll)](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)
> 📖 [Session Management — Stateless Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)

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

| Artifact | Scope | Why |
|----------|-------|-----|
| `jjwt-api` | (default — compile) | The public interface you import in your code |
| `jjwt-impl` | runtime | The internal logic that creates and parses tokens — you never reference it directly |
| `jjwt-jackson` | runtime | Handles JSON serialization inside the token — you never reference it directly |

`runtime` scope means Maven includes the jar when the app runs, but does not put it on the compile classpath — your code cannot accidentally depend on internal classes.

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

## The problem without security

Without Spring Security, every endpoint in your API is public. Any user can call GET /transactions/1 and read someone else's financial data. Security is not an optional extra — it is the first thing you add before writing any real feature.

Spring Security works as a chain of filters that every HTTP request passes through before reaching your `@RestController`. You configure that chain with one bean: `SecurityFilterChain`.

---

## The JWT SecurityConfig pattern — always the same three things

Every Spring Boot project that uses JWT needs these three settings in `SecurityConfig`. Points 1 and 2 are always identical — only point 3 changes per project.

| # | What | Why |
|---|------|-----|
| 1 | Disable CSRF | JWT uses headers, not cookies — CSRF attacks are impossible |
| 2 | `STATELESS` sessions | JWT carries all information — no server session needed |
| 3 | Route rules | Which routes are public (`permitAll`) and which require a token (`authenticated`) |

The class always looks like this:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // public routes
                .anyRequest().authenticated()                 // everything else requires JWT
            );
        return http.build();
    }
}
```

During development, use `.anyRequest().permitAll()` to open everything while building the JWT logic. Switch to `.anyRequest().authenticated()` when the full JWT flow is working.

---

## SecurityFilterChain — one place for all security rules

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // needed for @PreAuthorize to work
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            // REST APIs use JWT in headers, not cookies — CSRF protection is for cookie sessions
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                // no HTTP sessions — each request is verified independently via its JWT
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // login and register are public
                .anyRequest().authenticated()                 // everything else requires a valid token
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

**Key settings:**

| Setting | Why |
|---------|-----|
| `csrf().disable()` | JWT uses headers, not cookies — CSRF attacks only work against cookie-based sessions |
| `SessionCreationPolicy.STATELESS` | No HTTP sessions. Each request carries its own JWT — no server-side state needed |
| `addFilterBefore(jwtAuthFilter, ...)` | Your JWT filter runs before Spring's default authentication filter |

---

## CORS — allowing Angular to call the API

CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks JavaScript from calling a server on a different origin. When Angular (localhost:4200) calls Spring Boot (localhost:8080), the browser blocks it — different ports = different origins.

Configure CORS inside the `SecurityFilterChain` — not with `@CrossOrigin` on every controller:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));  // Angular dev server
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

> The CORS error only happens in the browser — it is not a backend bug. The browser blocks the request before it even leaves. The fix is always on the server.

---

## UserDetailsService — teaching Spring where your users are

Spring Security does not know how to find users in your database. You implement `UserDetailsService` to tell it:

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
            .password(user.getPasswordHash())
            .roles(user.getRole().name())
            .build();
    }
}
```

Spring Security calls `loadUserByUsername()` during login — you do not call it yourself. Your only job is to implement it so Spring knows where to look.

---

## BCryptPasswordEncoder — never store plain text passwords

If the database is ever compromised, plain text passwords expose every user immediately. `BCryptPasswordEncoder` hashes passwords with BCrypt — each produces a unique, irreversible hash.

```java
// Define the bean once in SecurityConfig
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// Use it in AuthService during registration
@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public void register(String email, String rawPassword) {
        String hashed = passwordEncoder.encode(rawPassword);  // hash before storing
        userRepository.save(new User(email, hashed, Role.USER));
    }
}
```

> Never call `.encode()` on a password that is already hashed — you would hash the hash. Always hash only the raw password that came from the user.

---

## JWT — what it is and why it works for stateless auth

JWT (JSON Web Token) is a signed, self-contained token. It has three parts separated by dots:

```
header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.abc123
```

- **Header** — which signing algorithm was used (e.g. HS256)
- **Payload** — user data: email, role, expiration time
- **Signature** — HMAC of header + payload using the secret key

Any server with the same secret key can verify the token without calling the database. This is the whole point — no session, no shared state, just a signed token the client carries on every request.

---

## OncePerRequestFilter — the JWT filter

`OncePerRequestFilter` is the correct base class — Spring guarantees it runs exactly once per request:

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
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
            filterChain.doFilter(request, response);  // no token — pass through (Spring will reject if needed)
            return;
        }

        String token = authHeader.substring(7);  // remove "Bearer " prefix
        String email = jwtService.extractEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtService.isTokenValid(token, userDetails)) {
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

**What this does, step by step:**
1. Read the `Authorization` header
2. If it starts with `"Bearer "`, extract the token string
3. Extract the email from the token payload
4. Load the user from the database
5. If the token is valid, set the authentication in `SecurityContextHolder`
6. Let the request continue to the controller

Once the `SecurityContextHolder` has the authentication, Spring Security allows the request based on the `SecurityFilterChain` rules you configured.

---

## @PreAuthorize — method-level authorization

After the filter sets the `SecurityContext`, you can restrict access by role at the method level:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // only ADMIN can call this
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

This requires `@EnableMethodSecurity` on the `SecurityConfig` class (shown at the top of this file).

---

## JwtUtil — generating and validating tokens

`JwtUtil` is a `@Component` (a Spring bean with no specific role). It has two `@Value` fields that read from `application.properties`, and five methods — three public and two private.

### application.properties — JWT config

```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

`app.jwt` is just a naming convention — you invent the property names. The `${JWT_SECRET}` pattern reads from an environment variable at startup, the same way `${DB_PASSWORD}` works. `86400000` is 24 hours in milliseconds.

### Reading config values with @Value

```java
@Value("${app.jwt.secret}")
private String secret;        // the Base64-encoded signing secret

@Value("${app.jwt.expiration}")
private long expiration;      // milliseconds — always present, never null → primitive long, not Long
```

`@Value("${property.name}")` injects the value from `application.properties` into the field at startup. The syntax `${...}` inside `@Value` is the same as in `application.properties`.

### getSigningKey() — the foundation

Every other method in `JwtUtil` depends on this one. jjwt cannot use a plain `String` as a key — it needs a `SecretKey` object built from the raw bytes of the secret.

```java
private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);  // Base64 string → raw bytes
    return Keys.hmacShaKeyFor(keyBytes);               // raw bytes → SecretKey (HMAC-SHA256)
}
```

- `Decoders.BASE64.decode(secret)` — converts the Base64 string back to the raw bytes it represents
- `Keys.hmacShaKeyFor(keyBytes)` — creates a `SecretKey` from those bytes using the HMAC-SHA algorithm; this is what `HS256` in the JWT header refers to

**Imports:**
```java
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
```

### Full JwtUtil class (built step by step)

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    // --- public methods ---

    public String generateToken(String email) { ... }       // step 3 — after login
    public String extractEmail(String token) { ... }        // step 3 — reads sub from payload
    public boolean isValid(String token, String email) { }  // step 3 — used in JwtFilter

    // --- private helpers ---

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims parseClaims(String token) { ... }        // step 3 — parses and verifies
}
```

---

## Common mistakes

**Forgetting `SessionCreationPolicy.STATELESS`** — Spring creates HTTP sessions by default. Without this, you get sessions AND JWT, which conflict with each other and waste memory.

**Wrong filter order** — `addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)` is required. If the JWT filter runs after Spring's default filter, the request is rejected before your filter has a chance to authenticate it.

**CSRF enabled with JWT** — CSRF is for cookies. If you leave it on, every non-GET request will be rejected for missing a CSRF token.

**Returning 403 instead of 401** — 401 means "not authenticated" (no token). 403 means "authenticated but not allowed" (wrong role). Spring Security sometimes returns 403 for unauthenticated requests by default — override this with a custom `AuthenticationEntryPoint` that returns 401.
