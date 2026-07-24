# Middle Coverage — TypeScript

Concepts expected when a developer designs reusable type-safe APIs instead of only consuming application models.

## Type transformation

- Mapped types — derive related object shapes while preserving or deliberately changing modifiers
- Conditional types — select a type from an assignability condition without creating unreadable type-level programs
- `infer` in conditional types — extract a component type from another type's structure
- Template literal types — model constrained string protocols and event names from existing unions
- Advanced utility-type composition — combine standard utilities without erasing required domain invariants

## API and project boundaries

- `satisfies` — validate a value against a contract while retaining its narrower inferred type
- Declaration merging and module augmentation — extend compatible library types without silently changing unrelated global contracts
- Custom decorator typing — preserve constructor, method, and metadata types when a framework requires decorators
- Project references and `tsc --build` — split large repositories into incremental type-checking boundaries
- Declaration files — describe untyped JavaScript libraries and publish stable public TypeScript APIs
