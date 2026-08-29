# TypeScript Junior Notes Plan

Plan status: stale
Coverage: notes/typescript/coverage/junior.md
Coverage SHA-256: 88c63060f0a96cbd47372672a1eba37d0d79ebf9c11809d9e9fb84d0f6d3d9ed
Generated: 2026-07-29

## 00 — TypeScript in the application stack

Status: pending
Action: create
English: notes/typescript/junior/en/00-typescript-in-the-application-stack.md
Spanish: notes/typescript/junior/es/00-typescript-en-el-stack-de-aplicacion.md
Depends on: none
Pending additions: none

Narrative role: Orient Victor from JavaScript to TypeScript by showing where static checking helps, where JavaScript still runs, and how the route builds the type-safety skills used in Angular work.

Learning outcome: Explain TypeScript's role in the Angular and Java backend stack, its compile-time/runtime boundary, and the reason for the order of the junior learning route.

Prerequisites: none.

Must answer:

- What is TypeScript, and how does its static overlay become ordinary emitted JavaScript?
- Which recurring characteristics of TypeScript shape the rest of the topic?
- Which JavaScript and React knowledge transfers directly, and where does TypeScript add a genuinely different compile-time layer?
- Which guarantees disappear when TypeScript emits JavaScript, and why can external data still be unsafe?
- How does TypeScript fit the Angular frontend, its boundary with a Java API, and Victor's target consultancy work?
- How can one paragraph map files 01 through 14 and explain why that order builds from values and contracts toward configuration and diagnostics?

Coverage concepts:

- TypeScript's compile-time boundary — type annotations are checked before execution and erased from emitted JavaScript, so typed external data still needs runtime validation

Rationale: The compile-time boundary is the mental model required to interpret every later type-system guarantee without mistaking it for runtime validation.

Handoff: Once the boundary is clear, file 01 establishes the everyday value types and annotations checked inside it.

## 01 — Values, inference, and absence

Status: pending
Action: audit
English: notes/typescript/junior/en/01-types-interfaces.md
Spanish: notes/typescript/junior/es/01-tipos-interfaces.md
Depends on: 00
Pending additions: none

Narrative role: Establish the vocabulary for annotating ordinary values and the special types that represent absence, ignored results, impossible paths, and unsafe boundaries.

Learning outcome: Choose and explain precise annotations for primitive values, nullish states, non-returning paths, broad object values, and unknown external input.

Prerequisites: 00.

Must answer:

- When should inference be trusted, and which public contracts should still be annotated?
- Why are `null`, `undefined`, `void`, and `never` four different ideas?
- Why are boxed primitives and broad object-like types poor substitutes for precise application shapes?
- What protection does `unknown` preserve that `any` removes?
- Which existing sections about arrays, object contracts, unions, intersections, literals, and object-property modifiers must move to files 02 and 03 so this chapter retains one value-foundations model?
- How can `never` be introduced here as an impossible path and linked forward to exhaustive handling in file 08 without teaching that later mechanism twice?

Coverage concepts:

- Type inference and explicit annotations — rely on clear local inference while annotating parameters, public contracts, and deliberately constrained return values
- Primitive value types — use `string`, `number`, and `boolean` without confusing primitive annotations with boxed object types
- `null` vs `undefined` — distinguish explicit nullish absence from a missing or uninitialised value under strict checking
- `void` vs `never` — distinguish a function result callers ignore from a control-flow path that cannot produce any value
- `object` vs `Object` vs `{}` — avoid broad object-like types whose assignability differs from the specific property shape an application contract needs
- `any` vs `unknown` — `any` disables checking while `unknown` requires narrowing before use, making `unknown` the safer boundary type

Rationale: These types answer the first question after the introduction: what kind of value can exist at a program point, and how honestly can the compiler describe it?

Handoff: With individual values understood, file 02 composes them into collections and alternative or combined shapes.

## 02 — Composing value shapes

Status: pending
Action: create
English: notes/typescript/junior/en/02-composing-value-shapes.md
Spanish: notes/typescript/junior/es/02-componer-formas-de-valores.md
Depends on: 01
Pending additions: none

Narrative role: Move from isolated value annotations to the structural rules and composition tools used to model application data.

Learning outcome: Model compatible object values, alternatives, combinations, closed literal sets, homogeneous arrays, and positional tuples while explaining their assignability.

Prerequisites: 01.

Must answer:

- Why can two independently declared objects be compatible in TypeScript?
- How does a union differ from an intersection both statically and at runtime?
- When does a literal widen, and why does that matter for closed value sets?
- When is a tuple clearer than an array, and when should positions become named fields?
- How do `T[]` and `Array<T>` express the same array relationship, and why is the generic syntax only previewed here before file 06 teaches it fully?
- Why can indexed array access produce `undefined` under stricter compiler settings, with the full project setting deferred to file 14?

Coverage concepts:

- Structural typing — compatibility depends on required members rather than declared names, which explains both convenient object assignment and accidental shape compatibility
- Union types — model a value that may have one of several types and narrow it before using member-specific operations
- Intersection types — require a value to satisfy all combined object contracts without confusing an intersection with a runtime merge
- Literal types and widening — preserve a finite set of allowed values instead of letting them widen to general `string`, `number`, or `boolean`
- Array types — express variable-length homogeneous collections with `T[]` or `Array<T>` and account for indexed elements
- Tuples — model a fixed sequence of positional element types and prefer named object fields when positions would obscure meaning

Rationale: All six concepts describe how simpler value types are assembled into useful application shapes before those shapes receive reusable names.

Handoff: File 03 gives those shapes durable contracts and explains the checks applied when objects are created and extended.

## 03 — Object contracts and assignability

Status: pending
Action: create
English: notes/typescript/junior/en/03-object-contracts-and-assignability.md
Spanish: notes/typescript/junior/es/03-contratos-de-objetos-y-asignabilidad.md
Depends on: 02
Pending additions: none

Narrative role: Turn composed shapes into reusable object contracts and explain the non-obvious assignability checks that appear at object-literal boundaries.

Learning outcome: Design and compare interfaces and type aliases with accurate optionality, readonly intent, extension behaviour, excess-property checks, and dynamic keys.

Prerequisites: 02.

Must answer:

- When do `interface` and `type` express the same object contract, and where do their capabilities diverge?
- Why is `property?: T` not the same contract as `property: T | undefined`?
- Why can an object literal fail an excess-property check while a variable with the same extra field passes?
- How can a fixed property contradict an index signature?
- Why is `readonly` a shallow compile-time restriction rather than runtime or deep immutability?

Coverage concepts:

- `interface` vs `type` — choose either for ordinary object shapes while recognising that aliases also express unions and intersections and interfaces support declaration merging
- Optional properties vs properties containing `undefined` — distinguish a property that may be absent from one that must exist but may hold `undefined`
- `readonly` properties — prevent reassignment through a type without assuming that the object is deeply immutable at runtime
- Interface extension vs type intersections — derive related shapes while recognising their different conflict and composition behaviour
- Excess property checks — understand why a fresh object literal can be rejected for extra fields even when a previously assigned variable is structurally compatible
- Index signatures — model dynamic property names whose values share a type and avoid fixed members that contradict the signature

Rationale: These features jointly define named object contracts and the rules TypeScript uses when application objects claim to satisfy them.

Handoff: File 04 connects erased shape contracts to classes, which also create real runtime constructor values.

## 04 — Classes as static and runtime contracts

Status: pending
Action: audit
English: notes/typescript/junior/en/04-access-modifiers.md
Spanish: notes/typescript/junior/es/04-modificadores-de-acceso.md
Depends on: 03
Pending additions: none

Narrative role: Show why classes sit on both sides of the compile-time/runtime boundary and how their contracts, inheritance choices, shorthand fields, and privacy mechanisms differ.

Learning outcome: Read and design a TypeScript class while explaining its instance type, runtime constructor, implemented or abstract contract, parameter properties, and real versus compile-time privacy.

Prerequisites: 03.

Must answer:

- What two declarations does a TypeScript class make available, and which one exists at runtime?
- What does `implements` check, and what does it not add to emitted JavaScript?
- When does an abstract class provide something an interface cannot?
- Why is TypeScript `private` different from an ECMAScript `#private` field?
- How does a parameter property expand into a field declaration and constructor assignment?
- How should the existing `readonly` material be scoped to class members and linked to files 03, 10, and 11 instead of re-teaching their object-contract and derived-type concerns?

Coverage concepts:

- Classes as types — recognise that a class declaration creates both a runtime constructor value and an instance type
- `implements` — check that a class instance satisfies a contract without assuming the interface changes the emitted class at runtime
- Abstract classes vs interfaces — recognise shared implementation plus an unconstructable base class versus an erased shape-only contract
- Parameter properties — read constructor parameters that declare and initialise class fields in one TypeScript shorthand
- TypeScript access modifiers vs ECMAScript `#private` fields — distinguish compile-time visibility from privacy that JavaScript enforces at runtime

Rationale: These concepts belong together because they explain the dual static/runtime nature of classes and the different mechanisms used to constrain their instances.

Handoff: Once data and class contracts are established, file 05 models the callable behaviour that operates on them.

## 05 — Function and callback contracts

Status: pending
Action: create
English: notes/typescript/junior/en/05-function-and-callback-contracts.md
Spanish: notes/typescript/junior/es/05-contratos-de-funciones-y-callbacks.md
Depends on: 04
Pending additions: none

Narrative role: Give functions first-class type contracts and resolve the callback, optionality, contextual typing, and overload rules that commonly surprise JavaScript developers.

Learning outcome: Type direct functions, callbacks, optional/default/rest parameters, overloads, and async results while predicting contextual inference and assignability.

Prerequisites: 04.

Must answer:

- How is a stored function type read, and where does an inline callback obtain its contextual types?
- Why may a callback ignore arguments even though marking those parameters optional changes the caller's contract?
- Why may a `() => void` callback return a discarded value while an explicitly `(): void` body cannot return it?
- When is a union clearer than overloads?
- What does `async` guarantee about the return container, and what does it not guarantee about rejection?
- How can `Promise<T>` be introduced as the result container needed for async typing while deferring the full generic-container mechanism to file 06?

Coverage concepts:

- Function parameter and return types — express callable contracts, including optional parameters and honest `undefined` results
- Function type syntax — type callbacks and stored functions by their parameter and return contracts
- Contextual typing — infer an inline callback's parameter and return types from the surrounding expected function type and recognise when extracting it removes that context
- Callback parameter assignability — allow a callback to ignore supplied arguments without marking those parameters optional, because an optional parameter means the caller may omit it
- Contextual `void` return assignability — allow a callback expected as `() => void` to return a value that the caller discards while distinguishing an explicitly declared `(): void` function body, which cannot return that value
- Optional parameters vs parameters containing `undefined` — distinguish a call that may omit an argument from one that must pass an argument whose value may be `undefined`
- Default parameters — allow omission at the call site while supplying a value inside the implementation
- Rest parameters — type a variadic remainder as an array without confusing it with a spread argument at the call site
- Function overloads — read multiple public call signatures with one compatible implementation and avoid using overloads where a union is clearer
- Async function typing — recognise that an `async` function returns `Promise<T>` and that the annotation does not prevent runtime rejection

Rationale: These are the interdependent rules that define who may call a function, what a callback implementation may ignore or return, and how the result is represented.

Handoff: File 06 generalises these contracts so relationships between input, container, key, and output types survive reuse.

## 06 — Generics and derived member types

Status: pending
Action: audit
English: notes/typescript/junior/en/06-generics.md
Spanish: notes/typescript/junior/es/06-genericos.md
Depends on: 05
Pending additions: none

Narrative role: Replace duplicated or `any`-based callable and container contracts with reusable relationships between types.

Learning outcome: Read and write generic containers, functions, and interfaces; predict inference; constrain capabilities; and derive key and property-value types without duplication.

Prerequisites: 05.

Must answer:

- What relationship does `T` preserve in `Array<T>`, `Promise<T>`, or a generic function?
- When can call-site inference determine a type argument, and when must it be supplied?
- Why should a constraint mention only capabilities the implementation actually uses?
- How do `keyof` and indexed access types keep property names and value types connected?
- How does type-level indexed access `T[K]` differ from reading `object[key]` at runtime?
- Why is `Observable<T>` only an Angular/RxJS preview here rather than assumed prior knowledge?
- How should the existing utility-type review become a link and one-sentence reminder to file 10 instead of duplicate teaching?

Coverage concepts:

- Generic containers — read `Array<T>`, `Promise<T>`, `Observable<T>`, and similar signatures as preserving the contained value type
- Generic functions and interfaces — relate input and output types without replacing that relationship with `any`
- Generic inference at call sites — let arguments determine a type parameter when possible and provide an explicit type argument when inference cannot express the intended contract
- Generic constraints — restrict a type parameter to the capabilities the implementation actually uses
- `keyof` — derive a union of valid property names from an existing object contract
- Indexed access types — obtain a property's value type from an existing object contract without duplicating it

Rationale: Each concept preserves or derives a type relationship across a reusable contract instead of copying shapes or escaping through `any`.

Handoff: Generic and union-based APIs often expose broad values; file 07 explains how control flow safely narrows them.

## 07 — Control-flow narrowing and runtime guards

Status: pending
Action: audit
English: notes/typescript/junior/en/07-type-narrowing.md
Spanish: notes/typescript/junior/es/07-estrechamiento-de-tipos.md
Depends on: 06
Pending additions: none

Narrative role: Connect real JavaScript runtime checks to TypeScript's changing knowledge of a value at each point in control flow.

Learning outcome: Trace narrowing through branches, returns, assignments, and merges while choosing runtime guards that match primitives, constructors, arrays, objects, properties, equality, and truthiness.

Prerequisites: 06.

Must answer:

- How do reachability, assignment, and merged branches change a variable's type?
- Which runtime evidence can `typeof`, `instanceof`, `Array.isArray`, `in`, and equality each provide?
- Why can `instanceof` narrow a class but not an erased interface?
- Which legitimate values does truthiness remove along with nullish absence?
- Why does `typeof null === "object"`, and what null/object/array guard sequence safely handles an `unknown` boundary value?
- Which existing sections on discriminated unions, custom predicates, and exhaustive `never` handling must move to file 08 so this chapter stays focused on primitive control-flow guards?

Coverage concepts:

- Control-flow analysis across reachability and assignments — trace how branches, early returns, assignments, and merged paths narrow or widen a variable at each program point
- `typeof` narrowing — narrow primitive unions while remembering the JavaScript edge case `typeof null === "object"`
- `instanceof` narrowing — narrow values created by runtime constructors without using it for erased interfaces
- Array and object guards — combine `Array.isArray`, null checks, and object checks before iterating or reading an `unknown` boundary value
- `in` narrowing — refine object unions by checking for a property that not every member declares
- Equality narrowing — use equality with a literal or another typed value to refine compatible union members
- Truthiness narrowing — recognise that `0`, `false`, and `""` are removed along with nullish values, so truthiness is unsafe when those values are valid

Rationale: These checks are all runtime facts that feed the same control-flow analysis mechanism, so they should be learned through one traceable narrowing model.

Handoff: File 08 builds reusable and exhaustive application-state modelling on top of these primitive guards.

## 08 — Safe union states and exhaustive handling

Status: pending
Action: create
English: notes/typescript/junior/en/08-safe-union-states.md
Spanish: notes/typescript/junior/es/08-estados-de-union-seguros.md
Depends on: 07
Pending additions: none

Narrative role: Turn local narrowing checks into maintainable state models, reusable predicates, exhaustive branches, and safe exception boundaries.

Learning outcome: Model mutually exclusive states, centralise valid runtime predicates, enforce exhaustiveness, and safely inspect unknown caught values.

Prerequisites: 07.

Must answer:

- Why does one shared literal discriminant prevent invalid combinations of state data?
- What runtime work must a user-defined type predicate perform for its compiler promise to remain honest?
- How does assigning an unhandled member to `never` make future union growth visible?
- Why must a caught value be narrowed before reading `message`?

Coverage concepts:

- Discriminated unions — model mutually exclusive states with a shared literal tag so each branch exposes only its valid data
- User-defined type predicates — centralise a reusable runtime check that teaches the compiler how a value narrows
- Exhaustiveness checks with `never` — make an unhandled union member a compile-time error when the union later grows
- `unknown` in `catch` — narrow a caught value before reading `message` because JavaScript can throw values that are not `Error` instances

Rationale: These patterns apply narrowing to complete application workflows and ensure every compiler claim is backed by a branch or runtime check.

Handoff: File 09 focuses that discipline on nullish values and the assertions that can bypass it.

## 09 — Null safety and assertion escape hatches

Status: pending
Action: create
English: notes/typescript/junior/en/09-null-safety-and-assertions.md
Spanish: notes/typescript/junior/es/09-seguridad-ante-nulos-y-aserciones.md
Depends on: 08
Pending additions: none

Narrative role: Consolidate strict null handling and contrast genuine proof with assertion syntax that only silences compiler checks.

Learning outcome: Handle nullish values under strict checking and explain the distinct risks of non-null, type, double, and definite-assignment assertions.

Prerequisites: 08.

Must answer:

- What changes when `strictNullChecks` is enabled?
- Which assertion removes nullish types from an expression, and which suppresses property initialization checking?
- Why does a type assertion neither convert nor validate a value?
- What design problem does `as unknown as T` usually hide?
- How is `strictNullChecks` introduced here as the rule governing null safety while its `tsconfig` placement and project-wide configuration remain a forward reference to file 14?

Coverage concepts:

- `strictNullChecks` — treat `null` and `undefined` as distinct types that must be handled before use
- Non-null assertions — remove `null` and `undefined` only from the static type without adding a runtime check, so misuse can still crash
- Type assertions — override the compiler's interpretation without converting or validating the runtime value
- Double assertions — recognise `as unknown as T` as an unsafe escape hatch that usually hides a broken boundary or conversion
- Definite-assignment assertions — understand that a property-level `!` suppresses initialization checking rather than proving a value will exist

Rationale: All five concepts concern the compiler's treatment of missing or unproven values and the places developers can weaken that protection.

Handoff: File 10 shows how to derive safer variations of trusted contracts without rewriting their fields.

## 10 — Utility and derived object types

Status: pending
Action: audit
English: notes/typescript/junior/en/10-typescript-utilities.md
Spanish: notes/typescript/junior/es/10-utilidades-de-typescript.md
Depends on: 09
Pending additions: none

Narrative role: Reuse established object contracts by deriving deliberate optional, required, selected, omitted, readonly, keyed, and non-nullish views.

Learning outcome: Choose and explain the standard utility type that preserves the intended relationship to a source model without overstating runtime or domain guarantees.

Prerequisites: 09.

Must answer:

- Why does `Partial<T>` change optionality but not validate a domain-correct patch?
- When is listing retained keys clearer than listing removed keys?
- Which forms of immutability and key existence do `Readonly<T>` and `Record<string, V>` fail to guarantee?
- What program logic must happen before `NonNullable<T>` is honest?
- When does an open index signature fit better than a finite-key `Record<K, V>`, and what existence guarantee does each provide?
- Which existing sections on assertions, optional fields, unions, non-null assertions, constructor shorthand, and classes must move to files 09, 03, 02, and 04 rather than remain duplicated here?
- If `??`, `||`, or `?.` remain as null-handling orientation, how can they stay minimal and point to file 09 instead of becoming unassigned duplicate chapters?

Coverage concepts:

- `Partial<T>` vs `Required<T>` — make every property optional or required without assuming `Partial<T>` validates a correct domain patch
- `Pick<T, K>` vs `Omit<T, K>` — derive a shape by retaining or removing selected keys while keeping the source model as the relationship
- `Readonly<T>` — make top-level properties readonly without mistaking the utility for deep immutability
- Index signatures vs `Record<K, V>` — choose an open dynamic-key contract or a mapped set of required finite keys while recognising that `Record<string, V>` cannot prove an arbitrary runtime key exists
- `NonNullable<T>` — remove `null` and `undefined` from a union only after program logic guarantees their absence

Rationale: These built-in generics derive common application contract variants while retaining a visible relationship to the original type.

Handoff: File 11 moves from transforming named contracts to preserving and checking the precise types inferred from real values.

## 11 — Literal preservation and contract checking

Status: pending
Action: audit
English: notes/typescript/junior/en/11-as-const.md
Spanish: notes/typescript/junior/es/11-como-constante.md
Depends on: 10
Pending additions: none

Narrative role: Resolve the tension between checking a value against a contract and preserving the exact literal information useful to later code.

Learning outcome: Choose among annotations, `satisfies`, assertions, `as const`, and type-position `typeof` while predicting the inferred type and runtime effect of each.

Prerequisites: 10.

Must answer:

- What literal and readonly changes does `as const` make, and why is it not runtime freezing?
- How does `satisfies` check a contract without replacing useful inferred information?
- Why is an assertion fundamentally weaker evidence than an annotation or `satisfies`?
- How does type-position `typeof` derive a type from a value without executing the runtime operator?
- Which existing `as const` and widening explanations remain useful scaffolding, and how must the audit add `satisfies` plus the direct annotation/assertion comparison?

Coverage concepts:

- `as const` — preserve literal values and apply readonly treatment without using it as runtime freezing
- `satisfies` — check that an expression conforms to a contract while retaining useful inferred literal and property information
- Annotation vs `satisfies` vs assertion — distinguish assigning a declared contract, checking conformance while preserving inference, and overriding the compiler without proof
- `typeof` in type positions — derive a type from an existing value without confusing it with the runtime `typeof` operator

Rationale: Each feature controls the relationship between an expression's actual inferred detail and the contract against which the compiler checks it.

Handoff: File 12 applies the same static-versus-runtime analysis to several competing closed-value-set designs.

## 12 — Enums and closed value sets

Status: pending
Action: audit
English: notes/typescript/junior/en/12-enums.md
Spanish: notes/typescript/junior/es/12-enumeraciones.md
Depends on: 11
Pending additions: none

Narrative role: Compare closed value-set techniques by making their emitted runtime values and derived static types explicit.

Learning outcome: Select a regular enum, string literal union, or `as const` object based on whether the application needs a runtime object, an erased type, or both.

Prerequisites: 11.

Must answer:

- What JavaScript does a regular enum emit?
- Why is a string enum not interchangeable with an erased literal union?
- How can an `as const` object provide both runtime values and a derived closed type?
- How can numeric enums illustrate runtime emission without turning `const enum` or iteration into unassigned junior scope?

Coverage concepts:

- Enum runtime behaviour — recognise that regular TypeScript enums emit runtime objects rather than existing only in the type system
- String enums vs literal unions — choose between a runtime enum object and an erased union of allowed values based on actual runtime needs
- `as const` objects vs enums vs literal unions — compare the runtime value and derived type each closed-value-set technique provides

Rationale: The three bullets form one design decision: which static and runtime artefacts each closed-value-set technique creates.

Handoff: File 13 follows emitted and erased symbols across file and package boundaries.

## 13 — Type modules and declarations

Status: pending
Action: create
English: notes/typescript/junior/en/13-type-modules-and-declarations.md
Spanish: notes/typescript/junior/es/13-modulos-de-tipos-y-declaraciones.md
Depends on: 12
Pending additions: none

Narrative role: Extend the compile-time/runtime boundary across source files, barrel exports, package resolution, and declaration-only library types.

Learning outcome: Trace an import specifier to its source or declaration file and explain which symbols produce runtime dependencies and which exist only for checking.

Prerequisites: 12.

Must answer:

- What convenience and dependency-boundary risks do barrel re-exports introduce?
- When should an import or export be marked type-only?
- How does module resolution connect an import specifier to a source or declaration file?
- What do `@types` packages add, and why can they never supply missing runtime code?
- How does a declaration file differ from a source module and from the JavaScript emitted for runtime execution?

Coverage concepts:

- Barrel re-exports — read `index.ts` aggregation in maintained TypeScript code while avoiding cycles and hidden dependency boundaries
- Type-only imports and exports — mark a dependency as type-only so the compiler and configured module emitter can handle it without treating the symbol as a runtime value
- Module resolution — understand that compiler settings map an import specifier to a source or declaration file and diagnose common unresolved-module errors
- Consuming type declarations and `@types` packages — recognise how JavaScript libraries acquire compile-time types and why declarations do not add runtime code, leaving declaration authoring to later levels

Rationale: These concepts explain how TypeScript discovers, checks, and emits dependencies at module and package boundaries.

Handoff: The final file makes the compiler settings controlling that discovery, checking, and emission explicit and teaches how to follow their diagnostics.

## 14 — Compiler projects, emission, and diagnostics

Status: pending
Action: create
English: notes/typescript/junior/en/14-compiler-projects-emission-and-diagnostics.md
Spanish: notes/typescript/junior/es/14-proyectos-emision-y-diagnosticos-del-compilador.md
Depends on: 13
Pending additions: none

Narrative role: Close the junior route by showing how a real project selects files, runtime assumptions, output modules, strict checks, and diagnostic workflows.

Learning outcome: Read a layered `tsconfig.json`, predict its checked files and emitted JavaScript environment, run type checking without emission, and resolve diagnostics at the contract that caused them.

Prerequisites: 13.

Must answer:

- How does `extends` combine shared compiler settings with project overrides?
- How do `files`, `include`, and `exclude` determine the compiler project?
- Why do `target`, `module`, and `lib` answer three different questions?
- What checks are enabled by the strict family and `noImplicitAny`?
- How does `tsc --noEmit` differ from a framework build, and how should a diagnostic chain be traced?

Coverage concepts:

- `tsconfig.json` inheritance — recognise how `extends` composes shared compiler configuration with project overrides
- Compiler file scope — understand how `files`, `include`, and `exclude` determine which source files a project checks
- `target` — choose which JavaScript language version the compiler emits without confusing it with available TypeScript syntax
- `module` — recognise which runtime module format or integration model the compiler emits
- `lib` — control which ambient runtime APIs are available to checking without installing their implementations
- Strict mode — treat the `strict` family as the baseline that enables stronger checks rather than compensating for weak types with assertions
- `noImplicitAny` — require unresolved parameter and member types to be made explicit instead of silently escaping checking
- Type-checking vs emitting — distinguish `tsc --noEmit` validation from generating JavaScript and recognise that a framework build may perform both
- Compiler diagnostics — trace an incompatibility through the reported source locations and related types, then fix the contract instead of suppressing the error

Rationale: These settings and workflows together define the boundaries and behaviour of the compiler project that enforces every preceding contract.

Handoff: This closes the junior journey: Victor can now follow a value from source inference through application contracts and runtime guards to module resolution, compiler emission, and diagnostics.

## Unassigned existing notes

- none
