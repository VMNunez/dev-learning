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
- Filter results by category
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
├── pages/
│   ├── search-page/
│   │   ├── search-page.component         ← smart, owns search and filter signals
│   │   ├── meal-card/
│   │   │   └── meal-card.component       ← dumb, receives meal, emits favourite toggle
│   │   └── category-filter/
│   │       └── category-filter.component ← dumb, receives categories, emits selection
│   ├── detail-page/
│   │   └── detail-page.component         ← smart, reads route param, calls API
│   └── favourites-page/
│       └── favourites-page.component     ← smart, reads favourites signal
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

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| Route parameters (`path: 'detail/:id'`) | Detail page URL |
| `ActivatedRoute.snapshot.paramMap.get()` | Read the meal id from the URL |
| `effect()` | Trigger API call when a signal changes |
| `localStorage + effect()` | Persist favourites automatically |
| `Array.some()` | Check if a meal is already in favourites |
| `[...new Set()]` | Extract unique category names from the results |
| `optional chaining ?.` | Safe access on nullable API response |
| `(input)` event | Track search text on every keystroke |
| `[disabled]` binding | Disable search button when input is empty |
| `hasSearched` signal | Show empty state only after a search, not on load |
| `(keyup.enter)` | Submit search by pressing Enter |
| `@else if` | Handle multiple template states |
| `takeUntilDestroyed` + `DestroyRef` | Cancel subscriptions on destroy |
| `computed()` for nav counts | Live favourite count in the nav bar |
| `overflow: hidden` on cards | Prevent images from breaking the card layout |
| `position: absolute` + `top/right` | Favourite button overlay on the card |
| `transition` on base element | Smooth hover — never put transition on `:hover` |

---

## Learning steps

1. Set up routing with search, detail, and favourites pages
2. Create `MealService` with search and getById methods
3. Create `FavouriteService` with a signal synced to localStorage via `effect()`
4. Build search page — search input, category filter, meal grid
5. Build `meal-card` — dumb component with favourite button overlay
6. Build detail page — read route param, call API inside `effect()`
7. Build favourites page — show saved meals, allow removal
8. Add live nav count with `computed()` on the favourites signal
