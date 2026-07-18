# Security — future learning

Topics to study after the junior role is secured.

---

## OAuth2 / OpenID Connect

Authentication via third-party providers (Google, GitHub, Azure AD). The standard for enterprise SSO (Single Sign-On). Spring Security has full OAuth2 support. Common in large companies but not expected at junior level.

---

## HTTPS / SSL / TLS — the operational half

**The concept is now in `coverage.md`** (promoted 2026-07-18): why HTTPS is non-optional for token auth, and what TLS actually protects (confidentiality and integrity in transit only). The boundary: *explaining* what TLS does for a bearer token is junior scope; everything below is not.

Still post-junior — the mechanics and the operations: public/private key pairs, certificates, and the TLS handshake in detail; configuring certificates in production (Let's Encrypt, Nginx termination, reverse proxies), which is a DevOps concern.

---

## JWT — advanced topics

Access tokens and refresh tokens are part of the current junior goal — see `coverage.md`. The advanced topics below go further:

- Token revocation — how to invalidate a JWT before it expires (token blacklist, short expiry + rotation strategy)
- JWE (JSON Web Encryption) — encrypted JWT payload, used when the payload must not be readable by the client

---

## Rate limiting and brute force protection — the implementation

**The concept is now in `coverage.md`** (promoted 2026-07-18): brute force and credential stuffing, rate limiting as the answer, and account lockout's denial-of-service trade-off. The boundary: *naming* the defence and its cost is junior scope; *building* one is not.

Still post-junior: implementing the throttle — token-bucket algorithms, `bucket4j` in Spring, or enforcing limits at the API gateway; distributed rate limiting across instances with shared state.

---

## Security headers — authoring and tuning

**Awareness is now in `coverage.md`** (promoted 2026-07-18): `Content-Security-Policy`, `X-Frame-Options`, and `X-Content-Type-Options` each have an item naming the attack they prevent. The boundary: *knowing what each header stops*, and that Spring Security sets some by default, is junior scope; *writing the policy* is not.

Still post-junior: authoring a real CSP (source lists, nonces, hashes, `report-uri`, and the long tail of breaking your own app with it); `Strict-Transport-Security` and preload lists; subresource integrity; tuning the full header set per environment.

---

## Penetration testing basics

How to think about attacking your own app — finding vulnerabilities before attackers do. Tools: OWASP ZAP, Burp Suite. Relevant after mid-level experience.

---

## JWT attack surface

Attacks against the token format itself, as opposed to how you use it: the `alg: none` attack, and algorithm confusion (tricking a server into verifying an RS256 token as HMAC using the public key as the secret). A junior is expected to know the signature must be verified, not to know the ways a library can be tricked into skipping it.

---

## Key management infrastructure

`RS256` key pairs in operation: JWKS endpoints, `kid`-based multi-key rotation, and rotating a signing key without logging every user out. The junior floor stops at HS256 vs RS256 as a design choice (owned by Spring Boot coverage) and at what a leaked secret means.

---

## Secret managers

HashiCorp Vault, AWS Secrets Manager, Azure Key Vault — injecting secrets at runtime instead of through environment variables. Naming the category is junior scope; operating one is not.

---

## Advanced authorisation models

ACL (per-object permissions), ABAC (attribute-based), and policy engines like OPA; Spring Security's `PermissionEvaluator`, `hasPermission`, and `RoleHierarchy`. Relevant when role-based access control stops scaling — which is exactly the point the coverage item on roles vs granular permissions ends at.

---

## Server-side attack classes not reachable from a junior stack

SSRF, insecure deserialisation and gadget chains, XXE, HTTP request smuggling, and cache poisoning. Real and serious, but they belong to a threat surface a junior on an Angular + Spring Boot CRUD app is not filtered on.

---

## Formal threat modelling and security tooling in the pipeline

STRIDE, DREAD, and attack trees as deliverables; SAST/DAST integrated into CI. The *mindset* (blast radius, trust boundaries) is now in coverage; the formal methodology and tooling are not.

---

## Data protection at rest

Encryption at rest, column-level database encryption, and the PII/GDPR handling controls a Spanish client will eventually require (data minimisation, retention, right to erasure). Post-hire, and usually dictated by the client's own compliance team.

---

## Audit logging

Tamper-evident logs, `AuditorAware` in Spring Data, and answering "who changed this row and when" as a security requirement rather than a debugging convenience.
