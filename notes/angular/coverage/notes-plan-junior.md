# Angular Junior Notes Plan

Plan status: current
Coverage: notes/angular/coverage/junior.md
Coverage SHA-256: a04017429634fbc05ea84e5860d1f1a82c9033e27cb11f13e3a6739d79ff7424
Generated: 2026-07-24

## 01 — Components and template data flow

Status: pending
Action: audit
English: notes/angular/junior/en/01-components.md
Spanish: notes/angular/junior/es/01-components.md
Depends on: none

Coverage concepts:

- Standalone `@Component` — explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies
- Component `imports` — identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure
- Interpolation vs property binding — distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]`
- Event binding — handle a template event with `()` and explain why the template delegates behaviour to the component class
- Two-way binding — recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- `model()` — expose a writable child value with its matching change output when a reusable component genuinely owns two-way binding
- `input()` vs `input.required()` — model optional and mandatory parent-to-child data without hiding absence behind an unsafe default
- `output()` — send typed child events to a parent without making the child depend on the parent's implementation
- `@if` vs `@switch` — choose branching conditions or fixed-value cases so mutually exclusive UI states remain readable
- `@for` and `track` — render collections with stable identity so Angular can reuse DOM nodes instead of recreating them
- Content projection with `ng-content` — recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs
- Components vs attribute directives — use a component when behaviour owns a view and a directive when behaviour augments an existing host element

Rationale: These concepts form the coherent coverage group “Components and template data flow”.

## 02 — Lifecycle and dependency injection

Status: pending
Action: audit
English: notes/angular/junior/en/04-services.md
Spanish: notes/angular/junior/es/04-services.md
Depends on: 01

Coverage concepts:

- Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves
- `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton
- `inject()` vs constructor injection — recognise both supported injection styles and choose consistently without confusing construction with lifecycle work
- Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs
- `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences
- Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view

Rationale: These concepts form the coherent coverage group “Lifecycle and dependency injection”.

## 03 — Signals and local state

Status: pending
Action: audit
English: notes/angular/junior/en/03-signals.md
Spanish: notes/angular/junior/es/03-signals.md
Depends on: 02

Coverage concepts:

- `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value
- `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one
- `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation
- `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state
- `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system
- Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot
- Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views
- `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal

Rationale: These concepts form the coherent coverage group “Signals and local state”.

## 04 — HTTP integration

Status: pending
Action: audit
English: notes/angular/junior/en/06-http-rxjs.md
Spanish: notes/angular/junior/es/06-http-rxjs.md
Depends on: 03

Coverage concepts:

- Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON
- `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- `Observable` vs `Promise` — compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- `subscribe()` callbacks — handle next and error outcomes deliberately and keep presentation state consistent after a failed request
- `map()` vs `tap()` — transform emitted data with `map()` and reserve `tap()` for observation or side effects
- `switchMap()` — cancel a stale inner request when a newer search term or route value arrives
- Search pipeline operators — combine `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to avoid premature, duplicate, and stale requests
- `catchError()` — recover, translate, or rethrow an error without silently converting every failure into successful empty data
- `async` pipe vs manual subscription — prefer template-managed subscription for displayed streams and subscribe imperatively only when a side effect requires it
- Subscription cleanup — use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete
- `toSignal()` vs manual subscription — expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects
- `toSignal()` vs `toObservable()` — convert in the direction required by the consumer instead of wrapping reactive primitives back and forth without purpose

Rationale: These concepts form the coherent coverage group “HTTP integration, RxJS streams and pipelines”.

## 05 — Routing and cross-cutting HTTP behaviour

Status: pending
Action: audit
English: notes/angular/junior/en/05-routing.md
Spanish: notes/angular/junior/es/05-routing.md
Depends on: 04

Coverage concepts:

- Router configuration — connect `provideRouter`, route definitions, `routerLink`, and `RouterOutlet` into a navigable standalone application
- `ActivatedRoute` params and query params — read route identity from `paramMap` and optional Angular view filters from `queryParamMap`
- `ActivatedRoute.snapshot` vs observable params — use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes
- Lazy route loading — use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it
- `loadComponent` vs `loadChildren` — lazy-load one routed component or an entire child route tree according to the feature boundary
- Declarative vs programmatic navigation — use `routerLink` in templates and `Router.navigate()` when component logic determines the destination
- Wildcard routes and redirect order — place a `**` fallback last because Angular uses first-match-wins route evaluation
- `CanActivateFn` guards — return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect
- Route guards vs backend authorisation — treat guards as client-side navigation control, never as enforcement of data access
- `CanDeactivateFn` guards — protect unsaved form state while recognising that browser or process termination may bypass application navigation
- Functional HTTP interceptors — centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop

Rationale: These concepts form the coherent coverage group “Routing and cross-cutting HTTP behaviour”.

## 06 — Reactive forms and template transformation

Status: pending
Action: audit
English: notes/angular/junior/en/07-reactive-forms.md
Spanish: notes/angular/junior/es/07-reactive-forms.md
Depends on: 05

Coverage concepts:

- `FormControl`, `FormGroup`, and `FormBuilder` — model controls and groups explicitly and use the builder as concise construction syntax rather than a different forms model
- Typed reactive forms — keep control nullability and value types aligned with the API model so casts do not hide invalid form states
- Built-in validators — combine rules such as `required`, `email`, `min`, and `maxLength` at the control boundary
- Custom validators — return `null` or a keyed error object from a pure validation function so templates can identify the failed rule
- Validation display state — combine invalid state with `touched` or submit state so errors are helpful without appearing before interaction
- `markAllAsTouched()` — surface all invalid controls after a submit attempt without changing whether the form is valid
- `setValue()` vs `patchValue()` — choose strict full-shape assignment or deliberate partial updates when prefilling edit forms
- `dirty`, `reset()`, and server errors — distinguish local edits, reset the saved baseline, and avoid losing backend errors through an immediate validator rerun
- `FormArray` vs `FormGroup` — model a dynamic indexed collection separately from a fixed set of named controls
- Built-in vs custom pipes — keep pure display transformation in templates and avoid hiding business logic or expensive impure work in a pipe
- Pure vs impure pipes — prefer cached pure transformation and recognise that an impure pipe runs on every change-detection cycle
- Form `valueChanges` — compose dependent-field and filtering behaviour as an Observable without nesting manual event handlers

Rationale: These concepts form the coherent coverage group “Reactive forms and template transformation”.

## 07 — Change detection

Status: pending
Action: audit
English: notes/angular/junior/en/11-change-detection.md
Spanish: notes/angular/junior/es/11-change-detection.md
Depends on: 06

Coverage concepts:

- Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server

Rationale: These concepts form the coherent coverage group “Change detection”.

## 08 — Testing Angular behaviour

Status: pending
Action: audit
English: notes/angular/junior/en/13-testing.md
Spanish: notes/angular/junior/es/13-testing.md
Depends on: 07

Coverage concepts:

- Vitest vs Jasmine/Karma recognition — use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- Test structure and assertions — use `describe`, setup hooks, `it`, and meaningful expectations to express behaviour rather than mere object existence
- `TestBed` — configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies
- Service unit tests — isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- Spies and test doubles — control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation
- HTTP tests with `provideHttpClientTesting()` — intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- `provideHttpClientTesting()` vs `HttpClientTestingModule` — use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- HTTP error tests — flush an error response and assert the service's observable or state follows the documented failure path
- Component tests — verify rendered behaviour and user interaction instead of asserting only that the component can be constructed

Rationale: These concepts form the coherent coverage group “Testing Angular behaviour”.

## 09 — Legacy enterprise code recognition

Status: pending
Action: audit
English: notes/angular/junior/en/18-legacy-rxjs-subjects.md
Spanish: notes/angular/junior/es/18-legacy-rxjs-subjects.md
Depends on: 08

Coverage concepts:

- `NgModule` — read `declarations`, `imports`, `exports`, and `providers` in pre-standalone applications without treating modules as required in new features
- Signal inputs/outputs vs `@Input()`/`@Output()` — use current function APIs in new code and recognise decorator plus `EventEmitter` communication in maintained applications
- `*ngIf` vs `@if` — read both syntaxes and understand that the modern block syntax does not require importing `NgIf`
- `*ngFor` `trackBy` vs `@for` `track` — preserve stable identity in both template generations
- Template-driven vs reactive forms — recognise `ngModel` for simple template-owned fields and choose reactive forms for explicit, testable form models
- `Subject` vs `BehaviorSubject` — distinguish event broadcasting from state that immediately exposes its latest value to new subscribers
- `Observable` naming and `$` convention — read established code that marks streams with a trailing `$` without assuming the convention changes runtime behaviour
- Angular CLI build workflow — use generation, development, test, and production-build commands and recognise that a successful dev server does not prove the production build succeeds

Rationale: These concepts form the coherent coverage group “Legacy enterprise code recognition”.

## Unassigned existing notes

- notes/angular/junior/en/02-directives.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/08-pipes.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/09-coordinator-pattern.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/10-component-styles.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/12-folder-structure.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/14-role-aware-ui.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/15-dialog-backdrop-close.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/16-standalone-components.md — no junior coverage group is assigned to this legacy file.
- notes/angular/junior/en/17-rxjs-interop.md — no junior coverage group is assigned to this legacy file.
