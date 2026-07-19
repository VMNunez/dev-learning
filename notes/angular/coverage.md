# Minimum Coverage — Angular

Topics a junior must know to pass a technical screening for Angular roles at Spanish consultancies in 2026.
Scope is derived from what those screenings test, not from what the projects happen to use. Every item must be explainable out loud with a concrete example — ideally from the six Angular projects or TimeTrack, and where a concept has no home in them, from a minimal example built for the purpose.

## Components and inputs
- `@Component` — selector, template, styles, `standalone: true`; interviewers ask what standalone means and why Angular 17+ uses it by default
- `imports` array on `@Component` — every directive, pipe, or component used in the template must be listed here; forgetting one causes a clear Angular error; interviewers ask why Angular 17+ moved away from NgModules
- `input()` and `output()` — signal-based component communication; interviewers ask "how does data flow between parent and child?"
- `input()` vs `input.required<T>()` — `input()` needs a default value or the type becomes `T | undefined`; `input.required<T>()` has no default and throws at compile time if the parent does not pass it; interviewers ask which one to use for a value the component cannot render without (e.g. an `id`)
- `model()` — signal-based two-way binding for a custom component (`[(value)]`); reviewers show `@Input()` + `@Output()` boilerplate built to fake two-way binding and ask for the signal-era replacement
- `@Directive` — the decorator for behaviour attached to an existing element (highlight, autofocus, permission-hide) instead of a new template; reviewers show a `@Component` with an empty template used only to add behaviour and ask what it should have been
- `@HostListener` — binds an event on the component's own host element from the class; reviewers show a directive calling raw `addEventListener` in `ngOnInit` (never removed, so it leaks) and expect this instead
- `@HostBinding` — binds a property, class, or style on the host element declaratively; interviewers ask how a directive toggles a CSS class without reaching for `nativeElement`
- `@Input()` alias (`@Input('name')`) — renames the public binding name, so the parent must bind the alias and not the class property; reviewers show a parent binding the property name and ask why the value is always `undefined`

## Content projection and template references
- `ng-content` — content projection; lets a parent inject arbitrary HTML into a child's template slot; interviewers ask how you build a reusable layout wrapper in Angular
- `ng-content select` and `ngProjectAs` — multi-slot projection is how one wrapper component accepts header, body, and footer markup separately; interviewers ask how a design-system card takes several distinct chunks of content
- `ng-content` vs configuration inputs — projecting markup versus passing a config object, and why projection scales better for a design-system shell; interviewers ask which you'd use for a reusable card or panel
- `ng-template` and `TemplateRef` — a template declared but not rendered until something asks for it; interviewers ask what an `ng-template` renders on its own (nothing) and why that is the point
- `ngTemplateOutlet` — renders a `TemplateRef` with a context object; interviewers ask how a parent passes a custom cell or row template into a reusable table component
- Template reference variables — `#ref` on any template element gives a typed handle to it; pass `ref.value` to a method without a signal or form control; interviewers ask how you read an input value without reactive forms
- `@ViewChild` vs `@ContentChild` — `@ViewChild` queries the component's own template, `@ContentChild` queries what a parent projected into it; reviewers show a `@ViewChild` returning `undefined` for a projected element and expect this distinction
- `viewChild()` / `viewChildren()` / `contentChild()` signal queries — the Angular 17.2+ replacement for the decorators, readable as signals and free of the `static` timing problem; interviewers ask what replaces `@ViewChild({ static: false })`

## Template syntax and rendering
- Data binding: interpolation `{{ }}`, property `[]`, event `()`, two-way `[()]` — the four types; interviewers ask the difference between `[]` and `{{}}`
- `@if`, `@for`, `@empty`, `@else` — new control flow syntax; `@for` requires a `track` expression for performance; interviewers ask why `track` matters
- `track: $index` as an anti-pattern — tracking by index instead of a stable id means Angular reuses the DOM node of whatever now sits at that position, so row state (focus, a checkbox, an open editor) attaches to the wrong item after a delete or reorder; reviewers show a list that "loses" its state and ask why the track expression is the bug
- `@switch`, `@case`, `@default` — control flow alternative to chained `@if`/`@else if` when checking one value against several fixed options (e.g. a status field); interviewers ask when to reach for `@switch` instead of multiple `@if` blocks (readability once there are 3+ branches)
- `@let` — declares a local template variable from an expression, reused across the same template block without recalculating it; interviewers ask how you avoid calling the same `computed()` or method multiple times in one template
- `[class.x]` binding — applies a single CSS class when the condition is true; simpler and more readable than `ngClass` for a single class; interviewers ask the difference from `ngClass`
- `ngClass` — applies multiple CSS classes conditionally using an object map `{ 'class': condition }`; reach for it when two or more classes depend on component state; interviewers ask when to use it instead of `[class.x]`
- `[style.prop]` binding vs `ngStyle` — the style-side twin of `[class.x]` vs `ngClass`, including the unit suffix form (`[style.width.px]`); interviewers ask how you set one computed dimension without inventing a CSS class for it
- Calling a method directly in a template binding (`{{ getTotal() }}`, `[disabled]="isInvalid()"`) — re-runs on every change-detection cycle instead of once; reviewers show a slow component built this way and expect the fix to be a `computed()` or a pure pipe, not the method itself
- A getter used as a template binding (`get total()`) — runs on every change-detection pass exactly like a method call, but hides the cost behind property syntax; reviewers show the getter next to the method version and ask whether it is any better (it is not)
- Safe navigation operator `?.` in templates — the template renders once before async/HTTP data arrives, so `user.name` throws "Cannot read properties of undefined"; `user?.name` renders nothing until the value exists; interviewers ask how you guard a template against not-yet-loaded data
- `@defer` blocks (`@placeholder`, `@loading`, triggers like `on viewport`/`on interaction`) — Angular 17+ template-level lazy loading that delays downloading a heavy component's code until needed; interviewers ask "how do you defer a heavy widget below the fold without a lazy route?"

## Lifecycle hooks
- Lifecycle hooks: `ngOnInit` (run logic on load), `ngAfterViewInit` (first safe moment to use `@ViewChild`), `ngOnDestroy` (cleanup) — interviewers ask when each fires and why
- `constructor` vs `ngOnInit` — the constructor only wires up dependency injection and runs before Angular has set the component's inputs; `ngOnInit` runs once after the first input binding, so data fetching and any logic that reads an `input()`/`@Input()` value belongs there, not in the constructor; interviewers ask "why fetch data in `ngOnInit` and not the constructor?"
- A lifecycle hook that never runs — Angular calls hooks by name, so a typo (`ngOnInIt`) or a class that does not declare the method exactly compiles fine and the code silently never executes; reviewers show initialisation logic that "does nothing" and expect this diagnosis
- `@ViewChild` — accessing a child element or component from the class after the view is built; needed for `MatSort` and `MatPaginator` in `ngAfterViewInit`
- `@ViewChild` `{ static: true }` vs `{ static: false }` — `static: true` resolves before `ngOnInit` but only works when the query is not inside an `@if`/`@for`; the default `false` leaves it `undefined` until `ngAfterViewInit`; reviewers show a `@ViewChild` read in `ngOnInit` coming back `undefined` and ask for the two possible fixes
- `ChangeDetectorRef.detectChanges()` sprinkled in to "make the view update" — the manual call almost always compensates for a real cause elsewhere (a mutation instead of a new reference, or work running outside the zone); reviewers show one and ask what it is hiding
- `markForCheck()` vs `detectChanges()` — `markForCheck()` marks the ancestor path dirty for the next pass, `detectChanges()` re-checks this view synchronously right now; interviewers ask which one an `OnPush` component needs after an async callback

## Signals — state and derivation
- `signal()`, `signal.set()`, `signal.update()` — creating and mutating reactive state; `set()` replaces the value, `update()` uses the previous value; interviewers ask which one to use when adding an item to an array
- `computed()` — derived state that recalculates automatically when its dependencies change; used for filtered lists, stats, and role-aware UI; returns a value and cannot be set directly
- Reading a signal without calling it — `@if (isAdmin)` or `{{ count }}` binds the signal *function*, which is always truthy and never updates; reviewers show a permission check that lets every user through and ask what is wrong
- Signal reference vs snapshot — `service.signal` (no parentheses) stores the live signal and stays reactive; `service.signal()` reads the value once and never updates; storing the snapshot in a property is a common bug
- Signal immutability — mutating an array/object in place (`items().push(x)`, `set(items())`) keeps the same reference, so `OnPush` and dependent `computed()`s never see a change; reviewers show in-place mutation and ask why the UI doesn't refresh (fix: `set([...items(), x])`)
- The `equal` option on `signal()` — signals compare by reference by default, so `set()` with a structurally identical object still notifies every dependent; interviewers ask why an "unchanged" object keeps triggering re-renders and what you would pass to stop it
- Derived state copied into a writable signal — recomputing a `total` by hand into its own `signal()` alongside the list creates two sources of truth that drift apart; interviewers show both and ask why the derived value must be a `computed()`
- `signal.asReadonly()` — a service that exposes a writable signal lets any component call `.set()` on shared state directly; interviewers show a component mutating a service's signal and ask how you'd protect it

## Signals — effects and pitfalls
- `effect()` — runs a side effect when a tracked signal changes; must be created inside a constructor or injection context, never outside; cannot modify a signal inside — that creates an infinite loop
- `computed()` vs `effect()` — `computed()` returns a derived value (filtered list, boolean flag); `effect()` performs a side effect with no return value (save to localStorage, sync to a non-reactive library); the most common mistake is using `effect()` to derive values when `computed()` is the right tool
- `effect()` + localStorage pattern — initialise a signal from localStorage, then use `effect()` to keep them in sync on every change
- `untracked()` — reads a signal inside an `effect()` or `computed()` without registering it as a dependency; interviewers ask how you read auxiliary state in an effect without making the effect re-run every time that state changes
- The `effect()` cleanup callback (`onCleanup`) — cancels the previous run's timer, listener, or subscription before the effect runs again; interviewers ask what stops an effect leaking one interval per change

## Services and dependency injection
- `@Injectable({ providedIn: 'root' })` — what dependency injection is, what a singleton service means, and why Angular uses it instead of importing classes directly
- `inject()` — the modern way to inject a service; no constructor needed in Angular 17+
- `@Injectable()` missing on a service that injects other services — Angular cannot read the constructor's dependency metadata and fails when it tries to create the instance; reviewers show a plain class with a constructor dependency and ask why DI breaks
- Creating a service with `new SomeService()` — bypasses DI entirely, so the instance receives none of its own dependencies and is not the shared singleton; reviewers show it inside a component and ask what breaks
- Component-level `providers` vs `providedIn: 'root'` — listing a service in a component's own `providers` array creates a fresh, non-singleton instance scoped to that component and its children, instead of the shared root singleton; interviewers show two component instances with desynced state and ask why (or ask when you'd deliberately want a scoped instance)
- `inject()` outside an injection context — calling `inject()` inside a callback, event handler, or a plain function (not the constructor or field initializer) throws a runtime error; interviewers show it misused and ask why it fails
- `InjectionToken<T>` — the way to inject something that is not a class, such as an API base URL or a feature-flag config object; interviewers ask how you provide a plain value or an interface through DI when there is no class to name
- `useClass` / `useValue` / `useFactory` / `useExisting` — the four provider recipes; interviewers ask how you swap a real service for a fake, or for an environment-specific implementation, without touching a single consumer
- `multi: true` providers — one token holding an array of implementations, which is how `HTTP_INTERCEPTORS` accepts several interceptors at once; interviewers ask why registering a second interceptor silently replaced the first
- `@Optional()` and `@SkipSelf()` — resolution modifiers over the injector hierarchy; interviewers ask how you make a dependency optional, or deliberately skip a component-level provider to reach the root one

## Service layer and HTTP
- `HttpClient` — making GET, POST, PUT, DELETE, PATCH calls with typed responses; interviewers ask "how do you call a REST API from Angular?"
- `HttpClient.get<T>()` without the generic type parameter — the response is typed as `Object`, so every downstream field access is unchecked and a backend rename fails silently at runtime; interviewers ask what supplying the type actually buys you
- `HttpParams` — building query parameters programmatically for filtered API calls; used in TimeTrack for `?month=2025-05&status=SUBMITTED` on the entries endpoint
- `HttpHeaders` immutability — `headers.set()` returns a new instance instead of mutating in place, so a header assigned to a discarded object never reaches the server; reviewers show the mutated-and-dropped version and ask why the request arrives without it
- File upload with `FormData` and download with `responseType: 'blob'` — the two non-JSON HTTP shapes an internal enterprise app always ends up needing; interviewers ask how you post a file to a Spring endpoint and how you save the PDF it returns
- Error handling: `catchError` + loading/error signal pattern — how to show loading state and handle a failed HTTP call without crashing the app
- Business logic living in the component instead of the service — HTTP calls, response mapping, and validation written into the component class; the wrong-layer finding reviewers plant most often, and the expected answer names testability and reuse, not style
- A service that calls `subscribe()` internally and returns `void` — swallows the stream, so callers cannot chain it, handle its error, or cancel it; reviewers show it and expect the service to return the `Observable` and the component to subscribe
- Mapping API responses to domain models inside the service — keeping the backend DTO shape out of components so a contract change touches one file; interviewers ask what happens across the app when the backend renames a field
- One service per API resource — why a component never injects `HttpClient` directly; interviewers ask who owns the URL and the response shape once three components need the same endpoint
- `shareReplay(1)` for HTTP response caching — without it, the same GET fires once per subscriber (e.g. three components reading the same lookup data); interviewers ask "the network tab shows the same call three times, how do you fix it?"

## RxJS operators and streams
- `Observable` and `subscribe` — what reactive programming means and why `HttpClient` returns Observables instead of Promises
- Cold vs hot Observables — an `HttpClient` Observable is cold, so every subscriber triggers its own request rather than sharing one; interviewers ask why the same stream fired three times, and this is the concept `shareReplay` exists to fix
- `pipe` and key operators: `map`, `filter`, `switchMap`, `debounceTime`, `catchError` — what each does and a real use case for each
- `tap` — performs a side effect inside a pipe without altering the stream; interviewers ask where logging, a cache write, or a loading flag belongs in an operator chain
- `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` — the flattening-operator choice: `switchMap` cancels the in-flight request (typeahead search), `exhaustMap` ignores new emissions while one is running (prevent double-submit on a save button), `concatMap` queues them in order, `mergeMap` runs all in parallel; interviewers describe a scenario and ask which operator fits
- The typeahead pipeline: `debounceTime` + `distinctUntilChanged` + `switchMap` — the search-as-you-type chain, where `debounceTime` waits for a pause, `distinctUntilChanged` drops a repeated term, and `switchMap` cancels the superseded request; this is the single most common Angular live-coding task at Spanish consultancies
- Nested `subscribe()` inside `subscribe()` — chaining a dependent HTTP call by subscribing inside another subscription instead of flattening with `switchMap`/`mergeMap`; reviewers show the "callback pyramid" and ask what's wrong and how to fix it
- `catchError` that swallows the failure — returning `of([])` or `of(null)` with no logging and no user-facing error makes a failed request indistinguishable from an empty result; reviewers show it and ask how the user would ever learn the call failed
- `firstValueFrom` / `lastValueFrom` — the replacement for the removed `toPromise()`; interviewers ask what happens when the source completes without emitting, and when a Promise is acceptable at all in an Angular codebase

## RxJS — combining streams and resilience
- `forkJoin` — run multiple HTTP calls in parallel and wait for all to complete; used on the TimeTrack dashboard to load stat cards simultaneously
- `combineLatest` — recombines several *ongoing* sources (filter, page, sort) and re-emits whenever any of them changes; interviewers ask how it differs from `forkJoin`, which waits for every source to complete and emits once
- `startWith` — a `combineLatest` pipeline emits nothing until every source has emitted at least once, so one silent source keeps the whole table empty; interviewers ask why the list never loads on first render
- `retry` / `retry({ count, delay })` and `timeout` — resilience on a flaky GET, and why you never blindly retry a non-idempotent POST; interviewers ask what you do about intermittent 503s from a backend you do not control
- `finalize` — runs on both the success and the error path, which is where a loading flag is turned off; reviewers show a spinner that stays forever after a failed call and ask what is missing
- Optimistic vs pessimistic UI updates — updating the signal immediately and rolling back on error, versus waiting for the server response before updating the view; interviewers probe this on delete/toggle actions where perceived speed matters

## Subscription management and leaks
- Memory leak risk — what happens when you call `subscribe()` without ever unsubscribing; why it matters in a long-running SPA
- `takeUntil(destroy$)` with a `Subject` — the pre-16 unsubscribe pattern, where `ngOnDestroy` calls `destroy$.next()` to complete every piped stream; it is in every legacy codebase, and interviewers asking "dame tres formas de evitar memory leaks" expect this alongside the `async` pipe and `takeUntilDestroyed()`
- `takeUntilDestroyed` + `DestroyRef` — automatic unsubscription when the component is destroyed; the modern default from Angular 16+
- `async` pipe — subscribes in the template and unsubscribes automatically; the alternative to calling `subscribe()` manually in the class
- Choosing between the three unsubscribe strategies — the `async` pipe when the template is the only consumer, `takeUntilDestroyed` when the class subscribes, and `takeUntil(destroy$)` only when you are reading pre-16 code; interviewers ask which one you would actually write today and expect a default, not a list
- Multiple `async` pipes on the same Observable — each `| async` opens its own subscription, so the same HTTP call fires once per usage in the template; reviewers show a template with two `| async` on one source and ask how to share a single subscription (`@if (obs$ | async as x)`)

## RxJS Interop
- `toSignal()` — converts an Observable (e.g. `HttpClient.get()`) into a signal; Angular subscribes and unsubscribes automatically; interviewers ask "how do you use HttpClient results in the template with the signals model?"
- `initialValue` option on `toSignal()` — the Observable has not emitted when the component first renders; without `initialValue` the signal is `undefined`, which crashes a template that loops over it; always set it for calls that return an array
- `toSignal()` injection context rule — must be called in the class body or constructor, never inside `ngOnInit` or an event handler; calling it outside an injection context throws a runtime error
- `toSignal()` vs `subscribe()` — use `toSignal()` when the template displays the data directly; use `subscribe()` + `takeUntilDestroyed` when you need to update multiple signals or trigger a side effect from one response
- `toObservable()` — converts a signal into an Observable stream so you can pipe it through `debounceTime` and `switchMap`; used for search-as-you-type when the search term is stored as a signal; like `toSignal()` it must be called in an injection context, and interviewers ask candidates to name both interop functions correctly
- Where signals end and RxJS begins — signals hold state the template reads, RxJS models event streams and async pipelines, and `toSignal()`/`toObservable()` sit at the seam; interviewers ask directly "do signals replace RxJS?" and expect the boundary, not a yes or no

## Routing and navigation
- `provideRouter`, `routerLink`, `RouterOutlet`, `routerLinkActive` — the building blocks of Angular navigation
- `ActivatedRoute` — `snapshot.paramMap.get()` for route params, `queryParamMap` for query params; the correct way to read URL data inside a component
- Route params vs query params — params are part of the path (`/entries/:id`), query params are optional extras (`?month=2025-05`); interviewers ask when to use each
- `snapshot` vs Observable `paramMap` — use `snapshot` when the component is destroyed on navigation away (the standard case); subscribe to `paramMap` only when the id can change while the component stays alive, such as a next/previous button on the same route
- Stale data from `snapshot` on a self-navigating route — navigating from `/entries/5` to `/entries/6` reuses the component instance, so `ngOnInit` never fires again and a `snapshot`-based page keeps showing the old record; reviewers show a detail page whose next/previous buttons change the URL but not the content and expect this diagnosis
- `withComponentInputBinding()` — binds route params and query params straight to the component's `input()`s, so a detail component never injects `ActivatedRoute` at all; interviewers ask how you avoid repeating the same param-reading boilerplate in every routed component
- `router.navigate()` with `relativeTo` vs `routerLink` — programmatic versus declarative navigation, and how a relative path resolves against the current route; interviewers ask when navigation belongs in the class rather than the template
- Nested routes and a child `RouterOutlet` — modelling a master/detail or tabbed section in the URL instead of in component state; interviewers ask "should this tab be a route?" and expect deep-linking and the back button as the deciding argument
- Route `data` — static per-route metadata (required role, breadcrumb) declared in the route config instead of hardcoded inside each component; interviewers ask where a route's required role should be declared
- Route `title` and `TitleStrategy` — setting the document title declaratively per route; interviewers ask how the browser tab updates on navigation
- `Router.events` (`NavigationStart` / `NavigationEnd` / `NavigationError`) — the stream a global loading bar, analytics, and scroll handling subscribe to; interviewers ask how you show progress while a lazy route downloads

## Router configuration and URL state
- `pathMatch: 'full'` vs `'prefix'` — a `''` redirect left on the default `prefix` matches every single route, so the app bounces to home from everywhere; reviewers show exactly that config and expect the one-word fix
- The wildcard `**` route and array order — the router takes the first match, so a `**` placed above the real routes swallows the whole app; interviewers ask how you serve a 404 page and where the route must sit
- Lazy loading: `loadComponent`, `loadChildren` — why it reduces the initial bundle size; interviewers ask "how do you improve Angular startup performance?"
- `loadComponent` vs `loadChildren` — the per-route versus per-feature lazy boundary and what each does to the bundle graph; interviewers ask where you would cut a given app
- `withPreloading(PreloadAllModules)` — lazy routes make the first click slow, so the router downloads the remaining chunks in the background after bootstrap; interviewers ask how you keep lazy loading without paying for it on every navigation
- `queryParamsHandling: 'merge'` and `replaceUrl` — keeping the active filter in the URL while changing the page, without stacking a history entry per keystroke; interviewers ask what the back button should do after a filter change
- `withHashLocation()` vs the default `PathLocationStrategy` — the client-side workaround for the deep-link 404 when ops will not add the server rewrite rule; interviewers ask what you do when you cannot touch the nginx config
- A `routes.ts` per feature instead of one flat app-level array — how routing stays readable past ~20 routes; interviewers ask how the routing config scales on a real project

## Route protection and data loading
- `CanActivateFn` guard — protecting a route; returns `true` to allow or `router.createUrlTree()` to redirect; do not use `router.navigate()` inside a guard — it causes double navigation
- `CanMatchFn` vs `CanActivateFn` — `CanActivate` runs after the route matched, so the lazy chunk has already downloaded; `CanMatch` decides whether the route matches at all, which both prevents the download and lets a different component win the same URL by role; interviewers ask which guard stops an unauthorised user from even fetching the admin bundle
- `CanActivateChild` — one guard protecting a whole nested section instead of being repeated on every child route; interviewers ask how you protect an admin area with ten sub-routes without ten guard entries
- `noAuthGuard` — the reverse of `authGuard`; redirects an already-logged-in user away from the login page; without it, the browser back button can land an authenticated user on the login form
- `CanDeactivateFn` guard — warning before leaving a page with unsaved changes; the guard receives the component instance to check its state
- `HttpInterceptorFn` — intercepting every outgoing request to add the JWT token and handling 401 errors globally in one place, not in every service
- Class-based `HttpInterceptor` + the `HTTP_INTERCEPTORS` multi-provider — the pre-15 form still present in most consultancy codebases, the exact sibling of the `CanActivate` class-vs-function pair; interviewers show one and ask for the functional equivalent and how both coexist mid-migration
- Interceptor execution order — interceptors run in registration order on the way out and in reverse on the way back; interviewers ask why the auth header is missing from the request the logging interceptor recorded
- Global `ErrorHandler` provider — the root-level hook that catches whatever no `catchError` handled, which is how a team reports client-side crashes centrally; interviewers ask where an uncaught runtime error actually goes
- Route resolver vs loading in `ngOnInit` — resolving data before the route activates (no empty flash, navigation blocks until ready) versus fetching inside the component with a loading signal; interviewers ask "where do you fetch a detail page's data and what's the tradeoff?"

## Reactive forms — building and validating
- `FormGroup`, `FormControl`, `FormBuilder` — the three pieces of a reactive form; `FormBuilder` is the shorthand for creating groups with less code
- Reactive vs template-driven forms — the decision, not just the syntax; reactive forms for complex, dynamic, or heavily validated forms and testability, template-driven for a handful of simple fields with `ngModel`; interviewers ask "which would you choose for this form and why?"
- Typed reactive forms `FormGroup<T>` / `FormControl<T>` (Angular 14+) — `.value` is typed instead of `any`, so a renamed or missing control fails at compile time; interviewers ask what problem untyped forms had, and the standard take-home (form + validation + service) exercises this directly
- `NonNullableFormBuilder` — by default a typed control's value is `string | null` because `reset()` can null it, which is why `form.value.email` is not simply `string`; interviewers ask why the type has a `null` in it and how you remove it properly
- Nested `FormGroup` and `formGroupName` — modelling a sub-object (an `address` block) so `form.value` matches the backend DTO shape without a mapping step; interviewers ask how a form maps onto nested JSON
- Built-in validators: `Validators.required`, `Validators.min`, `Validators.email` — the most common validations
- Custom validators — a function that returns `null` (valid) or `{ key: true }` (invalid); used when built-in validators are not enough
- Cross-field validators on the `FormGroup` — password/confirm and start-date/end-date checks compare two controls, so the validator goes on the group and the resulting error lives on the group rather than on either control; interviewers ask where the "passwords don't match" message actually comes from
- `AsyncValidatorFn` — a validator returning an Observable, used for "is this email already taken?" against the backend, leaving the control in `PENDING` while it resolves; interviewers ask what the submit button does during the check
- `updateOn: 'blur' | 'submit'` — moves validation off every keystroke, which is also what makes an async validator affordable; interviewers ask how you stop firing a request per character typed
- `form.markAllAsTouched()` — triggers all validation messages on a submit attempt; without it errors only appear after the user touches each field individually
- Showing errors in the template: `control.hasError('key')` + `control.touched` — the pattern every Angular form uses to display validation messages

## Form state and integration
- `form.patchValue()` vs `form.setValue()` — `patchValue()` updates only the fields you pass and ignores missing ones; `setValue()` requires every field and throws an error if one is missing; interviewers ask the difference when discussing edit forms
- `form.reset()`, `form.dirty` — resetting after save, and checking for unsaved changes before navigating away
- Disabling a reactive control — the plain `disabled` HTML attribute on a `formControlName` input logs a warning and is ignored, because the control's state is owned by the model (`control.disable()` / `enable()`); reviewers show the attribute version and ask why the console complains
- `getRawValue()` vs `value` — `value` omits disabled controls, so a field the user could not edit silently disappears from the payload you POST; reviewers show a request body missing a field and expect this cause
- `statusChanges` and `VALID` / `INVALID` / `PENDING` — driving the submit button from the form's own status instead of a hand-maintained boolean; interviewers ask why `form.valid` is false while nothing on screen looks wrong (a pending async validator)
- `setErrors({ key: true })` — setting a custom error on a control programmatically (e.g. duplicate name); clears automatically when validators re-run on the next keystroke
- Mapping a server's 400 validation response back onto controls — deciding between one global error banner and calling `setErrors` per field so the message appears under the input that caused it; interviewers ask how backend validation surfaces in your form
- `ControlValueAccessor` — the interface that lets your own component be driven by `formControlName` like a native input; interviewers ask how you turn a bespoke star-rating, currency, or tag-picker component into a real form control
- The `FormGroup` as the single source of truth — mirroring `valueChanges` into a parallel signal creates two copies of the same state that drift; interviewers ask why you would not keep form values in a signal alongside the form
- `FormArray` — holds a dynamic list of form controls accessed by index instead of by name; use when the number of fields is not known upfront (e.g. "add another phone number"); `formArrayName` on the container div, `[formControlName]="$index"` on each input; interviewers ask the difference from `FormGroup`

## Pipes and localised formatting
- Built-in pipes: `date`, `number`, `currency`, `uppercase`, `slice` — what each formats and when to reach for it
- Custom pipes: `@Pipe({ name: '...' })`, `transform()` method — when to create one (logic that repeats across multiple templates)
- Pure vs impure pipes — a pure pipe (the default) only re-runs when its input reference changes, so it shows stale data if fed a mutated array or external state; `pure: false` re-runs on every change-detection cycle instead, which is a performance trap; reviewers show a pipe that doesn't update, or one that runs too often, and ask why
- `LOCALE_ID` and `registerLocaleData` — Angular ships `en-US` only, which is why `| date` renders American order and `| currency` prints `$` in an app built for a Spanish client; interviewers ask how you localise formatting app-wide rather than patching each pipe call
- `MAT_DATE_LOCALE` and the Material date adapter — the datepicker has its own locale token, so it still shows `MM/DD/YYYY` after `LOCALE_ID` is set correctly; interviewers ask why fixing the pipe did not fix the picker

## Component styles
- View encapsulation — Angular scopes component CSS by adding unique attributes to each template element; styles in `component.css` only apply to elements you wrote in that template; interviewers ask "why doesn't my CSS rule apply to Angular Material's internal elements?"
- `styleUrls` vs inline `styles` in `@Component` — both go through the same view encapsulation, so writing rules inline does not let them escape the component or leak into a child; the array form is only for a handful of component-local rules; interviewers ask whether the inline form changes the scoping (it does not)
- Global `styles.css` for Material internals — Angular Material renders its own internal HTML without the component's scoping attribute; to override Material internals (e.g. `.mat-sort-header-container`), the rule must go in `styles.css`; a rule that silently fails in component CSS almost always works in `styles.css`
- `:host` selector — targets the component's own wrapper element from inside its CSS file; custom elements are `inline` by default and need `:host { display: block }` to behave as block elements; interviewers ask how you style the outer element of a component without touching the parent's CSS
- `::ng-deep` (deprecated) — a CSS combinator that bypassed encapsulation to reach Material internals; you will see it in almost every enterprise Angular codebase built before 2022; the correct modern replacement is to put the rule in `styles.css`
- A style problem that appears only after `ng build` — style optimisation, minification, and the `budgets` limit apply to the production configuration and not to `ng serve`, so a layout that breaks solely in the built output points at the build configuration rather than the CSS; interviewers use the "it worked in `ng serve`" scenario to see whether you know where to look

## Workspace configuration
- `main.ts` + `bootstrapApplication()` — the standalone entry point that mounts the root component into `index.html`; interviewers ask "where does an Angular app actually start?" now that there is no root NgModule
- `app.config.ts` / `ApplicationConfig` `providers` array — the central place app-wide providers are registered in a standalone app; interviewers ask where you'd register `provideHttpClient()`, `provideRouter()`, or an interceptor
- `provideHttpClient()` — `HttpClient` is unusable until this is registered; a `NullInjectorError: No provider for HttpClient` on first run is the most common blank-project failure; interviewers ask why an injected `HttpClient` throws at startup
- `provideAnimations()` / `provideAnimationsAsync()` — Angular Material components that animate (`MatDialog`, `MatSnackBar`) fail or mis-render without this provider registered, even though the component is correctly in `imports`
- `angular.json` architect targets — the file that defines what `ng serve`, `ng build`, and `ng test` actually run (which builder, with which options); interviewers ask where the output path, the assets list, or the global stylesheet is configured, because the CLI reads this file rather than following conventions
- `assets` and `styles` arrays in `angular.json` — an image or a third-party CSS file that is never listed here is 404 in the browser despite existing on disk; interviewers ask how a file that nothing imports reaches the served app
- `tsconfig.json` vs `tsconfig.app.json` — the workspace splits a base config from the per-target ones, which is why a `paths` alias or a `strict` flag set in the wrong file resolves in the editor but breaks the build
- Angular, TypeScript, and Node version coupling — each Angular major supports a specific TypeScript and Node range, so a mismatched environment fails at install or build with a version-range error rather than a code error; interviewers ask how you would read that message
- `environment.ts` / `environment.prod.ts` — where the API base URL and per-build config live; interviewers ask how the app points at localhost in dev and the real API in production without changing a line of code
- Secrets do not belong in `environment.ts` — every value bundled into the frontend ships inside the JavaScript the browser downloads, so an API key or token placed there is public no matter which build replaced it; this is the AI-generated-code review gotcha applied to Angular, and interviewers ask what in that file is safe to commit
- `fileReplacements` in `angular.json` — the build-config mechanism that swaps `environment.ts` for `environment.prod.ts` on a production build; interviewers ask how the environment file actually gets replaced (it is not the code that chooses — the builder does)

## Build and compilation
- Ahead-of-Time (AOT) compilation vs JIT — templates are compiled to JavaScript at build time rather than in the browser, which is why a template error surfaces during `ng build` and not at runtime; interviewers ask what the Angular compiler does with an `.html` file and why AOT is the default
- `strictTemplates` in `angularCompilerOptions` — the flag that makes the compiler type-check bindings inside the HTML, not just the `.ts`; interviewers ask how a wrong `[input]` type is caught at build time, and why this is the flag that breaks a migration
- `ng build` type-checks through the CLI's own pipeline, not bare `tsc` — a green editor is not proof the build passes; interviewers ask why `ng build` reports errors the IDE never showed
- Development vs production build — dev keeps source maps and dev-mode assertions, production applies AOT optimisation, minification, and tree-shaking, and enforces stricter checks; interviewers ask why an error appears only in prod or only in dev
- The `application` (esbuild) builder vs the legacy `browser` (webpack) builder — the default changed in Angular 17, which is why build times and the shape of `dist/` differ after a version bump; interviewers ask what changed in the build when nothing changed in the code
- `budgets` in `angular.json` — the bundle-size thresholds that turn a compiling build into a warning or a hard CI failure; interviewers ask what "exceeded maximum budget" means and how a team stops the bundle growing unnoticed
- Bundle analysis (`ng build --stats-json` plus source-map-explorer) — what you actually run once a budget fails, to see which dependency owns the megabytes instead of guessing; interviewers ask how you find out *why* the bundle grew
- `ng serve` vs `ng build` — `ng serve` builds in memory and writes nothing to disk, `ng build` produces the deployable `dist/` folder; interviewers ask why `dist/` is empty while the app is running in the browser

## CLI and tooling
- Angular CLI essentials — `ng generate component/service/guard`, `ng serve`, `ng build`; interviewers ask how you scaffold a new feature and what the difference is between the dev server and a production bundle
- Schematics — the code-generation mechanism behind `ng generate`, `ng add`, and `ng update`; interviewers ask what actually writes those four files and edits `app.config.ts` for you
- `ng add` vs `npm install` — `ng add` runs a schematic that installs *and* registers providers, styles, and config (this is how Angular Material is meant to be added); a plain `npm install` leaves the library present but the app unconfigured; interviewers ask how you added Material
- `ng update` vs bumping the version in `package.json` — `ng update` runs migration schematics that rewrite your code for the new major; a raw npm bump does not, which is why the app then fails to compile; interviewers ask how you take a project from one major version to the next
- Angular's release cadence and support window — a new major roughly every six months with about eighteen months of support, which is why a client project sitting on v12 is out of support and why upgrades are done one major at a time; interviewers ask what it means that the codebase you are joining is four versions behind
- ESLint (`angular-eslint`) and Prettier — the team-level enforcement layer above the compiler, catching what type-checking cannot (unused injectables, template accessibility rules, naming conventions); interviewers ask how code style stays consistent across a shared consultancy codebase
- `package.json` scripts and `package-lock.json` — the lockfile is why CI installs the exact same dependency tree as your machine, and the `^` range is why it would not without one; interviewers ask why a build passes locally and fails in CI
- `ng new` prompts — routing, stylesheet format, SSR/zoneless: the scaffold decisions made in the first thirty seconds that are awkward to reverse later; interviewers hand you a blank IDE and expect you to justify your answers

## Deploying and serving
- The `dist/` output as static files — an Angular build is a folder of HTML, JS, and CSS handed to nginx, Apache, or S3, not a running Node process; interviewers ask "how do you deploy an Angular app?" and expect this distinction
- Deep-link 404 after deploy — refreshing on `/entries/5` asks the static server for a file that does not exist, so the fix is a server rewrite rule pointing every unmatched path at `index.html`, not an Angular change; interviewers ask why routing works inside the app but breaks on reload
- `--base-href` — an app deployed under a subpath serves a blank page and 404s its own JS bundles because asset and router URLs resolve against the domain root; interviewers ask what changes when the app is not hosted at `/`
- CORS error in local development — the browser blocks a call from `localhost:4200` to an API on another origin unless the server sends the right headers; interviewers ask why the call is blocked and expect you to know it is a server-side (backend) fix, not an Angular one
- `proxy.conf.json` + `ng serve --proxy-config` — routes `/api` calls through the Angular dev server so the browser sees a same-origin request, sidestepping CORS while developing locally; interviewers ask how you talk to a backend on a different port in dev

## Security in the browser
- Angular's default output sanitisation — interpolated and property-bound values are escaped before they reach the DOM, which is why `{{ userInput }}` cannot inject a `<script>`; interviewers ask what actually protects an Angular app from XSS out of the box, and a candidate who answers "nothing, you sanitise manually" fails the question
- `DomSanitizer.bypassSecurityTrustHtml` / `bypassSecurityTrustResourceUrl` — the explicit escape hatch, and the single place XSS re-enters an Angular app; reviewers show one applied to user-supplied content and expect the objection, not an explanation of the API
- `HttpClient` XSRF support (`withXsrfConfiguration`) — Angular reads the CSRF cookie and echoes it back as a header, which is exactly what Spring Security's CSRF filter is checking for; interviewers ask how the frontend cooperates with backend CSRF protection

> Token storage (`localStorage` vs `httpOnly` cookie), the fact that `[innerHTML]` bypasses Angular's escaping, and "client-side role checks are UX, not security" are owned by the **Security** topic and deliberately not repeated here.

## Accessibility
- Label association and `aria-describedby` on a validation message — how a screen-reader user learns which field failed and why; Spanish public-sector contracts (a large share of Indra and NTT Data work) make this a requirement rather than a nicety, and interviewers on those accounts ask
- A `<div (click)>` used as a button — it takes no keyboard focus, does not fire on Enter or Space, and announces nothing to assistive technology; reviewers plant one and expect `<button>` as the answer, not a `tabindex` patch on top
- Focus management around dialogs — trapping focus inside an open modal and returning it to the trigger on close (`MatDialog` handles both by default via `autoFocus` and `restoreFocus`); interviewers ask where keyboard focus goes when a Material dialog opens and closes
- `LiveAnnouncer` / `aria-live` — announcing an async result such as "3 entries found" that a sighted user simply sees appear; interviewers ask how a screen reader learns that a filtered table updated

## Debugging Angular errors
- `NG####` error codes — the numeric prefix identifies the error class and the top *application* frame of the trace points at your file, not the framework frames below it; interviewers paste a raw console dump and ask what the code means
- Bootstrap-time throw — an error in a root provider or `APP_INITIALIZER` kills the app before any component renders, producing a white page with a completely green terminal; interviewers ask which failures `ng serve` can never report
- `ExpressionChangedAfterItHasBeenCheckedError` (NG0100) — the dev-mode error thrown when a value read in the template changes between Angular's first and verification change-detection pass (e.g. a parent field set inside a child's `ngAfterViewInit`, or a getter that mutates state); interviewers show the stack trace and ask what causes it and how to fix it
- `NullInjectorError: No provider for X` (NG0201) — the most common startup crash: a service without `providedIn: 'root'` isn't in any provider scope, or a token was never provided; interviewers paste the red console error and ask what it means
- Circular dependency in DI (NG0200) — service A injects service B and B injects A, so Angular cannot construct either; interviewers ask how you'd recognise and break the cycle
- "Can't bind to 'X' since it isn't a known property" (NG0303) — reading the error correctly: it means a missing `imports` entry, a typo in an input name, or an unimported directive — not a broken component; interviewers hand you the red build and ask you to interpret it
- "'x' is not a known element" (NG0304) — the sibling of NG0303, and the distinction is the point: NG0303 is a bad *property* on an element Angular knows, NG0304 is an unrecognised *element*, meaning an unimported component or a misspelled selector; interviewers hand you one of the two and ask which mistake it is
- Duplicate `@for` track key (NG0955) — two items resolving to the same `track` expression (or a `null` id) throws at runtime; interviewers ask why a list crashes only once real backend data arrives
- A 401 loop in the auth interceptor — an interceptor that redirects or retries on 401 without excluding the login and refresh calls re-triggers itself endlessly; interviewers ask why the app hangs after a wrong password
- View not updating after code runs outside Angular's zone — a value changed inside a raw `setTimeout`, `addEventListener`, or a third-party library callback doesn't refresh the view because change detection never ran; interviewers ask "the data changed but the screen didn't — why?"

## Performance and change detection
- Zone.js and default change detection — what it means conceptually; why signals and `OnPush` reduce unnecessary re-renders
- Zoneless change detection (`provideZonelessChangeDetection`) — Angular 18+ can drop Zone.js entirely and schedule rendering from signals and template events instead; interviewers ask what stops working in a zoneless app, and the answer (state mutated outside a signal, values set in a bare `setTimeout`) is why the rest of this file insists on immutable signal updates
- `OnPush` change detection strategy — the component only re-renders when an input reference changes or an event fires inside it; signals are fully compatible with `OnPush`; senior devs use it and will ask if you understand it
- `OnPush` as an app-wide default — the tradeoff between far fewer re-renders and a whole class of "the view didn't update" bugs that appear as soon as data is mutated rather than replaced; interviewers ask whether they'd set it on every component
- `NgZone.runOutsideAngular()` and `ngZone.run()` — keeps a high-frequency third-party callback (a chart, a map, a websocket firing 60 times a second) from triggering change detection on every tick, re-entering only to commit state; interviewers ask why adding one library made the whole app crawl
- Angular DevTools — the browser extension that shows the component tree and the current input/signal values; interviewers ask how you'd inspect why a component isn't rendering
- The change-detection profiler — records which components re-render and what each cycle costs, which is what tells you where the time actually goes instead of scattering `OnPush` and `track` everywhere; interviewers ask "the app feels slow, what is your first step?"
- Rendering a very large list — choosing between server-side paging, `@defer`, and virtual scrolling (`cdk-virtual-scroll-viewport`); interviewers ask what you would do with 10,000 rows outside a table

## State management strategy
- Local signal vs shared-service signal vs a store library — the junior-level decision of where state should live; interviewers ask "when do plain services and signals stop being enough that you'd reach for NgRx?" and expect "most apps never need a store" as the honest baseline answer
- Signals vs a `BehaviorSubject`-based service for shared application state — coverage explains each mechanism separately; interviewers ask directly "starting a new Angular 17+ app, which would you use for shared state and why?"
- Server state vs client state — data fetched from the API (cacheable, can go stale, belongs to the backend) and local UI state (filters, open dialog, form draft) have different lifecycles and do not belong in the same bag of signals; interviewers ask whether everything from HTTP should live in your store
- Refreshing the view after a mutation — once a POST or PUT succeeds, choosing between refetching the list, patching the local signal, and trusting the response body; interviewers ask "you just created an entry, how does the table find out?"
- State that must survive a reload — deciding between the URL (query params), `localStorage`, and in-memory service state for things like the active filter and page number; interviewers ask what happens when the user refreshes on page 3 of a filtered table
- Cross-tree component communication — deciding between lifting state to a coordinator, `input()`/`output()` drilling, and a shared service when two non-parent-child components must share state; the coordinator pattern covers the parent-orchestrated case, this is the decision for siblings or unrelated branches

## Patterns and component design
- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; makes components reusable and testable
- Coordinator pattern — a smart page that orchestrates multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- Placing the smart/dumb boundary at the route — the routed page component owns HTTP, routing, and state while every child below stays pure; interviewers ask where the boundary goes and why not one level deeper
- Component extraction criteria — repetition, genuinely independent state, or a template grown past comprehension; interviewers ask "when would you split this 300-line component?" and do not accept "when it feels long"
- Passing a whole domain object vs individual primitive inputs — the tradeoff between coupling a reusable component to your model and churning a long input list; interviewers ask which they'd choose for a card meant to be reused
- A component with a dozen inputs and outputs — usually the symptom of a boundary drawn in the wrong place or a missing wrapper component; interviewers show one and ask how you would redesign it
- Role-aware UI — `isAdmin = computed(() => authService.currentUser()?.role === 'admin')`; controls which elements render using `@if (isAdmin())`; the key difference from route guards: guards block navigation, role-aware UI cleans the interface for non-admin users
- Core / Feature / Shared folder structure — `core/` for guards, interceptors, singleton services; `pages/` for feature areas; `shared/` for reusable components; standard in enterprise Angular at Spanish consultancies
- HTTP interceptor as a cross-cutting concern — one interceptor handles auth headers and global error responses for the whole app, not repeated in every service; interviewers ask what genuinely belongs there (auth header, 401 redirect) versus what must stay per-call (a 404 that really means "empty state")

## Angular Material

> Angular Material has its own topic file (`notes/angular-material/coverage.md`) covering the component set, theming, the CDK, accessibility and harness testing in full. Nothing is duplicated here — study it as its own topic.

## Interoperability with the Spring Boot backend
- `LocalDate` / `LocalDateTime` over JSON — they arrive as ISO strings, never as a `Date`, so `| date` fails on the raw value and a naive `new Date('2026-07-19')` shifts the day by the browser's timezone; interviewers ask how a date survives the round trip intact
- Spring's `Page<T>` response shape (`content`, `totalElements`, `number`, `size`) — the exact contract a server-side `MatPaginator` binds to; interviewers ask how the paginator knows the total row count when the browser only received twenty rows
- Java enums over JSON — arrive as plain strings and are typed as a TS union or enum on the front end; interviewers ask what happens to the UI when the backend adds a new status value the switch does not handle
- The validation error body (Spring's `ProblemDetail` / field-error list) — the per-field contract the form maps back onto controls, which is why the backend's error shape is a frontend concern; interviewers ask what the API must return for you to show a message under the right input
- 401 vs 403 from Spring Security — 401 means not authenticated, so redirect to login; 403 means authenticated but not permitted, so show a message and never log the user out; reviewers show an interceptor that clears the token on 403 and ask what the user experiences
- Who owns the API contract — hand-written TypeScript interfaces kept in sync by hand versus generating a client from the backend's OpenAPI document; interviewers ask how the two sides stay aligned when a field is renamed, and expect you to know the generated option exists

## Testing — setup and mechanics
- Jasmine: `describe`, `it`, `expect`, `beforeEach` — the test structure Angular uses by default; required from project 07 onwards
- Karma vs Jasmine — Karma is the test *runner* that launches a browser and reports results, Jasmine is the *framework* that provides `describe`/`it`/`expect`; `ng test` starts both, which is why a freshly scaffolded project already has one passing spec; interviewers ask what each piece does when a candidate says "I use Karma to write tests"
- Jest as the alternative runner — Karma is deprecated and job postings increasingly name "Jasmine / Jest / Karma" together, so you must be able to say what Jest changes (no real browser, faster, its own mocking API) even if you have only used Karma; interviewers ask which runner you have actually worked with
- Testing a service vs testing a component — a service test needs no fixture and no change detection, a component test needs `createComponent` plus `detectChanges` and asserts on rendered DOM; interviewers ask which is cheaper and why most of a suite should be service tests
- `TestBed.configureTestingModule` — sets up the Angular DI context for a test so you can inject real services and mocks
- `ComponentFixture` — what `TestBed.createComponent()` returns, giving you `.componentInstance` (the class), `.nativeElement` (the rendered DOM), and `.detectChanges()`; interviewers ask how you reach the rendered HTML from a test
- `fixture.detectChanges()` — Angular does not run change detection automatically inside a test, so the template renders nothing until you call it; interviewers ask why a freshly created component's DOM is empty
- A fresh `TestBed` per `it` — `beforeEach` rebuilds the module and component so specs cannot leak state into each other; interviewers ask why a test passes alone but fails when the whole suite runs

## Testing services and HTTP
- Testing a service with `TestBed` — how to inject the service and call its methods in a test; what you verify and why
- What to test in a service — the business logic: correct return value, correct error thrown, correct state change after the call
- `spyOn(service, 'method')` — replaces a real method with a controlled fake; use `.and.returnValue()` to control what it returns and `.toHaveBeenCalledWith()` to assert it was called correctly; the standard way to isolate the unit under test
- Spy vs stub vs mock — a spy wraps or replaces one method and records the calls, a stub is a fake object returning canned values, a mock is a fake you also assert expectations on; interviewers ask for the distinction the moment a candidate says "I mocked the service"
- `jasmine.createSpyObj('AuthService', ['login'])` — builds an entire fake dependency in one call; interviewers ask how you keep a component test away from the real HTTP service
- `{ provide: RealService, useValue: mock }` in `configureTestingModule` — the DI override that swaps a real token for the fake; interviewers ask how you inject a fake `Router` or `AuthService`
- Faking `ActivatedRoute` — a routed detail component reads an id from the URL, so its test must provide a stub exposing `snapshot.paramMap` (or a `paramMap` Observable); interviewers ask how you test a component that depends on the route without starting the router
- A spied method must return the right *shape* — `spy.and.returnValue(of(data))`, not the raw array, or the caller's `.subscribe()`/`toSignal()` crashes on a value that is not an Observable; the single most common junior test failure
- `provideHttpClient()` + `provideHttpClientTesting()` — the standalone-era replacement for the deprecated `HttpClientTestingModule`; interviewers check whether the candidate knows the Angular 17+ form
- `HttpTestingController` — `expectOne(url)` asserts exactly one matching request was made and `req.flush(data)` supplies the mock response; interviewers ask how you test a service without a real backend
- `req.flush(null, { status: 500, statusText: 'Server Error' })` — how you drive the `catchError` branch from a test; interviewers ask how you cover the failure path, not just the happy one
- `httpMock.verify()` — fails the spec if any request was made that the test never expected; interviewers ask what stops a test passing while the service quietly fired an extra call

## Testing components and async
- `fixture.componentRef.setInput('name', value)` — the supported way to drive a signal `input()` from a test; assigning to the property directly skips the binding pipeline and does not work with signal inputs; interviewers ask how you test a dumb component's inputs
- Testing an `output()` — subscribe to the child's output in the spec and assert the emitted payload after triggering the DOM event; interviewers ask how you verify a presentational component emits correctly
- Triggering a DOM event in a test — `element.dispatchEvent(new Event('input'))` or `debugEl.triggerEventHandler('click')`, each followed by `detectChanges()`; interviewers ask how you simulate a user typing into a reactive-form input
- `DebugElement` and `By.css()` vs `nativeElement.querySelector()` — the Angular abstraction also exposes a matched child's component instance, which is how you assert the child received the right input; interviewers ask how you check what was passed down
- Testing a signal — the value is read synchronously (`component.count()`) so state assertions need no async helper, but the *rendered* value still needs `fixture.detectChanges()`; interviewers ask why the class value is correct while the DOM is stale
- Testing a `computed()` — you drive its source signals and assert the result; you never mock a computed, which is what makes it a testing-friendly shape; interviewers probe whether the candidate tests inputs or internals
- Testing an `effect()` — effects run on change detection or `TestBed.flushEffects()`, so an assertion placed immediately after `set()` sees nothing; interviewers ask why the effect "never fired" in the test
- `fakeAsync` + `tick()` — runs asynchronous code synchronously against a virtual clock so `setTimeout` and `debounceTime` can be advanced deterministically; interviewers ask how you test a `debounceTime(300)` search without really waiting 300 ms
- `tick()` vs `flush()` — `tick(ms)` advances the virtual clock by a set amount, `flush()` drains every pending macrotask whatever its delay; interviewers ask which you use when you don't know the debounce value
- `flushMicrotasks()` — settles pending promises without advancing the virtual clock at all; interviewers ask why a `tick(0)` test of a promise-based service still asserts on stale state
- "N timer(s) still in the queue" — a `fakeAsync` spec fails at teardown when a timer or interval was never flushed; interviewers show the error and ask what it is telling you
- `fakeAsync` vs `waitForAsync` — `fakeAsync` controls virtual time but cannot handle real XHR, `waitForAsync` + `fixture.whenStable()` waits on genuinely async work but gives you no time control; interviewers ask which fits a `debounceTime` test and which fits a real promise

## Testing quality and strategy
- Tests that pass but prove nothing — a component test missing `fixture.detectChanges()` (so bindings never render), a spec with no `expect`, or an assertion that only checks the mock's own return value instead of the code under test; reviewers show a green test suite and ask what it actually proves
- An assertion written inside a `subscribe()` callback — if the Observable never emits, the callback never runs, nothing is asserted, and the spec still goes green; reviewers show exactly this and ask what it proves
- `spyOn` applied to the method under test — stubbing the very unit being tested, so the assertion only verifies the spy; the canonical "green suite that tests the mock"
- Testing behaviour vs testing implementation — asserting that a private method was called, or reading internal fields, produces a suite that breaks on every refactor without catching a single bug; interviewers ask what makes a test brittle
- Shallow component testing (`NO_ERRORS_SCHEMA`, `overrideComponent`) — isolating a component from heavy children so the spec stays fast, and the integration bugs that choice stops catching; interviewers ask the tradeoff rather than the syntax
- Code coverage as a false signal — `ng test --code-coverage` happily reports 90% on a suite that asserts almost nothing, because coverage measures lines executed, not behaviour verified; interviewers ask whether a high number means the code is tested
- The test pyramid in an Angular suite — service logic first, then guards and interceptors, then component templates, because each layer up costs more to write and breaks more often; interviewers hand you an hour and ask what you would cover
- Mocking the service vs using `HttpTestingController` — stubbing the collaborator or letting the real service run against a fake network; interviewers ask which boundary you'd fake and why
- Testing a functional guard or interceptor — `CanActivateFn` and `HttpInterceptorFn` are plain functions that call `inject()`, so they must be invoked inside `TestBed.runInInjectionContext()`; interviewers ask how you unit-test a guard now that it is no longer a class
- Testing that a component navigated — spying on `router.navigate` is the cheap junior-level assertion; `provideRouter([])` with a real router is the fuller alternative; interviewers ask how you verify a redirect
- Regression test — a spec that reproduces the reported bug and fails before the fix is applied; interviewers ask what proves a fix actually addressed the reported behaviour rather than something adjacent

## Legacy code recognition — needed on day one at a consultancy
- `@Input()` and `@Output()` decorators — legacy equivalent of `input()` and `output()`; you will see these in every existing consultancy codebase
- `EventEmitter` — used with `@Output()` to emit values to the parent; replaced by `output()` in Angular 17+
- `NgModule` — `declarations`, `imports`, `exports`, `providers`; how pre-standalone Angular apps are structured; most consultancy projects still use this
- Migrating an NgModule app to standalone incrementally — a standalone component can be imported by an NgModule and vice versa, so the migration proceeds file by file rather than big-bang; interviewers at consultancies ask how you would start on a legacy codebase
- Class-based `CanActivate` guard — the pre-15 `implements CanActivate` service class still present in existing codebases; interviewers show one and ask for the functional `CanActivateFn` equivalent
- `*ngIf` and `*ngFor` — legacy structural directives; still widely used; `*ngFor` does not require `track` but performs worse without it
- `trackBy` on `*ngFor` — the legacy equivalent of `track`, written as a component method `(index, item) => item.id` and passed by reference; interviewers hand you a legacy list that re-creates every DOM node on refresh and ask what is missing
- `ngModel` and `FormsModule` — template-driven two-way binding with the `[()]` banana-in-a-box syntax; simpler than reactive forms for standalone fields; still widely used in existing consultancy codebases
- `ngOnChanges` — lifecycle hook that fires every time an `@Input()` value changes; receives a `SimpleChanges` object with the previous and current value; the signals equivalent is `effect()`
- `BehaviorSubject` — holds the current value and emits it immediately to new subscribers; the most common pattern for shared state before signals; interviewers ask the difference from `Subject`
- `Subject` — emits to currently active subscribers only; late subscribers miss values emitted before they subscribed; used for one-time events rather than shared state; interviewers ask the difference from `BehaviorSubject`
