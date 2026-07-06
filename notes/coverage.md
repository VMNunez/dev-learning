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
- `input()` vs `input.required<T>()` — `input()` needs a default value or the type becomes `T | undefined`; `input.required<T>()` has no default and throws at compile time if the parent does not pass it; interviewers ask which one to use for a value the component cannot render without (e.g. an `id`)
- `@if`, `@for`, `@empty`, `@else` — new control flow syntax; `@for` requires a `track` expression for performance; interviewers ask why `track` matters
- `@switch`, `@case`, `@default` — control flow alternative to chained `@if`/`@else if` when checking one value against several fixed options (e.g. a status field); interviewers ask when to reach for `@switch` instead of multiple `@if` blocks (readability once there are 3+ branches)
- `@let` — declares a local template variable from an expression, reused across the same template block without recalculating it; interviewers ask how you avoid calling the same `computed()` or method multiple times in one template
- Template reference variables — `#ref` on any template element gives a typed handle to it; pass `ref.value` to a method without a signal or form control; interviewers ask how you read an input value without reactive forms
- `ng-content` — content projection; lets a parent inject arbitrary HTML into a child's template slot; interviewers ask how you build a reusable layout wrapper in Angular
- `[class.x]` binding — applies a single CSS class when the condition is true; simpler and more readable than `ngClass` for a single class; interviewers ask the difference from `ngClass`
- `ngClass` — applies multiple CSS classes conditionally using an object map `{ 'class': condition }`; reach for it when two or more classes depend on component state; interviewers ask when to use it instead of `[class.x]`

### Lifecycle and tooling
- `@ViewChild` — accessing a child element or component from the class after the view is built; needed for `MatSort` and `MatPaginator` in `ngAfterViewInit`
- Lifecycle hooks: `ngOnInit` (run logic on load), `ngAfterViewInit` (first safe moment to use `@ViewChild`), `ngOnDestroy` (cleanup) — interviewers ask when each fires and why
- `constructor` vs `ngOnInit` — the constructor only wires up dependency injection and runs before Angular has set the component's inputs; `ngOnInit` runs once after the first input binding, so data fetching and any logic that reads an `input()`/`@Input()` value belongs there, not in the constructor; interviewers ask "why fetch data in `ngOnInit` and not the constructor?"
- Angular CLI essentials — `ng generate component/service/guard`, `ng serve`, `ng build` — interviewers ask how you scaffold a new feature and what the difference is between `ng serve` (dev server with live reload) and `ng build` (production bundle)

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
- `FormArray` — holds a dynamic list of form controls accessed by index instead of by name; use when the number of fields is not known upfront (e.g. "add another phone number"); `formArrayName` on the container div, `[formControlName]="$index"` on each input; interviewers ask the difference from `FormGroup`

### Pipes
- Built-in pipes: `date`, `number`, `currency`, `uppercase`, `slice` — what each formats and when to reach for it
- Custom pipes: `@Pipe({ name: '...' })`, `transform()` method — when to create one (logic that repeats across multiple templates)

### Component styles
- View encapsulation — Angular scopes component CSS by adding unique attributes to each template element; styles in `component.css` only apply to elements you wrote in that template; interviewers ask "why doesn't my CSS rule apply to Angular Material's internal elements?"
- Global `styles.css` for Material internals — Angular Material renders its own internal HTML without the component's scoping attribute; to override Material internals (e.g. `.mat-sort-header-container`), the rule must go in `styles.css`; a rule that silently fails in component CSS almost always works in `styles.css`
- `:host` selector — targets the component's own wrapper element from inside its CSS file; custom elements are `inline` by default and need `:host { display: block }` to behave as block elements; interviewers ask how you style the outer element of a component without touching the parent's CSS
- `::ng-deep` (deprecated) — a CSS combinator that bypassed encapsulation to reach Material internals; you will see it in almost every enterprise Angular codebase built before 2022; the correct modern replacement is to put the rule in `styles.css`

### Patterns
- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; makes components reusable and testable
- Coordinator pattern — a smart page that orchestrates multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- Role-aware UI — `isAdmin = computed(() => authService.currentUser()?.role === 'admin')`; controls which elements render using `@if (isAdmin())`; the key difference from route guards: guards block navigation, role-aware UI cleans the interface for non-admin users
- Core / Feature / Shared folder structure — `core/` for guards, interceptors, singleton services; `pages/` for feature areas; `shared/` for reusable components; standard in enterprise Angular at Spanish consultancies
- HTTP interceptor as a cross-cutting concern — one interceptor handles auth headers and global error responses for the whole app, not repeated in every service

### Angular Material
- `MatTable` with `MatTableDataSource`, `MatSort`, `MatPaginator` — the standard way to display tabular data; interviewers at consultancies expect you to know this combination
- `MatDialog` — opening a modal, passing data in with `MAT_DIALOG_DATA`, and reading the result with `afterClosed()`
- Form fields: `mat-form-field`, `mat-error`, `ErrorStateMatcher` — how Material shows validation errors inside styled form fields
- `MatSnackBar` — user feedback after actions (save, delete, error); injected as a service, not added to `imports`
- Custom theming: scoped `mat.theme()` in a component stylesheet — how to apply a different colour to one component without changing the whole app

### Testing
- Jasmine: `describe`, `it`, `expect`, `beforeEach` — the test structure Angular uses by default; required from project 07 onwards
- `TestBed.configureTestingModule` — sets up the Angular DI context for a test so you can inject real services and mocks
- Testing a service with `TestBed` — how to inject the service and call its methods in a test; what you verify and why
- `spyOn(service, 'method')` — replaces a real method with a controlled fake; use `.and.returnValue()` to control what it returns; use `.toHaveBeenCalledWith()` to assert it was called correctly; the standard way to isolate the unit under test
- `HttpClientTestingModule` + `HttpTestingController` — intercept HTTP calls in tests without hitting the network; `httpMock.expectOne(url)` asserts exactly one request was made; `req.flush(data)` sends the mock response; `httpMock.verify()` fails the test if unexpected requests were made
- What to test in a service — the business logic: correct return value, correct error thrown, correct state change after the call

### Legacy code recognition — needed on day one at a consultancy
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

---

## Angular Material

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026. Every item must be explainable with a real example from one of the projects. Angular Material is standard in Spanish consultancies — interviewers expect you to have used it in a real app, not just read the docs.

---

### Theming and setup

- `ng add @angular/material` — the correct way to install Angular Material; interviewers may ask what it does (adds the package, configures theming, imports fonts and icons in `index.html`)
- `mat.theme()` in `material-theme.scss` — the v19+ way to define the app's color palette; interviewers ask why you use this instead of overriding CSS classes directly (CSS variables, upgrade-safe)
- Context-specific theme — scoping `mat.theme()` to a CSS class (e.g. `.btn-danger`) to apply a different palette to one component; interviewers ask how to make a red delete button without hardcoding colors
- `mat.$red-palette` and other prebuilt palettes — used inside a scoped `mat.theme()` to change a component's color variant; interviewers ask which approach to use vs `var(--mat-sys-error)` for a single color
- `provideNativeDateAdapter()` in `app.config.ts` — required for `MatDatepicker`; missing it causes a runtime error; interviewers test whether you know where providers go in a standalone app

---

### Buttons and icons

- `matButton` variants (`filled`, `outlined`, `elevated`, `tonal`) — when to use each; interviewers ask which variant is for the primary action (`filled`) and which for secondary (`outlined`)
- `matIconButton` — circle icon-only button used in table rows and toolbars; interviewers ask why you pair it with `aria-label` (no visible text — screen readers need the description)
- `matFab` / `matMiniFab` — floating action button for the one dominant page action; interviewers ask when you would use FAB vs a regular button
- `<mat-icon>` — how Material icons work; icon names come from Google Material Symbols; interviewers may ask how you add an icon to a button and where the font is loaded

---

### Form fields

- `mat-form-field` — wrapper that gives Material styling to an input; interviewers ask why it must always contain a control (`matInput` or `mat-select`) and cannot be used alone
- `mat-label` — floating label that animates up when the field has focus or a value; interviewers ask what makes it float (focus or non-empty value)
- `matInput` — directive on `<input>` or `<textarea>` to style it inside `mat-form-field`; interviewers ask why you write `matInput` on a native `<input>` instead of using a Material component directly
- `mat-error` — shows validation error text; interviewers ask when it appears by default (invalid + touched) and how to change that behaviour (`ErrorStateMatcher`)
- `mat-hint` — helper text always visible below the field; interviewers ask the difference between `mat-hint` and `mat-error` (hint is always visible; error appears conditionally)
- `subscriptSizing="dynamic"` on `mat-form-field` — removes the reserved space for hint/error; interviewers ask why a form field and a button won't align vertically in a flex row (the reserved space is the reason)
- `ErrorStateMatcher` — interface that controls when `mat-error` appears; interviewers ask how to make errors show only after the user clicks submit, not on blur — this is a standard dialog pattern

---

### Select and options

- `mat-select` + `mat-option` — styled dropdown inside `mat-form-field`; interviewers ask the difference between `value="pending"` (literal string) and `[value]="status"` (property binding from a variable)
- `(selectionChange)` vs `[(value)]` — `selectionChange` fires on user pick and requires a method; `[(value)]` is two-way binding and keeps the signal in sync automatically; interviewers ask when to use each
- `mat-optgroup` — groups options under a label; interviewers may ask how to visually separate options without disabling them
- `multiple` attribute on `mat-select` — makes the value an array; interviewers ask what changes in the form value when `multiple` is enabled

---

### Table

- `mat-table` attribute on `<table>` — turns a native table into a Material table; interviewers ask what the four required pieces are (`displayedColumns`, `ng-container matColumnDef`, `*matCellDef`, the two `<tr>` rows at the bottom)
- `matColumnDef` on `ng-container` — defines one column; value must match exactly one string in `displayedColumns`; interviewers ask what happens if the name doesn't match (column does not render)
- `*matHeaderCellDef` / `*matCellDef` — structural directives that define the header and data cell templates for a column; interviewers ask why both are needed
- `*matHeaderRowDef` / `*matRowDef` — render the header row and one data row per item; both reference `displayedColumns`; interviewers ask why you don't need to change these when adding or removing columns
- `*matNoDataRow` — empty state row shown when `dataSource` has no items; interviewers ask why `[attr.colspan]="displayedColumns.length"` is used (to span all columns)
- `MatTableDataSource` — wrapper around an array that handles sorting, filtering, and pagination; interviewers ask why you use it instead of a plain array (automatic sort + paginate behaviour)
- `MatTableDataSource` with `effect()` — when data comes from a signal input, use `effect()` to assign `dataSource.data = tasks()` and keep the source in sync
- `@if` vs `computed()` for conditional columns — wrapping `ng-container matColumnDef` in `@if` causes a Material error because the column is never registered; the correct pattern is `displayColumns = computed(...)` that includes or excludes the column name

---

### Sorting

- `MatSort` + `MatSortModule` — add column sorting to a Material table; interviewers ask the difference between `MatSort` (the class, needed for `@ViewChild`) and `MatSortModule` (the module, needed in the `imports` array)
- `matSort` on `<table>` and `mat-sort-header` on `<th>` — `mat-sort-header` goes on the `<th>` element, not on the `ng-container`; a common mistake interviewers test for
- `@ViewChild(MatSort)` in `ngAfterViewInit` — interviewers ask why you must connect `dataSource.sort = this.sort` in `ngAfterViewInit` and not in the constructor (template doesn't exist yet in the constructor)
- View encapsulation and `styles.css` — sort header internals cannot be styled from component CSS because Angular's scoped attributes don't reach directive-generated elements; global `styles.css` is required; interviewers ask why centering a sort header column from component CSS doesn't work

---

### Paginator

- `MatPaginator` + `MatPaginatorModule` — adds page controls to a table; same `@ViewChild` + `ngAfterViewInit` pattern as `MatSort`; interviewers ask why the paginator must be placed outside and after the `</table>` closing tag
- `[pageSize]` + `[pageSizeOptions]` — configure default rows per page and the size options the user can pick
- Reset to first page after filter — `this.dataSource.paginator.firstPage()` after applying a filter; interviewers ask what happens without it (user stays on the page they were on, which may now be empty)

---

### Dialog

- `MatDialog` service + `MatDialogRef` — the two-part system for dialogs; `MatDialog` is injected in the parent to open; `MatDialogRef` is injected in the dialog to close and return data
- `dialog.open(ComponentClass, config)` — interviewers ask what the first argument is (the component class itself, not a string or template)
- `afterClosed().subscribe()` — where the parent listens for the dialog result; interviewers ask what value is emitted when the user clicks Cancel or clicks outside (`undefined`)
- `MAT_DIALOG_DATA` — injection token to read data passed from the parent into the dialog; interviewers ask how the dialog knows it is in add vs edit mode (check if `data` is `null`)
- `patchValue()` vs `setValue()` — `patchValue()` fills only the fields you pass; `setValue()` requires all fields; interviewers ask which one to use when pre-filling a dialog for edit
- `mat-dialog-title` / `mat-dialog-content` / `mat-dialog-actions` — must be siblings, never nested; interviewers ask what breaks if you nest them (Material applies different padding and scroll to each — nesting corrupts the layout)
- `mat-dialog-close` attribute on Cancel button — closes the dialog immediately with no data and no TypeScript needed; interviewers ask when you would replace it with a custom `onCancel()` method (when you need to check for unsaved changes)
- `autoFocus: false` in the dialog config — prevents the focus ring appearing on the first button when the dialog opens; interviewers ask why a button looks selected when the dialog opens (autoFocus is on by default)
- Confirmation dialog pattern — reusable dialog that takes `title`, `message`, `confirmLabel` as `MAT_DIALOG_DATA` and returns `true` on confirm; interviewers ask where the destructive action button goes (always last, on the right)

---

### Snackbar

- `MatSnackBar` is a service — no `imports` array entry needed; interviewers ask how it differs from other Material components (it is injected directly, not declared in imports)
- `snackBar.open(message, actionLabel, { duration })` — the three parameters; interviewers ask what happens if `duration` is omitted (snackbar stays open until the user clicks the action)
- `MatSnackBar` vs `MatDialog` — snackbar does not block the user and closes automatically; dialog blocks the user and requires interaction; interviewers ask which to use after a successful form submit (snackbar)
- Coordinator pattern for snackbar — always call `snackBar.open()` in the page component after `afterClosed()` returns a result, never inside the dialog; interviewers ask why calling it inside the dialog is wrong (the dialog doesn't know if the save succeeded)

---

### Navigation shell — Toolbar, Sidenav

- `mat-toolbar` — persistent app header; `justify-content: space-between` or a flex spacer element (`flex: 1 1 auto`) to push title left and actions right; interviewers ask how to position items on opposite sides
- `mat-sidenav-container` / `mat-sidenav` / `mat-sidenav-content` — the three-element structure that is always required; interviewers ask what each one does and why you cannot put just `mat-sidenav` on its own
- `mode="side"` vs `mode="over"` — `side` shows next to content with no backdrop; `over` floats above content with a backdrop; interviewers ask which mode an enterprise app shell uses
- `[opened]="!!currentUser()"` — how to show/hide the sidenav reactively; `!!` converts `User | null` to `boolean`; interviewers ask why `[opened]="currentUser()"` causes a type error
- Keep `mat-sidenav-container` always in the DOM — if you wrap it in `@if`, the `router-outlet` inside disappears on logout; the sidenav itself uses `[opened]` to hide; interviewers ask why the login page goes blank after logout (container was removed)
- Full-height app shell CSS — the height chain (`html → body → app-root → mat-sidenav-container`); `overflow: hidden` on `app-root` is the key rule; interviewers ask why the toolbar scrolls away with the content (missing `overflow: hidden`)
- `mat-nav-list` + `mat-list-item` — correct elements for navigation links inside the sidenav; interviewers ask what `routerLinkActive` adds (a CSS class when the route matches)
- `routerLinkActive` + `[activated]` pattern — `#rla="routerLinkActive"` gives access to `rla.isActive`, which is passed to Material's built-in active style via `[activated]`; interviewers ask the difference between the class approach and the `[activated]` approach

---

### Card

- `mat-card` structure — `mat-card-header`, `mat-card-content`, `mat-card-actions`; interviewers ask what each section is for and which are optional
- `appearance="outlined"` vs default `raised` — `outlined` is flat with a border; `raised` has a shadow; interviewers ask when to use each (outlined for forms and panels; raised for stat cards that need to stand out)

---

### Datepicker

- `MatDatepicker` three-element structure — `[matDatepicker]="ref"` on the input, `<mat-datepicker-toggle [for]="ref">` for the icon, and `<mat-datepicker #ref>` as the popup; interviewers ask why all three are needed
- Value is a `Date` object, not a string — when the `FormControl` is typed as `string | null`, the cast requires `as unknown as Date`; interviewers ask how to format the date for an API call (`.toISOString().split('T')[0]`)

---

### Stepper

- `[linear]="true"` + `[stepControl]="formGroup"` — forces the user to complete each step in order; interviewers ask what `[linear]="true"` does without `[stepControl]` (allows skipping — `[stepControl]` is what blocks invalid steps)
- `stepper.next()` does not validate — when navigation buttons are outside the stepper, `stepper.next()` moves unconditionally; you must call `markAllAsTouched()` and check `form.valid` manually before calling it; interviewers ask what happens if you just call `stepper.next()` directly
- `stepper.selectedIndex` — used to show different buttons per step (Next on step 0, Back + Submit on step 1); available in the template because `#stepper` is a template reference variable
- `FormBuilder.group({ field: ['default', validators] })` — shorthand for creating form groups; interviewers ask what the array syntax means (first element is the default value, second is validators)

### Checkbox and radio button

- `mat-checkbox` + `MatCheckboxModule` — styled checkbox bound with `formControlName` or `[(ngModel)]`; interviewers ask how to bind it inside a reactive form the same way as a text input
- `indeterminate` state on `mat-checkbox` — a third visual state (dash, not check) used for a "select all" checkbox when only some child rows are selected; interviewers ask how a table header checkbox shows partial selection
- `mat-radio-group` + `mat-radio-button` — radio buttons must be wrapped in `mat-radio-group` so only one can be selected at a time; interviewers ask what breaks if you skip the group wrapper (every button becomes independently selectable)
- Checkbox vs radio button — checkbox is for independent boolean choices or multi-select; radio is for picking exactly one option from a fixed set; interviewers ask which one to use for a status field with 3 fixed values (radio, or `mat-select` if there are many options)

### Tooltip and progress indicators

- `matTooltip` directive — shows a short text hint on hover or focus; interviewers ask why you would add it to an icon-only button even though it already has `aria-label` (tooltip is for sighted users on hover, `aria-label` is for screen readers — they serve different users)
- `matTooltipPosition` — controls where the tooltip appears (`above`, `below`, `left`, `right`); interviewers rarely test the syntax but expect you to know the directive exists
- `mat-progress-spinner` — circular loading indicator; interviewers ask where you would use it (while waiting for an HTTP response, same role as the CSS spinner used in earlier Angular projects)
- `mat-progress-bar` — horizontal loading indicator; `mode="indeterminate"` for unknown duration, `mode="determinate"` with `[value]` for a known percentage; interviewers ask the difference between the two modes
- Loading state pattern with Material — disable the submit button and show `mat-progress-spinner` while a signal like `isLoading()` is true; interviewers ask how you prevent a double form submission while a request is in flight

### Menu

- `mat-menu` + `MatMenuModule` — a dropdown list of actions triggered by a button; interviewers ask when to use it over several separate `matIconButton` elements in a table row (too many actions to show inline, or actions that need labels)
- `[matMenuTriggerFor]="menuRef"` — connects a trigger button to the menu using a template reference variable; interviewers ask how the button knows which menu to open when there are several menus on the same page (one `#ref` per row)
- `mat-menu-item` — each clickable row inside the menu; behaves like a button and can call a method directly with `(click)`

---

## Spring Boot

Topics a junior must know to pass a technical screening at NTT Data, Capgemini, or Indra in 2026.
Every item must be explainable with a real example from the TimeTrack project.

### Project setup

- `@SpringBootApplication` — combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`; interviewers ask "what does this annotation replace in a traditional Spring app?" and "why must the class be in the root package?"
- `application.properties` — where datasource, JPA settings, and JWT config go; interviewers ask how you keep credentials out of source control (environment variables with `${VAR_NAME}` syntax; app fails at startup if the variable is missing — better than a silent null at runtime)
- Profiles: `application-dev.properties`, `spring.profiles.active` — separating config per environment; asked in any interview about real-world deployment
- Maven: `pom.xml` structure, adding a dependency, `mvn clean install` — how the project is built and how libraries are pulled in; interviewers ask what `spring-boot-starter-parent` does (manages all dependency versions via a BOM so you do not write version tags)
- Lombok `@Data` — generates getters, setters, `equals()`, `hashCode()`, and `toString()`; interviewers ask "what does `@Data` generate?" — a standard question when reviewing entity code
- Lombok `@NoArgsConstructor` — generates an empty constructor required by JPA to instantiate entities when reading from the database; omitting it causes a runtime error on startup
- Lombok `@AllArgsConstructor` vs `@RequiredArgsConstructor` — `@AllArgsConstructor` takes every field; `@RequiredArgsConstructor` takes only `final` and `@NonNull` fields; interviewers ask which to use for a service class with constructor injection (`@RequiredArgsConstructor` — it picks up only the `private final` dependencies)
- `@Slf4j` — Lombok annotation that generates a `log` field; `log.info()`, `log.warn()`, `log.error()`; seen in every production codebase and asked about in code reviews
- `data.sql` — Spring Boot runs this file on startup to seed the database; used in TimeTrack to create the first manager account; interviewers ask "how did you create the first user if there is no register endpoint?"

### REST controllers

- `@RestController` — combines `@Controller` and `@ResponseBody`; every return value is serialised to JSON by Jackson automatically; interviewers ask "what is the difference between `@Controller` and `@RestController`?" — `@Controller` is for server-rendered HTML; always use `@RestController` for a REST API
- `@RequestMapping` — sets the base URL path for all methods in the class; combined with method-level annotations (`@GetMapping`, `@PostMapping`) to form the full URL
- `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` — method-level annotations for each HTTP verb; `@PatchMapping` is used for partial updates and state transitions (submit, approve, reject); tested in every technical screening
- `@PathVariable` — reads a variable from the URL path (`/{id}`); the name inside `{}` must match the parameter name or be declared explicitly with `@PathVariable("id")`; interviewers ask "what happens if the names don't match?"
- `@RequestBody` — reads the JSON body and converts it to a Java object via Jackson; requires the client to send `Content-Type: application/json`; used with `@Valid` to trigger validation
- `@RequestParam` — reads query string parameters (`?month=2025-05`); can be `required = false` with a `defaultValue`; used for optional filters, not for required resource identifiers
- `ResponseEntity<T>` — the correct way to control the HTTP status code; interviewers ask "why not just return the object directly?" — because the status code is part of the API contract and without it every method returns 200
- HTTP status conventions: 200 GET/PUT success, 201 POST success, 204 DELETE success, 400 validation error, 401 missing or invalid token, 403 authenticated but not allowed, 404 not found, 409 duplicate — tested in every technical interview
- Jackson serialisation — Spring Boot uses Jackson automatically to convert Java objects to JSON on the way out and JSON to Java on the way in; interviewers ask "how does Spring Boot convert your return value to JSON?" — Jackson is the answer; it reads public getters or Lombok-generated ones
- Request DTO vs Response DTO — why you never expose the JPA entity directly over the API (couples the API to the DB schema, risks leaking sensitive fields like password hash, over-fetches data the client does not need); interviewers always ask this
- `toResponse()` mapping pattern — entity-to-DTO conversion extracted to one private helper in the service layer; keeps controllers free of mapping logic and avoids repeating the same field assignments in every method
- `@JsonIgnore` — prevents a field from appearing in the JSON response; used on the `password` field so the API never returns hashed passwords; interviewers ask "why doesn't your API expose the password?"

### Dependency injection and beans

- `@Service`, `@Repository`, `@Component`, `@Controller` — all four register the class as a Spring bean; `@Repository` also translates JPA/Hibernate exceptions into Spring's `DataAccessException`; interviewers ask "what is the difference between `@Service` and `@Component`?" — semantics and layer readability
- `@Bean` in a `@Configuration` class — the way to register library classes you cannot annotate with `@Component`; used in `SecurityConfig` to expose `BCryptPasswordEncoder` and `AuthenticationManager`; interviewers ask "why did you define a `@Bean` for `BCryptPasswordEncoder`?"
- Constructor injection — preferred over `@Autowired` field injection; makes dependencies explicit, `final`, and easy to mock in tests without starting Spring; Spring infers it automatically when the class has one constructor; interviewers ask "why not field injection?"
- `@Value("${property.name}")` — injects a single config value from `application.properties` at startup; the app fails fast if the key is missing rather than throwing a `NullPointerException` at runtime
- `@ConfigurationProperties` — binds a group of related properties to a class at once; cleaner than many individual `@Value` annotations when you have grouped config like `app.jwt.secret` and `app.jwt.expiration`
- `@Qualifier` / `@Primary` — needed when two classes implement the same interface and Spring cannot decide which one to inject; `@Primary` sets a default, `@Qualifier("beanName")` picks one explicitly at the injection point; interviewers ask "what happens if you have two `@Service` classes implementing the same interface and inject the interface type?" (Spring throws at startup unless you resolve the ambiguity with one of these)

### Spring Data JPA — entity and relationship mapping

- `@Entity` — marks the Java class as a JPA entity; Hibernate manages its lifecycle and maps it to a database table; omitting it means Hibernate ignores the class completely with no error
- `@Table(name = "users")` — sets the table name; always required for the `User` entity because `user` is a reserved word in PostgreSQL; convention: use plural lowercase names (`users`, `projects`, `time_entries`) to avoid reserved-word conflicts
- `@Id` — marks the primary key field; without it Hibernate throws a `MappingException` on startup
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` — delegates id generation to the database's auto-increment (`BIGSERIAL` in PostgreSQL); the default `AUTO` strategy creates a shared sequence that increments by 50, leaving large gaps — always use `IDENTITY` in PostgreSQL projects
- `@Column(nullable = false)` and `@Column(unique = true)` — add `NOT NULL` and `UNIQUE` constraints; Hibernate reflects them in the schema when `ddl-auto=update`; interviewers inspect entity annotations for missing constraints
- `@ManyToOne(fetch = FetchType.LAZY)` and `@JoinColumn(name = "user_id")` — the entity on the "many" side holds the FK column; `@JoinColumn` names that column; interviewers ask "which entity owns the foreign key and why?"
- `@OneToMany(mappedBy = "user")` — the inverse side of the relationship; `mappedBy` points to the field in the other entity that owns the FK; omitting `mappedBy` causes JPA to create an unexpected join table
- `@ManyToMany` — models a many-to-many relationship; requires a join table; interviewers ask about relationships and this is the third type they expect you to know after `@ManyToOne` and `@OneToMany`
- `cascade = CascadeType.ALL` and `orphanRemoval = true` — `cascade` propagates save/delete operations to children automatically; `orphanRemoval` deletes a child when it is removed from the parent's collection; interviewers ask the difference between the two
- `@Enumerated(EnumType.STRING)` — stores the enum name (`DRAFT`, `SUBMITTED`) instead of its position number; using the default `ORDINAL` means inserting a new value in the middle of the enum silently corrupts every existing row; interviewers always ask why `STRING` is the safe choice
- `@CreationTimestamp` / `@UpdateTimestamp` (Hibernate) vs `@PrePersist` (JPA) — `@CreationTimestamp` is Hibernate-specific and sets the field automatically; `@PrePersist` is the JPA-standard lifecycle callback that runs before the first insert; interviewers ask "did you set `createdAt` manually?" and which approach you chose and why

### Spring Data JPA — repositories, queries, and performance

- `JpaRepository` built-in methods: `save()`, `findById()`, `findAll()`, `deleteById()`, `existsById()` — what Spring provides without writing any SQL; interviewers ask "what does `JpaRepository` give you for free?"
- `save()` insert vs update — `save()` inserts when `id == null` and merges (updates) when `id` is already set; no separate `insert()` and `update()` methods needed; interviewers ask how Spring Data decides which operation to run
- Derived query methods: `findByEmail(String email)` — Spring reads the method name and generates the SQL; no `@Query` needed for simple lookups; interviewers test how far the naming convention goes (`findByTypeAndUserId`, `existsByEmail`)
- `@Query` with JPQL — custom queries for aggregations and complex filtering; JPQL uses entity class names and field names, not table names and column names; needed for the reports endpoint in TimeTrack
- Pagination: `Pageable`, `Page<T>`, `PageRequest.of(page, size)` — the standard way to return lists in production; interviewers ask "what happens if you return `findAll()` on a table with 100,000 rows?"
- N+1 problem — one query loads the list, then N extra queries load each lazy relationship in a loop; fix with `JOIN FETCH` in `@Query` or with `@EntityGraph`; one of the most common JPA interview questions
- `FetchType.LAZY` vs `FetchType.EAGER` — `LAZY` loads the relationship only when you access the field; `EAGER` loads it on every query; `@ManyToOne` defaults to `EAGER` — a surprising gotcha; always declare `FetchType.LAZY` explicitly on `@ManyToOne`; interviewers ask "what is the default fetch type for `@ManyToOne`?"

### Exception handling

- `@RestControllerAdvice` — marks the global exception handler; combines `@ControllerAdvice` and `@ResponseBody`; using `@ControllerAdvice` alone returns HTML error pages, not JSON; interviewers ask "why `@RestControllerAdvice` and not `@ControllerAdvice`?"
- `@ExceptionHandler(SomeException.class)` — handles one specific exception type and maps it to the right HTTP status code; Spring calls it automatically when the exception propagates from any controller
- Custom exception classes extending `RuntimeException` — unchecked so they propagate without `throws` declarations; named after what went wrong (`ResourceNotFoundException`); interviewers ask "why `RuntimeException` and not `Exception`?"
- `MethodArgumentNotValidException` — Spring throws this when `@Valid` on a `@RequestBody` fails; handle it in `@RestControllerAdvice` to return 400 with field-level error messages; not catching it results in a verbose default Spring error body
- Error response format — always return a consistent `{ "message": "...", "status": 404 }` body; the Angular client must be able to parse any error the same way; interviewers ask "what does your API return when a resource is not found?"
- Soft delete — `active = false` instead of `deleteById()`; preserves historical data and audit trail; interviewers ask "what happens to existing time entries when a project is deleted?"

### Spring Security — setup and authorization

- `@Configuration` + `@EnableWebSecurity` + `@EnableMethodSecurity` — the three annotations that activate Spring Security and method-level role checks; `@EnableMethodSecurity` is silently ignored if missing — `@PreAuthorize` will compile and run but protect nothing
- `SecurityFilterChain` — the single `@Bean` that configures CSRF (disabled for JWT), session policy (`STATELESS`), route permissions, and the JWT filter order; every JWT-secured Spring Boot app has exactly one
- Route rules: `.requestMatchers("/api/auth/**").permitAll()` and `.anyRequest().authenticated()` — all public and protected routes in one place; order matters — specific rules must be declared before the catch-all; interviewers ask "how do you make the login endpoint public without exposing everything?"
- `@PreAuthorize("hasRole('MANAGER')")` — method-level role check that runs after the JWT is validated; requires `@EnableMethodSecurity` on `SecurityConfig`; silently ignored without it — the most common authorization bug in junior code
- CORS configuration in `SecurityFilterChain` — required when Angular (port 4200) calls Spring Boot (port 8080); must be configured inside the Security layer via a `CorsConfigurationSource` bean, not with `@CrossOrigin` on controllers, because the Security filter runs before controllers see the request

### Spring Security — authentication and JWT

- `UserDetailsService.loadUserByUsername()` — the one method you implement to tell Spring how to load your users from the database; called automatically by `DaoAuthenticationProvider` during login; you never call it yourself
- `BCryptPasswordEncoder` — one-way hashing with a random salt; interviewers ask "why hash and not encrypt?" — there is no need to recover the original password, and hashing is irreversible even if the database is compromised; also ask "why BCrypt?" — the work factor makes brute-force slow
- `AuthenticationManager.authenticate()` — Spring's login coordinator; calling it internally triggers `DaoAuthenticationProvider`, which calls `UserDetailsService` and `BCryptPasswordEncoder`; you expose it as a `@Bean` so `AuthService` can inject it
- `OncePerRequestFilter` — the base class for `JwtFilter`; guaranteed to run exactly once per request; reads the `Authorization: Bearer` header, validates the token, and sets the authenticated user in `SecurityContextHolder`
- `SecurityContextHolder` — thread-local storage where `JwtFilter` places the authenticated user for the current request; services call it to get the logged-in user without trusting client-supplied IDs in the request body
- `UsernamePasswordAuthenticationToken` 2-arg vs 3-arg — 2-arg (no authorities) is unverified credentials passed to `authenticate()`; 3-arg (with authorities) is a confirmed authentication stored in `SecurityContextHolder`; the distinction matters when reading JwtFilter code
- JWT structure: `header.payload.signature` — header encodes the algorithm (HS256), payload encodes the claims (`sub`, `iat`, `exp`), signature proves the token was not tampered with; interviewers ask "what is inside a JWT?" — this is the expected answer
- JWT cannot be invalidated before expiry — once issued a JWT is valid until its `exp` claim passes; there is no server-side state to delete; the practical solution is a short expiry time (15–60 min); a token blacklist in Redis restores revocability but reintroduces server state; interviewers test this trade-off directly
- Session-based vs JWT — sessions store state on the server (can revoke instantly, harder to scale horizontally); JWT stores state on the client (stateless, scales easily, cannot revoke before expiry); interviewers ask "why JWT instead of sessions?" — the REST statelessness argument is the expected answer
- HS256 vs RS256 — HS256 uses one shared secret (correct for a single backend service); RS256 uses a public/private key pair (needed when multiple services verify the same token without sharing a secret); interviewers ask which you chose and why

### Bean validation

- `@Valid` on `@RequestBody` — activates validation on the incoming DTO at the controller boundary; without it all the constraint annotations on the DTO are compiled but silently ignored at runtime; this is tested by every interviewer who looks at controller code
- `spring-boot-starter-validation` dependency — the required Maven dependency; without it `@NotBlank` and `@Email` compile fine but do nothing at runtime; a common source of confusing bugs when setting up a project from scratch
- `@NotNull` vs `@NotEmpty` vs `@NotBlank` — `@NotNull` rejects only null; `@NotEmpty` rejects null and empty string but allows whitespace; `@NotBlank` rejects null, empty, and whitespace-only strings; for String fields always use `@NotBlank`; interviewers ask the difference between all three
- `@Positive`, `@Size`, `@Email`, `@Min`, `@Max`, `@Pattern` — common validators for positive numbers, string length, email format, numeric bounds, and custom regex; interviewers expect you to recall at least three without checking the docs
- `@Validated` on the controller class — required to validate `@PathVariable` and `@RequestParam` parameters directly; `@Valid` only works on `@RequestBody`; without `@Validated` on the class, a negative ID in the URL will not be rejected
- `ConstraintViolationException` vs `MethodArgumentNotValidException` — `@Valid` on `@RequestBody` throws `MethodArgumentNotValidException`; `@Validated` on path variables throws `ConstraintViolationException`; you need a separate `@ExceptionHandler` for each or the second one falls through to the generic 500 handler

### Transactions

- `@Transactional` — wraps the service method in a database transaction; if any unchecked exception propagates out, all DB writes in that method roll back automatically; required for any method that writes to more than one table
- `@Transactional(readOnly = true)` — signals Hibernate to skip dirty-checking at the end of the method; interviewers ask "what is the benefit?" — Hibernate no longer needs to compare entity state against snapshots, which saves memory and time on large queries
- Private method gotcha — `@Transactional` on a `private` method is silently ignored because Spring creates a proxy and proxies cannot intercept private calls; must be on a `public` method; a classic interview trap that catches candidates who memorised the annotation but did not understand how it works
- `LazyInitializationException` — thrown when you access a `LAZY` relationship after the Hibernate session is closed (outside the `@Transactional` boundary); fix by converting to DTO inside the `@Transactional` method, or by using `JOIN FETCH` to load the relationship eagerly in the query
- Where `@Transactional` belongs — on the service layer; Spring Data repositories are already transactional per method; controllers do not interact with the database directly and should never have it
- Catching exceptions swallows the rollback — if you catch a `RuntimeException` inside a `@Transactional` method and do not re-throw it, Spring sees no exception and commits the transaction; the data is written even though the operation failed; a hidden gotcha interviewers include in code review questions
- `REQUIRES_NEW` propagation — always starts a new, independent transaction regardless of whether one already exists; used when an inner operation (such as writing to an audit log) must commit even if the outer transaction rolls back

### Testing

- JUnit 5: `@Test`, `@BeforeEach`, `assertEquals`, `assertThrows` — the minimum annotations and assertions to write a service unit test; included automatically via `spring-boot-starter-test`
- `@ExtendWith(MockitoExtension.class)` — activates Mockito in a plain JUnit test without loading any Spring context; the fastest test type; interviewers ask "why not use `@SpringBootTest` for all tests?" — startup cost and isolation
- Mockito: `@Mock`, `@InjectMocks`, `when().thenReturn()`, `doThrow()`, `verify()` — mocking dependencies to test one class in isolation without a database or Spring context
- Arrange / Act / Assert — the standard three-part structure every test must follow; interviewers expect to see it named in test comments or test method bodies and will ask you to explain it if the pattern is missing
- `@MockBean` vs `@Mock` — `@Mock` creates a Mockito mock without Spring; `@MockBean` creates a mock AND replaces the real Spring bean in the application context; use `@MockBean` inside `@WebMvcTest` and `@SpringBootTest`; using `@Mock` inside a Spring test results in `NullPointerException` because Spring never injects it
- `@WebMvcTest` — loads only the web layer and replaces services with `@MockBean`; tests HTTP request/response, status codes, and validation without a real database; the correct tool for testing controller behavior
- `jsonPath()` — the assertion method inside `@WebMvcTest` tests that reads a field from the JSON response: `.andExpect(jsonPath("$.id").value(1))`; interviewers ask "how do you verify the response body in a controller test?"
- `@SpringBootTest` — full integration test; loads the whole application context including the database; slow but catches wiring issues and missing `@Transactional`; reserve for critical paths only
- `@DataJpaTest` — tests only the repository layer against an in-memory H2 database; does not load controllers or services; used to verify that derived query methods and `@Query` methods return the correct data
- Layered testing strategy — service tests (JUnit + Mockito, fast, isolated), controller tests (`@WebMvcTest`, no DB), integration tests (`@SpringBootTest`, slow); consultancies ask "how do you test your backend?" — naming the three layers is the expected answer

### Tooling

- Docker: `Dockerfile` for a Spring Boot app — `FROM eclipse-temurin`, `COPY target/*.jar app.jar`, `ENTRYPOINT`; interviewers ask "how do you containerise a Spring Boot application?"
- `docker-compose.yml` — runs Spring Boot and PostgreSQL together with one command; interviewers ask "how does someone run your project locally without installing PostgreSQL separately?"
- Flyway — database migrations as versioned SQL scripts (`V1__init.sql`); why teams use it instead of `ddl-auto=update` (scripts are reviewable, tracked in git, and safe to run in production — `update` can silently alter a production table); interviewers ask about migration strategy in any production-focused screening

---

## Java

Java language concepts needed to write and understand Spring Boot code.
Nothing beyond what appears in a real Spring Boot project — not a general Java course.
Every item must be explainable with a real example from TimeTrack or the Java notes.

### Variables, types, and Strings

- `int` vs `long` — use `int` for most whole numbers, `long` for large numbers and database IDs; the `L` suffix is required for long literals (`1234567890L`) — forgetting it is a common mistake interviewers spot
- `primitive` vs wrapper class (`long` vs `Long`) — wrapper classes can be `null`; interviewers ask "why does your entity ID use `Long` and not `long`?" — because JPA sets the ID to `null` before the first save; a `long` cannot be `null` so it would cause a compile error
- `String.equals()` vs `==` — `==` compares memory addresses, not content; using `==` to compare Strings is the most common beginner bug interviewers check for in every Java code review; always use `.equals()`
- `String.isBlank()` vs `String.isEmpty()` — `isEmpty()` is true only when length is 0; `isBlank()` is also true when the string is all spaces; maps directly to understanding `@NotBlank` (rejects blanks and spaces) vs `@NotNull` (only rejects null); interviewers ask this when reviewing DTO validation
- `String.formatted()` — Java 15+ template substitution (`"User %s not found".formatted(id)`); the Java equivalent of JavaScript template literals; appears in custom exception messages
- `BigDecimal` for money — `double` cannot represent 0.1 exactly in binary; interviewers ask "what type would you use for a price field and why?"; the correct answer is `BigDecimal` — it does exact arithmetic; `double` produces rounding errors after a few operations
- `var` — local type inference (Java 10+); the type is still fixed at compile time — Java just infers it from the right side; only valid for local variables, not fields, parameters, or return types; you will see it in code reviews even if you do not write it yourself
- String immutability — every operation (`toUpperCase()`, `+`, `replace()`) returns a new `String` object instead of changing the original; interviewers ask "why does `result += name` inside a loop perform badly?" — each iteration allocates a new object that the garbage collector must clean up
- `StringBuilder` — mutable buffer for building a string inside a loop; `sb.append(x)` modifies the same object instead of creating a new one each time; interviewers ask when to reach for it instead of `+` (loops, not single-line concatenation — the compiler already optimises that case)

### Control flow

- Classic `switch` fall-through — without `break` at the end of a case, execution continues into the next case even if it does not match; one of the most common Java bugs interviewers ask candidates to spot in a code review
- Switch expression (Java 14+) — `->` syntax that returns a value directly and removes fall-through entirely; the compiler warns if a case is missing; interviewers ask why this form is safer than the classic statement and expect you to know it is the standard pattern for handling enum status fields in a service method

### Classes and objects

- Classes, fields, constructors — every Spring component is a class; interviewers ask "what is an object in the context of a Spring bean?"
- `private final` fields — why Spring Boot services use them: dependencies cannot change after construction, makes the class easier to unit test; the constructor injection pattern depends on this
- Access modifiers: `public`, `private`, `protected` — what each restricts and why Spring Boot services use `private` for fields and `public` for methods
- `this` keyword — disambiguates between a field and a constructor parameter; appears in Lombok-generated code and custom constructors
- `static` methods and fields — belong to the class, not to any instance; `Map.of()`, `Integer.parseInt()`, `Objects.equals()`, and utility factory methods are all `static`; interviewers ask "why can't a `static` method access instance fields?" (because there is no instance)
- `instanceof` — checks the runtime type of an object; appears in `equals()` overrides (`if (!(obj instanceof Employee other)) return false`) and in exception handlers; pattern matching form (`instanceof Dog dog`) is Java 16+ and is in the notes
- `equals()` and `hashCode()` — always override both together; `HashMap` and `HashSet` use `hashCode()` to find the bucket and `equals()` to confirm the match; breaking the contract causes silent bugs; Lombok `@Data` generates both automatically — interviewers ask "what does `@Data` generate?"
- `Objects.equals(a, b)` — null-safe comparison utility; equivalent to `a != null && a.equals(b)` but shorter and cleaner; use inside `equals()` overrides to avoid NullPointerException
- Encapsulation — fields are `private`, accessed through getters/setters; this is what Lombok's `@Data` generates; Spring Data reads and writes entity fields through this pattern
- Records (Java 16+) — `record CreateUserRequest(String name, String email) {}` generates the constructor, getters, `equals`, `hashCode`, and `toString` automatically; immutable by design; interviewers ask "have you seen records used as DTOs?" because it shows you know modern Java

### Interfaces and abstract classes

- Interfaces: how to define and implement — why Spring uses them everywhere (`JpaRepository`, `UserDetailsService`); interviewers ask "why does Spring prefer interfaces over concrete classes?"
- Interface vs abstract class — interface: "this class CAN do X" (a class can implement many); abstract class: "this class IS a type of X" (a class can extend only one); interviewers ask this to test if the candidate understands when to choose each
- Default methods in interfaces (Java 8+) — interfaces can have a concrete implementation with `default`; Spring's `JpaRepository` uses them to provide built-in behaviour; a class can override a default method or use it as-is
- Implementing multiple interfaces — common in Spring Security (your `User` entity may implement both your domain interface and Spring Security's `UserDetails`)
- `@Override` — marks a method that implements an interface or overrides a parent; the compiler catches mismatches; appears in `loadUserByUsername()` and custom exception constructors; omitting it is not a bug but it removes the safety check
- Overriding vs overloading — overriding: same method name and signature in a subclass (decided at runtime); overloading: same method name with different parameters in the same class (decided at compile time); interviewers show code and ask "is this an override or an overload?"
- Functional interfaces — an interface with exactly one abstract method; this is what makes lambda syntax possible; `@FunctionalInterface` enforces the constraint; built-ins: `Predicate<T>` (filter/test), `Function<T, R>` (transform), `Consumer<T>` (consume with no return), `Supplier<T>` (produce with no input); interviewers ask "what type does this lambda implement?"
- Why Spring Boot prefers interfaces for dependencies — you can swap implementations without changing the caller; the foundation of testable, loosely coupled code

### Generics

- `List<T>`, `Optional<T>`, `Page<T>`, `ResponseEntity<T>` — reading and writing typed containers in Spring Boot code
- Why generics exist — catch type errors at compile time instead of at runtime; without generics, a `List` could hold any type and every `.get()` required a cast that could fail at runtime
- `Optional<T>` in depth: `orElseThrow()`, `orElse()`, `isPresent()`, `map()`, `ifPresent()` — the correct way to handle a value that might not exist
- `Optional.get()` vs `Optional.orElseThrow()` — `get()` throws `NoSuchElementException` with no useful message if empty; `orElseThrow()` lets you throw a meaningful exception with context; interviewers treat `get()` as a red flag in code review — it is the same problem as returning `null`
- Why returning `null` is a problem — forces every caller to null-check; `Optional` makes the absence explicit in the return type; interviewers ask "why Optional instead of null?"

### Streams and lambdas

- Lambda expressions — anonymous functions used wherever a functional interface is expected; `e -> e.isActive()` is the most common form in service methods; interviewers ask you to read a lambda and explain what it does
- Method references — shorthand for a lambda that only calls one method: `this::toResponse`, `Employee::getName`, `System.out::println`; when both forms are used in the same codebase interviewers ask "can you explain what this reference does?"
- Stream pipeline: `filter()`, `map()`, `collect()` — the core pattern for transforming a list; `filter` keeps matching elements, `map` transforms each element, `collect` builds the result; interviewers ask you to write a pipeline from a description
- `findFirst()` — returns `Optional<T>`; the safe way to get one item from a filtered stream without throwing
- `anyMatch()` / `allMatch()` — return a boolean; used instead of a for loop when you only need to check a condition across a list
- `mapToInt().sum()` — pattern for summing a numeric field across a list: `employees.stream().mapToInt(Employee::getAge).sum()`; avoids creating intermediate objects; interviewers may ask you to refactor a for loop that sums a field
- `Collectors.groupingBy()` — groups elements into `Map<Key, List<Value>>`; used when a service must return data organised by a field (status, department, date); interviewers ask you to read the result type
- `.toList()` vs `collect(Collectors.toList())` — `.toList()` is Java 16+ and returns an immutable list; `collect(Collectors.toList())` returns a mutable list; if the next line calls `.add()` on the result, `.toList()` will throw; interviewers ask the difference when reviewing modern Java code
- Stream vs for loop — streams express intent clearly (`filter` + `map`); for loops are clearer when the logic is complex or when you need early exit with `break`; know when to choose each

### Exceptions

- Checked vs unchecked exceptions — why Spring Boot uses unchecked (`RuntimeException` subclasses): they do not need to be declared in the method signature and propagate freely to `@RestControllerAdvice`
- `RuntimeException` vs `Exception` — `RuntimeException` is unchecked (no `throws` declaration needed); `Exception` is checked (must declare with `throws` or catch it); always extend `RuntimeException` for custom exceptions in Spring Boot so they propagate without boilerplate
- `try` / `catch` / `throws` — reading Spring Boot exception handling code; `throws` in a method signature is a contract: the caller must handle it
- Creating a custom exception: `extends RuntimeException`, constructor that accepts a message, why you name it after what went wrong (`ResourceNotFoundException`)
- `throw new SomeException()` — how it propagates up the call stack until `@RestControllerAdvice` catches it and returns a JSON error response

### Collections

- `List` — ordered, allows duplicates; used in repository results and service return types (`List<User>`)
- `Map` — key-value pairs; `Map.of("message", "Not found")` for quick immutable error response bodies; Spring serialises it to JSON automatically
- `Set` — no duplicates; used in many-to-many relationships (e.g. a user's set of roles or permissions)
- When to use each in a Spring Boot context — `List` for ordered results from queries, `Map` for ad-hoc response bodies, `Set` for relationship collections where duplicates are meaningless
- `ArrayList` vs `LinkedList` — `ArrayList` is backed by an array (fast random access via `get(i)`, slow insert/remove in the middle); `LinkedList` is a chain of nodes (slow `get(i)`, fast insert/remove in the middle); interviewers ask this as a data-structure tradeoff question even though `ArrayList` is what you actually use in almost every Spring Boot project
- `Comparable<T>` vs `Comparator<T>` — `Comparable` is implemented inside the class itself (`compareTo()`) and defines one natural order; `Comparator` is defined outside the class (`compare()`, or `Comparator.comparing()`) and supports multiple sort orders without changing the class; interviewers ask which one to use when you need to sort the same list two different ways
- `Comparator.comparing()` — sorts a list by a field: `list.stream().sorted(Comparator.comparing(Employee::getName))`; used in service methods when you need a specific order that the query does not guarantee; interviewers ask you to read and explain the comparator
- `ConcurrentModificationException` — thrown when you call `list.remove()` directly inside a for-each loop over that same list; the for-each loop uses an internal iterator that detects the structural change and fails fast; interviewers ask how to safely remove items while iterating (`removeIf()` is the cleanest fix; an explicit `Iterator.remove()` also works)

### Enums

- Defining an enum — used for `Role` (EMPLOYEE, MANAGER) and `EntryStatus` (DRAFT, SUBMITTED, APPROVED, REJECTED) in TimeTrack; interviewers ask you to show one from the project
- Using enums in `switch` expressions — the clean way to handle each status in a service method; exhaustive by default so the compiler warns if a case is missing
- `@Enumerated(EnumType.STRING)` vs `EnumType.ORDINAL` — `STRING` stores the name ("MANAGER") in the database; `ORDINAL` stores the position (0, 1, 2); if you add a new value in the middle of the enum, `ORDINAL` silently breaks all existing records; interviewers always ask why `STRING` is the safe choice

### Annotations

- What annotations are — metadata attached to a class, method, or field that Spring reads at runtime to configure behaviour; they do not change what the code does on their own — they are instructions to the framework
- Meta-annotations — annotations that annotate other annotations; `@Service` is composed of `@Component` with a semantic label; this is why `@Service` and `@Repository` behave the same way as `@Component` for dependency injection — they are all discovered by Spring's component scan
- How to read an unfamiliar annotation — look at what it is composed of (meta-annotations), what it enables (like `@EnableMethodSecurity`), and which layer it belongs to; this skill matters because Spring Boot code is dense with annotations you did not write yourself

### Date and time

- `LocalDate` — a date without time (`2025-05-14`); used for the `date` field on a TimeEntry; immutable and thread-safe unlike the legacy `java.util.Date`
- `LocalDateTime` — a date with time (`2025-05-14T09:30:00`); used for `createdAt` and `updatedAt` timestamps; also immutable
- `LocalDate` vs `LocalDateTime` — use `LocalDate` when time is not relevant (a deadline, a work date); use `LocalDateTime` when you need the exact moment something happened; they are different types — mixing them causes a compile error; interviewers ask which one you used for each field and why
- Why not `java.util.Date` — it is mutable, poorly designed, and replaced by the `java.time` API in Java 8; interviewers ask this directly when they see date fields in your project
- `DateTimeFormatter` — formatting a date for display or for an API response; `DateTimeFormatter.ISO_LOCAL_DATE` produces the standard `2025-05-14` format
- JPA mapping — Spring Boot serialises `LocalDate` and `LocalDateTime` to JSON automatically via Jackson when `jackson-datatype-jsr310` is on the classpath (included with `spring-boot-starter-web`)

### Maven

- `pom.xml` structure: `groupId`, `artifactId`, `version`, `dependencies`, `build` — what each section does and where to add a new library
- How to add a dependency — search Maven Central, copy the `<dependency>` block, Maven downloads it automatically on the next build
- Build lifecycle: `clean`, `compile`, `test`, `package`, `install` — what `mvn clean install` does and why it is the standard command to build and test before pushing
- Dependency scopes: `compile` (default, always available), `test` (only in tests), `provided` (available at runtime but not packaged) — why `spring-boot-starter-test` uses `test` scope; interviewers ask what scope to use for a testing library

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
- HTTP status codes — `200 OK` (success with body), `201 Created` (POST that creates a resource), `204 No Content` (DELETE with no body), `400 Bad Request` (invalid client data), `404 Not Found` (wrong ID); sending the wrong code misleads clients and tools
- `401 Unauthorized` vs `403 Forbidden` — 401 means no valid credentials (who are you?); 403 means valid credentials but insufficient permissions (you are not allowed); interviewers ask this because it tests whether the candidate understands authentication vs authorisation
- CORS — a browser security rule that blocks requests from a different origin (e.g. Angular on port 4200 calling Spring Boot on port 8080); the fix is always on the server, never in the browser or client code; if Postman works but the Angular app does not, CORS is the cause; interviewers ask where the fix lives
- Query parameters for filtering and pagination — `GET /api/entries?month=2025-05&status=SUBMITTED`; query params carry optional filtering; the backend reads them with `@RequestParam`, the frontend sends them with `HttpParams`; never use a request body on `GET` requests
- Why REST and not GraphQL or RPC — the standard for Spanish consultancy APIs; REST is simpler to implement and understand at junior level

### Layered architecture

- Frontend/backend separation — Angular runs in the browser and Spring Boot runs on a server; they communicate only through HTTP; Angular never queries the database directly; the backend controls what data is exposed and who can access it
- Controller → Service → Repository — what each layer owns and what it must not do; interviewers ask "where does business logic live?"
- Service layer — the class (`@Service`) that holds business rules, validation beyond bean validation, and orchestration between repositories; interviewers ask "why not put this logic in the controller?" — because the controller would then be impossible to reuse from another entry point (a scheduled job, a CLI command) and impossible to unit test without starting the whole web layer
- Repository pattern — an interface (`JpaRepository<Entity, Id>`) that hides how data is actually fetched from the database behind method calls like `findByEmail()`; interviewers ask "what does the repository pattern give you?" — the service does not know or care if the data comes from PostgreSQL, an in-memory list, or a different ORM; this is what makes the service testable with a mock repository
- Why business logic belongs in the service — the controller must not decide; the repository must not know the rules; the service is the only place
- Why the controller must not call the repository directly — bypasses the business rules layer; makes the code impossible to test in isolation
- MVC — Model (data + business logic), View (what the user sees), Controller (receives input, coordinates the other two); interviewers ask "do you know MVC?" expecting you to map it onto your own stack, not recite the textbook triangle
- MVC vs Layered Architecture — MVC is for apps that render HTML (controller returns a View); Layered Architecture is for REST APIs (controller returns JSON, the View is a separate SPA); layered architecture is really MVC with the Model split into Service (business logic) and Repository (data access) because one combined Model layer gets too large for a real application
- State machine pattern — a workflow where status transitions follow fixed rules (DRAFT → SUBMITTED → APPROVED/REJECTED); the service enforces which transitions are valid

### DTO pattern

- Why not expose entities directly — the entity belongs to the database layer; exposing it couples your API shape to your DB schema; a field rename breaks all clients
- Request DTO vs Response DTO — validate on the way in (client data is untrusted); control what goes out (you built it, you trust it)
- Where mapping happens — in the service layer, not the controller; the controller never sees the entity
- What changes when you add a field to the entity but not the DTO — nothing visible to the client; the DTO is the public contract

### Auth design

- JWT vs session-based auth — JWT is stateless (no server memory per user); session is stateful (server stores session); JWT scales better for APIs consumed by multiple clients
- Why stateless auth matters for APIs consumed by Angular — no shared session state; the API can run on multiple servers without sticky sessions
- Access token vs refresh token — access token is short-lived (minutes to hours); refresh token is long-lived and used only to get a new access token; limits damage if a token is stolen
- Where to store the JWT in the browser — localStorage is simple but vulnerable to XSS; HttpOnly cookie is safer but vulnerable to CSRF; localStorage is the common choice for SPAs that already prevent XSS

### Data access decisions

- N+1 problem — when JPA loads a list of entities and fires one extra query per entity to load a related field; causes serious performance problems silently; fix with `JOIN FETCH` or `@EntityGraph`
- Soft delete vs hard delete — `active = false` instead of `DELETE FROM`; preserves historical data, prevents orphaned records, allows recovery
- Pagination — why you always paginate list endpoints in production; returning 100,000 rows crashes the server and the client
- `@Transactional` as a design decision — when a service method writes to two tables, both operations must succeed or both must roll back

### Angular patterns

- Smart / dumb component pattern — the smart component fetches data and handles events; the dumb component only displays and emits; separation makes testing easier and code more readable
- Coordinator pattern — a smart page that delegates display to multiple dumb children; all state lives in the coordinator; interviewers ask "how do you manage state in Angular?"
- HTTP interceptor as a cross-cutting concern — one interceptor adds auth headers and handles global errors for the entire app; the alternative (doing it in every service) breaks DRY
- When a coordinator grows too large — the signal to extract a service or split the feature into sub-pages; Single Responsibility applied at the component level

### Justifying architectural choices

- The "what + why + result" formula — every architecture decision must be explainable as: what you chose, why you chose it, and what problem it avoids or enables; answers like "I used coordinator because the page is big" do not pass a technical interview
- Comparing real alternatives — an architecture decision only exists when there was a real alternative; interviewers ask "why not the simpler option?" and expect a specific tradeoff, not a general preference
- Anchoring decisions to your own projects — in 2026 interviewers expect you to refer to code you actually wrote; "in project 05 I used coordinator because three siblings shared the same task list and lifting state to a parent avoided prop drilling" is a passing answer; a textbook definition is not

### Testing strategy

- Unit test vs integration test — unit tests one method in isolation (fast, no context); integration test loads the full stack (slow, catches wiring issues)
- Why you test the service layer independently — business rules live there; testing them directly without HTTP gives fast, focused feedback
- What a mock is and what it hides — a controlled replacement for a real dependency; the risk is that the mock behaves differently from the real thing
- Test pyramid — many unit tests, fewer integration tests, very few E2E tests; the shape that balances speed and confidence

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
- CORS is enforced by the browser, not the server — the server always receives and processes the request; the browser blocks the response from reaching JavaScript; this is why Postman works but Angular does not when CORS is misconfigured; interviewers test this distinction
- Why it matters for Angular + Spring Boot — Angular runs on port 4200, Spring Boot on 8080; without CORS configuration the browser blocks every API call even though the server responds correctly
- How CORS is configured in Spring Boot — `CorsConfigurationSource` registered inside `SecurityFilterChain`; specifies allowed origins, methods, and headers; interviewers ask where it goes in a Spring Security project
- Preflight requests — the browser sends an `OPTIONS` request before any POST with a JSON body or any request with an `Authorization` header; the server must respond with the correct CORS headers or the real request is blocked

### Common vulnerabilities
- SQL injection — the attacker injects SQL into a user input field to manipulate the query; parameterised queries (which JPA uses automatically) prevent it; interviewers ask "how does JPA protect against SQL injection?"
- XSS (Cross-Site Scripting) — the attacker injects malicious JavaScript into a page that runs in other users' browsers and can steal tokens from `localStorage`; Angular escapes all template values by default, which prevents most XSS
- `[innerHTML]` bypasses Angular's XSS protection — Angular deliberately skips escaping when you use `[innerHTML]`; any user-provided content rendered with `[innerHTML]` creates an XSS risk; interviewers ask "can Angular still get XSS?" to test whether the candidate knows the exception
- CSRF (Cross-Site Request Forgery) — the attacker tricks a logged-in user's browser into making an unwanted request; works because cookies are sent automatically by the browser; JWT in the `Authorization` header prevents it because the browser does not attach headers automatically (only cookies)
- Why you validate on the server even when you validate on the client — client-side validation can be bypassed with Postman or browser DevTools; the server is the only boundary you can trust; `@NotBlank` and `@Valid` in Spring Boot enforce this
- Mass assignment risk of exposing entities directly — if a controller binds the request body straight to the `@Entity`, a malicious client can set fields it should never control, like `role: "MANAGER"` or `active: true`, by adding them to the JSON body; DTOs close this hole because the request DTO only declares the fields a client is allowed to send; interviewers ask "what could go wrong if you skip the request DTO and bind the entity directly?"

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
- Writing a generic function or interface — `function getFirst<T>(arr: T[]): T` — write the logic once and it works for any type while remaining type-safe; tested when discussing reusable utility functions in services
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
- `as unknown as T` double assertion — used when two types have no overlap and TypeScript refuses a direct `as` cast; `formValue.startDate as unknown as Date` is the pattern from `MatDatepicker`; interviewers ask why it goes through `unknown` (every type is assignable to and from `unknown`)

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
- Truthy vs falsy — the 6 falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`; everything else is truthy; interviewers test edge cases: `[]` and `{}` are truthy; `'0'` is truthy; `0` is falsy
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

### Classes
- Class syntax — `constructor`, methods, and `this` as the instance; every Angular component, service, pipe, and guard is a class; interviewers ask how JavaScript classes relate to prototypes — classes are syntactic sugar, the underlying mechanism is still the prototype chain
- Private fields `#` — `#salary` is enforced at runtime by the JavaScript engine; TypeScript's `private` keyword is compile-time only and is erased in the compiled output; interviewers ask the difference when discussing Angular services with internal state that should not be accessible from outside
- Getters and setters — `get salary()` / `set salary(value)` control how a property is read and written without changing the call syntax; used to add validation logic or computed formatting; Angular signals use a similar getter-like access pattern
- Static methods and properties — belong to the class itself, not to instances; called as `ClassName.method()` without `new`; used in Angular for utility methods and configuration objects that should not depend on instance state
- `extends` and `super` — `extends` inherits from a parent class; `super()` must be called before using `this` in the child constructor; `super.method()` calls the parent method; interviewers ask what happens if you forget `super()` (it throws a `ReferenceError`)

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

### Sets and Maps
- `Set` — collection of unique values; duplicates are automatically ignored; order is preserved; `has()` is O(1) while `Array.includes()` is O(n) — the performance difference is the reason to choose Set over Array for large collections
- Deduplication pattern: `[...new Set(array)]` — the most common Set use case; interviewers ask "how would you remove duplicates from an array?" — this is the expected modern answer
- `Map` — key-value collection where keys can be any type, not just strings; insertion order is guaranteed; `.size` built in; used when the key is a non-string value such as an object, a number, or an enum
- `Map` vs plain object — plain objects accept only string and Symbol keys; Maps accept any type as key; Maps are better for frequent add and delete operations; plain objects are better for fixed data shapes like DTOs and configuration
- `Set` vs `Array` — use Set when uniqueness matters or when you need fast `has()` lookups; use Array when index access or method chaining (map/filter) is needed; use `[...new Set(arr)]` to convert back to an array

### Async JavaScript
- Callbacks — the original async pattern; callback hell is deeply nested callbacks that handle sequential operations; Promises and `async`/`await` were introduced specifically to solve this readability and error-handling problem
- Promises: `then`, `catch`, `finally` — `then` runs on resolve; `catch` runs on reject; `finally` always runs regardless of outcome; interviewers ask when to use `finally` vs putting cleanup code after the `try/catch`
- `Promise.all` — runs multiple promises in parallel; resolves when ALL finish; rejects immediately if ANY fails; use when all data is required before rendering; the RxJS equivalent in Angular is `forkJoin`
- `Promise.allSettled` vs `Promise.all` — `allSettled` never rejects; it waits for all promises and returns each result with `{ status: 'fulfilled' | 'rejected', value | reason }`; use when some requests can fail independently without aborting the rest
- `async` / `await` — syntactic sugar over Promises; makes async code read like synchronous code; `await` can only be used inside an `async` function; an `async` function always returns a Promise even if it returns a plain value
- Sequential vs parallel `await` — `const a = await f(); const b = await g()` is sequential (waits one at a time); `const [a, b] = await Promise.all([f(), g()])` is parallel; interviewers ask about the performance difference when both requests are independent
- Event loop — JavaScript is single-threaded; microtasks (Promise callbacks) run before macrotasks (setTimeout); `Promise.then()` runs before `setTimeout` even at 0ms delay; explains why long synchronous code blocks the UI even if it calls no async functions
- Promise vs Observable in Angular — Promises emit one value and start immediately; Observables are lazy (start on subscribe), can emit multiple values, and can be cancelled with `takeUntilDestroyed()`; `firstValueFrom()` converts an Observable to a Promise; interviewers ask why Angular's `HttpClient` returns Observables instead of Promises

### Modules
- Named exports vs default export — Angular uses only named exports; named exports are safer to refactor because editors auto-rename them; default exports let the importer choose any name, which makes automated refactoring unreliable
- `import { name as alias }` and `import * as namespace` — renaming to avoid naming conflicts; namespace import bundles all exports into one object; used when consuming libraries that export many things at once
- Barrel pattern — an `index.ts` file that re-exports everything from a folder so imports stay clean; `import { X, Y } from './feature'` instead of long relative paths; common in large Angular feature modules
- Dynamic imports and lazy loading — `import('./module').then(m => m.Class)` loads code only when needed; Angular uses this in `loadComponent:` routing to reduce the initial bundle size; interviewers ask how lazy loading works and why it matters for app startup performance
- Tree-shaking — the bundler (esbuild) removes exported code that is never imported anywhere; only works reliably with named exports; one of the reasons Angular convention forbids default exports

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
- `!important` — overrides all specificity; avoid it except to fight third-party library styles like Angular Material; interviewers ask when it is acceptable and why it makes debugging harder

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
- `static`, `relative`, `absolute`, `fixed`, `sticky` — `static` is the default and is not a positioning context; `relative` creates the context for absolute children; `fixed` is always relative to the viewport; `sticky` sticks at a scroll threshold
- How `absolute` finds its reference point — positions relative to the nearest ancestor with a non-static position; if no ancestor qualifies, it uses the page itself; not adding `position: relative` to the parent is the most common positioning bug
- `z-index` and stacking context — only works on non-static elements; properties like `transform` and `opacity < 1` create a new stacking context that resets z-index within it; interviewers ask why a modal appears behind the navbar even with `z-index: 9999`
- `inset: 0` — shorthand for `top: 0; right: 0; bottom: 0; left: 0`; used in modal overlays to cover the full viewport; interviewers who review your code expect you to know this shorthand

### Responsive design
- Mobile-first with `@media (min-width: ...)` — base styles for mobile, then `min-width` queries add complexity for wider screens; `max-width` (desktop-first) is less common because it starts with the complex case; interviewers ask why mobile-first is the recommended approach
- Breakpoints: `768px` (tablet), `1024px` (desktop) — the most common values in real Angular projects; a junior must justify these numbers and explain that `auto-fill` grid can eliminate breakpoints entirely for card grids
- Fluid images — `max-width: 100%; height: auto` on `img` prevents images from overflowing their container and keeps the aspect ratio; standard in every CSS reset; not knowing this is a recognisable beginner mistake
- `@media (prefers-color-scheme: dark)` — applies styles when the user's system uses dark mode; with CSS variables on `:root`, switching only requires updating the variable values inside the media query; asked increasingly in 2026 since dark mode support is now expected

### Units
- `px` — absolute and predictable; used for borders, border-radius, and box-shadow blur; avoid for font sizes because `px` ignores the user's browser accessibility font size setting
- `%` — relative to the parent's value on the same axis; for vertical `padding` and `margin`, `%` is relative to the parent's **width**, not height — a common surprise in interviews
- `em` — relative to the current element's font size; compounds through nesting, which makes it hard to predict in deeply nested components; prefer `rem` by default
- `rem` — relative to the root font size (`16px` by default); does not compound; the safe choice for font sizes and spacing; `rem` vs `em` is a classic confusable pair
- `vw` and `vh` — relative to the viewport width and height; `min-height: 100vh` is safer than `height: 100vh` because it grows with content instead of clipping it

### Transitions and animations
- `transition` — smooth change for a specific property on state change; always place it on the base element, not on `:hover`, so it runs in both directions; putting it on `:hover` makes the exit instant — a classic interview trap
- `transform` — `translateX/Y`, `scale`, `rotate` change visual appearance without affecting layout; other elements do not shift; fast because the browser handles it on the GPU without recalculating the page
- `transform` vs `top/left` for movement — animating `top` or `left` triggers a full layout recalculation every frame; `transform: translate()` does not; interviewers ask which is more performant and why — a confusable pair
- `@keyframes` and `animation` — multi-step animations; `animation-iteration-count: infinite` for loading spinners; `animation-fill-mode: forwards` keeps the final state after the animation ends instead of snapping back

### Typography
- `font-size` with `rem` — `px` ignores the user's browser font size preference and breaks accessibility; `rem` scales with the root setting; interviewers ask why a font size set in `px` is bad practice for accessibility
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
- `box-shadow` syntax: `offset-x offset-y blur spread color` — interviewers show a value like `0 4px 12px rgba(0,0,0,0.12)` and ask what each part controls; `spread` is optional and often omitted; color should always use `rgba`
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
- Self JOIN — a table joined to itself using two aliases, used to compare rows within the same table (e.g. "which employees share the same manager?" or "find duplicate emails"); interviewers ask how you join a table to itself when there is only one `FROM` clause to work with
- Table aliases in JOINs — `FROM books b JOIN authors a ON b.author_id = a.id`; makes queries readable and is required when two joined tables share a column name

---

### Aggregates and grouping

- `COUNT(*)` vs `COUNT(column)` — `COUNT(*)` counts all rows including those with `NULL`; `COUNT(column)` counts only non-`NULL` values; interviewers ask this difference explicitly
- `SUM`, `AVG`, `MIN`, `MAX` — all ignore `NULL` values automatically; `AVG(price)` on `[10, NULL, 30]` returns `20`, not `13.33`; a common source of unexpected results in junior code
- `GROUP BY` rule — every column in `SELECT` must either appear in `GROUP BY` or be inside an aggregate function; breaking this rule causes a PostgreSQL error; the most common GROUP BY mistake in junior code
- `GROUP BY` with `LEFT JOIN` — when joining before grouping, include all non-aggregated columns from the joined table in `GROUP BY`; use `LEFT JOIN` so groups with zero matches still appear with `COUNT = 0`
- `HAVING` — filters groups after aggregation; `WHERE` filters rows before grouping; `WHERE` cannot use aggregate functions, `HAVING` can; interviewers always ask the difference
- Conditional aggregation with `CASE WHEN` — `SUM(CASE WHEN status = 'approved' THEN hours ELSE 0 END)` aggregates only a subset of rows; used for reporting by status in TimeTrack; interviewers ask "how would you count only approved entries per project?"
- `FILTER (WHERE ...)` — PostgreSQL shorthand for conditional aggregation: `COUNT(*) FILTER (WHERE status = 'approved')`; same result as `CASE WHEN` but cleaner for simple conditions

---

### Querying basics

- SQL execution order — `FROM + JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`; the foundation for understanding why aliases work in `ORDER BY` but not in `WHERE` or `HAVING`
- `SELECT *` vs named columns — always specify columns in application code; `SELECT *` fetches data you do not need, sends more over the network, and breaks when the schema changes
- `CASE WHEN` in `SELECT` — `CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status` produces a conditional column for each row; interviewers ask you to add a status label to a result set
- `CASE WHEN` in `SELECT` vs inside an aggregate — in `SELECT` it produces a new column per row; inside `SUM(CASE WHEN ...)` it filters which rows contribute to the aggregate; same syntax, very different behavior
- `SELECT DISTINCT` — removes duplicate rows from the result; PostgreSQL treats `NULL` as a duplicate and keeps only one; use to explore unique values in a column
- `DISTINCT ON` — PostgreSQL-specific; keeps one row per group while returning multiple columns; the column inside `DISTINCT ON (...)` must be the leftmost column in `ORDER BY`
- `ORDER BY` with `NULLS FIRST` / `NULLS LAST` — PostgreSQL treats `NULL` as the largest value by default; `ASC` puts `NULL` last, `DESC` puts `NULL` first; override with `NULLS FIRST` or `NULLS LAST`
- `LIMIT` always with `ORDER BY` — without `ORDER BY`, `LIMIT` returns an arbitrary set of rows that can change between queries; always pair them
- `OFFSET` for pagination — `LIMIT 10 OFFSET 20` skips 20 rows and returns the next 10; formula: `OFFSET = (page − 1) × page_size`
- `||` string concatenation — joins two text values into one column, e.g. `first_name || ' ' || last_name AS full_name`; interviewers ask how you build a display name from separate columns without a function call
- `UNION` vs `UNION ALL` — `UNION` combines the results of two queries and removes duplicate rows; `UNION ALL` keeps every row including duplicates and is faster because it skips the duplicate check; interviewers ask which one to use when you know the two result sets cannot overlap (`UNION ALL` — no reason to pay for a duplicate scan)
- `UNION` column rules — both queries must return the same number of columns with compatible types; column names in the result come from the first query; interviewers ask what happens if the column types do not match (PostgreSQL raises an error or silently casts, depending on the mismatch)

---

### Filtering and NULL handling

- `WHERE` cannot use aliases — `WHERE` runs before `SELECT`, so column aliases do not exist yet; you must repeat the expression rather than use the alias
- `IS NULL` vs `= NULL` — `WHERE price = NULL` never matches any row because `NULL` is not a value; always use `IS NULL` and `IS NOT NULL`; interviewers ask why `= NULL` does not work
- `AND` / `OR` with `NULL` — `true AND NULL` returns `NULL`, but `false AND NULL` returns `false`; `false OR NULL` returns `NULL`, but `true OR NULL` returns `true`; a `WHERE` filter without an `IS NULL` check can silently exclude rows
- `COALESCE(value, fallback)` — returns the first non-`NULL` value; used to replace `NULL` with a default (`0`, `''`, `'Unknown'`) so the application never has to handle `NULL` from the query result
- `NULLIF(a, b)` — returns `NULL` if `a = b`, otherwise returns `a`; most common use: avoid division by zero with `SUM(...) / NULLIF(COUNT(*), 0)`
- `LIKE` vs `ILIKE` — `LIKE` is case-sensitive; `ILIKE` is PostgreSQL-specific and case-insensitive; `%` matches any sequence of characters, `_` matches exactly one character
- `IN` vs multiple `OR` — `IN (list)` is cleaner and optimized internally by PostgreSQL; preferred when checking against more than two values
- `BETWEEN` with timestamps — `BETWEEN '2024-01-01' AND '2024-06-30'` silently excludes events after midnight on June 30; safer to cast before comparing: `created_at::date BETWEEN '2024-01-01' AND '2024-06-30'`

---

### Subqueries, CTEs, and views

- Subquery in `WHERE` — `WHERE price > (SELECT AVG(price) FROM books)` — you cannot use `AVG` directly in `WHERE`; the subquery runs first and its result is used by the outer query
- Subquery in `FROM` (derived table) — a query used as a table; must have an alias; used to filter on an aggregated result because `WHERE` cannot use aggregate functions
- Scalar subquery in `SELECT` — returns exactly one value used as a column in the result; runs once per row and can be slow on large tables; interviewers ask when this would cause a performance problem
- `IN` vs `EXISTS` — `IN` collects all results from the subquery first; `EXISTS` stops as soon as it finds one match and is faster on large tables; interviewers ask when you would prefer one over the other
- Subquery vs `JOIN` — most `WHERE` subqueries can be rewritten as a `JOIN`, which the database can optimize better; prefer a `JOIN` when readable; use a subquery when you need an aggregate in a filter
- `WITH` (CTE) — names a subquery so it can be referenced by name in the same query; makes multi-step queries readable; interviewers ask "when would you use a CTE instead of a subquery?"
- Multiple CTEs — chain CTEs with commas; each CTE can reference the ones defined before it; used to build complex queries step by step without nesting
- `CREATE VIEW` — saves a query in the database with a name; queried like a table but runs the underlying query live on every access; used to avoid repeating complex JOINs across different parts of an application
- View vs materialized view — a regular view runs the query live every time; a materialized view stores the result on disk and must be refreshed manually with `REFRESH MATERIALIZED VIEW`; regular views are for convenience, materialized views are for performance

---

### DML — modifying data

- `INSERT INTO ... VALUES (...)` — adds rows to a table; skip `id` (generated by `SERIAL`), columns with `DEFAULT` values, and nullable columns you want to leave empty
- `RETURNING` — `INSERT INTO users (...) VALUES (...) RETURNING id` — returns the generated ID without a second `SELECT`; PostgreSQL-specific; interviewers ask "how do you get the new ID after an INSERT?"
- `UPDATE ... SET ... WHERE` — always include `WHERE` or every row in the table is updated; one of the most common catastrophic mistakes in junior code
- `DELETE FROM ... WHERE` — always include `WHERE` or every row is deleted; always verify the affected rows with a matching `SELECT` before running `DELETE` on production data
- `DELETE` vs `TRUNCATE` — `DELETE` supports `WHERE`, logs every row, and can be rolled back; `TRUNCATE` removes all rows instantly, does not support `WHERE`, and resets `SERIAL` counters; never use `TRUNCATE` in application code
- `ON CONFLICT` (upsert) — `INSERT ... ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name` — atomic insert-or-update; avoids the race condition of a `SELECT` + `INSERT` pair; `EXCLUDED` refers to the values that would have been inserted

---

### Transactions

- `BEGIN` / `COMMIT` / `ROLLBACK` — groups multiple statements so they either all succeed or all fail; `ROLLBACK` undoes everything since `BEGIN`; the SQL-level mechanism that `@Transactional` wraps in Spring Boot
- ACID properties — Atomicity (all or nothing), Consistency (constraints never violated mid-transaction), Isolation (concurrent transactions do not see each other's uncommitted changes), Durability (committed data survives a crash); interviewers ask what ACID stands for when discussing `@Transactional`
- `@Transactional` connection — Spring Boot wraps the method in `BEGIN` / `COMMIT` and automatically issues `ROLLBACK` on an unchecked exception; interviewers ask "what happens if the second save fails inside a `@Transactional` method?"
- `SAVEPOINT` — a named checkpoint inside a transaction; `ROLLBACK TO name` undoes only the work since that checkpoint; used internally by Hibernate; good to know it exists without needing to write it yourself

---

### Window functions

- `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` — assigns a unique sequential number to each row within a partition; used to get "the latest time entry per user" by filtering `WHERE row_num = 1` in an outer query; a very common interview pattern
- `RANK()` vs `ROW_NUMBER()` — `RANK()` gives tied rows the same number and skips the next (1, 1, 3); `ROW_NUMBER()` always gives a unique number regardless of ties (1, 2, 3); when you need exactly one row per group, use `ROW_NUMBER()`
- `LAG()` and `LEAD()` — access the previous or next row's value without a self-join; `LAG(hours)` returns the value from the previous row in the partition; used to compare consecutive time entries
- `SUM() OVER (PARTITION BY ...)` — running total within a group without collapsing rows; unlike `GROUP BY`, it keeps every row and adds a cumulative column alongside the existing data

---

### Schema design

- Primary key — uniquely identifies each row; `SERIAL` or `BIGSERIAL` in PostgreSQL; every table needs exactly one; interviewers ask "what is the primary key of your `time_entries` table?"
- Foreign key — a column that references the primary key of another table; PostgreSQL rejects an `INSERT` if the referenced row does not exist; this guarantee is called referential integrity
- `ON DELETE` behavior — `RESTRICT` (default) rejects the delete if dependent rows exist; `CASCADE` deletes dependent rows automatically; `SET NULL` sets the foreign key to `NULL`; interviewers ask "what happens if you delete a user who has time entries?"
- `NOT NULL` constraint — the column must always have a value; used on required fields like `email`, `password`, `status`; interviewers ask why you chose to add it
- `UNIQUE` constraint — no two rows can have the same value in that column; used on `email` to prevent duplicate accounts; automatically creates an index in PostgreSQL
- `CHECK` constraint — validates a condition on insert or update; `CHECK (hours > 0 AND hours <= 24)` rejects invalid data at the database level, not just the application level
- Relationship types — one-to-many (1:N) is the most common; the foreign key always goes on the "many" side; many-to-many (N:M) needs a junction table (e.g. `order_items` linking `orders` and `books`)
- Normalization concept — storing `project_id` instead of copying `project_name` avoids duplication; changing the project name requires only one `UPDATE` in one place; interviewers ask "what problem does normalization solve?"
- Reading a schema out loud — describing the TimeTrack data model: "three tables; `users` and `projects` are independent; `time_entries` links to both via foreign keys"; interviewers ask "explain your database structure"

---

### Data types

- `VARCHAR(n)` vs `TEXT` — both have identical storage performance in PostgreSQL; `VARCHAR(n)` documents an intended maximum length; `TEXT` is for content with no meaningful upper limit; the practical difference is intent, not performance
- `INT` vs `SERIAL` vs `BIGSERIAL` — `INT` is a plain integer; `SERIAL` is an auto-incrementing integer used for primary keys; `BIGSERIAL` handles very large tables; interviewers from MySQL ask "what is the equivalent of `AUTO_INCREMENT`?"
- `NUMERIC(p,s)` vs `FLOAT` — `FLOAT` is an approximation that compounds rounding errors over time; `NUMERIC(10,2)` stores exact decimals; always use `NUMERIC` for prices and financial values; interviewers ask "why would you not use `FLOAT` for money?"
- `TIMESTAMP` vs `TIMESTAMPTZ` — `TIMESTAMP` stores the date and time exactly as entered, ignoring time zones; `TIMESTAMPTZ` converts to UTC on write and back to the session time zone on read; always use `TIMESTAMPTZ` for `created_at` in a web application
- `BOOLEAN` — stores `true` or `false`; PostgreSQL accepts `true`, `'t'`, `'yes'`, `1` as input — always write `true` / `false` for readability; used for flags like `is_active`

---

### PostgreSQL specifics

- `::` cast operator — `created_at::date` converts a timestamp to a date; `'5'::int` converts a string to an integer; shorter PostgreSQL syntax for standard SQL `CAST(value AS type)`; used constantly in `WHERE` and `JOIN` conditions involving dates
- `ILIKE` — case-insensitive pattern matching; not available in MySQL or SQL Server; interviewers switching from MySQL ask why `LIKE` is not finding results they expect
- `DISTINCT ON` — keeps one row per group while returning multiple columns; not available in standard SQL; the column in `DISTINCT ON (...)` must be leftmost in `ORDER BY`
- `RETURNING` — `INSERT`, `UPDATE`, and `DELETE` can return the affected rows in a single statement; avoids a second `SELECT`; not standard SQL
- `DATE_TRUNC('month', date)` — truncates a timestamp to the start of the month; used to `GROUP BY` month in reports; `DATE_TRUNC('year', ...)` works the same way for yearly grouping
- `NOW()` vs `CURRENT_DATE` — `NOW()` returns the current timestamp including time; `CURRENT_DATE` returns today's date with no time; used in date range filters and default column values
- `INTERVAL` — `NOW() - INTERVAL '30 days'` filters recent data; used in `WHERE` clauses and CTEs for relative date ranges; `INTERVAL '1 month'` works with months and years
- `STRING_AGG(column, separator)` — concatenates values from multiple rows into one string per group, e.g. `STRING_AGG(name, ', ')` to list all project names for a user on one line; PostgreSQL-specific; interviewers ask how you would turn grouped rows into a single comma-separated column for a report

---

### Performance basics

- What an index is — a sorted data structure that speeds up reads on a column at the cost of slower writes; primary keys and `UNIQUE` columns are indexed automatically; foreign key columns used in JOINs benefit most from a manual index
- When to add an index — columns frequently used in `WHERE`, `JOIN ON`, or `ORDER BY` on large tables; when you see a `Seq Scan` on a large table in `EXPLAIN` output
- When NOT to index — small tables, columns with very few distinct values (a `status` column with three options gains little), and columns that are updated very frequently
- `EXPLAIN` — shows the query plan and whether an index is being used; `Seq Scan` means every row is read; `Index Scan` means the index was used; run this when a query is slow before adding an index

---

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

- `HEAD` pointer — marks your current position in the history; always points to the tip of the current branch; you see it in `git log` and error messages — understanding it is required to read them correctly
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
- `git reflog` — records every position HEAD has been at, including after `git reset --hard`; keeps data for 90 days; the recovery tool when you think you lost commits with a hard reset

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
- Idempotency — a request is idempotent if calling it multiple times leaves the system in the same state; `GET`, `PUT`, `DELETE` are idempotent; `POST` is not; interviewers use this to test whether you know REST semantics beyond CRUD names
- Headers — `Authorization: Bearer <token>` carries the JWT; `Content-Type: application/json` tells the server the body format; `Accept` specifies the expected response format; interviewers ask which header is used for authentication and what happens if you omit `Content-Type`
- Path parameters vs query parameters vs request body — path params identify which resource (`/users/5`); query params filter or configure (`?status=active`); the body carries data to create or update; interviewers ask you to choose the right placement for a given field
- HTTPS vs HTTP — TLS encrypts the connection so headers and body (including the JWT) cannot be read in transit; required for any API that handles passwords or tokens; interviewers ask why you would never send a password over plain HTTP
- Request/response lifecycle — Angular component → HTTP interceptor → browser → Spring Security filter chain → controller → service → repository → response travels back; interviewers ask you to trace a login request end-to-end to test architectural understanding

### HTTP status codes

- 2xx success codes — `200 OK` for a successful read or update, `201 Created` after a POST that creates a resource, `204 No Content` after a DELETE (success but no body); interviewers ask which to use after each HTTP method and why 201 is not the default for every POST
- `400 Bad Request` — the payload is invalid or fails validation; returned by Spring Boot automatically when `@Valid` fails; shows you understand the difference between a client error and a server error
- `401 Unauthorized` vs `403 Forbidden` — 401 means unauthenticated (no token or invalid token); 403 means authenticated but not allowed (wrong role); the most common confusable pair in security discussions
- `401` vs `403` in Spring Security — Spring Security returns 403 for both unauthenticated and unauthorised requests by default; a custom `AuthenticationEntryPoint` is required to correctly return 401 for missing or invalid tokens; this gotcha is asked in technical interviews
- `404 Not Found` vs `409 Conflict` — 404 when the resource does not exist; 409 when the action conflicts with existing data (duplicate email, name already taken); shows semantic awareness beyond just 400 and 500
- `500 Internal Server Error` — an unhandled exception reached the framework; if the API returns 500, something was not caught by `@ControllerAdvice`; interviewers ask what you would do to prevent it

### JSON and serialization

- JSON data types — objects `{}`, arrays `[]`, strings, numbers, booleans, null; keys must be double-quoted strings; no trailing commas; tested when debugging a `400` caused by malformed JSON
- Jackson — Spring Boot uses Jackson automatically to convert between JSON and Java objects; `@RestController` triggers automatic serialization without any configuration; interviewers ask how Spring Boot "knows" to return JSON
- `@JsonProperty` — maps a JSON key to a Java field with a different name; necessary when the API contract uses snake_case (`user_name`) but the Java class uses camelCase (`userName`)
- `JSON.parse()` vs `JSON.stringify()` — `stringify` converts a JavaScript object to a JSON string; `parse` converts it back; only needed for `localStorage`, never for `HttpClient` calls (Angular handles JSON automatically); confusing them leads to storing `[object Object]` in localStorage

### Error handling

- `catchError` in Angular services — intercepts HTTP errors in the Observable stream before they reach the component; returns a safe fallback value (empty array, null) so the app keeps running; tested in every Angular service review
- HTTP interceptor for global errors — the right place to handle 401 (expired token → redirect to login) and network failures; one interceptor replaces `catchError` in every service for these global concerns
- `catchError` in service vs interceptor — service-level handles specific, local failures; interceptor handles global concerns (token expiry, network outage); interviewers ask which approach you would use for a given scenario and why
- `@ControllerAdvice` + `@ExceptionHandler` — maps custom exceptions to HTTP status codes in one class; the Spring Boot equivalent of Angular's error interceptor; without it, every unhandled exception returns a generic 500 with no useful message for the client
- Error propagation — throw errors upward and handle them once at the outermost layer; never swallow an exception silently without at least logging it; catching and re-throwing without adding information hides the root cause

### Software testing

- Unit test — tests one class or method in isolation with all dependencies mocked; no database, no HTTP, no Spring context; runs in milliseconds; the base of the testing pyramid
- Integration test — tests multiple real components working together; the Spring context starts and the real database is used; slower than unit tests; written with `@SpringBootTest` in Spring Boot
- End-to-end (E2E) test — tests the full user flow through a real browser; the slowest and the fewest; covers only the most critical user journeys
- Testing pyramid — more unit tests than integration, more integration than E2E; interviewers ask the ratio and why (unit tests are cheap and fast; E2E tests are expensive and slow; the pyramid shape reflects the right investment)
- Mock vs stub — a mock is a fake dependency you can configure and verify (check how it was called afterwards); a stub just returns a fixed value with no verification; in practice "mock" is used for both; Mockito handles both in Java
- JUnit 5 + Mockito — the standard tools for Spring Boot unit tests; interviewers expect you to explain how to write `when(...).thenReturn(...)` and `verify(...)` in a service test without touching the database
- Jasmine + TestBed — the standard tools for Angular service tests and component tests; `TestBed` creates a minimal Angular module for testing without a real browser

### Browser storage

- `localStorage` — persists after the tab closes; used for JWT tokens in Angular projects; accessible from JavaScript, which makes it vulnerable to XSS token theft
- `sessionStorage` — cleared when the tab closes; not shared between tabs; same API as `localStorage`; used for temporary state that should not survive a browser restart
- Cookies — sent automatically with every HTTP request to the matching domain; `HttpOnly` flag prevents JavaScript from reading them; `Secure` restricts them to HTTPS; `SameSite=Strict` prevents CSRF
- `localStorage` vs `HttpOnly` cookie for JWT — the production tradeoff; localStorage is simple but XSS can steal the token; HttpOnly cookies are XSS-safe but require CSRF protection and `withCredentials: true` in Angular; interviewers ask which you would choose in production and why

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
- JWT structure — header and payload are Base64-encoded JSON separated by dots; the third part is a cryptographic signature; paste any JWT on jwt.io to read the header and payload directly; only the signature provides security
- `btoa()` / `atob()` — the browser functions for encoding and decoding Base64 strings; `Decoders.BASE64.decode()` is the JJWT equivalent in Spring Boot for converting the Base64 signing key to bytes

### Logging

- Why not `System.out.println()` / `console.log()` for debugging production code — print statements cannot be turned off, are not timestamped, and are lost once the terminal closes; interviewers ask "how would you debug an issue in a deployed app without a debugger attached?" — logs are the expected answer
- Log levels — `DEBUG` (detailed, dev only), `INFO` (normal events, e.g. "user logged in"), `WARN` (something unexpected but recoverable), `ERROR` (something failed); interviewers ask what level you would use for a caught exception that the app recovered from (`WARN`, not `ERROR`, if the request still succeeded)
- Logs vs exceptions in error handling — an exception interrupts the current operation and must be handled or propagated; a log is a side note that does not change control flow; interviewers ask why you would still log an exception even after it is already handled by `@RestControllerAdvice` (loses the stack trace otherwise — the client only sees a clean message, but the server needs the detail to debug)

### SOLID

- Single Responsibility — one class, one reason to change; controller handles HTTP, service handles rules, repository handles data; interviewers ask you to name this principle when they show a "fat controller" that mixes HTTP and business logic
- Dependency Inversion — inject dependencies instead of creating them with `new`; what Angular's `inject()` and Spring Boot's constructor injection implement; tested by asking "how would you write a unit test for this without touching the database?"
- Open/Closed — extend without modifying existing code; add a new feature by adding new code, not by changing what already works; shows you understand why stable, tested code should not be reopened unnecessarily
- Liskov Substitution — a subtype must behave correctly wherever its parent is expected; violations cause hard-to-trace bugs in class hierarchies; prefer composition over inheritance when this guarantee is hard to maintain
- Interface Segregation — prefer small specific interfaces over one large one; a class should only be required to implement methods it actually uses

### Code principles

- DRY — extract shared logic into a service or utility instead of repeating it; interviewers ask "what would you do if you saw the same code in three places?" — the answer is extract, not copy
- KISS — the simplest solution that works is the right one; complexity is a cost that must be justified; interviewers probe this when they see overcomplicated junior code or bloated AI-generated boilerplate
- YAGNI — do not build features for hypothetical future requirements; adding pagination before it is needed, or building a plugin system for a feature with one implementation, are the classic examples; common in AI-generated code
