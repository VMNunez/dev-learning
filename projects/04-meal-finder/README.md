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

**Search results**

![Search results — meal cards for a search term](screenshots/preview.png)

**Meal detail**

![Meal detail — recipe image, category and area tags, instructions and the favourite toggle](screenshots/detail.png)

**Favourites**

![Favourites page — saved meals with the category filter above the grid](screenshots/favourites.png)

---

## Features

- Search meals by name and browse the results as a grid of cards
- Click a meal to see the full recipe on a detail page
- Save and remove favourite meals
- The Favourites link in the navigation bar carries a live count that changes the moment a meal is saved or removed
- Filter favourites by category
- Persistent favourites across page refreshes
- The search term stays in the address bar, so opening a recipe and coming back keeps the results and a search can be shared as a link
- A spinner while a search runs, a "no meals found" message when nothing matches and an error message when the request fails — never a blank screen
- The meal grid and the recipe layout adapt from a single column on mobile to a multi-column grid on desktop
- Fully usable with a keyboard alone, with every control's state and name announced to screen readers

---

## Architecture decisions

- `MealService` and `FavouriteService` split by responsibility to keep the favourites page free of `HttpClient` and the search page free of persistence
- `effect()` + `localStorage` in `FavouriteService` to persist every change automatically, with no save call anywhere in the app
- `computed()` for every derived value to memoise it and keep templates free of method calls that re-run on each change detection
- `toSignal(paramMap)` on the `detail/:id` route to reload the recipe when only `:id` changes, since the router reuses the component instance
- The search term kept in the URL as `?q=` to make results survive navigation and a search linkable
- `Location.back()` guarded by a `NavigationHistoryService` count to fall back to `/` when a detail URL was opened directly, since browser history is not application history
- `loadComponent()` on every route to ship each page as its own chunk instead of one bundle carrying all four (253 kB → 238 kB)
- `meal-card` and `category-filter` kept presentational so the search page and the favourites page reuse the same card
- `catchError` in `MealService` rethrowing a domain error to give every page a single failure shape to handle
- `HttpParams` for every query string so `&`, `#` and `+` in a search term cannot silently change what was searched for
- Separate `isLoading`, `loadFinished` and `hasError` signals to tell loading, empty, not-found and error apart, since TheMealDB answers an unknown id with `200 {"meals": null}`

---

## Tradeoffs

- TheMealDB over a keyed recipe API — no secret to manage in a public repo and a one-command clone-and-run, giving up server-side filtering and a dataset I could extend
- `subscribe` inside an `effect()` over the `async` pipe — the component owns the loading, empty, not-found and error states explicitly, at the cost of wiring the teardown by hand in the effect's cleanup callback
- Favourites in `localStorage` over a backend — persistence with no server to build, so favourites live in one browser and are lost when its storage is cleared
- CLI-generated specs over an authored test suite — authoring tests broadly starts at project 07, so coverage here is the compiling baseline plus one accessibility assertion each on `meal-card` and `category-filter`

---

## Future improvements

- Search by ingredient
- Meal planner — assign meals to days of the week
- Shopping list generated from a selected meal plan

---

## What I learned

- `HttpClient` — call an external API from a service, never from a component
- `HttpParams` — build the query string so user input cannot become query syntax
- `catchError` — translate an HTTP failure into one domain error the pages handle
- `signal()` and `computed()` — reactive state and derived values
- `asReadonly()` — expose a signal read-only so the service's own methods are the only writers
- `effect()` — sync a signal with an external system (localStorage) instead of writing in every mutator
- `effect()` cleanup — cancel the in-flight request before the effect re-runs
- `toSignal()` — read `paramMap` and `queryParamMap` as signals instead of subscribing
- `input.required()` and `output()` — presentational components take data in and emit intent out
- `loadComponent()` — lazy route, one chunk per page instead of one bundle
- `**` wildcard route — an unmatched URL renders the not-found page; declared last, since matching is first-wins
- `routerLinkActive` — mark the current nav link; the brand link needs `{ exact: true }`
- `@if` / `@else if` / `@for` — built-in control flow renders one remote state at a time, no `*ngIf` import
- `Location.back()` — browser history is not application history, so a direct URL needs a fallback
- `[attr.x]` binding — ARIA attributes have no DOM property behind them, so `[attr.aria-pressed]`, not `[ariaPressed]`
- Narrowing beats asserting — read a `string | null` route id into a local and return early, never `as string`
- Nullable API responses — normalise `Meal[] | null` once at the service boundary
- `<a>` vs `<button>` — an `<a>` navigates, a `<button>` acts; an `<a>` with no `href` is skipped by the tab order
- `aria-label` and `<label for>` — a name for an icon-only control, and for a field whose `placeholder` is only an example
- `.visually-hidden` — a clipped one-pixel box keeps text in the accessibility tree, which `display: none` removes
- `alt=""` — mark a decorative image so it is not named after its file
- `:focus-visible` + `:has()` — a focus ring for keyboard entry only, raised to the whole card

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript |
| Routing | Angular Router — lazy routes, route + query parameters |
| State | Angular signals — `signal`, `computed`, `effect` |
| HTTP | `HttpClient` + `HttpParams` |
| Persistence | Browser `localStorage` |
| Styles | CSS with custom-property tokens |
| API | TheMealDB (free, no API key) |
| Hosting | Netlify |

---

## Project structure

```
src/
├── app/
│   ├── components/          presentational components — data in, events out, no service injected
│   │   ├── meal-card/       meal image, name and favourite toggle; reused by search and favourites
│   │   └── category-filter/ category buttons for the favourites page
│   ├── models/              the Meal domain type
│   ├── pages/               routed pages — search, meal detail, favourites, not found
│   ├── services/            MealService (HTTP), FavouriteService (state + localStorage),
│   │                        NavigationHistoryService (navigation count for the Back control)
│   ├── app.routes.ts        lazy route table, wildcard route last
│   ├── app.config.ts        application providers — router and HttpClient
│   └── app.ts / app.html    root shell — nav with the live favourites badge, plus the router outlet
└── styles.css               global styles and the colour tokens every component reads
```

---

## How to run

```
git clone https://github.com/VMNunez/dev-learning.git
```

```
cd dev-learning/projects/04-meal-finder
```

```
npm install
```

```
npm start
```

Open your browser at `http://localhost:4200`
