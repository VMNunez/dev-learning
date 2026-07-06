# Logging

Docs: https://docs.spring.io/spring-boot/reference/features/logging.html → read: "Log Levels"

## Why not `System.out.println()` / `console.log()`

Print statements feel easy, but they are wrong for anything beyond a quick local check:

- You cannot turn them off — they run in production too, cluttering output and sometimes leaking data.
- They are not timestamped and carry no level, so you cannot tell an error from a normal event.
- They are lost the moment the terminal closes — a deployed app has no terminal you are watching.

The interview question is "how would you debug an issue in a deployed app, with no debugger attached?" The answer is **logs** — written to a file or a log aggregator, filterable by level, timestamped, and kept.

In Spring Boot you get a logger with Lombok's `@Slf4j`:

```java
@Slf4j
@Service
public class AuthService {
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for {}", request.getEmail());
        // ...
    }
}
```

The `{}` is a placeholder filled with the argument — cheaper than string concatenation, because the string is only built if that level is actually enabled.

---

## Log levels

Levels let you control how much detail is written, and filter by severity:

| Level | When to use |
|---|---|
| `DEBUG` | Detailed internal state — development only, usually off in production |
| `INFO` | Normal, expected events — "user logged in", "order created" |
| `WARN` | Something unexpected but recoverable — a retry succeeded, a deprecated path was hit |
| `ERROR` | Something failed — an operation could not complete |

> The gotcha interviewers ask: a caught exception where **the request still succeeded** is `WARN`, not `ERROR`. `ERROR` is reserved for failures the user actually felt.

---

## Logs vs exceptions

They are different tools, and you often use both for the same problem:

- An **exception** interrupts the current operation — it must be handled or it propagates up the call stack.
- A **log** is a side note that does not change control flow.

So why log an exception that `@RestControllerAdvice` already handles? Because the handler returns a clean message to the client (`{ "error": "..." }`) and **throws away the stack trace**. The client should not see the stack trace — but you, on the server, need it to debug. `log.error("Login failed", e)` keeps the full trace where you can read it, while the client still gets a tidy message.
