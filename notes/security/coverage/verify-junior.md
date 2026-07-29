# Coverage Verify — Security Junior

Verdict: gaps
Coverage SHA-256: 1cd18117e32f543409ef64570305f889dd67bfa57f99115a44db4fe3bdfbcd19
Verified: 2026-07-29

## Open gaps

- Dangerous browser sinks and safe rendering — prefer framework text binding and safe DOM APIs, and treat `innerHTML`, script-capable URL contexts, direct DOM writes, eval-like execution, and trust-bypass APIs as review hotspots requiring contextual sanitisation [XSS and output safety]
- Hostile-input security tests — exercise injection metacharacters, traversal sequences, oversized payloads, disallowed fields, and unsafe output contexts at trust boundaries instead of testing validation only with ordinary invalid values [Security testing and code review]
