# Angular — HTTP Client and RxJS

## HttpClient — call external APIs

Import in the component:
```typescript
private http = inject(HttpClient);
```

Provide in `app.config.ts`:
```typescript
provideHttpClient()
```

## Standard pattern for API calls in a component

This is the pattern you use every time you call an API from a component:

1. **Service** — has the method that calls the API and returns an Observable
2. **Component** — injects the service, creates a dedicated method, calls it from `ngOnInit`
3. **Signal** — stores the result so the template can display it

```typescript
// 1. service
getMealById(id: string): Observable<MealResponse> {
  return this.http.get<MealResponse>(`https://api.example.com/meal/${id}`);
}

// 2. component
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

---

## Basic GET request

```typescript
this.http.get<WeatherResponse>(url).subscribe({
  next: (data) => {
    this.weatherResponse.set(data);
  },
  error: (err) => {
    console.error(err);
  }
});
```

`get()` returns an Observable — it does not run until you `subscribe`.

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

Create `src/environments/environment.ts`:
```typescript
export const environment = {
  apiKey: 'your-key-here'
};
```

Use it in the service:
```typescript
import { environment } from '../../../environments/environment';

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${environment.apiKey}`;
```

Add `src/environments/` to `.gitignore` — never commit API keys.

### For Netlify deployment — set-env.js

```javascript
const fs = require('fs');
fs.mkdirSync('./src/environments', { recursive: true });
const content = `export const environment = { apiKey: '${process.env.API_KEY}' };`;
fs.writeFileSync('./src/environments/environment.ts', content);
```

Run before build: `node set-env.js && ng build`
