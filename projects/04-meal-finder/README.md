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
- Filter favourites by category
- Persistent favourites across page refreshes
- A spinner while a search runs, a "no meals found" message when nothing matches and an error message when the request fails — never a blank screen
- Fully usable with a keyboard alone, with every control's state and name announced to screen readers

---

## Architecture decisions

- `MealService` and `FavouriteService` split by responsibility to keep the favourites page free of `HttpClient` and the search page free of persistence
- `effect()` + `localStorage` in `FavouriteService` to sync every change automatically — the signal is initialised from storage when the service is created and the effect re-runs whenever a signal it reads changes, so there is no save call anywhere in the app
- `computed()` for every derived value — filtered lists, unique categories, the nav count, a `Set` of favourite ids — to memoise them and keep templates free of method calls that re-run on each change detection
- `toSignal(paramMap)` + `effect()` on the `detail/:id` route to reload the recipe when only `:id` changes — the router reuses the component instance, so a `snapshot` read once would never update
- The search term kept in the URL as `?q=` — written with `router.navigate()`, read back with `toSignal(queryParamMap)` — to make results survive navigation and `/` linkable
- `Location.back()` guarded by a `NavigationHistoryService` count to fall back to `/` when a detail URL was opened directly, since browser history is not application history
- `loadComponent()` on every route to ship each page as its own chunk instead of one bundle carrying all four (253 kB → 238 kB)
- `meal-card` and `category-filter` kept presentational — `input.required()` in, `output()` out, no service injected — to let the search page and the favourites page reuse the same card
- One failure translation in `MealService` (`catchError` rethrowing a domain `Error`) to give every page a single failure shape to handle
- `HttpParams` for every query string to stop `&`, `#` and `+` in a search term from silently changing what was searched for
- Separate `isLoading`, `loadFinished` and `hasError` signals to tell four states apart, since TheMealDB answers an unknown id with `200 {"meals": null}` and a single results array expresses neither

---

## Tradeoffs

- TheMealDB over a keyed recipe API — no secret to manage in a public repo and a one-command clone-and-run, giving up server-side filtering and a dataset I could extend
- `subscribe` inside an `effect()` over the `async` pipe — the component owns the loading, empty, not-found and error states explicitly, at the cost of wiring the teardown by hand in the effect's cleanup callback
- Favourites in `localStorage` over a backend — persistence with no server to build, so favourites live in one browser and are lost when its storage is cleared

---

## Future improvements

- Search by ingredient

---

## What I learned

- `effect()` cleanup — the cleanup callback cancels the in-flight request before the effect re-runs
- Narrowing beats asserting — a `string | null` route id is read into a local and returned early on, never `as string`
- `asReadonly()` — keep the writable signal private so the service's own methods are the only writers
- Nullable API responses — `Meal[] | null` normalised once at the service boundary; pages never see the envelope
- The tag follows what the element does — `<a [routerLink]>` navigates and brings focus, Enter, the `link` role and open-in-new-tab, while an in-page action is a `<button type="button">`, since an `<a>` with no `href` is skipped by the tab order and never fires on Enter
- Interactive content does not nest — the favourite button is positioned over the card's link, not inside it
- `:focus-visible` + `:has()` — a focus ring for keyboard entry only, raised from the link to the whole card
- Accessible name — a `<label for>` names a field where a `placeholder` is only an example value, and an `aria-label` names an icon-only control, since `★` computes to no name
- One `h1` per routed page — headings are the document outline, not a size scale
- `.visually-hidden` — a clipped one-pixel box keeps text in the accessibility tree, which `display: none` removes
- Decorative images take `alt=""` — an absent `alt` leaves the image named after its file; a filled one repeats the caption
- Pressed state of a toggle — `[attr.aria-pressed]` puts the selected filter in the accessibility tree, which the `.active` class alone leaves out; ARIA attributes have no DOM property behind them, so they need attribute binding, `[attr.x]`, not property binding
- `routerLinkActive` — marks the current nav link; the brand link needs `{ exact: true }` because matching is prefix-based

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
