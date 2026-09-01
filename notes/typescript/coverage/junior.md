# Junior Coverage — TypeScript

Concepts needed to read, write, debug, and review type-safe application code in a junior Angular role without confusing compile-time guarantees with runtime behaviour.

## Type-system foundations

- TypeScript's compile-time boundary — type annotations are checked before execution and erased from emitted JavaScript, so typed external data still needs runtime validation ✅ 04-meal-finder — `http.get<MealResponse>()` validates nothing, so the model declares `meals: Meal[] | null` and both subscribers normalise the value the endpoint really sends
- Type inference and explicit annotations — rely on clear local inference while annotating parameters, public contracts, and deliberately constrained return values ✅ 01-todo-list
- Primitive value types — use `string`, `number`, and `boolean` without confusing primitive annotations with boxed object types ✅ 01-todo-list
- `null` vs `undefined` — distinguish explicit nullish absence from a missing or uninitialised value under strict checking ✅ 06-hr-portal
- `void` vs `never` — distinguish a function result callers ignore from a control-flow path that cannot produce any value
- `object` vs `Object` vs `{}` — avoid broad object-like types whose assignability differs from the specific property shape an application contract needs
- `any` vs `unknown` — `any` disables checking while `unknown` requires narrowing before use, making `unknown` the safer boundary type ✅ 04-meal-finder — the `catchError` callback in `MealService` types the caught value `unknown` and only logs it, so nothing reads a property off it unnarrowed
- Structural typing — compatibility depends on required members rather than declared names, which explains both convenient object assignment and accidental shape compatibility
- Union types — model a value that may have one of several types and narrow it before using member-specific operations ✅ 01-todo-list
- Intersection types — require a value to satisfy all combined object contracts without confusing an intersection with a runtime merge
- Literal types and widening — preserve a finite set of allowed values instead of letting them widen to general `string`, `number`, or `boolean` ✅ 01-todo-list
- Array types — express variable-length homogeneous collections with `T[]` or `Array<T>` and account for indexed elements ✅ 01-todo-list
- Tuples — model a fixed sequence of positional element types and prefer named object fields when positions would obscure meaning

## Object contracts

- `interface` vs `type` — choose either for ordinary object shapes while recognising that aliases also express unions and intersections and interfaces support declaration merging ✅ 01-todo-list
- Optional properties vs properties containing `undefined` — distinguish a property that may be absent from one that must exist but may hold `undefined` ✅ 05-task-manager
- `readonly` properties — prevent reassignment through a type without assuming that the object is deeply immutable at runtime ✅ 02-weather-app — `WeatherService.baseUrl` is `private readonly`, fixed at declaration and unreachable from outside the class
- Interface extension vs type intersections — derive related shapes while recognising their different conflict and composition behaviour
- Excess property checks — understand why a fresh object literal can be rejected for extra fields even when a previously assigned variable is structurally compatible
- Index signatures — model dynamic property names whose values share a type and avoid fixed members that contradict the signature
- Classes as types — recognise that a class declaration creates both a runtime constructor value and an instance type
- `implements` — check that a class instance satisfies a contract without assuming the interface changes the emitted class at runtime ✅ 04-meal-finder
- Abstract classes vs interfaces — recognise shared implementation plus an unconstructable base class versus an erased shape-only contract
- Parameter properties — read constructor parameters that declare and initialise class fields in one TypeScript shorthand
- TypeScript access modifiers vs ECMAScript `#private` fields — distinguish compile-time visibility from privacy that JavaScript enforces at runtime

## Functions and generics

- Function parameter and return types — express callable contracts, including optional parameters and honest `undefined` results ✅ 01-todo-list
- Function type syntax — type callbacks and stored functions by their parameter and return contracts
- Contextual typing — infer an inline callback's parameter and return types from the surrounding expected function type and recognise when extracting it removes that context ✅ 01-todo-list
- Callback parameter assignability — allow a callback to ignore supplied arguments without marking those parameters optional, because an optional parameter means the caller may omit it
- Contextual `void` return assignability — allow a callback expected as `() => void` to return a value that the caller discards while distinguishing an explicitly declared `(): void` function body, which cannot return that value
- Optional parameters vs parameters containing `undefined` — distinguish a call that may omit an argument from one that must pass an argument whose value may be `undefined`
- Rest parameters — type a variadic remainder as an array without confusing it with a spread argument at the call site
- Function overloads — read multiple public call signatures with one compatible implementation and avoid using overloads where a union is clearer
- Generic containers — read `Array<T>`, `Promise<T>`, `Observable<T>`, and similar signatures as preserving the contained value type ✅ 01-todo-list
- Generic functions and interfaces — relate input and output types without replacing that relationship with `any`
- Generic inference at call sites — let arguments determine a type parameter when possible and provide an explicit type argument when inference cannot express the intended contract ✅ 02-weather-app
- Generic constraints — restrict a type parameter to the capabilities the implementation actually uses
- `keyof` — derive a union of valid property names from an existing object contract
- Indexed access types — obtain a property's value type from an existing object contract without duplicating it
- Async function typing — recognise that an `async` function returns `Promise<T>` and that the annotation does not prevent runtime rejection

## Narrowing and safe control flow

- Control-flow analysis across reachability and assignments — trace how branches, early returns, assignments, and merged paths narrow or widen a variable at each program point
- `typeof` narrowing — narrow primitive unions while remembering the JavaScript edge case `typeof null === "object"`
- `instanceof` narrowing — narrow values created by runtime constructors without using it for erased interfaces
- Array and object guards — combine `Array.isArray`, null checks, and object checks before iterating or reading an `unknown` boundary value ✅ 03-expense-tracker — `Array.isArray` rejects a well-formed `{"a":1}` before it reaches the `Transaction[]` signal
- `in` narrowing — refine object unions by checking for a property that not every member declares
- Equality narrowing — use equality with a literal or another typed value to refine compatible union members ✅ 03-expense-tracker — `type === ''` refines the select's control to `'income' | 'expense'` before the transaction is emitted
- Truthiness narrowing — recognise that `0`, `false`, and `""` are removed along with nullish values, so truthiness is unsafe when those values are valid
- Discriminated unions — model mutually exclusive states with a shared literal tag so each branch exposes only its valid data
- User-defined type predicates — centralise a reusable runtime check that teaches the compiler how a value narrows
- Exhaustiveness checks with `never` — make an unhandled union member a compile-time error when the union later grows ✅ 01-todo-list — the `filteredTasks` switch covers all three `Filter` members with no `default`, so adding a fourth stops compiling
- `unknown` in `catch` — narrow a caught value before reading `message` because JavaScript can throw values that are not `Error` instances

## Null safety and assertions

- `strictNullChecks` — treat `null` and `undefined` as distinct types that must be handled before use ✅ 04-meal-finder — the nullable `MealResponse.meals` stops compiling at every consumer until each one handles the absent case
- Non-null assertions — remove `null` and `undefined` only from the static type without adding a runtime check, so misuse can still crash ✅ 02-weather-app
- Type assertions — override the compiler's interpretation without converting or validating the runtime value ✅ 05-task-manager
- Double assertions — recognise `as unknown as T` as an unsafe escape hatch that usually hides a broken boundary or conversion ✅ 06-hr-portal
- Definite-assignment assertions — understand that a property-level `!` suppresses initialization checking rather than proving a value will exist ✅ 05-task-manager

## Utility and derived types

- `Partial<T>` vs `Required<T>` — make every property optional or required without assuming `Partial<T>` validates a correct domain patch
- `Omit<T, K>` — derive a shape by removing selected keys so the source model stays the single definition of the fields that remain ✅ 03-expense-tracker
- `Pick<T, K>` — derive a shape by retaining only selected keys when the required subset is smaller than what removing the rest would express
- `Readonly<T>` — make top-level properties readonly without mistaking the utility for deep immutability
- Index signatures vs `Record<K, V>` — choose an open dynamic-key contract or a mapped set of required finite keys while recognising that `Record<string, V>` cannot prove an arbitrary runtime key exists
- `NonNullable<T>` — remove `null` and `undefined` from a union only after program logic guarantees their absence

## Literal preservation and contract checking

- `as const` — preserve literal values and apply readonly treatment without using it as runtime freezing
- `satisfies` — check that an expression conforms to a contract while retaining useful inferred literal and property information
- Annotation vs `satisfies` vs assertion — distinguish assigning a declared contract, checking conformance while preserving inference, and overriding the compiler without proof ✅ 03-expense-tracker — the transaction form declares each control's own type instead of asserting `form.value as NewTransaction` at the emit
- `typeof` in type positions — derive a type from an existing value without confusing it with the runtime `typeof` operator
- Enum runtime behaviour — recognise that regular TypeScript enums emit runtime objects rather than existing only in the type system
- String enums vs literal unions — choose between a runtime enum object and an erased union of allowed values based on actual runtime needs
- `as const` objects vs enums vs literal unions — compare the runtime value and derived type each closed-value-set technique provides

## Type modules and declarations

- Barrel re-exports — read `index.ts` aggregation in maintained TypeScript code while avoiding cycles and hidden dependency boundaries
- Type-only imports and exports — mark a dependency as type-only so the compiler and configured module emitter can handle it without treating the symbol as a runtime value ✅ 01-todo-list
- Module resolution — understand that compiler settings map an import specifier to a source or declaration file and diagnose common unresolved-module errors
- Consuming type declarations and `@types` packages — recognise how JavaScript libraries acquire compile-time types and why declarations do not add runtime code, leaving declaration authoring to later levels

## Compiler configuration and diagnostics

- `tsconfig.json` inheritance — recognise how `extends` composes shared compiler configuration with project overrides
- Compiler file scope — understand how `files`, `include`, and `exclude` determine which source files a project checks
- `target` — choose which JavaScript language version the compiler emits without confusing it with available TypeScript syntax
- `module` — recognise which runtime module format or integration model the compiler emits
- `lib` — control which ambient runtime APIs are available to checking without installing their implementations
- Strict mode — treat the `strict` family as the baseline that enables stronger checks rather than compensating for weak types with assertions
- `noImplicitAny` — require unresolved parameter and member types to be made explicit instead of silently escaping checking
- Type-checking vs emitting — distinguish `tsc --noEmit` validation from generating JavaScript and recognise that a framework build may perform both
- Compiler diagnostics — trace an incompatibility through the reported source locations and related types, then fix the contract instead of suppressing the error
