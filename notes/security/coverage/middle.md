# Middle Coverage — Security

Concepts expected when a developer owns authentication integration and operational defences rather than only consuming a JWT-protected API.

## Identity and token lifecycle

- OAuth 2.0 roles and flows — distinguish client, resource owner, authorization server, and resource server in an appropriate authorization flow
- OpenID Connect — add identity claims and an ID token to OAuth without confusing authentication with API authorization
- Refresh-token rotation and reuse detection — operate the refresh-token family lifecycle and respond
  when an already rotated credential is presented again
- Token-revocation strategy — design and operate early invalidation using stateful revocation,
  credential versioning, or deliberately short-lived access tokens

## Application and transport hardening

- Distributed rate-limit policy — design limits across instances and identities, choose storage and
  failure behaviour, and balance abusive traffic against legitimate retries
- Security-header policy — design and operate CSP, framing, content-type, referrer, and HSTS policies
  for the application's deployed content and integrations
- TLS termination and certificate lifecycle — understand where HTTPS terminates, how certificates renew, and which hop remains protected
- Secrets rotation — replace credentials without source changes or avoidable downtime
- Segregation of duties — design independent approval and sign-off controls so privileged workflows
  cannot be completed by the same actor ✅ 07-timetrack — `approve`/`reject` refuse a manager whose id matches the entry's owner
- Vulnerability reachability and risk acceptance — analyse affected components, configuration, and
  reachable code paths, then document remediation priority or a justified acceptance decision
