# Middle Coverage — TypeScript

Concepts expected when a developer designs reusable type-safe APIs instead of only consuming application models.

## Type transformation

- Mapped types — derive related object shapes while preserving or deliberately changing modifiers
- Conditional types — select a type from an assignability condition without creating unreadable type-level programs
- `infer` in conditional types — extract a component type from another type's structure
- Template literal types — model constrained string protocols and event names from existing unions
- Advanced utility-type composition — combine standard utilities without erasing required domain invariants
- `Exclude<T, U>` and `Extract<T, U>` — filter union members by assignability when designing reusable derived contracts
- `ReturnType<T>` and `Parameters<T>` — derive callable contracts without manually duplicating function signatures
- Assertion functions — design `asserts` signatures whose runtime failure and compile-time narrowing remain aligned
- Generic parameter defaults — provide ergonomic reusable APIs without hiding an important type choice

## API and project boundaries

- Declaration merging and module augmentation — extend compatible library types without silently changing unrelated global contracts
- `const enum` trade-offs — evaluate inlining against isolated compilation, library publication, and tooling compatibility
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — adopt stricter project-wide semantics and manage the migration cost across an application
- Custom decorator typing — preserve constructor, method, and metadata types when a framework requires decorators
- Project references and `tsc --build` — split large repositories into incremental type-checking boundaries
- Declaration files — describe untyped JavaScript libraries and publish stable public TypeScript APIs
