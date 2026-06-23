# General — Interview Questions

## General programming

**What is the DRY principle?** ⭐⭐⭐
"Don't Repeat Yourself" — if the same logic appears in more than one place, extract it into a function, service, or component. In the HR portal, the confirm dialog pattern is reusable across three different pages — that is DRY in practice.

**What is the difference between synchronous and asynchronous code?** ⭐⭐⭐
Synchronous code runs line by line and blocks execution until each line finishes. Asynchronous code (HTTP calls, timers, user events) starts an operation and continues without waiting for it to finish. In Angular, almost everything that touches a server is asynchronous — that is why we use Observables and signals.

**What is immutability and why does it matter in Angular?** ⭐⭐
Immutability means not modifying existing objects — instead, you create new ones with the changes. Angular's change detection works better with immutable data because it can detect changes by reference. HTTP requests are also immutable in Angular — that is why you use `req.clone()` in interceptors.

**What is separation of concerns?** ⭐⭐
Each part of the code should do one thing and be responsible for one area. In Angular: components handle the template, services handle data and logic, guards handle route access. Mixing them together makes the code harder to test and maintain.

**What does "single source of truth" mean?** ⭐⭐
One place in the app holds the authoritative version of a piece of data. In the HR portal, `EmployeeService` is the single source of truth for the employee list — any component that needs it reads from there, so they all stay in sync automatically.

**What is the KISS principle?** ⭐⭐
KISS — "Keep It Simple, Stupid". The simplest solution that solves the problem is the right one; complexity is a cost you only pay when it is justified. In practice it means not reaching for a design pattern, an abstraction, or a clever one-liner when a plain function would do. It matters more than ever in 2026 because AI tools generate over-engineered boilerplate — recognising when code is needlessly complex and simplifying it is a real review skill.

> **Junior tip:** Tie it to AI: "AI often gives me a more complex solution than the problem needs — KISS is knowing when to delete half of it." That shows the modern, review-focused angle interviewers care about.
> **Consejo de entrevista:** Conéctalo con la IA: "la IA a menudo me da una solución más compleja de lo que el problema necesita — KISS es saber cuándo borrar la mitad."

**What is YAGNI?** ⭐⭐
YAGNI — "You Aren't Gonna Need It". Do not build features or flexibility for hypothetical future requirements; build only what is needed now. Classic violations: adding pagination before any list is long, or building a configurable plugin system for a feature that has exactly one implementation. The future requirement often never arrives, and the speculative code becomes dead weight that still has to be maintained and tested.

> **Junior tip:** Pair it with KISS in your answer — "KISS keeps the solution simple, YAGNI keeps me from solving problems I don't have yet." Mention that AI-generated code frequently violates YAGNI with speculative abstractions.
> **Consejo de entrevista:** Combínalo con KISS — "KISS mantiene la solución simple, YAGNI me impide resolver problemas que aún no tengo." Menciona que el código generado por IA suele violar YAGNI con abstracciones especulativas.

---

## Agile and teamwork

**Have you worked in an agile environment?** ⭐⭐⭐
Not professionally, but I follow agile practices in my own projects — atomic commits, feature branches, PR descriptions, and short focused changes. I understand the ceremony: daily standup to share blockers, sprint to timebox work, retrospective to improve the process. The part I would adapt to fastest in a consultancy is the PR review cycle — I already practice it in my personal workflow.

**What is the difference between a sprint and a backlog?** ⭐⭐
The backlog is the full list of features and tasks for the project, ordered by priority. A sprint is a fixed time period — usually two weeks — where the team picks a subset of backlog items and commits to finishing them. At the end of the sprint you have working software, not half-finished features.

**What is a daily standup and what do you say in it?** ⭐⭐
A short daily meeting — usually 15 minutes — where each person answers three questions: what did I do yesterday, what will I do today, and is anything blocking me. The goal is to surface blockers early, not to report progress to a manager.

**What would you change about your solo workflow when joining a team?** ⭐⭐
What they really want to know: Are you ready for professional collaboration, or will you be disruptive on a team?
A: The biggest change is discipline around git — never merging your own PRs, keeping commits atomic so teammates can follow the history, and writing PR descriptions that explain the why, not just the what. I already do this in my personal projects. The harder part is agreeing on architecture upfront — that is exactly why patterns like Core/Feature/Shared exist, so five developers can work independently without breaking each other's code.
Red flag answer: "I would communicate more." — Too vague. The interviewer wants specific practices, not intentions.

---

## HTTP fundamentals

**What is the difference between PUT and PATCH, and what does idempotency mean?** ⭐⭐⭐
PUT replaces the entire resource — the client sends every field, and any field left out is cleared. PATCH updates only the fields you send and leaves the rest untouched. Both are *idempotent*: calling the same PUT or DELETE several times leaves the system in the same final state as calling it once. POST is *not* idempotent — each call can create a new resource. Idempotency matters for reliability: if a network failure makes a client retry, an idempotent request is safe to repeat, while a POST might create a duplicate.

> **Junior tip:** The idempotency angle is what separates a junior who knows CRUD from one who knows REST. Say: "PUT and DELETE are idempotent, POST is not — so a retried POST can duplicate data."
> **Consejo de entrevista:** El ángulo de la idempotencia separa al junior que conoce CRUD del que conoce REST. Di: "PUT y DELETE son idempotentes, POST no — así que un POST reintentado puede duplicar datos."

**Why must you never send a password over plain HTTP?** ⭐⭐
Because HTTP traffic travels in plain text — anyone between the client and the server (on the same Wi-Fi, an ISP, a compromised router) can read the request, including the password or the JWT in the `Authorization` header. HTTPS wraps the connection in TLS, which encrypts everything in transit so it cannot be read or tampered with. Any API that handles credentials or tokens must be HTTPS-only; in production you also redirect HTTP to HTTPS so a request is never accidentally sent unencrypted.

> **Junior tip:** The phrase that lands: "HTTP is plain text, HTTPS is encrypted in transit — credentials and JWTs must only ever go over HTTPS." That shows you understand the threat, not just the acronym.
> **Consejo de entrevista:** La frase clave: "HTTP es texto plano, HTTPS está cifrado en tránsito — las credenciales y los JWT solo deben ir por HTTPS." Demuestra que entiendes la amenaza, no solo el acrónimo.

---

## Testing concepts

**What is the difference between a mock and a stub?** ⭐⭐
Both replace a real dependency in a test, but their purpose differs. A *stub* just returns a fixed, canned value so the code under test has something to work with — you do not check how it was used. A *mock* is a configurable fake you can also *verify* afterwards — you assert it was called, how many times, and with which arguments. In practice the word "mock" is used loosely for both, and Mockito covers both: `when(...).thenReturn(...)` is the stub behaviour, `verify(...)` is the mock behaviour.

> **Junior tip:** The distinction interviewers want: "a stub gives an answer; a mock also lets me verify the interaction." Mention that Mockito does both, so the line is blurry in day-to-day Java testing.
> **Consejo de entrevista:** La distinción que buscan: "un stub da una respuesta; un mock además me deja verificar la interacción." Menciona que Mockito hace ambos, así que la línea se difumina en el día a día.

---

## Tooling and operations

**Is Base64 a form of encryption?** ⭐⭐
No — Base64 is *encoding*, not encryption. It is a reversible way to represent binary data using 64 printable characters, and anyone can decode it in one step with no key. This is exactly why a JWT is not "secure" just because it is Base64: you can paste any token into jwt.io and read the header and payload instantly. The security of a JWT comes from its signature, not from the encoding. Interviewers ask this specifically to catch candidates who confuse encoding with security.

> **Junior tip:** State it bluntly: "Base64 is encoding, not encryption — no key, instantly reversible." Then connect it to JWT: the payload is readable, only the signature protects it.
> **Consejo de entrevista:** Dilo sin rodeos: "Base64 es codificación, no cifrado — sin clave, reversible al instante." Luego conéctalo con el JWT: el payload es legible, solo la firma lo protege.

**Why must secrets never be committed to git, even if you delete them later?** ⭐⭐
Because git history is permanent — a secret committed once stays visible in every clone and in the history forever, even after you delete it in a later commit. So the moment a key is pushed it must be treated as compromised and rotated immediately; removing it from the latest version does not undo the exposure. The correct setup is to keep secrets in environment variables (referenced as `${VAR}` in config), commit only a `.env.example` documenting which variables are needed, and never the real values.

Red flag answer: "I deleted it in the next commit, so it's fine." — The secret is still in the history of every clone. Deleting it later does not remove it; the only safe response is to rotate the key.

**Why is `console.log` / `System.out.println` not enough for debugging production code, and what are log levels?** ⭐⭐
Print statements cannot be turned off without editing code, are not timestamped, and vanish when the terminal closes — useless once an app is deployed with no debugger attached. A logging framework gives you levels you can filter: `DEBUG` (detailed, dev only), `INFO` (normal events like "user logged in"), `WARN` (something unexpected but recovered), and `ERROR` (something actually failed). You set the production level to `INFO` or `WARN` so the noise is gone but problems are still recorded with timestamps and context.

> **Junior tip:** Pick the level deliberately: a caught exception the app recovered from is `WARN`, not `ERROR`. Knowing that distinction shows you have thought about real production logs, not just `console.log`.
> **Consejo de entrevista:** Elige el nivel a propósito: una excepción capturada de la que la app se recuperó es `WARN`, no `ERROR`. Conocer esa distinción demuestra que has pensado en logs de producción reales.
