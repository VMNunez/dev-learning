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

- [ ] `[frontend]` Remove the leftover CLI scaffold in the root component: the empty `app.css` (with its unused
      `styleUrl`) and the `title` signal in `app.ts`, which is never read in `app.html`. — *effort: 5 min*

- [ ] `[frontend]` The forecast icon `<img>` in `weather-forecast.html:10` has no `alt` attribute, so a screen
      reader announces the raw icon file name instead of the weather; the sibling icon in `weather-card.html:5`
      already sets one. — *effort: 5 min*
      *(raised 2026-08-30 while triaging the hover-effect task)*

- [ ] `[frontend]` The How to run section still says `cd dev-learning/angular/02-weather-app`, a path the
      repository reorg removed when `angular/` became `projects/` — so the clone-and-run instructions a
      recruiter follows fail at the second command. — *effort: 5 min*
      *(raised 2026-08-30 while triaging the README Tradeoffs task)*

- [ ] `[frontend]` `npm test` bundles the five `.spec.ts` files but executes **zero** tests — Vitest reports
      `Test Files 0 passed (5)` / `Tests 0 passed (0)` and no failure — so the command gives no signal at all:
      the false `should render title` assertion removed today had never once run. The `test` target in
      `angular.json:71` is a bare `@angular/build:unit-test` builder with no `options`. Tests are out of scope
      for this project, but a test command that silently runs nothing is not: the same scaffold ships in
      projects 01 and 03–06, and project 08 is where component testing starts. — *effort: 30 min*
      *(raised 2026-08-30 while triaging the CLI-scaffold task)*

- [ ] `[frontend]` PLANNING's `Key patterns introduced` table still says environment files `Store the API key
      safely` — the exact claim commit `05fac184` removed from the README on 2026-08-30, so the plan now
      asserts what the README was corrected for. — *effort: 5 min*
      *(raised 2026-08-30 while closing the CLI-scaffold task)*

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
