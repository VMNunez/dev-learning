# Security — future learning

Topics to study after the junior role is secured.

---

## OAuth2 / OpenID Connect

Authentication via third-party providers (Google, GitHub, Azure AD). The standard for enterprise SSO (Single Sign-On). Spring Security has full OAuth2 support. Common in large companies but not expected at junior level.

---

## HTTPS / SSL / TLS

How HTTPS works — public/private key pairs, certificates, the TLS handshake. Knowing conceptually what HTTPS does is enough for a junior. Configuring certificates in production (Let's Encrypt, Nginx termination, reverse proxies) is a DevOps concern.

---

## JWT — advanced topics

- Refresh tokens — short-lived access token + long-lived refresh token
- Token revocation — how to invalidate a JWT before it expires (token blacklist, short expiry)
- JWE (JSON Web Encryption) — encrypted JWT payload, used when the payload must not be readable

---

## Rate limiting and brute force protection

Limiting how many requests a client can make in a given time window. Prevents brute force attacks on login endpoints. Implemented at the API gateway level or with Spring's `bucket4j` library.

---

## Security headers

HTTP response headers that instruct the browser to apply additional protections:
- `Content-Security-Policy` — restricts which scripts, styles, and resources can load
- `X-Frame-Options` — prevents clickjacking by blocking iframe embedding
- `Strict-Transport-Security` — forces HTTPS

Spring Security adds some of these by default.

---

## Penetration testing basics

How to think about attacking your own app — finding vulnerabilities before attackers do. Tools: OWASP ZAP, Burp Suite. Relevant after mid-level experience.
