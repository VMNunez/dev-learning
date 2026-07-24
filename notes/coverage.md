# Global Coverage — All Topics

Combined minimum coverage for every topic in the notes folder.
Source files: one `coverage.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
Order follows study priority: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

# Minimum Coverage â€” Angular

Minimum hiring floor for a junior or junior-mid Angular developer targeting Spanish consultancies in 2026.
Items are ordered by filtering risk and cover both modern Angular and the legacy patterns common in maintained enterprise codebases.

### Components and template data flow

- Standalone `@Component` â€” explain how Angular turns a class, template, and styles into a self-contained UI unit with directly declared dependencies
- Component `imports` â€” identify where a standalone template gets its directives, pipes, and child components; a missing import is a common practical-test failure
- Interpolation vs property binding â€” distinguish string rendering with `{{ }}` from assigning a DOM or component property with `[]`
- Event binding â€” handle a template event with `()` and explain why the template delegates behaviour to the component class
- Two-way binding â€” recognise `[()]` as property plus event binding and decide when explicit one-way data flow is clearer
- `model()` â€” expose a writable child value with its matching change output when a reusable component genuinely owns two-way binding
- `input()` vs `input.required()` â€” model optional and mandatory parent-to-child data without hiding absence behind an unsafe default
- `output()` â€” send typed child events to a parent without making the child depend on the parent's implementation
- `@if` vs `@switch` â€” choose branching conditions or fixed-value cases so mutually exclusive UI states remain readable
- `@for` and `track` â€” render collections with stable identity so Angular can reuse DOM nodes instead of recreating them
- Content projection with `ng-content` â€” recognise when a reusable wrapper should receive markup rather than a growing list of configuration inputs
- Components vs attribute directives â€” use a component when behaviour owns a view and a directive when behaviour augments an existing host element

### Lifecycle and dependency injection

- Angular dependency injection â€” explain that an injector creates and supplies dependencies so classes depend on contracts and configured providers rather than constructing collaborators themselves
- `@Injectable({ providedIn: 'root' })` â€” recognise an application-wide service and the state-leak risk of keeping request- or component-specific mutable state in a singleton
- `inject()` vs constructor injection â€” recognise both supported injection styles and choose consistently without confusing construction with lifecycle work
- Provider scope â€” distinguish root and component providers because the provider location controls whether consumers share or receive separate service instances
- `constructor` vs `ngOnInit` â€” reserve construction for dependency setup and use `ngOnInit` for initialisation that depends on Angular-bound inputs
- `ngOnChanges` â€” react when decorator or signal inputs change and read `SimpleChanges` without assuming `ngOnInit` runs again
- View queries and `ngAfterViewInit` â€” treat `ngAfterViewInit` as the normal safe point for decorator queries while recognising static and signal-query timing differences
- Destruction cleanup â€” tie `ngOnDestroy` or `DestroyRef` callbacks to component destruction so timers, listeners, and subscriptions do not outlive the view

### Signals and local state

- `signal()` â€” hold reactive local or service state and read it by calling the signal rather than treating it as a plain value
- `set()` vs `update()` â€” replace state directly or derive the next immutable value from the previous one
- `computed()` â€” derive read-only state from signals so the value stays consistent without manual synchronisation
- `effect()` â€” perform an external side effect when dependencies change and avoid using it as a writable substitute for derived state
- `computed()` vs `effect()` â€” choose a returned derived value for UI state and an effect only for synchronisation with an external system
- Signal reference vs snapshot â€” preserve a live signal reference when reactivity is required; storing `service.value()` once creates a stale snapshot
- Immutable updates with signals â€” replace object or array references so state changes remain predictable across signals and `OnPush` views
- `signal()` vs `computed()` â€” keep writable source state in a signal and expose read-only derivations through a computed signal

### HTTP integration

- Typed `HttpClient` requests â€” call REST endpoints with typed response bodies while recognising that the generic type checks TypeScript code but does not validate runtime JSON
- `HttpParams` immutability â€” build query parameters from returned instances; calling `set()` without reassigning silently leaves the original params unchanged
- Cold HTTP Observables â€” recognise that each subscription to an `HttpClient` Observable sends a request, so accidental duplicate subscriptions can duplicate network calls

### RxJS streams and pipelines

- `Observable` vs `Promise` â€” compare stream composition and cancellation with a single eventual Promise while recognising that Observables may be cold or hot and may emit once or many times
- `subscribe()` callbacks â€” handle next and error outcomes deliberately and keep presentation state consistent after a failed request
- `map()` vs `tap()` â€” transform emitted data with `map()` and reserve `tap()` for observation or side effects
- `switchMap()` â€” cancel a stale inner request when a newer search term or route value arrives
- Search pipeline operators â€” combine `debounceTime()`, `distinctUntilChanged()`, and `switchMap()` to avoid premature, duplicate, and stale requests
- `catchError()` â€” recover, translate, or rethrow an error without silently converting every failure into successful empty data
- `async` pipe vs manual subscription â€” prefer template-managed subscription for displayed streams and subscribe imperatively only when a side effect requires it
- Subscription cleanup â€” use the `async` pipe or `takeUntilDestroyed()` for long-lived streams; do not overstate the leak risk of finite `HttpClient` Observables that complete
- `toSignal()` vs manual subscription â€” expose a displayed Observable as signal state while keeping imperative subscription for deliberate multi-step side effects
- `toSignal()` vs `toObservable()` â€” convert in the direction required by the consumer instead of wrapping reactive primitives back and forth without purpose

### Routing and cross-cutting HTTP behaviour

- Router configuration â€” connect `provideRouter`, route definitions, `routerLink`, and `RouterOutlet` into a navigable standalone application
- `ActivatedRoute` params and query params â€” read route identity from `paramMap` and optional Angular view filters from `queryParamMap`
- `ActivatedRoute.snapshot` vs observable params â€” use a snapshot for a one-time value and subscribe when the same component instance can receive later parameter changes
- Lazy route loading â€” use `loadComponent` or `loadChildren` to keep feature code out of the initial bundle until navigation requires it
- `loadComponent` vs `loadChildren` â€” lazy-load one routed component or an entire child route tree according to the feature boundary
- Declarative vs programmatic navigation â€” use `routerLink` in templates and `Router.navigate()` when component logic determines the destination
- Wildcard routes and redirect order â€” place a `**` fallback last because Angular uses first-match-wins route evaluation
- `CanActivateFn` guards â€” return a boolean or `UrlTree` from a guard and avoid triggering a second navigation with an imperative redirect
- Route guards vs backend authorisation â€” treat guards as client-side navigation control, never as enforcement of data access
- `CanDeactivateFn` guards â€” protect unsaved form state while recognising that browser or process termination may bypass application navigation
- Functional HTTP interceptors â€” centralise auth headers and shared response handling without swallowing feature-specific errors or creating an interceptor loop

### Reactive forms and template transformation

- `FormControl`, `FormGroup`, and `FormBuilder` â€” model controls and groups explicitly and use the builder as concise construction syntax rather than a different forms model
- Typed reactive forms â€” keep control nullability and value types aligned with the API model so casts do not hide invalid form states
- Built-in validators â€” combine rules such as `required`, `email`, `min`, and `maxLength` at the control boundary
- Custom validators â€” return `null` or a keyed error object from a pure validation function so templates can identify the failed rule
- Validation display state â€” combine invalid state with `touched` or submit state so errors are helpful without appearing before interaction
- `markAllAsTouched()` â€” surface all invalid controls after a submit attempt without changing whether the form is valid
- `setValue()` vs `patchValue()` â€” choose strict full-shape assignment or deliberate partial updates when prefilling edit forms
- `dirty`, `reset()`, and server errors â€” distinguish local edits, reset the saved baseline, and avoid losing backend errors through an immediate validator rerun
- `FormArray` vs `FormGroup` â€” model a dynamic indexed collection separately from a fixed set of named controls
- Built-in vs custom pipes â€” keep pure display transformation in templates and avoid hiding business logic or expensive impure work in a pipe
- Pure vs impure pipes â€” prefer cached pure transformation and recognise that an impure pipe runs on every change-detection cycle
- Form `valueChanges` â€” compose dependent-field and filtering behaviour as an Observable without nesting manual event handlers

### Change detection

- Default change detection and Zone.js awareness â€” explain at a high level why asynchronous work can trigger checks across the component tree in established Angular applications
- `OnPush` change detection â€” recognise the notifications that mark a view for checking and why in-place mutation can leave an input-based view stale
- Signals with `OnPush` â€” explain how a signal read in a template notifies Angular without treating signals as a reason to mutate objects in place
- Production-build verification â€” run a production build because template compilation, budgets, and optimisation can expose failures hidden by the development server

### Testing Angular behaviour

- Vitest vs Jasmine/Karma recognition â€” use the current CLI's Vitest default while reading Jasmine/Karma suites that remain common in maintained consultancy projects
- Test structure and assertions â€” use `describe`, setup hooks, `it`, and meaningful expectations to express behaviour rather than mere object existence
- `TestBed` â€” configure Angular's injection and rendering environment only when the unit needs Angular-managed dependencies
- Service unit tests â€” isolate business or state logic and verify observable outputs, state transitions, and collaborator calls
- Spies and test doubles â€” control a collaborator with `vi.spyOn()` in Vitest or `spyOn()` in Jasmine and assert the interaction without reproducing its implementation
- HTTP tests with `provideHttpClientTesting()` â€” intercept a request with `HttpTestingController`, assert method, URL, and body, then flush the intended response
- `provideHttpClientTesting()` vs `HttpClientTestingModule` â€” use the standalone provider in current code and recognise the deprecated module-based setup in older suites
- HTTP error tests â€” flush an error response and assert the service's observable or state follows the documented failure path
- Component tests â€” verify rendered behaviour and user interaction instead of asserting only that the component can be constructed

### Legacy enterprise code recognition

- `NgModule` â€” read `declarations`, `imports`, `exports`, and `providers` in pre-standalone applications without treating modules as required in new features
- Signal inputs/outputs vs `@Input()`/`@Output()` â€” use current function APIs in new code and recognise decorator plus `EventEmitter` communication in maintained applications
- `*ngIf` vs `@if` â€” read both syntaxes and understand that the modern block syntax does not require importing `NgIf`
- `*ngFor` `trackBy` vs `@for` `track` â€” preserve stable identity in both template generations
- Template-driven vs reactive forms â€” recognise `ngModel` for simple template-owned fields and choose reactive forms for explicit, testable form models
- `Subject` vs `BehaviorSubject` â€” distinguish event broadcasting from state that immediately exposes its latest value to new subscribers
- `Observable` naming and `$` convention â€” read established code that marks streams with a trailing `$` without assuming the convention changes runtime behaviour
- Angular CLI build workflow â€” use generation, development, test, and production-build commands and recognise that a successful dev server does not prove the production build succeeds

---

## Angular Material

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the projects. Angular Material is standard in Spanish consultancies â€” interviewers expect you to have used it in a real app, not just read the docs.

---

### Theming and setup

- `ng add @angular/material` â€” the correct way to install Angular Material; interviewers may ask what it does (adds the package, configures theming, imports fonts and icons in `index.html`)
- `mat.theme()` in `material-theme.scss` â€” the v19+ way to define the app's color palette; interviewers ask why you use this instead of overriding CSS classes directly (CSS variables, upgrade-safe)
- `provideNativeDateAdapter()` in `app.config.ts` â€” required for `MatDatepicker`; missing it causes a runtime error; interviewers test whether you know where providers go in a standalone app

---

### Buttons and icons

- `matButton` variants (`filled`, `outlined`, `elevated`, `tonal`) â€” when to use each; interviewers ask which variant is for the primary action (`filled`) and which for secondary (`outlined`)
- `matIconButton` â€” circle icon-only button used in table rows and toolbars; interviewers ask why you pair it with `aria-label` (no visible text â€” screen readers need the description)
- `matFab` / `matMiniFab` â€” floating action button for the one dominant page action; interviewers ask when you would use FAB vs a regular button
- `<mat-icon>` â€” how Material icons work; icon names come from Google Material Symbols; interviewers may ask how you add an icon to a button and where the font is loaded

---

### Form fields

- `mat-form-field` â€” wrapper that gives Material styling to an input; interviewers ask why it must always contain a control (`matInput` or `mat-select`) and cannot be used alone
- `mat-label` â€” floating label that animates up when the field has focus or a value; interviewers ask what makes it float (focus or non-empty value)
- `matInput` â€” directive on `<input>` or `<textarea>` to style it inside `mat-form-field`; interviewers ask why you write `matInput` on a native `<input>` instead of using a Material component directly
- `mat-error` â€” shows validation error text; interviewers ask when it appears by default (invalid + touched) and how to change that behaviour (`ErrorStateMatcher`)
- `mat-hint` â€” helper text always visible below the field; interviewers ask the difference between `mat-hint` and `mat-error` (hint is always visible; error appears conditionally)

---

### Select and options

- `mat-select` + `mat-option` â€” styled dropdown inside `mat-form-field`; interviewers ask the difference between `value="pending"` (literal string) and `[value]="status"` (property binding from a variable)
- `(selectionChange)` vs `[(value)]` â€” `selectionChange` fires on user pick and requires a method; `[(value)]` is two-way binding and keeps the signal in sync automatically; interviewers ask when to use each
- `mat-optgroup` â€” groups options under a label; interviewers may ask how to visually separate options without disabling them
- `multiple` attribute on `mat-select` â€” makes the value an array; interviewers ask what changes in the form value when `multiple` is enabled

---

### Table

- `mat-table` attribute on `<table>` â€” turns a native table into a Material table; interviewers ask what the four required pieces are (`displayedColumns`, `ng-container matColumnDef`, `*matCellDef`, the two `<tr>` rows at the bottom)
- `matColumnDef` on `ng-container` â€” defines one column; value must match exactly one string in `displayedColumns`; interviewers ask what happens if the name doesn't match (column does not render)
- `*matHeaderCellDef` / `*matCellDef` â€” structural directives that define the header and data cell templates for a column; interviewers ask why both are needed
- `*matHeaderRowDef` / `*matRowDef` â€” render the header row and one data row per item; both reference `displayedColumns`; interviewers ask why you don't need to change these when adding or removing columns
- `*matNoDataRow` â€” empty state row shown when `dataSource` has no items; interviewers ask why `[attr.colspan]="displayedColumns.length"` is used (to span all columns)
- `MatTableDataSource` â€” wrapper around an array that handles sorting, filtering, and pagination; interviewers ask why you use it instead of a plain array (automatic sort + paginate behaviour)

---

### Sorting

- `MatSort` + `MatSortModule` â€” add column sorting to a Material table; interviewers ask the difference between `MatSort` (the class, needed for `@ViewChild`) and `MatSortModule` (the module, needed in the `imports` array)
- `matSort` on `<table>` and `mat-sort-header` on `<th>` â€” `mat-sort-header` goes on the `<th>` element, not on the `ng-container`; a common mistake interviewers test for
- `@ViewChild(MatSort)` in `ngAfterViewInit` â€” interviewers ask why you must connect `dataSource.sort = this.sort` in `ngAfterViewInit` and not in the constructor (template doesn't exist yet in the constructor)
- View encapsulation and `styles.css` â€” sort header internals cannot be styled from component CSS because Angular's scoped attributes don't reach directive-generated elements; global `styles.css` is required; interviewers ask why centering a sort header column from component CSS doesn't work

---

### Paginator

- `MatPaginator` + `MatPaginatorModule` â€” adds page controls to a table; same `@ViewChild` + `ngAfterViewInit` pattern as `MatSort`; interviewers ask why the paginator must be placed outside and after the `</table>` closing tag
- `[pageSize]` + `[pageSizeOptions]` â€” configure default rows per page and the size options the user can pick
- Reset to first page after filter â€” `this.dataSource.paginator.firstPage()` after applying a filter; interviewers ask what happens without it (user stays on the page they were on, which may now be empty)

---

### Dialog

- `MatDialog` service + `MatDialogRef` â€” the two-part system for dialogs; `MatDialog` is injected in the parent to open; `MatDialogRef` is injected in the dialog to close and return data
- `dialog.open(ComponentClass, config)` â€” interviewers ask what the first argument is (the component class itself, not a string or template)
- `afterClosed().subscribe()` â€” where the parent listens for the dialog result; interviewers ask what value is emitted when the user clicks Cancel or clicks outside (`undefined`)
- `MAT_DIALOG_DATA` â€” injection token to read data passed from the parent into the dialog; interviewers ask how the dialog knows it is in add vs edit mode (check if `data` is `null`)
- `patchValue()` vs `setValue()` â€” `patchValue()` fills only the fields you pass; `setValue()` requires all fields; interviewers ask which one to use when pre-filling a dialog for edit
- `mat-dialog-title` / `mat-dialog-content` / `mat-dialog-actions` â€” must be siblings, never nested; interviewers ask what breaks if you nest them (Material applies different padding and scroll to each â€” nesting corrupts the layout)
- `mat-dialog-close` attribute on Cancel button â€” closes the dialog immediately with no data and no TypeScript needed; interviewers ask when you would replace it with a custom `onCancel()` method (when you need to check for unsaved changes)
- `autoFocus: false` in the dialog config â€” prevents the focus ring appearing on the first button when the dialog opens; interviewers ask why a button looks selected when the dialog opens (autoFocus is on by default)
- Confirmation dialog pattern â€” reusable dialog that takes `title`, `message`, `confirmLabel` as `MAT_DIALOG_DATA` and returns `true` on confirm; interviewers ask where the destructive action button goes (always last, on the right)

---

### Snackbar

- `MatSnackBar` is a service â€” no `imports` array entry needed; interviewers ask how it differs from other Material components (it is injected directly, not declared in imports)
- `snackBar.open(message, actionLabel, { duration })` â€” the three parameters; interviewers ask what happens if `duration` is omitted (snackbar stays open until the user clicks the action)
- `MatSnackBar` vs `MatDialog` â€” snackbar does not block the user and closes automatically; dialog blocks the user and requires interaction; interviewers ask which to use after a successful form submit (snackbar)
- Coordinator pattern for snackbar â€” always call `snackBar.open()` in the page component after `afterClosed()` returns a result, never inside the dialog; interviewers ask why calling it inside the dialog is wrong (the dialog doesn't know if the save succeeded)

---

### Navigation shell â€” Toolbar, Sidenav

- `mat-toolbar` â€” persistent app header; `justify-content: space-between` or a flex spacer element (`flex: 1 1 auto`) to push title left and actions right; interviewers ask how to position items on opposite sides
- `mat-sidenav-container` / `mat-sidenav` / `mat-sidenav-content` â€” the three-element structure that is always required; interviewers ask what each one does and why you cannot put just `mat-sidenav` on its own
- `mode="side"` vs `mode="over"` â€” `side` shows next to content with no backdrop; `over` floats above content with a backdrop; interviewers ask which mode an enterprise app shell uses
- `[opened]="!!currentUser()"` â€” how to show/hide the sidenav reactively; `!!` converts `User | null` to `boolean`; interviewers ask why `[opened]="currentUser()"` causes a type error
- Keep `mat-sidenav-container` always in the DOM â€” if you wrap it in `@if`, the `router-outlet` inside disappears on logout; the sidenav itself uses `[opened]` to hide; interviewers ask why the login page goes blank after logout (container was removed)
- Full-height app shell CSS â€” the height chain (`html â†’ body â†’ app-root â†’ mat-sidenav-container`); `overflow: hidden` on `app-root` is the key rule; interviewers ask why the toolbar scrolls away with the content (missing `overflow: hidden`)
- `mat-nav-list` + `mat-list-item` â€” correct elements for navigation links inside the sidenav; interviewers ask what `routerLinkActive` adds (a CSS class when the route matches)
- `routerLinkActive` + `[activated]` pattern â€” `#rla="routerLinkActive"` gives access to `rla.isActive`, which is passed to Material's built-in active style via `[activated]`; interviewers ask the difference between the class approach and the `[activated]` approach

---

### Additional UI components

- `mat-card` structure â€” `mat-card-header`, `mat-card-content`, `mat-card-actions`; interviewers ask what each section is for and which are optional
- `appearance="outlined"` vs default `raised` â€” `outlined` is flat with a border; `raised` has a shadow; interviewers ask when to use each (outlined for forms and panels; raised for stat cards that need to stand out)

---

- `MatDatepicker` three-element structure â€” `[matDatepicker]="ref"` on the input, `<mat-datepicker-toggle [for]="ref">` for the icon, and `<mat-datepicker #ref>` as the popup; interviewers ask why all three are needed
- Datepicker value type â€” with the native adapter the control should be typed `Date | null`; forcing a
  `string | null` control through `as unknown as Date` hides a modelling error instead of converting
  the date deliberately at the API boundary

---

### Stepper

- `[linear]="true"` + `[stepControl]="formGroup"` â€” forces the user to complete each step in order; interviewers ask what `[linear]="true"` does without `[stepControl]` (allows skipping â€” `[stepControl]` is what blocks invalid steps)
- Programmatic step navigation â€” a linear stepper still enforces completion rules; calling
  `markAllAsTouched()` before `next()` is a UX choice for surfacing errors, not a replacement for the
  stepper's validity checks
- `stepper.selectedIndex` â€” used to show different buttons per step (Next on step 0, Back + Submit on step 1); available in the template because `#stepper` is a template reference variable
- `FormBuilder.group({ field: ['default', validators] })` â€” shorthand for creating form groups; interviewers ask what the array syntax means (first element is the default value, second is validators)

---

### Checkbox and radio button

- `mat-checkbox` + `MatCheckboxModule` â€” styled checkbox bound with `formControlName` or `[(ngModel)]`; interviewers ask how to bind it inside a reactive form the same way as a text input
- `indeterminate` state on `mat-checkbox` â€” a third visual state (dash, not check) used for a "select all" checkbox when only some child rows are selected; interviewers ask how a table header checkbox shows partial selection
- `mat-radio-group` + `mat-radio-button` â€” radio buttons must be wrapped in `mat-radio-group` so only one can be selected at a time; interviewers ask what breaks if you skip the group wrapper (every button becomes independently selectable)
- Checkbox vs radio button â€” checkbox is for independent boolean choices or multi-select; radio is for picking exactly one option from a fixed set; interviewers ask which one to use for a status field with 3 fixed values (radio, or `mat-select` if there are many options)

---

### Tooltip and progress indicators

- `matTooltip` directive â€” shows a short text hint on hover or focus; interviewers ask why you would add it to an icon-only button even though it already has `aria-label` (tooltip is for sighted users on hover, `aria-label` is for screen readers â€” they serve different users)
- `matTooltipPosition` â€” controls where the tooltip appears (`above`, `below`, `left`, `right`); interviewers rarely test the syntax but expect you to know the directive exists
- `mat-progress-spinner` â€” circular loading indicator; interviewers ask where you would use it (while waiting for an HTTP response, same role as the CSS spinner used in earlier Angular projects)
- `mat-progress-bar` â€” horizontal loading indicator; `mode="indeterminate"` for unknown duration, `mode="determinate"` with `[value]` for a known percentage; interviewers ask the difference between the two modes
- Loading state pattern with Material â€” disable the submit button and show `mat-progress-spinner` while a signal like `isLoading()` is true; interviewers ask how you prevent a double form submission while a request is in flight

---

### Menu

- `mat-menu` + `MatMenuModule` â€” a dropdown list of actions triggered by a button; interviewers ask when to use it over several separate `matIconButton` elements in a table row (too many actions to show inline, or actions that need labels)
- `[matMenuTriggerFor]="menuRef"` â€” connects a trigger button to the menu using a template reference variable; interviewers ask how the button knows which menu to open when there are several menus on the same page (one `#ref` per row)
- `mat-menu-item` â€” each clickable row inside the menu; behaves like a button and can call a method directly with `(click)`

---

## Spring Boot

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from the TimeTrack project.

### Project setup

- `@SpringBootApplication` â€” combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`; interviewers ask "what does this annotation replace in a traditional Spring app?" and "why must the class be in the root package?"
- `application.properties` â€” where datasource, JPA settings, and JWT config go; interviewers ask how you keep credentials out of source control (environment variables with `${VAR_NAME}` syntax; app fails at startup if the variable is missing â€” better than a silent null at runtime)
- Profiles: `application-dev.properties`, `spring.profiles.active` â€” separating config per environment; asked in any interview about real-world deployment
- Maven: `pom.xml` structure, adding a dependency, `mvn clean install` â€” how the project is built and how libraries are pulled in; interviewers ask what `spring-boot-starter-parent` does (manages all dependency versions via a BOM so you do not write version tags)
- Lombok `@Data` â€” generates getters, setters, `equals()`, `hashCode()`, and `toString()`; interviewers ask "what does `@Data` generate?" â€” a standard question when reviewing entity code
- Lombok `@NoArgsConstructor` â€” generates an empty constructor required by JPA to instantiate entities when reading from the database; omitting it causes a runtime error on startup
- Lombok `@AllArgsConstructor` vs `@RequiredArgsConstructor` â€” `@AllArgsConstructor` takes every field; `@RequiredArgsConstructor` takes only `final` and `@NonNull` fields; interviewers ask which to use for a service class with constructor injection (`@RequiredArgsConstructor` â€” it picks up only the `private final` dependencies)
- `@Slf4j` â€” Lombok annotation that generates a `log` field; `log.info()`, `log.warn()`, `log.error()`; seen in every production codebase and asked about in code reviews
- `data.sql` â€” Spring Boot runs this file on startup to seed the database; used in TimeTrack to create the first manager account; interviewers ask "how did you create the first user if there is no register endpoint?"

### REST controllers

- `@RestController` â€” combines `@Controller` and `@ResponseBody`; every return value is serialised to JSON by Jackson automatically; interviewers ask "what is the difference between `@Controller` and `@RestController`?" â€” `@Controller` is for server-rendered HTML; always use `@RestController` for a REST API
- `@RequestMapping` â€” sets the base URL path for all methods in the class; combined with method-level annotations (`@GetMapping`, `@PostMapping`) to form the full URL
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` â€” method-level annotations for each HTTP verb; `@PatchMapping` is used for partial updates and state transitions (submit, approve, reject); tested in every technical screening
- `@PathVariable` â€” reads a variable from the URL path (`/{id}`); the name inside `{}` must match the parameter name or be declared explicitly with `@PathVariable("id")`; interviewers ask "what happens if the names don't match?"
- `@RequestBody` â€” reads the JSON body and converts it to a Java object via Jackson; requires the client to send `Content-Type: application/json`; used with `@Valid` to trigger validation
- `@RequestParam` â€” reads query string parameters (`?month=2025-05`); can be `required = false` with a `defaultValue`; used for optional filters, not for required resource identifiers
- `ResponseEntity<T>` â€” use it when status or headers vary dynamically; fixed statuses can use
  `@ResponseStatus`, while returning a body directly intentionally uses the framework's normal status
- Jackson serialisation â€” Spring Boot uses Jackson automatically to convert Java objects to JSON on the way out and JSON to Java on the way in; interviewers ask "how does Spring Boot convert your return value to JSON?" â€” Jackson is the answer; it reads public getters or Lombok-generated ones
- Request and response DTO implementation â€” define separate Java records/classes for incoming and
  outgoing contracts, attach validation only to untrusted input, and map explicitly at the service
  boundary
- `toResponse()` mapping pattern â€” entity-to-DTO conversion extracted to one private helper in the service layer; keeps controllers free of mapping logic and avoids repeating the same field assignments in every method
- `@JsonIgnore` â€” prevents a field from appearing in the JSON response; used on the `password` field so the API never returns hashed passwords; interviewers ask "why doesn't your API expose the password?"

### Dependency injection and beans

- `@Service`, `@Repository`, `@Component`, `@Controller` â€” all four register the class as a Spring bean; `@Repository` also translates JPA/Hibernate exceptions into Spring's `DataAccessException`; interviewers ask "what is the difference between `@Service` and `@Component`?" â€” semantics and layer readability
- `@Bean` in a `@Configuration` class â€” the way to register library classes you cannot annotate with `@Component`; used in `SecurityConfig` to expose `BCryptPasswordEncoder` and `AuthenticationManager`; interviewers ask "why did you define a `@Bean` for `BCryptPasswordEncoder`?"
- Constructor injection â€” preferred over `@Autowired` field injection; makes dependencies explicit, `final`, and easy to mock in tests without starting Spring; Spring infers it automatically when the class has one constructor; interviewers ask "why not field injection?"
- `@Value("${property.name}")` â€” injects a single config value from `application.properties` at startup; the app fails fast if the key is missing rather than throwing a `NullPointerException` at runtime
- `@ConfigurationProperties` â€” binds a group of related properties to a class at once; cleaner than many individual `@Value` annotations when you have grouped config like `app.jwt.secret` and `app.jwt.expiration`
- `@Qualifier` / `@Primary` â€” needed when two classes implement the same interface and Spring cannot decide which one to inject; `@Primary` sets a default, `@Qualifier("beanName")` picks one explicitly at the injection point; interviewers ask "what happens if you have two `@Service` classes implementing the same interface and inject the interface type?" (Spring throws at startup unless you resolve the ambiguity with one of these)

### Spring Data JPA â€” entity and relationship mapping

- `@Entity` â€” marks the Java class as a JPA entity; Hibernate manages its lifecycle and maps it to a database table; omitting it means Hibernate ignores the class completely with no error
- `@Table(name = "users")` â€” sets the table name; always required for the `User` entity because `user` is a reserved word in PostgreSQL; convention: use plural lowercase names (`users`, `projects`, `time_entries`) to avoid reserved-word conflicts
- `@Id` â€” marks the primary key field; without it Hibernate throws a `MappingException` on startup
- `IDENTITY` vs sequence id generation â€” both work with PostgreSQL; identity requires the insert to
  obtain each id and can limit batching, while sequences support allocation, whose gaps are normal
  and not evidence of missing rows
- `@Column(nullable = false)` and `@Column(unique = true)` â€” add `NOT NULL` and `UNIQUE` constraints; Hibernate reflects them in the schema when `ddl-auto=update`; interviewers inspect entity annotations for missing constraints
- `@ManyToOne(fetch = FetchType.LAZY)` and `@JoinColumn(name = "user_id")` â€” the entity on the "many" side holds the FK column; `@JoinColumn` names that column; interviewers ask "which entity owns the foreign key and why?"
- `@OneToMany(mappedBy = "user")` â€” the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; omitting `mappedBy` causes JPA to create an unexpected join table
- `@ManyToMany` â€” models a many-to-many relationship; requires a join table; interviewers ask about relationships and this is the third type they expect you to know after `@ManyToOne` and `@OneToMany`
- `cascade = CascadeType.ALL` and `orphanRemoval = true` â€” `cascade` propagates save/delete operations to children automatically; `orphanRemoval` deletes a child when it is removed from the parent's collection; interviewers ask the difference between the two
- `@Enumerated(EnumType.STRING)` â€” stores the enum name (`DRAFT`, `SUBMITTED`) instead of its position number; using the default `ORDINAL` means inserting a new value in the middle of the enum silently corrupts every existing row; interviewers always ask why `STRING` is the safe choice
- `@CreationTimestamp` / `@UpdateTimestamp` (Hibernate) vs `@PrePersist` (JPA) â€” `@CreationTimestamp` is Hibernate-specific and sets the field automatically; `@PrePersist` is the JPA-standard lifecycle callback that runs before the first insert; interviewers ask "did you set `createdAt` manually?" and which approach you chose and why

### Spring Data JPA â€” repositories, queries, and performance

- `JpaRepository` built-in methods: `save()`, `findById()`, `findAll()`, `deleteById()`, `existsById()` â€” what Spring provides without writing any SQL; interviewers ask "what does `JpaRepository` give you for free?"
- `save()` insert vs update â€” Spring Data delegates to entity-newness detection, normally using
  version/id state or `Persistable.isNew()`; it is not universally equivalent to checking only
  `id == null`
- Derived query methods: `findByEmail(String email)` â€” Spring reads the method name and generates the SQL; no `@Query` needed for simple lookups; interviewers test how far the naming convention goes (`findByTypeAndUserId`, `existsByEmail`)
- `@Query` with JPQL â€” custom queries for aggregations and complex filtering; JPQL uses entity class names and field names, not table names and column names; needed for the reports endpoint in TimeTrack
- Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` â€” the standard way to return lists in production; interviewers ask "what happens if you return `findAll()` on a table with 100,000 rows?"
- N+1 problem â€” one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` â€” `LAZY` loads the relationship only when you access the field; `EAGER` loads it on every query; `@ManyToOne` defaults to `EAGER` â€” a surprising gotcha; always declare `FetchType.LAZY` explicitly on `@ManyToOne`; interviewers ask "what is the default fetch type for `@ManyToOne`?"

### Exception handling

- `@RestControllerAdvice` â€” combines `@ControllerAdvice` with `@ResponseBody` for JSON-oriented
  handlers; plain advice can also return JSON when its handler uses `ResponseEntity` or `@ResponseBody`
- `@ExceptionHandler(SomeException.class)` â€” handles one specific exception type and maps it to the right HTTP status code; Spring calls it automatically when the exception propagates from any controller
- Custom exception classes extending `RuntimeException` â€” unchecked so they propagate without `throws` declarations; named after what went wrong (`ResourceNotFoundException`); interviewers ask "why `RuntimeException` and not `Exception`?"
- `MethodArgumentNotValidException` â€” Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response format â€” always return a consistent `{ "message": "...", "status": 404 }` body; the Angular client must be able to parse any error the same way; interviewers ask "what does your API return when a resource is not found?"
- Soft delete â€” `active = false` instead of `deleteById()`; preserves historical data and audit trail; interviewers ask "what happens to existing time entries when a project is deleted?"

### Spring Security â€” setup and authorization

- `@Configuration`, `@EnableWebSecurity`, and `@EnableMethodSecurity` â€” Boot can activate web
  security without explicitly adding `@EnableWebSecurity`; `@EnableMethodSecurity` is the separate
  switch required for `@PreAuthorize`
- `SecurityFilterChain` â€” a bean that configures CSRF, session policy, route permissions, and filter
  order; applications may define multiple ordered chains for different request matchers
- Route rules: `.requestMatchers("/api/auth/**").permitAll()` and `.anyRequest().authenticated()` â€” all public and protected routes in one place; order matters â€” specific rules must be declared before the catch-all; interviewers ask "how do you make the login endpoint public without exposing everything?"
- `@PreAuthorize("hasRole('MANAGER')")` â€” method-level role check that runs after the JWT is validated; requires `@EnableMethodSecurity` on `SecurityConfig`; silently ignored without it â€” the most common authorization bug in junior code
- CORS with Spring Security â€” a shared `CorsConfigurationSource` keeps policy central and lets the
  security chain handle preflight; `@CrossOrigin` can still be valid for deliberately local
  controller policy

### Spring Security â€” authentication and JWT

- `UserDetailsService.loadUserByUsername()` â€” the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `BCryptPasswordEncoder` â€” one-way hashing with a random salt; interviewers ask "why hash and not encrypt?" â€” there is no need to recover the original password, and hashing is irreversible even if the database is compromised; also ask "why BCrypt?" â€” the work factor makes brute-force slow
- `AuthenticationManager.authenticate()` â€” Spring's login coordinator; calling it internally triggers `DaoAuthenticationProvider`, which calls `UserDetailsService` and `BCryptPasswordEncoder`; you expose it as a `@Bean` so `AuthService` can inject it
- `OncePerRequestFilter` â€” the base class for `JwtFilter`; guaranteed to run exactly once per request; reads the `Authorization: Bearer` header, validates the token, and sets the authenticated user in `SecurityContextHolder`
- `SecurityContextHolder` â€” thread-local storage where `JwtFilter` places the authenticated user for the current request; services call it to get the logged-in user without trusting client-supplied IDs in the request body
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg â€” 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JJWT signing and parsing â€” convert the configured key into a `SecretKey`, sign issued claims, and
  parse through the same algorithm/key so tampering, expiry, and malformed tokens fail before the
  request reaches a controller
- JWT claim-to-authority mapping â€” load the user or map trusted role claims into Spring Security
  authorities before placing the authenticated token in `SecurityContextHolder`

### Bean validation

- `@Valid` on `@RequestBody` â€” activates validation on the incoming DTO at the controller boundary; without it all the constraint annotations on the DTO are compiled but silently ignored at runtime; this is tested by every interviewer who looks at controller code
- `spring-boot-starter-validation` dependency â€” the required Maven dependency; without it `@NotBlank` and `@Email` compile fine but do nothing at runtime; a common source of confusing bugs when setting up a project from scratch
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` â€” `@NotNull` rejects only null; `@NotEmpty` rejects null and empty string but allows whitespace; `@NotBlank` rejects null, empty, and whitespace-only strings; for String fields always use `@NotBlank`; interviewers ask the difference between all three
- `@Positive`, `@Size`, `@Email`, `@Min`, `@Max`, `@Pattern` â€” common validators for positive numbers, string length, email format, numeric bounds, and custom regex; interviewers expect you to recall at least three without checking the docs
- Controller method validation â€” current Spring MVC validates constrained method parameters and may
  raise `HandlerMethodValidationException`; type-level `@Validated` selects the older AOP validation
  path, so exception handling must match the chosen model
- Body vs method validation failures â€” invalid `@RequestBody` binding and invalid method parameters
  use different exception families; handle both deliberately instead of assuming every violation is
  a `ConstraintViolationException`

### Transactions

- `@Transactional` â€” wraps the service method in a database transaction; if any unchecked exception propagates out, all DB writes in that method roll back automatically; required for any method that writes to more than one table
- `@Transactional(readOnly = true)` â€” signals Hibernate to skip dirty-checking at the end of the method; interviewers ask "what is the benefit?" â€” Hibernate no longer needs to compare entity state against snapshots, which saves memory and time on large queries
- Private method gotcha â€” `@Transactional` on a `private` method is silently ignored because Spring creates a proxy and proxies cannot intercept private calls; must be on a `public` method; a classic interview trap that catches candidates who memorised the annotation but did not understand how it works
- `LazyInitializationException` â€” thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Where `@Transactional` belongs â€” on the service layer; Spring Data repositories are already transactional per method; controllers do not interact with the database directly and should never have it
- Catching exceptions swallows the rollback â€” if you catch a `RuntimeException` inside a `@Transactional` method and do not re-throw it, Spring sees no exception and commits the transaction; the data is written even though the operation failed; a hidden gotcha interviewers include in code review questions

### Testing

- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`, `assertThrows` â€” the minimum annotations and assertions to write a service unit test; included automatically via `spring-boot-starter-test`
- `@ExtendWith(MockitoExtension.class)` â€” activates Mockito in a plain JUnit test without loading any Spring context; the fastest test type; interviewers ask "why not use `@SpringBootTest` for all tests?" â€” startup cost and isolation
- Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()` â€” mocking dependencies to test one class in isolation without a database or Spring context
- Arrange / Act / Assert â€” the standard three-part structure every test must follow; interviewers expect to see it named in test comments or test method bodies and will ask you to explain it if the pattern is missing
- Mockito mock vs context bean override â€” `@Mock` creates a standalone test double; current Spring
  tests use `@MockitoBean` to replace a context bean, while `@MockBean` is legacy Boot syntax
- `@WebMvcTest` â€” loads a focused MVC slice; collaborators must be supplied through explicit mock
  bean overrides or imports rather than being replaced automatically
- `jsonPath()` â€” the assertion method inside `@WebMvcTest` tests that reads a field from the JSON response: `.andExpect(jsonPath("$.id").value(1))`; interviewers ask "how do you verify the response body in a controller test?"
- `@SpringBootTest` â€” loads the full Spring application context, but external infrastructure is real
  only when the test config chooses it; use it for wiring and end-to-end application integration
  rather than every service rule
- `@DataJpaTest` â€” tests only the repository layer against an in-memory H2 database; does not load controllers or services; used to verify that derived query methods and `@Query` methods return the correct data
- Layered testing strategy â€” service tests (JUnit + Mockito, fast, isolated), controller tests (`@WebMvcTest`, no DB), integration tests (`@SpringBootTest`, slow); consultancies ask "how do you test your backend?" â€” naming the three layers is the expected answer

### Tooling

- Docker: `Dockerfile` for a Spring Boot app â€” `FROM eclipse-temurin`, `COPY target/*.jar app.jar`, `ENTRYPOINT`; interviewers ask "how do you containerise a Spring Boot application?"
- `docker-compose.yml` â€” runs Spring Boot and PostgreSQL together with one command; interviewers ask "how does someone run your project locally without installing PostgreSQL separately?"
- Flyway â€” database migrations as versioned SQL scripts (`V1__init.sql`); why teams use it instead of `ddl-auto=update` (scripts are reviewable, tracked in git, and safe to run in production â€” `update` can silently alter a production table); interviewers ask about migration strategy in any production-focused screening

---

## Java

Java language concepts needed to write and understand Spring Boot code.
Nothing beyond what appears in a real Spring Boot project â€” not a general Java course.
Every item must be explainable with a real example from TimeTrack or the Java notes.

### Variables, types, and Strings

- `int` vs `long` â€” use `long` when the numeric range can exceed `int`; an `L` suffix is required only
  when the integer literal itself does not fit in `int`, because smaller literals widen automatically
- `primitive` vs wrapper class (`long` vs `Long`) â€” wrappers can represent `null`; a primitive JPA id
  compiles but defaults to `0`, so it cannot represent the unsaved state as clearly as `Long`
- `String.equals()` vs `==` â€” `==` compares memory addresses, not content; using `==` to compare Strings is the most common beginner bug interviewers check for in every Java code review; always use `.equals()`
- `String.isBlank()` vs `String.isEmpty()` â€” `isEmpty()` is true only when length is 0; `isBlank()` is also true when the string is all spaces; maps directly to understanding `@NotBlank` (rejects blanks and spaces) vs `@NotNull` (only rejects null); interviewers ask this when reviewing DTO validation
- `String.formatted()` â€” Java 15+ template substitution (`"User %s not found".formatted(id)`); the Java equivalent of JavaScript template literals; appears in custom exception messages
- `BigDecimal` for money â€” `double` cannot represent 0.1 exactly in binary; interviewers ask "what type would you use for a price field and why?"; the correct answer is `BigDecimal` â€” it does exact arithmetic; `double` produces rounding errors after a few operations
- `var` â€” local type inference (Java 10+); the type is still fixed at compile time â€” Java just infers it from the right side; only valid for local variables, not fields, parameters, or return types; you will see it in code reviews even if you do not write it yourself
- String immutability â€” every operation (`toUpperCase()`, `+`, `replace()`) returns a new `String` object instead of changing the original; interviewers ask "why does `result += name` inside a loop perform badly?" â€” each iteration allocates a new object that the garbage collector must clean up
- `StringBuilder` â€” mutable buffer for building a string inside a loop; `sb.append(x)` modifies the same object instead of creating a new one each time; interviewers ask when to reach for it instead of `+` (loops, not single-line concatenation â€” the compiler already optimises that case)

- Classic `switch` fall-through â€” without `break` at the end of a case, execution continues into the next case even if it does not match; one of the most common Java bugs interviewers ask candidates to spot in a code review
- Switch expression (Java 14+) â€” `->` syntax returns a value and removes fall-through; the expression
  must be exhaustive, so a missing case is a compile-time error rather than a warning

### Classes and objects

- Classes, fields, constructors â€” every Spring component is a class; interviewers ask "what is an object in the context of a Spring bean?"
- `private final` fields â€” why Spring Boot services use them: dependencies cannot change after construction, makes the class easier to unit test; the constructor injection pattern depends on this
- Access modifiers: `public`, `private`, `protected` â€” what each restricts and why Spring Boot services use `private` for fields and `public` for methods
- `this` keyword â€” disambiguates between a field and a constructor parameter; appears in Lombok-generated code and custom constructors
- `static` methods and fields â€” belong to the class, not to any instance; `Map.of()`, `Integer.parseInt()`, `Objects.equals()`, and utility factory methods are all `static`; interviewers ask "why can't a `static` method access instance fields?" (because there is no instance)
- `instanceof` â€” checks the runtime type of an object; appears in `equals()` overrides (`if (!(obj instanceof Employee other)) return false`) and in exception handlers; pattern matching form (`instanceof Dog dog`) is Java 16+ and is in the notes
- `equals()` and `hashCode()` â€” always override both together; `HashMap` and `HashSet` use `hashCode()` to find the bucket and `equals()` to confirm the match; breaking the contract causes silent bugs; Lombok `@Data` generates both automatically â€” interviewers ask "what does `@Data` generate?"
- `Objects.equals(a, b)` â€” null-safe equality that returns true when both references are null and
  otherwise delegates to `a.equals(b)` without throwing
- Encapsulation â€” fields are `private`, accessed through getters/setters; this is what Lombok's `@Data` generates; Spring Data reads and writes entity fields through this pattern
- Records (Java 16+) â€” generate a canonical constructor, component accessors such as `name()`,
  `equals`, `hashCode`, and `toString`; they do not generate JavaBean getters such as `getName()`

### Interfaces and abstract classes

- Interfaces: how to define and implement â€” why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`); interviewers ask "why does Spring prefer interfaces over concrete classes?"
- Interface vs abstract class â€” interface: "this class CAN do X" (a class can implement many); abstract class: "this class IS a type of X" (a class can extend only one); interviewers ask this to test if the candidate understands when to choose each
- Default methods in interfaces (Java 8+) â€” interfaces can have a concrete implementation with `default`; Spring's `JpaRepository` uses them to provide built-in behaviour; a class can override a default method or use it as-is
- Implementing multiple interfaces â€” common in Spring Security (your `User` entity may implement both your domain interface and Spring Security's `UserDetails`)
- `@Override` â€” marks a method that implements an interface or overrides a parent; the compiler catches mismatches; appears in `loadUserByUsername()` and custom exception constructors; omitting it is not a bug but it removes the safety check
- Overriding vs overloading â€” overriding: same method name and signature in a subclass (decided at runtime); overloading: same method name with different parameters in the same class (decided at compile time); interviewers show code and ask "is this an override or an overload?"
- Functional interfaces â€” an interface with exactly one abstract method; this is what makes lambda syntax possible; `@FunctionalInterface` enforces the constraint; built-ins: `Predicate<T>` (filter/test), `Function<T, R>` (transform), `Consumer<T>` (consume with no return), `Supplier<T>` (produce with no input); interviewers ask "what type does this lambda implement?"
- Why Spring Boot prefers interfaces for dependencies â€” you can swap implementations without changing the caller; the foundation of testable, loosely coupled code

### Generics

- `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` â€” reading and writing typed containers in Spring Boot code
- Why generics exist â€” catch type errors at compile time instead of at runtime; without generics, a `List` could hold any type and every `.get()` required a cast that could fail at runtime
- `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()` â€” the correct way to handle a value that might not exist
- `Optional.get()` vs `Optional.orElseThrow()` â€” `get()` throws `NoSuchElementException` with no useful message if empty; `orElseThrow()` lets you throw a meaningful exception with context; interviewers treat `get()` as a red flag in code review â€” it is the same problem as returning `null`
- Why returning `null` is a problem â€” forces every caller to null-check; `Optional` makes the absence explicit in the return type; interviewers ask "why Optional instead of null?"

### Streams and lambdas

- Lambda expressions â€” anonymous functions used wherever a functional interface is expected; `e -> e.isActive()` is the most common form in service methods; interviewers ask you to read a lambda and explain what it does
- Method references â€” shorthand for a lambda that only calls one method: `this::toResponse`, `Employee::getName`, `System.out::println`; when both forms are used in the same codebase interviewers ask "can you explain what this reference does?"
- Stream pipeline: `filter()`, `map()`, `collect()` â€” the core pattern for transforming a list; `filter` keeps matching elements, `map` transforms each element, `collect` builds the result; interviewers ask you to write a pipeline from a description
- `findFirst()` â€” returns `Optional<T>`; the safe way to get one item from a filtered stream without throwing
- `anyMatch()` / `allMatch()` â€” return a boolean; used instead of a for loop when you only need to check a condition across a list
- `mapToInt().sum()` â€” pattern for summing a numeric field across a list: `employees.stream().mapToInt(Employee::getAge).sum()`; avoids creating intermediate objects; interviewers may ask you to refactor a for loop that sums a field
- `Collectors.groupingBy()` â€” groups elements into `Map<Key, List<Value>>`; used when a service must return data organised by a field (status, department, date); interviewers ask you to read the result type
- `.toList()` vs `collect(Collectors.toList())` â€” `.toList()` is Java 16+ and returns an immutable list; `collect(Collectors.toList())` returns a mutable list; if the next line calls `.add()` on the result, `.toList()` will throw; interviewers ask the difference when reviewing modern Java code
- Stream vs for loop â€” streams express intent clearly (`filter` + `map`); for loops are clearer when the logic is complex or when you need early exit with `break`; know when to choose each

### Exceptions

- Checked vs unchecked exceptions â€” why Spring Boot uses unchecked (`RuntimeException` subclasses): they do not need to be declared in the method signature and propagate freely to `@RestControllerAdvice`
- `RuntimeException` vs `Exception` â€” `RuntimeException` is unchecked (no `throws` declaration needed); `Exception` is checked (must declare with `throws` or catch it); always extend `RuntimeException` for custom exceptions in Spring Boot so they propagate without boilerplate
- `try` / `catch` / `throws` â€” reading Spring Boot exception handling code; `throws` in a method signature is a contract: the caller must handle it
- Creating a custom exception: `extends RuntimeException`, constructor that accepts a message, why you name it after what went wrong (`ResourceNotFoundException`)
- `throw new SomeException()` â€” how it propagates up the call stack until `@RestControllerAdvice` catches it and returns a JSON error response

### Collections

- `List` â€” ordered, allows duplicates; used in repository results and service return types (`List<User>`)
- `Map` â€” key-value pairs; `Map.of("message", "Not found")` for quick immutable error response bodies; Spring serialises it to JSON automatically
- `Set` â€” no duplicates; used in many-to-many relationships (e.g. a user's set of roles or permissions)
- When to use each in a Spring Boot context â€” `List` for ordered results from queries, `Map` for ad-hoc response bodies, `Set` for relationship collections where duplicates are meaningless
- `ArrayList` vs `LinkedList` â€” `ArrayList` provides fast indexed access; `LinkedList` still needs
  O(n) traversal to locate a middle position and is only O(1) to insert/remove once an iterator is
  already there, so `ArrayList` is the normal application default
- `Comparable<T>` vs `Comparator<T>` â€” `Comparable` is implemented inside the class itself (`compareTo()`) and defines one natural order; `Comparator` is defined outside the class (`compare()`, or `Comparator.comparing()`) and supports multiple sort orders without changing the class; interviewers ask which one to use when you need to sort the same list two different ways
- `Comparator.comparing()` â€” sorts a list by a field: `list.stream().sorted(Comparator.comparing(Employee::getName))`; used in service methods when you need a specific order that the query does not guarantee; interviewers ask you to read and explain the comparator
- `ConcurrentModificationException` â€” thrown when you call `list.remove()` directly inside a for-each loop over that same list; the for-each loop uses an internal iterator that detects the structural change and fails fast; interviewers ask how to safely remove items while iterating (`removeIf()` is the cleanest fix; an explicit `Iterator.remove()` also works)

### Enums

- Defining an enum â€” used for `Role` (EMPLOYEE, MANAGER) and `EntryStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED) in TimeTrack; interviewers ask you to show one from the project
- Using enums in `switch` expressions â€” the clean way to handle each status in a service method; exhaustive by default so the compiler warns if a case is missing
- `@Enumerated(EnumType.STRING)` vs `EnumType.ORDINAL` â€” `STRING` stores the name ("MANAGER") in the database; `ORDINAL` stores the position (0, 1, 2); if you add a new value in the middle of the enum, `ORDINAL` silently breaks all existing records; interviewers always ask why `STRING` is the safe choice

### Annotations

- What annotations are â€” metadata attached to a class, method, or field that Spring reads at runtime to configure behaviour; they do not change what the code does on their own â€” they are instructions to the framework
- Meta-annotations â€” annotations that annotate other annotations; `@Service` is composed of `@Component` with a semantic label; this is why `@Service` and `@Repository` behave the same way as `@Component` for dependency injection â€” they are all discovered by Spring's component scan
- How to read an unfamiliar annotation â€” look at what it is composed of (meta-annotations), what it enables (like `@EnableMethodSecurity`), and which layer it belongs to; this skill matters because Spring Boot code is dense with annotations you did not write yourself

### Date and time

- `LocalDate` â€” a date without time (`2025-05-14`); used for the `date` field on a TimeEntry; immutable and thread-safe unlike the legacy `java.util.Date`
- `LocalDateTime` â€” a local wall-clock date and time with no offset or timezone; suitable when the
  business meaning is local, but it cannot identify one exact instant globally
- `LocalDate` vs `LocalDateTime` vs `Instant` â€” use `LocalDate` for a calendar date,
  `LocalDateTime` for a timezone-free local value, and `Instant` for an exact point on the UTC
  timeline; interviewers ask which contract a timestamp field actually needs
- Why not `java.util.Date` â€” it is mutable, poorly designed, and replaced by the `java.time` API in Java 8; interviewers ask this directly when they see date fields in your project
- `DateTimeFormatter` â€” formatting a date for display or for an API response; `DateTimeFormatter.ISO_LOCAL_DATE` produces the standard `2025-05-14` format
- JPA mapping â€” Spring Boot serialises `LocalDate` and `LocalDateTime` to JSON automatically via Jackson when `jackson-datatype-jsr310` is on the classpath (included with `spring-boot-starter-web`)

### Maven

- `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build` â€” what each section does and where to add a new library
- How to add a dependency â€” search Maven Central, copy the `<dependency>` block, Maven downloads it automatically on the next build
- Build lifecycle: `clean`, `compile`, `test`, `package`, `install` â€” what `mvn clean install` does and why it is the standard command to build and test before pushing
- Dependency scopes â€” `compile` is the default, `test` is available only to tests, and `provided` is
  available for compile/test but omitted from the runtime artifact because the target JDK/container
  is expected to supply it

---

## Architecture

Patterns and decisions a junior at a Spanish consultancy must explain confidently.
Not just what they are â€” but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

### REST

- REST principles: stateless, resources, HTTP verbs, uniform interface â€” the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) â€” why REST uses nouns and the HTTP verb carries the action
- Resource modelling â€” paths identify resources and relationships, while HTTP methods express the
  operation; interviewers use verb-heavy endpoints to test whether the API has a coherent model
- Why REST and not GraphQL or RPC â€” the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

### Layered architecture

- Frontend/backend separation â€” Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly; the backend controls what data is exposed and who can access it
- Controller â†’ Service â†’ Repository â€” what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Service layer â€” the class (`@Service`) that holds business rules, validation beyond bean validation, and orchestration between repositories; interviewers ask "why not put this logic in the controller?" â€” because the controller would then be impossible to reuse from another entry point (a scheduled job, a CLI command) and impossible to unit test without starting the whole web layer
- Repository pattern â€” places data-access operations behind an interface so application logic does
  not contain queries directly; a JPA repository still carries persistence semantics and is not a
  promise that every storage technology is interchangeable
- Why business logic belongs in the service â€” the controller must not decide; the repository must not know the rules; the service is the only place
- Why the controller must not call the repository directly â€” bypasses the business rules layer; makes the code impossible to test in isolation
- MVC â€” separates input coordination, presentation, and application/domain state; it is not limited
  to server-rendered HTML and is a different design axis from controller/service/repository layering
- MVC vs layered architecture â€” MVC organises interaction and presentation responsibilities, while
  layers organise dependency direction; a system can use both without one being a subtype of the other
- State machine pattern â€” a workflow where status transitions follow fixed rules (DRAFT â†’ SUBMITTED â†’ APPROVED/REJECTED); the service enforces which transitions are valid

### DTO pattern

- Why not expose entities directly â€” the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO â€” validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens â€” in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO â€” nothing visible to the client; the DTO is the public contract

### Data access decisions

- Soft delete vs hard delete â€” `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination â€” why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- Consistency boundary â€” one business operation may require several writes to succeed or fail as a
  unit; Architecture chooses the boundary while SQL and Spring Boot own its concrete transaction mechanics

### Angular patterns

- Smart / dumb component pattern â€” the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern â€” a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern â€” one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large â€” the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

### Testing strategy

- Why you test the service layer independently â€” business rules live there; testing them directly without HTTP gives fast, focused feedback
- Testability as a design signal â€” a class that cannot be exercised without booting unrelated layers
  often has hidden dependencies or mixed responsibilities
- Contract tests at boundaries â€” when two layers or services exchange a DTO, test the contract where
  drift would break integration rather than duplicating every unit test

### Design qualities and boundaries

- Coupling â€” the number and strength of dependencies between modules; lower coupling limits the
  blast radius of a change
- Cohesion â€” how strongly a module's responsibilities belong together; high cohesion is the reason
  related business rules stay in one service or feature
- Dependency direction â€” outer delivery and persistence details may depend on application contracts,
  while business rules should not depend on HTTP or database APIs
- Package by feature vs package by layer â€” feature packaging keeps one use case together; layer
  packaging makes technical roles obvious but scatters a change across the tree
- Composition over inheritance â€” assembling focused collaborators avoids inheriting behaviour and
  state a subtype does not need
- Over-engineering â€” an abstraction is justified by a real variation or repeated pressure, not by a
  hypothetical future requirement
- Technical debt â€” a deliberate shortcut has a known cost and follow-up condition; accidental
  complexity without ownership is simply a defect
- Monolith vs microservices awareness â€” a monolith deploys one application and keeps local calls and
  transactions simple; microservices add independent deployment but also network failure, distributed
  data, and operational cost, so a junior project should not split without a real scaling boundary

### SOLID

- Single Responsibility â€” one class, one reason to change; controllers handle HTTP, services handle rules, repositories handle data
- Open/Closed â€” extend behaviour without modifying existing code; add a new feature by adding new code, not changing existing code
- Liskov Substitution â€” a subtype can replace its parent without breaking the caller; why `JpaRepository` implementations are interchangeable
- Interface Segregation â€” prefer small specific interfaces over one large one; `UserDetailsService` has one method, not fifteen
- Dependency Inversion â€” depend on abstractions, not concrete classes; the entire Spring DI model and Angular's `inject()` are built on this principle

---

## Security

Web security concepts a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects â€” not just a textbook definition.

### Security mindset and baseline

- OWASP Top 10 â€” a periodically updated map of common web-application risk categories; a junior
  should recognise broken access control, injection, security misconfiguration, and vulnerable
  dependencies without memorising an outdated category order
- Defence in depth â€” client checks, server authorisation, validation, and least-privilege database
  access overlap so one failed control does not expose the whole system
- Allow-list over block-list â€” defining accepted origins, roles, fields, or input shapes is safer
  than trying to enumerate every malicious value an attacker might invent

### Authentication and authorisation
- Authentication vs authorisation â€” authentication confirms who you are (login); authorisation confirms what you are allowed to do (role check); interviewers always ask the difference and expect an example from a real project
- 401 vs 403 â€” `401 Unauthorized` means not authenticated (no token, expired token, invalid token); `403 Forbidden` means authenticated but not authorised (valid token, wrong role); interviewers test this pair because the HTTP names are confusing and juniors routinely mix them up
- Session-based auth â€” the server stores a session in memory and gives the client a cookie; stateful; does not scale horizontally without shared session storage; asked as a contrast to JWT
- Token-based auth (JWT) â€” the client stores the token and sends it with every request; the server validates it without storing anything; stateless; interviewers ask why stateless auth matters for scaling
- Role-based access control â€” `EMPLOYEE` vs `MANAGER` in TimeTrack; enforced in Spring Boot with `@PreAuthorize` and in Angular with route guards; interviewers ask where each enforcement layer lives and why you need both
- Generic authentication error messages â€” login failure always returns one generic message ("invalid credentials"), never "wrong password" or "email not found"; a specific message lets an attacker enumerate which emails are registered; interviewers ask why `BadCredentialsException` is handled with one generic message instead of two

### JWT
- JWT structure: header, payload, signature â€” header says the algorithm (`HS256`); payload carries claims (`sub`, `iat`, `exp`, `role`); signature is an HMAC of header+payload using the secret; interviewers ask what each part contains and why
- JWT payload is not encrypted â€” the payload is Base64-encoded, not encrypted; anyone can decode it; never put passwords or sensitive data in a JWT; interviewers ask "is a JWT secure?" to test whether the candidate knows Base64 is not encryption
- How the signature is verified â€” the server recomputes the HMAC with its own secret and compares; if the payload was changed, the signature does not match; this is how the server detects tampering without storing the token
- Why you cannot fake a JWT without the secret â€” the signature is bound to the exact bytes of the header and payload; any change invalidates it; asked to check understanding of why JWT can be trusted
- Access token vs refresh token â€” access token is short-lived (15 min to 1 hour); refresh token is long-lived and used only to get a new access token; limits the window of attack if an access token is stolen
- Where to store the token in the browser â€” `localStorage` is accessible to JavaScript (XSS risk); `HttpOnly` cookie is not accessible to JavaScript (CSRF risk instead); interviewers ask this to test awareness of trade-offs
- JWT expiry â€” the `exp` claim sets a timestamp; expired tokens are rejected by `JwtFilter`; why short-lived tokens reduce the damage if a token is stolen

### Cryptography basics
- Hashing vs encryption â€” hashing is one-way (you cannot reverse it); encryption is two-way (you can decrypt with the key); interviewers always ask the difference because candidates frequently confuse them
- Why passwords are hashed and not encrypted â€” if the database is stolen, the attacker cannot recover plaintext passwords from hashes without brute-forcing every possible input
- BCrypt â€” a slow hashing algorithm with a built-in random salt; slow is intentional because it resists brute-force attacks; `BCryptPasswordEncoder` in Spring Boot uses it by default with 10 rounds
- Salting â€” a random value added to the input before hashing; prevents two users with the same password from having the same hash in the database; BCrypt handles salting automatically

### CORS
- What an origin is â€” the combination of protocol + domain + port; `http://localhost:4200` and `http://localhost:8080` are two different origins even though they share the same domain; the basis for understanding why Angular and Spring Boot conflict in development
- What CORS is â€” the browser enforces the Same-Origin Policy by default, blocking JavaScript from reading responses from a different origin; CORS lets servers explicitly allow specific cross-origin requests
- CORS is enforced by the browser â€” a simple request may reach the server before JavaScript is denied
  access to the response, while a failed preflight prevents the browser from sending the real
  cross-origin request
- Why it matters for Angular + Spring Boot â€” Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API call even though the server responds correctly
- Preflight requests â€” the browser sends an `OPTIONS` request before any POST with a JSON body or any request with an `Authorization` header; the server must respond with the correct CORS headers or the real request is blocked

### Common vulnerabilities
- SQL injection â€” the attacker injects SQL into a user input field to manipulate the query; parameterised queries (which JPA uses automatically) prevent it; interviewers ask "how does JPA protect against SQL injection?"
- XSS (Cross-Site Scripting) â€” the attacker injects malicious JavaScript into a page that runs in other users' browsers and can steal tokens from `localStorage`; Angular escapes all template values by default, which prevents most XSS
- Angular HTML sanitisation â€” Angular sanitises untrusted values bound to `[innerHTML]`; the dangerous
  escape hatch is trusting attacker-controlled markup through `DomSanitizer.bypassSecurityTrustHtml`
- CSRF (Cross-Site Request Forgery) â€” the attacker tricks a logged-in user's browser into making an unwanted request; works because cookies are sent automatically by the browser; JWT in the `Authorization` header prevents it because the browser does not attach headers automatically (only cookies)
- Why you validate on the server even when you validate on the client â€” client-side validation can be bypassed with Postman or browser DevTools; the server is the only boundary you can trust; `@NotBlank` and `@Valid` in Spring Boot enforce this
- Mass assignment risk of exposing entities directly â€” if a controller binds the request body straight to the `@Entity`, a malicious client can set fields it should never control, like `role: "MANAGER"` or `active: true`, by adding them to the JSON body; DTOs close this hole because the request DTO only declares the fields a client is allowed to send; interviewers ask "what could go wrong if you skip the request DTO and bind the entity directly?"

### Login, disclosure, and transport

- Brute force and rate limiting â€” repeated login attempts need throttling by account and network
  signal; permanent account lockout is itself abusable, so the trade-off matters
- User enumeration beyond messages â€” status codes, response shape, and large timing differences can
  reveal whether an account exists even when the visible message is generic
- Password reset â€” use a short-lived, single-use random token and invalidate it after success; never
  email the existing password or trust only an account identifier
- Information disclosure â€” stack traces, internal IDs, over-returned entity fields, and secrets in
  logs give attackers system knowledge even when no direct exploit exists
- Exposed operational endpoints â€” Actuator, Swagger, debug consoles, and heap dumps expand the attack
  surface; sensitive values may be sanitised, but the endpoints still require deliberate access
- TLS as a precondition â€” bearer tokens and passwords are readable in transit without HTTPS, so JWT
  signing never replaces transport encryption
- Dependency vulnerabilities â€” a known CVE matters when the vulnerable component and code path are
  actually reachable; patching dependencies is part of application security, not separate housekeeping

---

## TypeScript

TypeScript as used in Angular and Spring Boot full-stack projects. Every item must be explainable with a real example from one of the projects. Interviewers test whether you understand why a feature exists and what the gotchas are, not just whether you can write the syntax.

### Types

- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `void` â€” the building blocks; interviewers ask what `void` means for function return types and the difference between `null` (explicit absence) and `undefined` (not yet assigned)
- Type inference â€” TypeScript guesses the type from the assigned value; interviewers ask when you still need to declare the type explicitly (function parameters, complex structures, return types that are not obvious)
- `any` vs `unknown` â€” `any` disables type checking completely; `unknown` forces you to check the type before using it; interviewers ask why `any` is a code smell and when `unknown` is the right choice (external API responses, user input)
- `never` â€” the type for values that can never exist; used in exhaustive switch checks and functions that always throw; shows you understand the type system beyond everyday usage
- Union types: `string | number`, `'admin' | 'user'` â€” a value that can be one of several types; used constantly for roles, status fields, and nullable signals (`Employee | null`)
- Intersection types: `Employee & { permissions: string[] }` â€” the result must satisfy all combined types; the `type` equivalent of `interface extends`; interviewers ask the difference between intersection and extension
- Literal types: `type Direction = 'left' | 'right'` â€” restricts a field to specific constant values; interviewers ask the difference between `string` and `'admin' | 'user'` (the literal type catches typos at compile time)

### Interfaces and type aliases

- `interface` vs `type` â€” both define an object shape; `interface` is preferred for data models (supports `extends` and declaration merging); `type` is required for unions, intersections, and computed types; tested in every TypeScript screening
- Optional properties: `name?: string` â€” the field can be `undefined`; interviewers ask how this affects form validation (optional fields do not need `Validators.required`) and how `name?: string` differs from `name: string | undefined`
- `readonly` properties â€” the value cannot be changed after the object is created; interviewers ask the difference between `readonly` (property constraint) and `const` (variable constraint)
- Extending interfaces: `interface AdminUser extends User` â€” adds new fields to an existing shape; interviewers contrast this with the `&` intersection approach on type aliases

### Enums

- TypeScript enums: `enum Status { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED' }` â€” used in Angular models that mirror Java backend enums; interviewers ask how to expose an enum in a template (must be assigned to a class property â€” templates cannot access imports directly)
- `const enum` vs regular `enum` â€” `const enum` is erased at compile time and inlined as raw values (smaller bundle, no runtime object); regular `enum` keeps the runtime object and supports `Object.values()`; interviewers ask which to use when you need to iterate the values
- String enums vs union types â€” both restrict a field to a set of values; union types (`type Status = 'DRAFT' | 'SUBMITTED'`) generate less compiled code; string enums are used when values need to be iterated with `Object.values()`; a common confusable pair in Angular interviews

### Generics

- `Array<T>`, `Observable<T>`, `Signal<T>` â€” generics appear everywhere in Angular; the `T` tells you what the container holds; interviewers ask you to read a type signature out loud and explain what it means
- Writing a generic function or interface â€” `function getFirst<T>(arr: T[]): T | undefined`
  preserves the element type while honestly modelling an empty array
- Generic constraints: `function findById<T extends { id: number }>(items: T[], id: number)` â€” restricts which types are allowed; interviewers ask why constraints exist and what error TypeScript gives when the constraint is not met
- Why generics exist â€” `http.get<Employee[]>('/api/employees')` means you get `Employee[]`, not `any`; type errors are caught at compile time, not at runtime; interviewers ask why calling `http.get()` without a type parameter is a problem
- `keyof` â€” produces a union of an object type's property names as string literals (`keyof Employee` is `'id' | 'name' | 'email' | ...`); interviewers ask how built-in utility types like `Pick<T, K extends keyof T>` use it to restrict `K` to only real property names of `T`, instead of accepting any string

### Utility types

- `Partial<T>` vs `Required<T>` â€” `Partial` makes all properties optional (used in update/PATCH request objects); `Required` makes all properties required (the opposite); interviewers ask which fits a PATCH endpoint vs a POST endpoint
- `Readonly<T>` â€” all properties become readonly; prevents accidental mutation; used to signal immutability in DTOs and config objects passed around the app
- `Pick<T, K>` vs `Omit<T, K>` â€” `Pick` keeps only the named fields; `Omit` removes the named fields; the most commonly confused utility pair; `Omit<Employee, 'id'>` is the canonical create-form pattern where the id is generated by the backend
- `Record<K, V>` â€” a typed key-value map; `Record<string, number>` used for lookup tables and dictionaries in services; interviewers ask when to use `Record` vs a plain interface or a `Map`
- Index signature `{ [key: string]: T }` vs `Record<string, T>` â€” both describe an object with dynamic keys of the same value type; `Record` is the shorthand utility type and the more common choice in application code; interviewers ask why both exist (index signatures predate `Record` and are still needed when mixing dynamic keys with some fixed known properties in the same interface)

### Narrowing and type guards

- `typeof` narrowing â€” works for primitive types (`'string'`, `'number'`, `'boolean'`); the classic gotcha: `typeof null === 'object'` â€” always check `=== null` separately when a value could be null
- `instanceof` narrowing â€” works for class instances; used in catch blocks with custom error classes; interviewers ask when to use `typeof` vs `instanceof` (primitives vs class instances)
- `in` narrowing â€” checks if a property exists on an object; used to distinguish between two interfaces in a union when the types share some but not all properties
- Truthiness narrowing â€” a simple `if (value)` check narrows out `null` and `undefined`; gotcha: `0`, `false`, and `''` are also falsy â€” use `!= null` explicitly when those are valid values you want to keep
- Discriminated unions â€” a shared property with a unique literal value (`status: 'loading' | 'success' | 'error'`) lets TypeScript narrow automatically inside a switch; the standard pattern for async states in Angular; interviewers ask how this differs from a plain union
- Custom type guards: `user is Employee` â€” a function whose return type is a type predicate; tells TypeScript to narrow the type if the function returns `true`; tested when discussing services that work with complex union types
- Exhaustiveness check with `never` â€” assign an unhandled switch case to `never` in the default branch; TypeScript errors if a new union variant is added without a handler; shows understanding of the type system beyond everyday patterns

### Null safety and type assertions

- `?.` optional chaining â€” stops evaluation and returns `undefined` if the left side is `null` or `undefined`; used constantly in Angular templates with nullable signals; interviewers ask when to prefer `?.` over `!` (when you are not 100% certain the value exists)
- `??` vs `||` â€” `??` returns the right side only when the left is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; always use `??` when `0` or empty string is a valid value you want to keep
- `!` non-null assertion â€” removes `null` and `undefined` from the type without any runtime check; if the value is actually null, you get a runtime crash with no TypeScript warning; interviewers ask why `?.` is usually safer
- `as` type assertion â€” tells TypeScript "I know the type better than you"; does not validate or convert the data; used in Angular forms where the compiler cannot infer the exact type; gotcha: a wrong assertion fails silently at runtime
- `as unknown as T` double assertion â€” bypasses TypeScript's overlap check and is therefore a code
  smell at application boundaries; fix the source model or perform a real conversion instead of
  using it to silence an incompatible date, DTO, or library type

### Classes and access modifiers

- `public`, `private`, `protected`, `readonly` â€” `private` restricts access to the same class; `protected` also allows subclasses; `readonly` is about immutability, not visibility; interviewers ask the difference between `private` and `protected` and when to use each
- `private` vs `readonly` â€” confusable pair: `private` controls who can access the property; `readonly` controls whether it can be reassigned; both can be combined (`private readonly`) and often are for injected dependencies
- Constructor shorthand â€” `constructor(private http: HttpClient) {}` declares, creates, and assigns a class property in one step; the standard DI pattern in older Angular code; you must read it instantly when reviewing existing codebases
- Classes as types â€” a TypeScript class can be used as a type without a separate interface; the `CanDeactivateFn<MyComponent>` pattern relies on this; interviewers may show this pattern and ask what type the component parameter has

### `as const`

- Type widening problem â€” TypeScript widens object property types by default: `{ mode: 'edit' }` infers `{ mode: string }` not `{ mode: 'edit' }`, even with `const`; `const` only prevents reassigning the variable, not mutating properties; interviewers ask why `const` alone is not enough
- `as const` on objects â€” makes all properties `readonly` and infers literal types instead of widened ones; used for nav config objects and shared constants; interviewers ask what two things `as const` does (readonly + literal type inference)
- `as const` on arrays â€” turns an array into a `readonly` tuple with exact element types; without it TypeScript only knows `string[]` and loses the actual values; with it TypeScript knows each exact element

### Arrow functions and functions

- Arrow functions vs function declarations â€” arrow functions inherit `this` from the surrounding scope; function declarations have their own `this`; matters when writing callbacks inside Angular class methods where you need to access `this`
- Default parameters, rest parameters â€” reduce function overloads; `...args: string[]` collects remaining arguments into an array; common in Angular utility functions and service methods
- Return type annotations â€” make the function's contract explicit; the compiler catches when the actual return does not match the declared type; interviewers ask when TypeScript can infer the return type and when you must declare it

### Modules and decorators

- `import` / `export` â€” named exports (multiple per file) vs default export (one per file); Angular uses named exports for components and services; interviewers ask why Angular avoids default exports (named exports keep the name fixed at the source, making refactoring safer)
- Barrel files (`index.ts`) â€” re-export multiple symbols from a folder so callers import from the folder path, not individual files; common in large consultancy Angular projects in shared module folders; you will encounter these when reading existing code
- What a decorator is in Angular's context â€” `@Component`, `@Injectable`, `@Pipe` attach metadata to a class that Angular reads at startup; without the decorator, Angular does not know the class is a component
- How TypeScript decorators work conceptually â€” a function that receives the class and can modify or annotate it; you use them everywhere in Angular but rarely write custom ones at junior level; interviewers test that you know they are functions, not language keywords

---

## JavaScript

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects, not a textbook definition.

### Types, equality, and coercion
- Primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) vs reference types (objects, arrays, functions) â€” primitives are compared by value; objects are compared by reference; interviewers test this with `{} === {}` (false) or ask why two arrays with the same content are not equal
- `typeof` â€” returns the type as a string; the classic gotcha: `typeof null === 'object'` is a historical bug that was never fixed; every interviewer knows this and some will ask about it explicitly to test depth of knowledge
- `typeof` vs `instanceof` â€” `typeof` checks the primitive type; `instanceof` checks if a value was created by a specific class or constructor; use `instanceof` in `catch` blocks to distinguish error types; `typeof null` is wrong for null-checking â€” use `value === null`
- `==` vs `===` â€” loose equality performs type coercion before comparing; strict equality checks value AND type; always use `===`; the one valid exception is `value == null`, which catches both `null` and `undefined` in one check without coercing other values
- Truthy vs falsy â€” falsy values are `false`, numeric zero (including `-0`), `0n`, `''`, `null`,
  `undefined`, and `NaN`; arrays, objects, and the string `'0'` are truthy, which is the edge case
  interviewers usually probe
- `null` vs `undefined` â€” `null` is intentional absence of a value, set by the developer; `undefined` means a variable was declared but never assigned, set automatically by JavaScript; asked in almost every first JavaScript interview
- Implicit type coercion â€” `'5' + 3` is `'53'` (string concatenation) but `'5' - 3` is `2` (numeric subtraction); the `+` operator triggers concatenation when either operand is a string; interviewers show arithmetic expressions with mixed types to test whether the candidate can predict the result

### Numbers
- `NaN === NaN` is `false` â€” `NaN` is the only value in JavaScript that is not equal to itself; interviewers ask this directly to test whether you actually understand `NaN` or just know the name
- `Number.isNaN()` vs global `isNaN()` â€” `isNaN()` coerces its argument to a number first, so `isNaN('hello')` is `true`; `Number.isNaN()` does not coerce, so `Number.isNaN('hello')` is `false`; the safe choice is always `Number.isNaN()`; a confusable pair tested in junior screenings
- The floating point problem â€” `0.1 + 0.2 !== 0.3` because binary floating point cannot represent most decimals exactly; interviewers ask "why would this fail in a money calculation?" and expect `toFixed()` for display or integer cents for calculation as the answer
- `parseInt()` vs `Number()` â€” `parseInt('42px')` returns `42` (stops at the first non-numeric character); `Number('42px')` returns `NaN` (rejects anything that is not a clean number); interviewers ask which to use when parsing a value like `'100px'` from a CSS string
- `toFixed(n)` â€” rounds to `n` decimal places and returns a **string**, not a number; forgetting the return type causes a bug when the result is used in further arithmetic without converting back; used to format prices in TimeTrack-style apps

### Variables and scope
- `var` vs `let` vs `const` â€” `var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped; use `const` by default; use `let` only when reassignment is needed; `var` is avoided in all modern code; tested in every screening
- Hoisting â€” `var` declarations are moved to the top of their scope and initialised as `undefined`; function declarations are fully hoisted and can be called before their line; function expressions (including arrow functions assigned to variables) are not fully hoisted; interviewers ask "what does this code output?" with code that calls a function before it is defined
- Temporal Dead Zone (TDZ) â€” `let` and `const` are hoisted but not initialised; accessing them before the declaration line throws a `ReferenceError`; interviewers ask this to distinguish candidates who understand `let` deeply from those who just know to avoid `var`
- Closures â€” a function that retains access to variables from its outer scope even after the outer function has returned; appears in Angular `computed()`, event handlers, and services with private state; interviewers ask "what is a closure and give me a real example?"

### Functions and `this`
- Function declarations vs expressions vs arrow functions â€” declarations are hoisted; arrow functions are expressions and are not hoisted; the key choice in practice is declaration vs arrow, not declaration vs expression
- `this` in regular functions â€” refers to the caller at runtime; in a standalone function call it is `undefined` (strict mode) or `window` (non-strict); the most common source of `this` bugs when a class method is passed as a callback without binding
- Arrow functions and `this` â€” arrow functions inherit `this` from the surrounding scope at definition time; they have no own `this`; this is why Angular uses arrow functions in class properties and callbacks â€” the component's `this` is always available
- `bind`, `call`, `apply` â€” explicitly set `this` on a function; `bind` returns a new function; `call` and `apply` invoke it immediately (the difference is how arguments are passed); interviewers show older Angular or JavaScript code with these and ask what they do
- Default parameters and rest parameters â€” `function f(role = 'employee')` reduces overloads; `...args` collects remaining arguments into an array; interviewers ask how a default parameter differs from `|| 'default'` inside the function body (the `||` version incorrectly treats `0` and `''` as missing)
- Higher-order functions â€” functions that take or return other functions; the foundation of `map`, `filter`, and every RxJS operator; interviewers ask "what is a higher-order function?" and expect a real example from array methods or Angular pipes

### Arrays
- `map` â€” transforms every element and returns a new array of the same length; does not mutate the original; most common use: converting API response objects to view models; interviewers expect this as the default tool for transformation
- `filter` â€” returns a new array containing only elements that pass the test; always returns an array (never `undefined`); used for filtering lists by status, role, or search term
- `reduce` â€” accumulates all elements into one value: a number, an object, a string, or another array; signature: `reduce(callback, initialValue)`; used for totals and grouping by category; interviewers ask the signature and expect a working example
- `find` vs `filter` â€” `find` returns the first matching element or `undefined`; `filter` always returns an array; interviewers show both and ask which to use when looking up a user by id (answer: `find`)
- `findIndex`, `some`, `every`, `includes` â€” searching without a loop; interviewers ask "which method would you use to check if any task is overdue?" (answer: `some`); "check if a role exists in an array?" (answer: `includes`)
- `forEach` vs `map` â€” `forEach` returns `undefined` and is only for side effects; `map` returns a new array and is for transformation; using `forEach` and pushing results into a new array instead of using `map` is a classic junior mistake
- `sort` mutation â€” `sort` modifies the original array in place; the default sort is lexicographic, which breaks numbers (`[10, 9, 2].sort()` gives `[10, 2, 9]`); to sort numbers correctly: `.sort((a, b) => a - b)`; to sort without mutating: `[...arr].sort(...)`
- Method chaining â€” `filter().map().sort()` â€” each method receives the output of the previous one; the pattern behind Angular `computed(() => tasks().filter(...).map(...))` signals; interviewers show a chained pipeline and ask what each step produces

### Objects and JSON
- Object literals, shorthand properties, computed keys â€” `{ name }` instead of `{ name: name }`; `{ [key]: value }` for dynamic keys; interviewers expect shorthand as natural everyday syntax, not something that needs explaining
- Object destructuring â€” `const { name, role } = user`; rename with `{ name: userName }`; default value with `{ city = 'Madrid' }`; destructuring in function parameters `function display({ name, role })`; used constantly in Angular to unpack API responses and component inputs
- Array destructuring â€” `const [first, second] = items`; skip elements with `[, , third]`; swap variables with `[a, b] = [b, a]`; used when consuming tuple-like return values
- Spread in objects â€” `{ ...obj, key: newValue }` creates a shallow copy with overrides; the shallow copy is the most important detail â€” nested objects are still references, not new copies; used for immutable state updates in Angular signals (`employees.update(list => list.map(e => e.id === id ? { ...e, ...changes } : e))`)
- `Object.keys`, `Object.values`, `Object.entries` â€” iterate over an object's properties as arrays; `Object.entries` is most useful because it gives key-value pairs; `Object.fromEntries` converts them back; interviewers ask which to use when you need both key and value in the loop body
- `Object.assign` vs spread â€” both merge objects; `Object.assign` mutates the target object; spread creates a new object; prefer spread in modern code; both produce a shallow copy
- `Object.freeze` â€” makes an object's top-level properties immutable; useful for configuration constants; shallow â€” nested objects inside a frozen object are still mutable
- `JSON.stringify` / `JSON.parse` â€” convert between JavaScript objects and JSON strings; `JSON.stringify` silently drops `undefined` values and functions; `JSON.parse` throws `SyntaxError` on invalid input and must be wrapped in `try/catch`; used in the Angular localStorage pattern for persisting signal state

### Strings and regular expressions
- String immutability â€” strings cannot be changed in place; every method returns a new string; `str[0] = 'x'` does nothing silently; a common source of confusion when coming from a mutable mindset
- Template literals â€” backtick strings with `${}` interpolation; support multiline without `\n`; any expression can go inside `${}`; interviewers expect template literals as the default over string concatenation
- Search methods: `includes`, `startsWith`, `endsWith`, `indexOf` â€” boolean checks for presence and position; `indexOf` returns -1 if not found; used in search filtering (check if a name includes the search term) and URL parsing
- Transformation methods: `slice`, `split`, `trim`, `replace`, `toLowerCase`, `toUpperCase` â€” `split` converts a string into an array; `trim` removes leading/trailing whitespace; `replace` replaces the first match by default; interviewers may ask how to split a CSV string into an array
- Regex pattern syntax â€” `/pattern/flags`; common flags: `i` (case insensitive), `g` (global â€” find all matches, not just the first); interviewers expect you to know what the `g` flag does and what happens without it
- `.test(str)` â€” returns a boolean; used in `Validators.pattern()` for Angular form validation and in conditional logic ("is this a valid email format?")
- `.match(regex)` and `str.replace(regex, replacement)` â€” `match` returns the matching parts as an array; `replace` with the `g` flag replaces all occurrences; without `g` only the first match is replaced â€” a common source of bugs

- `Set` vs `Array` â€” use Set when uniqueness matters or when you need fast `has()` lookups; use Array when index access or method chaining (map/filter) is needed; use `[...new Set(arr)]` to convert back to an array

### Async JavaScript
- Callbacks â€” the original async pattern; callback hell is deeply nested callbacks that handle sequential operations; Promises and `async`/`await` were introduced specifically to solve this readability and error-handling problem
- Promises: `then`, `catch`, `finally` â€” `then` runs on resolve; `catch` runs on reject; `finally` always runs regardless of outcome; interviewers ask when to use `finally` vs putting cleanup code after the `try/catch`
- `Promise.all` â€” observes several already-created promises concurrently, resolves when all fulfil,
  and rejects when one rejects; it does not itself start work or guarantee parallel execution
- `Promise.allSettled` vs `Promise.all` â€” `allSettled` never rejects; it waits for all promises and returns each result with `{ status: 'fulfilled' | 'rejected', value | reason }`; use when some requests can fail independently without aborting the rest
- `async` / `await` â€” syntactic sugar over Promises; makes async code read like synchronous code; `await` can only be used inside an `async` function; an `async` function always returns a Promise even if it returns a plain value
- Sequential vs concurrent `await` â€” awaiting each producer before creating the next serialises them;
  create independent promises first and await them together when their underlying operations can overlap
- Event loop â€” JavaScript is single-threaded; microtasks (Promise callbacks) run before macrotasks (setTimeout); `Promise.then()` runs before `setTimeout` even at 0ms delay; explains why long synchronous code blocks the UI even if it calls no async functions
- Promise vs Observable in Angular â€” Promises emit one value and start immediately; Observables are lazy (start on subscribe), can emit multiple values, and can be cancelled with `takeUntilDestroyed()`; `firstValueFrom()` converts an Observable to a Promise; interviewers ask why Angular's `HttpClient` returns Observables instead of Promises

### Modules
- Named exports vs default export â€” Angular uses only named exports; named exports are safer to refactor because editors auto-rename them; default exports let the importer choose any name, which makes automated refactoring unreliable
- `import { name as alias }` and `import * as namespace` â€” renaming to avoid naming conflicts; namespace import bundles all exports into one object; used when consuming libraries that export many things at once
- Barrel pattern â€” an `index.ts` file that re-exports everything from a folder so imports stay clean; `import { X, Y } from './feature'` instead of long relative paths; common in large Angular feature modules
- Dynamic imports and lazy loading â€” `import('./module').then(m => m.Class)` loads code only when needed; Angular uses this in `loadComponent:` routing to reduce the initial bundle size; interviewers ask how lazy loading works and why it matters for app startup performance
- Tree-shaking â€” a bundler can remove unused statically analysable ESM code when side effects permit
  it; both named and default exports can be tree-shaken

### Error handling
- `try` / `catch` / `finally` â€” `try` is the code that might throw; `catch` receives the error object; `finally` always runs for cleanup (hide a spinner, close a connection); interviewers ask when to use `finally` vs putting code after the `try/catch` block (answer: `finally` guarantees execution even if `catch` also throws)
- `Error` object: `message`, `name`, `stack` â€” `stack` shows the full call chain that led to the error; essential for debugging production bugs; `name` distinguishes error types before `instanceof` is possible
- Custom error classes â€” extending `Error` to create `ValidationError`, `HttpError`, etc.; lets you use `instanceof` in `catch` to handle different error types differently; interviewers ask how to distinguish a network error from a validation error without checking arbitrary properties
- Silently swallowing errors â€” catching an error and doing nothing is the most common junior mistake; the caller has no idea the operation failed; always either handle fully (show a message) or re-throw with `throw error`
- Error handling with `async`/`await` â€” `try/catch` catches both synchronous errors and rejected Promises inside an `async` function; the correct pattern for Angular services that call `firstValueFrom()` or `fetch()`

### Loops and iteration
- Classic `for` loop â€” `for (let i = 0; i < arr.length; i++)`; still the right tool when you need the index itself or must skip/step irregularly; interviewers ask why most modern code prefers `for...of` or array methods over this form (less error-prone â€” no off-by-one risk on the condition or increment)
- `for...of` vs `for...in` â€” `for...of` iterates the values of any iterable (arrays, strings, Sets, Maps); `for...in` iterates the string keys of an object; using `for...in` on an array is a classic bug â€” it gives `'0'`, `'1'`, `'2'` as strings, not the array values
- When to use a loop vs array methods â€” `map`, `filter`, `reduce` are preferred for data transformation; `for...of` is the right choice when you need early exit with `break` or when the loop body contains `await`; `forEach` cannot `break` and returns `undefined`
- `break` and `continue` â€” `break` exits the loop immediately; `continue` skips the rest of the current iteration; the main reason to choose `for...of` over `forEach` when early exit is needed
- `while` loop â€” repeats while a condition is true; use when the number of iterations is not known in advance (polling for a result, retrying an operation, reading paginated data)
- `while` vs `do...while` â€” `while` checks the condition before the first run and may execute zero times; `do...while` runs the body once before checking, guaranteeing at least one execution; interviewers ask for a real case where `do...while` is the right choice (e.g. show a menu at least once, then repeat while the user wants to continue)

### DOM events
- Event bubbling â€” a click on a child element also triggers click handlers on every ancestor element up to the document root; interviewers show a card with a button inside, both with click handlers, and ask why both fire
- `stopPropagation()` â€” prevents the event from travelling further up the DOM tree; used when a button inside a card should not also trigger the card's own click handler; requires passing `$event` in the Angular template with `(click)="handler($event)"`
- `preventDefault()` â€” cancels the browser's default behaviour for that element: form submission and page reload, link navigation, checkbox toggle; used in Angular form submits and custom `<a>` link overrides
- `stopPropagation` vs `preventDefault` â€” independent methods; `stopPropagation` controls where the event travels in the DOM; `preventDefault` controls what the browser does after the event; interviewers show a form submit and ask which one prevents the page reload

### Modern syntax (ES6+)
- Optional chaining `?.` â€” safely accesses a nested property that might be `null` or `undefined` without throwing; `user?.address?.city` returns `undefined` instead of a `TypeError`; used in Angular templates and services when API data may be partially missing
- Nullish coalescing `??` vs `||` â€” `??` falls back only when the left side is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; interviewers test this with a count or price field where `0` is a valid value that should not be replaced by a default
- Logical assignment: `||=`, `&&=`, `??=` â€” shorthand for conditional assignment; `a ??= 'default'` assigns only if `a` is `null` or `undefined`; interviewers may show these to test whether the candidate can read modern JavaScript they did not write
- Debouncing concept â€” delaying a function call until after a rapid burst of events stops; used in Angular with RxJS `debounceTime()` on search inputs to avoid sending a request on every keystroke; interviewers ask "why are you using `debounceTime`?" â€” the expected answer is "to wait until the user stops typing before sending the API request"

---

## CSS

Topics a junior must explain confidently to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the Angular projects.

### Box model
- `margin`, `padding`, `border`, `content` â€” what each layer is and how they stack; interviewers draw the box model and ask you to label it or explain why two elements are not touching even though margin is set to 0
- `box-sizing: border-box` â€” makes `width` include padding and border; the default `content-box` adds them on top, causing sizing surprises; setting it globally in a reset makes layouts predictable
- Collapsing margins â€” two adjacent vertical margins collapse into one (the larger wins, not the sum); the most common box model surprise in interviews
- CSS reset pattern â€” `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }` removes browser defaults and ensures consistent sizing; interviewers ask why `::before` and `::after` are included alongside `*`

### Display and layout
- `display: block`, `inline`, `inline-block` â€” block takes full width and starts on a new line; inline flows with text and ignores width and vertical margin; `inline-block` is both; interviewers ask why a `<span>` cannot have width
- `display: none` vs `visibility: hidden` â€” `none` removes the element from layout entirely (no space); `hidden` hides it but keeps its space; this pair is tested in every junior screening
- Flexbox vs Grid â€” Flexbox for one-dimensional layout (row or column); Grid for two-dimensional layout (rows AND columns at the same time); interviewers ask "when would you choose Grid over Flexbox?"

### Angular-specific CSS
- View encapsulation â€” Angular scopes component styles by adding a unique attribute to every element in the template; styles in `component.scss` only apply to that component's own elements, not to child components; interviewers ask "why does your style not apply inside the child component?"
- `:host` selector â€” targets the component's root element from within its own styles; used to set `display: block` or add margin to the component itself; not knowing this is a red flag for an Angular role
- When to use `styles.css` vs component styles â€” `styles.css` for global rules (body, html, Angular Material overrides); component styles for everything specific to one component; interviewers ask why Angular Material overrides go in `styles.css` and not in a component file
- `::ng-deep` â€” deprecated but still widely used in consultancy codebases; pierces view encapsulation to style child component internals that cannot otherwise be reached; interviewers ask why it is deprecated and what the modern alternative is

### Selectors and specificity
- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` â€” how to target elements by relationship; interviewers show a selector and ask which elements it matches
- Pseudo-classes: `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`, `:not()` â€” `:not()` excludes elements from a rule; `:focus` is essential for keyboard accessibility; tested in code review questions
- `:focus` vs `:focus-visible` â€” `:focus` triggers on every way of focusing an element, including a mouse click; `:focus-visible` only shows the ring when the browser decides keyboard navigation is likely (Tab key); interviewers ask why a button gets an ugly focus ring on click and how `:focus-visible` fixes it without removing accessibility for keyboard users
- Pseudo-elements: `::before`, `::after` â€” insert CSS-generated content before or after an element; must have a `content` property (can be an empty string); used for decorative elements and Angular Material state layers
- Specificity scoring â€” inline styles beat IDs (`1-0-0`) beat classes (`0-1-0`) beat elements (`0-0-1`); the rule with the highest score wins, not the one that appears last; interviewers give two rules and ask which one applies
- `!important` â€” raises a declaration into the important cascade, after which origin, layer, and
  specificity still resolve competing important declarations; use it sparingly because it makes
  overrides harder to reason about

### Flexbox
- Container properties: `flex-direction`, `justify-content`, `align-items`, `gap` â€” the four set on almost every flex container; not knowing these will fail the "build a navbar" question in any screening
- `flex-wrap: wrap` â€” controls whether items wrap to the next line when space runs out; `nowrap` (default) shrinks items to fit; `wrap` moves them to a new row; asked when discussing responsive card layouts
- Item properties: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self` â€” `flex: 1` makes an item fill remaining space; `flex-shrink: 0` prevents an icon or button from shrinking next to a growing input
- The main axis and cross axis â€” `justify-content` works on the main axis, `align-items` on the cross axis; the axis flips with `flex-direction: column`; interviewers ask "how do you center something vertically inside a flex container?"
- `margin: auto` on flex items â€” absorbs all available space on that side; used to push an action button to the right of a navbar without adding a wrapper element; interviewers show navbar code and ask how it works

### CSS Grid
- `grid-template-columns` and `gap` â€” the two properties set most often on a grid container; understanding `fr` units is required to explain any Grid answer
- `repeat()` function â€” `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern that needs no media queries
- `fr` unit â€” distributes free space after fixed columns are placed; does not include the gap in the calculation, which is why it is cleaner than percentages for equal columns
- `auto-fill` vs `auto-fit` â€” both create as many columns as fit; `auto-fill` keeps empty column tracks (items stay at their minimum size); `auto-fit` collapses empty tracks (items stretch to fill the space); a confusable pair tested in interviews
- `grid-column` and `grid-row` â€” placing an item across multiple tracks using grid line numbers; `grid-column: 1 / -1` spans all columns; `span 2` spans two tracks from wherever the item is placed

### Position
- `static`, `relative`, `absolute`, `fixed`, `sticky` â€” the common positioning modes; `fixed`
  normally uses the viewport but a transformed or filtered ancestor can establish its containing
  block, while `sticky` is constrained by its scrolling ancestor
- How `absolute` finds its reference point â€” positions relative to the nearest ancestor that
  establishes a containing block; otherwise it falls back to the initial containing block
- `z-index` and stacking context â€” applies to positioned boxes and flex/grid items; properties such
  as `transform` and `opacity < 1` create a new stacking context, explaining why a large number
  cannot escape an ancestor's stacking order
- `inset: 0` â€” shorthand for `top: 0; right: 0; bottom: 0; left: 0`; used in modal overlays to cover the full viewport; interviewers who review your code expect you to know this shorthand

### Responsive design
- Mobile-first with `@media (min-width: ...)` â€” base styles for mobile, then `min-width` queries add complexity for wider screens; `max-width` (desktop-first) is less common because it starts with the complex case; interviewers ask why mobile-first is the recommended approach
- Breakpoints: `768px` (tablet), `1024px` (desktop) â€” the most common values in real Angular projects; a junior must justify these numbers and explain that `auto-fill` grid can eliminate breakpoints entirely for card grids
- Fluid images â€” `max-width: 100%; height: auto` on `img` prevents images from overflowing their container and keeps the aspect ratio; standard in every CSS reset; not knowing this is a recognisable beginner mistake
- `@media (prefers-color-scheme: dark)` â€” applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected

### Units
- `px` â€” a CSS reference pixel, useful for thin borders and other fixed details; root-relative units
  usually respect user text-size preferences more naturally for typography and scalable spacing
- `%` â€” relative to the parent's value on the same axis; for vertical `padding` and `margin`, `%` is relative to the parent's **width**, not height â€” a common surprise in interviews
- `em` â€” relative to the current element's font size; compounds through nesting, which makes it hard to predict in deeply nested components; prefer `rem` by default
- `rem` â€” relative to the root font size (`16px` by default); does not compound; the safe choice for font sizes and spacing; `rem` vs `em` is a classic confusable pair
- `vw` and `vh` â€” relative to the viewport width and height; `min-height: 100vh` is safer than `height: 100vh` because it grows with content instead of clipping it

### Transitions and animations
- `transition` â€” smooth change for a specific property on state change; always place it on the base element, not on `:hover`, so it runs in both directions; putting it on `:hover` makes the exit instant â€” a classic interview trap
- `transform` â€” `translateX/Y`, `scale`, and `rotate` change visual appearance without changing
  normal-flow geometry; browsers can often composite transforms efficiently, but GPU promotion is
  not guaranteed
- `transform` vs `top/left` for movement â€” transforms commonly avoid layout while positional changes
  can trigger it; profile when performance matters instead of treating either rendering path as an
  unconditional guarantee
- `@keyframes` and `animation` â€” multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back

### Typography
- `font-size` with `rem` â€” `rem` follows the root size and composes consistently with user settings;
  fixed pixels are not automatically inaccessible, but a scalable type system is easier to zoom and
  maintain
- `font-weight` numeric values â€” `400` (normal), `600` (semibold), `700` (bold); interviewers ask why numeric values are used instead of the keyword `bold`, and whether every font supports every weight
- `line-height` unitless value â€” `1.5` means 1.5Ã— the current font size; a unitless value scales correctly when font size changes; `line-height: 24px` breaks as soon as the font size changes
- Text truncation â€” `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` must all be present; interviewers ask why removing any one of them breaks the effect and what each one does individually
- `text-transform` â€” `capitalize` displays stored lowercase values (`'active'`) as `'Active'` without changing the data; `uppercase` for labels and badges; tested in code review questions about status display
- `font-family` fallback stack â€” listing several fonts (`'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`) so the browser falls back if the first font is not installed; the last value should always be a generic family (`sans-serif`, `serif`, `monospace`); interviewers ask why you never list just one font name

### CSS variables
- `--variable-name` and `var()` â€” define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours; change one variable and the whole UI updates
- `:root` vs component scope â€” declaring on `:root` makes the variable globally available; scoping to a specific selector limits it to that element's subtree; interviewers ask why Angular Material theming variables are declared on `:root`
- CSS variables are live at runtime â€” a CSS variable can be changed by JavaScript with `element.style.setProperty('--name', value)`, enabling runtime theming without recompiling; hardcoded values cannot be changed this way; interviewers ask how you would implement a simple theme switcher
- `var()` with a fallback â€” `var(--primary, #e8572a)` uses the second argument when the variable is not defined; provides a safety net when customising Angular Material where some variables may not be set

### Colors and transparency
- Color formats: `hex`, `rgb()`, `hsl()` â€” `hex` is most common for fixed colors; `rgba()` adds transparency and is preferred for overlays and shadows; `hsl` makes color variations easy (just change the lightness value); interviewers ask which format to choose and why
- `opacity` vs `rgba` transparency â€” `opacity` affects the element AND all its children; `rgba` only affects the specific property it is applied to; classic interview question: "why does `opacity: 0.5` on a card fade the text too, but `background: rgba(0,0,0,0.5)` does not?"
- `rgba` for overlays and shadows â€” `rgba(0, 0, 0, 0.5)` for modal backgrounds, `rgba(0, 0, 0, 0.08)` for card shadows; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value
- `currentColor` â€” a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync with the text color without repeating the value

### Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` â€” spread is optional, and transparent
  colour can use modern `rgb(... / alpha)`, hex alpha, HSL, `rgba()`, or a design token
- `border-radius: 50%` vs `border-radius: 9999px` â€” `50%` makes a circle but only when the element is square; `9999px` creates a pill shape at any aspect ratio; interviewers ask which one to use for an avatar vs a badge â€” a confusable pair
- `background-size: cover` vs `background-size: contain` â€” `cover` fills the element completely and may crop the image; `contain` fits the whole image and may leave empty space; `cover` is standard for hero sections and card backgrounds
- `object-fit: cover` â€” same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements in a fixed-size container; `background-size` is for background images, `object-fit` is for `<img>` tags â€” a confusable pair
- `outline` vs `border` â€” `outline` sits outside the border and does not take up layout space; never remove the browser's default focus outline without adding a visible custom replacement; `button:focus-visible` is the accessible way to style it
- `aspect-ratio` â€” locks an element's width-to-height ratio (`aspect-ratio: 16 / 9`) so it scales without distortion when only one dimension is known; replaces the older padding-percentage hack for responsive video and image containers; interviewers ask how you reserve space for an image before it loads to avoid layout shift

### Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` â€” `hidden` clips content; used to prevent images from breaking out of a `border-radius` card container; `scroll` always shows scrollbars; `auto` only shows them when content overflows
- `overflow-x` and `overflow-y` â€” control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport
- Scrollable container pattern â€” `overflow-y: auto` with a fixed `max-height` creates a scroll area without triggering a page scroll; `auto` vs `scroll` is a confusable pair: `auto` is invisible when not needed, `scroll` is always visible

### CSS functions
- `calc()` â€” mixes different units in one expression; `calc(100% - 64px)` subtracts a fixed header height from the full viewport; spaces around `+` and `-` are required; interviewers ask when `calc()` is necessary and why neither pure percentage nor pure `px` can solve the same problem
- `clamp(min, preferred, max)` â€” creates a value that scales fluidly between limits; `font-size: clamp(1rem, 2.5vw, 2rem)` replaces multiple breakpoint overrides for font size; tested because it signals modern CSS knowledge
- `min()` and `max()` â€” `min(100%, 600px)` is equivalent to `max-width: 600px; width: 100%`; `max(1rem, 5%)` ensures a minimum even when using a relative unit; useful for containers that should be fluid on mobile and capped on desktop

### BEM naming
- Block, element (`__`), modifier (`--`) â€” `.card`, `.card__title`, `.card--featured`; a naming convention that makes class names predictable in global stylesheets; interviewers at consultancies ask about CSS organisation because shared CSS becomes unmaintainable without a convention
- Why BEM keeps specificity low â€” each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- The flat element rule â€” BEM elements never nest in the class name; even if `.card__body` contains a title, the class is `.card__title`, not `.card__body__title`; depth lives in the HTML, not in the class name â€” a common mistake when first learning BEM
- When BEM applies in Angular â€” Angular view encapsulation handles component isolation; BEM is still needed for global styles in `styles.css` and shared components in `shared/` where encapsulation does not help

---

## SQL

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Database is PostgreSQL. Every item must be explainable with a real query â€” from the bookstore exercises or the TimeTrack data model.

---

### JOINs

- `INNER JOIN` â€” returns only rows where both tables have a match; the most common JOIN; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` â€” returns all rows from the left table with `NULL` on the right when there is no match; used for "show all users even if they have no time entries"
- `INNER JOIN` vs `LEFT JOIN` â€” `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows and fills the right side with `NULL`; choosing the wrong one is the most common JOIN mistake in junior code
- Finding missing data with `LEFT JOIN` â€” `WHERE right_table.id IS NULL` after a `LEFT JOIN` returns every left row with no match on the right; the standard pattern for "which projects have no time entries?"
- `RIGHT JOIN` â€” mirror of `LEFT JOIN`; rarely used because any `RIGHT JOIN` can be rewritten as a `LEFT JOIN` by swapping the tables; tested to check you understand the symmetry
- `FULL OUTER JOIN` â€” returns all rows from both sides with `NULL` where there is no match; used to find unmatched rows on either side at once
- Multiple JOINs â€” you can chain as many JOINs as needed; interviewers ask you to write a query joining three tables, for example `time_entries â†’ users â†’ projects`
- Self JOIN â€” a table joined to itself using two aliases, used to compare rows within the same table (e.g. "which employees share the same manager?" or "find duplicate emails"); interviewers ask how you join a table to itself when there is only one `FROM` clause to work with
- Table aliases in JOINs â€” `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

---

### Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` â€” `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `SUM`, `AVG`, `MIN`, `MAX` â€” all ignore `NULL` values automatically; `AVG(price)` on `[10, NULL, 30]` returns `20`, not `13.33`; a common source of unexpected results in junior code
- `GROUP BY` rule â€” every column in `SELECT` must either appear in `GROUP BY` or be inside an aggregate function; breaking this rule causes a PostgreSQL error; the most common GROUP BY mistake in junior code
- `GROUP BY` with `LEFT JOIN` â€” when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` â€” filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- Conditional aggregation with `CASE WHEN` â€” `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows; used for reporting by status in TimeTrack; interviewers ask "how would you count only approved entries per project?"
- `FILTER (WHERE ...)` â€” PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions

---

### Querying basics

- SQL execution order â€” `FROM + JOIN â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ SELECT â†’ ORDER BY â†’ LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- `SELECT *` vs named columns â€” always specify columns in application code; `SELECT *` fetches data you do not need, sends more over the network, and breaks when the schema changes
- `CASE WHEN` in `SELECT` â€” `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row; interviewers ask you to add a status label to a result set
- `CASE WHEN` in `SELECT` vs inside an aggregate â€” in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- `SELECT DISTINCT` â€” removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT ON` â€” PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` â€” PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` â€” without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- `OFFSET` for pagination â€” `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page âˆ’ 1) Ã— page_size`
- `||` string concatenation â€” joins two text values into one column, e.g. `first_name || ' ' || last_name AS full_name`; interviewers ask how you build a display name from separate columns without a function call
- `UNION` vs `UNION ALL` â€” `UNION` combines the results of two queries and removes duplicate rows; `UNION ALL` keeps every row including duplicates and is faster because it skips the duplicate check; interviewers ask which one to use when you know the two result sets cannot overlap (`UNION ALL` â€” no reason to pay for a duplicate scan)
- `UNION` column rules â€” both queries must return the same number of columns with compatible types; column names in the result come from the first query; interviewers ask what happens if the column types do not match (PostgreSQL raises an error or silently casts, depending on the mismatch)

---

### Filtering and NULL handling

- `WHERE` cannot use aliases â€” `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` â€” `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`; interviewers ask why `= NULL` does not work
- `AND` / `OR` with `NULL` â€” `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` â€” returns the first non-`NULL` value; used to replace `NULL` with a default (`0`, `''`, `'Unknown'`) so the application never has to handle `NULL` from the query result
- `NULLIF(a, b)` â€” returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` â€” `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `IN` vs multiple `OR` â€” `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `BETWEEN` with timestamps â€” `BETWEEN '2024-01-01' AND '2024-06-30'` silently excludes events after midnight on June 30; safer to cast before comparing: `created_at::date BETWEEN '2024-01-01' AND '2024-06-30'`

---

### Subqueries, CTEs, and views

- Subquery in `WHERE` â€” `WHERE price > (SELECT AVG(price) FROM books)` â€” you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- Subquery in `FROM` (derived table) â€” a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` â€” returns exactly one value used as a column in the result; runs once per row and can be slow on large tables; interviewers ask when this would cause a performance problem
- `IN` vs `EXISTS` â€” `IN` collects all results from the subquery first; `EXISTS` stops as soon as it finds one match and is faster on large tables; interviewers ask when you would prefer one over the other
- Subquery vs `JOIN` â€” most `WHERE` subqueries can be rewritten as a `JOIN`, which the database can optimize better; prefer a `JOIN` when readable; use a subquery when you need an aggregate in a filter
- `WITH` (CTE) â€” names a subquery so it can be referenced by name in the same query; makes multi-step queries readable; interviewers ask "when would you use a CTE instead of a subquery?"
- Multiple CTEs â€” chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` â€” saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application
- View vs materialized view â€” a regular view runs the query live every time; a materialized view stores the result on disk and must be refreshed manually with `REFRESH MATERIALIZED VIEW`; regular views are for convenience, materialized views are for performance

---

### DML â€” modifying data

- `INSERT INTO ... VALUES (...)` â€” adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- `RETURNING` â€” `INSERT INTO users (...) VALUES (...) RETURNING id` â€” returns the generated ID without a second `SELECT`; PostgreSQL-specific; interviewers ask "how do you get the new ID after an INSERT?"
- `UPDATE ... SET ... WHERE` â€” always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` â€” always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- `DELETE` vs `TRUNCATE` â€” `DELETE` supports `WHERE` and processes matching rows; `TRUNCATE`
  removes all rows with a stronger table lock and resets sequences only when `RESTART IDENTITY` is
  requested; choose deliberately rather than treating either as universally safe
- `ON CONFLICT` (upsert) â€” `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` â€” atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

---

### Transactions

- `BEGIN` / `COMMIT` / `ROLLBACK` â€” groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- ACID properties â€” Atomicity is all-or-nothing, Consistency preserves declared invariants from one
  valid state to another, Isolation controls interference between concurrent transactions, and
  Durability preserves committed work
- `SAVEPOINT` â€” a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint; used internally by Hibernate; good to know it exists without needing to write it yourself

---

### Window functions

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` â€” assigns a unique sequential number to each row within a partition; used to get "the latest time entry per user" by filtering `WHERE row_num = 1` in an outer query; a very common interview pattern
- `RANK()` vs `ROW_NUMBER()` â€” `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- `LAG()` and `LEAD()` â€” access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; used to compare consecutive time entries
- `SUM() OVER (PARTITION BY ...)` â€” running total within a group without collapsing rows; unlike `GROUP BY`, it keeps every row and adds a cumulative column alongside the existing data

---

### Schema design

- Primary key â€” one optional table constraint, possibly composite, that uniquely identifies rows;
  application tables normally define one even though SQL does not require every table to have it
- Foreign key â€” one or more columns referencing a primary or other unique candidate key;
  PostgreSQL rejects values with no referenced row, enforcing referential integrity
- `ON DELETE` behavior â€” `RESTRICT` (default) rejects the delete if dependent rows exist; `CASCADE` deletes dependent rows automatically; `SET NULL` sets the foreign key to `NULL`; interviewers ask "what happens if you delete a user who has time entries?"
- `NOT NULL` constraint â€” the column must always have a value; used on required fields like `email`, `password`, `status`; interviewers ask why you chose to add it
- `UNIQUE` constraint â€” no two rows can have the same value in that column; used on `email` to prevent duplicate accounts; automatically creates an index in PostgreSQL
- `CHECK` constraint â€” validates a condition on insert or update; `CHECK (hours > 0 AND hours <= 24)` rejects invalid data at the database level, not just the application level
- Relationship types â€” one-to-many (1:N) is the most common; the foreign key always goes on the "many" side; many-to-many (N:M) needs a junction table (e.g. `order_items` linking `orders` and `books`)
- Normalization concept â€” storing `project_id` instead of copying `project_name` avoids duplication; changing the project name requires only one `UPDATE` in one place; interviewers ask "what problem does normalization solve?"
- Reading a schema out loud â€” describing the TimeTrack data model: "three tables; `users` and `projects` are independent; `time_entries` links to both via foreign keys"; interviewers ask "explain your database structure"

---

### Data types

- `VARCHAR(n)` vs `TEXT` â€” both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- `INT` vs `SERIAL` vs `BIGSERIAL` â€” `INT` is a plain integer; `SERIAL` is an auto-incrementing integer used for primary keys; `BIGSERIAL` handles very large tables; interviewers from MySQL ask "what is the equivalent of `AUTO_INCREMENT`?"
- `NUMERIC(p,s)` vs `FLOAT` â€” `FLOAT` is an approximation that compounds rounding errors over time; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices and financial values; interviewers ask "why would you not use `FLOAT` for money?"
- `TIMESTAMP` vs `TIMESTAMPTZ` â€” `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` â€” stores true, false, or null; use SQL literals `TRUE` and `FALSE` because PostgreSQL does
  not generally treat an unquoted integer `1` as a boolean

---

### PostgreSQL specifics

- `::` cast operator â€” `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `ILIKE` â€” case-insensitive pattern matching; not available in MySQL or SQL Server; interviewers switching from MySQL ask why `LIKE` is not finding results they expect
- `DISTINCT ON` â€” keeps one row per group while returning multiple columns; not available in standard SQL; the column in `DISTINCT ON (...)` must be leftmost in `ORDER BY`
- `RETURNING` â€” `INSERT`, `UPDATE`, and `DELETE` can return the affected rows in a single statement; avoids a second `SELECT`; not standard SQL
- `DATE_TRUNC('month', date)` â€” truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `NOW()` vs `CURRENT_DATE` â€” `NOW()` returns the current timestamp including time; `CURRENT_DATE` returns today's date with no time; used in date range filters and default column values
- `INTERVAL` â€” `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- `STRING_AGG(column, separator)` â€” concatenates values from multiple rows into one string per group, e.g. `STRING_AGG(name, ', ')` to list all project names for a user on one line; PostgreSQL-specific; interviewers ask how you would turn grouped rows into a single comma-separated column for a report

---

### Performance basics

- What an index is â€” a sorted data structure that speeds up reads on a column at the cost of slower writes; primary keys and `UNIQUE` columns are indexed automatically; foreign key columns used in JOINs benefit most from a manual index
- When to add an index â€” columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- When NOT to index â€” small tables, columns with very few distinct values (a `status` column with three options gains little), and columns that are updated very frequently
- `EXPLAIN` â€” shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index

---

## Git

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from the projects. Focus on daily workflow, team collaboration, and the concepts that come up in code reviews and interviews.

### Core workflow

- `init`, `clone` â€” `init` starts a repo from scratch locally; `clone` downloads an existing remote repo; interviewers ask: "how would you start working on this project on a new machine?" (answer: clone, not init)
- The three areas â€” working directory, staging area, repository; interviewers ask "what is the staging area for?" â€” it exists so you can commit part of your changes, not everything at once
- `add`, `commit` â€” staging specific files and saving a snapshot; a common question is "why do you stage before committing?" and "what is the difference between `git add .` and `git add filename`?"
- `push`, `pull`, `fetch` â€” `push` sends commits to the remote; `pull` downloads and merges; `fetch` downloads without merging; interviewers ask the pull vs fetch difference every time
- `status`, `log --oneline`, `diff --staged` â€” essential inspection commands; `diff --staged` shows what will go into the next commit (not what is just modified); `log --oneline` is the standard compact view
- `git log` flags (`--graph`, `--all`, `--author`, `filename`) â€” reading the full history of a project; interviewers may show a branched log and ask to explain it; `--graph --all` makes the branch structure visible
- `git show <commit>` â€” displays the full diff of one specific commit; the fast way to answer "what exactly did this commit change?" without scrolling through `git log -p`; used constantly when explaining your own commit history in a technical interview
- `git blame` â€” shows who last modified each line of a file and in which commit; used to find context for unfamiliar code; interviewers ask "how do you find out when this line was added and by whom?"

### Branching and HEAD

- `HEAD` pointer â€” marks the currently checked-out commit, usually through the current branch name;
  in detached HEAD it points directly to a commit that may not be a branch tip
- `HEAD~1`, `HEAD~2` notation â€” "one commit before HEAD", "two commits before HEAD"; used in `git reset HEAD~1` and `git rebase -i HEAD~3`; interviewers show a reset or rebase command and ask "what does this do?"
- Detached HEAD â€” happens when you checkout a specific commit ID instead of a branch; new commits are not attached to any branch and can be lost; fix with `git checkout -b new-branch-name`
- `branch`, `checkout`, `switch` â€” creating and switching branches; `switch` is the modern alternative to `checkout` for branches (Git 2.23+); interviewers may ask which you prefer and why
- `git branch -d` vs `git branch -D` â€” `-d` is a safe delete (fails if the branch has unmerged changes); `-D` is a force delete; interviewers ask "what happens if you try to delete a branch that hasn't been merged?"
- Branch naming conventions â€” `feat/`, `fix/`, `technology/##-project-name`; tested in team process questions: "how do you organise branches in a team?"
- `merge` â€” joins branches; creates a merge commit when both branches have advanced since they split; the merge commit has two parents and preserves the full history
- Fast-forward merge vs three-way merge â€” fast-forward: pointer just moves forward (no divergence, no extra commit); three-way: both branches have new commits, so Git creates a merge commit with two parents; interviewers ask when each one happens
- `git cherry-pick` â€” applies a specific commit from another branch onto the current one; used to apply a hotfix to main without merging the whole feature branch; use sparingly â€” it duplicates commits and can confuse the history

### Rebase

- What `rebase` does â€” replays your commits on top of another branch as if you had started from there; the rebased commits get new IDs; result is a linear history with no merge commit
- `rebase` vs `merge` â€” rebase gives a cleaner, linear history; merge preserves exactly when branches diverged; teams pick one convention and stick to it; interviewers ask "what does your team use and why?"
- The golden rule of rebase â€” never rebase a branch that other people are working on; rebasing rewrites commit IDs â€” anyone who pulled those commits will have a broken history
- `git rebase -i` (interactive rebase) â€” opens an editor to squash, reword, reorder, or drop commits; the standard way to clean up a messy local history before opening a PR; only safe on commits not yet pushed
- Resolving a conflict during rebase â€” Git pauses on the first conflicting commit instead of stopping the whole operation; fix the file, `git add`, then `git rebase --continue` to move to the next commit, or `git rebase --abort` to cancel and return to the state before the rebase started; interviewers ask this to check you understand rebase replays commits one at a time, unlike a merge conflict which happens once
- `git merge --abort` vs `git rebase --abort` â€” both cancel the operation in progress and restore the pre-operation state; the names mirror each other but apply to different commands; interviewers ask "what do you do if a merge or rebase goes wrong halfway through?" expecting you to know the matching abort command exists for each

### Remote and collaboration

- `remote`, `origin` â€” `origin` is the default alias for the remote URL; every `push` and `pull` uses it; interviewers ask "what is origin?" â€” the answer is an alias for the remote URL, not a branch name
- `git push -u` (upstream tracking) â€” `-u` links your local branch to the remote branch; after setting it once, `git push` alone works; interviewers ask "what does the `-u` flag do?"
- Pull requests â€” a request to merge a branch with a description of what changed and why; the place for code review before changes reach main; the merge does not happen automatically
- PR description format â€” `## Changes` lists what changed; `## Why` explains the main decision; must make sense to someone who has not read the code; this is documentation that lives permanently with the commit history
- PR merge strategies â€” squash (all PR commits become one), merge commit (full PR history preserved), rebase merge (replays commits linearly, no merge commit); interviewers ask "what merge strategy does your team use and why?"
- Code review â€” checking that the code does what the PR says, handles edge cases, is readable, has no obvious security issues, and includes tests; even in solo projects, reading your own diff before merging catches bugs

### Merge conflicts

- What causes a conflict â€” two branches modify the same line of the same file; Git stops the merge and asks you to decide which version to keep; conflicts are not errors, they are Git asking for a human decision
- Conflict markers (`<<<<`, `====`, `>>>>`) â€” `<<<< HEAD` is your version; `>>>> branch-name` is the incoming version; `====` is the separator; you delete all three markers after choosing the final version
- `git merge --abort` â€” cancels an in-progress merge and returns to the state before you ran `git merge`; use when the conflicts are too complex to resolve right now
- Avoiding conflicts â€” pull from the target branch frequently; keep feature branches short-lived; communicate with teammates about which files each person is touching

### Stash

- `git stash`, `git stash pop` â€” saves uncommitted changes to a temporary stack so you can switch branches without committing unfinished work; `pop` restores and removes the stash from the list
- `git stash apply` vs `git stash pop` â€” `apply` restores the stash but keeps it in the list; `pop` restores and deletes it; interviewers ask the difference when you say you use stash regularly
- `git stash list` â€” shows all saved stashes with an index and name; important when you have multiple stashes and need to restore a specific one with `git stash pop stash@{1}`

### Undoing changes

- `git restore` â€” discards changes in the working directory without touching history; `--staged` unstages a file; the safe everyday tool for "I changed this but I don't want to keep it"
- `git reset --soft` vs `--mixed` vs `--hard` â€” soft: undo commit, keep changes staged; mixed: undo commit, keep changes unstaged; hard: undo commit and discard changes permanently; `--hard` causes data loss
- The reset rule â€” only use `git reset` on commits that have NOT been pushed to GitHub; if the commit is already on the remote, use `git revert` instead; breaking this rule causes problems for everyone who pulled
- `git revert` â€” creates a new commit that undoes a previous one; the original commit stays visible in the history; safe on shared branches because it does not rewrite history
- `git reset` vs `git revert` â€” reset rewrites history (local only, before push); revert creates a new commit (safe on shared branches, after push); interviewers ask this pair specifically and consistently
- `git reflog` â€” records recent local ref movements and can recover commits after a reset; retention
  is configurable and unreachable entries commonly expire sooner than reachable ones, so it is a
  recovery opportunity rather than a 90-day guarantee

### .gitignore

- What it does â€” tells Git to never track specific files; files listed here never appear in `git status`, never get staged, and never get committed
- Common entries: `node_modules/`, `target/`, `.env`, `.angular/`, `*.class` â€” what each ignores and why it must not be committed; interviewers ask "why is `.env` in `.gitignore`?" (security â€” it contains API keys and secrets that must never be pushed)
- `git rm --cached` â€” stops tracking a file that was already committed by mistake; the file stays on disk but Git stops watching it; the correct command after you realise `.env` was committed before `.gitignore` was created
- Creating `.gitignore` before the first commit â€” if you add a file to `.gitignore` after it was already committed, Git keeps tracking it; you must use `git rm --cached` first to stop tracking it

### Commit quality

- Conventional Commits format â€” `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`, `perf:`; the standard in professional teams; interviewers ask "how do you write a commit message?" â€” they expect this format, not "fixed bug"
- Atomic commits â€” one logical change per commit; interviewers ask "what does atomic mean?" â€” one commit = one thing that can be reverted independently; the opposite is a commit that mixes five unrelated changes
- Good commit message â€” present tense, explains WHY not what, short; the history must be readable without the code; interviewers ask "show me a commit from your project and explain why you wrote it that way"

---

## General

Cross-cutting concepts that appear in interviews regardless of the stack. These come up at every stage: the HR call, the technical test review, and the live technical interview. Every item must be explainable with a real example from a project.

### HTTP methods and request structure

- HTTP methods â€” `GET`, `POST`, `PUT`, `PATCH`, `DELETE`: each expresses the intent of the request; interviewers ask you to choose the right method for a given scenario and justify it (e.g. why POST for login, why PUT vs PATCH for an update endpoint)
- `PUT` vs `PATCH` â€” PUT replaces the entire resource; PATCH updates only the specified fields; the most common confusable pair in REST API discussions; asked in every technical interview that touches a REST endpoint
- Idempotency â€” repeating an idempotent request has the same intended effect as sending it once;
  HTTP defines `GET`, `PUT`, and `DELETE` as idempotent, while `POST` has no idempotency guarantee
  unless the application deliberately adds one
- Headers â€” `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format; `Accept` specifies the expected response format; interviewers ask which header is used for authentication and what happens if you omit `Content-Type`
- Path parameters vs query parameters vs request body â€” path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update; interviewers ask you to choose the right placement for a given field
- HTTPS vs HTTP â€” TLS encrypts the connection so headers and body (including the JWT) cannot be read in transit; required for any API that handles passwords or tokens; interviewers ask why you would never send a password over plain HTTP
- Request/response lifecycle â€” Angular component â†’ HTTP interceptor â†’ browser â†’ Spring Security filter chain â†’ controller â†’ service â†’ repository â†’ response travels back; interviewers ask you to trace a login request end-to-end to test architectural understanding

### HTTP status codes

- 2xx success codes â€” `200 OK` for a successful read or update, `201 Created` after a POST that creates a resource, `204 No Content` after a DELETE (success but no body); interviewers ask which to use after each HTTP method and why 201 is not the default for every POST
- `400 Bad Request` â€” the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails; shows you understand the difference between a client error and a server error
- `401 Unauthorized` vs `403 Forbidden` â€” 401 means unauthenticated (no token or invalid token); 403 means authenticated but not allowed (wrong role); the most common confusable pair in security discussions
- `404 Not Found` vs `409 Conflict` â€” 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email, name already taken); shows semantic awareness beyond just 400 and 500
- `500 Internal Server Error` â€” the server encountered an unexpected failure; global error handling
  should format and log it consistently, not disguise every genuine server fault as a client error

### JSON and serialization

- JSON data types â€” objects `{}`, arrays `[]`, strings, numbers, booleans, null; keys must be double-quoted strings; no trailing commas; tested when debugging a `400` caused by malformed JSON
- Jackson â€” Spring Boot uses Jackson automatically to convert between JSON and Java objects; `@RestController` triggers automatic serialization without any configuration; interviewers ask how Spring Boot "knows" to return JSON
- `@JsonProperty` â€” maps a JSON key to a Java field with a different name; necessary when the API contract uses snake_case (`user_name`) but the Java class uses camelCase (`userName`)
- `JSON.parse()` vs `JSON.stringify()` â€” `stringify` converts a JavaScript object to a JSON string; `parse` converts it back; only needed for `localStorage`, never for `HttpClient` calls (Angular handles JSON automatically); confusing them leads to storing `[object Object]` in localStorage

### Error handling

- Local error recovery â€” a caller may replace a failed operation with a fallback only when that
  fallback is semantically honest; silently converting every failure into empty data fabricates success
- HTTP interceptor for global errors â€” the right place to handle 401 (expired token â†’ redirect to login) and network failures; one interceptor replaces `catchError` in every service for these global concerns
- `catchError` in service vs interceptor â€” service-level handles specific, local failures; interceptor handles global concerns (token expiry, network outage); interviewers ask which approach you would use for a given scenario and why
- `@ControllerAdvice` + `@ExceptionHandler` â€” maps custom exceptions to HTTP status codes in one class; the Spring Boot equivalent of Angular's error interceptor; without it, every unhandled exception returns a generic 500 with no useful message for the client
- Error propagation â€” throw errors upward and handle them once at the outermost layer; never swallow an exception silently without at least logging it; catching and re-throwing without adding information hides the root cause

### Software testing

- Unit test â€” verifies one unit of behaviour through a small boundary; collaborators may be real,
  stubbed, faked, or mocked depending on what keeps the test focused
- Integration test â€” verifies selected real components working together; it may load part or all of
  an application and may use real or controlled infrastructure depending on the boundary under test
- End-to-end (E2E) test â€” tests the full user flow through a real browser; the slowest and the fewest; covers only the most critical user journeys
- Testing pyramid â€” a heuristic that favours many fast focused tests and fewer expensive broad tests;
  it communicates trade-offs, not a universal numeric ratio
- Mock vs stub â€” a mock is a fake dependency you can configure and verify (check how it was called afterwards); a stub just returns a fixed value with no verification; in practice "mock" is used for both; Mockito handles both in Java
- Jasmine + TestBed â€” the standard tools for Angular service tests and component tests; `TestBed` creates a minimal Angular module for testing without a real browser

### Browser storage

- `localStorage` â€” persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript, which makes it vulnerable to XSS token theft
- `sessionStorage` â€” cleared when the tab closes; not shared between tabs; same API as `localStorage`; used for temporary state that should not survive a browser restart
- Cookies â€” sent automatically with matching requests; `HttpOnly` blocks JavaScript access,
  `Secure` restricts transport to HTTPS, and `SameSite` mitigates cross-site requests without being a
  universal replacement for CSRF protection

### Environment variables

- Why secrets must never be committed â€” a committed secret is permanently visible in git history even after deletion; it must be treated as compromised and rotated immediately; tested in every project review that handles tokens or API keys
- `${VAR_NAME}` in `application.properties` â€” Spring Boot reads the environment variable at startup and substitutes the value; `@Value("${app.jwt.secret}")` injects the resolved value into a class field
- Fail-fast on missing variables â€” if a required variable is not set and has no default value, Spring Boot fails at startup with a clear error instead of a `NullPointerException` at runtime; this is intentional â€” fail early and loudly
- `.env.example` â€” documents which variables are required without exposing real values; safe to commit; the real secrets live in OS environment variables, IntelliJ run configuration, or a secret manager â€” never in a committed file

### Containerisation (Docker)

- What a container is â€” a lightweight, isolated process that bundles the app with its exact runtime and dependencies so it behaves the same on every machine; interviewers ask "what problem does Docker solve?" and expect the "works on my machine" answer, not a recital of virtualisation theory
- Container vs virtual machine â€” a container shares the host OS kernel and starts in milliseconds; a VM ships a whole guest OS and is far heavier; interviewers ask the difference to check you understand why containers, not VMs, became the standard for shipping services
- Image vs container â€” an image is the immutable blueprint built from a `Dockerfile`; a container is a running instance of that image; the most common Docker confusable pair, asked the same way as "class vs object"
- `Dockerfile` â€” the recipe that builds an image step by step (base image, copy the build artifact, set the entry point); interviewers ask what each instruction does and why each line becomes a cached layer
- `docker-compose up` â€” starts every service declared in `docker-compose.yml` (e.g. Spring Boot + PostgreSQL) with one command and one network; interviewers ask "how does a new developer run your project without installing PostgreSQL by hand?" â€” this is the expected answer
- Environment variables in Compose â€” config and secrets (DB URL, JWT secret) are passed to the container through the `environment` block or an `.env` file, never baked into the image; interviewers ask how you keep credentials out of an image that may be shared or pushed to a registry
- Why containerisation matters in a consultancy â€” identical environments across dev, CI, and production remove a whole class of "it ran locally" deployment bugs; in 2026 large Spanish consultancies treat basic Docker fluency as a baseline expectation, so not being able to explain `docker-compose up` reads as behind

### Base64

- Base64 is not encryption â€” it is reversible text encoding for binary data using 64 printable characters; anyone can decode it in one step; interviewers ask this specifically to catch candidates who confuse encoding with security
- `btoa()` / `atob()` â€” browser functions for basic Base64 text conversion; they do not add
  confidentiality or integrity and have Unicode limitations that production code must handle
- Text encoding vs binary encoding â€” UTF-8 maps characters to bytes while Base64 maps bytes to safe
  text; confusing these layers produces corrupted non-ASCII data and false security assumptions

### Logging

- Why not `System.out.println()` / `console.log()` for debugging production code â€” print statements cannot be turned off, are not timestamped, and are lost once the terminal closes; interviewers ask "how would you debug an issue in a deployed app without a debugger attached?" â€” logs are the expected answer
- Log levels â€” `DEBUG` (detailed, dev only), `INFO` (normal events, e.g. "user logged in"), `WARN` (something unexpected but recoverable), `ERROR` (something failed); interviewers ask what level you would use for a caught exception that the app recovered from (`WARN`, not `ERROR`, if the request still succeeded)
- Logs vs exceptions in error handling â€” an exception interrupts the current operation and must be handled or propagated; a log is a side note that does not change control flow; interviewers ask why you would still log an exception even after it is already handled by `@RestControllerAdvice` (loses the stack trace otherwise â€” the client only sees a clean message, but the server needs the detail to debug)

### Code principles

- DRY â€” extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?" â€” the answer is extract, not copy
- KISS â€” the simplest solution that works is the right one; complexity is a cost that must be justified; interviewers probe this when they see overcomplicated junior code or bloated AI-generated boilerplate
- YAGNI â€” do not build features for hypothetical future requirements; adding pagination before it is needed, or building a plugin system for a feature with one implementation, are the classic examples; common in AI-generated code

### Agile and delivery awareness

- Scrum roles â€” Product Owner prioritises value, Scrum Master facilitates the framework, and
  Developers deliver the increment; interviewers expect recognition rather than certification detail
- Sprint and increment â€” a sprint is a fixed iteration and the increment is the usable result that
  meets the Definition of Done
- Planning, daily Scrum, review, and retrospective â€” each event has a distinct purpose: select work,
  inspect progress, inspect the product, and improve the process
- User story and acceptance criteria â€” the story expresses user value while acceptance criteria make
  the behaviour testable; they are not interchangeable with implementation tasks
- Definition of Done â€” a shared quality gate such as reviewed, tested, integrated, and deployable;
  it prevents each person from using a private meaning of â€œfinishedâ€
- CI/CD awareness â€” continuous integration builds and tests small merged changes; continuous delivery
  keeps a releasable artefact, while deployment automation is a later operational depth
- Cloud awareness â€” AWS or Azure provides managed compute, storage, networking, and databases;
  junior coverage is recognising the deployment model, not designing cloud infrastructure

---
