# Project 02 — Weather App

A weather app that shows current conditions and a 5-day forecast for any city.
Uses the OpenWeatherMap API.

---

## Why this project

- **Learning objective:** Learn how to call external APIs with HttpClient and handle Observables
- **Portfolio value:** Shows API integration and reactive programming basics

---

## Key features

- Search a city by name
- Show current temperature, humidity, wind speed, and weather icon
- Show a 5-day forecast
- Loading state while the API responds
- Error state when the city is not found

---

## Tech stack

- Angular (signals-based, no Angular Material)
- OpenWeatherMap API
- Environment files for API key
- CSS animations and keyframes

---

## Pages and components

```
app/
├── app.component                    ← root
├── weather-page/
│   ├── weather-page.component       ← smart, owns search signal and API call
│   ├── search-bar/
│   │   └── search-bar.component     ← dumb, emits search term
│   ├── current-weather/
│   │   └── current-weather.component ← dumb, receives current data
│   └── forecast-card/
│       └── forecast-card.component  ← dumb, receives one forecast day
└── services/
    └── weather.service.ts           ← HttpClient calls
```

---

## State management

- `signal()` for search term, current weather, forecast, loading, and error
- `computed()` for derived display values (e.g. formatted temperature)
- `forkJoin` to run current weather + forecast requests in parallel
- `takeUntilDestroyed` to cancel subscriptions when the component is destroyed

---

## Key patterns introduced

| Pattern | Where used |
|---|---|
| `HttpClient` + `subscribe` | WeatherService API calls |
| `forkJoin` | Run two requests in parallel |
| `ngOnInit` | Trigger the initial search on load |
| `takeUntilDestroyed` + `DestroyRef` | Safe subscription management |
| `number` pipe with format | Display temperature with one decimal |
| `SlicePipe` | Limit forecast list in the template |
| Environment files | Store the API key safely |
| `@keyframes` + `animation` | CSS loading spinner |
| `transition` + `transform: scale()` | Hover effects |

---

## Learning steps

1. Create the project and add `provideHttpClient()` in `app.config.ts`
2. Create environment files with the API key
3. Build `WeatherService` with two methods: `getCurrent()` and `getForecast()`
4. Build `weather-page` — call `forkJoin` on search, handle loading and error signals
5. Build `search-bar` — input with `(keyup.enter)` and a button
6. Build `current-weather` and `forecast-card` as dumb display components
7. Add CSS spinner animation and card hover effects
