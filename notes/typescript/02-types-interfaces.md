# Types and Interfaces

Official docs: https://www.typescriptlang.org/docs/handbook/2/objects.html

## Why TypeScript

TypeScript adds types to JavaScript — and you feel the difference immediately when you rename a field and the editor shows every file that breaks instead of finding out at runtime.

The core benefits:
- Errors are caught at compile time, not at runtime
- Better autocomplete and refactoring in the editor
- Code is self-documenting — you can read what a function expects without running it
- Required in Angular — every Angular project uses TypeScript

---

## Primitive types

```ts
const name: string = 'Victor';
const age: number = 31;
const active: boolean = true;
const nothing: null = null;
const notAssigned: undefined = undefined;
```

In practice, TypeScript infers types from assignment — you do not need to write them explicitly for primitives:

```ts
const name = 'Victor';  // TypeScript already knows this is a string
```

Write types explicitly when TypeScript cannot infer them — function parameters, return types, and complex structures.

---

## Arrays and objects

```ts
const ids: number[] = [1, 2, 3];
const names: string[] = ['Ana', 'Luis'];
const mixed: (string | number)[] = ['a', 1, 'b'];  // union type

const user: { name: string; age: number } = { name: 'Victor', age: 31 };
```

---

## interface

An interface defines the shape of an object. In Angular, this is your main tool for typing data models — every API response, form value, and service payload should have one.

```ts
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'employee' | 'manager';
  startDate?: string;  // optional — can be undefined
}
```

```ts
const employee: Employee = {
  id: 1,
  name: 'Victor',
  email: 'v@example.com',
  department: 'IT',
  role: 'admin',
};
```

Interfaces can extend other interfaces:

```ts
interface Person {
  name: string;
  email: string;
}

interface Employee extends Person {
  id: number;
  department: string;
}
```

---

## type alias

A type alias gives a name to any type — not just objects. This is what makes `type` more flexible than `interface`: you can alias primitives, unions, intersections, and tuples.

```ts
type Role = 'admin' | 'employee' | 'manager';  // union
type ID = string | number;                       // union of primitives
type Point = { x: number; y: number };           // object shape
```

---

## interface vs type — when to use each

| | interface | type |
|---|-----------|------|
| Object shapes | ✅ Preferred | ✅ Works |
| Union types | ❌ Cannot | ✅ Only option |
| Extendable | ✅ `extends` | ✅ `&` intersection |
| Merging declarations | ✅ Can merge | ❌ Cannot |

**Rule:** use `interface` for objects (especially when defining data models). Use `type` for unions, primitives, and complex compositions.

---

## Union types

A value that can be one of several types:

```ts
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;

function getEmployee(id: string | number) {
  // ...
}
```

---

## Intersection types

Combines multiple types into one — the value must satisfy all of them:

```ts
type Admin = Employee & { permissions: string[] };
```

---

## any, unknown, never

| Type | What it means | When to use |
|------|--------------|-------------|
| `any` | No type checking — opt out of TypeScript | Never if possible — defeats the purpose |
| `unknown` | Could be anything — must check type before using | API responses, external data |
| `never` | A value that never exists | Exhaustive checks, functions that always throw |

```ts
// unknown — safe: forces you to check before using
function process(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());  // only works after the check
  }
}

// any — unsafe: no checks needed, no protection
function process(value: any) {
  console.log(value.toUpperCase());  // TypeScript does not complain, but crashes at runtime if value is not a string
}
```

---

## Optional and readonly

```ts
interface Config {
  readonly apiUrl: string;   // cannot be changed after creation
  timeout?: number;          // optional — can be undefined
}
```

---

## Literal types

A type that is a specific value, not just a general type:

```ts
type Direction = 'left' | 'right' | 'up' | 'down';  // only these four strings
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500; // only these numbers

function move(direction: Direction) { ... }
move('left');    // ✅
move('diagonal'); // ❌ TypeScript error
```

Used in Angular for status fields, role fields, and any property with a fixed set of valid values.
