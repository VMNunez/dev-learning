# Middle Coverage — JavaScript

Concepts expected when a developer diagnoses asynchronous behaviour and designs reusable language-level abstractions.

## Async control and iteration

- Debounce vs throttle implementation — control bursty events according to final-value or maximum-rate semantics
- `AbortController` — propagate cancellation through supported asynchronous APIs and distinguish cancellation from failure
- Iterators and iterable protocols — expose sequence traversal without leaking the collection's representation
- Generators — implement lazy iteration and delegated sequences with explicit suspension points
- Async iterators — consume paginated or streaming asynchronous data with backpressure-aware iteration

## Runtime objects and memory

- `WeakMap` and weak references — associate metadata without preventing key collection and recognise nondeterministic cleanup
- `Proxy` and `Reflect` — intercept object operations while preserving language invariants
- `Symbol` — create collision-resistant property keys and implement well-known language protocols
- Closures and memory retention — diagnose when long-lived callbacks retain objects that should be collectable
