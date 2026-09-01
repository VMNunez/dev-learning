# Meal Finder

My 4th learning project — recipe search app where users find meals, view full recipes on a detail page and save favourites.

---

## Why this project

Most real Angular apps use dynamic URLs — a product ID, a user profile, a recipe. I built this project to understand how route parameters and browser history work, and how to build a more complete UX with multiple states: loading, no results, empty favourites.

---

## Live demo

https://04mealfinder.netlify.app/

---

## Screenshots

**App overview**

![App preview](screenshots/preview.png)

---

## Features

- Search meals by name using TheMealDB API
- Browse results as cards with image and name
- Click a meal to see the full recipe on a detail page
- Save and remove favourite meals
- Filter favourites by category
- Persistent favourites across page refreshes

---

## Architecture decisions

- `effect()` + localStorage for favourites — automatic sync with no manual save calls anywhere in the app
- `computed()` for all filtering — memoized and recalculates only when the source signal changes
- `Location.back()` on the detail page — the page is reachable from two routes; a hardcoded link would always go to the wrong one
- `hasSearched` and `hasLoad` signals to express three distinct states — a single results array cannot distinguish between loading, no results and not searched yet

---

## Tradeoffs

- TheMealDB (free, no key) over a paid API — simpler setup keeps the focus on routing patterns, not configuration
- `subscribe` over `async` pipe — explicit subscription management was clearer for learning the Observable lifecycle

---

## Future improvements

- Search by ingredient
- Meal planner — assign meals to days of the week
- Shopping list generated from a selected meal plan

---

## What I learned

- Route parameters — `path: 'detail/:id'` and `ActivatedRoute` to read the URL segment
- `effect()` — run side effects automatically when a signal changes
- `computed()` — derive filtering, counts and unique categories from signals
- `localStorage + effect()` pattern — init signal from localStorage, keep it in sync automatically
- `takeUntilDestroyed` + `DestroyRef` — cancel HTTP subscriptions when a component is destroyed
- Nullable API responses — a response type is an unchecked assertion, so `meals` is typed `Meal[] | null` and normalised where it enters the app
- `event.stopPropagation()` — prevent a button click from bubbling to a parent `routerLink`
- `(keyup.enter)` — trigger a method when the user presses Enter
- `[disabled]` binding — disable a button based on a reactive condition
- `hasSearched` and `hasLoad` signal patterns — distinguish between loading, no results and not searched yet
- `Location.back()` — navigate to the previous page in the browser history
- `overflow: hidden` on a card — clips image corners with `border-radius`
- `position: absolute` + `top/right` — place a badge over a card
- `transition` on the base element, not on `:hover` — correct hover animation pattern

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript |
| Styles | CSS |
| API | TheMealDB (free, no API key) |

---

## How to run

```
git clone https://github.com/VMNunez/dev-learning.git
```

```
cd dev-learning/angular/04-meal-finder
```

```
npm install
```

```
npm start
```

Open your browser at `http://localhost:4200`
