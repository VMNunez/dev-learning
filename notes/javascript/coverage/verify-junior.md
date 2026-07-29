# Coverage Verify — JavaScript Junior

Verdict: gaps
Coverage SHA-256: f35c45403ce8ccef5fec4b063dc34e112730b407ebffac9186ff04e231d3085c
Verified: 2026-07-29

## Open gaps

- `+` operator: numeric addition vs string concatenation — predict coercion and left-to-right evaluation when either operand becomes a string instead of assuming arithmetic [Runtime values, types, and conversion]
- Logical operators return operand values — predict that `&&`, `||`, and `??` yield one of their operands rather than a coerced boolean while still short-circuiting evaluation [Runtime values, types, and conversion]
- `slice` vs `splice` on arrays — choose non-mutating range extraction or in-place removal, replacement, and insertion without confusing their return values or mutation effects [Arrays and iteration]
- `new` and constructor-function mechanics — recognise how `new` creates an object, links its prototype, binds `this`, and handles an explicit object return when reading class or legacy constructor code [Objects, prototypes, and copying]
- Promise executor timing — predict that the executor passed to `new Promise` runs synchronously while settlement reactions registered with `then`, `catch`, or `finally` run as microtasks [Asynchronous JavaScript]
