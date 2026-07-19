# Minimum Coverage — Security

Web security concepts a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects — not just a textbook definition.

## Security principles and the OWASP Top 10

- The OWASP Top 10 — the industry's reference list of web application risk categories; you are expected to name several of them (broken access control, cryptographic failures, injection, security misconfiguration, vulnerable and outdated components) and to say which you consider the highest risk in your own app and why; interviewers at banking and public-sector accounts ask for it by name, and "I've heard of it" is a visible gap
- Security misconfiguration as a category — the flaw is not in code you wrote but in a default nobody turned off: an exposed actuator, a `permitAll` left on a forgotten endpoint, the H2 console reachable in production, Swagger UI published, CORS set to `*`, or default credentials; interviewers ask you to name the category and give two examples from your own stack
- Defence in depth — no single control is trusted on its own, which is why the role is checked in the route guard *and* at the endpoint, and why the database user is restricted even though injection is already prevented by parameterised queries; interviewers ask why you bothered with the second layer once the first one works
- Allow-list over block-list — you define what is permitted and reject everything else, because any list of forbidden values is incomplete against an attacker who encodes around it; this is the principle underneath parameterised queries, HTML sanitisers, and CORS origin config, and interviewers use "why not just strip the dangerous characters?" to test whether you know why filtering fails

---

## Authentication and authorisation
- Authentication vs authorisation — authentication confirms who you are (login); authorisation confirms what you are allowed to do (role check); interviewers always ask the difference and expect an example from a real project
- 401 vs 403 — `401 Unauthorized` means not authenticated (no token, expired token, invalid token); `403 Forbidden` means authenticated but not authorised (valid token, wrong role); interviewers test this pair because the HTTP names are confusing and juniors routinely mix them up
- Session-based auth — the server stores a session in memory and gives the client a cookie; stateful; does not scale horizontally without shared session storage; asked as a contrast to JWT
- Token-based auth (JWT) — the client stores the token and sends it with every request; the server validates it without storing anything; stateless; interviewers ask why stateless auth matters for scaling
- Role-based access control — `EMPLOYEE` vs `MANAGER` in TimeTrack; enforced in Spring Boot with `@PreAuthorize` and in Angular with route guards; interviewers ask where each enforcement layer lives and why you need both
- Generic authentication error messages — login failure always returns one generic message ("invalid credentials"), never "wrong password" or "email not found"; a specific message lets an attacker enumerate which emails are registered; interviewers ask why `BadCredentialsException` is handled with one generic message instead of two
- Roles vs granular permissions — a role is a coarse label (`MANAGER`), a permission is a fine-grained capability (`REPORT_APPROVE`); a role model stops scaling the moment the client asks for "may approve but not delete"; interviewers ask when you would move from one to the other

- Horizontal vs vertical privilege escalation — horizontal is reaching another user's data at the same permission level (reading someone else's timesheet), vertical is acquiring a higher role (an employee performing a manager's approval); interviewers ask for one example of each, and candidates who know the first often cannot name the second
- Logging out of a stateless API — there is no server session to destroy, so "logout" is the client deleting its own copy of the token while the token itself stays valid until it expires; this is why short expiry is the real control and why genuine revocation means reintroducing server state; interviewers ask "what actually happens when a user logs out?" to find out whether stateless auth was understood or memorised

---

## JWT
- JWT structure: header, payload, signature — header says the algorithm (`HS256`); payload carries claims (`sub`, `iat`, `exp`, `role`); signature is an HMAC of header+payload using the secret; interviewers ask what each part contains and why
- JWT payload is not encrypted — the payload is Base64-encoded, not encrypted; anyone can decode it; never put passwords or sensitive data in a JWT; interviewers ask "is a JWT secure?" to test whether the candidate knows Base64 is not encryption
- How the signature is verified — the server recomputes the HMAC with its own secret and compares; if the payload was changed, the signature does not match; this is how the server detects tampering without storing the token
- Why you cannot fake a JWT without the secret — the signature is bound to the exact bytes of the header and payload; any change invalidates it; asked to check understanding of why JWT can be trusted
- Access token vs refresh token — access token is short-lived (15 min to 1 hour); refresh token is long-lived and used only to get a new access token; limits the window of attack if an access token is stolen
- Where to store the token in the browser — `localStorage` is accessible to JavaScript (XSS risk); `HttpOnly` cookie is not accessible to JavaScript (CSRF risk instead); interviewers ask this to test awareness of trade-offs
- JWT expiry — the `exp` claim sets a timestamp; expired tokens are rejected by `JwtFilter`; why short-lived tokens reduce the damage if a token is stolen
- A JWT is a bearer credential — whoever holds the token *is* the user until `exp`, and the server has no way to tell a thief from the owner because there is no session to check; this is why token lifetime is the blast radius; interviewers ask "your token leaks — what can the attacker do, and for how long?"

- An `HttpOnly` cookie does not stop XSS from acting as the user — injected JavaScript cannot *read* the cookie, but it can still fire authenticated requests from the victim's browser, and the browser attaches the cookie for it; the token never needs to be stolen to be used; interviewers use this to break the "HttpOnly solves XSS" reflex
- Never put a token in a URL — query strings land in browser history, in the `Referer` header sent to third parties, and in proxy and server access logs, so a `?token=...` leaks into places nobody audits; interviewers ask where the token travels and expect the `Authorization` header

---

## Cryptography and secrets
- Hashing vs encryption — hashing is one-way (you cannot reverse it); encryption is two-way (you can decrypt with the key); interviewers always ask the difference because candidates frequently confuse them
- Why passwords are hashed and not encrypted — if the database is stolen, the attacker cannot recover plaintext passwords from hashes without brute-forcing every possible input
- BCrypt — a slow hashing algorithm with a built-in random salt; slow is intentional because it resists brute-force attacks; `BCryptPasswordEncoder` in Spring Boot uses it by default with 10 rounds
- Salting — a random value added to the input before hashing; prevents two users with the same password from having the same hash in the database; BCrypt handles salting automatically
- Encoding vs hashing vs encryption — the three-way version of the pair: Base64 is encoding (reversible, no key, no security at all), hashing is one-way, encryption is two-way with a key; interviewers ask it this way because candidates who can define "hashing vs encryption" still describe Base64 as encryption
- BCrypt work factor — the cost is stored inside the hash string itself, which is why the same encoder can still verify old hashes after the cost is raised; interviewers ask why you would raise it and what it costs on every login
- What a leaked signing secret means — anyone with the HS256 secret can mint a valid token for any user and any role, so a leaked secret is a total authentication bypass, not a partial one; rotating it invalidates every token already issued at once; interviewers ask "your secret was pushed to GitHub — what now?"

- Why a *fast* hash is the wrong password hash — SHA-256 and MD5 are cryptographically strong and deliberately fast, which is exactly what lets an attacker try billions of candidates per second against a stolen table; password hashing wants deliberate slowness (BCrypt, Argon2); interviewers offer SHA-256 as a plausible-sounding answer to see whether you take it
- Rainbow tables — precomputed hash-to-password lookups that make an unsalted hash instantly reversible; this is the concrete attack a salt exists to defeat, so "why salt?" should be answered with the attack named rather than with "so the hashes differ"
- Where secrets actually live — the JWT signing secret, the database password and any API key come from environment variables or externalised configuration, never hardcoded and never committed; interviewers open your `application.properties` to check, and `_shared-context.md` records this as the single most common flaw in AI-generated Spring Boot code
- A committed secret stays in the git history — deleting it in a later commit removes it from the working tree and not from the repository, so anyone with a clone still has it and the only real remedy is rotating the secret; interviewers ask "you pushed a key and then removed it — are you safe?" and expect rotation, not a revert

---

## Injection and untrusted input
- SQL injection — the attacker injects SQL into a user input field to manipulate the query; parameterised queries (which JPA uses automatically) prevent it; interviewers ask "how does JPA protect against SQL injection?"
- Where JPA stops protecting you — a concatenated JPQL string, a dynamically built `@Query`, a native query, or a sort column taken from the client are all still injectable; interviewers push past "JPA parameterises everything" to see whether the candidate knows the exception
- Least privilege for the application's database role — the app connects with a role that can read and write rows but cannot `DROP` a table or read another schema, so a successful injection is capped at what that role can reach; interviewers ask "injection got through — how bad is it?"
- XSS (Cross-Site Scripting) — the attacker injects malicious JavaScript into a page that runs in other users' browsers and can steal tokens from `localStorage`; Angular escapes all template values by default, which prevents most XSS
- Stored vs reflected XSS — a stored payload is persisted and hits every viewer of that page; a reflected one needs the victim to follow a crafted link; the distinction explains why escaping on output matters more than filtering on input
- `[innerHTML]` bypasses Angular's XSS protection — Angular deliberately skips escaping when you use `[innerHTML]`; any user-provided content rendered with `[innerHTML]` creates an XSS risk; interviewers ask "can Angular still get XSS?" to test whether the candidate knows the exception

- DOM-based XSS — the payload never reaches the server at all; client-side JavaScript writes attacker-controlled input (a URL fragment, a query parameter) straight into the DOM, so no amount of server-side escaping helps; it is the third type that completes stored and reflected, and interviewers ask for all three
- XSS vs CSRF as the pair — XSS runs the attacker's script inside your page, so it can read anything the page can and act as the user; CSRF never runs any script on your site, it simply makes the victim's browser send a request that the browser helpfully authenticates with an ambient cookie; interviewers ask you to state the difference in one sentence because candidates routinely blur them
- Sanitising HTML you genuinely have to render — when user-supplied HTML must be displayed, the answer is an allow-list sanitiser that permits known-safe tags, never a hand-written filter that strips `<script>`; interviewers ask what you do when escaping is not an option, and "I remove the dangerous tags" is the failing answer

---

## Trusting the client — the server is the boundary
- Trust boundaries in a full-stack app — everything arriving from the browser (body, headers, path ids, hidden fields) is attacker-controlled, and the boundary begins at the controller; interviewers ask "which of these values can you trust?" as the idea that unifies IDOR, mass assignment, and client-side validation
- Why you validate on the server even when you validate on the client — client-side validation can be bypassed with Postman or browser DevTools; the server is the only boundary you can trust; `@NotBlank` and `@Valid` in Spring Boot enforce this
- Mass assignment risk of exposing entities directly — if a controller binds the request body straight to the `@Entity`, a malicious client can set fields it should never control, like `role: "MANAGER"` or `active: true`, by adding them to the JSON body; DTOs close this hole because the request DTO only declares the fields a client is allowed to send; interviewers ask "what could go wrong if you skip the request DTO and bind the entity directly?"
- Broken access control (IDOR) — the #1 risk on the OWASP Top 10; the attacker changes a client-controlled id (`userId`, an order id in a URL) to access or modify another user's data; the fix is deriving ownership from `SecurityContextHolder` (the verified JWT), never from a field the client sent; interviewers ask "what could go wrong if you trust a userId sent by the client?"
- Client-side role checks are UX, not security — hiding a button in Angular or reading `role` from the decoded token only shapes the interface; the endpoint stays callable directly; interviewers ask "what stops me calling your MANAGER endpoint from Postman?"
- CSRF (Cross-Site Request Forgery) — the attacker tricks a logged-in user's browser into making an unwanted request; works because cookies are sent automatically by the browser; JWT in the `Authorization` header prevents it because the browser does not attach headers automatically (only cookies)
- The synchroniser token pattern — what CSRF protection actually does: the server issues a per-session random value that must be echoed back on every state-changing request, which an attacker's site cannot read; you need to be able to describe it to justify switching it off

- Format validation is not business validation — `@NotBlank` and `@Email` prove a field is well-formed, not that `hours = -40` or an end date before the start date is legal; the rule belongs in the service, and interviewers use exactly this to show that validation annotations are not by themselves a security control
- File upload risks — the filename is attacker-controlled and can carry path traversal, the declared content type is simply a claim the client makes, an SVG is executable HTML, and an unbounded size is a denial of service; the defences are a generated name, storage outside the web root, a size cap, and serving uploads from a different origin; interviewers ask "your app accepts a profile picture — name three things that go wrong"
- Cookie flags: `HttpOnly`, `Secure`, `SameSite` — `HttpOnly` hides the cookie from JavaScript, `Secure` stops it being sent over plain HTTP, and `SameSite` stops the browser attaching it to cross-site requests, which is the modern browser-level CSRF defence; interviewers ask you to name all three and say what each one stops
- Safe versus state-changing HTTP methods — a `GET` must never change state, because browsers, prefetchers and crawlers issue them freely and both caching and CSRF defences assume `GET` is safe; interviewers ask why `GET /entries/5/delete` is a security problem and not merely poor REST

---

## CORS
- What an origin is — the combination of protocol + domain + port; `http://localhost:4200` and `http://localhost:8080` are two different origins even though they share the same domain; the basis for understanding why Angular and Spring Boot conflict in development
- What CORS is — the browser enforces the Same-Origin Policy by default, blocking JavaScript from reading responses from a different origin; CORS lets servers explicitly allow specific cross-origin requests
- CORS is enforced by the browser, not the server — the server always receives and processes the request; the browser blocks the response from reaching JavaScript; this is why Postman works but Angular does not when CORS is misconfigured; interviewers test this distinction
- Why it matters for Angular + Spring Boot — Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API call even though the server responds correctly
- How CORS is configured in Spring Boot — `CorsConfigurationSource` registered inside `SecurityFilterChain`; specifies allowed origins, methods, and headers; interviewers ask where it goes in a Spring Security project
- Preflight requests — the browser sends an `OPTIONS` request before any POST with a JSON body or any request with an `Authorization` header; the server must respond with the correct CORS headers or the real request is blocked
- CORS is not authorisation — an allowed origin authenticates nobody, and a restrictive policy protects no endpoint; it only governs which sites' JavaScript may read a response; interviewers ask it of any candidate who calls CORS "a security feature that protects the API"
- A CORS-blocked request reports no status code — the browser surfaces a rejected preflight as a generic network error with `status 0`, not the real backend status, so the Network tab shows a failure that looks nothing like the 401 or 500 the server actually sent; interviewers ask why the error has no status and expect you to distinguish a CORS block from an auth failure
- Over-permissive CORS as a real vulnerability — `allowedOrigins("*")` with credentials, or reflecting the caller's `Origin` back, lets any site read authenticated responses on the victim's behalf; interviewers ask why `*` is not simply "the easy setting"

## Information disclosure
- Stack traces returned to the client — an unhandled exception reveals framework versions, package structure, SQL, and file paths that map the attack surface for free; interviewers ask "what does a 500 with a stack trace tell an attacker?"
- Verbose errors vs debuggability — the tension between a message useful to a developer and one useful to an attacker is resolved by logging the detail server-side and returning a generic message plus a correlation id; a standard decision question
- Mapping a database constraint violation to an HTTP response — a unique violation is a `409 Conflict` and a foreign key violation a `400`/`404`, never a raw `500` echoing the SQL, because the constraint name and table names leak the schema to the client
- User enumeration beyond the login form — registration and password reset can each reveal whether an email exists through a different message, status code, or response shape, even when login is careful; interviewers extend the generic-message rule to the endpoints candidates forget
- Timing-based user enumeration — if a missing user returns immediately while an existing one pays the BCrypt cost, response time alone leaks account existence despite identical messages; the pressure follow-up that separates a memorised rule from an understood mechanism
- Over-returning fields in a response — a response that serialises the entity leaks `passwordHash`, internal ids, or another user's email; the outbound mirror of mass assignment; interviewers ask why you need a *response* DTO and not only a request DTO
- What must never appear in a log line — an access token, a password, or a full request body of personal data; logs are shipped to a central system half the company can read, so a logged JWT is a credential leak with a long tail; interviewers ask how you would debug a failure you cannot reproduce and expect you to name what you would *not* print
- Debug endpoints exposed in production — `/actuator/env`, `/actuator/heapdump`, Swagger UI, and the H2 console hand an attacker configuration and sometimes secrets; interviewers ask what you expose by adding the actuator starter and leaving it open

## Attacks on login and credentials
- Brute force and credential stuffing — unlimited login attempts let an attacker test leaked password lists against your users, which is why a generic error message alone is not a defence; interviewers ask "what stops someone hammering your `/login`?"
- Rate limiting login attempts — throttling by IP or by account is the standard answer to brute force; interviewers ask what stops someone hammering `/login` and expect a concrete throttle, not just a generic error message
- Account lockout and its denial-of-service trade-off — locking an account after N failures lets an attacker deliberately lock out a known user; interviewers use it to see whether you can name the cost of the defence you just proposed
- Password policy — a minimum length beats complexity rules, and a reused password defeats hashing entirely because the attacker already has it; interviewers use it as a judgement question about why the familiar "one uppercase and one symbol" advice is weak
- Password reset as the second authentication surface — the reset token must be single-use, short-lived, and unguessable, and the flow must not confirm whether the email exists; interviewers ask about it because candidates secure login and forget the door beside it

## Transport and dependency risk
- Why HTTPS is non-optional for token auth — over plain HTTP the `Authorization` header travels in cleartext and any hop on the path can read the token, so every JWT guarantee assumes TLS underneath; interviewers ask what protects the token between browser and server
- What TLS actually protects — confidentiality and integrity *in transit* only; it does nothing about a compromised client, a stolen token, or a vulnerable server; interviewers ask it to catch candidates who treat HTTPS as blanket security
- `Content-Security-Policy` — restricts which script sources the browser will execute, the header-level defence behind XSS; interviewers ask what stops an injected `<script>` from running once it is already on the page
- `X-Frame-Options` — blocks your page from being framed by an attacker's site, the defence against clickjacking; interviewers ask what a hidden iframe layered over your app can make a user click
- `X-Content-Type-Options: nosniff` — stops the browser guessing a response's type and executing an uploaded file as script; Spring Security sets it by default, which interviewers ask you to notice rather than configure
- Known-vulnerable dependencies — a CVE in a transitive library is exploitable without any flaw in your own code, which is why `dependency-check`/`npm audit` output belongs in the build; interviewers ask how you know your dependencies are safe and expect Log4Shell named as the reference case
- `Strict-Transport-Security` (HSTS) — tells the browser to refuse plain HTTP for this domain from now on, closing the window where the very first request is unencrypted and interceptable; it belongs with the other headers you should be able to name and say what each one stops, rather than configure from memory
- Whether to act on a reported CVE — the decision is not automatic: you check whether your code reaches the vulnerable path, whether a patched version exists, and what upgrading it drags in, because blindly bumping a transitive dependency can break the build while ignoring a reachable one is negligence; interviewers ask "the scanner flagged 40 vulnerabilities, what do you do on Monday?" and want triage, not a blanket answer
