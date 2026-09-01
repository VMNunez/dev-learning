# Project 04 — Meal Finder · Improvement backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — the signal/`computed()`/`effect()` cleanup work is solid and every async page has loading and error states, but the app quietly diverges from its own PLANNING.md (no dumb components).

---

## Tasks

### High

*No open High tasks.*

### Medium

- [ ] **[Medium]** `[frontend]` — Re-check the dead-end category filter on the favourites page: the "All" button now renders `@if (categories().length > 0)` inside `category-filter`, and `favourites-page.ts:toggleFavourite` already resets `selectedCategory` when the filtered grid empties. Verify whether any dead end survives before changing anything. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Give the search input a real label: `search-page.html:14` has only a `placeholder`, which screen readers do not announce and which vanishes on focus. Add a `<label for="meal">` (visually hidden if needed) or an `aria-label`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Add accessible names to every icon-only button: the `★`/`☆` favourite toggle (`meal-card.html:4`, now shared by both pages) and the detail page's toggle (`meal-detail-page.html:9`) announce as just "button". Bind an `aria-label` that reflects the current state. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Make the meal cards keyboard-reachable: the card root is `<div class="meal-card" [routerLink]="...">` (`meal-card.html:1`), and `routerLink` on a `div` is not focusable or activatable by keyboard. Render it as `<a [routerLink]>`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Replace the detail page's fake link: `meal-detail-page.html:2` is an `<a (click)="goBack()">` with no `href`, so it is not focusable and is not announced as interactive. Use a `<button>`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Unify how "is this a favourite?" is derived: `meal-detail-page.ts:24` uses a `computed()`, while `search-page.ts:48` and `favourites-page.ts:17` re-scan the array in a plain method on every call. The convention the majority of the derived state follows is `computed()` — make all three match. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Unify the error state: `search-page` sets an explicit `hasError` signal, while `meal-detail-page` infers failure structurally from `hasLoad() && !mealDetails()` (`meal-detail-page.html:34`). Give the detail page the same explicit `hasError` signal every other async page uses. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Handle HTTP failures once at the service boundary: `meal.service.ts:19-27` returns the raw `HttpClient.get()` observable with no `catchError`, so every page reinvents transport-error handling. Map failures to a consistent shape in the service. *(Effort: Small)*

### Low

- [ ] **[Low]** `[frontend]` — Tokenize the remaining raw hex: `#fff`, `#ccc` and `#ffd700` appear across the page and component stylesheets (e.g. `search-page.css`, `meal-card.css`, `category-filter.css`) while every other colour comes from a `var(--token)` defined in `styles.css`. Add `--on-primary` / `--favourite` / `--favourite-inactive` tokens. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Add `[alt]="meal().strMeal"` to the meal image (`meal-card.html:12`) — it currently has no `alt` at all. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Drop the `as string` casts in `meal-detail-page.ts:29,53` and narrow the nullable `mealId` with a real guard (`if (!this.mealId) return;`); the casts throw away exactly the null-safety the type provides. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Rename `hasLoad` (`meal-detail-page.ts:23`) to `loadFinished` — it means "the attempt is over", including on error, which the current name does not convey. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Add a wildcard route (`path: '**'`) in `app.routes.ts`; an unknown URL currently renders a blank outlet. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Remove the unused `title` signal in `app.ts:11`, left over from the CLI scaffold. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Convert the three routes to `loadComponent()` lazy loading in `app.routes.ts`; the app is small, but reviewers look for the pattern. *(Effort: Small)*

- [ ] **[Low]** `[frontend]` — Give the category filter an active affordance: the buttons in `category-filter.html` never reflect the selected category — the component receives no `selected` input at all — and `category-filter.css` styles only `:hover`, so once a filter is applied nothing on screen says which one — the grid shrinks with no visible cause. Bind `[class.active]` (and `aria-pressed`) from the selected category, "All" included. *(Effort: Small)* *(raised 2026-09-01 while closing the URL-state task)*
- [ ] **[Low]** `[frontend]` — Give the nav an active-route affordance: `app.html:2-3` uses plain `routerLink`, so on `/favourites` nothing marks the current page and `app.css:29` styles only `:hover`. Add `routerLinkActive` plus `ariaCurrentWhenActive`. *(Effort: Small)* *(raised 2026-09-01 by the cold review of the shared-nav task)*
- [ ] **[Low]** `[frontend]` — Restore a heading on the search page: the old `<h1>Meal Finder</h1>` went with the page header, and the brand in the nav is an `<a>`, not a heading, so `/` now renders with zero `h1` while `/favourites` still has one (`favourites-page.html:2`). *(Effort: Small)* *(raised 2026-09-01 by the cold review of the shared-nav task)*
- [ ] **[Low]** `[frontend]` — Fix or delete the scaffold spec: `app.spec.ts:21` still asserts an `h1` containing `Hello, 04-meal-finder`, a signal the root component no longer has. It was already failing before the nav work (the root template never had that heading), and it is the last file referencing the deleted `title`. *(Effort: Small)* *(raised 2026-09-01 by the cold review of the shared-nav task)*
- [ ] **[Low]** `[frontend]` — Fix the `How to run` path in `README.md`: it still says `cd dev-learning/angular/04-meal-finder`, a path the repository reorg removed when `angular/` became `projects/`, so the clone-and-run instructions a recruiter follows fail at the second command. *(Effort: Small)* *(raised 2026-08-31 while triaging the same defect in project 02)*

---

## Closed

### Frontend

#### High

- 2026-09-01 · **[High]** `[frontend]` — `FavouriteService` split out of `MealService`, favourites signal exposed `asReadonly()` → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[High]** `[frontend]` — detail page driven by `toSignal(paramMap)` + `effect()` with cleanup → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[High]** `[frontend]` — `MealResponse.meals` typed `Meal[] | null`, normalised at both subscribers → README, coverage typescript/junior

#### Medium

- 2026-09-01 · **[Medium]** `[frontend]` — `meal-card` and `category-filter` extracted as presentational children reused by two pages → README, PLANNING, coverage architecture/junior
- 2026-09-01 · **[Medium]** `[frontend]` — search term moved to the URL as `?q=`, results re-derived on load → README, PLANNING, coverage angular/junior
- 2026-09-01 · **[Medium]** `[frontend]` — nav and live favourites count moved into the root component, outside the outlet → README, coverage angular/junior
- 2026-09-01 · **[Medium]** `[frontend]` — empty-search guard moved into `onSearchMeals()`, covering the Enter path → README, PLANNING

#### Low

*No low tasks closed yet.*

### Backend

*No backend tasks — Angular-only project.*

---

## Learning objectives

Scored against the "Key patterns introduced" table in `PLANNING.md`.

**Tally: 16 ✅ Demonstrated · 0 ⚠️ Shallow · 1 ❌ Missing**

| Concept | Status | Note |
|---|---|---|
| Route parameters (`path: 'detail/:id'`) | ✅ | `app.routes.ts:12` |
| `toSignal(ActivatedRoute.paramMap)` | ✅ | `meal-detail-page.ts:24-26` |
| `effect()` | ✅ | The localStorage sync (`favourite.service.ts:14`) and the planned route-param effect driving the detail-page API call, with an `onCleanup` cancelling the in-flight request |
| `localStorage + effect()` | ✅ | `favourite.service.ts:8,15-19` |
| `Array.some()` | ✅ | `search-page.ts:49`, `favourites-page.ts:18`, `meal-detail-page.ts:24` |
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
