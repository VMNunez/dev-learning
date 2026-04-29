# Angular — HTTP Client and RxJS

Official docs: https://angular.dev/guide/http

## HttpClient — call external APIs

### 1. Register in `app.config.ts` — do this once per project

```typescript
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch())],
};
```

### 2. Inject in the service

```typescript
private http = inject(HttpClient);
```

## Standard pattern for API calls in a component

This is the pattern you use every time you call an API from a component:

1. **Service** — has the method that calls the API and returns an Observable
2. **Component** — injects the service and creates a dedicated method to load the data
3. **Signal** — stores the result so the template can display it

> `getMealById` (and any HTTP service method) returns an **Observable** — a value that arrives in the future. You call `.subscribe()` on it to receive the data. You will see this explained in detail below.

> In real projects, always add `takeUntilDestroyed` to HTTP subscriptions to avoid memory leaks. You will see how to do this in the `takeUntilDestroyed` section below.

```typescript
// 1. service — HttpClient is injected here, where the API calls live
private http = inject(HttpClient);

getMealById(id: string): Observable<MealResponse> {
  const url = `https://api.example.com/meal/${id}`;
  return this.http.get<MealResponse>(url);
}

// 2. component
private route = inject(ActivatedRoute);
private mealService = inject(MealService);
meal = signal<Meal | null>(null);

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  this.loadMeal(id as string);
}

loadMeal(id: string): void {
  // calls getMealById from MealService, which sends the HTTP request
  this.mealService.getMealById(id).subscribe({
    next: (response) => {
      this.meal.set(response.meals[0]); // data arrived — store it in the signal
    },
    error: (err) => {
      console.error(err); // something went wrong — log it
    }
  });
}
```

**Why a separate method?** Keeps `ngOnInit` clean. Each method does one job.

**Why `console.error` not `console.log`?** Errors go to `console.error` — they show in red in DevTools and are easier to spot.

**When to call the load method:**

| Situation                              | Where to call                                                               |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Need a route parameter (`/detail/:id`) | `ngOnInit` — route params are only available after the component is created |
| Load data on start, no route params    | `ngOnInit` is still the standard — keeps constructors clean                 |
| Simple default value                   | Can be set directly on the signal                                           |

---

## Observable

An Observable is a stream — it represents a value that will arrive in the future. It does not run until you `subscribe` to it.

```typescript
// this does NOT run yet — no request is sent
const request = this.http.get<MealResponse>(url);

// this runs it — the HTTP request is sent when you subscribe
request.subscribe({
  next: (response) => {
    /* data arrived */
  },
  error: (err) => {
    /* something went wrong */
  },
});
```

### subscribe callbacks

| Callback   | When it runs                                                                    |
| ---------- | ------------------------------------------------------------------------------- |
| `next`     | When data arrives — can run multiple times in a stream                          |
| `error`    | When something goes wrong — the stream stops                                    |
| `complete` | When the stream finishes — HTTP calls complete automatically after one response |

For HTTP calls, `next` runs once and then the Observable completes. You do not need `complete` for basic HTTP.

### Where you use Observables in Angular

| Place              | Example                                 |
| ------------------ | --------------------------------------- |
| HTTP calls         | `this.http.get()`, `this.http.post()`   |
| Route params       | `this.route.paramMap.subscribe(...)`    |
| Form value changes | `this.form.valueChanges.subscribe(...)` |

In all other cases — shared state, derived values — use signals instead.

---

## takeUntilDestroyed — cancel subscriptions when the component is destroyed

When a component is destroyed (user navigates away), any active HTTP subscription keeps running in the background. When the response arrives, it tries to update signals on a component that no longer exists. This is called a **memory leak**.

`takeUntilDestroyed` cancels the subscription automatically when the component is destroyed.

**Always use this pattern for HTTP subscriptions in components.**

```typescript
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private destroyRef = inject(DestroyRef);

loadData(): void {
  this.service.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => { ... },
      error: (err) => { ... }
    });
}
```

`.pipe()` is the RxJS method that lets you apply operators to an Observable before subscribing. `takeUntilDestroyed` is one of those operators.

### What is DestroyRef?

`DestroyRef` is an Angular service that represents the lifecycle of the current component or service. When the component is destroyed, `DestroyRef` emits a notification. `takeUntilDestroyed` listens to that notification and cancels the subscription at that moment.

You inject it like any other service:

```typescript
private destroyRef = inject(DestroyRef);
```

Then pass it to `takeUntilDestroyed(this.destroyRef)` so it knows which component's lifecycle to watch.

---

## Pattern — loading, error, and data states

Every component that calls an API should handle three states. This is the standard pattern:

```typescript
data = signal<Item[]>([]);
isLoading = signal<boolean>(false);
hasError = signal<boolean>(false);

loadData(): void {
  this.isLoading.set(true);   // start loading — show the spinner
  this.hasError.set(false);   // reset any previous error before each new request

  this.service.getData()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        this.data.set(response);      // store the data
        this.isLoading.set(false);    // hide the spinner
      },
      error: (err) => {
        console.error(err);
        this.hasError.set(true);      // show error message
        this.isLoading.set(false);    // hide the spinner even on error
      }
    });
}
```

In the template:

```html
<!-- if loading, show spinner -->
@if (isLoading()) {
  <div class="spinner"></div>

<!-- if error, show message -->
} @else if (hasError()) {
  <p>Something went wrong. Try again.</p>

<!-- otherwise, show the data -->
} @else {
  <!-- show data -->
}
```

The three states:

- **Loading** — request in progress
- **Error** — network failure, server error (5xx), timeout — only fires in `error` callback
- **Success** — data arrived (can still be empty — that is a fourth UI state, not an error)

---

## forkJoin — run multiple requests in parallel

Use `forkJoin` when you need multiple requests to finish before updating the UI. Both requests run at the same time — faster than running them one after the other.

```typescript
import { forkJoin } from 'rxjs';

loadWeather(city: string): void {
  this.isLoading.set(true);   // start loading before both requests
  this.hasError.set(false);

  forkJoin([
    this.weatherService.getWeather(city),
    this.weatherService.getForecast(city)
  ])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: ([weather, forecast]) => {
        // both requests finished — destructure the results in order
        this.weatherResponse.set(weather);
        this.forecastResponse.set(forecast);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);    // if either request fails, the whole forkJoin fails
        this.isLoading.set(false);
      },
    });
}
```

## Observable vs Promise

|                 | Observable       | Promise     |
| --------------- | ---------------- | ----------- |
| Returns         | Stream of values | One value   |
| Starts when     | You subscribe    | Immediately |
| Cancel          | Yes              | No          |
| Used in Angular | HTTP, events     | Rarely      |

---

## Environment variables — store API keys safely

API keys must never be committed to git. Anyone who sees your repo can steal them and use your account.

The solution: store the key in a file that is in `.gitignore`, and read it from there in your code.

### Step 1 — create the environment file

Run:

```bash
ng generate environments
```

This creates `src/environments/environment.ts` and `src/environments/environment.development.ts` and updates `angular.json` automatically.

Then add your key to `environment.ts`:

```typescript
export const environment = {
  apiKey: 'your-real-key-here',
};
```

### Step 2 — add it to `.gitignore`

```
src/environments/
```

This file will never be pushed to GitHub.

### Step 3 — use it in the service

```typescript
import { environment } from '../../../environments/environment';

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${environment.apiKey}`;
```

### Step 4 — Netlify deployment

> **Is this script always necessary? Is it normal to have environment variables in a frontend?**
>
> The `environment.ts` file is Angular's standard way to inject configuration at build time — it is a common pattern. However, it is important to know: **any value you put in a frontend bundle is visible to the user**. If someone opens DevTools, they can find your API key in the minified JavaScript. So `environment.ts` keeps keys out of git, but not fully secret.
>
> For truly sensitive keys, the correct solution is to proxy API calls through a backend — the key lives on the server, never in the browser. In Angular 17+ there is no built-in secret management for the frontend.
>
> The `set-env.js` script below is the standard approach for Netlify deployments when you have no backend. It is widely used and perfectly acceptable for learning projects and portfolios.

Netlify does not have your `environment.ts` file because it is in `.gitignore`. You need to generate it at build time using a script.

Create `set-env.js` at the root of the project:

```javascript
const fs = require('fs');
fs.mkdirSync('./src/environments', { recursive: true });
const content = `export const environment = { apiKey: '${process.env.API_KEY}' };`;
fs.writeFileSync('./src/environments/environment.ts', content);
```

In Netlify settings, add an environment variable `API_KEY` with your real key.

Change the build command in Netlify to:

```
node set-env.js && ng build
```

This runs the script first — it reads `API_KEY` from Netlify and writes `environment.ts` — then builds the app.
