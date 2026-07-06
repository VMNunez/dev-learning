# Browser storage

Docs: [MDN — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) · [MDN — sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) · [MDN — Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---

The browser has three ways to store data on the client side. Each has different lifetime, scope, and security properties.

| | localStorage | sessionStorage | Cookies |
|-|---|---|---|
| Lifetime | Until explicitly cleared | Until the tab is closed | Set by the server (can be permanent or session) |
| Shared across tabs | Yes | No | Yes |
| Sent with every request | No | No | Yes (automatically) |
| Accessible from JavaScript | Yes | Yes | Only if not HttpOnly |
| Capacity | ~5 MB | ~5 MB | ~4 KB |
| Main use | Persistent client data | Temporary per-tab data | Session auth, server-set preferences |

---

## localStorage

Data persists even after the browser is closed. Victor uses this in every Angular project from 03 onwards:

```typescript
// Save
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Read
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') ?? 'null');

// Delete
localStorage.removeItem('token');
localStorage.clear(); // removes everything
```

Values are always strings — use `JSON.stringify()` when saving objects and `JSON.parse()` when reading them back.

---

## sessionStorage

Same API as localStorage, but data is cleared when the tab is closed. Not shared between tabs — two tabs on the same app have completely separate sessionStorage.

Useful for temporary state you don't want to persist: a wizard form, a multi-step checkout, a draft that should not survive a browser restart.

---

## Cookies

The browser sends cookies automatically with every HTTP request to the matching domain. This makes them ideal for session-based authentication — the server sets a cookie with the session ID, and the browser attaches it to every request without any JavaScript code.

The most important cookie flags:

| Flag | What it does |
|------|-------------|
| `HttpOnly` | Cookie is not accessible from JavaScript — `document.cookie` cannot read it |
| `Secure` | Cookie is only sent over HTTPS |
| `SameSite=Strict` | Cookie is not sent on cross-site requests — prevents CSRF attacks |

---

## Where to store a JWT token

Victor's projects use `localStorage`. For a learning project this is fine and simple — but in production apps, there is a debate:

**localStorage** — easy to use, but JavaScript can read it. If your app has an XSS vulnerability (a script injected into your page), the attacker can steal the token with `localStorage.getItem('token')`.

**HttpOnly cookie** — JavaScript cannot read it at all. Even if there is an XSS attack, the token is safe. The browser attaches the cookie automatically to every request. This is the approach used in production apps at large companies.

The tradeoff: cookies require CORS configuration for the `credentials` flag (`withCredentials: true` in Angular) and CSRF protection. For a learning project or a public API consumed by many clients, JWT in localStorage is the simpler choice.

> For interviews: say "I used localStorage for simplicity in this project, but in production I would use an HttpOnly cookie to protect against XSS token theft." This shows you know the tradeoff.
