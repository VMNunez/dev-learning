# Minimum Coverage — Angular

Minimum hiring floor for a junior or junior-mid Angular developer targeting Spanish consultancies in 2026.
Items are ordered by filtering risk and cover both modern Angular and the legacy patterns common in maintained enterprise codebases.

## Components and template data flow

- Standalone `@Component` — explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies
- Component `imports` — identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure
- Interpolation vs property binding — distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]`
- Event binding — handle a template event with `()` and explain why the template delegates behaviour to the component class
- Two-way binding — recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- `input()` vs `input.required()` — model optional and mandatory parent-to-child data without hiding absence behind an unsafe default
- `output()` — send typed child events to a parent without making the child depend on the parent's implementation
- `@if` vs `@switch` — choose branching conditions or fixed-value cases so mutually exclusive UI states remain readable
- `@for` and `track` — render collections with stable identity so Angular can reuse DOM nodes instead of recreating them
- Template reference variables — capture a template element, directive, or component instance for a local interaction without turning it into application state
- Safe navigation and nullish template values — render data that may not exist yet without hiding an invalid domain assumption behind broad non-null assertions
- Content projection with `ng-content` — recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs
- Components vs attribute directives — use a component when behaviour owns a view and a directive when behaviour augments an existing host element
- Custom attribute directives and host interaction — implement reusable host-element behaviour and connect host properties or events through directive host bindings and listeners without taking ownership of the element's view
- Conditional class and style binding — use focused class and style bindings for dynamic presentation and recognise `ngClass` or `ngStyle` when maintained templates apply several values together

## Application bootstrap and component styles

- `bootstrapApplication()` — identify the standalone root component and the application-level providers that start a modern Angular application
- Application provider boundary — register application-wide capabilities at bootstrap rather than scattering their providers through component scopes
- `styleUrl`/`styleUrls` vs inline `styles` — locate a component's styles and choose external files or small inline rules without confusing either form with global CSS

## Lifecycle and dependency injection

- Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves
- `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton
- `inject()` vs constructor injection — recognise both supported injection styles and choose consistently without confusing construction with lifecycle work
- Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- `InjectionToken` and configured providers — inject typed configuration or other non-class dependencies and recognise `useValue`, `useClass`, `useFactory`, and `useExisting`, including that `useExisting` aliases an existing provider rather than creating another class instance
- `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs
- `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences
- Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view

## Signals and local state

- `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value
- `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one
- `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation
- `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state
- `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system
- Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot
- Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views
- `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal

## HTTP integration

- Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON
- `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- Remote UI states — represent loading, empty, error, and success explicitly so a page does not treat a successful response as its only possible state

## RxJS streams and pipelines

- `Observable` vs `Promise` — compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- `Observable` vs `Subject` — distinguish a declarative subscribable stream from a subject that can be imperatively fed and multicast, rather than using a subject as the default state container
- `subscribe()` callbacks — handle next and error outcomes deliberately and keep presentation state consistent after a failed request
- `map()` vs `tap()` — transform emitted data with `map()` and reserve `tap()` for observation or side effects
- `switchMap()` — cancel a stale inner request when a newer search term or route value arrives
- `switchMap()` vs `mergeMap()` — cancel replaceable work with `switchMap()` and preserve deliberate concurrent inner work with `mergeMap()` instead of choosing by habit
- `concatMap()` vs `exhaustMap()` — queue ordered inner work with `concatMap()` and ignore new triggers with `exhaustMap()` while current work is active, especially for writes and form submissions
- Search pipeline operators — combine `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to avoid premature, duplicate, and stale requests
- Nested subscriptions vs flattening operators — compose dependent asynchronous work in one pipeline so cancellation, errors, and cleanup remain visible
- `catchError()` — recover, translate, or rethrow an error without silently converting every failure into successful empty data
- `catchError()` placement around flattening operators — recover inside an inner request when the outer interaction stream must remain alive and catch outside only when terminating the whole pipeline is intended
- `finalize()` — clear loading or other lifecycle state when a stream completes or errors without duplicating cleanup across success and failure callbacks
- `async` pipe vs manual subscription — prefer template-managed subscription for displayed streams and subscribe imperatively only when a side effect requires it
- Subscription cleanup — use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete
- `toSignal()` vs manual subscription — expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects

## Routing and cross-cutting HTTP behaviour

- Router configuration — connect `provideRouter`, route definitions, `routerLink`, and `RouterOutlet` into a navigable standalone application
- Child routes and nested outlets — model a feature's route hierarchy so its shared layout remains mounted while child content changes
- `ActivatedRoute` params and query params — read route identity from `paramMap` and optional Angular view filters from `queryParamMap`
- `ActivatedRoute.snapshot` vs observable params — use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes
- Lazy route loading — use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it
- `loadComponent` vs `loadChildren` — lazy-load one routed component or an entire child route tree according to the feature boundary
- Declarative vs programmatic navigation — use `routerLink` in templates and `Router.navigate()` when component logic determines the destination
- Wildcard routes and redirect order — place a `**` fallback last because Angular uses first-match-wins route evaluation
- Redirect `pathMatch` — use `pathMatch: 'full'` for an empty-path redirect when prefix matching would otherwise catch every URL
- `CanActivateFn` guards — return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect
- Route guards vs backend authorisation — treat guards as client-side navigation control, never as enforcement of data access
- `CanDeactivateFn` guards — protect unsaved form state while recognising that browser or process termination may bypass application navigation
- Functional HTTP interceptors — centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop
- Immutable interceptor requests — clone an `HttpRequest` before changing headers or other request properties because interceptor inputs are immutable
- `HttpErrorResponse` — inspect status and error payload while distinguishing a backend error response from a client-side or network failure

## Reactive forms and template transformation

- `FormControl`, `FormGroup`, and `FormBuilder` — model controls and groups explicitly and use the builder as concise construction syntax rather than a different forms model
- Typed reactive forms — keep control nullability and value types aligned with the API model so casts do not hide invalid form states
- Built-in validators — combine rules such as `required`, `email`, `min`, and `maxLength` at the control boundary
- Custom validators — return `null` or a keyed error object from a pure validation function so templates can identify the failed rule
- Validation display state — combine invalid state with `touched` or submit state so errors are helpful without appearing before interaction
- `markAllAsTouched()` — surface all invalid controls after a submit attempt without changing whether the form is valid
- `setValue()` vs `patchValue()` — choose strict full-shape assignment or deliberate partial updates when prefilling edit forms
- Disabled controls and `getRawValue()` — recognise that a disabled control is excluded from `form.value` and opt into its value only when the submission contract requires it
- `dirty`, `reset()`, and server errors — distinguish local edits, reset the saved baseline, and avoid losing backend errors through an immediate validator rerun
- Client vs server validation — use form validation for immediate feedback while treating backend validation as authoritative and mapping field errors back to the relevant controls
- `FormArray` vs `FormGroup` — model a dynamic indexed collection separately from a fixed set of named controls
- Built-in vs custom pipes — keep pure display transformation in templates and avoid hiding business logic or expensive impure work in a pipe
- Pure vs impure pipes — prefer a pure pipe whose transform is skipped while primitive values or object references stay unchanged, and recognise that an impure pipe runs on every change-detection cycle
- Form `valueChanges` — compose dependent-field and filtering behaviour as an Observable without nesting manual event handlers

## Change detection

- Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server
- Build-time configuration vs frontend secrets — configure public environment-dependent values at build or deployment time while recognising that anything shipped to the browser can be read by a user
- Angular template sanitisation — distinguish escaped interpolation from context-sensitive sanitisation and treat `bypassSecurityTrust...` as an explicit trust-boundary decision

## Testing Angular behaviour

- Vitest vs Jasmine/Karma recognition — use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- `TestBed` — configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies
- Service unit tests — isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- Spies and test doubles — control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation
- HTTP tests with `provideHttpClientTesting()` — intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- `provideHttpClientTesting()` vs `HttpClientTestingModule` — use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- `HttpTestingController.verify()` — fail a test when expected requests remain outstanding or unexpected requests were left unresolved
- HTTP error tests — flush an error response and assert the service's observable or state follows the documented failure path
- `ComponentFixture` — trigger change detection, query rendered DOM, simulate an interaction, and assert visible component behaviour rather than mere construction

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
