# General concepts

Concepts that appear everywhere — not specific to Angular, Java, or Spring Boot.

---

## Environment variables

An environment variable is a value stored **outside the code** that the application reads at runtime.

```
application.properties:

app.jwt.secret=${JWT_SECRET}
```

```
JWT_SECRET=mysupersecretkey123
```

When Spring starts, `${JWT_SECRET}` is replaced with the value of the environment variable. The actual secret never appears in the code or in git.

**Why not just hardcode the value?**

```java
// ❌ Never do this
private String secret = "mysupersecretkey123";
```

If you commit this to git, the secret is exposed publicly and permanently — even if you delete it later, git history keeps it. A secret that has been committed must be considered compromised and rotated.

**The rule:** anything that changes between environments (dev vs production) or that is sensitive (passwords, API keys, JWT secrets) lives in an environment variable, never in code.

In IntelliJ, you set environment variables in `Run → Edit Configurations → Environment Variables`. On a production server, the ops team sets them at the OS or Docker level.

In Spring Boot, `@Value("${app.jwt.secret}")` reads from `application.properties`, which reads from the environment variable using `${VAR_NAME}` syntax.

---

## JSON

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

Spring Boot's `@RestController` automatically converts Java objects to JSON (serialization) and JSON to Java objects (deserialization) using Jackson. You don't configure this — Spring Boot includes Jackson and enables it by default.

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

## Base64

Base64 is an encoding — it converts binary data (bytes) into a text-safe string of 64 characters (A-Z, a-z, 0-9, +, /).

```
Binary:  11001010 10110101 ...
Base64:  "yYrd..."
```

**Base64 is not encryption.** It is easily reversible. If you encode `"hello"` to Base64, anyone can decode it back to `"hello"` immediately. It is used for transport, not for security.

Where it appears in TimeTrack:

```properties
# application.properties
app.jwt.secret=dGhpcyBpcyBhIHNlY3JldCBrZXkgZm9yIEpXVA==
```

The JWT secret is stored as a Base64 string. In `JwtUtil`, it is decoded back to bytes before being used as the signing key:

```java
byte[] keyBytes = Decoders.BASE64.decode(secret);
return Keys.hmacShaKeyFor(keyBytes);
```

The JWT token itself also uses Base64 — the header and payload sections are Base64-encoded JSON. That is why you can paste a JWT into [jwt.io](https://jwt.io) and read the content — it is not encrypted. Only the **signature** proves it wasn't modified.

---

## Hash vs encryption

Both produce unreadable output, but they work differently.

| | Hash | Encryption |
|-|------|------------|
| Reversible? | No | Yes (with the key) |
| Purpose | Verify without storing the original | Store and retrieve the original |
| Example | BCrypt for passwords | AES for encrypted messages |

### Hashing — one way

```
"password123"  →  BCrypt  →  "$2a$10$..."
```

You cannot go back from the hash to the original. To verify a password, you hash what the user typed and compare the hashes — you never decrypt.

This is why Spring Security uses BCrypt for passwords. If the database is stolen, the attacker has hashes — not passwords. To crack them, they have to guess millions of passwords and check each hash.

### Encryption — two way

```
"hello"  →  AES + key  →  "Sd9f..."
"Sd9f..."  →  AES + key  →  "hello"
```

You can go back if you have the key. Used when you need to store data and retrieve it later — like encrypted messages or credit card numbers.

### How this maps to TimeTrack

- **Passwords** → hashed with BCrypt (`PasswordEncoder.encode()` on register, `BCrypt.matches()` on login)
- **JWT secret** → stored as Base64 in `application.properties`, loaded via `@Value`, decoded at startup — it is a **signing key**, not an encrypted value
- **JWT payload** → Base64-encoded (readable), but the **signature** is an HMAC hash — tamper-evident, not encrypted
