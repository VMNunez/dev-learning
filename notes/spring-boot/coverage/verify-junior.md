# Coverage Verify — Spring Boot junior

Verdict: gaps
Coverage SHA-256: 056a98207408256460e2f5320c8134c4bf76925d63a0a3004dd1816e93ffef81
Verified: 2026-07-27

## Open gaps

- `application.yml` vs `application.properties` — the same settings can arrive as dotted keys or nested YAML, and profile-specific values live either in an `application-{profile}` file or in a multi-document YAML separated by `---` with `spring.config.activate.on-profile` [Configuration and profiles]
- Boot's default error pipeline — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled [Exception handling and error responses]
- Spring Data repository default transactionality — repository CRUD methods are transactional on their own, so a service without `@Transactional` still commits each call separately and loses the persistence context between them, which is what makes the boundary a deliberate decision rather than an optional annotation [Transactions]
- `@Scheduled` and `@EnableScheduling` — a fixed-rate, fixed-delay, or cron method runs only when scheduling is enabled deliberately, executes on a single-threaded scheduler by default so one slow task delays the rest, and must be a proxy-eligible method on a bean [Beans, injection, and startup diagnosis]
