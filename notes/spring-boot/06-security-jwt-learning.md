# Spring Security and JWT — How it works (learning order)

> Read this file to understand the flow. Open `06-security-jwt-reference.md` when you need to implement.
>
> 📖 [Spring Security Reference](https://docs.spring.io/spring-security/reference/)

---

## 1. The problem without security

Without Spring Security, every endpoint in your API is public. Any user can call `GET /timesheets/1` and read someone else's data. Security is not an optional extra — it is the first thing you add before writing any real feature.

Spring Security works as a chain of filters that every HTTP request passes through before reaching your `@RestController`. You configure that chain with one bean: `SecurityFilterChain`.

---

## 2. JWT — what the token is

Before you see how Spring handles tokens, you need to understand what a JWT actually is.

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

## 3. BCryptPasswordEncoder — how passwords are stored

When a user registers, you never store their plain text password. If the database is ever compromised, plain text passwords expose every user immediately.

`BCryptPasswordEncoder` hashes passwords with BCrypt — each hash is unique and irreversible. Spring Security knows how to verify a raw password against a BCrypt hash without you doing anything extra.

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

**`passwordEncoder.encode(rawPassword)`** — takes the raw password and returns a BCrypt hash. The hash is what gets saved to the database. The raw password is never stored.

> Never call `.encode()` on a password that is already hashed — you would hash the hash. Always hash only the raw password that came from the user.

---

## 4. UserDetailsService — teaching Spring where your users are

Spring Security does not know how to find users in your database. You implement `UserDetailsService` to teach it. This is the bridge between Spring Security and your `User` entity.

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

**`loadUserByUsername()`** — Spring Security calls this method automatically during login. Your only job is to implement it so Spring knows where to look. You never call this yourself.

**`.withUsername().password().roles().build()`** — builds a `UserDetails` object that Spring Security understands. It wraps your `User` entity in a format Spring can use to verify the password and check roles.

---

## 5. JwtAuthFilter — the filter that runs on every request

Now you know what a JWT is and how users are stored. This filter is what actually checks the token on every request.

`OncePerRequestFilter` is the correct base class — Spring guarantees it runs exactly once per request, never twice.

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

1. Read the `Authorization` header from the request
2. If it starts with `"Bearer "`, extract the token string (remove the prefix)
3. Extract the email from the token payload — this is who the token belongs to
4. Load that user from the database using `UserDetailsService` (section 4 above)
5. If the token is valid, put the authentication in `SecurityContextHolder` — this is how Spring knows the request is authenticated
6. Let the request continue to the controller with `filterChain.doFilter()`

**`SecurityContextHolder.getContext().getAuthentication() == null`** — checks that we haven't already authenticated this request. Avoids doing the work twice.

**`UsernamePasswordAuthenticationToken`** — the object Spring Security uses to represent an authenticated user. You pass the user, their credentials (null here — JWT already proved identity), and their roles.

---

## 6. SecurityFilterChain — wiring it all together

Now that you know what `JwtAuthFilter` and `UserDetailsService` do, the `SecurityFilterChain` config makes sense. This is where you register your filter and set the rules.

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
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

| Setting | Why |
|---------|-----|
| `csrf().disable()` | JWT uses headers, not cookies — CSRF attacks only work against cookie-based sessions |
| `SessionCreationPolicy.STATELESS` | No HTTP sessions. Each request carries its own JWT — no server-side state needed |
| `addFilterBefore(jwtAuthFilter, ...)` | Your JWT filter runs before Spring's default authentication filter |

---

## 7. CORS — allowing Angular to call the API

CORS (Cross-Origin Resource Sharing) is a browser security policy. When Angular (localhost:4200) calls Spring Boot (localhost:8080), the browser blocks it — different ports = different origins.

Configure CORS inside the `SecurityFilterChain` — not with `@CrossOrigin` on every controller:

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

> The CORS error only happens in the browser — it is not a backend bug. The browser blocks the request before it even leaves. The fix is always on the server.

---

## 8. @PreAuthorize — restricting access by role

After the filter sets the `SecurityContext` (step 5), you can restrict access at the method level using the role that came from the JWT:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

This requires `@EnableMethodSecurity` on the `SecurityConfig` class (shown in section 6).

---

## 9. Common mistakes

**Forgetting `SessionCreationPolicy.STATELESS`** — Spring creates HTTP sessions by default. Without this, you get sessions AND JWT, which conflict and waste memory.

**Wrong filter order** — `addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)` is required. If the JWT filter runs after Spring's default filter, the request is rejected before your filter has a chance to authenticate it.

**CSRF enabled with JWT** — CSRF is for cookies. If you leave it on, every non-GET request will be rejected for missing a CSRF token.

**Returning 403 instead of 401** — 401 means "not authenticated" (no token). 403 means "authenticated but not allowed" (wrong role). Spring Security sometimes returns 403 for unauthenticated requests by default — override with a custom `AuthenticationEntryPoint` that returns 401.

---

## The full flow in plain English

This is what you should be able to say in an interview:

1. Angular sends a request with `Authorization: Bearer <token>` in the header
2. `JwtAuthFilter` reads the header and extracts the token
3. `JwtService` validates the token and extracts the email from the payload
4. `UserDetailsService` loads the user from the database by that email
5. If the token is valid, `SecurityContextHolder` stores the authenticated user
6. `SecurityFilterChain` checks the rules — is this endpoint public or protected?
7. If protected and authenticated, the request reaches the controller
8. `@PreAuthorize` checks the role before the method runs
