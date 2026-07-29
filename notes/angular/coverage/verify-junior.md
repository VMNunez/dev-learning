# Coverage Verify — Angular Junior

Verdict: gaps
Coverage SHA-256: 35aea5ad4615102d5cf828421352ec0e289a071aa0d83a2f9c5e9280583c5455
Verified: 2026-07-29

## Open gaps

- Custom attribute directives and host interaction — implement reusable element behaviour with a directive and use host bindings or listeners without taking ownership of the element's view [Components and template data flow]
- Conditional class and style binding — use class/style bindings for focused dynamic presentation and recognise `ngClass`/`ngStyle` when several values are applied together in maintained templates [Components and template data flow]
- `InjectionToken` and configured providers — inject configuration or non-class dependencies through a typed token and recognise `useValue`, `useClass`, and `useFactory` provider definitions [Lifecycle and dependency injection]
- `concatMap()` vs `exhaustMap()` — queue ordered inner work with `concatMap()` and ignore duplicate triggers while current work is active with `exhaustMap()`, especially for writes and form submissions [RxJS streams and pipelines]
- `catchError()` placement around flattening operators — recover inside an inner request when the outer interaction stream must remain alive, and catch outside only when terminating the whole pipeline is intended [RxJS streams and pipelines]
