# Debugging with breakpoints (IntelliJ)

Docs: [IntelliJ IDEA — Debug your first Java application](https://www.jetbrains.com/help/idea/debugging-your-first-java-application.html)

---

## The problem this solves

You already know one way to inspect what a program is doing: add a `System.out.println(...)` (or `e.printStackTrace()`), rerun, read the console, then remember to delete the print line afterwards. It works, but it has three real costs — you edit production code just to look at it, you have to guess in advance *which* variable is worth printing, and you have to restart the whole flow (login, create a request, send it in Postman...) every time you want to see one more value.

A **breakpoint** removes all three costs. It is a marker you place on a line of code that tells the JVM: "pause everything here, and let me look around before continuing" — without touching a single line of your actual code. When execution stops, you get access to *every* variable in scope at that exact moment, not just the one you predicted you'd need.

> This is exactly the situation you hit while building the `reject()` endpoint for TimeTrack: a request with no body returned a `500` instead of a `400`. The console showed nothing useful, because `GlobalExceptionHandler.handleRuntime()` catches the exception silently — no `log`, no `printStackTrace()` — so nothing more than the value it returns to Postman is visible. A breakpoint let you see the *real* exception object without adding a single line of code.

---

## Debug mode vs Run mode

You've been starting your Spring Boot app with the ▶️ **Run** button. There is a second button next to it, 🐞 **Debug** (or `Shift+F9`), that starts the exact same application the exact same way — same JVM, same port, same behaviour — with one difference: the JVM now checks, before executing each line, whether that line has a breakpoint attached. If it does, it pauses there. If you never set a breakpoint, Debug mode behaves identically to Run mode; there is no cost to always using Debug while you're actively working on a feature.

> **Why doesn't Run mode also stop on breakpoints?** Because that check adds overhead, and because a breakpoint is only useful if you're at the keyboard ready to inspect the pause — Run mode assumes you just want the app to work, uninterrupted.

---

## Setting a breakpoint

Click in the thin margin to the left of the line numbers, right next to the line you want to pause on. A red dot appears:

```
78   @ExceptionHandler(RuntimeException.class)
79   public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException e) {
● 80      return ResponseEntity
81               .status(HttpStatus.INTERNAL_SERVER_ERROR)
82               .body(buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"));
83   }
```

That red dot means: "the next time any thread reaches line 80, freeze it right there." It is a marker held by the IDE, not a change to your `.java` file — nothing is recompiled or altered. You can add and remove breakpoints while the app keeps running, and they take effect on the very next request.

---

## What actually happens when it stops

Start the app in Debug mode, then trigger the code path that reaches your breakpoint (in the TimeTrack case: send `PATCH /api/entries/1/reject` with no body from Postman). The moment the JVM thread reaches that line, it pauses — not the whole application, just that one request's thread — and IntelliJ switches to the **Debug** panel at the bottom of the screen.

```
Thread that hit the breakpoint:  paused, waiting
Every other thread (other requests, background work): still running normally
```

> **This is why debugging a web server doesn't freeze the whole app.** Each HTTP request runs on its own thread (you can see the thread name in your logs, e.g. `[nio-8080-exec-2]`). A breakpoint pauses *that thread* until you tell it to continue — Postman just sits there waiting for a response, because the response can't be built until the paused thread resumes.

Two panels matter most once you're stopped:

**Variables** — every variable currently in scope at that line, with its live value. This is where you saw:

```
e = {HttpMessageNotReadableException@13976} "org.springframework.http.converter.HttpMessageNotReadableException: Required request body is missing..."
```

Note the part in `{...}` — that is the variable's **actual runtime type**, which can differ from its **declared type**. The method signature says `handleRuntime(RuntimeException e)`, so at compile time the only thing the compiler knows is "this is *some* `RuntimeException`". But at runtime, Java objects always carry their real, concrete type with them — the JVM never loses track of what an object actually is, even when a variable's declared type is a more general parent class. The debugger reads that real type directly off the object in memory and shows it to you, which is exactly how you confirmed the exception was `HttpMessageNotReadableException` and not a guess.

**Frames** (the call stack, shown as a list of method names) — the chain of method calls that got you to this exact line, most recent at the top:

```
handleRuntime:80, GlobalExceptionHandler   ← where you paused
  43 hidden frames                         ← Spring's internal dispatch machinery
doFilterInternal:51, JwtFilter             ← your own filter, further back
  57 hidden frames                         ← servlet container internals
```

> Reading this table: each row is one method that is currently "still open" — it called something and is waiting for that call to finish before it can finish itself. This is the same call-stack idea from `notes/java/junior/en/08-exceptions.md`, just made visible as a live list instead of a diagram: the row at the top is the method executing *right now*, and every row below it is a caller waiting further down. "Hidden frames" are rows IntelliJ collapses by default because they belong to framework code (Spring, Tomcat) you didn't write — click to expand if you ever need to see exactly how a request travels through Spring's internals.

---

## Controlling execution once paused

The toolbar in the Debug panel gives you control over what happens next, instead of just letting the program run to completion:

| Button | Shortcut | What it does |
|---|---|---|
| Resume Program | `F9` | Let execution continue normally until the next breakpoint (or the end) |
| Step Over | `F8` | Run the current line, then pause again on the *next* line in the same method — does not follow into method calls on this line |
| Step Into | `F7` | If the current line calls another method, jump inside it and pause on its first line |
| Step Out | `Shift+F8` | Finish the current method and pause right after it returns, back in the caller |

> **Why "Step Over" vs "Step Into" matters:** if the line you're on is `TimeEntry saved = timeEntryRepository.save(timeEntry);`, Step Over treats `.save(...)` as a black box and just shows you the result — useful when you trust that code and only care about your own logic. Step Into would take you inside Spring Data JPA's generated implementation of `save()`, which is rarely what you want unless you specifically suspect the bug is in there.

---

## When to reach for a breakpoint vs a log statement

Both are legitimate tools — the choice depends on what you're investigating:

- **Breakpoint** — you don't know yet what's wrong, and you need to freely inspect many variables, walk the call stack, and try stepping through different branches. Best for a one-off investigation, like confirming an unknown exception type.
- **Log statement** (`log.info(...)`, `log.error(...)`) — you already know what information matters, and you want it recorded every time this code runs, including in environments where you can't attach a debugger (like a deployed server). Logs stay in the code permanently; breakpoints do not.

A breakpoint is temporary by nature — remove it once you have your answer (click the red dot again to clear it), the same way you'd delete a `System.out.println` you no longer need, except you never had to touch the source file to add or remove it.
