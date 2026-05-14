# TypeScript — Future Learning Roadmap

Topics to study once the current 5 files are solid. Nothing here is needed for the first interview — needed to write more expressive, maintainable code and understand what you see in professional codebases.

---

## Phase 1 — After landing the first job

### Mapped types

Create new types by transforming every property of an existing type:

```ts
// Make every field readonly
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// Make every field a string (simplified example)
type Stringify<T> = { [K in keyof T]: string };
```

This is how the built-in utility types (`Partial`, `Required`, `Readonly`) are implemented internally. Once you understand mapped types, you can write your own utilities instead of reaching for `any`.

### Conditional types

Types that resolve differently depending on a condition:

```ts
type IsArray<T> = T extends any[] ? 'yes' : 'no';

type A = IsArray<string[]>;  // 'yes'
type B = IsArray<string>;    // 'no'
```

Used in advanced library types. You will see them in Angular and RxJS type definitions — understanding them helps you read what the IDE is telling you when types get complex.

### Advanced utility types

Beyond `Omit`, `Partial`, `Pick`, and `Record` — the ones you already know:

| Type | What it does |
|------|-------------|
| `Required<T>` | Makes all fields required (opposite of `Partial`) |
| `Readonly<T>` | Makes all fields readonly |
| `ReturnType<T>` | Extracts the return type of a function |
| `Parameters<T>` | Extracts the parameter types of a function as a tuple |
| `NonNullable<T>` | Removes `null` and `undefined` from a type |
| `Awaited<T>` | Unwraps the type inside a Promise |

```ts
async function getEmployee(): Promise<Employee> { ... }

type Result = Awaited<ReturnType<typeof getEmployee>>;  // Employee
```

### The `satisfies` operator (TypeScript 4.9+)

Validates that a value matches a type without widening the inferred type:

```ts
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

// palette.red is inferred as number[], not string | number[]
// satisfies checks the shape but keeps the specific type
```

More flexible than a type annotation — use it when you want validation without losing precision.

---

## Phase 2 — After 6–12 months

### Template literal types

Types built from string templates — TypeScript 4.1+:

```ts
type EventName = 'click' | 'focus' | 'blur';
type Handler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'
```

Used in advanced Angular patterns and in libraries that generate typed event names or CSS class names from string templates.

### `infer` — extracting types from other types

```ts
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnpackPromise<Promise<string>>;  // string
type B = UnpackPromise<number>;           // number
```

Used inside conditional types to extract a type from a generic. You will encounter it in RxJS and Angular source code.

### Declaration merging and module augmentation

TypeScript allows multiple declarations of the same interface to merge automatically:

```ts
// library declares:
interface Window { fetch: typeof fetch; }

// you add:
interface Window { myCustomProp: string; }

// TypeScript merges both — no error
```

Useful when you need to extend types from a library you do not control — for example, adding custom fields to Express's `Request` object.

### Custom decorators

Angular uses decorators extensively (`@Component`, `@Injectable`, `@Input`). Writing your own requires enabling `experimentalDecorators` in `tsconfig.json`. Custom decorators are useful for cross-cutting concerns — logging, validation, caching — where you want to add behaviour without modifying the function body.

---

## Phase 3 — Mid-level

### TypeScript project references and `tsc --build`

Splitting a large TypeScript project into multiple sub-projects that compile independently. Relevant in monorepo setups with multiple packages.

### Writing `.d.ts` declaration files

Type definitions for JavaScript libraries that do not ship with types. Only relevant if you are contributing to open source or maintaining an internal library without TypeScript source.

---

## What NOT to study prematurely

- **TypeScript compiler API** — programmatic access to the TypeScript compiler. Only relevant if you are building TypeScript plugins or tools. No application in Angular + Spring Boot development.
- **Type-level programming** — using TypeScript's type system as a Turing-complete language. An impressive academic exercise; no practical value at junior or mid level.
- **`namespace`** — the old module system before ES modules. You will see it in legacy code but should never write it in new code.
