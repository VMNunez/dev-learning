# Middle Coverage — JavaScript

Concepts expected when a developer diagnoses asynchronous behaviour and designs reusable language-level abstractions.

## Async control and iteration

- Timer-and-state mechanics for rate limiting — implement quiet-period and maximum-rate behaviour without duplicate calls or stale state
- Iterators and iterable protocols — expose sequence traversal without leaking the collection's representation
- Generators — implement lazy iteration and delegated sequences with explicit suspension points
- Async iterators — consume paginated or streaming asynchronous data with backpressure-aware iteration

## Runtime objects and memory

- `Object.is` edge semantics — choose SameValue comparison when `NaN` equality or signed zero must differ from strict equality
- Sparse-array behaviour — diagnose holes, explicit `undefined`, length, and iteration-method differences in array-like data
- `WeakMap` and weak references — associate metadata without preventing key collection and recognise nondeterministic cleanup
- `Proxy` and `Reflect` — intercept object operations while preserving language invariants
- `Symbol` — create collision-resistant property keys and implement well-known language protocols
- Retained-object diagnosis — trace long-lived callbacks and lexical environments that keep otherwise-unused objects collectable

## Module graph diagnosis

- Live module bindings — diagnose updates and initialisation order across imported and exported bindings
- Circular module dependencies — resolve partially initialised or order-sensitive module graphs instead of masking the cycle
- Tree-shaking constraints — design analyzable module boundaries and controlled side effects so bundlers can remove unused code
