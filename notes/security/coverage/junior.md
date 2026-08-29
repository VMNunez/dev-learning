# Junior Coverage — Security

Application-security concepts a junior Angular + Spring Boot developer must understand, apply, and
review without taking on specialist or production-platform ownership.

## Security reasoning and trust boundaries

- OWASP Top 10 — use the current edition as an awareness map of recurring web-application risk
  categories, not as a checklist whose category order should be memorised
- Threat vs vulnerability — distinguish a possible cause of harm from the weakness that lets the
  threat succeed
- Asset and control — identify what needs protection and the defence that reduces a specific risk to it
- Trust boundaries — treat the browser, API, database, third-party services, build environment, and
  network as separate zones whose inputs and identities require verification
- Parsing is not trust — route parameters, headers, cookies, JSON, hidden fields, and decoded token
  claims remain attacker-controlled even after a framework has parsed them successfully ✅ 07-timetrack
- Least privilege and deny by default — grant users, tokens, components, and database accounts only
  the access they need, while leaving unmatched actions inaccessible ✅ 07-timetrack
- Defence in depth — combine validation, authorisation, safe APIs, output encoding, transport
  protection, and monitoring because no single control is sufficient ✅ 07-timetrack
- Allow-list over block-list — define accepted origins, roles, fields, formats, and ranges instead of
  trying to enumerate every malicious value ✅ 07-timetrack
- Secure defaults and fail closed — an absent rule, invalid credential, unexpected exception, or
  unavailable dependency must not silently make a protected operation public ✅ 07-timetrack

## Authentication and authorisation

- Authentication vs authorisation — authentication verifies an identity, while authorisation decides
  what that authenticated identity may do ✅ 06-hr-portal
- Identification vs authentication — a username, email, or token subject names a claimed identity,
  while credential verification establishes whether the claim is genuine
- Credentials, identity, and session state — a password proves identity at login, while a session ID
  or bearer token carries the resulting authenticated state across later requests
- Server-side enforcement — Angular guards and hidden buttons improve navigation and UX but never
  replace permission checks on every protected backend operation ✅ 07-timetrack
- Role-based access control — map roles or authorities consistently and prevent clients from assigning
  privileged roles to themselves ✅ 06-hr-portal
- Administrative self-lockout — an operation that removes a privilege must refuse when the caller is its
  own target, since the route back usually requires the very privilege being removed ✅ 07-timetrack — `UserService.update`
  and `delete` refuse a demotion or deactivation whose target id is the caller's own
- Layered authorisation rules — request-level and method-level checks can reinforce each other but must
  not leave gaps or contradictory policy ✅ 07-timetrack
- Object-level authorisation (BOLA/IDOR) — verify access to the specific requested record instead of
  assuming that any logged-in user may use any identifier ✅ 07-timetrack
- Horizontal vs vertical privilege escalation — distinguish accessing another user's resources from
  gaining a more privileged role or operation ✅ 07-timetrack
- Trusted identity for ownership checks — derive the caller from the authenticated security context
  rather than accepting an owner or user ID from the request body ✅ 07-timetrack
- Collection vs detail authorisation — a filter on a list endpoint does not protect the matching
  read, update, or delete endpoint, so each operation must enforce the same visibility rule ✅ 07-timetrack
- Authorisation as scope, not only as a gate — when one endpoint serves several roles, the caller's role
  can decide which records the response is built from rather than whether the call is refused ✅ 07-timetrack
- Input validation vs authorisation — valid data shape and business values do not prove that the caller
  has permission to perform the requested action

## Session and token lifecycle

- Session-based vs token-based authentication — compare server-held session state with self-contained
  bearer tokens, including storage, scaling, revocation, and CSRF consequences ✅ 07-timetrack
- Authentication vs session management — verifying credentials creates authenticated state, while
  propagation, expiry, renewal, rotation, and invalidation govern its later lifecycle
- Immutable subject identity — bind a session or token to an identifier the account can never lose,
  since a mutable natural key such as an email hands the still-valid credential to whichever account
  holds that value next ✅ 07-timetrack — the JWT subject carries the user id, so `JwtFilter` loads the principal by id, never by the editable email
- Session fixation and hijacking — accept only server-generated unpredictable session identifiers,
  rotate them after authentication or privilege changes, and invalidate server-side state on logout
- Bearer-token possession — anyone who obtains a bearer token can use it, so URLs, logs, screenshots,
  error messages, and analytics must not expose it

## JWT validation

- JWT structure — distinguish the header, claim set, and signature without assuming every JWT uses the
  same signing algorithm ✅ 07-timetrack
- JWT encoding vs encryption — Base64url makes header and payload readable; a signed JWT detects
  tampering but does not make its claims secret
- Signature or MAC vs encryption — a signature or message authentication code provides integrity and
  authenticity, while encryption provides confidentiality
- JWT signature verification — accept a token only after verifying its signature with the configured
  trusted key and rejecting algorithms the application did not choose ✅ 07-timetrack
- JWT signing-key strength — load a sufficiently strong random or generated key from trusted
  configuration because moving a weak human password out of source control does not make it secure ✅ 07-timetrack
- JWT issuer and audience validation — bind a token to the authority that issued it and the service
  intended to accept it instead of trusting any token signed by a familiar key
- JWT temporal-claim validation — enforce expiry and any applicable not-before time rather than
  accepting a token outside its valid window ✅ 07-timetrack
- JWT subject and application-claim validation — treat identity, role, and other claims as input to
  policy checks rather than proof that every requested action is allowed ✅ 07-timetrack
- JWT tampering resistance — changing header or payload bytes invalidates the signature unless the
  attacker can produce a valid signature with the trusted signing key
- JWT expiry — short-lived access tokens reduce the useful lifetime of a stolen credential but do not
  prevent misuse before expiry ✅ 07-timetrack
- Access token vs refresh token — use a short-lived access token for APIs and a more protected,
  longer-lived refresh token only to obtain new access tokens
- Logout and revocation limits — deleting a browser token ends local use but does not invalidate an
  already issued stateless token unless the server adds revocation state or waits for expiry

## Passwords, recovery, and abuse resistance

- Hashing vs encryption vs encoding — hashing is one-way verification, encryption is reversible with a
  key, and encoding only changes representation
- Password hashing — store passwords with a slow adaptive password-hashing function such as BCrypt,
  never as plaintext, reversible encryption, or a fast general-purpose hash ✅ 07-timetrack
- Salt — use a unique random salt per password so equal passwords do not produce equal stored hashes;
  a standard password encoder manages it with the hash ✅ 07-timetrack
- Work factor — tune the password hash cost so verification is deliberately expensive for attackers
  but still acceptable for legitimate logins
- Password verification — delegate hash parsing, salt handling, and verification to a maintained
  password encoder instead of comparing raw passwords or hashes manually ✅ 07-timetrack
- Password input length bounds — an adaptive password hash can process only a bounded prefix of its
  input, so a password field needs an explicit maximum and an encoder that refuses over-length input
  instead of silently ignoring the excess, and that bound is counted in bytes rather than characters ✅ 07-timetrack — both `ChangePasswordRequest` fields and `LoginRequest.password` cap at `@Size(max = 72)`, BCrypt's input bound, so an over-length value is refused at the request boundary
- Security-sensitive randomness — generate reset tokens, initial secrets, and other guess-sensitive values
  from a cryptographically secure unpredictable source rather than a predictable pseudo-random stream ✅ 07-timetrack
- Brute-force defence — throttle repeated authentication attempts using account and network signals
  without relying on permanent lockout that attackers can abuse for denial of service ✅ 07-timetrack — `LoginAttemptService` bounds failed logins per email and per client IP with a self-expiring cooldown
- Credential change must actually change the credential — a rotation request that re-stores the value already in use produces a different stored hash yet leaves the old secret valid, so the new value is compared against the stored one and refused when they match, and that comparison runs only after the current credential has been proven so it cannot answer "is this the password?" for an unauthenticated caller ✅ 07-timetrack — `UserService.changePassword` refuses a `newPassword` whose `passwordEncoder.matches` the stored hash with 400 `fieldErrors.newPassword`, and runs that check only after the current-password check has passed
- Password reset — use a short-lived, single-use, unpredictable token, invalidate it after success,
  and never email the existing password or trust only an account identifier
- Multi-factor authentication awareness — recognise that a second independent factor reduces the
  damage from a stolen password without requiring a junior to design an enterprise identity system
- Generic authentication failures — keep login status, response shape, message, and observable timing
  sufficiently consistent that they do not reveal whether an account exists ✅ 07-timetrack
- Endpoint abuse limiting — recognise that registration, reset, verification, and expensive API
  operations also need bounded throttling, while distributed policy design remains a later-level task

## Same-Origin Policy and CORS

- Same-Origin Policy and origin — the browser isolates script access by scheme, host, and port, so
  `http://localhost:4200` and `http://localhost:8080` are different origins ✅ 07-timetrack
- CORS purpose — the server uses response headers to let a browser relax the Same-Origin Policy for
  selected cross-origin requests ✅ 07-timetrack
- CORS is not authorisation — it limits browser JavaScript, not Postman, curl, servers, or attackers,
  so protected APIs still require authentication and authorisation
- Simple vs preflighted CORS requests — a simple request may reach the server before the browser hides
  its response, while a failed `OPTIONS` preflight prevents the real non-simple request
- Preflight triggers — methods, content types, or headers outside the CORS safelist, including
  `Authorization` and JSON request content, require the browser to check permission first
- Credentialed CORS — credentialed cross-origin requests require an explicit allowed origin and cannot
  combine credentials with an `Access-Control-Allow-Origin: *` wildcard
- Minimal CORS policy — allow only the origins, methods, headers, and credential mode the deployed
  client actually needs ✅ 07-timetrack — `SecurityConfig`'s `CorsConfiguration` lists the deployed origin,
  the six methods used, `Authorization` and `Content-Type` only, and `allowCredentials(false)`

## XSS and output safety

- Dangerous browser sinks and safe rendering — prefer framework text binding and text-only DOM APIs;
  treat HTML-parsing DOM writes, script-capable URL assignments, eval-like execution, and trust-bypass
  APIs as review hotspots, applying sink-specific avoidance, contextual encoding or sanitisation, or
  URL allow-listing
- Cross-site scripting (XSS) — distinguish stored, reflected, and DOM-based script injection and
  understand how injected code can act with the victim's browser privileges
- Context-sensitive output handling — HTML text, attributes, URLs, JavaScript, and CSS have different
  safe output rules, so generic input sanitisation cannot replace framework escaping

## CSRF, cookies, and browser storage

- Cross-site request forgery (CSRF) — an attacker abuses credentials the browser attaches
  automatically, especially cookies, to make an unwanted state-changing request
- CSRF defences — use anti-CSRF tokens or a custom-header design whose preflight is denied to untrusted
  origins, with `SameSite` as defence in depth rather than the only control
- Secure cookie attributes — understand how `HttpOnly`, `Secure`, and `SameSite` reduce script access,
  insecure transport, and cross-site sending respectively
- Token storage in browsers — Web Storage exposes tokens to JavaScript and therefore XSS, while
  `HttpOnly` cookies reduce token theft but require deliberate CSRF and cookie controls ✅ 07-timetrack

## Injection, validation, and unsafe input

- Server-side validation — client validation improves UX but can be bypassed, so the API must validate
  every untrusted request independently ✅ 07-timetrack
- Syntactic vs semantic validation — validate shape and range as well as business facts such as
  ownership, allowed state transitions, and permitted relationships ✅ 07-timetrack
- Validation vs sanitisation vs output encoding — distinguish rejecting invalid data, transforming
  data, and rendering it safely in a specific output context
- SQL injection — bind query parameters and never concatenate untrusted input into SQL or JPQL;
  an ORM cannot make string-built queries safe ✅ 07-timetrack
- Injection beyond SQL — avoid building shell commands, templates, expressions, paths, or log records
  by concatenating unchecked input
- Unsafe deserialisation — accept constrained DTO and data formats instead of reconstructing arbitrary
  attacker-selected object types or enabling polymorphic type resolution casually
- Mass assignment / over-posting — constrain request DTO fields so a client cannot set roles,
  ownership, approval state, audit metadata, or other server-controlled properties ✅ 07-timetrack

## Resource and destination controls

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

## Sensitive data and disclosure

- Data minimisation — collect, retain, process, and return only the sensitive or personal data the
  feature genuinely needs
- Response DTOs and sensitive fields — never serialize password hashes, secrets, internal claims, or
  unnecessary personal data merely because they exist on an entity ✅ 07-timetrack
- Error-response hygiene — return stable useful errors without stack traces, SQL details, filesystem
  paths, internal class names, or secrets ✅ 07-timetrack
- Resource-existence disclosure — distinguishing "forbidden" from "not found" lets a caller enumerate
  which identifiers exist, so an object the caller may not reach is reported as missing unless that
  caller is entitled to know it exists ✅ 07-timetrack
- Concealment consistency across entry points — a decision to hide a resource's existence from a caller
  holds only if every endpoint accepting that identifier answers the same way, since the most talkative
  path defines the real exposure regardless of what the endpoint designed to conceal it returns ✅ 07-timetrack — `resolveProject` answers 404 for an inactive project on POST/PUT /api/entries with the same message an unknown id gets, matching GET /api/projects/{id}
- Indirect disclosure through result ordering — a value the response never serialises can still leak
  when the caller chooses which column a result set is ordered by, since an order derived from a secret
  is an observation of it, so the sortable and filterable fields are constrained to an explicit
  allow-list rather than accepted as the persistence layer receives them ✅ 07-timetrack — `TimeEntryController.validateSort` rejects any `sort` property outside `date`, `hours`, `status`, `id` with 400, so `?sort=user.password,asc` can no longer order the page by the BCrypt hash column
- Security logging hygiene — record useful authentication and authorisation events while excluding
  passwords, tokens, session IDs, authorisation headers, and unnecessary personal data ✅ 07-timetrack
- Sensitive-response caching — use appropriate private or `no-store` cache controls when credentials or
  private responses must not remain in browser or shared caches

## Secrets and transport

- Secrets vs ordinary configuration — keep passwords, signing keys, and API credentials out of source
  code, committed configuration, frontend bundles, container images, and test fixtures ✅ 07-timetrack
- Exposed-secret response — a credential that reached shared history or any published artifact is
  compromised for every copy already taken, so the response is rotating the value and everything
  derived from it, while deleting or rewriting the source only limits further exposure
- Frontend secrecy impossibility — any value shipped in an Angular bundle is visible to the user, so
  embedded API keys are not secrets
- Secret injection — environment variables or a secret store separate credentials from source code,
  but logs, diagnostics, process inspection, and overly broad access can still expose them ✅ 07-timetrack
- TLS as a precondition — HTTPS protects credentials and data in transit; JWT signing, hashing,
  validation, and authorisation solve different problems and do not replace it

## Hardening and security headers

- Development vs production hardening — default credentials, debug modes, verbose errors, test data,
  and permissive development settings must not reach production ✅ 07-timetrack
- Protection-disablement review — disabling CSRF, authentication, frame protection, or other secure
  defaults requires an explicit threat-model reason rather than a convenient fix ✅ 07-timetrack
- Administrative endpoint exposure — management, documentation, debug, metrics, and dump endpoints
  expand the attack surface and require deliberate exposure and access control
- Security-header recognition — understand the protection signalled by CSP, `frame-ancestors`,
  `X-Content-Type-Options: nosniff`, Referrer-Policy, and HSTS, and notice unsafe absence or values

## Dependency and supply-chain hygiene

- Supported dependency baseline — keep frameworks, libraries, plugins, and base images on supported
  versions rather than accumulating known unpatched risk
- Lockfiles and dependency provenance — preserve reviewed dependency resolution and investigate
  unexpected package, plugin, repository, or lockfile changes
- Vulnerability-alert handling — check whether the project uses an affected version, avoid blind
  suppression or upgrading, and escalate when deeper reachability or risk analysis is required

## Security testing and code review

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
