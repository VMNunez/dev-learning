# 04 — Meal Finder

My fourth Angular project. A recipe search app to learn route parameters, ActivatedRoute, effect(), and computed() for filtering.

**Live demo:** https://04mealfinder.netlify.app/

![App preview](screenshots/preview.png)

## Features

- Search meals by name using TheMealDB API
- Browse results as cards with image and name
- Click a meal to see the full recipe on a detail page
- Save favourite meals (localStorage)
- View all favourites on a dedicated page
- Filter favourites by category

## Architecture decisions

- **`effect()` + `localStorage` for favourites** — favourites need to persist across sessions. Using `effect()` to save the signal to `localStorage` every time it changes means there is no manual save call anywhere — the sync is automatic and impossible to forget.

- **`computed()` for all filtering instead of methods** — the filtered meal list and unique category list are derived from signals. `computed()` recalculates automatically when the source changes and is memoized, so it does not run on every render cycle like a method would.

- **`Location.back()` on the detail page** — the detail page can be reached from the search results or from the favourites page. A hardcoded `routerLink` would always go back to one specific page. `Location.back()` uses the browser history, so it returns to wherever the user came from.

- **`hasSearched` and `hasLoad` signals for UX state** — distinguishing between "loading", "no results", and "not searched yet" requires separate flags. A single `results` signal cannot express all three states cleanly; two boolean signals make each state explicit and easy to read in the template.

## What I learned

### Angular
- Route parameters — `path: 'detail/:id'` and `ActivatedRoute` to read the URL segment
- `effect()` — run side effects automatically when a signal changes
- `computed()` — derive filtering, counts and unique categories from signals
- `localStorage + effect()` pattern — init signal from localStorage, keep it in sync with effect()
- `takeUntilDestroyed` + `DestroyRef` — cancel HTTP subscriptions when a component is destroyed
- `event.stopPropagation()` — prevent a button click from bubbling to a parent `routerLink`
- `(keyup.enter)` — trigger a method when the user presses Enter
- `[disabled]` binding — disable a button based on a reactive condition
- `hasSearched` and `hasLoad` signal patterns — distinguish between loading, no results, and not searched yet
- `Location.back()` — navigate to the previous page in the browser history, from `@angular/common`

### CSS
- `overflow: hidden` on a card — clips image corners with `border-radius`
- `position: absolute` + `top/right` — place a badge over a card
- `transition` on the base element, not on `:hover` — correct hover animation pattern

## Tech stack

- Angular 21
- TypeScript
- CSS
- TheMealDB API (free, no API key)

## How to run the project

```bash
git clone https://github.com/VMNunez/dev-learning.git
```

```bash
cd dev-learning/angular/04-meal-finder
```

```bash
npm install
```

```bash
ng serve
```

Open your browser at `http://localhost:4200`
