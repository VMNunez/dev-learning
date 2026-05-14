# Angular — Interview Questions

## Angular basics

**What is Angular?**
A TypeScript-based frontend framework by Google for building web applications. It includes everything built-in: routing, forms, HTTP client, and a component system — unlike React, which is just a UI library.

**What is the difference between Angular and React?**
Angular is a full framework with opinions on how to structure everything. React is a UI library that lets you choose your own tools for routing, state, and HTTP. In Spanish companies, Angular is more common in large enterprise projects — which is why I chose to focus on it.

**What is a component in Angular?**
The basic building block of the UI. Each component is a TypeScript class with a template (HTML), styles (CSS), and a selector. In Angular 17+, components are standalone by default — they declare their own imports instead of belonging to a module. Components communicate with each other through `input()` and `output()`.

**What is the difference between `@Input()`/`@Output()` decorators and `input()`/`output()` functions?**
`@Input()` and `@Output()` are the classic decorator-based API — you declare properties and Angular maps data to them. `input()` and `output()` are the signal-based API from Angular 17+ — `input()` returns a signal you can use directly in `computed()` and `effect()`. In all my projects I use `input()` and `output()` because they integrate naturally with the signals system and the code is cleaner. Both work — you will see the decorator style in older codebases.

**What is dependency injection in Angular?**
A design pattern where a class receives its dependencies from outside instead of creating them itself. In Angular, you use `inject(ServiceClass)` to get a singleton instance — Angular creates it once and shares it across the whole app.

> **Junior tip:** Don't define it abstractly. Say: "Instead of my component creating a `new EmployeeService()` itself, I call `inject(EmployeeService)` and Angular gives me the same instance that every other component uses. This is how all components share the same data without passing it manually."

**What is a service in Angular?**
A class decorated with `@Injectable` that holds shared logic or state. I use services in all my projects to separate business logic from the component — for example, the `EmployeeService` in the HR portal handles all API calls and the employee list.

---

## Signals and reactivity

**What is a signal in Angular?**
A reactive value that automatically updates the template when it changes. In all my projects I use signals for local state — they are simpler and more predictable than RxJS subjects for UI state.

> **Junior tip:** Don't say "it's like a reactive variable." Say: "When its value changes, Angular automatically updates the template — I don't need to trigger anything manually." Then give a project example like the filtered employee list.

**Why did you use `computed()` for filtered lists instead of calling a filtering method in the template?**
What they really want to know: Do you understand the performance cost of template method calls?
A: A method call in the template re-runs on every change detection cycle — even for events completely unrelated to that data. `computed()` only recalculates when one of its signal dependencies actually changes. In the HR portal, the filtered employee list depends on three signals: search term, status filter, and department filter. `computed()` runs the filter logic only when those signals change, not on every click anywhere in the app.
Red flag answer: "computed() is cleaner." — The interviewer wants the performance reason, not a style preference.

**What is the difference between `signal()` and `computed()`?**
`signal()` holds a value you can set manually. `computed()` derives a value from one or more signals and recalculates automatically when they change. In the HR portal I use `computed()` for the filtered employee list — it updates automatically whenever the filter signals change.

**What is `effect()` and when do you use it?**
A function that runs automatically when any signal it reads changes. The key difference from `computed()` is that `effect()` performs an action — it does not return a value. In the meal finder I use `effect()` to save favourites to `localStorage` every time the list changes — that is a side effect, not a derived value.

**What is the `localStorage + effect()` pattern?**
Initialize a signal from `localStorage` so the data persists across page refreshes, then use `effect()` to save it again every time the signal changes. This keeps `localStorage` in sync automatically without manual save calls.

**Why use signals instead of RxJS subjects for local component state?**
Signals are simpler to read, write, and debug — you do not need to subscribe, unsubscribe, or manage memory. In the HR portal, all filter state (status, department, search text) uses signals — I never wrote a single `unsubscribe()` call for any of them. RxJS is still the right choice for HTTP calls and async streams.

---

## Template syntax

**What does `@if` do in Angular templates?**
Conditionally renders a block of HTML. It replaces the old `*ngIf` directive and is cleaner because it does not require a structural directive on the element — it wraps the block like a standard control flow syntax.

**What does `@for` do and what is `track` for?**
Loops over an array and renders a block for each item. `track` tells Angular how to identify each item — usually `track item.id` — so it can update only the items that changed instead of re-rendering the whole list.

**What is the difference between `[class.active]` and `[ngClass]`?**
`[class.active]="condition"` adds or removes one specific class. `[ngClass]="value"` adds the value as a class name dynamically, which is useful when the class name itself comes from a signal or variable — like status badges in the task manager.

**What is `[disabled]` binding used for?**
It disables a button or input reactively based on a signal or condition. For example, I use it to disable a Submit button while a form is loading so the user cannot submit twice.

**What is a template reference variable and when do you use it?**
A template reference variable (`#ref`) is a local alias that gives you direct access to a DOM element or directive from inside the template. For example, `<input #nameInput>` lets you pass `nameInput.value` to a method. In the HR portal I use `#stepper` to reference the `MatStepper` and call `stepper.next()` from the dialog buttons — because the buttons are outside `<mat-stepper>`, the `matStepperNext` directive cannot find it automatically. The same element can also be accessed in TypeScript with `@ViewChild`.

**When would you use a template reference variable instead of `@ViewChild`?**
Template reference variables are for template-only access — pass a value to a method, call a directive inline in HTML. `@ViewChild` is for TypeScript-level access — run logic in a lifecycle hook, connect a directive to a data source. In the HR portal, `#stepper` lets me call `stepper.next()` directly in the button click handler in the template. If I needed to advance the stepper from inside `ngAfterViewInit` or from a TypeScript method, I would use `@ViewChild(MatStepper)`.

> **Junior tip:** Show you know both and can choose. Key distinction: do you need the reference in HTML only? Use `#ref`. Do you need it in TypeScript too? Use `@ViewChild`.

**What is `[(ngModel)]` and when do you use it?**
Two-way binding — it reads the input value into a variable AND writes it back when the user types. The syntax is called "banana in a box" because of the `[()]` shape. I know the concept, but in my own projects I use signals for search fields — `(input)` bound to a signal does the same job without importing `FormsModule`. For forms with validation I always use reactive forms.

**What is `[ngStyle]` and when do you use it?**
It applies inline styles dynamically: `[ngStyle]="{ 'color': isAdmin ? 'red' : 'black' }"`. For a single property I prefer the shorter `[style.color]="condition ? 'red' : 'black'"`. `[ngStyle]` is useful when you need to apply several dynamic styles at once from an object.

**What is a custom directive and when is it useful?**
A class decorated with `@Directive` that adds behavior to a host element without creating a new component. It is useful when the same DOM behavior needs to be applied to many elements — for example, auto-focusing an input or highlighting on hover. The directive uses `ElementRef` to access the element and `@HostListener` to react to events.

**What is content projection (`ng-content`) and when do you use it?**
`ng-content` lets a parent component inject HTML into a child component's template. The child defines where the content goes with `<ng-content />`, and the parent decides what goes there. You use it for reusable wrapper components — cards, panels, layout containers — where the interior changes depending on who uses the component. For example, a `<app-card>` wrapper that always applies the same border and shadow, but lets the parent control what is displayed inside.

> **Junior tip:** The key idea to communicate: the child controls the WRAPPER, the parent controls the CONTENT. Contrast it with `@Input()`: with `@Input()` you pass data, with `ng-content` you pass entire HTML blocks. If the interviewer asks "have you used it?", be honest — mention it is a pattern you know from reading enterprise codebases and that the HR portal dashboard card headers use a similar layout pattern.

---

## HTTP and observables

**What is `HttpClient` in Angular?**
The built-in service for making HTTP requests. It returns Observables, which you subscribe to in order to get the response. I use it in every project that fetches data from an external API.

**What is an Observable and how is it different from a Promise?**
Both handle async operations, but Observables are more powerful — they can emit multiple values over time, be cancelled, and composed with operators. Promises resolve once and cannot be cancelled. In the weather app I use `forkJoin` to fetch current weather and a 5-day forecast in parallel — with Promises you would need `Promise.all` and lose the ability to cancel if the component is destroyed.

**What is `subscribe()` and when do you unsubscribe?**
`subscribe()` starts the Observable and receives values through `next` and `error` callbacks. You need to unsubscribe when the component is destroyed, otherwise the subscription stays alive and causes memory leaks. I use `takeUntilDestroyed()` to handle this automatically.

**What is `takeUntilDestroyed()`?**
An RxJS operator that automatically cancels a subscription when the component is destroyed. I use it in the weather app and meal finder where HTTP calls happen inside subscriptions — it avoids the manual unsubscribe pattern.

> **Junior tip:** If you say "avoids memory leaks", be ready to explain what actually leaks. Say: "The component is destroyed but the subscription stays alive. When the HTTP response arrives, it tries to update a signal on a component that no longer exists — Angular throws an error or wastes resources." That shows real understanding, not just a memorized phrase.

**What is `forkJoin()` and when do you use it?**
An RxJS operator that runs multiple Observables in parallel and waits for all of them to complete before emitting the combined results. I use it in the weather app to fetch current weather and a 5-day forecast in one go.

**What is `switchMap` and when do you use it?**
An operator that cancels the previous inner Observable and starts a new one every time the source emits. The classic case is search-as-you-type — if the user types fast, you only want the result for the last keystroke, not all the intermediate ones. Without `switchMap`, multiple HTTP requests could race and the UI could show an older result last.

**What is `debounceTime` and when do you use it?**
An operator that delays emitting a value until a set time has passed with no new values. Combined with `switchMap`, it prevents a new HTTP request on every keystroke — `debounceTime(300)` means the request only fires 300ms after the user stops typing.

**What is `catchError` and how do you use it?**
An operator that intercepts an error in a stream and lets you return a safe fallback instead of crashing the Observable. I use it with `of([])` to return an empty array when an HTTP call fails — the template then shows an empty state instead of nothing.

---

## Routing

**How does Angular routing work?**
You define routes in `app.routes.ts` as an array of path-component pairs. `RouterOutlet` in the template is where Angular renders the active component. Navigation can be declarative with `routerLink` or programmatic with `router.navigate()`.

**What is a route guard?**
A function that runs before a route is activated and can block or redirect navigation. In the HR portal I use `authGuard` to redirect unauthenticated users to login, and `adminGuard` to block employees from admin routes.

**What is the difference between `CanActivate` and `CanDeactivate`?**
`CanActivate` runs before entering a route — used to check authentication or role. `CanDeactivate` runs before leaving — used in the HR portal department form to warn the user if they have unsaved changes before navigating away.

**How do you redirect from a guard?**
Return `router.createUrlTree(['/login'])` instead of `false`. This is cleaner because it tells Angular exactly where to go, rather than just blocking the navigation.

**How do you stack multiple guards on a route?**
Add them to the `canActivate` array: `canActivate: [authGuard, adminGuard]`. Angular runs them in order and stops at the first one that returns false or a redirect.

**What is `noAuthGuard` and why do you need it?**
A guard that redirects already-authenticated users away from the login page. Without it, a logged-in user can press the browser back button and land on the login page — a confusing experience. It is the mirror of `authGuard`: `authGuard` blocks unauthenticated users from protected routes; `noAuthGuard` blocks authenticated users from the login route. In the HR portal I apply it to the login route so that logged-in users always go straight to the dashboard.

**What is the difference between route params and query params?**
Route params are part of the URL path (`/employees/123`) and identify a specific resource. Query params are optional extras (`/employees?status=active`) used for filters or temporary state. In the HR portal, clicking a dashboard stat card passes a status query param that the employee page reads on load to pre-apply a filter.

**What is `pathMatch: 'full'` and why is it required on a redirect route?**
It tells Angular to only match the route if the entire URL matches the path, not just the beginning. Without it, the empty path `''` would match every URL, so every route would redirect.

---

## Lazy loading

**What is lazy loading in Angular?**
Loading a component only when the user navigates to that route, instead of bundling everything at startup. In the HR portal, admin and employee routes are lazy loaded because most users are employees who never visit admin pages — the initial bundle is smaller.

**How do you set up lazy loading in Angular 17+?**
Use `loadComponent` in the route definition with a dynamic import: `loadComponent: () => import('./path').then(m => m.Component)`. Angular only downloads that code when the user first navigates to the route.

**How does lazy loading affect the user experience?**
The first visit to a lazy route has a small delay while the code downloads. After that it is cached. For most business apps the delay is imperceptible, and the faster initial load is worth it.

**Why did you lazy load the admin routes specifically, and not all routes?**
What they really want to know: Did you make a deliberate decision, or did you apply the pattern mechanically?
A: Most users of the HR portal are employees — they never visit the admin area. Lazy loading admin routes means their initial bundle does not include that code at all. The login page and dashboard are NOT lazy loaded because every user lands there on every session — making them wait for a dynamic import would add a delay with no benefit. The rule is: lazy load pages the majority of users never visit. Eager load the pages every user sees first.
Red flag answer: "I lazy loaded everything." — That shows the pattern was applied without thought. Lazy loading the first route the user always visits adds a delay for no reason.

---

## HTTP interceptors

**What is an HTTP interceptor?**
A function that runs before every HTTP request, letting you add headers, handle errors, or log requests globally. In the HR portal, the auth interceptor adds the Bearer token to every request so each service does not need to do it manually.

**Why use an interceptor instead of adding the token in each service?**
A single interceptor handles all requests in one place. If the token format changes, you only update one file. In the HR portal, doing it in each service would mean touching six separate files.

**What does `req.clone()` do in an interceptor?**
HTTP requests are immutable, so you cannot modify them directly. `req.clone({ setHeaders: { Authorization: '...' } })` creates a copy with the new headers, which you then pass to `next()`.

---

## Reactive forms

**What is the difference between reactive forms and template-driven forms?**
Reactive forms are defined in TypeScript — more predictable, easier to test, better for complex validation. Template-driven forms live mostly in the HTML — simpler for basic cases. I use reactive forms in all my projects because they scale better with Angular Material.

**What does `markAllAsTouched()` do and why do you call it on submit?**
It marks every field as touched so validation error messages appear even if the user never clicked on a field. Without it, a user who clicks Submit immediately would see no errors — the form would silently fail.

**What is `patchValue()` and when do you use it?**
It updates only the fields you provide, leaving the rest unchanged. I use it in edit mode to pre-fill the form with existing data — unlike `setValue()`, it does not require you to provide every field.

**What is `form.dirty` and how do you use it?**
It is `true` when the user has changed at least one field. In the HR portal, I check `form.dirty` in `onCancel()` — if the form is dirty, I open a confirm dialog before closing. If not, I close directly.

**How do you set a custom validation error from a service?**
With `control.setErrors({ customKey: true })`. In the HR portal, after checking for a duplicate department name, I call `setErrors({ duplicate: true })` on the name field — `mat-error` then shows the error message automatically.

**What is `markAsPristine()` and when do you use it?**
It resets `form.dirty` to false programmatically. I call it after a successful save so the `CanDeactivate` guard does not trigger when Angular navigates away after the save.

**What is `FormArray` and when do you use it?**
A `FormGroup` holds a fixed set of named fields. A `FormArray` holds a dynamic list of controls — you add and remove them at runtime. The most common case is a form where the user can add multiple items: phone numbers, addresses, skills. You access items by index, not by name. In my projects I use `FormGroup` for employee and department forms where the fields are fixed. `FormArray` is the right choice when the number of fields is not known upfront.

---

## Lifecycle hooks

**What is `ngOnInit` and when do you use it?**
A lifecycle hook that runs once when the component loads. I use it to fetch initial data, read route params, or apply query param filters — anything that needs to happen once on startup.

**What is `ngAfterViewInit` and when do you use it?**
A lifecycle hook that runs after the template is fully built. It is the earliest safe moment to use `@ViewChild` references. In the task manager I connect `MatSort` to `MatTableDataSource` here, because before this point the sort directive does not exist yet.

**What is `@ViewChild` and how do you use it?**
A decorator that gets a reference to a child component or directive from the template. I use `@ViewChild(MatSort)` to access the sort directive and connect it to `MatTableDataSource` in `ngAfterViewInit`.

**What is `ngOnChanges` and when does it fire?**
A lifecycle hook that runs every time a parent updates an `@Input()` decorated property. It receives a `SimpleChanges` object with the previous and current values so you can react to specific property changes. In modern Angular (17+) with the `input()` signal API, you use `effect()` for the same purpose — it fires whenever the signal changes. `ngOnChanges` is still important because you will see it in any existing enterprise codebase built before the signals API.

> **Junior tip:** Interviewers ask this to see if you know only the modern API or understand the history. Mention both: "Old pattern: `@Input()` + `ngOnChanges`. Modern pattern: `input()` signal + `effect()`." This shows you can read legacy code and write modern code.

---

## Pipes

**What is a pipe in Angular?**
A template function that transforms a value before displaying it. `{{ date | date }}` formats a date, `{{ price | number:'1.2-2' }}` formats a number. They keep transformation logic out of the component.

**What pipes have you used?**
`date` to format ISO dates, `number` with format `'1.0-1'` to show one decimal, and `SlicePipe` to cut strings in the template. In the HR portal I use `date` on leave request dates and employee hire dates.

**How do you create a custom pipe?**
You create a class decorated with `@Pipe({ name: 'myPipe' })` that implements `PipeTransform`. The `transform()` method receives the value and any arguments, and returns the transformed result. For example, a `truncate` pipe that cuts long text to a max length and adds `...`. You generate it with `ng generate pipe` and import it in the component's `imports` array like any other standalone pipe.

**What is the `async` pipe and when do you use it?**
It subscribes to an Observable directly in the template and automatically unsubscribes when the component is destroyed — no `subscribe()`, no `takeUntilDestroyed()`. `{{ employees$ | async }}` displays the value as soon as it arrives. I use signals for my own state, but I use the `async` pipe when working with Observables I did not create — for example, route data or streams from a shared service. You will see it everywhere in existing enterprise codebases.

**How do you handle API keys in Angular?**
Never hardcode them in the component or service — they end up committed to git. I use Angular's environment files: `ng generate environments` creates `environment.ts` which is added to `.gitignore`. The service imports from there: `import { environment } from '../../environments/environment'`. Important caveat: any value in the frontend bundle is visible in the browser DevTools. For truly sensitive keys, the correct solution is to proxy the call through a backend — the key lives on the server, never in the browser.

---

## Angular Material

**What is Angular Material?**
Google's official component library for Angular based on Material Design. It provides ready-made, accessible components — tables, dialogs, forms, buttons — that follow a consistent design system. It is the standard in Spanish enterprise Angular projects.

**What button variants does Angular Material have and when do you use each?**
Six variants: `mat-button` (plain text, no background — low-emphasis actions like Cancel), `mat-raised-button` (filled with shadow — primary actions), `mat-flat-button` (filled without shadow — primary actions in flat designs), `mat-stroked-button` (outlined — secondary actions that need more presence than plain text), `mat-icon-button` (icon only, no label — toolbar actions like delete or close), `mat-fab` (floating action button — the single main action on a page). The `color` attribute (`primary`, `accent`, `warn`) applies the theme colour. In the HR portal I use `mat-flat-button` for confirm actions and `mat-stroked-button` for cancel.

**How do you build an app shell with `MatToolbar`?**
`mat-toolbar` is a fixed-height header bar. I place it inside `mat-sidenav-content` so it stays at the top of the content area while the sidenav stays on the left. Material does not push toolbar items apart automatically — I add `display: flex; justify-content: space-between` to push the title left and the logout button right. The whole shell is wrapped in `@if (isLoggedIn())` so it only renders when the user is authenticated.

**How does `MatSelect` work inside a reactive form?**
You use `<mat-select>` inside a `mat-form-field` and bind it to a `FormControl` with `formControlName`. The options go inside `<mat-option>` elements — you loop over them with `@for`. When you need the options to come from a service, you load them in `ngOnInit` and store them in a signal. `mat-error` works the same way as with any other Material input.

**What is `MatSidenav` and when do you use it?**
A side navigation panel that can be permanent, toggled, or overlaid. In enterprise apps it replaces top-level tab navigation — the sidenav holds the main nav links and stays visible while `<mat-sidenav-content>` holds the active page. The standard pattern is `mat-sidenav-container` wrapping both the sidenav and the content, with a toolbar inside the content area. You wrap the whole structure in `@if (isLoggedIn())` so it only shows when the user is authenticated.

**What is `MatTableDataSource` and why use it over a plain array?**
A wrapper that automatically handles sorting, filtering, and pagination for a Material table. In the task manager I use it because the table needed sorting from day one — it removes the need to write that logic manually.

**How does `MatSort` work?**
You add `mat-sort-header` to each `<th>`, connect `@ViewChild(MatSort)` to `dataSource.sort` in `ngAfterViewInit`, and the table handles sorting automatically. The directive goes on `<th>`, not on `ng-container`.

**What is `MAT_DIALOG_DATA` and how does it work?**
A token that lets you pass data from the parent into a dialog at the time it opens. Inside the dialog you inject it with `inject(MAT_DIALOG_DATA)`. In the HR portal, the employee dialog receives the existing employee data this way when opened in edit mode.

**How do you get data back from a dialog?**
The dialog calls `dialogRef.close(value)` and the parent reads it in `afterClosed().subscribe(result => { if (result) { ... } })`. In the HR portal, the confirm dialog returns `true` on confirm and `undefined` on cancel — the parent always checks `if (result)` before proceeding.

**What is the dual-mode dialog pattern?**
Using one dialog component for both add and edit. The dialog checks if `MAT_DIALOG_DATA` is present to decide the mode — if data exists, it patches the form with existing values. This avoids maintaining two near-identical templates. I use it in the task manager and HR portal.

**How do you protect a dialog from closing accidentally when the form is dirty?**
Two steps. First, set `disableClose: true` when opening the dialog — this prevents Material from closing automatically on backdrop click or Escape. Second, subscribe to `dialogRef.backdropClick()` in the dialog constructor and route it through `onCancel()` — the same method the Cancel button calls. This way all three close paths (Cancel button, backdrop click, Escape) go through the dirty check. In the HR portal, the employee dialog uses this pattern because the form has two stepper steps and losing data mid-way would be frustrating.

**What is `MatSnackBar` used for?**
Short toast notifications after user actions — saves, deletes, errors. I inject it in the page coordinator and call `snackBar.open(message, 'Close', { duration: 3000 })` after each service operation. Only one snackbar shows at a time.

**What is `MatStepper` and when is it useful?**
A component that splits a form into sequential steps, each with its own validation. I use it in the HR portal employee dialog — the form had too many fields for one screen, so I split it into "Personal info" and "Job details" to make it clearer.

**Why does `stepper.next()` need manual validation?**
`stepper.next()` moves to the next step unconditionally — it does not check `[stepControl]`. When the buttons are outside the `<mat-stepper>` element (like in `mat-dialog-actions`), `matStepperNext` directive cannot find the stepper either. So I validate manually in `onNext()` before calling `stepper.next()`.

**What is `MatDatepicker` and what does it need to work?**
A calendar popup for date inputs. It needs `MatDatepickerModule` in the component imports and `provideNativeDateAdapter()` in `app.config.ts` — this tells Angular Material to use the native JavaScript `Date` object. The form value comes out as a `Date`, so I cast it and call `.toISOString().split('T')[0]` to store it as a `YYYY-MM-DD` string.

**How do you add pagination to a Material table?**
Add `<mat-paginator>` below the table, get a reference with `@ViewChild(MatPaginator)`, and connect it to `dataSource.paginator` in `ngAfterViewInit` — the same pattern as `MatSort`. `MatTableDataSource` handles slicing the data automatically. One detail: when the user applies a filter, call `paginator.firstPage()` so they always land on page 1 instead of seeing an empty page 3.

**What is `mat-error` and when does it show?**
A Material component that displays validation error messages inside a `mat-form-field`. By default it shows when the control is invalid AND touched. For more control over when it appears, you use `ErrorStateMatcher`.

**Why did you use `mat.theme()` in SCSS instead of CSS class overrides to customize the Material theme?**
What they really want to know: Do you understand the Material theming system, or did you find a hack that worked?
A: `mat.theme()` is the official API — it sets color, typography, and density through Material's design token system. Every component in the app picks up the theme automatically through `--mat-sys-*` CSS variables. CSS overrides are fragile: they break when Angular Material updates internal class names across versions, and they bypass the token system so components that generate their own internal styles ignore them. In the task manager and HR portal I define the theme once in `material-theme.scss` using `mat.$violet-palette` — all Material components use the same palette with no per-component overrides needed.
Red flag answer: "I overrode the CSS classes." — The interviewer knows it works. They want to hear that you used the official API and understand why it exists.

> **Junior tip:** This question separates developers who read the Material docs from those who Googled a fix. Mention `mat.theme()`, `mat.$violet-palette`, and `--mat-sys-*` variables — these signal real familiarity with Material.

---

## Component styles

**What is view encapsulation in Angular?**
Angular adds a unique attribute to every element in a component's template and transforms the CSS selectors to only match elements with that attribute. This means component CSS is scoped — it only affects elements you wrote in your own template, not other components. The practical consequence: if a Material component renders internal HTML, your component CSS cannot reach it — you have to put that rule in the global `styles.css`.

**When do you use component CSS versus global `styles.css`?**
Component CSS for elements you wrote in your own template — `form`, `mat-form-field`, `mat-card`. Global `styles.css` for internal elements rendered by Material directives — like `.mat-sort-header-container` or `.mat-mdc-form-field-infix`. If a style is not working in your component CSS, the first thing to check is whether the element is rendered by Angular or by a Material component internally.

---

## Unit testing

**Have you written unit tests in Angular?**
Yes — I test services with Jasmine and TestBed. The pattern is: configure a test module in `beforeEach`, inject the service with `TestBed.inject()`, and write each assertion in its own `it` block. For services that make HTTP calls I use `HttpClientTestingModule` so no real network requests are made.

**What is TestBed?**
Angular's testing module — it creates a mini Angular environment for a test. You configure it with the same providers and imports you would use in the real app. Without TestBed, Angular's dependency injection does not work in tests.

**What is `HttpClientTestingModule` and why do you use it?**
A testing replacement for `HttpClientModule` that intercepts HTTP calls instead of making real network requests. In a test, you call the service method, then use `HttpTestingController.expectOne(url)` to assert the request was made, and `req.flush(mockData)` to send a fake response. This makes tests fast, predictable, and independent of the network.

**What is `spyOn` and when do you use it?**
A Jasmine function that replaces a method with a fake you can control and inspect. I use it to check that a method was called with the right argument, or to prevent real logic from running in a dependency. `expect(spy).toHaveBeenCalledWith(id)` reads clearly and makes the test intention obvious.

**What is `afterEach(() => httpMock.verify())` for?**
It checks that no unexpected HTTP requests were made during the test. If a method fires a request you did not account for in your test, `verify()` fails the test — this prevents silent bugs where extra requests go unnoticed.

---

## Change detection

**What is change detection in Angular?**
The process Angular uses to decide when to update the DOM. After every browser event, Angular checks if any component data changed and re-renders the affected parts. By default it checks every component in the tree, even ones that did not change.

**What is the difference between Default and OnPush change detection?**
Default checks the component on every browser event regardless of whether its data changed. OnPush only checks when an `input()` reference changes, an event fires inside the component, or a signal it reads changes. OnPush is more performant but requires immutable data — if you mutate an array directly instead of replacing it, the template will not update because the reference did not change.

**How do signals work with OnPush?**
Signals and OnPush are designed to work together. When a signal inside an OnPush component changes, Angular marks that component for checking automatically — you do not need to call `ChangeDetectorRef` manually. This means you get the performance benefit of OnPush without any extra work when you use signals for all your state.

**How did you decide which components should use `OnPush` and which should use `Default`?**
What they really want to know: Did you apply OnPush thoughtfully, or did you add it everywhere hoping for a performance win?
A: I apply `OnPush` to pure presentational components — ones that only receive `input()` signals and emit events. In the HR portal, the table, filters, and dialog child components are good candidates because their renders depend entirely on `input()` changes. The coordinator page uses `Default` — it manages service state, opens dialogs, and has many moving parts where simplicity matters more than the check reduction. With signals, `OnPush` is safe because signal changes always trigger a re-check automatically.
Red flag answer: "I use OnPush everywhere for better performance." — Applying it without understanding the signal/immutable-data contract can cause components to miss updates when you mutate objects directly instead of replacing them.

---

## Architecture and patterns

**What is Core/Feature/Shared architecture?**
A folder structure where `core/` holds singletons used across the whole app (guards, interceptors, services), `pages/` holds feature areas, and `shared/` holds reusable components. It is the standard in enterprise Angular projects at companies like NTT Data and Capgemini.

**What is the coordinator pattern and why do you use it?**
The page component owns all state and handles all events. Child components only receive data via `input()` and emit events via `output()` — they never touch the service directly. In the HR portal, the employee page coordinates the table, filters, and dialog. This keeps the children reusable and avoids keeping multiple copies of the same data in sync.

**What is the difference between smart/dumb and coordinator pattern?**
Smart/dumb works well with one or two child components. Coordinator is the same idea but formalized for pages that manage many children sharing the same state. I used smart/dumb in the expense tracker and moved to coordinator in projects 05 and 06 as the complexity grew.

**Why use a service for state instead of keeping it in the component?**
Services are singletons — if two pages need the same data, the service keeps one copy and both stay in sync automatically. In the HR portal, the leave request page and the dashboard both depend on the employee list — without a service, they would each need their own copy and a way to stay in sync.

**What is `Omit<T, 'field'>` and when do you use it?**
A TypeScript utility type that creates a new type from an existing one, removing specific fields. I use it when creating a new entity that does not have an ID yet — `Omit<Employee, 'id'>` lets me type the "create" form data without the `id` field.

**You have never used NgModules. Is that a problem?**
What they really want to know: Are you aware that NgModules exist and can you work with legacy code?
A: NgModules were the standard before Angular 14. Every module declared components, imported other modules, and provided services. Standalone components, which became the default in Angular 17+, remove most of that boilerplate — each component declares its own imports. New projects use standalone. But existing enterprise codebases still use modules heavily, and I understand the pattern. I would need time to get productive in a large module-based codebase, but the concepts are not new to me — I know what a module does and why it existed.
Red flag answer: "I don't know what NgModules are." — A junior who has only read modern docs can say this. Show that you know the history and can read old code.

---

## Project-specific questions

**Walk me through the HR portal.**
It is a role-based HR management app that simulates a real enterprise tool — the kind of internal app you would find at a consultancy. The core problem it solves is that not everyone should see or do everything: admins manage employees and departments, employees only see their own data and request leave. The most interesting technical decision was the guard system — stacking `authGuard` and `adminGuard` on the same route, and then dealing with `CanDeactivate` without it blocking navigation after a successful save. That is where `markAsPristine()` became important. If I were to improve it, the first thing I would do is connect it to a real Spring Boot backend with proper JWT authentication instead of the simulated localStorage approach.

**What is the most complex part of the HR portal?**
The route guard system — stacking `authGuard` and `adminGuard` together, making sure guards run in the right order, and handling the `CanDeactivate` guard on forms without it interfering with programmatic navigation after a save. The `markAsPristine()` call after a successful save was the key to making that work correctly.

**What would you change in the HR portal if you had more time?**
I would add unit tests to the services — the duplicate check logic and the guard functions are good first candidates. I would also connect it to a real Spring Boot backend with proper JWT authentication instead of the simulated localStorage approach.

**What was the hardest bug you fixed in your projects?**
In the HR portal stepper, I set `[linear]="false"` by mistake and could not understand why validation was not working. Then I realized `stepper.next()` also does not check `[stepControl]` — it moves unconditionally. I had to move the validation logic into `onNext()` and call `markAllAsTouched()` manually before deciding whether to advance. That was a good lesson: always read what a method actually does, not just what you expect it to do.

**How do you handle HTTP errors in Angular?**
What they really want to know: Do you think about failure cases, not just happy paths?
A: In the weather app I handle errors in the `subscribe()` error callback — I set a `hasError` signal to true and show a message in the template. For global errors like 401, an interceptor is the right place — it can redirect to login without touching each service individually.
Red flag answer: "I use try/catch." — That is for synchronous code. Saying this about Observables means you have not actually handled an HTTP error in Angular.

**How would you explain the coordinator pattern to a teammate who has never heard of it?**
What they really want to know: Do you understand the pattern well enough to teach it, or did you just copy it?
A: The page is the coordinator — it owns the data and decides what happens. The child components are like display screens — they show what you give them and tell you when the user does something, but they never make decisions themselves. In the HR portal, the employee page is the coordinator: the table, filters, and dialog all report to it.
Red flag answer: "It is like smart/dumb components." — That is not wrong but it shows you learned the label without understanding the reason.

**Why did you use localStorage instead of a real backend for the HR portal?**
What they really want to know: Do you understand the trade-off, or did you just follow a tutorial?
A: The focus of this project was Angular patterns — guards, lazy loading, interceptors, role-based access. Building a Spring Boot backend at the same time would have split the focus and slowed everything down. Each service uses `signal()` + `effect()` to persist to localStorage automatically. The HTTP interceptor is designed to work identically with a real API — swapping localStorage for Spring Boot in project 07 requires no changes to the Angular layer.
Red flag answer: "Because it is easy." — The interviewer knows that. They want to hear that you understand what you sacrificed and that the architecture is ready for the real backend.

**You built six Angular projects solo. How would your workflow change in a team of five developers?**
What they really want to know: Are you ready for professional collaboration, or do you only know solo work?
A: The biggest change is discipline around git — PR reviews, never merging your own code, keeping commits atomic so teammates can follow the history. I already use Conventional Commits and feature branches in my personal projects. The harder part is agreeing on architecture upfront so the codebase stays consistent — that is exactly what Core/Feature/Shared solves.
Red flag answer: "I would just communicate more." — Too vague. The interviewer wants to hear specific practices.

**What is a JWT and how does it work in an Angular + Spring Boot app?**
What they really want to know: Do you understand the auth flow end to end, or just the Angular side?
A: JWT is a token the server sends after login — it contains encoded user data and a signature. The Angular client stores it and sends it in every request as a Bearer token in the `Authorization` header via an interceptor. The Spring Boot backend validates the signature on each request without needing a database session lookup. In the HR portal I simulate this — the interceptor adds the token, but the backend is replaced by localStorage so there is no server to validate it.
Red flag answer: "It is a token for authentication." — Every junior says this. The interviewer wants the flow, not the definition.
