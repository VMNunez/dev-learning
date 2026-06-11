# Spring Security and JWT

## Documentation

| What you need to do                                    | Read this                                                                                                                                       |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Generate and parse JWT tokens in Java                  | [jjwt — Quickstart](https://github.com/jwtk/jjwt#quickstart) · [Reading a JWT](https://github.com/jwtk/jjwt#reading-a-jwt)                      |
| Configure the filter chain (SecurityFilterChain)       | [Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html)                                          |
| Set route-level permissions (permitAll, authenticated) | [Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)                  |
| Configure STATELESS sessions for JWT                   | [Session Management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)                           |
| Password hashing with BCrypt                           | [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)            |
| How UserDetailsService fits into login                 | [DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html) |
| Full Spring Security reference                         | [Spring Security Reference](https://docs.spring.io/spring-security/reference/)                                                                  |

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

## The problem without security

Without Spring Security, every endpoint in your API is public. Any user can call GET /entries/1 and read someone else's data. Security is not an optional extra — it is the first thing you add before writing any real feature.

Spring Security works as a chain of filters that every HTTP request passes through before reaching your `@RestController`. You configure that chain with one bean: `SecurityFilterChain`.

---

## The full login flow — how all the pieces connect

Docs: [DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html)

There are two separate flows. Understand both — they are different.

**When does each flow happen?**
- **Flow 1** — when the user logs in: they send email + password and receive a token. This happens on first login, or when a previous token has expired.
- **Flow 2** — every request after login: the user already has a token and sends it in the header to access protected routes.

---

**Flow 1 — Initial login (POST /api/auth/login)**

*Quick summary:*
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

*Step by step:*

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
`security/UserDetailsServiceImpl.java` — Goes to the database, finds the user by email, and returns a `UserDetails` object with the stored hashed password and roles.

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

*Quick summary:*
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

*Step by step:*

**1. Request arrives with header: `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...`**
Angular interceptor (frontend) — The client sends the token it stored after login. It goes in a header — not in the body, not in a cookie.

**2. JwtFilter runs → extracts the token from the header**
`security/JwtFilter.java` — Detects the `Authorization` header, strips the `Bearer ` prefix (7 characters), and gets the raw token string.

**3. JwtFilter calls JwtUtil.extractUsername(token) → gets the email**
`security/JwtFilter.java` + `security/JwtUtil.java` — Reads the `sub` claim from the token payload. This is the email of the user who logged in.

**4. JwtFilter calls UserDetailsService.loadUserByUsername(email) → loads user from DB**
`security/JwtFilter.java` + `security/UserDetailsServiceImpl.java` — Even though the token already contains the email, Spring Security requires loading the full `UserDetails` to get the current roles and confirm the account is still active.

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

Any server with the same secret key can verify the token without calling the database. This is the whole point — no session, no shared state, just a signed token the client carries on every request.

**A claim is a key-value pair stored in the payload.** Standard claims: `sub` (subject = who the token belongs to), `iat` (issued at), `exp` (expiration). You read them back when validating the token.

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

Both options do exactly the same thing: they produce a Base64 string. You copy that string and save it as the `JWT_SECRET` environment variable in IntelliJ. The two options are just different tools to generate the same result.

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

**`.build()`** — locks in the configuration (key, settings) and creates the actual parser object. You only configure the parser once — after `.build()` you just call parse methods on it.

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

Docs: [Spring Security — UserDetailsService](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html) · [DaoAuthenticationProvider — full flow](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider)

File: `src/main/java/com/victor/timetrack/security/UserDetailsServiceImpl.java`

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
- Three boolean flags — `isEnabled()`, `isAccountNonExpired()`, `isAccountNonLocked()`

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

---

## BCryptPasswordEncoder — never store plain text passwords

Docs: [Spring Security — Password Storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html) — read only the **BCryptPasswordEncoder** section (scroll past DelegatingPasswordEncoder)

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java` (defined as a `@Bean`)

If the database is ever compromised, plain text passwords expose every user immediately. BCrypt is a one-way hashing algorithm — you cannot reverse a hash back to the original password. Each hash also includes a random "salt", so two users with the same password produce different hashes.

```java
// SecurityConfig — define the bean once
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// AuthService — compare raw password against the stored hash on login
passwordEncoder.matches(rawPasswordFromRequest, user.getPassword()); // returns true or false
```

**`new BCryptPasswordEncoder()`** — creates an encoder using BCrypt with the default strength (10 rounds). Higher rounds = slower hashing = harder to brute-force. The default is a good balance for most apps.

**`.matches(raw, encoded)`** — hashes the `raw` string and checks if it matches the stored `encoded` hash. You never need to decode the hash — BCrypt is designed to only go in one direction.

> Never call `.encode()` on a password that is already hashed — you would hash the hash. Always pass only the raw password that came from the user.

---

## AuthenticationManager bean — exposing the login coordinator

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: [Spring Security — AuthenticationManager](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html#servlet-authentication-authenticationmanager) — read only the **AuthenticationManager** section

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

## AuthService — orchestrating the login

File: `src/main/java/com/victor/timetrack/service/AuthService.java`

Docs: [DaoAuthenticationProvider — full flow](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html#servlet-authentication-daoauthenticationprovider) — read the **DaoAuthenticationProvider** section

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

**`jwtUtil.generateToken(request.email())`** — called only after `authenticate()` returns without throwing. At that point the credentials are verified — it is safe to generate the signed JWT. The email goes into the token's `sub` claim, exactly as documented in the `JwtUtil` section above.

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

**`@RestController`** — marks the class as a controller that returns JSON automatically. Equivalent to `@Controller` + `@ResponseBody` on every method.

**`@RequestMapping("/api/auth")`** — sets the base URL for all endpoints in this class. Every method inside will be under `/api/auth`. Combined with `@PostMapping("/login")`, the full URL is `POST /api/auth/login`.

**`@PostMapping("/login")`** — maps this method to `POST /api/auth/login`. `@PostMapping` is a shortcut for `@RequestMapping(method = RequestMethod.POST)`.

**`@RequestBody LoginRequest request`** — tells Spring to read the JSON body of the request and convert it into a `LoginRequest` object automatically. Spring uses Jackson (included with Spring Boot) to do the conversion.

**`@Valid`** — triggers the validation annotations on `LoginRequest` (`@NotBlank` on email and password). If validation fails, Spring returns a 400 error automatically before the method runs — `AuthService` is never called.

**`ResponseEntity<AuthResponse>`** — the return type that lets you control the HTTP status code. `ResponseEntity.ok(body)` returns status 200 with the body serialized as JSON. Using `ResponseEntity` is the standard in Spring Boot controllers — it makes the status code explicit and visible in the code.

> `AuthController` has no logic — it only receives the request, delegates to `AuthService`, and wraps the result in a `ResponseEntity`. All business logic lives in the service layer.

---

## OncePerRequestFilter — the JWT filter

File: `src/main/java/com/victor/timetrack/security/JwtFilter.java`

Docs: [Spring Security — Filter Chain Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-filters-review)

`OncePerRequestFilter` is the correct base class for a JWT filter — Spring guarantees it runs exactly once per request, even if a request is forwarded internally.

Every HTTP request passes through this filter before reaching any controller. The filter reads the JWT from the `Authorization` header, validates it, and — if valid — sets the authentication in `SecurityContextHolder`. Once that is set, Spring Security knows who is making the request and applies the route rules from `SecurityFilterChain`.

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

**`request.getHeader("Authorization")`** — reads the `Authorization` header. The Angular interceptor sends `Bearer <token>` here on every request.

**`if (authHeader == null || !authHeader.startsWith("Bearer "))`** — if there is no token (public route, or user not logged in), skip everything and pass the request through. The `SecurityFilterChain` rules will block it if authentication is required.

**`authHeader.substring(7)`** — removes the `"Bearer "` prefix (7 characters) to get just the token string.

**`SecurityContextHolder.getContext().getAuthentication() == null`** — only set the authentication if it has not been set already. Prevents processing the same request twice if it passes through the filter more than once.

**`UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities())`** — creates the authentication object that goes into `SecurityContextHolder`. The three arguments are: the principal (who), the credentials (null — no password needed here), and the authorities (roles). Once this is in the `SecurityContextHolder`, Spring Security considers the user authenticated for this request.

**`filterChain.doFilter(request, response)`** — always called at the end (whether the token was valid or not) to pass the request to the next filter or to the controller. Never skip this — if you do, the request is dropped silently.

---

## SecurityFilterChain — one place for all security rules

File: `src/main/java/com/victor/timetrack/security/SecurityConfig.java`

Docs: [Java Configuration](https://docs.spring.io/spring-security/reference/servlet/configuration/java.html) · [Authorize HTTP Requests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)

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

**`.requestMatchers("/api/auth/**").permitAll()`** — opens every URL under `/api/auth/`(login, register) without a token. The`\*\*` matches any path below that prefix.

**`.anyRequest().authenticated()`** — every other URL requires a valid JWT. Order matters: `requestMatchers` rules are checked first, in the order they are declared. `.anyRequest()` is always last — it is the catch-all.

**`.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)`** — inserts your `JwtFilter` into the filter chain, just before Spring's default authentication filter. This ensures the JWT is validated before Spring tries its own (form-based) authentication logic.

**`.cors(cors -> cors.configurationSource(corsConfigurationSource()))`** — applies the CORS rules defined in the `corsConfigurationSource()` bean. CORS must be configured inside Spring Security — not with `@CrossOrigin` — so the Security layer handles it before blocking the request.

---

## CORS — allowing Angular to call the API

Docs: [Spring Security — CORS](https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html)

CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks JavaScript from calling a server on a different origin. When Angular (localhost:4200) calls Spring Boot (localhost:8080), the browser blocks it — different ports = different origins.

Configure CORS inside `SecurityConfig` — not with `@CrossOrigin` on every controller. That way the Security layer handles it consistently for every endpoint.

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

**`source.registerCorsConfiguration("/**", config)`\*\* — applies this CORS config to every URL in the API.

> The CORS error only appears in the browser — it is not a backend bug. The browser blocks the response, not the request. The fix is always on the server.

---

## @PreAuthorize — method-level authorization

Docs: [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)

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

**`hasRole('MANAGER')`** — checks that the authenticated user has the `ROLE_MANAGER` authority. Spring Security adds the `ROLE_` prefix automatically, so you write `'MANAGER'` here and `.roles("MANAGER")` in `UserDetailsServiceImpl`.

**`hasAuthority('ROLE_MANAGER')`** — the same check, but you write the full string including `ROLE_`. Both work — `hasRole` is the shorter version.

---

## Common mistakes

**Forgetting `SessionCreationPolicy.STATELESS`** — Spring creates HTTP sessions by default. Without this, you get sessions AND JWT at the same time, which conflict and waste memory.

**Wrong filter order** — `addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)` is required. If the JWT filter runs after Spring's default filter, the request is rejected before your filter has a chance to authenticate it.

**CSRF enabled with JWT** — CSRF is for cookie-based sessions. If you leave it on, every non-GET request will be rejected with a 403 for missing a CSRF token.

**Returning 403 instead of 401** — 401 means "not authenticated" (no token or invalid). 403 means "authenticated but not allowed" (wrong role). Spring Security returns 403 for unauthenticated requests by default — override with a custom `AuthenticationEntryPoint` if you need a proper 401.

**`@PreAuthorize` silently ignored** — if you forget `@EnableMethodSecurity` on `SecurityConfig`, the annotation does nothing and every role can access the protected endpoint. No error — the protection just does not exist.
