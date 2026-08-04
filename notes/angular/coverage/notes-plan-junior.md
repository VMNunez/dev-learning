# Angular Junior Notes Plan

Plan status: stale
Coverage: notes/angular/coverage/junior.md
Coverage SHA-256: fc92b61ea2a839c2fbf1263949fde22b07609c2ef58c957d924a676e8c8bb8e5
Generated: 2026-08-02

## 00 — Angular in the browser

Status: pending
Action: create
English: notes/angular/junior/en/00-angular-introduction.md
Spanish: notes/angular/junior/es/00-introduccion-angular.md
Depends on: none
Pending additions: none

Narrative role: Establish Angular as a declarative browser framework, place it in Victor's Angular + Spring Boot stack, contrast its framework-owned conventions with React's library model, and map the complete junior route before syntax.

Learning outcome: Victor can explain how Angular turns application state and events into UI, where it sits beside Spring Boot, and why chapters 01 through 16 follow their declared order.

Prerequisites: none

Must answer:

- What does Angular own between main.ts, application state, browser events, and the DOM?
- Which JavaScript, TypeScript, and React knowledge transfers directly, and where does Angular impose a different framework-level mental model?
- Why does the route from 01 through 16 move from bootstrap and components through dependencies, reactivity, data, navigation, delivery, tests, debugging, and legacy code in that order?

Coverage concepts: none

Rationale: The assigned concepts form the single learning unit "Angular in the browser" and support its observable outcome.

Handoff: The map starts at the real entry point: chapter 01 follows main.ts into bootstrapApplication(), the root component, and application-wide providers.

## 01 — Application bootstrap

Status: pending
Action: audit
English: notes/angular/junior/en/01-application-bootstrap.md
Spanish: notes/angular/junior/es/01-arranque-aplicacion.md
Depends on: 00
Pending additions: none

Narrative role: Start the executable journey at the application boundary that creates the root component and installs capabilities shared by the whole app.

Learning outcome: Victor can trace main.ts through bootstrapApplication() to the root standalone component and explain why application-wide providers are registered there.

Prerequisites: 00

Must answer:

- What runs first in a standalone Angular application?
- How does bootstrapApplication() connect the root component and application providers?
- Why is an application provider different from a provider owned by one component?

Existing-content migration: Move standalone component imports and flags to 02, NgModule material to 16, and component-provider scope to 04; retain this file for the real bootstrap boundary.

Coverage concepts:

- [ ] `bootstrapApplication()` — identify the standalone root component and the application-level providers that start a modern Angular application
- [ ] Application provider boundary — register application-wide capabilities at bootstrap rather than scattering their providers through component scopes

Rationale: The assigned concepts form the single learning unit "Application bootstrap" and support its observable outcome.

Handoff: Once the root exists, chapter 02 opens that component and explains how its class and template exchange data.

## 02 — Components and template data flow

Status: pending
Action: audit
English: notes/angular/junior/en/02-components-templates.md
Spanish: notes/angular/junior/es/02-componentes-plantillas.md
Depends on: 01
Pending additions: none

Narrative role: Build the first complete UI unit and teach the one-way and event flows that connect its class, template, parent, children, and projected markup.

Learning outcome: Victor can build and explain a standalone component whose imports resolve its template dependencies and whose bindings, inputs, outputs, control flow, identity tracking, null handling, and projection have explicit ownership.

Prerequisites: 01

Must answer:

- How do the component class, template, styles, and imports become one UI unit?
- How do interpolation, property binding, event binding, and two-way binding move information in different directions?
- Why do input.required(), output(), track, safe navigation, and ng-content each protect a different boundary?
- When should `@if`, `@switch`, and `@for` express conditions, known variants, or collections, and why does `track` preserve identity?

Existing-content migration: Move lifecycle hooks and view-query timing to 05; keep component, template, binding, input/output, control-flow, and projection material here.

Coverage concepts:

- [ ] Standalone `@Component` — explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies
- [ ] Component `imports` — identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure
- [ ] Interpolation vs property binding — distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]`
- [ ] Event binding — handle a template event with `()` and explain why the template delegates behaviour to the component class
- [ ] Two-way binding — recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- [ ] `input()` — receive optional parent-to-child data and handle its absence explicitly instead of hiding it behind a default that reads as real data
- [ ] `input.required()` — declare mandatory parent-to-child data so a missing value fails at the template boundary rather than as an undefined read later
- [ ] `output()` — send typed child events to a parent without making the child depend on the parent's implementation
- [ ] `@if` — branch on a condition so mutually exclusive UI states stay readable instead of being hidden with CSS
- [ ] `@switch` — express a value's known variants as fixed cases instead of chaining conditions that repeat the same subject
- [ ] `@for` and `track` — render collections with stable identity so Angular can reuse DOM nodes instead of recreating them
- [ ] Template reference variables — capture a template element, directive, or component instance for a local interaction without turning it into application state
- [ ] Safe navigation and nullish template values — render data that may not exist yet without hiding an invalid domain assumption behind broad non-null assertions
- [ ] Content projection with `ng-content` — recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs

Rationale: The assigned concepts form the single learning unit "Components and template data flow" and support its observable outcome.

Handoff: A component owns a view; chapter 03 handles behaviour and presentation that attach to an existing host instead.

## 03 — Directives and component styles

Status: pending
Action: audit
English: notes/angular/junior/en/03-directives-styles.md
Spanish: notes/angular/junior/es/03-directivas-estilos.md
Depends on: 02
Pending additions: none

Narrative role: Separate view-owning components from host-augmenting directives and establish where dynamic and component-local presentation belongs.

Learning outcome: Victor can choose between a component and attribute directive, connect reusable host behaviour safely, apply conditional classes or styles, locate inline versus external component styles, and explain the normal component style boundary.

Prerequisites: 02

Must answer:

- When does behaviour need its own template and when should it augment an existing element?
- How do host properties and events connect a directive without taking ownership of the view?
- When should presentation use a focused binding, ngClass/ngStyle, inline styles, or styleUrl?
- How does view encapsulation normally keep component styles local, and what still belongs in global CSS?

Existing-content migration: Move `ngModel` to 16 and ViewChild/ngAfterViewInit to 05; retain directive and style-boundary material here.

Coverage concepts:

- [ ] Components vs attribute directives — use a component when behaviour owns a view and a directive when behaviour augments an existing host element
- [ ] Custom attribute directives and host interaction — implement reusable host-element behaviour and connect host properties or events through directive host bindings and listeners without taking ownership of the element's view
- [ ] Conditional class and style binding — use focused class and style bindings for dynamic presentation and recognise `ngClass` or `ngStyle` when maintained templates apply several values together
- [ ] `styleUrl`/`styleUrls` vs inline `styles` — locate a component's styles and choose external files or small inline rules without confusing either form with global CSS
- [ ] View encapsulation — explain how Angular scopes emulated component styles with generated attributes and why a component rule does not normally style a child component's internal elements
- [ ] `:host` selector — target the component host from its own stylesheet when the custom element itself needs layout or state styling
- [ ] Global vs component styles — keep application-wide rules and library overrides at the global boundary while leaving component-specific presentation with its component
- [ ] `::ng-deep` recognition — recognise the deprecated encapsulation escape hatch in maintained code and prefer supported library APIs, global rules, or explicit styling boundaries for new work

Rationale: The assigned concepts form the single learning unit "Directives and component styles" and support its observable outcome.

Handoff: Components and directives now need collaborators; chapter 04 explains how Angular creates and scopes them.

## 04 — Dependency injection and provider scope

Status: pending
Action: audit
English: notes/angular/junior/en/04-dependency-injection.md
Spanish: notes/angular/junior/es/04-inyeccion-dependencias.md
Depends on: 03
Pending additions: none

Narrative role: Explain the injector graph before lifecycle work so services, configuration tokens, aliases, factories, and instance-sharing decisions have one construction model.

Learning outcome: Victor can resolve class and non-class dependencies, compare injection styles, configure each provider recipe, and predict whether consumers share an instance.

Prerequisites: 03

Must answer:

- How does an injector turn a requested token into an instance or configured value?
- How do root and component provider locations change lifetime and shared mutable state?
- When do useValue, useClass, useFactory, and useExisting create, compute, or alias a dependency?
- When should maintained code use constructor injection, and why does current code normally prefer `inject()`?

Existing-content migration: Absorb the component-provider material currently in 01 and retain service, injector, token, recipe, and scope material here.

Coverage concepts:

- [ ] Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves
- [ ] `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton
- [ ] `inject()` — obtain a dependency in an injection context without a constructor parameter, the style current Angular code prefers
- [ ] Constructor injection — read and write the parameter-based style still common in maintained code, without confusing construction with lifecycle work
- [ ] Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- [ ] `InjectionToken` — inject typed configuration or other non-class dependencies through a token rather than a class type
- [ ] Configured provider recipes — recognise `useValue`, `useClass`, `useFactory`, and `useExisting`, including that `useExisting` aliases an existing provider rather than creating another class instance

Rationale: The assigned concepts form the single learning unit "Dependency injection and provider scope" and support its observable outcome.

Handoff: After Angular constructs an instance, chapter 05 explains when its inputs, view, and destruction boundary become available.

## 05 — Component lifecycle and cleanup

Status: pending
Action: create
English: notes/angular/junior/en/05-component-lifecycle.md
Spanish: notes/angular/junior/es/05-ciclo-vida-componentes.md
Depends on: 04
Pending additions: none

Narrative role: Teach Angular-controlled timing separately from object construction so input-dependent work, view queries, and cleanup run only after their prerequisites exist.

Learning outcome: Victor can place work in constructor, ngOnChanges, ngOnInit, ngAfterViewInit, or destruction cleanup and explain the exact state Angular has established at each point.

Prerequisites: 04

Must answer:

- Why are constructor and ngOnInit not interchangeable?
- How do signal inputs change, and how does the legacy decorator-input form previewed here expose SimpleChanges before chapter 16 revisits its syntax?
- When are view queries safe, and how do query type and static timing affect that answer?
- How do DestroyRef and ngOnDestroy prevent timers, listeners, and other resources from outliving a view, and why is subscription cleanup deferred until Observables are taught in chapter 09?

Coverage concepts:

- [ ] `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs
- [ ] `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- [ ] View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences
- [ ] Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view

Rationale: The assigned concepts form the single learning unit "Component lifecycle and cleanup" and support its observable outcome.

Handoff: With ownership and lifetime clear, chapter 06 introduces state that changes while those instances remain alive.

## 06 — Signals and local state

Status: pending
Action: audit
English: notes/angular/junior/en/06-signals.md
Spanish: notes/angular/junior/es/06-senales.md
Depends on: 05
Pending additions: none

Narrative role: Introduce Angular's local reactive graph after the reader knows which component or service owns each signal and how long that owner lives.

Learning outcome: Victor can model writable source state, immutable transitions, derived state, and external side effects without losing live references or duplicating state.

Prerequisites: 05

Must answer:

- What dependency does Angular record when a signal is read?
- When should set(), update(), computed(), or effect() be used?
- When does an effect run again, what external work belongs there, and how is it cleaned up with its owner?
- Why is a stored snapshot no longer reactive, and why do immutable references matter before chapter 12 applies the same reference rule to OnPush?

Coverage concepts:

- [ ] `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value
- [ ] `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one
- [ ] `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation
- [ ] `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state
- [ ] `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system
- [ ] Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot
- [ ] Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views
- [ ] `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal

Rationale: The assigned concepts form the single learning unit "Signals and local state" and support its observable outcome.

Handoff: With reactive source and derived state established, chapter 07 introduces display-only transformations that preserve that state instead of mutating it.

## 07 — Template pipes

Status: pending
Action: audit
English: notes/angular/junior/en/07-pipes.md
Spanish: notes/angular/junior/es/07-pipes.md
Depends on: 06
Pending additions: none

Narrative role: Teach the basic template transformation primitive before RxJS introduces the async pipe, while deferring the pure-versus-impure execution mechanism until change detection.

Learning outcome: Victor can choose built-in or custom pipes for presentation and keep business logic out of template transformation.

Prerequisites: 06

Must answer:

- What problem does a pipe solve without changing source state?
- When is a custom pipe clearer than component or domain logic?
- Which transformations belong in a pipe, and which belong in component or domain logic?

Existing-content migration: Move the existing AsyncPipe section to 09, where Observable subscription semantics are established.

Coverage concepts:

- [ ] Built-in pipes — apply Angular's standard display transformations such as `DecimalPipe`, `DatePipe`, and `SlicePipe` in the template instead of duplicating formatting logic in the component class
- [ ] Custom pipes — extract a reusable pure display transformation behind a pipe without hiding business logic or expensive impure work in it

Rationale: The assigned concepts form the single learning unit "Template pipes" and support its observable outcome.

Handoff: Pipes can now transform synchronous template values; chapter 08 introduces HTTP Observables, and chapter 09 returns to AsyncPipe once subscription semantics are established.

## 08 — HTTP requests, interceptors, and remote UI states

Status: pending
Action: audit
English: notes/angular/junior/en/08-http.md
Spanish: notes/angular/junior/es/08-http.md
Depends on: 07
Pending additions: none

Narrative role: Connect state to the backend through one-request HTTP streams while keeping runtime data trust, request immutability, duplicate execution, and loading/empty/error/success visible.

Learning outcome: Victor can issue a typed HttpClient request, construct immutable parameters, explain cold execution, and model every remote UI state without treating TypeScript generics as runtime validation.

Prerequisites: 07

Must answer:

- How is HttpClient registered, injected, and called from a service boundary?
- Why can two subscriptions send two requests, and why does HttpClient<T> not validate runtime JSON?
- Why must HttpParams be reassigned or chained?
- Which transitions distinguish loading, empty, error, and success?
- Why must an interceptor clone a request, and how does HttpErrorResponse distinguish backend from client-side or network failure?
- Which failures belong to a cross-cutting interceptor and which must remain visible to the feature?

Existing-content migration: Move Observable operators and subscription cleanup to 09 and environment configuration to 13; retain HttpClient, request construction, interceptors, and remote UI states here.

Coverage concepts:

- [ ] `provideHttpClient()` and its feature functions — enable `HttpClient` application-wide at bootstrap and opt into behaviour such as the Fetch backend or interceptors through explicit `with...()` features instead of separate providers
- [ ] Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON
- [ ] `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- [ ] Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- [ ] Remote UI states — represent loading, empty, error, and success explicitly so a page does not treat a successful response as its only possible state
- [ ] Functional HTTP interceptors — centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop
- [ ] Immutable interceptor requests — clone an `HttpRequest` before changing headers or other request properties because interceptor inputs are immutable
- [ ] `HttpErrorResponse` — inspect status and error payload while distinguishing a backend error response from a client-side or network failure

Rationale: The assigned concepts form the single learning unit "HTTP requests, interceptors, and remote UI states" and support its observable outcome.

Handoff: HTTP introduces Observables; chapter 09 generalises them into composable pipelines and deliberate concurrency choices.

## 09 — RxJS streams and pipelines

Status: pending
Action: audit
English: notes/angular/junior/en/09-rxjs-pipelines.md
Spanish: notes/angular/junior/es/09-flujos-rxjs.md
Depends on: 08
Pending additions: none

Narrative role: Generalise from finite HTTP streams to Observable composition, cancellation, concurrency, error boundaries, cleanup, and signal interoperation.

Learning outcome: Victor can choose Observable, Promise, Subject, flattening operator, error placement, subscription strategy, and Observable-to-signal boundary from the operation's semantics.

Prerequisites: 08

Must answer:

- How do Observable, Promise, and Subject differ in execution, emission, and ownership?
- When do map and tap transform or merely observe a value?
- Why do nested subscriptions hide cancellation, errors, and cleanup, and how does a debounce/distinct/switchMap search pipeline replace them?
- When should switchMap, mergeMap, concatMap, or exhaustMap control inner work?
- How do catchError placement and finalize change whether an interaction stream survives?
- Why does forkJoin wait for completion while combineLatest continues emitting latest combinations?

Existing-content migration: Absorb the AsyncPipe section from 07 and the Observable/operator/cleanup sections from 08; keep all Observable consumption and pipeline semantics in this chapter.
- When should the async pipe, takeUntilDestroyed(), toSignal(), or manual subscribe own consumption?

Coverage concepts:

- [ ] `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams according to source behaviour
- [ ] `Observable` vs `Promise` — compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- [ ] `Observable` vs `Subject` — distinguish a declarative subscribable stream from a subject that can be imperatively fed and multicast, rather than using a subject as the default state container
- [ ] `subscribe()` callbacks — handle next and error outcomes deliberately and keep presentation state consistent after a failed request
- [ ] `map()` vs `tap()` — transform emitted data with `map()` and reserve `tap()` for observation or side effects
- [ ] `switchMap()` — cancel a stale inner request when a newer search term or route value arrives
- [ ] `switchMap()` vs `mergeMap()` — cancel replaceable work with `switchMap()` and preserve deliberate concurrent inner work with `mergeMap()` instead of choosing by habit
- [ ] `concatMap()` vs `exhaustMap()` — queue ordered inner work with `concatMap()` and ignore new triggers with `exhaustMap()` while current work is active, especially for writes and form submissions
- [ ] Search pipeline operators — combine `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to avoid premature, duplicate, and stale requests
- [ ] Nested subscriptions vs flattening operators — compose dependent asynchronous work in one pipeline so cancellation, errors, and cleanup remain visible
- [ ] `catchError()` — recover, translate, or rethrow an error without silently converting every failure into successful empty data
- [ ] `catchError()` placement around flattening operators — recover inside an inner request when the outer interaction stream must remain alive and catch outside only when terminating the whole pipeline is intended
- [ ] `finalize()` — clear loading or other lifecycle state when a stream completes or errors without duplicating cleanup across success and failure callbacks
- [ ] `async` pipe vs manual subscription — prefer template-managed subscription for displayed streams and subscribe imperatively only when a side effect requires it
- [ ] Subscription cleanup — use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete
- [ ] `toSignal()` vs manual subscription — expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects

Rationale: The assigned concepts form the single learning unit "RxJS streams and pipelines" and support its observable outcome.

Handoff: The same stream model drives form valueChanges; chapter 10 applies it to explicit user-input state.

## 10 — Reactive forms

Status: pending
Action: audit
English: notes/angular/junior/en/10-reactive-forms.md
Spanish: notes/angular/junior/es/10-formularios-reactivos.md
Depends on: 09
Pending additions: none

Narrative role: Model user input as a typed control tree, validate it at client and server boundaries, and expose interaction state without hiding invalid shapes behind casts.

Learning outcome: Victor can construct, validate, prefill, submit, reset, and dynamically extend a typed reactive form while preserving nullability, disabled values, backend field errors, and Observable value changes.

Prerequisites: 09

Must answer:

- How do FormControl, FormGroup, FormArray, and FormBuilder describe the form's shape?
- What contracts do validators, touched, dirty, markAllAsTouched(), setValue(), patchValue(), and reset() enforce?
- Why are disabled controls absent from form.value, and when is getRawValue() correct?
- How should backend validation errors return to the relevant controls?
- How does valueChanges reuse the Observable pipeline model from chapter 09 without nesting event handlers?
- When does the next validator run overwrite setErrors(), and how should reset preserve or clear server errors deliberately?

Coverage concepts:

- [ ] `FormControl` and `FormGroup` — model individual controls and grouped control sets explicitly so the form's shape, validators, and value types live in TypeScript rather than in the template
- [ ] `FormBuilder` — construct the same control model with less ceremony, recognising it as concise syntax over `FormControl` and `FormGroup` rather than a different forms model
- [ ] Typed reactive forms — keep control nullability and value types aligned with the API model so casts do not hide invalid form states
- [ ] Built-in validators — combine rules such as `required`, `email`, `min`, and `maxLength` at the control boundary
- [ ] Custom validators — return `null` or a keyed error object from a pure validation function so templates can identify the failed rule
- [ ] `setErrors()` for rules a validator cannot express — attach a keyed error to a control from code when the check needs data a validator function cannot reach, such as a uniqueness lookup, recognising that the next validator run clears it again
- [ ] Validation display state — combine invalid state with `touched` or submit state so errors are helpful without appearing before interaction
- [ ] `markAllAsTouched()` — surface all invalid controls after a submit attempt without changing whether the form is valid
- [ ] `setValue()` vs `patchValue()` — choose strict full-shape assignment or deliberate partial updates when prefilling edit forms
- [ ] Disabled controls and `getRawValue()` — recognise that a disabled control is excluded from `form.value` and opt into its value only when the submission contract requires it
- [ ] `dirty` — distinguish a form the user has actually edited from an untouched one, for example to guard discarding unsaved changes
- [ ] `reset()` and server errors — reset the saved baseline and avoid losing backend errors through an immediate validator rerun
- [ ] Client vs server validation — use form validation for immediate feedback while treating backend validation as authoritative and mapping field errors back to the relevant controls
- [ ] `FormArray` vs `FormGroup` — model a dynamic indexed collection separately from a fixed set of named controls
- [ ] Form `valueChanges` — compose dependent-field and filtering behaviour as an Observable without nesting manual event handlers

Rationale: The assigned concepts form the single learning unit "Reactive forms" and support its observable outcome.

Handoff: Forms now provide dirty state and submit semantics, so chapter 11 can introduce routing and CanDeactivate without a forward dependency.

## 11 — Routing and navigation guards

Status: pending
Action: audit
English: notes/angular/junior/en/11-routing.md
Spanish: notes/angular/junior/es/11-enrutamiento.md
Depends on: 10
Pending additions: none

Narrative role: Place completed page and form behaviour behind a URL hierarchy without confusing client navigation controls with backend enforcement.

Learning outcome: Victor can configure nested and lazy routes, react to changing parameters, navigate declaratively or programmatically, and protect dirty forms with declarative guard results.

Prerequisites: 10

Must answer:

- How do route order, nested outlets, redirects, pathMatch, and lazy boundaries determine rendering?
- When is a snapshot sufficient and when must params remain observable?
- Why should guards return UrlTree, and why can they never enforce backend authorisation?
- How does CanDeactivate use the form dirty state introduced in chapter 10?
- When should navigation use routerLink, Router.navigate(), or Location.back()?

Coverage concepts:

- [ ] Router bootstrap and outlet — register routing with `provideRouter` and give routed components a rendering location with `RouterOutlet`
- [ ] Route definitions and `routerLink` — map paths to components and move between them declaratively so the application becomes navigable
- [ ] Child routes and nested outlets — model a feature's route hierarchy so its shared layout remains mounted while child content changes
- [ ] `ActivatedRoute` route params — read route identity from `paramMap` so a routed component knows which resource it is showing
- [ ] `ActivatedRoute` query params — read optional Angular view filters from `queryParamMap` without making them part of the resource path
- [ ] `[queryParams]` on `routerLink` — set optional view state on the destination URL while navigating declaratively so the resulting page stays linkable and reproducible
- [ ] `ActivatedRoute.snapshot` vs observable params — use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes
- [ ] Lazy route loading — use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it
- [ ] `loadComponent` vs `loadChildren` — lazy-load one routed component or an entire child route tree according to the feature boundary
- [ ] Declarative vs programmatic navigation — use `routerLink` in templates and `Router.navigate()` when component logic determines the destination
- [ ] Browser history navigation — return to the previous entry through `Location` when a page is reachable from several routes, instead of hardcoding one destination that is wrong for every other caller
- [ ] Wildcard routes and redirect order — place a `**` fallback last because Angular uses first-match-wins route evaluation
- [ ] Redirect `pathMatch` — use `pathMatch: 'full'` for an empty-path redirect when prefix matching would otherwise catch every URL
- [ ] `CanActivateFn` guards — return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect
- [ ] Stacked route guards — compose several guards on one route and recognise that every one must allow activation, which keeps authentication and authorisation as separate reusable checks
- [ ] Route guards vs backend authorisation — treat guards as client-side navigation control, never as enforcement of data access
- [ ] `CanDeactivateFn` guards — protect unsaved form state while recognising that browser or process termination may bypass application navigation

Rationale: The assigned concepts form the single learning unit "Routing and navigation guards" and support its observable outcome.

Handoff: Routing completes the runtime feature flow; chapter 12 explains when Angular checks and redraws that routed UI.

## 12 — Change detection and pipe execution

Status: pending
Action: audit
English: notes/angular/junior/en/12-change-detection.md
Spanish: notes/angular/junior/es/12-deteccion-cambios.md
Depends on: 11
Pending additions: none

Narrative role: Explain how Angular schedules and narrows rendering checks, including why pure and impure pipes have different execution costs.

Learning outcome: Victor can predict Default and OnPush checks, explain signal notifications and immutable inputs, and connect the checking mechanism to pure and impure pipe execution.

Prerequisites: 11

Must answer:

- Which concrete notifications mark an OnPush view for checking?
- How does a signal read in a template notify that view?
- Why can Angular skip a pure pipe for an unchanged value or reference while an impure pipe runs on every check?

Coverage concepts:

- [ ] Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- [ ] `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- [ ] Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- [ ] Pure vs impure pipes — prefer a pure pipe whose transform is skipped while primitive values or object references stay unchanged, and recognise that an impure pipe runs on every change-detection cycle

Rationale: The assigned concepts form the single learning unit "Change detection and pipe execution" and support its observable outcome.

Handoff: Once runtime rendering is predictable, chapter 13 verifies the separate build-time and deployment-configuration boundary.

## 13 — Production build, configuration, and template trust

Status: pending
Action: create
English: notes/angular/junior/en/13-production-delivery.md
Spanish: notes/angular/junior/es/13-entrega-produccion.md
Depends on: 12
Pending additions: none

Narrative role: Separate runtime rendering from delivery: inspect real workspace targets, verify the production build, expose only public browser configuration, and preserve Angular's template trust boundary.

Learning outcome: Victor can locate configured build targets, run the real production verification, explain why frontend configuration is public, and treat sanitisation bypasses as explicit trust decisions.

Prerequisites: 12

Must answer:

- How do package scripts and angular.json targets reveal the real build command?
- What can production compilation, optimisation, and budgets catch that a dev server does not?
- Why can no value shipped to the browser be secret?
- What does Angular sanitise by context, and why is bypassSecurityTrust a security boundary?

Existing-content migration: Absorb environment configuration from 08. Teach template sanitisation here as the final browser-delivery trust boundary, explicitly separated from build configuration inside the chapter.

Coverage concepts:

- [ ] Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server
- [ ] Build-time configuration vs frontend secrets — configure public environment-dependent values at build or deployment time while recognising that anything shipped to the browser can be read by a user
- [ ] Angular template sanitisation — distinguish escaped interpolation from context-sensitive sanitisation and treat `bypassSecurityTrust...` as an explicit trust-boundary decision
- [ ] Angular CLI workspace configuration — read configured targets and package scripts in a maintained workspace instead of assuming every project uses the CLI defaults

Rationale: The assigned concepts form the single learning unit "Production build, configuration, and template trust" and support its observable outcome.

Handoff: A deliverable build is ready to verify behaviour; chapter 14 turns the preceding contracts into tests.

## 14 — Testing Angular behaviour

Status: pending
Action: audit
English: notes/angular/junior/en/14-testing.md
Spanish: notes/angular/junior/es/14-testing.md
Depends on: 13
Pending additions: none

Narrative role: Turn service, HTTP, and component contracts into observable tests in current Vitest projects while preserving literacy in maintained Jasmine/Karma suites.

Learning outcome: Victor can choose direct or TestBed setup, control collaborators, verify complete HTTP interaction and errors, and assert rendered user behaviour through ComponentFixture.

Prerequisites: 13

Must answer:

- When does a unit need TestBed?
- How do Vitest and Jasmine express equivalent spy intent?
- How does HttpTestingController verify request and response contracts and prove no request remains?
- What visible behaviour must a ComponentFixture test beyond construction?
- Why must HTTP tests cover errors and call verify(), and when is the legacy testing module only recognition knowledge?

Coverage concepts:

- [ ] Vitest vs Jasmine/Karma recognition — use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- [ ] `TestBed` — configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies
- [ ] Service unit tests — isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- [ ] Spies and test doubles — control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation
- [ ] HTTP tests with `provideHttpClientTesting()` — intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- [ ] `provideHttpClientTesting()` vs `HttpClientTestingModule` — use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- [ ] `HttpTestingController.verify()` — fail a test when expected requests remain outstanding or unexpected requests were left unresolved
- [ ] HTTP error tests — flush an error response and assert the service's observable or state follows the documented failure path
- [ ] `ComponentFixture` — trigger change detection, query rendered DOM, simulate an interaction, and assert visible component behaviour rather than mere construction

Rationale: The assigned concepts form the single learning unit "Testing Angular behaviour" and support its observable outcome.

Handoff: Tests reveal failures; chapter 15 teaches how to locate their boundary in an unfamiliar maintained feature before editing.

## 15 — Debugging and maintained-code navigation

Status: pending
Action: audit
English: notes/angular/junior/en/15-debugging-maintained-code.md
Spanish: notes/angular/junior/es/15-depuracion-codigo-mantenido.md
Depends on: 14
Pending additions: none

Narrative role: Provide the consultancy maintenance workflow: inspect workspace targets and trace one feature across every boundary before changing unfamiliar code.

Learning outcome: Victor can identify the real build and test commands, triage compiler/runtime/DI/router/network evidence, and trace route, page, service, HTTP, state, template states, and tests end to end.

Prerequisites: 14

Must answer:

- Which package scripts and configured targets define how this workspace really runs?
- Which evidence locates a compiler, injection, router, network, state, or rendering failure?
- How do you trace one maintained feature before deciding where to edit?
- How do you infer route, state, service, HTTP, template, and test ownership when a maintained workspace uses different folder names?

Existing-content migration: Reuse the current Core/Feature/Shared discussion only as a non-normative example while rebuilding the chapter around evidence-first triage and end-to-end feature-flow tracing.

Coverage concepts:

- [ ] Angular error triage — use compiler output, runtime error context, dependency-injection traces, router events, and the browser Network panel to locate the failing boundary before changing code
- [ ] Feature-flow tracing — follow a route through its page component, injected service, HTTP call, reactive state, template states, and test before modifying an unfamiliar maintained feature

Rationale: The assigned concepts form the single learning unit "Debugging and maintained-code navigation" and support its observable outcome.

Handoff: Modern code is now traceable; chapter 16 maps the older enterprise vocabulary onto the same mental models.

## 16 — Legacy enterprise Angular

Status: pending
Action: audit
English: notes/angular/junior/en/16-legacy-angular.md
Spanish: notes/angular/junior/es/16-angular-legacy.md
Depends on: 15
Pending additions: none

Narrative role: Translate the modern models already learned into NgModule, decorator, structural-directive, template-form, Subject, and naming conventions common in maintained enterprise applications.

Learning outcome: Victor can read and safely modify legacy Angular without treating its syntax as the default for new features.

Prerequisites: 15

Must answer:

- How do NgModule declarations, imports, exports, and providers map to standalone responsibilities?
- How do decorator inputs/outputs, structural directives, trackBy, and template-driven forms map to modern APIs?
- How do Subject and BehaviorSubject differ, and why does a trailing dollar sign change naming but not runtime behaviour?

Existing-content migration: Absorb NgModule and standalone-era recognition from 01, plus `ngModel` from 03, alongside the existing Subject, BehaviorSubject, and EventEmitter material.

Coverage concepts:

- [ ] `NgModule` — read `declarations`, `imports`, `exports`, and `providers` in pre-standalone applications without treating modules as required in new features
- [ ] Signal inputs/outputs vs `@Input()`/`@Output()` — use current function APIs in new code and recognise decorator plus `EventEmitter` communication in maintained applications
- [ ] `*ngIf` vs `@if` — read both syntaxes and understand that the modern block syntax does not require importing `NgIf`
- [ ] `*ngFor` `trackBy` vs `@for` `track` — preserve stable identity in both template generations
- [ ] Template-driven vs reactive forms — recognise `ngModel` for simple template-owned fields and choose reactive forms for explicit, testable form models
- [ ] `Subject` vs `BehaviorSubject` — distinguish event broadcasting from state that immediately exposes its latest value to new subscribers
- [ ] `Observable` naming and `$` convention — read established code that marks streams with a trailing `$` without assuming the convention changes runtime behaviour

Rationale: The assigned concepts form the single learning unit "Legacy enterprise Angular" and support its observable outcome.

Handoff: This closes the junior route: Victor can navigate both modern Angular and the legacy code common in Spanish consultancy maintenance work.

## Unassigned existing notes

- notes/angular/junior/en/_legacy/09-coordinator-pattern.md — retained byte-for-byte outside the numbered study route; its project-specific or duplicate material is not an independent Angular junior coverage unit.
- notes/angular/junior/en/_legacy/10-component-styles.md — retained byte-for-byte outside the numbered study route; its project-specific or duplicate material is not an independent Angular junior coverage unit.
- notes/angular/junior/en/_legacy/14-role-aware-ui.md — retained byte-for-byte outside the numbered study route; its project-specific or duplicate material is not an independent Angular junior coverage unit.
- notes/angular/junior/en/_legacy/15-dialog-backdrop-close.md — retained byte-for-byte outside the numbered study route; its project-specific or duplicate material is not an independent Angular junior coverage unit.
