# Minimum Coverage — Security

Web security concepts a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects — not just a textbook definition.

## Authentication and authorisation
- Authentication vs authorisation — authentication confirms who you are (login); authorisation confirms what you are allowed to do (role check); interviewers always ask the difference and expect an example from a real project
- 401 vs 403 — `401 Unauthorized` means not authenticated (no token, expired token, invalid token); `403 Forbidden` means authenticated but not authorised (valid token, wrong role); interviewers test this pair because the HTTP names are confusing and juniors routinely mix them up
- Session-based auth — the server stores a session in memory and gives the client a cookie; stateful; does not scale horizontally without shared session storage; asked as a contrast to JWT
- Token-based auth (JWT) — the client stores the token and sends it with every request; the server validates it without storing anything; stateless; interviewers ask why stateless auth matters for scaling
- Role-based access control — `EMPLOYEE` vs `MANAGER` in TimeTrack; enforced in Spring Boot with `@PreAuthorize` and in Angular with route guards; interviewers ask where each enforcement layer lives and why you need both

## JWT
- JWT structure: header, payload, signature — header says the algorithm (`HS256`); payload carries claims (`sub`, `iat`, `exp`, `role`); signature is an HMAC of header+payload using the secret; interviewers ask what each part contains and why
- JWT payload is not encrypted — the payload is Base64-encoded, not encrypted; anyone can decode it; never put passwords or sensitive data in a JWT; interviewers ask "is a JWT secure?" to test whether the candidate knows Base64 is not encryption
- How the signature is verified — the server recomputes the HMAC with its own secret and compares; if the payload was changed, the signature does not match; this is how the server detects tampering without storing the token
- Why you cannot fake a JWT without the secret — the signature is bound to the exact bytes of the header and payload; any change invalidates it; asked to check understanding of why JWT can be trusted
- Access token vs refresh token — access token is short-lived (15 min to 1 hour); refresh token is long-lived and used only to get a new access token; limits the window of attack if an access token is stolen
- Where to store the token in the browser — `localStorage` is accessible to JavaScript (XSS risk); `HttpOnly` cookie is not accessible to JavaScript (CSRF risk instead); interviewers ask this to test awareness of trade-offs
- JWT expiry — the `exp` claim sets a timestamp; expired tokens are rejected by `JwtFilter`; why short-lived tokens reduce the damage if a token is stolen

## Cryptography basics
- Hashing vs encryption — hashing is one-way (you cannot reverse it); encryption is two-way (you can decrypt with the key); interviewers always ask the difference because candidates frequently confuse them
- Why passwords are hashed and not encrypted — if the database is stolen, the attacker cannot recover plaintext passwords from hashes without brute-forcing every possible input
- BCrypt — a slow hashing algorithm with a built-in random salt; slow is intentional because it resists brute-force attacks; `BCryptPasswordEncoder` in Spring Boot uses it by default with 10 rounds
- Salting — a random value added to the input before hashing; prevents two users with the same password from having the same hash in the database; BCrypt handles salting automatically

## CORS
- What an origin is — the combination of protocol + domain + port; `http://localhost:4200` and `http://localhost:8080` are two different origins even though they share the same domain; the basis for understanding why Angular and Spring Boot conflict in development
- What CORS is — the browser enforces the Same-Origin Policy by default, blocking JavaScript from reading responses from a different origin; CORS lets servers explicitly allow specific cross-origin requests
- CORS is enforced by the browser, not the server — the server always receives and processes the request; the browser blocks the response from reaching JavaScript; this is why Postman works but Angular does not when CORS is misconfigured; interviewers test this distinction
- Why it matters for Angular + Spring Boot — Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API call even though the server responds correctly
- How CORS is configured in Spring Boot — `CorsConfigurationSource` registered inside `SecurityFilterChain`; specifies allowed origins, methods, and headers; interviewers ask where it goes in a Spring Security project
- Preflight requests — the browser sends an `OPTIONS` request before any POST with a JSON body or any request with an `Authorization` header; the server must respond with the correct CORS headers or the real request is blocked

## Common vulnerabilities
- SQL injection — the attacker injects SQL into a user input field to manipulate the query; parameterised queries (which JPA uses automatically) prevent it; interviewers ask "how does JPA protect against SQL injection?"
- XSS (Cross-Site Scripting) — the attacker injects malicious JavaScript into a page that runs in other users' browsers and can steal tokens from `localStorage`; Angular escapes all template values by default, which prevents most XSS
- `[innerHTML]` bypasses Angular's XSS protection — Angular deliberately skips escaping when you use `[innerHTML]`; any user-provided content rendered with `[innerHTML]` creates an XSS risk; interviewers ask "can Angular still get XSS?" to test whether the candidate knows the exception
- CSRF (Cross-Site Request Forgery) — the attacker tricks a logged-in user's browser into making an unwanted request; works because cookies are sent automatically by the browser; JWT in the `Authorization` header prevents it because the browser does not attach headers automatically (only cookies)
- Why you validate on the server even when you validate on the client — client-side validation can be bypassed with Postman or browser DevTools; the server is the only boundary you can trust; `@NotBlank` and `@Valid` in Spring Boot enforce this
