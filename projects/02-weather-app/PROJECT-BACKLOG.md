# Project Backlog — 02 Weather App

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — the signals + `forkJoin` + `takeUntilDestroyed` core is clean and the
component/service split is correct; the gaps are all in input handling at the search box.

---

## High

*No open High tasks.*

## Medium

*No open Medium tasks.*

## Low

*No open Low tasks.*

---

## Closed

### Frontend

#### High

- 2026-08-29 · **[High]** `[frontend]` — the emitted city is trimmed before it crosses the `output()` boundary → README Architecture decisions, coverage architecture/junior

#### Medium

- 2026-08-30 · **[Medium]** `[frontend]` — the false single-component tradeoff is replaced by the three the project took → README Tradeoffs + Architecture decisions; no coverage bullet — nothing new demonstrated
- 2026-08-30 · **[Medium]** `[frontend]` — the planned hover effect ships with a `prefers-reduced-motion` guard → README Architecture decisions, coverage css/junior
- 2026-08-30 · **[Medium]** `[frontend]` — the city name is URL-encoded by `HttpParams` instead of raw interpolation → README Architecture decisions, coverage angular + security/junior
- 2026-08-29 · **[Medium]** `[frontend]` — Enter and the button click reach one `submit()` handler → README What I learned, coverage architecture/junior
- 2026-08-29 · **[Medium]** `[frontend]` — an empty or whitespace-only search is rejected before any request → README Architecture decisions, coverage architecture/junior

#### Low

- 2026-08-31 · **[Low]** `[frontend]` — PLANNING's `Key patterns` cell no longer claims environment files store the key safely → PLANNING `Key patterns introduced`; no coverage write — bullet already ✅ 02-weather-app
- 2026-08-31 · **[Low]** `[frontend]` — `npm test` runs all five specs green, config untouched — DECISION, no code change → the bare `test` target is fully defaulted by the builder schema (`required: []`), so nothing was ever misconfigured; the audit's shell cut the 71s jsdom environment setup short and read an aborted run as a completed empty one
- 2026-08-31 · **[Low]** `[frontend]` — How to run path corrected to `projects/` and the two placeholder environment files documented → README How to run; no coverage mark — documentation only, no code written
- 2026-08-30 · **[Low]** `[frontend]` — both weather icons marked decorative with `alt=""`, not just the forecast one → README Architecture decisions; coverage proposal routed to `_cross-topic-inbox.md` — no registered topic owns neutral HTML accessibility
- 2026-08-30 · **[Low]** `[frontend]` — root component stripped of CLI scaffold: `app.css`, `styleUrl`, `title` signal, `app.spec.ts` → README What I learned; no coverage write — `styleUrl` bullet already ✅ 01-todo-list
- 2026-08-30 · **[Low]** `[frontend]` — the query string is built with `HttpParams`, not template-literal concatenation → same commit as the Medium above

### Backend

*No backend tier — Angular-only project.*

---

## Learning objectives

| Concept | Verdict | Where |
|---|---|---|
| `HttpClient` + typed `.get<T>()` | ✅ Demonstrated | `weather.service.ts:15,21` |
| `forkJoin` (parallel requests) | ✅ Demonstrated | `weather-page.ts:34` |
| `ngOnInit` | ✅ Demonstrated | `weather-page.ts:25` |
| `takeUntilDestroyed` + `DestroyRef` | ✅ Demonstrated | `weather-page.ts:18,38` |
| `number` pipe with format | ✅ Demonstrated | `weather-card.html:7,10` |
| `SlicePipe` | ✅ Demonstrated | `weather-forecast.html:7` |
| Environment files (API key) | ✅ Demonstrated | `weather.service.ts:3,13,19` |
| `@keyframes` + `animation` | ✅ Demonstrated | `weather-page.css:12,28` |
| `transition` + `transform: scale()` | ✅ Demonstrated | `weather-forecast.css:31,37` |

**Tally:** 9 ✅ · 0 ⚠️ · 0 ❌

Tests are out of scope for this project — testing enters the roadmap at project 07.
