# Middle Coverage — Security

Concepts expected when a developer owns authentication integration and operational defences rather than only consuming a JWT-protected API.

## Identity and token lifecycle

- OAuth 2.0 roles and flows — distinguish client, resource owner, authorization server, and resource server in an appropriate authorization flow
- OpenID Connect — add identity claims and an ID token to OAuth without confusing authentication with API authorization
- Access-token and refresh-token rotation — limit access-token lifetime and detect refresh-token reuse
- Token revocation — invalidate credentials before natural expiry using stateful revocation or short-lived-token strategies

## Application and transport hardening

- Rate limiting and brute-force defence — bound abusive traffic by identity and endpoint while preserving legitimate retries
- Security headers — configure CSP, framing, content-type, referrer, and HSTS policies according to the deployed application
- TLS termination and certificate lifecycle — understand where HTTPS terminates, how certificates renew, and which hop remains protected
- Secrets rotation — replace credentials without source changes or avoidable downtime
