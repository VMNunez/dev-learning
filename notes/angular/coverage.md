# Minimum Coverage — Angular

Every item below must be covered by at least one note file.
An item is covered when a junior can answer an interview question about it using only the notes.

## Components and templates
- [ ] @Component — what it is, selector, template, styles
- [ ] Data binding: property binding `[]`, event binding `()`, two-way `[()]`
- [ ] Signals: `signal()`, `computed()`, `effect()` — modern state, why not just variables
- [ ] `@if` and `@for` block syntax — and why they replaced `*ngIf` / `*ngFor`
- [ ] `ngClass`, `ngStyle` — conditional styling
- [ ] Lifecycle hooks: `ngOnInit`, `ngOnDestroy` — when each fires and why it matters

## Services and dependency injection
- [ ] `@Injectable`, `providedIn: 'root'` — what DI is and why Angular uses it
- [ ] `HttpClient` — GET, POST, PUT, DELETE with a real service example
- [ ] Error handling in HTTP calls: `catchError`, loading/error state pattern

## RxJS
- [ ] `Observable` and `subscribe` — what reactive means and why Angular uses it
- [ ] `pipe` and key operators: `map`, `filter`, `switchMap`, `debounceTime`, `catchError`, `forkJoin`
- [ ] Unsubscribing: memory leaks, `takeUntilDestroyed`, `async` pipe

## Routing
- [ ] `provideRouter`, `routerLink`, `RouterOutlet`
- [ ] `ActivatedRoute` — reading route params and query params
- [ ] Route guards: `CanActivate`, `CanDeactivate`
- [ ] Lazy loading: `loadComponent`, `loadChildren` — why it matters for performance
- [ ] HTTP interceptors — what they do, token injection example

## Reactive forms
- [ ] `FormGroup`, `FormControl`, `FormBuilder`
- [ ] Built-in validators and custom validators
- [ ] Showing validation errors in the template on submit

## Patterns
- [ ] Smart / dumb component pattern — why and when
- [ ] Coordinator pattern — for complex pages with multiple children
- [ ] Standalone components — no NgModule, modern Angular default

## Angular Material
- [ ] `MatTable` with a data source
- [ ] `MatDialog` — open, close, pass data, receive result
- [ ] Form fields with Material error display
- [ ] Custom theming with `mat.theme()` in a scoped stylesheet
