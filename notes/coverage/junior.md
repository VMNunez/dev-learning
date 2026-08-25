# Global Junior Coverage — All Topics

Combined junior hiring coverage for every topic in the notes folder.
Source files: one `coverage/junior.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
Order follows study priority: Angular → Angular Material → Spring → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

### Components and template data flow

- Standalone `@Component` — explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies ✅ 01-todo-list
- Component `imports` — identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure ✅ 01-todo-list
- Interpolation vs property binding — distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]` ✅ 01-todo-list
- Event binding — handle a template event with `()` and explain why the template delegates behaviour to the component class ✅ 01-todo-list
- Two-way binding — recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- `input()` — receive optional parent-to-child data and handle its absence explicitly instead of hiding it behind a default that reads as real data ✅ 02-weather-app
- `input.required()` — declare mandatory parent-to-child data so a missing value fails at the template boundary rather than as an undefined read later ✅ 01-todo-list
- `output()` — send typed child events to a parent without making the child depend on the parent's implementation ✅ 01-todo-list
- `@if` — branch on a condition so mutually exclusive UI states stay readable instead of being hidden with CSS ✅ 01-todo-list
- `@switch` — express a value's known variants as fixed cases instead of chaining conditions that repeat the same subject
- `@for` and `track` — render collections with stable identity so Angular can reuse DOM nodes instead of recreating them ✅ 01-todo-list
- Template reference variables — capture a template element, directive, or component instance for a local interaction without turning it into application state ✅ 01-todo-list
- Safe navigation and nullish template values — render data that may not exist yet without hiding an invalid domain assumption behind broad non-null assertions ✅ 03-expense-tracker
- Content projection with `ng-content` — recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs
- Components vs attribute directives — use a component when behaviour owns a view and a directive when behaviour augments an existing host element
- Custom attribute directives and host interaction — implement reusable host-element behaviour and connect host properties or events through directive host bindings and listeners without taking ownership of the element's view
- Conditional class and style binding — use focused class and style bindings for dynamic presentation and recognise `ngClass` or `ngStyle` when maintained templates apply several values together ✅ 01-todo-list

### Application bootstrap and component styles

- `bootstrapApplication()` — identify the standalone root component and the application-level providers that start a modern Angular application ✅ 01-todo-list
- Application provider boundary — register application-wide capabilities at bootstrap rather than scattering their providers through component scopes ✅ 01-todo-list
- `styleUrl`/`styleUrls` vs inline `styles` — locate a component's styles and choose external files or small inline rules without confusing either form with global CSS ✅ 01-todo-list
- View encapsulation — explain how Angular scopes emulated component styles with generated attributes and why a component rule does not normally style a child component's internal elements ✅ 01-todo-list
- `:host` selector — target the component host from its own stylesheet when the custom element itself needs layout or state styling ✅ 06-hr-portal
- Global vs component styles — keep application-wide rules and library overrides at the global boundary while leaving component-specific presentation with its component ✅ 01-todo-list
- `::ng-deep` recognition — recognise the deprecated encapsulation escape hatch in maintained code and prefer supported library APIs, global rules, or explicit styling boundaries for new work

### Lifecycle and dependency injection

- Angular dependency injection — explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves ✅ 01-todo-list
- `@Injectable({ providedIn: 'root' })` — recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton ✅ 01-todo-list
- `inject()` — obtain a dependency in an injection context without a constructor parameter, the style current Angular code prefers ✅ 01-todo-list
- Constructor injection — read and write the parameter-based style still common in maintained code, without confusing construction with lifecycle work
- Provider scope — distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- `InjectionToken` — inject typed configuration or other non-class dependencies through a token rather than a class type ✅ 05-task-manager
- Configured provider recipes — recognise `useValue`, `useClass`, `useFactory`, and `useExisting`, including that `useExisting` aliases an existing provider rather than creating another class instance
- `constructor` vs `ngOnInit` — reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs ✅ 02-weather-app
- `ngOnChanges` — react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- View queries and `ngAfterViewInit` — treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences ✅ 05-task-manager
- Destruction cleanup — tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view ✅ 02-weather-app

### Signals and local state

- `signal()` — hold reactive local or service state and read it by calling the signal rather than treating it as a plain value ✅ 01-todo-list
- `set()` vs `update()` — replace state directly or derive the next immutable value from the previous one ✅ 01-todo-list
- `computed()` — derive read-only state from signals so the value stays consistent without manual synchronisation ✅ 01-todo-list
- `effect()` — perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state ✅ 04-meal-finder
- `computed()` vs `effect()` — choose a returned derived value for UI state and an effect only for synchronisation with an external system ✅ 04-meal-finder
- Signal reference vs snapshot — preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot ✅ 01-todo-list
- Immutable updates with signals — replace object or array references so state changes remain predictable across signals and `OnPush` views ✅ 01-todo-list
- `signal()` vs `computed()` — keep writable source state in a signal and expose read-only derivations through a computed signal ✅ 01-todo-list

### HTTP integration

- `provideHttpClient()` and its feature functions — enable `HttpClient` application-wide at bootstrap and opt into behaviour such as the Fetch backend or interceptors through explicit `with...()` features instead of separate providers ✅ 02-weather-app
- Typed `HttpClient` requests — call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON ✅ 02-weather-app
- `HttpParams` immutability — build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- Cold HTTP Observables — recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls
- Remote UI states — represent loading, empty, error, and success explicitly so a page does not treat a successful response as its only possible state ✅ 02-weather-app

### RxJS streams and pipelines

- `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams according to source behaviour ✅ 02-weather-app

- `Observable` vs `Promise` — compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- `Observable` vs `Subject` — distinguish a declarative subscribable stream from a subject that can be imperatively fed and multicast, rather than using a subject as the default state container
- `subscribe()` callbacks — handle next and error outcomes deliberately and keep presentation state consistent after a failed request ✅ 02-weather-app
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
- Subscription cleanup — use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete ✅ 02-weather-app
- `toSignal()` vs manual subscription — expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects

### Routing and cross-cutting HTTP behaviour

- Router bootstrap and outlet — register routing with `provideRouter` and give routed components a rendering location with `RouterOutlet` ✅ 01-todo-list
- Route definitions and `routerLink` — map paths to components and move between them declaratively so the application becomes navigable ✅ 03-expense-tracker
- Child routes and nested outlets — model a feature's route hierarchy so its shared layout remains mounted while child content changes
- `ActivatedRoute` route params — read route identity from `paramMap` so a routed component knows which resource it is showing ✅ 04-meal-finder
- `ActivatedRoute` query params — read optional Angular view filters from `queryParamMap` without making them part of the resource path ✅ 06-hr-portal
- `[queryParams]` on `routerLink` — set optional view state on the destination URL while navigating declaratively so the resulting page stays linkable and reproducible ✅ 06-hr-portal
- `ActivatedRoute.snapshot` vs observable params — use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes ✅ 04-meal-finder
- Lazy route loading — use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it ✅ 06-hr-portal
- `loadComponent` vs `loadChildren` — lazy-load one routed component or an entire child route tree according to the feature boundary
- Declarative vs programmatic navigation — use `routerLink` in templates and `Router.navigate()` when component logic determines the destination ✅ 03-expense-tracker
- Browser history navigation — return to the previous entry through `Location` when a page is reachable from several routes, instead of hardcoding one destination that is wrong for every other caller ✅ 06-hr-portal
- Wildcard routes and redirect order — place a `**` fallback last because Angular uses first-match-wins route evaluation ✅ 06-hr-portal
- Redirect `pathMatch` — use `pathMatch: 'full'` for an empty-path redirect when prefix matching would otherwise catch every URL ✅ 06-hr-portal
- `CanActivateFn` guards — return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect ✅ 06-hr-portal
- Stacked route guards — compose several guards on one route and recognise that every one must allow activation, which keeps authentication and authorisation as separate reusable checks ✅ 06-hr-portal
- Route guards vs backend authorisation — treat guards as client-side navigation control, never as enforcement of data access
- `CanDeactivateFn` guards — protect unsaved form state while recognising that browser or process termination may bypass application navigation ✅ 06-hr-portal
- Functional HTTP interceptors — centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop ✅ 06-hr-portal
- Immutable interceptor requests — clone an `HttpRequest` before changing headers or other request properties because interceptor inputs are immutable ✅ 06-hr-portal
- `HttpErrorResponse` — inspect status and error payload while distinguishing a backend error response from a client-side or network failure

### Reactive forms and template transformation

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

### Change detection

- Default change detection and Zone.js awareness — explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- `OnPush` change detection — recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- Signals with `OnPush` — explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- Production-build verification — run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server
- Build-time configuration vs frontend secrets — configure public environment-dependent values at build or deployment time while recognising that anything shipped to the browser can be read by a user ✅ 02-weather-app
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

## Angular Material

### Setup and component model

- Angular Material, Material Design, and the CDK — distinguish the styled Angular component library, the design system it implements, and the lower-level behaviour primitives it builds upon ✅ 05-task-manager
- `ng add @angular/material` — use the library schematic to install Material and the CDK and apply the selected animation, typography, and theme setup ✅ 05-task-manager
- Material-specific imports and providers — recognise which components need a template import and which features, such as date handling, also need a provider ✅ 06-hr-portal
- Material composition boundary — combine Material interaction primitives with ordinary Angular state, forms, templates, and CSS instead of treating the library as page architecture ✅ 05-task-manager
- Version-matched documentation and migrations — consult the docs for the installed Angular Material major version and use official update tooling instead of copying obsolete selectors or theming APIs

### Theming and styling boundaries

- Prebuilt vs custom themes — choose a prebuilt theme for fast setup or a Sass theme when the product needs controlled colour, typography, or density
- Theme application — recognise that a Material theme controls colour, typography, and density, and ensure the application emits the required core and component styles once ✅ 05-task-manager
- `mat.theme()` — apply a supported Material 3 theme without depending on the generated component DOM ✅ 05-task-manager
- Supported theming vs internal selectors — prefer theme tokens, mixins, and public host classes because internal DOM and CSS classes are private and may change between releases
- Page layout vs component theming — use application CSS for layout, spacing, and responsive composition while using Material APIs for component internals ✅ 05-task-manager
- Overlay styling boundary — recognise that dialogs, menus, selects, tooltips, and snack bars render in an overlay container outside the opener's component subtree ✅ 05-task-manager

### Buttons, icons, menus, and tooltips

- Material button variants — choose a visually prominent button for the primary action and lower-emphasis variants for secondary or tertiary actions ✅ 05-task-manager
- Icon buttons and accessible names — pair `matIconButton` actions with an `aria-label` or equivalent name because an icon or tooltip alone is not a reliable accessible label
- FAB vs ordinary button — reserve `matFab` or `matMiniFab` for a dominant screen-level action rather than every positive action
- `mat-icon` and icon fonts — understand that the component renders an icon name from a loaded icon font or registered SVG set rather than bundling every icon automatically ✅ 05-task-manager
- `mat-menu` composition — connect a trigger to a menu reference and use labelled menu items when several contextual actions should not remain inline
- Menu vs select — use a menu to invoke commands and a select to choose a value owned by a form or application state
- Tooltip purpose — use `matTooltip` for short supplementary help on hover or focus, never as the only name or as a container for essential instructions

### Form-field composition and selection controls

- `mat-form-field` composition — combine a compatible control with its label, hint, prefix or suffix, and error presentation while Angular forms remain the state authority ✅ 05-task-manager
- `matInput` — enhance a native input or textarea inside a form field while preserving its native value, type, and form semantics ✅ 05-task-manager
- `mat-label` and `mat-error` — distinguish identification of a control from conditional validation feedback shown under the field ✅ 05-task-manager
- `mat-hint` — attach persistent guidance to a form field without confusing it with a validation error
- Material controls with reactive forms — bind controls through `formControl` or `formControlName` and avoid a second source of truth through parallel value bindings ✅ 05-task-manager
- Error-state timing — understand when Material displays form-field errors and connect that presentation to the form's validity and interaction or submission policy ✅ 05-task-manager
- `mat-select` and `mat-option` — model single or multiple selection with values whose types match the form control and distinguish literal attributes from property bindings ✅ 05-task-manager
- Material select vs native select — choose `mat-select` for Material-specific presentation and a native `<select matNativeControl>` when native accessibility, performance, or platform behaviour is the better fit
- Select vs autocomplete — use a select for a closed choice set and `mat-autocomplete` when users type into an input and choose from matching suggestions
- Basic `mat-autocomplete` — connect an input to a local option panel and distinguish the displayed label from the stored object or identifier
- Selection events vs form values — react to `selectionChange` only for side effects and read the form control for the authoritative selected value ✅ 05-task-manager
- `mat-optgroup` — group a long option set semantically without pretending group labels are selectable values
- Checkbox, radio, and select choice — use checkboxes for independent booleans or multi-select, radio buttons for a small visible single-choice set, and a select when compactness or option count warrants it
- Checkbox vs slide toggle — use a checkbox for selection or confirmation and `mat-slide-toggle` for a boolean setting whose change is presented as immediately active
- Checkbox indeterminate state — represent partial aggregate selection visually without confusing it with a third submitted boolean value
- Datepicker composition — connect the input, toggle, picker reference, and a configured date adapter as one control ✅ 06-hr-portal
- Date-adapter compatibility — keep the datepicker control value compatible with its configured `DateAdapter` rather than hiding a representation mismatch with type assertions
- Datepicker selectable-date constraints — use `min`, `max`, and `matDatepickerFilter` to declare which dates the calendar and the input will accept ✅ 06-hr-portal
- Datepicker validation feedback — surface the validation errors those constraints produce instead of letting an out-of-range value fail only after submission

### Tables, sorting, filtering, and pagination

- Material table structure — connect column definitions, header and cell templates, displayed column order, and header/data row definitions through matching column identifiers ✅ 05-task-manager
- `matColumnDef` identity — keep the column ID consistent with `displayedColumns` and configure an accessor when the displayed value does not map directly to a row property ✅ 05-task-manager
- Header and cell definition roles — use `matHeaderCellDef` for column labels and `matCellDef` for per-row values rather than mixing structural and data concerns ✅ 05-task-manager
- Table refresh after collection changes — assign or emit a new data array, or call `renderRows()` after mutating a raw array, because `mat-table` does not observe in-place structural changes automatically ✅ 05-task-manager
- Empty table state — use `matNoDataRow` or an equivalent full-width row only after distinguishing an empty successful result from loading and failure ✅ 05-task-manager
- Table data-source choices — choose a plain array, observable/custom `DataSource`, or `MatTableDataSource` according to who owns retrieval, transformation, and lifecycle ✅ 05-task-manager
- `MatTableDataSource` scope — use the convenience class for simple client-side sorting, filtering, and pagination, not as a server-side data-access abstraction ✅ 05-task-manager
- Sort integration — connect `MatSort` after the view exists, mark only sortable headers, and handle nested or derived values through a sorting accessor or server query ✅ 05-task-manager
- Paginator integration — connect `MatPaginator` for client data or translate page events into backend parameters without paginating the same result twice ✅ 05-task-manager
- Server-side paginator state — bind `length` to the backend's total matching count and treat `pageIndex` and `pageSize` as request state so the controls remain correct when only one page of rows is loaded
- Filter semantics — define which fields and normalisation rules filtering uses instead of assuming the default row stringification matches the product ✅ 05-task-manager
- Reset pagination after filtering — return to a valid first page when a narrower client-side filter can make the current page empty
- Table row actions — keep row identity explicit so a per-row control operates on the record it belongs to ✅ 06-hr-portal
- Nested interactive controls in rows — prevent action buttons inside a row from accidentally triggering row selection or navigation
- Client-side vs server-side table operations — let `MatTableDataSource` transform an in-memory collection or translate sort, filter, and page events into backend queries, never both for the same dataset

### Dialogs and confirmation flows

- `MatDialog` and `MatDialogRef` — open overlay content from the caller and control its lifecycle and result through the returned reference ✅ 05-task-manager
- Dialog component input — use `MAT_DIALOG_DATA` for an explicit, typed input boundary rather than reaching into caller state ✅ 05-task-manager
- Dialog result channel — close with an explicit typed result and consume `afterClosed()` so the caller distinguishes success, cancellation, and dismissal ✅ 05-task-manager
- Confirm/cancel semantics — perform destructive work only after an affirmative result and treat backdrop, Escape, and cancel-button dismissal consistently ✅ 05-task-manager
- Default dismissal vs `disableClose` — preserve backdrop and Escape dismissal by default and disable them only when the interaction has a justified alternative exit because dialogs are expected to remain keyboard operable ✅ 06-hr-portal
- Dialog content structure — keep title, content, and actions as sibling regions so layout, scrolling, labelling, and action placement remain correct ✅ 05-task-manager
- Declarative vs programmatic closing — use `mat-dialog-close` for simple results and a handler when validation, unsaved changes, or asynchronous work must run before closing ✅ 05-task-manager
- Dialog focus management — preserve an accessible name, focus trap, sensible initial focus, focus restoration, and Escape behaviour unless a justified accessible alternative exists
- Dialog viewport constraints — use width and maximum-size configuration so overlay content remains usable without overflowing small viewports

### Feedback, loading, and progress

- Snack bar vs dialog — use a snack bar for brief non-blocking feedback and a dialog for focused input or a decision that requires interaction ✅ 06-hr-portal
- `MatSnackBar.open()` lifecycle — provide concise content and ensure the feature imports the snack-bar API it uses ✅ 06-hr-portal
- Timed vs actionable snack bars — auto-dismiss informational feedback after a suitable duration but keep an action available long enough for the user to perceive and operate it ✅ 06-hr-portal
- Progress spinner vs progress bar — choose a spinner for local indeterminate waiting, an indeterminate bar for page or section activity, and a determinate bar only when a real percentage exists

### Navigation and information containers

- Toolbar composition — use `mat-toolbar` for persistent application-level actions and ordinary flex layout to position its content ✅ 06-hr-portal
- Sidenav structure — compose `mat-sidenav-container`, `mat-sidenav`, and `mat-sidenav-content` so the drawer and main content share the required layout context ✅ 06-hr-portal
- Sidenav modes — choose `side`, `push`, or `over` according to available space and whether content should resize, shift, or sit behind an overlay
- Navigation lists and active state — use `mat-nav-list` and Material list items for navigation while Angular Router remains responsible for navigation and route activity ✅ 06-hr-portal
- Tabs vs route navigation — use `mat-tab-group` for related in-page views and routes for destinations that need navigation history, deep links, or independent URLs
- Card structure and appearance — group related content with optional header, content, and actions and choose raised or outlined emphasis consistently ✅ 06-hr-portal
- Stepper linear flow — pair `linear` with step controls so validity governs progression rather than relying only on button handlers ✅ 06-hr-portal

### Accessibility, responsiveness, and testing

- Built-in accessibility vs application responsibility — rely on supported Material semantics and keyboard behaviour while still providing labels, logical focus order, and meaningful state communication ✅ 05-task-manager
- Responsive Material composition — adapt sidenav mode, dialog dimensions, action density, and wide-table presentation because Material components do not make a page responsive automatically
- Material component harnesses — test supported user-visible behaviour through stable harness APIs instead of querying private DOM structure or CSS classes
- Harness interaction tests — use component-specific harness methods to verify critical validation feedback, dialog results, and table interactions rather than snapshotting generated markup

## Spring

### Container and bean registration

- Inversion of Control and dependency injection — the container creates and connects application objects so classes declare collaborators instead of locating or constructing infrastructure themselves
- `ApplicationContext` and the IoC container — recognise the runtime registry that holds bean definitions, creates managed objects, resolves dependencies, and publishes framework services
- Bean vs ordinary object — Spring lifecycle, injection, scopes, and proxy-backed annotations apply only to objects obtained from the container, not to instances created with `new`
- Component stereotypes — use `@Component` and its layer-specific stereotypes to make application classes discoverable while keeping each layer's responsibility explicit ✅ 07-timetrack
- `@Repository` exception translation — with Spring's persistence-exception translation infrastructure, the stereotype lets provider-specific failures surface through the portable `DataAccessException` hierarchy ✅ 07-timetrack
- Component scanning — understand that scanning searches configured packages for candidate components, so a valid stereotype outside the scan boundary still produces a missing-bean failure
- `@Configuration` and `@Bean` — register third-party instances or explicit construction logic in Java configuration and use scanning for application-owned component classes ✅ 07-timetrack
- Bean names and type lookup — beans are normally resolved by type, while names become relevant when several candidates share that type or external integration refers to a bean explicitly
- Constructor injection — prefer it over field injection so dependencies are explicit, final, and easy to supply in tests; Spring infers injection when a component has one constructor ✅ 07-timetrack
- Lombok constructors and Spring injection — `@RequiredArgsConstructor` can express constructor injection for final dependencies, while an all-argument constructor is usually the wrong service boundary
- `@Autowired` requiredness — an autowired dependency is required by default; constructor inference removes the annotation, while `Optional`, `ObjectProvider`, or explicit requiredness changes absence semantics deliberately
- Collection injection — inject all beans of a type and know that empty resolution depends on the injection form: required fields or methods normally need a candidate, while a sole constructor or factory-method parameter may receive an empty collection
- `ObjectProvider<T>` — defer or optionally request a dependency when its availability or scope genuinely varies instead of hiding a required collaborator behind null
- `@Qualifier` vs `@Primary` — select one bean explicitly at an injection point or declare a default candidate when several beans satisfy the same dependency type
- Dependency resolution failures — distinguish no candidate, multiple candidates, and a dependency cycle before changing annotations at random
- Circular dependencies — treat a constructor cycle as a design signal that responsibilities or dependency direction need correction rather than hiding it with field injection

### Scope and lifecycle

- Singleton scope and stateless services — the default shares one bean instance across callers, so mutable request-specific state on a service can leak across users and threads
- Singleton bean scope vs Singleton pattern — Spring's scope means one managed instance per bean definition in a container, not a class-enforced global instance with a private constructor
- Prototype scope — the container creates a new instance each time that bean is requested, unlike the shared singleton default
- Web-aware request and session scopes — recognise per-request and per-session lifetimes so request-specific state is not placed on a shared singleton
- Scope vs thread safety — bean scope controls instance lifetime and sharing, while thread safety depends on how mutable state is accessed
- Eager singleton creation vs `@Lazy` — non-lazy singletons are normally pre-instantiated when the context refreshes, while lazy creation postpones construction, lifecycle work, and related failures until first use
- Bean lifecycle phases — follow instantiation, dependency injection, initialization callbacks, ready use, and destruction so a failure can be placed in the correct phase
- `@PostConstruct` and `@PreDestroy` — run lifecycle work after injection or before managed destruction without putting operational work in a constructor

### Proxies and AOP

- Cross-cutting concerns and AOP — apply behaviour such as transactions, security, caching, or logging around a method call without mixing that infrastructure policy into the method body
- Proxy-based annotation behaviour — Spring wraps eligible beans, so advice applies when a call crosses the proxy and silently does nothing on an unmanaged instance or self-invocation
- Self-invocation — a method calling another advised method on `this` bypasses the proxy, so moving the boundary or calling another bean is normally clearer than reaching for the proxy manually
- Proxy infrastructure activation — an annotation such as `@Transactional` or `@Validated` needs the matching Spring infrastructure; the annotation alone is inert in a bare context that has not enabled its processor

### Transaction abstraction

- `@Transactional` atomicity and rollback — group one business operation in a transaction and know that unchecked exceptions roll back by default while checked exceptions require an explicit rule ✅ 07-timetrack
- Spring's `@Transactional` vs the Jakarta annotation — two importable annotations with the same name use different attributes and integration semantics, so the import is part of the behaviour even though both normally roll back unchecked exceptions by default
- Transaction boundary placement — put the annotation on the externally invoked service method that spans the business operation, not on a controller, private helper, or isolated repository call ✅ 07-timetrack
- Method-level vs class-level `@Transactional` — a method annotation overrides class-level transaction metadata, so broad defaults belong on the class and exceptional boundaries stay explicit on methods
- Transactional proxy limitations — `new` instances, self-invocation, and non-proxy-eligible methods do not open the transaction the annotation appears to promise
- `@Transactional(readOnly = true)` — declare read intent so integrations may optimise work, without treating it as a portable guarantee that the database will reject writes ✅ 07-timetrack
- Caught exceptions and rollback — catching and suppressing an unchecked failure inside the advised method can let its proxy observe normal completion and commit remaining work
- Transaction propagation `REQUIRED` — recognise the default join-or-create behaviour so nested service calls participate in one boundary instead of assuming every annotation opens an independent transaction
- Transaction resource participation — a local Spring transaction covers only resources enlisted through its transaction-aware integrations; ordinary HTTP calls, files, or unenlisted messages do not roll back with the database

### Events, resources, and environment

- Spring application events vs external messaging — `ApplicationEventPublisher` notifies `@EventListener` methods in-process and synchronously by default; it provides neither broker durability nor cross-process delivery
- Spring `Resource` abstraction — read classpath, filesystem, and URL-backed content through one interface without assuming every resource is a normal file
- `Environment` and profiles — query active profiles and property sources as framework context while keeping environment-specific values outside business logic
- `@Profile` conditional bean registration — include a component or configuration only when its profile expression matches the active environment instead of branching inside business code
- Property placeholders vs Spring Expression Language in `@Value` — use `${...}` to resolve external properties and `#{...}` to evaluate Spring expressions, while preferring typed configuration binding when a cohesive settings group belongs to Boot configuration

### Validation integration

- Jakarta Validation vs Spring validation — Jakarta constraints describe bean rules, while Spring adapts validation into data binding, method interception, and web integration
- `@Valid` vs `@Validated` — standard `@Valid` triggers cascaded bean validation, while Spring's `@Validated` also selects validation groups and participates in method-validation integration
- Cascaded validation — nested objects require `@Valid` at the relationship boundary or their own constraints remain metadata that never runs
- Method validation through a proxy — constraints on service parameters or return values require the method-validation infrastructure and a call through the managed proxy
- Binding errors vs business-rule failures — structural conversion and validation belong at the input boundary, while repository-backed or actor-dependent invariants remain application logic

### Spring testing foundations

- Plain unit test vs Spring test context — instantiate a class directly when only its logic matters and load the container only when bean wiring or framework behaviour is the risk
- Spring TestContext Framework — build and cache an application context for tests while integrating lifecycle callbacks, profiles, properties, and dependency injection
- JUnit Jupiter TestContext integration — use `SpringExtension` or the composed `@SpringJUnitConfig` annotation so JUnit activates Spring's test lifecycle before `@ContextConfiguration` supplies the context definition
- `@ContextConfiguration` — declare the configuration classes or resources that a framework-level test context needs without loading a complete Boot application
- Test property and profile overrides — activate controlled configuration for a test without weakening production defaults or depending on a developer machine
- Transactional test rollback — a Spring-managed test transaction normally rolls back after each test, which isolates database state but can hide behaviour that occurs only at commit

### Maintained-code recognition

- Field and setter injection — recognise `@Autowired` on fields or setters in existing code and explain the hidden-dependency and testability trade-offs compared with constructor injection
- `@Autowired` vs `@Inject` vs `@Resource` — recognise Spring, Jakarta, and name-oriented legacy injection annotations while preferring one consistent constructor-injection style in new code
- XML bean definitions — read legacy `<bean>` and component-scan configuration as another source of bean definitions without making XML the default for new code
- `BeanFactory` vs `ApplicationContext` — recognise the lower-level bean factory contract while using the application context for events, resources, environment, and normal application integration
- `javax.*` vs `jakarta.*` validation and lifecycle imports — current Spring generations use Jakarta namespaces, while maintained code may still use the pre-migration packages

## Spring Boot

### Startup callbacks and diagnosis

- `CommandLineRunner` startup callback — run one-off work once after the context is fully built and every bean is available, instead of a constructor or static initialiser that fires before the application is ready; it runs on every boot, so the work must be idempotent ✅ 07-timetrack
- Startup diagnostics — read Boot's condition and failure-analysis output to distinguish configuration, bean creation, port, and datasource failures before changing code
- Application logging — obtain a logger through the SLF4J facade rather than printing to standard output, and raise or lower a package's level from configuration so a running application can be investigated without editing code ✅ 07-timetrack

### REST controllers

- Spring MVC request dispatch — follow a request through the servlet dispatcher, handler mapping, argument resolution, message conversion, controller, and exception handling when diagnosing a failed endpoint
- `@Controller` vs `@RestController` — use view-oriented controller semantics for rendered responses and response-body semantics for APIs whose return values are written through message converters ✅ 07-timetrack
- `@RequestMapping` without a method attribute — a class-level mapping contributes the shared path prefix, but the same annotation on a method matches every HTTP verb unless the verb is narrowed ✅ 07-timetrack
- HTTP method mappings — select a method-specific mapping that matches the operation's HTTP semantics, including partial updates or state transitions rather than treating every write as POST ✅ 07-timetrack
- `@PathVariable` vs `@RequestParam` — bind resource identity from the route and optional filtering or control values from the query string, with names and required/default behaviour declared explicitly ✅ 07-timetrack
- `@RequestBody` — bind the request body to a Java object through the configured message converters instead of parsing the payload manually ✅ 07-timetrack
- Unsupported media type on a request body — body binding is selected by the request's declared content type, so a missing or non-JSON `Content-Type` is rejected before the controller runs rather than surfacing as a validation failure
- `ResponseEntity<T>` — use it when status or headers vary dynamically; fixed statuses can use `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status ✅ 07-timetrack
- `ResponseEntity` status factories — `ok`, `created`, `noContent`, and `badRequest` state the response's meaning at the call site, so the status is a checked constant rather than an integer literal no compiler can validate ✅ 07-timetrack
- Created responses and the resource location — build the new resource's URI from the current request when reporting a successful creation, rather than returning the entity with a default status ✅ 07-timetrack
- HTTP message conversion and Jackson — content negotiation and configured message converters turn request and response bodies into Java values and JSON rather than the controller serialising text manually ✅ 07-timetrack
- Jackson response shaping — rename, omit, or format individual fields through serialization annotations, and know that Boot registers Java date/time support so temporal fields serialise as ISO text rather than numeric objects ✅ 07-timetrack
- Jackson deserialization requirements — an incoming body is populated through a record's canonical constructor, an annotated creator, or a no-argument constructor plus mutators, which is why an otherwise valid DTO can arrive with every field null ✅ 07-timetrack
- Bidirectional relationship serialization — returning an entity whose association points back at its owner makes Jackson recurse until the response fails, so break the cycle at the boundary with a response DTO rather than patching it with reference annotations
- Request and response DTO implementation — implement incoming and outgoing contracts as separate records or classes and attach validation constraints to the untrusted input type only ✅ 07-timetrack
- Entity-to-DTO mapping implementation — write the conversion by hand or generate it with an annotation-processor mapper whose implementation class exists only after a build, which is why a missing generated mapper is a build-configuration problem rather than absent source code ✅ 07-timetrack
- `@JsonIgnore` and serialization access — an ignore annotation suppresses a field in both directions unless the access mode is narrowed, so it is a local serialization rule rather than a substitute for a dedicated response type
- Outbound HTTP calls — a Spring Boot service that consumes another API uses the framework's synchronous HTTP client; recognise the current fluent client and the older template still present in maintained codebases

### Request validation

- `@Valid` on `@RequestBody` — trigger cascaded validation of the deserialized request DTO at the controller boundary before business logic runs ✅ 07-timetrack
- Nested and collection cascading — a nested object's own constraints run only when the field or the collection's type argument is marked `@Valid`, while container element constraints such as `List<@NotBlank String>` are checked without it, so a validated outer DTO can silently accept an invalid inner payload
- Validation starter and runtime integration — include Jakarta Validation plus its implementation and Spring integration so constraints are discovered and executed rather than merely present as metadata ✅ 07-timetrack
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — choose whether null, emptiness, or whitespace-only text violates the input contract rather than applying one constraint to every field type ✅ 07-timetrack
- Constraint selection — choose semantic constraints for sign, size, format, range, or pattern so the annotation matches the business rule rather than merely rejecting some bad examples ✅ 07-timetrack
- Bean constraints vs database constraints — a validation annotation rejects bad input before business logic with a client error, while a column constraint fails at flush time as a server error, so the same rule expressed only in the schema produces the wrong response ✅ 07-timetrack
- Controller method validation — apply constraints to controller parameters and handle their failures separately from request-body binding errors
- Body vs method validation failures — invalid `@RequestBody` binding and invalid method parameters use different exception families; handle both deliberately instead of assuming every violation is a `ConstraintViolationException`

### Exception handling and error responses

- `@RestControllerAdvice` — combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody` ✅ 07-timetrack
- `@ExceptionHandler` resolution — the most specific declared exception type wins over a supertype handler, and an advice's scope decides which controllers it serves, so an unexpectedly generic response usually means the wrong handler matched ✅ 07-timetrack
- `ResponseStatusException` and `@ResponseStatus` on an exception — a status can be attached at the throw site or to the exception type instead of through advice; recognise all three routes because maintained code mixes them and the advice never fires for a status already resolved
- Domain exceptions — represent meaningful application failures as dedicated types so a handler can map each one to its intended status ✅ 07-timetrack
- A custom exception vs Spring Security's `AccessDeniedException` — a hand-thrown business-rule exception has no inheritance relationship with the framework's own, even when both are mapped to 403; each needs its own `@ExceptionHandler` ✅ 07-timetrack
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body ✅ 07-timetrack
- Error response contract — map failures to consistent status and body fields so API clients can handle validation, absence, conflict, and unexpected errors predictably ✅ 07-timetrack
- Boot's default error handling — an exception no handler claims is forwarded to the built-in `/error` endpoint, which builds the status, timestamp, and path body and omits the exception message and binding details until the matching `server.error.include-*` properties are enabled
- Filter-chain exceptions vs controller advice — exceptions raised before controller dispatch do not automatically pass through `@RestControllerAdvice`, so authentication failures need handling at the security boundary ✅ 07-timetrack
- Filter vs MVC interceptor vs controller advice — use servlet filters for request-chain concerns, interceptors around mapped handlers, and advice for controller exception/response behaviour

### Spring Data JPA — entity and relationship mapping

- Persistence context and entity state — recognise managed, detached, and removed entities and understand why dirty checking can flush a managed change without another repository `save()`
- `@Entity` requirements — a mapped type needs an identifier, an accessible no-argument constructor, and a non-final class, and a class missing the annotation entirely is not mapped at all ✅ 07-timetrack
- Entity table naming — use `@Table` when the mapped table differs from the default and avoid reserved-word conflicts through a deliberate physical name, quoting policy, or naming strategy ✅ 07-timetrack
- Identifier mapping and generation — mark the primary key and choose between identity columns and sequences according to the target database, because a bootstrap failure over a missing or unsupported identifier is reported before the application serves a request ✅ 07-timetrack
- JPA column nullability and uniqueness — express schema intent on the mapping so the generated or validated schema matches the domain rules ✅ 07-timetrack
- Lombok generated equality on entities — identifier-based `equals` and `hashCode` behave inconsistently while an entity is still unsaved, so generated implementations must be chosen deliberately rather than accepted by default ✅ 07-timetrack
- Lombok generated `toString` on entities — including associations in a generated string can trigger lazy loading or recurse across a bidirectional relationship, so relationship fields must be excluded ✅ 07-timetrack
- Boxed vs primitive boolean fields and Lombok getter naming — a `Boolean` field defaults to `getX()`, while a primitive `boolean` field defaults to `isX()` (JavaBean convention); switching a field's type to close a nullable-unboxing bug renames every call site's getter, and the compiler catches the mismatch ✅ 07-timetrack
- Many-to-one ownership — map the foreign-key side with `@ManyToOne` and name its column with `@JoinColumn` ✅ 07-timetrack
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; a one-to-many with neither `mappedBy` nor `@JoinColumn` produces an unexpected join table
- Many-to-many ownership — map the join table on one owning side with `@JoinTable` and point the inverse side back with `mappedBy` rather than creating two independent associations
- Cascade vs orphan removal — propagate selected persistence operations to related entities or delete a managed child when it is removed from its parent's collection
- Enum string vs ordinal persistence — store stable names when enum reordering or insertion must not silently change the meaning of existing rows ✅ 07-timetrack
- Hibernate timestamps vs JPA lifecycle callbacks — choose provider convenience or portable entity callbacks deliberately when populating audit timestamps ✅ 07-timetrack
- Flyway vs `ddl-auto=update` — evolve schemas through ordered, reviewable migrations rather than allowing runtime ORM metadata to mutate a durable production database implicitly

### Spring Data JPA — repositories and queries

- `JpaRepository` CRUD contract — recognise the inherited persistence, lookup, existence, listing, and deletion operations before declaring redundant repository methods ✅ 07-timetrack
- `Optional` single-result contract — Spring Data returns an absent value rather than null from a single-result finder, which is what makes the "not found" branch explicit at the service boundary ✅ 07-timetrack
- `findById` vs `getReferenceById` — one loads the row immediately and reports absence, the other returns an uninitialised reference that is cheap for setting a foreign key but fails on first access outside an open persistence context
- `save()` insert vs update — recognise that Spring Data decides whether an entity is new before delegating to persistence, so `save()` is not a synonym for SQL INSERT ✅ 07-timetrack
- Derived query methods — let Spring Data derive simple lookups and existence checks from repository method names, switching approach when the name stops expressing the query clearly ✅ 07-timetrack
- `Sort` as a repository parameter — hand a `Sort` to `findAll` or add it as the last parameter of a derived query, and Spring Data applies the ordering on top of the query rather than parsing it as a criterion; `Sort.Order` gives each key its own direction when one blanket `.ascending()` would be wrong ✅ 07-timetrack
- JPQL vs native SQL in `@Query` — prefer entity and attribute names for portable persistence queries and opt into database SQL only when the required behaviour justifies tighter coupling ✅ 07-timetrack
- Interface-based projections — declare a getter-only interface matching the `AS` aliases of a `@Query` (or a derived query's implicit column names) and Spring Data populates it without a full entity or DTO class; read-only, and the getter names must match the aliases exactly ✅ 07-timetrack
- `@Modifying` write queries — a declared update or delete query needs the modifying marker and an active transaction, and it bypasses the persistence context, so already-loaded entities can be left stale afterwards
- Spring Data pagination — accept a `Pageable` and return a bounded result, and know that page number, size, and sort arrive as request parameters bound automatically ✅ 07-timetrack
- `@PageableDefault` is a default, not a floor — a client-supplied `page`, `size` or `sort` replaces the annotation's value entirely rather than merging with it, so any invariant the default was carrying (such as the unique tie-breaker that makes an order total) has to be re-applied to the incoming `Pageable`; `Pageable` and `Sort` are immutable, so re-applying it means rebuilding them rather than mutating what arrived ✅ 07-timetrack — `TimeEntryController.withIdTiebreaker` rebuilds the incoming `Pageable` with `id` appended when the caller's `?sort=` does not already name it
- `Page<T>` vs `Slice<T>` — return total-count metadata only when the client needs it, because a slice can answer whether another chunk exists without an additional count query

### Query behaviour and diagnosis

- Generated-statement logging — enable Hibernate's SQL and binding output to see the statements the repository layer actually issues, because query count and shape are invisible from Java code alone ✅ 07-timetrack
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph` ✅ 07-timetrack
- Aggregating in the database vs in memory — a read whose answer is a handful of scalars states them as `SUM`/`COUNT` in the query itself, because loading every matching row as a managed entity to fold it in Java pays for the persistence context and grows with the data while the result stays the same size ✅ 07-timetrack — `TimeEntryRepository.getSummary` returns the month's three scalars from one JPQL aggregate, where `ReportService` previously loaded every entry of the month as managed entities to fold them in three streams
- `FetchType.LAZY` vs `FetchType.EAGER` — deferred versus mandatory relationship loading, with the defaults deliberately asymmetric: to-one associations load eagerly and to-many associations lazily, so fetching must be chosen per use case rather than fixed globally ✅ 07-timetrack
- Write timing and deferred failure — a persistence call stages work that reaches the database at flush or commit, so a constraint violation is reported at the transaction boundary rather than on the line that appeared to cause it ✅ 07-timetrack — `ProjectService.create` calls `saveAndFlush` so the `@CreationTimestamp` exists before the response is built
- Open EntityManager in View — recognise that Boot's web default can keep lazy loading available during response rendering, why this can hide query behaviour, and why DTO mapping should happen inside an explicit service transaction ✅ 07-timetrack

### Transaction-aware persistence

- Spring Data repository default transactionality — repository CRUD methods carry their own transaction boundary, so an unannotated service commits every call independently with no atomicity across the whole use case ✅ 07-timetrack
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed; fix by converting to a DTO inside the service transaction or loading the relationship deliberately in the query ✅ 07-timetrack

### Spring Security — chain configuration and access rules

- Web security activation — Boot activates web security from the classpath without an explicit enabling annotation, while method security is a separate switch that must be turned on deliberately ✅ 07-timetrack
- `SecurityFilterChain` — declare the chain as a bean and place a custom authentication filter at the correct position relative to the framework's own filters, because order decides what has already run when it executes ✅ 07-timetrack
- Security route rules — declare specific public and role-protected matchers before the authenticated catch-all because matcher order controls which rule applies ✅ 07-timetrack
- Matcher breadth on a public rule — a `permitAll` matcher scoped to a path prefix authorises endpoints that do not exist yet, so naming the HTTP method and the exact path keeps a handler added later to the same controller behind the authenticated catch-all ✅ 07-timetrack — SecurityConfig's only `permitAll` names `HttpMethod.POST` and `"/api/auth/login"`, so a later auth handler is born authenticated
- `@PreAuthorize("hasRole('MANAGER')")` — a method-level check evaluated after authentication, which is silently ignored unless method security is enabled ✅ 07-timetrack
- URL rules vs method-level checks — the two enforcement points are independent, so a permitted route can still be refused by an annotation and a protected route is refused before the method is ever reached ✅ 07-timetrack
- `hasRole` vs `hasAuthority` and the `ROLE_` prefix — role checks add the prefix for you while authority checks compare the stored string literally, so a mismatch between how authorities are persisted and how they are checked rejects a correctly authenticated user ✅ 07-timetrack
- `AuthenticationEntryPoint` — produces the response when a request arrives unauthenticated, and is the only way to give that failure the same JSON error contract as the rest of the API, because it fires in the filter chain before any controller advice can see it ✅ 07-timetrack
- `AccessDeniedHandler` — produces the response when an authenticated caller lacks the required authority, the security-boundary counterpart to handling `AccessDeniedException` in controller advice; where the refusal happens decides which one fires
- Re-checking account status per request, not just at login — a token issued before an account is disabled stays technically valid until it expires, so a stateless JWT filter must re-run an account-status check (`AccountStatusUserDetailsChecker`) on every request against the freshly loaded `UserDetails`, not rely on the check `loadUserByUsername` already ran once at login ✅ 07-timetrack
- Stateless session configuration — a bearer-token API sets the session creation policy so no server session is established, which is what makes each request stand alone ✅ 07-timetrack
- CSRF configuration for a bearer-token API — the decision to disable or retain CSRF follows from how credentials travel, so a cookie-authenticated endpoint in the same application still needs it ✅ 07-timetrack
- CORS with Spring Security — a shared `CorsConfigurationSource` keeps policy central and lets the security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local controller policy ✅ 07-timetrack
- Preflight through the security chain — permit or correctly process browser `OPTIONS` requests so authentication rules do not reject the preflight before the real cross-origin request is sent ✅ 07-timetrack

### Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself ✅ 07-timetrack
- `PasswordEncoder` contract — verify a submitted password by matching it against the stored encoded value through the encoder, never by comparing or reversing the stored string ✅ 07-timetrack
- `DelegatingPasswordEncoder` and encoded-id prefixes — recognise stored values such as `{bcrypt}...` and understand that the prefix is what selects the encoder used to verify them
- `AuthenticationManager` delegation — authenticating a submitted credential runs the configured provider, which loads the user through `UserDetailsService` and verifies the password through the encoder ✅ 07-timetrack
- Exposing the authentication manager — the manager is not injectable by default, so a login service that authenticates programmatically must publish it as a bean from the security configuration ✅ 07-timetrack
- `OncePerRequestFilter` — process JWT authentication once in the normal request dispatch and always continue or terminate the filter chain deliberately ✅ 07-timetrack
- `SecurityContextHolder` — thread-local storage where the authentication filter places the authenticated principal for the current request, and where a service reads it from ✅ 07-timetrack
- `@AuthenticationPrincipal` — resolve the authenticated user as a controller method argument instead of reaching into the static context holder
- Anonymous authentication — an unauthenticated request may still have an anonymous `Authentication` object, so code must check authentication state rather than assuming the context value is null
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code ✅ 07-timetrack
- JWT issuance — derive a signing key from configured secret material and sign the claims the application will later trust, keeping that material out of the source tree ✅ 07-timetrack
- JWT validation failure modes — parsing under the same algorithm and key distinguishes an expired token, a malformed token, and a bad signature, and each should reach the client as a deliberate response rather than a server error
- A library's exception hierarchy is not the whole failure surface — a JWT parser signals an absent, empty, or blank token with `IllegalArgumentException`, which is unrelated to its own `JwtException` family, so a filter catching only that family lets the case escape past the security boundary and the caller receives the container's default error page instead of the API's error contract ✅ 07-timetrack — `JwtFilter`'s catch lists `IllegalArgumentException` beside `JwtException`, so `Authorization: Bearer ` with an empty token returns the `JwtAuthenticationEntryPoint` 401 body instead of a container 500
- JWT claim-to-authority mapping — load the user or map trusted role claims into Spring Security authorities before placing the authenticated token in `SecurityContextHolder` ✅ 07-timetrack

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

- Externalized configuration and property precedence — keep environment-specific values outside code and recognise that command-line arguments, environment variables, profile files, and base configuration can override one another ✅ 07-timetrack
- Profile-specific configuration files — profile values live either in an `application-{profile}` file or in one multi-document file whose sections are separated by `---` in YAML or `#---` in properties and selected with `spring.config.activate.on-profile` ✅ 07-timetrack
- Datasource and persistence properties — connect the application to a real database through its URL, credentials, and driver settings, and recognise what each `ddl-auto` value does to an existing schema ✅ 07-timetrack
- Profiles — activate environment-specific beans and configuration deliberately without treating a profile as a secrets store ✅ 07-timetrack
- `@Value` vs `@ConfigurationProperties` — inject an isolated value directly or bind and validate a cohesive typed configuration group when several related settings belong together ✅ 07-timetrack
- Typed property binding — a property value is converted to the type of the target it is injected into, so a comma-separated value binds to a `List<String>` while a `String` target keeps the separators inside one value ✅ 07-timetrack — `SecurityConfig` declares `allowedOrigins` as `List<String>`, so `app.cors.allowed-origins` holding two comma-separated origins binds as two entries of `CorsConfiguration.setAllowedOrigins`
- SQL initialization — understand when Boot runs `schema.sql` and `data.sql` and how initialization differs for embedded and external databases ✅ 07-timetrack

### Boot runtime model and packaging

- Spring Framework vs Spring Boot — distinguish the core container and framework modules from Boot's opinionated auto-configuration, starters, executable packaging, and operational defaults
- `@SpringBootApplication` — combines configuration, auto-configuration, and component scanning; place it in a root package so the default scan reaches application components
- Auto-configuration and starters — Boot configures infrastructure conditionally from the classpath, properties, and existing beans, while starters provide a compatible dependency set rather than generating application code ✅ 07-timetrack
- Embedded server and executable JAR — a servlet web starter supplies an embedded server so the packaged application can run without deploying a WAR to an external container
- `spring-boot-starter-parent` and dependency management — inherit compatible dependency and plugin versions while distinguishing that Boot-specific build behaviour from Maven's generic lifecycle
- Spring Boot Maven plugin — package an executable archive and run the application through Boot-specific goals without confusing the plugin with dependency management

### Maintained-code recognition

- `jakarta.*` vs `javax.*` imports — recognise that current Boot versions moved the persistence, validation, and servlet namespaces, so a maintained codebase or a copied snippet on the wrong namespace fails to compile or is silently ignored
- `SecurityFilterChain` bean vs `WebSecurityConfigurerAdapter` — current configuration declares a chain bean with the lambda DSL, while the removed adapter base class survives in maintained codebases and in most copied examples, so recognise both and know why one no longer compiles
- Repository interface hierarchy — `CrudRepository`, `PagingAndSortingRepository`, and `JpaRepository` extend one another with progressively more operations, so recognise which one a maintained codebase declared and what that choice does and does not provide
- Service interface plus `Impl` implementation — recognise the pervasive split where the injected type is an interface and the behaviour lives in a separate implementation class, and know that Boot proxies classes by default, so the interface is a maintained-code convention and a test-substitution seam rather than a technical requirement for proxying

### Delivery and API contract

- Spring Boot container packaging — build and run the executable application artifact in a container while supplying configuration externally and leaving generic container orchestration to the General topic
- OpenAPI generation — expose a browsable, generated HTTP contract for frontend and QA consumers from the existing controller and DTO declarations

## Java

### Execution, variables, and control flow

- Source, bytecode, and JVM execution — recognise that `javac` checks and compiles source into bytecode that a JVM executes, without requiring JVM-internals knowledge
- Compile-time vs runtime failure — distinguish type and syntax errors rejected by the compiler from exceptions and logic errors that appear while the program runs
- Variables, declared types, initialization, and scope — know where a local, parameter, field, or block variable exists and that local variables must be definitely assigned before use
- Primitive vs reference types — primitives hold a value, while reference variables identify objects and may be `null`
- `int` vs `long` — choose `long` when the range can exceed `int`; use an `L` suffix only when the integer literal itself does not fit in `int`
- Primitive vs wrapper types — wrappers support generics and `null`, while unboxing a null wrapper throws `NullPointerException` ✅ 07-timetrack
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
- `static` vs instance members — static state and behaviour belong to the class, while instance members require a particular object ✅ 07-timetrack
- Packages and imports — packages organise and name types, while imports let source use a simple name instead of a fully qualified one
- Object aliasing — two references can point to the same mutable object, so a change through one reference is visible through the other
- `null` and `NullPointerException` — dereferencing `null` fails at runtime; validate required values and use guard clauses at clear boundaries ✅ 07-timetrack

### Classes and object-oriented behaviour

- Classes, objects, fields, and constructors — define state and behaviour, create instances, and establish valid initial state during construction ✅ 07-timetrack
- `this` — refer to the current instance and disambiguate a field from a parameter with the same name ✅ 07-timetrack
- Encapsulation — keep representation private and expose behaviour or controlled access so callers cannot bypass class invariants ✅ 07-timetrack
- Access modifiers — distinguish `public`, `protected`, package-private, and `private` visibility when reading code across packages and hierarchies ✅ 07-timetrack
- `final` variables, fields, methods, and classes — prevent reassignment, overriding, or inheritance as applicable; a final field must be assigned exactly once (typically in the constructor), yet a final reference still does not make its object immutable ✅ 07-timetrack
- Inheritance vs composition — inheritance models an is-a relationship, while composition builds behaviour from has-a collaborators and avoids unnecessary coupling
- Polymorphism and dynamic dispatch — a parent or interface reference can hold different implementations, and an overridden instance method is selected from the runtime object ✅ 07-timetrack
- Interfaces — define a contract that unrelated classes can implement and allow callers to depend on behaviour rather than one concrete class ✅ 07-timetrack
- Interface vs abstract class — interfaces support multiple contract inheritance and default behaviour, while abstract classes can also provide constructors and shared instance state
- Default methods — an interface may provide inherited behaviour while preserving the implementing class's ability to override it
- Multiple interfaces — one class can satisfy several contracts even though it can extend only one class
- Anonymous inner classes — recognise inline implementations such as `new Runnable() {...}` or `new Comparator<>() {...}` in maintained code and read them as the pre-lambda form of a functional-interface or abstract-type instance
- `@Override` — ask the compiler to verify that a method really implements or overrides an inherited declaration ✅ 07-timetrack
- Overriding vs overloading — overriding replaces inherited instance behaviour at runtime; overloading selects among different parameter lists at compile time
- `instanceof` and pattern variables — test a runtime type before using subtype behaviour without an unsafe cast
- Records — use a concise data carrier with final components and generated accessors, canonical construction, `equals`, `hashCode`, and `toString` ✅ 07-timetrack — the private `Attempts(int count, Instant lastFailure)` carrier whose generated `equals` makes the compare-and-remove work
- Shallow vs deep immutability — final fields or record components prevent reassignment but do not make referenced mutable objects immutable

### Equality and hashing

- Identity vs value equality — `==` compares primitive values or reference identity, while `equals` expresses semantic equality for objects ✅ 07-timetrack
- `String.equals()` vs `==` — compare String content with `equals`; `==` only asks whether both references identify the same object
- Wrapper equality and boxing — automatic boxing/unboxing converts between primitives and wrappers, but wrapper `==` may appear to work because of caching and must not be used for value equality
- `Objects.equals(a, b)` — perform null-safe object equality by handling nulls before delegating to `equals`
- The `equals` / `hashCode` contract — equal objects must have equal hash codes, and both methods must change together for correct `HashSet` and `HashMap` behaviour ✅ 07-timetrack
- Mutable hash keys — changing fields used by `equals` or `hashCode` after insertion can make an entry effectively unreachable in a hash-based collection ✅ 07-timetrack
- `toString()` — provide a useful textual representation for diagnostics without exposing secrets or relying on it as a serialization contract

### Strings and decimal values

- String immutability — String operations return new values rather than modifying the original object
- Text blocks — read a triple-quoted `"""` multi-line String literal as ordinary String content, used for embedded JSON, SQL, or HTML fragments in modern (Java 17+) code ✅ 07-timetrack
- `String.isEmpty()` vs `String.isBlank()` — empty means length zero, while blank also includes whitespace-only content
- `String.formatted()` — substitute values into a format string while understanding that invalid format specifiers fail at runtime
- String and number conversion — parse text into numbers with `Integer.parseInt` or `Integer.valueOf` and render values back with `String.valueOf`, knowing that malformed input throws the unchecked `NumberFormatException` ✅ 07-timetrack — `JwtUtil` renders the id with `String.valueOf` and reads it back with `Long.valueOf`, whose `NumberFormatException` rejects a legacy token
- `String` concatenation vs `StringBuilder` — use simple `+` for small expressions and a mutable builder for repeated accumulation that would create many intermediate Strings
- Floating-point representation and comparison — `double` and `float` cannot represent most decimals exactly, so `==` between them is unreliable and `NaN` is never equal to itself, which is why floating-point equality needs a tolerance or `BigDecimal`
- Integer vs floating-point division by zero — integer division by zero throws `ArithmeticException`, while floating-point division by zero produces `Infinity` or `NaN` instead of failing
- `BigDecimal` for money and decimal arithmetic — avoid binary floating-point error, remember operations return new values, and choose explicit scale and rounding for division ✅ 07-timetrack
- `BigDecimal.equals()` vs `compareTo()` — recognise that `equals` includes scale while `compareTo` compares numerical value, and choose deliberately for money comparisons and collection keys

### Collections and generics

- Arrays vs collections — arrays have a fixed length and indexed elements, while collection APIs provide resizable and semantic data structures
- Array access and bounds — index elements with `[i]` and read length via the `.length` field (a field, not a method, unlike `String.length()` or `List.size()`), knowing that an out-of-range index throws `ArrayIndexOutOfBoundsException`
- `List` — preserve encounter order and allow duplicates when position or sequence matters ✅ 07-timetrack
- `Set` — represent unique elements when duplicates have no meaning
- `Map` — associate unique keys with values and distinguish missing keys from keys explicitly mapped to `null` ✅ 07-timetrack — an absent key in the login-attempt map means "no failures yet", read straight off the `null` from `get`
- `ArrayList`, `HashSet`, and `HashMap` — recognise the normal general-purpose implementations for list, set, and map semantics
- Map accumulator idioms — use `getOrDefault` and `computeIfAbsent` for the common count-or-group pattern instead of manual get-check-put null handling
- Collection interfaces vs implementations — declare the weakest useful contract such as `List` while choosing a concrete implementation such as `ArrayList` at construction ✅ 07-timetrack
- Collection factories and copies — `List.of`, `Set.of`, and `Map.of` reject nulls and return unmodifiable collections, which still does not make mutable elements deeply immutable ✅ 07-timetrack
- `Arrays.asList()` vs `List.of()` and `List.copyOf()` — distinguish a fixed-size list backed by an array from an unmodifiable factory or copy, including mutation, null, and aliasing consequences
- `ArrayList` vs `LinkedList` — prefer `ArrayList` for normal application access; linked nodes do not make locating a middle position constant-time
- Iteration and safe removal — do not structurally modify a collection through the collection itself during for-each iteration; use `removeIf` or the iterator's own `remove`
- Practical complexity recognition — distinguish linear list search from expected constant-time hash lookup without treating Big-O as a substitute for measurement
- `Comparable<T>` vs `Comparator<T>` — define one natural order inside a type or multiple external orderings without changing that type
- `Comparator.comparing()` — build a field-based ordering and compose tie-breakers when the primary key is equal
- Equality vs ordering consistency — understand that sorted sets and maps treat `compareTo` or `compare` returning zero as the same key even when `equals` disagrees
- Generic types and methods — use type parameters such as `List<User>` and `<T>` to preserve compile-time type safety and avoid casts ✅ 07-timetrack
- Raw types and diamond inference — avoid raw collections that discard type checks and use `<>` when the compiler can infer constructor type arguments
- Generic invariance — `List<Dog>` is not a subtype of `List<Animal>` because adding another Animal through that alias would break type safety
- Wildcard recognition — read `?`, `? extends T`, and `? super T` in library signatures without attempting advanced generic API design
- Nested generic APIs — read types such as `Optional<User>`, `Page<User>`, and `ResponseEntity<List<User>>` by working from the outer container inward ✅ 07-timetrack

### Optional, lambdas, and streams

- `Optional<T>` as a return contract — make an absent result explicit when absence is normal, rather than using it for every nullable field or parameter ✅ 07-timetrack
- `Optional.map` and `ifPresent` — transform a present value or run a side effect without manually branching on presence
- `Optional.filter` — reject a present value that fails a predicate by turning it into an empty Optional, so one terminal operation handles both absence and rejection ✅ 07-timetrack
- `Optional.orElseGet` and `orElseThrow` — produce a lazy fallback or fail with a meaningful exception instead of calling unchecked `get` ✅ 07-timetrack
- `orElse` vs `orElseGet` — `orElse` evaluates its fallback eagerly, while `orElseGet` calls its supplier only when the Optional is empty
- `Predicate<T>` — represent a test from one input to a boolean result ✅ 07-timetrack
- `Function<T, R>` — represent a transformation from an input type to an output type ✅ 07-timetrack
- `Consumer<T>` — accept a value for a side effect without returning a result
- `Supplier<T>` — produce a value without receiving an input ✅ 07-timetrack
- Lambda expressions — pass small pieces of behaviour to APIs while keeping parameter and return types consistent with the target functional interface ✅ 07-timetrack
- Method references — use forms such as `Employee::getName` when a lambda only delegates to an existing method ✅ 07-timetrack
- Stream pipeline lifecycle — create a lazy intermediate pipeline and trigger it once with a terminal operation; a consumed stream cannot be reused ✅ 07-timetrack
- `filter`, `map`, and `toList` — select and transform elements into a result without mutating the source collection ✅ 07-timetrack
- `flatMap` — transform each element into zero or more elements and flatten the nested results into one stream
- `sorted` and `distinct` — order elements or remove duplicates while recognising their dependence on comparison and equality contracts
- `reduce` and simple aggregation — combine stream elements into one result with an identity or accumulator whose operation is associative ✅ 07-timetrack
- `anyMatch` — answer whether at least one element satisfies a predicate, short-circuiting on the first match rather than materialising a filtered collection to test that it is non-empty ✅ 07-timetrack
- `findFirst` and `allMatch` — retrieve the first matching element as an `Optional`, or assert that every element satisfies a predicate, choosing the result type the caller actually needs
- Stream side effects vs loops — keep stream transformations side-effect free and choose a loop when stateful branching or early control flow is clearer
- `Stream.toList()` vs `Collectors.toList()` — `Stream.toList()` returns an unmodifiable list, while `Collectors.toList()` makes no mutability guarantee
- `Collectors.toMap` — gather a stream into a key/value map, supplying a merge function because a duplicate key otherwise throws instead of silently overwriting ✅ 07-timetrack
- `Collectors.joining` — gather a stream of text into one delimited String, with an optional prefix and suffix, instead of accumulating with a manual separator flag

### Exceptions and diagnostics

- Checked vs unchecked exceptions — checked exceptions must be caught or declared, while `RuntimeException` subclasses do not carry that compile-time requirement ✅ 07-timetrack
- `throw` vs `throws` — a `throw` statement evaluates an exception reference and completes abruptly, while a `throws` clause declares possible checked failures to callers ✅ 07-timetrack
- Exception propagation and stack unwinding — an uncaught exception removes call frames until a compatible handler is found or the thread terminates
- Targeted `try` / `catch` / `finally` — catch only failures that can be handled or contextualised and use `finally` for cleanup that must run ✅ 07-timetrack
- Try-with-resources — close `AutoCloseable` resources on both success and failure without duplicating cleanup code
- Custom exception types — name a meaningful failure with a dedicated unchecked type so a caller or a boundary handler can react to that failure specifically instead of parsing a message string ✅ 07-timetrack
- Preserved exception causes — pass the original throwable into the wrapping exception so the trace still shows where the failure actually started
- Do not swallow exceptions — an empty or over-broad catch hides the failure and leaves callers unable to distinguish success from corruption ✅ 07-timetrack
- Reading stack traces — identify the exception type, message, cause chain, and first relevant application frame before changing code

### Enums and annotations

- Enums — model a closed set of named domain values instead of scattering magic Strings through control flow ✅ 07-timetrack
- Enum identity and behaviour — compare enum constants safely with `==` and allow fields or methods when each constant needs domain data or behaviour ✅ 07-timetrack
- Enums in switch expressions — let the compiler enforce that every known constant is handled when no default branch hides omissions
- Annotation metadata — understand that an annotation records metadata and that its target and retention determine where it may appear and whether runtime tools can inspect it
- Reading unfamiliar annotations — consult the annotation's documented contract and recognise whether the compiler, a runtime framework, or another tool processes it

### Date, time, and API literacy

- `LocalDate`, `LocalDateTime`, and `Instant` — choose a calendar date, timezone-free local date-time, or exact UTC timeline point according to the business contract ✅ 07-timetrack
- `Duration` vs `Period` — measure an elapsed time-based amount with `Duration` and a calendar date-based amount with `Period`, rather than computing intervals by hand
- `YearMonth` — represent a whole month as one value when no day is meaningful, and derive its date range with `atDay` and `atEndOfMonth` instead of assembling boundary dates by hand ✅ 07-timetrack
- Date-time immutability and formatting — use `java.time` and `DateTimeFormatter` instead of mutable legacy date APIs and ambiguous hand-built strings
- Javadoc and API signatures — navigate official API documentation and infer required arguments, return types, exceptions, and generic contracts

### Maven fundamentals

Maven is ecosystem tooling rather than Java language syntax; this section owns generic Java-build mechanics, while Spring Boot coverage owns starter, parent, and plugin behaviour.

- Maven coordinates — identify an artifact through `groupId`, `artifactId`, and `version` ✅ 07-timetrack
- `pom.xml` build structure — locate dependencies, plugins, properties, and inherited configuration without confusing their roles ✅ 07-timetrack
- Dependency resolution — locate an artifact in Maven Central, add its coordinates, and let Maven resolve transitive dependencies while inspecting unexpected versions ✅ 07-timetrack
- Build lifecycle — distinguish `clean`, `compile`, `test`, `package`, and `install` and know that a later lifecycle phase runs the earlier phases
- Dependency scopes — distinguish compile, runtime, test, and provided classpaths so libraries are available only where intended ✅ 07-timetrack
- Maven Wrapper — use the repository's pinned Maven launcher so local and CI builds use a consistent Maven version

## Architecture

### Architecture fundamentals

- Software architecture vs design vs implementation — architecture sets system-wide boundaries and
  dependency constraints, design patterns solve narrower recurring problems, and implementation is the
  concrete code that realises those decisions
- Layer vs tier — a layer is a logical separation of responsibility inside the code, while a tier is
  a separately deployed or executed part of the system; three layers can still run in one backend tier ✅ 07-timetrack
- Logical module vs deployed service — a module groups a cohesive responsibility inside an application,
  while a separately deployed service adds a network and operational boundary
- Architectural drivers and quality attributes — connect a structural choice to requirements such as
  maintainability, testability, security, performance, availability, and scalability and name the
  trade-off rather than claiming one design maximises every quality

### API and resource boundaries

- REST architectural style — keep client and server responsibilities separate, make requests stateless,
  and expose a uniform resource interface so calls do not depend on hidden conversational state ✅ 07-timetrack
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action ✅ 07-timetrack
- Resource modelling — paths identify resources and relationships, while HTTP methods express the operation ✅ 07-timetrack
- A name must not imply a guarantee the query does not enforce — an endpoint or field named after a
  narrower concept than what it actually returns (e.g. `by-employee` on a query that groups by user
  with no role filter) reads as correct until someone relies on the implied filter; rename to what the
  data actually is, or add the filter, but never leave the two disagreeing ✅ 07-timetrack
- Endpoints deriving totals from the same rows must apply identical filter criteria — when a headline
  summary and its detail tables are computed independently, a summary built on a looser filter than its
  breakdown produces a total that cannot equal the sum of the rows the client is shown ✅ 07-timetrack
- The serialised shape of a value belongs to the response contract — two endpoints returning the same
  quantity in different decimal scales, date formats or units present one figure as two, and a client
  cannot tell a formatting difference from a disagreement about the data; fix the shape in one place
  every endpoint reads from, because a rule restated per endpoint drifts the first time one is edited ✅ 07-timetrack — the scale rule lives only in the three report queries; `ReportService.getSummary` no longer re-applies `setScale(2)`, so `summary`, `by-project` and `by-user` cannot disagree on shape
- Identifier canonicalisation — user-supplied identifiers arrive in arbitrary case and surrounding
  whitespace, so the boundary must reduce them to one canonical form and then use that same value both
  for the uniqueness comparison and for what is persisted; comparing one form while storing another lets
  a single logical identity become two rows, and no later lookup can tell which one is the real account ✅ 07-timetrack — `EmailNormalizer.normalize` runs before `existsByEmail` and before the setter in `UserService.create`/`update`, `UserDetailsServiceImpl` and `DataInitializer`, while `ProjectService` trims the name and asks `existsByNameIgnoreCase`

### Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; the client
  reaches the backend through an explicit network API boundary, commonly HTTP, and never queries the
  database directly ✅ 07-timetrack
- Controller → Service → Repository — controllers translate HTTP, services apply and orchestrate
  business rules, and repositories encapsulate persistence access ✅ 07-timetrack
- Service layer — the application boundary that holds business rules, validation beyond structural
  input checks, and orchestration between persistence ports so another entry point can reuse the policy and tests can
  exercise it without the web layer ✅ 07-timetrack
- Repository pattern — places data-access operations behind a contract so application logic does
  not contain queries directly; a repository abstraction still carries persistence semantics and is not a
  promise that every storage technology is interchangeable ✅ 07-timetrack
- Business-rule placement — keep application rules outside delivery and persistence code so another
  entry point can reuse them and focused tests do not require the web or database layer ✅ 07-timetrack
- Why the controller should not call the repository directly — it bypasses application policy, mixes
  HTTP and persistence responsibilities, and makes changes and focused tests more brittle ✅ 07-timetrack
- MVC — separates input coordination, presentation, and application/domain state; it is not limited
  to server-rendered HTML and is a different design axis from controller/service/repository layering
- MVC vs layered architecture — MVC organises interaction and presentation responsibilities, while
  layers organise dependency direction; a system can use both without one being a subtype of the other
- Layered dependency direction — higher-level policy should not depend directly on delivery or
  persistence details; dependencies crossing a boundary point through an appropriate contract ✅ 07-timetrack

### DTO pattern

- Why not expose persistence entities directly — a JPA entity is coupled to persistence concerns;
  exposing it couples the API shape to the database mapping and can disclose fields unintentionally ✅ 07-timetrack
- Request DTO — represent and structurally validate untrusted input without confusing transport
  validation with business invariants ✅ 07-timetrack
- Response DTO — shape a stable outward representation and minimise field disclosure independently of
  the internal persistence or domain model ✅ 07-timetrack
- Relationship identifiers in a response — showing a related entity by display label alone forces the
  client to re-derive its key before the next write, and that lookup is only correct while the label
  happens to be unique; carry the identifier beside the label and read minimal disclosure as a rule
  about sensitive fields, not about keys the caller must send back ✅ 07-timetrack — `TimeEntryService.toResponse` sets `projectId` and `userId` beside `projectName`/`userName`, so an entry from `GET /api/entries` is sent straight back to `PUT /api/entries/{id}` without a name lookup against the projects list
- Framework types are not response contracts — a library's implementation class serialised by reflection
  makes the payload shape an internal detail of a dependency; wrap it in a DTO you own so an upgrade
  cannot silently change the API ✅ 07-timetrack
- Mapping placement — translate transport DTOs at the application/API boundary and persistence models
  at the persistence boundary; avoid making controllers own business rules or exposing entities as contracts ✅ 07-timetrack
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract
- Create vs Update request DTOs — separate them when the operations have different validation,
  optionality, or evolution pressure; a shared shape is acceptable while their contracts genuinely match ✅ 07-timetrack
- Backward-compatible API evolution — treat public fields and semantics as consumer contracts and
  prefer additive changes or explicit versioning when a rename, removal, or behaviour change would break clients ✅ 07-timetrack

### Data access decisions

- Soft delete vs hard delete — retain a record when audit, recovery, or historical references justify
  the extra filtering and uniqueness complexity; otherwise permanent deletion may be the simpler contract ✅ 07-timetrack
- Pagination — bound large collection responses when volume can grow, choosing an explicit page or
  cursor contract instead of assuming every list is safely returned at once ✅ 07-timetrack
- Consistency boundary — one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics ✅ 07-timetrack

### Presentation boundaries

- Container / presentational component pattern — a container owns feature integration while focused
  presentation components render inputs and emit user intent without fetching their own remote data ✅ 01-todo-list
- Page coordinator pattern — a page coordinates feature state and delegates focused presentation work to
  children, while shared or independently reusable state may belong in a service rather than in the page ✅ 02-weather-app
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

### Testing strategy

- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- Testability as a design signal — a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- Test doubles as coupling feedback — a unit test that needs many unrelated mocks often signals a class
  with too many responsibilities or hidden boundary dependencies

### Design qualities and boundaries

- Coupling — the number and strength of dependencies between modules; lower coupling limits the
  blast radius of a change
- Cohesion — how strongly a module's responsibilities belong together; high cohesion is the reason
  related business rules stay in one service or feature
- Encapsulation and information hiding — expose the smallest stable module contract callers need and
  keep implementation details private so internal changes do not ripple through the codebase
- Dependency direction — outer delivery and persistence details may depend on application contracts,
  while business rules should not depend on HTTP or database APIs
- Dependency graph and circular dependencies — follow which module depends on which and break a cycle
  by relocating responsibility or introducing a justified boundary, not by hiding it with global access
- Abstraction vs interface — an abstraction defines the stable idea or contract callers depend on,
  while an interface is one language mechanism that can express it and is not valuable by itself
- Dependency injection vs Dependency Inversion — injection supplies a collaborator from outside,
  while the SOLID principle directs high-level policy to depend on abstractions; injection can be used
  without achieving inversion
- Dependency injection vs service locator — explicit constructor or framework injection reveals a
  class's collaborators, while pulling dependencies from a global registry hides them and weakens tests
- Boundary failure ownership — translate infrastructure and domain failures at the boundary that has
  enough context to produce a stable outward error contract without leaking framework exceptions ✅ 07-timetrack
- Package by feature vs package by layer — feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree ✅ 06-hr-portal
- Horizontal layering vs vertical feature slices — layers group code by technical role, while a
  feature slice groups the delivery, application, and persistence pieces that change for one capability
- Composition over inheritance — assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- Composition vs delegation — composition assembles or owns collaborators, while delegation forwards a
  responsibility to one of them; they often work together but describe different relationships
- Over-engineering — an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- DRY and duplicated knowledge — remove repeated business rules that can diverge, without forcing
  superficially similar code with different reasons to change into one abstraction ✅ 05-task-manager
- Extract Method — move a coherent block behind a well-named method when that clarifies intent or
  centralises one repeated rule, not merely to reduce line count ✅ 02-weather-app
- Technical debt — a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect
- Monolith vs microservices awareness — a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary
- Modular monolith vs unstructured monolith — one deployment can still enforce feature boundaries and
  dependency direction; a monolith becomes problematic when unrelated responsibilities freely couple

### Business behaviour

- Domain rule vs application orchestration — a domain rule states what is valid in the business,
  while application orchestration coordinates repositories and collaborators to complete a use case ✅ 07-timetrack

### Workflow modelling

- State machine pattern — model a workflow as explicit states and allowed transitions so invalid moves
  such as APPROVED → DRAFT are rejected at one business boundary ✅ 07-timetrack
- Actor-dependent transitions — when a transition is gated on a mutable attribute of the actor such as a
  role, changing that attribute can strand entities in a state no actor is able to leave, so the change
  itself becomes part of the workflow's invariants ✅ 07-timetrack — `UserService.update` refuses a
  promotion to MANAGER while the user still holds DRAFT or REJECTED entries, whose submit and reopen
  transitions are EMPLOYEE-only

### Boundary patterns in maintained code

- Adapter pattern — translate an external or incompatible interface into the contract the application
  expects so vendor details do not spread through business code
- Facade pattern — expose a small use-case-oriented interface over a complicated subsystem without
  turning the facade into a second home for all business logic

### Architecture decisions and review

- Architectural decision record (ADR) — capture the context, chosen option, rejected alternatives, and
  consequences of a material decision so later maintainers know why the constraint exists
- Architecture diagram as a code claim — a small context, container, component, or dependency diagram
  must match real runtime and dependency boundaries rather than presenting aspirational boxes

### SOLID

- Single Responsibility — split a class when unrelated actors or policies make it change for different
  reasons, not simply because it has many lines or methods ✅ 07-timetrack
- Open/Closed — keep stable abstractions open to extension without treating existing code as forbidden
  to change when requirements or a poor abstraction demand it
- Liskov Substitution — a subtype can replace its parent only when it preserves the caller-visible
  contract, including valid inputs, promised outputs, and invariants
- Interface Segregation — give a client the smallest cohesive contract it needs so implementations and
  tests are not forced to depend on unrelated operations
- Dependency Inversion — high-level policy depends on stable abstractions rather than lower-level
  details; dependency injection is a delivery mechanism that may help but does not guarantee this design

## Security

### Security reasoning and trust boundaries

- OWASP Top 10 — use the current edition as an awareness map of recurring web-application risk
  categories, not as a checklist whose category order should be memorised
- Threat vs vulnerability — distinguish a possible cause of harm from the weakness that lets the
  threat succeed
- Asset and control — identify what needs protection and the defence that reduces a specific risk to it
- Trust boundaries — treat the browser, API, database, third-party services, build environment, and
  network as separate zones whose inputs and identities require verification
- Parsing is not trust — route parameters, headers, cookies, JSON, hidden fields, and decoded token
  claims remain attacker-controlled even after a framework has parsed them successfully ✅ 07-timetrack
- Least privilege and deny by default — grant users, tokens, components, and database accounts only
  the access they need, while leaving unmatched actions inaccessible ✅ 07-timetrack
- Defence in depth — combine validation, authorisation, safe APIs, output encoding, transport
  protection, and monitoring because no single control is sufficient ✅ 07-timetrack
- Allow-list over block-list — define accepted origins, roles, fields, formats, and ranges instead of
  trying to enumerate every malicious value ✅ 07-timetrack
- Secure defaults and fail closed — an absent rule, invalid credential, unexpected exception, or
  unavailable dependency must not silently make a protected operation public ✅ 07-timetrack

### Authentication and authorisation

- Authentication vs authorisation — authentication verifies an identity, while authorisation decides
  what that authenticated identity may do ✅ 06-hr-portal
- Identification vs authentication — a username, email, or token subject names a claimed identity,
  while credential verification establishes whether the claim is genuine
- Credentials, identity, and session state — a password proves identity at login, while a session ID
  or bearer token carries the resulting authenticated state across later requests
- Server-side enforcement — Angular guards and hidden buttons improve navigation and UX but never
  replace permission checks on every protected backend operation ✅ 07-timetrack
- Role-based access control — map roles or authorities consistently and prevent clients from assigning
  privileged roles to themselves ✅ 06-hr-portal
- Administrative self-lockout — an operation that removes a privilege must refuse when the caller is its
  own target, since the route back usually requires the very privilege being removed ✅ 07-timetrack — `UserService.update`
  and `delete` refuse a demotion or deactivation whose target id is the caller's own
- Layered authorisation rules — request-level and method-level checks can reinforce each other but must
  not leave gaps or contradictory policy ✅ 07-timetrack
- Object-level authorisation (BOLA/IDOR) — verify access to the specific requested record instead of
  assuming that any logged-in user may use any identifier ✅ 07-timetrack
- Horizontal vs vertical privilege escalation — distinguish accessing another user's resources from
  gaining a more privileged role or operation ✅ 07-timetrack
- Trusted identity for ownership checks — derive the caller from the authenticated security context
  rather than accepting an owner or user ID from the request body ✅ 07-timetrack
- Collection vs detail authorisation — a filter on a list endpoint does not protect the matching
  read, update, or delete endpoint, so each operation must enforce the same visibility rule ✅ 07-timetrack
- Authorisation as scope, not only as a gate — when one endpoint serves several roles, the caller's role
  can decide which records the response is built from rather than whether the call is refused ✅ 07-timetrack
- Input validation vs authorisation — valid data shape and business values do not prove that the caller
  has permission to perform the requested action

### Session and token lifecycle

- Session-based vs token-based authentication — compare server-held session state with self-contained
  bearer tokens, including storage, scaling, revocation, and CSRF consequences ✅ 07-timetrack
- Authentication vs session management — verifying credentials creates authenticated state, while
  propagation, expiry, renewal, rotation, and invalidation govern its later lifecycle
- Immutable subject identity — bind a session or token to an identifier the account can never lose,
  since a mutable natural key such as an email hands the still-valid credential to whichever account
  holds that value next ✅ 07-timetrack — the JWT subject carries the user id, so `JwtFilter` loads the principal by id, never by the editable email
- Session fixation and hijacking — accept only server-generated unpredictable session identifiers,
  rotate them after authentication or privilege changes, and invalidate server-side state on logout
- Bearer-token possession — anyone who obtains a bearer token can use it, so URLs, logs, screenshots,
  error messages, and analytics must not expose it

### JWT validation

- JWT structure — distinguish the header, claim set, and signature without assuming every JWT uses the
  same signing algorithm ✅ 07-timetrack
- JWT encoding vs encryption — Base64url makes header and payload readable; a signed JWT detects
  tampering but does not make its claims secret
- Signature or MAC vs encryption — a signature or message authentication code provides integrity and
  authenticity, while encryption provides confidentiality
- JWT signature verification — accept a token only after verifying its signature with the configured
  trusted key and rejecting algorithms the application did not choose ✅ 07-timetrack
- JWT signing-key strength — load a sufficiently strong random or generated key from trusted
  configuration because moving a weak human password out of source control does not make it secure ✅ 07-timetrack
- JWT issuer and audience validation — bind a token to the authority that issued it and the service
  intended to accept it instead of trusting any token signed by a familiar key
- JWT temporal-claim validation — enforce expiry and any applicable not-before time rather than
  accepting a token outside its valid window ✅ 07-timetrack
- JWT subject and application-claim validation — treat identity, role, and other claims as input to
  policy checks rather than proof that every requested action is allowed ✅ 07-timetrack
- JWT tampering resistance — changing header or payload bytes invalidates the signature unless the
  attacker can produce a valid signature with the trusted signing key
- JWT expiry — short-lived access tokens reduce the useful lifetime of a stolen credential but do not
  prevent misuse before expiry ✅ 07-timetrack
- Access token vs refresh token — use a short-lived access token for APIs and a more protected,
  longer-lived refresh token only to obtain new access tokens
- Logout and revocation limits — deleting a browser token ends local use but does not invalidate an
  already issued stateless token unless the server adds revocation state or waits for expiry

### Passwords, recovery, and abuse resistance

- Hashing vs encryption vs encoding — hashing is one-way verification, encryption is reversible with a
  key, and encoding only changes representation
- Password hashing — store passwords with a slow adaptive password-hashing function such as BCrypt,
  never as plaintext, reversible encryption, or a fast general-purpose hash ✅ 07-timetrack
- Salt — use a unique random salt per password so equal passwords do not produce equal stored hashes;
  a standard password encoder manages it with the hash ✅ 07-timetrack
- Work factor — tune the password hash cost so verification is deliberately expensive for attackers
  but still acceptable for legitimate logins
- Password verification — delegate hash parsing, salt handling, and verification to a maintained
  password encoder instead of comparing raw passwords or hashes manually ✅ 07-timetrack
- Security-sensitive randomness — generate reset tokens, initial secrets, and other guess-sensitive values
  from a cryptographically secure unpredictable source rather than a predictable pseudo-random stream ✅ 07-timetrack
- Brute-force defence — throttle repeated authentication attempts using account and network signals
  without relying on permanent lockout that attackers can abuse for denial of service ✅ 07-timetrack — `LoginAttemptService` bounds failed logins per email and per client IP with a self-expiring cooldown
- Password reset — use a short-lived, single-use, unpredictable token, invalidate it after success,
  and never email the existing password or trust only an account identifier
- Multi-factor authentication awareness — recognise that a second independent factor reduces the
  damage from a stolen password without requiring a junior to design an enterprise identity system
- Generic authentication failures — keep login status, response shape, message, and observable timing
  sufficiently consistent that they do not reveal whether an account exists ✅ 07-timetrack
- Endpoint abuse limiting — recognise that registration, reset, verification, and expensive API
  operations also need bounded throttling, while distributed policy design remains a later-level task

### Same-Origin Policy and CORS

- Same-Origin Policy and origin — the browser isolates script access by scheme, host, and port, so
  `http://localhost:4200` and `http://localhost:8080` are different origins ✅ 07-timetrack
- CORS purpose — the server uses response headers to let a browser relax the Same-Origin Policy for
  selected cross-origin requests ✅ 07-timetrack
- CORS is not authorisation — it limits browser JavaScript, not Postman, curl, servers, or attackers,
  so protected APIs still require authentication and authorisation
- Simple vs preflighted CORS requests — a simple request may reach the server before the browser hides
  its response, while a failed `OPTIONS` preflight prevents the real non-simple request
- Preflight triggers — methods, content types, or headers outside the CORS safelist, including
  `Authorization` and JSON request content, require the browser to check permission first
- Credentialed CORS — credentialed cross-origin requests require an explicit allowed origin and cannot
  combine credentials with an `Access-Control-Allow-Origin: *` wildcard
- Minimal CORS policy — allow only the origins, methods, headers, and credential mode the deployed
  client actually needs ✅ 07-timetrack — `SecurityConfig`'s `CorsConfiguration` lists the deployed origin,
  the six methods used, `Authorization` and `Content-Type` only, and `allowCredentials(false)`

### XSS and output safety

- Dangerous browser sinks and safe rendering — prefer framework text binding and text-only DOM APIs;
  treat HTML-parsing DOM writes, script-capable URL assignments, eval-like execution, and trust-bypass
  APIs as review hotspots, applying sink-specific avoidance, contextual encoding or sanitisation, or
  URL allow-listing
- Cross-site scripting (XSS) — distinguish stored, reflected, and DOM-based script injection and
  understand how injected code can act with the victim's browser privileges
- Context-sensitive output handling — HTML text, attributes, URLs, JavaScript, and CSS have different
  safe output rules, so generic input sanitisation cannot replace framework escaping

### CSRF, cookies, and browser storage

- Cross-site request forgery (CSRF) — an attacker abuses credentials the browser attaches
  automatically, especially cookies, to make an unwanted state-changing request
- CSRF defences — use anti-CSRF tokens or a custom-header design whose preflight is denied to untrusted
  origins, with `SameSite` as defence in depth rather than the only control
- Secure cookie attributes — understand how `HttpOnly`, `Secure`, and `SameSite` reduce script access,
  insecure transport, and cross-site sending respectively
- Token storage in browsers — Web Storage exposes tokens to JavaScript and therefore XSS, while
  `HttpOnly` cookies reduce token theft but require deliberate CSRF and cookie controls ✅ 07-timetrack

### Injection, validation, and unsafe input

- Server-side validation — client validation improves UX but can be bypassed, so the API must validate
  every untrusted request independently ✅ 07-timetrack
- Syntactic vs semantic validation — validate shape and range as well as business facts such as
  ownership, allowed state transitions, and permitted relationships ✅ 07-timetrack
- Validation vs sanitisation vs output encoding — distinguish rejecting invalid data, transforming
  data, and rendering it safely in a specific output context
- SQL injection — bind query parameters and never concatenate untrusted input into SQL or JPQL;
  an ORM cannot make string-built queries safe ✅ 07-timetrack
- Injection beyond SQL — avoid building shell commands, templates, expressions, paths, or log records
  by concatenating unchecked input
- Unsafe deserialisation — accept constrained DTO and data formats instead of reconstructing arbitrary
  attacker-selected object types or enabling polymorphic type resolution casually
- Mass assignment / over-posting — constrain request DTO fields so a client cannot set roles,
  ownership, approval state, audit metadata, or other server-controlled properties ✅ 07-timetrack

### Resource and destination controls

- Path traversal — normalise and constrain file paths so user-controlled names cannot escape the
  intended storage directory
- File upload validation — constrain size and allowed content using server-side inspection rather than
  trusting the supplied filename or `Content-Type`
- File upload storage and serving — generate storage names, keep uploaded content outside executable
  paths, and serve it with deliberate authorisation and content handling
- Server-side request forgery (SSRF) awareness — do not let arbitrary user-supplied URLs make the
  server reach internal or otherwise restricted network resources
- Open redirect awareness — validate redirect destinations rather than forwarding directly to a
  client-controlled URL

### Sensitive data and disclosure

- Data minimisation — collect, retain, process, and return only the sensitive or personal data the
  feature genuinely needs
- Response DTOs and sensitive fields — never serialize password hashes, secrets, internal claims, or
  unnecessary personal data merely because they exist on an entity ✅ 07-timetrack
- Error-response hygiene — return stable useful errors without stack traces, SQL details, filesystem
  paths, internal class names, or secrets ✅ 07-timetrack
- Resource-existence disclosure — distinguishing "forbidden" from "not found" lets a caller enumerate
  which identifiers exist, so an object the caller may not reach is reported as missing unless that
  caller is entitled to know it exists ✅ 07-timetrack
- Concealment consistency across entry points — a decision to hide a resource's existence from a caller
  holds only if every endpoint accepting that identifier answers the same way, since the most talkative
  path defines the real exposure regardless of what the endpoint designed to conceal it returns ✅ 07-timetrack — `resolveProject` answers 404 for an inactive project on POST/PUT /api/entries with the same message an unknown id gets, matching GET /api/projects/{id}
- Indirect disclosure through result ordering — a value the response never serialises can still leak
  when the caller chooses which column a result set is ordered by, since an order derived from a secret
  is an observation of it, so the sortable and filterable fields are constrained to an explicit
  allow-list rather than accepted as the persistence layer receives them ✅ 07-timetrack — `TimeEntryController.validateSort` rejects any `sort` property outside `date`, `hours`, `status`, `id` with 400, so `?sort=user.password,asc` can no longer order the page by the BCrypt hash column
- Security logging hygiene — record useful authentication and authorisation events while excluding
  passwords, tokens, session IDs, authorisation headers, and unnecessary personal data ✅ 07-timetrack
- Sensitive-response caching — use appropriate private or `no-store` cache controls when credentials or
  private responses must not remain in browser or shared caches

### Secrets and transport

- Secrets vs ordinary configuration — keep passwords, signing keys, and API credentials out of source
  code, committed configuration, frontend bundles, container images, and test fixtures ✅ 07-timetrack
- Exposed-secret response — a credential that reached shared history or any published artifact is
  compromised for every copy already taken, so the response is rotating the value and everything
  derived from it, while deleting or rewriting the source only limits further exposure
- Frontend secrecy impossibility — any value shipped in an Angular bundle is visible to the user, so
  embedded API keys are not secrets
- Secret injection — environment variables or a secret store separate credentials from source code,
  but logs, diagnostics, process inspection, and overly broad access can still expose them ✅ 07-timetrack
- TLS as a precondition — HTTPS protects credentials and data in transit; JWT signing, hashing,
  validation, and authorisation solve different problems and do not replace it

### Hardening and security headers

- Development vs production hardening — default credentials, debug modes, verbose errors, test data,
  and permissive development settings must not reach production ✅ 07-timetrack
- Protection-disablement review — disabling CSRF, authentication, frame protection, or other secure
  defaults requires an explicit threat-model reason rather than a convenient fix ✅ 07-timetrack
- Administrative endpoint exposure — management, documentation, debug, metrics, and dump endpoints
  expand the attack surface and require deliberate exposure and access control
- Security-header recognition — understand the protection signalled by CSP, `frame-ancestors`,
  `X-Content-Type-Options: nosniff`, Referrer-Policy, and HSTS, and notice unsafe absence or values

### Dependency and supply-chain hygiene

- Supported dependency baseline — keep frameworks, libraries, plugins, and base images on supported
  versions rather than accumulating known unpatched risk
- Lockfiles and dependency provenance — preserve reviewed dependency resolution and investigate
  unexpected package, plugin, repository, or lockfile changes
- Vulnerability-alert handling — check whether the project uses an affected version, avoid blind
  suppression or upgrading, and escalate when deeper reachability or risk analysis is required

### Security testing and code review

- Hostile-input security tests — exercise injection metacharacters, traversal sequences, oversized
  payloads, disallowed fields, and unsafe output contexts at trust boundaries instead of testing
  validation only with ordinary invalid values
- Negative authentication tests — cover missing, malformed, expired, and tampered credentials rather
  than testing only successful login
- Permission-outcome tests — prove anonymous, permitted, and wrong-role outcomes instead of testing
  only the authorised happy path
- Horizontal and vertical escalation tests — deliberately use one user's credentials against another
  user's resource and a normal account against an administrative action
- Security configuration regression — verify that new and unmatched endpoints remain protected and
  that broad matcher order does not accidentally make a protected path public
- AI-generated security review — treat configuration that appears to work as untrusted until its
  secrets, disabled protections, broad matchers, client claims, ownership checks, output handling, and
  logging consequences have been examined

## TypeScript

### Type-system foundations

- TypeScript's compile-time boundary — type annotations are checked before execution and erased from emitted JavaScript, so typed external data still needs runtime validation
- Type inference and explicit annotations — rely on clear local inference while annotating parameters, public contracts, and deliberately constrained return values ✅ 01-todo-list
- Primitive value types — use `string`, `number`, and `boolean` without confusing primitive annotations with boxed object types ✅ 01-todo-list
- `null` vs `undefined` — distinguish explicit nullish absence from a missing or uninitialised value under strict checking ✅ 06-hr-portal
- `void` vs `never` — distinguish a function result callers ignore from a control-flow path that cannot produce any value
- `object` vs `Object` vs `{}` — avoid broad object-like types whose assignability differs from the specific property shape an application contract needs
- `any` vs `unknown` — `any` disables checking while `unknown` requires narrowing before use, making `unknown` the safer boundary type
- Structural typing — compatibility depends on required members rather than declared names, which explains both convenient object assignment and accidental shape compatibility
- Union types — model a value that may have one of several types and narrow it before using member-specific operations ✅ 01-todo-list
- Intersection types — require a value to satisfy all combined object contracts without confusing an intersection with a runtime merge
- Literal types and widening — preserve a finite set of allowed values instead of letting them widen to general `string`, `number`, or `boolean` ✅ 01-todo-list
- Array types — express variable-length homogeneous collections with `T[]` or `Array<T>` and account for indexed elements ✅ 01-todo-list
- Tuples — model a fixed sequence of positional element types and prefer named object fields when positions would obscure meaning

### Object contracts

- `interface` vs `type` — choose either for ordinary object shapes while recognising that aliases also express unions and intersections and interfaces support declaration merging ✅ 01-todo-list
- Optional properties vs properties containing `undefined` — distinguish a property that may be absent from one that must exist but may hold `undefined` ✅ 05-task-manager
- `readonly` properties — prevent reassignment through a type without assuming that the object is deeply immutable at runtime
- Interface extension vs type intersections — derive related shapes while recognising their different conflict and composition behaviour
- Excess property checks — understand why a fresh object literal can be rejected for extra fields even when a previously assigned variable is structurally compatible
- Index signatures — model dynamic property names whose values share a type and avoid fixed members that contradict the signature
- Classes as types — recognise that a class declaration creates both a runtime constructor value and an instance type
- `implements` — check that a class instance satisfies a contract without assuming the interface changes the emitted class at runtime ✅ 04-meal-finder
- Abstract classes vs interfaces — recognise shared implementation plus an unconstructable base class versus an erased shape-only contract
- Parameter properties — read constructor parameters that declare and initialise class fields in one TypeScript shorthand
- TypeScript access modifiers vs ECMAScript `#private` fields — distinguish compile-time visibility from privacy that JavaScript enforces at runtime

### Functions and generics

- Function parameter and return types — express callable contracts, including optional parameters and honest `undefined` results ✅ 01-todo-list
- Function type syntax — type callbacks and stored functions by their parameter and return contracts
- Contextual typing — infer an inline callback's parameter and return types from the surrounding expected function type and recognise when extracting it removes that context ✅ 01-todo-list
- Callback parameter assignability — allow a callback to ignore supplied arguments without marking those parameters optional, because an optional parameter means the caller may omit it
- Contextual `void` return assignability — allow a callback expected as `() => void` to return a value that the caller discards while distinguishing an explicitly declared `(): void` function body, which cannot return that value
- Optional parameters vs parameters containing `undefined` — distinguish a call that may omit an argument from one that must pass an argument whose value may be `undefined`
- Rest parameters — type a variadic remainder as an array without confusing it with a spread argument at the call site
- Function overloads — read multiple public call signatures with one compatible implementation and avoid using overloads where a union is clearer
- Generic containers — read `Array<T>`, `Promise<T>`, `Observable<T>`, and similar signatures as preserving the contained value type ✅ 01-todo-list
- Generic functions and interfaces — relate input and output types without replacing that relationship with `any`
- Generic inference at call sites — let arguments determine a type parameter when possible and provide an explicit type argument when inference cannot express the intended contract ✅ 02-weather-app
- Generic constraints — restrict a type parameter to the capabilities the implementation actually uses
- `keyof` — derive a union of valid property names from an existing object contract
- Indexed access types — obtain a property's value type from an existing object contract without duplicating it
- Async function typing — recognise that an `async` function returns `Promise<T>` and that the annotation does not prevent runtime rejection

### Narrowing and safe control flow

- Control-flow analysis across reachability and assignments — trace how branches, early returns, assignments, and merged paths narrow or widen a variable at each program point
- `typeof` narrowing — narrow primitive unions while remembering the JavaScript edge case `typeof null === "object"`
- `instanceof` narrowing — narrow values created by runtime constructors without using it for erased interfaces
- Array and object guards — combine `Array.isArray`, null checks, and object checks before iterating or reading an `unknown` boundary value
- `in` narrowing — refine object unions by checking for a property that not every member declares
- Equality narrowing — use equality with a literal or another typed value to refine compatible union members
- Truthiness narrowing — recognise that `0`, `false`, and `""` are removed along with nullish values, so truthiness is unsafe when those values are valid
- Discriminated unions — model mutually exclusive states with a shared literal tag so each branch exposes only its valid data
- User-defined type predicates — centralise a reusable runtime check that teaches the compiler how a value narrows
- Exhaustiveness checks with `never` — make an unhandled union member a compile-time error when the union later grows
- `unknown` in `catch` — narrow a caught value before reading `message` because JavaScript can throw values that are not `Error` instances

### Null safety and assertions

- `strictNullChecks` — treat `null` and `undefined` as distinct types that must be handled before use
- Non-null assertions — remove `null` and `undefined` only from the static type without adding a runtime check, so misuse can still crash ✅ 02-weather-app
- Type assertions — override the compiler's interpretation without converting or validating the runtime value ✅ 03-expense-tracker
- Double assertions — recognise `as unknown as T` as an unsafe escape hatch that usually hides a broken boundary or conversion ✅ 06-hr-portal
- Definite-assignment assertions — understand that a property-level `!` suppresses initialization checking rather than proving a value will exist ✅ 05-task-manager

### Utility and derived types

- `Partial<T>` vs `Required<T>` — make every property optional or required without assuming `Partial<T>` validates a correct domain patch
- `Omit<T, K>` — derive a shape by removing selected keys so the source model stays the single definition of the fields that remain ✅ 03-expense-tracker
- `Pick<T, K>` — derive a shape by retaining only selected keys when the required subset is smaller than what removing the rest would express
- `Readonly<T>` — make top-level properties readonly without mistaking the utility for deep immutability
- Index signatures vs `Record<K, V>` — choose an open dynamic-key contract or a mapped set of required finite keys while recognising that `Record<string, V>` cannot prove an arbitrary runtime key exists
- `NonNullable<T>` — remove `null` and `undefined` from a union only after program logic guarantees their absence

### Literal preservation and contract checking

- `as const` — preserve literal values and apply readonly treatment without using it as runtime freezing
- `satisfies` — check that an expression conforms to a contract while retaining useful inferred literal and property information
- Annotation vs `satisfies` vs assertion — distinguish assigning a declared contract, checking conformance while preserving inference, and overriding the compiler without proof
- `typeof` in type positions — derive a type from an existing value without confusing it with the runtime `typeof` operator
- Enum runtime behaviour — recognise that regular TypeScript enums emit runtime objects rather than existing only in the type system
- String enums vs literal unions — choose between a runtime enum object and an erased union of allowed values based on actual runtime needs
- `as const` objects vs enums vs literal unions — compare the runtime value and derived type each closed-value-set technique provides

### Type modules and declarations

- Barrel re-exports — read `index.ts` aggregation in maintained TypeScript code while avoiding cycles and hidden dependency boundaries
- Type-only imports and exports — mark a dependency as type-only so the compiler and configured module emitter can handle it without treating the symbol as a runtime value ✅ 01-todo-list
- Module resolution — understand that compiler settings map an import specifier to a source or declaration file and diagnose common unresolved-module errors
- Consuming type declarations and `@types` packages — recognise how JavaScript libraries acquire compile-time types and why declarations do not add runtime code, leaving declaration authoring to later levels

### Compiler configuration and diagnostics

- `tsconfig.json` inheritance — recognise how `extends` composes shared compiler configuration with project overrides
- Compiler file scope — understand how `files`, `include`, and `exclude` determine which source files a project checks
- `target` — choose which JavaScript language version the compiler emits without confusing it with available TypeScript syntax
- `module` — recognise which runtime module format or integration model the compiler emits
- `lib` — control which ambient runtime APIs are available to checking without installing their implementations
- Strict mode — treat the `strict` family as the baseline that enables stronger checks rather than compensating for weak types with assertions
- `noImplicitAny` — require unresolved parameter and member types to be made explicit instead of silently escaping checking
- Type-checking vs emitting — distinguish `tsc --noEmit` validation from generating JavaScript and recognise that a framework build may perform both
- Compiler diagnostics — trace an incompatibility through the reported source locations and related types, then fix the contract instead of suppressing the error

## JavaScript

### Runtime values, types, and conversion

- JavaScript vs TypeScript runtime guarantees — TypeScript checks and erases types before execution, so JavaScript still receives unchecked runtime values
- Primitive values vs objects — primitives behave as immutable values, while objects, arrays, and functions are reference-bearing mutable objects
- `typeof` and its edge cases — inspect broad runtime categories while recognising `typeof null === "object"` and that arrays require a separate check
- `Array.isArray` vs `typeof` — identify arrays explicitly because `typeof` reports them as objects
- `typeof` vs `instanceof` — choose primitive-category inspection or prototype-chain membership according to the question being asked
- `null` vs `undefined` — distinguish intentional absence from missing or uninitialised values without assuming every API uses them consistently
- Truthy and falsy values — predict conditional behaviour for zero, empty strings, `NaN`, `null`, and `undefined`, while recognising that empty arrays and objects are truthy ✅ 01-todo-list
- Explicit conversion with `Boolean`, `Number`, and `String` — convert at input boundaries deliberately instead of relying on surprising operator coercion ✅ 06-hr-portal
- `+` operator: numeric addition vs string concatenation — predict coercion and left-to-right evaluation when either operand becomes a string instead of assuming arithmetic
- `==` vs `===` — use strict equality by default and read loose-equality coercion safely in maintained legacy code
- `||` vs `??` — preserve valid `0`, `false`, and empty-string values by using nullish fallback when only absence should trigger a default ✅ 06-hr-portal
- Optional chaining forms — use `obj?.prop`, `obj?.[key]`, and `fn?.()` to stop property access or calls only for `null` or `undefined` ✅ 06-hr-portal
- Logical short-circuiting — use `&&`, `||`, and `??` with awareness that skipped operands do not execute ✅ 01-todo-list
- Logical operators return operand values — predict that `&&`, `||`, and `??` yield one of their operands rather than a coerced boolean while still short-circuiting evaluation
- Logical assignment operators — read `||=`, `&&=`, and `??=` as conditional assignment without confusing their different trigger conditions

### Numbers and strings

- `NaN` and `Number.isNaN` — detect failed numeric results without the coercion performed by the global `isNaN`
- Numeric parsing vs conversion — choose `parseInt` or `parseFloat` for an accepted numeric prefix and `Number` for a wholly numeric input
- Floating-point precision — avoid exact decimal assumptions and represent money with an appropriate integer or decimal strategy
- Safe integers and `Infinity` — recognise when ordinary `number` arithmetic no longer represents integer results reliably or becomes non-finite
- `toFixed` return type — format decimal places while remembering that the result is a string, not a number
- String immutability — treat every string transformation as producing a new value
- Template literals — interpolate expressions and multiline text without fragile concatenation ✅ 02-weather-app
- String search — choose `includes`, `startsWith`, `endsWith`, or `indexOf` according to whether a boolean or position is needed ✅ 02-weather-app
- `slice` vs `substring` — extract a range while accounting for negative indexes and reversed arguments
- String splitting and trimming — turn delimited text into parts and remove surrounding whitespace without mutating the source ✅ 01-todo-list
- String case conversion and replacement — normalise case or replace one or all matches according to the operation's semantics ✅ 05-task-manager
- Unicode code-unit recognition — know that string length and indexing can split some visible characters and avoid character-count assumptions
- Basic regular expressions — read and write simple search or validation patterns with common flags and choose among `test`, `match`, and `replace`

### Variables, scope, and control flow

- `var` vs `let` vs `const` — prefer block-scoped declarations, default to `const`, and recognise function-scoped `var` in maintained code ✅ 01-todo-list
- Rebinding vs mutation — understand that `const` prevents assigning a different binding but does not freeze an object
- Lexical scope and shadowing — resolve a name from its nearest enclosing scope and avoid hiding an outer binding accidentally
- Hoisting — predict the different pre-declaration behaviour of function declarations, `var`, and lexical declarations
- Temporal Dead Zone — recognise why reading a `let` or `const` binding before its declaration throws
- Conditionals and early returns — express branching clearly and reduce nesting when an early exit makes control flow easier to follow
- `switch` semantics — use explicit cases and breaks while recognising fall-through when reading existing code ✅ 01-todo-list
- Classic `for` loop — use explicit initialisation, condition, and update when index or irregular stepping control is required
- `while` vs `do...while` — choose whether the condition must be checked before the first iteration or after one guaranteed execution
- `break` vs `continue` — exit a loop or skip only its current iteration without obscuring the control flow

### Functions, closures, and `this`

- Function declarations vs function expressions — choose and read them with awareness of their different hoisting behaviour
- Arrow functions vs regular functions — choose concise lexical capture or a function with its own dynamic `this` and `arguments` ✅ 01-todo-list
- Function parameters and return values — handle missing and extra arguments deliberately and recognise that a function without `return` yields `undefined`
- Default parameters — apply a fallback only when the supplied argument is `undefined`
- Rest parameters — collect remaining arguments into a real array without relying on the legacy `arguments` object
- First-class and higher-order functions — pass, store, return, and compose functions as ordinary values ✅ 01-todo-list
- Callbacks — follow control flow when another function decides when and with which arguments a callback runs ✅ 01-todo-list
- Closures — explain how a function retains access to its lexical environment and how captured mutable state changes over time
- Regular-function `this` — determine `this` from the call site rather than the function's definition location
- Arrow-function `this` — recognise lexical capture and avoid using arrows where a method needs a dynamic receiver
- Lost method context — diagnose a method extracted or passed as a callback whose original receiver is no longer present
- `bind` vs `call` vs `apply` — recognise creating a bound function versus invoking immediately with an explicit receiver
- Pure transformations vs side effects — separate deterministic data work from I/O, DOM mutation, timers, and shared-state changes when practical

### Objects, prototypes, and copying

- Object literals and property access — use shorthand, computed keys, and dot or bracket notation according to whether a key is static or dynamic ✅ 01-todo-list
- Object destructuring — bind, rename, and default selected properties while remembering defaults apply only to `undefined` ✅ 06-hr-portal
- Property existence vs an `undefined` value — distinguish `Object.hasOwn`, legacy `hasOwnProperty`, the `in` operator, and a property read when inherited or explicitly undefined properties matter
- Own vs inherited properties — avoid treating prototype-chain members as an object's own input data
- `Object.keys`, `Object.values`, and `Object.entries` — enumerate own enumerable string-keyed properties in the form the operation needs
- `Object.fromEntries` — rebuild an object from transformed key-value pairs
- Object spread vs `Object.assign` — create a shallow merged object or mutate an explicit target deliberately ✅ 01-todo-list
- Reference identity and aliasing — predict how two variables can observe mutations to the same object ✅ 01-todo-list
- Shallow vs deep copying — recognise that spread and `Object.assign` retain nested references and use `structuredClone` only for supported data
- `Object.freeze` depth — prevent top-level writes without assuming nested objects become immutable
- Prototype delegation — understand that property lookup can continue through an object's prototype chain
- Class construction and instance methods — read `constructor` and instance behaviour as class syntax built on prototype delegation
- Class inheritance — use `extends` and `super` while recognising that JavaScript still delegates through prototypes
- Static vs instance members — access class-level behaviour through the constructor and per-instance behaviour through its prototype
- `new` and constructor-function mechanics — recognise how `new` creates an object, links its prototype, binds `this`, and handles an explicit object return when reading class or legacy constructor code
- JSON text vs JavaScript values — distinguish a serialized interchange string from the runtime object produced by parsing it ✅ 03-expense-tracker
- `JSON.stringify` and `JSON.parse` boundaries — account for unsupported values during serialization and invalid text throwing during parsing

### Arrays and iteration

- Array destructuring — bind positions, skip entries, use defaults, and collect remaining elements ✅ 02-weather-app
- Array spread — create a shallow array copy or combine iterables without implying a deep clone ✅ 01-todo-list
- Mutating vs non-mutating array methods — recognise when an operation changes the original collection and when it returns a new one ✅ 01-todo-list
- `slice` vs `splice` on arrays — choose non-mutating range extraction or in-place removal, replacement, and insertion without confusing their return values or mutation effects
- `map` — transform each present element into a result array without using it merely for side effects ✅ 01-todo-list
- `filter` — retain all matching elements and always return an array ✅ 01-todo-list
- `find` vs `filter` — choose one matching value or every matching value ✅ 06-hr-portal
- `some` vs `every` — express existential or universal checks with short-circuiting ✅ 04-meal-finder
- `includes`, `findIndex`, and indexed access — choose membership, matching-position, or known-position lookup
- `forEach` vs `map` — choose side-effect iteration or value transformation without expecting `forEach` to return results
- `reduce` — accumulate a collection with an explicit initial value when it improves clarity rather than hiding a simpler operation ✅ 03-expense-tracker
- Array sorting — provide an appropriate comparator and account for `sort` mutating the array
- Method chaining — trace the intermediate type and value produced at every stage of a transformation pipeline ✅ 03-expense-tracker
- `for...of` vs `for...in` — iterate iterable values or enumerable property keys without using object-key iteration accidentally on arrays
- Array methods vs explicit loops — prefer declarative transformations, but use a loop when early exit, irregular stepping, or awaited sequential work is clearer
- `Set` vs `Array` — choose uniqueness and membership lookup or ordered indexed collection behaviour ✅ 04-meal-finder
- `Map` vs plain object — choose arbitrary key types and collection APIs or string-keyed record-like data

### Asynchronous JavaScript

- Promise states and settlement — distinguish pending, fulfilled, and rejected outcomes and understand that a promise settles only once
- Promise creation vs observation — know that `then` and combinators observe work represented by promises rather than making JavaScript parallel
- Promise executor timing — predict that the executor passed to `new Promise` runs synchronously while settlement reactions registered with `then`, `catch`, or `finally` run as microtasks
- Promise chaining and returned values — return values or promises from handlers so the next link receives the intended result
- Promise rejection propagation — understand when `catch` recovers, when rethrowing preserves failure, and why a missing returned chain becomes floating work
- `finally` semantics — perform cleanup without replacing the original outcome unless the callback itself throws or rejects
- `async` function return values — recognise that every `async` function returns a promise even when its source returns a plain value
- `await` and error propagation — suspend only the current async function and catch rejected awaited promises at the correct boundary
- Sequential vs concurrent awaits — serialize dependent operations and start independent operations before awaiting them together
- `Promise.all` failure behaviour — await all required independent results while accepting fail-fast rejection
- `Promise.allSettled` vs `Promise.all` — retain every outcome when independent failures should not discard successful results
- `Promise.race` vs `Promise.any` — choose the first settled outcome or the first fulfilled outcome and recognise aggregate rejection when every input rejects
- Missing `await` or `return` defects — diagnose callers that continue before work finishes or cannot observe a rejected promise
- Async callbacks in `forEach` — recognise that `forEach` does not await callback promises and choose an explicit sequential or concurrent pattern
- Call stack, tasks, and microtasks — predict run-to-completion and why promise reactions run before later timer tasks
- Long synchronous work and responsiveness — understand that blocking the call stack delays rendering, events, timers, and promise reactions
- `AbortController` recognition — signal abort to supported operations that observe its signal and distinguish intentional aborts from ordinary failures

### Modules and maintained code

- Named vs default exports — choose stable explicit names or a single conventional module value and import each form correctly
- Static imports and module scope — avoid accidental globals and rely on statically analysable dependencies
- Import aliases and namespace imports — resolve naming collisions and consume a module as a namespace when appropriate
- Dynamic imports — load a module on demand while handling the returned promise and keeping framework-specific lazy loading elsewhere
- Legacy JavaScript recognition — read `var`, callback-heavy code, constructor functions, prototype methods, and handler patterns without making obsolete libraries a study target

### Browser events and resources

- DOM selection and update recognition — inspect and modify ordinary elements while preferring framework rendering in Angular-owned code
- Event listeners and the event object — read event type, target/current target, and handler registration without confusing browser events with Angular APIs ✅ 05-task-manager
- Event bubbling and capture — predict the propagation path and choose delegation or a direct listener deliberately ✅ 04-meal-finder
- `stopPropagation` vs `preventDefault` — control event travel or the browser's default action as independent decisions ✅ 04-meal-finder
- Event delegation — handle repeated or dynamic descendants through a stable ancestor when the propagation model makes it suitable
- Listener, timer, and resource cleanup — remove registrations and cancel scheduled work when their owner no longer needs them
- `setTimeout` and `setInterval` — treat delays as minimum scheduling thresholds and cancel repeated or obsolete callbacks
- Date parsing and time-zone hazards — avoid assuming ambiguous date strings or local/UTC conversions mean the same instant
- Web Storage persistence — read and write `localStorage` or `sessionStorage` as a synchronous string-only client store, serializing structured values on the way in and revalidating them on the way out because the stored text outlives the code and the user can edit it ✅ 03-expense-tracker

### Errors and runtime boundaries

- `Error` objects — preserve useful message, cause, name, and stack context when creating or wrapping a failure
- Custom error classes — extend `Error` to express domain-specific failure categories that callers can distinguish without inspecting message text
- `throw` control flow — stop normal execution with a meaningful error value that the correct boundary can handle
- `try`, `catch`, and `finally` — handle only what the current boundary can resolve, clean up reliably, and never swallow an error silently
- Synchronous throws vs promise rejections — trace failures through the correct call-stack or asynchronous observation path
- Fetch settlement mechanics — recognise that the promise rejects for request failures but fulfils with a response for HTTP status outcomes
- Runtime data enforcement — check untrusted parsed data before relying on its shape because compile-time annotations do not exist at runtime

### Debugging and performance

- Breakpoints and stepping — pause execution and follow the actual control path instead of guessing from source alone
- Watches, console inspection, and stack traces — inspect changing values and reconstruct the call path that produced a failure
- Network and async inspection — correlate requests and scheduled work with the code that initiated them
- Debounce vs throttle — choose quiet-period execution or a maximum execution rate for bursty events without treating RxJS operators as JavaScript
- Basic performance diagnosis — measure before changing code and avoid repeated expensive work in hot loops or handlers without entering engine-level tuning
- AI-generated JavaScript review — check runtime inputs, coercion, mutation, async completion, cleanup, error propagation, and observable behaviour before accepting generated code

## CSS

### Box model
- `margin`, `padding`, `border`, `content` — distinguish each box-model layer and trace how they determine visible size and spacing ✅ 01-todo-list
- `box-sizing: border-box` — makes `width` include padding and border; the default `content-box` adds them on top, causing sizing surprises; setting it globally in a reset makes layouts predictable ✅ 01-todo-list
- Collapsing margins — adjacent vertical margins may collapse into one rather than add together, so diagnose spacing from the participating margins and formatting context
- CSS reset pattern — apply sizing and baseline rules to elements and generated boxes deliberately instead of assuming browser defaults are identical ✅ 01-todo-list

### Display and layout
- Normal flow — understand how block and inline boxes participate in document flow before using flex, grid, or positioning to change it
- Floats and clearing — recognise that a floated box leaves normal block flow while inline content wraps around it, and contain or clear legacy floats with `flow-root` or `clear` instead of using float as a modern layout system
- `display: block`, `inline`, `inline-block` — a block box normally fills the available inline space and starts on a new line; inline content participates in a line box and does not accept width; inline-block flows inline while accepting dimensions ✅ 04-meal-finder
- `display: none` vs `visibility: hidden` — remove an element from layout entirely or hide it while preserving its occupied space ✅ 05-task-manager
- Flexbox vs Grid — choose one-dimensional alignment along a row or column or two-dimensional control across rows and columns ✅ 04-meal-finder
- `table-layout: fixed` — take column widths from the first row instead of measuring every cell, which is what makes equal-width columns and predictable truncation possible in a wide data table; the default `auto` sizes columns from their content ✅ 05-task-manager

### Sizing
- `width`, `min-width`, and `max-width` — combine a preferred size with lower and upper bounds so a component can shrink and grow without becoming unusable
- `height`, `min-height`, and `max-height` — prefer content-driven height and add constraints only when the interface has a real scrolling or viewport requirement
- Percentage heights — understand that `height: 100%` needs a definite containing-block height, while `min-height` with a viewport unit is often the robust choice for a page that must fill the screen
- Automatic minimum size in flex and grid — use `min-width: 0` or `min-height: 0` when a flex or grid child must be allowed to shrink instead of overflowing

### Cascade and inheritance
- Cascade decision order — resolve ordinary author declarations through importance, specificity, and source order rather than assuming the last rule always wins
- Cascade origins — distinguish user-agent, user, and author declarations and know that origin and importance are resolved before specificity, so a more specific selector does not always win
- Inheritance — distinguish inherited properties such as `color` and `font-family` from non-inherited layout properties, and use `inherit`, `initial`, `unset`, or `revert` deliberately
- Shorthand vs longhand declarations — understand that shorthands such as `margin`, `background`, and `border` set several longhands and can reset values that were declared earlier

### Selectors and specificity

- Fundamental selectors and selector lists — distinguish type, class, ID, and universal selectors and use comma-separated lists without unintentionally broadening a rule

- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` — target elements through exact ancestry and sibling relationships ✅ 01-todo-list
- Attribute selectors — target attribute presence or values without adding presentation-only classes, while avoiding selectors that accidentally match unrelated elements
- Interaction pseudo-classes — style `:hover`, `:focus`, `:active`, and `:disabled` as user-interface states without relying on hover alone ✅ 01-todo-list
- Structural and functional pseudo-classes — select relationships with `:first-child`, `:last-child`, and `:nth-child()` and filter matches with functions such as `:not()`
- Pseudo-class vs pseudo-element — use `:` for a state or structural condition and `::` for a generated or selected part of an element
- `:focus` vs `:focus-visible` — `:focus` matches every focused element, while `:focus-visible` follows browser heuristics for when a visible focus indicator is needed, including typical keyboard navigation
- Pseudo-elements: `::before`, `::after` — insert CSS-generated content before or after an element; must have a `content` property (can be an empty string); used for decorative elements and Angular Material state layers ✅ 06-hr-portal
- Specificity scoring — compare inline styles, IDs, classes/attributes/pseudo-classes, and elements/pseudo-elements as separate columns; source order decides only after the relevant cascade criteria and specificity tie
- `!important` — raises a declaration into the important cascade, after which origin, layer, and
  specificity still resolve competing important declarations; use it sparingly because it makes
  overrides harder to reason about

### Flexbox
- Flex direction and axes — use `flex-direction` to establish the main axis and recognise that the cross axis changes with it ✅ 01-todo-list
- Flex container alignment — distribute items on the main axis with `justify-content`, align them on the cross axis with `align-items`, and use `gap` for consistent space between items ✅ 01-todo-list
- `flex-wrap: wrap` — controls whether items can move onto additional flex lines; with `nowrap` they stay on one line and may shrink or overflow according to flex sizing and their automatic minimum size ✅ 06-hr-portal
- Flex sizing — explain how `flex-basis`, `flex-grow`, and `flex-shrink` negotiate an item's size and read the `flex` shorthand without assuming `flex: 1` means only “take remaining space” ✅ 01-todo-list
- Per-item alignment — override the container's cross-axis alignment for one item with `align-self`
- `align-items` vs `align-content` — `align-items` positions items within a flex line, while `align-content` distributes multiple wrapped lines and has no visible effect when there is only one line
- `margin: auto` on flex items — absorb available space on the selected side to separate an item without adding a wrapper element
- Visual order vs DOM order — flex and grid reordering can change visual placement without changing DOM, reading, or keyboard-focus order, so source order must remain meaningful

### CSS Grid
- `grid-template-columns` and `gap` — the two properties set most often on a grid container; understanding `fr` units is required to explain any Grid answer ✅ 04-meal-finder
- `repeat()` function — `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern that needs no media queries ✅ 04-meal-finder
- `minmax()` — give a grid track a lower and upper sizing limit so responsive columns remain usable while sharing available space
- `fr` unit — distributes free space after fixed columns are placed; does not include the gap in the calculation, which is why it is cleaner than percentages for equal columns ✅ 04-meal-finder
- `auto-fill` vs `auto-fit` — create as many tracks as fit while choosing whether empty tracks remain or collapse so occupied tracks can stretch
- `grid-column` and `grid-row` — placing an item across multiple tracks using grid line numbers; `grid-column: 1 / -1` spans all columns; `span 2` spans two tracks from wherever the item is placed ✅ 04-meal-finder
- Explicit vs implicit grid and auto-placement — distinguish declared tracks from rows or columns Grid creates when items have no explicit placement
- Grid alignment — distinguish aligning items inside their grid areas with `justify-items`/`align-items` from aligning the grid tracks inside the container

### Position
- `static` vs `relative` positioning — keep an element in normal flow and use relative offsets without removing its original layout space
- `absolute` positioning — remove a box from normal flow and position it from its containing block rather than from where siblings would place it
- `fixed` vs `sticky` positioning — distinguish a box normally anchored to the viewport from one that remains in flow until it reaches an inset within its scroll container
- Sticky positioning conditions — supply an inset such as `top`, ensure the scroll container has room to scroll, and inspect ancestor overflow when sticky behaviour appears not to activate
- How `absolute` finds its reference point — positions relative to the nearest ancestor that
  establishes a containing block; otherwise it falls back to the initial containing block ✅ 03-expense-tracker
- `z-index` and stacking context — applies to positioned boxes and flex/grid items; properties such
  as `transform` and `opacity < 1` create a new stacking context, explaining why a large number
  cannot escape an ancestor's stacking order
- `inset: 0` — set all four positioning offsets to zero with one shorthand, as in a viewport-covering overlay

### Responsive design
- Mobile-first with `@media (min-width: ...)` — start from the constrained layout and add capabilities for wider viewports instead of undoing a complex desktop layout ✅ 03-expense-tracker
- Content-driven breakpoints — add a breakpoint where the layout or content stops working rather than memorising device widths; intrinsic Grid patterns can remove some breakpoints entirely ✅ 04-meal-finder
- Fluid images — constrain an image to its container while preserving its intrinsic aspect ratio
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected
- `prefers-reduced-motion` — remove or reduce non-essential movement for users who request it without disabling functional state feedback
- Logical properties — use `margin-inline`, `padding-block`, and logical inset or size properties when layout should follow writing direction instead of hard-coded left and right
- Responsive content testing — test narrow widths, zoom, long labels, translated text, and missing or oversized media because a layout is responsive only if real content can change without clipping

### Units
- `px` — a CSS reference pixel, useful for thin borders and other fixed details; root-relative units
  usually respect user text-size preferences more naturally for typography and scalable spacing ✅ 01-todo-list
- `%` — resolve against the relevant containing-block dimension, noting that percentage margins and padding use its inline size even on the vertical axis
- `em` — usually resolves from the element's computed font size, while `font-size` itself uses the inherited parent size; nested font sizing can therefore compound
- `rem` — relative to the root element's computed font size, commonly but not guaranteed to start at `16px`; it avoids nested compounding ✅ 01-todo-list
- Viewport units — use `vw`/`vh` for the default viewport and recognise `svh`, `lvh`, and `dvh` when mobile browser chrome makes `100vh` unsuitable ✅ 01-todo-list

### Transitions and animations
- `transition` — declare the animated property and timing on the base element so state changes animate in both directions ✅ 04-meal-finder
- `transform` — `translateX/Y`, `scale`, and `rotate` change visual appearance without changing
  normal-flow geometry; browsers can often composite transforms efficiently, but GPU promotion is
  not guaranteed ✅ 02-weather-app
- `transform` vs `top/left` for movement — transforms commonly avoid layout while positional changes
  can trigger it; profile when performance matters instead of treating either rendering path as an
  unconditional guarantee
- Interpolated vs discrete properties — properties such as `opacity` and `transform` can interpolate smoothly, while `display` changes discretely and should not be treated as an ordinary fade transition
- `@keyframes` and `animation` — multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back ✅ 02-weather-app

### Typography
- `font-size` with `rem` — `rem` follows the root size and composes consistently with user settings;
  fixed pixels are not automatically inaccessible, but a scalable type system is easier to zoom and
  maintain ✅ 01-todo-list
- `font-weight` numeric values — request standard weight positions while recognising that the selected font may not provide every intermediate weight ✅ 04-meal-finder
- `line-height` unitless value — `1.5` means 1.5× the current font size; a unitless value scales correctly when font size changes; `line-height: 24px` breaks as soon as the font size changes ✅ 04-meal-finder
- Text truncation — combine a non-wrapping line, clipped overflow, and ellipsis signalling because each property controls a different part of the effect ✅ 06-hr-portal
- `text-transform` — change displayed casing for labels and badges without mutating the stored text ✅ 02-weather-app
- `font-family` fallback stack — list compatible alternatives ending in a generic family so text remains usable when a preferred font is unavailable ✅ 01-todo-list

### CSS variables
- `--variable-name` and `var()` — define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours; change one variable and the whole UI updates ✅ 01-todo-list
- `:root` vs component scope — expose a custom property globally or restrict it to one element subtree according to who owns the design token ✅ 01-todo-list
- CSS variables participate in the runtime cascade — their values can change through selector state, media queries, inheritance, or an inline style without recompiling the stylesheet
- `var()` with a fallback — `var(--primary, #e8572a)` uses the second argument when the variable is not defined; provides a safety net when customising Angular Material where some variables may not be set

### Sass and maintainable authoring
- Sass vs native CSS — use Sass for build-time authoring features and CSS custom properties for values that must participate in the runtime cascade or change without recompiling
- Sass nesting — keep nesting shallow and use `&` for a component's states or modifiers without recreating the DOM tree as a high-specificity selector chain
- Sass variables — use build-time constants when runtime cascade and inheritance are not required
- Sass mixins — reuse a parameterised declaration group only when it removes meaningful repetition rather than hiding ordinary CSS
- Sass modules and partials — split styles by concern and load explicit members without returning to global `@import` coupling
- Reusable low-specificity selectors — prefer stable class selectors and a consistent naming convention so existing styles can be extended without specificity escalation

### Colors and transparency
- Color notation — read hex, RGB, and HSL representations and follow a consistent project convention rather than treating one notation as universally superior ✅ 01-todo-list
- Alpha-channel colour — apply transparency to one colour with modern RGB/HSL, hex alpha, or legacy `rgba()` syntax instead of fading the entire element
- `opacity` vs alpha-channel colour — fade the whole rendered element subtree or only the colour of one painted property
- `visibility: hidden` vs `opacity: 0` — both preserve layout space, but visibility changes painting and interaction semantics while zero opacity can leave an invisible element hit-testable and focusable
- `rgba` for overlays and shadows — `rgba(0, 0, 0, 0.5)` for modal backgrounds, `rgba(0, 0, 0, 0.08)` for card shadows; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value ✅ 02-weather-app
- `currentColor` — a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync with the text color without repeating the value
- Contrast ratios — meet at least 4.5:1 for normal text and 3:1 for large text and meaningful user-interface graphics so content remains readable against its background
- Non-colour cues — never make colour the only signal for status, validation, links, or interaction state; add text, an icon, shape, or another visible distinction

### Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` — spread is optional, and transparent
  colour can use modern `rgb(... / alpha)`, hex alpha, HSL, `rgba()`, or a design token ✅ 02-weather-app
- `border-radius: 50%` — makes a circle only when the element is square, which is why it works for avatars and loading spinners and produces an ellipse on any other aspect ratio ✅ 02-weather-app
- `border-radius: 9999px` — create pill ends across changing aspect ratios while reserving `50%` for shapes derived from each axis ✅ 05-task-manager
- `background-size: cover` vs `background-size: contain` — `cover` fills the element completely and may crop the image; `contain` fits the whole image and may leave empty space; `cover` is standard for hero sections and card backgrounds
- `object-fit: cover` — same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements in a fixed-size container; `background-size` is for background images, `object-fit` is for `<img>` tags — a confusable pair ✅ 04-meal-finder
- `outline` vs `border` — `outline` sits outside the border and does not take up layout space; never remove the browser's default focus outline without adding a visible custom replacement; `button:focus-visible` is the accessible way to style it ✅ 01-todo-list
- `aspect-ratio` — preserve a width-to-height ratio when one dimension is resolved and reserve predictable media space before content loads

### Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content; used to prevent images from breaking out of a `border-radius` card container; `scroll` always shows scrollbars; `auto` only shows them when content overflows ✅ 04-meal-finder
- `overflow-x` and `overflow-y` — control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport ✅ 06-hr-portal
- Scrollable container pattern — combine `overflow-y: auto` with a meaningful height constraint so overflowing content scrolls inside the component rather than extending the page ✅ 04-meal-finder
- Long-word wrapping — use `overflow-wrap` to let long URLs, identifiers, or translations break before they force a component wider than its container

### CSS functions
- `calc()` — combine compatible values and units in one expression when neither a purely relative nor fixed size represents the constraint ✅ 05-task-manager
- `clamp(min, preferred, max)` — scale a preferred value fluidly while enforcing explicit lower and upper bounds
- `min()` and `max()` — select the smaller or larger computed value from mixed units while remembering that intrinsic sizing and `box-sizing` can make the result differ from a separate width plus max-width declaration

### BEM naming
- Block, element (`__`), modifier (`--`) — use predictable class roles in a global stylesheet while keeping names independent of DOM depth
- Why BEM keeps specificity low — each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- BEM alongside component scoping — treat BEM as one optional naming convention for predictable classes, especially in global CSS, rather than as a requirement imposed by Angular components

### Browser debugging and compatibility
- DevTools computed styles — inspect the matched rules, crossed-out declarations, inherited values, and final computed value before changing a selector blindly
- DevTools box and layout inspection — use the box-model, flex, and grid overlays to diagnose spacing, alignment, track, and overflow problems from the browser's actual layout
- CSS support and progressive enhancement — check current browser support for newer features, provide a usable baseline when necessary, and use `@supports` when conditional enhancement is clearer than browser-specific hacks

## SQL

### JOINs

- `INNER JOIN` — returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- `RIGHT JOIN` — mirror a `LEFT JOIN` and recognise that swapping table order can express the same outer-join relationship more conventionally
- `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- Multiple JOINs — chain relationships through several tables while keeping every join condition tied to the intended key path
- JOIN cardinality and row multiplication — predict whether each relationship is one-to-one, one-to-many, or many-to-many before joining; apparent duplicates usually mean the join produced several legitimate matches, so `DISTINCT` must not be used as a blind repair
- `ON` vs `WHERE` with an outer join — a condition in `ON` controls which right-side rows match while preserving unmatched left rows; moving that condition to `WHERE` can reject the `NULL`-extended rows and accidentally turn a `LEFT JOIN` into an inner join
- Self JOIN — assign separate aliases to one table so rows from that table can be related or compared with each other
- `CROSS JOIN` — produces every combination of the two inputs; use it only when a Cartesian product is intentional and recognise a missing join condition as the accidental version
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

---

### Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` — count all input rows or only rows where the selected expression is non-`NULL`
- `COUNT(*)` vs `COUNT(column)` after a `LEFT JOIN` — an unmatched left row survives as one `NULL`-extended row, so `COUNT(*)` reports `1` for a group that actually has nothing; count a non-nullable column from the right table to get the `0` the report means
- `COUNT(DISTINCT column)` — counts how many different non-`NULL` values a group holds rather than how many rows carry them; the correct repair when a legitimate join multiplication has inflated a plain `COUNT`
- `SUM` — add the known values of a numeric column across a group, ignoring `NULL` instead of treating it as zero ✅ 07-timetrack
- `AVG` — divide the sum of known values by the count of known values, so a `NULL` lowers neither side and a missing value is never averaged in as a zero
- `MIN` and `MAX` — return the smallest or largest non-`NULL` input and work with ordered types such as numbers, text, and dates
- Aggregate results on empty input — `COUNT` returns `0`, while `SUM`, `AVG`, `MIN`, and `MAX` return `NULL` when no input rows remain; use `COALESCE` only when the result contract truly requires a default ✅ 07-timetrack — `COALESCE(SUM(...), 0)` in the summary query is what makes a month with no entries answer a number instead of `null`; the enclosing `round(..., 2)` is what gives that number the contracted `0.00`
- `GROUP BY` rule — selected expressions normally need to be grouped or aggregated; PostgreSQL also permits columns it can prove functionally dependent on a grouped primary key, but explicit grouping is clearer in portable junior SQL ✅ 07-timetrack
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `GROUP BY` on an identifying column, not just a display name — grouping by a name alone silently merges two distinct rows that happen to share that name; group by the id (and select the name alongside it) so an aggregate stays correct even when values collide ✅ 07-timetrack
- `GROUP BY` and `NULL` — grouping collects every `NULL` into one single group rather than discarding those rows, which is the opposite of what `WHERE` does with an unknown predicate; a report can therefore grow an unlabelled category that is easy to misread as a bug
- `GROUP BY` vs `SELECT DISTINCT` — both collapse repeated values, so they agree whenever nothing is aggregated; reach for `GROUP BY` when the query needs a per-group calculation, and treat `DISTINCT` as deduplication of an already-correct result
- `HAVING` — filter grouped results after aggregation while `WHERE` filters input rows before grouping
- Conditional aggregation with `CASE WHEN` — make only rows satisfying a condition contribute to an aggregate without discarding other groups ✅ 07-timetrack — the summary query sums approved and submitted hours side by side with `SUM(CASE WHEN te.status = ... THEN te.hours END)`, so one pass answers both
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior ✅ 07-timetrack — the same query counts approved entries with `COUNT(CASE WHEN ... THEN 1 END)`, relying on the missing `ELSE` producing nulls that `COUNT` skips
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions
- `STRING_AGG(column, separator)` — concatenates values from several rows into one PostgreSQL result per group; the order is arbitrary unless an `ORDER BY` is written inside the aggregate call itself

---

### Querying basics

- `SELECT`, `FROM`, and column aliases — `SELECT` defines the result expressions, `FROM` supplies rows, and `AS` names a result expression without changing the source column
- Qualified column references — use `alias.column` when more than one input exposes the same name and whenever qualification makes a multi-table query unambiguous
- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- `WHERE` operators and precedence — comparisons, `NOT`, `AND`, and `OR` build row predicates; `NOT` binds before `AND`, and `AND` before `OR`, so use parentheses whenever the intended grouping is not immediately obvious
- Computed expressions — arithmetic and string expressions can produce derived result columns; give them aliases and account for operand types such as integer division
- `SELECT *` vs named columns — specify the required columns in application code; `SELECT *` can fetch unnecessary data and makes the result shape change whenever the schema changes
- `CASE WHEN` in `SELECT` — derive one output value per row from ordered conditions
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- SQL string literals vs quoted identifiers — single quotes delimit values, while double quotes delimit case-sensitive or otherwise special identifiers; unquoted PostgreSQL identifiers fold to lowercase

---

### Ordering and pagination

- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- No guaranteed row order without `ORDER BY` — a result set is an unordered set, so `GROUP BY`, an index scan, or insertion order can make rows look sorted while the engine stays free to return them differently on the next run; an order a caller depends on has to be stated, never inherited from how the rows happened to be produced ✅ 07-timetrack
- Multi-column sorting — PostgreSQL resolves `ORDER BY` keys from left to right, so later keys break ties from earlier ones and each key can choose `ASC` or `DESC` ✅ 07-timetrack
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- Stable ordering — pagination needs a deterministic tie-breaker such as the primary key after a non-unique sort column; otherwise equal values can move between pages ✅ 07-timetrack
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- `FETCH FIRST n ROWS ONLY` — the SQL-standard row-limiting clause, written as `OFFSET n ROWS FETCH NEXT m ROWS ONLY`; PostgreSQL accepts both it and `LIMIT`, but Oracle and other engines a consultancy account may run accept only the standard form

---

### Set operations

- `UNION` vs `UNION ALL` — remove duplicates across compatible result sets or retain every row and avoid unnecessary duplicate elimination
- `UNION` column rules — align column counts and compatible types across branches while taking result column names from the first query
- `UNION` vs `JOIN` — a union stacks rows from two result sets that share a shape, while a join widens each row with columns from a related table; "combine two tables" is ambiguous and picking the wrong one produces a result of the wrong shape, not merely the wrong size
- `INTERSECT` and `EXCEPT` — `INTERSECT` keeps rows present in both results and `EXCEPT` keeps rows from the first result that are absent from the second; both remove duplicates unless `ALL` is requested

---

### Filtering and NULL handling

- `WHERE` keeps only `TRUE` — a predicate evaluates to true, false, or unknown, and only true-rows survive; unknown is discarded exactly like false, which is why a condition and its own negation can both drop the same `NULL` row and the two result sets fail to add up to the table
- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` — test absence with `IS NULL` or `IS NOT NULL` because ordinary equality with `NULL` evaluates to unknown
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
- `WITH` (CTE) — name an intermediate query for reuse and readability without assuming it is inherently faster than an inline subquery
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application

---

### Schema operations

- `CREATE TABLE` — defines columns, data types, defaults, and constraints together; read the full definition before loading data because the database, not the application, enforces it
- `ALTER TABLE` — evolves an existing table by adding, changing, or dropping columns and constraints; versioned migration tooling belongs to the application stack, while SQL owns the resulting schema change ✅ 07-timetrack
- `DROP` vs deleting rows — `DROP` removes the database object itself, whereas `DELETE` and `TRUNCATE` keep the table and remove data
- `DEFAULT` — supplies a value only when an insert omits the column; it does not replace an explicitly inserted `NULL`, and it does not backfill old rows unless the schema change does so ✅ 07-timetrack

---

### Working with an existing database

- Schema inspection — use a SQL client's object browser and `information_schema` or PostgreSQL catalog views to discover columns, types, nullability, keys, and constraints before querying an unfamiliar database
- Database schemas and qualified relation names — schemas namespace objects inside a database; recognise `schema.table` and the role of the search path when inherited code resolves the wrong table or cannot find a relation
- Syntax and name-resolution errors — use the reported position and identifiers to fix malformed syntax, missing relations or columns, and ambiguous references
- Type and constraint errors — distinguish failed casts or incompatible operators from `NOT NULL`, `UNIQUE`, `CHECK`, and foreign-key violations
- `GRANT` and `REVOKE` recognition — understand that roles receive object privileges such as `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, and that application connections should not require superuser access ✅ 07-timetrack — the app connects as the non-superuser role `timetrack_app`, which owns only the `timetrack` database; `postgres` is never used at runtime
- Stored-procedure recognition — maintained databases can expose named server-side routines; writing complex procedural SQL is project-specific rather than a junior floor
- Trigger recognition — DML can automatically execute trigger logic that is not visible in the application statement, so inspect triggers when an insert, update, or delete has unexpected side effects

---

### DML — modifying data

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty ✅ 07-timetrack
- Multi-row `INSERT` — supply several value tuples in one statement so the rows are inserted in a single round trip and a single implicit transaction
- `INSERT ... SELECT` — populate a table from the result of a query, matching target columns to result columns by position and compatible type
- `RETURNING` — obtain generated or changed values from a PostgreSQL data-modification statement without a second query
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

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assign a deterministic sequence within each partition, such as selecting one latest row per group in an outer query
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- Aggregate result vs window result — `GROUP BY` collapses each group into one row, while an aggregate with `OVER` preserves every input row and adds a value calculated over its window
- `DISTINCT ON` vs `ROW_NUMBER() = 1` — both answer "one latest row per group"; `DISTINCT ON` is shorter but PostgreSQL-only and ties its result to `ORDER BY`, while the window form is portable and can keep the rank as a column or take more than one row per group

---

### Schema design

- Primary key — one optional table constraint, possibly composite, that uniquely identifies rows;
  application tables normally define one even though SQL does not require every table to have it ✅ 07-timetrack
- Primary key vs `UNIQUE` constraint — both reject duplicates and both can be composite, but a table has at most one primary key, its columns are implicitly `NOT NULL`, and it is what foreign keys reference by default; a `UNIQUE` column can stay nullable and a table may carry several
- Foreign key — one or more columns referencing a primary or other unique candidate key;
  PostgreSQL rejects values with no referenced row, enforcing referential integrity ✅ 07-timetrack
- `ON DELETE` behavior — PostgreSQL defaults to `NO ACTION`; `RESTRICT` also rejects referenced-row deletion but cannot be deferred, `CASCADE` deletes dependent rows, and `SET NULL` clears a nullable foreign key ✅ 07-timetrack
- `ON UPDATE` behavior — the same referential actions apply when the referenced key value itself changes; it is nearly invisible with surrogate keys that never change, which is exactly why an inherited `ON UPDATE CASCADE` on a natural key is easy to misread
- `NOT NULL` constraint — reject missing values for fields whose domain contract requires a value ✅ 07-timetrack
- `UNIQUE` constraint — rejects duplicate non-`NULL` keys and creates a supporting unique B-tree index; PostgreSQL permits multiple `NULL` values by default unless `NULLS NOT DISTINCT` is requested ✅ 07-timetrack
- Composite uniqueness — a `UNIQUE` constraint across several columns enforces a business rule on the combination, such as one membership per `(user_id, project_id)`
- Constraint vs application-side uniqueness check — a `SELECT` that finds no duplicate followed by an `INSERT` is two statements, so a concurrent session can pass the same check and both rows land; only the constraint decides atomically, which makes the application check a friendlier error message rather than the guarantee, and makes `ON CONFLICT` one concrete way of handling the constraint's verdict
- `CHECK` constraint and `NULL` — a check rejects `FALSE` but accepts `TRUE` or `UNKNOWN`, so `CHECK (hours > 0)` still needs `NOT NULL` when hours are required
- One-to-many relationships — place the foreign key on the many side so each child references one parent while a parent can own several children ✅ 07-timetrack
- Many-to-many relationships — use a junction table with two foreign keys and usually a composite uniqueness rule so each pair appears only once
- Natural vs surrogate keys — a surrogate key gives the row a stable technical identity, while a natural business key still needs a `UNIQUE` constraint when the domain says it cannot repeat ✅ 07-timetrack
- Normalization and data anomalies — store each fact in the relation determined by its key so inserts, updates, and deletes do not require inconsistent copies; formal normal-form analysis belongs to middle
- Reading a relational schema — identify each table's grain, primary key, foreign keys, nullability, and relationship cardinality before constructing a query

---

### Data types

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- `CHAR(n)` blank padding — a fixed-length column stores every shorter value padded with trailing spaces, then ignores those spaces when comparing and when reporting `length()`; expect it in inherited Oracle and legacy schemas rather than choosing it for new columns
- Integer identity columns vs `SERIAL` — `GENERATED ... AS IDENTITY` is the SQL-standard PostgreSQL choice for generated integer keys; `SERIAL` is legacy shorthand that creates a separate sequence and default, while `BIGINT`/`BIGSERIAL` widen the range
- `NUMERIC(p,s)` vs `FLOAT` — choose exact fixed-precision decimals for money and approximated floating-point values for measurements that tolerate representation error ✅ 07-timetrack
- Integer division and explicit casts — integer divided by integer truncates the fractional part in PostgreSQL; cast an operand to `NUMERIC` when the result must retain decimals
- `ROUND(value, n)` — rounds to a given number of decimal places, but only for `NUMERIC`; PostgreSQL has no two-argument `ROUND` for `double precision`, so a computed average usually needs an explicit cast before a report can round it ✅ 07-timetrack — the three report queries in `TimeEntryRepository` round their aggregate with `round(SUM(te.hours), 2)`, which is what fixes the scale every report endpoint serves
- Scale of an expression's result — `NUMERIC` scale propagates outwards through an expression, and a literal fallback carries its own, so `COALESCE(SUM(x), 0)` answers with the summed column's scale when rows exist and with scale 0 when none do; a rounding rule must therefore wrap the whole expression rather than one of its operands ✅ 07-timetrack — the summary query writes `round(COALESCE(SUM(...), 0), 2)`, so a month with no entries answers `0.00` instead of the scale-0 `0` the fallback alone would give
- `DATE` vs `TIMESTAMP` / `TIMESTAMPTZ` — use `DATE` for a calendar value with no time of day, `TIMESTAMP` for a local wall-clock value, and `TIMESTAMPTZ` for an instant shared across time zones ✅ 07-timetrack
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does
  not generally treat an unquoted integer `1` as a boolean
- `JSONB` recognition — stores validated JSON in a binary representation that supports PostgreSQL operators and indexes; keep relational columns for stable fields that need ordinary constraints and joins

---

### PostgreSQL specifics

- Standard SQL vs vendor extensions — prefer portable constructs for transferable query logic and use PostgreSQL-specific syntax deliberately when its benefit justifies the coupling
- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `EXTRACT` — returns one date/time field such as year, month, or hour for filtering or reporting; use it deliberately because applying a function to an indexed column can prevent a simple index condition
- `NOW()` vs `CURRENT_DATE` — both are fixed at the start of the current transaction rather than re-read per statement, so neither advances inside a long transaction; the difference is the returned type, a full timestamp against a date with no time component
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years

---

### Common string functions

- `||` string concatenation — combine text expressions into one output value while accounting for `NULL` propagation
- `LOWER` and `UPPER` — normalise case for display or comparison while recognising that applying them to a column can affect ordinary index use
- `TRIM` — removes leading and trailing characters, whitespace by default, without changing whitespace inside the value
- `LENGTH` — counts characters in text rather than bytes, which matters for non-ASCII data
- `SUBSTRING` — extract a positional part of a string for query shaping rather than to repair badly modelled data
- `REPLACE` — substitute every occurrence of matching text within a value, without regard to word boundaries

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

- Bound parameters — keep SQL structure separate from runtime values through prepared-statement or framework placeholders, preserving correct typing and reusable statement structure ✅ 07-timetrack
- Query construction from a business question — decide the result grain first, then identify tables, join paths, filters, grouping, and ordering before writing syntax
- Incremental query debugging — inspect a small sample after each join, filter, and aggregation, and predict the expected row count so errors are found where they enter
- Report-total verification — compare complex report totals with simpler control queries at the intended grain before trusting the result
- Join-review failures — detect accidental Cartesian products, incorrect cardinality, and `DISTINCT` used to hide row multiplication
- Predicate-review failures — detect `NULL` comparisons, unsafe value interpolation, and date ranges that omit boundary rows
- Mutation-review failures — detect unbounded `UPDATE` or `DELETE` statements and verify the intended affected-row set before execution
- Pagination-review failures — require deterministic ordering and recognise when large `OFFSET` values make a different pagination strategy necessary

## Git

### Repository model and everyday inspection

- Git vs GitHub or GitLab — Git records distributed repository history; hosting platforms add remote storage, pull requests, permissions, and collaboration services
- Distributed repository model — each normal clone contains local history and can create commits without a network connection
- `git init` vs `git clone` — initialise a new local repository or copy an existing repository with its remote configuration and remote-tracking references ✅ 01-todo-list
- Working tree, index, and `HEAD` — distinguish current files, the staged next snapshot, and the currently checked-out commit ✅ 01-todo-list
- Snapshot and parent model — a commit identifies a staged project snapshot plus parent links rather than storing a simple chronological edit log
- Tracked, untracked, and ignored files — recognise whether Git already follows a path, has not added it, or excludes it through ignore rules
- Clean, unstaged, staged, and untracked states — read `git status` before deciding which inspection or mutation command is safe ✅ 01-todo-list
- `git diff` vs `git diff --staged` — inspect unstaged working-tree changes or the exact staged changes prepared for the next commit ✅ 01-todo-list
- Revision and branch comparison with `git diff` — compare two snapshots directly and use `base...feature` to diff the merge base against the feature tip
- `git add` and path scope — stage only intended files, directories, or pathspecs instead of accidentally including unrelated work ✅ 01-todo-list
- `git add -p` — select individual hunks to construct focused commits and exclude debug, formatting, or secret changes
- File deletion and rename tracking — stage removals and moves deliberately while recognising that `git mv` is a convenience and Git infers renames from content
- `git commit` — create a new snapshot from the index, not automatically from every modified working-tree file ✅ 01-todo-list
- `git log --oneline --graph --decorate --all` — read compact history, branch topology, and reference positions ✅ 01-todo-list
- `git log -- <path>` — trace the history that affected a specific file without treating unrelated commits as evidence
- `git show <commit>` — inspect one commit's metadata and patch to understand exactly what it introduced
- Revision selection — use commit hashes, branch names, tags, and `HEAD` to identify commits for inspection or operations
- Ancestry notation — read parent and first-parent-relative expressions such as `HEAD^` and `HEAD~2` without confusing them with branch names
- `git blame` with history inspection — use line attribution to find the introducing context, then inspect the relevant commit rather than assigning personal blame

### Commit discipline

- Atomic commits — keep one coherent change independently reviewable and revertible instead of mixing unrelated work ✅ 01-todo-list
- Selective staging before commit — inspect and stage the intended scope so generated files, secrets, and drive-by edits do not enter history ✅ 01-todo-list
- Meaningful commit messages — write concise imperative subjects and add decision context when the reason is not evident from the change ✅ 01-todo-list
- Conventional Commits — recognise `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, and related types when the repository adopts that convention ✅ 01-todo-list

### User and repository configuration

- Git configuration scopes — distinguish system, global, and local settings and use repository-specific overrides when appropriate
- Author vs committer identity — configure `user.name` and `user.email` deliberately and recognise that rebasing or cherry-picking can preserve the author while recording a different committer ✅ 01-todo-list
- Line-ending policy — recognise CRLF/LF noise and follow repository configuration such as `.gitattributes` instead of committing mass rewrites
- Executable-bit changes — recognise permission-only diffs and avoid accidental file-mode changes across operating systems
- Signed Git objects awareness — recognise verified commit or tag requirements without treating signing infrastructure or hosting branch protection as junior ownership

### Branches, `HEAD`, and integration

- Branch reference — understand a branch as a movable name for a commit rather than a copy of the project ✅ 01-todo-list
- `HEAD` and the current branch — know that `HEAD` normally refers through the checked-out branch and moves when that branch gains a commit ✅ 01-todo-list
- Detached `HEAD` — recognise checkout at a commit rather than a branch and create or switch to a branch before work becomes difficult to retain
- `git branch` operations — create, list, rename, and delete local branch references deliberately ✅ 01-todo-list
- `git switch` vs branch-oriented `git checkout` — change branches while recognising the newer focused command and the older multi-purpose command
- Correct branch base — update and verify the intended base before creating a feature branch so it does not begin from stale or unrelated history
- Safe branch deletion — use `git branch -d` for merged work and treat `-D` as a deliberate discard that requires prior verification
- Fast-forward vs three-way merge — distinguish moving a branch reference forward from creating a merge commit from divergent histories ✅ 01-todo-list
- Merge commit parentage — recognise that a true merge commit normally has two parents and preserves the integration point
- `git merge` vs `git rebase` — choose history-preserving integration or private-history replay according to repository policy and collaboration risk
- Rebase mechanics — understand that Git replays commits onto a new base, creates new commit identities, and can pause once per replayed commit
- Shared-history rebase rule — do not rebase commits other people may have based work on without explicit coordination
- Interactive rebase — recognise squash, reword, reorder, and drop as private-history cleanup operations before sharing
- Stateful-operation controls — use `git status` to identify an in-progress merge, rebase, cherry-pick, or revert before choosing the matching continue, skip, or abort action
- `git cherry-pick` — apply one known commit to the current branch for a targeted workflow while recognising the duplicated history and conflict risk
- Lightweight vs annotated tags — recognise a direct commit label versus a tag object with metadata and optional signature, while release-policy ownership remains above junior
- Team branching policy recognition — follow the repository's feature-branch, trunk-based, GitFlow, release, or hotfix convention without treating one workflow as universal ✅ 01-todo-list

### Remotes and synchronisation

- Remote and `origin` — understand a remote as a named repository URL and `origin` as a conventional default name, not a branch or the cloud itself ✅ 01-todo-list
- Clone vs hosting-platform fork — distinguish making a local working copy from creating a server-side repository copy with its own collaboration remotes
- Remote inspection and configuration — list remote names and URLs and add, rename, or change a remote deliberately when diagnosing repository connectivity
- Local branch vs remote-tracking reference — distinguish writable local `main` from the last fetched observation `origin/main`
- Ahead, behind, and diverged tracking states — read whether local, remote, or both histories contain new commits before choosing push or integration
- `git fetch` — update remote-tracking references without integrating them into the current branch
- `git pull` — fetch and then integrate according to the configured merge or rebase policy, so inspect divergence when automatic integration is risky ✅ 01-todo-list
- `git push` — send reachable local objects and request a remote reference update rather than uploading arbitrary working-tree files ✅ 01-todo-list
- Upstream tracking — connect a local branch to its usual remote branch so status, pull, and push can infer their counterpart ✅ 01-todo-list
- Non-fast-forward push rejection — fetch and integrate remote work instead of bypassing the safety check with a blind force push
- Force-push safety — recognise shared-history danger and use `--force-with-lease` only when rewriting an explicitly authorised private branch

### Pull requests and hosted review

- Feature branch and pull-request flow — push isolated work, open a review request, address feedback, validate updates, and merge under repository policy ✅ 01-todo-list
- Pull request vs Git — recognise pull or merge requests as hosting-platform review objects built around Git branches and commits ✅ 01-todo-list
- Pull-request merge strategies — distinguish merge commit, squash merge, and rebase merge by their effect on final history
- Required reviews and status checks — recognise when branch protection blocks a merge, inspect failed checks, and update the same pull-request branch before trying again
- Diff-based code review — verify intended behaviour, tests, edge cases, secrets, generated files, format churn, and unrelated scope before approving
- Review-update strategy — add focused follow-up commits or perform policy-approved private cleanup without rewriting shared history unexpectedly
- Remote branch deletion — distinguish deleting a branch on the remote from deleting its local counterpart
- Remote-tracking cleanup — prune stale remote-tracking references after confirming their remote branches no longer exist
- Authentication failures vs history problems — separate HTTPS token or credential-helper and SSH-key permissions from merge, divergence, and push-history errors

### Conflict resolution

- Conflict causes — recognise incompatible edits such as same-region changes, modify/delete cases, renames, or competing file additions that Git cannot combine safely
- Conflict markers — read `<<<<<<<`, `=======`, and `>>>>>>>` as competing sides while using surrounding intent rather than choosing markers mechanically
- Conflict-resolution lifecycle — edit the correct result, remove markers, stage resolved paths, continue or commit the operation, and run relevant validation afterward
- Merge vs rebase conflict context — account for the operation when interpreting current and incoming sides because replay can invert an intuitive `ours`/`theirs` assumption
- Abort semantics — use the operation-specific abort command to return as closely as possible to the pre-operation state when resolution should not continue
- Conflict prevention — keep branches short-lived, integrate the target regularly, coordinate overlapping work, and review the diff before sharing

### Undo, recovery, and investigation

- `git restore` vs legacy path checkout or reset — use the focused command to restore working-tree content or unstage index changes while recognising older `git checkout -- <path>` and `git reset <path>` instructions
- Path restoration from a selected revision — use `git restore --source=<revision> -- <path>` to recover one path from a known snapshot without moving the branch or changing unrelated work
- `git reset --soft`, `--mixed`, and `--hard` — move the current branch when `HEAD` is attached, or `HEAD` itself when detached, while retaining changes staged, retaining them unstaged, or discarding tracked working-tree and index changes
- `git reset` vs `git revert` — rewrite a local reference or create an additive inverse commit, preferring revert for published shared history
- `git commit --amend` — replace the latest local commit's content or message and recognise that the commit identity changes
- `git reflog` recovery — locate recent local reference movements after reset, rebase, or branch deletion while treating retention as a recovery window, not durable backup
- `git bisect` basics — mark known good and bad points so binary search can isolate the first commit that introduced a reproducible regression
- `git reset --hard` vs `git clean` — distinguish discarding tracked index and working-tree changes from deleting untracked paths
- `git clean` preview and scope — use dry-run before selecting untracked directories or ignored paths for irreversible deletion
- Destructive-command risk — inspect scope and recoverability before `reset --hard`, `clean`, forced deletion, or history rewriting

### Temporary work

- `git stash` — save selected uncommitted state for a short context switch rather than use the stash as permanent storage
- `git stash list` and `git stash show` — identify saved entries and inspect their contents before restoration
- `git stash apply` vs `git stash pop` — restore while retaining the stash entry or restore and remove it only after a successful application
- Stashing untracked files — recognise that ordinary stash behaviour may omit untracked paths unless they are included deliberately
- Stash conflicts and cleanup — resolve application conflicts like other working-tree conflicts and drop entries only after confirming the work is retained

### Ignore and history boundaries

- `.gitignore` scope — prevent matching untracked paths from being offered for addition without assuming it removes files already tracked ✅ 02-weather-app
- Ignore patterns and negation — apply directory, wildcard, anchored, and `!` exception rules carefully because parent-directory exclusion affects reinclusion
- Generated-path policy — ignore build output, dependencies, and local IDE state according to the repository's actual toolchain ✅ 01-todo-list
- Local secret-file exclusion — ignore environment and credential files so they are not accidentally added, while recognising ignore rules are not a secret store ✅ 02-weather-app
- Already tracked ignored file — remove the path from the index when appropriate because adding a later ignore rule does not stop tracking it
- Committed-history boundary — deleting or ignoring the current file does not erase sensitive content from existing commits

## General

### HTTP requests and resource semantics

- Client–server request/response model — trace how a client sends a request and receives a response without treating either framework as the protocol itself ✅ 02-weather-app
- URL anatomy — distinguish scheme, host, port, path, query, and fragment so an incorrect endpoint can be diagnosed precisely ✅ 02-weather-app
- URI vs URL — distinguish a resource identifier from the subset that also describes where and how to access it
- REST resource and representation model — model domain resources behind representations instead of treating endpoint paths as remote procedure names ✅ 07-timetrack
- Collection vs item URI — use stable noun-based paths to distinguish a resource collection from one identified member ✅ 07-timetrack
- HTTP methods — choose `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` from the intended resource operation rather than from habit ✅ 07-timetrack
- Safe vs idempotent methods — safe methods do not request a state change, while repeating an idempotent request has the same intended effect as sending it once ✅ 07-timetrack
- `PUT` vs `PATCH` — use PUT to replace the target resource state with the submitted representation and PATCH for a partial modification, following the API contract's omitted-field rules ✅ 07-timetrack
- Path parameters vs query parameters vs request body — use the path for resource identity, the query for optional selection or representation controls, and the body for a submitted representation ✅ 07-timetrack
- HTTP headers and body — keep request metadata in headers and the submitted representation in the body ✅ 07-timetrack
- `Content-Type` vs `Accept` — declare the media type being sent separately from the response media types the client can process
- Stateless HTTP — understand that HTTP defines no conversational session while an application may carry state in each request or look it up through an identifier such as a session cookie ✅ 07-timetrack
- Cookie and session mechanics — recognise `Set-Cookie` as the response instruction that stores browser state and `Cookie` as the later request header that returns it, while security attributes remain a Security concern
- HTTPS vs HTTP — recognise that HTTPS applies TLS protection to HTTP traffic in transit while HTTP alone provides no transport encryption
- Basic web request path — recognise DNS resolution, connection to a host and port, TLS negotiation for HTTPS, and the later HTTP exchange as distinct failure points

### HTTP responses, failures, and caching

- HTTP status-code families — use 1xx, 2xx, 3xx, 4xx, and 5xx as protocol-level categories before inspecting the application error body ✅ 07-timetrack
- `200 OK`, `201 Created`, and `204 No Content` — select the success status from whether the operation returns a representation, creates a resource, or intentionally returns no body ✅ 07-timetrack
- `Location` on a `201` — when supplied, the header identifies a primary resource created by the request so the client need not assemble its URI from a copied route scheme ✅ 07-timetrack
- `400 Bad Request` vs `422 Unprocessable Content` — recognise 400 as a broad perceived client-request error and 422 as understood media type and syntax whose instructions cannot be processed, while following the API's documented convention
- `401 Unauthorized` vs `403 Forbidden` — distinguish missing or invalid authentication from an authenticated identity lacking permission ✅ 07-timetrack
- `404 Not Found` vs `409 Conflict` — distinguish an absent resource from a request that conflicts with current resource state ✅ 07-timetrack
- `500 Internal Server Error` vs `503 Service Unavailable` — distinguish an unexpected server failure from temporary inability to serve the request
- Redirect semantics — recognise that 3xx responses point the client elsewhere and that method-preserving redirects differ from redirects commonly followed as GET
- HTTP caching basics — recognise freshness directives, validators such as ETags, and conditional requests without treating caching as an automatic performance fix
- Timeouts and retries — bound waiting and retry only when the operation and failure mode make repetition safe, adding idempotency controls when required
- Transport vs protocol vs application failure — separate inability to connect, an HTTP error status, and a successful HTTP response whose domain result is unsuccessful
- API-call debugging workflow — inspect URL, method, status, headers, and body before blaming client or server framework code
- Same-origin and CORS recognition — identify an origin from scheme, host, and port and distinguish a browser-enforced CORS or preflight failure from an HTTP response produced by application logic ✅ 07-timetrack
- Collection query contract — define filtering, sorting, pagination inputs, stable ordering, and response metadata so clients can navigate a changing collection predictably ✅ 07-timetrack

### JSON and API contracts

- Relational vs NoSQL database families — recognise document and key-value models while choosing a relational database when joins, constraints, and transactions fit the data
- JSON value model — recognise objects, arrays, strings, numbers, booleans, and `null`, with double-quoted object keys and no trailing commas
- JSON object vs array — distinguish a named property collection from an ordered value collection when reading or designing a payload
- Missing field vs explicit `null` — treat absence and an explicit null value as separate contract states unless the API defines them as equivalent ✅ 07-timetrack
- JSON limitations — recognise that JSON has no native date, `undefined`, binary, or distinct integer type, so an API must define representations for them
- Serialization vs deserialization — distinguish converting an in-memory value to a transport representation from reconstructing a value from that representation ✅ 07-timetrack
- Contract naming and type mismatches — diagnose failures caused by different property names, nesting, nullability, or expected value types across a boundary
- Date and time representation — agree an explicit interoperable string format and time-zone meaning instead of relying on environment-specific parsing ✅ 07-timetrack
- OpenAPI recognition — read operations, parameters, schemas, responses, and examples in a machine-readable HTTP API contract
- OpenAPI specification vs interactive documentation — distinguish the contract document from tools such as Swagger UI that render and exercise it
- API client tools — use Postman or `curl` to inspect and reproduce an HTTP exchange without treating a successful manual request as complete automated verification ✅ 07-timetrack

### Error handling and diagnostics

- Error propagation — let a failure travel to a boundary that can add context or choose a response instead of swallowing it or catching and rethrowing without value ✅ 07-timetrack
- Local error recovery — substitute a fallback only when it is semantically honest; converting every failure into empty data fabricates success
- Error message vs diagnostic detail — give consumers a stable safe message while preserving technical context for diagnosis ✅ 07-timetrack
- Exception vs log — understand that an exception changes control flow while a log records an event without handling it ✅ 07-timetrack
- Structured logging — record searchable fields and context rather than relying on unstructured print statements
- Log levels — choose `DEBUG`, `INFO`, `WARN`, or `ERROR` from operational meaning rather than using one level for every event ✅ 07-timetrack
- Reproducible debugging — establish reliable steps and the smallest failing input before changing code so the effect of a fix can be verified
- Boundary isolation — reduce a failure to the client, network, API, persistence, or external dependency before investigating implementation detail
- Stack trace and cause chain — read the failure type, message, frames, and nested causes from the first relevant application frame outward
- Breakpoints and variable inspection — pause execution at a suspected path and compare actual state and control flow with the expected behaviour
- Fix verification — rerun the original reproduction and a relevant regression check instead of treating disappearance during one manual attempt as proof
- Logs vs metrics vs traces — distinguish event records, measurements over time, and the path of one request across components without requiring junior ownership of an observability platform

### AI-assisted change verification

- AI-generated change verification — treat generated code, tests, and configuration as untrusted proposals whose APIs, assumptions, edge cases, and meaningful checks must be validated before acceptance

### Software testing

- Big O recognition — compare constant and linear growth in ordinary collection operations while remembering that real input sizes and constants still matter

- Unit test — verify a small behaviour boundary quickly and isolate collaborators only when that keeps the test focused
- Integration test — verify selected real components working together across a meaningful boundary
- End-to-end test — verify a critical user journey through a complete running application surface with the highest realism and cost
- Test-level selection — choose unit, integration, or end-to-end scope from the risk being proved rather than using one level for every defect
- Testing pyramid — use many focused tests and fewer broad expensive tests as a trade-off heuristic, not a mandatory numeric ratio
- Arrange–Act–Assert vs Given–When–Then — recognise equivalent structural and domain-oriented ways to separate setup, behaviour, and verification
- Meaningful assertion — verify an observable result or interaction that would fail if the behaviour regressed, not merely that code executed
- Test setup and teardown — create the required starting state and clean shared resources without hiding the scenario behind excessive fixtures
- Test isolation and order independence — make each test establish its own state so running it alone or in another order produces the same result
- Deterministic tests — control time, randomness, network, and mutable external data when they would make the same test alternate between pass and fail
- Happy-path, boundary, invalid-input, and error-path tests — select representative cases that expose different failure modes rather than multiplying similar examples
- Regression test — preserve a previously failing scenario so the same defect cannot return unnoticed
- Mock vs stub — use a stub to supply controlled responses and a mock when interaction verification is part of the behaviour contract
- State-based vs interaction-based verification — prefer observable state or output unless the collaborator call itself is the required outcome
- Flaky test — identify a test whose result changes without a relevant code change and fix the nondeterministic cause instead of normalising retries
- False positive vs false negative — distinguish a test that passes despite a defect from one that fails despite correct behaviour
- Coverage percentage vs test quality — use coverage to find unexecuted code, never as proof that assertions are meaningful or risks are covered
- Vacuous-test review — detect missing assertions, assertions unrelated to the action, and mocks that only confirm their own setup

### Configuration and environments

- Configuration vs code — keep environment-dependent values outside program logic so the same artifact can run in different contexts ✅ 07-timetrack
- Configuration sources — recognise environment variables, configuration files, and command-line inputs and determine which value wins when sources overlap ✅ 07-timetrack
- Required configuration and fail-fast startup — reject a missing mandatory value early with a clear diagnostic rather than failing later in unrelated code ✅ 07-timetrack
- Optional-component activation as required configuration — a component enabled only by a named profile, flag, or mode leaves startup succeeding while the capability it provides is simply absent, so the runtime contract states which activations a working instance needs and not only which values must be present ✅ 07-timetrack — `DataInitializer` is `@Profile("dev")`, so a boot without that profile starts clean, seeds no manager, and leaves every login 401
- Default configuration — provide a default only when it is safe and semantically valid for every context where it may be used
- Development, test, staging, and production — use each environment for a distinct confidence level without assuming staging is an exact copy of production
- Build-time vs runtime configuration — distinguish values embedded while producing an artifact from values supplied when that artifact starts ✅ 02-weather-app
- Configuration parity — keep environment differences explicit and minimal so deployment failures are not caused by hidden local assumptions
- Example environment file — document required variable names with safe placeholder values without committing real credentials
- Effective-configuration debugging — compare the value actually used in each environment rather than assuming the intended source won

### Containers and local runtime

- Container vs virtual machine — distinguish an isolated process sharing the host kernel from a virtualised machine with its own guest operating system
- Image vs container — distinguish an immutable packaged blueprint from a running instance with a writable runtime layer
- `Dockerfile` vs Compose file — use a Dockerfile to build one image and Compose to define how multiple containers run together
- Build vs run — separate producing an image from starting a container from that image
- Container lifecycle — choose stop/start or restart for the same container, recreate it for changed runtime configuration, and rebuild its image for changed packaged content
- Exposed vs published container port — distinguish image metadata documenting an intended container port from the runtime mapping that makes a container port reachable through a host port
- Container service discovery — use the Compose service name between containers and recognise that `localhost` always means the current container
- Bind mount vs named volume — choose direct host-file access or Docker-managed persistent storage from the development and data-lifecycle need
- Ephemeral vs persistent container data — recognise what disappears with a container and what must live in a volume or external service
- Container environment variables — inject runtime configuration instead of baking environment-specific values into a reusable image
- Container logs — inspect process output through the container runtime when no interactive terminal or debugger is attached
- Compose dependency and readiness — recognise that start order does not prove a dependency is ready to accept traffic
- Health-check awareness — use a health signal to report whether a service can perform its required work rather than merely whether its process exists
- Containerised-stack debugging — inspect container status, logs, ports, service names, configuration, networks, and volumes before rebuilding blindly
- Reproducible local stack — document enough build, configuration, and data-startup information for another developer to run the same services

### Software delivery lifecycle and CI/CD

- Software delivery lifecycle vs CI/CD pipeline — trace a change from requirement through maintenance while recognising that CI/CD automates only part of that broader lifecycle
- Continuous integration — integrate small changes frequently into a shared codebase and verify them automatically before or after merge to expose integration failures early
- Continuous delivery vs continuous deployment — distinguish keeping every pipeline-accepted change releasable from automatically releasing changes that pass the automated delivery path
- Deployment vs release — distinguish placing an artifact in an environment from making its functionality available to users
- Pipeline triggers and execution environments — recognise push, pull-request, merge, schedule, and manual triggers and diagnose jobs inside their isolated configured environment rather than assuming local-machine state
- Pipeline stages — trace checkout, build, test, package, image, and deploy stages and identify which stage produced a failure
- CI platform recognition — recognise Jenkins, GitLab CI, and GitHub Actions as tools that execute repository-defined pipelines without treating one vendor's syntax as the CI/CD concept itself
- Build artifact — treat an identifiable, traceable build output as the input promoted through later checks and environments
- Pipeline result limits — recognise that a green pipeline proves only the checks it actually ran, not that the product is defect-free

### Agile and team delivery

- Agile iterative and incremental delivery — distinguish repeating a feedback cycle from delivering the product in usable slices
- Scrum roles — recognise the accountabilities of Product Owner, Scrum Master, and Developers without turning role recognition into certification detail
- Scrum events — distinguish planning, daily Scrum, review, and retrospective by the decision or feedback each event supports
- Sprint vs increment — distinguish the fixed iteration from the usable product result created during it
- Product backlog vs sprint backlog — distinguish the ordered product work from the selected work and plan for the current sprint
- User story vs acceptance criteria — separate a statement of user value from the testable conditions that define acceptable behaviour
- Acceptance criteria vs Definition of Done — distinguish item-specific behaviour from the shared quality gate applied to completed work
- Kanban flow vs Scrum cadence — recognise continuous flow with work-in-progress limits as a different control model from time-boxed sprints
- Work-in-progress limit awareness — limit simultaneous work to expose bottlenecks and finish items instead of maximising task starts

### Cloud awareness

- Cloud-hosted vs on-premises infrastructure — distinguish provider-operated infrastructure from systems run in an organisation's own facilities without assuming either model removes operational responsibility
- Cloud resource and location awareness — recognise managed compute, storage, networking, databases, regions, and availability zones together with the customer responsibilities that a managed service does not remove
