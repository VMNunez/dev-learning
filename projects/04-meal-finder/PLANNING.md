# Project 04 — Meal Finder

An app that lets users search for meals, view details, and save favourites.
Uses the MealDB public API.

---

## Why this project

- **Learning objective:** Learn route parameters, `ActivatedRoute`, and `effect()` for side effects
- **Portfolio value:** Shows UX awareness and real app patterns — search, detail page, favourites

---

## Key features

- Search meals by name
- Filter favourites by category
- Click a meal to see the full recipe on a detail page
- Save and remove meals from favourites
- Favourites persist in localStorage
- Loading and error states on every async action

---

## Tech stack

- Angular (signals-based, no Angular Material)
- MealDB public API
- Angular Router with route parameters
- localStorage + `effect()` pattern
- CSS with card layout and overlay elements

---

## Pages and components

```
app/
├── app.component                 ← root with nav and RouterOutlet
├── components/
│   ├── meal-card/
│   │   └── meal-card.component           ← dumb, receives meal, emits favourite toggle
│   └── category-filter/
│       └── category-filter.component     ← dumb, receives categories, emits selection
├── pages/
│   ├── search-page/
│   │   └── search-page.component         ← smart, owns the search signals
│   ├── detail-page/
│   │   └── detail-page.component         ← smart, reads route param, calls API
│   └── favourites-page/
│       └── favourites-page.component     ← smart, reads favourites signal and owns the category filter
└── services/
    ├── meal.service.ts           ← HttpClient calls to MealDB
    └── favourite.service.ts     ← signal + localStorage sync
```

---

## State management

- `signal<Meal[]>` for search results and favourites
- `computed()` for filtered results and live nav counts
- `effect()` to sync favourites to localStorage
- `effect()` in detail page to trigger API call when route param changes
- `localStorage + effect()` pattern — init signal from localStorage on service creation
- `asReadonly()` on the favourites signal — `FavouriteService` keeps the writable handle private so its own methods are the only writers

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| Route parameters (`path: 'detail/:id'`) | Detail page URL |
| `toSignal(ActivatedRoute.paramMap)` | Read the meal id from the URL as a signal, not a one-shot snapshot |
| `toSignal(ActivatedRoute.queryParamMap)` + `router.navigate()` | Keep the search term in the URL as `?q=` so results survive navigation and `/` is linkable |
| `effect()` | Trigger API call when a signal changes |
| `effect()` cleanup callback | Cancel the in-flight request before the effect re-runs for a new route id |
| `localStorage + effect()` | Persist favourites automatically |
| A `computed()` `Set` in the service | Favourite membership is derived once and queried with `has(id)`; a template method call re-runs on every change detection, and a `computed()` takes no arguments, so the lookup structure is what gets derived |
| `[...new Set()]` | Extract unique category names from the results |
| `optional chaining ?.` | Safe access on nullable API response |
| `(input)` event | Track search text on every keystroke |
| `[disabled]` binding | Disable search button when input is empty — the guard itself lives in `onSearchMeals()`, so `(keyup.enter)` obeys the same rule |
| `hasSearched` signal | Show empty state only after a search, not on load |
| `(keyup.enter)` | Submit search by pressing Enter |
| `@else if` | Handle multiple template states |
| One failure translation at the service boundary | `MealService` maps each response to a domain type and pipes `catchError` → `throwError(new Error(...))`; the transport envelope and the logging stay in the service, so a page only ever handles one failure shape |
| Four remote states, not two | An unknown id answers `200 {"meals": null}`, so "not found" and "request failed" are separate branches; the failure is recorded by the callback that observes it, never inferred from the absence of data |
| `loadComponent()` on every route | Each routed page is imported lazily, so it leaves the initial bundle and arrives as its own chunk on first navigation |
| `**` wildcard route | An unmatched URL renders `NotFoundPage` rather than a blank outlet; it is declared last because route matching is first-wins |
| `computed()` for nav counts | Live favourite count in the nav bar |
| `input.required()` + `output()` | The presentational `meal-card` and `category-filter` — data in, user intent out, no service injected, so two pages reuse the same card |
| `routerLinkActive` + `ariaCurrentWhenActive` | The router marks the current nav link; the root link needs `{ exact: true }` because active matching is prefix-based |
| Selected state as an `input()` | The filter is presentational, so the page owns `selectedCategory` and passes it back down; the child states it as `[class.active]` for the eye and `[attr.aria-pressed]` for the accessibility tree |
| `:host` selector | An extracted component adds a wrapper element that is `display: inline` by default, so the filter's flex layout moves into its own stylesheet |
| `<a [routerLink]>` as the card root | An element that navigates is a link, so keyboard focus, Enter and open-in-new-tab come from the tag; the favourite button sits outside it because a control cannot nest inside an anchor |
| `<button type="button">` for an in-page action | An element that acts rather than navigates is a button; an `<a>` with no `href` is out of the tab order, has no `link` role and never fires on Enter, so the detail page's "Back" control is a button whose user-agent background, border, padding, font and cursor are reset |
| `:focus-visible` + `:has()` | A focus ring for keyboard entry only, raised from the link to the whole card |
| `overflow: hidden` on cards | Prevent images from breaking the card layout |
| `position: absolute` + `top/right` | Favourite button overlay on the card |
| `transition` on base element | Smooth hover — never put transition on `:hover` |

---

## Learning steps

1. Set up routing with search, detail, and favourites pages
2. Create `MealService` with search and getById methods
3. Create `FavouriteService` with a signal synced to localStorage via `effect()`
4. Build search page — search input and meal grid
5. Build `meal-card` — dumb component with favourite button overlay
6. Build detail page — read route param, call API inside `effect()`
7. Build favourites page — show saved meals, filter them by category, allow removal
8. Add live nav count with `computed()` on the favourites signal
