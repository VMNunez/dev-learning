# Weather App

My 2nd learning project — weather app where you search a city and see its weather right now and for the next 5 days.

---

## Why this project

Real Angular apps almost always fetch data from an API. I built this project to understand how HttpClient, Observables and subscription management work — the foundation for any app that talks to a backend.

---

## Live demo

https://02angularweatherapp.netlify.app/

---

## Screenshots

**App overview**
![App preview](screenshots/preview.png)

---

## Features

- Search weather by city name
- Current temperature, feels like, humidity and weather condition
- 5-day forecast
- Loading spinner while fetching data
- Error message when the city is not found
- Madrid loaded by default on app start

---

## Architecture decisions

- `forkJoin` for parallel requests to load current weather and forecast at the same time instead of sequentially
- `takeUntilDestroyed` to cancel subscriptions automatically when the component is destroyed — no `ngOnDestroy` needed
- Environment files for the API key to keep the credential out of the repository and out of git history
- Input normalised in the component that captures it to keep raw text from crossing the `output()` boundary
- `HttpParams` for the query string so every value is URL-encoded and user input cannot become query syntax
- `prefers-reduced-motion` honoured so the decorative card hover is dropped while the loading spinner only slows, never stops
- `alt=""` on the weather icons to mark them decorative — the description is already rendered as text beside each one, so an accessible name would only repeat it
- Container and presentation components split so the page owns the API call and the state while the form, card and forecast only receive inputs and emit intent

---

## Tradeoffs

- `subscribe` over `async` pipe — explicit subscription management was clearer for learning the Observable lifecycle
- API key in the shipped bundle over a proxy backend — a frontend-only project cannot hide the key from the browser; the environment file keeps it out of the repository, and a proxy backend was out of scope
- One midday reading per day over aggregating each day's eight forecast slots — the 5-day list stays comparable day to day at the cost of the real daily minimum and maximum

---

## Future improvements

- Hourly forecast breakdown
- Save favourite cities
- Geolocation to detect the user's current city automatically

---

## What I learned

- `HttpClient` — call external APIs from Angular
- `subscribe` — handle Observable responses
- `forkJoin` — run multiple HTTP requests in parallel
- `ngOnInit` — run logic when the component loads
- `signal()` and `computed()` — reactive state and derived values
- State justified by its readers — a signal no template reads is not state, so the root component of a routed app declares none
- `(keyup.enter)` — key modifier so Enter and the button click reach one handler
- `number` pipe with format `'1.0-1'` — `DecimalPipe`, one decimal on every temperature
- `SlicePipe` — cut strings in templates
- Environment files — keep API keys out of the repository, not out of the bundle
- `takeUntilDestroyed` — cancel HTTP subscriptions automatically when a component is destroyed
- `DestroyRef` — Angular token injected to notify observables when the component lifecycle ends
- `@keyframes` and `animation` — CSS animations
- CSS spinner — `border-top-color` + `rotate` + `border-radius: 50%` on a square element
- `transition` and `transform: scale()` — hover effects
- `styleUrl` — a component declares one only when it has styles; an empty stylesheet is a build dependency that buys nothing

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript |
| HTTP | Angular `HttpClient` + RxJS |
| State | Angular signals |
| Styles | CSS |
| API | OpenWeatherMap |
| Deployment | Netlify |

---

## Project structure

```
src/
├── app/
│   ├── app.ts / app.html                  ← root component, renders the router outlet only
│   ├── app.config.ts                      ← providers: router + `provideHttpClient()`
│   ├── app.routes.ts                      ← one route: '' → WeatherPage
│   └── pages/weather-page/                ← the only page: owns the search, the API call and the state
│       ├── components/
│       │   ├── weather-form/              ← search input, emits the city name
│       │   ├── weather-card/              ← current conditions for the searched city
│       │   └── weather-forecast/          ← the 5-day list, one card per day
│       ├── models/                        ← interfaces for the OpenWeatherMap responses
│       ├── services/                      ← `WeatherService`, the two HttpClient calls
│       └── utils/                         ← `getIconUrl()`, shared by both display components
└── environments/                          ← API key, never committed (see How to run)
```

---

## How to run

```
git clone https://github.com/VMNunez/dev-learning.git
```

```
cd dev-learning/projects/02-weather-app
```

```
npm install
```

The API key is not in the repository. Get a free one at [openweathermap.org](https://openweathermap.org/api), then create the `src/environments/` folder and the two files below:

```
src/environments/environment.ts               ← read by npm run build
src/environments/environment.development.ts   ← read by npm start
```

Both files hold the same thing:

```ts
export const environment = {
  apiKey: 'YOUR_API_KEY',
};
```

```
npm start
```

Open your browser at `http://localhost:4200`
