# Learning Progress

**Goal:** Junior / junior-mid developer role (Angular + Java) — Spain, August 2026
**Background:** React, Node.js, Express, TypeScript, Tailwind, CSS, HTML, JavaScript

---

## Projects

| # | Project | Key concepts | Status | Live |
|---|---------|--------------|--------|------|
| 01 | To-do list | Components, routing, binding, directives, services | Done ✓ | [Live demo](https://01angulartodolist.netlify.app/) |
| 02 | Weather app | HTTP Client, forkJoin, signals, computed, ngOnInit, pipes, CSS animations | Done ✓ | [Live demo](https://02angularweatherapp.netlify.app/) |
| 03 | Expense tracker | Reactive forms, routing, localStorage, signals, form validation | Done ✓ | [Live demo](https://03angularexpensetracker.netlify.app/) |
| 04 | Meal finder | Route parameters, ActivatedRoute, effect(), computed(), localStorage, favourites | Done ✓ | [Live demo](https://04mealfinder.netlify.app/) |
| 05 | Task manager | Angular Material, MatTable, MatDialog, CRUD, coordinator pattern, context-specific themes | Done ✓ | — |
| 06 | HR portal | Route guards, lazy loading, HTTP interceptors, role-based access, MatSidenav, role-aware dashboard | Done ✓ | — |
| 07 | TimeTrack | Spring Boot REST API, JWT, PostgreSQL, Angular full stack, TimeEntry workflow | In progress ⏳ | — |

---

### Project 01 — To-do list
**New concepts:** `@Component`, `input()`, `output()`, `@for`, `@if`, `@empty`, `@Injectable`, `inject()`, `signal()`, `signal.set()`, `signal.update()`, `computed()`, `[class.x]` binding, union types (`type`) · CSS: variables (`--color`, `var()`), flexbox basics, `:hover`, `:focus`, `border-radius`, `opacity`

### Project 02 — Weather app
**New concepts:** `HttpClient`, `subscribe`, `forkJoin`, `ngOnInit`, `takeUntilDestroyed`, `DestroyRef`, `number` pipe, `SlicePipe`, environment files · CSS: `@keyframes`, `animation`, CSS spinner (`border-top-color` + `rotate` + `border-radius: 50%`), `transition`, `transform: scale()`

### Project 03 — Expense tracker
**New concepts:** `FormGroup`, `FormControl`, `Validators.required`, `Validators.min()`, `markAllAsTouched()`, `form.reset()`, `routerLink`, `RouterOutlet`, `Router.navigate()`, `Omit<T, K>`, smart/dumb component pattern · CSS: `position: absolute/relative`, `@media (min-width)`, mobile-first

### Project 04 — Meal finder
**New concepts:** route params (`path: 'detail/:id'`), `ActivatedRoute`, `effect()`, `localStorage + effect()` pattern, `event.stopPropagation()`, `Array.some()`, `[...new Set()]`, `?.` optional chaining, `(input)` event, `(keyup.enter)`, `@else if`, `hasSearched` / `hasLoad` signal patterns · CSS: `overflow: hidden`, overlay with `position: absolute + top/right`, transition on base (not `:hover`), `display: inline-block` on `<a>`

### Project 05 — Task manager
**New concepts:** `mat.theme()`, `--mat-sys-*` design tokens, `MatTableModule`, `MatDialog.open()`, `afterClosed()`, `MAT_DIALOG_DATA`, `MatDialogRef.close()`, `patchValue()`, `NgClass`, coordinator pattern, `MatTableDataSource`, `MatSort`, `mat-sort-header`, `@ViewChild`, `ngAfterViewInit`, `ErrorStateMatcher`, confirmation dialog pattern, `autoFocus: false`, `DatePipe` · CSS: CSS grid (`grid-template-columns`, `gap`, `grid-column: 1 / -1`), `table-layout: fixed`, `.mat-column-*`, `border-radius: 9999px`, `text-transform: capitalize`

### Project 06 — HR portal
**New concepts:** `CanActivateFn`, `CanDeactivateFn`, `loadComponent` (lazy loading), `HttpInterceptorFn`, `req.clone({ setHeaders })`, `withInterceptors()`, `canActivate` stacking, auth persistence with `signal + effect`, `??` nullish coalescing, dual-mode dialog, `markAsPristine()`, `MatToolbar`, `MatSidenav`, `routerLinkActive`, `filteredNavLinks = computed()`, role-aware dashboard, signal reference vs snapshot · CSS: app shell scroll pattern (`overflow: hidden` on `app-root`), active link flash fix (`::before` + `:not(:hover)`), responsive breakpoints (`@media max-width`)

### Project 07 — TimeTrack (in progress — Steps 1–6 done, Step 7 next)
**New concepts:** Spring Boot setup, `@Entity`, JPA annotations, `JpaRepository`, custom repository methods, `Optional<T>`, `@Service`, layered architecture, `@RestController`, DTOs, `@Valid`, `ResponseEntity`, `@PathVariable`, `@RequestBody`, soft delete, JWT structure, `UserDetailsService`, `SecurityFilterChain`, `JwtFilter`, `BCryptPasswordEncoder`, `@PreAuthorize`, `@RestControllerAdvice`, `Role` enum, `@ColumnDefault`, `data.sql` seeding, `DataIntegrityViolationException` handling, `@ManyToOne` relationships, state machine workflow (DRAFT→SUBMITTED→APPROVED/REJECTED), PATCH for state transitions, role-based data filtering, Bean Validation across all request DTOs, hard delete vs soft delete · Full detail → Spring Boot section below

---

## Angular

### Core concepts
- Components: `@Component`, selector, template, styles
- Routing: define routes in `app.routes.ts`
- Data binding: interpolation, property binding, event binding, class binding
- Directives: `@if`, `@for`, `@empty`
- Inputs: `input()` signal-based
- Outputs: `output()` signal-based
- Template reference variables: `#ref`
- Services: `@Injectable`
- Dependency injection: `inject()`

### Signals
- `signal()`, `signal.set()`, `signal.update()`, `computed()`
- `effect()` — runs a side effect automatically when a tracked signal changes
- `effect()` must be created inside a constructor or injection context
- `localStorage + effect()` pattern — init signal from localStorage, then use effect() to keep it in sync

### HTTP and RxJS
- `HttpClient` — call external APIs
- `subscribe` — handle Observable responses
- `forkJoin` — run multiple HTTP requests in parallel
- Environment files — store API keys safely
- `takeUntilDestroyed` — cancel HTTP subscriptions automatically when a component is destroyed
- `DestroyRef` — Angular token injected to notify observables when the component lifecycle ends

### Angular Material
- `ng add @angular/material` — install and configure the library
- `MatButtonModule` — `matButton`, `matIconButton`, `matFab` variants
- `MatSelectModule` + `MatFormFieldModule` — styled dropdowns with `mat-form-field`, `mat-select`, `mat-option`
- `MatTableModule` — `mat-table`, `matColumnDef`, `*matCellDef`, `*matHeaderCellDef`, `displayedColumns`
- Multi-filter pattern with `computed()` — `'all'` value + `||` short-circuit trick
- `MatDialogModule` + `MatDialog` service — open a modal dialog with `dialog.open(Component, config)`
- `MatDialogRef` — injected inside the dialog to close it and return data with `dialogRef.close(data)`
- Dialog data flow pattern — `dialogRef.close(data)` inside dialog + `afterClosed().subscribe()` in the parent
- `input()` / `output()` for parent-child communication — child emits events, parent handles them
- Component coordinator pattern — the page handles all logic, child components only display and emit
- `MAT_DIALOG_DATA` — inject data passed from the parent into the dialog component
- `inject<T | undefined>(MAT_DIALOG_DATA)` — typed, optional dialog data injection; resolves to `undefined` when the dialog opens with no data (drives add vs edit mode)
- `*matNoDataRow` — shows an empty-state row when the table has no data
- `mat-error` — shows a validation error inside `mat-form-field` with Material styling
- Context-specific themes — scope `mat.theme()` to a CSS class to apply a different palette to one component (e.g. `.btn-danger`)
- `mat.$red-palette` and other prebuilt palettes — use inside a scoped `mat.theme()` for color variants
- `--mat-sys-*` CSS variables — Material 3 design tokens (color, surface, typography); read or override them to customise the theme without fighting component internals
- `MatTableDataSource` — wrapper around an array that handles sorting, filtering and pagination automatically
- `MatSort` + `MatSortModule` + `mat-sort-header` — sortable column headers; `mat-sort-header` goes on `<th>`, not `ng-container`
- Confirmation dialog pattern — separate component that returns `true` on confirm; used before destructive actions
- `autoFocus: false` — disables automatic focus on the first button when a dialog opens
- `ErrorStateMatcher` — interface that controls when `mat-error` appears; use `[errorStateMatcher]` to apply per field
- Angular view encapsulation — component CSS only applies to that component's own template; Material directive internals (like `mat-sort-header-container`) need global `styles.css`
- `justify-content: center` on `.mat-sort-header-container` — centers sort header text; must go in `styles.css`
- `computed()` for derived statistics — `tasks().filter(t => t.status === 'x').length` gives a live count
- `input<boolean>()` — pass context from parent to child to change behaviour (e.g. contextual empty state message)
- `output<void>()` — use when the event itself is the signal and no data needs to be passed; the parent just reacts
- `subscriptSizing="dynamic"` on `mat-form-field` — removes the reserved space for hints/errors; use when mixing form fields and buttons in a flex row
- `visibility: hidden` vs `display: none` — `hidden` hides the element but keeps its space; use to avoid layout jumps when content appears/disappears
- `role="button"` + `tabindex="0"` — make a non-button element keyboard accessible; always pair with `(keydown.enter)` so Enter activates it
- `hasActiveFilters` computed pattern — `computed(() => signalA() !== 'default' || signalB() !== 'default')` returns a boolean directly without `if`
- Clear all filters pattern — child emits `output<void>()`, parent resets all filter signals; child only shows the button via `[class]` binding and `visibility`
- `MatPaginator` + `MatPaginatorModule` — add pagination to a Material table; connect with `@ViewChild(MatPaginator)` in `ngAfterViewInit`; place `<mat-paginator>` outside and after `</table>`
- `MatDatepicker` — calendar date picker; needs `MatDatepickerModule` + `provideNativeDateAdapter()` in `app.config.ts`; bind with `[matDatepicker]="ref"` on the input and `<mat-datepicker #ref>` separately; form value comes out as a `Date` object so cast with `as unknown as Date` before calling date methods
- Conditional `displayColumns` with `computed()` — instead of hiding columns with `@if`, change the `displayedColumns` array based on role; `@if` on `ng-container matColumnDef` breaks Material because the column definition is never registered
- `MatSnackBar` — inject as a service (no `imports` array needed); call `snackBar.open(message, 'Close', { duration: 3000 })` from the page coordinator after a service call; only one snackbar shows at a time
- `MatStepper` + `MatStepperModule` — split a form into steps with `[linear]="true"` and `[stepControl]="formGroup"` per step; use `stepper.next()` / `stepper.previous()` for navigation from outside the step; validate manually before calling `stepper.next()` — it does not check `[stepControl]` automatically; `stepper.selectedIndex` to show different buttons per step; `FormBuilder.group({ field: ['default', validators] })` shorthand for creating form groups
- `MatToolbar` + `MatToolbarModule` — persistent app shell header; `justify-content: space-between` on the toolbar to push title left and actions right; wrap in `@if (signal())` to show only when the user is logged in; use the signal directly (not a method) so the template updates reactively
- `MatSidenav` app shell layout — `mat-sidenav-container` + `mat-sidenav` (mode="side") + `mat-sidenav-content`; toolbar outside the container spans full width; `[opened]="!!signal()"` to show/hide the sidebar reactively
- `routerLinkActive="active"` — adds a CSS class when the route matches; can be combined with `#rla="routerLinkActive"` and `[activated]="rla.isActive"` on the same element
- `filteredNavLinks = computed()` — filter nav links by role using an `adminOnly` flag on each link object; computed in the root component so every part of the app stays in sync
- Role-aware UI — `isAdmin = computed(() => currentUser()?.role === 'admin')`; use `@if (isAdmin())` / `@if (!isAdmin())` to show completely different content per role
- Signal reference vs snapshot — `service.signal` (no `()`) stores the signal and stays reactive; `service.signal()` (with `()`) stores the value at that moment and never updates; always store the signal reference in a class property
- `computed()` for reactive values — if a value depends on a signal (e.g. user role), wrap it in `computed()` instead of calling a method once; otherwise it will never update

### Lifecycle hooks
- `ngOnInit` — run logic when the component loads
- `ngAfterViewInit` — runs after the template is built; the earliest safe moment to use `@ViewChild` references

### Pipes
- `number` with format `'1.0-1'`
- `SlicePipe` — cut strings in templates
- `DatePipe` — `date` pipe formats a date string or object (e.g. `task.createdAt | date` → `Apr 25, 2024`)

### Reactive Forms
- `FormGroup` — group multiple form controls into one object
- `FormControl` — one field with initial value and validators
- `Validators.required` — built-in validation
- `Validators.min(n)` — minimum value validation for number fields
- `ReactiveFormsModule` — import to use reactive forms in a component
- `[formGroup]` — bind template form to TypeScript object
- `formControlName` — bind each input to its FormControl
- `(ngSubmit)` — handle form submission
- `form.valid` — check if all validators pass
- `form.value` — read all field values as an object
- `form.reset()` — reset all fields to their initial values
- `form.markAllAsTouched()` — mark all fields as touched to trigger error messages
- `control.hasError('required')` — check if a specific error exists on a control
- `control.touched` — true after the user has interacted with the field
- TypeScript `as Type` — type assertion when you know more than the compiler
- `event.stopPropagation()` — prevents a click from bubbling up to a parent element (e.g. button inside a routerLink)
- `Array.some()` — returns true if at least one element matches the condition
- `[...new Set(array.map(fn))]` — get unique values from an array (JavaScript `Set` removes duplicates automatically)
- `?.` optional chaining — safely access a property that might be null or undefined
- `(input)` event — fires on every keystroke, used to track input value reactively
- `[disabled]` binding — disable a button reactively based on a signal
- `FormControl<number | null>` — explicit generic typing for nullable controls
- Getter methods for form controls — clean way to access controls in the template
- `form.patchValue(obj)` — fill one or more fields with existing values, ignores missing fields (used for edit forms)
- `form.dirty` — `true` when the user has changed any field; use before closing a form to warn about unsaved changes
- `control.setErrors({ customKey: true })` — set a custom error on a form control; marks it invalid so `mat-error` shows; clears automatically when the user types and validators re-run
- `hasError('customKey')` — works with custom keys exactly like built-in ones; key is case-sensitive
- Two ways to access a `FormControl` in the template: `get name() { return this.form.get('name'); }` (getter, cleaner for multiple uses) or `form.controls.name` (direct, no extra code needed)
- `setErrors()` vs signal — field error → `setErrors()` + `mat-error`; general form error (login failure, API error) → `signal<string | null>`
- Duplicate check pattern — add `nameExists(name, excludeId?)` to the service; call it in `onSubmit()` before saving; if duplicate → `setErrors()` + `return`; `excludeId` skips the current item in edit mode

### Routing
- `routerLink` — navigate between pages declaratively in the template
- `RouterOutlet` — where Angular renders the active page component
- `Router` service — programmatic navigation with `router.navigate()`
- Route parameters — `path: 'detail/:id'` syntax to define dynamic segments
- Route params vs query params — params for identity (`/meal/123`), query for filters (`?page=2`)
- `ActivatedRoute` — read route parameters inside a component with `snapshot.paramMap.get('id')`
- `Location.back()` — navigate to the previous page in the browser history; from `@angular/common`; use instead of hardcoded `routerLink` when a page can be reached from multiple places
- Default route — `{ path: '', redirectTo: 'login', pathMatch: 'full' }` redirects from `/` to a specific page
- `pathMatch: 'full'` — required on empty path `''` because Angular matches by prefix; without it, `''` would match every URL
- Wildcard route — `{ path: '**', redirectTo: 'login' }` catches any unknown URL; must always be last in the array
- Route guards — `CanActivateFn` is a plain function (no class) that runs before a route loads; return `true` to allow, `router.createUrlTree(['/path'])` to redirect
- `canActivate: [guardFn]` — apply a guard to a route in `app.routes.ts`
- `CanDeactivateFn<Component>` — guard that runs before leaving a route; receives the component instance to check its state
- `canDeactivate: [guardFn]` — apply a deactivate guard to a route in `app.routes.ts`
- Returning an Observable from a guard — Angular subscribes internally and waits for the value; do not use `.subscribe()` inside a guard
- `markAsPristine()` — reset form dirty state programmatically; call before `router.navigate()` on successful save so `CanDeactivate` does not interrupt the navigation
- `patchValue()` does not mark a form as dirty — only user interaction does
- Query params — `[queryParams]="{ key: 'value' }"` with `routerLink` to pre-apply a filter on navigation; read in the target component with `ActivatedRoute.snapshot.queryParamMap.get('key')` in `ngOnInit`
- Route params vs query params in practice — route params are part of the path (`/employees/:id`); query params are optional extras (`/employees?status=active`); use `paramMap` for one, `queryParamMap` for the other

### Data persistence
- `localStorage.setItem` — save data as a JSON string
- `localStorage.getItem` — read data back as a string
- `JSON.stringify` — convert object to string for storage
- `JSON.parse` — convert string back to object

### TypeScript utility types
- `Omit<T, K>` — create a new type from an existing one, removing specific keys
- `??` (nullish coalescing) — use right side if left side is `null` or `undefined`
- `!` (non-null assertion) — tells TypeScript the value is not null, use when you are sure
- Optional fields with `?` — `description?: string` makes a field optional in an interface (no value required)
- Union types — `type Status = 'active' | 'done'` restricts a value to a fixed set of string literals

### Architecture patterns applied
- Smart/dumb component pattern — page fetches data, components display it
- Shared utility functions — DRY across components
- Single Responsibility — one component, one job
- Shared models in `src/app/models/` — used across multiple pages
- Shared services in `src/app/services/` — singleton, shared state
- Core/Feature/Shared architecture — `core/` for guards/interceptors/services (one instance, whole app), `pages/` for feature areas, `shared/` for reusable components; standard in enterprise Angular projects

---

## CSS

- Box model: margin, padding, border
- Display: block, inline, inline-block
- Flexbox: `display: flex`, `justify-content`, `align-items`, `flex-direction`, `gap`
- Pseudo-classes: `:hover`, `:focus`, `:last-child`
- CSS variables: `--color`, `var()`
- CSS animations: `@keyframes`, `animation` property
- CSS spinner: `border-top-color` + `rotate` + `border-radius: 50%`
- Properties: `text-decoration`, `opacity`, `box-shadow`, `text-transform`
- CSS grid: `display: grid`, `grid-template-columns`, `gap` — two-column layouts (e.g. dialog forms)
- `grid-column: 1 / -1` — span a grid item across all columns
- `table-layout: fixed` — makes all table columns the same width
- `.mat-column-*` — auto-generated Angular Material class per column; use for per-column width or alignment
- `align-items: center` on `flex-direction: column` — centers children **horizontally** (cross-axis)
- `td.class` vs `.class td` — `td.class` targets a `<td>` that has the class; `.class td` targets a `<td>` inside an element with the class
- `position: relative` + `position: absolute` — remove an element from flex flow so it does not affect sibling alignment
- App shell scroll pattern — `html, body { height: 100% }` + `app-root { overflow: hidden }` + `mat-sidenav-container { flex: 1; min-height: 0 }` — toolbar and sidebar stay fixed, only `mat-sidenav-content` scrolls; `overflow: hidden` on `app-root` is the key fix that stops the flex item from growing beyond its allocated height
- Angular Material state layer — `::before` pseudo-element on `mat-list-item`; opacity raised on hover/focus/press; fix active link gray flash: `a.active:focus:not(:hover)::before { opacity: 0 }`
- `:not()` pseudo-class — negates a selector; used to separate conflicting states (e.g. `:focus:not(:hover)` applies only when focused but not hovering)
- Responsive CSS breakpoints — `@media (max-width: 1024px)` to wrap flex rows on tablets; `@media (max-width: 768px)` to stack CSS Grid columns on mobile; use `flex-wrap: wrap` + `min-width` on flex children so they wrap gracefully
- `mat-card-header` with custom flex layout — add a CSS class and set `display: flex; justify-content: space-between; align-items: center` to place a title on the left and a link on the right in the same header row

---

## Deployment

- Netlify — deploy Angular apps from GitHub
- Environment variables — secure API key injection with `set-env.js`
- Build configuration — base directory, build command, publish directory

---

## Spring Boot

### Project 07 — TimeTrack (Step 1 ✓ Step 2 ✓ Step 3 ✓ Step 4 ✓ Step 5 ✓ Step 6 ✓ Step 7 in progress ⏳)

- Spring Boot project setup with Spring Initializr — Spring Web, Spring Data JPA, PostgreSQL Driver, Lombok
- `application.properties` — database connection, JPA settings, environment variable for password
- `@Entity`, `@Table`, `@Id`, `@GeneratedValue` — mapping a Java class to a PostgreSQL table
- `@Column(nullable = false, unique = true)` — adding database constraints on entity fields
- `@CreationTimestamp` — Hibernate sets the timestamp automatically on first save
- Default field values in Java — `private Boolean active = true`
- Lombok — `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` — eliminates boilerplate getters, setters, and constructors
- `JpaRepository<Entity, IdType>` — built-in CRUD methods (`findAll`, `findById`, `save`, `deleteById`) without writing SQL; only knows about the primary key — custom fields need declared methods
- Custom repository methods — `Optional<User> findByEmail(String email)` — Spring reads the method name and generates `WHERE email = ?` automatically
- `Optional<T>` — wraps a value that might not exist; use `orElseThrow()` instead of returning `null`
- `@Service` — marks a class as a Spring bean containing business logic
- `private final` + constructor injection — recommended pattern over `@Autowired`; dependencies are explicit and the class is easier to test
- `@RestController`, `@RequestMapping`, `@GetMapping` — building a REST endpoint
- Layered architecture — Controller → Service → Repository; each layer only calls the one below it
- Tested `GET /api/users` in the browser — returns `[]` (empty array, no users yet)
- DTOs — `CreateProjectRequest`, `UpdateProjectRequest`, `ProjectResponse` — separate request/response from the entity
- `LoginRequest`, `AuthResponse` — auth-specific DTOs; request DTOs have validation annotations, response DTOs do not
- Request DTO vs Response DTO — validate on the way in (client data is untrusted), trust on the way out (you built it yourself)
- `@NotBlank` — field must not be null, empty `""`, or blank `"   "` — use for text fields
- `@NotNull` — field must not be null, but allows `""` — use for numbers and objects
- `@Positive` — number must be greater than zero
- `spring-boot-starter-validation` dependency — required for `@NotBlank`, `@NotNull`, `@Positive` to work; without it IntelliJ will not suggest them
- `toResponse()` private helper — converts entity to DTO in one place; avoids repeating the mapping in every method
- `ResponseEntity<T>` — wraps the response body with an explicit HTTP status code
- `ResponseEntity.ok(value)` — shortcut for status 200 + body
- `ResponseEntity.status(201).body(value)` — status 201 + body; used on POST (create)
- `ResponseEntity.noContent().build()` — status 204, no body; used on DELETE
- `ResponseEntity<Void>` — correct return type when there is no body; `Void` (uppercase) because `<>` only accepts classes
- `@PathVariable` — reads a dynamic segment from the URL path (`/{id}`); name must match the path variable name
- `@RequestBody` — reads JSON from the request body and converts it to a Java object (via Jackson); used on POST and PUT
- `@PostMapping`, `@PutMapping`, `@DeleteMapping` — HTTP method annotations for create, update, delete
- Full CRUD for Projects tested in Postman — GET all, GET by id, POST, PUT, DELETE all working correctly
- Soft delete pattern — `active = false` instead of removing the row; data is preserved, resource becomes inactive
- `@Column(nullable = false)` on `password` field — database rejects any insert without a value
- `app.jwt.secret` and `app.jwt.expiration` in `application.properties` — custom property names; secret injected from env var `${JWT_SECRET}`
- `@Value("${property.name}")` — injects a value from `application.properties` into a class field at startup
- `@Component` — registers a class as a Spring bean when it is not a controller, service, or repository
- `long` vs `Long` — use the primitive when the value is always present; use the wrapper class when `null` is meaningful
- JWT structure — three Base64-encoded parts: header (algorithm), payload (claims: `sub`, `iat`, `exp`), signature (HMAC of header+payload using the secret)
- `getSigningKey()` pattern — converts a Base64 secret string to a `SecretKey`: `Decoders.BASE64.decode(secret)` → raw bytes → `Keys.hmacShaKeyFor(bytes)` → SecretKey
- `UserDetailsService` — Spring Security interface with one method: `loadUserByUsername()`; you implement it to tell Spring where your users live in the database
- `UserDetails` — Spring Security's internal user representation; has `getUsername()`, `getPassword()`, `getAuthorities()` and three boolean flags; you convert your entity to `UserDetails` in `loadUserByUsername()`
- Spring Security `User` builder — `org.springframework.security.core.userdetails.User.withUsername(...).password(...).roles(...).build()` — creates a `UserDetails` object from your entity fields; `.roles()` adds the `ROLE_` prefix automatically
- Import conflict — Spring Security has its own `User` class; if both are in scope, import your entity and use the full qualified path for the Spring Security builder
- `throws UsernameNotFoundException` in method signature — part of the interface contract; declares that the method is allowed to throw this exception
- `@Configuration` + `@EnableWebSecurity` — marks a class as a Spring Security configuration; replaces Spring Boot's default security setup
- `@EnableMethodSecurity` — enables `@PreAuthorize` on individual methods; without it the annotation is silently ignored
- `@Bean` — exposes a Spring-managed object from a method in a `@Configuration` class; used for third-party classes you cannot annotate directly
- `SecurityFilterChain` — the single bean that configures all security rules: CSRF, sessions, route permissions, filters
- `SessionCreationPolicy.STATELESS` — tells Spring not to create HTTP sessions; required for JWT (the token carries all state)
- CSRF disabled with JWT — CSRF attacks rely on cookies; JWT uses headers, so CSRF protection is not needed
- `PasswordEncoder` / `BCryptPasswordEncoder` — one-way hashing for passwords; `BCryptPasswordEncoder()` uses 10 rounds by default
- `AuthenticationManager` — Spring Security's login coordinator; delegates to `DaoAuthenticationProvider` which calls `UserDetailsService` + `PasswordEncoder`
- `AuthenticationConfiguration` — Spring class that holds the pre-configured `AuthenticationManager`; passed as a method parameter to expose it as a `@Bean`
- `UsernamePasswordAuthenticationToken` (2 params) — unverified data carrier; used to ask Spring to check credentials
- `UsernamePasswordAuthenticationToken` (3 params) — verified authentication object; used to declare a user as already authenticated in `SecurityContextHolder`
- `DaoAuthenticationProvider` — Spring's internal class that runs the full login check; you never write it, Spring wires it with your `UserDetailsService` and `PasswordEncoder`
- `BadCredentialsException` — thrown by Spring Security when email or password is wrong; caught by `GlobalExceptionHandler` and returned as 401
- `SecurityContextHolder` — thread-local storage where `JwtFilter` stores the authenticated user for the current request; controllers read from it to know who is logged in
- `OncePerRequestFilter` — base class for filters that run exactly once per request; extend it to write a custom filter
- `JwtFilter` — reads the `Authorization` header, validates the JWT, sets the user in `SecurityContextHolder`; runs before every controller
- `.requestMatchers("/api/auth/**").permitAll()` — make specific routes public without a token
- `.anyRequest().authenticated()` — require a valid JWT for every other route
- `.addFilterBefore(filter, class)` — insert a custom filter into the chain before Spring's default one
- `CorsConfigurationSource` — configures which origins, methods and headers are allowed across origins; registered inside `SecurityFilterChain` so Spring Security handles it
- `@RestControllerAdvice` — marks a class as a global exception handler for all `@RestController` classes
- `@ExceptionHandler(ExceptionClass.class)` — method that runs when a specific exception is thrown; return a `ResponseEntity` with the right status code
- `Map.of("key", "value")` — creates an immutable map; Spring serializes it to `{ "key": "value" }` JSON automatically
- `@PreAuthorize("hasRole('MANAGER')")` — method-level authorization; checks role after JWT filter has already confirmed who the user is
- Flow 1 tested in Postman — login returns 200 + JWT; wrong password returns 401; empty field returns 400
- Flow 2 tested in Postman — request without token returns 403; request with valid JWT returns 200
- `Role` enum (`EMPLOYEE`, `MANAGER`) — fixed set of valid values instead of a `String`, invalid roles become compile errors
- `@ColumnDefault("true")` — Hibernate annotation that adds a `DEFAULT` to the generated `ALTER TABLE`, so a new `NOT NULL` column can backfill rows that already exist
- `data.sql` — seeds the first manager account on startup; no public registration endpoint exists for managers
- `spring.jpa.defer-datasource-initialization=true` — runs `data.sql` after Hibernate creates/updates the schema instead of before, so `data.sql` never targets a table that does not exist yet
- `spring.sql.init.mode=always` — forces `data.sql` to run against a real database like PostgreSQL; by default Spring Boot only auto-runs it for embedded databases
- `ddl-auto=update` does not reliably retrofit constraints (like `UNIQUE`) onto columns that already existed before the annotation was added — added `ALTER TABLE ... ADD CONSTRAINT` by hand once in pgAdmin
- `nextval('sequence_name')` — pulling the next id from Hibernate's own sequence directly in raw SQL, needed because `data.sql` bypasses Hibernate's own id-generation logic
- `.roles(user.getRole().name())` in `UserDetailsServiceImpl` — derive the Spring Security authority from the entity's real role instead of a hardcoded string
- `@PreAuthorize("hasRole('MANAGER')")` tested end-to-end in Postman — `POST /api/projects` returns 403 with an EMPLOYEE token and 201 with a MANAGER token
- `DataIntegrityViolationException` — Spring's generic wrapper for any database constraint violation; handled in `GlobalExceptionHandler` to return 409 Conflict instead of a raw 500
- `TimeEntry` entity with `@ManyToOne` to `User` and `Project` — two foreign keys on the same entity, both `nullable = false`
- State machine workflow — `EntryStatus` enum (`DRAFT` → `SUBMITTED` → `APPROVED`/`REJECTED`); each transition method checks the current status before changing it
- PATCH with URL suffix for state transitions (`/{id}/submit`, `/{id}/approve`, `/{id}/reject`) — PATCH alone is ambiguous (many possible partial updates), so the suffix names which transition; PUT/POST/DELETE never need a suffix because the verb already says the one thing it can mean
- Comparing entities by id, never by object reference or `.equals()` on the whole object — `timeEntry.getUser().getId().equals(user.getId())`; Lombok's `@Data`-generated `equals()` compares every field, which is unreliable for JPA entities
- `BigDecimal.compareTo()` instead of `.equals()` or `<`/`>` — `.equals()` also compares scale (`"24.0"` ≠ `"24"`), and `<`/`>` don't compile on objects; `compareTo() < 0` / `> 0` compares the actual mathematical value
- `LocalDate.isAfter()` / `isBefore()` instead of `==` or `.equals()` — purpose-built comparison methods; `==` compares references, `.equals()` only tells same/different day, not order
- Role-based data filtering in a service method — reading authorities off `SecurityContextHolder` to branch between `findAll()` (manager) and `findByUser(user)` (employee) in the same `getAll()`
- Bean Validation (`@NotBlank`/`@NotNull`) added across every request DTO (`CreateProjectRequest`, `UpdateProjectRequest`, `CreateTimeEntryRequest`, `RejectRequest`) with `@Valid` on the matching controller params — `MethodArgumentNotValidException` accumulates every failed field in one response, unlike the manual fail-fast business-rule checks
- Hard delete (`deleteById`) vs soft delete (`active = false`) — `TimeEntry` has no `active` field like `Project`/`User`; only DRAFT entries can be deleted, so nothing worth preserving is ever lost
- `PUT /api/entries/{id}` re-runs `create`'s business rules (future date, inactive project, hours range) because PUT replaces the whole resource, not just one field
- Interface projections (`ProjectHoursReportResponse`, `EmployeeHoursReportResponse`) — Spring Data builds a runtime proxy per query result row, no class or manual mapping; requires no `@Data`, only getter signatures
- Alias-to-getter contract — each getter name (minus `get`, first letter lowercased) must match a `SELECT ... AS alias` exactly, or that field silently comes back `null` with no error
- JPQL aggregation with `SUM()` + `GROUP BY` — `GROUP BY te.project.name` splits matching rows into buckets before `SUM()` runs separately inside each one; without it, `SUM()` collapses everything into one total
- `YearMonth` — represents a year+month with no day; binds automatically from `?month=2025-05` because its parsing format matches ISO `yyyy-MM`; `.atDay(1)` / `.atEndOfMonth()` convert it to a `LocalDate` range, done in the service layer (business logic), not the controller
- Repositories are organized by **entity** (fixed by `extends JpaRepository<Entity, Long>`), a different axis than controllers/services which are organized by **feature** — a report query with `FROM TimeEntry` belongs on `TimeEntryRepository`, even though the feature is "reports"
- `MissingServletRequestParameterException` is not a `RuntimeException` (it descends from `ServletException`) — a generic `@ExceptionHandler(RuntimeException.class)` catch-all never sees it; needs its own handler
- Spring Security `/error` gotcha — an unhandled exception resolved via `sendError()` triggers an internal forward to `/error`, which `JwtFilter` skips by default (`OncePerRequestFilter.shouldNotFilterErrorDispatch()`), so `/error` gets rejected as unauthenticated (`401`) unless explicitly excluded from `.anyRequest().authenticated()` — the real fix is catching the exception before `sendError()` ever runs
- `MethodArgumentTypeMismatchException` — thrown when a `@RequestParam` value can't convert to the target type (e.g. `?month=2025-13`); is a `RuntimeException`, so it reaches a generic catch-all, but silently with the wrong status unless given its own handler

---

## SQL

### Querying data
- `SELECT` — retrieve data from a table
- Specific columns vs `SELECT *` — and why `*` is bad in app code
- Expressions in SELECT — concatenation with `||`
- Column aliases — `AS`, double quotes for aliases with spaces
- `SELECT DISTINCT` — remove duplicate rows
- `DISTINCT ON` — keep one row per group (PostgreSQL only)
- `WHERE` — filter rows by a condition
- Comparison operators — `=`, `<>`, `>`, `<`, `>=`, `<=`
- `AND` / `OR` — combine conditions, including NULL truth tables
- `LIKE` / `ILIKE` — pattern matching with `%` and `_`
- `IN` — match a list of values (faster than multiple OR)
- `NOT IN`, `NOT LIKE`, `NOT BETWEEN` — negate operators
- `BETWEEN` — filter a range (inclusive), works with numbers and dates
- `IS NULL` / `IS NOT NULL` — check for missing values
- `ORDER BY` — sort ASC/DESC, multiple columns, expressions, NULLS FIRST/LAST
- `LIMIT` — limit number of rows returned
- `OFFSET` — skip rows, used for pagination
- `FETCH` — SQL standard alternative to LIMIT
- SQL execution order — `FROM → WHERE → SELECT → ORDER BY → LIMIT`
- Cast operator `::` — convert types (e.g. `timestamp::date`)

### Exercises completed

50 total exercises across 2 topics

| Topic | Folder | Exercises | Status |
|-------|--------|-----------|--------|
| basics / SELECT | practice/sql/01-basics.sql | 40 | in progress ⏳ |
| joins | practice/sql/02-joins.sql | 10 | in progress ⏳ |

---

## Simulations

- Angular: 0 completed (0 Pass, 0 Borderline, 0 Fail)
- Spring Boot: 0 completed (0 Pass, 0 Borderline, 0 Fail)
- SQL: 0 completed (0 Pass, 0 Borderline, 0 Fail)
- Total: 0 / 15 minimum target

---

## Complementary skills in practice

- Git workflow: feature branches → PR → merge
- Conventional commits: `feat:`, `fix:`, `style:`, `docs:`, `chore:`
- Debugging: reading browser errors, Network tab, DevTools
- API key security: `.gitignore`, environment files, build-time injection
- Reading API documentation: OpenWeatherMap
- `json-server` — fake REST API from a JSON file; install with `npm i -D json-server`; run with `npx json-server db.json`; default port 3000

---

## Useful resources

- [Official Angular tutorial](https://angular.dev/tutorials/learn-angular)
- [Angular components guide](https://angular.dev/guide/components)
- [Oracle Java tutorials](https://docs.oracle.com/javase/tutorial/)
- [Spring Boot guides](https://spring.io/guides)

