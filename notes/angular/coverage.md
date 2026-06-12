# Minimum Coverage — Angular

Every item below must be covered by at least one note file.
An item is covered when a junior can answer an interview question about it using only the notes.

## Components and templates
- [ ] `@Component` — selector, template, styles, standalone: true
- [ ] Data binding: interpolation `{{ }}`, property `[]`, event `()`, two-way `[()]`
- [ ] `input()` and `output()` — modern signal-based component communication
- [ ] `@if`, `@for`, `@empty`, `@else`, `@else if` block syntax
- [ ] `ngClass`, `ngStyle` — conditional classes and styles
- [ ] Lifecycle hooks: `ngOnInit`, `ngOnDestroy`, `ngAfterViewInit` — when each fires and why
- [ ] `@ViewChild` — accessing a child element or component from the parent class

## Signals — state management
- [ ] `signal()`, `signal.set()`, `signal.update()` — creating and mutating reactive state
- [ ] `computed()` — derived state that updates automatically
- [ ] `effect()` — side effects that run when a signal changes; must be in injection context
- [ ] `effect()` + localStorage pattern — persisting state on every change

## Services and dependency injection
- [ ] `@Injectable({ providedIn: 'root' })` — what DI is, what a singleton service means
- [ ] `inject()` — modern way to inject a service (no constructor needed in Angular 17+)
- [ ] `HttpClient` — GET, POST, PUT, DELETE with typed responses
- [ ] Error handling in HTTP calls: `catchError`, loading/error signal pattern

## RxJS
- [ ] `Observable` and `subscribe` — what reactive programming means, why Angular uses it
- [ ] `pipe` and key operators: `map`, `filter`, `switchMap`, `debounceTime`, `catchError`, `forkJoin`
- [ ] `takeUntilDestroyed` + `DestroyRef` — automatic unsubscription when component is destroyed
- [ ] `async` pipe — subscribing in the template without manual subscribe/unsubscribe
- [ ] Memory leak risk — what happens when you forget to unsubscribe

## Routing
- [ ] `provideRouter`, `routerLink`, `RouterOutlet`, `routerLinkActive`
- [ ] `ActivatedRoute` — `snapshot.paramMap.get()` for route params, `queryParamMap` for query params
- [ ] Route params vs query params — when to use each
- [ ] `CanActivateFn` guard — protecting routes, returning `true` or redirecting
- [ ] `CanDeactivateFn` guard — warning before leaving a page with unsaved changes
- [ ] Lazy loading: `loadComponent`, `loadChildren` — why it reduces initial bundle size
- [ ] `HttpInterceptorFn` — intercepting requests to add auth headers or handle errors globally

## Reactive forms
- [ ] `FormGroup`, `FormControl`, `FormBuilder` — creating forms
- [ ] Built-in validators: `Validators.required`, `Validators.min`, `Validators.email`
- [ ] Custom validators — when built-in validators are not enough
- [ ] `form.markAllAsTouched()` — triggering all errors on submit
- [ ] `form.patchValue()`, `form.reset()`, `form.dirty`
- [ ] `setErrors({ key: true })` — setting custom field errors programmatically
- [ ] Showing validation errors in the template: `hasError()`, `touched`

## Pipes
- [ ] Built-in pipes: `date`, `number`, `currency`, `uppercase`, `slice`
- [ ] Custom pipes: `@Pipe({ name: '...' })`, `transform()` method — when and why to create one

## Patterns
- [ ] Smart / dumb component pattern — what each is responsible for, why the split
- [ ] Coordinator pattern — a smart component that orchestrates multiple dumb children
- [ ] Core / Feature / Shared folder structure — standard in enterprise Angular projects
- [ ] Signal reference vs snapshot — `service.signal` (reactive) vs `service.signal()` (one-time value)

## Angular Material
- [ ] `MatTable` with `MatTableDataSource`, `MatSort`, `MatPaginator`
- [ ] `MatDialog` — open with config, pass data via `MAT_DIALOG_DATA`, receive result with `afterClosed()`
- [ ] Form fields: `mat-form-field`, `mat-error`, `ErrorStateMatcher`
- [ ] `MatSnackBar` — user feedback after actions
- [ ] Custom theming: scoped `mat.theme()` in a component stylesheet

## Legacy code recognition — needed on day one in a consultancy

Consultancies have existing codebases written before Angular 17. You will not write this code but you must be able to read and understand it.

- [ ] `@Input()` and `@Output()` decorators — legacy equivalent of `input()` and `output()`
- [ ] `EventEmitter` — used with `@Output()` to emit values to the parent
- [ ] `NgModule` — `declarations`, `imports`, `exports`, `providers` — how pre-standalone apps are structured
- [ ] `*ngIf` and `*ngFor` — legacy structural directives, equivalent to `@if` and `@for`
- [ ] Zone.js and default change detection — what it means conceptually; why signals and `OnPush` improve it
- [ ] `OnPush` change detection strategy — what it does and why senior devs use it for performance
