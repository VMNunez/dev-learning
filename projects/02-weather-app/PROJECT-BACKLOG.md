# Project Backlog — 02 Weather App

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — the signals + `forkJoin` + `takeUntilDestroyed` core is clean and the
component/service split is correct; the gaps are all in input handling at the search box.

---

## High

*No open High tasks.*

## Medium

- [ ] `[frontend]` Add the `transition` + `transform: scale()` hover effect from PLANNING.md's key-patterns table —
      it is the one planned concept with no trace in the code (no `transition` or `scale` anywhere in the CSS).
      — *effort: 15 min*
- [ ] `[frontend]` The README Tradeoffs section claims "Single component over split components", but the project
      ships four (`weather-page` plus `weather-form`, `weather-card`, `weather-forecast`) and PLANNING's "Pages and
      components" section plans exactly that split — so the bullet documents a decision the project never took, on
      the file a recruiter reads first. Replace it with a tradeoff the project did make. — *effort: 10 min*
      *(raised 2026-08-29 while closing the search-input tasks)*

## Low

- [ ] `[frontend]` Remove the leftover CLI scaffold in the root component: the empty `app.css` (with its unused
      `styleUrl`) and the `title` signal in `app.ts`, which is never read in `app.html`. — *effort: 5 min*

---

## Closed

### Frontend

#### High

- 2026-08-29 · **[High]** `[frontend]` — the emitted city is trimmed before it crosses the `output()` boundary → README Architecture decisions, coverage architecture/junior

#### Medium

- 2026-08-30 · **[Medium]** `[frontend]` — the city name is URL-encoded by `HttpParams` instead of raw interpolation → README Architecture decisions, coverage angular + security/junior
- 2026-08-29 · **[Medium]** `[frontend]` — Enter and the button click reach one `submit()` handler → README What I learned, coverage architecture/junior
- 2026-08-29 · **[Medium]** `[frontend]` — an empty or whitespace-only search is rejected before any request → README Architecture decisions, coverage architecture/junior

#### Low

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
| `transition` + `transform: scale()` | ❌ Missing | not present anywhere in the CSS |

**Tally:** 8 ✅ · 0 ⚠️ · 1 ❌

Tests are out of scope for this project — testing enters the roadmap at project 07.
