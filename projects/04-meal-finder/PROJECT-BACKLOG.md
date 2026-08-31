# Project 04 — Meal Finder · Improvement backlog

**Last Reviewed — backend:** n/a — Angular-only
**Last Reviewed — frontend:** 2026-07-14

**Overall quality:** Good — the signal/`computed()`/`takeUntilDestroyed` work is solid and every async page has loading and error states, but the app quietly diverges from its own PLANNING.md (no `FavouriteService`, no `effect()` in the detail page, no shared nav, no dumb components) and one normal search path can crash the results list.

---

## Tasks

### High

- [ ] **[High]** `[frontend]` — Fix the no-results crash: `MealResponse.meals` is typed `Meal[]`, but MealDB returns `{"meals": null}` when nothing matches, and `search-page.ts:35` sets that `null` straight into `meals = signal<Meal[]>([])`, so `@for (meal of meals())` iterates `null`. Trigger: search for `zzzz`. Type the field `meals: Meal[] | null` and coalesce to `[]` in the subscriber so the `@empty` block renders instead. *(Effort: Small)*
- [ ] **[High]** `[frontend]` — Rebuild the detail page on the planned `effect()` pattern: `meal-detail-page.ts:27-30` uses `ngOnInit` + `activatedRoute.snapshot.paramMap.get('id')`, a one-shot read. PLANNING ("State management", Step 6) specifies an `effect()` driven by the route param — the project's headline learning objective. Angular reuses the component instance when only `:id` changes, so a navigation between two detail URLs leaves the previous meal on screen. Convert the param to a signal (`toSignal(activatedRoute.paramMap)`) and load inside an `effect()`. *(Effort: Medium)*
- [ ] **[High]** `[frontend]` — Extract a `FavouriteService` (signal + `effect()` localStorage sync + `addFavourite`/`deleteFavourite`) out of `MealService`, leaving `MealService` with only `searchMeals`/`getMealById`. PLANNING lists the two services separately; today one service owns both HTTP and persistence, which breaks single responsibility — the first thing an interviewer probes when they see it. *(Effort: Medium)*

### Medium

- [ ] **[Medium]** `[frontend]` — Guard the Enter key with the same rule as the button: `search-page.html:16` calls `onSearchMeals(meal.value)` on `(keyup.enter)`, bypassing the `[disabled]="!searchTerm().trim()"` guard, so pressing Enter on an empty input fires a real API call and flips `hasSearched` to true. Move the `trim()` check inside `onSearchMeals`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Build the shared nav in the root component: `app.html` is only `<router-outlet />`, so each page hand-rolls its own header and the favourites `computed()` count exists on the search page alone (`search-page.ts:23`). PLANNING describes the root as "root with nav and RouterOutlet" with a live count. Move the nav (links + count badge) into `app.html`. *(Effort: Medium)*
- [ ] **[Medium]** `[frontend]` — Extract the planned dumb components `meal-card` and `category-filter`: the card markup is duplicated between `search-page.html` and `favourites-page.html`, and neither page decomposes. PLANNING specifies both as presentational children that receive input and emit events — the smart/dumb split is the pattern to show off here. *(Effort: Medium)*
- [ ] **[Medium]** `[frontend]` — Fix the dead-end category filter on the favourites page: the "All" button only renders `@if (favourites().length > 0)` while the grid is driven by `filteredFavourites()`, so removing the last favourite of the selected category leaves the user on an empty grid. Gate the reset/button on `filteredFavourites().length`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Give the search input a real label: `search-page.html:14` has only a `placeholder`, which screen readers do not announce and which vanishes on focus. Add a `<label for="meal">` (visually hidden if needed) or an `aria-label`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Add accessible names to every icon-only button: the `★`/`☆` favourite toggles (`search-page.html:43`, `meal-detail-page.html:9`) and the `×` remove button (`favourites-page.html:20`) announce as just "button". Bind an `aria-label` that reflects the current state. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Make the meal cards keyboard-reachable: they are `<div class="meal-card" [routerLink]="...">` (`search-page.html:40`, `favourites-page.html`), and `routerLink` on a `div` is not focusable or activatable by keyboard. Render them as `<a [routerLink]>`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Replace the detail page's fake link: `meal-detail-page.html:2` is an `<a (click)="goBack()">` with no `href`, so it is not focusable and is not announced as interactive. Use a `<button>`. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Unify how "is this a favourite?" is derived: `meal-detail-page.ts:24` uses a `computed()`, while `search-page.ts:48` and `favourites-page.ts:17` re-scan the array in a plain method on every call. The convention the majority of the derived state follows is `computed()` — make all three match. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Unify the error state: `search-page` sets an explicit `hasError` signal, while `meal-detail-page` infers failure structurally from `hasLoad() && !mealDetails()` (`meal-detail-page.html:34`). Give the detail page the same explicit `hasError` signal every other async page uses. *(Effort: Small)*
- [ ] **[Medium]** `[frontend]` — Handle HTTP failures once at the service boundary: `meal.service.ts:19-27` returns the raw `HttpClient.get()` observable with no `catchError`, so every page reinvents transport-error handling. Map failures to a consistent shape in the service. *(Effort: Small)*

### Low

- [ ] **[Low]** `[frontend]` — Tokenize the remaining raw hex: `#fff`, `#ccc` and `#ffd700` appear in all three page stylesheets (e.g. `search-page.css:55,118,143`) while every other colour comes from a `var(--token)` defined in `styles.css`. Add `--on-primary` / `--favourite` / `--favourite-inactive` tokens. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Add `[alt]="meal.strMeal"` to the meal images (`search-page.html:55` and the favourites card) — they currently have no `alt` at all. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Drop the `as string` casts in `meal-detail-page.ts:29,53` and narrow the nullable `mealId` with a real guard (`if (!this.mealId) return;`); the casts throw away exactly the null-safety the type provides. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Rename `hasLoad` (`meal-detail-page.ts:23`) to `loadFinished` — it means "the attempt is over", including on error, which the current name does not convey. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Add a wildcard route (`path: '**'`) in `app.routes.ts`; an unknown URL currently renders a blank outlet. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Remove the unused `title` signal in `app.ts:11`, left over from the CLI scaffold. *(Effort: Small)*
- [ ] **[Low]** `[frontend]` — Convert the three routes to `loadComponent()` lazy loading in `app.routes.ts`; the app is small, but reviewers look for the pattern. *(Effort: Small)*

- [ ] **[Low]** `[frontend]` — Fix the `How to run` path in `README.md`: it still says `cd dev-learning/angular/04-meal-finder`, a path the repository reorg removed when `angular/` became `projects/`, so the clone-and-run instructions a recruiter follows fail at the second command. *(Effort: Small)* *(raised 2026-08-31 while triaging the same defect in project 02)*

---

## Learning objectives

Scored against the "Key patterns introduced" table in `PLANNING.md`.

**Tally: 16 ✅ Demonstrated · 1 ⚠️ Shallow · 0 ❌ Missing**

| Concept | Status | Note |
|---|---|---|
| Route parameters (`path: 'detail/:id'`) | ✅ | `app.routes.ts:12` |
| `ActivatedRoute.snapshot.paramMap.get()` | ✅ | `meal-detail-page.ts:28` |
| `effect()` | ⚠️ Shallow | Only the localStorage sync (`meal.service.ts:14`); the planned `effect()` driving the detail-page API call was never built |
| `localStorage + effect()` | ✅ | `meal.service.ts:11,14-16` |
| `Array.some()` | ✅ | `search-page.ts:49`, `favourites-page.ts:18`, `meal-detail-page.ts:24` |
| `[...new Set()]` | ✅ | `favourites-page.ts:34` |
| Optional chaining `?.` | ✅ | `meal-detail-page.html:27` |
| `(input)` event | ✅ | `search-page.html:15` |
| `[disabled]` binding | ✅ | `search-page.html:23` |
| `hasSearched` signal | ✅ | `search-page.ts:17` |
| `(keyup.enter)` | ✅ | `search-page.html:16` |
| `@else if` | ✅ | `search-page.html:34`, `meal-detail-page.html:34` |
| `takeUntilDestroyed` + `DestroyRef` | ✅ | `search-page.ts:15,32`, `meal-detail-page.ts:17,36` |
| `computed()` for nav counts | ✅ | `search-page.ts:23-25` (but only on the search page — see the shared-nav task) |
| `overflow: hidden` on cards | ✅ | `search-page.css:105` |
| `position: absolute` + `top/right` overlay | ✅ | `search-page.css:135-137` |
| `transition` on base element | ✅ | `search-page.css:107-109` |

Tests are out of scope for this project — testing enters the roadmap at project 07.
