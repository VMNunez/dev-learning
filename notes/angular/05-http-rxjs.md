# Angular — HTTP Client and RxJS

Official docs: https://angular.dev/guide/http

## HttpClient — call external APIs

### 1. Register in `app.config.ts` — do this once per project

```typescript
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
```

### 2. Inject in the service

```typescript
private http = inject(HttpClient);
```

## Standard pattern for API calls in a component

This is the pattern you use every time you call an API from a component:

1. **Service** — has the method that calls the API and returns an Observable
2. **Component** — injects the service, creates a dedicated method, calls it from `ngOnInit`
3. **Signal** — stores the result so the template can display it

```typescript
// 1. service
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
  this.mealService.getMealById(id).subscribe({
    next: (response) => {
      this.meal.set(response.meals[0]);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
```

**Why a separate method?** Keeps `ngOnInit` clean. Each method does one job.

**Why `console.error` not `console.log`?** Errors go to `console.error` — they show in red in DevTools and are easier to spot.

**When to use `ngOnInit` vs calling the method directly:**

| Situation | Where to call |
|-----------|--------------|
| Need a route parameter (`/detail/:id`) | `ngOnInit` — route params are only available after the component is created |
| Load data on start, no route params | `ngOnInit` is still the standard — keeps constructors clean |
| Simple default value | Can be set directly on the signal |

---

## Observable

An Observable is a stream — it represents a value that will arrive in the future. It does not run until you `subscribe` to it.

```typescript
// this does NOT run yet
const request = this.http.get<MealResponse>(url);

// this runs it
request.subscribe({
  next: (response) => { /* data arrived */ },
  error: (err) => { /* something went wrong */ }
});
```

### subscribe callbacks

| Callback | When it runs |
|----------|-------------|
| `next` | When data arrives — can run multiple times in a stream |
| `error` | When something goes wrong — the stream stops |
| `complete` | When the stream finishes — HTTP calls complete automatically after one response |

For HTTP calls, `next` runs once and then the Observable completes. You do not need `complete` for basic HTTP.

### Where you use Observables in Angular

| Place | Example |
|-------|---------|
| HTTP calls | `this.http.get()`, `this.http.post()` |
| Route params | `this.route.paramMap.subscribe(...)` |
| Form value changes | `this.form.valueChanges.subscribe(...)` |

In all other cases — shared state, derived values — use signals instead.

---

## Pattern — loading, error, and data states

Every component that calls an API should handle three states. This is the standard pattern:

```typescript
data = signal<Item[]>([]);
isLoading = signal<boolean>(false);
hasError = signal<boolean>(false);

loadData(): void {
  this.isLoading.set(true);
  this.hasError.set(false); // reset on each new request

  this.service.getData().subscribe({
    next: (response) => {
      this.data.set(response);
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.hasError.set(true);
      this.isLoading.set(false);
    }
  });
}
```

In the template:

```html
@if (isLoading()) {
  <div class="spinner"></div>
} @else if (hasError()) {
  <p>Something went wrong. Try again.</p>
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

```typescript
import { forkJoin } from 'rxjs';

forkJoin([
  this.weatherService.getWeather(city),
  this.weatherService.getForecast(city)
]).subscribe({
  next: ([weather, forecast]) => {
    this.weatherResponse.set(weather);
    this.forecastResponse.set(forecast);
    this.isLoading.set(false);
  },
  error: () => {
    this.isLoading.set(false);
  }
});
```

Use `forkJoin` when you need multiple requests to finish before updating the UI. Both requests run at the same time — faster than running them one after the other.

## Observable vs Promise

| | Observable | Promise |
|--|-----------|---------|
| Returns | Stream of values | One value |
| Starts when | You subscribe | Immediately |
| Cancel | Yes | No |
| Used in Angular | HTTP, events | Rarely |

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
  apiKey: 'your-real-key-here'
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
