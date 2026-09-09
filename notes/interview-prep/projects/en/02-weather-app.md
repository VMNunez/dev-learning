# Interview Questions — 02-weather-app

**Last banked:** 2026-09-07

Questions specific to the implementation decisions made in this project.
Use these alongside the topic-based files in `interview-prep/{LEVEL}/en/` and `es/`.

## Architecture & Patterns

**[02-weather-app-001] Your `app.routes.ts` declares exactly one route, `'' → WeatherPage`. Why bootstrap through the router at all instead of putting the page in `App` directly?** ⭐⭐

I decided to keep the router because it costs one `provideRouter(routes)` line today and is the difference between adding a second screen and restructuring the shell. `App` is a `<router-outlet />` and nothing else, so a future "saved cities" or "settings" page is a new entry in the array, not a rewrite of the root component. I chose the shape the app will need over the shape it needs today, since the price of being wrong here is a line of config.

**[02-weather-app-002] `App` holds nothing but `<router-outlet />` — no header, no layout, no state. Isn't that a component that does nothing?** ⭐

It does one thing on purpose: it is the mount point the router writes into, and keeping it empty means every visual decision belongs to the routed page. I decided against putting a header there because with one route it would be indistinguishable from putting it in `WeatherPage`, and the moment a second route exists I want the choice — chrome shared by every page in `App`, chrome owned by a screen inside that screen — to still be open.

**[02-weather-app-003] In `app.config.ts` you wrote `provideHttpClient(withFetch())` rather than plain `provideHttpClient()`. What does that flag change?** ⭐⭐

It swaps the transport underneath `HttpClient` from `XMLHttpRequest` to the browser's `fetch` API. I chose it because it is the backend Angular recommends going forward and the one that behaves correctly under server-side rendering, so if I ever add SSR the HTTP layer does not have to be revisited. Nothing in my service code changes — `getWeather` and `getForecast` still return the same `Observable` — which is the point of configuring the transport at the provider level instead of at the call site.

**[02-weather-app-004] You kept `provideBrowserGlobalErrorListeners()` in the config. What is it for, and why leave it in a project this small?** ⭐

It registers global listeners for uncaught errors and unhandled promise rejections so they are reported through Angular's error handler rather than dying silently in the console. I left it because the app's own error path only covers what `forkJoin` emits into my `error` callback — a failure anywhere else, in a pipe or in template code, has no other reporting route. Removing scaffolding I have not understood is how a project loses its only diagnostic for the class of failure I am least likely to predict.

**[02-weather-app-005] Every component here is standalone — there is no `AppModule` anywhere. How do `WeatherCard` and `DecimalPipe` become available to a template, then?** ⭐⭐

Each component declares its own `imports` array: `WeatherPage` imports `WeatherForm`, `WeatherCard` and `WeatherForecast`, and `WeatherCard` imports `DecimalPipe` for itself. I chose standalone because the dependencies of a template are then readable from the top of the file that owns that template, instead of from a module three folders away that also declares nine unrelated things. It is also why `main.ts` calls `bootstrapApplication(App, appConfig)` and there is no `AppModule` to declare, import or export anything: the providers moved into `app.config.ts` and the declarations moved into each component.

**[02-weather-app-006] The API key is appended in `WeatherService.buildParams()`. Why not an `HttpInterceptor` registered in `app.config.ts`, the way an auth token usually is?** ⭐⭐

I decided an interceptor earns its place when a cross-cutting concern applies to requests several services make, and here one service makes every request that needs the key. An interceptor would also have to test the URL before attaching the key, so it would not be blind cross-cutting behaviour — it would be `WeatherService`'s rule written somewhere `WeatherService` cannot see it. If a second API entered the app I would move it, because that is when the check becomes real routing rather than a disguised `if`.

**[02-weather-app-007] Walk me through the component split on this screen: which one is smart and what makes the other three dumb?** ⭐⭐⭐

`WeatherPage` is the only smart component: it injects `WeatherService`, owns the four signals, and triggers the request. `WeatherForm`, `WeatherCard` and `WeatherForecast` are presentational — the form emits a string through `output<string>()` and knows nothing about HTTP, and the two display components receive their data through `input()` and render it. I chose that split so the whole asynchronous story of the screen lives in one file I can read top to bottom, while the three children can be reasoned about entirely from their inputs and outputs.

**[02-weather-app-008] In project 01 the state lives in a `providedIn: 'root'` service; here it lives in signals inside `WeatherPage`. Why the opposite decision?** ⭐⭐⭐

Because the state has a different lifetime. A task list is the application's data and has to survive the page that shows it; the weather for the city you just typed is a view of a remote resource, and if the page is destroyed there is nothing worth keeping — the correct thing on return is a fresh request, not a stale reading. I decided `WeatherService` should stay stateless, a pure gateway to the API, so the signals sit in the component whose lifetime matches the data's.

**[02-weather-app-009] `models/`, `services/`, `utils/` and `components/` all sit under `pages/weather-page/`. Why not a global `core/`?** ⭐⭐

The structure is feature-first: everything the weather feature needs is inside the folder named after it, and I can delete the feature by deleting one directory. I decided against `core/` because a shared folder advertises reuse, and `WeatherService`, the response interfaces and `getIconUrl` have exactly one consumer. Promoting them the day a second feature needs them is a one-import change; demoting a thing wrongly promoted is a conversation about ownership.

**[02-weather-app-010] `WeatherForm` uses a template reference variable, `#city`, with `(keyup.enter)` and a click handler. Why not `ngModel` or a `FormControl`?** ⭐⭐

The component has one field, no validation to display, and no state to keep between submissions — it reads the value at the moment of the submit and emits it. Reactive forms would add `ReactiveFormsModule`, a `FormGroup` and a subscription to model a single string I only need once, and `ngModel` would add two-way binding to a value nothing else reads. I chose the template reference because it is the smallest thing that expresses "read this input when the user submits", and I would move to reactive forms the moment the form gained a second field or a validation message.

**[02-weather-app-011] The trim and the empty-string guard are inside `WeatherForm`, not in `WeatherPage.onCitySearch()`. Why does the child decide?** ⭐

I decided the form owns what counts as a submission at all: an empty box is not a search, so nothing should be emitted and the parent should never learn about it. That keeps `onCitySearch` free of input hygiene it did not cause and gives the guard one place to grow — a minimum length, a character filter — without reaching into the page. The tradeoff I accept is that the page trusts its input, which is fine while the only callers are this form and its own `ngOnInit`.

**[02-weather-app-012] `forkJoin` is called in `WeatherPage`, not inside `WeatherService`. Why isn't the parallel fetch part of the service's API?** ⭐⭐⭐

`WeatherService` mirrors the OpenWeatherMap API: two endpoints, two methods, each returning its own typed `Observable`. `forkJoin` is a decision about *this screen* — that it shows current conditions and a forecast together and has nothing useful to render until both arrive. I chose to keep the combination in the component so a future screen that wants only the forecast can call `getForecast` without inheriting a request it does not need, and so the service stays a description of the remote API rather than of one page's layout.

**[02-weather-app-013] You `subscribe` manually and push into signals. Why not the `async` pipe, or `toSignal`?** ⭐⭐⭐

Because the response is not the only thing the template needs: the same emission has to clear `isLoading`, and a failure has to set `errorMessage` while clearing the loading flag. With the `async` pipe the subscription is the template's, so the loading and error transitions would have to be reconstructed around it with extra operators. I decided one explicit `subscribe` with `next` and `error` callbacks states the whole state machine of the screen in one place, and I paid for it by handling the unsubscription myself with `takeUntilDestroyed`.

**[02-weather-app-014] `takeUntilDestroyed(this.destroyRef)` on the page that is never destroyed — the app's only route. Is that not dead code?** ⭐⭐

Today it never fires, and I kept it deliberately. It is not a fix for a leak I observed, it is the invariant that makes the manual `subscribe` safe under any future routing, and the moment a second route exists the behaviour it guards becomes real without anyone remembering to add it. I passed the injected `DestroyRef` explicitly because `onCitySearch` runs on a user event, outside the injection context where `takeUntilDestroyed()` can find one for itself.

**[02-weather-app-015] `ngOnInit` calls `onCitySearch('Madrid')` with a hardcoded city. Defend that.** ⭐⭐

I decided an empty screen with a search box is a worse first impression than a screen already showing something real: the visitor sees the card, the forecast and the icons without typing. Reusing `onCitySearch` rather than a separate bootstrap path means the initial load exercises the exact same loading, success and error transitions a user search does, so there is no second code path to keep correct. The honest limitation is that the default is a literal in the component — geolocation or a last-searched city read from storage is the natural next step.

**[02-weather-app-016] `dailyForecast` is a `computed()` in the page that filters the raw list down to the `12:00:00` entries. Why there and not in the service or the child?** ⭐⭐⭐

The API returns forty three-hourly entries and the screen shows five days, so something has to pick one reading per day; I chose noon as the representative one. It is a `computed` in the page because it is derived state — it recalculates whenever `forecastResponse` changes and never needs to be kept in sync by hand. I kept it out of the service so the service returns what the API returned, and out of `WeatherForecast` so that component stays a renderer of whatever list it is handed rather than a component that knows how OpenWeatherMap slices its forecast.

**[02-weather-app-017] `WeatherCard` takes `input<WeatherResponse | null>()` and the template then uses `weather()!`. Why allow null at all if you immediately assert it away?** ⭐⭐

The null models the real state of the screen before the first response and between searches, when the page passes `weatherResponse()` straight through. The template opens with `@if (weather())`, so inside that block the value genuinely cannot be null — the `!` is telling the compiler what the guard already established, not overriding a check I skipped. What I would improve is the ergonomics: `@if (weather(); as w)` binds the narrowed value and removes every `!` in the block.

**[02-weather-app-018] `WeatherForecast` defaults its input to `[]` while `WeatherCard` defaults to null. Why are the two absent states shaped differently?** ⭐

Because the two inputs carry different things. The card receives a single response object, and the honest representation of "no response yet" is null. The forecast receives a list the page has already derived, and `dailyForecast` returns `[]` when there is no data, so an empty array is not a missing value — it is a list with nothing in it, which the `@if (forecast().length > 0)` guard reads directly. Defaulting a collection to empty rather than null also means no consumer has to check for null before iterating.

**[02-weather-app-019] `getIconUrl` is a plain exported function in `utils/`, assigned to a `protected` field in both components. Why not a pipe, or a method on the service?** ⭐⭐

It is a pure string transformation with no dependencies and no state, so injecting it would create a dependency for something that is really a constant with a hole in it. A pipe would work and would be the right call if it grew formatting options, but for one interpolation in each of two templates it is more machinery than the transformation deserves. I assigned it to a `protected` field because a template can only reach members of its own component class, and `protected` exposes it to the template without widening the public API of the component.

**[02-weather-app-020] `weather-page.html` renders `<app-weather-card />` unconditionally; the card hides itself with its own `@if`. Why not let the parent decide whether it appears?** ⭐⭐

Each component owns the answer to "do I have anything to show", which keeps the page template a flat description of the screen rather than a chain of conditionals about its children's data. The cost is that the parent cannot tell from its own template whether anything is on screen, and a reader has to open the child to know. With two children I preferred the simpler parent; with several I would push the decision back up, because at that point the page's layout depends on it.

**[02-weather-app-021] The loading spinner and the error message are rendered by the page, not by the components they concern. Why do those two live upstairs?** ⭐⭐

Because neither belongs to a child: `isLoading` and `errorMessage` describe the one request that fetches data for both children at once, so there is no single component below that could own them without lying about its scope. `onCitySearch` also clears both response signals before starting, so the children render nothing while the spinner is up and there is never a stale card sitting beside a spinner or an error. That clearing is the part that makes the three states mutually exclusive rather than merely ordered.

**[02-weather-app-022] `DecimalPipe` is imported in `WeatherCard` and again in `WeatherForecast`. Isn't that duplication you would avoid with a shared module?** ⭐

It is repetition, not duplication of logic — each component declares what its own template uses, which is the property that makes a standalone component readable and independently testable. A shared "common" module would remove two lines and reintroduce the thing standalone components exist to kill: a template whose dependencies are declared somewhere else, and an import list that grows for components that need none of it. I chose the explicit repetition.

**[02-weather-app-023] Your `@for` tracks `item.dt_txt`. Why that field, and what breaks if you track `$index`?** ⭐

`dt_txt` is the forecast slot's timestamp, so it is unique across the list and stable across responses — the same day keeps its identity when a new search arrives, and Angular can reuse the DOM node instead of tearing it down. Tracking `$index` would make position the identity, so every item would be considered changed the moment the list shifted, and any DOM state inside a row would follow the wrong item. The list is small enough that the performance difference is invisible; I chose the correct key because correctness of identity is what `track` is for.

**[02-weather-app-024] The single route loads `WeatherPage` eagerly with `component:`. When would you switch to `loadComponent`?** ⭐

Lazy loading pays off when a route's code is not needed for the first paint, and here the only route is the first paint — deferring it would add a chunk request before anything can render. I decided eager was correct for a one-route app and that the trigger to change is a second, heavier route: a settings or history screen most visitors never open is a `loadComponent` line, and the weather page stays eager because it is the landing screen.

**[02-weather-app-025] Your children use `input()` and `output()`, not the `@Input()` and `@Output()` decorators. What did you gain by choosing the signal-based API?** ⭐⭐

`WeatherCard`'s `weather = input<WeatherResponse | null>()` is a signal, so the template reads it as `weather()` and any `computed` over it recalculates without a lifecycle hook — `dailyForecast` in the page is the same mechanism one level up. With `@Input()` I would be reacting to input changes through `ngOnChanges` or a setter the moment anything had to be derived from them. I chose the signal API for consistency: every reactive value in this project, state and input alike, is read the same way, so there is no second reactivity model to keep in my head.

**[02-weather-app-026] `WeatherPage` injects with `inject(WeatherService)` and `inject(DestroyRef)` instead of constructor parameters. Why, and where does that choice actually bite?** ⭐⭐

I chose `inject()` because the dependencies become plain field initializers, so the class has no constructor at all and adding one more injection is one line rather than a signature change. The place it bites is `DestroyRef`: `takeUntilDestroyed()` can find the injection context for itself only when it is called during construction, and `onCitySearch` runs later, on a user event. I decided to inject the `DestroyRef` into a field and pass it explicitly, which is exactly the case the parameterless form cannot serve.

**[02-weather-app-027] `WeatherService` is `providedIn: 'root'` even though it is stateless and has exactly one consumer. Why not provide it in `WeatherPage` instead?** ⭐

Providing it on the component would tie the instance's lifetime to the page, which only matters for a service that holds state — and I deliberately kept every signal in the component so this one holds none. I chose `providedIn: 'root'` because it is tree-shakeable when unused and it means a second screen that needs the API gets the same instance without any provider wiring. If the service ever cached responses per screen, that is the day the provider moves down to the component.

**[02-weather-app-028] `weather-forecast.html` formats the date with `{{ item.dt_txt | slice: 0 : 10 }}`. Why a string pipe on a date, and what does that cost?** ⭐

`dt_txt` arrives from OpenWeatherMap as the string `"2025-03-14 12:00:00"`, so slicing the first ten characters yields the date with no parsing at all. The cost I accept is that it renders ISO order rather than a locale format, and that it depends on the API's exact string shape — a change of format there becomes a display bug rather than a type error. `DatePipe` over `item.dt` (the Unix timestamp the API also sends) is the correct upgrade, and it is what I would write the moment the screen has to be readable in more than one locale.

**[02-weather-app-029] PLANNING.md names `search-bar`, `current-weather` and `forecast-card` under a global `services/`. The code has `weather-form`, `weather-card` and `weather-forecast` inside the feature. What changed while you built it?** ⭐⭐

Two things. The names moved to a `weather-` prefix so the selectors read as one feature's vocabulary rather than three generic widgets, and `services/` moved inside `pages/weather-page/` once it was clear `WeatherService` had a single consumer. The real change is `forecast-card`: the plan had a component per day and the code has one `WeatherForecast` that renders the whole list, because the `@for` and the `@if (forecast().length > 0)` guard belong to the list, and splitting a card out would have handed a child one item and kept every list-level decision in the parent anyway.

**[02-weather-app-072] `main.ts` ends with `.catch((err) => console.error(err))`. What failure does that catch, and is a `console.error` an acceptable answer to it?** ⭐

`bootstrapApplication` returns a promise that rejects when the application fails to start at all — a provider that throws while being constructed, or the root component failing to instantiate — which is before any component, template or error handler of mine exists. I kept the CLI's `console.error` because at that point the only thing that has certainly booted is the browser, so there is no Angular surface left to render a message into. The honest upgrade is to write a static fallback into `index.html` and reveal it from that `catch`, so a boot failure is a visible page rather than a blank screen with a console line.

**[02-weather-app-073] Every component has its own `styleUrl` and `App` has none. What is scoping those styles, and what happens to `.container` and `.weather-card` at runtime?** ⭐⭐

Angular's default emulated view encapsulation rewrites each component's CSS with a generated attribute selector and stamps that attribute onto the elements of that component's template, so `.weather-card` in `weather-card.css` cannot reach anything outside `WeatherCard`. I chose to leave the default rather than reach for `ViewEncapsulation.None` or a global stylesheet, because it means a class name like `.container` or `.forecast-item` can be as generic as it reads without me having to invent a naming convention to keep it from colliding. `App` has no `styleUrl` because it renders nothing but `<router-outlet />` — there is no element there to style.

**[02-weather-app-074] The screen's state is four independent signals — `weatherResponse`, `forecastResponse`, `errorMessage`, `isLoading`. Why four, rather than one signal holding a state object or a discriminated union?** ⭐⭐⭐

I chose four because each one binds to a different part of the template and each is written independently by the request lifecycle, so four `set` calls in `onCitySearch` read as the state machine itself. The cost I accept is that nothing in the type system forbids an impossible combination — loading and an error at once, or a response beside an error message — and what actually prevents it is the discipline of clearing all four at the start of every search. A `signal<{ status: 'idle' | 'loading' | 'loaded' | 'error' }>` union would make those states unrepresentable instead of merely unreached, and that is the refactor I would make the moment a fifth flag appeared.

**[02-weather-app-075] The initial Madrid search runs from `ngOnInit`, and the class declares `implements OnInit` for it. Why that hook rather than the constructor or a field initializer?** ⭐⭐

`ngOnInit` runs after Angular has set the component's inputs and before the first render, which is the earliest point at which starting a request is unambiguously safe; a constructor or a field initializer runs while the class is still being built, so an effect fired there is a side effect in the middle of construction. `implements OnInit` is what makes that a checked contract — a typo in the method name becomes a compile error instead of a hook that silently never runs. `WeatherPage` has no constructor at all because `inject()` covers the dependencies, so the lifecycle hook is the only place left where "do this once at startup" belongs.

**[02-weather-app-076] The files are `weather-page.ts` and `weather-card.ts`, and the classes are `WeatherPage` and `WeatherCard` — no `.component` suffix, no `Component` suffix. PLANNING.md wrote `weather-page.component`. Why the difference?** ⭐

The plan was written in the older convention and the code follows the Angular 20 CLI, which stopped appending `.component` to generated filenames and class names. I kept the generated shape rather than renaming back, because the suffix repeated information the `@Component` decorator already states and the folder already implies. It does mean a reader has to open a file to know whether `weather.utils.ts` and `weather-card.ts` are the same kind of thing, which is the tradeoff — and it is why the service and the model kept their `.service` and `.model` suffixes, where the type is not obvious from the name.

**[02-weather-app-077] `WeatherForm` emits `output<string>()` — a bare city name. Why is the child's contract a primitive rather than an event object or the `KeyboardEvent` that triggered it?** ⭐⭐

The parent needs exactly one thing to run a search, so I decided the output should carry that and nothing else: `onCitySearch(city: string)` can be called from `ngOnInit` with a literal precisely because its argument is not tied to a DOM event. Emitting the `KeyboardEvent` would have made the page reach into `event.target.value` and re-do work the child already did, which is how a "dumb" component leaks its implementation upward. If the form ever emitted units or a language alongside the city I would widen it to a typed object rather than add a second output, so the two values stay one submission.

**[02-weather-app-078] `App` uses `templateUrl: './app.html'` for a template that is a single `<router-outlet />`. Why a separate file for one line?** ⭐

Consistency: every component in the project keeps its template in its own `.html` file, so there is one place to look regardless of how big the template happens to be today. An inline `template` would save a file now and be reverted the first time the shell grew a header or a footer, and the intermediate state — some components inline, some not — is the one I actually want to avoid. The rule I apply is per project, not per component size.

**[02-weather-app-079] `WeatherService` imports the environment as `'../../../../environments/environment'`. Four levels up — is that not a sign the file is in the wrong place?** ⭐

It is a sign of how deep the feature folder is, not of the environment file being misplaced: `environments/` sits beside `app/` because the CLI's `fileReplacements` in `angular.json` targets those exact paths, and the service is four folders down because the structure is feature-first. What I would fix is the import rather than the layout — a `paths` alias in `tsconfig.json` such as `@env/*` would make it `'@env/environment'` and stop the depth of a folder from being encoded in a string that breaks when the file moves.

**[02-weather-app-080] Both icon `<img>` tags are written `alt=""`. Was that an oversight, and how do you defend it to an accessibility review?** ⭐

I chose the empty `alt` deliberately: in `weather-card.html` the icon sits beside `{{ weather()!.weather[0].description }}` and in `weather-forecast.html` beside the same field per day, so the image carries no information the surrounding text does not already state. An empty `alt` is what marks an image as decorative, and a screen reader skips it instead of announcing the icon's file code twice over. The honest limitation is that it is only correct while the description stays on screen — if I ever dropped that line to save space, the icon would become the only carrier of the condition and would need a real `alt` derived from it.

**[02-weather-app-081] None of your three children use `input.required()` — every input is optional. Why not require the data a display component cannot render without?** ⭐⭐

Because on this screen an absent value is a real state, not a mistake: `WeatherCard` is rendered unconditionally by the page and receives `weatherResponse()`, which is deliberately `null` before the first response and between searches, so requiring the input would make the correct state impossible to express. `WeatherForecast` is the same case with `[]` standing in for the absence. I decided the guard belongs in the template — `@if (weather())` and `@if (forecast().length > 0)` — rather than in the input signature, and `input.required()` would be the right call for a child the parent only ever renders inside an `@if` of its own.

**[02-weather-app-082] The loading indicator is a bare `<div class="spinner"></div>` in the page template with a `@keyframes` rule in `weather-page.css`. Why not a spinner component?** ⭐

I decided a component earns its existence when it has behaviour or a second consumer, and this one has neither — it is a div, a border and a rotation, used once, by the component that owns the `isLoading` signal it reads. Extracting it would move markup away from the state that drives it and buy nothing back. What I did spend effort on is the `@media (prefers-reduced-motion: reduce)` rule that slows the rotation to 2.4s rather than removing it, so the feedback survives for a user who asked the browser to calm animations down.

**[02-weather-app-083] Component styles are encapsulated, yet `weather-page.css` reads `var(--border)` and `var(--accent)`. How does a value from `styles.css` cross a boundary that stops class names?** ⭐⭐

Because view encapsulation scopes *selectors*, not inherited values: Angular rewrites `.spinner` so it cannot match outside the component, but a custom property declared on `:root` in the global `styles.css` inherits down the DOM and is readable from inside any component's rules. I chose that split on purpose — the global sheet holds the palette and the reset, and every component holds only its own layout — so a colour change is one edit in one file while no component can reach into another's structure. It is also why the tokens are CSS variables rather than a shared SCSS file: a preprocessor variable would be inlined at build time and each component would carry its own frozen copy.

## Business Rules

**[02-weather-app-030] `forkJoin` means the screen shows nothing unless *both* requests succeed. Why is a working current-weather reading thrown away because the forecast failed?** ⭐⭐⭐

I decided this screen is one unit: the card and the five-day list are two views of the same question, and a half-rendered answer beside an error message is a worse state than a clean failure the user can retry. `forkJoin` gives me that rule for free — it emits only when both inner observables complete, and a single failure routes straight to my `error` callback, where both response signals have already been cleared at the start of `onCitySearch`. The tradeoff is real: if OpenWeatherMap degraded one endpoint I would lose data I actually have, and the fix would be `forkJoin` over two streams each carrying its own `catchError` fallback, so a partial render becomes possible on purpose rather than by accident.

**[02-weather-app-031] Your `error` callback ignores the error object entirely and always sets `'City not found. Please try again'`. What is wrong with that rule?** ⭐⭐⭐

It is the honest description of the *expected* failure — a 404 from a city name that does not exist — and it is wrong for every other one. A 401 from a bad API key, a 429 from the rate limit and a dropped connection all reach the same callback and all tell the user the city is wrong, so the only message the app has actively misdirects the person who could not have caused the failure. I chose the single message to keep the first version's state machine to three states, and the correct upgrade is to branch on `HttpErrorResponse.status`: 404 keeps this text, and everything else gets a "the service is unavailable, try again in a moment" that does not blame the input.

**[02-weather-app-032] `WeatherForm.submit()` trims and rejects an empty string, and that is the entire validation. Why no minimum length, no character filter, no check that the city exists?** ⭐⭐

Because only one of those is a rule the client can actually know. "Is this a city" is answered by OpenWeatherMap and by nothing on my side, so any local check would either duplicate the API's answer imperfectly or reject a name the API would have accepted — an accented or two-character city, for instance. I decided the client enforces only what is decidable locally: a submission with no content is not a search, so the guard stops it before a request is spent on it, and everything else is delegated to the response. The blank-search guard earns its place precisely because it is the one case where the request is guaranteed to be wasted.

**[02-weather-app-033] Nothing on this screen stops the user from pressing Enter five times in a row. What happens, and what does `forkJoin` not protect you from?** ⭐⭐

Five independent `forkJoin` subscriptions start, and nothing cancels the earlier ones — `takeUntilDestroyed` only unsubscribes when the page is destroyed, which is not what happens here. So the signals are written by whichever pair of responses arrives last in *time*, not by the last search the user made, and a slow first request can overwrite a fast second one and leave the wrong city on screen. I decided against solving it in the first version because the failure needs a specific latency ordering, but the correct fix is to make the search a `Subject` piped through `switchMap`, which cancels the in-flight request on every new term; disabling the button while `isLoading()` is true is the cheap half-measure that closes the common case.

**[02-weather-app-034] The page template has three independent `@if` blocks — spinner, error, card — and no `@else` anywhere. What actually guarantees you never see two of them at once?** ⭐⭐

The ordering inside `onCitySearch`, not the template. Its first four lines set `isLoading` true and clear `weatherResponse`, `forecastResponse` and `errorMessage`, so the moment a search starts there is exactly one thing on screen; `next` fills both responses and drops the flag in the same callback, and `error` sets the message and drops the flag. I chose to make the invariant a property of the one method that owns every transition rather than of the markup, because an `@if/@else` chain expresses two-way exclusion and this screen has three states across four signals. The cost is that a reader of the template alone cannot see the rule — it is enforced upstairs.

**[02-weather-app-035] `dailyForecast` filters on `dt_txt.includes('12:00:00')`. What is the rule, and when does it not give you five days?** ⭐⭐

The rule is one representative reading per day, and I chose noon because it is the entry a person actually means by "what will Tuesday be like". The API returns forty three-hourly slots covering five days from *now*, so the current day only has a 12:00 slot if the search happens before midday — search in the afternoon and the filter yields four rows while the heading still says "5-day forecast". I accepted that because the list renders whatever it is handed and a short list is not a broken screen, but the robust version groups the entries by date and picks the reading closest to noon within each group, which returns a row per day regardless of the hour of the search.

**[02-weather-app-036] `units=metric` is fixed in `WeatherService.buildParams()`. What does that decide for the whole screen?** ⭐⭐

It decides that temperature is Celsius everywhere, and that the `ºC` suffix hardcoded in both templates is always true — the unit is not a display choice made per component, it is a property of the request. I chose to set it in `buildParams` because both endpoints need it identically, and the alternative, converting Kelvin in the components, would put the same arithmetic in two templates and make the suffix a claim nothing enforces. The day a unit toggle is a feature, the parameter becomes an argument of `getWeather`/`getForecast` and the suffix is derived from the same signal — which is exactly why the conversion should not have been scattered into the views.

**[02-weather-app-037] Both temperatures are rendered `| number: '1.0-1'`. Why that format string rather than the raw value?** ⭐

It means at least one integer digit and between zero and one decimal, so `12` renders as `12` and `12.34` as `12.3`. I chose it because the API's precision is not meaningful for a weather reading — nobody acts on a hundredth of a degree — and an unformatted value would let the card's layout jump as the number's length changed. The rule is display-only: the signal keeps the API's number and only the template rounds it, so nothing downstream ever inherits a rounded value.

**[02-weather-app-038] When there is no data, the card and the forecast render nothing at all — no "search a city" message, no placeholder. Is that a decision or an omission?** ⭐⭐

It is a decision that an absent state should be silent rather than noisy: `@if (weather())` and `@if (forecast().length > 0)` mean each component disappears when it has nothing true to say, so the screen never shows a frame full of dashes. In practice the state is barely reachable, because `ngOnInit` fires a search immediately and the only other route to it is a failed request, where the error message *is* the message. What I would add if the initial search were removed is a first-run empty state under the form, since a bare search box with nothing beneath it is a screen that does not explain itself.

**[02-weather-app-040] If the very first request — the `ngOnInit` search for Madrid — fails, the user is shown "City not found. Please try again" before typing anything. Defend that.** ⭐⭐

I would not defend the message, only the structure that produced it. Reusing `onCitySearch` for the initial load is what keeps a single set of state transitions in the app, and the price is that the bootstrap inherits the error text, which reads as an accusation about input the user never gave. A failure there is almost certainly the key, the network or the rate limit rather than the city, so it is the same defect as the untyped `error` callback: once the message branches on `HttpErrorResponse.status`, the bootstrap case gets the service-unavailable text automatically and this question stops existing.

**[02-weather-app-041] Nothing in the app remembers what was searched — no signal holds the term, the input keeps whatever was typed, and the URL never changes. What does that forbid?** ⭐⭐

It forbids sharing or bookmarking a city, restoring the last search on reload, and showing the searched name anywhere except inside the response, where `weather()!.name` is the API's spelling rather than the user's. I chose to leave it out because the screen has one route and the response already carries the city it resolved to, so a `searchTerm` signal would be state duplicated from the data it triggered — PLANNING.md planned one and the code has none, which is the plan changing under contact with the code. The version that earns its place is a `:city` route parameter, because that makes the URL the state and buys bookmarking, reload and the back button in one move.

**[02-weather-app-042] PLANNING.md lists wind speed among the key features and the card shows humidity and "feels like" instead. Which rule changed?** ⭐⭐

The plan named the four fields a weather card usually shows, and while building I chose the three a person actually reads together: the temperature, what it feels like, and the humidity. `WeatherMain` in `weather.model.ts` reflects that — it declares `temp`, `feels_like` and `humidity` and nothing else, so the omission is typed rather than accidental, and wind would arrive as a new field on the interface plus a line in the template. I would rather narrow the plan deliberately than ship a fourth number nobody asked for; the honest debt is that PLANNING.md's feature list was never brought back into line with what the screen shows.

**[02-weather-app-043] A search that succeeds but whose forecast holds no `12:00:00` entry renders exactly the same screen as an app that has never searched. Why is that acceptable, and what does it hide?** ⭐

Because `dailyForecast` is a `computed` that returns `[]` both for a null response and for a response the filter matched nothing in, and `@if (forecast().length > 0)` cannot tell those apart — so "no search yet", "the forecast failed" and "the API answered with nothing at noon" all collapse into an empty region under the card. I accepted the conflation because the reachable case is benign: the late-afternoon search that yields four rows instead of five still renders, and a genuinely empty list needs the API to return a `list` with no noon slot at all. What it hides is a real success-with-no-results state, and the fix is for the child to distinguish "not asked" from "asked and empty" — an input that can be `null` as well as `[]`, exactly as `WeatherCard`'s already is, with the empty case rendering a line rather than nothing.

**[02-weather-app-044] `errorMessage` is a `signal<string>('')` and the template tests `@if (errorMessage())`. Why is "no error" the empty string rather than `null` or a boolean plus a message?** ⭐

I chose the empty string because it makes the signal both the flag and the text, so there is one thing to clear at the top of `onCitySearch` and one thing to test in the template, and Angular's truthiness check on a string does the rest. The cost is that the state relies on a falsy value rather than an explicit one: an error whose message was legitimately empty would silently render as "no error", and nothing in the type stops a caller from writing `''` and meaning "cleared" when it meant "failed with no detail". The version that scales is a single `state` signal holding a discriminated union of `idle | loading | loaded | error`, which is where this screen would go the moment a fourth state appears — right now three signals across four transitions is still cheaper to read than the machinery.

**[02-weather-app-084] An empty submit is rejected by `if (!city) return;` — nothing is emitted, and nothing appears on screen either. Is silence the right answer to an invalid input?** ⭐⭐

I decided the guard's job was to stop a request that was guaranteed to be wasted, and I stopped there: the user presses Enter on an empty box and the screen does not change, so the only feedback is the absence of a spinner. That is defensible while the input is one obviously empty field the user just left blank, and it stops being defensible the moment a rule is less visible than "you typed nothing" — a minimum length or a character filter would reject a value that looks fine and say nothing about why. The fix that matches the rest of the screen is for the form to own a message signal of its own and render it under the input, since `errorMessage` upstairs belongs to the request and this failure never reaches a request.

**[02-weather-app-085] `weather-form.html` has no `<form>` element and no `type="submit"` — it is a `<div>` with an `#city` input wired to `(keyup.enter)` and a button wired to `(click)`. What do you lose by not using a form?** ⭐⭐

I lose the browser's own submission semantics: implicit submission, `required`/`pattern` validation, and the fact that a screen reader and a password manager both recognise a `<form>` as a thing you complete and send. I chose the two explicit handlers because they made the one behaviour I needed — read the field and emit — visible in the template with no `ReactiveFormsModule` and no `FormGroup` behind them, and because `(keyup.enter)` and the click end up calling the identical `submit(city.value)`, so there is a single path either way. The honest cost is that I reimplemented Enter-to-submit rather than inheriting it, and a real form with more than one field is where I would stop doing that.

**[02-weather-app-086] After a successful search the input still holds the typed city, and nothing resets it between searches. Deliberate?** ⭐⭐

Yes: the field is the only place the searched term survives at all — no signal holds it and the URL never changes — so clearing it would leave the user with a card for a city whose name is now only in the API's spelling inside the response. I decided keeping the value is the friendlier rule too, because correcting a typo is an edit rather than a retype. What it permits is submitting the same term repeatedly, which fires a fresh pair of requests every time, since neither the form nor the page compares the new term against the last one.

**[02-weather-app-087] Both temperatures go through `| number: '1.0-1'` and humidity is interpolated raw as `{{ weather()!.main.humidity }}%`. Why is one field formatted and the other trusted?** ⭐

Because they are different kinds of number: OpenWeatherMap sends humidity as a whole percentage, so there is no fractional part for a format string to control, while `temp` and `feels_like` arrive with decimals the reading does not justify. I decided to format only where the API's precision would otherwise leak into the layout, since a pipe on a value that is always an integer is ceremony that hides no risk. The assumption I am making is that humidity stays integral — my `WeatherMain` types it as `number` and would not stop a fractional one from rendering as `62.4%`.

**[02-weather-app-088] `ForecastItem` carries the same `WeatherMain` as the card — `humidity` and `feels_like` included — and the forecast row renders neither. Why does the same data get two different treatments?** ⭐

Because the two surfaces answer different questions: the card is the detailed reading for right now, and a forecast row is a glance across five days where temperature, condition and icon are what a person compares. I decided that showing five humidities would add a column nobody scans and make the row harder to read at a glance, so the omission is a display rule rather than a data limitation — the fields are typed and available the day the row earns them. Sharing `WeatherMain` between the two interfaces is what makes that a choice: the model records what the API sends, and each template decides what its own surface shows.

**[02-weather-app-089] The spinner is a bare `<div class="spinner">` and the error is a bare `<p>`. A sighted user sees the screen change state; what does a screen-reader user get?** ⭐⭐

Almost nothing: neither node carries `role="status"`, `role="alert"` or `aria-live`, so the spinner appearing is an unannounced empty element and the error text is inserted into the page silently unless the user happens to be reading past it. I decided the visual state machine before the announced one and that is the gap — the three states are mutually exclusive and correct on screen, and only on screen. The fix is small and I would make it: `role="status"` with an `aria-live="polite"` region for the loading text, `role="alert"` on the error paragraph so it is announced the moment `errorMessage()` becomes non-empty, and a visually hidden word inside the spinner so it is not an anonymous rotating box.

**[02-weather-app-090] `onCitySearch` sets `weatherResponse` and `forecastResponse` back to `null` before the request goes out, so the city already on screen vanishes the instant a new search starts. Why clear rather than leave the old reading up while the new one loads?** ⭐⭐

I decided that a card showing Madrid while the user is loading Lisbon is a screen that is actively lying, and the spinner underneath it does not repair that — the reading is stale and nothing in the markup says so. Clearing first makes the invariant trivial: from the first line of `onCitySearch` there is exactly one thing rendered, and the three `@if` blocks never have to know whether their data belongs to the term that is in flight. The cost is a flicker on a fast connection, and the version that keeps both properties is to hold the previous response and dim it while `isLoading()` is true — a stale-while-revalidate rule I would only pay for once the requests were slow enough to notice.

**[02-weather-app-091] `buildParams()` sends `q` with nothing but the raw city name — no country code, no `limit`, no geocoding step. What does the screen do when the name is ambiguous?** ⭐⭐

It silently takes whatever OpenWeatherMap picks: `q=Springfield` resolves to one of many, and the only signal the user gets is `weather()!.name` in the card, which is the API's resolved name and not their input. I decided against a disambiguation step because the endpoint already accepts `city,countryCode` for the user who knows it, and building a picker would mean adding the geocoding endpoint plus a second screen state for a case a five-day weather demo rarely hits. What I would not defend is the silence: since the card already renders the resolved name, the honest minimum is to present it as a confirmation of what was matched rather than as a heading the user reads past.

## Technical Decisions

**[02-weather-app-045] You have `environment.ts` and `environment.development.ts`, swapped by a `fileReplacements` entry in `angular.json` — and today both files hold the exact same key. Why keep two?** ⭐⭐

I chose to keep the split because it is the seam the CLI already gives me: `ng build` reads `environment.ts` and `ng serve` replaces it with `environment.development.ts`, so the day the two values diverge — a throttled dev key, a different base URL, a flag — nothing about the code has to change. Today they are identical because a free OpenWeatherMap key is the only credential the app has, and I decided that duplicating one value was cheaper than removing a mechanism I would have to rebuild. The cost I accept is that the two files can silently drift, since neither is in the repository to diff.

**[02-weather-app-046] `set-env.js` is a plain Node script that writes `src/environments/environment.ts` from `process.env.API_KEY`. Why generate the file instead of committing it?** ⭐⭐

I decided that the deploy needed the file and the repository must not have it, and a generator is the only thing that satisfies both: Netlify has no `src/environments/` after a clean checkout, so the build runs `set-env.js` first and materialises the file from the environment variable the platform holds. That keeps the credential in exactly one place a human manages — the Netlify UI — instead of in git history, where a rotated key stays readable forever. Locally I write the same two files by hand, which the README documents as a setup step.

**[02-weather-app-047] The key ends up in `environment.apiKey`, imported by `WeatherService`, compiled into the bundle. So what did the environment file actually protect?** ⭐⭐⭐

It protected the repository and the git history, and nothing else — I am explicit about that in the README and in PLANNING.md, which says "keep the API key out of the repository — not out of the bundle". Anything the browser sends to OpenWeatherMap the browser can be made to reveal, so a frontend-only app cannot hide a key by construction; the only real fix is a backend or a serverless proxy that holds the credential and signs the request. I chose the free-tier key plus the environment split because a proxy was out of scope for project 02, and I would name that tradeoff before an interviewer does.

**[02-weather-app-048] `.gitignore` ends with `src/environments/*` — the whole folder, not the one generated file. Why the wildcard?** ⭐⭐

I chose the wildcard because both files carry the same secret: `environment.development.ts` is the one I hand-write locally and it holds the real key just as the generated one does, so ignoring only `environment.ts` would have committed the credential through the other half of the pair. Ignoring the folder means the rule cannot be defeated by adding a third environment file later. The price is that the folder's *shape* is undocumented in the repo, which is why the README spells out both filenames and the exact contents to create.

**[02-weather-app-049] If `API_KEY` is not set when `set-env.js` runs, what does the generated file contain?** ⭐

It contains the literal string `'undefined'`, because the script interpolates `process.env.API_KEY` into a template literal with no check at all, and the build then succeeds — the failure surfaces as a `401` from OpenWeatherMap, which my error callback reports to the user as "City not found. Please try again". I decided against a guard when I wrote it, and looking at it now the honest fix is three lines: throw if the variable is missing, so a misconfigured deploy fails at build time rather than as a wrong error message in production.

**[02-weather-app-050] `set-env.js` uses `require` and CommonJS in a project that is otherwise ESM and TypeScript. Is that a mistake?** ⭐

No — it is deliberate, and the reason is when it runs: the script executes under bare Node before the Angular build starts, so it is never compiled, never type-checked and never part of the bundle, and CommonJS is what Node runs without a `type` field or a build step of its own. I chose the smallest thing that works at that point in the pipeline rather than dragging `ts-node` into a project that needs one `fs.writeFileSync`.

**[02-weather-app-051] `baseUrl` is a `private readonly` field on `WeatherService`, hardcoded to `https://api.openweathermap.org/data/2.5`, while the key sits in the environment file. Why is one configurable and the other not?** ⭐⭐

I split them by what actually varies: the key differs per developer and per deploy and must stay out of git, whereas the API host is the same in every environment of this app and is public information. Putting the URL in the environment file would have added a second value to keep in sync across two untracked files for no benefit. If I ever needed a staging host or a proxy in front of the API, that field is the one line that moves into `environment`.

**[02-weather-app-052] `buildParams()` returns `new HttpParams().set('q', city)...` instead of interpolating the city into the URL string. What does that buy you?** ⭐⭐

`HttpParams` encodes the values for me, which matters the moment a user types a city with a space or an accent — "Santa Cruz de Tenerife" or "Málaga" would produce a malformed URL by string concatenation and a correct one here. I chose it because it also keeps the URL and its parameters as separate concepts: the endpoint is `${baseUrl}/weather` and the query is data, so adding `lang` is a `.set()` and never a string edit. It is the same reason I would never build a query by hand on the server either.

**[02-weather-app-053] `HttpParams` is immutable — every `.set()` returns a new instance. Does that matter in a chain of three?** ⭐

Not for correctness here, because I chain the calls and use the final value, which is exactly the pattern the immutable API is designed for. It would matter if I ever wrote `params.set(...)` on its own line and expected `params` to have changed — a real and common bug, since the call looks like a mutation and silently discards the result. I decided the chained form is also the honest one: it makes the "each call produces a new object" behaviour visible in the shape of the code.

**[02-weather-app-054] Both service methods call the same private `buildParams(city)`. Why a helper for three `.set()` calls?** ⭐⭐

Because the two endpoints must agree: `q`, `appid` and `units=metric` are the same for `/weather` and `/forecast`, and the failure mode of duplicating them is the one that is hardest to see — Celsius on the card and Kelvin in the forecast, from one line someone forgot to change in the second copy. I chose `private` because the parameters are an implementation detail of this service and no caller should be able to build a half-configured request. It also means a new query parameter is added once.

**[02-weather-app-055] `this.http.get<WeatherResponse>(...)` — what does that generic actually guarantee about the JSON you get back?** ⭐⭐⭐

Nothing at runtime. It is a compile-time assertion: TypeScript trusts me that the response has that shape, the template gets autocomplete and type errors, and the emitted JavaScript contains no check whatsoever — if OpenWeatherMap renamed `feels_like` tomorrow, the build would still pass and the card would render `undefined`. I chose it because it is the standard Angular idiom and the right cost/benefit for a project consuming one stable public API; where the payload really mattered I would validate at the boundary with something like Zod and derive the type from the schema instead of writing it twice.

**[02-weather-app-056] `getWeather` returns the `HttpClient` observable untouched — no `map`, no `catchError`, no `retry`. Isn't error handling the service's job?** ⭐⭐

I decided the service's job here is to describe the two endpoints and nothing more, and to let the caller choose the failure policy — which matters because `WeatherPage` combines the two calls with `forkJoin` and needs one decision for the pair, not two independent ones a `catchError` inside the service would already have swallowed. The consequence is that every consumer must handle errors, and today there is exactly one. If a second screen appeared, the first thing I would add is a `catchError` that maps the HTTP status to a typed domain error, so the page stops inferring "city not found" from any failure at all.

**[02-weather-app-057] Neither service method declares a return type — both are inferred. Why not annotate `Observable<WeatherResponse>`?** ⭐

The inference is exact here, because the generic on `get<T>` fully determines it, so the annotation would restate what the line above already says. I chose inference for brevity, and I would change my mind at a boundary I wanted to freeze: an explicit return type makes the public contract of a service a compile error to break, instead of something that silently widens when the body changes. On a shared library that is the right default; on a one-consumer service in a portfolio project it is ceremony.

**[02-weather-app-058] `WeatherResponse` has three fields. The real OpenWeatherMap payload has around twenty, with `coord`, `wind`, `sys`, `visibility`. Why model so little?** ⭐⭐⭐

I chose to model only what the screen consumes, because the interface is a contract for *my* code, not a transcription of the vendor's response — the extra fields still arrive in the JSON and are simply not typed, so nothing is lost at runtime. It keeps the model file readable and it makes the coupling explicit: what is in there is what the app depends on, so a breaking API change is visible as a compile error in a file of twenty lines. The cost is that adding wind speed — which PLANNING.md listed and I dropped — means editing the interface first, which I consider the right friction.

**[02-weather-app-059] `WeatherMain` and `WeatherCondition` are extracted and reused by both `WeatherResponse` and `ForecastItem`. Was that worth two extra interfaces?** ⭐⭐

Yes, and for a reason beyond avoiding duplication: the two endpoints genuinely return the same sub-objects, so extracting them records a fact about the API rather than a coincidence of my code. The payoff is concrete in the components — `getIconUrl(item.weather[0].icon)` works identically on a current reading and on a forecast item because both are `WeatherCondition[]`, and the same `| number: '1.0-1'` formats both temperatures. I decided to share only where the API really shares; `dt_txt` stays on `ForecastItem` because only the forecast has it.

**[02-weather-app-060] `ForecastResponse` is `{ list: ForecastItem[] }` — you dropped `city`, `cnt` and `cod`. What did that cost you?** ⭐

It cost me the city name from the forecast endpoint, which I do not need because `WeatherResponse.name` already supplies it to the card, and `cnt`, which I do not need because I filter the list myself. I decided to keep the wrapper rather than type the method inline so the shape has a name the page can import. If I later wanted the forecast's timezone offset to render local times instead of the raw `dt_txt`, that is where the field would go back in.

**[02-weather-app-061] Your interfaces carry `feels_like` and `dt_txt` — the API's snake_case — straight into the templates. Why no mapping layer to a camelCase domain model?** ⭐⭐⭐

I decided against a mapping layer because it would have been a second set of interfaces and a `map` operator per endpoint to rename fields, in a project where the API shape *is* the domain — there is no business model here that the vendor's payload is a poor fit for. The cost is real and I would name it: the vendor's naming leaks all the way into `weather-card.html`, so a rename upstream touches templates, and my code reads inconsistently against the camelCase everywhere else. In an app with real domain rules I would map at the service boundary precisely so the rest of the codebase never learns who the provider is.

**[02-weather-app-062] The page and the service import the models with `import type`, but `WeatherForecast` imports `ForecastItem` without it. Deliberate?** ⭐

`import type` states that the import exists only for type-checking, so the compiler erases it and can never emit a runtime import for a file that contains nothing but interfaces — under isolated, file-by-file transpilation that distinction is what stops a phantom import from surviving into the bundle. The inconsistency in `weather-forecast.ts` is an oversight rather than a decision; interfaces are erased either way here, so nothing breaks, but I would make it uniform because the marker is documentation as much as it is a compiler hint.

**[02-weather-app-063] Every component in this app is signal-driven and not one of them sets `ChangeDetectionStrategy.OnPush`. Explain that.** ⭐⭐⭐

It is the CLI default left in place, and in this app it costs nothing measurable: the tree is four components deep, every input is a signal, and signals notify their own consumers, so what a signal-only component re-checks is bounded regardless of the strategy. Having said that, I would set `OnPush` on the three dumb components as a matter of discipline — it is one line, it is the shape every Angular codebase I would join uses, and it turns "this component only re-renders on signal changes" from an accident of how I happened to write it into something the class declares. The honest answer is that I did not weigh it and decline, I did not think about it.

**[02-weather-app-064] There is no `zone.js` anywhere in `package.json` and no `provideZonelessChangeDetection()` in `app.config.ts`. What is driving change detection, then?** ⭐⭐

The app is zoneless — Angular 21 scaffolds without `zone.js`, so change detection is driven by the signals themselves and by the framework's own notifications, not by a monkey-patched `setTimeout`. That is also why the `subscribe`-into-signal pattern in `WeatherPage` is safe: the `.set()` calls are what schedule the update, and had this been a zone-based app the same code would have worked for an entirely different reason. I decided to stay on the default because the whole state layer is signals already, which is exactly the case zoneless is for.

**[02-weather-app-065] PLANNING.md lists `SlicePipe` under "limit forecast list in the template", and in the code it slices ten characters off a date string. Which one is the decision?** ⭐⭐

The code is. I planned to render only some of the forecast entries with `slice` in the template and ended up filtering in a `computed()` instead, because the rule I actually needed — one entry per day, the `12:00:00` one — is a predicate and not a range, and `SlicePipe` cannot express it. The pipe survived in a different job, cutting `"2026-09-07 12:00:00"` down to its date half, so the plan's line is stale about *why* the pipe is there rather than wrong about it being used.

**[02-weather-app-066] `routes` has one entry, `path: ''`, and no `**` wildcard. What does the app do if someone opens `/settings`?** ⭐

Nothing renders — the router matches no route, the outlet stays empty and the user gets a blank page with no error they can act on. I decided a 404 route was not worth adding to a single-screen app, and I would call that the wrong call in anything with real navigation: a `{ path: '**', redirectTo: '' }` is one line and turns a broken-looking page into a redirect. It is also the entry that stops being optional once deep links exist, since Netlify serves `index.html` for every path and hands the routing decision straight back to Angular.

**[02-weather-app-067] `angular.json` still carries the CLI's default 500 kB / 1 MB budgets and `outputHashing: "all"`. Did you tune them?** ⭐

No, and I checked that I did not need to: the app is four components, one service and no UI library, so it is nowhere near the warning threshold and a budget that never fires is a budget doing its job. I decided to leave `outputHashing` alone for the same reason — Netlify serves the hashed filenames with long cache headers and a rebuild invalidates them by name, which is exactly what I want on a static deploy. Tuning either of those before there is a bundle-size problem would be configuring for a project I do not have.

**[02-weather-app-068] OpenWeatherMap has a One Call endpoint that returns current conditions and the forecast in one response. You call `/weather` and `/forecast` separately and join them in the page. Why two requests?** ⭐⭐

I chose the two `/data/2.5` endpoints because they are what the free tier gives me: One Call 3.0 is a separate subscription that wants a card on file, and this is a portfolio project deployed on a free Netlify site. The cost is the one the page then has to pay — two round trips, a `forkJoin` to wait for both, and an all-or-nothing failure rule I would not have needed with a single call. If the key were ever upgraded, replacing both service methods with one `getOneCall()` would delete the `forkJoin` and most of `onCitySearch`, which is a good sign the split is the API's shape and not mine.

**[02-weather-app-069] `getWeather` and `getForecast` return a cold `HttpClient` observable every time, so searching "Madrid" twice fires four requests. Why no caching?** ⭐⭐

I decided that weather data is the wrong thing to cache without an expiry policy: the reading is only useful because it is current, so a `shareReplay(1)` on a per-city cache would serve a stale temperature and look like a bug. The honest version is a small `Map<string, {data, timestamp}>` in the service with a time-to-live of a few minutes, which is what I would add the moment there were a rate limit to respect — the free tier allows sixty calls a minute and one user typing city names never approaches it. I chose to leave the service stateless instead, which is also why it can stay `providedIn: 'root'` with nothing to invalidate.

**[02-weather-app-070] `tsconfig.json` runs `strict: true` with `strictTemplates` and `noPropertyAccessFromIndexSignature`. What do those actually buy you in an app this size?** ⭐

`strictTemplates` is the one that earns its place here: it type-checks the bindings, so passing a `WeatherResponse | null` into an input declared as non-nullable is a compile error in the template rather than an `undefined` in the browser — it is the reason `weather-card.html` has to say `weather()!` instead of silently rendering nothing. `strict` itself is what makes the null in `signal<WeatherResponse | null>(null)` mean something instead of being decoration. `noPropertyAccessFromIndexSignature` buys me nothing today and I will say so: it only bites on a type that has an index signature, and every interface in `weather.model.ts` declares its fields by name, so there is no `obj.foo` here the flag could force into `obj['foo']`. I chose to leave all three CLI defaults on anyway, because the cost of turning strictness on later — once a codebase has grown around its absence — is the one refactor nobody budgets for, and a flag that costs nothing until the day it catches a mistyped key on a `Record` is one I would rather inherit than have to add.

**[02-weather-app-071] The app uses the router's default `PathLocationStrategy` — real URLs, no `#`. On a static Netlify host, what does that decision oblige you to configure?** ⭐⭐

It obliges a rewrite rule on the host: with path-based URLs the browser asks Netlify for `/whatever` on a refresh or a deep link, and a static server has no such file, so it needs a `/* /index.html 200` redirect to hand the path back to Angular. I chose the default over `withHashLocation()` because clean URLs are what a real app ships and the hosting cost is one line of configuration, not a tradeoff. Today the app has a single route so nothing exercises it, but it is exactly the setup that fails silently in production and only in production, which is why I would rather name it than discover it.

**[02-weather-app-092] The `fileReplacements` entry lives in `angular.json`'s *development* configuration, so `environment.ts` is the production file and `environment.development.ts` is the replacement. The classic Angular convention is the other way round. Why invert it?** ⭐⭐

Because the file that has to exist by default is the one the deploy builds, and on Netlify that file does not exist until `set-env.js` writes it. `ng build` defaults to the `production` configuration and reads `environment.ts` with no replacement at all, so the generated file lands exactly where the default path already points; `ng serve` defaults to `development` and swaps in the hand-written one. I decided that inverting the convention was cheaper than teaching the deploy about a `.prod` suffix, and the cost is that a reader who knows the older `environment.prod.ts` shape has to open `angular.json` to see which file is which.

**[02-weather-app-093] `set-env.js` is not referenced by any script in `package.json` — `build` is a bare `ng build` — and there is no `netlify.toml` or `_redirects` file in the repo. Where does the deploy actually live?** ⭐⭐

In the Netlify UI: the build command there runs the script before `ng build`, and the SPA rewrite that `PathLocationStrategy` needs is a redirect rule configured on the site rather than a file in git. I decided that at the time because the dashboard was already where I was setting the `API_KEY` variable, and I would not defend it now — a checkout of this repo cannot reproduce its own deploy, and nothing in the tree tells a reader that the script is part of the build at all. The fix is two committed files: a `prebuild` script calling `node set-env.js`, and a `netlify.toml` carrying the command and the `/* /index.html 200` rule.

**[02-weather-app-094] `set-env.js` writes the whole body of `environment.ts` from a template literal holding one key. What happens the day the environment object grows a second field?** ⭐⭐

Production silently loses it. The script does not merge into the file, it overwrites it, so a field I add to `environment.development.ts` exists under `ng serve` and simply is not in the object `ng build` compiles — and since the generator authors the production side, the missing property is not even a type error unless I remember to change the generator too. I decided a one-field object made that acceptable, and it is also why there is no `production: boolean` flag here: the CLI's usual discriminator would be a second field the generator has to keep in step, for behaviour nothing in this app reads.

**[02-weather-app-095] `getIconUrl` builds `https://openweathermap.org/img/wn/${icon}@2x.png` — a second OpenWeatherMap host, hardcoded in `utils/`, outside both `WeatherService.baseUrl` and the environment file. Why does that one escape?** ⭐⭐

It is the same reasoning I applied to `baseUrl` — a public host that is identical in every environment — but applied in a second place, and that part I would not defend: the app now names OpenWeatherMap in two files that know nothing about each other, so moving off the provider means finding both. The `@2x` is deliberate, chosen for the size the card and the forecast rows render at, since the API's 1x icon looks soft on a high-density screen. If I consolidated, the icon base would sit on `WeatherService` beside `baseUrl` and the pure function would take it as an argument.

**[02-weather-app-096] `getIconUrl(icon: string): string` annotates its return type, while `getWeather` and `getForecast` annotate nothing. Which one is the rule?** ⭐

Neither yet, and that is the honest answer — the utility got an annotation because it was written as a standalone function, and the service methods did not because `get<T>` already infers them exactly. I decided the inconsistency was harmless since both are fully checked either way, but the rule I would actually state is the one from the service: annotate at a boundary you want to freeze. On that rule both carry an explicit type, because `getIconUrl` is exported from `utils/` with two consumers and the service is the app's only door to the API.

**[02-weather-app-097] `@angular/forms` sits in `dependencies` and nothing in `src/` imports it. Why is it there?** ⭐

It is the CLI's scaffold, left in place after I decided the search field needed neither `ngModel` nor a `FormControl` — the template reference variable in `WeatherForm` replaced the only use it would have had. I kept it rather than pruning because nothing imports it, so it is tree-shaken out and the cost is install size and not shipped bytes. The real cost is documentary: the dependency list stops describing what the app uses, which is the same drift as PLANNING.md still listing wind speed.

**[02-weather-app-098] The `test` target is `@angular/build:unit-test` with `vitest` and `jsdom` in `devDependencies` — no Karma, no Jasmine, no browser configuration. What did you pick, and what does it cost?** ⭐⭐

I took the Angular 21 default, which is the Vitest-based unit-test builder running in `jsdom` rather than the Karma-plus-real-browser setup older Angular projects ship. I chose to stay on it because there is no browser to launch in CI, and what these tests touch is component classes and a service rather than layout, which `jsdom` models well enough. The cost is that anything depending on real rendering or real CSS — the spinner's `@keyframes`, the encapsulated styles — cannot be tested this way, and the `test` target carrying no options block at all is the honest signal that I configured nothing here and accepted the builder's defaults.

**[02-weather-app-099] There is a `.prettierrc` with `printWidth: 100` and `singleQuote: true`, and no ESLint anywhere — no `@angular-eslint`, no `lint` script. Why formatting but not linting?** ⭐

Because only one of the two was costing me anything: formatting decisions are what produce noise in every diff, and Prettier removes them with no rules to argue about. I decided a linter is what I add when the codebase is big enough for a rule to catch something a read-through would not, and on four components I am reading every line anyway. What I lose is the Angular-specific checks — the template rules in particular — and adding `@angular-eslint` plus a `lint` script is what I would do before this project had a second contributor.

**[02-weather-app-100] None of the fields in `weather.model.ts` are `readonly`, so any consumer could reassign `weather()!.main.temp`. Was that considered?** ⭐

It was not, and I would defend the result rather than the process: these interfaces describe a payload the app only reads, and nothing between `HttpClient` and the templates writes to one. Marking every field `readonly` would state that invariant in the type rather than leaving it to convention, and that is the version I would write now — one keyword per line, turning an accidental mutation into a compile error. It matters more here than in a domain model because the objects are shared: the same `WeatherMain` is read by the card's template and by the `| number` pipe, so a mutation would be invisible at the point it broke something.

**[02-weather-app-101] `WeatherService` declares `private readonly baseUrl` but `private http = inject(HttpClient)` — the injected dependency is not `readonly`. Deliberate?** ⭐

No, an inconsistency. A field initialised with `inject()` is never reassigned by design, so `readonly` states what is already true and costs nothing; the constant beside it got the keyword and the injection did not because I wrote them at different moments. I would make every `inject()` field `readonly` as a rule, and the same correction applies to `WeatherPage`, where the service and the `DestroyRef` are declared the same way.

**[02-weather-app-102] `tsconfig.app.json` sets `"types": []` and excludes `src/**/*.spec.ts`. What do those two lines protect?** ⭐

`"types": []` stops TypeScript from pulling every ambient type package it finds in `node_modules` into the app's global scope, so application code cannot compile against Node or test globals that will not exist in a browser — `set-env.js` uses `process.env`, and this is the line that guarantees no file under `src/` can. The `exclude` keeps the specs out of the app build so a test-only import can never reach the bundle, and `tsconfig.spec.json` compiles them separately with the types they do need. I chose to leave both CLI defaults alone because together they encode the split between what ships and what does not.

**[02-weather-app-103] `package.json` pins `@angular/core` at `^21.2.0` — the current major — while a consultancy's codebase is more likely to be several versions behind. Why build a portfolio piece on the newest major?** ⭐

Because the features I wanted are the new ones: signal `input()`/`output()`, the built-in `@if`/`@for` control flow, standalone-by-default and the zoneless scaffold are all things a reviewer reads as current Angular, and writing the older equivalents would have made the project look older than it is. The risk I accepted is exactly the one in the question, so what I owe is the translation — being able to say what this same screen looks like with `NgIf`, `@Input()` and `zone.js` driving change detection. I decided that being current and able to translate backwards is a stronger position for a junior interview than matching whichever version the interviewer happens to run.

**[02-weather-app-104] `angular.json` names `@angular/build:application` as the build builder, not the older `@angular-devkit/build-angular:browser`. What changed underneath, and did you choose it?** ⭐⭐

I took the Angular 21 default rather than picking it deliberately, but I can defend it: `@angular/build:application` is the esbuild-and-Vite pipeline that replaced the webpack `browser` builder, which is why `ng serve` starts in about a second here and why there is no webpack config and no `.browserslistrc` anywhere in the tree. It also changes the output shape — an `application` build emits its client bundle under a `browser/` subfolder, so the Netlify publish directory has to point one level deeper than an older Angular project's would. I decided against opting back into the legacy builder because the only reason left to do that is a custom webpack loader, and this app has none.

**[02-weather-app-105] `package.json` pins Angular with `^21.2.0` but `rxjs` with `~7.8.0` and `typescript` with `~5.9.2`. Why two different range operators in one file?** ⭐

Those are the CLI's ranges and I kept them, because the distinction they encode is real: `^` allows minors, so Angular can pick up a `21.3` on a fresh install, while `~` allows patches only. TypeScript is pinned tight because the Angular compiler supports a stated TypeScript range and a minor bump can break the build, and `rxjs` is pinned tight because Angular's own peer dependency on it is narrow. I decided not to lock everything to exact versions instead, since `package-lock.json` is committed and already makes any install reproducible — the ranges only matter on the day I deliberately run an update.

**[02-weather-app-106] `buildParams()` hardcodes `units=metric`, so the app can only ever show Celsius. Why is that not a setting?** ⭐⭐

I chose to hardcode it because the alternative is not one query parameter, it is a feature: a unit toggle needs a state signal, a control in `WeatherForm`, a re-fetch or a client-side conversion on change, and a decision about persisting the choice — and the audience for this app is me and an interviewer, both of whom read Celsius. The cost is that the unit is invisible in the type system, so `main.temp` is a bare `number` whose meaning lives in a string three files away and the `°C` in the template is the only thing asserting it. If I added the toggle, the honest version would carry the unit on the signal beside the reading rather than re-deriving it from what the service happened to request.

**[02-weather-app-107] `weather` is typed `WeatherCondition[]` and every consumer writes `weather[0]`, yet `weather[0]` is never `undefined` to the compiler. What is holding that up?** ⭐⭐

Nothing but the API's behaviour — `noUncheckedIndexedAccess` is off, so TypeScript types an array index as the element type and not `T | undefined`, and `weather[0].icon` compiles even though an empty array would throw at runtime. I decided the risk was acceptable because OpenWeatherMap always returns at least one condition and the array is the vendor's shape rather than mine, so modelling it as a single object would have been a lie about the payload. The version I would defend on anything user-facing is turning that flag on and handling the empty case once at the boundary, instead of relying on a guarantee that lives in someone else's documentation.

**[02-weather-app-108] Beyond `strict`, `tsconfig.json` also sets `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` — and `skipLibCheck: true`. Isn't the last one the opposite of the other three?** ⭐

It is, and the asymmetry is the point: the first three check code I write and cost me nothing to satisfy, while `skipLibCheck` skips type-checking the `.d.ts` files inside `node_modules`, which is code I did not write and cannot fix. I chose to keep the CLI's combination because a type error in a dependency's declarations is not a bug I can act on — it is a version mismatch between two packages — and re-checking every Angular declaration file on each build buys nothing here. What I give up is the early warning that two dependencies disagree about a shared type, which then surfaces as a confusing error at my own call site instead.

**[02-weather-app-109] `tsconfig.json` targets `ES2022` and sets `"module": "preserve"`. What do those two lines decide?** ⭐

`target: "ES2022"` says how far the compiler may downlevel — at ES2022 native class fields and top-level `await` are emitted as written rather than rewritten into helper code, which is why `private http = inject(HttpClient)` compiles to a real class field. `"module": "preserve"` tells TypeScript not to rewrite my import statements at all, because the bundler is what actually resolves them; that is the setting that makes `import type` erasure and `isolatedModules` behave the way the esbuild pipeline expects. I decided to leave both at the CLI's values because they describe the toolchain rather than the app — changing either is a statement about which browsers and which bundler I am targeting, and I changed neither.

**[02-weather-app-110] The `development` configuration in `angular.json` turns `optimization` off and `sourceMap` on, and production does neither. Why not ship source maps too?** ⭐

Because a production source map hands a reader my unminified TypeScript, and in this app that includes `environment.apiKey` in plain sight — the key is in the bundle either way, but a source map is the difference between digging it out of minified output and reading it in the original file. I chose to keep the CLI's split for the ordinary reason as well: `optimization: false` and no minification are what make `ng serve` rebuild in milliseconds, and neither is something I want on a static deploy where bundle size is what the visitor pays. If I ever needed production stack traces I would upload the maps to an error tracker rather than serve them.
