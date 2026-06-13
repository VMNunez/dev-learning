# Global Coverage — All Topics

Combined minimum coverage for every topic in the notes folder.
Source files: one `coverage.md` per topic folder — this file is a read-only mirror for cross-topic analysis.
Order follows study priority: Angular → Angular Material → Spring Boot → Java → Architecture → Security → TypeScript → JavaScript → CSS → SQL → Git → General.

---

## Angular

Topics a junior must know to pass a technical screening for Angular roles at Spanish consultancies in 2026.
Every item must be explainable with a real example from at least one of the six Angular projects or TimeTrack.

### Components and templates
- `@Component` — selector, template, styles, `standalone: true`; interviewers ask what standalone means and why Angular 17+ uses it by default
- `imports` array on `@Component` — every directive, pipe, or component used in the template must be listed here; forgetting one causes a clear Angular error; interviewers ask why Angular 17+ moved away from NgModules
- Data binding: interpolation `{{ }}`, property `[]`, event `()`, two-way `[()]` — the four types; interviewers ask the difference between `[]` and `{{}}`
- `input()` and `output()` — signal-based component communication; interviewers ask "how does data flow between parent and child?"
- `@if`, `@for`, `@empty`, `@else` — new control flow syntax; `@for` requires a `track` expression for performance; interviewers ask why `track` matters
- Template reference variables — `#ref` on any template element gives a typed handle to it; pass `ref.value` to a method without a signal or form control; interviewers ask how you read an input value without reactive forms
- `ng-content` — content projection; lets a parent inject arbitrary HTML into a child's template slot; interviewers ask how you build a reusable layout wrapper in Angular
- `[class.x]` binding — applies a single CSS class when the condition is true; simpler and more readable than `ngClass` for a single class; interviewers ask the difference from `ngClass`
- `ngClass` — applies multiple CSS classes conditionally using an object map `{ 'class': condition }`; reach for it when two or more classes depend on component state; interviewers ask when to use it instead of `[class.x]`
- `@ViewChild` — accessing a child element or component from the class after the view is built; needed for `MatSort` and `MatPaginator` in `ngAfterViewInit`
- Lifecycle hooks: `ngOnInit` (run logic on load), `ngAfterViewInit` (first safe moment to use `@ViewChild`), `ngOnDestroy` (cleanup) — interviewers ask when each fires and why

### Signals
- `signal()`, `signal.set()`, `signal.update()` — creating and mutating reactive state; `set()` replaces the value, `update()` uses the previous value; interviewers ask which one to use when adding an item to an array
- `computed()` — derived state that recalculates automatically when its dependencies change; used for filtered lists, stats, and role-aware UI; returns a value and cannot be set directly
- `effect()` — runs a side effect when a tracked signal changes; must be created inside a constructor or injection context, never outside; cannot modify a signal inside — that creates an infinite loop
- `computed()` vs `effect()` — `computed()` returns a derived value (filtered list, boolean flag); `effect()` performs a side effect with no return value (save to localStorage, sync to a non-reactive library); the most common mistake is using `effect()` to derive values when `computed()` is the right tool
- `effect()` + localStorage pattern — initialise a signal from localStorage, then use `effect()` to keep them in sync on every change
- Signal reference vs snapshot — `service.signal` (no parentheses) stores the live signal and stays reactive; `service.signal()` reads the value once and never updates; storing the snapshot in a property is a common bug

### Services and dependency injection
- `@Injectable({ providedIn: 'root' })` — what dependency injection is, what a singleton service means, and why Angular uses it instead of importing classes directly
- `inject()` — the modern way to inject a service; no constructor needed in Angular 17+
- `HttpClient` — making GET, POST, PUT, DELETE, PATCH calls with typed responses; interviewers ask "how do you call a REST API from Angular?"
- `HttpParams` — building query parameters programmatically for filtered API calls; used in TimeTrack for `?month=2025-05&status=SUBMITTED` on the entries endpoint
- Error handling: `catchError` + loading/error signal pattern — how to show loading state and handle a failed HTTP call without crashing the app

### RxJS
- `Observable` and `subscribe` — what reactive programming means and why `HttpClient` returns Observables instead of Promises
- `pipe` and key operators: `map`, `filter`, `switchMap`, `debounceTime`, `catchError` — what each does and a real use case for each
- `forkJoin` — run multiple HTTP calls in parallel and wait for all to complete; used on the TimeTrack dashboard to load stat cards simultaneously
- `takeUntilDestroyed` + `DestroyRef` — automatic unsubscription when the component is destroyed; interviewers ask "how do you avoid memory leaks in Angular?"
- `async` pipe — subscribes in the template and unsubscribes automatically; the alternative to calling `subscribe()` manually in the class
- Memory leak risk — what happens when you call `subscribe()` without ever unsubscribing; why it matters in a long-running SPA

### RxJS Interop
- `toSignal()` — converts an Observable (e.g. `HttpClient.get()`) into a signal; Angular subscribes and unsubscribes automatically; interviewers ask "how do you use HttpClient results in the template with the signals model?"
- `initialValue` option on `toSignal()` — the Observable has not emitted when the component first renders; without `initialValue` the signal is `undefined`, which crashes a template that loops over it; always set it for calls that return an array
- `toSignal()` injection context rule — must be called in the class body or constructor, never inside `ngOnInit` or an event handler; calling it outside an injection context throws a runtime error
- `toSignal()` vs `subscribe()` — use `toSignal()` when the template displays the data directly; use `subscribe()` + `takeUntilDestroyed` when you need to update multiple signals or trigger a side effect from one response
- `fromSignal()` — converts a signal into an Observable stream so you can pipe it through `debounceTime` and `switchMap`; used for search-as-you-type when the search term is stored as a signal

### Routing
- `provideRouter`, `routerLink`, `RouterOutlet`, `routerLinkActive` — the building blocks of Angular navigation
- `ActivatedRoute` — `snapshot.paramMap.get()` for route params, `queryParamMap` for query params; the correct way to read URL data inside a component
- Route params vs query params — params are part of the path (`/entries/:id`), query params are optional extras (`?month=2025-05`); interviewers ask when to use each
- `snapshot` vs Observable `paramMap` — use `snapshot` when the component is destroyed on navigation away (the standard case); subscribe to `paramMap` only when the id can change while the component stays alive, such as a next/previous button on the same route
- `CanActivateFn` guard — protecting a route; returns `true` to allow or `router.createUrlTree()` to redirect; do not use `router.navigate()` inside a guard — it causes double navigation
- `noAuthGuard` — the reverse of `authGuard`; redirects an already-logged-in user away from the login page; without it, the browser back button can land an authenticated user on the login form
- `CanDeactivateFn` guard — warning before leaving a page with unsaved changes; the guard receives the component instance to check its state
- Lazy loading: `loadComponent`, `loadChildren` — why it reduces the initial bundle size; interviewers ask "how do you improve Angular startup performance?"
- `HttpInterceptorFn` — intercepting every outgoing request to add the JWT token and handling 401 errors globally in one place, not in every service

### Reactive forms
- `FormGroup`, `FormControl`, `FormBuilder` — the three pieces of a reactive form; `FormBuilder` is the shorthand for creating groups with less code
- Built-in validators: `Validators.required`, `Validators.min`, `Validators.email` — the most common validations
- Custom validators — a function that returns `null` (valid) or `{ key: true }` (invalid); used when built-in validators are not enough
- `form.markAllAsTouched()` — triggers all validation messages on a submit attempt; without it errors only appear after the user touches each field individually
- `form.patchValue()` vs `form.setValue()` — `patchValue()` updates only the fields you pass and ignores missing ones; `setValue()` requires every field and throws an error if one is missing; interviewers ask the difference when discussing edit forms
- `form.reset()`, `form.dirty` — resetting after save, and checking for unsaved changes before navigating away
- `setErrors({ key: true })` — setting a custom error on a control programmatically (e.g. duplicate name); clears automatically when validators re-run on the next keystroke
- Showing errors in the template: `control.hasError('key')` + `control.touched` — the pattern every Angular form uses to display validation messages
- `FormArray` — holds a dynamic list of form controls accessed by index instead of by name; use when the number of fields is not known upfront; interviewers ask the difference from `FormGroup`

### Pipes
- Built-in pipes: `date`, `number`, `currency`, `uppercase`, `slice` — what each formats and when to reach for it
- Custom pipes: `@Pipe({ name: '...' })`, `transform()` method — when to create one (logic that repeats across multiple templates)

### Component styles
- View encapsulation — Angular scopes component CSS by adding unique attributes to each template element; styles in `component.css` only apply to elements you wrote in that template; interviewers ask "why doesn't my CSS rule apply to Angular Material's internal elements?"
- Global `styles.css` for Material internals — Angular Material renders its own internal HTML without the component's scoping attribute; to override Material internals, the rule must go in `styles.css`
- `:host` selector — targets the component's own wrapper element from inside its CSS file; custom elements are `inline` by default and need `:host { display: block }` to behave as block elements
- `::ng-deep` (deprecated) — a CSS combinator that bypassed encapsulation to reach Material internals; you will see it in almost every enterprise Angular codebase built before 2022; the correct modern replacement is to put the rule in `styles.css`

### Patterns
- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; makes components reusable and testable
- Coordinator pattern — a smart page that orchestrates multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- Role-aware UI — `isAdmin = computed(() => authService.currentUser()?.role === 'admin')`; controls which elements render using `@if (isAdmin())`; the key difference from route guards: guards block navigation, role-aware UI cleans the interface for non-admin users
- Core / Feature / Shared folder structure — `core/` for guards, interceptors, singleton services; `pages/` for feature areas; `shared/` for reusable components; standard in enterprise Angular at Spanish consultancies
- HTTP interceptor as a cross-cutting concern — one interceptor handles auth headers and global error responses for the whole app, not repeated in every service

### Angular Material (Angular context)
- `MatTable` with `MatTableDataSource`, `MatSort`, `MatPaginator` — the standard way to display tabular data; interviewers at consultancies expect you to know this combination
- `MatDialog` — opening a modal, passing data in with `MAT_DIALOG_DATA`, and reading the result with `afterClosed()`
- Form fields: `mat-form-field`, `mat-error`, `ErrorStateMatcher` — how Material shows validation errors inside styled form fields
- `MatSnackBar` — user feedback after actions (save, delete, error); injected as a service, not added to `imports`
- Custom theming: scoped `mat.theme()` in a component stylesheet — how to apply a different colour to one component without changing the whole app

### Testing
- Jasmine: `describe`, `it`, `expect`, `beforeEach` — the test structure Angular uses by default; required from project 07 onwards
- `TestBed.configureTestingModule` — sets up the Angular DI context for a test so you can inject real services and mocks
- Testing a service with `TestBed` — how to inject the service and call its methods in a test; what you verify and why
- `spyOn(service, 'method')` — replaces a real method with a controlled fake; use `.and.returnValue()` to control what it returns; use `.toHaveBeenCalledWith()` to assert it was called correctly
- `HttpClientTestingModule` + `HttpTestingController` — intercept HTTP calls in tests without hitting the network; `httpMock.expectOne(url)` asserts exactly one request was made; `req.flush(data)` sends the mock response; `httpMock.verify()` fails the test if unexpected requests were made
- What to test in a service — the business logic: correct return value, correct error thrown, correct state change after the call

### Legacy code recognition — needed on day one at a consultancy
- `@Input()` and `@Output()` decorators — legacy equivalent of `input()` and `output()`; you will see these in every existing consultancy codebase
- `EventEmitter` — used with `@Output()` to emit values to the parent; replaced by `output()` in Angular 17+
- `NgModule` — `declarations`, `imports`, `exports`, `providers`; how pre-standalone Angular apps are structured; most consultancy projects still use this
- `*ngIf` and `*ngFor` — legacy structural directives; still widely used; `*ngFor` does not require `track` but performs worse without it
- `ngModel` and `FormsModule` — template-driven two-way binding with the `[()]` banana-in-a-box syntax; still widely used in existing consultancy codebases
- Zone.js and default change detection — what it means conceptually; why signals and `OnPush` reduce unnecessary re-renders
- `OnPush` change detection strategy — the component only re-renders when an input reference changes or an event fires inside it; signals are fully compatible with `OnPush`
- `ngOnChanges` — lifecycle hook that fires every time an `@Input()` value changes; receives a `SimpleChanges` object; the signals equivalent is `effect()`
- `BehaviorSubject` — holds the current value and emits it immediately to new subscribers; the most common pattern for shared state before signals; interviewers ask the difference from `Subject`
- `Subject` — emits to currently active subscribers only; late subscribers miss values emitted before they subscribed; used for one-time events rather than shared state; interviewers ask the difference from `BehaviorSubject`

---

## Angular Material

Angular Material is standard in Spanish consultancies — interviewers expect you to have used it in a real app, not just read the docs.

### Theming and setup
- `ng add @angular/material` — the correct way to install Angular Material; interviewers may ask what it does (adds the package, configures theming, imports fonts and icons in `index.html`)
- `mat.theme()` in `material-theme.scss` — the v19+ way to define the app's color palette; interviewers ask why you use this instead of overriding CSS classes directly (CSS variables, upgrade-safe)
- Context-specific theme — scoping `mat.theme()` to a CSS class (e.g. `.btn-danger`) to apply a different palette to one component; interviewers ask how to make a red delete button without hardcoding colors
- `mat.$red-palette` and other prebuilt palettes — used inside a scoped `mat.theme()` to change a component's color variant
- `provideNativeDateAdapter()` in `app.config.ts` — required for `MatDatepicker`; missing it causes a runtime error; interviewers test whether you know where providers go in a standalone app

### Buttons and icons
- `matButton` variants (`filled`, `outlined`, `elevated`, `tonal`) — when to use each; interviewers ask which variant is for the primary action (`filled`) and which for secondary (`outlined`)
- `matIconButton` — circle icon-only button used in table rows and toolbars; pair it with `aria-label` (no visible text — screen readers need the description)
- `matFab` / `matMiniFab` — floating action button for the one dominant page action; interviewers ask when you would use FAB vs a regular button
- `<mat-icon>` — how Material icons work; icon names come from Google Material Symbols; interviewers may ask how you add an icon to a button and where the font is loaded

### Form fields
- `mat-form-field` — wrapper that gives Material styling to an input; must always contain a control (`matInput` or `mat-select`) and cannot be used alone
- `mat-label` — floating label that animates up when the field has focus or a value
- `matInput` — directive on `<input>` or `<textarea>` to style it inside `mat-form-field`
- `mat-error` — shows validation error text; appears by default when invalid + touched; change behaviour with `ErrorStateMatcher`
- `mat-hint` — helper text always visible below the field; interviewers ask the difference between `mat-hint` and `mat-error` (hint is always visible; error appears conditionally)
- `subscriptSizing="dynamic"` on `mat-form-field` — removes the reserved space for hint/error; interviewers ask why a form field and a button won't align vertically in a flex row (the reserved space is the reason)
- `ErrorStateMatcher` — interface that controls when `mat-error` appears; interviewers ask how to make errors show only after submit, not on blur — a standard dialog pattern

### Select and options
- `mat-select` + `mat-option` — styled dropdown inside `mat-form-field`; interviewers ask the difference between `value="pending"` (literal string) and `[value]="status"` (property binding)
- `(selectionChange)` vs `[(value)]` — `selectionChange` fires on user pick; `[(value)]` is two-way binding; interviewers ask when to use each
- `mat-optgroup` — groups options under a label; interviewers may ask how to visually separate options without disabling them
- `multiple` attribute on `mat-select` — makes the value an array; interviewers ask what changes in the form value when `multiple` is enabled

### Table
- `mat-table` attribute on `<table>` — turns a native table into a Material table; four required pieces: `displayedColumns`, `ng-container matColumnDef`, `*matCellDef`, the two `<tr>` rows at the bottom
- `matColumnDef` on `ng-container` — defines one column; value must match exactly one string in `displayedColumns`; interviewers ask what happens if the name doesn't match (column does not render)
- `*matHeaderCellDef` / `*matCellDef` — structural directives that define the header and data cell templates for a column
- `*matHeaderRowDef` / `*matRowDef` — render the header row and one data row per item; both reference `displayedColumns`
- `*matNoDataRow` — empty state row shown when `dataSource` has no items; use `[attr.colspan]="displayedColumns.length"` to span all columns
- `MatTableDataSource` — wrapper around an array that handles sorting, filtering, and pagination; interviewers ask why you use it instead of a plain array
- `MatTableDataSource` with `effect()` — when data comes from a signal input, use `effect()` to assign `dataSource.data = tasks()` and keep the source in sync
- `@if` vs `computed()` for conditional columns — wrapping `ng-container matColumnDef` in `@if` causes a Material error because the column is never registered; correct pattern is `displayColumns = computed(...)` that includes or excludes the column name

### Sorting
- `MatSort` + `MatSortModule` — add column sorting to a Material table; interviewers ask the difference between `MatSort` (the class, for `@ViewChild`) and `MatSortModule` (the module, for `imports`)
- `matSort` on `<table>` and `mat-sort-header` on `<th>` — `mat-sort-header` goes on the `<th>` element, not on the `ng-container`; a common mistake interviewers test for
- `@ViewChild(MatSort)` in `ngAfterViewInit` — you must connect `dataSource.sort = this.sort` in `ngAfterViewInit` and not in the constructor (template doesn't exist yet)
- View encapsulation and `styles.css` — sort header internals cannot be styled from component CSS; global `styles.css` is required; interviewers ask why centering a sort header column from component CSS doesn't work

### Paginator
- `MatPaginator` + `MatPaginatorModule` — adds page controls to a table; same `@ViewChild` + `ngAfterViewInit` pattern as `MatSort`; interviewers ask why the paginator must be placed outside and after `</table>`
- `[pageSize]` + `[pageSizeOptions]` — configure default rows per page and the size options the user can pick
- Reset to first page after filter — `this.dataSource.paginator.firstPage()` after applying a filter; interviewers ask what happens without it (user stays on a page that may now be empty)

### Dialog
- `MatDialog` service + `MatDialogRef` — `MatDialog` is injected in the parent to open; `MatDialogRef` is injected in the dialog to close and return data
- `dialog.open(ComponentClass, config)` — interviewers ask what the first argument is (the component class itself, not a string)
- `afterClosed().subscribe()` — where the parent listens for the dialog result; emits `undefined` when the user clicks Cancel or clicks outside
- `MAT_DIALOG_DATA` — injection token to read data passed from the parent into the dialog; check if `data` is `null` to know if the dialog is in add vs edit mode
- `patchValue()` vs `setValue()` — `patchValue()` fills only the fields you pass; `setValue()` requires all fields; use `patchValue()` when pre-filling a dialog for edit
- `mat-dialog-title` / `mat-dialog-content` / `mat-dialog-actions` — must be siblings, never nested; nesting corrupts the layout
- `mat-dialog-close` attribute on Cancel button — closes the dialog with no data and no TypeScript needed
- `autoFocus: false` in the dialog config — prevents the focus ring appearing on the first button when the dialog opens
- Confirmation dialog pattern — reusable dialog that takes `title`, `message`, `confirmLabel` as `MAT_DIALOG_DATA` and returns `true` on confirm

### Snackbar
- `MatSnackBar` is a service — no `imports` array entry needed; interviewers ask how it differs from other Material components
- `snackBar.open(message, actionLabel, { duration })` — the three parameters; if `duration` is omitted the snackbar stays open until the user clicks the action
- `MatSnackBar` vs `MatDialog` — snackbar does not block the user and closes automatically; dialog blocks the user and requires interaction
- Coordinator pattern for snackbar — always call `snackBar.open()` in the page component after `afterClosed()` returns, never inside the dialog

### Navigation shell — Toolbar, Sidenav
- `mat-toolbar` — persistent app header; `justify-content: space-between` or a flex spacer to push title left and actions right
- `mat-sidenav-container` / `mat-sidenav` / `mat-sidenav-content` — the three-element structure that is always required
- `mode="side"` vs `mode="over"` — `side` shows next to content with no backdrop; `over` floats above content with a backdrop; enterprise app shells use `side`
- `[opened]="!!currentUser()"` — how to show/hide the sidenav reactively; `!!` converts `User | null` to `boolean`
- Keep `mat-sidenav-container` always in the DOM — if you wrap it in `@if`, the `router-outlet` inside disappears on logout; use `[opened]` to hide instead
- Full-height app shell CSS — the height chain (`html → body → app-root → mat-sidenav-container`); `overflow: hidden` on `app-root` is the key rule
- `mat-nav-list` + `mat-list-item` — correct elements for navigation links inside the sidenav
- `routerLinkActive` + `[activated]` pattern — `#rla="routerLinkActive"` gives access to `rla.isActive`, passed to Material's built-in active style via `[activated]`

### Card
- `mat-card` structure — `mat-card-header`, `mat-card-content`, `mat-card-actions`; interviewers ask what each section is for and which are optional
- `appearance="outlined"` vs default `raised` — `outlined` is flat with a border; `raised` has a shadow; `outlined` for forms and panels; `raised` for stat cards

### Datepicker
- `MatDatepicker` three-element structure — `[matDatepicker]="ref"` on the input, `<mat-datepicker-toggle [for]="ref">` for the icon, and `<mat-datepicker #ref>` as the popup; all three are required
- Value is a `Date` object, not a string — cast with `as unknown as Date`; format for API calls with `.toISOString().split('T')[0]`

### Stepper
- `[linear]="true"` + `[stepControl]="formGroup"` — forces the user to complete each step in order; `[linear]="true"` without `[stepControl]` allows skipping
- `stepper.next()` does not validate — you must call `markAllAsTouched()` and check `form.valid` manually before calling it
- `stepper.selectedIndex` — used to show different buttons per step
- `FormBuilder.group({ field: ['default', validators] })` — shorthand for creating form groups; interviewers ask what the array syntax means (first element is the default value, second is validators)

---

## Spring Boot

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from the TimeTrack project.

### Project setup
- `@SpringBootApplication` — combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`; interviewers ask "what does this annotation replace in a traditional Spring app?" and "why must the class be in the root package?"
- `application.properties` — where datasource, JPA settings, and JWT config go; interviewers ask how you keep credentials out of source control (environment variables with `${VAR_NAME}` syntax; app fails at startup if the variable is missing)
- Profiles: `application-dev.properties`, `spring.profiles.active` — separating config per environment; asked in any interview about real-world deployment
- Maven: `pom.xml` structure, adding a dependency, `mvn clean install` — how the project is built; interviewers ask what `spring-boot-starter-parent` does (manages all dependency versions via a BOM)
- Lombok `@Data` — generates getters, setters, `equals()`, `hashCode()`, and `toString()`; interviewers ask "what does `@Data` generate?"
- Lombok `@NoArgsConstructor` — generates an empty constructor required by JPA to instantiate entities when reading from the database; omitting it causes a runtime error on startup
- Lombok `@AllArgsConstructor` vs `@RequiredArgsConstructor` — `@AllArgsConstructor` takes every field; `@RequiredArgsConstructor` takes only `final` and `@NonNull` fields; use `@RequiredArgsConstructor` for a service class with constructor injection
- `@Slf4j` — Lombok annotation that generates a `log` field; `log.info()`, `log.warn()`, `log.error()`; seen in every production codebase
- `data.sql` — Spring Boot runs this file on startup to seed the database; interviewers ask "how did you create the first user if there is no register endpoint?"

### REST controllers
- `@RestController` — combines `@Controller` and `@ResponseBody`; every return value is serialised to JSON automatically; interviewers ask "what is the difference between `@Controller` and `@RestController`?"
- `@RequestMapping` — sets the base URL path for all methods in the class
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` — method-level annotations for each HTTP verb; `@PatchMapping` is used for partial updates and state transitions
- `@PathVariable` — reads a variable from the URL path (`/{id}`); name inside `{}` must match the parameter name; interviewers ask "what happens if the names don't match?"
- `@RequestBody` — reads the JSON body and converts it to a Java object via Jackson; requires `Content-Type: application/json`; used with `@Valid` to trigger validation
- `@RequestParam` — reads query string parameters (`?month=2025-05`); can be `required = false` with a `defaultValue`
- `ResponseEntity<T>` — the correct way to control the HTTP status code; interviewers ask "why not just return the object directly?"
- HTTP status conventions: 200 GET/PUT success, 201 POST success, 204 DELETE success, 400 validation error, 401 missing/invalid token, 403 not allowed, 404 not found, 409 duplicate — tested in every technical interview
- Jackson serialisation — Spring Boot uses Jackson automatically to convert Java objects to JSON; interviewers ask "how does Spring Boot convert your return value to JSON?"
- Request DTO vs Response DTO — why you never expose the JPA entity directly over the API (couples the API to the DB schema, risks leaking sensitive fields like password hash)
- `toResponse()` mapping pattern — entity-to-DTO conversion extracted to one private helper in the service layer; keeps controllers free of mapping logic
- `@JsonIgnore` — prevents a field from appearing in the JSON response; used on the `password` field so the API never returns hashed passwords

### Dependency injection and beans
- `@Service`, `@Repository`, `@Component`, `@Controller` — all four register the class as a Spring bean; `@Repository` also translates JPA/Hibernate exceptions into Spring's `DataAccessException`
- `@Bean` in a `@Configuration` class — the way to register library classes you cannot annotate; used in `SecurityConfig` for `BCryptPasswordEncoder` and `AuthenticationManager`
- Constructor injection — preferred over `@Autowired` field injection; makes dependencies explicit, `final`, and easy to mock in tests without starting Spring
- `@Value("${property.name}")` — injects a single config value from `application.properties` at startup; the app fails fast if the key is missing
- `@ConfigurationProperties` — binds a group of related properties to a class at once; cleaner than many individual `@Value` annotations

### Spring Data JPA — entity and relationship mapping
- `@Entity` — marks the Java class as a JPA entity; Hibernate manages its lifecycle and maps it to a database table
- `@Table(name = "users")` — sets the table name; required for the `User` entity because `user` is a reserved word in PostgreSQL
- `@Id` — marks the primary key field; without it Hibernate throws a `MappingException` on startup
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — delegates id generation to the database's auto-increment; the default `AUTO` strategy creates gaps — always use `IDENTITY` in PostgreSQL
- `@Column(nullable = false)` and `@Column(unique = true)` — add `NOT NULL` and `UNIQUE` constraints; interviewers inspect entity annotations for missing constraints
- `@ManyToOne(fetch = FetchType.LAZY)` and `@JoinColumn(name = "user_id")` — the entity on the "many" side holds the FK column; interviewers ask "which entity owns the foreign key and why?"
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; omitting `mappedBy` causes JPA to create an unexpected join table
- `@ManyToMany` — models a many-to-many relationship; requires a join table; the third relationship type interviewers expect
- `cascade = CascadeType.ALL` and `orphanRemoval = true` — `cascade` propagates save/delete to children; `orphanRemoval` deletes a child when removed from the parent's collection; interviewers ask the difference
- `@Enumerated(EnumType.STRING)` — stores the enum name (`DRAFT`, `SUBMITTED`) instead of its position number; using `ORDINAL` means inserting a new value in the middle of the enum silently corrupts every existing row
- `@CreationTimestamp` / `@UpdateTimestamp` (Hibernate) vs `@PrePersist` (JPA) — `@CreationTimestamp` is Hibernate-specific; `@PrePersist` is the JPA-standard lifecycle callback; interviewers ask which you chose and why

### Spring Data JPA — repositories, queries, and performance
- `JpaRepository` built-in methods: `save()`, `findById()`, `findAll()`, `deleteById()`, `existsById()` — what Spring provides without writing any SQL
- `save()` insert vs update — `save()` inserts when `id == null` and merges when `id` is already set; interviewers ask how Spring Data decides which operation to run
- Derived query methods: `findByEmail(String email)` — Spring reads the method name and generates the SQL; no `@Query` needed for simple lookups
- `@Query` with JPQL — custom queries for aggregations and complex filtering; JPQL uses entity class names and field names, not table names
- Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` — the standard way to return lists in production; interviewers ask "what happens if you return `findAll()` on a table with 100,000 rows?"
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` — `LAZY` loads the relationship only when you access the field; `EAGER` loads it on every query; `@ManyToOne` defaults to `EAGER` — always declare `FetchType.LAZY` explicitly

### Exception handling
- `@RestControllerAdvice` — marks the global exception handler; using `@ControllerAdvice` alone returns HTML error pages, not JSON
- `@ExceptionHandler(SomeException.class)` — handles one specific exception type and maps it to the right HTTP status code
- Custom exception classes extending `RuntimeException` — unchecked so they propagate without `throws` declarations; named after what went wrong (`ResourceNotFoundException`)
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages
- Error response format — always return a consistent `{ "message": "...", "status": 404 }` body; the Angular client must be able to parse any error the same way
- Soft delete — `active = false` instead of `deleteById()`; preserves historical data and audit trail

### Spring Security — setup and authorization
- `@Configuration` + `@EnableWebSecurity` + `@EnableMethodSecurity` — the three annotations that activate Spring Security and method-level role checks; `@EnableMethodSecurity` is silently ignored if missing
- `SecurityFilterChain` — the single `@Bean` that configures CSRF (disabled for JWT), session policy (`STATELESS`), route permissions, and the JWT filter order
- Route rules: `.requestMatchers("/api/auth/**").permitAll()` and `.anyRequest().authenticated()` — all public and protected routes in one place; order matters
- `@PreAuthorize("hasRole('MANAGER')")` — method-level role check; requires `@EnableMethodSecurity`; silently ignored without it — the most common authorization bug in junior code
- CORS configuration in `SecurityFilterChain` — must be configured inside the Security layer via a `CorsConfigurationSource` bean, not with `@CrossOrigin` on controllers, because the Security filter runs before controllers see the request

### Spring Security — authentication and JWT
- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login
- `BCryptPasswordEncoder` — one-way hashing with a random salt; interviewers ask "why hash and not encrypt?" and "why BCrypt?" (the work factor makes brute-force slow)
- `AuthenticationManager.authenticate()` — Spring's login coordinator; internally triggers `DaoAuthenticationProvider`, which calls `UserDetailsService` and `BCryptPasswordEncoder`
- `OncePerRequestFilter` — the base class for `JwtFilter`; guaranteed to run exactly once per request; reads the `Authorization: Bearer` header, validates the token, and sets the authenticated user in `SecurityContextHolder`
- `SecurityContextHolder` — thread-local storage where `JwtFilter` places the authenticated user for the current request
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`
- JWT structure: `header.payload.signature` — header encodes the algorithm (HS256), payload encodes the claims (`sub`, `iat`, `exp`), signature proves the token was not tampered with
- JWT cannot be invalidated before expiry — once issued a JWT is valid until its `exp` claim passes; practical solution is a short expiry time; a token blacklist in Redis restores revocability but reintroduces server state
- Session-based vs JWT — sessions store state on the server (can revoke instantly, harder to scale); JWT stores state on the client (stateless, scales easily, cannot revoke before expiry)
- HS256 vs RS256 — HS256 uses one shared secret (correct for a single backend service); RS256 uses a public/private key pair (needed when multiple services verify the same token)

### Bean validation
- `@Valid` on `@RequestBody` — activates validation on the incoming DTO; without it all constraint annotations are silently ignored at runtime
- `spring-boot-starter-validation` dependency — required; without it `@NotBlank` and `@Email` compile fine but do nothing at runtime
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — `@NotNull` rejects only null; `@NotEmpty` rejects null and empty string; `@NotBlank` rejects null, empty, and whitespace-only strings; for String fields always use `@NotBlank`
- `@Positive`, `@Size`, `@Email`, `@Min`, `@Max`, `@Pattern` — common validators; interviewers expect you to recall at least three without checking the docs
- `@Validated` on the controller class — required to validate `@PathVariable` and `@RequestParam`; `@Valid` only works on `@RequestBody`
- `ConstraintViolationException` vs `MethodArgumentNotValidException` — `@Valid` on `@RequestBody` throws `MethodArgumentNotValidException`; `@Validated` on path variables throws `ConstraintViolationException`; need a separate `@ExceptionHandler` for each

### Transactions
- `@Transactional` — wraps the service method in a database transaction; if any unchecked exception propagates out, all DB writes roll back automatically
- `@Transactional(readOnly = true)` — signals Hibernate to skip dirty-checking; interviewers ask "what is the benefit?" — saves memory and time on large queries
- Private method gotcha — `@Transactional` on a `private` method is silently ignored because Spring proxies cannot intercept private calls; must be on a `public` method; a classic interview trap
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed; fix by converting to DTO inside the `@Transactional` method
- Where `@Transactional` belongs — on the service layer; controllers do not interact with the database directly and should never have it
- Catching exceptions swallows the rollback — catching a `RuntimeException` inside `@Transactional` and not re-throwing causes Spring to commit; the data is written even though the operation failed
- `REQUIRES_NEW` propagation — always starts a new independent transaction; used when an inner operation (e.g. an audit log write) must commit even if the outer transaction rolls back

### Testing
- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`, `assertThrows` — the minimum to write a service unit test
- `@ExtendWith(MockitoExtension.class)` — activates Mockito in a plain JUnit test without loading any Spring context; the fastest test type
- Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()` — mocking dependencies to test one class in isolation
- Arrange / Act / Assert — the standard three-part structure every test must follow
- `@MockBean` vs `@Mock` — `@Mock` creates a Mockito mock without Spring; `@MockBean` creates a mock AND replaces the real Spring bean; use `@MockBean` inside `@WebMvcTest` and `@SpringBootTest`
- `@WebMvcTest` — loads only the web layer and replaces services with `@MockBean`; tests HTTP request/response, status codes, and validation without a real database
- `jsonPath()` — asserts a field from the JSON response: `.andExpect(jsonPath("$.id").value(1))`
- `@SpringBootTest` — full integration test; loads the whole application context including the database; slow but catches wiring issues
- `@DataJpaTest` — tests only the repository layer against an in-memory H2 database; verifies that derived query methods return the correct data
- Layered testing strategy — service tests (JUnit + Mockito), controller tests (`@WebMvcTest`), integration tests (`@SpringBootTest`); consultancies ask "how do you test your backend?" — naming the three layers is the expected answer

### Tooling
- Docker: `Dockerfile` for a Spring Boot app — `FROM eclipse-temurin`, `COPY target/*.jar app.jar`, `ENTRYPOINT`
- `docker-compose.yml` — runs Spring Boot and PostgreSQL together with one command
- Flyway — database migrations as versioned SQL scripts (`V1__init.sql`); why teams use it instead of `ddl-auto=update` (scripts are reviewable, tracked in git, and safe to run in production)

---

## Java

Java language concepts needed to write and understand Spring Boot code.
Nothing beyond what appears in a real Spring Boot project.
Every item must be explainable with a real example from TimeTrack or the Java notes.

### Variables, types, and Strings
- `int` vs `long` — use `int` for most whole numbers, `long` for large numbers and database IDs; the `L` suffix is required for long literals (`1234567890L`)
- `primitive` vs wrapper class (`long` vs `Long`) — wrapper classes can be `null`; interviewers ask "why does your entity ID use `Long` and not `long`?" — because JPA sets the ID to `null` before the first save
- `String.equals()` vs `==` — `==` compares memory addresses, not content; using `==` to compare Strings is the most common beginner bug interviewers check for
- `String.isBlank()` vs `String.isEmpty()` — `isEmpty()` is true only when length is 0; `isBlank()` is also true when the string is all spaces; maps to understanding `@NotBlank` vs `@NotNull`
- `String.formatted()` — Java 15+ template substitution; the Java equivalent of JavaScript template literals; appears in custom exception messages
- `BigDecimal` for money — `double` cannot represent 0.1 exactly; interviewers ask "what type would you use for a price field and why?"
- `var` — local type inference (Java 10+); the type is still fixed at compile time; only valid for local variables

### Classes and objects
- Classes, fields, constructors — every Spring component is a class; interviewers ask "what is an object in the context of a Spring bean?"
- `private final` fields — why Spring Boot services use them: dependencies cannot change after construction, makes the class easier to unit test
- Access modifiers: `public`, `private`, `protected` — what each restricts and why Spring Boot services use `private` for fields and `public` for methods
- `this` keyword — disambiguates between a field and a constructor parameter; appears in Lombok-generated code and custom constructors
- `static` methods and fields — belong to the class, not to any instance; `Map.of()`, `Integer.parseInt()`, utility factory methods are all `static`
- `instanceof` — checks the runtime type of an object; appears in `equals()` overrides and in exception handlers
- `equals()` and `hashCode()` — always override both together; `HashMap` and `HashSet` use `hashCode()` to find the bucket and `equals()` to confirm the match; Lombok `@Data` generates both
- `Objects.equals(a, b)` — null-safe comparison utility; use inside `equals()` overrides to avoid `NullPointerException`
- Encapsulation — fields are `private`, accessed through getters/setters; what Lombok's `@Data` generates
- Records (Java 16+) — `record CreateUserRequest(String name, String email) {}` generates constructor, getters, `equals`, `hashCode`, `toString` automatically; immutable by design

### Interfaces and abstract classes
- Interfaces: how to define and implement — why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`); interviewers ask "why does Spring prefer interfaces over concrete classes?"
- Interface vs abstract class — interface: "this class CAN do X" (a class can implement many); abstract class: "this class IS a type of X" (a class can extend only one)
- Default methods in interfaces (Java 8+) — interfaces can have a concrete implementation with `default`; Spring's `JpaRepository` uses them to provide built-in behaviour
- Implementing multiple interfaces — common in Spring Security (your `User` entity may implement both your domain interface and Spring Security's `UserDetails`)
- `@Override` — marks a method that implements an interface or overrides a parent; the compiler catches mismatches
- Overriding vs overloading — overriding: same method name and signature in a subclass (decided at runtime); overloading: same method name with different parameters in the same class (decided at compile time)
- Functional interfaces — an interface with exactly one abstract method; what makes lambda syntax possible; built-ins: `Predicate<T>`, `Function<T, R>`, `Consumer<T>`, `Supplier<T>`
- Why Spring Boot prefers interfaces for dependencies — you can swap implementations without changing the caller; the foundation of testable, loosely coupled code

### Generics
- `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` — reading and writing typed containers in Spring Boot code
- Why generics exist — catch type errors at compile time instead of at runtime
- `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()` — the correct way to handle a value that might not exist
- `Optional.get()` vs `Optional.orElseThrow()` — `get()` throws `NoSuchElementException` with no useful message; `orElseThrow()` lets you throw a meaningful exception; interviewers treat `get()` as a red flag in code review
- Why returning `null` is a problem — forces every caller to null-check; `Optional` makes the absence explicit in the return type; interviewers ask "why Optional instead of null?"

### Streams and lambdas
- Lambda expressions — anonymous functions used wherever a functional interface is expected; `e -> e.isActive()` is the most common form
- Method references — shorthand for a lambda that only calls one method: `this::toResponse`, `Employee::getName`, `System.out::println`
- Stream pipeline: `filter()`, `map()`, `collect()` — `filter` keeps matching elements, `map` transforms each element, `collect` builds the result
- `findFirst()` — returns `Optional<T>`; the safe way to get one item from a filtered stream without throwing
- `anyMatch()` / `allMatch()` — return a boolean; used instead of a for loop when you only need to check a condition across a list
- `mapToInt().sum()` — pattern for summing a numeric field across a list: `employees.stream().mapToInt(Employee::getAge).sum()`; interviewers may ask you to refactor a for loop that sums a field
- `Collectors.groupingBy()` — groups elements into `Map<Key, List<Value>>`; used when a service must return data organised by a field
- `.toList()` vs `collect(Collectors.toList())` — `.toList()` is Java 16+ and returns an immutable list; if the next line calls `.add()` on the result, `.toList()` will throw
- Stream vs for loop — streams express intent clearly (`filter` + `map`); for loops are clearer when the logic is complex or when you need early exit with `break`; know when to choose each

### Exceptions
- Checked vs unchecked exceptions — why Spring Boot uses unchecked (`RuntimeException` subclasses): they do not need to be declared in the method signature and propagate freely to `@RestControllerAdvice`
- `RuntimeException` vs `Exception` — `RuntimeException` is unchecked; `Exception` is checked; always extend `RuntimeException` for custom exceptions in Spring Boot
- `try` / `catch` / `throws` — reading Spring Boot exception handling code; `throws` in a method signature declares a contract
- Creating a custom exception: `extends RuntimeException`, constructor that accepts a message, named after what went wrong (`ResourceNotFoundException`)
- `throw new SomeException()` — how it propagates up the call stack until `@RestControllerAdvice` catches it and returns a JSON error response

### Collections
- `List` — ordered, allows duplicates; used in repository results and service return types
- `Map` — key-value pairs; `Map.of("message", "Not found")` for quick immutable error response bodies; Spring serialises it to JSON automatically
- `Set` — no duplicates; used in many-to-many relationships
- When to use each in a Spring Boot context — `List` for ordered results from queries, `Map` for ad-hoc response bodies, `Set` for relationship collections where duplicates are meaningless
- `Comparator.comparing()` — sorts a list by a field: `list.stream().sorted(Comparator.comparing(Employee::getName))`

### Enums
- Defining an enum — used for `Role` (EMPLOYEE, MANAGER) and `EntryStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED) in TimeTrack
- Using enums in `switch` expressions — the clean way to handle each status in a service method; exhaustive by default so the compiler warns if a case is missing
- `@Enumerated(EnumType.STRING)` vs `EnumType.ORDINAL` — `STRING` stores the name; `ORDINAL` stores the position; adding a new value in the middle silently breaks all existing records; always use `STRING`

### Annotations
- What annotations are — metadata attached to a class, method, or field that Spring reads at runtime; they do not change what the code does on their own
- Meta-annotations — annotations that annotate other annotations; `@Service` is composed of `@Component` with a semantic label
- How to read an unfamiliar annotation — look at what it is composed of (meta-annotations), what it enables, and which layer it belongs to

### Date and time
- `LocalDate` — a date without time; used for the `date` field on a TimeEntry; immutable and thread-safe unlike the legacy `java.util.Date`
- `LocalDateTime` — a date with time; used for `createdAt` and `updatedAt` timestamps; also immutable
- `LocalDate` vs `LocalDateTime` — use `LocalDate` when time is not relevant; use `LocalDateTime` when you need the exact moment; they are different types — mixing them causes a compile error
- Why not `java.util.Date` — it is mutable, poorly designed, and replaced by the `java.time` API in Java 8
- `DateTimeFormatter` — formatting a date for display or for an API response; `DateTimeFormatter.ISO_LOCAL_DATE` produces the standard `2025-05-14` format
- JPA mapping — Spring Boot serialises `LocalDate` and `LocalDateTime` to JSON automatically via Jackson when `jackson-datatype-jsr310` is on the classpath (included with `spring-boot-starter-web`)

### Maven
- `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build` — what each section does and where to add a new library
- How to add a dependency — search Maven Central, copy the `<dependency>` block, Maven downloads it on the next build
- Build lifecycle: `clean`, `compile`, `test`, `package`, `install` — what `mvn clean install` does
- Dependency scopes: `compile` (default), `test` (only in tests), `provided` (available at runtime but not packaged)

---

## Architecture

Patterns and decisions a junior at a Spanish consultancy must explain confidently.
Not just what they are — but why they were chosen and what the tradeoff is.
Every answer must be anchored to a real example from Victor's projects.

### REST
- REST principles: stateless, resources, HTTP verbs, uniform interface — the four constraints that define REST; interviewers ask "is your API RESTful and how do you know?"
- Resource naming: plural nouns, no verbs in URLs (`/api/projects`, not `/api/getProjects`) — why REST uses nouns and the HTTP verb carries the action
- Idempotency — `GET`, `PUT`, `DELETE` are idempotent; `POST` is not; interviewers ask "what happens if the client sends the same DELETE request twice?"
- `PATCH` vs `PUT` — `PUT` replaces the whole resource; `PATCH` changes one part; used in TimeTrack for status transitions (submit, approve, reject)
- HTTP status codes — `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`; sending the wrong code misleads clients and tools
- `401 Unauthorized` vs `403 Forbidden` — 401 means no valid credentials; 403 means valid credentials but insufficient permissions; interviewers ask this because it tests authentication vs authorisation understanding
- CORS — a browser security rule that blocks requests from a different origin; the fix is always on the server, never in the browser or client code; if Postman works but Angular does not, CORS is the cause
- Query parameters for filtering and pagination — `GET /api/entries?month=2025-05&status=SUBMITTED`; never use a request body on `GET` requests
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level; knowing this question exists shows awareness of alternatives

### Layered architecture
- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly
- Controller → Service → Repository — what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Why business logic belongs in the service — the controller must not decide; the repository must not know the rules
- Why the controller must not call the repository directly — bypasses the business rules layer; makes the code impossible to test in isolation
- MVC vs Layered Architecture — MVC is for apps that render HTML; Layered Architecture is for REST APIs (the View is a separate SPA)
- State machine pattern — a workflow where status transitions follow fixed rules (DRAFT → SUBMITTED → APPROVED/REJECTED); the service enforces which transitions are valid

### DTO pattern
- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract

### Auth design
- JWT vs session-based auth — JWT is stateless (no server memory per user); session is stateful (server stores session); JWT scales better for APIs consumed by multiple clients
- Why stateless auth matters for APIs consumed by Angular — no shared session state; the API can run on multiple servers without sticky sessions
- Access token vs refresh token — access token is short-lived; refresh token is long-lived and used only to get a new access token; limits damage if a token is stolen
- Where to store the JWT in the browser — localStorage is simple but vulnerable to XSS; HttpOnly cookie is safer but vulnerable to CSRF; localStorage is the common choice for SPAs that already prevent XSS

### Data access decisions
- N+1 problem — when JPA loads a list of entities and fires one extra query per entity to load a related field; fix with `JOIN FETCH` or `@EntityGraph`
- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- `@Transactional` as a design decision — when a service method writes to two tables, both operations must succeed or both must roll back

### Angular patterns
- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility at the component level

### Justifying architectural choices
- The "what + why + result" formula — every architecture decision must be explainable as: what you chose, why you chose it, and what problem it avoids or enables
- Comparing real alternatives — an architecture decision only exists when there was a real alternative; interviewers ask "why not the simpler option?" and expect a specific tradeoff
- Anchoring decisions to your own projects — in 2026 interviewers expect you to refer to code you actually wrote

### Testing strategy
- Unit test vs integration test — unit tests one method in isolation (fast, no context); integration test loads the full stack (slow, catches wiring issues)
- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- What a mock is and what it hides — a controlled replacement for a real dependency; the risk is that the mock behaves differently from the real thing
- Test pyramid — many unit tests, fewer integration tests, very few E2E tests

### Monolith vs microservices (concept only)
- What a monolith is — one codebase, one deployable unit; simpler to build, debug, and deploy
- What microservices are — independent services, each owning one domain and its own database; needed when teams deploy independently
- The tradeoff — monolith: simple to start, hard to scale teams; microservices: complex to run, powerful when teams are large
- What to say in an interview — "I would start with a monolith and extract services when the team or traffic demands it"
- What it means for a junior at a consultancy — you work in one service and communicate with other services via REST; you do not design the whole system

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

### Authentication and authorisation
- Authentication vs authorisation — authentication confirms who you are (login); authorisation confirms what you are allowed to do (role check); interviewers always ask the difference and expect an example from a real project
- 401 vs 403 — `401 Unauthorized` means not authenticated (no token, expired token, invalid token); `403 Forbidden` means authenticated but not authorised (valid token, wrong role); interviewers test this pair because the HTTP names are confusing and juniors routinely mix them up
- Session-based auth — the server stores a session in memory and gives the client a cookie; stateful; does not scale horizontally without shared session storage; asked as a contrast to JWT
- Token-based auth (JWT) — the client stores the token and sends it with every request; the server validates it without storing anything; stateless; interviewers ask why stateless auth matters for scaling
- Role-based access control — `EMPLOYEE` vs `MANAGER` in TimeTrack; enforced in Spring Boot with `@PreAuthorize` and in Angular with route guards; interviewers ask where each enforcement layer lives and why you need both

### JWT
- JWT structure: header, payload, signature — header says the algorithm (`HS256`); payload carries claims (`sub`, `iat`, `exp`, `role`); signature is an HMAC of header+payload using the secret
- JWT payload is not encrypted — the payload is Base64-encoded, not encrypted; anyone can decode it; never put passwords or sensitive data in a JWT; interviewers ask "is a JWT secure?" to test whether the candidate knows Base64 is not encryption
- How the signature is verified — the server recomputes the HMAC with its own secret and compares; if the payload was changed, the signature does not match
- Why you cannot fake a JWT without the secret — the signature is bound to the exact bytes of the header and payload; any change invalidates it
- Access token vs refresh token — access token is short-lived (15 min to 1 hour); refresh token is long-lived and used only to get a new access token; limits the window of attack
- Where to store the token in the browser — `localStorage` is accessible to JavaScript (XSS risk); `HttpOnly` cookie is not accessible to JavaScript (CSRF risk instead)
- JWT expiry — the `exp` claim sets a timestamp; expired tokens are rejected by `JwtFilter`; why short-lived tokens reduce the damage if a token is stolen

### Cryptography basics
- Hashing vs encryption — hashing is one-way (you cannot reverse it); encryption is two-way (you can decrypt with the key); interviewers always ask the difference
- Why passwords are hashed and not encrypted — if the database is stolen, the attacker cannot recover plaintext passwords from hashes without brute-forcing
- BCrypt — a slow hashing algorithm with a built-in random salt; slow is intentional because it resists brute-force attacks; `BCryptPasswordEncoder` in Spring Boot uses it by default with 10 rounds
- Salting — a random value added to the input before hashing; prevents two users with the same password from having the same hash; BCrypt handles salting automatically

### CORS
- What an origin is — the combination of protocol + domain + port; `http://localhost:4200` and `http://localhost:8080` are two different origins even though they share the same domain
- What CORS is — the browser enforces the Same-Origin Policy by default, blocking JavaScript from reading responses from a different origin; CORS lets servers explicitly allow specific cross-origin requests
- CORS is enforced by the browser, not the server — the server always receives and processes the request; the browser blocks the response from reaching JavaScript; this is why Postman works but Angular does not when CORS is misconfigured
- Why it matters for Angular + Spring Boot — Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API call even though the server responds correctly
- How CORS is configured in Spring Boot — `CorsConfigurationSource` registered inside `SecurityFilterChain`; specifies allowed origins, methods, and headers
- Preflight requests — the browser sends an `OPTIONS` request before any POST with a JSON body or any request with an `Authorization` header; the server must respond with the correct CORS headers or the real request is blocked

### Common vulnerabilities
- SQL injection — the attacker injects SQL into a user input field to manipulate the query; parameterised queries (which JPA uses automatically) prevent it
- XSS (Cross-Site Scripting) — the attacker injects malicious JavaScript into a page that runs in other users' browsers and can steal tokens from `localStorage`; Angular escapes all template values by default
- `[innerHTML]` bypasses Angular's XSS protection — Angular deliberately skips escaping when you use `[innerHTML]`; any user-provided content rendered with `[innerHTML]` creates an XSS risk; interviewers ask "can Angular still get XSS?"
- CSRF (Cross-Site Request Forgery) — the attacker tricks a logged-in user's browser into making an unwanted request; works because cookies are sent automatically; JWT in the `Authorization` header prevents it because the browser does not attach headers automatically
- Why you validate on the server even when you validate on the client — client-side validation can be bypassed with Postman or browser DevTools; the server is the only boundary you can trust

---

## TypeScript

TypeScript as used in Angular and Spring Boot full-stack projects.
Every item must be explainable with a real example from one of the projects.

### Types
- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `void` — interviewers ask what `void` means for function return types and the difference between `null` (explicit absence) and `undefined` (not yet assigned)
- Type inference — TypeScript guesses the type from the assigned value; interviewers ask when you still need to declare the type explicitly (function parameters, complex structures, return types that are not obvious)
- `any` vs `unknown` — `any` disables type checking completely; `unknown` forces you to check the type before using it; interviewers ask why `any` is a code smell
- `never` — the type for values that can never exist; used in exhaustive switch checks and functions that always throw
- Union types: `string | number`, `'admin' | 'user'` — a value that can be one of several types; used constantly for roles, status fields, and nullable signals
- Intersection types: `Employee & { permissions: string[] }` — the result must satisfy all combined types; interviewers ask the difference between intersection and extension
- Literal types: `type Direction = 'left' | 'right'` — restricts a field to specific constant values; catches typos at compile time

### Interfaces and type aliases
- `interface` vs `type` — both define an object shape; `interface` is preferred for data models (supports `extends` and declaration merging); `type` is required for unions, intersections, and computed types; tested in every TypeScript screening
- Optional properties: `name?: string` — the field can be `undefined`; interviewers ask how this affects form validation
- `readonly` properties — the value cannot be changed after the object is created; interviewers ask the difference between `readonly` (property constraint) and `const` (variable constraint)
- Extending interfaces: `interface AdminUser extends User` — adds new fields to an existing shape

### Enums
- TypeScript enums: `enum Status { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED' }` — used in Angular models that mirror Java backend enums; interviewers ask how to expose an enum in a template
- `const enum` vs regular `enum` — `const enum` is erased at compile time; regular `enum` keeps the runtime object and supports `Object.values()`
- String enums vs union types — both restrict a field to a set of values; union types generate less compiled code; use string enums when you need to iterate with `Object.values()`

### Generics
- `Array<T>`, `Observable<T>`, `Signal<T>` — generics appear everywhere in Angular; the `T` tells you what the container holds
- Writing a generic function or interface — `function getFirst<T>(arr: T[]): T` — write the logic once and it works for any type while remaining type-safe
- Generic constraints: `function findById<T extends { id: number }>(items: T[], id: number)` — restricts which types are allowed
- Why generics exist — `http.get<Employee[]>('/api/employees')` means you get `Employee[]`, not `any`; type errors are caught at compile time

### Utility types
- `Partial<T>` vs `Required<T>` — `Partial` makes all properties optional (used in update/PATCH request objects); `Required` makes all properties required
- `Readonly<T>` — all properties become readonly; prevents accidental mutation; used to signal immutability in DTOs
- `Pick<T, K>` vs `Omit<T, K>` — `Pick` keeps only the named fields; `Omit` removes the named fields; the most commonly confused utility pair; `Omit<Employee, 'id'>` is the canonical create-form pattern
- `Record<K, V>` — a typed key-value map; interviewers ask when to use `Record` vs a plain interface or a `Map`

### Narrowing and type guards
- `typeof` narrowing — works for primitive types; classic gotcha: `typeof null === 'object'`
- `instanceof` narrowing — works for class instances; used in catch blocks with custom error classes
- `in` narrowing — checks if a property exists on an object; used to distinguish between two interfaces in a union
- Truthiness narrowing — `if (value)` check narrows out `null` and `undefined`; gotcha: `0`, `false`, and `''` are also falsy
- Discriminated unions — a shared property with a unique literal value lets TypeScript narrow automatically inside a switch; the standard pattern for async states in Angular
- Custom type guards: `user is Employee` — a function whose return type is a type predicate; tested when discussing services that work with complex union types
- Exhaustiveness check with `never` — assign an unhandled switch case to `never` in the default branch; TypeScript errors if a new union variant is added without a handler

### Null safety and type assertions
- `?.` optional chaining — stops evaluation and returns `undefined` if the left side is `null` or `undefined`; interviewers ask when to prefer `?.` over `!`
- `??` vs `||` — `??` returns the right side only when the left is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`
- `!` non-null assertion — removes `null` and `undefined` from the type without any runtime check; interviewers ask why `?.` is usually safer
- `as` type assertion — tells TypeScript "I know the type better than you"; does not validate or convert the data; a wrong assertion fails silently at runtime
- `as unknown as T` double assertion — used when two types have no overlap and TypeScript refuses a direct `as` cast; the pattern from `MatDatepicker`

### Classes and access modifiers
- `public`, `private`, `protected`, `readonly` — `private` restricts access to the same class; `protected` also allows subclasses; `readonly` is about immutability, not visibility
- `private` vs `readonly` — `private` controls who can access the property; `readonly` controls whether it can be reassigned; both can be combined (`private readonly`)
- Constructor shorthand — `constructor(private http: HttpClient) {}` declares, creates, and assigns a class property in one step; the standard DI pattern in older Angular code
- Classes as types — a TypeScript class can be used as a type without a separate interface

### `as const`
- Type widening problem — TypeScript widens object property types by default: `{ mode: 'edit' }` infers `{ mode: string }` not `{ mode: 'edit' }`; `const` only prevents reassigning the variable
- `as const` on objects — makes all properties `readonly` and infers literal types instead of widened ones; interviewers ask what two things `as const` does (readonly + literal type inference)
- `as const` on arrays — turns an array into a `readonly` tuple with exact element types

### Arrow functions and functions
- Arrow functions vs function declarations — arrow functions inherit `this` from the surrounding scope at definition time; function declarations have their own `this`; matters when writing callbacks inside Angular class methods where you need to access `this`
- Default parameters, rest parameters — reduce function overloads; `...args: string[]` collects remaining arguments into an array; common in Angular utility functions and service methods
- Return type annotations — make the function's contract explicit; the compiler catches when the actual return does not match the declared type; interviewers ask when TypeScript can infer the return type and when you must declare it

### Modules and decorators
- `import` / `export` — named exports (multiple per file) vs default export (one per file); Angular uses named exports for components and services; interviewers ask why Angular avoids default exports (named exports keep the name fixed at the source, making refactoring safer)
- Barrel files (`index.ts`) — re-export multiple symbols from a folder so callers import from the folder path, not individual files; common in large consultancy Angular projects in shared module folders
- What a decorator is in Angular's context — `@Component`, `@Injectable`, `@Pipe` attach metadata to a class that Angular reads at startup; without the decorator, Angular does not know the class is a component
- How TypeScript decorators work conceptually — a function that receives the class and can modify or annotate it; you use them everywhere in Angular but rarely write custom ones at junior level; interviewers test that you know they are functions, not language keywords

---

## JavaScript

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the projects, not a textbook definition.

### Types, equality, and coercion
- Primitive types vs reference types — primitives are compared by value; objects are compared by reference; interviewers test this with `{} === {}` (false)
- `typeof` — the classic gotcha: `typeof null === 'object'` is a historical bug that was never fixed
- `typeof` vs `instanceof` — `typeof` checks the primitive type; `instanceof` checks if a value was created by a specific class; use `instanceof` in `catch` blocks to distinguish error types
- `==` vs `===` — loose equality performs type coercion; strict equality checks value AND type; always use `===`; the one valid exception is `value == null`, which catches both `null` and `undefined`
- Truthy vs falsy — the 6 falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`; `[]` and `{}` are truthy; `'0'` is truthy
- `null` vs `undefined` — `null` is intentional absence, set by the developer; `undefined` means a variable was declared but never assigned
- Implicit type coercion — `'5' + 3` is `'53'`; `'5' - 3` is `2`; the `+` operator triggers concatenation when either operand is a string

### Variables and scope
- `var` vs `let` vs `const` — `var` is function-scoped and hoisted as `undefined`; `let` and `const` are block-scoped; use `const` by default; tested in every screening
- Hoisting — `var` declarations are moved to the top of their scope and initialised as `undefined`; function declarations are fully hoisted
- Temporal Dead Zone (TDZ) — `let` and `const` are hoisted but not initialised; accessing them before the declaration line throws a `ReferenceError`
- Closures — a function that retains access to variables from its outer scope even after the outer function has returned; appears in Angular `computed()`, event handlers, and services

### Functions and `this`
- Function declarations vs expressions vs arrow functions — declarations are hoisted; arrow functions are expressions and are not hoisted; the key choice in practice is declaration vs arrow, not declaration vs expression
- `this` in regular functions — refers to the caller at runtime; in a standalone function call it is `undefined` (strict mode) or `window` (non-strict)
- Arrow functions and `this` — arrow functions inherit `this` from the surrounding scope at definition time; why Angular uses arrow functions in class properties and callbacks
- `bind`, `call`, `apply` — explicitly set `this` on a function; `bind` returns a new function; `call` and `apply` invoke it immediately
- Default parameters and rest parameters — `function f(role = 'employee')` reduces overloads; `...args` collects remaining arguments into an array
- Higher-order functions — functions that take or return other functions; the foundation of `map`, `filter`, and every RxJS operator

### Classes
- Class syntax — `constructor`, methods, and `this` as the instance; JavaScript classes are syntactic sugar over prototypes
- Private fields `#` — enforced at runtime by the JavaScript engine; TypeScript's `private` keyword is compile-time only and is erased in the compiled output
- Getters and setters — control how a property is read and written without changing the call syntax
- Static methods and properties — belong to the class itself, not to instances; called as `ClassName.method()` without `new`
- `extends` and `super` — `extends` inherits from a parent class; `super()` must be called before using `this` in the child constructor

### Arrays
- `map` — transforms every element and returns a new array; does not mutate the original
- `filter` — returns a new array containing only elements that pass the test; always returns an array (never `undefined`)
- `reduce` — accumulates all elements into one value; signature: `reduce(callback, initialValue)`
- `find` vs `filter` — `find` returns the first matching element or `undefined`; `filter` always returns an array
- `findIndex`, `some`, `every`, `includes` — searching without a loop
- `forEach` vs `map` — `forEach` returns `undefined` and is only for side effects; `map` returns a new array; using `forEach` and pushing into a new array instead of `map` is a classic junior mistake
- `sort` mutation — `sort` modifies the original array in place; default sort is lexicographic; to sort without mutating: `[...arr].sort(...)`
- Method chaining — `filter().map().sort()` — each method receives the output of the previous one

### Objects and JSON
- Object literals, shorthand properties, computed keys — `{ name }` instead of `{ name: name }`; `{ [key]: value }` for dynamic keys; interviewers expect shorthand as natural everyday syntax
- Object destructuring — `const { name, role } = user`; rename with `{ name: userName }`; default value with `{ city = 'Madrid' }`; destructuring in function parameters `function display({ name, role })`
- Array destructuring — `const [first, second] = items`; skip elements with `[, , third]`; swap variables with `[a, b] = [b, a]`; used when consuming tuple-like return values
- Spread in objects — `{ ...obj, key: newValue }` creates a shallow copy; nested objects are still references, not new copies; used for immutable state updates in Angular signals
- `Object.keys`, `Object.values`, `Object.entries` — iterate over an object's properties as arrays; `Object.entries` gives key-value pairs; `Object.fromEntries` converts them back
- `Object.assign` vs spread — both merge objects; `Object.assign` mutates the target object; spread creates a new object; both produce a shallow copy; prefer spread in modern code
- `Object.freeze` — makes an object's top-level properties immutable; shallow — nested objects inside a frozen object are still mutable
- `JSON.stringify` / `JSON.parse` — `stringify` silently drops `undefined` values and functions; `JSON.parse` throws `SyntaxError` on invalid input

### Strings and regular expressions
- String immutability — strings cannot be changed in place; every method returns a new string; `str[0] = 'x'` does nothing silently; a common source of confusion when coming from a mutable mindset
- Template literals — backtick strings with `${}` interpolation; support multiline; interviewers expect template literals as the default over string concatenation
- Search methods: `includes`, `startsWith`, `endsWith`, `indexOf` — boolean checks for presence and position; `indexOf` returns -1 if not found
- Transformation methods: `slice`, `split`, `trim`, `replace`, `toLowerCase`, `toUpperCase` — `replace` replaces the first match by default; interviewers may ask how to split a CSV string into an array
- Regex pattern syntax — `/pattern/flags`; common flags: `i` (case insensitive), `g` (global — find all matches, not just the first)
- `.test(str)` — returns a boolean; used in `Validators.pattern()` for Angular form validation
- `.match(regex)` and `str.replace(regex, replacement)` — `match` returns the matching parts as an array; `replace` with the `g` flag replaces all occurrences; without `g` only the first match is replaced — a common source of bugs

### Sets and Maps
- `Set` — collection of unique values; `has()` is O(1) while `Array.includes()` is O(n)
- Deduplication pattern: `[...new Set(array)]` — the most common Set use case; interviewers ask "how would you remove duplicates from an array?"
- `Map` — key-value collection where keys can be any type; insertion order is guaranteed
- `Map` vs plain object — plain objects accept only string and Symbol keys; Maps accept any type as key
- `Set` vs `Array` — use Set when uniqueness matters or when you need fast `has()` lookups; use Array when index access or method chaining (map/filter) is needed; use `[...new Set(arr)]` to convert back to an array

### Async JavaScript
- Promises: `then`, `catch`, `finally` — `then` runs on resolve; `catch` runs on reject; `finally` always runs regardless of outcome
- `Promise.all` — runs multiple promises in parallel; rejects immediately if ANY fails; the RxJS equivalent in Angular is `forkJoin`
- `Promise.allSettled` vs `Promise.all` — `allSettled` never rejects; waits for all promises and returns each result with `{ status: 'fulfilled' | 'rejected' }`
- `async` / `await` — syntactic sugar over Promises; `await` can only be used inside an `async` function; always returns a Promise
- Sequential vs parallel `await` — sequential waits one at a time; `Promise.all([f(), g()])` is parallel; interviewers ask about the performance difference
- Event loop — JavaScript is single-threaded; microtasks (Promise callbacks) run before macrotasks (setTimeout)
- Promise vs Observable in Angular — Promises emit one value and start immediately; Observables are lazy, can emit multiple values, and can be cancelled

### Modules
- Named exports vs default export — Angular uses only named exports; named exports are safer to refactor because editors auto-rename them; default exports let the importer choose any name, which makes automated refactoring unreliable
- `import { name as alias }` and `import * as namespace` — renaming to avoid naming conflicts; namespace import bundles all exports into one object; used when consuming libraries that export many things at once
- Barrel pattern — an `index.ts` file that re-exports everything from a folder so imports stay clean
- Dynamic imports and lazy loading — `import('./module').then(m => m.Class)` loads code only when needed; Angular uses this in `loadComponent:`
- Tree-shaking — the bundler removes exported code that is never imported anywhere; only works reliably with named exports

### Error handling
- `try` / `catch` / `finally` — `try` is the code that might throw; `catch` receives the error object; `finally` guarantees execution even if `catch` also throws; use `finally` for cleanup (hide a spinner, close a connection)
- `Error` object: `message`, `name`, `stack` — `stack` shows the full call chain that led to the error; essential for debugging; `name` distinguishes error types before `instanceof` is possible
- Custom error classes — extending `Error` to create `ValidationError`, `HttpError`, etc.; use `instanceof` in `catch` to handle different error types differently
- Silently swallowing errors — catching an error and doing nothing is the most common junior mistake; always either handle fully or re-throw with `throw error`
- Error handling with `async`/`await` — `try/catch` catches both synchronous errors and rejected Promises inside an `async` function; the correct pattern for Angular services that call `firstValueFrom()` or `fetch()`

### Loops and iteration
- `for...of` vs `for...in` — `for...of` iterates the values of any iterable (arrays, strings, Sets, Maps); `for...in` iterates the string keys of an object; using `for...in` on an array gives `'0'`, `'1'`, `'2'` as strings, not values
- When to use a loop vs array methods — `map`, `filter`, `reduce` are preferred for data transformation; `for...of` is the right choice when you need early exit with `break` or when the loop body contains `await`
- `break` and `continue` — `break` exits the loop immediately; `continue` skips the rest of the current iteration; the main reason to choose `for...of` over `forEach` when early exit is needed
- `while` loop — repeats while a condition is true; use when the number of iterations is not known in advance

### DOM events
- Event bubbling — a click on a child also triggers click handlers on every ancestor element
- `stopPropagation()` — prevents the event from travelling further up the DOM tree
- `preventDefault()` — cancels the browser's default behaviour: form submission, link navigation, checkbox toggle
- `stopPropagation` vs `preventDefault` — `stopPropagation` controls where the event travels in the DOM; `preventDefault` controls what the browser does after the event

### Modern syntax (ES6+)
- Optional chaining `?.` — safely accesses a nested property that might be `null` or `undefined`
- Nullish coalescing `??` vs `||` — `??` falls back only when the left side is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`
- Logical assignment: `||=`, `&&=`, `??=` — shorthand for conditional assignment; `a ??= 'default'` assigns only if `a` is `null` or `undefined`; interviewers may show these to test whether the candidate can read modern JavaScript they did not write
- Debouncing concept — delaying a function call until after a rapid burst of events stops; used in Angular with RxJS `debounceTime()` on search inputs

---

## CSS

Topics a junior must explain confidently to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from one of the Angular projects.

### Box model
- `margin`, `padding`, `border`, `content` — what each layer is and how they stack; interviewers draw the box model and ask you to label it
- `box-sizing: border-box` — makes `width` include padding and border; setting it globally makes layouts predictable
- Collapsing margins — two adjacent vertical margins collapse into one (the larger wins, not the sum); the most common box model surprise
- CSS reset pattern — `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }` removes browser defaults

### Display and layout
- `display: block`, `inline`, `inline-block` — block takes full width and starts on a new line; inline flows with text and ignores width; interviewers ask why a `<span>` cannot have width
- `display: none` vs `visibility: hidden` — `none` removes the element from layout entirely; `hidden` hides it but keeps its space; tested in every junior screening
- Flexbox vs Grid — Flexbox for one-dimensional layout; Grid for two-dimensional layout

### Angular-specific CSS
- View encapsulation — Angular scopes component styles by adding a unique attribute; styles in `component.scss` only apply to that component's own elements
- `:host` selector — targets the component's root element from within its own styles; not knowing this is a red flag for an Angular role
- When to use `styles.css` vs component styles — `styles.css` for global rules and Angular Material overrides; component styles for everything specific to one component
- `::ng-deep` — deprecated but still widely used in consultancy codebases; pierces view encapsulation; the modern alternative is `styles.css`

### Selectors and specificity
- Combinators: descendant (space), child `>`, adjacent sibling `+`, general sibling `~` — how to target elements by relationship
- Pseudo-classes: `:hover`, `:focus`, `:nth-child`, `:first-child`, `:last-child`, `:not()` — `:not()` excludes elements from a rule
- Pseudo-elements: `::before`, `::after` — insert CSS-generated content; must have a `content` property
- Specificity scoring — inline styles beat IDs (`1-0-0`) beat classes (`0-1-0`) beat elements (`0-0-1`); the rule with the highest score wins, not the one that appears last
- `!important` — overrides all specificity; avoid it except to fight third-party library styles

### Flexbox
- Container properties: `flex-direction`, `justify-content`, `align-items`, `gap` — the four set on almost every flex container
- `flex-wrap: wrap` — controls whether items wrap to the next line when space runs out
- Item properties: `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self` — `flex: 1` fills remaining space; `flex-shrink: 0` prevents shrinking
- The main axis and cross axis — `justify-content` works on the main axis, `align-items` on the cross axis; the axis flips with `flex-direction: column`
- `margin: auto` on flex items — absorbs all available space on that side; used to push an action button to the right of a navbar

### CSS Grid
- `grid-template-columns` and `gap` — the two properties set most often on a grid container; `fr` units are required to explain any Grid answer
- `repeat()` function — `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`; `repeat(auto-fill, minmax(250px, 1fr))` is the responsive card grid pattern
- `fr` unit — distributes free space after fixed columns are placed; cleaner than percentages for equal columns
- `auto-fill` vs `auto-fit` — both create as many columns as fit; `auto-fill` keeps empty column tracks; `auto-fit` collapses empty tracks — a confusable pair
- `grid-column` and `grid-row` — placing an item across multiple tracks; `grid-column: 1 / -1` spans all columns

### Position
- `static`, `relative`, `absolute`, `fixed`, `sticky` — `static` is the default and is not a positioning context; `relative` creates the context for absolute children
- How `absolute` finds its reference point — positions relative to the nearest ancestor with a non-static position; not adding `position: relative` to the parent is the most common positioning bug
- `z-index` and stacking context — only works on non-static elements; `transform` and `opacity < 1` create a new stacking context
- `inset: 0` — shorthand for `top: 0; right: 0; bottom: 0; left: 0`; used in modal overlays

### Responsive design
- Mobile-first with `@media (min-width: ...)` — base styles for mobile, then `min-width` queries add complexity for wider screens
- Breakpoints: `768px` (tablet), `1024px` (desktop) — the most common values in real Angular projects
- Fluid images — `max-width: 100%; height: auto` on `img` prevents overflowing; standard in every CSS reset
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode

### Units
- `px` — absolute and predictable; avoid for font sizes because `px` ignores the user's browser accessibility font size setting
- `%` — relative to the parent's value; for vertical `padding` and `margin`, `%` is relative to the parent's **width**, not height
- `em` — relative to the current element's font size; compounds through nesting; prefer `rem` by default
- `rem` — relative to the root font size; does not compound; the safe choice for font sizes; `rem` vs `em` is a classic confusable pair
- `vw` and `vh` — relative to the viewport; `min-height: 100vh` is safer than `height: 100vh` because it grows with content

### Transitions and animations
- `transition` — always place it on the base element, not on `:hover`, so it runs in both directions; putting it on `:hover` makes the exit instant — a classic interview trap
- `transform` — `translateX/Y`, `scale`, `rotate` change visual appearance without affecting layout; fast because the browser handles it on the GPU
- `transform` vs `top/left` for movement — animating `top` or `left` triggers a full layout recalculation; `transform: translate()` does not; a confusable pair
- `@keyframes` and `animation` — multi-step animations; `animation-fill-mode: forwards` keeps the final state after the animation ends

### Typography
- `font-size` with `rem` — `px` ignores the user's browser font size preference and breaks accessibility
- `font-weight` numeric values — `400` (normal), `600` (semibold), `700` (bold); interviewers ask why numeric values are used instead of the keyword `bold`, and whether every font supports every weight
- `line-height` unitless value — `1.5` means 1.5× the current font size; a unitless value scales correctly when font size changes
- Text truncation — `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` must all be present
- `text-transform` — `capitalize` displays stored lowercase values as capitalised without changing the data

### CSS variables
- `--variable-name` and `var()` — define a value once and reuse it everywhere; Angular Material uses CSS variables for its theme colours
- `:root` vs component scope — declaring on `:root` makes the variable globally available; scoping to a specific selector limits it to that element's subtree
- CSS variables are live at runtime — a CSS variable can be changed by JavaScript with `element.style.setProperty()`, enabling runtime theming without recompiling
- `var()` with a fallback — `var(--primary, #e8572a)` uses the second argument when the variable is not defined; provides a safety net when customising Angular Material where some variables may not be set

### Colors and transparency
- Color formats: `hex`, `rgb()`, `hsl()` — `hex` is most common for fixed colors; `rgba()` adds transparency and is preferred for overlays and shadows; `hsl` makes color variations easy (just change the lightness value)
- `opacity` vs `rgba` transparency — `opacity` affects the element AND all its children; `rgba` only affects the specific property it is applied to; classic question: "why does `opacity: 0.5` on a card fade the text too, but `background: rgba(0,0,0,0.5)` does not?"
- `rgba` for overlays and shadows — `rgba(0, 0, 0, 0.5)` for modal backgrounds; `rgba` allows the shadow to blend with whatever background colour is beneath it, unlike a hex value
- `currentColor` — a keyword that resolves to the element's current `color` value; used to keep borders, icons, and SVG fills in sync

### Borders, shadows, and backgrounds
- `box-shadow` syntax: `offset-x offset-y blur spread color` — color should always use `rgba`
- `border-radius: 50%` vs `border-radius: 9999px` — `50%` makes a circle but only when the element is square; `9999px` creates a pill shape at any aspect ratio — a confusable pair
- `background-size: cover` vs `background-size: contain` — `cover` fills and may crop; `contain` fits the whole image
- `object-fit: cover` — same fill-and-crop behaviour as `background-size: cover`, but applies to `<img>` elements; `background-size` is for background images, `object-fit` is for `<img>` tags — a confusable pair
- `outline` vs `border` — `outline` sits outside the border and does not take up layout space; never remove the browser's default focus outline without adding a visible custom replacement; `button:focus-visible` is the accessible way to style it

### Overflow
- `overflow: visible`, `hidden`, `scroll`, `auto` — `hidden` clips content; `auto` only shows scrollbars when content overflows; `scroll` always shows them; `auto` vs `scroll` is a confusable pair
- `overflow-x` and `overflow-y` — control each axis independently; `overflow-x: hidden` prevents a horizontal scrollbar on mobile when an element slightly overflows the viewport
- Scrollable container pattern — `overflow-y: auto` with a fixed `max-height` creates a scroll area without triggering a page scroll

### CSS functions
- `calc()` — mixes different units in one expression; `calc(100% - 64px)` subtracts a fixed header height from the full viewport; spaces around `+` and `-` are required
- `clamp(min, preferred, max)` — creates a value that scales fluidly between limits; `font-size: clamp(1rem, 2.5vw, 2rem)` replaces multiple breakpoint overrides
- `min()` and `max()` — `min(100%, 600px)` is equivalent to `max-width: 600px; width: 100%`; useful for containers that should be fluid on mobile and capped on desktop

### BEM naming
- Block, element (`__`), modifier (`--`) — `.card`, `.card__title`, `.card--featured`; makes class names predictable in global stylesheets; interviewers at consultancies ask about CSS organisation because shared CSS becomes unmaintainable without a convention
- Why BEM keeps specificity low — each rule is a single class selector (`0-1-0`); nested selectors like `.card .card__title` raise specificity and become hard to override; BEM avoids nesting in the CSS file
- The flat element rule — BEM elements never nest in the class name; even if `.card__body` contains a title, the class is `.card__title`, not `.card__body__title`; depth lives in the HTML, not in the class name — a common mistake when first learning BEM
- When BEM applies in Angular — needed for global styles in `styles.css` and shared components in `shared/` where Angular encapsulation does not help

---

## SQL

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Database is PostgreSQL.
Every item must be explainable with a real query — from the bookstore exercises or the TimeTrack data model.

### JOINs
- `INNER JOIN` — returns only rows where both tables have a match; `JOIN` without a keyword defaults to `INNER JOIN`
- `LEFT JOIN` — returns all rows from the left table with `NULL` on the right when there is no match
- `INNER JOIN` vs `LEFT JOIN` — `INNER` excludes rows with no match on either side; `LEFT` keeps all left rows; choosing the wrong one is the most common JOIN mistake
- Finding missing data with `LEFT JOIN` — `WHERE right_table.id IS NULL` returns every left row with no match on the right; the pattern for "which projects have no time entries?"
- `RIGHT JOIN` — mirror of `LEFT JOIN`; rarely used because any `RIGHT JOIN` can be rewritten as a `LEFT JOIN`
- `FULL OUTER JOIN` — returns all rows from both sides with `NULL` where there is no match
- Multiple JOINs — you can chain as many JOINs as needed; interviewers ask you to join three tables
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; required when two joined tables share a column name

### Aggregates and grouping
- `COUNT(*)` vs `COUNT(column)` — `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `SUM`, `AVG`, `MIN`, `MAX` — all ignore `NULL` values automatically; `AVG` on `[10, NULL, 30]` returns `20`, not `13.33`
- `GROUP BY` rule — every column in `SELECT` must either appear in `GROUP BY` or be inside an aggregate function; the most common GROUP BY mistake
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` — filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- Conditional aggregation with `CASE WHEN` — `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation; same result as `CASE WHEN` but cleaner

### Querying basics
- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; why aliases work in `ORDER BY` but not in `WHERE`
- `SELECT *` vs named columns — always specify columns in application code; `SELECT *` fetches data you do not need and breaks when the schema changes
- `CASE WHEN` in `SELECT` — `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate
- `SELECT DISTINCT` — removes duplicate rows from the result
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group; the column inside `DISTINCT ON (...)` must be leftmost in `ORDER BY`
- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`

### Filtering and NULL handling
- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet
- `IS NULL` vs `= NULL` — `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; used to replace `NULL` with a default so the application never has to handle `NULL`
- `NULLIF(a, b)` — returns `NULL` if `a = b`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL
- `BETWEEN` with timestamps — `BETWEEN '2024-01-01' AND '2024-06-30'` silently excludes events after midnight on June 30; safer to cast before comparing: `created_at::date BETWEEN ...`

### Subqueries, CTEs, and views
- Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — the subquery runs first and its result is used by the outer query; you cannot use `AVG` directly in `WHERE`
- Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` — returns exactly one value used as a column in the result; runs once per row and can be slow on large tables; interviewers ask when this would cause a performance problem
- `IN` vs `EXISTS` — `IN` collects all results first; `EXISTS` stops as soon as it finds one match and is faster on large tables
- Subquery vs `JOIN` — most `WHERE` subqueries can be rewritten as a `JOIN`, which the database can optimize better; prefer a `JOIN` when readable; use a subquery when you need an aggregate in a filter
- `WITH` (CTE) — names a subquery so it can be referenced by name in the same query; makes multi-step queries readable; interviewers ask "when would you use a CTE instead of a subquery?"
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access
- View vs materialized view — a regular view runs live; a materialized view stores the result on disk and must be refreshed manually

### DML — modifying data
- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`) and columns with `DEFAULT` values
- `RETURNING` — `INSERT INTO users (...) VALUES (...) RETURNING id` — returns the generated ID without a second `SELECT`; PostgreSQL-specific
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE`, logs every row, can be rolled back; `TRUNCATE` removes all rows instantly and resets `SERIAL` counters
- `ON CONFLICT` (upsert) — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

### Transactions
- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- ACID properties — Atomicity, Consistency, Isolation, Durability; interviewers ask what ACID stands for when discussing `@Transactional`
- `@Transactional` connection — Spring Boot wraps the method in `BEGIN` / `COMMIT` and automatically issues `ROLLBACK` on an unchecked exception
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint; used internally by Hibernate; good to know it exists without needing to write it yourself

### Window functions
- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a sequential number to each row within a partition; used to get "the latest time entry per user"
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number (1, 2, 3)
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join
- `SUM() OVER (PARTITION BY ...)` — running total within a group without collapsing rows

### Schema design
- Primary key — uniquely identifies each row; `SERIAL` or `BIGSERIAL` in PostgreSQL; every table needs exactly one
- Foreign key — a column that references the primary key of another table; PostgreSQL rejects an `INSERT` if the referenced row does not exist
- `ON DELETE` behavior — `RESTRICT` (default) rejects the delete if dependent rows exist; `CASCADE` deletes dependent rows; `SET NULL` sets the FK to `NULL`
- `NOT NULL` constraint — the column must always have a value
- `UNIQUE` constraint — no two rows can have the same value; automatically creates an index in PostgreSQL
- `CHECK` constraint — validates a condition on insert or update; rejects invalid data at the database level, not just the application level
- Relationship types — one-to-many (1:N) is the most common; the foreign key always goes on the "many" side; many-to-many (N:M) needs a junction table (e.g. `order_items` linking `orders` and `books`)
- Normalization concept — storing `project_id` instead of copying `project_name` avoids duplication; changing the name requires only one `UPDATE`
- Reading a schema out loud — describing the TimeTrack data model: "three tables; `users` and `projects` are independent; `time_entries` links to both via foreign keys"; interviewers ask "explain your database structure"

### Data types
- `VARCHAR(n)` vs `TEXT` — identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length
- `INT` vs `SERIAL` vs `BIGSERIAL` — `SERIAL` is an auto-incrementing integer for primary keys; `BIGSERIAL` handles very large tables
- `NUMERIC(p,s)` vs `FLOAT` — `FLOAT` is an approximation; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMPTZ` converts to UTC on write and back on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores `true` or `false`; used for flags like `is_active`

### PostgreSQL specifics
- `::` cast operator — `created_at::date` converts a timestamp to a date; shorter PostgreSQL syntax for standard SQL `CAST()`
- `ILIKE` — case-insensitive pattern matching; not available in MySQL or SQL Server
- `DISTINCT ON` — not available in standard SQL; the column in `DISTINCT ON (...)` must be leftmost in `ORDER BY`
- `RETURNING` — `INSERT`, `UPDATE`, and `DELETE` can return the affected rows in a single statement; not standard SQL
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports
- `NOW()` vs `CURRENT_DATE` — `NOW()` returns the current timestamp including time; `CURRENT_DATE` returns today's date with no time
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges

### Performance basics
- What an index is — a sorted data structure that speeds up reads at the cost of slower writes; primary keys and `UNIQUE` columns are indexed automatically
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables
- When NOT to index — small tables, columns with very few distinct values, and columns updated very frequently
- `EXPLAIN` — shows the query plan; `Seq Scan` means every row is read; `Index Scan` means the index was used

---

## Git

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Focus on daily workflow, team collaboration, and the concepts that come up in code reviews and interviews.

### Core workflow
- `init`, `clone` — `init` starts a repo from scratch locally; `clone` downloads an existing remote repo; interviewers ask "how would you start working on this project on a new machine?"
- The three areas — working directory, staging area, repository; interviewers ask "what is the staging area for?"
- `add`, `commit` — staging specific files and saving a snapshot; "why do you stage before committing?"
- `push`, `pull`, `fetch` — `push` sends commits to the remote; `pull` downloads and merges; `fetch` downloads without merging; interviewers ask the pull vs fetch difference every time
- `status`, `log --oneline`, `diff --staged` — essential inspection commands; `diff --staged` shows what will go into the next commit
- `git log` flags (`--graph`, `--all`, `--author`, `filename`) — reading the full history of a project; `--graph --all` makes the branch structure visible
- `git blame` — shows who last modified each line of a file and in which commit; used to find context for unfamiliar code

### Branching and HEAD
- `HEAD` pointer — marks your current position in the history; always points to the tip of the current branch; you see it in `git log` and error messages
- `HEAD~1`, `HEAD~2` notation — "one commit before HEAD"; used in `git reset HEAD~1` and `git rebase -i HEAD~3`
- Detached HEAD — happens when you checkout a specific commit ID instead of a branch; new commits are not attached to any branch and can be lost; fix with `git checkout -b new-branch-name`
- `branch`, `checkout`, `switch` — creating and switching branches; `switch` is the modern alternative to `checkout` for branches
- `git branch -d` vs `git branch -D` — `-d` is a safe delete (fails if unmerged); `-D` is a force delete
- Branch naming conventions — `feat/`, `fix/`, `technology/##-project-name`; tested in team process questions
- `merge` — joins branches; creates a merge commit when both branches have advanced since they split
- Fast-forward merge vs three-way merge — fast-forward: pointer just moves forward (no divergence); three-way: both branches have new commits, Git creates a merge commit
- `git cherry-pick` — applies a specific commit from another branch onto the current one; use sparingly — it duplicates commits

### Rebase
- What `rebase` does — replays your commits on top of another branch as if you had started from there; result is a linear history with no merge commit
- `rebase` vs `merge` — rebase gives a cleaner linear history; merge preserves exactly when branches diverged; interviewers ask "what does your team use and why?"
- The golden rule of rebase — never rebase a branch that other people are working on; rebasing rewrites commit IDs
- `git rebase -i` (interactive rebase) — squash, reword, reorder, or drop commits; only safe on commits not yet pushed

### Remote and collaboration
- `remote`, `origin` — `origin` is the default alias for the remote URL; interviewers ask "what is origin?" — the answer is an alias, not a branch name
- `git push -u` (upstream tracking) — `-u` links your local branch to the remote branch; after setting it once, `git push` alone works
- Pull requests — a request to merge a branch with a description; the place for code review before changes reach main
- PR description format — `## Changes` lists what changed; `## Why` explains the main decision
- PR merge strategies — squash (all PR commits become one), merge commit (full history preserved), rebase merge (replays commits linearly)
- Code review — checking that the code does what the PR says, handles edge cases, is readable, and includes tests

### Merge conflicts
- What causes a conflict — two branches modify the same line of the same file; conflicts are not errors, they are Git asking for a human decision
- Conflict markers (`<<<<`, `====`, `>>>>`) — `<<<< HEAD` is your version; `>>>> branch-name` is the incoming version; delete all three markers after resolving
- `git merge --abort` — cancels an in-progress merge and returns to the state before you ran `git merge`
- Avoiding conflicts — pull from the target branch frequently; keep feature branches short-lived; communicate with teammates about which files each person is touching

### Stash
- `git stash`, `git stash pop` — saves uncommitted changes to a temporary stack; `pop` restores and removes the stash
- `git stash apply` vs `git stash pop` — `apply` restores the stash but keeps it in the list; `pop` restores and deletes it
- `git stash list` — shows all saved stashes with an index and name

### Undoing changes
- `git restore` — discards changes in the working directory without touching history; `--staged` unstages a file
- `git reset --soft` vs `--mixed` vs `--hard` — soft: undo commit, keep changes staged; mixed: undo commit, keep changes unstaged; hard: undo commit and discard changes permanently
- The reset rule — only use `git reset` on commits that have NOT been pushed; if already on the remote, use `git revert` instead
- `git revert` — creates a new commit that undoes a previous one; the original commit stays visible; safe on shared branches
- `git reset` vs `git revert` — reset rewrites history (local only); revert creates a new commit (safe on shared branches); interviewers ask this pair consistently
- `git reflog` — records every position HEAD has been at; the recovery tool when you think you lost commits with a hard reset; keeps data for 90 days

### .gitignore
- What it does — tells Git to never track specific files; files listed here never appear in `git status`
- Common entries: `node_modules/`, `target/`, `.env`, `.angular/`, `*.class` — interviewers ask "why is `.env` in `.gitignore`?"
- `git rm --cached` — stops tracking a file that was already committed by mistake; the file stays on disk but Git stops watching it
- Creating `.gitignore` before the first commit — if you add a file to `.gitignore` after it was already committed, Git keeps tracking it; you must use `git rm --cached` first

### Commit quality
- Conventional Commits format — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`, `perf:`; interviewers ask "how do you write a commit message?" — they expect this format
- Atomic commits — one logical change per commit; one commit = one thing that can be reverted independently
- Good commit message — present tense, explains WHY not what, short; the history must be readable without the code

---

## General

Cross-cutting concepts that appear in interviews regardless of the stack.
These come up at every stage: the HR call, the technical test review, and the live technical interview.

### HTTP methods and request structure
- HTTP methods — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`: each expresses the intent of the request; interviewers ask you to choose the right method for a given scenario
- `PUT` vs `PATCH` — PUT replaces the entire resource; PATCH updates only the specified fields; the most common confusable pair in REST API discussions
- Idempotency — a request is idempotent if calling it multiple times leaves the system in the same state; `GET`, `PUT`, `DELETE` are idempotent; `POST` is not
- Headers — `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format
- Path parameters vs query parameters vs request body — path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update
- HTTPS vs HTTP — TLS encrypts the connection so headers and body cannot be read in transit; required for any API that handles passwords or tokens
- Request/response lifecycle — Angular component → HTTP interceptor → browser → Spring Security filter chain → controller → service → repository → response travels back

### HTTP status codes
- 2xx success codes — `200 OK` for a successful read or update, `201 Created` after a POST, `204 No Content` after a DELETE
- `400 Bad Request` — the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails
- `401 Unauthorized` vs `403 Forbidden` — 401 means unauthenticated; 403 means authenticated but not allowed; the most common confusable pair in security discussions
- `401` vs `403` in Spring Security — Spring Security returns 403 for both by default; a custom `AuthenticationEntryPoint` is required to correctly return 401 for missing or invalid tokens
- `404 Not Found` vs `409 Conflict` — 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email)
- `500 Internal Server Error` — an unhandled exception reached the framework; if the API returns 500, something was not caught by `@ControllerAdvice`

### JSON and serialization
- JSON data types — objects `{}`, arrays `[]`, strings, numbers, booleans, null; keys must be double-quoted strings; no trailing commas
- Jackson — Spring Boot uses Jackson automatically to convert between JSON and Java objects; interviewers ask how Spring Boot "knows" to return JSON
- `@JsonProperty` — maps a JSON key to a Java field with a different name; necessary when the API contract uses snake_case but the Java class uses camelCase
- `JSON.parse()` vs `JSON.stringify()` — `stringify` converts a JavaScript object to a JSON string; `parse` converts it back; only needed for `localStorage`, never for `HttpClient` calls

### Error handling
- `catchError` in Angular services — intercepts HTTP errors in the Observable stream before they reach the component; returns a safe fallback value so the app keeps running
- HTTP interceptor for global errors — the right place to handle 401 (expired token → redirect to login) and network failures
- `catchError` in service vs interceptor — service-level handles specific local failures; interceptor handles global concerns (token expiry, network outage)
- `@ControllerAdvice` + `@ExceptionHandler` — maps custom exceptions to HTTP status codes in one class; the Spring Boot equivalent of Angular's error interceptor
- Error propagation — throw errors upward and handle them once at the outermost layer; never swallow an exception silently without at least logging it

### Software testing
- Unit test — tests one class or method in isolation with all dependencies mocked; no database, no HTTP; runs in milliseconds
- Integration test — tests multiple real components working together; the Spring context starts and the real database is used
- End-to-end (E2E) test — tests the full user flow through a real browser; the slowest and the fewest
- Testing pyramid — more unit tests than integration, more integration than E2E; interviewers ask the ratio and why
- Mock vs stub — a mock is a fake dependency you can configure and verify; a stub just returns a fixed value with no verification
- JUnit 5 + Mockito — the standard tools for Spring Boot unit tests
- Jasmine + TestBed — the standard tools for Angular service tests and component tests

### Browser storage
- `localStorage` — persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript (XSS risk)
- `sessionStorage` — cleared when the tab closes; not shared between tabs; same API as `localStorage`
- Cookies — sent automatically with every HTTP request; `HttpOnly` flag prevents JavaScript from reading them; `Secure` restricts them to HTTPS
- `localStorage` vs `HttpOnly` cookie for JWT — localStorage is simple but XSS can steal the token; HttpOnly cookies are XSS-safe but require CSRF protection

### Environment variables
- Why secrets must never be committed — a committed secret is permanently visible in git history even after deletion; must be treated as compromised and rotated
- `${VAR_NAME}` in `application.properties` — Spring Boot reads the environment variable at startup and substitutes the value
- Fail-fast on missing variables — if a required variable is not set and has no default value, Spring Boot fails at startup with a clear error instead of a `NullPointerException` at runtime
- `.env.example` — documents which variables are required without exposing real values; safe to commit

### Base64
- Base64 is not encryption — it is reversible text encoding; anyone can decode it in one step; interviewers ask this specifically to catch candidates who confuse encoding with security
- JWT structure — header and payload are Base64-encoded JSON; only the signature provides security
- `btoa()` / `atob()` — the browser functions for encoding and decoding Base64 strings

### SOLID
- Single Responsibility — one class, one reason to change; controller handles HTTP, service handles rules, repository handles data
- Dependency Inversion — inject dependencies instead of creating them with `new`; what Angular's `inject()` and Spring Boot's constructor injection implement
- Open/Closed — extend without modifying existing code; add a new feature by adding new code, not changing what already works
- Liskov Substitution — a subtype must behave correctly wherever its parent is expected; prefer composition over inheritance when this guarantee is hard to maintain
- Interface Segregation — prefer small specific interfaces over one large one

### Code principles
- DRY — extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?"
- KISS — the simplest solution that works is the right one; complexity is a cost that must be justified
- YAGNI — do not build features for hypothetical future requirements; common in AI-generated code
