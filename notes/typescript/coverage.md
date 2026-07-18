# Minimum Coverage — TypeScript

TypeScript as used in Angular and Spring Boot full-stack projects. Every item must be explainable with a real example from one of the projects. Interviewers test whether you understand why a feature exists and what the gotchas are, not just whether you can write the syntax.

## Types

- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `void` — the building blocks; interviewers ask what `void` means for function return types and the difference between `null` (explicit absence) and `undefined` (not yet assigned)
- Type inference — TypeScript guesses the type from the assigned value; interviewers ask when you still need to declare the type explicitly (function parameters, complex structures, return types that are not obvious)
- `any` vs `unknown` — `any` disables type checking completely; `unknown` forces you to check the type before using it; interviewers ask why `any` is a code smell and when `unknown` is the right choice (external API responses, user input)
- `never` — the type for values that can never exist; used in exhaustive switch checks and functions that always throw; shows you understand the type system beyond everyday usage
- Union types: `string | number`, `'admin' | 'user'` — a value that can be one of several types; used constantly for roles, status fields, and nullable signals (`Employee | null`)
- Intersection types: `Employee & { permissions: string[] }` — the result must satisfy all combined types; the `type` equivalent of `interface extends`; interviewers ask the difference between intersection and extension
- Literal types: `type Direction = 'left' | 'right'` — restricts a field to specific constant values; interviewers ask the difference between `string` and `'admin' | 'user'` (the literal type catches typos at compile time)
- Tuple types `[string, number]` — a fixed-length array where each position has its own type; interviewers ask when a tuple beats an object (rarely — an object names its fields, a tuple only positions them)

## Structural typing and assignability

- Structural typing ("duck typing") — TypeScript decides compatibility by shape, not by declared name, so any object with the right fields satisfies an interface it never declared; interviewers contrast it with Java's nominal typing and ask whether a class is assignable to an interface without `implements` (it is)
- Excess property checking — a fresh object literal errors on unknown extra properties, but the same object assigned through an intermediate variable does not; the canonical "why does this compile here and not there?" screening puzzle
- The assignability ladder of `any`, `unknown` and `never` — `any` flows in both directions, `unknown` accepts everything but is assignable to nothing without narrowing, `never` is assignable to everything and accepts nothing; interviewers ask you to place all three relative to each other
- `{}`, `object` and `Function` as types — `{}` accepts any non-null value including numbers and strings, and `Function` gives no call-signature safety; interviewers use `{}` to test whether you read it as "empty object"
- Branded / nominal typing — because typing is structural, `EmployeeId` and `ProjectId` declared as plain `number` are freely interchangeable; interviewers ask what structural typing costs you and how you would stop two ids being swapped

## Interfaces and type aliases

- `interface` vs `type` — both define an object shape; `interface` is preferred for data models (supports `extends` and declaration merging); `type` is required for unions, intersections, and computed types; tested in every TypeScript screening
- Optional properties: `name?: string` — the field can be `undefined`; interviewers ask how this affects form validation (optional fields do not need `Validators.required`) and how `name?: string` differs from `name: string | undefined`
- `readonly` properties — the value cannot be changed after the object is created; interviewers ask the difference between `readonly` (property constraint) and `const` (variable constraint)
- Extending interfaces: `interface AdminUser extends User` — adds new fields to an existing shape; interviewers contrast this with the `&` intersection approach on type aliases
- Declaration merging — two `interface User` declarations in the same scope merge into a single type, while two `type User` aliases are a duplicate-identifier error; this is the concrete mechanism behind the "interface for models" preference, not a style opinion
- Interfaces are open, type aliases are closed — a consumer can augment a third-party interface but never a type alias; interviewers ask when that openness is a feature and when it is a hazard in your own domain models

## Enums

- TypeScript enums: `enum Status { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED' }` — used in Angular models that mirror Java backend enums; interviewers ask how to expose an enum in a template (must be assigned to a class property — templates cannot access imports directly)
- `const enum` vs regular `enum` — `const enum` is erased at compile time and inlined as raw values (smaller bundle, no runtime object); regular `enum` keeps the runtime object and supports `Object.values()`; interviewers ask which to use when you need to iterate the values
- String enums vs union types — both restrict a field to a set of values; union types (`type Status = 'DRAFT' | 'SUBMITTED'`) generate less compiled code; string enums are used when values need to be iterated with `Object.values()`; a common confusable pair in Angular interviews
- Numeric enum reverse mapping — `enum Status { DRAFT, SUBMITTED }` compiles to an object holding both directions, so `Status[0] === 'DRAFT'` and `Object.keys(Status)` returns twice the entries you expect; the classic "what does this print?" trap that string enums do not have
- A numeric enum in an API contract — the compiled numeric value does not match the string the backend actually sends in JSON, which is why a DTO field mirroring a Java enum must be a string enum or a string union; interviewers ask what arrives on the wire

## Generics

- `Array<T>`, `Observable<T>`, `Signal<T>` — generics appear everywhere in Angular; the `T` tells you what the container holds; interviewers ask you to read a type signature out loud and explain what it means
- Writing a generic function or interface — `function getFirst<T>(arr: T[]): T` — write the logic once and it works for any type while remaining type-safe; tested when discussing reusable utility functions in services
- Generic constraints: `function findById<T extends { id: number }>(items: T[], id: number)` — restricts which types are allowed; interviewers ask why constraints exist and what error TypeScript gives when the constraint is not met
- Why generics exist — `http.get<Employee[]>('/api/employees')` means you get `Employee[]`, not `any`; type errors are caught at compile time, not at runtime; interviewers ask why calling `http.get()` without a type parameter is a problem
- `keyof` — produces a union of an object type's property names as string literals (`keyof Employee` is `'id' | 'name' | 'email' | ...`); interviewers ask how built-in utility types like `Pick<T, K extends keyof T>` use it to restrict `K` to only real property names of `T`, instead of accepting any string
- Inference vs an explicit type argument — `http.get('/api/employees')` infers `Object` because there is no value argument to infer from, while `http.get<Employee[]>(...)` states it; interviewers ask where TypeScript's inference gets its information and when you are forced to supply the argument yourself
- Default type parameters: `interface Box<T = string>` — the type used when the caller omits the argument; interviewers ask what `T` is in a call that passes no type
- When *not* to write a generic — a type parameter used at exactly one call site with one concrete type is indirection with no payoff; interviewers probe whether you reach for generics reflexively or because a real contract varies

## Utility types

- `Partial<T>` vs `Required<T>` — `Partial` makes all properties optional (used in update/PATCH request objects); `Required` makes all properties required (the opposite); interviewers ask which fits a PATCH endpoint vs a POST endpoint
- `Readonly<T>` — all properties become readonly; prevents accidental mutation; used to signal immutability in DTOs and config objects passed around the app
- `Pick<T, K>` vs `Omit<T, K>` — `Pick` keeps only the named fields; `Omit` removes the named fields; the most commonly confused utility pair; `Omit<Employee, 'id'>` is the canonical create-form pattern where the id is generated by the backend
- `Record<K, V>` — a typed key-value map; `Record<string, number>` used for lookup tables and dictionaries in services; interviewers ask when to use `Record` vs a plain interface or a `Map`
- Index signature `{ [key: string]: T }` vs `Record<string, T>` — both describe an object with dynamic keys of the same value type; `Record` is the shorthand utility type and the more common choice in application code; interviewers ask why both exist (index signatures predate `Record` and are still needed when mixing dynamic keys with some fixed known properties in the same interface)
- Deriving a type instead of hand-writing it — building the create-DTO as `Omit<Employee, 'id'>` so one edit to `Employee` propagates everywhere; interviewers ask why this beats declaring a second independent interface that will silently drift
- The `typeof` type operator on a value — `typeof CONFIG` reuses a constant's already-inferred type instead of declaring a parallel interface beside it; interviewers ask where a type should come from when the value is the source of truth

## Narrowing and type guards

- `typeof` narrowing — works for primitive types (`'string'`, `'number'`, `'boolean'`); the classic gotcha: `typeof null === 'object'` — always check `=== null` separately when a value could be null
- `instanceof` narrowing — works for class instances; used in catch blocks with custom error classes; interviewers ask when to use `typeof` vs `instanceof` (primitives vs class instances)
- `in` narrowing — checks if a property exists on an object; used to distinguish between two interfaces in a union when the types share some but not all properties
- Truthiness narrowing — a simple `if (value)` check narrows out `null` and `undefined`; gotcha: `0`, `false`, and `''` are also falsy — use `!= null` explicitly when those are valid values you want to keep
- Discriminated unions — a shared property with a unique literal value (`status: 'loading' | 'success' | 'error'`) lets TypeScript narrow automatically inside a switch; the standard pattern for async states in Angular; interviewers ask how this differs from a plain union
- Custom type guards: `user is Employee` — a function whose return type is a type predicate; tells TypeScript to narrow the type if the function returns `true`; tested when discussing services that work with complex union types
- Exhaustiveness check with `never` — assign an unhandled switch case to `never` in the default branch; TypeScript errors if a new union variant is added without a handler; shows understanding of the type system beyond everyday patterns
- Narrowing is lost inside a callback — a value narrowed to non-null widens back to the full union inside a closure, because the compiler cannot prove when the callback will run; interviewers show the "why is it possibly null again?" snippet that every Angular developer hits
- Narrowing is invalidated by an intervening call — a mutable property narrowed by an `if` re-widens after any method call, since that call could have reassigned it; the reason the fix is to copy the value into a `const` first
- `const` narrowing holds, `let` narrowing does not — control-flow analysis runs top-down and a `let` reassigned in a branch re-widens; interviewers show a snippet and ask what the IDE hover reports at each line
- A discriminated union needs a literal discriminant — if the tag field is typed `string` instead of `'loading' | 'success' | 'error'`, the switch narrows nothing and every branch keeps the full union; interviewers ask why an apparently correct discriminated union is not narrowing
- `.filter(Boolean)` does not narrow — the result stays `(T | null)[]` unless the predicate is declared as a type guard (`(x): x is T => x != null`); interviewers ask why the type did not change after the filter

## Null safety and type assertions

- `?.` optional chaining — stops evaluation and returns `undefined` if the left side is `null` or `undefined`; used constantly in Angular templates with nullable signals; interviewers ask when to prefer `?.` over `!` (when you are not 100% certain the value exists)
- `??` vs `||` — `??` returns the right side only when the left is `null` or `undefined`; `||` also triggers on `0`, `false`, and `''`; always use `??` when `0` or empty string is a valid value you want to keep
- `!` non-null assertion — removes `null` and `undefined` from the type without any runtime check; if the value is actually null, you get a runtime crash with no TypeScript warning; interviewers ask why `?.` is usually safer
- `as` type assertion — tells TypeScript "I know the type better than you"; does not validate or convert the data; used in Angular forms where the compiler cannot infer the exact type; gotcha: a wrong assertion fails silently at runtime
- `as unknown as T` double assertion — used when two types have no overlap and TypeScript refuses a direct `as` cast; `formValue.startDate as unknown as Date` is the pattern from `MatDatepicker`; interviewers ask why it goes through `unknown` (every type is assignable to and from `unknown`)
- Definite assignment assertion `name!: string` on a class property — distinct from the `!` operator on an expression; it promises the compiler that something outside the constructor assigns the field, which is why it appears on `@Input()` and `@ViewChild` fields; interviewers ask who is responsible for keeping that promise
- `// @ts-ignore` vs `// @ts-expect-error` — both suppress the next line's error, but `@ts-expect-error` itself errors once the line stops failing, so it cannot rot silently in the codebase; interviewers ask which belongs in a real project and why

## Classes and access modifiers

- `public`, `private`, `protected`, `readonly` — `private` restricts access to the same class; `protected` also allows subclasses; `readonly` is about immutability, not visibility; interviewers ask the difference between `private` and `protected` and when to use each
- `private` vs `readonly` — confusable pair: `private` controls who can access the property; `readonly` controls whether it can be reassigned; both can be combined (`private readonly`) and often are for injected dependencies
- Constructor shorthand — `constructor(private http: HttpClient) {}` declares, creates, and assigns a class property in one step; the standard DI pattern in older Angular code; you must read it instantly when reviewing existing codebases
- Classes as types — a TypeScript class can be used as a type without a separate interface; the `CanDeactivateFn<MyComponent>` pattern relies on this; interviewers may show this pattern and ask what type the component parameter has
- `private` is compile-time only — unlike Java's `private`, the field is a plain property in the emitted JavaScript and is reachable at runtime; interviewers with a Java background use this to test whether you know what TypeScript actually enforces (the `#name` syntax is the real runtime-private one)
- `implements` — forces a class to satisfy an interface's shape without inheriting anything; interviewers ask how you enforce a contract on a class when there is no base class to extend

## `as const`

- Type widening problem — TypeScript widens object property types by default: `{ mode: 'edit' }` infers `{ mode: string }` not `{ mode: 'edit' }`, even with `const`; `const` only prevents reassigning the variable, not mutating properties; interviewers ask why `const` alone is not enough
- `as const` on objects — makes all properties `readonly` and infers literal types instead of widened ones; used for nav config objects and shared constants; interviewers ask what two things `as const` does (readonly + literal type inference)
- `as const` on arrays — turns an array into a `readonly` tuple with exact element types; without it TypeScript only knows `string[]` and loses the actual values; with it TypeScript knows each exact element
- Widening of a `let` binding — `let mode = 'edit'` infers `string` while `const mode = 'edit'` keeps `'edit'`; interviewers ask why passing the `let` variable into a parameter typed `'edit' | 'view'` fails when the inline string compiles

## Arrow functions and functions

- Arrow functions vs function declarations — arrow functions inherit `this` from the surrounding scope; function declarations have their own `this`; matters when writing callbacks inside Angular class methods where you need to access `this`
- Default parameters, rest parameters — reduce function overloads; `...args: string[]` collects remaining arguments into an array; common in Angular utility functions and service methods
- Return type annotations — make the function's contract explicit; the compiler catches when the actual return does not match the declared type; interviewers ask when TypeScript can infer the return type and when you must declare it
- `void` vs `undefined` as a return type — a callback typed `() => void` accepts an implementation that returns a value (the return is simply ignored), which is why `arr.forEach(x => this.list.push(x))` compiles; interviewers use it to test whether you know `void` is a contextual contract, not a strict one
- Optional parameter vs a parameter typed `| undefined` — `f(a?: string)` lets the caller omit the argument entirely, `f(a: string | undefined)` forces them to pass `undefined` explicitly; the call-signature twin of the `name?: string` property gotcha
- An `async` method always returns `Promise<T>` — declaring the return as `T` is a compile error and declaring it `Promise<any>` throws away the contract; a routine review finding in Angular services
- Function overload signatures — several declarations sitting over one implementation, where the implementation signature itself is not callable; interviewers ask when overloads beat a single union parameter

## Modules and decorators

- `import` / `export` — named exports (multiple per file) vs default export (one per file); Angular uses named exports for components and services; interviewers ask why Angular avoids default exports (named exports keep the name fixed at the source, making refactoring safer)
- Barrel files (`index.ts`) — re-export multiple symbols from a folder so callers import from the folder path, not individual files; common in large consultancy Angular projects in shared module folders; you will encounter these when reading existing code
- What a decorator is in Angular's context — `@Component`, `@Injectable`, `@Pipe` attach metadata to a class that Angular reads at startup; without the decorator, Angular does not know the class is a component
- How TypeScript decorators work conceptually — a function that receives the class and can modify or annotate it; you use them everywhere in Angular but rarely write custom ones at junior level; interviewers test that you know they are functions, not language keywords
- `import type` — marks an import as type-only so it is erased from the emitted JavaScript instead of surviving as a real runtime import; interviewers ask what problem it solves (accidental side-effect imports and circular dependencies between model files)

## Types at runtime

- Type erasure — every type, interface, generic parameter and `as` cast disappears at compile time and the emitted JavaScript contains none of it; interviewers show a snippet and ask what the compiled JS looks like
- An interface cannot be used with `instanceof` — the check needs a value that exists at runtime, and only a class survives compilation; interviewers ask why `error instanceof MyError` works but `x instanceof Employee` fails when `Employee` is an interface
- Nothing type-checks at runtime — `typeof` and `instanceof` inspect JavaScript values, not TypeScript types, so verifying that an HTTP response really matches `Employee` requires a type guard or a validator you write yourself
- What a generic compiles to — `function first<T>(a: T[]): T` emits a plain untyped JavaScript function, which is why you cannot write `new T()` or `T[]`; interviewers with a Java background ask how this compares to Java's own erasure
- A compile error does not stop the emit — `tsc` still writes JavaScript unless `noEmitOnError` is set; interviewers ask whether a red squiggle in the IDE means the app will not run

## Strict mode

- `strict: true` — an umbrella flag switching on a whole family of checks (`strictNullChecks`, `noImplicitAny`, `strictPropertyInitialization`, `strictFunctionTypes`, `useUnknownInCatchVariables` and more); interviewers ask you to name at least three of them
- `strictNullChecks` — with it off, `null` and `undefined` are assignable to every type, which makes a `user: User` annotation prove nothing and `?.` look redundant; interviewers ask what this single flag changes about the type `string`
- `noImplicitAny` — an un-annotated parameter silently becomes `any` and disables checking through the whole function body; interviewers ask why an untyped callback parameter is a hole in an otherwise typed codebase
- `strictPropertyInitialization` — a class field declared but never assigned in the constructor becomes an error, which is why Angular component fields carry `!`; interviewers ask which of the three responses (`!`, `| undefined`, a default value) is the honest one
- `useUnknownInCatchVariables` — the flag that makes `catch (e)` produce `unknown` rather than `any`; interviewers ask what forced the narrowing habit into your error handling
- `noUncheckedIndexedAccess` — makes `arr[0]` and `record[key]` return `T | undefined`, surfacing the commonest runtime crash at compile time; interviewers ask why array indexing is unsound by default and why this flag is off even inside `strict`
- `noUnusedLocals` — errors on a declared-but-unused variable; opt-in separately from `strict` and routinely mistaken for part of it, which is why a build can fail over something `strict: true` never checks
- `noUnusedParameters` — the same check applied to function parameters, with the leading-underscore convention as the documented escape hatch for a parameter you must declare but cannot use
- `noImplicitReturns` — errors when only some code paths of a function return a value; interviewers ask what the return type of a function with a missing `return` in one branch actually is
- `noFallthroughCasesInSwitch` — errors on a `case` that runs into the next without `break` or `return`; recognised as the compiler catching a bug class that a discriminated-union switch otherwise hides
- Turning `strictNullChecks` on in an existing codebase — every possibly-absent value errors at once, so the migration is per-file rather than a blanket `!` sweep; a realistic consultancy question about inheriting a legacy Angular project

## Reading compiler errors

- `TS2322: Type 'X' is not assignable to type 'Y'` — the commonest TypeScript error; interviewers ask which side is the source and which the target (`'X'` is what you assigned, `'Y'` is what was declared)
- `TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'` — the call-site twin of TS2322; the distinction matters because the fix lives in the argument you passed rather than the variable you declared
- Reading the `Types of property 'x' are incompatible` cascade — a long TS2322 message nests deeper with each line and the real mismatch sits at the *last* line, not the first; interviewers paste a wall of error text and watch where you look
- `TS2339: Property 'x' does not exist on type 'Y'` — the compiler knows only the declared shape; interviewers ask the three real causes (a typo, a field missing from the interface, a value narrowed to the wrong union member) and why `as any` is not a fix
- `TS2339` on a union type — the property exists on only some members, so the fix is narrowing rather than asserting; the canonical trigger for reaching for a discriminated union
- `TS18048: 'x' is possibly 'undefined'` (and `TS18047` for `null`) — the strict-null errors an Angular developer hits daily; interviewers ask which of `?.`, `??`, an early `if` guard and `!` are real fixes and which merely silences the compiler
- `TS7006: Parameter 'x' implicitly has an 'any' type` — the flagship `noImplicitAny` error on untyped callback parameters; interviewers ask why it does *not* appear for a callback passed to a typed API (contextual typing infers the parameter)
- `TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'X'` — indexing an object with a plain `string` variable; the two correct fixes are a `keyof X` typed key or an index signature, not `(obj as any)[key]`
- `TS2564: Property 'x' has no initializer and is not definitely assigned in the constructor` — the `strictPropertyInitialization` error on `@Input()` and `@ViewChild` fields; interviewers ask what you would do about it
- `TS2307: Cannot find module 'x' or its corresponding type declarations` — interviewers ask you to distinguish a package that is genuinely not installed from one installed but shipping no types
- `TS2769: No overload matches this call` — the error shape produced by overloaded APIs like `HttpClient.get` and `FormBuilder.group`; interviewers ask why the message lists several candidates and which block actually matters

## The compiler and tsconfig

- `tsconfig.json` — the file telling `tsc` which files belong to the project and under which rules; a file matched by neither `include` nor `files` is still opened by the editor but never type-checked by the build, which is why "the build ignores my error" happens
- `target` — the JavaScript version the compiler emits; lowering it downlevels `async/await`, classes and optional chaining into helper code, which is why bundle size and browser support hang off this one line
- `module` — the format the compiler emits `import` statements in (`ESNext`, `CommonJS`); interviewers ask why the same source file produces `import` in one build and `require` in another
- `moduleResolution` — the algorithm the compiler uses to locate an import on disk (`node`, `bundler`, `node16`); the commonest cause of a "Cannot find module" error that is not a missing package; interviewers ask why the package is installed and the import still fails
- `lib` — which built-in type declarations are available; interviewers ask why `document` is unknown in a Node project, or why a method the runtime clearly supports still errors
- `paths` and `baseUrl` — path aliases that let you import `@app/shared/...` instead of a trail of `../../../`; the gotcha is that the alias must be configured for the bundler too, or the editor looks fine while the build fails
- `skipLibCheck` — skips type-checking the `.d.ts` files of dependencies; interviewers ask why nearly every real project enables it and what you give up
- `extends` in a tsconfig — a config inherits a base file and overrides only what it changes, which is how `tsconfig.app.json` and `tsconfig.spec.json` sit on top of the root config in every Angular project; interviewers ask why tests compile under a different configuration from the app
- `sourceMap` — maps the running JavaScript back to your original TypeScript so breakpoints and stack traces point at source; interviewers ask how you debug TypeScript in a browser that only runs JavaScript
- The editor's TypeScript version vs the project's — the IDE may run its own bundled compiler while the build uses the one in `node_modules`, which is how an error appears only in CI or only in the editor

## Third-party types and declarations

- `.d.ts` declaration files — files carrying types only and emitting no JavaScript; interviewers ask where the types for a plain-JavaScript library actually live
- `@types/*` packages and DefinitelyTyped — types published separately from the library itself; interviewers ask why installing a package can still leave you with "could not find a declaration file" and what you install to fix it
- Bundled types vs `@types` — a modern library ships its own declarations via `types` in its `package.json`, so no companion package is needed; interviewers ask how you tell which route a given dependency takes
- `declare module` — the pragmatic way to type or silence an untyped import when no `@types` package exists; the alternative to scattering `any` at the boundary
- `declare global` — how a value injected by the build (a global constant, an added `window` property) gets a type; interviewers ask where the type for something that no import produced comes from

## Typing the API boundary

- `http.get<Employee[]>()` is a claim, not a check — the generic only labels the response and no validation runs, so a renamed backend field yields `undefined` at runtime with a completely green build; the canonical full-stack junior question
- Runtime validation at the boundary — a hand-written type guard or a schema validator is the only thing that makes the declared type true for data you did not construct; interviewers ask where in the app that check belongs
- Hand-written interfaces mirroring backend DTOs drift silently — nothing links the TypeScript interface to the Java DTO, so a backend rename compiles fine on the frontend; interviewers ask how you keep the two contracts in sync and what the failure actually looks like
- JSON has no date type — a Spring Boot `LocalDate` arrives as a string, so a response interface declaring `startDate: Date` is a lie that compiles; interviewers ask where the conversion belongs
- `field?: string` vs `field: string | null` across the wire — an absent key and an explicit JSON `null` are different payloads, and interviewers test that you do not treat them as interchangeable when mirroring a nullable backend column
- Separate request and response types — modelling `CreateEmployeeRequest` without `id` apart from `Employee`; interviewers ask what goes wrong when one interface serves both directions (optional-field creep until nothing is guaranteed)
- `JSON.parse()` returns `any` — the parsed value is unknown at compile time, so assigning it straight into a typed variable silently disables checking; the safe move is `unknown` followed by narrowing

## Modelling domain state and errors

- Modelling async state as a discriminated union — `loading | success | error` as one union instead of three parallel `data` / `loading` / `error` fields; interviewers ask why the union makes impossible states unrepresentable
- Optional-flag soup vs a union — four independent `isDraft` / `isSubmitted` / `approvedBy?` style fields allow sixteen combinations of which only four are legal; interviewers ask you to re-model an existing flags-based type and say how many states you removed
- Narrowing a caught error — under strict mode `catch (e)` types `e` as `unknown`, so reading `e.message` fails with `'e' is of type 'unknown'` until you narrow with `instanceof Error`; interviewers ask why `catch (e: any)` is the wrong habit
- You cannot type what a function throws — TypeScript has no checked exceptions, so a `throw` is invisible in the signature and the caller learns nothing from the types; interviewers ask how a caller is supposed to know what can go wrong
- Returning a result union instead of throwing — `{ ok: true, data } | { ok: false, error }` as an alternative to an exception a component must remember to catch; interviewers ask the tradeoff for a service method
- Typing the API's error body — the payload inside an `HttpErrorResponse` is a real backend contract, not `any`; interviewers ask how you would declare and narrow it
