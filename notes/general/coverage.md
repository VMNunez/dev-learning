# Minimum Coverage — General

Cross-cutting concepts that appear in interviews regardless of stack.

## HTTP
- [ ] HTTP methods: GET, POST, PUT, PATCH, DELETE — what each is for
- [ ] Status codes: 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error) — the common ones
- [ ] Headers: `Content-Type`, `Authorization`, `Accept` — what they do
- [ ] Request vs response structure — what each part contains
- [ ] HTTPS vs HTTP — what TLS adds

## JSON
- [ ] JSON structure: objects, arrays, strings, numbers, booleans, null
- [ ] `JSON.parse` and `JSON.stringify` — when each is used
- [ ] Why JSON is the standard for REST APIs

## Environment variables
- [ ] What they are and why they exist — separating config from code
- [ ] How they are used in Angular (`environment.ts`) and Spring Boot (`application.properties`)
- [ ] Why secrets must never be committed to git

## Error handling patterns
- [ ] Try/catch at the boundary — where to catch, where not to
- [ ] Fail fast vs defensive programming — the difference and when each applies
- [ ] Error propagation — why you throw upward and handle once at the top

## Code principles
- [ ] DRY — Don't Repeat Yourself: the rule and when it is misapplied
- [ ] KISS — Keep It Simple: complexity is a cost, not a sign of skill
- [ ] YAGNI — You Aren't Gonna Need It: do not build for hypothetical futures

## Testing concepts
- [ ] Unit test vs integration test vs end-to-end test — what each tests and what it costs
- [ ] What a mock is and why tests use them
- [ ] Test coverage — what it measures and what it does not guarantee
- [ ] TDD — what it is conceptually, even if not practised daily

## Base64
- [ ] What Base64 is — encoding binary data as ASCII text (not encryption, not compression)
- [ ] When it appears: `Authorization: Basic <base64>` headers, image data URIs, JWT payload encoding
- [ ] `btoa()` / `atob()` in JavaScript — encoding and decoding in the browser

## Browser storage
- [ ] `localStorage` — persists after the tab closes; string key-value pairs; no expiry
- [ ] `sessionStorage` — cleared when the tab closes
- [ ] Cookies — sent with every HTTP request automatically; can be `HttpOnly` (not accessible to JS)
- [ ] When to use each — localStorage for JWT tokens in SPAs; HttpOnly cookies for more secure token storage
- [ ] The security tradeoff: localStorage is vulnerable to XSS; HttpOnly cookies are vulnerable to CSRF

## SOLID (brief — enough for an interview)
- [ ] Single Responsibility
- [ ] Open/Closed
- [ ] Liskov Substitution
- [ ] Interface Segregation
- [ ] Dependency Inversion
