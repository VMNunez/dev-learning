# Spring Security and JWT

> 📖 [Spring Security Reference](https://docs.spring.io/spring-security/reference/)

## The problem without security

Without Spring Security, every endpoint in your API is public. Any user can call GET /transactions/1 and read someone else's financial data. Security is not an optional extra — it is the first thing you add before writing any real feature.

Spring Security works as a chain of filters that every HTTP request passes through before reaching your `@RestController`. You configure that chain with one bean: `SecurityFilterChain`.

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

## Common mistakes

**Forgetting `SessionCreationPolicy.STATELESS`** — Spring creates HTTP sessions by default. Without this, you get sessions AND JWT, which conflict with each other and waste memory.

**Wrong filter order** — `addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)` is required. If the JWT filter runs after Spring's default filter, the request is rejected before your filter has a chance to authenticate it.

**CSRF enabled with JWT** — CSRF is for cookies. If you leave it on, every non-GET request will be rejected for missing a CSRF token.

**Returning 403 instead of 401** — 401 means "not authenticated" (no token). 403 means "authenticated but not allowed" (wrong role). Spring Security sometimes returns 403 for unauthenticated requests by default — override this with a custom `AuthenticationEntryPoint` that returns 401.
