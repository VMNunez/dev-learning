# 04 — Meal Finder

My fourth Angular project. A recipe search app to learn route parameters, ActivatedRoute, and the effect() signal.

**Live demo:** coming soon

## Features

- Search meals by name using TheMealDB API
- Browse results as cards with image and name
- Click a meal to see the full recipe on a detail page
- Save favourite meals (localStorage)

## What I learned

### Angular
- Route parameters — `path: 'detail/:id'` to define dynamic URL segments
- `ActivatedRoute` — read the `:id` from the URL inside a component
- `effect()` — run side effects automatically when a signal changes
- `signal<Type[]>([])` — typed signal for arrays
- `subscribe` with `next` and `error` callbacks — handle Observable responses

### Architecture
- Two-page app: search page (list) + detail page (one item)
- Shared service at `app/services/` used by both pages
- Typed API response with `MealResponse` interface — wraps `Meal[]`

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