# Minimum Coverage — Security

Web security concepts a junior must know. Enough to explain them in an interview and avoid introducing vulnerabilities.

## Authentication and authorisation
- [ ] Authentication vs authorisation — what each checks and why the distinction matters
- [ ] Session-based auth — how it works, where the session lives
- [ ] Token-based auth — how JWT replaces sessions, why it is stateless
- [ ] Role-based access control — USER vs ADMIN, how it is enforced in Spring Boot

## JWT
- [ ] JWT structure: header, payload, signature — what each contains
- [ ] How the signature is verified — why you cannot fake a JWT without the secret
- [ ] Access token vs refresh token — why they are separate and what each does
- [ ] Where to store the token in the browser — localStorage vs HttpOnly cookie, the tradeoff
- [ ] JWT expiry — why short-lived tokens matter

## Cryptography basics
- [ ] Hashing vs encryption — what each does and when to use each
- [ ] Why passwords are hashed (not encrypted) — bcrypt, what salting means
- [ ] Why you never store plaintext passwords

## CORS
- [ ] What CORS is — same-origin policy and why the browser enforces it
- [ ] How CORS is configured in Spring Boot (`@CrossOrigin`, `CorsConfigurationSource`)
- [ ] Preflight requests — what the browser does before a cross-origin request

## Common vulnerabilities
- [ ] SQL injection — how it works, how parameterised queries prevent it
- [ ] XSS (Cross-Site Scripting) — how it works, how Angular prevents it by default
- [ ] CSRF (Cross-Site Request Forgery) — how it works, why stateless JWT auth mitigates it
- [ ] Why you validate on the server even when you validate on the client
