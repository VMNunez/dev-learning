# Security Junior Notes Plan

Plan status: current
Coverage: notes/security/coverage/junior.md
Coverage SHA-256: d9af0b5456bcd328ef9347c2a1aa99eca9c025dce24510a4e576c2cc1dbc5eff
Generated: 2026-07-29

## 00 — Security as boundary reasoning

Status: pending
Action: create
English: notes/security/junior/en/00-security-foundations.md
Spanish: notes/security/junior/es/00-fundamentos-seguridad.md
Depends on: none
Pending additions: none

Narrative role: Orient Victor from everyday web development to attacker-aware reasoning before individual controls appear.

Learning outcome: Map assets, threats, vulnerabilities, trust boundaries, and layered controls for a small Angular + Spring Boot system.

Prerequisites: none

Must answer:

- What is application security, what practical failures does it prevent, and why does it matter in Victor's Angular + Spring Boot work?
- What makes parsed input still untrusted?
- How do least privilege, deny by default, allow-lists, fail-closed behaviour, and defence in depth work together?
- How should a junior use the OWASP Top 10 without treating it as a memorisation checklist?
- What is the complete `00 → 12` learning route, and why does it move from trust boundaries through identity, browser and server threats, operational controls, and finally adversarial testing in that order?

Coverage concepts:

- OWASP Top 10 — use the current edition as an awareness map of recurring web-application risk
  categories, not as a checklist whose category order should be memorised
- Threat vs vulnerability — distinguish a possible cause of harm from the weakness that lets the
  threat succeed
- Asset and control — identify what needs protection and the defence that reduces a specific risk to it
- Trust boundaries — treat the browser, API, database, third-party services, build environment, and
  network as separate zones whose inputs and identities require verification
- Parsing is not trust — route parameters, headers, cookies, JSON, hidden fields, and decoded token
  claims remain attacker-controlled even after a framework has parsed them successfully
- Least privilege and deny by default — grant users, tokens, components, and database accounts only
  the access they need, while leaving unmatched actions inaccessible
- Defence in depth — combine validation, authorisation, safe APIs, output encoding, transport
  protection, and monitoring because no single control is sufficient
- Allow-list over block-list — define accepted origins, roles, fields, formats, and ranges instead of
  trying to enumerate every malicious value
- Secure defaults and fail closed — an absent rule, invalid credential, unexpected exception, or
  unavailable dependency must not silently make a protected operation public

Rationale: This chapter owns the coherent learning unit defined by security reasoning and trust boundaries.

Handoff: This mental model supplies the vocabulary used to reason about identity and permissions in chapter 01.

## 01 — Authentication, authorisation, and ownership

Status: pending
Action: audit
English: notes/security/junior/en/01-authn-vs-authz.md
Spanish: notes/security/junior/es/01-authn-vs-authz.md
Depends on: 00
Pending additions: none

Narrative role: Separate identity proof from permission decisions and apply server-side, role-level, and object-level checks consistently.

Learning outcome: Explain and review an API operation for authentication, RBAC, ownership, and horizontal or vertical privilege escalation.

Prerequisites: 00

Must answer:

- Why can a valid request body and a logged-in user still be unauthorised?
- Why must ownership come from the security context instead of a client-supplied user ID?
- Why does filtering a collection not protect detail, update, and delete endpoints?

Coverage concepts:

- Authentication vs authorisation — authentication verifies an identity, while authorisation decides
  what that authenticated identity may do
- Identification vs authentication — a username, email, or token subject names a claimed identity,
  while credential verification establishes whether the claim is genuine
- Credentials, identity, and session state — a password proves identity at login, while a session ID
  or bearer token carries the resulting authenticated state across later requests
- Server-side enforcement — Angular guards and hidden buttons improve navigation and UX but never
  replace permission checks on every protected backend operation
- Role-based access control — map roles or authorities consistently and prevent clients from assigning
  privileged roles to themselves
- Layered authorisation rules — request-level and method-level checks can reinforce each other but must
  not leave gaps or contradictory policy
- Object-level authorisation (BOLA/IDOR) — verify access to the specific requested record instead of
  assuming that any logged-in user may use any identifier
- Horizontal vs vertical privilege escalation — distinguish accessing another user's resources from
  gaining a more privileged role or operation
- Trusted identity for ownership checks — derive the caller from the authenticated security context
  rather than accepting an owner or user ID from the request body
- Collection vs detail authorisation — a filter on a list endpoint does not protect the matching
  read, update, or delete endpoint, so each operation must enforce the same visibility rule
- Input validation vs authorisation — valid data shape and business values do not prove that the caller
  has permission to perform the requested action

Rationale: This chapter owns the coherent learning unit defined by authentication and authorisation.

Handoff: Once access decisions are clear, chapter 02 explains how passwords establish identity safely.

## 02 — Password verification, recovery, and abuse resistance

Status: pending
Action: audit
English: notes/security/junior/en/02-hash-vs-encryption.md
Spanish: notes/security/junior/es/02-hash-vs-encryption.md
Depends on: 01
Pending additions: none

Narrative role: Show how a server verifies identity without storing recoverable passwords and how it limits abuse around credential endpoints.

Learning outcome: Explain salts, adaptive work factors, secure randomness, generic failures, reset tokens, MFA awareness, and throttling trade-offs.

Prerequisites: 01

Must answer:

- Why are password hashes deliberately slow and uniquely salted?
- Why should application code delegate verification to a maintained password encoder?
- How can rate limits and generic failures resist abuse without creating a denial-of-service tool?

Coverage concepts:

- Hashing vs encryption vs encoding — hashing is one-way verification, encryption is reversible with a
  key, and encoding only changes representation
- Password hashing — store passwords with a slow adaptive password-hashing function such as BCrypt,
  never as plaintext, reversible encryption, or a fast general-purpose hash
- Salt — use a unique random salt per password so equal passwords do not produce equal stored hashes;
  a standard password encoder manages it with the hash
- Work factor — tune the password hash cost so verification is deliberately expensive for attackers
  but still acceptable for legitimate logins
- Password verification — delegate hash parsing, salt handling, and verification to a maintained
  password encoder instead of comparing raw passwords or hashes manually
- Security-sensitive randomness — generate reset tokens, initial secrets, and other guess-sensitive values
  from a cryptographically secure unpredictable source rather than a predictable pseudo-random stream
- Brute-force defence — throttle repeated authentication attempts using account and network signals
  without relying on permanent lockout that attackers can abuse for denial of service
- Password reset — use a short-lived, single-use, unpredictable token, invalidate it after success,
  and never email the existing password or trust only an account identifier
- Multi-factor authentication awareness — recognise that a second independent factor reduces the
  damage from a stolen password without requiring a junior to design an enterprise identity system
- Generic authentication failures — keep login status, response shape, message, and observable timing
  sufficiently consistent that they do not reveal whether an account exists
- Endpoint abuse limiting — recognise that registration, reset, verification, and expensive API
  operations also need bounded throttling, while distributed policy design remains a later-level task

Rationale: This chapter owns the coherent learning unit defined by passwords, recovery, and abuse resistance.

Handoff: Successful login creates authenticated state; chapter 03 follows that state through sessions and tokens.

## 03 — Sessions, bearer tokens, and JWT validation

Status: pending
Action: audit
English: notes/security/junior/en/03-auth-jwt.md
Spanish: notes/security/junior/es/03-auth-jwt.md
Depends on: 02
Pending additions: none

Narrative role: Trace authenticated state across requests and distinguish token readability, integrity, validation, expiry, refresh, and revocation.

Learning outcome: Compare sessions with bearer tokens and determine whether a JWT is acceptable only after every relevant validation step.

Prerequisites: 02

Must answer:

- What changes between verifying credentials and managing authenticated state afterwards?
- Why can automatically attached cookies enable unwanted cross-site requests, and which details are deliberately deferred to the full CSRF mechanism in chapter 05?
- Why does a valid signature not make JWT claims secret or authorise every action?
- Which key, algorithm, issuer, audience, time, subject, and application-claim checks must happen before trust?
- What can logout, short expiry, refresh tokens, and revocation each guarantee—and not guarantee?

Coverage concepts:

- Session-based vs token-based authentication — compare server-held session state with self-contained
  bearer tokens, including storage, scaling, revocation, and CSRF consequences
- Authentication vs session management — verifying credentials creates authenticated state, while
  propagation, expiry, renewal, rotation, and invalidation govern its later lifecycle
- Session fixation and hijacking — accept only server-generated unpredictable session identifiers,
  rotate them after authentication or privilege changes, and invalidate server-side state on logout
- Bearer-token possession — anyone who obtains a bearer token can use it, so URLs, logs, screenshots,
  error messages, and analytics must not expose it
- JWT structure — distinguish the header, claim set, and signature without assuming every JWT uses the
  same signing algorithm
- JWT encoding vs encryption — Base64url makes header and payload readable; a signed JWT detects
  tampering but does not make its claims secret
- Signature or MAC vs encryption — a signature or message authentication code provides integrity and
  authenticity, while encryption provides confidentiality
- JWT signature verification — accept a token only after verifying its signature with the configured
  trusted key and rejecting algorithms the application did not choose
- JWT signing-key strength — load a sufficiently strong random or generated key from trusted
  configuration because moving a weak human password out of source control does not make it secure
- JWT issuer and audience validation — bind a token to the authority that issued it and the service
  intended to accept it instead of trusting any token signed by a familiar key
- JWT temporal-claim validation — enforce expiry and any applicable not-before time rather than
  accepting a token outside its valid window
- JWT subject and application-claim validation — treat identity, role, and other claims as input to
  policy checks rather than proof that every requested action is allowed
- JWT tampering resistance — changing header or payload bytes invalidates the signature unless the
  attacker can produce a valid signature with the trusted signing key
- JWT expiry — short-lived access tokens reduce the useful lifetime of a stolen credential but do not
  prevent misuse before expiry
- Access token vs refresh token — use a short-lived access token for APIs and a more protected,
  longer-lived refresh token only to obtain new access tokens
- Logout and revocation limits — deleting a browser token ends local use but does not invalidate an
  already issued stateless token unless the server adds revocation state or waits for expiry

Rationale: These sections belong together because browser-carried authenticated state must be understood as one lifecycle before individual storage and cross-origin threats are studied.

Handoff: With browser-held authentication understood, chapter 04 explains the browser origin boundary.

## 04 — Same-Origin Policy and CORS

Status: pending
Action: audit
English: notes/security/junior/en/04-cors.md
Spanish: notes/security/junior/es/04-cors.md
Depends on: 03
Pending additions: none

Narrative role: Explain what the browser blocks across origins and configure the narrow cross-origin permission the deployed client needs.

Learning outcome: Predict simple, preflighted, and credentialed CORS behaviour without mistaking CORS for API authorisation.

Prerequisites: 03

Must answer:

- What exactly makes two URLs different origins?
- When can a cross-origin request reach the server even though JavaScript cannot read the response?
- Why do JSON, Authorization, credentials, and wildcards change the preflight or response rules?

Coverage concepts:

- Same-Origin Policy and origin — the browser isolates script access by scheme, host, and port, so
  `http://localhost:4200` and `http://localhost:8080` are different origins
- CORS purpose — the server uses response headers to let a browser relax the Same-Origin Policy for
  selected cross-origin requests
- CORS is not authorisation — it limits browser JavaScript, not Postman, curl, servers, or attackers,
  so protected APIs still require authentication and authorisation
- Simple vs preflighted CORS requests — a simple request may reach the server before the browser hides
  its response, while a failed `OPTIONS` preflight prevents the real non-simple request
- Preflight triggers — methods, content types, or headers outside the CORS safelist, including
  `Authorization` and JSON request content, require the browser to check permission first
- Credentialed CORS — credentialed cross-origin requests require an explicit allowed origin and cannot
  combine credentials with an `Access-Control-Allow-Origin: *` wildcard
- Minimal CORS policy — allow only the origins, methods, headers, and credential mode the deployed
  client actually needs

Rationale: This chapter owns the coherent learning unit defined by same-origin policy and cors.

Handoff: The origin boundary sets up chapter 05’s browser-side threats: injected code, ambient cookies, and token storage.

## 05 — XSS, CSRF, cookies, and browser token storage

Status: pending
Action: audit
English: notes/security/junior/en/05-security-vulnerabilities.md
Spanish: notes/security/junior/es/05-security-vulnerabilities.md
Depends on: 04
Pending additions: none

Narrative role: Choose safe output and browser credential handling by reasoning about script execution, rendering contexts, and automatically attached cookies.

Learning outcome: Distinguish XSS variants from CSRF and explain the trade-offs between Web Storage and hardened cookies.

Prerequisites: 04

Must answer:

- Which browser sinks execute or interpret attacker-controlled data, and why does output context matter?
- Why can an HttpOnly cookie reduce token theft yet create CSRF obligations?
- How do anti-CSRF tokens, custom headers, SameSite, Secure, and HttpOnly cover different attack paths?

Coverage concepts:

- Dangerous browser sinks and safe rendering — prefer framework text binding and text-only DOM APIs;
  treat HTML-parsing DOM writes, script-capable URL assignments, eval-like execution, and trust-bypass
  APIs as review hotspots, applying sink-specific avoidance, contextual encoding or sanitisation, or
  URL allow-listing
- Cross-site scripting (XSS) — distinguish stored, reflected, and DOM-based script injection and
  understand how injected code can act with the victim's browser privileges
- Context-sensitive output handling — HTML text, attributes, URLs, JavaScript, and CSS have different
  safe output rules, so generic input sanitisation cannot replace framework escaping
- Cross-site request forgery (CSRF) — an attacker abuses credentials the browser attaches
  automatically, especially cookies, to make an unwanted state-changing request
- CSRF defences — use anti-CSRF tokens or a custom-header design whose preflight is denied to untrusted
  origins, with `SameSite` as defence in depth rather than the only control
- Secure cookie attributes — understand how `HttpOnly`, `Secure`, and `SameSite` reduce script access,
  insecure transport, and cross-site sending respectively
- Token storage in browsers — Web Storage exposes tokens to JavaScript and therefore XSS, while
  `HttpOnly` cookies reduce token theft but require deliberate CSRF and cookie controls

Rationale: These sections belong together because browser-carried authenticated state must be understood as one lifecycle before individual storage and cross-origin threats are studied.

Handoff: Chapter 06 moves the same untrusted-input reasoning from the browser into server parsers, queries, DTOs, and interpreters.

## 06 — Injection, validation, and constrained input

Status: pending
Action: create
English: notes/security/junior/en/06-injection-validation.md
Spanish: notes/security/junior/es/06-inyeccion-validacion.md
Depends on: 05
Pending additions: none

Narrative role: Follow untrusted data through server boundaries and keep it data rather than executable instructions or privileged object state.

Learning outcome: Select validation, parameter binding, DTO constraints, sanitisation, or contextual encoding for the actual boundary and risk.

Prerequisites: 05

Must answer:

- Why does client validation never replace server validation?
- How do syntactic validation, semantic validation, sanitisation, and output encoding differ?
- Why are parameterised ORM queries safe while string-built SQL or JPQL remains injectable?
- How do constrained DTOs prevent unsafe deserialisation and mass assignment?

Coverage concepts:

- Server-side validation — client validation improves UX but can be bypassed, so the API must validate
  every untrusted request independently
- Syntactic vs semantic validation — validate shape and range as well as business facts such as
  ownership, allowed state transitions, and permitted relationships
- Validation vs sanitisation vs output encoding — distinguish rejecting invalid data, transforming
  data, and rendering it safely in a specific output context
- SQL injection — bind query parameters and never concatenate untrusted input into SQL or JPQL;
  an ORM cannot make string-built queries safe
- Injection beyond SQL — avoid building shell commands, templates, expressions, paths, or log records
  by concatenating unchecked input
- Unsafe deserialisation — accept constrained DTO and data formats instead of reconstructing arbitrary
  attacker-selected object types or enabling polymorphic type resolution casually
- Mass assignment / over-posting — constrain request DTO fields so a client cannot set roles,
  ownership, approval state, audit metadata, or other server-controlled properties

Rationale: This chapter owns the coherent learning unit defined by injection, validation, and unsafe input.

Handoff: Once input is constrained, chapter 07 covers inputs that choose files, uploads, network destinations, or redirects.

## 07 — Files, uploads, and destination controls

Status: pending
Action: create
English: notes/security/junior/en/07-resource-destination-controls.md
Spanish: notes/security/junior/es/07-controles-recursos-destinos.md
Depends on: 06
Pending additions: none

Narrative role: Prevent user-controlled names and destinations from escaping the file, network, or navigation boundary intended by the application.

Learning outcome: Review file paths, uploads, server-side fetches, and redirects using normalization, allow-lists, safe storage, and deliberate serving.

Prerequisites: 06

Must answer:

- How can a harmless-looking filename escape its intended directory?
- Why are filename extensions and Content-Type headers insufficient upload validation?
- How do SSRF and open redirects turn an accepted URL into a security boundary?

Coverage concepts:

- Path traversal — normalise and constrain file paths so user-controlled names cannot escape the
  intended storage directory
- File upload validation — constrain size and allowed content using server-side inspection rather than
  trusting the supplied filename or `Content-Type`
- File upload storage and serving — generate storage names, keep uploaded content outside executable
  paths, and serve it with deliberate authorisation and content handling
- Server-side request forgery (SSRF) awareness — do not let arbitrary user-supplied URLs make the
  server reach internal or otherwise restricted network resources
- Open redirect awareness — validate redirect destinations rather than forwarding directly to a
  client-controlled URL

Rationale: This chapter owns the coherent learning unit defined by resource and destination controls.

Handoff: Chapter 08 asks what the application should disclose after it safely reaches a resource.

## 08 — Sensitive data, responses, errors, and logs

Status: pending
Action: create
English: notes/security/junior/en/08-sensitive-data-disclosure.md
Spanish: notes/security/junior/es/08-datos-sensibles-divulgacion.md
Depends on: 07
Pending additions: none

Narrative role: Minimise sensitive data exposure across storage decisions, DTOs, errors, logs, and caches.

Learning outcome: Review an endpoint and its observability output for unnecessary personal data, secrets, internal details, and retained private responses.

Prerequisites: 07

Must answer:

- Why is returning an entity dangerous even when the endpoint is authorised?
- Which details make errors useful to attackers but unnecessary to clients?
- How can authentication logging remain useful without recording credentials or personal data?
- When should a sensitive response avoid browser or shared caching?

Coverage concepts:

- Data minimisation — collect, retain, process, and return only the sensitive or personal data the
  feature genuinely needs
- Response DTOs and sensitive fields — never serialize password hashes, secrets, internal claims, or
  unnecessary personal data merely because they exist on an entity
- Error-response hygiene — return stable useful errors without stack traces, SQL details, filesystem
  paths, internal class names, or secrets
- Security logging hygiene — record useful authentication and authorisation events while excluding
  passwords, tokens, session IDs, authorisation headers, and unnecessary personal data
- Sensitive-response caching — use appropriate private or `no-store` cache controls when credentials or
  private responses must not remain in browser or shared caches

Rationale: This chapter owns the coherent learning unit defined by sensitive data and disclosure.

Handoff: After controlling disclosure, chapter 09 protects the secrets and transport on which those controls depend.

## 09 — Secrets and transport protection

Status: pending
Action: create
English: notes/security/junior/en/09-secrets-transport.md
Spanish: notes/security/junior/es/09-secretos-transporte.md
Depends on: 08
Pending additions: none

Narrative role: Keep credentials out of distributable artefacts and explain why HTTPS is a separate prerequisite for every application-layer control.

Learning outcome: Identify real secrets, inject them from trusted configuration, and recognise exposure through frontend bundles, images, logs, or process access.

Prerequisites: 08

Must answer:

- Why can no value shipped in an Angular bundle remain secret?
- What risks remain after moving a secret from source code to an environment variable?
- Why do JWT signatures, password hashes, and authorisation not replace TLS?

Coverage concepts:

- Secrets vs ordinary configuration — keep passwords, signing keys, and API credentials out of source
  code, committed configuration, frontend bundles, container images, and test fixtures
- Frontend secrecy impossibility — any value shipped in an Angular bundle is visible to the user, so
  embedded API keys are not secrets
- Secret injection — environment variables or a secret store separate credentials from source code,
  but logs, diagnostics, process inspection, and overly broad access can still expose them
- TLS as a precondition — HTTPS protects credentials and data in transit; JWT signing, hashing,
  validation, and authorisation solve different problems and do not replace it

Rationale: This chapter owns the coherent learning unit defined by secrets and transport.

Handoff: Chapter 10 turns these principles into production hardening and explicit security policy.

## 10 — Production hardening and security headers

Status: pending
Action: create
English: notes/security/junior/en/10-production-hardening.md
Spanish: notes/security/junior/es/10-endurecimiento-produccion.md
Depends on: 09
Pending additions: none

Narrative role: Recognise development conveniences and exposed endpoints that widen production attack surface, and understand the protections named by common headers.

Learning outcome: Review configuration for disabled defaults, administrative exposure, verbose modes, and absent or unsafe security-header values.

Prerequisites: 09

Must answer:

- When is disabling a framework protection a threat-model decision rather than a convenient fix?
- Which development settings and administrative endpoints must be reconsidered before deployment?
- What classes of browser attack do CSP, frame-ancestors, nosniff, Referrer-Policy, and HSTS address?

Coverage concepts:

- Development vs production hardening — default credentials, debug modes, verbose errors, test data,
  and permissive development settings must not reach production
- Protection-disablement review — disabling CSRF, authentication, frame protection, or other secure
  defaults requires an explicit threat-model reason rather than a convenient fix
- Administrative endpoint exposure — management, documentation, debug, metrics, and dump endpoints
  expand the attack surface and require deliberate exposure and access control
- Security-header recognition — understand the protection signalled by CSP, `frame-ancestors`,
  `X-Content-Type-Options: nosniff`, Referrer-Policy, and HSTS, and notice unsafe absence or values

Rationale: This chapter owns the coherent learning unit defined by hardening and security headers.

Handoff: Application configuration still depends on external code; chapter 11 covers supply-chain hygiene.

## 11 — Dependency and supply-chain hygiene

Status: pending
Action: create
English: notes/security/junior/en/11-dependency-supply-chain.md
Spanish: notes/security/junior/es/11-dependencias-cadena-suministro.md
Depends on: 10
Pending additions: none

Narrative role: Treat dependencies, plugins, repositories, lockfiles, and images as reviewed inputs with patch and provenance obligations.

Learning outcome: Investigate an alert by checking support status, resolved versions, unexpected provenance changes, and whether deeper reachability analysis needs escalation.

Prerequisites: 10

Must answer:

- Why is staying on supported versions a security control?
- What does an unexpected lockfile, repository, plugin, or base-image change signal?
- Why should a junior neither blindly suppress nor blindly upgrade every vulnerability alert?

Coverage concepts:

- Supported dependency baseline — keep frameworks, libraries, plugins, and base images on supported
  versions rather than accumulating known unpatched risk
- Lockfiles and dependency provenance — preserve reviewed dependency resolution and investigate
  unexpected package, plugin, repository, or lockfile changes
- Vulnerability-alert handling — check whether the project uses an affected version, avoid blind
  suppression or upgrading, and escalate when deeper reachability or risk analysis is required

Rationale: This chapter owns the coherent learning unit defined by dependency and supply-chain hygiene.

Handoff: The final chapter proves the preceding controls with hostile inputs, negative paths, and regression review.

## 12 — Security testing and adversarial review

Status: pending
Action: create
English: notes/security/junior/en/12-security-testing-review.md
Spanish: notes/security/junior/es/12-pruebas-revision-seguridad.md
Depends on: 11
Pending additions: none

Narrative role: Turn the complete junior security model into repeatable negative tests and an attacker-minded review of generated or hand-written configuration.

Learning outcome: Design tests for hostile input, invalid credentials, permission outcomes, escalation, and unmatched endpoints, then review security-sensitive configuration beyond whether it works.

Prerequisites: 11

Must answer:

- Which malicious or boundary inputs reveal flaws that ordinary invalid-value tests miss?
- How do anonymous, wrong-role, horizontal, and vertical cases prove authorisation rather than only functionality?
- How can matcher order or a newly added endpoint silently weaken a secure configuration?
- Which security consequences must be reviewed explicitly in AI-generated configuration?

Coverage concepts:

- Hostile-input security tests — exercise injection metacharacters, traversal sequences, oversized
  payloads, disallowed fields, and unsafe output contexts at trust boundaries instead of testing
  validation only with ordinary invalid values
- Negative authentication tests — cover missing, malformed, expired, and tampered credentials rather
  than testing only successful login
- Permission-outcome tests — prove anonymous, permitted, and wrong-role outcomes instead of testing
  only the authorised happy path
- Horizontal and vertical escalation tests — deliberately use one user's credentials against another
  user's resource and a normal account against an administrative action
- Security configuration regression — verify that new and unmatched endpoints remain protected and
  that broad matcher order does not accidentally make a protected path public
- AI-generated security review — treat configuration that appears to work as untrusted until its
  secrets, disabled protections, broad matchers, client claims, ownership checks, output handling, and
  logging consequences have been examined

Rationale: This chapter owns the coherent learning unit defined by security testing and code review.

Handoff: This closes the junior route by replacing confidence from happy paths with evidence that boundaries fail safely.

## Unassigned existing notes

*(none)*


