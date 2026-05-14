# Angular — Future Learning Roadmap

Topics to study once the current foundation is solid. The goal of this file is not to overwhelm — it is to tell you what exists, why it matters, and when to pick it up. Nothing here is needed for the first job interview.

---

## Read-only knowledge before the first job

These are patterns you do NOT need to write, but you WILL encounter in existing codebases on day one. Recognising them is enough — you do not need a project to understand them.

### `@Output()` and `EventEmitter` — legacy component communication

You use `output()` (modern signals API). Legacy Angular code — everything written before Angular 17 — uses the decorator pattern instead:

```typescript
// Legacy — what you will find in enterprise codebases
@Output() employeeCreated = new EventEmitter<Employee>();

// To emit a value
this.employeeCreated.emit(newEmployee);

// In the parent template
<app-employee-form (employeeCreated)="onEmployeeCreated($event)" />
```

Your `output()` does the same thing — just without the class boilerplate. When you see `@Output()` and `EventEmitter`, you will know exactly what it does.

### NgModule — the pre-standalone module system

Every Angular project written before v15 uses `@NgModule`. You will see this in every existing enterprise project:

```typescript
@NgModule({
  declarations: [AppComponent, EmployeeListComponent], // components that belong to this module
  imports: [BrowserModule, HttpClientModule, MatTableModule], // external modules used here
  exports: [EmployeeListComponent], // components other modules can use
  providers: [EmployeeService], // services registered here
})
export class AppModule {}
```

You do not need to write NgModules — standalone is the modern approach. You need to be able to read this structure when you join a project that has it, and understand what goes where.

---

## Phase 1 — After landing the first job

These are things you will encounter in real project work within the first few months. Not needed for the portfolio — needed to contribute effectively on a team.

### Preloading strategies

By default, lazy routes are only downloaded when the user navigates to them — there is a small delay on first visit. Preloading strategies tell Angular to download certain routes in the background while the user is idle.

```typescript
import { PreloadAllModules } from '@angular/router';

provideRouter(routes, withPreloading(PreloadAllModules))
```

`PreloadAllModules` downloads all lazy routes after the initial load. You can also write a custom strategy that only preloads specific routes. Relevant for production apps where perceived performance matters.

### Angular CDK — Component Dev Kit

The lower-level toolkit from the Angular Material team. Does not have visual components — it has primitives:

| CDK feature | What it does |
|-------------|-------------|
| Virtual Scrolling | Renders only visible rows for a list of thousands of items |
| Drag and Drop | `cdkDrag` / `cdkDropList` — full drag-and-drop without a library |
| Overlay | Position a panel relative to an element (the base of Material dialogs) |
| Accessibility | Focus management, keyboard navigation primitives |

Relevant when your team builds custom UI components beyond what Material provides.

### `@defer` blocks — template-level lazy loading

Angular 17+ syntax that delays loading a heavy component until it is needed:

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData" />
} @placeholder {
  <div class="chart-skeleton"></div>
}
```

The component code is not downloaded until the block enters the viewport (or on interaction, on idle, after a timer — many triggers available). Practical for dashboards with many charts or heavy third-party components.

---

## Phase 2 — After 6–12 months of experience

These require working in a real codebase to understand properly. The concepts make more sense once you have felt the pain they solve.

### NgRx — global state management

The Redux pattern for Angular. Used in large apps where many components across different pages need to share the same state. Still the dominant state management solution in enterprise Angular at NTT Data, Capgemini, and similar.

Core concepts: `Store` (single source of truth), `Actions` (events that describe what happened), `Reducers` (pure functions that update state), `Effects` (handle side effects like HTTP calls), `Selectors` (derive data from the store).

Why to wait: NgRx adds significant boilerplate and complexity. Without understanding why global state is needed (you will feel this in a large app), the pattern seems pointless. Learn it after you have worked in an app where signal-based services were not enough.

The modern alternative: `@ngrx/signals` store — same ideas, signal-based, much less boilerplate. This is where new projects are heading.

### `ControlValueAccessor` — custom form controls

Interface that lets you build your own component and plug it into Angular's reactive form system — so it works with `formControlName`, `Validators`, and `mat-error` natively.

Example use: a custom phone number input with country code, a star rating component, a date range picker — components that behave like a standard form field from the outside but have complex internal logic.

Why to wait: you need solid reactive forms experience first. You also need to encounter a case where a native input is not enough — otherwise the abstraction feels unnecessary.

### Angular animations module

Angular has a built-in animation system based on Web Animations API: `trigger()`, `state()`, `transition()`, `animate()`. Used for route transitions, expanding panels, animating list items in and out.

```typescript
trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 }))
  ])
])
```

You already know CSS transitions and `@keyframes` — Angular animations are more powerful because they can be driven by component state and applied to route-level transitions. Relevant when the design requires coordinated animations across components.

---

## Phase 3 — Mid-level (12–24 months)

### `@ngrx/signals` store

The modern replacement for NgRx Classic. Signal-based global state with much less boilerplate. This is what new Angular projects at consultancies will use going forward.

```typescript
const EmployeeStore = signalStore(
  withState({ employees: [] as Employee[], isLoading: false }),
  withMethods((store) => ({
    loadEmployees: rxMethod<void>(/* ... */),
  }))
);
```

Learn NgRx Classic first to understand why the signals approach is better — the contrast makes it click.

### Server-Side Rendering (SSR) with Angular

Angular Universal is now integrated into the Angular CLI. SSR renders the page on the server before sending it to the browser — important for public-facing apps where SEO and first-contentful-paint matter.

```bash
ng new my-app --ssr
```

Not relevant for internal enterprise dashboards (which are behind auth and not indexed by search engines) but important for customer-facing Angular apps.

### Micro-frontends

Multiple Angular apps (or apps from different frameworks) that run inside one shell. Each team owns one "micro-app" and deploys it independently. Used in very large consultancy platforms where 10+ teams work on the same product.

Tools: Webpack Module Federation (widely used), Native Federation (Angular-specific, modern).

Why to wait: requires understanding deployment, build systems, and inter-team communication. Not a day-one topic — a senior track topic.

### Performance profiling and optimization

- `ng build --stats-json` + Webpack Bundle Analyzer — visualise what is in your bundle and where to cut
- Angular DevTools — inspect change detection and component tree performance
- `trackBy` in `@for` — prevent unnecessary DOM re-renders in large lists
- `OnPush` + signals as the default — you already know this; applying it consistently matters at scale
- Image optimization with `NgOptimizedImage` — lazy loads images, prevents layout shift

---

## What NOT to study prematurely

- **Webpack configuration** — Angular CLI abstracts this. Only relevant if you eject or need custom plugins. Rare.
- **Custom Angular schematics** — CLI generators for your own patterns. Very senior, very niche.
- **Angular Elements** — Package an Angular component as a Web Component for use outside Angular. Specialist use case.
- **Zone.js internals** — The change detection mechanism Angular is moving away from. Signal-based Angular reduces dependency on it. Understanding it at a deep level is not needed at junior or mid level.
