# Minimum Coverage — TypeScript

TypeScript as used in Angular — not a general TypeScript course.
Every concept must be explainable in the context of a real Angular file from one of the projects.

## Types
- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `void` — the building blocks; `void` is used for functions that return nothing
- `any` vs `unknown` — `any` disables type checking completely; `unknown` forces you to narrow the type before using it; interviewers ask why `any` is a code smell
- Union types: `string | number`, `'admin' | 'user'` — a value that can be one of several types; used for roles, status, and API responses
- Type inference — TypeScript guesses the type from the assigned value; you do not always need to declare it explicitly

## Interfaces and types
- `interface` vs `type` — both define a shape; `interface` is preferred for objects and models; `type` is needed for unions and computed types
- Optional properties: `name?: string` — the field is not required when creating the object; used in Angular models for nullable API fields
- Readonly properties — the value cannot be changed after the object is created; signals immutability in models and DTOs
- Extending interfaces — `interface AdminUser extends User` adds new fields to an existing shape; used in Angular models with inheritance

## Enums
- TypeScript enums — `enum Status { DRAFT = 'DRAFT', SUBMITTED = 'SUBMITTED' }` — used in Angular models that mirror Java enums from the backend
- String enums vs union types — `type Status = 'DRAFT' | 'SUBMITTED'` is often preferred in TypeScript because it generates less compiled code and is simpler to use; string enums are used when the values need to be iterable
- When you see enums in consultancy code — many existing Angular projects use enums for status, role, and type fields; you need to read and write both styles

## Generics
- `Array<T>`, `Observable<T>`, `Signal<T>` — reading generic types in Angular code; the `T` tells you what the container holds
- Writing a simple generic function or interface — when you want the same logic to work for different types without repeating the code
- Why generics exist — catch type errors at compile time; `Observable<User>` means you will always get a `User`, not `any`

## Utility types
- `Partial<T>` — all properties become optional; used in update request objects where not every field is required
- `Readonly<T>` — all properties become readonly; used to prevent accidental mutation
- `Pick<T, K>` — creates a new type with only the selected fields; used when you need a subset of a model
- `Omit<T, K>` — creates a new type without the excluded fields; used in create forms that do not include the `id`
- `Record<K, V>` — a key-value map type; `Record<string, number>` used for lookup maps and dictionaries in Angular services

## Narrowing and type guards
- `typeof` and `instanceof` — narrowing inside conditionals when a value could be one of several types
- Optional chaining `?.` — safely access a property that might be `null` or `undefined`; used constantly in Angular templates and services
- Nullish coalescing `??` — use the right side only when the left is `null` or `undefined`; safer than `||` which also triggers on `0` and `""`
- Non-null assertion `!` — tells TypeScript the value is not null; use only when you are certain; hides bugs if used carelessly
- Type assertion `as` — tells TypeScript "I know more than you"; used in Angular forms where the type cannot be inferred automatically

## Functions
- Arrow functions vs function declarations — arrow functions inherit `this` from the surrounding context; regular functions have their own `this`; matters in class methods
- Default parameters, rest parameters — reducing overloads and handling variable argument lists
- Return type annotations — makes the function's contract explicit; the compiler catches when the actual return does not match

## Decorators
- What a decorator is in Angular's context — `@Component`, `@Injectable`, `@Pipe` are decorators; they attach metadata to a class that Angular reads at runtime
- How TypeScript decorators work conceptually — a function that receives the class and can modify or annotate it; you use them everywhere but rarely write custom ones at junior level

## Modules
- `import` / `export` — named exports (multiple per file) vs default export (one per file); Angular uses named exports for components and services
- Barrel files (`index.ts`) — re-export from a folder's `index.ts` so callers import from the folder, not the specific file; you will see these in large consultancy projects
