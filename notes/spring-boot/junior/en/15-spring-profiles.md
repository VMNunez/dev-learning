# Spring Profiles and startup seeding

Docs: [Baeldung — Spring Profiles](https://www.baeldung.com/spring-profiles) → read: "Use @Profile on a Bean", "@Profile with Spring XML" (skip), and "Setting the Active Profile"

Every file so far has assumed one thing without ever saying it: that your app runs the *same way everywhere*. The `Specification` filter from [14-specifications-criteria-api.md](14-specifications-criteria-api.md) behaves identically on your laptop and on a server. So does the JWT filter, the exception handler, every service. That assumption holds for *logic* — but it breaks the moment you need something that should exist **only on your machine and never in production**.

TimeTrack has exactly one such thing, and it started as a real bug in the backlog. To log in at all during development you need a manager account in the database, but there is no register endpoint — so the first account had to be seeded at startup. The original way to do that was a `data.sql` file:

```sql
-- the OLD data.sql — deleted in this step
INSERT INTO users (id, email, password, name, role, active)
VALUES (nextval('users_seq'),
        'manager@timetrack.com',
        '$2a$10$0Q59WhP76BarGkra8uDyfOV/J9meIXU5AXsx5JDMflgqFlorwxvfS',  -- a real BCrypt hash
        'Admin Manager', 'MANAGER', true)
ON CONFLICT (email) DO NOTHING;
```

Two things are wrong with this, and both are the reason this whole file exists:

1. **The BCrypt hash is committed to git in plain sight.** Anyone who clones the repo has it. BCrypt is designed to be slow, but a weak password behind a public hash is still crackable offline — and worse, that exact admin account would ship to *every* environment the code reaches, including the Docker image in Step 11. A default admin with a git-visible credential is a textbook finding in a security review.
2. **`data.sql` runs everywhere, unconditionally.** It has no way to say "only on my laptop". The property `spring.sql.init.mode=always` means *always* — dev, prod, Docker, all of them.

The fix needs two capabilities SQL simply does not have: a way to run seed code **only in development**, and a way to build the password hash **at runtime from a secret that never touches git**. Both live in Java, and both are what this file teaches:

```
   Run code only in dev?              ──►  @Profile("dev")  — the bean isn't even created elsewhere
   Run code once at startup?          ──►  CommandLineRunner — Spring calls run() after the context loads
   Read a property / env var in Java? ──►  @Value("${app.admin.password}")  ← chained to ${ADMIN_PASSWORD}
   Hash the password at runtime?      ──►  passwordEncoder.encode(...)  — never a stored hash
```

---

## What a profile is — an environment label

Purpose: understand what "the active profile" means before using it, because `@Profile` and `application-{profile}.properties` are both meaningless without it.
Docs: [Baeldung — Spring Profiles](https://www.baeldung.com/spring-profiles) → read: "Setting the Active Profile"

A **profile** is just a named label you attach to a run of your app: `dev`, `prod`, `test`, `local`. On its own it does nothing — it is a string. Its power is that two other mechanisms *react* to it: property files named after it, and beans annotated with it. Think of it as flipping a switch labelled "which environment am I?" once, at startup, and letting the rest of the app read that switch.

You set the active profile **from outside the code**, never from inside it. The standard way is an environment variable:

```
SPRING_PROFILES_ACTIVE=dev
```

> **Why from outside, and not a line in the code?** The whole point is that the *same compiled jar* behaves differently per environment. If the profile were baked into the source, you'd have to recompile to change environments — which defeats the purpose. Your laptop sets `dev`; the production server sets `prod`; the jar is byte-for-byte identical. In IntelliJ you set it in the Run Configuration's *Environment variables* field, so it lives on your machine and never reaches git.

> **Where does Spring read this?** `SPRING_PROFILES_ACTIVE` is the environment-variable spelling of the property `spring.profiles.active`. Spring Boot's "relaxed binding" treats `UPPER_SNAKE_CASE` env vars and `lower.dotted.case` properties as the same key — the same rule that lets `${DB_PASSWORD}` fill `spring.datasource.password`. If no profile is set, Spring runs with only the `default` profile, and nothing profile-specific activates.

## `application-{profile}.properties` — config that loads only for one profile

Purpose: keep environment-specific settings (the admin credentials) out of the shared config and out of every other environment.
File: `projects/07-timetrack/backend/timetrack/src/main/resources/application-dev.properties`
Docs: [Baeldung — Properties with Spring](https://www.baeldung.com/properties-with-spring-and-spring-boot) → read: "Properties Per Environment / Profile-Specific"

Spring Boot has a naming convention baked in: a file called `application-{profile}.properties` is loaded **only** when that profile is active, and it is loaded **on top of** the base `application.properties`, not instead of it. You do not configure this anywhere — the filename is the wiring.

So TimeTrack now has two files. The base one, always loaded:

```properties
# application.properties — common to every environment
spring.datasource.url=jdbc:postgresql://localhost:5432/timetrack
spring.datasource.password=${DB_PASSWORD}
app.jwt.secret=${JWT_SECRET}
# ...
```

And the dev-only one, loaded only when `SPRING_PROFILES_ACTIVE=dev`:

```properties
# application-dev.properties — the three admin-seed properties, and nothing else
app.admin.email=manager@timetrack.com
app.admin.password=${ADMIN_PASSWORD}
app.admin.name=Admin Manager
```

The mental model for what the app actually sees is a merge, base first and profile on top:

```
application.properties            →  datasource, jpa, jwt...        ← always
        +
application-dev.properties        →  app.admin.*  (dev only)        ← only if profile = dev
        =
the configuration the running app reads
```

> **Why only three lines, not a full copy?** Because it is a *merge*, not a *replacement*. Everything in the base file still applies in `dev` without being repeated — you only add what is new or different for this environment. The rule of thumb: same value everywhere → base file; only exists or changes in one environment → that environment's file. (If the *same key* appeared in both, the profile-specific one would win — the more specific file overrides the base — but here the three `app.admin.*` keys are brand new, so nothing is being overridden.)

> **`${ADMIN_PASSWORD}` is a second, separate indirection — don't confuse it with the profile.** The profile decides *which file loads*; `${ADMIN_PASSWORD}` is placeholder syntax that tells Spring "read this value from an environment variable called `ADMIN_PASSWORD`" — the exact same mechanism as `${DB_PASSWORD}` and `${JWT_SECRET}`. If that env var is missing at startup, the app fails to boot rather than falling back to a default. That is deliberate: a hidden default password is precisely the bug we are removing. So the password reaches the app through *two* doors — the file only loads in `dev`, and even then its value comes from a machine-local secret, never from git.

## `@Profile` on a bean — created only when the profile is active

Purpose: make the whole seed component exist *only* in development, so there is no possible path for it to run in production.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`
Docs: [Baeldung — Spring Profiles](https://www.baeldung.com/spring-profiles) → read: "Use @Profile on a Bean"

`@Profile("dev")` on a class annotated with `@Component` (or a `@Bean` method) tells Spring: *register this bean only when the `dev` profile is active.* This is the strongest of the three mechanisms, and the distinction matters:

```java
@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {
    // ...
}
```

> **It is "not created", not "created but skipped".** When the profile is `prod`, Spring does not instantiate this class at all — it never appears in the application context, its constructor never runs, its `run()` is never reached. Compare that to an `if (isDev) return;` inside the method: there the object still exists and the check runs every time. `@Profile` removes the bean from existence, which is why it is the right tool for "this must be impossible in production" rather than merely "this should be off in production". There is no runtime path to the seed in a `prod` build because there is no seed object to reach.

> **Why put it in a `config/` package?** Beans whose job is wiring or startup behaviour — not request handling — conventionally live in `config/`. It is the same idea as `SecurityConfig` living there: a reader scanning the project sees "this is infrastructure, not a feature". The package name is convention, not a rule Spring enforces.

## `CommandLineRunner` — running code once, right after startup

Purpose: get a hook that Spring executes exactly once when the app finishes booting, with all your beans (the repository, the password encoder) already available to use.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`
Docs: [Baeldung — Spring Boot CommandLineRunner](https://www.baeldung.com/spring-boot-console-app) → read: "The CommandLineRunner"

`data.sql` gave us "run this at startup" for free. Once we move the seed into Java, we need Java's equivalent — and that is `CommandLineRunner`, an interface from `org.springframework.boot`. Its contract is a single method:

```java
void run(String... args) throws Exception;
```

The deal is simple: **if a Spring bean implements `CommandLineRunner`, Spring calls its `run(...)` method one time, automatically, immediately after the application context has finished loading.** "After the context has loaded" is the key phrase — by the time `run()` executes, every bean is built and injected, so inside it you can freely use the `UserRepository` and the `PasswordEncoder`. That is exactly what a seed needs.

The `String... args` are the command-line arguments passed to the program (the same ones `main` receives). TimeTrack doesn't use them — but the signature is fixed by the interface, so you keep the parameter even when empty.

> **Why `implements CommandLineRunner` is not optional — the mechanism.** Spring finds these hooks by *type*. At startup it looks through the context for every bean that is-a `CommandLineRunner` and calls each one's `run()`. If your class does not implement the interface, it is not a `CommandLineRunner`, Spring's startup scan never selects it, and your `run()` method is — as far as the framework is concerned — just an ordinary method nobody calls. The seed would silently never happen. This is the same "Spring reacts to a type/contract" idea as a repository being found because it extends `JpaRepository`.

> **What `@Override` is doing here.** `@Override` on `run()` tells the compiler "this method is fulfilling a method from a supertype or interface" — and the compiler then *verifies* that a matching method really exists in the contract (same name, same parameters). If you had no `implements CommandLineRunner`, the annotation would fail to compile with `method does not override or implement a method from a supertype` — a useful early warning that the contract is missing, caught at compile time instead of as a silent no-op at runtime.

> **`CommandLineRunner` vs `ApplicationRunner`.** Spring offers a near-identical sibling, `ApplicationRunner`, whose `run(ApplicationArguments args)` receives the arguments pre-parsed into options and values instead of a raw `String[]`. For a seed that ignores its arguments entirely, either works; `CommandLineRunner` is the simpler default. Reach for `ApplicationRunner` only when you actually need to read parsed `--flag=value` arguments.

## `@Value` — pulling a single property into a field

Purpose: read the three `app.admin.*` properties into the component so the seed uses configured values, not hardcoded ones.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`
Docs: [Baeldung — @Value in Spring](https://www.baeldung.com/spring-value-annotation) → read: "Setting @Value from Property Files"

`@Value("${some.property}")` on a field tells Spring to resolve that property at bean-creation time and inject the result. Here it walks the whole chain we built: `app.admin.password` is defined in `application-dev.properties` as `${ADMIN_PASSWORD}`, which itself resolves to the `ADMIN_PASSWORD` environment variable — so the field ends up holding the plain-text password your machine supplied.

```java
@Value("${app.admin.email}")
private String adminEmail;

@Value("${app.admin.password}")
private String adminPassword;

@Value("${app.admin.name}")
private String adminName;
```

> **Why properties instead of typing the values into the Java?** The same reason we didn't hardcode the hash: data that changes per environment (or that is secret) belongs in configuration, not in code. The email and name are here mostly for consistency and to keep the class free of magic strings; the password is here because it *must* come from a secret. Injecting via `@Value` keeps the component identical across environments — only the config behind it changes.

> **`@Value` vs constructor injection — why the repository and encoder use the constructor instead.** Note the class mixes two injection styles: `userRepository` and `passwordEncoder` come through the constructor, while the three strings come through `@Value` fields. That is deliberate. Constructor injection is the preferred style for *beans* (see [18-dependency-injection.md](18-dependency-injection.md) — it makes dependencies explicit and the object testable), but `@Value` is the direct tool for pulling *configuration scalars* like a string or a number out of properties. Different kinds of dependency, different mechanism.

## Putting it together — the idempotent seed

Purpose: see how the four pieces combine into the actual `DataInitializer`, and why the existence check matters.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/config/DataInitializer.java`

Here is the whole component. Read it as the four mechanisms above, assembled:

```java
@Component
@Profile("dev")                                  // only exists in dev
public class DataInitializer implements CommandLineRunner {   // Spring calls run() at startup

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")    private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.name}")     private String adminName;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            return;                              // already seeded — do nothing
        }

        User admin = new User();
        admin.setName(adminName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));  // hash built HERE, at runtime
        admin.setRole(Role.MANAGER);
        admin.setActive(true);

        userRepository.save(admin);
    }
}
```

- **`passwordEncoder.encode(adminPassword)`** is the line that closes the security hole. The plain-text password came from the `ADMIN_PASSWORD` env var; the BCrypt hash is computed right here, in memory, the instant the app boots. No hash is ever stored in the source, so there is nothing in git to crack. `passwordEncoder` is the same `BCryptPasswordEncoder` bean defined in `SecurityConfig` and used to verify logins — seeding and verifying share one encoder, so the round-trip is guaranteed consistent.
- **`if (...isPresent()) return;`** makes the runner **idempotent** — safe to run repeatedly with no extra effect. This matters because `run()` fires on *every* boot, not just the first. Without the guard, the second startup would try to insert a second `manager@timetrack.com` and hit the `unique` constraint on `email`, throwing an exception mid-startup. The guard is the Java equivalent of the old SQL `ON CONFLICT (email) DO NOTHING` — same intent (insert only if absent), expressed in code instead of in the database.

> **What "idempotent" means and why startup code must be it.** An operation is idempotent when doing it once and doing it five times leave the system in the same state. Seeding is a classic case: the account should exist after the app has run, whether that is its first boot or its fiftieth. Any code that runs on every startup — seeds, migrations, cache warm-ups — has to be written this way, because you do not control how many times the app restarts.

> **Deleting the seeded row has a catch — the foreign key.** If you delete the manager to re-test the seed, PostgreSQL may refuse with `update or delete on table "users" violates foreign key constraint ... Key (id)=(51) is still referenced from table "time_entries"` (SQL state `23503`). That is the `time_entries.user_id` foreign key doing its job: by default a foreign key is `ON DELETE RESTRICT`, so you cannot delete a user while any time entry still references it. Delete the child rows first (`DELETE FROM time_entries WHERE user_id = 51;`) then the user. This is the database protecting you from orphaned rows — the safe default for a timesheet app, where cascading a user delete into their whole history would be a disaster.

---

With profiles in place, the same jar can now behave differently per environment without a single code change — which is the exact capability the next phase leans on. Step 11 packages TimeTrack into Docker, and the container will run a `prod`-style profile where this seed does **not** exist and the real configuration (database URL, secrets) comes from the environment, not from a file committed to the repo.
