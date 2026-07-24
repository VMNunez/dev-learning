# Angular — Future Learning Roadmap

Useful Angular depth deferred until it becomes relevant after the first role. These items do not duplicate the current junior hiring floor.

## Team-scale state and component APIs

- NgRx Store — learn actions, reducers, selectors, and effects after a real application exposes the limits of local service state
- `@ngrx/signals` — evaluate signal-store patterns after understanding the team and tooling trade-offs of established NgRx
- `ControlValueAccessor` — build reusable custom controls that participate fully in Angular forms once native and Material controls are insufficient

## Advanced reactive integration

- `toSignal()` configuration and injection context — control initial values, synchronous requirements, equality, cleanup, and custom injectors when the basic conversion is insufficient
- `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams when a feature depends on several sources
- RxJS retry and finalisation policies — apply `retry()` and `finalize()` only after defining which failures are safe to repeat and which UI state must always be cleared

## Rendering and loading strategies

- Route preloading strategies — balance first-navigation latency against background bandwidth after measuring a production application's route usage
- `@defer` blocks — delay heavy template dependencies with viewport, interaction, or idle triggers when bundle analysis identifies a meaningful benefit
- Signal `resource()` APIs — revisit the stable signal-native asynchronous loading API when it is adopted in maintained consultancy codebases
- `ChangeDetectorRef` — use manual marking, detection, or detachment only for integrations that Angular's normal notifications cannot model cleanly
- Modern Angular animations — use native CSS with `animate.enter` and `animate.leave`, and recognise the deprecated `@angular/animations` package in maintained code

## Platform-scale Angular

- Angular CDK primitives — build accessible overlays, drag-and-drop interactions, and virtual scrolling beyond the ready-made Material components
- Server-side rendering and hydration — improve public-page SEO and first render when the product is not an authenticated internal SPA
- Micro-frontends and module federation — split deployment ownership only when multiple teams require independent release boundaries
- Angular Elements — package Angular components as custom elements for non-Angular hosts in specialist integration scenarios

## Advanced production diagnostics

- Bundle analysis and performance profiling — use Angular DevTools and build statistics to locate measured rendering or bundle bottlenecks before optimising
- Custom webpack configuration — extend the CLI build only when a concrete unsupported integration justifies the maintenance cost
- Custom Angular schematics — automate organisation-specific code generation after a team has stable conventions worth encoding
- Zone.js internals and zoneless migration — study task patching and scheduling deeply when maintaining or migrating a large application's change-detection model
