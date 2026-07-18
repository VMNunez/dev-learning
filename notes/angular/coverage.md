# Minimum Coverage — Angular

Topics a junior must know to pass a technical screening for Angular roles at Spanish consultancies in 2026.
Scope is derived from what those screenings test, not from what the projects happen to use. Every item must be explainable out loud with a concrete example — ideally from the six Angular projects or TimeTrack, and where a concept has no home in them, from a minimal example built for the purpose.

## Components, inputs and projection
- `@Component` — selector, template, styles, `standalone: true`; interviewers ask what standalone means and why Angular 17+ uses it by default
- `imports` array on `@Component` — every directive, pipe, or component used in the template must be listed here; forgetting one causes a clear Angular error; interviewers ask why Angular 17+ moved away from NgModules
- `input()` and `output()` — signal-based component communication; interviewers ask "how does data flow between parent and child?"
- `input()` vs `input.required<T>()` — `input()` needs a default value or the type becomes `T | undefined`; `input.required<T>()` has no default and throws at compile time if the parent does not pass it; interviewers ask which one to use for a value the component cannot render without (e.g. an `id`)
- `model()` — signal-based two-way binding for a custom component (`[(value)]`); reviewers show `@Input()` + `@Output()` boilerplate built to fake two-way binding and ask for the signal-era replacement
- Template reference variables — `#ref` on any template element gives a typed handle to it; pass `ref.value` to a method without a signal or form control; interviewers ask how you read an input value without reactive forms
- `ng-content` — content projection; lets a parent inject arbitrary HTML into a child's template slot; interviewers ask how you build a reusable layout wrapper in Angular

## Template syntax and rendering
- Data binding: interpolation `{{ }}`, property `[]`, event `()`, two-way `[()]` — the four types; interviewers ask the difference between `[]` and `{{}}`
- `@if`, `@for`, `@empty`, `@else` — new control flow syntax; `@for` requires a `track` expression for performance; interviewers ask why `track` matters
- `@switch`, `@case`, `@default` — control flow alternative to chained `@if`/`@else if` when checking one value against several fixed options (e.g. a status field); interviewers ask when to reach for `@switch` instead of multiple `@if` blocks (readability once there are 3+ branches)
- `@let` — declares a local template variable from an expression, reused across the same template block without recalculating it; interviewers ask how you avoid calling the same `computed()` or method multiple times in one template
- `[class.x]` binding — applies a single CSS class when the condition is true; simpler and more readable than `ngClass` for a single class; interviewers ask the difference from `ngClass`
- `ngClass` — applies multiple CSS classes conditionally using an object map `{ 'class': condition }`; reach for it when two or more classes depend on component state; interviewers ask when to use it instead of `[class.x]`
- Calling a method directly in a template binding (`{{ getTotal() }}`, `[disabled]="isInvalid()"`) — re-runs on every change-detection cycle instead of once; reviewers show a slow component built this way and expect the fix to be a `computed()` or a pure pipe, not the method itself
- Safe navigation operator `?.` in templates — the template renders once before async/HTTP data arrives, so `user.name` throws "Cannot read properties of undefined"; `user?.name` renders nothing until the value exists; interviewers ask how you guard a template against not-yet-loaded data
- `@defer` blocks (`@placeholder`, `@loading`, triggers like `on viewport`/`on interaction`) — Angular 17+ template-level lazy loading that delays downloading a heavy component's code until needed; interviewers ask "how do you defer a heavy widget below the fold without a lazy route?"

## Lifecycle and tooling
- `@ViewChild` — accessing a child element or component from the class after the view is built; needed for `MatSort` and `MatPaginator` in `ngAfterViewInit`
- Lifecycle hooks: `ngOnInit` (run logic on load), `ngAfterViewInit` (first safe moment to use `@ViewChild`), `ngOnDestroy` (cleanup) — interviewers ask when each fires and why
- `constructor` vs `ngOnInit` — the constructor only wires up dependency injection and runs before Angular has set the component's inputs; `ngOnInit` runs once after the first input binding, so data fetching and any logic that reads an `input()`/`@Input()` value belongs there, not in the constructor; interviewers ask "why fetch data in `ngOnInit` and not the constructor?"
- Angular CLI essentials — `ng generate component/service/guard`, `ng serve`, `ng build` — interviewers ask how you scaffold a new feature and what the difference is between `ng serve` (dev server with live reload) and `ng build` (production bundle)

## Signals
- `signal()`, `signal.set()`, `signal.update()` — creating and mutating reactive state; `set()` replaces the value, `update()` uses the previous value; interviewers ask which one to use when adding an item to an array
- `computed()` — derived state that recalculates automatically when its dependencies change; used for filtered lists, stats, and role-aware UI; returns a value and cannot be set directly
- `effect()` — runs a side effect when a tracked signal changes; must be created inside a constructor or injection context, never outside; cannot modify a signal inside — that creates an infinite loop
- `computed()` vs `effect()` — `computed()` returns a derived value (filtered list, boolean flag); `effect()` performs a side effect with no return value (save to localStorage, sync to a non-reactive library); the most common mistake is using `effect()` to derive values when `computed()` is the right tool
- `effect()` + localStorage pattern — initialise a signal from localStorage, then use `effect()` to keep them in sync on every change
- Signal reference vs snapshot — `service.signal` (no parentheses) stores the live signal and stays reactive; `service.signal()` reads the value once and never updates; storing the snapshot in a property is a common bug
- Signal immutability — mutating an array/object in place (`items().push(x)`, `set(items())`) keeps the same reference, so `OnPush` and dependent `computed()`s never see a change; reviewers show in-place mutation and ask why the UI doesn't refresh (fix: `set([...items(), x])`)
- `signal.asReadonly()` — a service that exposes a writable signal lets any component call `.set()` on shared state directly; interviewers show a component mutating a service's signal and ask how you'd protect it

## Services and dependency injection
- `@Injectable({ providedIn: 'root' })` — what dependency injection is, what a singleton service means, and why Angular uses it instead of importing classes directly
- `inject()` — the modern way to inject a service; no constructor needed in Angular 17+
- `HttpClient` — making GET, POST, PUT, DELETE, PATCH calls with typed responses; interviewers ask "how do you call a REST API from Angular?"
- `HttpParams` — building query parameters programmatically for filtered API calls; used in TimeTrack for `?month=2025-05&status=SUBMITTED` on the entries endpoint
- Error handling: `catchError` + loading/error signal pattern — how to show loading state and handle a failed HTTP call without crashing the app
- Component-level `providers` vs `providedIn: 'root'` — listing a service in a component's own `providers` array creates a fresh, non-singleton instance scoped to that component and its children, instead of the shared root singleton; interviewers show two component instances with desynced state and ask why (or ask when you'd deliberately want a scoped instance)
- `inject()` outside an injection context — calling `inject()` inside a callback, event handler, or a plain function (not the constructor or field initializer) throws a runtime error; interviewers show it misused and ask why it fails
- `shareReplay(1)` for HTTP response caching — without it, the same GET fires once per subscriber (e.g. three components reading the same lookup data); interviewers ask "the network tab shows the same call three times, how do you fix it?"

## RxJS
- `Observable` and `subscribe` — what reactive programming means and why `HttpClient` returns Observables instead of Promises
- `pipe` and key operators: `map`, `filter`, `switchMap`, `debounceTime`, `catchError` — what each does and a real use case for each
- `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` — the flattening-operator choice: `switchMap` cancels the in-flight request (typeahead search), `exhaustMap` ignores new emissions while one is running (prevent double-submit on a save button), `concatMap` queues them in order, `mergeMap` runs all in parallel; interviewers describe a scenario and ask which operator fits
- Nested `subscribe()` inside `subscribe()` — chaining a dependent HTTP call by subscribing inside another subscription instead of flattening with `switchMap`/`mergeMap`; reviewers show the "callback pyramid" and ask what's wrong and how to fix it
- Multiple `async` pipes on the same Observable — each `| async` opens its own subscription, so the same HTTP call fires once per usage in the template; reviewers show a template with two `| async` on one source and ask how to share a single subscription (`@if (obs$ | async as x)`)
- Optimistic vs pessimistic UI updates — updating the signal immediately and rolling back on error, versus waiting for the server response before updating the view; interviewers probe this on delete/toggle actions where perceived speed matters
- `forkJoin` — run multiple HTTP calls in parallel and wait for all to complete; used on the TimeTrack dashboard to load stat cards simultaneously
- `takeUntilDestroyed` + `DestroyRef` — automatic unsubscription when the component is destroyed; interviewers ask "how do you avoid memory leaks in Angular?"
- `async` pipe — subscribes in the template and unsubscribes automatically; the alternative to calling `subscribe()` manually in the class
- Memory leak risk — what happens when you call `subscribe()` without ever unsubscribing; why it matters in a long-running SPA

## RxJS Interop
- `toSignal()` — converts an Observable (e.g. `HttpClient.get()`) into a signal; Angular subscribes and unsubscribes automatically; interviewers ask "how do you use HttpClient results in the template with the signals model?"
- `initialValue` option on `toSignal()` — the Observable has not emitted when the component first renders; without `initialValue` the signal is `undefined`, which crashes a template that loops over it; always set it for calls that return an array
- `toSignal()` injection context rule — must be called in the class body or constructor, never inside `ngOnInit` or an event handler; calling it outside an injection context throws a runtime error
- `toSignal()` vs `subscribe()` — use `toSignal()` when the template displays the data directly; use `subscribe()` + `takeUntilDestroyed` when you need to update multiple signals or trigger a side effect from one response
- `fromSignal()` — converts a signal into an Observable stream so you can pipe it through `debounceTime` and `switchMap`; used for search-as-you-type when the search term is stored as a signal

## Routing
- `provideRouter`, `routerLink`, `RouterOutlet`, `routerLinkActive` — the building blocks of Angular navigation
- `ActivatedRoute` — `snapshot.paramMap.get()` for route params, `queryParamMap` for query params; the correct way to read URL data inside a component
- Route params vs query params — params are part of the path (`/entries/:id`), query params are optional extras (`?month=2025-05`); interviewers ask when to use each
- `snapshot` vs Observable `paramMap` — use `snapshot` when the component is destroyed on navigation away (the standard case); subscribe to `paramMap` only when the id can change while the component stays alive, such as a next/previous button on the same route
- `CanActivateFn` guard — protecting a route; returns `true` to allow or `router.createUrlTree()` to redirect; do not use `router.navigate()` inside a guard — it causes double navigation
- `noAuthGuard` — the reverse of `authGuard`; redirects an already-logged-in user away from the login page; without it, the browser back button can land an authenticated user on the login form
- `CanDeactivateFn` guard — warning before leaving a page with unsaved changes; the guard receives the component instance to check its state
- Lazy loading: `loadComponent`, `loadChildren` — why it reduces the initial bundle size; interviewers ask "how do you improve Angular startup performance?"
- `HttpInterceptorFn` — intercepting every outgoing request to add the JWT token and handling 401 errors globally in one place, not in every service
- Route resolver vs loading in `ngOnInit` — resolving data before the route activates (no empty flash, navigation blocks until ready) versus fetching inside the component with a loading signal; interviewers ask "where do you fetch a detail page's data and what's the tradeoff?"

## Reactive forms
- `FormGroup`, `FormControl`, `FormBuilder` — the three pieces of a reactive form; `FormBuilder` is the shorthand for creating groups with less code
- Reactive vs template-driven forms — the decision, not just the syntax; reactive forms for complex, dynamic, or heavily validated forms and testability, template-driven for a handful of simple fields with `ngModel`; interviewers ask "which would you choose for this form and why?"
- Built-in validators: `Validators.required`, `Validators.min`, `Validators.email` — the most common validations
- Custom validators — a function that returns `null` (valid) or `{ key: true }` (invalid); used when built-in validators are not enough
- `form.markAllAsTouched()` — triggers all validation messages on a submit attempt; without it errors only appear after the user touches each field individually
- `form.patchValue()` vs `form.setValue()` — `patchValue()` updates only the fields you pass and ignores missing ones; `setValue()` requires every field and throws an error if one is missing; interviewers ask the difference when discussing edit forms
- `form.reset()`, `form.dirty` — resetting after save, and checking for unsaved changes before navigating away
- `setErrors({ key: true })` — setting a custom error on a control programmatically (e.g. duplicate name); clears automatically when validators re-run on the next keystroke
- Showing errors in the template: `control.hasError('key')` + `control.touched` — the pattern every Angular form uses to display validation messages
- `FormArray` — holds a dynamic list of form controls accessed by index instead of by name; use when the number of fields is not known upfront (e.g. "add another phone number"); `formArrayName` on the container div, `[formControlName]="$index"` on each input; interviewers ask the difference from `FormGroup`

## Pipes
- Built-in pipes: `date`, `number`, `currency`, `uppercase`, `slice` — what each formats and when to reach for it
- Custom pipes: `@Pipe({ name: '...' })`, `transform()` method — when to create one (logic that repeats across multiple templates)
- Pure vs impure pipes — a pure pipe (the default) only re-runs when its input reference changes, so it shows stale data if fed a mutated array or external state; `pure: false` re-runs on every change-detection cycle instead, which is a performance trap; reviewers show a pipe that doesn't update, or one that runs too often, and ask why

## Component styles
- View encapsulation — Angular scopes component CSS by adding unique attributes to each template element; styles in `component.css` only apply to elements you wrote in that template; interviewers ask "why doesn't my CSS rule apply to Angular Material's internal elements?"
- Global `styles.css` for Material internals — Angular Material renders its own internal HTML without the component's scoping attribute; to override Material internals (e.g. `.mat-sort-header-container`), the rule must go in `styles.css`; a rule that silently fails in component CSS almost always works in `styles.css`
- `:host` selector — targets the component's own wrapper element from inside its CSS file; custom elements are `inline` by default and need `:host { display: block }` to behave as block elements; interviewers ask how you style the outer element of a component without touching the parent's CSS
- `::ng-deep` (deprecated) — a CSS combinator that bypassed encapsulation to reach Material internals; you will see it in almost every enterprise Angular codebase built before 2022; the correct modern replacement is to put the rule in `styles.css`

## Project bootstrap and configuration
- `main.ts` + `bootstrapApplication()` — the standalone entry point that mounts the root component into `index.html`; interviewers ask "where does an Angular app actually start?" now that there is no root NgModule
- `app.config.ts` / `ApplicationConfig` `providers` array — the central place app-wide providers are registered in a standalone app; interviewers ask where you'd register `provideHttpClient()`, `provideRouter()`, or an interceptor
- `provideHttpClient()` — `HttpClient` is unusable until this is registered; a `NullInjectorError: No provider for HttpClient` on first run is the most common blank-project failure; interviewers ask why an injected `HttpClient` throws at startup
- `provideAnimations()` / `provideAnimationsAsync()` — Angular Material components that animate (`MatDialog`, `MatSnackBar`) fail or mis-render without this provider registered, even though the component is correctly in `imports`
- `environment.ts` / `environment.prod.ts` — where the API base URL and per-build config live; interviewers ask how the app points at localhost in dev and the real API in production without changing a line of code
- `fileReplacements` in `angular.json` — the build-config mechanism that swaps `environment.ts` for `environment.prod.ts` on a production build; interviewers ask how the environment file actually gets replaced (it is not the code that chooses — the builder does)
- CORS error in local development — the browser blocks a call from `localhost:4200` to an API on another origin unless the server sends the right headers; interviewers ask why the call is blocked and expect you to know it is a server-side (backend) fix, not an Angular one
- `proxy.conf.json` + `ng serve --proxy-config` — routes `/api` calls through the Angular dev server so the browser sees a same-origin request, sidestepping CORS while developing locally; interviewers ask how you talk to a backend on a different port in dev

## Debugging Angular errors
- `ExpressionChangedAfterItHasBeenCheckedError` (NG0100) — the dev-mode error thrown when a value read in the template changes between Angular's first and verification change-detection pass (e.g. a parent field set inside a child's `ngAfterViewInit`, or a getter that mutates state); interviewers show the stack trace and ask what causes it and how to fix it
- `NullInjectorError: No provider for X` (NG0201) — the most common startup crash: a service without `providedIn: 'root'` isn't in any provider scope, or a token was never provided; interviewers paste the red console error and ask what it means
- Circular dependency in DI (NG0200) — service A injects service B and B injects A, so Angular cannot construct either; interviewers ask how you'd recognise and break the cycle
- "Can't bind to 'X' since it isn't a known property" (NG0303) — reading the error correctly: it means a missing `imports` entry, a typo in an input name, or an unimported directive — not a broken component; interviewers hand you the red build and ask you to interpret it
- View not updating after code runs outside Angular's zone — a value changed inside a raw `setTimeout`, `addEventListener`, or a third-party library callback doesn't refresh the view because change detection never ran; interviewers ask "the data changed but the screen didn't — why?"
- Angular DevTools — the browser extension that shows the component tree, current input/signal values, and change-detection profiling; interviewers ask how you'd inspect why a component isn't rendering or is re-rendering too often

## State management strategy
- Local signal vs shared-service signal vs a store library — the junior-level decision of where state should live; interviewers ask "when do plain services and signals stop being enough that you'd reach for NgRx?" and expect "most apps never need a store" as the honest baseline answer
- Signals vs a `BehaviorSubject`-based service for shared application state — coverage explains each mechanism separately; interviewers ask directly "starting a new Angular 17+ app, which would you use for shared state and why?"
- Cross-tree component communication — deciding between lifting state to a coordinator, `input()`/`output()` drilling, and a shared service when two non-parent-child components must share state; the coordinator pattern covers the parent-orchestrated case, this is the decision for siblings or unrelated branches

## Patterns
- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; makes components reusable and testable
- Coordinator pattern — a smart page that orchestrates multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- Role-aware UI — `isAdmin = computed(() => authService.currentUser()?.role === 'admin')`; controls which elements render using `@if (isAdmin())`; the key difference from route guards: guards block navigation, role-aware UI cleans the interface for non-admin users
- Core / Feature / Shared folder structure — `core/` for guards, interceptors, singleton services; `pages/` for feature areas; `shared/` for reusable components; standard in enterprise Angular at Spanish consultancies
- HTTP interceptor as a cross-cutting concern — one interceptor handles auth headers and global error responses for the whole app, not repeated in every service

## Angular Material
- `MatTable` with `MatTableDataSource`, `MatSort`, `MatPaginator` — the standard way to display tabular data; interviewers at consultancies expect you to know this combination
- `MatDialog` — opening a modal, passing data in with `MAT_DIALOG_DATA`, and reading the result with `afterClosed()`
- Form fields: `mat-form-field`, `mat-error`, `ErrorStateMatcher` — how Material shows validation errors inside styled form fields
- `MatSnackBar` — user feedback after actions (save, delete, error); injected as a service, not added to `imports`
- Custom theming: scoped `mat.theme()` in a component stylesheet — how to apply a different colour to one component without changing the whole app
- Client-side vs server-side pagination/filtering — `MatTableDataSource` paginates and sorts in memory, which breaks down past a few thousand rows; interviewers ask "your table has 100k rows, what changes?" and expect the shift to server-driven paging with `HttpParams` (page/size params sent to the backend)

## Testing
- Jasmine: `describe`, `it`, `expect`, `beforeEach` — the test structure Angular uses by default; required from project 07 onwards
- `TestBed.configureTestingModule` — sets up the Angular DI context for a test so you can inject real services and mocks
- Testing a service with `TestBed` — how to inject the service and call its methods in a test; what you verify and why
- `spyOn(service, 'method')` — replaces a real method with a controlled fake; use `.and.returnValue()` to control what it returns; use `.toHaveBeenCalledWith()` to assert it was called correctly; the standard way to isolate the unit under test
- `HttpClientTestingModule` + `HttpTestingController` — intercept HTTP calls in tests without hitting the network; `httpMock.expectOne(url)` asserts exactly one request was made; `req.flush(data)` sends the mock response; `httpMock.verify()` fails the test if unexpected requests were made
- What to test in a service — the business logic: correct return value, correct error thrown, correct state change after the call
- Tests that pass but prove nothing — a component test missing `fixture.detectChanges()` (so bindings never render), a spec with no `expect`, or an assertion that only checks the mock's own return value instead of the code under test; reviewers show a green test suite and ask what it actually proves

## Legacy code recognition — needed on day one at a consultancy
- `@Input()` and `@Output()` decorators — legacy equivalent of `input()` and `output()`; you will see these in every existing consultancy codebase
- `EventEmitter` — used with `@Output()` to emit values to the parent; replaced by `output()` in Angular 17+
- `NgModule` — `declarations`, `imports`, `exports`, `providers`; how pre-standalone Angular apps are structured; most consultancy projects still use this
- `*ngIf` and `*ngFor` — legacy structural directives; still widely used; `*ngFor` does not require `track` but performs worse without it
- `ngModel` and `FormsModule` — template-driven two-way binding with the `[()]` banana-in-a-box syntax; simpler than reactive forms for standalone fields; still widely used in existing consultancy codebases
- Zone.js and default change detection — what it means conceptually; why signals and `OnPush` reduce unnecessary re-renders
- `OnPush` change detection strategy — the component only re-renders when an input reference changes or an event fires inside it; signals are fully compatible with `OnPush`; senior devs use it and will ask if you understand it
- `ngOnChanges` — lifecycle hook that fires every time an `@Input()` value changes; receives a `SimpleChanges` object with the previous and current value; the signals equivalent is `effect()`
- `BehaviorSubject` — holds the current value and emits it immediately to new subscribers; the most common pattern for shared state before signals; interviewers ask the difference from `Subject`
- `Subject` — emits to currently active subscribers only; late subscribers miss values emitted before they subscribed; used for one-time events rather than shared state; interviewers ask the difference from `BehaviorSubject`
