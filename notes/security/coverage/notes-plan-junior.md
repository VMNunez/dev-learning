# Security Junior Notes Plan

Plan status: current
Coverage: notes/security/coverage/junior.md
Coverage SHA-256: f2da5662218372c6a951a9878706e1c6b57156d3aeffc0fafdaff7f71aa49427
Generated: 2026-09-04

## 00 — Security as boundary reasoning

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/00-security-foundations.md
Spanish: notes/security/junior/es/00-fundamentos-seguridad.md

Depends on: none

Pending additions: none

Narrative role: Orient Victor from everyday web development to attacker-aware reasoning before any individual control appears.

Learning outcome: Map assets, threats, vulnerabilities, trust boundaries, and layered controls for a small Angular + Spring Boot system, and state what a control does not yet do.

Prerequisites: none

Must answer:

- What does this introduction itself cover, in the order its sections appear, and why is that order the one that works?
- What is application security, what practical failures does it prevent, and why does it matter in Victor's Angular + Spring Boot work?
- What must Victor already be able to name before opening chapter 01 — an endpoint and its HTTP method, a request body and a response DTO, a status code (200, 400, 401, 403, 404, 500), a cookie and a request header — and what does each mean in one sentence?
- What is the difference between a threat, a vulnerability, an asset, and a control, and how do the four combine into one sentence about a single risk?
- Where are the trust boundaries in an Angular + Spring Boot system, and what must be verified when data or an identity crosses one?
- What makes input that a framework parsed successfully still untrusted?
- How do least privilege, deny by default, allow-lists, fail-closed behaviour, and defence in depth work together instead of competing?
- Why does a placeholder that carries a real control's name mislead every later reader, and what must the code say at the point of use?
- How should a junior use the OWASP Top 10 without treating it as a memorisation checklist?
- What is the complete `00 → 13` learning route, and why does it move from trust boundaries through identity, browser and server threats, operational controls, and finally adversarial testing in that order?

Coverage concepts:

- [ ] OWASP Top 10 — use the current edition as an awareness map of recurring web-application risk
  categories, not as a checklist whose category order should be memorised
- [ ] Threat vs vulnerability — distinguish a possible cause of harm from the weakness that lets the
  threat succeed
- [ ] Asset and control — identify what needs protection and the defence that reduces a specific risk to it
- [ ] Trust boundaries — treat the browser, API, database, third-party services, build environment, and
  network as separate zones whose inputs and identities require verification
- [ ] Parsing is not trust — route parameters, headers, cookies, JSON, hidden fields, and decoded token
  claims remain attacker-controlled even after a framework has parsed them successfully
- [ ] Least privilege and deny by default — grant users, tokens, components, and database accounts only
  the access they need, while leaving unmatched actions inaccessible
- [ ] Defence in depth — combine validation, authorisation, safe APIs, output encoding, transport
  protection, and monitoring because no single control is sufficient
- [ ] Allow-list over block-list — define accepted origins, roles, fields, formats, and ranges instead of
  trying to enumerate every malicious value
- [ ] Secure defaults and fail closed — an absent rule, invalid credential, unexpected exception, or
  unavailable dependency must not silently make a protected operation public
- [ ] Stubbed control as a security claim — a stand-in that carries a real mechanism's name while
  nothing issues, signs, or verifies it reads as working protection to every later reader, so the
  code states at the point of use what it does not yet do

Rationale: These concepts form the single vocabulary every later chapter reasons in: what is being protected, from whom, at which boundary, and what happens when a rule is missing. The stubbed-control bullet belongs here rather than beside a mechanism because it is a claim about honesty at a boundary, not about JWT or CORS in particular.

Handoff: This mental model supplies the vocabulary used to reason about identity and permissions in chapter 01.

## 01 — Authentication, authorisation, and ownership

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/security/junior/en/01-authn-vs-authz.md
Spanish: notes/security/junior/es/01-authn-vs-authz.md

Depends on: 00

Pending additions: none

Narrative role: Separate identity proof from permission decisions and apply server-side, role-level, and object-level checks consistently.

Learning outcome: Explain and review an API operation for authentication, RBAC, ownership, escalation, self-lockout, and role-shaped response scope.

Prerequisites: 00

Must answer:

- Which claim in a request only names an identity, and which one proves it?
- Why can a valid request body and a logged-in user still be unauthorised?
- What do 401 and 403 each mean, and when is 404 the correct answer to a request the caller was not allowed to make?
- What does an Angular route guard or a hidden button actually protect, and why must the same rule exist on the server anyway?
- How are roles or authorities mapped consistently, and why must a client never be able to name its own role?
- When several authorisation rules apply to one request, in what order are they evaluated, and what happens to a request that matches none of them?
- Why must ownership come from the security context instead of a client-supplied user ID?
- What is the difference between reaching another user's record and gaining a more privileged operation, and why does each need a different check?
- Why does filtering a collection not protect the detail, update, and delete endpoints?
- Why must an operation that removes a privilege refuse when the caller is its own target?
- When does the caller's role decide which records the response is built from rather than whether the call is refused at all?

Coverage concepts:

- [ ] Authentication vs authorisation — authentication verifies an identity, while authorisation decides
  what that authenticated identity may do
- [ ] Identification vs authentication — a username, email, or token subject names a claimed identity,
  while credential verification establishes whether the claim is genuine
- [ ] Server-side enforcement — Angular guards and hidden buttons improve navigation and UX but never
  replace permission checks on every protected backend operation
- [ ] Role-based access control — map roles or authorities consistently and prevent clients from assigning
  privileged roles to themselves
- [ ] Administrative self-lockout — an operation that removes a privilege must refuse when the caller is its
  own target, since the route back usually requires the very privilege being removed
- [ ] Layered authorisation rules — request-level and method-level checks can reinforce each other but must
  not leave gaps or contradictory policy
- [ ] Object-level authorisation (BOLA/IDOR) — verify access to the specific requested record instead of
  assuming that any logged-in user may use any identifier
- [ ] Horizontal vs vertical privilege escalation — distinguish accessing another user's resources from
  gaining a more privileged role or operation
- [ ] Trusted identity for ownership checks — derive the caller from the authenticated security context
  rather than accepting an owner or user ID from the request body
- [ ] Collection vs detail authorisation — a filter on a list endpoint does not protect the matching
  read, update, or delete endpoint, so each operation must enforce the same visibility rule
- [ ] Authorisation as scope, not only as a gate — when one endpoint serves several roles, the caller's role
  can decide which records the response is built from rather than whether the call is refused
- [ ] Input validation vs authorisation — valid data shape and business values do not prove that the caller
  has permission to perform the requested action

Rationale: Every bullet here answers one question — may this caller perform this action on this record — and the chapter is only coherent if the gate form and the scope form of that answer are taught together, since a junior who knows only the gate writes an endpoint that returns everyone's rows to everyone allowed in. `Credentials, identity, and session state` is deliberately not here: it describes the state a decision runs on rather than the decision, and chapter 03 owns it. The audit inherits the IDOR, BOLA, and server-is-the-boundary material currently in `06-security-vulnerabilities.md`, whose concepts this plan assigns here; entry 06 keeps none of it.

Handoff: Once access decisions are clear, chapter 02 explains how passwords establish the identity those decisions depend on.

## 02 — Password verification, recovery, and abuse resistance

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/security/junior/en/02-hash-vs-encryption.md
Spanish: notes/security/junior/es/02-hash-vs-encryption.md

Depends on: 01

Pending additions: none

Narrative role: Show how a server verifies identity without storing recoverable passwords, and how it limits abuse around the endpoints that accept or change credentials — then generalises that same bound to every endpoint whose cost or effect an attacker can repeat.

Learning outcome: Explain salts, adaptive work factors, input bounds, secure randomness, generic failures, reset tokens, MFA awareness, and throttling trade-offs, and review a credential-change endpoint.

Prerequisites: 01

Must answer:

- What is the difference between hashing, encryption, and encoding, and why is only one of the three acceptable for a stored password?
- Why are password hashes deliberately slow and uniquely salted?
- Why should application code delegate verification to a maintained password encoder instead of comparing values itself?
- Why does a password field need an explicit maximum measured in bytes, and what happens silently without one?
- Why can a password change that stores a different hash still leave the old password working, and where must the check for that sit in the flow?
- What must a password-reset token be — how is it generated, how long does it live, how many times may it be used, and why is emailing the existing password never an option?
- How can rate limits and generic failures resist abuse without becoming a denial-of-service tool?

Coverage concepts:

- [ ] Hashing vs encryption vs encoding — hashing is one-way verification, encryption is reversible with a
  key, and encoding only changes representation
- [ ] Password hashing — store passwords with a slow adaptive password-hashing function such as BCrypt,
  never as plaintext, reversible encryption, or a fast general-purpose hash
- [ ] Salt — use a unique random salt per password so equal passwords do not produce equal stored hashes;
  a standard password encoder manages it with the hash
- [ ] Work factor — tune the password hash cost so verification is deliberately expensive for attackers
  but still acceptable for legitimate logins
- [ ] Password verification — delegate hash parsing, salt handling, and verification to a maintained
  password encoder instead of comparing raw passwords or hashes manually
- [ ] Password input length bounds — an adaptive password hash can process only a bounded prefix of its
  input, so a password field needs an explicit maximum and an encoder that refuses over-length input
  instead of silently ignoring the excess, and that bound is counted in bytes rather than characters
- [ ] Security-sensitive randomness — generate reset tokens, initial secrets, and other guess-sensitive values
  from a cryptographically secure unpredictable source rather than a predictable pseudo-random stream
- [ ] Brute-force defence — throttle repeated authentication attempts using account and network signals
  without relying on permanent lockout that attackers can abuse for denial of service
- [ ] Credential change must actually change the credential — a rotation request that re-stores the value already in use produces a different stored hash yet leaves the old secret valid, so the new value is compared against the stored one and refused when they match, and that comparison runs only after the current credential has been proven so it cannot answer "is this the password?" for an unauthenticated caller
- [ ] Password reset — use a short-lived, single-use, unpredictable token, invalidate it after success,
  and never email the existing password or trust only an account identifier
- [ ] Multi-factor authentication awareness — recognise that a second independent factor reduces the
  damage from a stolen password without requiring a junior to design an enterprise identity system
- [ ] Generic authentication failures — keep login status, response shape, message, and observable timing
  sufficiently consistent that they do not reveal whether an account exists
- [ ] Endpoint abuse limiting — recognise that registration, reset, verification, and expensive API
  operations also need bounded throttling, while distributed policy design remains a later-level task

Rationale: The chapter follows one credential through its whole life — chosen, bounded, hashed, verified, rotated, reset, and defended against guessing — so the abuse-resistance bullets are not a separate topic but the last stage of the same story. The audit inherits the generic-authentication-errors material currently in `01-authn-vs-authz.md`, whose concept this plan assigns here.

Handoff: Successful verification creates authenticated state; chapter 03 follows that state across later requests.

## 03 — Sessions, bearer tokens, and authenticated state

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/03-sessions-bearer-tokens.md
Spanish: notes/security/junior/es/03-sesiones-tokens-portador.md

Depends on: 02

Pending additions: none

Narrative role: Follow the authenticated state a successful login creates across every later request, before any particular token format is opened.

Learning outcome: Compare server-held session state with a self-contained bearer token, and explain how authenticated state is propagated, bound to an identity that cannot change, rotated after a privilege change, and invalidated.

Prerequisites: 02

Must answer:

- What changes between verifying credentials once and carrying the result of that verification on every later request?
- What does a server-held session store that a self-contained token does not, and what does each choice cost in storage, scaling, and revocation?
- Why must the identifier a session or token is bound to be one the account can never lose, and what goes wrong when an editable email is used instead?
- How does an attacker obtain someone else's session or token in practice, and which of those paths does rotating the identifier after login close?
- Why is a bearer token dangerous the moment it appears in a URL, a log line, a screenshot, or an error message?

Coverage concepts:

- [ ] Session-based vs token-based authentication — compare server-held session state with self-contained
  bearer tokens, including storage, scaling, revocation, and CSRF consequences
- [ ] Authentication vs session management — verifying credentials creates authenticated state, while
  propagation, expiry, renewal, rotation, and invalidation govern its later lifecycle
- [ ] Immutable subject identity — bind a session or token to an identifier the account can never lose,
  since a mutable natural key such as an email hands the still-valid credential to whichever account
  holds that value next
- [ ] Session fixation and hijacking — accept only server-generated unpredictable session identifiers,
  rotate them after authentication or privilege changes, and invalidate server-side state on logout
- [ ] Bearer-token possession — anyone who obtains a bearer token can use it, so URLs, logs, screenshots,
  error messages, and analytics must not expose it
- [ ] Credentials, identity, and session state — a password proves identity at login, while a session ID
  or bearer token carries the resulting authenticated state across later requests

Rationale: This is one mental model — state that outlives the request that created it — and it has to be understood before a JWT can be read as anything but a string. The CSRF clause in the session-versus-token bullet is previewed here and named as chapter 06's subject; the transport that protects a bearer token in flight is previewed as chapter 10's.

Handoff: With the state understood, chapter 04 opens the format that carries it and asks when a token may be trusted.

## 04 — JWT structure, signature, and validation

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/security/junior/en/04-auth-jwt.md
Spanish: notes/security/junior/es/04-auth-jwt.md

Depends on: 03

Pending additions: none

Narrative role: Open the token, separate what it proves from what it merely says, and establish the complete list of checks that must pass before a claim is used.

Learning outcome: Read a JWT's three parts, and decide a token is acceptable only after key, algorithm, issuer, audience, temporal, subject and application-claim checks have all passed — then state what expiry, refresh tokens, logout and revocation each can and cannot guarantee.

Prerequisites: 03

Must answer:

- What are a JWT's three parts, what is in each, and why must a reader never assume every JWT uses the same signing algorithm?
- Why does a valid signature not make the claims secret, and what is the difference between a signature, a MAC, and encryption?
- What exactly happens when an attacker edits a payload byte, and what would they need in order to get away with it?
- Which key, algorithm, issuer, audience, time, subject, and application-claim checks must happen before a token is trusted, and what does skipping each one allow?
- Why does a signed, unexpired, correctly issued token still not authorise a particular action?
- What can logout, short expiry, refresh tokens, and revocation each guarantee — and not guarantee?

Coverage concepts:

- [ ] JWT structure — distinguish the header, claim set, and signature without assuming every JWT uses the
  same signing algorithm
- [ ] JWT encoding vs encryption — Base64url makes header and payload readable; a signed JWT detects
  tampering but does not make its claims secret
- [ ] Signature or MAC vs encryption — a signature or message authentication code provides integrity and
  authenticity, while encryption provides confidentiality
- [ ] JWT signature verification — accept a token only after verifying its signature with the configured
  trusted key and rejecting algorithms the application did not choose
- [ ] JWT signing-key strength — load a sufficiently strong random or generated key from trusted
  configuration because moving a weak human password out of source control does not make it secure
- [ ] JWT issuer and audience validation — bind a token to the authority that issued it and the service
  intended to accept it instead of trusting any token signed by a familiar key
- [ ] JWT temporal-claim validation — enforce expiry and any applicable not-before time rather than
  accepting a token outside its valid window
- [ ] JWT subject and application-claim validation — treat identity, role, and other claims as input to
  policy checks rather than proof that every requested action is allowed
- [ ] JWT tampering resistance — changing header or payload bytes invalidates the signature unless the
  attacker can produce a valid signature with the trusted signing key
- [ ] JWT expiry — short-lived access tokens reduce the useful lifetime of a stolen credential but do not
  prevent misuse before expiry
- [ ] Access token vs refresh token — use a short-lived access token for APIs and a more protected,
  longer-lived refresh token only to obtain new access tokens
- [ ] Logout and revocation limits — deleting a browser token ends local use but does not invalidate an
  already issued stateless token unless the server adds revocation state or waits for expiry

Rationale: Validation is only teachable as the answer to a question chapter 03 raised — this string arrived claiming to be authenticated state, why should the server believe it — so the twelve bullets read as one argument rather than a checklist of claim names. The audit relocates this file's token-storage material to chapter 06, which owns that concept.

Handoff: A token the browser holds is only as safe as the pages allowed to use it; chapter 05 explains the origin boundary that decides which pages those are.

## 05 — Same-Origin Policy and CORS

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/security/junior/en/05-cors.md
Spanish: notes/security/junior/es/05-cors.md

Depends on: 04

Pending additions: none

Narrative role: Explain what the browser blocks across origins and configure the narrow cross-origin permission the deployed client actually needs.

Learning outcome: Predict simple, preflighted, and credentialed CORS behaviour without mistaking CORS for API authorisation.

Prerequisites: 04

Must answer:

- What exactly makes two URLs different origins?
- When can a cross-origin request reach the server even though JavaScript cannot read the response?
- Why do JSON bodies, `Authorization`, credentials, and wildcards change the preflight or response rules?
- Why does a correct CORS policy protect nothing, and what still stops curl, Postman, or a script on a server from calling the API?

Coverage concepts:

- [ ] Same-Origin Policy and origin — the browser isolates script access by scheme, host, and port, so
  `http://localhost:4200` and `http://localhost:8080` are different origins
- [ ] CORS purpose — the server uses response headers to let a browser relax the Same-Origin Policy for
  selected cross-origin requests
- [ ] CORS is not authorisation — it limits browser JavaScript, not Postman, curl, servers, or attackers,
  so protected APIs still require authentication and authorisation
- [ ] Simple vs preflighted CORS requests — a simple request may reach the server before the browser hides
  its response, while a failed `OPTIONS` preflight prevents the real non-simple request
- [ ] Preflight triggers — methods, content types, or headers outside the CORS safelist, including
  `Authorization` and JSON request content, require the browser to check permission first
- [ ] Credentialed CORS — credentialed cross-origin requests require an explicit allowed origin and cannot
  combine credentials with an `Access-Control-Allow-Origin: *` wildcard
- [ ] Minimal CORS policy — allow only the origins, methods, headers, and credential mode the deployed
  client actually needs

Rationale: One rule — the browser isolates script access by origin — and everything else in the section is either the browser enforcing it or the server relaxing it deliberately.

Handoff: The origin boundary sets up chapter 06's browser-side threats: injected code, ambient cookies, and what the client is allowed to keep.

## 06 — XSS, CSRF, cookies, and browser-held state

Status: pending

Studied: pending

Pending study: none

Action: audit

English: notes/security/junior/en/06-security-vulnerabilities.md
Spanish: notes/security/junior/es/06-security-vulnerabilities.md

Depends on: 05

Pending additions: none

Narrative role: Choose safe output and safe browser-side storage by reasoning about script execution, rendering contexts, automatically attached cookies, and what persisted data outlives a session.

Learning outcome: Distinguish XSS variants from CSRF, choose between Web Storage and hardened cookies, and decide what a client may persist about a signed-in user and how to remediate what it already persisted.

Prerequisites: 05

Must answer:

- Which browser sinks execute or interpret attacker-controlled data, and why does the output context change the safe answer?
- Why can an `HttpOnly` cookie reduce token theft yet create CSRF obligations?
- How do anti-CSRF tokens, custom headers, `SameSite`, `Secure`, and `HttpOnly` cover different attack paths?
- Which fields may a browser keep about the signed-in user, and why is anything in Web Storage readable by any script on the page?
- Why does changing what the client writes not fix the values already stored on users' machines, and what must happen when one is read back?

Coverage concepts:

- [ ] Dangerous browser sinks and safe rendering — prefer framework text binding and text-only DOM APIs;
  treat HTML-parsing DOM writes, script-capable URL assignments, eval-like execution, and trust-bypass
  APIs as review hotspots, applying sink-specific avoidance, contextual encoding or sanitisation, or
  URL allow-listing
- [ ] Cross-site scripting (XSS) — distinguish stored, reflected, and DOM-based script injection and
  understand how injected code can act with the victim's browser privileges
- [ ] Context-sensitive output handling — HTML text, attributes, URLs, JavaScript, and CSS have different
  safe output rules, so generic input sanitisation cannot replace framework escaping
- [ ] Cross-site request forgery (CSRF) — an attacker abuses credentials the browser attaches
  automatically, especially cookies, to make an unwanted state-changing request
- [ ] CSRF defences — use anti-CSRF tokens or a custom-header design whose preflight is denied to untrusted
  origins, with `SameSite` as defence in depth rather than the only control
- [ ] Secure cookie attributes — understand how `HttpOnly`, `Secure`, and `SameSite` reduce script access,
  insecure transport, and cross-site sending respectively
- [ ] Token storage in browsers — Web Storage exposes tokens to JavaScript and therefore XSS, while
  `HttpOnly` cookies reduce token theft but require deliberate CSRF and cookie controls
- [ ] Client-side session state — what a browser persists about the signed-in user is a projection holding
  only the fields the application reads back, never the credential that proved the identity, because
  anything in Web Storage is readable by any script on the page and outlives the session it belonged to
- [ ] Remediation of already-stored data — changing what a client writes leaves every value persisted under
  the old shape untouched, so the entry is re-projected or discarded when it is read; otherwise the
  sensitive field is written straight back on the next save and the fix never reaches the users who
  already hold one

Rationale: Injected script, ambient credentials, and persisted client state are the three ways the browser turns into an attack surface, and they share one question — what does the browser do on the user's behalf without being asked: it executes what a page contains, it sends what it has stored, and it keeps what a script wrote. The audit receives the token-storage material from `04-auth-jwt.md` and gives up its injection, mass-assignment, IDOR, BOLA and server-side-validation sections to chapters 07 and 01, which own those concepts.

Handoff: Chapter 07 moves the same untrusted-input reasoning from the browser into server parsers, queries, DTOs, and interpreters.

## 07 — Injection, validation, and constrained input

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/07-injection-validation.md
Spanish: notes/security/junior/es/07-inyeccion-validacion.md

Depends on: 06

Pending additions: none

Narrative role: Follow untrusted data through server boundaries and keep it data rather than executable instructions or privileged object state.

Learning outcome: Select validation, parameter binding, DTO constraints, sanitisation, or contextual encoding for the actual boundary and risk in front of him.

Prerequisites: 06

Must answer:

- Why does client validation never replace server validation?
- How do syntactic validation, semantic validation, sanitisation, and output encoding differ, and why can one not substitute for another?
- Why are parameterised queries safe while string-built SQL or JPQL remains injectable even inside an ORM?
- Beyond SQL, which other things in a Spring Boot service are interpreters — a shell command, a template, an expression, a file path, a log line — and what does concatenating unchecked input into each one actually let an attacker do?
- How do constrained DTOs prevent both unsafe deserialisation and mass assignment?

Coverage concepts:

- [ ] Server-side validation — client validation improves UX but can be bypassed, so the API must validate
  every untrusted request independently
- [ ] Syntactic vs semantic validation — validate shape and range as well as business facts such as
  ownership, allowed state transitions, and permitted relationships
- [ ] Validation vs sanitisation vs output encoding — distinguish rejecting invalid data, transforming
  data, and rendering it safely in a specific output context
- [ ] SQL injection — bind query parameters and never concatenate untrusted input into SQL or JPQL;
  an ORM cannot make string-built queries safe
- [ ] Injection beyond SQL — avoid building shell commands, templates, expressions, paths, or log records
  by concatenating unchecked input
- [ ] Unsafe deserialisation — accept constrained DTO and data formats instead of reconstructing arbitrary
  attacker-selected object types or enabling polymorphic type resolution casually
- [ ] Mass assignment / over-posting — constrain request DTO fields so a client cannot set roles,
  ownership, approval state, audit metadata, or other server-controlled properties

Rationale: Every bullet is the same failure at a different interpreter: data that the server allowed to become instructions or state, and the fix in each case has the same shape — constrain the accepted form instead of cleaning the dangerous one. The chapter receives the SQL-injection and mass-assignment material currently in `06-security-vulnerabilities.md`.

Handoff: Once input is constrained, chapter 08 covers the inputs that choose files, network destinations, or navigation targets.

## 08 — Files, uploads, and destination controls

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/08-resource-destination-controls.md
Spanish: notes/security/junior/es/08-controles-recursos-destinos.md

Depends on: 07

Pending additions: none

Narrative role: Prevent user-controlled names and destinations from escaping the file, network, or navigation boundary the application intended.

Learning outcome: Review file paths, uploads, server-side fetches, and redirects using normalisation, allow-lists, generated storage names, and deliberate serving.

Prerequisites: 07

Must answer:

- How can a harmless-looking filename escape the directory it was meant to stay in?
- Why are the supplied filename and `Content-Type` insufficient upload validation?
- Once an upload is accepted, what name is it stored under, where must it not be stored, and what has to be true of the endpoint that serves it back?
- How do SSRF and open redirects turn an accepted URL into a security boundary?

Coverage concepts:

- [ ] Path traversal — normalise and constrain file paths so user-controlled names cannot escape the
  intended storage directory
- [ ] File upload validation — constrain size and allowed content using server-side inspection rather than
  trusting the supplied filename or `Content-Type`
- [ ] File upload storage and serving — generate storage names, keep uploaded content outside executable
  paths, and serve it with deliberate authorisation and content handling
- [ ] Server-side request forgery (SSRF) awareness — do not let arbitrary user-supplied URLs make the
  server reach internal or otherwise restricted network resources
- [ ] Open redirect awareness — validate redirect destinations rather than forwarding directly to a
  client-controlled URL

Rationale: These are the cases where the untrusted value is not content but a destination — a path, a URL, a location on disk — so the defence is choosing the destination server-side rather than validating the string.

Handoff: Chapter 09 asks what the application should reveal once it has safely reached a resource.

## 09 — Disclosure: what the system reveals, and through which channel

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/09-sensitive-data-disclosure.md
Spanish: notes/security/junior/es/09-datos-sensibles-divulgacion.md

Depends on: 08

Pending additions: none

Narrative role: Ask one question — what does this reveal, and to whom — of every channel a response has: its fields, its errors, its status codes, its ordering, its logs, and its caches.

Learning outcome: Review an endpoint and its observability output for unnecessary personal data, secrets, internal details, enumerable existence, and values leaked by the shape of a response rather than its fields.

Prerequisites: 08

Must answer:

- Which of these does the feature actually need to collect, keep, process, and return, and what is the cost of each one it keeps out of habit?
- Why is returning an entity dangerous even when the endpoint is correctly authorised?
- Which details make an error useful to an attacker but unnecessary to the client?
- When should an object the caller may not reach be reported as missing rather than forbidden?
- Why does hiding a resource on one endpoint fail if another endpoint accepting the same identifier answers differently?
- How can a field the response never returns still be observed through the order of a result set?
- How can authentication logging stay useful without recording credentials or personal data, and when must a response avoid browser or shared caching?

Coverage concepts:

- [ ] Data minimisation — collect, retain, process, and return only the sensitive or personal data the
  feature genuinely needs
- [ ] Response DTOs and sensitive fields — never serialize password hashes, secrets, internal claims, or
  unnecessary personal data merely because they exist on an entity
- [ ] Error-response hygiene — return stable useful errors without stack traces, SQL details, filesystem
  paths, internal class names, or secrets
- [ ] Resource-existence disclosure — distinguishing "forbidden" from "not found" lets a caller enumerate
  which identifiers exist, so an object the caller may not reach is reported as missing unless that
  caller is entitled to know it exists
- [ ] Concealment consistency across entry points — a decision to hide a resource's existence from a caller
  holds only if every endpoint accepting that identifier answers the same way, since the most talkative
  path defines the real exposure regardless of what the endpoint designed to conceal it returns
- [ ] Indirect disclosure through result ordering — a value the response never serialises can still leak
  when the caller chooses which column a result set is ordered by, since an order derived from a secret
  is an observation of it, so the sortable and filterable fields are constrained to an explicit
  allow-list rather than accepted as the persistence layer receives them
- [ ] Security logging hygiene — record useful authentication and authorisation events while excluding
  passwords, tokens, session IDs, authorisation headers, and unnecessary personal data
- [ ] Sensitive-response caching — use appropriate private or `no-store` cache controls when credentials or
  private responses must not remain in browser or shared caches

Rationale: Disclosure is one model asked of eight channels, which is what makes the three counter-intuitive bullets — concealment consistency, result ordering, and caching — teachable rather than surprising: a junior who has learned to check only the serialised fields will miss every one of them.

Handoff: After controlling disclosure, chapter 10 protects the secrets and transport on which every preceding control depends.

## 10 — Secrets and transport protection

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/10-secrets-transport.md
Spanish: notes/security/junior/es/10-secretos-transporte.md

Depends on: 09

Pending additions: none

Narrative role: Keep credentials out of distributable artefacts, respond correctly when one escapes, and explain why HTTPS is a separate prerequisite for every application-layer control.

Learning outcome: Identify real secrets, inject them from trusted configuration, recognise exposure through bundles, images, logs, or process access, and state what an exposed credential now requires.

Prerequisites: 09

Must answer:

- Which values in an `application.yml` are secrets and which are ordinary configuration, and what is the test that separates them?
- Why can no value shipped in an Angular bundle remain secret?
- What risks remain after moving a secret from source code into an environment variable?
- Why does deleting a committed credential not undo the exposure, and what is the actual response?
- Why do JWT signatures, password hashes, and authorisation not replace TLS?

Coverage concepts:

- [ ] Secrets vs ordinary configuration — keep passwords, signing keys, and API credentials out of source
  code, committed configuration, frontend bundles, container images, and test fixtures
- [ ] Exposed-secret response — a credential that reached shared history or any published artifact is
  compromised for every copy already taken, so the response is rotating the value and everything
  derived from it, while deleting or rewriting the source only limits further exposure
- [ ] Frontend secrecy impossibility — any value shipped in an Angular bundle is visible to the user, so
  embedded API keys are not secrets
- [ ] Secret injection — environment variables or a secret store separate credentials from source code,
  but logs, diagnostics, process inspection, and overly broad access can still expose them
- [ ] TLS as a precondition — HTTPS protects credentials and data in transit; JWT signing, hashing,
  validation, and authorisation solve different problems and do not replace it

Rationale: A secret's whole life is one unit: what counts as one, how it reaches the process, how it leaks, what to do once it has, and the transport that protects it on the wire — the last of which chapters 03 and 06 both deferred to here.

Handoff: Chapter 11 turns these principles into production hardening and explicit security policy.

## 11 — Production hardening and security headers

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/11-production-hardening.md
Spanish: notes/security/junior/es/11-endurecimiento-produccion.md

Depends on: 10

Pending additions: none

Narrative role: Recognise the development conveniences and exposed endpoints that widen the production attack surface, and understand the protections common headers signal.

Learning outcome: Review configuration for disabled defaults, administrative exposure, verbose modes, and absent or unsafe security-header values.

Prerequisites: 10

Must answer:

- When is disabling a framework protection a threat-model decision rather than a convenient fix?
- Which development settings and administrative endpoints must be reconsidered before deployment?
- What classes of browser attack do CSP, `frame-ancestors`, `nosniff`, `Referrer-Policy`, and HSTS each address?

Coverage concepts:

- [ ] Development vs production hardening — default credentials, debug modes, verbose errors, test data,
  and permissive development settings must not reach production
- [ ] Protection-disablement review — disabling CSRF, authentication, frame protection, or other secure
  defaults requires an explicit threat-model reason rather than a convenient fix
- [ ] Administrative endpoint exposure — management, documentation, debug, metrics, and dump endpoints
  expand the attack surface and require deliberate exposure and access control
- [ ] Security-header recognition — understand the protection signalled by CSP, `frame-ancestors`,
  `X-Content-Type-Options: nosniff`, Referrer-Policy, and HSTS, and notice unsafe absence or values

Rationale: This is where the earlier controls meet the environment they run in, and every bullet is a question about the gap between what works on a laptop and what is safe in production.

Handoff: Application configuration still depends on external code; chapter 12 covers supply-chain hygiene.

## 12 — Dependency and supply-chain hygiene

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/12-dependency-supply-chain.md
Spanish: notes/security/junior/es/12-dependencias-cadena-suministro.md

Depends on: 11

Pending additions: none

Narrative role: Treat dependencies, plugins, repositories, lockfiles, and images as reviewed inputs carrying patch and provenance obligations.

Learning outcome: Investigate an alert by checking support status, resolved versions, unexpected provenance changes, and whether deeper reachability analysis needs escalation.

Prerequisites: 11

Must answer:

- Why is staying on supported versions a security control and not just maintenance?
- What does an unexpected lockfile, repository, plugin, or base-image change signal?
- Why should a junior neither blindly suppress nor blindly upgrade a vulnerability alert?

Coverage concepts:

- [ ] Supported dependency baseline — keep frameworks, libraries, plugins, and base images on supported
  versions rather than accumulating known unpatched risk
- [ ] Lockfiles and dependency provenance — preserve reviewed dependency resolution and investigate
  unexpected package, plugin, repository, or lockfile changes
- [ ] Vulnerability-alert handling — check whether the project uses an affected version, avoid blind
  suppression or upgrading, and escalate when deeper reachability or risk analysis is required

Rationale: Code the project did not write runs with the project's privileges, so the three bullets are the minimum obligations that follow from that single fact.

Handoff: The final chapter proves the preceding controls with hostile inputs, negative paths, and regression review.

## 13 — Security testing and adversarial review

Status: pending

Studied: pending

Pending study: none

Action: create

English: notes/security/junior/en/13-security-testing-review.md
Spanish: notes/security/junior/es/13-pruebas-revision-seguridad.md

Depends on: 12

Pending additions: none

Narrative role: Turn the complete junior security model into repeatable negative tests and an attacker-minded review of generated or hand-written configuration.

Learning outcome: Design tests for hostile input, invalid credentials, permission outcomes, escalation, and unmatched endpoints, then review security-sensitive configuration beyond whether it works.

Prerequisites: 12

Must answer:

- Which malicious or boundary inputs reveal flaws that ordinary invalid-value tests miss?
- What does a test prove when it sends a missing, malformed, expired, or tampered credential, and why is that different from testing a wrong role?
- How do anonymous, wrong-role, horizontal, and vertical cases prove authorisation rather than only functionality?
- How can matcher order or a newly added endpoint silently weaken a configuration that still passes its tests?
- Which security consequences must be reviewed explicitly in AI-generated configuration?

Coverage concepts:

- [ ] Hostile-input security tests — exercise injection metacharacters, traversal sequences, oversized
  payloads, disallowed fields, and unsafe output contexts at trust boundaries instead of testing
  validation only with ordinary invalid values
- [ ] Negative authentication tests — cover missing, malformed, expired, and tampered credentials rather
  than testing only successful login
- [ ] Permission-outcome tests — prove anonymous, permitted, and wrong-role outcomes instead of testing
  only the authorised happy path
- [ ] Horizontal and vertical escalation tests — deliberately use one user's credentials against another
  user's resource and a normal account against an administrative action
- [ ] Security configuration regression — verify that new and unmatched endpoints remain protected and
  that broad matcher order does not accidentally make a protected path public
- [ ] AI-generated security review — treat configuration that appears to work as untrusted until its
  secrets, disabled protections, broad matchers, client claims, ownership checks, output handling, and
  logging consequences have been examined

Rationale: The route has taught what should be true; this chapter is the only one that asks how Victor would know, and it deliberately reuses every earlier chapter as the source of its negative cases — the matcher-order question rests on the rule-evaluation order chapter 01 establishes.

Handoff: This closes the junior route by replacing confidence drawn from happy paths with evidence that the boundaries fail safely.

## Unassigned existing notes

*(none)*
