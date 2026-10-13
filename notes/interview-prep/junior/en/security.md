# Security — Interview Questions

<a id="study-index"></a>

## Study index

Start with the first pass. Within each pass, follow the topics from top to bottom and work through a small group of questions at a time. If a question needs a concept from another pass, consult that question and then return to where you were.

| Pass | Priority | Questions |
|---|---|---:|
| [1. Essentials](#study-pass-1) | ⭐⭐⭐ | 9 |
| [2. Deeper understanding](#study-pass-2) | ⭐⭐ | 8 |
| [3. Details](#study-pass-3) | ⭐ | 1 |

Read the question, try to answer without looking, check your answer against the written one and explain it again in your own words. In the next block, recall an earlier question without consulting its answer.

Links lead to the original questions. The numbers are their identifiers, not the study order. This index supports independent study. Record your progress in the Spanish index: ✅ and the date at the end of the line of each question you have worked on, then · PASS and the date when you pass it in a recall exam.

<a id="study-pass-1"></a>

### First pass — Essentials — ⭐⭐⭐

**Authentication and authorisation**

- [001 — Authentication and authorisation](#SEC-J-001)
- [002 — 401 and 403 responses](#SEC-J-002)
- [003 — Role-based access enforcement](#SEC-J-003)

**JWT**

- [005 — JWT parts and claims](#SEC-J-005)
- [006 — JWT encryption and sensitive data](#SEC-J-006)

**Cryptography basics**

- [009 — Hashing and encryption](#SEC-J-009)

**CORS**

- [011 — CORS and origins](#SEC-J-011)

**Common vulnerabilities**

- [014 — SQL injection and JPA](#SEC-J-014)
- [015 — XSS and Angular protection](#SEC-J-015)

<a id="study-pass-2"></a>

### Second pass — Deeper understanding — ⭐⭐

**Authentication and authorisation**

- [004 — Generic login errors](#SEC-J-004)

**JWT**

- [007 — Access and refresh tokens](#SEC-J-007)
- [008 — JWT browser storage](#SEC-J-008)

**Cryptography basics**

- [010 — BCrypt and slow hashing](#SEC-J-010)

**CORS**

- [012 — CORS errors versus Postman](#SEC-J-012)

**Common vulnerabilities**

- [016 — CSRF and bearer tokens](#SEC-J-016)
- [017 — Server-side input validation](#SEC-J-017)
- [018 — Entity binding and request DTOs](#SEC-J-018)

<a id="study-pass-3"></a>

### Third pass — Details — ⭐

**CORS**

- [013 — CORS preflight requests](#SEC-J-013)

---

## Authentication and authorisation

<a id="SEC-J-001"></a>

**[SEC-J-001] What is the difference between authentication and authorisation?** ⭐⭐⭐

Authentication confirms *who you are* — logging in with email and password to prove your identity. Authorisation confirms *what you are allowed to do* — checking your role to decide if you can reach a resource. In the HR portal, `authGuard` handles authentication (is there a valid token?) and `adminGuard` handles authorisation (is the role `admin`?). They always run in that order: you authenticate first, then the system authorises the action.

> **Junior tip:** The one-liner: "authentication = who are you, authorisation = what can you do." Then give the guard example — concrete beats abstract.
> **Consejo de entrevista:** La frase clave: "autenticación = quién eres, autorización = qué puedes hacer." Luego da el ejemplo de los guards — lo concreto gana a lo abstracto.

<a id="SEC-J-002"></a>

**[SEC-J-002] What is the difference between 401 Unauthorized and 403 Forbidden?** ⭐⭐⭐

401 means you are *not authenticated* — there is no token, the token expired, or the signature is invalid; the server does not know who you are. 403 means you *are authenticated but not authorised* — your token is valid but your role is not allowed to access that resource. In project 07, a request with no JWT to a protected endpoint returns 401; a `USER` hitting an endpoint annotated `@PreAuthorize("hasRole('ADMIN')")` returns 403.

> **Junior tip:** "401 = who are you? 403 = I know you, but no." The HTTP names are misleading (401 literally says "Unauthorized" but means *unauthenticated*) — saying it clearly shows you are not one of the juniors who mix them up.
> **Consejo de entrevista:** "401 = ¿quién eres? 403 = sé quién eres, pero no." Los nombres HTTP confunden (401 dice "Unauthorized" pero significa *no autenticado*) — decirlo con claridad te separa de los juniors que los mezclan.

<a id="SEC-J-003"></a>

**[SEC-J-003] Where do you enforce role-based access — on the frontend, the backend, or both?** ⭐⭐⭐

On both, but the backend is the only one that counts. Angular route guards and role-aware `@if` hide admin features so a normal user never sees them — that is UX, not security, because anyone can bypass the frontend with Postman or DevTools. The real enforcement is on the backend with `@PreAuthorize("hasRole('MANAGER')")`, which rejects the request regardless of what the client sends. The frontend cleans the interface; the backend protects the data.

Red flag answer: "I check the role in the Angular guard." — A guard only hides the button; it does not stop a crafted HTTP request. Trusting the frontend for authorisation is one of the most common junior security mistakes.

<a id="SEC-J-004"></a>

**[SEC-J-004] Why does a failed login always return one generic "invalid credentials" message instead of saying "wrong password" or "email not found"?** ⭐⭐

Because a specific message lets an attacker *enumerate* accounts: "email not found" confirms which addresses are not registered, so "wrong password" implicitly confirms which ones are. By returning the same generic message for both cases, the API leaks nothing about which emails exist. In Spring Boot this means handling `BadCredentialsException` (and a missing user) with one identical response.

Red flag answer: "I tell the user exactly what went wrong so it is friendlier." — Helpful for the user, but it hands an attacker a list of valid accounts. Security beats convenience on the login endpoint.

---

## JWT

<a id="SEC-J-005"></a>

**[SEC-J-005] What are the three parts of a JWT and what does each contain?** ⭐⭐⭐

A JWT is `header.payload.signature`. The header says the signing algorithm (e.g. `HS256`). The payload carries the claims — `sub` (the subject, usually the email), `iat` (issued-at), `exp` (expiry), and often the role. The signature is an HMAC of the header and payload computed with the server's secret. The first two parts are Base64-encoded JSON; the signature is what proves they were not tampered with.

> **Junior tip:** Name the three parts and the standard claims (`sub`, `iat`, `exp`). Most juniors say "it holds the user data" — naming the claims shows you actually know the standard.
> **Consejo de entrevista:** Nombra las tres partes y los claims estándar (`sub`, `iat`, `exp`). La mayoría de juniors dice "guarda los datos del usuario" — nombrar los claims demuestra que conoces el estándar.

<a id="SEC-J-006"></a>

**[SEC-J-006] Is a JWT encrypted? Is it secure to put data in it?** ⭐⭐⭐

The payload is *not* encrypted — it is only Base64-encoded, so anyone who intercepts the token can decode and read it. What protects a JWT is the *signature*, not secrecy: the server recomputes the HMAC with its own secret and compares, so any change to the payload breaks the signature and the token is rejected. That means you can trust a JWT has not been tampered with, but you must never put passwords or sensitive data inside it.

Red flag answer: "Yes, JWTs are encrypted so the data is safe." — Base64 is encoding, not encryption. Anyone can paste the token into jwt.io and read the payload. The guarantee is integrity (not tampered), not confidentiality.

<a id="SEC-J-007"></a>

**[SEC-J-007] What is the difference between an access token and a refresh token?** ⭐⭐

The access token is short-lived (15 minutes to an hour) and sent with every request. The refresh token is long-lived and used only to obtain a new access token when the old one expires, without forcing the user to log in again. Keeping the access token short limits the damage if it is stolen — an attacker only has a small window — while the refresh token lets the user stay logged in comfortably.

> **Junior tip:** "Short access token for security, long refresh token for convenience." You do not need to have built refresh tokens — knowing why the pattern exists is enough at junior level.
> **Consejo de entrevista:** "Token de acceso corto por seguridad, token de refresco largo por comodidad." No hace falta haberlos implementado — basta con saber por qué existe el patrón.

<a id="SEC-J-008"></a>

**[SEC-J-008] Where do you store the JWT in the browser, and what are the trade-offs?** ⭐⭐

`localStorage` is the simplest option and what I use in the HR portal — it survives refreshes and tabs, but JavaScript can read it, so an XSS attack could steal the token. An `HttpOnly` cookie cannot be read by JavaScript, which removes the XSS theft risk, but cookies are sent automatically so they reintroduce a CSRF risk and need CSRF protection. For SPAs that already prevent XSS, `localStorage` is the common choice at Spanish consultancies — as long as you can name the trade-off.

Red flag answer: "I just use localStorage." — Acceptable *only* if you immediately acknowledge the XSS risk. Saying it with no mention of the trade-off signals you are unaware of the security implication.

---

## Cryptography basics

<a id="SEC-J-009"></a>

**[SEC-J-009] What is the difference between hashing and encryption, and why are passwords hashed?** ⭐⭐⭐

Hashing is one-way — you cannot reverse a hash back to the original input. Encryption is two-way — anything encrypted with a key can be decrypted with that key. Passwords are hashed, not encrypted, because the system never needs to recover the original password: at login it hashes the input and compares hashes. So if the database is stolen, the attacker cannot read the passwords — they would have to brute-force every possible input against each hash.

> **Junior tip:** "Hashing is one-way, encryption is two-way." Then the killer point: "you hash passwords because you never need to read them back — you only compare." That shows you understand *why*, not just the definitions.
> **Consejo de entrevista:** "El hashing es de una vía, el cifrado de dos vías." Luego el punto clave: "hasheas contraseñas porque nunca necesitas leerlas, solo comparar."

<a id="SEC-J-010"></a>

**[SEC-J-010] What is BCrypt, and why is being slow a feature rather than a bug?** ⭐⭐

BCrypt is a password-hashing algorithm with a built-in random salt and a configurable work factor (Spring's `BCryptPasswordEncoder` defaults to 10 rounds). It is *intentionally* slow: a fast hash lets an attacker try billions of guesses per second, while a slow one makes large-scale brute-forcing impractical. The salt means two users with the same password get different hashes, so an attacker cannot precompute a lookup table (rainbow table). BCrypt handles the salting automatically.

> **Junior tip:** The counter-intuitive point interviewers like: "slow is the point — it throttles brute-force attacks." Mention the automatic salt too; together they show real understanding.
> **Consejo de entrevista:** El punto contraintuitivo que gusta: "lento es la gracia — frena los ataques de fuerza bruta." Menciona también el salt automático; juntos demuestran comprensión real.

---

## CORS

<a id="SEC-J-011"></a>

**[SEC-J-011] What is CORS, and what counts as an "origin"?** ⭐⭐⭐

An origin is the combination of protocol + domain + port, so `http://localhost:4200` and `http://localhost:8080` are different origins even on the same machine. By default the browser enforces the Same-Origin Policy and blocks JavaScript from reading a response from a different origin. CORS is the mechanism that lets a server explicitly say "I allow requests from this origin." It is why an Angular dev server on 4200 cannot call a Spring Boot API on 8080 until the backend allows it.

> **Junior tip:** Define origin precisely — protocol + domain + port — because the "same domain, different port" case is exactly what trips up the Angular/Spring Boot setup. That precision signals real experience.
> **Consejo de entrevista:** Define origen con precisión — protocolo + dominio + puerto — porque el caso "mismo dominio, distinto puerto" es justo lo que rompe el setup Angular/Spring Boot.

<a id="SEC-J-012"></a>

**[SEC-J-012] A request works in Postman but fails with a CORS error in the browser. Why?** ⭐⭐

Because CORS is enforced by the *browser*, not the server. The server receives and processes the request normally and sends a response — but the browser blocks JavaScript from reading that response when the origin is not allowed. Postman is not a browser, so it has no Same-Origin Policy to enforce and the call succeeds. The fix is always on the server: configure a `CorsConfigurationSource` inside the `SecurityFilterChain` to allow the Angular origin.

Red flag answer: "There is a bug in the backend code." — The backend ran fine; the browser blocked the response. Looking for the fix in the frontend or assuming a server bug shows you do not understand where CORS is enforced.

<a id="SEC-J-013"></a>

**[SEC-J-013] What is a CORS preflight request?** ⭐

Before certain requests — any POST with a JSON body, or any request with an `Authorization` header — the browser automatically sends an `OPTIONS` request first to ask the server which origins, methods, and headers it permits. If the server does not respond with the right CORS headers to that preflight, the browser never sends the real request. So a missing CORS config often shows up as a failed `OPTIONS` call you did not write yourself.

> **Junior tip:** Knowing the preflight exists explains the mysterious `OPTIONS` request juniors see in the network tab. Mentioning that an `Authorization` header triggers it shows you have actually debugged a CORS issue.
> **Consejo de entrevista:** Saber que existe el preflight explica la misteriosa petición `OPTIONS` que aparece en la pestaña de red. Mencionar que la cabecera `Authorization` lo dispara demuestra que has depurado un problema de CORS de verdad.

---

## Common vulnerabilities

<a id="SEC-J-014"></a>

**[SEC-J-014] What is SQL injection, and how does JPA protect against it?** ⭐⭐⭐

SQL injection is when an attacker puts SQL into an input field — like a login form — to change the query, for example to bypass authentication or dump a table. JPA and Spring Data protect against it automatically by using *parameterised queries*: the value is sent to the database separately from the SQL text, so it is always treated as data, never as executable SQL. The only way to reopen the hole is to build a query by concatenating user input into a raw string.

> **Junior tip:** The answer they want is "parameterised queries — the input is passed as a parameter, never concatenated into the SQL." Add that string-concatenating a query is what reintroduces the risk.
> **Consejo de entrevista:** La respuesta que buscan es "consultas parametrizadas — la entrada va como parámetro, nunca concatenada en el SQL." Añade que concatenar la entrada en la query es lo que reabre el riesgo.

<a id="SEC-J-015"></a>

**[SEC-J-015] What is XSS, how does Angular prevent it, and can Angular still be vulnerable?** ⭐⭐⭐

XSS (Cross-Site Scripting) is when an attacker injects malicious JavaScript that runs in other users' browsers — it can steal a token from `localStorage`, for example. Angular prevents most XSS automatically by escaping every value bound in a template, so user input is rendered as text, not executed. The exception is `[innerHTML]`: Angular deliberately does not escape it, so rendering user-provided content through `[innerHTML]` reopens the XSS hole unless you sanitise it first.

Red flag answer: "Angular is safe from XSS, so I don't worry about it." — Angular's default binding is safe, but `[innerHTML]` (and `bypassSecurityTrust...`) deliberately bypass that protection. Knowing the exception is exactly what the interviewer is testing.

<a id="SEC-J-016"></a>

**[SEC-J-016] What is CSRF, and why does using a JWT in the Authorization header prevent it?** ⭐⭐

CSRF (Cross-Site Request Forgery) tricks a logged-in user's browser into sending an unwanted request to a site where they are authenticated. It works because the browser attaches *cookies* automatically to every request to that domain. A JWT sent in the `Authorization: Bearer` header is not attached automatically — your JavaScript has to add it deliberately — so a forged cross-site request carries no token and is rejected. That is why a stateless JWT API can safely disable CSRF protection.

> **Junior tip:** The link to make: "CSRF relies on cookies being sent automatically; a JWT in a header is added manually, so the attack has nothing to ride on." That sentence connects CSRF, JWT, and why you disable CSRF in a REST API.
> **Consejo de entrevista:** La conexión a hacer: "CSRF depende de que las cookies se envíen solas; un JWT en una cabecera se añade a mano, así que el ataque no tiene de qué aprovecharse."

<a id="SEC-J-017"></a>

**[SEC-J-017] Why do you validate input on the server even when you already validate it on the client?** ⭐⭐

Because client-side validation can be bypassed — anyone can send a request directly with Postman or edit the DOM in DevTools, skipping the Angular form entirely. Client validation is for user experience (fast feedback); the server is the only boundary you actually control and can trust. In Spring Boot I enforce it with `@Valid` and `@NotBlank` on the request DTO, so invalid data is rejected even if it never went through the form.

Red flag answer: "The Angular form already validates it, so the backend doesn't need to." — The form is trivially bypassed. Trusting client-side validation as a security control is a classic mistake; the server must re-validate everything.

<a id="SEC-J-018"></a>

**[SEC-J-018] What could go wrong if a controller binds the request body directly to the JPA entity instead of a request DTO?** ⭐⭐

Mass assignment. If the JSON is bound straight onto the entity, a malicious client can set fields it should never control just by adding them to the body — `"role": "MANAGER"` or `"active": true` — and quietly escalate its own privileges. A request DTO closes this hole because it only declares the fields a client is allowed to send; anything extra in the JSON is ignored. This is one more reason DTOs are a security boundary, not just a mapping convenience.

Red flag answer: "Binding to the entity is fine, it's less code." — It lets the client write any column on the table, including `role` and `active`. The request DTO is what limits the attack surface to the fields you intended.
