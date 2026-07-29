# Coverage Verify — TypeScript Junior

Verdict: gaps
Coverage SHA-256: acad1f3130ab3ac6b87f30740d705129e61742c0eb88b6735cdcb5d7f1901c93
Verified: 2026-07-29

## Open gaps

- Contextual typing — infer callback parameter and return types from the surrounding expected function type, recognising why an inline function can be typed differently after extraction or loss of context [Functions and generics]
- Control-flow analysis across reachability and assignments — understand how branches, early returns, assignments, and merged paths narrow or widen a variable at each program point [Narrowing and safe control flow]
- Callback parameter assignability — recognise that a function accepting fewer parameters can satisfy a callback contract with more parameters, while marking a callback parameter optional means the caller may genuinely omit it [Functions and generics]
- Contextual `void` return assignability — distinguish a callback context `() => void`, which may accept and discard a returned value, from a function explicitly declared `(): void`, which cannot return that value [Functions and generics]
