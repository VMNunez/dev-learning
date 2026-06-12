# Minimum Coverage — Security

Web security concepts a junior must know.
Enough to explain each one in a technical interview and to avoid introducing vulnerabilities in the projects.

## Authentication and authorisation
- Authentication vs authorisation — authentication confirms who you are (login); authorisation confirms what you are allowed to do (role check); interviewers always ask the difference
- Session-based auth — the server stores a session in memory and gives the client a cookie; stateful; does not scale horizontally without shared session storage
- Token-based auth (JWT) — the client stores the token and sends it with every request; the server validates it without storing anything; stateless
- Role-based access control — EMPLOYEE vs MANAGER in TimeTrack; enforced in Spring Boot with `@PreAuthorize` and Angular guards

## JWT
- JWT structure: header, payload, signature — header says the algorithm; payload carries claims (`sub`, `iat`, `exp`, `role`); signature is an HMAC of header+payload using the secret
- How the signature is verified — the server recomputes the HMAC with its own secret and compares; if the payload was changed, the signature does not match
- Why you cannot fake a JWT without the secret — the signature is bound to the exact bytes of the header and payload; any change invalidates it
- Access token vs refresh token — access token is short-lived (15 min to 1 hour); refresh token is long-lived and used only to get a new access token; limits damage if an access token is stolen
- Where to store the token in the browser — localStorage is accessible to JavaScript (XSS risk); HttpOnly cookie is not accessible to JavaScript (CSRF risk)
- JWT expiry — `exp` claim; expired tokens are rejected by `JwtFilter`; why short-lived tokens reduce the window of attack

## Cryptography basics
- Hashing vs encryption — hashing is one-way (you cannot reverse it); encryption is two-way (you can decrypt with the key); interviewers always ask the difference
- Why passwords are hashed and not encrypted — if the database is stolen, the attacker cannot recover plaintext passwords without the original input
- BCrypt — a slow hashing algorithm with a random salt; slow is intentional because it resists brute-force attacks; `BCryptPasswordEncoder` in Spring Boot uses it
- Salting — adding a random value to the input before hashing; prevents two users with the same password from having the same hash in the database

## CORS
- What CORS is — the browser blocks JavaScript from calling a different origin (domain, port, or protocol); Same-Origin Policy is the default
- Why it matters for Angular + Spring Boot — Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API request
- How CORS is configured in Spring Boot — `CorsConfigurationSource` inside `SecurityFilterChain`; specifies allowed origins, methods, and headers
- Preflight requests — the browser sends an `OPTIONS` request before the real one; the server must respond with the correct CORS headers or the real request is blocked

## Common vulnerabilities
- SQL injection — the attacker inserts SQL into a user input field; parameterised queries (which JPA uses automatically) prevent it; interviewers ask "how does JPA protect against SQL injection?"
- XSS (Cross-Site Scripting) — the attacker injects malicious JavaScript into a page that runs in other users' browsers; Angular escapes template values automatically, which prevents most XSS
- CSRF (Cross-Site Request Forgery) — the attacker tricks a logged-in user into making an unwanted request; JWT in the `Authorization` header prevents it because the browser does not automatically attach headers (only cookies)
- Why you validate on the server even when you validate on the client — client validation can be bypassed by anyone with a browser console or Postman; the server is the only boundary you can trust
