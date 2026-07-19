# Angular — Future Learning Roadmap

Topics to study once the current foundation is solid. The goal of this file is not to overwhelm — it is to tell you what exists, why it matters, and when to pick it up. Nothing here is needed for the first job interview.

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

### ChangeDetectorRef — beyond the two basic methods

**Boundary (set 2026-07-18):** `detectChanges()` vs `markForCheck()` — what each does, and recognising a manual call as a symptom of a deeper cause — is now **in coverage** (`Lifecycle hooks`). Interviewers do ask which one an `OnPush` component needs after an async callback. What stays here is everything past that pair.

- `cdr.detach()` and `reattach()` — removing a component from the change detection tree entirely, then driving it by hand; the technique behind high-frequency widgets (live tickers, canvas overlays) that must not re-render with the rest of the page
- Deliberately detaching a subtree as a performance strategy, rather than as a workaround

You will encounter this in legacy code that integrates charting libraries, Google Maps, or WebSockets. With signals the need is rare — signals always notify Angular automatically.

### Angular CDK — Component Dev Kit

The lower-level toolkit from the Angular Material team. Does not have visual components — it has primitives:

| CDK feature | What it does |
|-------------|-------------|
| Virtual Scrolling | Renders only visible rows for a list of thousands of items |
| Drag and Drop | `cdkDrag` / `cdkDropList` — full drag-and-drop without a library |
| Overlay | Position a panel relative to an element (the base of Material dialogs) |
| Accessibility | Focus management, keyboard navigation primitives |

Relevant when your team builds custom UI components beyond what Material provides.

**Boundary (set 2026-07-18):** knowing that virtual scrolling exists and when to reach for it — as one of the three answers to "what do you do with 10,000 rows?", alongside server-side paging and `@defer` — is now **in coverage** (`Performance and change detection`). Actually wiring `cdk-virtual-scroll-viewport`, writing a custom `DataSource`, and the rest of the CDK primitives above stay here.

### `resource()` API — signal-based async data loading

A newer Angular API (still maturing through experimental/developer-preview stages across recent versions) that wraps an async loader function and exposes its result, loading state, and error as signals — without manually writing `toSignal()` + `catchError()` + a separate loading signal.

```typescript
userResource = resource({
  request: () => this.userId(),
  loader: ({ request }) => fetch(`/api/users/${request}`).then(r => r.json()),
});
```

Why to wait: the API is still settling and most consultancy codebases in 2026 are not using it yet — `HttpClient` + `toSignal()` is still the pattern you will see and be asked about. Revisit once it stabilizes and appears in real project work.

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

**Boundary (set 2026-07-18):** Angular DevTools, the change-detection profiler, `track` in `@for`, `OnPush`, and bundle `budgets` are now **in coverage** (`Performance and change detection`, `Build and compilation`) — a junior is asked "the app feels slow, what's your first step?" and is expected to say *measure*. What stays here is the deeper tooling:

- `ng build --stats-json` + Webpack Bundle Analyzer — visualise what is in your bundle and where to cut
- Manual chunking strategy and source-map-explorer analysis
- Image optimization with `NgOptimizedImage` — lazy loads images, prevents layout shift

---

## Phase 3 additions — surfaced by the 2026-07-18 coverage run

These were proposed by the adversarial angles and judged post-junior. They are recorded here so the next run does not re-litigate them.

### Advanced DI and template mechanics

- Custom structural directives — `TemplateRef` + `ViewContainerRef` and how `*someDirective` desugars into an `<ng-template>`; the mechanism behind `*ngIf` itself
- `InjectionToken`, `useFactory`, `useExisting`, and multi-providers — configuring DI beyond a class token
- Angular Elements — packaging a component as a Web Component (already noted below)

### Advanced testing

- Component harnesses — `ComponentHarness`, `HarnessLoader`, and the Angular Material harnesses; the supported way to test Material components without asserting on their internal DOM
- Marble testing — `TestScheduler`, `cold()` / `hot()` for asserting on stream timing
- E2E testing with Cypress or Playwright, and where E2E sits against unit tests in the pyramid
- Jest / Vitest migration off Karma, and the experimental Angular builders for each
- `TestBed.overrideComponent` / `overrideProvider` as a general override toolkit — the shallow-rendering tradeoff itself was promoted to coverage by the 2026-07-19 audit; what stays here is the fuller override API
- Mutation testing (Stryker) as a measure of whether the suite actually catches bugs

### Architecture at scale

- Facade service pattern — a feature-level facade exposing signals over dumb data services; worth knowing once an app has enough services that components start orchestrating them
- Dynamic forms built from a backend-provided schema — constructing `FormGroup`/`FormArray` at runtime rather than declaring them
- Nx monorepo workspaces — enforced module boundaries and multi-project `angular.json`
- Custom builders and writing your own schematics
- Design-token and theming architecture across a shared component library
- Zoneless change detection — *the concept* was promoted to coverage by the 2026-07-19 audit (what breaks without Zone.js); what remains here is performing the migration on a real codebase, which is senior work

---

## Phase additions — surfaced by the 2026-07-19 coverage audit

_Analyst C generated 181 interview questions for Angular; these are the gaps judged real but post-junior for the August–September 2026 target._

### Server-side rendering — Phase 2

Angular SSR is rare in the internal business applications Spanish consultancies build for their clients, so it is not a junior filter — but it is worth knowing once a client-facing, SEO-sensitive project appears.

- `@angular/ssr` and when a client genuinely needs server rendering (SEO, first paint on slow devices) versus when it is pure operational cost
- `provideClientHydration()` — reusing the server-rendered DOM instead of re-creating it, and what breaks hydration (direct DOM manipulation, markup mismatches)
- `isPlatformBrowser` / `PLATFORM_ID` — why `window` and `localStorage` crash under SSR and how platform-guarded code is written
- `afterNextRender` / `afterRender` — the Angular 16+ hooks for DOM-dependent work that must never run on the server; only meaningful once SSR is in play

### Newer signal APIs — Phase 2

Real and useful, but too new to be a screening filter in 2026: an interviewer cannot assume a candidate has met them.

- `linkedSignal()` — writable state derived from a source that resets when the source changes (Angular 19)
- `resource()` / `httpResource()` — the signal-native async primitive exposing `value`/`status`/`error`, which will eventually replace the loading/error signal trio

### Advanced DI and HTTP — Phase 2

- `APP_INITIALIZER` / `provideAppInitializer` — blocking bootstrap on an async task such as loading runtime config from a server
- Token refresh queueing inside an interceptor — holding concurrent 401s behind a single refresh call so the app does not fire five refreshes at once; the naive version is covered as the 401-loop trap, the correct queueing implementation is mid-level
- `reportProgress: true` + `HttpEventType` — driving an upload progress bar from the request's event stream

### Performance and UX polish — Phase 2

- `NgOptimizedImage` (`ngSrc`, `priority`, `fill`) — enforced sizing, lazy loading, and LCP preloading for image-heavy pages
- `withInMemoryScrolling` — scroll-position restoration and anchor scrolling on navigation
- CDK `BreakpointObserver` — making responsive decisions in TypeScript rather than in CSS
- `MatStepper` — multi-step forms with one `FormGroup` per step and `linear` mode

### Internationalisation beyond formatting — Phase 2

- `@angular/localize` build-time i18n versus a runtime library (ngx-translate) — one bundle per language against one bundle that switches at runtime; the `LOCALE_ID` formatting layer is in coverage, this architectural choice is not

---

## What NOT to study prematurely

- **Webpack configuration** — Angular CLI abstracts this. Only relevant if you eject or need custom plugins. Rare.
- **Custom Angular schematics** — CLI generators for your own patterns. Very senior, very niche.
- **Angular Elements** — Package an Angular component as a Web Component for use outside Angular. Specialist use case.
- **Zone.js internals** — The change detection mechanism Angular is moving away from. Signal-based Angular reduces dependency on it. Understanding it at a deep level is not needed at junior or mid level.
