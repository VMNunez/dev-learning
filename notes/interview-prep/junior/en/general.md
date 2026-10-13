# General — Interview Questions

<a id="study-index"></a>

## Study index

Start with the first pass. Within each pass, follow the topics from top to bottom and work through a small group of questions at a time. If a question needs a concept from another pass, consult that question and then return to where you were.

| Pass | Priority | Questions |
|---|---|---:|
| [1. Essentials](#study-pass-1) | ⭐⭐⭐ | 6 |
| [2. Deeper understanding](#study-pass-2) | ⭐⭐ | 17 |
| [3. Details](#study-pass-3) | ⭐ | 0 |

Read the question, try to answer without looking, check your answer against the written one and explain it again in your own words. In the next block, recall an earlier question without consulting its answer.

Links lead to the original questions. The numbers are their identifiers, not the study order. This index supports independent study. Record your progress in the Spanish index: ✅ and the date at the end of the line of each question you have worked on, then · PASS and the date when you pass it in a recall exam.

<a id="study-pass-1"></a>

### First pass — Essentials — ⭐⭐⭐

**General programming**

- [001 — The DRY principle](#GEN-J-001)
- [002 — Synchronous versus asynchronous code](#GEN-J-002)

**Agile and teamwork**

- [008 — Working in an agile environment](#GEN-J-008)
- [012 — Scrum versus Kanban](#GEN-J-012)
- [013 — The roles in Scrum](#GEN-J-013)

**HTTP fundamentals**

- [018 — PUT versus PATCH and idempotency](#GEN-J-018)

<a id="study-pass-2"></a>

### Second pass — Deeper understanding — ⭐⭐

**General programming**

- [003 — Immutability in Angular](#GEN-J-003)
- [004 — Separation of concerns](#GEN-J-004)
- [005 — Single source of truth](#GEN-J-005)
- [006 — The KISS principle](#GEN-J-006)
- [007 — What YAGNI is](#GEN-J-007)

**Agile and teamwork**

- [009 — Sprint versus backlog](#GEN-J-009)
- [010 — The daily standup](#GEN-J-010)
- [011 — From solo workflow to team](#GEN-J-011)
- [014 — The Scrum ceremonies](#GEN-J-014)
- [015 — What a user story is](#GEN-J-015)
- [016 — Story points instead of hours](#GEN-J-016)
- [017 — Definition of Done](#GEN-J-017)

**HTTP fundamentals**

- [019 — Passwords over plain HTTP](#GEN-J-019)

**Testing concepts**

- [020 — Mock versus stub](#GEN-J-020)

**Tooling and operations**

- [021 — Base64 is not encryption](#GEN-J-021)
- [022 — Secrets committed to git](#GEN-J-022)
- [023 — Print debugging and log levels](#GEN-J-023)

<a id="study-pass-3"></a>

### Third pass — Details — ⭐

---

## General programming

<a id="GEN-J-001"></a>

**[GEN-J-001] What is the DRY principle?** ⭐⭐⭐
"Don't Repeat Yourself" — if the same logic appears in more than one place, extract it into a function, service, or component. In the HR portal, the confirm dialog pattern is reusable across three different pages — that is DRY in practice.

<a id="GEN-J-002"></a>

**[GEN-J-002] What is the difference between synchronous and asynchronous code?** ⭐⭐⭐
Synchronous code runs line by line and blocks execution until each line finishes. Asynchronous code (HTTP calls, timers, user events) starts an operation and continues without waiting for it to finish. In Angular, almost everything that touches a server is asynchronous — that is why we use Observables and signals.

<a id="GEN-J-003"></a>

**[GEN-J-003] What is immutability and why does it matter in Angular?** ⭐⭐
Immutability means not modifying existing objects — instead, you create new ones with the changes. Angular's change detection works better with immutable data because it can detect changes by reference. HTTP requests are also immutable in Angular — that is why you use `req.clone()` in interceptors.

<a id="GEN-J-004"></a>

**[GEN-J-004] What is separation of concerns?** ⭐⭐
Each part of the code should do one thing and be responsible for one area. In Angular: components handle the template, services handle data and logic, guards handle route access. Mixing them together makes the code harder to test and maintain.

<a id="GEN-J-005"></a>

**[GEN-J-005] What does "single source of truth" mean?** ⭐⭐
One place in the app holds the authoritative version of a piece of data. In the HR portal, `EmployeeService` is the single source of truth for the employee list — any component that needs it reads from there, so they all stay in sync automatically.

<a id="GEN-J-006"></a>

**[GEN-J-006] What is the KISS principle?** ⭐⭐
KISS — "Keep It Simple, Stupid". The simplest solution that solves the problem is the right one; complexity is a cost you only pay when it is justified. In practice it means not reaching for a design pattern, an abstraction, or a clever one-liner when a plain function would do. It matters more than ever in 2026 because AI tools generate over-engineered boilerplate — recognising when code is needlessly complex and simplifying it is a real review skill.

> **Junior tip:** Tie it to AI: "AI often gives me a more complex solution than the problem needs — KISS is knowing when to delete half of it." That shows the modern, review-focused angle interviewers care about.
> **Consejo de entrevista:** Conéctalo con la IA: "la IA a menudo me da una solución más compleja de lo que el problema necesita — KISS es saber cuándo borrar la mitad."

<a id="GEN-J-007"></a>

**[GEN-J-007] What is YAGNI?** ⭐⭐
YAGNI — "You Aren't Gonna Need It". Do not build features or flexibility for hypothetical future requirements; build only what is needed now. Classic violations: adding pagination before any list is long, or building a configurable plugin system for a feature that has exactly one implementation. The future requirement often never arrives, and the speculative code becomes dead weight that still has to be maintained and tested.

> **Junior tip:** Pair it with KISS in your answer — "KISS keeps the solution simple, YAGNI keeps me from solving problems I don't have yet." Mention that AI-generated code frequently violates YAGNI with speculative abstractions.
> **Consejo de entrevista:** Combínalo con KISS — "KISS mantiene la solución simple, YAGNI me impide resolver problemas que aún no tengo." Menciona que el código generado por IA suele violar YAGNI con abstracciones especulativas.

---

## Agile and teamwork

<a id="GEN-J-008"></a>

**[GEN-J-008] Have you worked in an agile environment?** ⭐⭐⭐
Not professionally, but I follow agile practices in my own projects — atomic commits, feature branches, PR descriptions, and short focused changes. I understand the ceremony: daily standup to share blockers, sprint to timebox work, retrospective to improve the process. The part I would adapt to fastest in a consultancy is the PR review cycle — I already practice it in my personal workflow.

<a id="GEN-J-009"></a>

**[GEN-J-009] What is the difference between a sprint and a backlog?** ⭐⭐
The backlog is the full list of features and tasks for the project, ordered by priority. A sprint is a fixed time period — usually two weeks — where the team picks a subset of backlog items and commits to finishing them. At the end of the sprint you have working software, not half-finished features.

<a id="GEN-J-010"></a>

**[GEN-J-010] What is a daily standup and what do you say in it?** ⭐⭐
A short daily meeting — usually 15 minutes — where each person answers three questions: what did I do yesterday, what will I do today, and is anything blocking me. The goal is to surface blockers early, not to report progress to a manager.

<a id="GEN-J-011"></a>

**[GEN-J-011] What would you change about your solo workflow when joining a team?** ⭐⭐
What they really want to know: Are you ready for professional collaboration, or will you be disruptive on a team?
A: The biggest change is discipline around git — never merging your own PRs, keeping commits atomic so teammates can follow the history, and writing PR descriptions that explain the why, not just the what. I already do this in my personal projects. The harder part is agreeing on architecture upfront — that is exactly why patterns like Core/Feature/Shared exist, so five developers can work independently without breaking each other's code.
Red flag answer: "I would communicate more." — Too vague. The interviewer wants specific practices, not intentions.

<a id="GEN-J-012"></a>

**[GEN-J-012] What is the difference between Scrum and Kanban?** ⭐⭐⭐
Scrum works in fixed sprints — usually two weeks — with defined roles and ceremonies, and the team commits to a set of items for each sprint. Kanban is a continuous flow: tasks move across a board and the team pulls the next one when it has capacity, with a limit on how many can be in progress at once. Scrum suits planned feature work; Kanban suits a steady stream of unpredictable tasks like support or bug-fixing. Consultancies mostly run Scrum, sometimes Kanban for maintenance teams.

<a id="GEN-J-013"></a>

**[GEN-J-013] What are the roles in Scrum?** ⭐⭐⭐
Three: the Product Owner owns the backlog and decides priority — they represent the client. The Scrum Master removes blockers and protects the process; they are not a manager and don't assign tasks. The Development Team builds the increment. What matters as a junior: I don't decide what to build next — that's the PO — and if I'm blocked, I raise it to the Scrum Master, usually in the daily standup.

<a id="GEN-J-014"></a>

**[GEN-J-014] What are the Scrum ceremonies?** ⭐⭐
Four. Sprint planning at the start — the team decides what to pull into the sprint. The daily standup — the 15-minute sync on progress and blockers. The sprint review at the end — you demo the working increment to stakeholders. And the retrospective — the team looks at its own process and agrees on one thing to improve. Planning and the standup are about the work; the review and retro are about the outcome and the process.

<a id="GEN-J-015"></a>

**[GEN-J-015] What is a user story?** ⭐⭐
A requirement written from the user's point of view, in the format "As a [role], I want [goal] so that [benefit]". For example, in TimeTrack: "As a manager, I want to approve submitted time entries so that payroll only counts validated hours." It keeps the focus on the value to the user, not just a technical task, and the "so that" part is what tells you when the story is actually done.

<a id="GEN-J-016"></a>

**[GEN-J-016] Why do teams estimate in story points instead of hours?** ⭐⭐
Because people are bad at guessing hours but reasonably good at comparing sizes. Story points are a relative measure — this story is roughly twice the effort of that one — often on a Fibonacci-like scale. It also separates effort from the person: two hours for me and for a senior are different, but the relative size of the work is the same. As a junior I'd expect to estimate as a team, not alone.

<a id="GEN-J-017"></a>

**[GEN-J-017] What does "Definition of Done" mean?** ⭐⭐
It's the shared checklist an item has to meet before the team calls it done — typically: code written, reviewed in a PR, tested, merged, and it meets the story's acceptance criteria. The point is that "done" is a team agreement, not a personal opinion. In my own projects my definition of done is: the code works, has at least one meaningful test, runs locally, and is committed atomically — the same idea applied solo.

---

## HTTP fundamentals

<a id="GEN-J-018"></a>

**[GEN-J-018] What is the difference between PUT and PATCH, and what does idempotency mean?** ⭐⭐⭐
PUT replaces the entire resource — the client sends every field, and any field left out is cleared. PATCH updates only the fields you send and leaves the rest untouched. Both are *idempotent*: calling the same PUT or DELETE several times leaves the system in the same final state as calling it once. POST is *not* idempotent — each call can create a new resource. Idempotency matters for reliability: if a network failure makes a client retry, an idempotent request is safe to repeat, while a POST might create a duplicate.

> **Junior tip:** The idempotency angle is what separates a junior who knows CRUD from one who knows REST. Say: "PUT and DELETE are idempotent, POST is not — so a retried POST can duplicate data."
> **Consejo de entrevista:** El ángulo de la idempotencia separa al junior que conoce CRUD del que conoce REST. Di: "PUT y DELETE son idempotentes, POST no — así que un POST reintentado puede duplicar datos."

<a id="GEN-J-019"></a>

**[GEN-J-019] Why must you never send a password over plain HTTP?** ⭐⭐
Because HTTP traffic travels in plain text — anyone between the client and the server (on the same Wi-Fi, an ISP, a compromised router) can read the request, including the password or the JWT in the `Authorization` header. HTTPS wraps the connection in TLS, which encrypts everything in transit so it cannot be read or tampered with. Any API that handles credentials or tokens must be HTTPS-only; in production you also redirect HTTP to HTTPS so a request is never accidentally sent unencrypted.

> **Junior tip:** The phrase that lands: "HTTP is plain text, HTTPS is encrypted in transit — credentials and JWTs must only ever go over HTTPS." That shows you understand the threat, not just the acronym.
> **Consejo de entrevista:** La frase clave: "HTTP es texto plano, HTTPS está cifrado en tránsito — las credenciales y los JWT solo deben ir por HTTPS." Demuestra que entiendes la amenaza, no solo el acrónimo.

---

## Testing concepts

<a id="GEN-J-020"></a>

**[GEN-J-020] What is the difference between a mock and a stub?** ⭐⭐
Both replace a real dependency in a test, but their purpose differs. A *stub* just returns a fixed, canned value so the code under test has something to work with — you do not check how it was used. A *mock* is a configurable fake you can also *verify* afterwards — you assert it was called, how many times, and with which arguments. In practice the word "mock" is used loosely for both, and Mockito covers both: `when(...).thenReturn(...)` is the stub behaviour, `verify(...)` is the mock behaviour.

> **Junior tip:** The distinction interviewers want: "a stub gives an answer; a mock also lets me verify the interaction." Mention that Mockito does both, so the line is blurry in day-to-day Java testing.
> **Consejo de entrevista:** La distinción que buscan: "un stub da una respuesta; un mock además me deja verificar la interacción." Menciona que Mockito hace ambos, así que la línea se difumina en el día a día.

---

## Tooling and operations

<a id="GEN-J-021"></a>

**[GEN-J-021] Is Base64 a form of encryption?** ⭐⭐
No — Base64 is *encoding*, not encryption. It is a reversible way to represent binary data using 64 printable characters, and anyone can decode it in one step with no key. This is exactly why a JWT is not "secure" just because it is Base64: you can paste any token into jwt.io and read the header and payload instantly. The security of a JWT comes from its signature, not from the encoding. Interviewers ask this specifically to catch candidates who confuse encoding with security.

> **Junior tip:** State it bluntly: "Base64 is encoding, not encryption — no key, instantly reversible." Then connect it to JWT: the payload is readable, only the signature protects it.
> **Consejo de entrevista:** Dilo sin rodeos: "Base64 es codificación, no cifrado — sin clave, reversible al instante." Luego conéctalo con el JWT: el payload es legible, solo la firma lo protege.

<a id="GEN-J-022"></a>

**[GEN-J-022] Why must secrets never be committed to git, even if you delete them later?** ⭐⭐
Because git history is permanent — a secret committed once stays visible in every clone and in the history forever, even after you delete it in a later commit. So the moment a key is pushed it must be treated as compromised and rotated immediately; removing it from the latest version does not undo the exposure. The correct setup is to keep secrets in environment variables (referenced as `${VAR}` in config), commit only a `.env.example` documenting which variables are needed, and never the real values.

Red flag answer: "I deleted it in the next commit, so it's fine." — The secret is still in the history of every clone. Deleting it later does not remove it; the only safe response is to rotate the key.

<a id="GEN-J-023"></a>

**[GEN-J-023] Why is `console.log` / `System.out.println` not enough for debugging production code, and what are log levels?** ⭐⭐
Print statements cannot be turned off without editing code, are not timestamped, and vanish when the terminal closes — useless once an app is deployed with no debugger attached. A logging framework gives you levels you can filter: `DEBUG` (detailed, dev only), `INFO` (normal events like "user logged in"), `WARN` (something unexpected but recovered), and `ERROR` (something actually failed). You set the production level to `INFO` or `WARN` so the noise is gone but problems are still recorded with timestamps and context.

> **Junior tip:** Pick the level deliberately: a caught exception the app recovered from is `WARN`, not `ERROR`. Knowing that distinction shows you have thought about real production logs, not just `console.log`.
> **Consejo de entrevista:** Elige el nivel a propósito: una excepción capturada de la que la app se recuperó es `WARN`, no `ERROR`. Conocer esa distinción demuestra que has pensado en logs de producción reales.
