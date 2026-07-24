# Middle Coverage — Java

Concepts expected once core Java semantics are fluent and the developer must design maintainable concurrent and library-facing code.

## Modern language modelling

- Records — model immutable data carriers and understand generated equality, accessors, and constructor constraints
- Sealed classes and interfaces — constrain a hierarchy so exhaustive domain modelling is explicit
- Pattern matching — use modern `instanceof` and switch patterns without hiding unclear domain boundaries

## Generics and reflection

- Bounded wildcards and PECS — design producer/consumer APIs without unsafe casts or unnecessary invariance
- Generic type erasure — recognise runtime type limitations and the consequences for reflection and overloaded APIs
- Reflection and runtime annotations — inspect metadata deliberately while understanding lost compile-time safety and framework cost

## Concurrency foundations

- Thread safety and shared mutable state — identify races and prefer immutability or confinement before adding locks
- Executors and task submission — manage bounded worker pools rather than creating unmanaged threads
- `CompletableFuture` composition — combine asynchronous stages with explicit error handling and executor awareness
- Synchronisation primitives — choose `synchronized`, locks, and concurrent collections according to the protected invariant
