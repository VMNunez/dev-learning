# Project 04 — Meal Finder · Improvement backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — the signal/`computed()`/`effect()` cleanup work is solid and every async page has loading and error states, but the app quietly diverges from its own PLANNING.md (no dumb components).

---

## Tasks

### High

*No open High tasks.*

### Medium

*No open Medium tasks.*

### Low

- [ ] **[Low]** `[frontend]` — Encode the search term before it reaches the URL: `meal.service.ts` interpolates `name` straight into `search.php?s=${name}`, so a term containing `&`, `#`, `+` or a space is parsed as query syntax and the request silently searches for the wrong thing (`beef & rice` searches for `beef `). Wrap it in `encodeURIComponent()`, or build the query with `HttpParams`. *(Effort: Small)* *(raised 2026-09-01 while closing the service-boundary error-handling task — same file, seen while rewriting the two request URLs)*
- [ ] **[Low]** `[frontend]` — Tokenize the remaining raw hex: `#fff`, `#ccc` and `#ffd700` appear across the page and component stylesheets (e.g. `search-page.css`, `meal-card.css`, `category-filter.css`) while every other colour comes from a `var(--token)` defined in `styles.css`. Add `--on-primary` / `--favourite` / `--favourite-inactive` tokens. *(Effort: Small)*

- [ ] **[Low]** `[frontend]` — Fix or delete the scaffold spec: `app.spec.ts:21` still asserts an `h1` containing `Hello, 04-meal-finder`, a signal the root component no longer has. It was already failing before the nav work (the root template never had that heading), and it is the last file referencing the deleted `title`. *(Effort: Small)* *(raised 2026-09-01 by the cold review of the shared-nav task)*
- [ ] **[Low]** `[frontend]` — Make "Back" go somewhere inside the app: `meal-detail-page.ts:71` calls `Location.back()`, which replays browser history, so a detail URL opened directly (shared link, refresh, new tab) sends the user out of the site instead of to the search page. Fall back to a `routerLink`/`router.navigate(['/'])` when there is no in-app history. *(Effort: Small)* *(raised 2026-09-01 while triaging the fake back-link task)*
- [ ] **[Low]** `[frontend]` — Fix the `How to run` path in `README.md`: it still says `cd dev-learning/angular/04-meal-finder`, a path the repository reorg removed when `angular/` became `projects/`, so the clone-and-run instructions a recruiter follows fail at the second command. *(Effort: Small)* *(raised 2026-08-31 while triaging the same defect in project 02)*

---

## Closed

### Frontend

#### High

- 2026-09-01 · **[High]** `[frontend]` — `FavouriteService` split out of `MealService`, favourites signal exposed `asReadonly()` → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[High]** `[frontend]` — detail page driven by `toSignal(paramMap)` + `effect()` with cleanup → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[High]** `[frontend]` — `MealResponse.meals` typed `Meal[] | null`, normalised at both subscribers → README, coverage typescript/junior

#### Medium

- 2026-09-01 · **[Medium]** `[frontend]` — `MealService` translates every transport failure once with `catchError` and rethrows a domain `Error` → README, PLANNING, coverage angular/junior + typescript/junior
- 2026-09-01 · **[Medium]** `[frontend]` — detail page models four remote states, `200 {"meals": null}` split from a transport error → README, PLANNING
- 2026-09-01 · **[Medium]** `[frontend]` — favourite membership derived once as a `computed()` `Set` in `FavouriteService` → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[Medium]** `[frontend]` — detail page's back control rendered as a real `<button>`, user-agent styles reset → README, PLANNING, coverage css/junior, `_cross-topic-inbox.md` (html)
- 2026-09-01 · **[Medium]** `[frontend]` — meal card root rendered as `<a [routerLink]>`, favourite button moved out of the link → README, PLANNING, coverage css/junior + css/middle, `_cross-topic-inbox.md` (html)
- 2026-09-01 · **[Medium]** `[frontend]` — both favourite toggles named by a state-aware `aria-label` derived with `computed()` → README, coverage angular/junior, `_cross-topic-inbox.md` (html)
- 2026-09-01 · **[Medium]** `[frontend]` — search input named by a visually hidden `<label for>` instead of its placeholder → README, coverage css/junior, `_cross-topic-inbox.md` (html)
- 2026-09-01 · **[Medium]** `[frontend]` — favourites category filter has no dead end — DECISION, no code change → the "All" guard and the `selectedCategory` reset in `toggleFavourite` both predate the 2026-07-14 review (3b786bdd)
- 2026-09-01 · **[Medium]** `[frontend]` — `meal-card` and `category-filter` extracted as presentational children reused by two pages → README, PLANNING, coverage architecture/junior
- 2026-09-01 · **[Medium]** `[frontend]` — search term moved to the URL as `?q=`, results re-derived on load → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[Medium]** `[frontend]` — nav and live favourites count moved into the root component, outside the outlet → README, coverage angular/junior
- 2026-09-01 · **[Medium]** `[frontend]` — empty-search guard moved into `onSearchMeals()`, covering the Enter path → README, PLANNING

#### Low

- 2026-09-01 · **[Low]** `[frontend]` — both meal images marked decorative with `alt=""` (task asked for the name; adjacent text already carries it) → README
- 2026-09-01 · **[Low]** `[frontend]` — search page regains its `h1`, shared `.page-title` rule hoisted to the global stylesheet → README, `_cross-topic-inbox.md` (html)
- 2026-09-01 · **[Low]** `[frontend]` — nav marks the current route with `routerLinkActive` + `ariaCurrentWhenActive`, root link exact → README, PLANNING, coverage angular/junior (2 bullets authored)
- 2026-09-01 · **[Low]** `[frontend]` — category filter states the selected category with `[class.active]` + `aria-pressed` → README, PLANNING, `_cross-topic-inbox.md` (html)
- 2026-09-01 · **[Low]** `[frontend]` — all four routes lazy-loaded with `loadComponent()`, initial bundle 253 → 238 kB → README, PLANNING; coverage already marked 06-hr-portal
- 2026-09-01 · **[Low]** `[frontend]` — `**` wildcard route renders a not-found page instead of a blank outlet → README, PLANNING; coverage already marked 06-hr-portal
- 2026-09-01 · **[Low]** `[frontend]` — nullable route id narrowed by an early return instead of `as string` — DECISION, no code change → fixed by `73a4129b`; README, coverage typescript/junior
- 2026-09-01 · **[Low]** `[frontend]` — scaffold `title` signal removed from the root component — DECISION, no code change → fixed by `157c2366`; no concept to record
- 2026-09-01 · **[Low]** `[frontend]` — `hasLoad` renamed `loadFinished`, the name now asserts that the attempt is over → README

### Backend

*No backend tasks — Angular-only project.*

---

## Learning objectives

Scored against the "Key patterns introduced" table in `PLANNING.md`.

**Tally: 15 ✅ Demonstrated · 0 ⚠️ Shallow · 2 ❌ Missing**

| Concept | Status | Note |
|---|---|---|
| Route parameters (`path: 'detail/:id'`) | ✅ | `app.routes.ts:12` |
| `toSignal(ActivatedRoute.paramMap)` | ✅ | `meal-detail-page.ts:24-26` |
| `effect()` | ✅ | The localStorage sync (`favourite.service.ts:14`) and the planned route-param effect driving the detail-page API call, with an `onCleanup` cancelling the in-flight request |
| `localStorage + effect()` | ✅ | `favourite.service.ts:8,15-19` |
| `Array.some()` | ❌ | No longer in the project — the three membership scans were replaced by `FavouriteService.favouriteIds`, a `computed()` `Set` queried with `has(id)` |
| `[...new Set()]` | ✅ | `favourites-page.ts:34` |
| Optional chaining `?.` | ✅ | `meal-detail-page.html:27` |
| `(input)` event | ✅ | `search-page.html:15` |
| `[disabled]` binding | ✅ | `search-page.html:23` |
| `hasSearched` signal | ✅ | `search-page.ts:17` |
| `(keyup.enter)` | ✅ | `search-page.html:16` |
| `@else if` | ✅ | `search-page.html:34`, `meal-detail-page.html:34` |
| `takeUntilDestroyed` + `DestroyRef` | ❌ | No longer in the project — the detail page always used `effect()` + `onCleanup`, and the search page moved to the same mechanism when its term went to the URL |
| `computed()` for nav counts | ✅ | `app.ts:14` — derived in the root component from the `FavouriteService` signal, so the badge is live on every route |
| `overflow: hidden` on cards | ✅ | `search-page.css:105` |
| `position: absolute` + `top/right` overlay | ✅ | `search-page.css:135-137` |
| `transition` on base element | ✅ | `search-page.css:107-109` |

Tests are out of scope for this project — testing enters the roadmap at project 07.
