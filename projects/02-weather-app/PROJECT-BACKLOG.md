# Project Backlog — 02 Weather App

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — the signals + `forkJoin` + `takeUntilDestroyed` core is clean and the
component/service split is correct; the gaps are all in input handling at the search box.

---

## High

- [ ] `[frontend]` Trim the city input before emitting it. `weather-form.html` emits `city.value` raw, so a
      leading/trailing space (`" Madrid"`) reaches the service as `q= Madrid`, OpenWeatherMap returns 404 and
      the app shows "City not found" for a perfectly valid city. Emit `city.value.trim()`. — *effort: 5 min*

## Medium

- [ ] `[frontend]` URL-encode the city name in `weather.service.ts` (lines 13, 19). The name is interpolated raw
      into `q=${city}`, so accents or special characters (`São Paulo`, `&`, `#`) build a malformed query string
      and surface as a false "not found". Fix it by building the query with `HttpParams` — which also resolves
      the Low task below. — *effort: 15 min*
- [ ] `[frontend]` Add the Enter-key handler to the search input. PLANNING.md step 5 asks for `(keyup.enter)` plus
      a button, but only the button click is wired. — *effort: 5 min*
- [ ] `[frontend]` Block empty / whitespace-only submissions in `weather-form`. Clicking Search on an empty field
      emits `''` and fires an API call that can only fail. Disable the button (or skip the emit) when
      `city.value.trim()` is empty. — *effort: 10 min*
- [ ] `[frontend]` Add the `transition` + `transform: scale()` hover effect from PLANNING.md's key-patterns table —
      it is the one planned concept with no trace in the code (no `transition` or `scale` anywhere in the CSS).
      — *effort: 15 min*

## Low

- [ ] `[frontend]` Build the query string with `HttpParams` in `weather.service.ts` instead of template-literal
      concatenation — the idiomatic Angular way, and it removes the manual-encoding bug class. — *effort: 15 min*
- [ ] `[frontend]` Remove the leftover CLI scaffold in the root component: the empty `app.css` (with its unused
      `styleUrl`) and the `title` signal in `app.ts`, which is never read in `app.html`. — *effort: 5 min*

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
