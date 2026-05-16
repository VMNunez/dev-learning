# `as const` — Const Assertions

Official docs: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions

Here is the problem: TypeScript infers the widest possible type by default. When you write `const mode = 'edit'`, you would expect TypeScript to know it is the string `'edit'` — but for object properties, it gives you `string` instead. `as const` fixes that.

---

## The type widening problem

```ts
// Primitive constant — TypeScript infers the literal correctly
const mode = 'edit';
// type: 'edit'  ✅ TypeScript knows the exact value

// Object property — TypeScript widens to string
const config = { mode: 'edit' };
// type: { mode: string }  ❌ TypeScript lost the exact value
```

Why does this happen? TypeScript assumes object properties might be changed after creation. Since `config.mode = 'view'` is valid JavaScript, TypeScript gives it the wide `string` type. Even though you used `const`, the `const` only prevents reassigning `config` — it does not prevent mutating `config.mode`.

---

## `as const` fixes the widening

```ts
const config = { mode: 'edit' } as const;
// type: { readonly mode: 'edit' }  ✅ TypeScript keeps the literal

const ROUTES = {
  home: '/home',
  employees: '/employees',
  departments: '/departments',
} as const;
// type: { readonly home: '/home'; readonly employees: '/employees'; ... }
```

Two things happen with `as const`:
1. Every property becomes `readonly` — TypeScript prevents mutation
2. Every value becomes a literal type — `'edit'` instead of `string`

---

## Why the literal type matters

Without `as const`, you cannot use an object property as a discriminant in a union type:

```ts
type Mode = 'view' | 'edit';

const config = { mode: 'edit' };
// config.mode is string — not assignable to Mode

const config = { mode: 'edit' } as const;
// config.mode is 'edit' — assignable to Mode ✅
```

This matters whenever you pass a value to a function or parameter that expects a specific literal.

---

## `as const` on arrays

```ts
const STATUSES = ['pending', 'approved', 'rejected'] as const;
// type: readonly ['pending', 'approved', 'rejected']
// TypeScript knows the exact elements and their positions

// Without as const:
const STATUSES = ['pending', 'approved', 'rejected'];
// type: string[]  — TypeScript only knows "array of strings"
```

With `as const`, the array becomes a **readonly tuple** — TypeScript knows every element's exact type and value.

---

## In Angular

The most common use in Angular is for configuration objects that should never change:

```ts
// Navigation items — values should never be modified at runtime
export const NAV_ITEMS = [
  { label: 'Employees', route: '/employees', icon: 'people' },
  { label: 'Departments', route: '/departments', icon: 'business' },
] as const;
```

Without `as const`, the `route` field is typed as `string`, so TypeScript cannot catch if you accidentally pass a wrong value to `routerLink`. With `as const`, it is `'/employees'` — a literal.

---

## `as const` vs `Object.freeze`

| | `as const` | `Object.freeze` |
|---|---|---|
| Compile-time protection | ✅ TypeScript error if you try to mutate | ❌ No effect on types |
| Runtime protection | ❌ No effect — still mutable at runtime | ✅ Throws in strict mode |
| Use case | Type safety — telling TypeScript the shape | Runtime safety — preventing mutation |

In practice, `as const` is what you use in TypeScript projects. `Object.freeze` is for runtime environments where mutation must be prevented regardless of TypeScript.

---

## Quick rule

Use `as const` when:
- You have a configuration object whose properties should never change
- You need TypeScript to infer literal types from an object or array
- You are defining a set of constants shared across files (and do not want an enum)
