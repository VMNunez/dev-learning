# Minimum Coverage — Angular

Minimum hiring floor for a junior or junior-mid Angular developer targeting Spanish consultancies in 2026.
Items are ordered by filtering risk and cover both modern Angular and the legacy patterns common in maintained enterprise codebases.

## Components and template data flow

- Standalone `@Component` — explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies ✅ 01-todo-list
- Component `imports` — identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure ✅ 01-todo-list
- Interpolation vs property binding — distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]` ✅ 01-todo-list
- Attribute binding — reach for `[attr.x]` when the target is an HTML attribute with no DOM property behind it, such as an ARIA attribute or an SVG attribute, because a plain `[x]` binding on those silently sets nothing ✅ 04-meal-finder — both favourite toggles carry `[attr.aria-label]="favouriteLabel()"`, the only binding in the project whose target has no DOM property
- Event binding — handle a template event with `()` and explain why the template delegates behaviour to the component class ✅ 01-todo-list
- Key event modifiers — filter a keyboard event in the binding itself with `(keyup.enter)` rather than inspecting the event object in the component, so the template states which keystroke it handles ✅ 01-todo-list — `task-form.html` binds `(keyup.enter)="submit(taskInput)"` on the input so Enter and the button click reach one handler
- Two-way binding — recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- `input()` — receive optional parent-to-child data and handle its absence explicitly instead of hiding it behind a default that reads as real data ✅ 02-weather-app
- `input.required()` — declare mandatory parent-to-child data so a missing value fails at the template boundary rather than as an undefined read later ✅ 01-todo-list
- `output()` — send typed child events to a parent without making the child depend on the parent's implementation ✅ 01-todo-list
- `@if` — branch on a condition so mutually exclusive UI states stay readable instead of being hidden with CSS ✅ 01-todo-list
- `@switch` — express a value's known variants as fixed cases instead of chaining conditions that repeat the same subject
- `@for` and `track` — render collections with stable identity so Angular can reuse DOM nodes instead of recreating them ✅ 01-todo-list
- `@empty` — attach a collection's empty case to the loop instead of a sibling condition, and recognise that it reports only that the loop's own expression rendered nothing, so a filtered list must consult its unfiltered source to say why it is empty ✅ 01-todo-list — `task-list.html` nests `@if (totalCount() === 0)` inside `@empty` so a filtered miss and an empty list read differently
- Template reference variables — capture a template element, directive, or component instance for a local interaction without turning it into application state ✅ 01-todo-list
- Safe navigation and nullish template values — render data that may not exist yet without hiding an invalid domain assumption behind broad non-null assertions ✅ 03-expense-tracker
- Content projection with `ng-content` — recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs
- Components vs attribute directives — use a component when behaviour owns a view and a directive when behaviour augments an existing host element
- Custom attribute directives and host interaction — implement reusable host-element behaviour and connect host properties or events through directive host bindings and listeners without taking ownership of the element's view
- Conditional class and style binding — use focused class and style bindings for dynamic presentation and recognise `ngClass` or `ngStyle` when maintained templates apply several values together ✅ 01-todo-list

## Application bootstrap and component styles

- `bootstrapApplication()` — identify the standalone root component and the application-level providers that start a modern Angular application ✅ 01-todo-list
- Application provider boundary — register application-wide capabilities at bootstrap rather than scattering their providers through component scopes ✅ 01-todo-list
- `styleUrl`/`styleUrls` vs inline `styles` — locate a component's styles and choose external files or small inline rules without confusing either form with global CSS ✅ 01-todo-list
- View encapsulation — explain how Angular scopes emulated component styles with generated attributes and why a component rule does not normally style a child component's internal elements ✅ 01-todo-list
- `:host` selector — target the component host from its own stylesheet when the custom element itself needs layout or state styling ✅ 06-hr-portal
- Global vs component styles — keep application-wide rules and library overrides at the global boundary while leaving component-specific presentation with its component ✅ 01-todo-list
- `::ng-deep` recognition — recognise the deprecated encapsulation escape hatch in maintained code and prefer supported library APIs, global rules, or explicit styling boundaries for new work

## Lifecycle and dependency injection

- Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves ✅ 01-todo-list
- `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton ✅ 01-todo-list
- `inject()` — obtain a dependency in an injection context without a constructor parameter, the style current Angular code prefers ✅ 01-todo-list
- Constructor injection — read and write the parameter-based style still common in maintained code, without confusing construction with lifecycle work
- Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- `InjectionToken` — inject typed configuration or other non-class dependencies through a token rather than a class type ✅ 05-task-manager
- Configured provider recipes — recognise `useValue`, `useClass`, `useFactory`, and `useExisting`, including that `useExisting` aliases an existing provider rather than creating another class instance ✅ 05-task-manager — the dialog specs bind both runtime tokens with `useValue`, one carrying a full `ConfirmDialogData` and the other `null` for the create case
- `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs ✅ 02-weather-app
- `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences ✅ 05-task-manager
- Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view ✅ 02-weather-app

## Signals and local state

- `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value ✅ 01-todo-list
- `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one ✅ 01-todo-list
- `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation ✅ 01-todo-list
- `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state ✅ 04-meal-finder
- `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system ✅ 04-meal-finder
- `effect()` cleanup function — register cleanup inside an effect so work started by the previous run is cancelled before it re-executes or the injection context is destroyed ✅ 04-meal-finder — the detail-page effect unsubscribes the in-flight `getMealById` through `onCleanup` before reloading for a new route id
- Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot ✅ 01-todo-list
- Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views ✅ 01-todo-list
- `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal ✅ 01-todo-list
- `asReadonly()` — expose a service's writable signal as a read-only handle so consumers stay reactive while the service's own methods remain the only writers ✅ 04-meal-finder — `FavouriteService` keeps the writable signal private and exposes `favourites` through `asReadonly()`, so `addFavourite`/`deleteFavourite` are the only writers the three pages can reach
- Deriving the lookup rather than the predicate — answer a per-key question by deriving the whole lookup structure once, because `computed()` takes no arguments by design and a parameterised method cannot be memoised ✅ 04-meal-finder — `FavouriteService.favouriteIds` derives a `Set` of ids once, so the three pages ask `has(id)` instead of each keeping its own parameterised scan

## HTTP integration

- `provideHttpClient()` and its feature functions — enable `HttpClient` application-wide at bootstrap and opt into behaviour such as the Fetch backend or interceptors through explicit `with...()` features instead of separate providers ✅ 02-weather-app
- Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON ✅ 02-weather-app
- `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged ✅ 02-weather-app — `WeatherService` chains `new HttpParams().set(...)` three times and passes the result to `get()`
- Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- Remote UI states — represent loading, empty, error, and success explicitly so a page does not treat a successful response as its only possible state ✅ 02-weather-app

## RxJS streams and pipelines

- `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams according to source behaviour ✅ 02-weather-app

- `Observable` vs `Promise` — compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- `Observable` vs `Subject` — distinguish a declarative subscribable stream from a subject that can be imperatively fed and multicast, rather than using a subject as the default state container
- `subscribe()` callbacks — handle next and error outcomes deliberately and keep presentation state consistent after a failed request ✅ 02-weather-app
- `map()` vs `tap()` — transform emitted data with `map()` and reserve `tap()` for observation or side effects ✅ 04-meal-finder — `paramMap.pipe(map(params => params.get("id")))` narrows the router stream to the id before it becomes a signal
- `switchMap()` — cancel a stale inner request when a newer search term or route value arrives
- `switchMap()` vs `mergeMap()` — cancel replaceable work with `switchMap()` and preserve deliberate concurrent inner work with `mergeMap()` instead of choosing by habit
- `concatMap()` vs `exhaustMap()` — queue ordered inner work with `concatMap()` and ignore new triggers with `exhaustMap()` while current work is active, especially for writes and form submissions
- Search pipeline operators — combine `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to avoid premature, duplicate, and stale requests
- Nested subscriptions vs flattening operators — compose dependent asynchronous work in one pipeline so cancellation, errors, and cleanup remain visible
- `catchError()` — recover, translate, or rethrow an error without silently converting every failure into successful empty data ✅ 04-meal-finder — `MealService.handleFailure` logs once and rethrows a domain `Error`, so a network failure never arrives at a page as an empty result list
- `catchError()` placement around flattening operators — recover inside an inner request when the outer interaction stream must remain alive and catch outside only when terminating the whole pipeline is intended
- `finalize()` — clear loading or other lifecycle state when a stream completes or errors without duplicating cleanup across success and failure callbacks
- `async` pipe vs manual subscription — prefer template-managed subscription for displayed streams and subscribe imperatively only when a side effect requires it
- Subscription cleanup — use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete ✅ 02-weather-app
- `toSignal()` vs manual subscription — expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects ✅ 04-meal-finder — the detail page turns `ActivatedRoute.paramMap` into a `mealId` signal read by both an `effect()` and a `computed()`

## Routing and cross-cutting HTTP behaviour

- Router bootstrap and outlet — register routing with `provideRouter` and give routed components a rendering location with `RouterOutlet` ✅ 01-todo-list
- Route definitions and `routerLink` — map paths to components and move between them declaratively so the application becomes navigable ✅ 03-expense-tracker
- Application shell outside the outlet — place chrome that must survive navigation in the root component around `RouterOutlet`, because the router destroys and recreates the routed component on every navigation ✅ 04-meal-finder — the nav and its favourites badge sit in `app.html` above `<router-outlet />`, so the count stays on screen while `/`, `/detail/:id` and `/favourites` are mounted and destroyed under it
- Child routes and nested outlets — model a feature's route hierarchy so its shared layout remains mounted while child content changes
- `ActivatedRoute` route params — read route identity from `paramMap` so a routed component knows which resource it is showing ✅ 04-meal-finder
- A route parameter is always text — `paramMap.get()` yields `string | null` whatever the model declares, so converting it is a decision that has to agree with the identifier's real type; a conversion that no longer matches fails silently, because the lookup simply finds nothing and the view renders as if the record did not exist ✅ 06-hr-portal — `DepartmentForm.ngOnInit` hands `paramMap.get('id')` straight to `getById`, the `Number(rawId)` conversion dropped once `Department.id` became a `string`
- `ActivatedRoute` query params — read optional Angular view filters from `queryParamMap` without making them part of the resource path ✅ 06-hr-portal
- `[queryParams]` on `routerLink` — set optional view state on the destination URL while navigating declaratively so the resulting page stays linkable and reproducible ✅ 06-hr-portal
- Routed view state in the URL — keep state the user must find again, such as a search term, in the URL and re-derive the view from it on load, because the router destroys the routed component and its signals on every navigation, so anything held only in fields is gone on return ✅ 04-meal-finder — the search page navigates to `/?q=term` instead of holding the term in a field, and rebuilds its results from `toSignal(queryParamMap)`, so `← Back` from a detail page restores the search
- `ActivatedRoute.snapshot` vs observable params — use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes ✅ 04-meal-finder
- Lazy route loading — use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it ✅ 06-hr-portal
- `loadComponent` vs `loadChildren` — lazy-load one routed component or an entire child route tree according to the feature boundary
- Declarative vs programmatic navigation — use `routerLink` in templates and `Router.navigate()` when component logic determines the destination ✅ 03-expense-tracker
- `routerLinkActive` — let the router add a class to the link whose route is currently active instead of comparing the URL by hand in the component, and state the same fact in the accessibility tree with `ariaCurrentWhenActive`, because a colour or a weight change reaches only the eye ✅ 04-meal-finder — both nav links carry `routerLinkActive="active"` and `ariaCurrentWhenActive="page"`, so `/favourites` is marked without the shell tracking the URL itself
- `routerLinkActiveOptions` exact matching — recognise that an active link matches by URL *prefix* by default, so a link to the root path stays active on every route until `{ exact: true }` narrows it to the whole URL ✅ 04-meal-finder — the brand link to `/` carries `[routerLinkActiveOptions]="{ exact: true }"` so it does not stay marked on `/favourites` and `/detail/:id`
- Browser history navigation — return to the previous entry through `Location` when a page is reachable from several routes, instead of hardcoding one destination that is wrong for every other caller ✅ 06-hr-portal
- A deep-linked page has no in-app history — `Location.back()` replays the *browser's* history, which on a URL opened directly (a shared link, a refresh, a new tab) holds the page the user came from outside the site, so a back control has to know whether this application performed an earlier navigation and fall back to a real in-app destination when it did not ✅ 04-meal-finder — `NavigationHistoryService` counts `NavigationEnd` events from bootstrap and the detail page routes to `/` instead of calling `back()` while that count is 1
- Wildcard routes and redirect order — place a `**` fallback last because Angular uses first-match-wins route evaluation ✅ 06-hr-portal
- Redirect `pathMatch` — use `pathMatch: 'full'` for an empty-path redirect when prefix matching would otherwise catch every URL ✅ 06-hr-portal
- `CanActivateFn` guards — return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect ✅ 06-hr-portal
- Stacked route guards — compose several guards on one route and recognise that every one must allow activation, which keeps authentication and authorisation as separate reusable checks ✅ 06-hr-portal
- Route guards vs backend authorisation — treat guards as client-side navigation control, never as enforcement of data access
- `CanDeactivateFn` guards — protect unsaved form state while recognising that browser or process termination may bypass application navigation ✅ 06-hr-portal
- Functional HTTP interceptors — centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop ✅ 06-hr-portal
- Immutable interceptor requests — clone an `HttpRequest` before changing headers or other request properties because interceptor inputs are immutable ✅ 06-hr-portal
- `HttpErrorResponse` — inspect status and error payload while distinguishing a backend error response from a client-side or network failure

## Reactive forms and template transformation

- `FormControl` and `FormGroup` — model individual controls and grouped control sets explicitly so the form's shape, validators, and value types live in TypeScript rather than in the template ✅ 03-expense-tracker
- `FormBuilder` — construct the same control model with less ceremony, recognising it as concise syntax over `FormControl` and `FormGroup` rather than a different forms model ✅ 06-hr-portal
- Typed reactive forms — keep control nullability and value types aligned with the API model so casts do not hide invalid form states ✅ 03-expense-tracker
- Built-in validators — combine rules such as `required`, `email`, `min`, and `maxLength` at the control boundary ✅ 03-expense-tracker
- Custom validators — return `null` or a keyed error object from a pure validation function so templates can identify the failed rule
- `setErrors()` for rules a validator cannot express — attach a keyed error to a control from code when the check needs data a validator function cannot reach, such as a uniqueness lookup, recognising that the next validator run clears it again ✅ 06-hr-portal
- Validation display state — combine invalid state with `touched` or submit state so errors are helpful without appearing before interaction ✅ 03-expense-tracker
- `markAllAsTouched()` — surface all invalid controls after a submit attempt without changing whether the form is valid ✅ 03-expense-tracker
- `setValue()` vs `patchValue()` — choose strict full-shape assignment or deliberate partial updates when prefilling edit forms ✅ 05-task-manager
- Disabled controls and `getRawValue()` — recognise that a disabled control is excluded from `form.value` and opt into its value only when the submission contract requires it
- `dirty` — distinguish a form the user has actually edited from an untouched one, for example to guard discarding unsaved changes ✅ 05-task-manager
- `reset()` and server errors — reset the saved baseline and avoid losing backend errors through an immediate validator rerun
- Client vs server validation — use form validation for immediate feedback while treating backend validation as authoritative and mapping field errors back to the relevant controls
- `FormArray` vs `FormGroup` — model a dynamic indexed collection separately from a fixed set of named controls
- Built-in pipes — apply Angular's standard display transformations such as `DecimalPipe`, `DatePipe`, and `SlicePipe` in the template instead of duplicating formatting logic in the component class ✅ 02-weather-app
- Custom pipes — extract a reusable pure display transformation behind a pipe without hiding business logic or expensive impure work in it
- Pure vs impure pipes — prefer a pure pipe whose transform is skipped while primitive values or object references stay unchanged, and recognise that an impure pipe runs on every change-detection cycle
- Form `valueChanges` — compose dependent-field and filtering behaviour as an Observable without nesting manual event handlers

## Change detection

- Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- Template method calls vs `computed()` — recognise that a function called from a template re-runs on every change detection because it caches nothing, while a computed signal returns its stored value until a source signal changes, so a per-item call inside a loop repeats the whole scan on every check ✅ 04-meal-finder — `search-page.html` calls `isFavourite(meal.idMeal)` once per card on every check, so the method resolves through the memoised `Set` rather than re-scanning the favourites array
- `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server
- Build-time configuration vs frontend secrets — configure public environment-dependent values at build or deployment time while recognising that anything shipped to the browser can be read by a user ✅ 02-weather-app
- Angular template sanitisation — distinguish escaped interpolation from context-sensitive sanitisation and treat `bypassSecurityTrust...` as an explicit trust-boundary decision

## Testing Angular behaviour

- Vitest vs Jasmine/Karma recognition — use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- `TestBed` — configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies ✅ 04-meal-finder — each page spec adds exactly the providers its unit injects (`provideRouter([])` for the routed pages, plus `provideHttpClient()` for the two that call the API), where the scaffold suite failed on `NG0201: No provider found for ActivatedRoute`
- Runtime-supplied injection tokens in tests — recognise that a value the framework mints when it creates the unit, such as a dialog's reference and its data token, is provided by no module, so a spec that mounts the unit alone must supply it as a double rather than importing more of the library ✅ 05-task-manager — `confirm-dialog.spec.ts` and `task-dialog.spec.ts` register `MatDialogRef` and `MAT_DIALOG_DATA` themselves, where mounting the dialogs alone threw `NG0201: No provider found for MatDialogRef`
- Service unit tests — isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- Spies and test doubles — control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation ✅ 05-task-manager — the injected `MatDialogRef` double is a `vi.fn()` `close`, asserted to receive `true` on confirm and the built task only once the form is valid
- HTTP tests with `provideHttpClientTesting()` — intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- `provideHttpClientTesting()` vs `HttpClientTestingModule` — use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- `HttpTestingController.verify()` — fail a test when expected requests remain outstanding or unexpected requests were left unresolved
- HTTP error tests — flush an error response and assert the service's observable or state follows the documented failure path
- `ComponentFixture` — trigger change detection, query rendered DOM, simulate an interaction, and assert visible component behaviour rather than mere construction ✅ 04-meal-finder — `category-filter.spec.ts` changes the `selected` input, awaits `whenStable()` and reads back which button carries `aria-pressed="true"`, instead of asserting the component was constructed
- `componentRef.setInput()` — supply a required input from a test before the first change detection, because a component contract that a parent normally satisfies is the test harness's responsibility once the component is mounted alone ✅ 01-todo-list — `task-item.spec.ts` feeds the `input.required<Task>()` through `componentRef.setInput` before `whenStable()`, where the render previously threw NG0950

## Debugging and maintained-code navigation

- Angular error triage — use compiler output, runtime error context, dependency-injection traces, router events, and the browser Network panel to locate the failing boundary before changing code
- Feature-flow tracing — follow a route through its page component, injected service, HTTP call, reactive state, template states, and test before modifying an unfamiliar maintained feature

## Legacy enterprise code recognition

- `NgModule` — read `declarations`, `imports`, `exports`, and `providers` in pre-standalone applications without treating modules as required in new features
- Signal inputs/outputs vs `@Input()`/`@Output()` — use current function APIs in new code and recognise decorator plus `EventEmitter` communication in maintained applications
- `*ngIf` vs `@if` — read both syntaxes and understand that the modern block syntax does not require importing `NgIf`
- `*ngFor` `trackBy` vs `@for` `track` — preserve stable identity in both template generations
- Template-driven vs reactive forms — recognise `ngModel` for simple template-owned fields and choose reactive forms for explicit, testable form models
- `Subject` vs `BehaviorSubject` — distinguish event broadcasting from state that immediately exposes its latest value to new subscribers
- `Observable` naming and `$` convention — read established code that marks streams with a trailing `$` without assuming the convention changes runtime behaviour
- Angular CLI workspace configuration — read configured targets and package scripts in a maintained workspace instead of assuming every project uses the CLI defaults
