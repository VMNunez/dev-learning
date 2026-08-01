# Middle Coverage — Java

Concepts expected once core Java semantics are fluent and the developer must design maintainable concurrent and library-facing code.

## Language modelling and API design

- Sealed classes and interfaces — constrain a hierarchy so exhaustive domain modelling is explicit
- Record invariants and defensive copying — enforce valid immutable data in compact constructors when record components include mutable objects
- Pattern-matching switch and guarded cases — model exhaustive type-based decisions without turning domain design into procedural branching

## Generics and reflection

- Bounded wildcards and PECS — design producer/consumer APIs without unsafe casts or unnecessary invariance
- Generic type erasure — recognise runtime type limitations and the consequences for reflection and overloaded APIs
- Reflection and runtime annotations — inspect metadata deliberately while understanding lost compile-time safety and framework cost
- Meta-annotations and annotation processing — design annotation contracts and distinguish compile-time processors from runtime reflection or framework scanning

## Streams and collection design

- Primitive stream specialisations and numeric aggregation — use `IntStream`, `LongStream`, or `DoubleStream` when boxing would obscure a measured or API-relevant cost
- Downstream collectors and multi-level grouping — design `groupingBy`, partitioning, reduction, and map results whose types remain understandable to callers ✅ 07-timetrack
- Custom collection API contracts — expose mutability, ordering, null, ownership, and defensive-copy guarantees explicitly at service and library boundaries

## Concurrency foundations

- Thread safety and shared mutable state — identify races and prefer immutability or confinement before adding locks
- Executors and task submission — manage bounded worker pools rather than creating unmanaged threads
- `CompletableFuture` composition — combine asynchronous stages with explicit error handling and executor awareness
- Synchronisation primitives — choose `synchronized`, locks, and concurrent collections according to the protected invariant
