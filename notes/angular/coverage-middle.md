# Middle Coverage — Angular

Concepts expected once the junior Angular foundation is consolidated and a developer is becoming autonomous in a maintained production application.

## State and reusable component APIs

- NgRx Store architecture — use actions, reducers, selectors, and effects when application-wide state requires explicit event flow and tooling
- `@ngrx/signals` stores — model shared state with signal-store features while preserving clear ownership and side-effect boundaries
- `ControlValueAccessor` — build a reusable custom control that participates in Angular forms, validation, disabled state, and touched state

## Advanced reactive integration

- `toSignal()` configuration and injection context — control initial values, equality, cleanup, and custom injectors when basic conversion is insufficient
- `forkJoin()` vs `combineLatest()` — coordinate one-time completion or continuing latest-value streams according to source behaviour
- RxJS retry and finalisation policies — retry only safe failures and guarantee loading cleanup with a deliberate `finalize()` boundary

## Rendering, loading, and diagnostics

- Route preloading strategies — balance later-navigation latency against background bandwidth using measured route usage
- `@defer` blocks — choose viewport, interaction, or idle triggers for heavy template dependencies
- Signal `resource()` APIs — evaluate signal-native asynchronous loading against established `HttpClient` and RxJS patterns
- `ChangeDetectorRef` — use manual marking, detection, or detachment only when normal Angular notifications cannot model an integration
- Angular CDK primitives — build accessible overlays, drag-and-drop interactions, portals, and virtual scrolling beyond ready-made Material components
- Bundle and rendering profiling — use Angular DevTools and build statistics to find a measured bottleneck before optimising
