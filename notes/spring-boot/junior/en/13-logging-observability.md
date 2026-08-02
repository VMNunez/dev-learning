# Logging and Observability

Docs: [Baeldung — Logging in Spring Boot](https://www.baeldung.com/spring-boot-logging) → read: "Zero Configuration Logging" and "Logback Configuration Logging"

[12-production-debugging.md](12-production-debugging.md) taught you to read the evidence: the `APPLICATION FAILED TO START` block, the `Caused by:` chain, the SQL query count, the security filter that denied a request. Every one of those techniques has a precondition nobody says out loud — **the evidence had to exist**. Spring wrote the startup block. Hibernate printed the SQL because a property was on. Spring Security narrated the filter chain because you raised its level to `DEBUG`.

Now go back to the row that opened that file: an entry sitting at `APPROVED` that nobody ever submitted ([11-business-logic-domain-modeling.md](11-business-logic-domain-modeling.md)). Ask the only question that matters — *who approved it, and when?* — and open your `TimeEntryService`:

```java
public TimeEntryResponse approve(Long id) {
    TimeEntry timeEntry = timeEntryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

    if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
        throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
    }

    timeEntry.setStatus(EntryStatus.APPROVED);
    TimeEntry saved = timeEntryRepository.save(timeEntry);
    return toResponse(saved);
}
```

There is no answer. That method **records nothing**. It changes the most important field in the domain — the one that turns a draft into a billable, approved timesheet — and leaves behind exactly one artefact: the row itself. Whoever did it, whenever they did it, from whichever request, is gone. And this is not a hypothetical about a codebase somewhere: **grep TimeTrack today and there is not a single `log.` call in the entire backend.** Not in the services, not in the exception handler, not in the security filter.

That is what this file fixes. Debugging is reading the evidence; **logging is deciding, in advance, what evidence there will be.** The decision is made when you write the method — months before the incident — which is exactly why juniors get it wrong: nothing bad has happened yet, so it feels like busywork.

Five questions, and they are the sections below:

```
   WHERE does the logger come from?  ──► @Slf4j  (Lombok + SLF4J + Logback)
   WHAT do I write, and how loudly?  ──► the five levels, and log.info("... {}", id)
   WHAT do I do inside a catch?      ──► log.error(msg, e)   ← the one that matters most
   WHAT must never appear in a log?  ──► passwords, raw JWTs, whole request bodies
   WHO watches the running app?      ──► Actuator — and the endpoint you must not expose
```

---

## `@Slf4j` — where the `log` object comes from

Purpose: get a logger into a Spring bean in one annotation, and understand the three-layer stack (Lombok → SLF4J → Logback) that makes `log.info(...)` actually print something.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — **proposed: TimeTrack has no `@Slf4j` on any class today**
Docs: [Baeldung — Introduction to SLF4J](https://www.baeldung.com/slf4j-with-log4j2-logback) → read: "Why SLF4J?" (the facade argument) and "Logback Setup"

The naive way to make a program talk is `System.out.println("approved " + id)`. It works, it prints, and it is wrong for reasons that only become obvious in production — no timestamp, no severity, no thread, no class name, and no way to turn it off without editing and redeploying the code. A logging framework exists to add exactly those things.

In a Spring Boot app you never wire one up by hand. `spring-boot-starter-webmvc` already drags in `spring-boot-starter-logging`, which brings **SLF4J** and **Logback** — so a logger is on your classpath right now, in TimeTrack, unused. All you need is a reference to it in the class:

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j                      // ← Lombok generates the logger field
@Service
public class TimeEntryService {

    public TimeEntryResponse approve(Long id) {
        log.info("Approving entry {}", id);      // ← `log` exists, and you never declared it
        ...
    }
}
```

`@Slf4j` is a **Lombok** annotation, and Lombok is a compile-time annotation processor ([01-basics.md](01-basics.md)) — it does not do anything at runtime, it *writes code into the `.class` file* during compilation. The exact line it writes is this one:

```java
// what @Slf4j actually generates — you could type it yourself and get the identical result
private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(TimeEntryService.class);
```

Read that generated line word by word, because every part of it is a decision:

- **`private`** — the logger belongs to this class; nobody injects it or passes it around.
- **`static`** — one logger per *class*, not per instance. A logger holds no per-request state, so a second copy would be pure waste. (This is also why the logger is not a Spring bean and is not constructor-injected: it has nothing to do with the container.)
- **`final`** — it is created once, at class-load time, and never reassigned.
- **`LoggerFactory.getLogger(TimeEntryService.class)`** — the class object is what **names** the logger: `com.victor.timetrack.service.TimeEntryService`. That name is what appears in every line it prints, and — the part that matters later — it is what you match against when you switch levels on and off per package.

> **So what are SLF4J and Logback, and why are there two of them?** **SLF4J** is a *facade*: nothing but interfaces (`Logger`, `LoggerFactory`) with no ability to write a single character to a file. **Logback** is an *implementation*: the code that formats the line, decides whether to print it, and pushes the bytes to the console. Your code only ever imports SLF4J. At startup, SLF4J looks on the classpath, finds Logback, and binds to it. The payoff is that a team can rip Logback out, drop Log4j2 in, and **not one line of your service changes** — you never named the implementation. This is exactly the same shape as JPA (the spec) versus Hibernate (the implementation) from [03-spring-data-jpa.md](03-spring-data-jpa.md): you code against the interface, the framework binds the engine.

> **Why is it `@Slf4j` and not `@Logback`?** Because the annotation generates a field of the *facade* type, which is the whole point. Lombok ships `@Log4j2`, `@CommonsLog` and others precisely for teams bound to a different facade — but in a Spring Boot codebase, `@Slf4j` is the one you will see, every time.

Every line it produces has a fixed anatomy, and you should be able to name each column on sight:

```
2026-07-13T10:41:07.512+02:00  INFO 18244 --- [timetrack] [nio-8080-exec-3] c.v.t.service.TimeEntryService : Approving entry 42
└────────── timestamp ───────┘ └lvl┘ └PID┘      └app name┘ └── thread ────┘ └──── logger (class) ────┘  └── message ──┘
```

- **timestamp** — *when*, to the millisecond. Without it you cannot line a log line up with the user's complaint ("it broke around eleven").
- **level** — *how bad*. The next section is entirely about this column.
- **thread** (`nio-8080-exec-3`) — *which request*. Tomcat serves concurrent requests on a pool of threads, so the lines of two simultaneous users are **interleaved** in the file. The thread name is what lets you reassemble one request's lines out of that mess. (It is also the reason correlation ids exist — see the end of this file.)
- **logger** — *which class*, abbreviated (`c.v.t.service.TimeEntryService`) to keep the column narrow. This is the name `@Slf4j` derived from `TimeEntryService.class`.

> **`System.out.println` gives you none of those five columns.** That is the honest argument against it — not style, not purity. A `println` goes to stdout with no level (so it can never be filtered), no timestamp (so it can never be correlated), and no logger name (so it can never be traced back to a class in a hundred-thousand-line codebase). It is also invisible to every log aggregator a company runs, because those tools read the logging framework's output, not raw stdout. In a PR, a `println` in a service is a blocking comment.

---

## The five levels — and what you would actually log in `approve()`

Purpose: choose the right level for each line, so that production can run at `INFO` and still tell you what happened.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` (`approve()`) — **proposed: none of these lines exist in the file today**
Docs: [Baeldung — Logging in Spring Boot](https://www.baeldung.com/spring-boot-logging) → read: "Logging Levels" — and note the level *hierarchy*, not just the names

A level is not a mood. It is a **filter threshold**, and that is the mechanism the whole system rests on: you configure a level (say `INFO`), and the framework prints every message at that level **or more severe**, and silently discards everything below it. The order is fixed:

```
   TRACE  <  DEBUG  <  INFO  <  WARN  <  ERROR
   ────────────────────►  severity increases  ────────────────────►

   level = INFO   ⇒  TRACE ✗   DEBUG ✗   INFO ✓   WARN ✓   ERROR ✓
   level = DEBUG  ⇒  TRACE ✗   DEBUG ✓   INFO ✓   WARN ✓   ERROR ✓
```

So the level you assign to a line is really a promise about **when that line deserves to exist**: `DEBUG` means "only when someone is investigating"; `INFO` means "always, even at 3am on a quiet Sunday, in production".

| Level | What it means | The test to apply |
|---|---|---|
| `ERROR` | Something broke and a human needs to know | Would you be comfortable with this paging someone at night? |
| `WARN` | Suspicious or recovered — not broken, but worth noticing | Nothing failed, but it *nearly* did, or someone is doing something they should not |
| `INFO` | A business milestone actually happened | Would a non-developer (a manager, an auditor) care that this occurred? |
| `DEBUG` | Developer detail — values, branches, intermediate state | Useful when hunting a bug, noise otherwise. **Off in production** |
| `TRACE` | Firehose — every step, every parameter | You will basically never write one; frameworks do (`org.hibernate.orm.jdbc.bind=TRACE`) |

How to read that table: the right-hand column is the only one you need in the moment of writing the line. The *definitions* are easy to agree with and useless under pressure — the **test** is what makes the choice for you. And notice what the `INFO` test rules out: `log.info("entering approve method")` is not a business milestone, it is a `DEBUG` line at best, and in truth it is a line that should not exist at all, because a stack trace already tells you what was entered.

> **"A candidate who answers `log.info` on every line has never operated a service."** That is the actual filter behind this question, and it is a volume argument, not a taste argument. A production service handles millions of requests. If every method logs its entry, its exit and its parameters at `INFO`, you produce gigabytes of noise per day — and then, when something real breaks, the `ERROR` line is buried among two hundred thousand `entering approve method` lines and nobody finds it. Logging everything and logging nothing fail the same way: **the signal is unreachable.**

### The concrete answer: what belongs in `approve()`

Here is your real `approve()` method with the logging it should have. Every line below is justified against the tests in the table — nothing is decorative:

```java
@Slf4j
@Service
public class TimeEntryService {

    public TimeEntryResponse approve(Long id) {
        String manager = SecurityContextHolder.getContext().getAuthentication().getName();

        TimeEntry timeEntry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entry not found with id " + id));

        if (!timeEntry.getStatus().equals(EntryStatus.SUBMITTED)) {
            // WARN: nothing is broken — the rule worked. But someone tried an illegal transition,
            // and if this fires fifty times a day it means the Angular UI is showing a button it must not.
            log.warn("Rejected approval of entry {} by {}: status was {}, expected SUBMITTED",
                     id, manager, timeEntry.getStatus());
            throw new BusinessRuleViolationException("Manager can only approve SUBMITTED entries");
        }

        timeEntry.setStatus(EntryStatus.APPROVED);
        TimeEntry saved = timeEntryRepository.save(timeEntry);

        // INFO: this is THE business milestone of the whole workflow.
        // It is the line that answers "who approved this, and when?" — the question the corrupt row could not.
        log.info("Entry {} approved by {} (owner {}, {} hours on {})",
                 id, manager, saved.getUser().getEmail(), saved.getHours(), saved.getDate());

        return toResponse(saved);
    }
}
```

Walk the three decisions, because each one is a defensible answer in an interview:

- **The success line is `INFO`, and it is the only `INFO` in the method.** An approval is a state change with money attached — an auditor cares, a manager cares, and six months from now the payroll dispute is settled by this line or by nothing. It carries the four facts that make it useful *without opening the database*: **which** entry, **who** did it, **whose** entry it was, and **what** was approved. A bare `log.info("Approved")` is worthless — it proves an approval happened somewhere, to someone, which you already knew from the row.
- **The illegal-transition line is `WARN`, not `ERROR`.** Nothing failed: your guard did precisely its job and the client got a clean 400. `ERROR` is reserved for "the system is broken and a human must act". But it is not nothing either — a legitimate frontend should never send that request, so a stream of these `WARN`s is a real signal (a stale UI, a client bypassing the API, someone probing). That distinction — *"a rejected request is not a server error"* — is the same one behind 4xx versus 5xx in [05-exception-handling.md](05-exception-handling.md).
- **Nothing is logged at the top of the method.** `log.info("approve called")` adds a line to every approval and answers no question the success line does not already answer better. Log **outcomes**, not entries.

> **What about the `ResourceNotFoundException` on the line above — should that be logged?** No, and this is the mistake that produces duplicate log spam. That exception travels up to `GlobalExceptionHandler`, which turns it into a clean 404 ([05-exception-handling.md](05-exception-handling.md)). **The place that handles a failure is the place that logs it** — logging it here *and* there gives you two lines for one event, and once every service does that, a single failed request produces five identical entries and you can no longer count anything. The rule to hold: **log where you handle, throw where you fail.**

> **Why does `approve()` not log the *previous* status on success?** It should, in a real audit context — `"entry {} moved from {} to APPROVED by {}"` is strictly better, because a log line's job is to let you reconstruct the transition without the row. Here `SUBMITTED` is guaranteed by the guard three lines above, so it is implied. The moment a second legal path into `APPROVED` exists, the log line must carry the old status explicitly — otherwise it stops being an audit trail and becomes a rumour.

---

## Parameterised logging — why `{}` and not `+`

Purpose: understand the mechanism that makes `log.debug("value {}", x)` free when `DEBUG` is off — and makes the `+` version expensive even when nothing is printed.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/service/TimeEntryService.java` — **proposed**
Docs: [Baeldung — A Guide to Logback](https://www.baeldung.com/logback) → read: the section on parameterised messages (`{}` placeholders) — TODO: confirm the exact sub-section heading on the page

Two lines that print an identical result:

```java
log.debug("Approving entry " + id + " for user " + user.getEmail());   // ❌ MAL — concatenation
log.debug("Approving entry {} for user {}", id, user.getEmail());      // ✅ BIEN — placeholders
```

Every code reviewer will flag the first one, and the reason is *not* readability. It is that the two lines behave differently **when `DEBUG` is switched off** — which, in production, is always.

Trace what the JVM does with the first line. Java evaluates arguments **before** it calls the method — that is not a logging rule, it is how the language works. So before `debug(...)` is even entered:

1. `user.getEmail()` is invoked.
2. A `StringBuilder` is created, the fragments are appended (each non-`String` argument, like the `Long id`, is converted to text by `String.valueOf()` as it is appended).
3. `toString()` allocates the final `String` on the heap.
4. *Then* `debug(String)` is called — and its very first act is to check the level, see that `DEBUG` is disabled, and **throw the string away.**

You paid the full cost of building a message that nobody will ever read. Once. Which is nothing. Now put that line inside `toResponse()`, which runs once per row, on an endpoint returning two hundred entries, called by fifty users a minute — and you are allocating and immediately discarding tens of thousands of strings, giving the garbage collector real work to do so that it can produce exactly zero output.

The second line inverts the order. What is passed to SLF4J is the **template** (a constant string, already in memory, cost zero) and the **arguments**, unformatted. The formatting happens *inside* the method — and only after the level check has passed:

```java
// what Logback does, in essence:
public void debug(String format, Object... args) {
    if (!isDebugEnabled()) return;              // ← disabled? we leave. Nothing was ever built.
    String msg = MessageFormatter.format(format, args);   // ← substitution happens ONLY here
    write(msg);
}
```

That is the entire mechanism, and it is the answer to the interview question: **the placeholder form defers the string construction until after the level check; concatenation performs it before.** With `DEBUG` off, the `{}` version does a level comparison and returns.

> **The pseudo-code above is the shape, not the literal source.** Logback's `Logger.debug(String, Object...)` does not call `isDebugEnabled()`; it compares the logger's *effective level* (the one inherited down the name hierarchy — last section of this file) with the level of the call, plus any turbo filters, and returns immediately if the message is not enabled. And the substitution is deferred even further than the sketch suggests: when the message *is* enabled, Logback packs the template and the raw arguments into a `LoggingEvent` and only formats them when an appender actually asks for the text. The guarantee you rely on is unchanged, and it is the one worth remembering: **with the level off, no message string is ever built.**

> **What actually replaces the `{}`?** Logback calls `String.valueOf()` on each argument, which calls its `toString()`. So `{}` works with anything — a `Long`, a `BigDecimal`, an enum, an entity — and, crucially, `toString()` is *also* deferred, which is where this stops being a micro-optimisation. If the argument is a JPA entity with a `@ToString` over a lazy relation, calling `toString()` on it can fire extra SQL queries ([03-spring-data-jpa.md](03-spring-data-jpa.md)). With placeholders and `DEBUG` off, that never happens. With `+`, it happens on every call, forever, to produce a string that is discarded.

> **The arguments must match the `{}` count, and nothing tells you if they don't.** Two placeholders and three arguments prints the first two and silently drops the third; three placeholders and two arguments prints a literal `{}` in your log. It is not a compile error and it is not a runtime exception — it is just a wrong log line, discovered at the worst possible moment. Count them.

> **The one exception to the rule.** The last argument may be a `Throwable` *without* a matching `{}` — SLF4J recognises it by type and prints its stack trace instead of substituting it. That is not a quirk to memorise; it is the entire subject of the next section, and it is the most important line in this file.

---

## `log.error("msg", e)` vs `log.error(e.getMessage())`

Purpose: keep the stack trace. This is the single highest-value habit in the file, and the one juniors get wrong most often.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/exception/GlobalExceptionHandler.java` — **proposed: the handler currently logs nothing at all — verified, there is not one `log.` call in it**
Docs: [Baeldung — A Guide to Logback](https://www.baeldung.com/logback) → read: the section on logging a `Throwable` as the last argument — TODO: confirm the exact sub-section heading on the page

Something blows up deep in your code. You catch it — or your `@RestControllerAdvice` catches it — and you write a log line. There are two ways to do it and they are not variants of the same thing; **one of them destroys the evidence.**

```java
// ❌ MAL — the exception object is never given to the logger
log.error("Failed to approve entry: " + e.getMessage());
```
```
2026-07-13T11:02:44.891+02:00 ERROR 18244 --- [nio-8080-exec-3] c.v.t.e.GlobalExceptionHandler :
Failed to approve entry: Cannot invoke "com.victor.timetrack.model.Project.getName()" because the return value of "com.victor.timetrack.model.TimeEntry.getProject()" is null
```

That is the whole log entry. One sentence, and then silence. You know *what* was `null`; you do not know **where** — not which class, not which line, not which call path got there, and not what the underlying cause was. `getMessage()` returned a `String` and nothing else: the stack trace was never printed, so the bug is in production, you cannot reproduce it, and you are left grepping a hundred thousand lines of source for a call to `getProject()`.

> **And that message is the *good* case.** Since Java 14 the JVM builds those "helpful" NPE messages for you (`Cannot invoke … because … is null`), which is why the line above is at least readable. Most other exceptions are not so kind: an exception constructed with `new SomeException()` and no message returns `null` from `getMessage()`, and then the entire log entry is the word **`null`** — an `ERROR` line that says a thing broke and refuses to say which. Either way the conclusion is identical, because it does not depend on the message at all: **`getMessage()` cannot carry a stack trace.**

```java
// ✅ BIEN — the exception object is passed as the last argument
log.error("Failed to approve entry {}", id, e);
```
```
2026-07-13T11:02:44.891+02:00 ERROR 18244 --- [nio-8080-exec-3] c.v.t.e.GlobalExceptionHandler :
Failed to approve entry 42
java.lang.NullPointerException: Cannot invoke "com.victor.timetrack.model.Project.getName()"
because the return value of "com.victor.timetrack.model.TimeEntry.getProject()" is null
	at com.victor.timetrack.service.TimeEntryService.toResponse(TimeEntryService.java:209)
	at com.victor.timetrack.service.TimeEntryService.approve(TimeEntryService.java:110)
	at com.victor.timetrack.controller.TimeEntryController.approve(TimeEntryController.java:41)
	...
Caused by: ...
```

Same failure. Same instant. One of them is a diagnosis — the class, the line, the null reference, the call path, the `Caused by:` chain that [12-production-debugging.md](12-production-debugging.md) taught you to read bottom-up. The other is the word `null`.

**The mechanism.** `getMessage()` returns *one field* of the exception object: a `String` the author of the exception chose to write, which may be empty, may be `null`, and can never contain a stack trace because a stack trace is not a string — it is an **array of `StackTraceElement` objects** the JVM captured at the moment `new SomeException()` was constructed (see [Java exceptions](../../../java/junior/en/08-exceptions.md)). It lives on the exception instance, alongside the message and the `cause`. When you call `e.getMessage()` you extract the message and **leave the array, and the entire `cause` chain, behind** — and the moment the `catch` block ends, that object is garbage and the array is gone forever.

Passing `e` itself hands the *whole object* to the logger, which walks the array frame by frame and prints it, then follows `e.getCause()` and prints that one too, all the way down. That is what `Caused by:` is: the logger recursing through the chain.

```
   THE EXCEPTION OBJECT                        what each call keeps
   ┌────────────────────────────┐
   │ message : "…" or null      │ ◄──── e.getMessage()  ⇒ this line only. The rest is discarded.
   │ cause   : ──► another exc. │
   │ stackTrace : [ toResponse  │ ◄──── log.error(msg, e)  ⇒ the entire object: message,
   │               , approve    │                             every frame, and the whole cause chain.
   │               , controller │
   │               , … ]        │
   └────────────────────────────┘
```

> **Why is the exception not a `{}` placeholder?** Look at the correct call again: `log.error("Failed to approve entry {}", id, e)` — one placeholder, two arguments. That looks like the counting bug from the previous section, and it is not. SLF4J substitutes the arguments into the `{}` slots in order, and if the **last** argument is left over *and* it is a `Throwable`, it treats it as the exception to render rather than as a value to substitute. It is a deliberate, documented rule, and it is why you never write `log.error("failed {}", e)` — that would consume `e` as a placeholder value, print its `toString()` (one line), and the stack trace would be lost again, this time while *looking* like you did it right.

> **The variant that fools reviewers: `log.error(e.getMessage(), e)`.** The exception *is* passed, so the stack trace does survive — but the message line is now whatever the exception happened to say, which may be `null`, and for a database exception may be a raw SQL fragment. You have thrown away your one chance to say something a human can grep for. Write your own message, with the ids that identify *this* request, and pass the exception alongside it: `log.error("Failed to approve entry {}", id, e)`.

### What this means for TimeTrack's `GlobalExceptionHandler`

Your advice ends with the catch-all:

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
}
```

The response is correct and deliberately says nothing — that is the no-leak rule from [05-exception-handling.md](05-exception-handling.md) and you should keep it. But now look at what happens to `e`. It is a **parameter that is never used**. The method returns, the exception object goes out of scope, the garbage collector reclaims it, and the stack trace — the only description that ever existed of what actually broke — is destroyed.

And here is the part that surprises people: **Spring does not log the stack trace for you.** An exception that reaches an `@ExceptionHandler` is, by definition, *handled* — Spring's exception resolver sees that your advice returned a response, and the request completes normally. The loud stack trace you are used to seeing in the console belongs to **un**handled exceptions: the ones that fall through to the container, produce a 500 the framework built, and get logged with their full trace on the way out. By writing a catch-all advice you took ownership of every runtime exception in the application, and ownership includes the logging.

> **"Not logged at all" is one notch too strong — here is the precise version.** Spring's `DispatcherServlet` does emit a line when an exception is resolved, but at **`DEBUG`** level and roughly as `Resolved [java.lang.RuntimeException: ...]` — one line, no stack trace. Your production log runs at `INFO`, so that line does not even appear; and even at `DEBUG` it would not give you the class, the line, or the `cause` chain. So the practical truth stands, and it is the sentence to say in an interview: **once your advice handles the exception, the only stack trace anyone will ever see is the one you log yourself.**

Right now TimeTrack answers a genuine 500 with a clean JSON body and **leaves no usable trace of it anywhere.** That is worse than the framework's own error page: at least that one came with a stack trace in the console.

```java
// ✅ the catch-all, fixed — proposed, not in your file yet
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
        log.error("Unhandled exception", e);       // ← server-side: the full stack trace
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
    }
}
```

> **Two audiences, two messages — this is the whole design of an error path.** The *client* gets `"Internal server error"`: no class names, no SQL, no `e.getMessage()`, nothing an attacker can map the internals with. The *log* gets everything: class, line, cause chain, values. The rule is not "hide the error"; it is **"the detail goes where only you can read it."** A candidate who says that sentence in an interview has answered the security question and the observability question in one breath.

> **What about the other handlers — should `handleResourceNotFound` log too?** No, or at most `DEBUG`. A 404 is not a failure of your system; it is the system correctly telling a client that it asked for something that does not exist, and it will happen thousands of times a day from stale links. Reserve `ERROR` for the catch-all and for genuine breakage. If every 404 wrote an `ERROR` line, your error log would become a traffic log — and the day something truly breaks, nobody would notice.

---

## The two automatic PR rejections: `printStackTrace()` and the silent `catch`

Purpose: recognise the two `catch`-block patterns that a reviewer blocks on sight, and be able to say *why* rather than "it's bad practice".
File: a generic `catch` block — **neither pattern exists in TimeTrack today** (the codebase has no `try/catch` in the service layer; it throws and lets the advice handle it, which is the right design)
Docs: [Baeldung — Java Exceptions Best Practices](https://www.baeldung.com/java-exceptions) → read: the sections on swallowing exceptions and on `printStackTrace()` — TODO: confirm the exact sub-section headings on the page

```java
// ❌ MAL — number one
try {
    ...
} catch (Exception e) {
    e.printStackTrace();
}
```

`printStackTrace()` prints to **`System.err`**, the JVM's raw error stream. It does not go through SLF4J at all, which means it has **no level** (you cannot filter it, cannot silence it, cannot raise it), **no timestamp**, **no thread name**, **no logger name** — none of the five columns from the first section. Worse, in production nobody reads a terminal: logs are shipped to an aggregator that reads the logging framework's output, so a `printStackTrace()` on a real server is written to a stream that is often not captured at all. You have executed the ritual of logging an error and produced **nothing anybody will ever see.**

```java
// ❌ MAL — number two, and this one is worse
try {
    return timeEntryRepository.save(entry);
} catch (Exception e) {
    return null;                 // the failure has ceased to exist
}
```

This is the darkest pattern in the file. The exception was created, it carried a full description of what went wrong — and you deleted it. No log, no rethrow, no trace. The method returns `null` as if nothing happened, the caller carries on with a `null` it did not expect, and the actual crash surfaces **three layers away** as an NPE that points at code which is entirely innocent. You have converted a clear failure into a *silent wrong result*, which is the most expensive kind of bug there is: an exception is loud and stops; a wrong result is quiet and spreads.

> **There is a third member of this family, and you already know it: the swallowed rollback.** Catching a `RuntimeException` inside a `@Transactional` method and not rethrowing means Spring never sees an exception, so it **commits** ([08-transactions.md](08-transactions.md)). The empty `catch` does not merely hide a failure — it can *persist* the half-finished work the failure was supposed to undo. That is why "swallowing" is the word: the data is already down.

The rule that replaces both, and it fits in one line: **a `catch` block either handles the failure or rethrows it — and either way it logs it with the exception object.**

```java
// ✅ BIEN — handled: you cannot recover, so you translate it into your domain and keep the cause
try {
    externalPayroll.send(entry);
} catch (PayrollTimeoutException e) {
    log.error("Payroll sync failed for entry {}", entry.getId(), e);   // the evidence survives
    throw new BusinessRuleViolationException("Could not sync with payroll", e);  // ← 2-arg: the cause is chained
}
```

> **`new BusinessRuleViolationException(msg, e)` — the second argument is not optional decoration.** The one-arg version (`new BusinessRuleViolationException(e.getMessage())`) creates a *fresh* exception whose stack trace starts **at the rethrow**, in your `catch` block. The original frames — the ones that name the line that actually failed — are gone, and the log will confidently point at the wrong place. The two-arg constructor sets the `cause`, so the logger prints your exception *and then* `Caused by: PayrollTimeoutException…` with the real trace underneath. Same lesson as the section above, one level up: **never let an exception die without passing it on.**

---

## What you must never log

Purpose: know the four things that turn a helpful log line into a security incident — and why the most dangerous one looks completely innocent.
File: `projects/07-timetrack/backend/timetrack/src/main/java/com/victor/timetrack/dto/request/LoginRequest.java` (a real `@Data` DTO holding a raw password)
Docs: [OWASP — Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) → read: "Data to exclude"

A log file is not a private notebook. It is copied to an aggregator, retained for months or years, readable by every developer on the team, by ops, by contractors, and by anyone who compromises any one of those machines. **Whatever you write into a log, you have published to a much wider audience than the database ever had** — and unlike the database, nobody encrypted it and nobody audits who read it. Four categories never go in:

| Never log | Why |
|---|---|
| **Passwords** — raw or hashed | A raw password in a log is a plaintext credential store you did not know you had, and users reuse passwords across sites. Hashing at rest is pointless if the plaintext is in the log next door |
| **Raw JWTs / tokens / API keys** | A token is a bearer credential: whoever holds the string *is* the user until it expires. A log line with a full JWT is a working session anyone with log access can replay |
| **Whole request bodies with personal data** | Names, emails, addresses, salary, hours — GDPR-relevant data with an indefinite retention period and no access control. In Spain this is not just bad practice, it is a legal exposure |
| **Card numbers, national ids (DNI/NIE), medical data** | Regulated categories. There is no "but it was useful for debugging" defence |

How to read that table: the right column is not four rules, it is one rule seen from four angles — **a log is a low-security copy of whatever you put in it.** The question to ask before every log line is not "is this useful?" but "am I comfortable with this string sitting in a text file for two years?"

### The trap: `log.info("login request {}", request)`

This is the line that gets people, because it looks careful. It logs *one object*, not a password. Here is TimeTrack's actual `LoginRequest`:

```java
@Data                       // ← Lombok generates toString() over EVERY field
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;      // ← the raw password, before BCrypt ever sees it
}
```

Now trace the mechanism, because it is the whole lesson. Section three: the `{}` placeholder is filled by calling `String.valueOf(arg)`, which calls **`toString()`**. And `@Data` ([01-basics.md](01-basics.md)) generates a `toString()` that concatenates *every field of the class*. So the line prints:

```
2026-07-13T09:15:02.104+02:00  INFO 18244 --- [nio-8080-exec-1] c.v.t.controller.AuthController :
login request LoginRequest(email=victor@timetrack.com, password=MyRealPassword123)
```

You never wrote `password` anywhere. You never even looked at the field. Lombok wrote the getter, Lombok wrote the `toString()`, SLF4J called it, and the plaintext credential of a real user is now in a log file that will be shipped, indexed, and retained. **This is the single most common way passwords leak from a Spring codebase**, and it happens because the DTO is doing exactly what you told it to.

Two ways to close it, and you should know both:

```java
// ✅ Option A — log only the fields you chose, one by one. Explicit, and it cannot regress.
log.info("Login attempt for {}", request.getEmail());
```
```java
// ✅ Option B — make the DTO itself incapable of leaking, with Lombok's field-level exclusion
@Data                               // (validation annotations omitted here to keep the eye on the fix)
public class LoginRequest {
    private String email;

    @ToString.Exclude               // ← the field is left OUT of the generated toString()
    private String password;
}
```

`@ToString.Exclude` does not mask the value, and it does not print `password=***`: the field simply **does not appear** in the generated `toString()` at all. The same object logged now prints `LoginRequest(email=victor@timetrack.com)` — the password is not hidden behind stars, it was never written. (Lombok has no masking feature; if you want a `***` marker you have to write `toString()` by hand.)

> **Option B is the one that survives a team.** Option A depends on every developer, forever, remembering not to log the object — and one careless `log.debug("request {}", request)` during a bad afternoon undoes it. `@ToString.Exclude` moves the guarantee into the *class*, so the field cannot be printed by accident from anywhere. This is the same principle as the entity setter in [11-business-logic-domain-modeling.md](11-business-logic-domain-modeling.md): **do not rely on discipline for something a compiler-time construct can enforce.**

> **The same trap, one layer up: the JWT.** `log.debug("Authorizing with header {}", authHeader)` in your `JwtFilter` would print `Bearer eyJhbGciOi…` — the entire token, valid for the next 24 hours (`app.jwt.expiration=86400000` in your `application.properties`). Anyone with log access can paste it into Postman and *be that user*. If you must log something about the token, log a *fact* about it, never the token: `log.debug("JWT rejected for {}: expired at {}", email, exp)`. Note that even the email is a judgement call — it is personal data, and at `DEBUG` (off in production) it is defensible; at `INFO`, on every request, it is a GDPR conversation.

> **And the same trap, one layer down: `spring.jpa.show-sql=true`.** It is on in your `application.properties` right now, which is correct for learning, and it prints every statement Hibernate runs — including the `INSERT` into `users`, with the parameter values if you also turned on the bind logger ([12-production-debugging.md](12-production-debugging.md)). That is your data going into the log by a route you did not think of as "logging". It is a **development** switch. It has no business being on in production, and not only for the noise.

---

## Turning levels on and off without redeploying

Purpose: change what the running app tells you by editing configuration, not code — which is why levels exist at all.
File: `projects/07-timetrack/backend/timetrack/src/main/resources/application.properties` — **proposed: your file has no `logging.level.*` key today; the only logging-ish line in it is `spring.jpa.show-sql=true`**
Docs: [Baeldung — Logging in Spring Boot](https://www.baeldung.com/spring-boot-logging) → read: "Application Properties" (the `logging.level.*` keys)

Remember what `@Slf4j` generated: a logger **named after the class** (`com.victor.timetrack.service.TimeEntryService`). That name is not decoration — it is a hierarchical address, and it is what you point a configuration key at:

```properties
# a whole package: every logger under com.victor.timetrack
logging.level.com.victor.timetrack=DEBUG

# one class, precisely
logging.level.com.victor.timetrack.service.TimeEntryService=DEBUG

# somebody else's code — the same mechanism, which is how you got the switches in file 12
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# the floor for everything not named above
logging.level.root=INFO
```

Logback resolves a logger's level by walking **up its dotted name** until it finds a configured one: `com.victor.timetrack.service.TimeEntryService` → `…service` → `…timetrack` → `com.victor` → `com` → `root`. The first configured ancestor wins. That inheritance is the whole reason a single line can turn on debugging for an entire package, and why `root` is the catch-all.

> **This is why you write `log.debug(...)` lines you never see.** A `DEBUG` line is not dead code — it is a switch that is *currently off*. When an endpoint misbehaves in staging, you raise that one package to `DEBUG`, reproduce, read, and put it back — **with no code change, no rebuild, no redeploy**. That is the payoff for having chosen levels carefully in the first place, and it is why the debate about "what level is this line" is not pedantry: the level *is* the API of your log.

> **Where those two Spring/Hibernate switches from [12-production-debugging.md](12-production-debugging.md) came from.** `logging.level.org.springframework.security=DEBUG` is not a special feature Spring Security ships. It is this exact mechanism aimed at *their* loggers — Spring's own classes call `log.debug(...)` all over the filter chain, and every one of those lines has been sitting there, switched off, since your first run. You are not adding logging; you are unmuting it.

---

## Spring Boot Actuator — and the property that leaks your JWT secret

Purpose: give ops (and a container orchestrator) a way to ask the running app "are you alive, and can you reach the database?" — without opening a single log line — and know exactly which endpoints must never be public.
File: `projects/07-timetrack/backend/timetrack/pom.xml` — **proposed: TimeTrack has NO Actuator dependency today. Everything in this section is the target state, not your current config.**
Docs: [Baeldung — Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators) → read: "Predefined Endpoints" and "Security" (the exposure section is the one that matters)

Logs answer *what happened*. Actuator answers *what is happening right now*, and it answers it to a **machine**. One dependency, no code:

```xml
<!-- proposed for TimeTrack — not in the pom.xml yet -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

By default that exposes two endpoints over HTTP — `/actuator/health` and `/actuator/info` — and `health` is the one that earns the dependency:

```json
GET /actuator/health
{
  "status": "UP",
  "components": {
    "db":        { "status": "UP", "details": { "database": "PostgreSQL" } },
    "diskSpace": { "status": "UP" }
  }
}
```

You met this endpoint in [12-production-debugging.md](12-production-debugging.md) as *your* first triage check. Its real purpose is that **nothing human is reading it.** A container orchestrator (Docker's `healthcheck`, Kubernetes' liveness probe) polls it every few seconds and takes action on the answer: stop routing traffic to a container that stops saying `UP`, restart one that stops answering at all. That is the interview answer to *"how does ops know your app is up?"* — not "they check the logs", but "the platform polls a health endpoint, and Spring Boot ships one".

The `db` component is doing real work, not repeating a startup fact: Actuator's `DataSourceHealthIndicator` borrows a connection from the Hikari pool and runs a trivial validation query, right then. So `"db": "DOWN"` means Postgres is unreachable **now**, which is precisely the distinction between "the app is down" and "the app is up and the database is not".

### The dangerous line

Actuator has around fifteen more endpoints, disabled over HTTP by default. Every tutorial, every Stack Overflow answer, and every impatient developer turns them all on with the same line:

```properties
# ❌ MAL — never write this. It is the single most dangerous line in a Spring Boot properties file.
management.endpoints.web.exposure.include=*
```

That wildcard publishes, unauthenticated if your security chain permits `/actuator/**`:

| Endpoint | What an attacker gets |
|---|---|
| `/actuator/env` | **The full list of resolved properties — every key, every source, including `app.jwt.secret`.** Values are masked by default on Boot 3/4 (see the callout below), but one careless `show-values` setting turns the list into the values themselves — and with your signing secret an attacker forges a token for any user, with any role, and your entire `@PreAuthorize` layer is decoration |
| `/actuator/heapdump` | A binary dump of the JVM's memory: entities, DTOs, passwords in flight, live tokens. Downloadable, then opened offline at leisure |
| `/actuator/beans`, `/mappings` | The complete internal map of your app — every class, every route, including the ones you thought were undocumented |
| `/actuator/loggers` | Writable at runtime — an attacker can turn `DEBUG` on to make the app leak more, or off to blind you while they work |
| `/actuator/shutdown` | Stops the application. (Off by default even under `*`, which tells you how the maintainers rate the rest of the list.) |

How to read that table: read it as one argument seen five times — *every row hands an outsider something the application was built to keep inside*. Your `application.properties` reads `app.jwt.secret=${JWT_SECRET}`, and the value is kept out of git precisely so it never leaks ([01-basics.md](01-basics.md)). That precaution protects the *repository*. It does nothing about a running process that has been told to publish its own internals over HTTP: `/env` names the property to the world, `/heapdump` ships the process memory the resolved secret is sitting in, and `/loggers` lets the attacker turn the noise up or down while they work.

```properties
# ✅ BIEN — expose exactly what the platform needs, nothing else
management.endpoints.web.exposure.include=health,info
```

> **"But `/env` masks the secrets, doesn't it?"** On Spring Boot 3 and 4 — the versions TimeTrack is on — yes, by default: `management.endpoint.env.show-values` defaults to `never`, so **all** property values come back as `******`, not just the ones whose names look dangerous. (That default is newer than most of the internet: Boot 2 masked by a *name-matching* heuristic — `password`, `secret`, `key`, `token` — which let a property called `app.jwt.signing-material` through in plaintext. Half the Stack Overflow answers you will find still describe that older behaviour.) Two reasons not to relax: the masking is **one property away from being off** — every "how do I see my config?" tutorial tells you to set `show-values=always`, and it is set by the same developer who wrote `include=*` — and masking `/env` does nothing whatsoever for `/heapdump`, which hands over the raw memory the unmasked secret lives in. So the posture is not "trust the mask": it is **do not expose the endpoint**, and additionally require authentication on `/actuator/**` in your `SecurityFilterChain` ([06-security-jwt.md](06-security-jwt.md)) so that not even `health` is free to the public internet.

> **How this reaches an interview.** They will not ask you to recite the endpoint list. They will show you a properties file with `exposure.include=*` in it and ask *"which endpoints does this expose, and are they secured?"* — and the expected answer, said in one sentence, is: **"`/env` prints the resolved JWT secret, so this line hands anyone the ability to forge tokens."** That is the whole test, and it is why this bullet sits in the coverage file next to the logging ones: leaking a secret through config is the same failure as leaking one through a log line, just through a different pipe.

---

## What this looks like in an interview

Purpose: turn the file into the four answers a Spanish consultancy actually screens for in a code review round.
Docs: re-read the `approve()` example in section two — it is the answer to the first question below

- **"What would you log in the approve endpoint?"** → One `INFO` on success carrying *who, what, whose and when* (`"Entry {} approved by {} (owner {}, {} hours on {})"`), because an approval is a business milestone with money attached and the log line must let you reconstruct it without the database. One `WARN` on the illegal transition, because the guard worked and nothing broke — but a legitimate client should never have sent that request. Nothing at method entry. And say the rule out loud: **log outcomes, not entries.**
- **"What is wrong with `log.error(e.getMessage())`?"** → It extracts one field and discards the stack trace, the line number and the whole `cause` chain — and for an NPE `getMessage()` is `null`, so the log entry reads `null`. Pass the exception as the last argument (`log.error("Failed to approve entry {}", id, e)`) and SLF4J prints the full trace. This is the highest-value line in the file; it is what interviewers look for in your `catch` blocks.
- **"Why `log.info("x {}", id)` instead of `log.info("x " + id)`?"** → Java evaluates arguments before the call, so concatenation builds the string *before* the logger can check whether the level is even enabled — you pay for a message nobody reads. The placeholder form passes a constant template plus the raw arguments and formats **only after** the level check passes. With `DEBUG` off, it is a boolean test and a return.
- **"What must never appear in a log?"** → Passwords, raw JWTs, whole request bodies with personal data. Then name the mechanism, because that is what proves you understand it: `log.info("login request {}", request)` on a `@Data` DTO prints the raw password, because `{}` calls `toString()` and Lombok's `toString()` includes every field. Fix it with `@ToString.Exclude` on the field, so the class cannot leak it from anywhere.
- **"Which Actuator endpoints do you expose?"** → `health` and `info`, and `/actuator/**` sits behind authentication. Never `exposure.include=*`: it publishes `/env` (which names every property, and prints the values too the moment someone sets `show-values=always`), `/heapdump` (the raw JVM memory the resolved `app.jwt.secret` is sitting in), and `/loggers` (writable at runtime). With that signing secret an attacker forges a token for any user with any role, and the whole security layer is decoration.

---

## Where this goes next

This file closes the numbered Spring Boot sequence, so it is worth stating what the twelve files before it added up to. You can build the app (01), expose it over HTTP (02–03), persist it (04), fail cleanly (05), secure it (06), validate it (07), keep it consistent (08), test it (09), ship it (10), and put the business rules where they belong (11). Then 12 taught you to read the evidence a broken system leaves behind — and this file taught you that the evidence only exists because someone, months earlier, decided it would.

Go back one last time to the corrupt `APPROVED` row. With the `INFO` line from section two in place, the investigation that was impossible becomes thirty seconds of work: grep the log for `Entry 42 approved`, read the manager's email and the timestamp, and you have the *who* and the *when*. That is the entire return on this file.

But notice what you still do not have, and it is the honest limit of where you are: you cannot follow **one user's single request** through the log, because Tomcat interleaves concurrent requests and the only thing tying lines together is a thread name that gets recycled. You cannot search a million lines by field, because a log line is prose. And you cannot yet explain a slowdown that comes from the connection pool rather than from your code.

Those three gaps have names. Two of them — correlation ids and the connection pool — are already parked in [`notes/spring-boot/future-learning.md`](../../coverage/senior.md); the third belongs beside them:

- **Correlation ids (MDC)** — stamp a generated id onto every log line of a request, so one user's failed call maps to exactly the lines it produced, across every class it touched.
- **Structured / JSON logging** — emit each line as a JSON object with typed fields (`entryId`, `userEmail`, `level`) instead of a sentence, so an aggregator can *query* your logs (`entryId = 42 AND level = ERROR`) rather than grep them.
- **HikariCP pool tuning** — `Connection is not available, request timed out`: the failure that appears when connections are held too long (a slow query, or an HTTP call inside a `@Transactional` block), and why raising `maximum-pool-size` hides the leak instead of fixing it.

None of the three is a junior filter, and none is needed for the interview you are preparing for. They are the first three things you will meet the day you actually operate a service — which is, not coincidentally, the day everything in this file stops being a study topic and starts being the reason you can go home at six.
