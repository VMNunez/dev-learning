# Enums

## What is an enum?

An enum (enumeration) is a set of named constants. Instead of using magic strings or numbers scattered across the code, you define them once with a meaningful name.

```ts
// Without enum — magic strings everywhere
if (employee.status === 'active') { ... }
if (employee.status === 'actve') { ... }  // typo — no error from TypeScript

// With enum — TypeScript catches typos
enum EmployeeStatus {
  Active = 'active',
  Inactive = 'inactive',
  OnLeave = 'on-leave',
}

if (employee.status === EmployeeStatus.Active) { ... }
```

---

## Numeric enums

By default, enum values are numbers starting from 0:

```ts
enum Direction {
  Up,     // 0
  Down,   // 1
  Left,   // 2
  Right,  // 3
}

Direction.Up    // 0
Direction[0]    // 'Up'  — reverse mapping (numeric enums only)
```

You can set a custom starting number:

```ts
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}
```

---

## String enums

String enums are more useful in practice — the values are readable in logs, APIs, and databases:

```ts
enum Role {
  Admin = 'admin',
  Employee = 'employee',
  Manager = 'manager',
}

enum LeaveStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}
```

```ts
const user = { name: 'Victor', role: Role.Admin };
console.log(user.role);  // 'admin' — readable string, not a number
```

---

## const enum

`const enum` is inlined at compile time — the enum is removed from the output and replaced with the raw values. Smaller bundle, but you lose the ability to iterate the enum at runtime.

```ts
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
}

// Compiled output: if (direction === 'UP') — the enum reference is replaced
```

Use `const enum` for values that never need to be iterated. Use a regular `enum` when you need `Object.values(MyEnum)`.

---

## Enum vs union type

Both can restrict a field to a set of values:

```ts
// Union type — simpler
type Status = 'pending' | 'approved' | 'rejected';

// Enum — more structured
enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}
```

| | Union type | Enum |
|---|-----------|------|
| Syntax | Shorter | More verbose |
| Refactoring | Change the string everywhere | Change in one place |
| Iteration | Need to define an array separately | `Object.values(Status)` works |
| Common in Angular | Yes — for simple cases | Yes — for shared, reused constants |

**Rule:** use a union type for simple local cases. Use an enum when the values are shared across multiple files, used in APIs, or need to be iterated.

---

## Iterating an enum

```ts
enum Role {
  Admin = 'admin',
  Employee = 'employee',
  Manager = 'manager',
}

// Get all values as an array — useful for building select options
const roles = Object.values(Role);
// ['admin', 'employee', 'manager']
```

In Angular this is useful for building `<mat-option>` lists from an enum without hardcoding the values in the template.

---

## In Angular

```ts
// model
export enum EmployeeStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface Employee {
  id: number;
  name: string;
  status: EmployeeStatus;
}

// component
import { EmployeeStatus } from '../models/employee.model';

// make enum available in the template
protected readonly EmployeeStatus = EmployeeStatus;
```

```html
@if (employee.status === EmployeeStatus.Active) {
  <span class="badge badge--active">Active</span>
}
```

To use an enum in an Angular template, you need to expose it as a class property — templates cannot access imported enums directly.
