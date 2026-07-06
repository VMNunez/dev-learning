# Environment variables

Docs: [Spring — Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) · [The Twelve-Factor App — Config](https://12factor.net/config)

---

An environment variable is a value stored **outside the code** that the application reads at runtime.

```
application.properties:

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
```

```
# environment variable set in IntelliJ or the OS:
JWT_SECRET=mysupersecretkey123
```

When Spring starts, `${JWT_SECRET}` is replaced with the value of the environment variable. The actual secret never appears in the code or in git.

---

## Why not hardcode the value?

```java
// ❌ Never do this
private String secret = "mysupersecretkey123";
```

If you commit this to git, the secret is exposed publicly and permanently — even if you delete it later, git history keeps it. A secret that has been committed must be considered compromised and rotated.

The rule: anything that **changes between environments** (dev vs production) or that is **sensitive** (passwords, API keys, JWT secrets) lives in an environment variable, never in code.

---

## How Spring Boot reads environment variables

Spring Boot reads values in this priority order (later overrides earlier):

1. `application.properties` — default values
2. Environment variables set in the OS or container
3. Command-line arguments

In `application.properties`, the `${VAR_NAME}` syntax tells Spring to look for that variable:

```properties
app.jwt.secret=${JWT_SECRET}
spring.datasource.password=${DB_PASSWORD}
```

In a Java class, `@Value` injects the resolved value:

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;
}
```

If `${JWT_SECRET}` is not set and there is no default, Spring fails at startup — better than a `NullPointerException` at runtime.

---

## Where to set them

**IntelliJ (local development):**
`Run → Edit Configurations → Environment Variables` — add `JWT_SECRET=yourvalue`

**Production server or Docker:**
The ops team sets them at the OS or Docker container level. Your code reads them the same way — no code changes needed between environments. This is the whole point.

> Never commit `.env` files with real secrets to git. A `.env` file with example values (`.env.example`) is fine to commit — it documents what variables are needed without exposing the real values.
