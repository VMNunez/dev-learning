# Global Junior Coverage — All Topics

Combined junior hiring coverage for every topic in the notes folder.
Source files: one `coverage/junior.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
Order follows study priority: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

# Minimum Coverage — Angular

Minimum hiring floor for a junior or junior-mid Angular developer targeting Spanish consultancies in 2026.
Items are ordered by filtering risk and cover both modern Angular and the legacy patterns common in maintained enterprise codebases.

### Components and template data flow

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

### Application bootstrap and component styles

- `bootstrapApplication()` — identify the standalone root component and the application-level providers that start a modern Angular application
- Application provider boundary — register application-wide capabilities at bootstrap rather than scattering their providers through component scopes
- `styleUrl`/`styleUrls` vs inline `styles` — locate a component's styles and choose external files or small inline rules without confusing either form with global CSS

### Lifecycle and dependency injection

- Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves
- `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton
- `inject()` vs constructor injection — recognise both supported injection styles and choose consistently without confusing construction with lifecycle work
- Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- `InjectionToken` and configured providers — inject typed configuration or other non-class dependencies and recognise `useValue`, `useClass`, `useFactory`, and `useExisting`, including that `useExisting` aliases an existing provider rather than creating another class instance
- `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs
- `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences
- Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view

### Signals and local state

- `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value
- `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one
- `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation
- `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state
- `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system
- Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot
- Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views
- `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal

### HTTP integration

- Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON
- `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- Remote UI states — represent loading, empty, error, and success explicitly so a page does not treat a successful response as its only possible state

### RxJS streams and pipelines

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

### Routing and cross-cutting HTTP behaviour

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

### Reactive forms and template transformation

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

### Change detection

- Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server
- Build-time configuration vs frontend secrets — configure public environment-dependent values at build or deployment time while recognising that anything shipped to the browser can be read by a user
- Angular template sanitisation — distinguish escaped interpolation from context-sensitive sanitisation and treat `bypassSecurityTrust...` as an explicit trust-boundary decision

### Testing Angular behaviour

- Vitest vs Jasmine/Karma recognition — use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- `TestBed` — configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies
- Service unit tests — isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- Spies and test doubles — control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation
- HTTP tests with `provideHttpClientTesting()` — intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- `provideHttpClientTesting()` vs `HttpClientTestingModule` — use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- `HttpTestingController.verify()` — fail a test when expected requests remain outstanding or unexpected requests were left unresolved
- HTTP error tests — flush an error response and assert the service's observable or state follows the documented failure path
- `ComponentFixture` — trigger change detection, query rendered DOM, simulate an interaction, and assert visible component behaviour rather than mere construction

### Debugging and maintained-code navigation

- Angular error triage — use compiler output, runtime error context, dependency-injection traces, router events, and the browser Network panel to locate the failing boundary before changing code
- Feature-flow tracing — follow a route through its page component, injected service, HTTP call, reactive state, template states, and test before modifying an unfamiliar maintained feature

### Legacy enterprise code recognition

- `NgModule` — read `declarations`, `imports`, `exports`, and `providers` in pre-standalone applications without treating modules as required in new features
- Signal inputs/outputs vs `@Input()`/`@Output()` — use current function APIs in new code and recognise decorator plus `EventEmitter` communication in maintained applications
- `*ngIf` vs `@if` — read both syntaxes and understand that the modern block syntax does not require importing `NgIf`
- `*ngFor` `trackBy` vs `@for` `track` — preserve stable identity in both template generations
- Template-driven vs reactive forms — recognise `ngModel` for simple template-owned fields and choose reactive forms for explicit, testable form models
- `Subject` vs `BehaviorSubject` — distinguish event broadcasting from state that immediately exposes its latest value to new subscribers
- `Observable` naming and `$` convention — read established code that marks streams with a trailing `$` without assuming the convention changes runtime behaviour
- Angular CLI workspace configuration — read configured targets and package scripts in a maintained workspace instead of assuming every project uses the CLI defaults

---

## Angular Material

Concepts needed to build, explain, test, and debug ordinary business interfaces with Angular Material at junior level.

### Setup and component model

- Angular Material, Material Design, and the CDK — distinguish the styled Angular component library, the design system it implements, and the lower-level behaviour primitives it builds upon
- `ng add @angular/material` — use the library schematic to install Material and the CDK and apply the selected animation, typography, and theme setup
- Material-specific imports and providers — recognise which components need a template import and which features, such as date handling, also need a provider
- Material composition boundary — combine Material interaction primitives with ordinary Angular state, forms, templates, and CSS instead of treating the library as page architecture
- Version-matched documentation and migrations — consult the docs for the installed Angular Material major version and use official update tooling instead of copying obsolete selectors or theming APIs

### Theming and styling boundaries

- Prebuilt vs custom themes — choose a prebuilt theme for fast setup or a Sass theme when the product needs controlled colour, typography, or density
- Theme application — recognise that a Material theme controls colour, typography, and density, and ensure the application emits the required core and component styles once
- `mat.theme()` — apply a supported Material 3 theme without depending on the generated component DOM
- Supported theming vs internal selectors — prefer theme tokens, mixins, and public host classes because internal DOM and CSS classes are private and may change between releases
- Page layout vs component theming — use application CSS for layout, spacing, and responsive composition while using Material APIs for component internals
- Overlay styling boundary — recognise that dialogs, menus, selects, tooltips, and snack bars render in an overlay container outside the opener's component subtree

### Buttons, icons, menus, and tooltips

- Material button variants — choose a visually prominent button for the primary action and lower-emphasis variants for secondary or tertiary actions
- Icon buttons and accessible names — pair `matIconButton` actions with an `aria-label` or equivalent name because an icon or tooltip alone is not a reliable accessible label
- FAB vs ordinary button — reserve `matFab` or `matMiniFab` for a dominant screen-level action rather than every positive action
- `mat-icon` and icon fonts — understand that the component renders an icon name from a loaded icon font or registered SVG set rather than bundling every icon automatically
- `mat-menu` composition — connect a trigger to a menu reference and use labelled menu items when several contextual actions should not remain inline
- Menu vs select — use a menu to invoke commands and a select to choose a value owned by a form or application state
- Tooltip purpose — use `matTooltip` for short supplementary help on hover or focus, never as the only name or as a container for essential instructions

### Form-field composition and selection controls

- `mat-form-field` composition — combine a compatible control with its label, hint, prefix or suffix, and error presentation while Angular forms remain the state authority
- `matInput` — enhance a native input or textarea inside a form field while preserving its native value, type, and form semantics
- `mat-label`, `mat-hint`, and `mat-error` — distinguish identification, persistent guidance, and conditional validation feedback
- Material controls with reactive forms — bind controls through `formControl` or `formControlName` and avoid a second source of truth through parallel value bindings
- Error-state timing — understand when Material displays form-field errors and connect that presentation to the form's validity and interaction or submission policy
- `mat-select` and `mat-option` — model single or multiple selection with values whose types match the form control and distinguish literal attributes from property bindings
- Material select vs native select — choose `mat-select` for Material-specific presentation and a native `<select matNativeControl>` when native accessibility, performance, or platform behaviour is the better fit
- Select vs autocomplete — use a select for a closed choice set and `mat-autocomplete` when users type into an input and choose from matching suggestions
- Basic `mat-autocomplete` — connect an input to a local option panel and distinguish the displayed label from the stored object or identifier
- Selection events vs form values — react to `selectionChange` only for side effects and read the form control for the authoritative selected value
- `mat-optgroup` — group a long option set semantically without pretending group labels are selectable values
- Checkbox, radio, and select choice — use checkboxes for independent booleans or multi-select, radio buttons for a small visible single-choice set, and a select when compactness or option count warrants it
- Checkbox vs slide toggle — use a checkbox for selection or confirmation and `mat-slide-toggle` for a boolean setting whose change is presented as immediately active
- Checkbox indeterminate state — represent partial aggregate selection visually without confusing it with a third submitted boolean value
- Datepicker composition — connect the input, toggle, picker reference, and a configured date adapter as one control
- Date-adapter compatibility — keep the datepicker control value compatible with its configured `DateAdapter` rather than hiding a representation mismatch with type assertions
- Datepicker constraints and validation — use `min`, `max`, and `matDatepickerFilter` for selectable-date rules and surface the resulting Material validation errors instead of validating only after submission

### Tables, sorting, filtering, and pagination

- Material table structure — connect column definitions, header and cell templates, displayed column order, and header/data row definitions through matching column identifiers
- `matColumnDef` identity — keep the column ID consistent with `displayedColumns` and configure an accessor when the displayed value does not map directly to a row property
- Header and cell definition roles — use `matHeaderCellDef` for column labels and `matCellDef` for per-row values rather than mixing structural and data concerns
- Table refresh after collection changes — assign or emit a new data array, or call `renderRows()` after mutating a raw array, because `mat-table` does not observe in-place structural changes automatically
- Empty table state — use `matNoDataRow` or an equivalent full-width row only after distinguishing an empty successful result from loading and failure
- Table data-source choices — choose a plain array, observable/custom `DataSource`, or `MatTableDataSource` according to who owns retrieval, transformation, and lifecycle
- `MatTableDataSource` scope — use the convenience class for simple client-side sorting, filtering, and pagination, not as a server-side data-access abstraction
- Sort integration — connect `MatSort` after the view exists, mark only sortable headers, and handle nested or derived values through a sorting accessor or server query
- Paginator integration — connect `MatPaginator` for client data or translate page events into backend parameters without paginating the same result twice
- Server-side paginator state — bind `length` to the backend's total matching count and treat `pageIndex` and `pageSize` as request state so the controls remain correct when only one page of rows is loaded
- Filter semantics — define which fields and normalisation rules filtering uses instead of assuming the default row stringification matches the product
- Reset pagination after filtering — return to a valid first page when a narrower client-side filter can make the current page empty
- Table selection and row actions — keep row identity explicit and prevent nested action buttons from accidentally triggering row selection or navigation
- Client-side vs server-side table operations — let `MatTableDataSource` transform an in-memory collection or translate sort, filter, and page events into backend queries, never both for the same dataset

### Dialogs and confirmation flows

- `MatDialog` and `MatDialogRef` — open overlay content from the caller and control its lifecycle and result through the returned reference
- Dialog component input — use `MAT_DIALOG_DATA` for an explicit, typed input boundary rather than reaching into caller state
- Dialog result channel — close with an explicit typed result and consume `afterClosed()` so the caller distinguishes success, cancellation, and dismissal
- Confirm/cancel semantics — perform destructive work only after an affirmative result and treat backdrop, Escape, and cancel-button dismissal consistently
- Default dismissal vs `disableClose` — preserve backdrop and Escape dismissal by default and disable them only when the interaction has a justified alternative exit because dialogs are expected to remain keyboard operable
- Dialog content structure — keep title, content, and actions as sibling regions so layout, scrolling, labelling, and action placement remain correct
- Declarative vs programmatic closing — use `mat-dialog-close` for simple results and a handler when validation, unsaved changes, or asynchronous work must run before closing
- Dialog focus management — preserve an accessible name, focus trap, sensible initial focus, focus restoration, and Escape behaviour unless a justified accessible alternative exists
- Dialog viewport constraints — use width and maximum-size configuration so overlay content remains usable without overflowing small viewports

### Feedback, loading, and progress

- Snack bar vs dialog — use a snack bar for brief non-blocking feedback and a dialog for focused input or a decision that requires interaction
- `MatSnackBar.open()` lifecycle — provide concise content and ensure the feature imports the snack-bar API it uses
- Timed vs actionable snack bars — auto-dismiss informational feedback after a suitable duration but keep an action available long enough for the user to perceive and operate it
- Progress spinner vs progress bar — choose a spinner for local indeterminate waiting, an indeterminate bar for page or section activity, and a determinate bar only when a real percentage exists

### Navigation and information containers

- Toolbar composition — use `mat-toolbar` for persistent application-level actions and ordinary flex layout to position its content
- Sidenav structure — compose `mat-sidenav-container`, `mat-sidenav`, and `mat-sidenav-content` so the drawer and main content share the required layout context
- Sidenav modes — choose `side`, `push`, or `over` according to available space and whether content should resize, shift, or sit behind an overlay
- Navigation lists and active state — use `mat-nav-list` and Material list items for navigation while Angular Router remains responsible for navigation and route activity
- Tabs vs route navigation — use `mat-tab-group` for related in-page views and routes for destinations that need navigation history, deep links, or independent URLs
- Card structure and appearance — group related content with optional header, content, and actions and choose raised or outlined emphasis consistently
- Stepper linear flow — pair `linear` with step controls so validity governs progression rather than relying only on button handlers

### Accessibility, responsiveness, and testing

- Built-in accessibility vs application responsibility — rely on supported Material semantics and keyboard behaviour while still providing labels, logical focus order, and meaningful state communication
- Responsive Material composition — adapt sidenav mode, dialog dimensions, action density, and wide-table presentation because Material components do not make a page responsive automatically
- Material component harnesses — test supported user-visible behaviour through stable harness APIs instead of querying private DOM structure or CSS classes
- Harness interaction tests — use component-specific harness methods to verify critical validation feedback, dialog results, and table interactions rather than snapshotting generated markup

## Spring Boot

Concepts needed to build, test, explain, and debug a conventional Spring Boot REST application at junior level.

### Beans, injection, and startup diagnosis

- Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while keeping each layer's responsibility explicit
- `@Repository` exception translation — the stereotype converts provider-specific persistence failures into Spring's `DataAccessException` family, so a constraint breach surfaces as `DataIntegrityViolationException` and can be mapped to a deliberate status
- `@Bean` vs component scanning — register third-party instances or explicit construction logic in configuration and use scanning for application-owned component classes
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor
- Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while all-argument constructors are usually the wrong service boundary
- `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- Bean scope and the singleton default — application beans are singleton-scoped by default, so mutable request-specific state on a service can leak across users and threads
- Proxy-based annotation behaviour — Spring applies transaction, security, and similar annotations by wrapping the bean in a proxy, so the annotation only takes effect on an injected bean invoked from outside and silently does nothing on a `new` instance or an internal call
- Bean lifecycle and startup failures — distinguish component scanning, bean creation, dependency resolution, and application startup so missing beans, ambiguous injection, and circular dependencies can be diagnosed from the failure report
- Startup diagnostics — read Boot's condition and failure-analysis output to distinguish configuration, bean creation, port, and datasource failures before changing code
- Application logging — obtain a logger through the SLF4J facade rather than printing to standard output, and raise or lower a package's level from configuration so a running application can be investigated without editing code

### REST controllers

- Spring MVC request dispatch — follow a request through the servlet dispatcher, handler mapping, argument resolution, message conversion, controller, and exception handling when diagnosing a failed endpoint
- `@Controller` vs `@RestController` — use view-oriented controller semantics for rendered responses and response-body semantics for APIs whose return values are written through message converters
- `@RequestMapping` without a method attribute — a class-level mapping contributes the shared path prefix, but the same annotation on a method matches every HTTP verb unless the verb is narrowed
- HTTP method mappings — select a method-specific mapping that matches the operation's HTTP semantics, including partial updates or state transitions rather than treating every write as POST
- `@PathVariable` vs `@RequestParam` — bind resource identity from the route and optional filtering or control values from the query string, with names and required/default behaviour declared explicitly
- `@RequestBody` — bind the request body to a Java object through the configured message converters instead of parsing the payload manually
- Unsupported media type on a request body — body binding is selected by the request's declared content type, so a missing or non-JSON `Content-Type` is rejected before the controller runs rather than surfacing as a validation failure
- `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status
- Created responses and the resource location — build the new resource's URI from the current request when reporting a successful creation, rather than returning the entity with a default status
- HTTP message conversion and Jackson — content negotiation and configured message converters turn request and response bodies into Java values and JSON rather than the controller serialising text manually
- Jackson response shaping — rename, omit, or format individual fields through serialization annotations, and know that Boot registers Java date/time support so temporal fields serialise as ISO text rather than numeric objects
- Jackson deserialization requirements — an incoming body is populated through a record's canonical constructor, an annotated creator, or a no-argument constructor plus mutators, which is why an otherwise valid DTO can arrive with every field null
- Bidirectional relationship serialization — returning an entity whose association points back at its owner makes Jackson recurse until the response fails, so break the cycle at the boundary with a response DTO rather than patching it with reference annotations
- Request and response DTO implementation — implement incoming and outgoing contracts as separate records or classes and attach validation constraints to the untrusted input type only
- Entity-to-DTO mapping implementation — write the conversion by hand or generate it with an annotation-processor mapper whose implementation class exists only after a build, which is why a missing generated mapper is a build-configuration problem rather than absent source code
- `@JsonIgnore` and serialization access — an ignore annotation suppresses a field in both directions unless the access mode is narrowed, so it is a local serialization rule rather than a substitute for a dedicated response type
- Outbound HTTP calls — a Spring Boot service that consumes another API uses the framework's synchronous HTTP client; recognise the current fluent client and the older template still present in maintained codebases

### Request validation

- `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs
- Nested and collection cascading — a nested object's own constraints run only when the field or the collection's type argument is marked `@Valid`, while container element constraints such as `List<@NotBlank String>` are checked without it, so a validated outer DTO can silently accept an invalid inner payload
- Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type
- Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples
- Bean constraints vs database constraints — a validation annotation rejects bad input before business logic with a client error, while a column constraint fails at flush time as a server error, so the same rule expressed only in the schema produces the wrong response
- Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters use different exception families; handle both deliberately instead of assuming every violation is a `ConstraintViolationException`
- `@Valid` vs `@Validated` — use standard cascaded validation for request objects and Spring's validation groups or method-level proxy features only when those additional semantics are required

### Exception handling and error responses

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- `@ExceptionHandler` resolution — the most specific declared exception type wins over a supertype handler, and an advice's scope decides which controllers it serves, so an unexpectedly generic response usually means the wrong handler matched
- `ResponseStatusException` and `@ResponseStatus` on an exception — a status can be attached at the throw site or to the exception type instead of through advice; recognise all three routes because maintained code mixes them and the advice never fires for a status already resolved
- Domain exceptions — represent meaningful application failures as dedicated types so a handler can map each one to its intended status
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably
- Boot's default error handling — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled
- Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary
- Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour

### Spring Data JPA — entity and relationship mapping

- Persistence context and entity state — recognise managed, detached, and removed entities and understand why dirty checking can flush a managed change without another repository `save()`
- `@Entity` requirements — a mapped type needs an identifier, an accessible no-argument constructor, and a non-final class, and a class missing the annotation entirely is not mapped at all
- Entity table naming — use `@Table` when the mapped table differs from the default and avoid reserved-word conflicts through a deliberate physical name, quoting policy, or naming strategy
- Identifier mapping and generation — mark the primary key and choose between identity columns and sequences according to the target database, because a bootstrap failure over a missing or unsupported identifier is reported before the application serves a request
- JPA column nullability and uniqueness — express schema intent on the mapping so the generated or validated schema matches the domain rules
- Lombok generated equality on entities — identifier-based `equals` and `hashCode` behave inconsistently while an entity is still unsaved, so generated implementations must be chosen deliberately rather than accepted by default
- Lombok generated `toString` on entities — including associations in a generated string can trigger lazy loading or recurse across a bidirectional relationship, so relationship fields must be excluded
- Many-to-one ownership — map the foreign-key side with `@ManyToOne` and name its column with `@JoinColumn`
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; a one-to-many with neither `mappedBy` nor `@JoinColumn` produces an unexpected join table
- Many-to-many ownership — map the join table on one owning side with `@JoinTable` and point the inverse side back with `mappedBy` rather than creating two independent associations
- Cascade vs orphan removal — propagate selected persistence operations to related entities or delete a managed child when it is removed from its parent's collection
- Enum string vs ordinal persistence — store stable names when enum reordering or insertion must not silently change the meaning of existing rows
- Hibernate timestamps vs JPA lifecycle callbacks — choose provider convenience or portable entity callbacks deliberately when populating audit timestamps
- Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly

### Spring Data JPA — repositories and queries

- `JpaRepository` CRUD contract — recognise the inherited persistence, lookup, existence, listing, and deletion operations before declaring redundant repository methods
- `Optional` single-result contract — Spring Data returns an absent value rather than null from a single-result finder, which is what makes the "not found" branch explicit at the service boundary
- `findById` vs `getReferenceById` — one loads the row immediately and reports absence, the other returns an uninitialised reference that is cheap for setting a foreign key but fails on first access outside an open persistence context
- `save()` insert vs update — recognise that Spring Data decides whether an entity is new before delegating to persistence, so `save()` is not a synonym for SQL INSERT
- Derived query methods — let Spring Data derive simple lookups and existence checks from repository method names, switching approach when the name stops expressing the query clearly
- JPQL vs native SQL in `@Query` — prefer entity and attribute names for portable persistence queries and opt into database SQL only when the required behaviour justifies tighter coupling
- `@Modifying` write queries — a declared update or delete query needs the modifying marker and an active transaction, and it bypasses the persistence context, so already-loaded entities can be left stale afterwards
- Spring Data pagination — accept a `Pageable` and return a bounded result, and know that page number, size, and sort arrive as request parameters bound automatically
- `Page<T>` vs `Slice<T>` — return total-count metadata only when the client needs it, because a slice can answer whether another chunk exists without an additional count query

### Query behaviour and diagnosis

- Generated-statement logging — enable Hibernate's SQL and binding output to see the statements the repository layer actually issues, because query count and shape are invisible from Java code alone
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`
- `FetchType.LAZY` vs `FetchType.EAGER` — deferred versus mandatory relationship loading, with the defaults deliberately asymmetric: to-one associations load eagerly and to-many associations lazily, so fetching must be chosen per use case rather than fixed globally
- Write timing and deferred failure — a persistence call stages work that reaches the database at flush or commit, so a constraint violation is reported at the transaction boundary rather than on the line that appeared to cause it
- Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction

### Transactions

- `@Transactional` atomicity and rollback — group one business operation in a transaction and know that the default rollback rules differ for unchecked and checked exceptions
- Spring's `@Transactional` vs the Jakarta annotation — two importable annotations of the same name carry different rollback defaults, so the import decides the behaviour
- `@Transactional(readOnly = true)` — declares read intent so the provider can skip dirty checking, while whether writes are actually refused depends on the driver and database rather than on Spring
- Transaction boundary placement — put the annotation on the externally invoked, proxy-eligible service method that spans the whole business operation, not on a controller, a private method, or a single repository call
- Spring Data repository default transactionality — repository CRUD methods carry their own `@Transactional`, so an unannotated service commits every call as its own transaction with no atomicity across them, which is why the service boundary is a deliberate decision rather than an optional annotation
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Caught exceptions and rollback — swallowing a failure inside a transactional method can let the proxy observe normal completion and commit unless rollback is re-established deliberately

### Spring Security — chain configuration and access rules

- Web security activation — Boot activates web security from the classpath without an explicit enabling annotation, while method security is a separate switch that must be turned on deliberately
- `SecurityFilterChain` — declare the chain as a bean and place a custom authentication filter at the correct position relative to the framework's own filters, because order decides what has already run when it executes
- Security route rules — declare specific public and role-protected matchers before the authenticated catch-all because matcher order controls which rule applies
- `@PreAuthorize("hasRole('MANAGER')")` — a method-level check evaluated after authentication, which is silently ignored unless method security is enabled
- URL rules vs method-level checks — the two enforcement points are independent, so a permitted route can still be refused by an annotation and a protected route is refused before the method is ever reached
- `hasRole` vs `hasAuthority` and the `ROLE_` prefix — role checks add the prefix for you while authority checks compare the stored string literally, so a mismatch between how authorities are persisted and how they are checked rejects a correctly authenticated user
- `AuthenticationEntryPoint` and `AccessDeniedHandler` — the two components that produce the response when the request is unauthenticated or authenticated without sufficient authority, and the only way to give those failures the same JSON error contract as the rest of the API
- Stateless session configuration — a bearer-token API sets the session creation policy so no server session is established, which is what makes each request stand alone
- CSRF configuration for a bearer-token API — the decision to disable or retain CSRF follows from how credentials travel, so a cookie-authenticated endpoint in the same application still needs it
- CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local controller policy
- Preflight through the security chain — permit or correctly process browser `OPTIONS` requests so authentication rules do not reject the preflight before the real cross-origin request is sent

### Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `PasswordEncoder` contract — verify a submitted password by matching it against the stored encoded value through the encoder, never by comparing or reversing the stored string
- `DelegatingPasswordEncoder` and encoded-id prefixes — recognise stored values such as `{bcrypt}...` and understand that the prefix is what selects the encoder used to verify them
- `AuthenticationManager` delegation — authenticating a submitted credential runs the configured provider, which loads the user through `UserDetailsService` and verifies the password through the encoder
- Exposing the authentication manager — the manager is not injectable by default, so a login service that authenticates programmatically must publish it as a bean from the security configuration
- `OncePerRequestFilter` — process JWT authentication once in the normal request dispatch and always continue or terminate the filter chain deliberately
- `SecurityContextHolder` — thread-local storage where the authentication filter places the authenticated principal for the current request, and where a service reads it from
- `@AuthenticationPrincipal` — resolve the authenticated user as a controller method argument instead of reaching into the static context holder
- Anonymous authentication — an unauthenticated request may still have an anonymous `Authentication` object, so code must check authentication state rather than assuming the context value is null
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JWT issuance — derive a signing key from configured secret material and sign the claims the application will later trust, keeping that material out of the source tree
- JWT validation failure modes — parsing under the same algorithm and key distinguishes an expired token, a malformed token, and a bad signature, and each should reach the client as a deliberate response rather than a server error
- JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security authorities before placing the authenticated token in `SecurityContextHolder`

### Testing

- Plain service unit tests — use JUnit and Mockito without a Spring context when the risk is business logic and collaborator interaction rather than framework wiring
- Mockito mock vs context bean override — `@Mock` creates a standalone test double, while replacing a bean in a Spring test context uses `@MockitoBean`; `@MockBean` is the legacy Boot annotation from a different package and is still what maintained projects import
- `@WebMvcTest` — loads a focused MVC slice; collaborators must be supplied through explicit mock bean overrides or imports rather than being replaced automatically
- Security in an MVC slice test — the slice applies the security filter chain, so requests are rejected before reaching the controller unless the test supplies an authenticated principal or the chain is deliberately excluded
- `MockMvc` — exercise mapped controller requests through the real dispatcher, converters, and advice without starting a server
- JSON-path MVC assertions — verify specific response fields and structures through `MockMvc` instead of comparing an entire JSON string
- `@SpringBootTest` — loads the full Spring application context, but external infrastructure is real only when the test config chooses it; use it for wiring and end-to-end application integration rather than every service rule
- `@DataJpaTest` — load a focused persistence slice with a transactional, rolled-back test so repository queries run against a real mapping
- Test database fidelity — an in-memory replacement is fast but can hide PostgreSQL-specific behaviour, so database-sensitive integration tests need deliberately configured real infrastructure
- Test configuration and profiles — override external dependencies and settings for tests without weakening production configuration or relying on a developer's local environment
- Tests that cannot fail — recognise the mocked-collaborator test that asserts only on its own stubbing, the interaction check with no state assertion, and the slice test whose subject is itself replaced by a mock, because such a test reports green regardless of the production code
- Unit vs slice vs full-context tests — choose an isolated class test, a focused Spring layer, or the complete application context according to the mechanism and configuration risk under test

### Configuration and profiles

- Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another
- Profile-specific configuration files — profile values live either in an `application-{profile}` file or in one multi-document file whose sections are separated by `---` in YAML or `#---` in properties and selected with `spring.config.activate.on-profile`
- Datasource and persistence properties — connect the application to a real database through its URL, credentials, and driver settings, and recognise what each `ddl-auto` value does to an existing schema
- Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store
- `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together
- SQL initialization — understand when Boot runs `schema.sql` and `data.sql` and how initialization differs for embedded and external databases

### Boot runtime model and packaging

- Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults
- `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code
- Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management

### Maintained-code recognition

- `jakarta.*` vs `javax.*` imports — recognise that current Boot versions moved the persistence, validation, and servlet namespaces, so a maintained codebase or a copied snippet on the wrong namespace fails to compile or is silently ignored
- `SecurityFilterChain` bean vs `WebSecurityConfigurerAdapter` — current configuration declares a chain bean with the lambda DSL, while the removed adapter base class survives in maintained codebases and in most copied examples, so recognise both and know why one no longer compiles
- Repository interface hierarchy — `CrudRepository`, `PagingAndSortingRepository`, and `JpaRepository` extend one another with progressively more operations, so recognise which one a maintained codebase declared and what that choice does and does not provide
- Field injection and `@Autowired` — recognise the older field- and setter-injected style still common in maintained code, and be able to state what constructor injection gives up when it is replaced
- Service interface plus `Impl` implementation — recognise the pervasive split where the injected type is an interface and the behaviour lives in a separate implementation class, and know that Boot proxies classes by default, so the interface is a maintained-code convention and a test-substitution seam rather than a technical requirement for proxying

### Delivery and API contract

- Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic
- OpenAPI generation — expose a browsable, generated HTTP contract for frontend and QA consumers from the existing controller and DTO declarations

---

## Java

Java language and core-library concepts needed to read, write, test, and debug ordinary Spring Boot application code.
Framework behaviour remains in Spring Boot coverage; examples here may use Spring-shaped classes when they expose a Java mechanism.

### Execution, variables, and control flow

- Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs
- Variables, declared types, initialization, and scope — know where a local, parameter, field, or block variable exists and that local variables must be definitely assigned before use
- Primitive vs reference types — primitives hold a value, while reference variables identify objects and may be `null`
- `int` vs `long` — choose `long` when the range can exceed `int`; use an `L` suffix only when the integer literal itself does not fit in `int`
- Primitive vs wrapper types — wrappers support generics and `null`, while unboxing a null wrapper throws `NullPointerException`
- Numeric conversions and casts — widening conversions are normally safe, while narrowing can lose range or precision and therefore requires an explicit cast
- Integer arithmetic — recognise integer division, overflow, and the need to promote an operand when fractional or wider arithmetic is required
- Operators and short-circuit evaluation — use arithmetic, comparison, logical, and assignment operators and explain why `&&` and `||` may skip the right operand
- `if` / `else` — select one branch from boolean conditions and order conditions so specific or exceptional cases are not hidden by broader ones
- Conditional (ternary) operator — `condition ? a : b` chooses one of two values as an expression, unlike an `if` / `else` statement, which does not itself produce a value
- `for`, enhanced `for`, `while`, and `do-while` — choose counted iteration, element traversal, pre-checked repetition, or post-checked repetition according to the loop contract
- `break`, `continue`, and `return` — distinguish leaving a loop, skipping to its next iteration, and leaving the current method
- Classic `switch` fall-through — without `break`, a matching statement case continues into later cases and can create a hidden logic bug
- Switch expressions — arrow cases can produce a value without fall-through, and an expression must cover every possible input
- `var` — local type inference does not make Java dynamically typed; the compiler infers one fixed type from the initializer

### Methods and object references

- Method signatures, parameters, and return values — read what a method accepts, what it returns, and which overload a call can match
- Java pass-by-value — every argument is copied; for an object the copied value is a reference, so a method can mutate that object but cannot replace the caller's variable
- Call stack and method returns — each call creates a frame holding its local state, and returning or throwing removes frames toward the caller
- Overloading — methods share a name but have different parameter lists, and the compiler selects the applicable signature
- Varargs — a `Type...` parameter accepts zero or more arguments collected into an array and must be the last parameter, as seen in APIs such as `List.of` and `String.format`
- Constructor defaults and chaining — recognise when Java supplies a no-argument constructor, chain overloads with `this(...)`, and initialise the superclass first through `super(...)`
- `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object
- Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other
- `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries

### Classes and object-oriented behaviour

- Classes, objects, fields, and constructors — define state and behaviour, create instances, and establish valid initial state during construction
- `this` — refer to the current instance and disambiguate a field from a parameter with the same name
- Encapsulation — keep representation private and expose behaviour or controlled access so callers cannot bypass class invariants
- Access modifiers — distinguish `public`, `protected`, package-private, and `private` visibility when reading code across packages and hierarchies
- `final` variables, fields, methods, and classes — prevent reassignment, overriding, or inheritance as applicable; a final field must be assigned exactly once (typically in the constructor), yet a final reference still does not make its object immutable
- Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object
- Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class
- Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- Anonymous inner classes — recognise inline implementations such as `new Runnable() {...}` or `new Comparator<>() {...}` in maintained code and read them as the pre-lambda form of a functional-interface or abstract-type instance
- `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration
- Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast
- Records — use a concise data carrier with final components and generated accessors, canonical construction, `equals`, `hashCode`, and `toString`
- Shallow vs deep immutability — final fields or record components prevent reassignment but do not make referenced mutable objects immutable

### Equality and hashing

- Identity vs value equality — `==` compares primitive values or reference identity, while `equals` expresses semantic equality for objects
- `String.equals()` vs `==` — compare String content with `equals`; `==` only asks whether both references identify the same object
- Wrapper equality and boxing — automatic boxing/unboxing converts between primitives and wrappers, but wrapper `==` may appear to work because of caching and must not be used for value equality
- `Objects.equals(a, b)` — perform null-safe object equality by handling nulls before delegating to `equals`
- The `equals` / `hashCode` contract — equal objects must have equal hash codes, and both methods must change together for correct `HashSet` and `HashMap` behaviour
- Mutable hash keys — changing fields used by `equals` or `hashCode` after insertion can make an entry effectively unreachable in a hash-based collection
- `toString()` — provide a useful textual representation for diagnostics without exposing secrets or relying on it as a serialization contract

### Strings and decimal values

- String immutability — String operations return new values rather than modifying the original object
- Text blocks — read a triple-quoted `"""` multi-line String literal as ordinary String content, used for embedded JSON, SQL, or HTML fragments in modern (Java 17+) code
- `String.isEmpty()` vs `String.isBlank()` — empty means length zero, while blank also includes whitespace-only content
- `String.formatted()` — substitute values into a format string while understanding that invalid format specifiers fail at runtime
- String and number conversion — parse text into numbers with `Integer.parseInt` or `Integer.valueOf` and render values back with `String.valueOf`, knowing that malformed input throws the unchecked `NumberFormatException`
- `String` concatenation vs `StringBuilder` — use simple `+` for small expressions and a mutable builder for repeated accumulation that would create many intermediate Strings
- Floating-point representation and comparison — `double` and `float` cannot represent most decimals exactly, so `==` between them is unreliable and `NaN` is never equal to itself, which is why floating-point equality needs a tolerance or `BigDecimal`
- Integer vs floating-point division by zero — integer division by zero throws `ArithmeticException`, while floating-point division by zero produces `Infinity` or `NaN` instead of failing
- `BigDecimal` for money and decimal arithmetic — avoid binary floating-point error, remember operations return new values, and choose explicit scale and rounding for division

### Collections and generics

- Arrays vs collections — arrays have a fixed length and indexed elements, while collection APIs provide resizable and semantic data structures
- Array access and bounds — index elements with `[i]` and read length via the `.length` field (a field, not a method, unlike `String.length()` or `List.size()`), knowing that an out-of-range index throws `ArrayIndexOutOfBoundsException`
- `List` — preserve encounter order and allow duplicates when position or sequence matters
- `Set` — represent unique elements when duplicates have no meaning
- `Map` — associate unique keys with values and distinguish missing keys from keys explicitly mapped to `null`
- `ArrayList`, `HashSet`, and `HashMap` — recognise the normal general-purpose implementations for list, set, and map semantics
- Map accumulator idioms — use `getOrDefault` and `computeIfAbsent` for the common count-or-group pattern instead of manual get-check-put null handling
- Collection interfaces vs implementations — declare the weakest useful contract such as `List` while choosing a concrete implementation such as `ArrayList` at construction
- Collection factories and copies — `List.of`, `Set.of`, and `Map.of` reject nulls and return unmodifiable collections, which still does not make mutable elements deeply immutable
- `ArrayList` vs `LinkedList` — prefer `ArrayList` for normal application access; linked nodes do not make locating a middle position constant-time
- Iteration and safe removal — do not structurally modify a collection through the collection itself during for-each iteration; use `removeIf` or the iterator's own `remove`
- Practical complexity recognition — distinguish linear list search from expected constant-time hash lookup without treating Big-O as a substitute for measurement
- `Comparable<T>` vs `Comparator<T>` — define one natural order inside a type or multiple external orderings without changing that type
- `Comparator.comparing()` — build a field-based ordering and compose tie-breakers when the primary key is equal
- Equality vs ordering consistency — understand that sorted sets and maps treat `compareTo` or `compare` returning zero as the same key even when `equals` disagrees
- Generic types and methods — use type parameters such as `List<User>` and `<T>` to preserve compile-time type safety and avoid casts
- Raw types and diamond inference — avoid raw collections that discard type checks and use `<>` when the compiler can infer constructor type arguments
- Generic invariance — `List<Dog>` is not a subtype of `List<Animal>` because adding another Animal through that alias would break type safety
- Wildcard recognition — read `?`, `? extends T`, and `? super T` in library signatures without attempting advanced generic API design
- Nested generic APIs — read types such as `Optional<User>`, `Page<User>`, and `ResponseEntity<List<User>>` by working from the outer container inward

### Optional, lambdas, and streams

- `Optional<T>` as a return contract — make an absent result explicit when absence is normal, rather than using it for every nullable field or parameter
- `Optional.map` and `ifPresent` — transform a present value or run a side effect without manually branching on presence
- `Optional.orElseGet` and `orElseThrow` — produce a lazy fallback or fail with a meaningful exception instead of calling unchecked `get`
- `orElse` vs `orElseGet` — `orElse` evaluates its fallback eagerly, while `orElseGet` calls its supplier only when the Optional is empty
- `Predicate<T>` — represent a test from one input to a boolean result
- `Function<T, R>` — represent a transformation from an input type to an output type
- `Consumer<T>` — accept a value for a side effect without returning a result
- `Supplier<T>` — produce a value without receiving an input
- Lambda expressions — pass small pieces of behaviour to APIs while keeping parameter and return types consistent with the target functional interface
- Method references — use forms such as `Employee::getName` when a lambda only delegates to an existing method
- Stream pipeline lifecycle — create a lazy intermediate pipeline and trigger it once with a terminal operation; a consumed stream cannot be reused
- `filter`, `map`, and `toList` — select and transform elements into a result without mutating the source collection
- `flatMap` — transform each element into zero or more elements and flatten the nested results into one stream
- `sorted` and `distinct` — order elements or remove duplicates while recognising their dependence on comparison and equality contracts
- `reduce` and simple aggregation — combine stream elements into one result with an identity or accumulator whose operation is associative
- `findFirst`, `anyMatch`, and `allMatch` — express search and predicate checks with the appropriate Optional or boolean result
- Stream side effects vs loops — keep stream transformations side-effect free and choose a loop when stateful branching or early control flow is clearer
- `Stream.toList()` vs `Collectors.toList()` — `Stream.toList()` returns an unmodifiable list, while `Collectors.toList()` makes no mutability guarantee
- `Collectors.joining` and `Collectors.toMap` — gather a stream into a delimited String or a key/value map, leaving multi-level grouping to a later level

### Exceptions and diagnostics

- Checked vs unchecked exceptions — checked exceptions must be caught or declared, while `RuntimeException` subclasses do not carry that compile-time requirement
- `throw` vs `throws` — a `throw` statement evaluates an exception reference and completes abruptly, while a `throws` clause declares possible checked failures to callers
- Exception propagation and stack unwinding — an uncaught exception removes call frames until a compatible handler is found or the thread terminates
- Targeted `try` / `catch` / `finally` — catch only failures that can be handled or contextualised and use `finally` for cleanup that must run
- Try-with-resources — close `AutoCloseable` resources on both success and failure without duplicating cleanup code
- Custom exceptions and preserved causes — name a meaningful failure and pass the original cause when adding context
- Do not swallow exceptions — an empty or over-broad catch hides the failure and leaves callers unable to distinguish success from corruption
- Reading stack traces — identify the exception type, message, cause chain, and first relevant application frame before changing code

### Enums and annotations

- Enums — model a closed set of named domain values instead of scattering magic Strings through control flow
- Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour
- Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions
- Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

### Date, time, and API literacy

- `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract
- `Duration` vs `Period` — measure an elapsed time-based amount with `Duration` and a calendar date-based amount with `Period`, rather than computing intervals by hand
- Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

### Maven fundamentals

Maven is ecosystem tooling rather than Java language syntax; this section owns generic Java-build mechanics, while Spring Boot coverage owns starter, parent, and plugin behaviour.

- Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version`
- `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles
- Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions
- Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended
- Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version

## Architecture

Patterns and decisions a junior at a Spanish consultancy must explain confidently.
Not just what they are — but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

### REST

- REST principles: stateless, resources, HTTP verbs, uniform interface — the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- Resource modelling — paths identify resources and relationships, while HTTP methods express the
  operation; interviewers use verb-heavy endpoints to test whether the API has a coherent model
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

### Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly; the backend controls what data is exposed and who can access it
- Controller → Service → Repository — what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Service layer — the class (`@Service`) that holds business rules, validation beyond bean validation, and orchestration between repositories; interviewers ask "why not put this logic in the controller?" — because the controller would then be impossible to reuse from another entry point (a scheduled job, a CLI command) and impossible to unit test without starting the whole web layer
- Repository pattern — places data-access operations behind an interface so application logic does
  not contain queries directly; a JPA repository still carries persistence semantics and is not a
  promise that every storage technology is interchangeable
- Why business logic belongs in the service — the controller must not decide; the repository must not know the rules; the service is the only place
- Why the controller must not call the repository directly — bypasses the business rules layer; makes the code impossible to test in isolation
- MVC — separates input coordination, presentation, and application/domain state; it is not limited
  to server-rendered HTML and is a different design axis from controller/service/repository layering
- MVC vs layered architecture — MVC organises interaction and presentation responsibilities, while
  layers organise dependency direction; a system can use both without one being a subtype of the other
- State machine pattern — a workflow where status transitions follow fixed rules (DRAFT → SUBMITTED → APPROVED/REJECTED); the service enforces which transitions are valid

### DTO pattern

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract

### Data access decisions

- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics

### Angular patterns

- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

### Testing strategy

- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- Contract tests at boundaries — when two layers or services exchange a DTO, test the contract where
  drift would break integration rather than duplicating every unit test

### Design qualities and boundaries

- Coupling — the number and strength of dependencies between modules; lower coupling limits the
  blast radius of a change
- Cohesion — how strongly a module's responsibilities belong together; high cohesion is the reason
  related business rules stay in one service or feature
- Dependency direction — outer delivery and persistence details may depend on application contracts,
  while business rules should not depend on HTTP or database APIs
- Package by feature vs package by layer — feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree
- Composition over inheritance — assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- Over-engineering — an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect
- Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary

### SOLID

- Single Responsibility — one class, one reason to change; controllers handle HTTP, services handle rules, repositories handle data
- Open/Closed — extend behaviour without modifying existing code; add a new feature by adding new code, not changing existing code
- Liskov Substitution — a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation — prefer small specific interfaces over one large one; `UserDetailsService` has one method, not fifteen
- Dependency Inversion — depend on abstractions, not concrete classes; the entire Spring DI model and Angular's `inject()` are built on this principle

---

## Security

Web security concepts a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects — not just a textbook definition.

### Security mindset and baseline

- OWASP Top 10 — a periodically updated map of common web-application risk categories; a junior
  should recognise broken access control, injection, security misconfiguration, and vulnerable
  dependencies without memorising an outdated category order
- Defence in depth — client checks, server authorisation, validation, and least-privilege database
  access overlap so one failed control does not expose the whole system
- Allow-list over block-list — defining accepted origins, roles, fields, or input shapes is safer
  than trying to enumerate every malicious value an attacker might invent

### Authentication and authorisation
- Authentication vs authorisation — authentication confirms who you are (login); authorisation confirms what you are allowed to do (role check); interviewers always ask the difference and expect an example from a real project
- 401 vs 403 — `401 Unauthorized` means not authenticated (no token, expired token, invalid token); `403 Forbidden` means authenticated but not authorised (valid token, wrong role); interviewers test this pair because the HTTP names are confusing and juniors routinely mix them up
- Session-based auth — the server stores a session in memory and gives the client a cookie; stateful; does not scale horizontally without shared session storage; asked as a contrast to JWT
- Token-based auth (JWT) — the client stores the token and sends it with every request; the server validates it without storing anything; stateless; interviewers ask why stateless auth matters for scaling
- Role-based access control — `EMPLOYEE` vs `MANAGER` in TimeTrack; enforced in Spring Boot with `@PreAuthorize` and in Angular with route guards; interviewers ask where each enforcement layer lives and why you need both
- Generic authentication error messages — login failure always returns one generic message ("invalid credentials"), never "wrong password" or "email not found"; a specific message lets an attacker enumerate which emails are registered; interviewers ask why `BadCredentialsException` is handled with one generic message instead of two

### JWT
- JWT structure: header, payload, signature — header says the algorithm (`HS256`); payload carries claims (`sub`, `iat`, `exp`, `role`); signature is an HMAC of header+payload using the secret; interviewers ask what each part contains and why
- JWT payload is not encrypted — the payload is Base64-encoded, not encrypted; anyone can decode it; never put passwords or sensitive data in a JWT; interviewers ask "is a JWT secure?" to test whether the candidate knows Base64 is not encryption
- How the signature is verified — the server recomputes the HMAC with its own secret and compares; if the payload was changed, the signature does not match; this is how the server detects tampering without storing the token
- Why you cannot fake a JWT without the secret — the signature is bound to the exact bytes of the header and payload; any change invalidates it; asked to check understanding of why JWT can be trusted
- Access token vs refresh token — access token is short-lived (15 min to 1 hour); refresh token is long-lived and used only to get a new access token; limits the window of attack if an access token is stolen
- Where to store the token in the browser — `localStorage` is accessible to JavaScript (XSS risk); `HttpOnly` cookie is not accessible to JavaScript (CSRF risk instead); interviewers ask this to test awareness of trade-offs
- JWT expiry — the `exp` claim sets a timestamp; expired tokens are rejected by `JwtFilter`; why short-lived tokens reduce the damage if a token is stolen

### Cryptography basics
- Hashing vs encryption — hashing is one-way (you cannot reverse it); encryption is two-way (you can decrypt with the key); interviewers always ask the difference because candidates frequently confuse them
- Why passwords are hashed and not encrypted — if the database is stolen, the attacker cannot recover plaintext passwords from hashes without brute-forcing every possible input
- BCrypt — a slow hashing algorithm with a built-in random salt; slow is intentional because it resists brute-force attacks; `BCryptPasswordEncoder` in Spring Boot uses it by default with 10 rounds
- Salting — a random value added to the input before hashing; prevents two users with the same password from having the same hash in the database; BCrypt handles salting automatically

### CORS
- What an origin is — the combination of protocol + domain + port; `http://localhost:4200` and `http://localhost:8080` are two different origins even though they share the same domain; the basis for understanding why Angular and Spring Boot conflict in development
- What CORS is — the browser enforces the Same-Origin Policy by default, blocking JavaScript from reading responses from a different origin; CORS lets servers explicitly allow specific cross-origin requests
- CORS is enforced by the browser — a simple request may reach the server before JavaScript is denied
  access to the response, while a failed preflight prevents the browser from sending the real
  cross-origin request
- Why it matters for Angular + Spring Boot — Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API call even though the server responds correctly
- Preflight requests — the browser sends an `OPTIONS` request before any POST with a JSON body or any request with an `Authorization` header; the server must respond with the correct CORS headers or the real request is blocked

### Common vulnerabilities
- SQL injection — the attacker injects SQL into a user input field to manipulate the query; parameterised queries (which JPA uses automatically) prevent it; interviewers ask "how does JPA protect against SQL injection?"
- XSS (Cross-Site Scripting) — the attacker injects malicious JavaScript into a page that runs in other users' browsers and can steal tokens from `localStorage`; Angular escapes all template values by default, which prevents most XSS
- Angular HTML sanitisation — Angular sanitises untrusted values bound to `[innerHTML]`; the dangerous
  escape hatch is trusting attacker-controlled markup through `DomSanitizer.bypassSecurityTrustHtml`
- CSRF (Cross-Site Request Forgery) — the attacker tricks a logged-in user's browser into making an unwanted request; works because cookies are sent automatically by the browser; JWT in the `Authorization` header prevents it because the browser does not attach headers automatically (only cookies)
- Why you validate on the server even when you validate on the client — client-side validation can be bypassed with Postman or browser DevTools; the server is the only boundary you can trust; `@NotBlank` and `@Valid` in Spring Boot enforce this
- Mass assignment risk of exposing entities directly — if a controller binds the request body straight to the `@Entity`, a malicious client can set fields it should never control, like `role: "MANAGER"` or `active: true`, by adding them to the JSON body; DTOs close this hole because the request DTO only declares the fields a client is allowed to send; interviewers ask "what could go wrong if you skip the request DTO and bind the entity directly?"

### Login, disclosure, and transport

- Brute force and rate limiting — repeated login attempts need throttling by account and network
  signal; permanent account lockout is itself abusable, so the trade-off matters
- User enumeration beyond messages — status codes, response shape, and large timing differences can
  reveal whether an account exists even when the visible message is generic
- Password reset — use a short-lived, single-use random token and invalidate it after success; never
  email the existing password or trust only an account identifier
- Information disclosure — stack traces, internal IDs, over-returned entity fields, and secrets in
  logs give attackers system knowledge even when no direct exploit exists
- Exposed operational endpoints — Actuator, Swagger, debug consoles, and heap dumps expand the attack
  surface; sensitive values may be sanitised, but the endpoints still require deliberate access
- TLS as a precondition — bearer tokens and passwords are readable in transit without HTTPS, so JWT
  signing never replaces transport encryption
- Dependency vulnerabilities — a known CVE matters when the vulnerable component and code path are
  actually reachable; patching dependencies is part of application security, not separate housekeeping

---

## TypeScript

TypeScript as used in Angular and Spring Boot full-stack projects. Every item must be explainable with a real example from one of the projects. Interviewers test whether you understand why a feature exists and what the gotchas are, not just whether you can write the syntax.

### Types

- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `void` — the building blocks; interviewers ask what `void` means for function return types and the difference between `null` (explicit absence) and `undefined` (not yet assigned)
- Type inference — TypeScript guesses the type from the assigned value; interviewers ask when you still need to declare the type explicitly (function parameters, complex structures, return types that are not obvious)
- `any` vs `unknown` — `any` disables type checking completely; `unknown` forces you to check the type before using it; interviewers ask why `any` is a code smell and when `unknown` is the right choice (external API responses, user input)
- `never` — the type for values that can never exist; used in exhaustive switch checks and functions that always throw; shows you understand the type system beyond everyday usage
- Union types: `string | number`, `'admin' | 'user'` — a value that can be one of several types; used constantly for roles, status fields, and nullable signals (`Employee | null`)
- Intersection types: `Employee & { permissions: string[] }` — the result must satisfy all combined types; the `type` equivalent of `interface extends`; interviewers ask the difference between intersection and extension
- Literal types: `type Direction = 'left' | 'right'` — restricts a field to specific constant values; interviewers ask the difference between `string` and `'admin' | 'user'` (the literal type catches typos at compile time)

### Interfaces and type aliases

- `interface` vs `type` — both define an object shape; `interface` is preferred for data models (supports `extends` and declaration merging); `type` is required for unions, intersections, and computed types; tested in every TypeScript screening
- Optional properties: `name?: string` — the field can be `undefined`; interviewers ask how this affects form validation (optional fields do not need `Validators.required`) and how `name?: string` differs from `name: string | undefined`
- `readonly` properties — the value cannot be changed after the object is created; interviewers ask the difference between `readonly` (property constraint) and `const` (variable constraint)
- Extending interfaces: `interface AdminUser extends User` — adds new fields to an existing shape; interviewers contrast this with the `&` intersection approach on type aliases

### Enums

- TypeScript enums: `enum Status { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED' }` — used in Angular models that mirror Java backend enums; interviewers ask how to expose an enum in a template (must be assigned to a class property — templates cannot access imports directly)
- `const enum` vs regular `enum` — `const enum` is erased at compile time and inlined as raw values (smaller bundle, no runtime object); regular `enum` keeps the runtime object and supports `Object.values()`; interviewers ask which to use when you need to iterate the values
- String enums vs union types — both restrict a field to a set of values; union types (`type Status = 'DRAFT' | 'SUBMITTED'`) generate less compiled code; string enums are used when values need to be iterated with `Object.values()`; a common confusable pair in Angular interviews

### Generics

- `Array<T>`, `Observable<T>`, `Signal<T>` — generics appear everywhere in Angular; the `T` tells you what the container holds; interviewers ask you to read a type signature out loud and explain what it means
- Writing a generic function or interface — `function getFirst<T>(arr: T[]): T | undefined`
  preserves the element type while honestly modelling an empty array
- Generic constraints: `function findById<T extends { id: number }>(items: T[], id: number)` — restricts which types are allowed; interviewers ask why constraints exist and what error TypeScript gives when the constraint is not met
- Why generics exist — `http.get<Employee[]>('/api/employees')` means you get `Employee[]`, not `any`; type errors are caught at compile time, not at runtime; interviewers ask why calling `http.get()` without a type parameter is a problem
- `keyof` — produces a union of an object type's property names as string literals (`keyof Employee` is `'id' | 'name' | 'email' | ...`); interviewers ask how built-in utility types like `Pick<T, K extends keyof T>` use it to restrict `K` to only real property names of `T`, instead of accepting any string

### Utility types

- `Partial<T>` vs `Required<T>` — `Partial` makes all properties optional (used in update/PATCH request objects); `Required` makes all properties required (the opposite); interviewers ask which fits a PATCH endpoint vs a POST endpoint
- `Readonly<T>` — all properties become readonly; prevents accidental mutation; used to signal immutability in DTOs and config objects passed around the app
- `Pick<T, K>` vs `Omit<T, K>` — `Pick` keeps only the named fields; `Omit` removes the named fields; the most commonly confused utility pair; `Omit<Employee, 'id'>` is the canonical create-form pattern where the id is generated by the backend
- `Record<K, V>` — a typed key-value map; `Record<string, number>` used for lookup tables and dictionaries in services; interviewers ask when to use `Record` vs a plain interface or a `Map`
- Index signature `{ [key: string]: T }` vs `Record<string, T>` — both describe an object with dynamic keys of the same value type; `Record` is the shorthand utility type and the more common choice in application code; interviewers ask why both exist (index signatures predate `Record` and are still needed when mixing dynamic keys with some fixed known properties in the same interface)

### Narrowing and type guards

- `typeof` narrowing — works for primitive types (`'string'`, `'number'`, `'boolean'`); the classic gotcha: `typeof null === 'object'` — always check `=== null` separately when a value could be null
- `instanceof` narrowing — works for class instances; used in catch blocks with custom error classes; interviewers ask when to use `typeof` vs `instanceof` (primitives vs class instances)
- `in` narrowing — checks if a property exists on an object; used to distinguish between two interfaces in a union when the types share some but not all properties
- Truthiness narrowing — a simple `if (value)` check narrows out `null` and `undefined`; gotcha: `0`, `false`, and `''` are also falsy — use `!= null` explicitly when those are valid values you want to keep
- Discriminated unions — a shared property with a unique literal value (`status: 'loading' | 'success' | 'error'`) lets TypeScript narrow automatically inside a switch; the standard pattern for async states in Angular; interviewers ask how this differs from a plain union
- Custom type guards: `user is Employee` — a function whose return type is a type predicate; tells TypeScript to narrow the type if the function returns `true`; tested when discussing services that work with complex union types
- Exhaustiveness check with `never` — assign an unhandled switch case to `never` in the default branch; TypeScript errors if a new union variant is added without a handler; shows understanding of the type system beyond everyday patterns

### Null safety and type assertions

- `?.` optional chaining — stops evaluation and returns `undefined` if the left side is `null` or `undefined`; used constantly in Angular templates with nullable signals; interviewers ask when to prefer `?.` over `!` (when you are not 100% certain the value exists)
- `??` vs `||` — `??` returns the right side only when the left is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; always use `??` when `0` or empty string is a valid value you want to keep
- `!` non-null assertion — removes `null` and `undefined` from the type without any runtime check; if the value is actually null, you get a runtime crash with no TypeScript warning; interviewers ask why `?.` is usually safer
- `as` type assertion — tells TypeScript "I know the type better than you"; does not validate or convert the data; used in Angular forms where the compiler cannot infer the exact type; gotcha: a wrong assertion fails silently at runtime
- `as unknown as T` double assertion — bypasses TypeScript's overlap check and is therefore a code
  smell at application boundaries; fix the source model or perform a real conversion instead of
  using it to silence an incompatible date, DTO, or library type

### Classes and access modifiers

- `public`, `private`, `protected`, `readonly` — `private` restricts access to the same class; `protected` also allows subclasses; `readonly` is about immutability, not visibility; interviewers ask the difference between `private` and `protected` and when to use each
- `private` vs `readonly` — confusable pair: `private` controls who can access the property; `readonly` controls whether it can be reassigned; both can be combined (`private readonly`) and often are for injected dependencies
- Constructor shorthand — `constructor(private http: HttpClient) {}` declares, creates, and assigns a class property in one step; the standard DI pattern in older Angular code; you must read it instantly when reviewing existing codebases
- Classes as types — a TypeScript class can be used as a type without a separate interface; the `CanDeactivateFn<MyComponent>` pattern relies on this; interviewers may show this pattern and ask what type the component parameter has

### `as const`

- Type widening problem — TypeScript widens object property types by default: `{ mode: 'edit' }` infers `{ mode: string }` not `{ mode: 'edit' }`, even with `const`; `const` only prevents reassigning the variable, not mutating properties; interviewers ask why `const` alone is not enough
- `as const` on objects — makes all properties `readonly` and infers literal types instead of widened ones; used for nav config objects and shared constants; interviewers ask what two things `as const` does (readonly + literal type inference)
- `as const` on arrays — turns an array into a `readonly` tuple with exact element types; without it TypeScript only knows `string[]` and loses the actual values; with it TypeScript knows each exact element

### Arrow functions and functions

- Arrow functions vs function declarations — arrow functions inherit `this` from the surrounding scope; function declarations have their own `this`; matters when writing callbacks inside Angular class methods where you need to access `this`
- Default parameters, rest parameters — reduce function overloads; `...args: string[]` collects remaining arguments into an array; common in Angular utility functions and service methods
- Return type annotations — make the function's contract explicit; the compiler catches when the actual return does not match the declared type; interviewers ask when TypeScript can infer the return type and when you must declare it

### Modules and decorators

- `import` / `export` — named exports (multiple per file) vs default export (one per file); Angular uses named exports for components and services; interviewers ask why Angular avoids default exports (named exports keep the name fixed at the source, making refactoring safer)
- Barrel files (`index.ts`) — re-export multiple symbols from a folder so callers import from the folder path, not individual files; common in large consultancy Angular projects in shared module folders; you will encounter these when reading existing code
- What a decorator is in Angular's context — `@Component`, `@Injectable`, `@Pipe` attach metadata to a class that Angular reads at startup; without the decorator, Angular does not know the class is a component
- How TypeScript decorators work conceptually — a function that receives the class and can modify or annotate it; you use them everywhere in Angular but rarely write custom ones at junior level; interviewers test that you know they are functions, not language keywords

---

## JavaScript

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects, not a textbook definition.

### Types, equality, and coercion
- Primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) vs reference types (objects, arrays, functions) — primitives are compared by value; objects are compared by reference; interviewers test this with `{} === {}` (false) or ask why two arrays with the same content are not equal
- `typeof` — returns the type as a string; the classic gotcha: `typeof null === 'object'` is a historical bug that was never fixed; every interviewer knows this and some will ask about it explicitly to test depth of knowledge
- `typeof` vs `instanceof` — `typeof` checks the primitive type; `instanceof` checks if a value was created by a specific class or constructor; use `instanceof` in `catch` blocks to distinguish error types; `typeof null` is wrong for null-checking — use `value === null`
- `==` vs `===` — loose equality performs type coercion before comparing; strict equality checks value AND type; always use `===`; the one valid exception is `value == null`, which catches both `null` and `undefined` in one check without coercing other values
- Truthy vs falsy — falsy values are `false`, numeric zero (including `-0`), `0n`, `''`, `null`,
  `undefined`, and `NaN`; arrays, objects, and the string `'0'` are truthy, which is the edge case
  interviewers usually probe
- `null` vs `undefined` — `null` is intentional absence of a value, set by the developer; `undefined` means a variable was declared but never assigned, set automatically by JavaScript; asked in almost every first JavaScript interview
- Implicit type coercion — `'5' + 3` is `'53'` (string concatenation) but `'5' - 3` is `2` (numeric subtraction); the `+` operator triggers concatenation when either operand is a string; interviewers show arithmetic expressions with mixed types to test whether the candidate can predict the result

### Numbers
- `NaN === NaN` is `false` — `NaN` is the only value in JavaScript that is not equal to itself; interviewers ask this directly to test whether you actually understand `NaN` or just know the name
- `Number.isNaN()` vs global `isNaN()` — `isNaN()` coerces its argument to a number first, so `isNaN('hello')` is `true`; `Number.isNaN()` does not coerce, so `Number.isNaN('hello')` is `false`; the safe choice is always `Number.isNaN()`; a confusable pair tested in junior screenings
- The floating point problem — `0.1 + 0.2 !== 0.3` because binary floating point cannot represent most decimals exactly; interviewers ask "why would this fail in a money calculation?" and expect `toFixed()` for display or integer cents for calculation as the answer
- `parseInt()` vs `Number()` — `parseInt('42px')` returns `42` (stops at the first non-numeric character); `Number('42px')` returns `NaN` (rejects anything that is not a clean number); interviewers ask which to use when parsing a value like `'100px'` from a CSS string
- `toFixed(n)` — rounds to `n` decimal places and returns a **string**, not a number; forgetting the return type causes a bug when the result is used in further arithmetic without converting back; used to format prices in TimeTrack-style apps

### Variables and scope
- `var` vs `let` vs `const` — `var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped; use `const` by default; use `let` only when reassignment is needed; `var` is avoided in all modern code; tested in every screening
- Hoisting — `var` declarations are moved to the top of their scope and initialised as `undefined`; function declarations are fully hoisted and can be called before their line; function expressions (including arrow functions assigned to variables) are not fully hoisted; interviewers ask "what does this code output?" with code that calls a function before it is defined
- Temporal Dead Zone (TDZ) — `let` and `const` are hoisted but not initialised; accessing them before the declaration line throws a `ReferenceError`; interviewers ask this to distinguish candidates who understand `let` deeply from those who just know to avoid `var`
- Closures — a function that retains access to variables from its outer scope even after the outer function has returned; appears in Angular `computed()`, event handlers, and services with private state; interviewers ask "what is a closure and give me a real example?"

### Functions and `this`
- Function declarations vs expressions vs arrow functions — declarations are hoisted; arrow functions are expressions and are not hoisted; the key choice in practice is declaration vs arrow, not declaration vs expression
- `this` in regular functions — refers to the caller at runtime; in a standalone function call it is `undefined` (strict mode) or `window` (non-strict); the most common source of `this` bugs when a class method is passed as a callback without binding
- Arrow functions and `this` — arrow functions inherit `this` from the surrounding scope at definition time; they have no own `this`; this is why Angular uses arrow functions in class properties and callbacks — the component's `this` is always available
- `bind`, `call`, `apply` — explicitly set `this` on a function; `bind` returns a new function; `call` and `apply` invoke it immediately (the difference is how arguments are passed); interviewers show older Angular or JavaScript code with these and ask what they do
- Default parameters and rest parameters — `function f(role = 'employee')` reduces overloads; `...args` collects remaining arguments into an array; interviewers ask how a default parameter differs from `|| 'default'` inside the function body (the `||` version incorrectly treats `0` and `''` as missing)
- Higher-order functions — functions that take or return other functions; the foundation of `map`, `filter`, and every RxJS operator; interviewers ask "what is a higher-order function?" and expect a real example from array methods or Angular pipes

### Arrays
- `map` — transforms every element and returns a new array of the same length; does not mutate the original; most common use: converting API response objects to view models; interviewers expect this as the default tool for transformation
- `filter` — returns a new array containing only elements that pass the test; always returns an array (never `undefined`); used for filtering lists by status, role, or search term
- `reduce` — accumulates all elements into one value: a number, an object, a string, or another array; signature: `reduce(callback, initialValue)`; used for totals and grouping by category; interviewers ask the signature and expect a working example
- `find` vs `filter` — `find` returns the first matching element or `undefined`; `filter` always returns an array; interviewers show both and ask which to use when looking up a user by id (answer: `find`)
- `findIndex`, `some`, `every`, `includes` — searching without a loop; interviewers ask "which method would you use to check if any task is overdue?" (answer: `some`); "check if a role exists in an array?" (answer: `includes`)
- `forEach` vs `map` — `forEach` returns `undefined` and is only for side effects; `map` returns a new array and is for transformation; using `forEach` and pushing results into a new array instead of using `map` is a classic junior mistake
- `sort` mutation — `sort` modifies the original array in place; the default sort is lexicographic, which breaks numbers (`[10, 9, 2].sort()` gives `[10, 2, 9]`); to sort numbers correctly: `.sort((a, b) => a - b)`; to sort without mutating: `[...arr].sort(...)`
- Method chaining — `filter().map().sort()` — each method receives the output of the previous one; the pattern behind Angular `computed(() => tasks().filter(...).map(...))` signals; interviewers show a chained pipeline and ask what each step produces

### Objects and JSON
- Object literals, shorthand properties, computed keys — `{ name }` instead of `{ name: name }`; `{ [key]: value }` for dynamic keys; interviewers expect shorthand as natural everyday syntax, not something that needs explaining
- Object destructuring — `const { name, role } = user`; rename with `{ name: userName }`; default value with `{ city = 'Madrid' }`; destructuring in function parameters `function display({ name, role })`; used constantly in Angular to unpack API responses and component inputs
- Array destructuring — `const [first, second] = items`; skip elements with `[, , third]`; swap variables with `[a, b] = [b, a]`; used when consuming tuple-like return values
- Spread in objects — `{ ...obj, key: newValue }` creates a shallow copy with overrides; the shallow copy is the most important detail — nested objects are still references, not new copies; used for immutable state updates in Angular signals (`employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))`)
- `Object.keys`, `Object.values`, `Object.entries` — iterate over an object's properties as arrays; `Object.entries` is most useful because it gives key-value pairs; `Object.fromEntries` converts them back; interviewers ask which to use when you need both key and value in the loop body
- `Object.assign` vs spread — both merge objects; `Object.assign` mutates the target object; spread creates a new object; prefer spread in modern code; both produce a shallow copy
- `Object.freeze` — makes an object's top-level properties immutable; useful for configuration constants; shallow — nested objects inside a frozen object are still mutable
- `JSON.stringify` / `JSON.parse` — convert between JavaScript objects and JSON strings; `JSON.stringify` silently drops `undefined` values and functions; `JSON.parse` throws `SyntaxError` on invalid input and must be wrapped in `try/catch`; used in the Angular localStorage pattern for persisting signal state

### Strings and regular expressions
- String immutability — strings cannot be changed in place; every method returns a new string; `str[0] = 'x'` does nothing silently; a common source of confusion when coming from a mutable mindset
- Template literals — backtick strings with `${}` interpolation; support multiline without `\n`; any expression can go inside `${}`; interviewers expect template literals as the default over string concatenation
- Search methods: `includes`, `startsWith`, `endsWith`, `indexOf` — boolean checks for presence and position; `indexOf` returns -1 if not found; used in search filtering (check if a name includes the search term) and URL parsing
- Transformation methods: `slice`, `split`, `trim`, `replace`, `toLowerCase`, `toUpperCase` — `split` converts a string into an array; `trim` removes leading/trailing whitespace; `replace` replaces the first match by default; interviewers may ask how to split a CSV string into an array
- Regex pattern syntax — `/pattern/flags`; common flags: `i` (case insensitive), `g` (global — find all matches, not just the first); interviewers expect you to know what the `g` flag does and what happens without it
- `.test(str)` — returns a boolean; used in `Validators.pattern()` for Angular form validation and in conditional logic ("is this a valid email format?")
- `.match(regex)` and `str.replace(regex, replacement)` — `match` returns the matching parts as an array; `replace` with the `g` flag replaces all occurrences; without `g` only the first match is replaced — a common source of bugs

- `Set` vs `Array` — use Set when uniqueness matters or when you need fast `has()` lookups; use Array when index access or method chaining (map/filter) is needed; use `[...new Set(arr)]` to convert back to an array

### Async JavaScript
- Callbacks — the original async pattern; callback hell is deeply nested callbacks that handle sequential operations; Promises and `async`/`await` were introduced specifically to solve this readability and error-handling problem
- Promises: `then`, `catch`, `finally` — `then` runs on resolve; `catch` runs on reject; `finally` always runs regardless of outcome; interviewers ask when to use `finally` vs putting cleanup code after the `try/catch`
- `Promise.all` — observes several already-created promises concurrently, resolves when all fulfil,
  and rejects when one rejects; it does not itself start work or guarantee parallel execution
- `Promise.allSettled` vs `Promise.all` — `allSettled` never rejects; it waits for all promises and returns each result with `{ status: 'fulfilled' | 'rejected', value | reason }`; use when some requests can fail independently without aborting the rest
- `async` / `await` — syntactic sugar over Promises; makes async code read like synchronous code; `await` can only be used inside an `async` function; an `async` function always returns a Promise even if it returns a plain value
- Sequential vs concurrent `await` — awaiting each producer before creating the next serialises them;
  create independent promises first and await them together when their underlying operations can overlap
- Event loop — JavaScript is single-threaded; microtasks (Promise callbacks) run before macrotasks (setTimeout); `Promise.then()` runs before `setTimeout` even at 0ms delay; explains why long synchronous code blocks the UI even if it calls no async functions
- Promise vs Observable in Angular — Promises emit one value and start immediately; Observables are lazy (start on subscribe), can emit multiple values, and can be cancelled with `takeUntilDestroyed()`; `firstValueFrom()` converts an Observable to a Promise; interviewers ask why Angular's `HttpClient` returns Observables instead of Promises

### Modules
- Named exports vs default export — Angular uses only named exports; named exports are safer to refactor because editors auto-rename them; default exports let the importer choose any name, which makes automated refactoring unreliable
- `import { name as alias }` and `import * as namespace` — renaming to avoid naming conflicts; namespace import bundles all exports into one object; used when consuming libraries that export many things at once
- Barrel pattern — an `index.ts` file that re-exports everything from a folder so imports stay clean; `import { X, Y } from './feature'` instead of long relative paths; common in large Angular feature modules
- Dynamic imports and lazy loading — `import('./module').then(m => m.Class)` loads code only when needed; Angular uses this in `loadComponent:` routing to reduce the initial bundle size; interviewers ask how lazy loading works and why it matters for app startup performance
- Tree-shaking — a bundler can remove unused statically analysable ESM code when side effects permit
  it; both named and default exports can be tree-shaken

### Error handling
- `try` / `catch` / `finally` — `try` is the code that might throw; `catch` receives the error object; `finally` always runs for cleanup (hide a spinner, close a connection); interviewers ask when to use `finally` vs putting code after the `try/catch` block (answer: `finally` guarantees execution even if `catch` also throws)
- `Error` object: `message`, `name`, `stack` — `stack` shows the full call chain that led to the error; essential for debugging production bugs; `name` distinguishes error types before `instanceof` is possible
- Custom error classes — extending `Error` to create `ValidationError`, `HttpError`, etc.; lets you use `instanceof` in `catch` to handle different error types differently; interviewers ask how to distinguish a network error from a validation error without checking arbitrary properties
- Silently swallowing errors — catching an error and doing nothing is the most common junior mistake; the caller has no idea the operation failed; always either handle fully (show a message) or re-throw with `throw error`
- Error handling with `async`/`await` — `try/catch` catches both synchronous errors and rejected Promises inside an `async` function; the correct pattern for Angular services that call `firstValueFrom()` or `fetch()`

### Loops and iteration
- Classic `for` loop — `for (let i = 0; i < arr.length; i++)`; still the right tool when you need the index itself or must skip/step irregularly; interviewers ask why most modern code prefers `for...of` or array methods over this form (less error-prone — no off-by-one risk on the condition or increment)
- `for...of` vs `for...in` — `for...of` iterates the values of any iterable (arrays, strings, Sets, Maps); `for...in` iterates the string keys of an object; using `for...in` on an array is a classic bug — it gives `'0'`, `'1'`, `'2'` as strings, not the array values
- When to use a loop vs array methods — `map`, `filter`, `reduce` are preferred for data transformation; `for...of` is the right choice when you need early exit with `break` or when the loop body contains `await`; `forEach` cannot `break` and returns `undefined`
- `break` and `continue` — `break` exits the loop immediately; `continue` skips the rest of the current iteration; the main reason to choose `for...of` over `forEach` when early exit is needed
- `while` loop — repeats while a condition is true; use when the number of iterations is not known in advance (polling for a result, retrying an operation, reading paginated data)
- `while` vs `do...while` — `while` checks the condition before the first run and may execute zero times; `do...while` runs the body once before checking, guaranteeing at least one execution; interviewers ask for a real case where `do...while` is the right choice (e.g. show a menu at least once, then repeat while the user wants to continue)

### DOM events
- Event bubbling — a click on a child element also triggers click handlers on every ancestor element up to the document root; interviewers show a card with a button inside, both with click handlers, and ask why both fire
- `stopPropagation()` — prevents the event from travelling further up the DOM tree; used when a button inside a card should not also trigger the card's own click handler; requires passing `$event` in the Angular template with `(click)="handler($event)"`
- `preventDefault()` — cancels the browser's default behaviour for that element: form submission and page reload, link navigation, checkbox toggle; used in Angular form submits and custom `<a>` link overrides
- `stopPropagation` vs `preventDefault` — independent methods; `stopPropagation` controls where the event travels in the DOM; `preventDefault` controls what the browser does after the event; interviewers show a form submit and ask which one prevents the page reload

### Modern syntax (ES6+)
- Optional chaining `?.` — safely accesses a nested property that might be `null` or `undefined` without throwing; `user?.address?.city` returns `undefined` instead of a `TypeError`; used in Angular templates and services when API data may be partially missing
- Nullish coalescing `??` vs `||` — `??` falls back only when the left side is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; interviewers test this with a count or price field where `0` is a valid value that should not be replaced by a default
- Logical assignment: `||=`, `&&=`, `??=` — shorthand for conditional assignment; `a ??= 'default'` assigns only if `a` is `null` or `undefined`; interviewers may show these to test whether the candidate can read modern JavaScript they did not write
- Debouncing concept — delaying a function call until after a rapid burst of events stops; used in Angular with RxJS `debounceTime()` on search inputs to avoid sending a request on every keystroke; interviewers ask "why are you using `debounceTime`?" — the expected answer is "to wait until the user stops typing before sending the API request"

---

## CSS

Topics a junior must explain confidently to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the Angular projects.

### Box model
- `margin`, `padding`, `border`, `content` — what each layer is and how they stack; interviewers draw the box model and ask you to label it or explain why two elements are not touching even though margin is set to 0
- `box-sizing: border-box` — makes `width` include padding and border; the default `content-box` adds them on top, causing sizing surprises; setting it globally in a reset makes layouts predictable
- Collapsing margins — two adjacent vertical margins collapse into one (the larger wins, not the sum); the most common box model surprise in interviews
- CSS reset pattern — `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }` removes browser defaults and ensures consistent sizing; interviewers ask why `::before` and `::after` are included alongside `*`

### Display and layout
- `display: block`, `inline`, `inline-block` — block takes full width and starts on a new line; inline flows with text and ignores width and vertical margin; `inline-block` is both; interviewers ask why a `<span>` cannot have width
- `display: none` vs `visibility: hidden` — `none` removes the element from layout entirely (no space); `hidden` hides it but keeps its space; this pair is tested in every junior screening
- Flexbox vs Grid — Flexbox for one-dimensional layout (row or column); Grid for two-dimensional layout (rows AND columns at the same time); interviewers ask "when would you choose Grid over Flexbox?"

### Angular-specific CSS
- View encapsulation — Angular scopes component styles by adding a unique attribute to every element in the template; styles in `component.scss` only apply to that component's own elements, not to child components; interviewers ask "why does your style not apply inside the child component?"
- `:host` selector — targets the component's root element from within its own styles; used to set `display: block` or add margin to the component itself; not knowing this is a red flag for an Angular role
- When to use `styles.css` vs component styles — `styles.css` for global rules (body, html, Angular Material overrides); component styles for everything specific to one component; interviewers ask why Angular Material overrides go in `styles.css` and not in a component file
- `::ng-deep` — deprecated but still widely used in consultancy codebases; pierces view encapsulation to style child component internals that cannot otherwise be reached; interviewers ask why it is deprecated and what the modern alternative is

### Selectors and specificity
- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` — how to target elements by relationship; interviewers show a selector and ask which elements it matches
- Pseudo-classes: `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`, `:not()` — `:not()` excludes elements from a rule; `:focus` is essential for keyboard accessibility; tested in code review questions
- `:focus` vs `:focus-visible` — `:focus` triggers on every way of focusing an element, including a mouse click; `:focus-visible` only shows the ring when the browser decides keyboard navigation is likely (Tab key); interviewers ask why a button gets an ugly focus ring on click and how `:focus-visible` fixes it without removing accessibility for keyboard users
- Pseudo-elements: `::before`, `::after` — insert CSS-generated content before or after an element; must have a `content` property (can be an empty string); used for decorative elements and Angular Material state layers
- Specificity scoring — inline styles beat IDs (`1-0-0`) beat classes (`0-1-0`) beat elements (`0-0-1`); the rule with the highest score wins, not the one that appears last; interviewers give two rules and ask which one applies
- `!important` — raises a declaration into the important cascade, after which origin, layer, and
  specificity still resolve competing important declarations; use it sparingly because it makes
  overrides harder to reason about

### Flexbox
- Container properties: `flex-direction`, `justify-content`, `align-items`, `gap` — the four set on almost every flex container; not knowing these will fail the "build a navbar" question in any screening
- `flex-wrap: wrap` — controls whether items wrap to the next line when space runs out; `nowrap` (default) shrinks items to fit; `wrap` moves them to a new row; asked when discussing responsive card layouts
- Item properties: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self` — `flex: 1` makes an item fill remaining space; `flex-shrink: 0` prevents an icon or button from shrinking next to a growing input
- The main axis and cross axis — `justify-content` works on the main axis, `align-items` on the cross axis; the axis flips with `flex-direction: column`; interviewers ask "how do you center something vertically inside a flex container?"
- `margin: auto` on flex items — absorbs all available space on that side; used to push an action button to the right of a navbar without adding a wrapper element; interviewers show navbar code and ask how it works

### CSS Grid
- `grid-template-columns` and `gap` — the two properties set most often on a grid container; understanding `fr` units is required to explain any Grid answer
- `repeat()` function — `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern that needs no media queries
- `fr` unit — distributes free space after fixed columns are placed; does not include the gap in the calculation, which is why it is cleaner than percentages for equal columns
- `auto-fill` vs `auto-fit` — both create as many columns as fit; `auto-fill` keeps empty column tracks (items stay at their minimum size); `auto-fit` collapses empty tracks (items stretch to fill the space); a confusable pair tested in interviews
- `grid-column` and `grid-row` — placing an item across multiple tracks using grid line numbers; `grid-column: 1 / -1` spans all columns; `span 2` spans two tracks from wherever the item is placed

### Position
- `static`, `relative`, `absolute`, `fixed`, `sticky` — the common positioning modes; `fixed`
  normally uses the viewport but a transformed or filtered ancestor can establish its containing
  block, while `sticky` is constrained by its scrolling ancestor
- How `absolute` finds its reference point — positions relative to the nearest ancestor that
  establishes a containing block; otherwise it falls back to the initial containing block
- `z-index` and stacking context — applies to positioned boxes and flex/grid items; properties such
  as `transform` and `opacity < 1` create a new stacking context, explaining why a large number
  cannot escape an ancestor's stacking order
- `inset: 0` — shorthand for `top: 0; right: 0; bottom: 0; left: 0`; used in modal overlays to cover the full viewport; interviewers who review your code expect you to know this shorthand

### Responsive design
- Mobile-first with `@media (min-width: ...)` — base styles for mobile, then `min-width` queries add complexity for wider screens; `max-width` (desktop-first) is less common because it starts with the complex case; interviewers ask why mobile-first is the recommended approach
- Breakpoints: `768px` (tablet), `1024px` (desktop) — the most common values in real Angular projects; a junior must justify these numbers and explain that `auto-fill` grid can eliminate breakpoints entirely for card grids
- Fluid images — `max-width: 100%; height: auto` on `img` prevents images from overflowing their container and keeps the aspect ratio; standard in every CSS reset; not knowing this is a recognisable beginner mistake
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected

### Units
- `px` — a CSS reference pixel, useful for thin borders and other fixed details; root-relative units
  usually respect user text-size preferences more naturally for typography and scalable spacing
- `%` — relative to the parent's value on the same axis; for vertical `padding` and `margin`, `%` is relative to the parent's **width**, not height — a common surprise in interviews
- `em` — relative to the current element's font size; compounds through nesting, which makes it hard to predict in deeply nested components; prefer `rem` by default
- `rem` — relative to the root font size (`16px` by default); does not compound; the safe choice for font sizes and spacing; `rem` vs `em` is a classic confusable pair
- `vw` and `vh` — relative to the viewport width and height; `min-height: 100vh` is safer than `height: 100vh` because it grows with content instead of clipping it

### Transitions and animations
- `transition` — smooth change for a specific property on state change; always place it on the base element, not on `:hover`, so it runs in both directions; putting it on `:hover` makes the exit instant — a classic interview trap
- `transform` — `translateX/Y`, `scale`, and `rotate` change visual appearance without changing
  normal-flow geometry; browsers can often composite transforms efficiently, but GPU promotion is
  not guaranteed
- `transform` vs `top/left` for movement — transforms commonly avoid layout while positional changes
  can trigger it; profile when performance matters instead of treating either rendering path as an
  unconditional guarantee
- `@keyframes` and `animation` — multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back

### Typography
- `font-size` with `rem` — `rem` follows the root size and composes consistently with user settings;
  fixed pixels are not automatically inaccessible, but a scalable type system is easier to zoom and
  maintain
- `font-weight` numeric values — `400` (normal), `600` (semibold), `700` (bold); interviewers ask why numeric values are used instead of the keyword `bold`, and whether every font supports every weight
- `line-height` unitless value — `1.5` means 1.5× the current font size; a unitless value scales correctly when font size changes; `line-height: 24px` breaks as soon as the font size changes
- Text truncation — `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` must all be present; interviewers ask why removing any one of them breaks the effect and what each one does individually
- `text-transform` — `capitalize` displays stored lowercase values (`'active'`) as `'Active'` without changing the data; `uppercase` for labels and badges; tested in code review questions about status display
- `font-family` fallback stack — listing several fonts (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`) so the browser falls back if the first font is not installed; the last value should always be a generic family (`sans-serif`, `serif`, `monospace`); interviewers ask why you never list just one font name

### CSS variables
- `--variable-name` and `var()` — define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours; change one variable and the whole UI updates
- `:root` vs component scope — declaring on `:root` makes the variable globally available; scoping to a specific selector limits it to that element's subtree; interviewers ask why Angular Material theming variables are declared on `:root`
- CSS variables are live at runtime — a CSS variable can be changed by JavaScript with `element.style.setProperty('--name', value)`, enabling runtime theming without recompiling; hardcoded values cannot be changed this way; interviewers ask how you would implement a simple theme switcher
- `var()` with a fallback — `var(--primary, #e8572a)` uses the second argument when the variable is not defined; provides a safety net when customising Angular Material where some variables may not be set

### Colors and transparency
- Color formats: `hex`, `rgb()`, `hsl()` — `hex` is most common for fixed colors; `rgba()` adds transparency and is preferred for overlays and shadows; `hsl` makes color variations easy (just change the lightness value); interviewers ask which format to choose and why
- `opacity` vs `rgba` transparency — `opacity` affects the element AND all its children; `rgba` only affects the specific property it is applied to; classic interview question: "why does `opacity: 0.5` on a card fade the text too, but `background: rgba(0,0,0,0.5)` does not?"
- `rgba` for overlays and shadows — `rgba(0, 0, 0, 0.5)` for modal backgrounds, `rgba(0, 0, 0, 0.08)` for card shadows; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value
- `currentColor` — a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync with the text color without repeating the value

### Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` — spread is optional, and transparent
  colour can use modern `rgb(... / alpha)`, hex alpha, HSL, `rgba()`, or a design token
- `border-radius: 50%` vs `border-radius: 9999px` — `50%` makes a circle but only when the element is square; `9999px` creates a pill shape at any aspect ratio; interviewers ask which one to use for an avatar vs a badge — a confusable pair
- `background-size: cover` vs `background-size: contain` — `cover` fills the element completely and may crop the image; `contain` fits the whole image and may leave empty space; `cover` is standard for hero sections and card backgrounds
- `object-fit: cover` — same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements in a fixed-size container; `background-size` is for background images, `object-fit` is for `<img>` tags — a confusable pair
- `outline` vs `border` — `outline` sits outside the border and does not take up layout space; never remove the browser's default focus outline without adding a visible custom replacement; `button:focus-visible` is the accessible way to style it
- `aspect-ratio` — locks an element's width-to-height ratio (`aspect-ratio: 16 / 9`) so it scales without distortion when only one dimension is known; replaces the older padding-percentage hack for responsive video and image containers; interviewers ask how you reserve space for an image before it loads to avoid layout shift

### Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content; used to prevent images from breaking out of a `border-radius` card container; `scroll` always shows scrollbars; `auto` only shows them when content overflows
- `overflow-x` and `overflow-y` — control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport
- Scrollable container pattern — `overflow-y: auto` with a fixed `max-height` creates a scroll area without triggering a page scroll; `auto` vs `scroll` is a confusable pair: `auto` is invisible when not needed, `scroll` is always visible

### CSS functions
- `calc()` — mixes different units in one expression; `calc(100% - 64px)` subtracts a fixed header height from the full viewport; spaces around `+` and `-` are required; interviewers ask when `calc()` is necessary and why neither pure percentage nor pure `px` can solve the same problem
- `clamp(min, preferred, max)` — creates a value that scales fluidly between limits; `font-size: clamp(1rem, 2.5vw, 2rem)` replaces multiple breakpoint overrides for font size; tested because it signals modern CSS knowledge
- `min()` and `max()` — `min(100%, 600px)` is equivalent to `max-width: 600px; width: 100%`; `max(1rem, 5%)` ensures a minimum even when using a relative unit; useful for containers that should be fluid on mobile and capped on desktop

### BEM naming
- Block, element (`__`), modifier (`--`) — `.card`, `.card__title`, `.card--featured`; a naming convention that makes class names predictable in global stylesheets; interviewers at consultancies ask about CSS organisation because shared CSS becomes unmaintainable without a convention
- Why BEM keeps specificity low — each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- The flat element rule — BEM elements never nest in the class name; even if `.card__body` contains a title, the class is `.card__title`, not `.card__body__title`; depth lives in the HTML, not in the class name — a common mistake when first learning BEM
- When BEM applies in Angular — Angular view encapsulation handles component isolation; BEM is still needed for global styles in `styles.css` and shared components in `shared/` where encapsulation does not help

---

## SQL

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Database is PostgreSQL. Every item must be explainable with a real query — from the bookstore exercises or the TimeTrack data model.

---

### JOINs

- `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- `RIGHT JOIN` — mirror of `LEFT JOIN`; rarely used because any `RIGHT JOIN` can be rewritten as a `LEFT JOIN` by swapping the tables; tested to check you understand the symmetry
- `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- Multiple JOINs — you can chain as many JOINs as needed; interviewers ask you to write a query joining three tables, for example `time_entries → users → projects`
- JOIN cardinality and row multiplication — predict whether each relationship is one-to-one, one-to-many, or many-to-many before joining; apparent duplicates usually mean the join produced several legitimate matches, so `DISTINCT` must not be used as a blind repair
- `ON` vs `WHERE` with an outer join — a condition in `ON` controls which right-side rows match while preserving unmatched left rows; moving that condition to `WHERE` can reject the `NULL`-extended rows and accidentally turn a `LEFT JOIN` into an inner join
- Self JOIN — a table joined to itself using two aliases, used to compare rows within the same table (e.g. "which employees share the same manager?" or "find duplicate emails"); interviewers ask how you join a table to itself when there is only one `FROM` clause to work with
- `CROSS JOIN` — produces every combination of the two inputs; use it only when a Cartesian product is intentional and recognise a missing join condition as the accidental version
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

---

### Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` — `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `SUM` and `AVG` — both ignore `NULL`; `SUM` adds the known values and `AVG` divides by the count of known values, so `AVG` does not treat missing values as zero
- `MIN` and `MAX` — return the smallest or largest non-`NULL` input and work with ordered types such as numbers, text, and dates
- Aggregate results on empty input — `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, and `MAX` return `NULL` when no input rows remain; use `COALESCE` only when the result contract truly requires a default
- `GROUP BY` rule — selected expressions normally need to be grouped or aggregated; PostgreSQL also permits columns it can prove functionally dependent on a grouped primary key, but explicit grouping is clearer in portable junior SQL
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` — filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- Conditional aggregation with `CASE WHEN` — `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows; used for reporting by status in TimeTrack; interviewers ask "how would you count only approved entries per project?"
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions

---

### Querying basics

- `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- `CASE WHEN` in `SELECT` — `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row; interviewers ask you to add a status label to a result set
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages
- Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC`
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- `||` string concatenation — joins two text values into one column, e.g. `first_name || ' ' || last_name AS full_name`; interviewers ask how you build a display name from separate columns without a function call
- `UNION` vs `UNION ALL` — `UNION` combines the results of two queries and removes duplicate rows; `UNION ALL` keeps every row including duplicates and is faster because it skips the duplicate check; interviewers ask which one to use when you know the two result sets cannot overlap (`UNION ALL` — no reason to pay for a duplicate scan)
- `UNION` column rules — both queries must return the same number of columns with compatible types; column names in the result come from the first query; interviewers ask what happens if the column types do not match (PostgreSQL raises an error or silently casts, depending on the mismatch)
- `INTERSECT` and `EXCEPT` — `INTERSECT` keeps rows present in both results and `EXCEPT` keeps rows from the first result that are absent from the second; both remove duplicates unless `ALL` is requested
- SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase

---

### Filtering and NULL handling

- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` — `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`; interviewers ask why `= NULL` does not work
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; use it when the query contract deliberately substitutes a default such as `0` or `'Unknown'`, without confusing missing data with a real value
- `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `NOT IN` with `NULL` — if the subquery or list contains `NULL`, comparisons can become `UNKNOWN` and `NOT IN` may return no rows; use `NOT EXISTS` with a correlated equality when nullability is possible
- `BETWEEN` with timestamps — both endpoints are inclusive, so a date-only upper bound silently excludes later times on that date; use a half-open range such as `created_at >= start AND created_at < next_day` to preserve index use and include the whole period

---

### Subqueries, CTEs, and views

- Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` — must return at most one row and one column; an uncorrelated scalar subquery can be evaluated once, while a correlated one may require work for each outer row
- `IN` vs `EXISTS` — choose from result semantics and null behaviour rather than a universal speed rule: `IN` compares with a set of values, while correlated `EXISTS` asks whether at least one matching row exists; PostgreSQL may optimise either into a similar plan
- Correlated subquery — references a column from the outer row and expresses a per-row relationship; compare it with `EXISTS`, a join, or pre-aggregation when the repeated relationship is hard to read or slow
- Subquery vs `JOIN` — choose the form that expresses the required result cardinality clearly; a join can multiply rows while `EXISTS` only tests presence, and PostgreSQL can often optimise equivalent formulations similarly
- `WITH` (CTE) — names a subquery so it can be referenced by name in the same query; makes multi-step queries readable; interviewers ask "when would you use a CTE instead of a subquery?"
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application

---

### Schema operations

- `CREATE TABLE` — defines columns, data types, defaults, and constraints together; read the full definition before loading data because the database, not the application, enforces it
- `ALTER TABLE` — evolves an existing table by adding, changing, or dropping columns and constraints; versioned migration tooling belongs to the application stack, while SQL owns the resulting schema change
- `DROP` vs deleting rows — `DROP` removes the database object itself, whereas `DELETE` and `TRUNCATE` keep the table and remove data
- `DEFAULT` — supplies a value only when an insert omits the column; it does not replace an explicitly inserted `NULL`, and it does not backfill old rows unless the schema change does so

---

### Working with an existing database

- Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access
- Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects

---

### DML — modifying data

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- Multi-row `INSERT` and `INSERT ... SELECT` — insert several value tuples in one statement or populate a table from a query while matching target columns and compatible types
- `RETURNING` — `INSERT INTO users (...) VALUES (...) RETURNING id` — returns the generated ID without a second `SELECT`; PostgreSQL-specific; interviewers ask "how do you get the new ID after an INSERT?"
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE` and processes matching rows; `TRUNCATE`
  removes all rows with a stronger table lock and resets sequences only when `RESTART IDENTITY` is
  requested; choose deliberately rather than treating either as universally safe
- `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

---

### Transactions

- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- Autocommit and explicit transaction boundaries — outside an explicit transaction, clients commonly commit each successful statement separately, so `BEGIN` or the framework transaction boundary is required when several statements must succeed or fail together
- ACID properties — Atomicity is all-or-nothing, Consistency preserves declared invariants from one
  valid state to another, Isolation controls interference between concurrent transactions, and
  Durability preserves committed work
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint without ending the transaction
- Transaction failure state — after a PostgreSQL statement errors inside a transaction, later statements are rejected until `ROLLBACK` or `ROLLBACK TO SAVEPOINT` clears the failed state
- Transaction isolation — controls which concurrent changes a transaction can observe; recognise PostgreSQL `READ COMMITTED` as the default and choose stronger guarantees only for a concrete consistency need

---

### Window functions

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a unique sequential number to each row within a partition; used to get "the latest time entry per user" by filtering `WHERE row_num = 1` in an outer query; a very common interview pattern
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- `DENSE_RANK()` vs `RANK()` — both give ties the same rank, but `DENSE_RANK()` does not leave gaps after a tie; choose it when the next distinct value must receive the next consecutive rank
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; used to compare consecutive time entries
- Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- Partition total vs running total — `SUM(value) OVER (PARTITION BY group_key)` repeats the whole partition total; adding `ORDER BY` and an explicit cumulative frame produces a running total

---

### Schema design

- Primary key — one optional table constraint, possibly composite, that uniquely identifies rows;
  application tables normally define one even though SQL does not require every table to have it
- Foreign key — one or more columns referencing a primary or other unique candidate key;
  PostgreSQL rejects values with no referenced row, enforcing referential integrity
- `ON DELETE` behavior — PostgreSQL defaults to `NO ACTION`; `RESTRICT` also rejects referenced-row deletion but cannot be deferred, `CASCADE` deletes dependent rows, and `SET NULL` clears a nullable foreign key
- `NOT NULL` constraint — the column must always have a value; used on required fields like `email`, `password`, `status`; interviewers ask why you chose to add it
- `UNIQUE` constraint — rejects duplicate non-`NULL` keys and creates a supporting unique B-tree index; PostgreSQL permits multiple `NULL` values by default unless `NULLS NOT DISTINCT` is requested
- Composite uniqueness — a `UNIQUE` constraint across several columns enforces a business rule on the combination, such as one membership per `(user_id, project_id)`
- `CHECK` constraint and `NULL` — a check rejects `FALSE` but accepts `TRUE` or `UNKNOWN`, so `CHECK (hours > 0)` still needs `NOT NULL` when hours are required
- One-to-many relationships — place the foreign key on the many side so each child references one parent while a parent can own several children
- Many-to-many relationships — use a junction table with two foreign keys and usually a composite uniqueness rule so each pair appears only once
- Natural vs surrogate keys — a surrogate key gives the row a stable technical identity, while a natural business key still needs a `UNIQUE` constraint when the domain says it cannot repeat
- Normalization and data anomalies — store each fact in the relation determined by its key so inserts, updates, and deletes do not require inconsistent copies; formal normal-form analysis belongs to middle
- Reading a relational schema — identify each table's grain, primary key, foreign keys, nullability, and relationship cardinality before constructing a query

---

### Data types

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- `NUMERIC(p,s)` vs `FLOAT` — `FLOAT` is an approximation that compounds rounding errors over time; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices and financial values; interviewers ask "why would you not use `FLOAT` for money?"
- Integer division and explicit casts — integer divided by integer truncates the fractional part in PostgreSQL; cast an operand to `NUMERIC` when the result must retain decimals
- `DATE` vs `TIMESTAMP` / `TIMESTAMPTZ` — use `DATE` for a calendar value with no time of day, `TIMESTAMP` for a local wall-clock value, and `TIMESTAMPTZ` for an instant shared across time zones
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does
  not generally treat an unquoted integer `1` as a boolean
- `JSONB` recognition — stores validated JSON in a binary representation that supports PostgreSQL operators and indexes; keep relational columns for stable fields that need ordinary constraints and joins

---

### PostgreSQL specifics

- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `EXTRACT` — returns one date/time field such as year, month, or hour for filtering or reporting; use it deliberately because applying a function to an indexed column can prevent a simple index condition
- `NOW()` vs `CURRENT_DATE` — `NOW()` returns the transaction-start timestamp, while `CURRENT_DATE` returns the session's current date with no time component
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- `STRING_AGG(column, separator)` — concatenates values from multiple rows into one string per group, e.g. `STRING_AGG(name, ', ')` to list all project names for a user on one line; PostgreSQL-specific; interviewers ask how you would turn grouped rows into a single comma-separated column for a report

---

### Common string functions

- `LOWER` and `UPPER` — normalise case for display or comparison while recognising that applying them to a column can affect ordinary index use
- `TRIM` — removes leading and trailing characters, whitespace by default, without changing whitespace inside the value
- `LENGTH` — counts characters in text rather than bytes, which matters for non-ASCII data
- `SUBSTRING` and `REPLACE` — extract part of a string or substitute matching text; use them for query shaping rather than repairing badly modelled data

---

### Performance basics

- What an index is — an auxiliary access structure that can speed reads at the cost of storage and write maintenance; B-tree is PostgreSQL's common ordered index, while other index methods serve different operators
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- Foreign-key indexes — PostgreSQL indexes the referenced primary or unique key but not the referencing foreign-key columns automatically; add an index when joins or parent deletes need to find dependent rows efficiently
- When NOT to index — avoid indexes without a measured access pattern, especially on small tables or frequently updated columns; low cardinality alone is not decisive because a partial or composite index can still be selective
- `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index
- Sargable predicates — compare an indexed column directly to a compatible value or range when possible; wrapping the column in a function or starting a pattern with `%` can prevent a normal B-tree index from narrowing the scan

---

### Query workflow and SQL review

- Bound parameters — keep SQL structure separate from runtime values through prepared-statement or framework placeholders, preserving correct typing and reusable statement structure
- Query construction from a business question — decide the result grain first, then identify tables, join paths, filters, grouping, and ordering before writing syntax
- Incremental query debugging — inspect a small sample after each join, filter, and aggregation, and predict the expected row count so errors are found where they enter
- Report-total verification — compare complex report totals with simpler control queries at the intended grain before trusting the result
- Join-review failures — detect accidental Cartesian products, incorrect cardinality, and `DISTINCT` used to hide row multiplication
- Predicate-review failures — detect `NULL` comparisons, unsafe value interpolation, and date ranges that omit boundary rows
- Mutation-review failures — detect unbounded `UPDATE` or `DELETE` statements and verify the intended affected-row set before execution
- Pagination-review failures — require deterministic ordering and recognise when large `OFFSET` values make a different pagination strategy necessary
## Git

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from the projects. Focus on daily workflow, team collaboration, and the concepts that come up in code reviews and interviews.

### Core workflow

- `init`, `clone` — `init` starts a repo from scratch locally; `clone` downloads an existing remote repo; interviewers ask: "how would you start working on this project on a new machine?" (answer: clone, not init)
- The three areas — working directory, staging area, repository; interviewers ask "what is the staging area for?" — it exists so you can commit part of your changes, not everything at once
- `add`, `commit` — staging specific files and saving a snapshot; a common question is "why do you stage before committing?" and "what is the difference between `git add .` and `git add filename`?"
- `push`, `pull`, `fetch` — `push` sends commits to the remote; `pull` downloads and merges; `fetch` downloads without merging; interviewers ask the pull vs fetch difference every time
- `status`, `log --oneline`, `diff --staged` — essential inspection commands; `diff --staged` shows what will go into the next commit (not what is just modified); `log --oneline` is the standard compact view
- `git log` flags (`--graph`, `--all`, `--author`, `filename`) — reading the full history of a project; interviewers may show a branched log and ask to explain it; `--graph --all` makes the branch structure visible
- `git show <commit>` — displays the full diff of one specific commit; the fast way to answer "what exactly did this commit change?" without scrolling through `git log -p`; used constantly when explaining your own commit history in a technical interview
- `git blame` — shows who last modified each line of a file and in which commit; used to find context for unfamiliar code; interviewers ask "how do you find out when this line was added and by whom?"

### Branching and HEAD

- `HEAD` pointer — marks the currently checked-out commit, usually through the current branch name;
  in detached HEAD it points directly to a commit that may not be a branch tip
- `HEAD~1`, `HEAD~2` notation — "one commit before HEAD", "two commits before HEAD"; used in `git reset HEAD~1` and `git rebase -i HEAD~3`; interviewers show a reset or rebase command and ask "what does this do?"
- Detached HEAD — happens when you checkout a specific commit ID instead of a branch; new commits are not attached to any branch and can be lost; fix with `git checkout -b new-branch-name`
- `branch`, `checkout`, `switch` — creating and switching branches; `switch` is the modern alternative to `checkout` for branches (Git 2.23+); interviewers may ask which you prefer and why
- `git branch -d` vs `git branch -D` — `-d` is a safe delete (fails if the branch has unmerged changes); `-D` is a force delete; interviewers ask "what happens if you try to delete a branch that hasn't been merged?"
- Branch naming conventions — `feat/`, `fix/`, `technology/##-project-name`; tested in team process questions: "how do you organise branches in a team?"
- `merge` — joins branches; creates a merge commit when both branches have advanced since they split; the merge commit has two parents and preserves the full history
- Fast-forward merge vs three-way merge — fast-forward: pointer just moves forward (no divergence, no extra commit); three-way: both branches have new commits, so Git creates a merge commit with two parents; interviewers ask when each one happens
- `git cherry-pick` — applies a specific commit from another branch onto the current one; used to apply a hotfix to main without merging the whole feature branch; use sparingly — it duplicates commits and can confuse the history

### Rebase

- What `rebase` does — replays your commits on top of another branch as if you had started from there; the rebased commits get new IDs; result is a linear history with no merge commit
- `rebase` vs `merge` — rebase gives a cleaner, linear history; merge preserves exactly when branches diverged; teams pick one convention and stick to it; interviewers ask "what does your team use and why?"
- The golden rule of rebase — never rebase a branch that other people are working on; rebasing rewrites commit IDs — anyone who pulled those commits will have a broken history
- `git rebase -i` (interactive rebase) — opens an editor to squash, reword, reorder, or drop commits; the standard way to clean up a messy local history before opening a PR; only safe on commits not yet pushed
- Resolving a conflict during rebase — Git pauses on the first conflicting commit instead of stopping the whole operation; fix the file, `git add`, then `git rebase --continue` to move to the next commit, or `git rebase --abort` to cancel and return to the state before the rebase started; interviewers ask this to check you understand rebase replays commits one at a time, unlike a merge conflict which happens once
- `git merge --abort` vs `git rebase --abort` — both cancel the operation in progress and restore the pre-operation state; the names mirror each other but apply to different commands; interviewers ask "what do you do if a merge or rebase goes wrong halfway through?" expecting you to know the matching abort command exists for each

### Remote and collaboration

- `remote`, `origin` — `origin` is the default alias for the remote URL; every `push` and `pull` uses it; interviewers ask "what is origin?" — the answer is an alias for the remote URL, not a branch name
- `git push -u` (upstream tracking) — `-u` links your local branch to the remote branch; after setting it once, `git push` alone works; interviewers ask "what does the `-u` flag do?"
- Pull requests — a request to merge a branch with a description of what changed and why; the place for code review before changes reach main; the merge does not happen automatically
- PR description format — `## Changes` lists what changed; `## Why` explains the main decision; must make sense to someone who has not read the code; this is documentation that lives permanently with the commit history
- PR merge strategies — squash (all PR commits become one), merge commit (full PR history preserved), rebase merge (replays commits linearly, no merge commit); interviewers ask "what merge strategy does your team use and why?"
- Code review — checking that the code does what the PR says, handles edge cases, is readable, has no obvious security issues, and includes tests; even in solo projects, reading your own diff before merging catches bugs

### Merge conflicts

- What causes a conflict — two branches modify the same line of the same file; Git stops the merge and asks you to decide which version to keep; conflicts are not errors, they are Git asking for a human decision
- Conflict markers (`<<<<`, `====`, `>>>>`) — `<<<< HEAD` is your version; `>>>> branch-name` is the incoming version; `====` is the separator; you delete all three markers after choosing the final version
- `git merge --abort` — cancels an in-progress merge and returns to the state before you ran `git merge`; use when the conflicts are too complex to resolve right now
- Avoiding conflicts — pull from the target branch frequently; keep feature branches short-lived; communicate with teammates about which files each person is touching

### Stash

- `git stash`, `git stash pop` — saves uncommitted changes to a temporary stack so you can switch branches without committing unfinished work; `pop` restores and removes the stash from the list
- `git stash apply` vs `git stash pop` — `apply` restores the stash but keeps it in the list; `pop` restores and deletes it; interviewers ask the difference when you say you use stash regularly
- `git stash list` — shows all saved stashes with an index and name; important when you have multiple stashes and need to restore a specific one with `git stash pop stash@{1}`

### Undoing changes

- `git restore` — discards changes in the working directory without touching history; `--staged` unstages a file; the safe everyday tool for "I changed this but I don't want to keep it"
- `git reset --soft` vs `--mixed` vs `--hard` — soft: undo commit, keep changes staged; mixed: undo commit, keep changes unstaged; hard: undo commit and discard changes permanently; `--hard` causes data loss
- The reset rule — only use `git reset` on commits that have NOT been pushed to GitHub; if the commit is already on the remote, use `git revert` instead; breaking this rule causes problems for everyone who pulled
- `git revert` — creates a new commit that undoes a previous one; the original commit stays visible in the history; safe on shared branches because it does not rewrite history
- `git reset` vs `git revert` — reset rewrites history (local only, before push); revert creates a new commit (safe on shared branches, after push); interviewers ask this pair specifically and consistently
- `git reflog` — records recent local ref movements and can recover commits after a reset; retention
  is configurable and unreachable entries commonly expire sooner than reachable ones, so it is a
  recovery opportunity rather than a 90-day guarantee

### .gitignore

- What it does — tells Git to never track specific files; files listed here never appear in `git status`, never get staged, and never get committed
- Common entries: `node_modules/`, `target/`, `.env`, `.angular/`, `*.class` — what each ignores and why it must not be committed; interviewers ask "why is `.env` in `.gitignore`?" (security — it contains API keys and secrets that must never be pushed)
- `git rm --cached` — stops tracking a file that was already committed by mistake; the file stays on disk but Git stops watching it; the correct command after you realise `.env` was committed before `.gitignore` was created
- Creating `.gitignore` before the first commit — if you add a file to `.gitignore` after it was already committed, Git keeps tracking it; you must use `git rm --cached` first to stop tracking it

### Commit quality

- Conventional Commits format — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`, `perf:`; the standard in professional teams; interviewers ask "how do you write a commit message?" — they expect this format, not "fixed bug"
- Atomic commits — one logical change per commit; interviewers ask "what does atomic mean?" — one commit = one thing that can be reverted independently; the opposite is a commit that mixes five unrelated changes
- Good commit message — present tense, explains WHY not what, short; the history must be readable without the code; interviewers ask "show me a commit from your project and explain why you wrote it that way"

---

## General

Cross-cutting concepts that appear in interviews regardless of the stack. These come up at every stage: the HR call, the technical test review, and the live technical interview. Every item must be explainable with a real example from a project.

### HTTP methods and request structure

- HTTP methods — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`: each expresses the intent of the request; interviewers ask you to choose the right method for a given scenario and justify it (e.g. why POST for login, why PUT vs PATCH for an update endpoint)
- `PUT` vs `PATCH` — PUT replaces the entire resource; PATCH updates only the specified fields; the most common confusable pair in REST API discussions; asked in every technical interview that touches a REST endpoint
- Idempotency — repeating an idempotent request has the same intended effect as sending it once;
  HTTP defines `GET`, `PUT`, and `DELETE` as idempotent, while `POST` has no idempotency guarantee
  unless the application deliberately adds one
- Headers — `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format; `Accept` specifies the expected response format; interviewers ask which header is used for authentication and what happens if you omit `Content-Type`
- Path parameters vs query parameters vs request body — path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update; interviewers ask you to choose the right placement for a given field
- HTTPS vs HTTP — TLS encrypts the connection so headers and body (including the JWT) cannot be read in transit; required for any API that handles passwords or tokens; interviewers ask why you would never send a password over plain HTTP
- Request/response lifecycle — Angular component → HTTP interceptor → browser → Spring Security filter chain → controller → service → repository → response travels back; interviewers ask you to trace a login request end-to-end to test architectural understanding

### HTTP status codes

- 2xx success codes — `200 OK` for a successful read or update, `201 Created` after a POST that creates a resource, `204 No Content` after a DELETE (success but no body); interviewers ask which to use after each HTTP method and why 201 is not the default for every POST
- `400 Bad Request` — the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails; shows you understand the difference between a client error and a server error
- `401 Unauthorized` vs `403 Forbidden` — 401 means unauthenticated (no token or invalid token); 403 means authenticated but not allowed (wrong role); the most common confusable pair in security discussions
- `404 Not Found` vs `409 Conflict` — 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email, name already taken); shows semantic awareness beyond just 400 and 500
- `500 Internal Server Error` — the server encountered an unexpected failure; global error handling
  should format and log it consistently, not disguise every genuine server fault as a client error

### JSON and serialization

- JSON data types — objects `{}`, arrays `[]`, strings, numbers, booleans, null; keys must be double-quoted strings; no trailing commas; tested when debugging a `400` caused by malformed JSON
- Jackson — Spring Boot uses Jackson automatically to convert between JSON and Java objects; `@RestController` triggers automatic serialization without any configuration; interviewers ask how Spring Boot "knows" to return JSON
- `@JsonProperty` — maps a JSON key to a Java field with a different name; necessary when the API contract uses snake_case (`user_name`) but the Java class uses camelCase (`userName`)
- `JSON.parse()` vs `JSON.stringify()` — `stringify` converts a JavaScript object to a JSON string; `parse` converts it back; only needed for `localStorage`, never for `HttpClient` calls (Angular handles JSON automatically); confusing them leads to storing `[object Object]` in localStorage

### Error handling

- Local error recovery — a caller may replace a failed operation with a fallback only when that
  fallback is semantically honest; silently converting every failure into empty data fabricates success
- HTTP interceptor for global errors — the right place to handle 401 (expired token → redirect to login) and network failures; one interceptor replaces `catchError` in every service for these global concerns
- `catchError` in service vs interceptor — service-level handles specific, local failures; interceptor handles global concerns (token expiry, network outage); interviewers ask which approach you would use for a given scenario and why
- `@ControllerAdvice` + `@ExceptionHandler` — maps custom exceptions to HTTP status codes in one class; the Spring Boot equivalent of Angular's error interceptor; without it, every unhandled exception returns a generic 500 with no useful message for the client
- Error propagation — throw errors upward and handle them once at the outermost layer; never swallow an exception silently without at least logging it; catching and re-throwing without adding information hides the root cause

### Software testing

- Unit test — verifies one unit of behaviour through a small boundary; collaborators may be real,
  stubbed, faked, or mocked depending on what keeps the test focused
- Integration test — verifies selected real components working together; it may load part or all of
  an application and may use real or controlled infrastructure depending on the boundary under test
- End-to-end (E2E) test — tests the full user flow through a real browser; the slowest and the fewest; covers only the most critical user journeys
- Testing pyramid — a heuristic that favours many fast focused tests and fewer expensive broad tests;
  it communicates trade-offs, not a universal numeric ratio
- Mock vs stub — a mock is a fake dependency you can configure and verify (check how it was called afterwards); a stub just returns a fixed value with no verification; in practice "mock" is used for both; Mockito handles both in Java
- Jasmine + TestBed — the standard tools for Angular service tests and component tests; `TestBed` creates a minimal Angular module for testing without a real browser

### Browser storage

- `localStorage` — persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript, which makes it vulnerable to XSS token theft
- `sessionStorage` — cleared when the tab closes; not shared between tabs; same API as `localStorage`; used for temporary state that should not survive a browser restart
- Cookies — sent automatically with matching requests; `HttpOnly` blocks JavaScript access,
  `Secure` restricts transport to HTTPS, and `SameSite` mitigates cross-site requests without being a
  universal replacement for CSRF protection

### Environment variables

- Why secrets must never be committed — a committed secret is permanently visible in git history even after deletion; it must be treated as compromised and rotated immediately; tested in every project review that handles tokens or API keys
- `${VAR_NAME}` in `application.properties` — Spring Boot reads the environment variable at startup and substitutes the value; `@Value("${app.jwt.secret}")` injects the resolved value into a class field
- Fail-fast on missing variables — if a required variable is not set and has no default value, Spring Boot fails at startup with a clear error instead of a `NullPointerException` at runtime; this is intentional — fail early and loudly
- `.env.example` — documents which variables are required without exposing real values; safe to commit; the real secrets live in OS environment variables, IntelliJ run configuration, or a secret manager — never in a committed file

### Containerisation (Docker)

- What a container is — a lightweight, isolated process that bundles the app with its exact runtime and dependencies so it behaves the same on every machine; interviewers ask "what problem does Docker solve?" and expect the "works on my machine" answer, not a recital of virtualisation theory
- Container vs virtual machine — a container shares the host OS kernel and starts in milliseconds; a VM ships a whole guest OS and is far heavier; interviewers ask the difference to check you understand why containers, not VMs, became the standard for shipping services
- Image vs container — an image is the immutable blueprint built from a `Dockerfile`; a container is a running instance of that image; the most common Docker confusable pair, asked the same way as "class vs object"
- `Dockerfile` — the recipe that builds an image step by step (base image, copy the build artifact, set the entry point); interviewers ask what each instruction does and why each line becomes a cached layer
- `docker-compose up` — starts every service declared in `docker-compose.yml` (e.g. Spring Boot + PostgreSQL) with one command and one network; interviewers ask "how does a new developer run your project without installing PostgreSQL by hand?" — this is the expected answer
- Environment variables in Compose — config and secrets (DB URL, JWT secret) are passed to the container through the `environment` block or an `.env` file, never baked into the image; interviewers ask how you keep credentials out of an image that may be shared or pushed to a registry
- Why containerisation matters in a consultancy — identical environments across dev, CI, and production remove a whole class of "it ran locally" deployment bugs; in 2026 large Spanish consultancies treat basic Docker fluency as a baseline expectation, so not being able to explain `docker-compose up` reads as behind

### Base64

- Base64 is not encryption — it is reversible text encoding for binary data using 64 printable characters; anyone can decode it in one step; interviewers ask this specifically to catch candidates who confuse encoding with security
- `btoa()` / `atob()` — browser functions for basic Base64 text conversion; they do not add
  confidentiality or integrity and have Unicode limitations that production code must handle
- Text encoding vs binary encoding — UTF-8 maps characters to bytes while Base64 maps bytes to safe
  text; confusing these layers produces corrupted non-ASCII data and false security assumptions

### Logging

- Why not `System.out.println()` / `console.log()` for debugging production code — print statements cannot be turned off, are not timestamped, and are lost once the terminal closes; interviewers ask "how would you debug an issue in a deployed app without a debugger attached?" — logs are the expected answer
- Log levels — `DEBUG` (detailed, dev only), `INFO` (normal events, e.g. "user logged in"), `WARN` (something unexpected but recoverable), `ERROR` (something failed); interviewers ask what level you would use for a caught exception that the app recovered from (`WARN`, not `ERROR`, if the request still succeeded)
- Logs vs exceptions in error handling — an exception interrupts the current operation and must be handled or propagated; a log is a side note that does not change control flow; interviewers ask why you would still log an exception even after it is already handled by `@RestControllerAdvice` (loses the stack trace otherwise — the client only sees a clean message, but the server needs the detail to debug)

### Code principles

- DRY — extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?" — the answer is extract, not copy
- KISS — the simplest solution that works is the right one; complexity is a cost that must be justified; interviewers probe this when they see overcomplicated junior code or bloated AI-generated boilerplate
- YAGNI — do not build features for hypothetical future requirements; adding pagination before it is needed, or building a plugin system for a feature with one implementation, are the classic examples; common in AI-generated code

### Agile and delivery awareness

- Scrum roles — Product Owner prioritises value, Scrum Master facilitates the framework, and
  Developers deliver the increment; interviewers expect recognition rather than certification detail
- Sprint and increment — a sprint is a fixed iteration and the increment is the usable result that
  meets the Definition of Done
- Planning, daily Scrum, review, and retrospective — each event has a distinct purpose: select work,
  inspect progress, inspect the product, and improve the process
- User story and acceptance criteria — the story expresses user value while acceptance criteria make
  the behaviour testable; they are not interchangeable with implementation tasks
- Definition of Done — a shared quality gate such as reviewed, tested, integrated, and deployable;
  it prevents each person from using a private meaning of “finished”
- CI/CD awareness — continuous integration builds and tests small merged changes; continuous delivery
  keeps a releasable artefact, while deployment automation is a later operational depth
- Cloud awareness — AWS or Azure provides managed compute, storage, networking, and databases;
  junior coverage is recognising the deployment model, not designing cloud infrastructure

---
