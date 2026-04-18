# 04 — Meal Finder

My fourth Angular project. A recipe search app to learn route parameters, ActivatedRoute, effect(), and computed() for filtering.

**Live demo:** coming soon

## Features

- Search meals by name using TheMealDB API
- Browse results as cards with image and name
- Click a meal to see the full recipe on a detail page
- Save favourite meals (localStorage)
- View all favourites on a dedicated page
- Filter favourites by category

## What I learned

### Angular
- Route parameters — `path: 'detail/:id'` to define dynamic URL segments
- `ActivatedRoute` — read the `:id` from the URL inside a component
- `effect()` — run side effects automatically when a signal changes
- `computed()` — derive a reactive value from a signal (filtering, isFavourite, unique categories)
- `localStorage + effect()` pattern — init signal from localStorage, use effect() to keep it in sync
- `signal<Type[]>([])` — typed signal for arrays
- `subscribe` with `next` and `error` callbacks — handle Observable responses
- `event.stopPropagation()` — prevent a button click from bubbling to a parent `routerLink`
- `Array.some()` — check if any item in an array matches a condition
- `[...new Set(array.map(...))]` — get unique values from an array
- `?.` optional chaining — safely access a property that might be null or undefined
- `(input)` event + `signal` — track input value reactively to enable/disable a button
- `[disabled]` binding — disable a button based on a reactive condition
- `hasSearched` signal pattern — distinguish between "not searched yet" and "no results found"

### CSS
- `overflow: hidden` on a card — clips image corners when using `border-radius`
- `position: absolute` + `top/right` — place a badge or button over a card
- `transition` on the base element, not on `:hover` — correct hover lift pattern
- `[class.active]` — Angular class binding to toggle styles reactively
- `display: inline-block` on `<a>` — enables vertical margin on inline elements

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